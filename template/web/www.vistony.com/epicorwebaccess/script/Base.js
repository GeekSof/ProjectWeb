
function retrieve(ctrl, ctrlStruct)
{   
    window.status = "Retrieving...";
    if (typeof (trans) == "undefined")
    {
        var myForm = ctrlStruct.FindForm();
        if (myForm)
            myForm.trans.adapterGetByID(ctrl.value);
    }
    else
    trans.adapterGetByID(ctrl.value);
    window.status = "";
}

function update()
{
    window.status = "Saving...";
    if (typeof (trans) == "undefined")
    {
        // we know the first element is the form element, so we 
        // will be exiting the loop on the first iteration itself.
        for (ctrlObj in Global.BindingEngine.Controls) 
        {
            var ctrlStruct = Global.BindingEngine.Controls[ctrlObj];
            if (ctrlStruct.TypeName=="EpiBaseForm")
            {
                ctrlStruct.trans.adapterUpdate();
                break;
            }
        }
    }
    else
    trans.adapterUpdate();
        
    window.status = "";
}

function clearData()
{
    if (typeof (trans) == "undefined")
    {
        // we know the first element is the form element, so we 
        // will be exiting the loop on the first iteration itself.
        for (ctrlObj in Global.BindingEngine.Controls) 
        {
            var ctrlStruct = Global.BindingEngine.Controls[ctrlObj];
            if (ctrlStruct.TypeName=="EpiBaseForm")
            {
                ctrlStruct.OnClickClear();
                break;
            }
        }
    }
    else
    trans.adapterClear();
    
}

function tab_onactivate(tabPanel)
{
    Global.BindingEngine.BindTab(tabPanel);
}

function field_onchange(ctrl)
{
    var ctrlStruct = Global.BindingEngine.Controls[ctrl.id];
    ctrlStruct.OnValidating(ctrl);
    
//    if(ctrlStruct)
//    {
//        if(ctrlStruct.EpiKeyField)
//        {
//            retrieve(ctrl, ctrlStruct);
//        }
//        else if(ctrlStruct.DataColumn && ctrlStruct.DataView)
//        {
//            Global.BindingEngine.OnChange(ctrl);
//        }
//    }
}

function navbutton_onclick(ctrl,to)
{
    Global.BindingEngine.OnPage(ctrl,to);
}

function row_onclick(ctrl)
{
    Global.BindingEngine.OnRowClick(ctrl);    
}

function getParentNodeByTagName(oNode, parentTagName, skipCurrentFlag)
{
	var oCurrentNode;
	
	if(skipCurrentFlag) 
		oCurrentNode = oNode.parentElement;
	else
		oCurrentNode = oNode;
	
	while(oCurrentNode && oCurrentNode.tagName != parentTagName && oCurrentNode)
	{
		oCurrentNode = oCurrentNode.parentNode;
	}
	
	return oCurrentNode;
}

function replaceString(str, origChar, replaceChar)
{
	do 
	{ 
		str = str.replace(origChar, replaceChar);
	}  
	while (str.indexOf(origChar) > 0);
	
	return str;
}

var gPerformance1;
function performanceTestStart()
{
   d = new Date();
   gPerformance1 = parseInt((((d.getMinutes()*60) + d.getSeconds())* 1000) + d.getMilliseconds());
}

function performanceTestEnd()
{
	d = new Date();
	perf2 = parseInt((((d.getMinutes()*60) + d.getSeconds())* 1000) + d.getMilliseconds());
	
	alert((perf2 - gPerformance1) + " milliseconds");
}


