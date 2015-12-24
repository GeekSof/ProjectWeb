Global.Assemblies["UI.TestParam"] = new Assembly("UI.TestParam");

Global.Using("System");
Global.Using("Epicor.Mfg.UI");
Global.Using("System.Drawing");


Global.AddNamespace("Epicor.Mfg.Lib.Custom");
var ControlType={"Standard":0,"RadioSet":1,"DropDown":2,"DropDownBAQ":3,"DropDownUserCodes":4,"ItemList":5};

//------------------------------
//  ColumnTypes
//------------------------------
var ColumnTypes=Epicor.Mfg.Lib.Custom.ColumnTypes = function()
{
    this._assembly="UI.TestParam";
    EpiObject.call(this,"ColumnTypes");
    this.ctor.apply(this,arguments);
}
ColumnTypes.prototype=new EpiObject();
var FieldDataType=Epicor.Mfg.Lib.Custom.ColumnTypes.FieldDataType={"Character":0,"Integer":1,"Decimal":2,"Date":3,"DateTime":4,"Logical":5};
ColumnTypes.DefaultFormat=function(typeName)
{
    switch(typeName.toUpperCase(new EpiOverloadedArgs("")))
    {
        case "CHARACTER":
            return "x(8)";
        
        
        case "INTEGER":
            return "->>,>>>,>>9";
        
        
        case "DECIMAL":
            return "->>,>>9.99";
        
        
        case "LOGICAL":
            return "yes/no";
        
        
        case "DATE":
            return "99/99/99";
        
        
        case "DATETIME":
            return "99/99/99 HH:MM:SS.SSS";
        
        
    }
    return "x(8)";
    
}
ColumnTypes.TypeImage=function(typeName)
{
    switch(typeName.toUpperCase(new EpiOverloadedArgs("")))
    {
        case "CHARACTER":
            return EpiUIImages.GetImage("TypeCharacter",new EpiOverloadedArgs("String"));
        
        
        case "INTEGER":
            return EpiUIImages.GetImage("TypeInteger",new EpiOverloadedArgs("String"));
        
        
        case "DECIMAL":
            return EpiUIImages.GetImage("TypeDecimal",new EpiOverloadedArgs("String"));
        
        
        case "LOGICAL":
            return EpiUIImages.GetImage("TypeBool",new EpiOverloadedArgs("String"));
        
        
        case "DATE":
            return EpiUIImages.GetImage("TypeDateTime",new EpiOverloadedArgs("String"));
        
        
        case "DATETIME":
            return EpiUIImages.GetImage("TypeDate",new EpiOverloadedArgs("String"));
        
        
    }
    return EpiUIImages.GetImage("TypeHex",new EpiOverloadedArgs("String"));
    
}
ColumnTypes.StringType2Enum=function(typeName)
{
    switch(typeName.toUpperCase(new EpiOverloadedArgs("")))
    {
        case "CHARACTER":
            return FieldDataType.Character;
        
        
        case "INTEGER":
            return FieldDataType.Integer;
        
        
        case "DECIMAL":
            return FieldDataType.Decimal;
        
        
        case "LOGICAL":
            return FieldDataType.Logical;
        
        
        case "DATE":
            return FieldDataType.DateTime;
        
        
        case "DATETIME":
            return FieldDataType.DateTime;
        
        
        default:
            throw new Exception("Unknown type " + typeName,new EpiOverloadedArgs("String"));
        
    }
    
}
ColumnTypes.ConvertTypeFromEnum=function(enumVal)
{
    switch(enumVal)
    {
        case FieldDataType.Character:
            return "System.String";
        
        
        case FieldDataType.Integer:
            return "System.Int32";
        
        
        case FieldDataType.Decimal:
            return "System.Decimal";
        
        
        case FieldDataType.Date:
            return "System.Int32";
        
        
        case FieldDataType.DateTime:
            return "DateTime";
        
        
        case FieldDataType.Logical:
            return "System.Boolean";
        
        
    }
    return "System.String";
    
}

Global.Using("System");
Global.Using("System.Collections.Generic");
Global.Using("System.Text");
Global.Using("Epicor.Mfg.Lib.Custom.Forms");
Global.Using("Epicor.Mfg.Lib.FormBuilderLib");
Global.Using("System.Windows.Forms");
Global.Using("Epicor.Mfg.BO");
Global.Using("Epicor.Mfg.UI.App");
Global.Using("Epicor.Mfg.UI.FrameWork");
Global.Using("Epicor.Mfg.UI");
Global.Using("System.Data");
Global.Using("Epicor.Mfg.UI.Adapters");


