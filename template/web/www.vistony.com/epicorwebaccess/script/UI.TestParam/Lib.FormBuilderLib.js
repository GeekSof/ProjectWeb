Global.Assemblies["UI.TestParam"] = new Assembly("UI.TestParam");

Global.Using("System");
Global.Using("System.Collections.Generic");
Global.Using("System.Text");


Global.AddNamespace("Epicor.Mfg.Lib.FormBuilderLib");

//------------------------------
//  FieldMappingAttribute
//------------------------------
var FieldMappingAttribute=Epicor.Mfg.Lib.FormBuilderLib.FieldMappingAttribute = function()
{
    this._assembly="UI.TestParam";
    this.id="FormId";
    this.controlType="ControlType";
    this.controlID="ControlId";
    this.defaultValue="DefaultValue";
    this.dataSource="DataSource";
    this.controlLabel="ControlLabel";
    this.controlFormat="ControlFormat";
    this.displayMember="DisplayMember";
    this.valueMember="ValueMember";
    this.valueSeq="ValueSeq";
    this.mandatory="Mandatory";
    this.parentID="ParentId";
    this.displayOrder="DisplayOrder";
    Attribute.call(this);
    this.ctor.apply(this,arguments);
}
FieldMappingAttribute.prototype=new Attribute();
FieldMappingAttribute.prototype.get_ID=function()
{
    return this.id;
    
}
FieldMappingAttribute.prototype.set_ID=function(value)
{
    this.id=value;
    
}
FieldMappingAttribute.prototype.get_ControlType=function()
{
    return this.controlType;
    
}
FieldMappingAttribute.prototype.set_ControlType=function(value)
{
    this.controlType=value;
    
}
FieldMappingAttribute.prototype.get_ControlID=function()
{
    return this.controlID;
    
}
FieldMappingAttribute.prototype.set_ControlID=function(value)
{
    this.controlID=value;
    
}
FieldMappingAttribute.prototype.get_DefaultValue=function()
{
    return this.defaultValue;
    
}
FieldMappingAttribute.prototype.set_DefaultValue=function(value)
{
    this.defaultValue=value;
    
}
FieldMappingAttribute.prototype.get_DataSource=function()
{
    return this.dataSource;
    
}
FieldMappingAttribute.prototype.set_DataSource=function(value)
{
    this.dataSource=value;
    
}
FieldMappingAttribute.prototype.get_ControlLabel=function()
{
    return this.controlLabel;
    
}
FieldMappingAttribute.prototype.set_ControlLabel=function(value)
{
    this.controlLabel=value;
    
}
FieldMappingAttribute.prototype.get_ControlFormat=function()
{
    return this.controlFormat;
    
}
FieldMappingAttribute.prototype.set_ControlFormat=function(value)
{
    this.controlFormat=value;
    
}
FieldMappingAttribute.prototype.get_DisplayMember=function()
{
    return this.displayMember;
    
}
FieldMappingAttribute.prototype.set_DisplayMember=function(value)
{
    this.displayMember=value;
    
}
FieldMappingAttribute.prototype.get_ValueMember=function()
{
    return this.valueMember;
    
}
FieldMappingAttribute.prototype.set_ValueMember=function(value)
{
    this.valueMember=value;
    
}
FieldMappingAttribute.prototype.get_ValueSeq=function()
{
    return this.valueSeq;
    
}
FieldMappingAttribute.prototype.set_ValueSeq=function(value)
{
    this.valueSeq=value;
    
}
FieldMappingAttribute.prototype.get_Mandatory=function()
{
    return this.mandatory;
    
}
FieldMappingAttribute.prototype.set_Mandatory=function(value)
{
    this.mandatory=value;
    
}
FieldMappingAttribute.prototype.get_ParentID=function()
{
    return this.parentID;
    
}
FieldMappingAttribute.prototype.set_ParentID=function(value)
{
    this.parentID=value;
    
}
FieldMappingAttribute.prototype.get_DisplayOrder=function()
{
    return this.displayOrder;
    
}
FieldMappingAttribute.prototype.set_DisplayOrder=function(value)
{
    this.displayOrder=value;
    
}
Global.Using("System.Data");
Global.Using("Epicor.Mfg.UI");
Global.Using("Epicor.Mfg.UI.FrameWork");




