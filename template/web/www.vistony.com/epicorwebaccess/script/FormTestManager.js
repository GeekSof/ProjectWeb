var FormTestManager=function(){}
FormTestManager.CurrentStep = "load";
FormTestManager.KeyField = null;
FormTestManager.SearchError = null;
FormTestManager.NoSearchResults = false;
FormTestManager.Done = false;
FormTestManager.Queue = {};
FormTestManager.ClosedForms = {};   // TB
FormTestManager.HandleError=function(msg,url,line)
{
	if (Global.Form == null)
	{
    	try{window.external.FireError(FormTestManager.CurrentStep, errText);} catch(err){}
		return false;
	}
	else
	{
    	var fullFormName = Global.Form._assembly + "." + Global.Form.ID;
    	if(FormTestManager.ClosedForms[fullFormName]) return false;	

    	if(msg.StartsWith("Application error:") && msg.indexOf("4GL STOP condition:")==-1 && msg.indexOf("ERROR condition")==-1)
	    {
	        window.external.WriteMessage(FormTestManager.CurrentStep, msg);
	        if(FormTestManager.CurrentStep=="search") FormTestManager.NoSearchResults = true;
	        return false;
	    }
	}

    var errText = msg;
    if(line) errText = "Javascript runtime error: " + msg + ", Line:" + line;        
    
    if(Global.InstanceOf(Global.Form, "EpiSearchBase"))
    {
        var opener;
        if(Global.document.all)
            opener = Global.window.dialogArguments.Opener;
        else
            opener = Global.window.opener;
            
        if(opener.FormTestManager) opener.FormTestManager.SearchError = errText;
        
        Global.Form.Close();
    }
    else
    {
        FormTestManager.FireError(FormTestManager.CurrentStep, errText);  // TB
    }
    
    FormTestManager.Done = true;
}
FormTestManager.PerformTests=function()
{
    if(FormTestManager.Done) return;

    try{window.external.StepComplete("load");} catch(err){}
    
    // testing the load for UIRpt or UIProc forms.
    if(Global.Form._assembly.StartsWith("UIRpt") || Global.Form._assembly.StartsWith("UIProc"))
    {
        FormTestManager.DoneWithForm(); // TB
        
        return;
    }

    // Try search    
    FormTestManager.CurrentStep = "search";

    if(Global.Form.ID=="ATPForm")
        Global.Form.trans.OnButtonClick("Parameter.PartSearch");
    else
    {
        if(Global.Form.OnClickSearch)
            Global.Form.OnClickSearch(new SearchOptions(SearchMode.ShowDialog));
        else
            FormTestManager.NoSearchResults = true;
    }
        
    if(FormTestManager.ClosedForms[Global.Form._assembly + "." + Global.Form.ID]) return; 

    if(FormTestManager.SearchError!=null) 
    {
        FormTestManager.FireError("search", FormTestManager.SearchError);  // TB
        return;
    }

    if(FormTestManager.NoSearchResults)
    {
        try{window.external.StepComplete("search");} catch(err){}
        try{window.external.WriteMessage(FormTestManager.CurrentStep, "There were no search results.");} catch(err){}
        FormTestManager.DoneWithForm();
        return;
    }

    var keyFieldVal = null;
 
    if(Global.Form.ID=="LaborForm")
    {
        Global.document.getElementById("btnPayrollDate").click();
        if(FormTestManager.ClosedForms[Global.Form._assembly + "." + Global.Form.ID]) return; 
        
        if(FormTestManager.SearchError!=null) 
        {
            FormTestManager.FireError("search", FormTestManager.SearchError);  // TB
            return;
        }
        
        if(FormTestManager.NoSearchResults)
        {
            try{window.external.StepComplete("search");} catch(err){}
            try{window.external.WriteMessage(FormTestManager.CurrentStep, "There were no search results.");} catch(err){}
            FormTestManager.DoneWithForm();
            return;
        }
        
        FormTestManager.KeyField = Global.BindingEngine.Controls["txtEmpNum"];
        keyFieldVal = Global.BindingEngine.Controls["txtEmpNum"].get_Value();
        var laborDt = Global.BindingEngine.Controls["dtPayrollDate"].get_Value();
    }

    try{window.external.StepComplete("search");} catch(err){}
    
    if(FormTestManager.NoSearchResults) 
    {
        FormTestManager.DoneWithForm(); // TB
        
        return;
    }
       
    // Try clear
    FormTestManager.CurrentStep = "clear";
    Global.Form.OnClickClear();
    
    try{window.external.StepComplete("clear");} catch(err){}
        
    FormTestManager.DoneWithForm(); // TB
    
}
FormTestManager.PerformSearch=function()
{
    try
    {
        if(Global.Form.ID=="LaborSearchForm")
        {
            Global.BindingEngine.Controls["txtStartWith1"].set_Value("Manuel J. Labor");
        }
        Global.Form.DoSearch();
    }
    catch(err)
    {
        var opener;
        if(Global.document.all)
            opener = Global.window.dialogArguments.Opener;
        else
            opener = Global.window.opener;
            
        if(opener.FormTestManager) opener.FormTestManager.SearchError = err.message;

        Global.Form.Close();
    }
    if(Global.BindingEngine.Controls["ugdSearchResults"].get_RowCount()>1)
    {
        Global.Form.OnClickOk();
    }
    else
    {
        var opener;
        if(Global.document.all)
            opener = Global.window.dialogArguments.Opener;
        else
            opener = Global.window.opener;
            
        if(opener.FormTestManager) opener.FormTestManager.NoSearchResults = true;    
    
        Global.Form.OnClickCancel();
    }
}
FormTestManager.RegisterKeyField=function(obj)
{
    if(!(obj instanceof EpiButton))
    {
        if(!this.KeyField) this.KeyField = obj;    
    }
}
FormTestManager.MessageBox=function(a)
{
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "":
        case "String":
        case "IWin32Window_String":
        case "String_String":
        case "IWin32Window_String_String":
            return DialogResult.OK;
            break;
        case "String_String_MessageBoxButtons":
        case "String_String_MessageBoxButtons_MessageBoxIcon":
        case "String_String_MessageBoxButtons_MessageBoxIcon_MessageBoxDefaultButton":
        case "String_String_MessageBoxButtons_MessageBoxIcon_MessageBoxDefaultButton_MessageBoxOptions":
            return FormTestManager._getDialogResult(a[2]);
            break;
        case "IWin32Window_String_String_MessageBoxButtons":
        case "IWin32Window_String_String_MessageBoxButtons_MessageBoxIcon":
        case "IWin32Window_String_String_MessageBoxButtons_MessageBoxIcon_MessageBoxDefaultButton":
        case "IWin32Window_String_String_MessageBoxButtons_MessageBoxIcon_MessageBoxDefaultButton_MessageBoxOptions":
            return FormTestManager._getDialogResult(a[3]);
            break;
    }
}
FormTestManager._getDialogResult=function(mbb)
{
    switch(mbb)
    {
        case MessageBoxButtons.AbortRetryIgnore:
            return DialogResult.Abort;
            break;
        case MessageBoxButtons.OK:
        case MessageBoxButtons.OKCancel:
            return DialogResult.OK;
            break;
        case MessageBoxButtons.RetryCancel:
            return DialogResult.Cancel;
            break;
        case MessageBoxButtons.YesNo:
        case MessageBoxButtons.YesNoCancel:
            return DialogResult.Yes;
            break;
    }
    return DialogResult.OK;
}
FormTestManager.CloseForm=function()
{
    if(Global.InstanceOf(Global.Form,"EpiSearchBase"))
    {
        Global.window.close();
    }
    else
    {
        if (FormTestManager.Done) return;
        FormTestManager.Done = true;
        try{window.external.WriteMessage("close", "FormTestManager Message: Apps code closed the form.");} catch(err){}             
        FormTestManager.DoneWithForm(); // TB  
    }
}

FormTestManager.ValidateSearchName=function(searchName)
{
    var result = false;
    
    try{ 
        if(window.external.ValidateSearchForm(searchName))
		    result = true;
	   }
	catch(err){}
	
	return result;
	
}

// TB Start -------------
FormTestManager.FireError = function(step,errText)
{
    var fullFormName = Global.Form._assembly + "." + Global.Form.ID;
    FormTestManager.ClosedForms[fullFormName] = true;
    try{window.external.FireError(step, errText);} catch(err){}
}
FormTestManager.DoneWithForm = function()
{
    var fullFormName = Global.Form._assembly + "." + Global.Form.ID;
    FormTestManager.ClosedForms[fullFormName] = true;
    try{window.external.DoneWithForm();} catch(err){}
}
// TB End --------------
window.onerror = FormTestManager.HandleError;