Global.AddNamespace("Epicor.Mfg.Lib.Custom.Transactions");
//------------------------------
//  TestParamTransaction
//------------------------------
var TestParamTransaction=Epicor.Mfg.Lib.Custom.Transactions.TestParamTransaction = function(sender)
{
    this._assembly="UI.TestParam";
    this.SetValuesDataSet=new DataSet("SetItemsDataSet",new EpiOverloadedArgs("String"));
    FormBuilderTransaction.call(this,sender);
    TestParamTransaction.prototype.ctor.call(this,sender);
}
TestParamTransaction.prototype=new FormBuilderTransaction();
TestParamTransaction.extPropTypeKey="OETYPE";
TestParamTransaction.extPropCtrlTypeKey="CTRLTYPE";
TestParamTransaction.prototype.FieldMapping = {"DisplayOrder":"DataSource","ControlFormat":"FieldFormat","ControlLabel":"DataSource","ParentID":"ControlID","ValueSeq":"Seq","DisplayMember":"Val","ValueMember":"Id","Mandatory":"IsMandatory", "ID":"FormId","ControlType":"ControlType","ControlID":"ControlId","DefaultValue":"DefaultValue","DataSource":"DataSource"};

TestParamTransaction.prototype.get_CtrlTable=function()
{
    return this.dvCtrl.Table;
    
}
TestParamTransaction.prototype.get_CtrlValuesTable=function()
{
    return this.dvCtrlValues.Table;
    
}
TestParamTransaction.prototype.get_FormGUID=function()
{
    return Guid.NewGuid().toString();
    
}
TestParamTransaction.prototype.get_FormName=function()
{
    return this.get_EpiBaseForm().get_Name();
    
}
TestParamTransaction.prototype.get_FormText=function()
{
    return "Enter param value";
    
}
TestParamTransaction.prototype.get_InstanceID=function()
{
    return "1";
    
}
TestParamTransaction.prototype.get_AcceptButtonId=function()
{
    return 0;
    
}
TestParamTransaction.prototype.get_CancelButtonId=function()
{
    return 1;
    
}
TestParamTransaction.prototype.get_ViewName=function()
{
    return "Main";
    
}
TestParamTransaction.prototype.findCtrlRow=function(paramName)
{
    var nRow=this.dvCtrl.Find(paramName,new EpiOverloadedArgs("Object"));
    if(nRow >= 0)
    {
        return Global.As(this.dvCtrl.get_Row(nRow),"QueryCtrlDesignerRow");
        
    }
    return null;
    
}
TestParamTransaction.prototype.Update=function()
{
    throw new Exception("The method or operation is not implemented.",new EpiOverloadedArgs("String"));
}
TestParamTransaction.prototype.TransactionLoad=function()
{
    
}
TestParamTransaction.prototype.getSubstItemSet=function(columnName,dataType)
{
    var rowFilter=this.substTable.get_DefaultView().get_RowFilter();
    try
    {
        this.substTable.get_DefaultView().set_RowFilter("ParameterName = '" + columnName + "'");
        var tblValues=this.InitSetValuesDataTable(columnName,dataType);
        for(var row in this.substTable.get_DefaultView().Rows)
        {
            row=this.substTable.get_DefaultView().get_Row(row);
            tblValues.AddRow([columnName,row.get_Item("ParameterValue"),"","A"],new EpiOverloadedArgs("ObjectArr"));
            
        }
        
    }
    catch(_err)
    {
        
        {
            var ex=_err;
            ExceptionBox.Show(ex,new EpiOverloadedArgs("Exception"));
            
        }
        
    }
    finally
    {
        this.substTable.get_DefaultView().set_RowFilter(rowFilter);
        
    }
    
}
TestParamTransaction.prototype.fillBAQCombo=function(combo,ctrlValues)
{
    try
    {
        if(this.dynAdap == null)
        {
            this.dynAdap=new DynamicQueryAdapter(this);
            this.dynAdap.BOConnect();
            
        }
        QueryCtrlTransaction.FillBAQCombo(combo,ctrlValues,this.dynAdap);
        
    }
    catch(_err)
    {
        
        {
            var ex=_err;
            ExceptionBox.Show(ex,new EpiOverloadedArgs("Exception"));
            
        }
        
    }
    
}
TestParamTransaction.prototype.OnCancelButtonClick=function()
{
    this.get_EpiBaseForm().set_DialogResult(DialogResult.Cancel);
    
}
TestParamTransaction.prototype.GetByID=function(id)
{
    throw new Exception("The method or operation is not implemented.",new EpiOverloadedArgs("String"));
}
TestParamTransaction.prototype.InvokeSearch=function(o)
{
    
}
TestParamTransaction.prototype.LoadParameters=function()
{
    try
    {
        this.paramMapDataset=this.CreateDataSet();
        this.Fill();
        
    }
    catch(_err)
    {
        
        {
            var ex=_err;
            ExceptionBox.Show(ex,new EpiOverloadedArgs("Exception"));
            return false ;
            
        }
        
    }
    return true ;
    
}
TestParamTransaction.prototype.CreateDataSet=function()
{
    var dataSet=new DataSet("SubstitutionDataSet",new EpiOverloadedArgs("String"));
    var dataTable=dataSet.AddTable("Main",new EpiOverloadedArgs("String"));
    var companyCol=dataTable.AddColumn("Company",System.String,new EpiOverloadedArgs("String_Type"));
    this.dvParams.set_Sort("ParameterName");
    this.dvCtrl.set_Sort("DataSource");
    this.dvCtrl.set_RowFilter(this.GetFieldsFilter());
    for(var dr in this.dvParams.Rows)
    {
        dr=this.dvParams.get_Row(dr);
        var row=Global.As(dr,"QueryParameterDesignerRow");
        var paramName=row.get_Item("ParameterName");
        var ctrlRow=this.findCtrlRow(paramName);
        if(ctrlRow != null)
        {
            var col=dataTable.AddColumn(row.get_Item("ParameterName"),ColumnTypes.ConvertTypeFromEnum(ColumnTypes.StringType2Enum(ctrlRow.get_Item("DataType"))),new EpiOverloadedArgs("String_Type"));
            col.ExtendedProperties.set_Item(TestParamTransaction.extPropTypeKey,ctrlRow.get_Item("DataType"));
            col.ExtendedProperties.set_Item(TestParamTransaction.extPropCtrlTypeKey,ctrlRow.get_Item("ControlType"));
            
        }
        else 
        {
            throw new Exception("Unable to find control for parameter " + paramName,new EpiOverloadedArgs("String"));
        }
        
    }
    dataTable.AddColumn("RowIdent",System.String,new EpiOverloadedArgs("String_Type"));
    dataTable.AddColumn("RowMod",System.String,new EpiOverloadedArgs("String_Type"));
    dataTable.set_PrimaryKey([companyCol]);
    return dataSet;
    
}
TestParamTransaction.prototype.GetButtons=function()
{
    var dataTable=new DataTable("buttons",new EpiOverloadedArgs("String"));
    dataTable.AddColumn(this.FieldMapping.DisplayMember,System.String,new EpiOverloadedArgs("String_Type"));
    dataTable.AddColumn(this.FieldMapping.ControlID,System.String,new EpiOverloadedArgs("String_Type"));
    dataTable.AddColumn(this.FieldMapping.ValueSeq,System.Int32,new EpiOverloadedArgs("String_Type"));
    var r=dataTable.NewRow();
    r[this.FieldMapping.DisplayMember] = "OK";
    r[this.FieldMapping.ControlID]=Guid.NewGuid().ToString();
    r[this.FieldMapping.ValueSeq]=this.get_AcceptButtonId();
    dataTable.AddRow(r,new EpiOverloadedArgs("DataRow"));
    r=dataTable.NewRow();
    r[this.FieldMapping.DisplayMember] = "Cancel";
    r[this.FieldMapping.ControlID]=Guid.NewGuid().ToString();
    r[this.FieldMapping.ValueSeq]=this.get_CancelButtonId();
    dataTable.AddRow(r,new EpiOverloadedArgs("DataRow"));
    return new DataView(dataTable,new EpiOverloadedArgs("DataTable"));
    
}
TestParamTransaction.prototype.Delete=function(dr)
{
    throw new Exception("The method or operation is not implemented.",new EpiOverloadedArgs("String"));
}
TestParamTransaction.prototype.LoadDefaultValues=function()
{
    this.substTable.get_DefaultView().set_Sort("ParameterName");
    var fieldDescription=this.GetFields();
    for(var i=0;i < fieldDescription.Rows.length;i++)
    {
        var defaultValue=fieldDescription.get_Row(i).get_Item(this.FieldMapping.DefaultValue);
        var columnName=this.GetFieldName(fieldDescription.get_Row(i).get_Item(this.FieldMapping.DataSource).toString());
        var ctrlType=fieldDescription.get_Row(i).get_Item("ControlType").toString();
        if(ctrlType != Enum.ToString(ControlType.ItemList,ControlType))
        {
            var substValue=this.getSubstValue(columnName);
            if(substValue != "")
            {
                defaultValue=substValue;
                
            }
            try
            {
                if(defaultValue != null)
                {
                    if(this.IsFieldNull(columnName))
                    {
                        this.view.dataView.get_Row(0).set_Item(columnName,defaultValue);
                        
                    }
                    
                }
                
            }
            catch(_err)
            {
                
            }
            
        }
        else 
        {
            var dataType=fieldDescription.get_Row(i).get_Item("DataType").toString();
            this.getSubstItemSet(columnName,dataType);
            
        }
        
    }
    
}
TestParamTransaction.ShowDialog=function(formTrans,substTable)
{
    var evParamName = "Param";
	var evCtrlName = "Ctrl";
	var evCtrlValuesName = "CtrlValues";

    var trans=new TestParamTransaction(formTrans);
    trans.substTable=substTable;
    trans.dvCtrl=new DataView((Global.As(formTrans.get_EpiDataViews().get_Item(evCtrlName),"EpiDataView")).dataView.Table,new EpiOverloadedArgs("DataTable"));
    trans.dvCtrlValues=(Global.As(formTrans.get_EpiDataViews().get_Item(evCtrlValuesName),"EpiDataView")).dataView;
    trans.dvParams=(Global.As(formTrans.get_EpiDataViews().get_Item(evParamName),"EpiDataView")).dataView;
    if(!trans.LoadParameters())
    {
        return DialogResult.Abort;
        
    }
    var form=new TestParamForm(trans,new EpiOverloadedArgs("EpiTransaction"));
    {
        var result=form.ShowDialog(new EpiOverloadedArgs(""));
        
        if(result == DialogResult.OK)
        {
            substTable.Clear();
            for(var col in trans.paramMapDataset.get_Table(0).get_Columns().items)
            {
                col=trans.paramMapDataset.get_Table(0).get_Column(col);
                var paramName=col.ColumnName;
                if(paramName == "Company" || paramName == "RowMod" || paramName == "RowIdent")
                {
                    continue;
                }
                var ctrlType=trans.paramMapDataset.get_Table(0).GetExtendedProperty(paramName,TestParamTransaction.extPropCtrlTypeKey).toString();
                var paramType=trans.paramMapDataset.get_Table(0).GetExtendedProperty(paramName,TestParamTransaction.extPropTypeKey).toString();
                if(ctrlType == Enum.ToString(ControlType.ItemList,ControlType))
                {
                    try
                    {
                        var tblList=trans.SetValuesDataSet.get_Table(paramName);
                        for(var row in tblList.get_DefaultView().Rows)
                        {
                            row=tblList.get_DefaultView().get_Row(row);
                            var paramValue=row.get_Item("ParameterValue").toString();
                            var isEmpty = (String.IsNullOrEmpty(paramValue))? "true":"false";
                            substTable.AddRow([paramName,paramValue,paramType,isEmpty,"","A",[]]);
                            
                        }
                        
                    }
                    catch(_err)
                    {
                        
                        {
                            var ex=_err;
                            ExceptionBox.Show(ex,new EpiOverloadedArgs("Exception"));
                            
                        }
                        
                    }
                    
                }
                else 
                {
                    var paramValue=trans.paramMapDataset.get_Table(0).get_Row(0).get_Item(paramName).toString();
		    var isEmpty = (String.IsNullOrEmpty(paramValue))? "true":"false";
                    substTable.AddRow([paramName,paramValue,paramType,isEmpty,"","A",[]]);
                    
                }
                
            }
            
        }
        return result;
        
    }
    
}
TestParamTransaction.prototype.IsFieldNull=function(fieldName)
{
    return this.view.dataView.get_Row(0).get_Item(fieldName) == DBNull.Value || String.IsNullOrEmpty(this.view.dataView.get_Row(0).get_Item(fieldName).toString());
    
}
TestParamTransaction.prototype.InitSetValuesDataTable=function(columnName,dataType)
{
    var dataSet=this.SetValuesDataSet;
    var dataTable;
    if(!this.SetValuesDataSet.TablesContains(columnName,new EpiOverloadedArgs("String")))
    {
        dataTable=dataSet.AddTable(columnName,new EpiOverloadedArgs("String"));
        var codeCol=dataTable.AddColumn("ParameterName",System.String,new EpiOverloadedArgs("String_Type"));
        dataTable.AddColumn("ParameterValue",ColumnTypes.ConvertTypeFromEnum(ColumnTypes.StringType2Enum(dataType)),new EpiOverloadedArgs("String_Type"));
        dataTable.AddColumn("RowIdent",System.String,new EpiOverloadedArgs("String_Type"));
        dataTable.AddColumn("RowMod",System.String,new EpiOverloadedArgs("String_Type"));
        
    }
    else 
    {
        dataTable=dataSet.get_Table(columnName);
        dataTable.Clear();
        
    }
    return dataTable;
    
}
TestParamTransaction.prototype.OnNonCancelButtonClick=function(buttonID)
{
    
}
TestParamTransaction.prototype.GetFieldsFilter=function()
{
//    public enum DatasourceType
//		{
//			UpdatableField,
//			Parameter
//		}
    return "SourceType=1"; //+ (Convert.ToInt32(QueryCtrlTransaction.DatasourceType.Parameter)).toString();
    
}
TestParamTransaction.prototype.GetFormTitle=function(defaultText)
{
    return "Parameters";
    
}
TestParamTransaction.prototype.getSubstValue=function(columnName)
{
    try
    {
        var nRow=this.substTable.get_DefaultView().Find(columnName,new EpiOverloadedArgs("Object"));
        if(nRow >= 0)
        {
            return this.substTable.get_DefaultView().get_Row(nRow).get_Item("ParameterValue").toString();
            
        }
        
    }
    catch(_err)
    {
        
        {
            var ex=_err;
            ExceptionBox.Show(ex,new EpiOverloadedArgs("Exception"));
            
        }
        
    }
    return "";
    
}
TestParamTransaction.prototype.GetNew=function()
{
    throw new Exception("The method or operation is not implemented.",new EpiOverloadedArgs("String"));
}
TestParamTransaction.prototype.LoadFormat=function()
{
    
}
TestParamTransaction.prototype.GetFieldType=function(binding)
{
    var ctrlRow=this.findCtrlRow(binding);
    if(ctrlRow != null)
    {
        return ColumnTypes.ConvertTypeFromEnum(ColumnTypes.StringType2Enum(ctrlRow.get_Item("DataType")));
        
    }
    else 
    {
        throw new Exception("Unable to find control for parameter " + binding,new EpiOverloadedArgs("String"));
    }
    
}
TestParamTransaction.prototype.Fill=function()
{
    this.paramMapDataset.Clear();
    var mapRow=this.paramMapDataset.get_Table(0).NewRow();
    mapRow.set_Item("Company","");
    mapRow.set_Item("RowIdent","");
    mapRow.set_Item("RowMod","");
    this.paramMapDataset.get_Table(0).AddRow(mapRow,new EpiOverloadedArgs("DataRow"));
    this.view.set_dataView(this.paramMapDataset.get_Table(0).get_DefaultView());
    this.view.set_Row(0);
    this.view.AddEnabled=false ;
    this.Add(this.get_ViewName(),this.view);
    this.LoadDefaultValues();
    this.LoadFormat();
    this.paramMapDataset.AcceptChanges();
    this.view.Notify(new EpiNotifyArgs(this,0,NotifyType.Initialize,new EpiOverloadedArgs("Object_Int32_NotifyType")));
    
}
TestParamTransaction.prototype.fillUCCombo=function(combo,ctrlValues)
{
    try
    {
        if(this.ucAdap == null)
        {
            this.ucAdap=new UserCodesAdapter(this);
            this.ucAdap.BOConnect();
            
        }
        QueryCtrlTransaction.FillUCCombo(combo,ctrlValues,this.ucAdap);
        
    }
    catch(_err)
    {
        
        {
            var ex=_err;
            ExceptionBox.Show(ex,new EpiOverloadedArgs("Exception"));
            
        }
        
    }
    
}
if(!(window.TestParamForm&&window.TestParamForm.prototype&&window.TestParamForm.Assm=="UI.TestParam"))
{
    window.TestParamForm=Epicor.Mfg.Lib.Custom.Forms.TestParamForm=function()
    {
        LaunchEngineForm.call(this);
        for(var i=0;i<=arguments.length-1;i++){this.Args.push(arguments[i]);}
        this.Assembly="UI.TestParam";
        this.Name="TestParamForm";
        this._type="Epicor.Mfg.Lib.Custom.Forms.TestParamForm";
        this.DialogProps=TestParamForm.DialogProps;
        this.DialogControls=TestParamForm.DialogControls;
        this.Variables=TestParamForm.Variables;
    }
    TestParamForm.Assm="UI.TestParam";
    TestParamForm.prototype = new LaunchEngineForm();
}
LaunchEngineForm.Concat(window.TestParamForm,["Name"],{},[]);
TestParamForm.prototype.get_Name=function()
{
    return this.GetDialogPropVal("Name",null);
}

TestParamForm.prototype.set_Name=function()
{
    var args=[];
    for(var i=0;i<=arguments.length-1;i++){args.push(arguments[i]);}
    return this.CallFunction("set_Name", args);
}