//------------------------------
//  FormBuilderTransaction
//------------------------------
var FormBuilderTransaction=Epicor.Mfg.Lib.FormBuilderLib.FormBuilderTransaction = function(Sender)
{
    if (!Sender) return;
    this._assembly="UI.TestParam";
    this.Name="FormBuilderTransaction";
    this.Args=[];
    for(var i=0,a; a=arguments[i]; i++) {this.Args.push(a);}
    this.isInButtonClick=false ;
    EpiSingleViewTransaction.call(this, {doProcessing:true},"FormBuilderTransaction");
    FormBuilderTransaction.prototype.ctor.call(this,Sender);
}
FormBuilderTransaction.prototype=new EpiSingleViewTransaction();
FormBuilderTransaction.prototype.get_InstanceID=function()
{
    
}
FormBuilderTransaction.prototype.get_CtrlTable=function()
{
    
}
FormBuilderTransaction.prototype.get_CtrlValuesTable=function()
{
    
}
FormBuilderTransaction.prototype.get_FormText=function()
{
    
}
FormBuilderTransaction.prototype.get_FormGUID=function()
{
    
}
FormBuilderTransaction.prototype.get_FormName=function()
{
    
}
FormBuilderTransaction.prototype.get_ViewName=function()
{
    
}
FormBuilderTransaction.prototype.get_AcceptButtonId=function()
{
    
}
FormBuilderTransaction.prototype.get_CancelButtonId=function()
{
    
}
FormBuilderTransaction.prototype.get_IsDeveloperMode=function()
{
    var currentSession=Global.As(this.get_Session(),"Session");
    if(currentSession != null)
    {
        if(currentSession["Customizing"] != null)
        {
            return Convert.ToBoolean(currentSession["Customizing"]);
            
        }
        else 
        {
            return false ;
            
        }
        
    }
    else 
    {
        return false ;
        
    }
    
}
FormBuilderTransaction.prototype.ctor=function(Sender)
{
    //this.FieldMapping=FormBuilderTransaction.GetAttribute(this);
    if(this.FieldMapping == null)
    {
        throw new ArgumentException("You should define FieldMapping attribute for class " + Global.GetType(this).toString(),new EpiOverloadedArgs("String"));
    }
    
}

