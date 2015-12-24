//The following items will be modified durring Site Installer.
//----------------Do Not Remove the following items:----------------
//----------------Do Not Remove the following items:----------------
var g_HostURL = "EpicorWebAccess.html";
var rptHighPriorityInterval = 5000;
var rptHighPriorityInterval = 5000;
var rptHighPriorityDuration = 60000;
var rptLowPriorityInterval = 30000;
//------------------------------------------------------------------

//------------------------------------------------------------------
var gIsSSLForLogin = false;
var gIsSmartClientEnable = true;


if (g_HostURL.indexOf("://") < 0)
	g_HostURL = window.location.href.substring(0, window.location.href.toLowerCase().indexOf(g_HostURL.toLowerCase())) + g_HostURL;

var gVantageIDCookie = "VantageID";
var gVantagePwdCookie = "VantagePassword";
//var gVantageSessionInfoCookie = "VantageSessionInfo";
//var gSessionInfo = {UserID: getCookie(gVantageIDCookie)};  //FrameWork.js is refrence userid before the gSessionInfo is set.

var gSuppressSoapError = false;
var gError = null;
var ERR_SOAP = -1;

var rptTimeOut = 1000 * 60 * 30;    // 30 minutes

function doVantageSoapCall(webservice, action, reqNames, outParams, reqValues, callContextData, numberOfRecursiveCalls)
{
	//Return Types we are interested in
	//1 = Void
	//2 = Boolean
	//3 = XMLDocument
	//4 = Scalar (Treat Everything else as a Scalar)
    //String,Int32,Int64,Decimal,GUID,DateTime, etc
    
    var origAction=action;

    gSoapErrorFlag = false;
	gError = null;
	
    var iRetType = parseInt(action.substring(action.indexOf("(")+1,action.indexOf(")")));
    
    action = action.substring(0,action.indexOf("("));

	// TODO
	var isProcessReport = false;

    var strSoapURL;
    if (gIsSSLForLogin && webservice == "lib_LogOnService")
    {
        //strSoapURL = "https://jfrisellaw2k3/W2WVantageServices_test" +"/"+webservice+".asmx";
        strSoapURL = g_HostURL.replace("syslogind96b.html", "syslogind96b.html") + "/" + webservice+".asmx";
    }
    else
        strSoapURL = g_HostURL +"/"+webservice+".asmx";

    if (webservice.toLowerCase() == "lib_logonservice")
    {
        try
        {
            var queryString = top.window.location.search.toLowerCase();
            if (queryString.indexOf("licensetype=") > 0)
            {
                var licenseType = queryString.substring(queryString.indexOf("licensetype="));
                strSoapURL += "?" + licenseType;
            }
        }catch(err){}
    }
    
    var oXMLHttp = new XMLHttpRequest();

    if ((action.toLowerCase() == "submittoagent" || action.toLowerCase() == "rundirect") && webservice.substring(0,4).toLowerCase() =="rpt_") {
        if ((reqValues[0].indexOf('\"AutoAction\":\"WPreview\"') > 0) || (reqValues[0].indexOf('\"AutoAction\":\"SSRSPreview\"') > 0))
        {    
            isProcessReport = true; 
        } 
    }
    
    var oReqXML = getVNSOAPEnvelope(action, webservice, reqValues, reqNames, callContextData);
	try
	{
	    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"); 
	    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect UniversalBrowserAccess'); 
    } 
    catch(err) 
    {
       // alert(err);
    }
     try
     { 
		do 
		{
			var isReprocess = false;
		    oXMLHttp.open("POST.html", strSoapURL, false);
            try { oXMLHttp.responseType = 'msxml-document'; } catch(e){}
	    	
		    oXMLHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		    oXMLHttp.setRequestHeader("SOAPAction", "http://epicor.com/webservices/" + action);
		    
		    try
		    {
		        var _debug = DebugHelper.Enter("WebService: " + webservice, action, "");
		        oXMLHttp.send(oReqXML);
		        DebugHelper.Leave(_debug);
		    }
		    catch(e)
		    {
		        if(e.number == -2146697211)
		        {
		            alert("Invalid web-service url. Error:" + e.message);
		            oXMLHttp = null;
		            return;
		        }
				else
				{
					if(e.code == 101)
					{
						if(numberOfRecursiveCalls == null) { numberOfRecursiveCalls = 0; }
						oXMLHttp = null;

						if(numberOfRecursiveCalls >= 2)
						{
							alert("Unable to connect." + " " + e.message);
							return;
						}
						return doVantageSoapCall(webservice, origAction, reqNames, outParams, reqValues, callContextData, ++numberOfRecursiveCalls);
					}
				}
		    }
		    
		    var soapResult = oXMLHttp.responseXML;
            var parseErr = Sarissa.getParseErrorText(soapResult);
           
		    //soapResult.setProperty("SelectionNamespaces", "xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:e='http://epicor.com/webservices/'");
		    Sarissa.setXpathNamespaces(soapResult, "xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:e1='http://epicor.com/webservices/'");
		    soapResult.setProperty("SelectionLanguage", "XPath");
		    
		    var isActiveServerSession = true;
		    if (action == "IsThereAnActiveSession") {
		        var xmlReturn = soapResult.selectSingleNode("soap:Envelope/soap:Body/e1:" + action + "Response");
		        var oNode = xmlReturn.selectSingleNode("e1:" + action + "Result");
		        if (oNode != null) {
		            isActiveServerSession = getSOAPType(oNode, iRetType);
		        }
		    }
            
		    if (oXMLHttp.status != 200 || parseErr != Sarissa.PARSED_OK || !isActiveServerSession)
            {
		        gError = new ErrorObject(ERR_SOAP);
		        var faultNode = soapResult.selectSingleNode("soap:Envelope/soap:Body/soap:Fault/faultstring");
	            
	            if (faultNode != null || !isActiveServerSession) {
	                var faultText = "";
	                if (isActiveServerSession && faultNode != null)
	                    faultText = Sarissa.getText(faultNode, true);
	                
	                if (!isActiveServerSession || (oXMLHttp.status == 500 && faultText.indexOf('[100]') >= 0)) {
	                    //Invalid session, need to log in Vantage
	                    //Check to see if the ID and Password are stored in the cookie
	                    var userID = getCookie(gVantageIDCookie);
	                    var userPwd = getCookie(gVantagePwdCookie);
	                    var isLogIn = true;

	                    if (webservice.toLowerCase() == "lib_SessionService" && action.toLowerCase().indexOf("dologoff") == 0)
	                        isLogIn = false;
	                    else if (userID != "" && userPwd != "") {
	                        //silence login			
	                        try {
	                            //lib_LogOnService.prototype.LogIn(userID, userPwd);
	                            doVantageSoapCall('lib_LogOnService', 'LogIn(1)', ['userID', 'password'], [], [userID, userPwd]);
	                            isReprocess = true;
	                            isLogIn = false;
	                        }
	                        catch (err) {
	                        }
	                    }

	                    if (isLogIn) {	//Open Login Dialog

	                        var result;	                        
	                        var loginForm = "sysLogin.aspx";
                            var queryString = top.window.location.search.toLowerCase();
                            if (queryString.indexOf("licensetype=") > 0)
                            {
                                var licenseType = queryString.substring(queryString.indexOf("licensetype="));
                                loginForm += "?" + licenseType;
                            }
                            else if (queryString == null || queryString == "")
                                loginForm += "?IsFirstLogIn";

                            
	                        if (BrowserSniffer.FireFox15) {
	                            sFeatures = "height=165,width=524,toolbar=no,menubar=no,scrollbars=no,scroll=no,status=no,help=no,resizable=yes,modal=yes";

	                            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");

	                            var win = Global.window.open(loginForm, "_blank", sFeatures);
	                            result = win.returnValue;
	                        }
	                        else if (BrowserSniffer.Safari13) {
	                            sFeatures = "dialogHeight:130px; dialogWidth:532px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";

	                            result = window.showModalDialog(loginForm, null, sFeatures);
	                        }
	                        else //if(BrowserSniffer.IE)
	                        {
	                            sFeatures = "dialogHeight:125px; dialogWidth:532px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
	                            result = showModalDialog(loginForm, null, sFeatures);
	                        }

	                        if (result == true || (gIsSSLForLogin && getCookie("LoginReturn") == "true")) {
	                            isReprocess = true;
	                        }
	                        else {
	                            oXMLHttp = null;
	                            return;
	                            //throw getBusinessObjectException(soapResult, action);
	                        }
	                    }
	                }
					else if (oXMLHttp.status == 500 && 
						faultText.indexOf('[101.') >= 0)
					{
						//expire password, need to prompt to change the password
						//Check to see if the ID and Password are stored in the cookie
						
						var msgBoxButton = MessageBoxButtons.YesNo;
						
						if (faultText.indexOf('[101.0]') >= 0)
						    msgBoxButton = MessageBoxButtons.OK;
						    						
						var errorMsg = faultText.substring(faultText.indexOf("[101.") + 7);
						
						if (errorMsg .indexOf("at Epicor.Mfg.WS.Framework") > 0)
						    errorMsg = errorMsg .substring(0, errorMsg .indexOf("at Epicor.Mfg.WS.Framework") -4 );
						    
                        var retVal = MessageBox.Show(errorMsg, "Change Password", msgBoxButton, new EpiOverloadedArgs("String_String_MessageBoxButtons"));
                                               
                        if (retVal == DialogResult.Yes || retVal == DialogResult.OK)
                        {                                               
                            var dlgArg = new Object();
                            dlgArg.UserID = reqValues[0];     
                            Global.DialogArguments = dlgArg;           
           
                            var sysChangePassword = "SysChangePassword.aspx";
                            if(BrowserSniffer.FireFox15)
							{
								sFeatures = "height=195,width=524,toolbar=no,menubar=no,scrollbars=no,scroll=no,status=no,help=no,resizable=yes,modal=yes";								
								netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite"); 									
								var win = Global.window.open(sysChangePassword, "_blank", sFeatures);
								result = true;
							}
							else if(BrowserSniffer.Safari13)
							{
								sFeatures = "dialogHeight:160px; dialogWidth:532px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";								
								result = window.showModalDialog(sysChangePassword, dlgArg, sFeatures);
							}
							else //if(BrowserSniffer.IE)
							{   
                                sFeatures = "dialogHeight:150px; dialogWidth:532px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
                                result = showModalDialog(sysChangePassword, dlgArg, sFeatures);
							}
                        }                
						var isReprocess = false;
				    }					
					else
					{
    		            oXMLHttp = null;
						throw getBusinessObjectException(soapResult, action);
					}
	            }
	            else
	            {
	                gError.Message = oXMLHttp.responseText;
	                if(!gSuppressSoapError)
	                    alert(oXMLHttp.responseText);
	            }
	            
	            if (!isReprocess)
	            {   	  
		            oXMLHttp = null;
					return null;
			    }
		    }
    	}
		while (isReprocess);
		
	    //We Have A Valid Response
	    var xmlReturn = soapResult.selectSingleNode("soap:Envelope/soap:Body/e1:" + action + "Response");
    	
    	/*
    	//Check and stored SessionInfo into a cookie
    	var sessionInfo = soapResult.selectSingleNode("soap:Envelope/soap:Header/e1:SessionInfoHeader/e1:SessionInfo");
    	if ((sessionInfo != null && Sarissa.getText(sessionInfo, true).indexOf('\"SetOnLogin\": \"True\",') > 0) || getCookie(gVantageSessionInfoCookie)=="")
    	{ 
		    saveCookie(gVantageSessionInfoCookie, getSOAPType(sessionInfo, 4));
		    saveCookie(gVantageIDCookie, gSessionInfo.UserID);
    	}
    	
    	try     
    	{
    	    if (gSessionInfo.CompanyID == undefined )
    	        gSessionInfo = (JSON.parse( getCookie(gVantageSessionInfoCookie) )).SessionInfo;
    	        
    	    if (getCookie(gVantageIDCookie) != gSessionInfo.UserID)
		        saveCookie(gVantageIDCookie, gSessionInfo.UserID);
    	        
        }
        catch(err) {}

	    if(Global.Form && Global.Form.Session)
	    {
	        Global.Form.Session.CompanyID = gSessionInfo.CompanyID;
	    }
    	    
    	*/
    	
    	var ccData=CallContextExtractor.Extract(xmlReturn);
    	if(ccData!=null)
    	{
    	    try
    	    {
    	        return doVantageSoapCall(webservice, origAction, reqNames, outParams, reqValues, ccData);
    	    }
    	    catch(err)
    	    {
    	        if(err instanceof BusinessObjectException) 
    	            throw err;
                else 
                    ExceptionBox.Show(err,new EpiOverloadedArgs("Exception"));
                
    	    }
    	}

        if(Global&&Global.PageInfo&&action!="GetGroupByHeaderInfo") Global.PageInfo.CacheInfo=CacheInfoExtractor.Extract(xmlReturn);

    	//Check and process the report
        startRptMonitor(isProcessReport);            
            
	    //Handle case Of No Out Parameters First
	    if(outParams.length == 0)
	    {
	        var oNode = xmlReturn.selectSingleNode("e1:" + action+"Result");
		    if(oNode != null) 
		    {
	            oXMLHttp = null;
			    return getSOAPType(oNode,iRetType);
			}
		    else
		    {
		        oXMLHttp = null;
		        return oNode ; 
		    }  
    	    
	    }
    	
	    //Has Out Parameters
	    var result = new Array();
	    if(iRetType > 1)
	    {
	        //Has Return Value
	        var oNode = xmlReturn.selectSingleNode("e1:" + action+"Result");
		    if(oNode != null) {
			    result.push(getSOAPType(oNode,iRetType));
		    }
		    else
			    result.push(oNode);
	    }

	    //Get the Out Parameters
	    var iNumOutParams = outParams.length;
	    for (var j=0;j<iNumOutParams;j++)
	    {
		    //Get Out Parameter
		    var szParam = outParams[j];
		    //Get Out Parameter Return Type
		    var iParamRetType = parseInt(szParam.substring(szParam.indexOf("(")+1,szParam.indexOf(")")));
		    szParam = szParam.substring(0,szParam.indexOf("("));
		    // Get The Out Parameter
		    var oNode = xmlReturn.selectSingleNode("e1:" + szParam);
		    //alert(Sarissa.serialize(oNode));
		    if(oNode != null)
			    result.push(getSOAPType(oNode,iParamRetType));
		    else
			    //Null
			    result.push(oNode);
	    }

        oXMLHttp = null;

        if(action=="GetGroupByHeaderInfo"&&result.length>0&&result[0]=="") result[0]="{}";
        return result;
    }
    catch(err)
    {    
        if(err instanceof BusinessObjectException) throw err;
    
        gError = new ErrorObject(ERR_SOAP);
        gError.Message = err.description;
        if (!gSuppressSoapError)
            alert(err.description);
            
        oXMLHttp = null;
    }
	
}
function setGlobalStruct()
{
    
}