FormBuilderTransaction.prototype.AddExraControls=function(dataRowView)
{
    return false ;
    
}
FormBuilderTransaction.prototype.GetFormTitle=function(defaultText)
{
    
}
FormBuilderTransaction.prototype.GetButtons=function()
{
    var buttonSetId=InfoPromptMisc.GetButtonSetId(this.get_InstanceID(),this.get_CtrlTable());
    var result=new DataView(this.get_CtrlValuesTable(),new EpiOverloadedArgs("DataTable"));
    result.set_RowFilter(this.FieldMapping.ParentID + "='" + buttonSetId + "'");
    result.set_Sort(this.FieldMapping.ValueSeq);
    return result;
    
}
FormBuilderTransaction.prototype.GetMandatoryViolationText=function()
{
    var message=new StringBuilder(new EpiOverloadedArgs(""));
    var selectableControlText=EpiString.GetString("Mandatory_ValueMissed");
    var editorControlText=EpiString.GetString("Mandatory_Empty");
    var fieldDescription=this.GetFields();
    for(var i=0;i < fieldDescription.Rows.length;i++)
    {
        var columnName=this.GetFieldName(fieldDescription.get_Row(i).get_Item(this.FieldMapping.DataSource).toString());
        var isMandatory=Convert.ToBoolean(fieldDescription.get_Row(i).get_Item(this.FieldMapping.Mandatory));
        if(isMandatory && this.IsFieldNull(columnName))
        {
            var fieldLabel=fieldDescription.get_Row(i).get_Item(this.FieldMapping.ControlLabel).toString().TrimEnd(":"," ");
            if(fieldDescription.get_Row(i).get_Item(this.FieldMapping.ControlType).toString() == FormBuilderConstants.ControlTypeStandard)
            {
                message.AppendFormat(selectableControlText,fieldLabel,new EpiOverloadedArgs("String_Object"));
                
            }
            else 
            {
                message.AppendFormat(editorControlText,fieldLabel,new EpiOverloadedArgs("String_Object"));
                
            }
            message.AppendLine(new EpiOverloadedArgs(""));
            
        }
        
    }
    return message.toString();
    
}
FormBuilderTransaction.prototype.GetFieldValues=function(controlId)
{
    var result=new DataView(this.get_CtrlValuesTable(),new EpiOverloadedArgs("DataTable"));
    result.set_RowFilter(this.FieldMapping.ParentID + "='" + controlId + "'");
    result.set_Sort(this.FieldMapping.ValueSeq);
    return result;
    
}
FormBuilderTransaction.prototype.OnButtonClick_1=function(epiBinding)
{
    if(this.isInButtonClick)
    {
        return;
        
    }
    try
    {
        this.isInButtonClick=true ;
        var buttonId;
        if(!({_call:function(me){var _ret_=Int32.TryParse(me.GetFieldName(epiBinding),buttonId,new EpiOverloadedArgs("String_Int32"));buttonId=Global.ArgManager["Out1"];return _ret_; }})._call(this))
        {
            buttonId=-1;
            
        }
        if(buttonId != this.get_CancelButtonId())
        {
            var validationMessage=this.GetMandatoryViolationText();
            if(validationMessage.length > 0)
            {
                ExceptionBox.Show(new Epicor.Mfg.Common.BusinessObjectException(validationMessage,new EpiOverloadedArgs("String")),new EpiOverloadedArgs("Exception"));
                return;
                
            }
            this.OnNonCancelButtonClick(buttonId);
            
        }
        else 
        {
            this.OnUndo();
            this.OnCancelButtonClick();
            
        }
        EpiSingleViewTransaction.prototype.get_EpiBaseForm().Close.call(this);
        
    }
    finally
    {
        this.isInButtonClick=false ;
        
    }
    
}
FormBuilderTransaction.prototype.GetFieldType=function(binding)
{
    
}
FormBuilderTransaction.prototype.GetFields=function()
{
    var result=new DataView(this.get_CtrlTable(),new EpiOverloadedArgs("DataTable"));
    result.set_RowFilter(this.GetFieldsFilter());
    result.set_Sort(this.FieldMapping.DisplayOrder);
    return result;
    
}
FormBuilderTransaction.prototype.LoadDefaultValues=function()
{
    
}
FormBuilderTransaction.prototype.OnNonCancelButtonClick=function(buttonID)
{
    
}
FormBuilderTransaction.GetAttribute=function(t)
{
    return Attribute.GetCustomAttribute(t,FieldMappingAttribute,new EpiOverloadedArgs("MemberInfo_Type"));
    
}
FormBuilderTransaction.prototype.OnCancelButtonClick=function()
{
    
}
FormBuilderTransaction.prototype.LoadFormat=function()
{
    
}
FormBuilderTransaction.prototype.GetFieldName=function(binding)
{
    var bindingPath=binding.Split(".",new EpiOverloadedArgs("CharArr"));
    return bindingPath[bindingPath.length - 1];
    
}
FormBuilderTransaction.prototype.IsFieldNull=function(fieldName)
{
    
}
FormBuilderTransaction.prototype.GetFieldsFilter=function()
{
    return InfoPromptMisc.GetFieldsFilter();
    
}




//------------------------------
//  FormBuilderConstants
//------------------------------
var FormBuilderConstants=Epicor.Mfg.Lib.FormBuilderLib.FormBuilderConstants = function()
{
    this._assembly="UI.TestParam";
    EpiObject.call(this,"FormBuilderConstants");
    this.ctor.apply(this,arguments);
}
FormBuilderConstants.prototype=new EpiObject();
FormBuilderConstants.BPMDataPasswordField="Password";
FormBuilderConstants.BPMDataButtonField="ButtonValue";
FormBuilderConstants.PasswordFieldBinding="BPMData.Password";
FormBuilderConstants.ButtonFieldBinding="BPMData.ButtonValue";
FormBuilderConstants.ControlTypeStandard="Standard";
FormBuilderConstants.ControlTypeButtonSet="ButtonSet";
FormBuilderConstants.ControlTypeCombo="Combo";
FormBuilderConstants.ControlTypeRadioSet="RadioSet";
FormBuilderConstants.ControlTypePassword="PasswordField";
FormBuilderConstants.DropDown="DropDown";
FormBuilderConstants.DropDownBAQ="DropDownBAQ";
FormBuilderConstants.DropDownUserCodes="DropDownUserCodes";




//------------------------------
//  InfoPromptMisc
//------------------------------
var InfoPromptMisc=Epicor.Mfg.Lib.FormBuilderLib.InfoPromptMisc = function()
{
    this._assembly="UI.TestParam";
    EpiObject.call(this,"InfoPromptMisc");
    this.ctor.apply(this,arguments);
}
InfoPromptMisc.prototype=new EpiObject();
InfoPromptMisc.GetButtonSetId=function(formId,ctrlTable)
{
    var result=String.Empty;
    var rows=InfoPromptMisc.GetButtonRows(formId,ctrlTable);
    if(rows.length == 1)
    {
        result=rows[0].get_Item("ControlID").toString();
        
    }
    return result;
    
}
InfoPromptMisc.GetStringLines=function(format)
{
    var result=0;
    format=format.toUpperCase(new EpiOverloadedArgs(""));
    format=format.Trim(" ","X","(",")",new EpiOverloadedArgs("CharArr"));
    var formatParts=format.Split(",",new EpiOverloadedArgs("CharArr"));
    if(formatParts.length == 2)
    {
        ({_call:function(me){var _ret_=Int32.TryParse(formatParts[1],result,new EpiOverloadedArgs("String_Int32"));result=Global.ArgManager["Out1"];return _ret_; }})._call(this);
        
    }
    return result;
    
}
InfoPromptMisc.GetFieldsFilter=function()
{
    return "not (ControlType='" + FormBuilderConstants.ControlTypeButtonSet + "')";
    
}
InfoPromptMisc.NormalizeFormat=function(format)
{
    if(!String.IsNullOrEmpty(format))
    {
        var formatParts=format.Split(",",new EpiOverloadedArgs("CharArr"));
        if(formatParts.length > 1 && formatParts[0].toUpperCase(new EpiOverloadedArgs("")).Contains("X("))
        {
            return formatParts[0] + ")";
            
        }
        
    }
    return format;
    
}
InfoPromptMisc.GetButtonRows=function(formId,ctrlTable)
{
    return ctrlTable.Select("FormId='" + formId.Replace("'","''",new EpiOverloadedArgs("String_String")) + "' and ControlType='" + FormBuilderConstants.ControlTypeButtonSet + "'",new EpiOverloadedArgs("String"));
    
}
InfoPromptMisc.GetDefaultButtonId=function(formId,ctrlTable)
{
    var rows=InfoPromptMisc.GetButtonRows(formId,ctrlTable);
    var result;
    if(rows.length == 1 && ({_call:function(me){var _ret_=Int32.TryParse(rows[0].get_Item("DefaultValue").toString(),result,new EpiOverloadedArgs("String_Int32"));result=Global.ArgManager["Out1"];return _ret_; }})._call(this))
    {
        return result;
        
    }
    return -1;
    
}