function getVNSOAPEnvelope(action, webservice,reqValues, reqNames, callContextData)
{
	var soapEnvelopeDoc = Sarissa.getDomDocument();
	var soapEnvNode = createElementNS("http://schemas.xmlsoap.org/soap/envelope/", "soap:Envelope", soapEnvelopeDoc);

	if(BrowserSniffer.Safari13)
	{
		soapEnvNode.setAttribute("xmlns:soap", "http://schemas.xmlsoap.org/soap/envelope/");
	}
    soapEnvNode.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    soapEnvNode.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
    soapEnvNode.setAttribute("xmlns:wsa", "http://schemas.xmlsoap.org/ws/2004/03/addressing");
    soapEnvNode.setAttribute("xmlns:wsse", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd");
    soapEnvNode.setAttribute("xmlns:wsu", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd");
    soapEnvNode = soapEnvelopeDoc.appendChild(soapEnvNode); //Sarissa.appendChildToDoc(soapEnvelopeDoc, soapEnvNode);

    var soapHeaderNode = createElementNS("http://schemas.xmlsoap.org/soap/envelope/", "soap:Header", soapEnvelopeDoc);
    soapEnvNode.appendChild(soapHeaderNode);

    var soapActionNode = createElementNS("http://schemas.xmlsoap.org/ws/2004/03/addressing", "wsa:Action", soapEnvelopeDoc);
	if(BrowserSniffer.Safari13)
	{
		soapActionNode.setAttribute("xmlns:wsa", "http://schemas.xmlsoap.org/ws/2004/03/addressing");
	}
    var oTextNode = soapEnvelopeDoc.createTextNode("http://epicor.com/webservices/" + action);
    soapActionNode.appendChild(oTextNode);
    soapHeaderNode.appendChild(soapActionNode);

    var soapToNode = createElementNS("http://schemas.xmlsoap.org/ws/2004/03/addressing", "wsa:To", soapEnvelopeDoc);
	if(BrowserSniffer.Safari13)
	{
		soapToNode.setAttribute("xmlns:wsa", "http://schemas.xmlsoap.org/ws/2004/03/addressing");
	}
    var oTextNode = soapEnvelopeDoc.createTextNode(g_HostURL +"/"+webservice + ".asmx");
    soapToNode.appendChild(oTextNode);
    soapHeaderNode.appendChild(soapToNode);

    var soapBodyNode = createElementNS("http://schemas.xmlsoap.org/soap/envelope/", "soap:Body", soapEnvelopeDoc);
    soapEnvNode.appendChild(soapBodyNode);

	var oReqNode = createElementNS("http://epicor.com/webservices/", action, soapEnvelopeDoc);
	if(BrowserSniffer.Safari13)
	{
		oReqNode.setAttribute("xmlns", "http://epicor.com/webservices/");
	}
    soapBodyNode.appendChild(oReqNode);

    // The first parameter is always the userInfo which would tell the process what appserver/company/plant to use for
    //the session object.    
    var oArgNode;
	oArgNode = createElementNS("http://epicor.com/webservices/", "userInfo", soapEnvelopeDoc);
	if(BrowserSniffer.Safari13)
	{
		oArgNode.setAttribute("xmlns", "http://epicor.com/webservices/");
	}
		
	var userInfo;
	if (reqNames[0] == 'userInfo' && reqNames.length == reqValues.length)
	    userInfo = reqValues[0]
	else if (Global.ServerSession != undefined)
	{
	    userInfo = Global.ServerSession.AppServer + "~" +
	    Global.ServerSession.CompanyID + "~" + 
	    Global.ServerSession.PlantID;
	 }
	else userInfo = "";
	
    var oTextNode = soapEnvelopeDoc.createTextNode(userInfo);
    oArgNode.appendChild(oTextNode); 
    oReqNode.appendChild(oArgNode);	    

    for(i=0; i<reqNames.length; i++)
    {
        if(action=="ExecuteDashBoardQuery"&&i>0) break;
    
	    // the arguments from the proxy will start from index 0, so we process i=0 twice
		oArgNode = createElementNS("http://epicor.com/webservices/", reqNames[i], soapEnvelopeDoc);
		if(BrowserSniffer.Safari13)
		{
			oArgNode.setAttribute("xmlns", "http://epicor.com/webservices/");
		}
        
        if (reqValues[i] == undefined)
        {
    	    var oTextNode = soapEnvelopeDoc.createTextNode("");
    	    oArgNode.setAttribute("xsi:nil", "true");
			oArgNode.appendChild(oTextNode);
    	    oReqNode.appendChild(oArgNode);
			
            continue;
        }
        
	    if(typeof(reqValues[i])=="object")
	    {
    	
		    var oAtt = soapEnvelopeDoc.createAttribute("xmlns");
		    reqValues[i].documentElement.setAttributeNode(oAtt);
		    oArgNode.appendChild(reqValues[i].documentElement);			
	    }		
	    else
	    {	
		    if(!isNaN(reqValues[i]) && reqValues[i]!=true && reqValues[i]!=false)
		    {
			    var oTextNode = soapEnvelopeDoc.createTextNode(reqValues[i].toString());
			    oArgNode.appendChild(oTextNode);
		    }
		    else
		    {				
				var nodeText = reqValues[i].toString();
				if(BrowserSniffer.Safari13)
				{
					// the nightly builds of WebKit encode things correctly so we 
					// don't need to run the next bit of code for a nightly.
					// Need to revisit this when the next version of Safari (after 3.1.2) is released.
					if (WebKitDetect.isWebKit() && !WebKitDetect.version().isNightlyBuild)
					{
						var webKitVersion = WebKitDetect.version();
						if (!webKitVersion.isNightlyBuild)
						{
							if (WebKitDetect.version()[0] < 528)
							{
								// Safari 4 Beta has a major build number of 528
								// only do this replacement on versions below that.
								nodeText = nodeText.replace("<", "&lt;");
								nodeText = nodeText.replace(">", "&gt;");
							}
						}
					}
				}
			    var oTextNode = soapEnvelopeDoc.createTextNode(nodeText);
			    oArgNode.appendChild(oTextNode);
		    }
	    }
	    oReqNode.appendChild(oArgNode);
    }
    
    if(!callContextData&&Global.CallContextDS)
    {
        callContextData=Global.CallContextDS.Data;
    }
    if(callContextData)
    {
        var ccStr = JSON.stringify(callContextData);
	    var ccNode = createElementNS("http://epicor.com/webservices/", "callContextDS", soapEnvelopeDoc);
	    if(BrowserSniffer.Safari13)
	    {
		    ccNode.setAttribute("xmlns", "http://epicor.com/webservices/");
	    }
	    
	    var ccTextNode = soapEnvelopeDoc.createTextNode(ccStr);
	    ccNode.appendChild(ccTextNode);
	    
        oReqNode.appendChild(ccNode);
    }
    if(Global&&Global.PageInfo)  
    {
        var cacheKeyNode=createElementNS("http://epicor.com/webservices/", "cacheKey", soapEnvelopeDoc);
	    if(BrowserSniffer.Safari13) cacheKeyNode.setAttribute("xmlns", "http://epicor.com/webservices/");
        var cacheKeyText=soapEnvelopeDoc.createTextNode(Global.PageInfo.CacheKey);
        cacheKeyNode.appendChild(cacheKeyText);
        oReqNode.appendChild(cacheKeyNode);
        
        var pageInfoNode=createElementNS("http://epicor.com/webservices/", "pageInfo", soapEnvelopeDoc);
	    if(BrowserSniffer.Safari13) pageInfoNode.setAttribute("xmlns", "http://epicor.com/webservices/");
        var pageInfoText=soapEnvelopeDoc.createTextNode(JSON.stringify(Global.PageInfo.Info));
        pageInfoNode.appendChild(pageInfoText);
        oReqNode.appendChild(pageInfoNode);
        
        if(Global.PageInfo.SummaryInfo)
        {
            var summaryInfoNode=createElementNS("http://epicor.com/webservices/", "summaryInfo", soapEnvelopeDoc);
	        if(BrowserSniffer.Safari13) summaryInfoNode.setAttribute("xmlns", "http://epicor.com/webservices/");
            var summInfoText=soapEnvelopeDoc.createTextNode(JSON.stringify(Global.PageInfo.SummaryInfo));
            summaryInfoNode.appendChild(summInfoText);
            oReqNode.appendChild(summaryInfoNode);
        }
    }  
    
	return soapEnvelopeDoc;
}

function createElementNS (namespaceURI, elementName, ownerDocument) 
{
    var element = null; 
    if (typeof ownerDocument.createElementNS != 'undefined')
    { 
        element = ownerDocument.createElementNS(namespaceURI, elementName); 
    } 
    else if (typeof ownerDocument.createNode != 'undefined')
    { 
        element = ownerDocument.createNode(1, elementName, namespaceURI); 
    }
    return element;
} 

function getSOAPType(oXMLDoc,iType) 
{
	switch (iType)
	{
	    case 1:		//Void
			return oXMLDoc;
		case 2:		//Boolean
			return (Sarissa.getText(oXMLDoc, true) == "true")? true: false; //(oXMLDoc.firstChild.firstChild.nodeValue=="true" ? true : false);
		case 3:		//XMLDocument
		{
			oXMLDoc.firstChild.firstChild.attributes.removeNamedItem("xmlns");
			return oXMLDoc.firstChild.firstChild;
		}
		default: 	//Scalar
			return Sarissa.getText(oXMLDoc, true);
	}
} 

function getBusinessObjectException(soapDoc, method)
{
	var msg;

	// Look for the fault string.  If it's not found, send the whole doc.
	var faultEle = soapDoc.selectSingleNode("//faultactor");
	if(faultEle)
	    msg = Sarissa.getText(faultEle, true);
	    
	if (msg)
	{
	    //E.g. msg = "{"businessObjectMessage":[{"message":"Record not found.","method":"GetByID"}]}"
	    msg = msg.replace("\n","\\n");
	    var boExcep = JSON.parse(msg);
	    method = boExcep.businessObjectMessage[0].method;
	    msg = boExcep.businessObjectMessage[0].message;
	}
	else
	{
	    faultEle = soapDoc.selectSingleNode("//faultstring");
	    if(faultEle)
	        msg = Sarissa.getText(faultEle, true);
	    else
	        msg = Sarissa.serialize(soapDoc);
    }
    var boException = new BusinessObjectException(msg);
    var boMessage = new BusinessObjectMessage();
    if(msg.indexOf("Your request has resulted in to much data being returned.")>-1) method="";
    
    boMessage.Method = method;
    boException.BusinessObjectMessages.push(boMessage);
    
    DebugHelper.WriteMessage(msg, true);
    
    return boException;
}
function displaySOAPError(soapDoc)
{
	var msg;
	var msgDetails;

	// Look for the fault string.  If it's not found, send the whole doc.
	var faultEle = soapDoc.selectSingleNode("//faultstring");
	if(faultEle)
	    msg = Sarissa.getText(faultEle, true);
	else
	    msg = Sarissa.serialize(soapDoc);
	
	if (gError)
	    gError.Message = msg;
	    
	if(!gSuppressSoapError)
		alert(msg);
}

function getDatasetForServer(dsData,filter)
{
    if(filter==undefined) filter=true;
    var jsonData="";
    
    if(filter)
        jsonData = dsData.toStringFilter();
    else
        jsonData = dsData.toString();
        
    jsonData = jsonData.replace("System.Byte[]", "");
    return jsonData;
}

/*
	<Function public="true" name="GetCookie" description="Gets the named cookie.">
		<Parameter name="name" description="The cookie name."/>
	</Function>
*/
function getCookie(name) 
{
    //if (Global.document.cookie == "") return "";
	var cookies = document.cookie.split("; ");
	for(var ii=0; ii<cookies.length; ii++)
	{
		var crumb = cookies[ii].split("=");
		if(name == crumb[0])
		{
			return unescape(crumb[1]);
		}
	}
	return "";
}

function deleteCookie(name)
{
	date = new Date(1999,00,01);
	var cookies = document.cookie.split("; ");
	for(var ii=0; ii<cookies.length; ii++)
	{
		var crumb = cookies[ii].split("=");
		if(crumb[0] == name)
		{
			//set cookie to expire.
  			document.cookie = crumb[0] + "= ''; expires=" + date.toGMTString();	
		}
	}
}

function saveCookie(name, value)
{
	date = new Date(1999,00,01);
	var cookies = document.cookie.split("; ");
	for(var ii=0; ii<cookies.length; ii++)
	{
		var crumb = cookies[ii].split("=");
		if(crumb[0] == name)
		{
  			document.cookie = crumb[0] + "= ''; expires=" + date.toGMTString();	
		}
	}

	//Set the cookie
	date = new Date(2999,00,01);
  	document.cookie = name + "=" + escape(value) + "; expires=" + date.toGMTString();			
}

/**********************************************/
function checkRptMonitorOnFormLoad(isProcessReport)
{
    	//Check and process the report
	    var rptStartTime = parseInt(getCookie('RptStartTime'));
	    var rptLastProcessTime = parseInt(getCookie('RptLastProcessTime'));	    
	    var currentTime = (new Date()).getTime();
	    
	    //start Report Monitor if this is a report form and the Report Start Time is set to zero.  This is the case when the report is 
	    //first run and there is no other report is pending.
	    //Or start the report Monitor if the Report Start Time is not set to zero and there are more then a minute since the rptLastProcess is updated.
	    //This is the case when the report is started in some other process but it terminates.  We need to restart the report monitor again.
	    
	    if ((isProcessReport && isNaN(rptStartTime)) || 
	    (rptStartTime > 0 && !isNaN(rptLastProcessTime) && (currentTime - rptLastProcessTime >= 1000 * 60)))
            startRptMonitor();           
}

function startRptMonitor(isProcessReport)
{
	//Check and process the report
    var rptStartTime = parseInt(getCookie('RptStartTime'));
    var rptLastProcessTime = parseInt(getCookie('RptLastProcessTime'));	    
    var currentTime = (new Date()).getTime();
    
    //start Report Monitor if this is a report form and the Report Start Time is set to zero.  This is the case when the report is 
    //first run and there is no other report is pending.
    //Or start the report Monitor if the Report Start Time is not set to zero and there are more then a minute since the rptLastProcess is updated.
    //This is the case when the report is started in some other process but it terminates.  We need to restart the report monitor again.
    
    if ((isProcessReport && isNaN(rptStartTime)) || 
    (rptStartTime > 0 && !isNaN(rptLastProcessTime) && (currentTime - rptLastProcessTime >= 1000 * 60)))
    {
        var rptStartTime = parseInt(getCookie('RptStartTime'));
        if (isNaN(rptStartTime))
        {
            saveCookie("RptStartTime", (new Date()).getTime());  
            saveCookie("RptLastProcessTime", (new Date()).getTime());   //Need to stamp it right away, in case the user close the form befor Process Report is processed
            setTimeout(function() {ProcessReport()}, rptLowPriorityInterval); 
        }
        else
        {
            ProcessReport();
        }
    }
}

function OpenReportDialog(url)
{
	url = "EWAReport.aspx?rptName=" + url;

	if (BrowserSniffer.FireFox15) {
	    sFeatures = "height=601,width=979,toolbar=no,menubar=no,scrollbars=no,scroll=no,status=no,help=no,resizable=yes,modal=yes";

	    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");

	    var win = Global.window.open(url, "_blank", sFeatures);
	    result = win.returnValue;
	}
	else if (BrowserSniffer.Safari13) {
	    sFeatures = "dialogHeight:601px; dialogWidth:979px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
	    result = window.showModalDialog(url, null, sFeatures);
	}
	else //if(BrowserSniffer.IE)
	{
        //there are bugs in IE 10.  I need to replace &amp; with &
        url  = url.Replace("&amp;", "&");
	    sFeatures = "dialogHeight:601px; dialogWidth:979px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
	    result = showModalDialog(url, null, sFeatures);
	}
}

function ProcessReport()
{
	var currentTime = (new Date()).getTime();
    try
    {
        saveCookie("RptLastProcessTime", (new Date()).getTime());
        
		var rptStartTime = parseInt(getCookie('RptStartTime'));
		
		if (isNaN(rptStartTime))
		    return;
		    
        var seconds = Math.round((currentTime - rptStartTime)/1000);
        
        var result = doVantageSoapCall('lib_ReportMonitorService','GetLastGeneratedReport(4)',['seconds'],[],[seconds]); 
        if (result != undefined && result != null && result.length > 0)
        {  
            saveCookie("RptStartTime", "");
            if (result.indexOf(".aspx") > 0) {
                //Case of SSRS report
                var urls = result.split("|");
                if (urls.length == 0)
			        OpenReportDialog(result);
                else {
                    for (var ii = 0; ii < urls.length; ii++) {
			            OpenReportDialog(urls[ii]);
                    }
                }
            }
            else {
                //Case of Crystal or Financial report
			OpenReportDialog(result);
            }
	    }
	    else
	    {	                
		    var rptStartTime = getCookie('RptStartTime');
            var seconds = Math.round(currentTime - parseInt(rptStartTime))/1000;
                
            //If a report is running for 30 minutes, terminate the report process.
            if (seconds > rptTimeOut/1000)
            {
                saveCookie("RptStartTime", "");
                return;
            }
            
            //Recursively running ProcessReport with rptHighPriorityInterval until it reaches rptHighPriorityDuration and then it will use rptLowPriorityInterval.
            //All the rptHighPriorityDuration, rptHighPriorityInterval and rptLowPriorityInterval should be configurable from installation.
	        var timer;
	        if (rptHighPriorityDuration / 1000 > seconds)
	            timer = rptHighPriorityInterval;
	        else
	            timer = rptLowPriorityInterval;
	        
            setTimeout(function() {ProcessReport()}, timer); 
	    }
	}
	catch(err)
	{
        gError = new ErrorObject(ERR_SOAP);
        gError.Message = err.Message;
        if (!gSuppressSoapError)
            alert(err.Message);
	}
}
//----------------------------
// CacheInfoExtractor
//----------------------------
var CacheInfoExtractor=
{
    "Extract":function(xmlReturn)
    {
        var cacheInfo=null;
        var data;
        var summaryDS = xmlReturn.selectSingleNode("e1:summaryDS");
        if(summaryDS!=null)
        {   
            var summaryInfo = Sarissa.getText(summaryDS, true);
            if(summaryInfo.length>0&&summaryInfo!="{}")
            {
                data=JSON.parse(summaryInfo);
                cacheInfo={"CacheKey":data["cacheKey"],"RowCount":data["dsRowCount"],"Start":data.rows[0]["firstRowIDReturned"],"End":data.rows[0]["lastRowIDReturned"],"Summaries":data["Summaries"],"Views":{}};
            }
        }
        
        return cacheInfo;
    }
}
//----------------------------
// CallContextExtractor
//----------------------------
var CallContextExtractor=
{
    "Extract":function(xmlReturn)
    {
        var ccDataset;
        var data;
        var infoFlg=null;
        var infoNode = xmlReturn.selectSingleNode("e1:InfoPromptRequired");
        if(infoNode!=null)
        {
            infoFlg = Sarissa.getText(infoNode, true);
            if(infoFlg=="true")
            {
                data=CallContextExtractor.GetCCData(xmlReturn);
                if(data!=null)
                {                
                    var iph = new InfoPromptHandler();
                    ccDataset=iph.Handle(data);
                }
            }
        }
        if(ccDataset==null) // Not calling back
        {
            if(infoFlg!="true") data=CallContextExtractor.GetCCData(xmlReturn);
            if(data!=null) 
            {
                var imh=new InfoMessageHandler();
                imh.Handle(data);
                
                delete data["InfoMessage"];
            
                CallContextExtractor.Bind(data);
            }
        }
        
        return ccDataset;
    },
    "GetCCData":function(xmlReturn)
    {
        var data=null;
        var callContextDS = xmlReturn.selectSingleNode("e1:callContextDS");
        if(callContextDS!=null)
        {
            var callContextInfo = Sarissa.getText(callContextDS, true);
            data=JSON.parse( callContextInfo );
        }
        return data;
    },
    "Bind":function(data)
    {
        if(Global.CallContextDS) Global.CallContextDS.Load(data,EpiBindType.None,true);
    }
}
var InfoMessageHandler=function()
{
}
InfoMessageHandler.DisplayInfoMessage=function(infoMsg)
{
    infoMsg.RecalcDisplayMode();
    ExceptionDialog.ShowInfoMessage(Global.Form, infoMsg);
}
InfoMessageHandler.prototype.Handle=function(contextData)
{
    if(!contextData.InfoMessage||contextData.InfoMessage.length==0) return;

    var gridItems=new ArrayList();
    var infoMsg=null;
    var bo=null;
    var method=null;
    
    for(var messageRow in contextData.InfoMessage)
    {
        messageRow=contextData.InfoMessage[messageRow];
        if (bo != messageRow.BO || method != messageRow.Method)
        {
            if (bo != null && method != null && gridItems.Count > 0)
            {
                infoMsg.MessageItems.Clear();
                infoMsg.MessageItems.AddRange(gridItems.items);
                InfoMessageHandler.DisplayInfoMessage(infoMsg);
                gridItems.Clear();
            }
            bo = messageRow.BO;
            method = messageRow.Method;
            infoMsg = new InfoMessage(bo, method, messageRow.UserIdent, messageRow.Company, messageRow.Plant, messageRow.Version);
        }

        if ((messageRow.DisplayMode) == InfoMessage.DisplayMode.Individual)
        {
            infoMsg.MessageItems.Clear();
            infoMsg.MessageItems.Add({"Text":messageRow.MessageText,"Severity":Convert.ToInt32(messageRow.Severity)});
            InfoMessageHandler.DisplayInfoMessage(infoMsg);
        }
        else
        {
            gridItems.Add({"Text":messageRow.MessageText,"Severity":Convert.ToInt32(messageRow.Severity)});
        }
    }
    if (bo != null && method != null && gridItems.Count > 0)
    {
        infoMsg.MessageItems.Clear();
        infoMsg.MessageItems.AddRange(gridItems.items);
        InfoMessageHandler.DisplayInfoMessage(infoMsg);
        gridItems.Clear();
    }
}
var InfoPromptHandler=function()
{
    this.delim = "|";
    this.delimSubstitute = "#IPFDelimSubst#";
}
InfoPromptHandler.prototype.Handle=function(contextData)
{
    var lfo = new LaunchFormOptions();
    lfo.IsModal = true;
    lfo.SuppressFormSearch = true;
    lfo.ValueIn = contextData.ClientHandler[contextData.ClientHandler.length-1].Data;
    lfo.Result = contextData;
    var formID = this.GetFormIdFromData(lfo.ValueIn);
    var showAlways = this.GetShowAlwaysFromData(lfo.ValueIn);
    var custArgs = this.GetCustomizationParametersFromData(lfo.ValueIn);
    var isAttemptToReenterPwd = this.GetAttemptsCountFromData(lfo.ValueIn)!=-1;
    data = lfo.Result;
    
    var ipForm=new InfoPromptForm(formID, showAlways, isAttemptToReenterPwd,data);
    if (custArgs!=null)
    {
        ipForm.ArgsInUrl["menuID"] = "IPCustomMenu|" + custArgs;
    }
    ipForm.Init(formID, showAlways, isAttemptToReenterPwd,data);
    var result = ipForm.ShowDialog(new EpiOverloadedArgs(""));
    return lfo.Result;
}
InfoPromptHandler.prototype.GetFormIdFromData=function(data)
{
    return this.GetDataItemAtPosition(0, data).Replace(this.delimSubstitute, this.delim);
}
InfoPromptHandler.prototype.GetShowAlwaysFromData=function(data) 
{
    return this.GetDataItemAtPosition(1, data).toLowerCase() != "m";
}
InfoPromptHandler.prototype.GetAttemptsCountFromData=function(data) 
{
    if(Int32.TryParse(this.GetDataItemAtPosition(3,data),-1)) 
    {
        return Global.ArgManager["Out1"];
    }
    return -1;
}
InfoPromptHandler.prototype.GetCustomizationParametersFromData=function(data)
{
    var custData = this.GetDataItemAtPosition(2, data);
    if(!String.IsNullOrEmpty(custData)) 
        return custData;
    else 
        return null;
}
InfoPromptHandler.prototype.GetDataItemAtPosition=function(index, data) 
{
    var slices = data.Split(this.delim);
    return (slices.length > index) ? slices[index] : "";
}

var InfoPromptForm=Epicor.Mfg.UI.InfoPrompt.InfoPromptForm=function()
{
    LaunchEngineForm.call(this);
    for(var i=0;i<=arguments.length-1;i++){this.Args.push(arguments[i]);}
    this.Assembly="UI.InfoPromptForm";
    this.Name="InfoPromptForm";
    this._type="Epicor.Mfg.UI.InfoPrompt.InfoPromptForm";
    this.DialogProps=["CustID","CustomerName"];
}
InfoPromptForm.prototype = new LaunchEngineForm();
InfoPromptForm.prototype.Init=function(formID,showAlways,pwd,data)
{
    return this.CallFunction("Init",[formID,showAlways,pwd,data]);
}

////////////////////////////////////////////////////////////////////////////////////
// SARISSA.JS CONTENTS
// * <p>Sarissa is a utility class. Provides "static" methods for DOMDocument, 
// * DOM Node serialization to XML strings and other utility goodies.</p>
// * @constructor
// * ====================================================================
// * Sarissa is an ECMAScript library acting as a cross-browser wrapper for native XML APIs.
// * The library supports Gecko based browsers like Mozilla and Firefox,
// * Internet Explorer (5.5+ with MSXML3.0+), Konqueror, Safari and a little of Opera
// * @version ${project.version}
// * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
////////////////////////////////////////////////////////////////////////////////////

function Sarissa(){};
Sarissa.VERSION = "${project.version}";
Sarissa.PARSED_OK = "Document contains no parsing errors";
Sarissa.PARSED_EMPTY = "Document is empty";
Sarissa.PARSED_UNKNOWN_ERROR = "Not well-formed or other error";
Sarissa.IS_ENABLED_TRANSFORM_NODE = false;
var _sarissa_iNsCounter = 0;
var _SARISSA_IEPREFIX4XSLPARAM = "";
var _SARISSA_HAS_DOM_IMPLEMENTATION = document.implementation && true;
var _SARISSA_HAS_DOM_CREATE_DOCUMENT = _SARISSA_HAS_DOM_IMPLEMENTATION && document.implementation.createDocument;
var _SARISSA_HAS_DOM_FEATURE = _SARISSA_HAS_DOM_IMPLEMENTATION && document.implementation.hasFeature;
var _SARISSA_IS_MOZ = _SARISSA_HAS_DOM_CREATE_DOCUMENT && _SARISSA_HAS_DOM_FEATURE;
var _SARISSA_IS_SAFARI = navigator.userAgent.toLowerCase().indexOf("safari") != -1 || navigator.userAgent.toLowerCase().indexOf("konqueror") != -1;
var _SARISSA_IS_SAFARI_OLD = _SARISSA_IS_SAFARI && parseInt((navigator.userAgent.match(/AppleWebKit\/(\d+)/)||{})[1]) < 420;
var _SARISSA_IS_IE = document.all && window.ActiveXObject && navigator.userAgent.toLowerCase().indexOf("msie") > -1  && navigator.userAgent.toLowerCase().indexOf("opera") == -1;
var _SARISSA_IS_OPERA = navigator.userAgent.toLowerCase().indexOf("opera") != -1;
if(!window.Node || !Node.ELEMENT_NODE){
    Node = {ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4, ENTITY_REFERENCE_NODE: 5,  ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7, COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10, DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12};
};

//This breaks for(x in o) loops in the old Safari
if(_SARISSA_IS_SAFARI_OLD){
    HTMLHtmlElement = document.createElement("html").constructor;
    Node = HTMLElement = {};
    HTMLElement.prototype = HTMLHtmlElement.__proto__.__proto__;
    HTMLDocument = Document = document.constructor;
    var x = new DOMParser();
    XMLDocument = x.constructor;
    Element = x.parseFromString("<Single />", "text/xml").documentElement.constructor;
    x = null;
}
if(typeof XMLDocument == "undefined" && typeof Document !="undefined"){ XMLDocument = Document; } 

// IE initialization
if(_SARISSA_IS_IE){
    // for XSLT parameter names, prefix needed by IE
    _SARISSA_IEPREFIX4XSLPARAM = "xsl:";
    // used to store the most recent ProgID available out of the above
    var _SARISSA_DOM_PROGID = "";
    var _SARISSA_XMLHTTP_PROGID = "";
    var _SARISSA_DOM_XMLWRITER = "";
    /**
     * Called when the Sarissa_xx.js file is parsed, to pick most recent
     * ProgIDs for IE, then gets destroyed.
     * @private
     * @param idList an array of MSXML PROGIDs from which the most recent will be picked for a given object
     * @param enabledList an array of arrays where each array has two items; the index of the PROGID for which a certain feature is enabled
     */
    Sarissa.pickRecentProgID = function (idList){
        // found progID flag
        var bFound = false;
        for(var i=0; i < idList.length && !bFound; i++){
            try{
                var oDoc = new ActiveXObject(idList[i]);
                o2Store = idList[i];
                bFound = true;
            }catch (objException){
                // trap; try next progID
            };
        };
        if (!bFound) {
            throw "Could not retreive a valid progID of Class: " + idList[idList.length-1]+". (original exception: "+e+")";
        };
        idList = null;
        return o2Store;
    };
    // pick best available MSXML progIDs
    _SARISSA_DOM_PROGID = null;
    _SARISSA_THREADEDDOM_PROGID = null;
    _SARISSA_XSLTEMPLATE_PROGID = null;
    _SARISSA_XMLHTTP_PROGID = null;
    if(!window.XMLHttpRequest){
        /**
         * Emulate XMLHttpRequest
         * @constructor
         */
        XMLHttpRequest = function() {
            if(!_SARISSA_XMLHTTP_PROGID){
                _SARISSA_XMLHTTP_PROGID = Sarissa.pickRecentProgID(["Msxml2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"]);
            };
            return new ActiveXObject(_SARISSA_XMLHTTP_PROGID);
        };
    };
    // we dont need this anymore
    //============================================
    // Factory methods (IE)
    //============================================
    // see non-IE version
    Sarissa.getDomDocument = function(sUri, sName){
        if(!_SARISSA_DOM_PROGID){
            _SARISSA_DOM_PROGID = Sarissa.pickRecentProgID(["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"]);
        };
        var oDoc = new ActiveXObject(_SARISSA_DOM_PROGID);
        // if a root tag name was provided, we need to load it in the DOM object
        if (sName){
            // create an artifical namespace prefix 
            // or reuse existing prefix if applicable
            var prefix = "";
            if(sUri){
                if(sName.indexOf(":") > 1){
                    prefix = sName.substring(0, sName.indexOf(":"));
                    sName = sName.substring(sName.indexOf(":")+1); 
                }else{
                    prefix = "a" + (_sarissa_iNsCounter++);
                };
            };
            // use namespaces if a namespace URI exists
            if(sUri){
                oDoc.loadXML('<' + prefix+':'+sName + " xmlns:" + prefix + "=\"" + sUri + "\"" + " />");
            } else {
                oDoc.loadXML('<' + sName + " />");
            };
        };
        return oDoc;
    };
    // see non-IE version   
    Sarissa.getParseErrorText = function (oDoc) {
        var parseErrorText = Sarissa.PARSED_OK;
        if(oDoc && oDoc.parseError && oDoc.parseError.errorCode && oDoc.parseError.errorCode != 0){
            parseErrorText = "XML Parsing Error: " + oDoc.parseError.reason + 
                "\nLocation: " + oDoc.parseError.url + 
                "\nLine Number " + oDoc.parseError.line + ", Column " + 
                oDoc.parseError.linepos + 
                ":\n" + oDoc.parseError.srcText +
                "\n";
            for(var i = 0;  i < oDoc.parseError.linepos;i++){
                parseErrorText += "-";
            };
            parseErrorText +=  "^\n";
        }
        else if(oDoc.documentElement == null){
            parseErrorText = Sarissa.PARSED_EMPTY;
        };
        return parseErrorText;
    };
    // see non-IE version
    Sarissa.setXpathNamespaces = function(oDoc, sNsSet) {
        oDoc.setProperty("SelectionLanguage", "XPath");
        oDoc.setProperty("SelectionNamespaces", sNsSet);
    };   
    /**
     * Basic implementation of Mozilla's XSLTProcessor for IE. 
     * Reuses the same XSLT stylesheet for multiple transforms
     * @constructor
     */
    XSLTProcessor = function(){
        if(!_SARISSA_XSLTEMPLATE_PROGID){
            _SARISSA_XSLTEMPLATE_PROGID = Sarissa.pickRecentProgID(["Msxml2.XSLTemplate.6.0", "MSXML2.XSLTemplate.3.0"]);
        };
        this.template = new ActiveXObject(_SARISSA_XSLTEMPLATE_PROGID);
        this.processor = null;
    };
    /**
     * Imports the given XSLT DOM and compiles it to a reusable transform
     * <b>Note:</b> If the stylesheet was loaded from a URL and contains xsl:import or xsl:include elements,it will be reloaded to resolve those
     * @argument xslDoc The XSLT DOMDocument to import
     */
    XSLTProcessor.prototype.importStylesheet = function(xslDoc){
        if(!_SARISSA_THREADEDDOM_PROGID){
            _SARISSA_THREADEDDOM_PROGID = Sarissa.pickRecentProgID(["MSXML2.FreeThreadedDOMDocument.6.0", "MSXML2.FreeThreadedDOMDocument.3.0"]);
        };
        xslDoc.setProperty("SelectionLanguage", "XPath");
        xslDoc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
        // convert stylesheet to free threaded
        var converted = new ActiveXObject(_SARISSA_THREADEDDOM_PROGID);
        // make included/imported stylesheets work if exist and xsl was originally loaded from url
        if (_SARISSA_THREADEDDOM_PROGID == "MSXML2.FreeThreadedDOMDocument.6.0") { 
            converted.setProperty("AllowDocumentFunction", true); 
            converted.resolveExternals = true; 
        };
        if(xslDoc.url && xslDoc.selectSingleNode("//xsl:*[local-name() = 'import' or local-name() = 'include']") != null){
            converted.async = false;
            converted.load(xslDoc.url);
        } else {
            converted.loadXML(xslDoc.xml);
        };
        converted.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
        var output = converted.selectSingleNode("//xsl:output");
        this.outputMethod = output ? output.getAttribute("method") : "html";
        this.template.stylesheet = converted;
        this.processor = this.template.createProcessor();
        // for getParameter and clearParameters
        this.paramsSet = new Array();
    };

    /**
     * Transform the given XML DOM and return the transformation result as a new DOM document
     * @argument sourceDoc The XML DOMDocument to transform
     * @return The transformation result as a DOM Document
     */
    XSLTProcessor.prototype.transformToDocument = function(sourceDoc){
        // fix for bug 1549749
        if(_SARISSA_THREADEDDOM_PROGID){
            this.processor.input=sourceDoc;
            var outDoc=new ActiveXObject(_SARISSA_DOM_PROGID);
            this.processor.output=outDoc;
            this.processor.transform();
            return outDoc;
        }
        else{
            if(!_SARISSA_DOM_XMLWRITER){
                _SARISSA_DOM_XMLWRITER = Sarissa.pickRecentProgID(["Msxml2.MXXMLWriter.6.0", "Msxml2.MXXMLWriter.3.0", "MSXML2.MXXMLWriter", "MSXML.MXXMLWriter", "Microsoft.XMLDOM"]);
            };
            this.processor.input = sourceDoc;
            var outDoc = new ActiveXObject(_SARISSA_DOM_XMLWRITER);
            this.processor.output = outDoc; 
            this.processor.transform();
            var oDoc = new ActiveXObject(_SARISSA_DOM_PROGID);
            oDoc.loadXML(outDoc.output+"");
            return oDoc;
        };
    };
    
    /**
     * Transform the given XML DOM and return the transformation result as a new DOM fragment.
     * <b>Note</b>: The xsl:output method must match the nature of the owner document (XML/HTML).
     * @argument sourceDoc The XML DOMDocument to transform
     * @argument ownerDoc The owner of the result fragment
     * @return The transformation result as a DOM Document
     */
    XSLTProcessor.prototype.transformToFragment = function (sourceDoc, ownerDoc) {
        this.processor.input = sourceDoc;
        this.processor.transform();
        var s = this.processor.output;
        var f = ownerDoc.createDocumentFragment();
        if (this.outputMethod == 'text') {
            f.appendChild(ownerDoc.createTextNode(s));
        } else if (ownerDoc.body && ownerDoc.body.innerHTML) {
            var container = ownerDoc.createElement('div');
            container.innerHTML = s;
            while (container.hasChildNodes()) {
                f.appendChild(container.firstChild);
            }
        }
        else {
            var oDoc = new ActiveXObject(_SARISSA_DOM_PROGID);
            if (s.substring(0, 5) == '<?xml') {
                s = s.substring(s.indexOf('?>') + 2);
            }
            var xml = ''.concat('<my>', s, '</my>');
            oDoc.loadXML(xml);
            var container = oDoc.documentElement;
            while (container.hasChildNodes()) {
                f.appendChild(container.firstChild);
            }
        }
        return f;
    };
    
    /**
     * Set global XSLT parameter of the imported stylesheet
     * @argument nsURI The parameter namespace URI
     * @argument name The parameter base name
     * @argument value The new parameter value
     */
     XSLTProcessor.prototype.setParameter = function(nsURI, name, value){
         // make value a zero length string if null to allow clearing
         value = value ? value : "";
         // nsURI is optional but cannot be null
         if(nsURI){
             this.processor.addParameter(name, value, nsURI);
         }else{
             this.processor.addParameter(name, value);
         };
         // update updated params for getParameter
         nsURI = "" + (nsURI || "");
         if(!this.paramsSet[nsURI]){
             this.paramsSet[nsURI] = new Array();
         };
         this.paramsSet[nsURI][name] = value;
     };
    /**
     * Gets a parameter if previously set by setParameter. Returns null
     * otherwise
     * @argument name The parameter base name
     * @argument value The new parameter value
     * @return The parameter value if reviously set by setParameter, null otherwise
     */
    XSLTProcessor.prototype.getParameter = function(nsURI, name){
        nsURI = "" + (nsURI || "");
        if(this.paramsSet[nsURI] && this.paramsSet[nsURI][name]){
            return this.paramsSet[nsURI][name];
        }else{
            return null;
        };
    };
    /**
     * Clear parameters (set them to default values as defined in the stylesheet itself)
     */
    XSLTProcessor.prototype.clearParameters = function(){
        for(var nsURI in this.paramsSet){
            for(var name in this.paramsSet[nsURI]){
                if(nsURI!=""){
                    this.processor.addParameter(name, "", nsURI);
                }else{
                    this.processor.addParameter(name, "");
                };
            };
        };
        this.paramsSet = new Array();
    };
}else{ /* end IE initialization, try to deal with real browsers now ;-) */
    if(_SARISSA_HAS_DOM_CREATE_DOCUMENT){
        /**
         * <p>Ensures the document was loaded correctly, otherwise sets the
         * parseError to -1 to indicate something went wrong. Internal use</p>
         * @private
         */
        Sarissa.__handleLoad__ = function(oDoc){
            Sarissa.__setReadyState__(oDoc, 4);
        };
        /**
        * <p>Attached by an event handler to the load event. Internal use.</p>
        * @private
        */
        _sarissa_XMLDocument_onload = function(){
            Sarissa.__handleLoad__(this);
        };
        /**
         * <p>Sets the readyState property of the given DOM Document object.
         * Internal use.</p>
         * @private
         * @argument oDoc the DOM Document object to fire the
         *          readystatechange event
         * @argument iReadyState the number to change the readystate property to
         */
        Sarissa.__setReadyState__ = function(oDoc, iReadyState){
            oDoc.readyState = iReadyState;
            oDoc.readystate = iReadyState;
            
            if (oDoc.onreadystatechange != null && typeof oDoc.onreadystatechange == "function")
                oDoc.onreadystatechange();
        };
        Sarissa.getDomDocument = function(sUri, sName){
            var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
            if(!oDoc.onreadystatechange){
            
                /**
                * <p>Emulate IE's onreadystatechange attribute</p>
                */
                oDoc.onreadystatechange = null;
            };
            if(!oDoc.readyState){
                /**
                * <p>Emulates IE's readyState property, which always gives an integer from 0 to 4:</p>
                * <ul><li>1 == LOADING,</li>
                * <li>2 == LOADED,</li>
                * <li>3 == INTERACTIVE,</li>
                * <li>4 == COMPLETED</li></ul>
                */
                oDoc.readyState = 0;
            };
            oDoc.addEventListener("load", _sarissa_XMLDocument_onload, false);
            return oDoc;
        };
        if(window.XMLDocument){
            // do nothing
        }// TODO: check if the new document has content before trying to copynodes, check  for error handling in DOM 3 LS
        else if(_SARISSA_HAS_DOM_FEATURE && window.Document && !Document.prototype.load && document.implementation.hasFeature('LS', '3.0')){
            //Opera 9 may get the XPath branch which gives creates XMLDocument, therefore it doesn't reach here which is good
            /**
            * <p>Factory method to obtain a new DOM Document object</p>
            * @argument sUri the namespace of the root node (if any)
            * @argument sUri the local name of the root node (if any)
            * @returns a new DOM Document
            */
            Sarissa.getDomDocument = function(sUri, sName){
                var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
                return oDoc;
            };
        }
        else {
            Sarissa.getDomDocument = function(sUri, sName){
                var oDoc = document.implementation.createDocument(sUri?sUri:null, sName?sName:null, null);
                // looks like safari does not create the root element for some unknown reason
                if(oDoc && (sUri || sName) && !oDoc.documentElement){
                    oDoc.appendChild(oDoc.createElementNS(sUri, sName));
                };
                return oDoc;
            };
        };
    };//if(_SARISSA_HAS_DOM_CREATE_DOCUMENT)
};
//==========================================
// Common stuff
//==========================================
if(!window.DOMParser){
    if(_SARISSA_IS_SAFARI){
        /*
         * DOMParser is a utility class, used to construct DOMDocuments from XML strings
         * @constructor
         */
        DOMParser = function() { };
        /** 
        * Construct a new DOM Document from the given XMLstring
        * @param sXml the given XML string
        * @param contentType the content type of the document the given string represents (one of text/xml, application/xml, application/xhtml+xml). 
        * @return a new DOM Document from the given XML string
        */
        DOMParser.prototype.parseFromString = function(sXml, contentType){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET.html", "data:text/xml;charset=utf-8," + encodeURIComponent(sXml), false);
            xmlhttp.send(null);
            var res= xmlhttp.responseXML;
            xmlhttp = null;
            return res;
        };
    }else if(Sarissa.getDomDocument && Sarissa.getDomDocument() && Sarissa.getDomDocument(null, "bar").xml){
        DOMParser = function() { };
        DOMParser.prototype.parseFromString = function(sXml, contentType){
            var doc = Sarissa.getDomDocument();
            doc.loadXML(sXml);
            return doc;
        };
    };
};

if((typeof(document.importNode) == "undefined") && _SARISSA_IS_IE){
    try{
        /**
        * Implementation of importNode for the context window document in IE.
        * If <code>oNode</code> is a TextNode, <code>bChildren</code> is ignored.
        * @param oNode the Node to import
        * @param bChildren whether to include the children of oNode
        * @returns the imported node for further use
        */
        document.importNode = function(oNode, bChildren){
            var tmp;
            if (oNode.nodeName=='#text') {
                return document.createTextElement(oNode.data);
            }
            else {
                if(oNode.nodeName == "tbody" || oNode.nodeName == "tr"){
                    tmp = document.createElement("table");
                }
                else if(oNode.nodeName == "td"){
                    tmp = document.createElement("tr");
                }
                else if(oNode.nodeName == "option"){
                    tmp = document.createElement("select");
                }
                else{
                    tmp = document.createElement("div");
                };
                if(bChildren){
                    tmp.innerHTML = oNode.xml ? oNode.xml : oNode.outerHTML;
                }else{
                    tmp.innerHTML = oNode.xml ? oNode.cloneNode(false).xml : oNode.cloneNode(false).outerHTML;
                };
                return tmp.getElementsByTagName("*")[0];
            };
            
        };
    }catch(e){ };
};
if(!Sarissa.getParseErrorText){
    /**
     * <p>Returns a human readable description of the parsing error. Usefull
     * for debugging. Tip: append the returned error string in a &lt;pre&gt;
     * element if you want to render it.</p>
     * <p>Many thanks to Christian Stocker for the initial patch.</p>
     * @argument oDoc The target DOM document
     * @returns The parsing error description of the target Document in
     *          human readable form (preformated text)
     */
    Sarissa.getParseErrorText = function (oDoc){
        var parseErrorText = Sarissa.PARSED_OK;
        if(!oDoc.documentElement){
            parseErrorText = Sarissa.PARSED_EMPTY;
        } else if(oDoc.documentElement.tagName == "parsererror"){
            parseErrorText = oDoc.documentElement.firstChild.data;
            parseErrorText += "\n" +  oDoc.documentElement.firstChild.nextSibling.firstChild.data;
        } else if(oDoc.getElementsByTagName("parsererror").length > 0){
            var parsererror = oDoc.getElementsByTagName("parsererror")[0];
            parseErrorText = Sarissa.getText(parsererror, true)+"\n";
        } else if(oDoc.parseError && oDoc.parseError.errorCode != 0){
            parseErrorText = Sarissa.PARSED_UNKNOWN_ERROR;
        };
        return parseErrorText;
    };
};
Sarissa.getText = function(oNode, deep){
    var s = "";
    var nodes = oNode.childNodes;
    for(var i=0; i < nodes.length; i++){
        var node = nodes[i];
        var nodeType = node.nodeType;
        if(nodeType == Node.TEXT_NODE || nodeType == Node.CDATA_SECTION_NODE){
            s += node.data;
        } else if(deep == true
                    && (nodeType == Node.ELEMENT_NODE
                        || nodeType == Node.DOCUMENT_NODE
                        || nodeType == Node.DOCUMENT_FRAGMENT_NODE)){
            s += Sarissa.getText(node, true);
        };
    };
    return s;
};
if(!window.XMLSerializer 
    && Sarissa.getDomDocument 
    && Sarissa.getDomDocument("","foo", null).xml){
    /**
     * Utility class to serialize DOM Node objects to XML strings
     * @constructor
     */
    XMLSerializer = function(){};
    /**
     * Serialize the given DOM Node to an XML string
     * @param oNode the DOM Node to serialize
     */
    XMLSerializer.prototype.serializeToString = function(oNode) {
        return oNode.xml;
    };
};

/**
 * strips tags from a markup string
 */
Sarissa.stripTags = function (s) {
    return s.replace(/<[^>]+>/g,"");
};
/**
 * <p>Deletes all child nodes of the given node</p>
 * @argument oNode the Node to empty
 */
Sarissa.clearChildNodes = function(oNode) {
    // need to check for firstChild due to opera 8 bug with hasChildNodes
    while(oNode.firstChild) {
        oNode.removeChild(oNode.firstChild);
    };
};
/**
 * <p> Copies the childNodes of nodeFrom to nodeTo</p>
 * <p> <b>Note:</b> The second object's original content is deleted before 
 * the copy operation, unless you supply a true third parameter</p>
 * @argument nodeFrom the Node to copy the childNodes from
 * @argument nodeTo the Node to copy the childNodes to
 * @argument bPreserveExisting whether to preserve the original content of nodeTo, default is false
 */
Sarissa.copyChildNodes = function(nodeFrom, nodeTo, bPreserveExisting) {
    if(_SARISSA_IS_SAFARI && nodeTo.nodeType == Node.DOCUMENT_NODE){ // SAFARI_OLD ??
        nodeTo = nodeTo.documentElement; //Appearantly there's a bug in safari where you can't appendChild to a document node
    }
    
    if((!nodeFrom) || (!nodeTo)){
        throw "Both source and destination nodes must be provided";
    };
    if(!bPreserveExisting){
        Sarissa.clearChildNodes(nodeTo);
    };
    var ownerDoc = nodeTo.nodeType == Node.DOCUMENT_NODE ? nodeTo : nodeTo.ownerDocument;
    var nodes = nodeFrom.childNodes;
    if(typeof(ownerDoc.importNode) != "undefined")  {
        for(var i=0;i < nodes.length;i++) {
            nodeTo.appendChild(ownerDoc.importNode(nodes[i], true));
        };
    } else {
        for(var i=0;i < nodes.length;i++) {
            nodeTo.appendChild(nodes[i].cloneNode(true));
        };
    };
};

/**
 * <p> Moves the childNodes of nodeFrom to nodeTo</p>
 * <p> <b>Note:</b> The second object's original content is deleted before 
 * the move operation, unless you supply a true third parameter</p>
 * @argument nodeFrom the Node to copy the childNodes from
 * @argument nodeTo the Node to copy the childNodes to
 * @argument bPreserveExisting whether to preserve the original content of nodeTo, default is
 */ 
Sarissa.moveChildNodes = function(nodeFrom, nodeTo, bPreserveExisting) {
    if((!nodeFrom) || (!nodeTo)){
        throw "Both source and destination nodes must be provided";
    };
    if(!bPreserveExisting){
        Sarissa.clearChildNodes(nodeTo);
    };
    var nodes = nodeFrom.childNodes;
    // if within the same doc, just move, else copy and delete
    if(nodeFrom.ownerDocument == nodeTo.ownerDocument){
        while(nodeFrom.firstChild){
            nodeTo.appendChild(nodeFrom.firstChild);
        };
    } else {
        var ownerDoc = nodeTo.nodeType == Node.DOCUMENT_NODE ? nodeTo : nodeTo.ownerDocument;
        if(typeof(ownerDoc.importNode) != "undefined") {
           for(var i=0;i < nodes.length;i++) {
               nodeTo.appendChild(ownerDoc.importNode(nodes[i], true));
           };
        }else{
           for(var i=0;i < nodes.length;i++) {
               nodeTo.appendChild(nodes[i].cloneNode(true));
           };
        };
        Sarissa.clearChildNodes(nodeFrom);
    };
};

/** 
 * <p>Serialize any object to an XML string. All properties are serialized using the property name
 * as the XML element name. Array elements are rendered as <code>array-item</code> elements, 
 * using their index/key as the value of the <code>key</code> attribute.</p>
 * @argument anyObject the object to serialize
 * @argument objectName a name for that object
 * @return the XML serializationj of the given object as a string
 */
Sarissa.xmlize = function(anyObject, objectName, indentSpace){
    indentSpace = indentSpace?indentSpace:'';
    var s = indentSpace  + '<' + objectName + '>';
    var isLeaf = false;
    if(!(anyObject instanceof Object) || anyObject instanceof Number || anyObject instanceof String 
        || anyObject instanceof Boolean || anyObject instanceof Date){
        s += Sarissa.escape(""+anyObject);
        isLeaf = true;
    }else{
        s += "\n";
        var itemKey = '';
        var isArrayItem = anyObject instanceof Array;
        for(var name in anyObject){
            s += Sarissa.xmlize(anyObject[name], (isArrayItem?"array-item key=\""+name+"\"":name), indentSpace + "   ");
        };
        s += indentSpace;
    };
    return s += (objectName.indexOf(' ')!=-1?"</array-item>\n":"</" + objectName + ">\n");
};

/** 
 * Escape the given string chacters that correspond to the five predefined XML entities
 * @param sXml the string to escape
 */
Sarissa.escape = function(sXml){
    return sXml.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

/** 
 * Unescape the given string. This turns the occurences of the predefined XML 
 * entities to become the characters they represent correspond to the five predefined XML entities
 * @param sXml the string to unescape
 */
Sarissa.unescape = function(sXml){
    return sXml.replace(/&apos;/g,"'")
        .replace(/&quot;/g,"\"")
        .replace(/&gt;/g,">")
        .replace(/&lt;/g,"<")
        .replace(/&amp;/g,"&");
};
//   EOF

////////////////////////////////////////////////////////////////////////////////////
// SARISSA_IEEMU_XPATH.JS CONTENTS
// * Sarissa cross browser XML library - IE XPath Emulation 
// * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
// *
// * This script emulates Internet Explorer's selectNodes and selectSingleNode
// * for Mozilla. Associating namespace prefixes with URIs for your XPath queries
// * is easy with IE's setProperty. 
// * USers may also map a namespace prefix to a default (unprefixed) namespace in the
// * source document with Sarissa.setXpathNamespaces
////////////////////////////////////////////////////////////////////////////////////
if(_SARISSA_HAS_DOM_FEATURE && document.implementation.hasFeature("XPath", "3.0")){
    /**
    * <p>SarissaNodeList behaves as a NodeList but is only used as a result to <code>selectNodes</code>,
    * so it also has some properties IEs proprietery object features.</p>
    * @private
    * @constructor
    * @argument i the (initial) list size
    */
    function SarissaNodeList(i){
        this.length = i;
    };
    /** <p>Set an Array as the prototype object</p> */
    SarissaNodeList.prototype = new Array(0);
    /** <p>Inherit the Array constructor </p> */
    SarissaNodeList.prototype.constructor = Array;
    /**
    * <p>Returns the node at the specified index or null if the given index
    * is greater than the list size or less than zero </p>
    * <p><b>Note</b> that in ECMAScript you can also use the square-bracket
    * array notation instead of calling <code>item</code>
    * @argument i the index of the member to return
    * @returns the member corresponding to the given index
    */
    SarissaNodeList.prototype.item = function(i) {
        return (i < 0 || i >= this.length)?null:this[i];
    };
    /**
    * <p>Emulate IE's expr property
    * (Here the SarissaNodeList object is given as the result of selectNodes).</p>
    * @returns the XPath expression passed to selectNodes that resulted in
    *          this SarissaNodeList
    */
    SarissaNodeList.prototype.expr = "";
    /** dummy, used to accept IE's stuff without throwing errors */
    if(window.XMLDocument && (!XMLDocument.prototype.setProperty)){
        XMLDocument.prototype.setProperty  = function(x,y){};
    };
    /**
    * <p>Programmatically control namespace URI/prefix mappings for XPath
    * queries.</p>
    * <p>This method comes especially handy when used to apply XPath queries
    * on XML documents with a default namespace, as there is no other way
    * of mapping that to a prefix.</p>
    * <p>Using no namespace prefix in DOM Level 3 XPath queries, implies you
    * are looking for elements in the null namespace. If you need to look
    * for nodes in the default namespace, you need to map a prefix to it
    * first like:</p>
    * <pre>Sarissa.setXpathNamespaces(oDoc, &quot;xmlns:myprefix=&amp;aposhttp://mynsURI&amp;apos&quot;);</pre>
    * <p><b>Note 1 </b>: Use this method only if the source document features
    * a default namespace (without a prefix), otherwise just use IE's setProperty
    * (moz will rezolve non-default namespaces by itself). You will need to map that
    * namespace to a prefix for queries to work.</p>
    * <p><b>Note 2 </b>: This method calls IE's setProperty method to set the
    * appropriate namespace-prefix mappings, so you dont have to do that.</p>
    * @param oDoc The target XMLDocument to set the namespace mappings for.
    * @param sNsSet A whilespace-seperated list of namespace declarations as
    *            those would appear in an XML document. E.g.:
    *            <code>&quot;xmlns:xhtml=&apos;http://www.w3.org/1999/xhtml&apos;
    * xmlns:&apos;http://www.w3.org/1999/XSL/Transform&apos;&quot;</code>
    * @throws An error if the format of the given namespace declarations is bad.
    */
    Sarissa.setXpathNamespaces = function(oDoc, sNsSet) {
        //oDoc._sarissa_setXpathNamespaces(sNsSet);
        oDoc._sarissa_useCustomResolver = true;
        var namespaces = sNsSet.indexOf(" ")>-1?sNsSet.split(" "):new Array(sNsSet);
        oDoc._sarissa_xpathNamespaces = new Array(namespaces.length);
        for(var i=0;i < namespaces.length;i++){
            var ns = namespaces[i];
            var colonPos = ns.indexOf(":");
            var assignPos = ns.indexOf("=");
            if(colonPos > 0 && assignPos > colonPos+1){
                var prefix = ns.substring(colonPos+1, assignPos);
                var uri = ns.substring(assignPos+2, ns.length-1);
                oDoc._sarissa_xpathNamespaces[prefix] = uri;
            }else{
                throw "Bad format on namespace declaration(s) given";
            };
        };
    };
    /**
    * @private Flag to control whether a custom namespace resolver should
    *          be used, set to true by Sarissa.setXpathNamespaces
    */
    XMLDocument.prototype._sarissa_useCustomResolver = false;
    /** @private */
    XMLDocument.prototype._sarissa_xpathNamespaces = new Array();
    /**
    * <p>Extends the XMLDocument to emulate IE's selectNodes.</p>
    * @argument sExpr the XPath expression to use
    * @argument contextNode this is for internal use only by the same
    *           method when called on Elements
    * @returns the result of the XPath search as a SarissaNodeList
    * @throws An error if no namespace URI is found for the given prefix.
    */
    XMLDocument.prototype.selectNodes = function(sExpr, contextNode, returnSingle){
        var nsDoc = this;
        var nsresolver = this._sarissa_useCustomResolver
        ? function(prefix){
            var s = nsDoc._sarissa_xpathNamespaces[prefix];
            if(s)return s;
            else throw "No namespace URI found for prefix: '" + prefix+"'";
            }
        : this.createNSResolver(this.documentElement);
        var result = null;
        if(!returnSingle){
            var oResult = this.evaluate(sExpr,
                (contextNode?contextNode:this),
                nsresolver,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var nodeList = new SarissaNodeList(oResult.snapshotLength);
            nodeList.expr = sExpr;
            for(var i=0;i<nodeList.length;i++)
                nodeList[i] = oResult.snapshotItem(i);
            result = nodeList;
        }
        else {
            result = oResult = this.evaluate(sExpr,
                (contextNode?contextNode:this),
                nsresolver,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        };
        return result;      
    };
    /**
    * <p>Extends the Element to emulate IE's selectNodes</p>
    * @argument sExpr the XPath expression to use
    * @returns the result of the XPath search as an (Sarissa)NodeList
    * @throws An
    *             error if invoked on an HTML Element as this is only be
    *             available to XML Elements.
    */
    Element.prototype.selectNodes = function(sExpr){
        var doc = this.ownerDocument;
        if(doc.selectNodes)
            return doc.selectNodes(sExpr, this);
        else
            throw "Method selectNodes is only supported by XML Elements";
    };
    /**
    * <p>Extends the XMLDocument to emulate IE's selectSingleNode.</p>
    * @argument sExpr the XPath expression to use
    * @argument contextNode this is for internal use only by the same
    *           method when called on Elements
    * @returns the result of the XPath search as an (Sarissa)NodeList
    */
    XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode){
        var ctx = contextNode?contextNode:null;
        return this.selectNodes(sExpr, ctx, true);
    };
    /**
    * <p>Extends the Element to emulate IE's selectSingleNode.</p>
    * @argument sExpr the XPath expression to use
    * @returns the result of the XPath search as an (Sarissa)NodeList
    * @throws An error if invoked on an HTML Element as this is only be
    *             available to XML Elements.
    */
    Element.prototype.selectSingleNode = function(sExpr){
        var doc = this.ownerDocument;
        if(doc.selectSingleNode)
            return doc.selectSingleNode(sExpr, this);
        else
            throw "Method selectNodes is only supported by XML Elements";
    };
    Sarissa.IS_ENABLED_SELECT_NODES = true;
};

////////////////////////////////////////////////////////////////////////////////////
// JSONCONV.JS CONTENTS
// The global object JSON contains two methods.
// JSON.stringify(value) takes a JavaScript value and produces a JSON text.
// The value must not be cyclical.
// JSON.parse(text) takes a JSON text and produces a JavaScript value. It will
// return false if there is an error.
////////////////////////////////////////////////////////////////////////////////////
var JSON = function()
{
    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    },
    s = {
        'function': function(x)
        {
            return null;
        },
        'boolean': function(x)
        {
            return '"' + String(x) + '"';
        },
        number: function(x)
        {
            return isFinite(x) ? '"' + String(x) + '"' : 'null';
        },
        string: function(x)
        {
            if (/(\\n)/.test(x)) x = x.Replace("\\n", "\n");
            if (/\u00B0/.test(x)) x = x.Replace("\u00B0", "&#176;") // degree sign
            if (/\u201D/.test(x)) x = x.Replace("\u201D", "&#8221;") // right quotation mark for inches unit
            if (/["\\\x00-\x1f\xc0-\xff]/.test(x))
            {
                x = x.replace(/([\x00-\x1f\\"\xc0-\xff])/g, function(a, b)
                {
                    var c = m[b];
                    if (c)
                    {
                        return c;
                    }
                    c = b.charCodeAt();
                    return '\\u00' +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                });
            }

            return '"' + x + '"';
        },
        object: function(x)
        {
            if (x)
            {
                var a = [], b, f, i, l, v;
                if (x instanceof Array || x.length)
                {
                    a[0] = '[';
                    l = x.length;
                    for (i = 0; i < l; i += 1)
                    {
                        v = x[i];
                        f = s[typeof v];
                        if (f)
                        {
                            v = f(v);
                            if (typeof v == 'string')
                            {
                                if (b)
                                {
                                    a[a.length] = ',';
                                }
                                a[a.length] = v;
                                b = true;
                            }
                        }
                    }
                    a[a.length] = ']';
                } else if (x instanceof Object || (typeof x) == "object")
                {
                    a[0] = '{';
                    for (i in x)
                    {
                        v = x[i];
                        f = s[typeof v];
                        if (f)
                        {
                            var go = true;
                            try { go = (x != v) } catch (err) { }
                            if (go && (x instanceof Object || (typeof x) == "object") &&
                                (i == "Row" || i == "BeginEdit" || i == "Delete" || i == "EndEdit" ||
                                    i == "get_DataView" || i == "get_Item" || i == "get_RowState" ||
                                    i == "get_Table" || i == "GetChildRows" || i == "GetParentRows" ||
                                    i == "set_Item")) go = false;
                            if (go)  // Recursive issue when dataview row refs itself.  
                            {
                                v = f(v);
                                if (typeof v == 'string')
                                {
                                    if (b)
                                    {
                                        a[a.length] = ',';
                                    }
                                    a.push(s.string(i), ':', v);
                                    b = true;
                                }
                            }
                        }
                    }
                    a[a.length] = '}';
                } else
                {
                    return;
                }
                return a.join('');
            }
            return 'null';
        }
    };
    return {
        copyright: '(c)2005 JSON.org',
        license: 'http://www.JSON.org/license.html',
        /*
        Stringify a JavaScript value, producing a JSON text.
        */
        stringify: function(v)
        {
            var f = s[typeof v];
            if (f)
            {
                v = f(v);
                if (typeof v == 'string')
                {
                    return v;
                }
            }
            return null;
        },
        /*
        Parse a JSON text, producing a JavaScript value.
        It returns false if there is a syntax error.
        */
        parse: function(text)
        {
            try
            {
                return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                    text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
                eval('(' + text + ')');
            } catch (e)
            {
                return false;
            }
        }
    };
} ();







