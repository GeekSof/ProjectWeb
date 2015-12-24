Global.BindingEngine = GBE = new BindingEngine();

// ----------------------- DATASET -------------------------------
var MissingSchemaAction={Add:0,AddWithKey:1,Error:2,Ignore:3};
var DataRowState=System.Data.DataRowState={Added:"A",Deleted:"D",Detached:"X",Modified:"U",UnChanged:"",Unchanged:""};var DataViewRowState={Added:0,CurrentRows:1,Deleted:2,ModifiedCurrent:3,ModifiedOriginal:4,None:5,OriginalRows:6,Unchanged:7};
var EpiBindType = {"Clear":"Clear", "Merge":"Merge", "Full":"Full", "None":"None", "Cache":"Cache"};
var LoadOption = System.Data.LoadOption={OverwriteChanges:0,PreserveChanges:1,Upsert:2};

var EpiRowChangedArgs = Epicor.Mfg.UI.FrameWork.EpiRowChangedArgs = function(dv,row,lastRow)
{
    EpiObject.call(this, "EpiRowChangedArgs");

    this.LastRow = lastRow;
    this.CurrentRow = row;
    this.CurrentView = dv;
}
var EpiRowChangingArgs = Epicor.Mfg.UI.FrameWork.EpiRowChangingArgs = function(currView,currRow,proposedRow)
{
	this.CurrentView = currView;
	this.CurrentRow = currRow;
	this.ProposedRow = proposedRow;
}

var UniqueConstraint=System.Data.UniqueConstraint=function(){}
var AcceptRejectRule=System.Data.AcceptRejectRule={"None":0,"Cascade":1};
var Rule=System.Data.Rule=System.Data.Rule={"None":0,"Cascade":1,"SetNull":2,"SetDefault":3};

var ForeignKeyConstraint=System.Data.ForeignKeyConstraint=function()
{
    EpiObject.call(this,"ForeignKeyConstraint");

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    this.RelatedColumns = []; // Parent
    this.Columns = [];  // child
    this.UpdateRule = Rule.Cascade;
    this.DeleteRule = Rule.Cascade;
    this.AcceptRejectRule=Rule.None;
    switch(overload)
    {
        case "DataColumn_DataColumn":
            this.RelatedColumns.push(a[1].ColumnName);
            this.Columns.push(a[2].ColumnName);
            this.RelatedTable = a[1].Table;
            this.Table = a[2].Table;
        	break;
        case "DataColumnArr_DataColumnArr":
            for(var p in a[1])
            {
                this.RelatedColumns.push(a[1][p].ColumnName);
            }
            for(var c in a[2])
            {
                this.Columns.push(a[2][c].ColumnName);
            }
            if(a[1].length>0) this.RelatedTable = a[1][0].Table;
            if(a[2].length>0) this.Table = a[2][0].Table;
            break;
       
        case "String_DataColumn_DataColumn":
            this.ConstraintName = a[0];
            this.RelatedColumns.push(a[1].ColumnName);
            this.Columns.push(a[2].ColumnName);
            this.RelatedTable = a[1].Table;
            this.Table = a[2].Table;
            break;
        case "String_DataColumnArr_DataColumnArr":
            this.ConstraintName = a[0];
            for(var p in a[1])
            {
                this.RelatedColumns.push(a[1][p].ColumnName);
            }
            for(var c in a[2])
            {
                this.Columns.push(a[2][c].ColumnName);
            }
            if(a[1].length>0) this.RelatedTable = a[1][0].Table;
            if(a[2].length>0) this.Table = a[2][0].Table;
            break;
        
        case "DataTable_DataTable_StringArr_StringArr_Rule_Rule_AcceptRejectRule":  // custom
            this.RelatedTable = a[0];
            this.Table = a[1];
            this.RelatedColumns = a[2];
            this.Columns = a[3];
            this.UpdateRule = a[4];
            this.DeleteRule = a[5];
            this.AcceptRejectRule=a[6];
            break;
    }
}
ForeignKeyConstraint.prototype = new EpiObject();

var ConstraintCollection=System.Data.ConstraintCollection=function()
{
    ArrayList.call(this,"ConstraintCollection");
}
ConstraintCollection.prototype = new ArrayList();

ConstraintCollection.prototype.Add=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    var cons = null;
    switch(overload)
    {
        case "Constraint":
            cons=a[0];
            break;
        case "String_DataColumn_Boolean": // UniqueConstraint TODO
        case "String_DataColumnArr_Boolean":
            break;
       
        case "String_DataColumn_DataColumn":
            cons = new ForeignKeyConstraint(a[0],a[1],a[2],new EpiOverloadedArgs("String_DataColumn_DataColumn"));
            break;
        case "String_DataColumnArr_DataColumnArr":
            cons = new ForeignKeyConstraint(a[0],a[1],a[2],new EpiOverloadedArgs("String_DataColumnArr_DataColumnArr"));
            break;
    }
    if (!cons) return;
    
    var found=false;
    for(var itm in this.items)
    {
        itm=this.items[itm];
        if(itm.ParentTable==cons.ParentTable && itm.ChildTable==cons.ChildTable)
        {
            found=true;
            break;
        }
    }

    if(!found) ArrayList.prototype.Add.call(this,cons); 
}

var DataRelationCollection=System.Data.DataRelationCollection=function()
{
    ArrayList.call(this,"DataRelationCollection");
}
DataRelationCollection.prototype = new ArrayList();

DataRelationCollection.prototype.Add=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    var rel = null;
    switch(overload)
    {
        case "DataRelation":
            rel=a[0];
            break;
        case "DataColumn_DataColumn":
            rel = new DataRelation(null,a[0],a[1],new EpiOverloadedArgs("String_DataColumn_DataColumn"));
            break;
        case "DataColumnArr_DataColumnArr":
            rel = new DataRelation(null,a[0],a[1],new EpiOverloadedArgs("String_DataColumnArr_DataColumnArr"));
            break;
        case "String_DataColumn_DataColumn":
        case "String_DataColumn_DataColumn_Boolean":
            rel = new DataRelation(a[0],a[1],a[2],new EpiOverloadedArgs("String_DataColumn_DataColumn"));
            break;
        case "String_DataColumnArr_DataColumnArr":
        case "String_DataColumnArr_DataColumnArr_Boolean":
            rel = new DataRelation(a[0],a[1],a[2],new EpiOverloadedArgs("String_DataColumnArr_DataColumnArr"));
            break;
    }
    
    var found=false;
     for(var itm in this.items)
    {
        itm=this.items[itm];
        if(itm.ParentTable==rel.ParentTable&&itm.ChildTable==rel.ChildTable)
        {
            found=true;
            break;
        }
    }

    if(!found) ArrayList.prototype.Add.call(this,rel); 
}

var DataSet = System.Data.DataSet = function(dataSetName)
{
    EpiObject.call(this, "DataSet");

    this.DataSetName = "";
    if(dataSetName && Global.IsString(dataSetName)) this.DataSetName = dataSetName;
    this.Data = null;
    this.Tables = {};
    this.BOClass = null;
    this.ExtendedProperties = new Hashtable(); 
    this.IsDataSet = true;
    this.Locale;
    this.TableSeq = 0;
    this.CacheInfo=null;
    this._tableCount = 0;
    this._pageSize={};
    this._tableNamesMap=[]; // Maps the original tableName to the new tablename (if set_TableName was called on any datatable in this dataset)
    this.ID="ds"+BindingEngine._dsIdx++;
    
    try
    {
        this.Relations=new DataRelationCollection();
        this.Relations.get_Event("ItemAdded").subscribe(this._relationAdded, this, true);    
    }
    catch(err) {}
    
    this.EpiDataViews = [];
}
DataSet.prototype=new EpiObject();
DataSet.prototype.BeginInit=function(){}
DataSet.prototype.EndInit=function(){}
DataSet.prototype.set_EnforceConstraints= function(val){this.EnforceConstraints = val;}
DataSet.prototype.get_EnforceConstraints= function(){return this.EnforceConstraints;}
DataSet.prototype.get_Tables=function() {return this.Tables;}
DataSet.prototype.TablesContains=function(tbl)
{
    if (this.get_Table(tbl))
        return true;
    else
        return false;
}
DataSet.prototype.GetTableCount=function()
{
    var cnt = 0;
    for(var tbl in this.Tables)
    {
        cnt++;
    }
    return cnt;
}
DataSet.prototype.AddTable=function(tableName)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    var dataType="";
    var columnName="";
    switch(overload)
    {
        case "":
            var obj = {};
            var tblName = "_tbl" + this.TableSeq++;
            obj[tblName] = new DataTable(tblName);
            this.AddTables(obj);
            return obj[tblName];
           
        case "String":
        case "String_String":
            var obj = {};
            obj[a[0]] = new DataTable(a[0]);
            this.AddTables(obj);
            return  obj[a[0]];
       
        case "DataTable": // This overload returns void in .NET
            var theTable = a[0];
            var tblName = theTable.TableName;
            if (!tblName) tblName =  "_tbl" + this.TableSeq++;
            this.Tables[tblName] = this[tblName] = theTable;
            this[tblName].DataSet = this;
            
            if(!this.Data) this.Data = {};    
            if(!this.Data[tblName])
                this.Data[tblName] = theTable.Rows; // Copy over the data too
            this._tableCount++;
            break;    
    }
}
DataSet.prototype.AddTables=function(tables)
{
    for(tbl in tables)
    {
        this._tableCount++;
    
        var theTable = tables[tbl];
    
        // Try to find out the intended name.
        var tblName = tbl;
        if(Global.IsArray(tables)) tblName = theTable.TableName;
        if(!tblName) theTable.TableName = "_tbl" + this.TableSeq++;
          
        this.Tables[tblName] = theTable;
        this[tblName] = theTable;
        this[tblName].DataSet = this;
    }
}
DataSet.prototype.AddFKConstraint=function(parentTable,childTable, parentColumns,childColumns,updateRule, deleteRule, acceptRejectRule)
{
   parentTable.Constraints.Add(new ForeignKeyConstraint(parentTable,childTable, parentColumns,childColumns,updateRule, deleteRule, acceptRejectRule,new EpiOverloadedArgs("DataTable_DataTable_StringArr_StringArr_Rule_Rule_AcceptRejectRule")),new EpiOverloadedArgs("Constraint") );
}
 

DataSet.prototype.AddRelation=function(parentTable, childTable, parentColumns, childColumns, dataviewOnly)
{
    var rel=new DataRelation(parentTable, childTable, parentColumns, childColumns, new EpiOverloadedArgs("String_String_StringArr_StringArr"));
    if(dataviewOnly) rel.DataviewOnly=true;
    this.Relations.Add(rel, new EpiOverloadedArgs("DataRelation"));
}
DataSet.prototype._relationAdded=function(e)
{
    var rel = this.Relations[e.Index];
    rel.ChildTable.ParentRelations.Add(rel, new EpiOverloadedArgs("DataRelation"));
    rel.ParentTable.ChildRelations.Add(rel, new EpiOverloadedArgs("DataRelation"));
}
DataSet.prototype.toString=function()
{
    if(this.Data==null)
        return "{}";
    else
        return JSON.stringify(this.Data);
}
DataSet.prototype.toStringFilter=function()
{
    if(this._isSpecial()) return this.toString();
    if(this.Data==null) return "{}";

    var data={};



    for(var tbl in this.Tables)
    {
        var theTbl = this.Tables[tbl];
        if(theTbl.ParentRelations.get_Count()==0)
        {
            for(var ii=0;ii<=theTbl.Rows.length-1;ii++)
            {
                var include=false;
                var row=theTbl.get_Row(ii);
                var nm=theTbl.TableName;
                if(this.recurseCheckRow(data,theTbl,row))
                {
                    if(!data[nm]) data[nm]=[];
                    data[nm].push(row);
                }                
            }
        }
    }

    return json=JSON.stringify(data);
}
DataSet.prototype.recurseCheckRow=function(data,theTbl,row)
{
    var include=false;
    for (var rel in theTbl.ChildRelations.items)
    {
        var rel = theTbl.ChildRelations[rel];

        if(!rel.DataviewOnly)
        {
            var childRows = row.GetChildRows(rel);
        
            for(var ii=0;ii<=childRows.length-1;ii++)
            {
                var r=childRows[ii];
                var tbl=r.get_Table();
                var nm=tbl.TableName;
                if(this.recurseCheckRow(data,tbl,r))
                {
                    if(!data[nm]) data[nm]=[];
                    data[nm].push(r);
                    include=true;
                }                
            }
        }
    }
    if(!include && (row["RowMod"]!=""||(row["_RowState"]!=undefined&&row["_RowState"]!=""))) 
    {
        if(row["_RowState"]=="U"&&row["RowMod"]=="") row["RowMod"]="U";
        include=true;
    }
    return include;
}
DataSet.prototype.Load=function(dataStructure,bindType,isTools) 
{
    if(!isTools&&bindType==EpiBindType.Merge&&!this._isSpecial())
    {
        var tempDS=new DataSet();
        tempDS.Load(dataStructure,EpiBindType.None,true);
        this.Merge(tempDS, new EpiOverloadedArgs("DataSet_Custom"));
        return;
    }

    if(Global.PageInfo&&Global.PageInfo.DS==this)
    {
        this.CacheInfo=Global.PageInfo.CacheInfo;
    }

    if(Global.IsBoolean(bindType))
    {
        if(bindType==true)
            bindType = EpiBindType.Full;
        else
            bindType = EpiBindType.None;
    }

    this.Data = dataStructure;
    this._checkStructure();
    
    for(var tbl in this.Tables)
    {
        var theTbl = this.Tables[tbl];
        theTbl.Count = 0;
        if(this.Data==null)
        {
            theTbl.Rows = [];
        }
        else
        {
            theTbl.Rows = this.Data[tbl];
            if(!theTbl.Rows) theTbl.Rows = [];
            
            theTbl.Count = theTbl.Rows.length;
            if (this.Changed == false) this.Changed = this._isTableChanged(theTbl); // Make sure there are no Added rows
        }
        if(bindType==EpiBindType.None) theTbl._populateOrigRows();  // This populates the _origRows, put it here so we dont have to loop the tables again
    } 
    
    try
    {
        var me=this;
        var orig = Global.ArgManager["Out1"];
        DialogHelper.RunOnAll(function(){Global.BindingEngine.Reload(bindType,me);});
        Global.ArgManager["Out1"]=orig;
    }
    catch(err)
    {
        DebugHelper.WriteError("BindingEngine Reload failed at DataSet Load.");
    }
}
DataSet.prototype._checkStructure=function()
{
    if(this.Data && !this.HasTable())
    {
        for(var tbl in this.Data)
        {
            var cols = {};
            for(var col in this.Data[tbl][0]) 
            {
                cols[col] = {"DataType":"System.String", "ExtendedProps":{}};
            }
            
            this.Tables[tbl] = new DataTable(tbl, {"Columns":cols});
        }
    }
}
DataSet.prototype.HasTable=function()
{
    for(var tbl in this.Tables)
    {
        return true;
    }
    return false;
}
DataSet.prototype._isTableChanged=function(tbl)
{
    for(var i=0,row; row=tbl.Rows[i]; i++)
    {
        if (row["RowMod"] != DataRowState.UnChanged)
        {
            return true;
        }
    }
    return false;
}
DataSet.prototype.HasChanges = function()
{
    if(this.Data)
    {
        for(var tbl in this.Data)
        {
            for(var ii=0;ii<=this.Data[tbl].length-1;ii++)
            {
                if(this.Data[tbl][ii]["RowMod"]) return true;
            }
        }
    }

    return false;
}
DataSet.prototype.Clear = function()
{
    if(this.CacheInfo) this.PreviousCacheKey=this.CacheInfo.CacheKey;
    this.CacheInfo=null;
    this.Load(null,EpiBindType.Clear,true);
    for(var tbl in this.Tables)
        this.Tables[tbl]._orig=[];
}
DataSet.prototype._populateOrigRows=function()
{
    for(var tbl in this.Tables)
        this.Tables[tbl]._populateOrigRows();
}

DataSet.prototype.AcceptChanges=function()
{
    var rowsChanged=false;
    for(var tbl in this.Tables)
    {
        var retVal = this.Tables[tbl].AcceptChanges();
        if (retVal)
        {
            rowsChanged = true;
            if(this.Tables[tbl].Rows.length>0)
                this.Data[tbl] = this.Tables[tbl].Rows;
            else
                delete this.Data[tbl];
        }
    }
}
DataSet.prototype.RejectChanges = function()
{
    for(var tbl in this.Tables)
    {
        this.Tables[tbl]._inDataSetReject = true;
        var retVal = this.Tables[tbl].RejectChanges();
        this.Tables[tbl]._inDataSetReject = false;
        if(retVal) 
        {
            if(!this.Data) this.Data = {};
            if(this.Tables[tbl].Rows.length>0)
                this.Data[tbl] = this.Tables[tbl].Rows;
            else
                delete this.Data[tbl];
        }
    }
    Global.BindingEngine.Reload(EpiBindType.Merge, this);
}
DataSet.prototype.get_Table=function(index)
{
    if (Global.IsNumber(index))
    {
        var localIndx = 0;
        for(var tbl in this.Tables)
        {
            if (localIndx == index)
                return this.Tables[tbl];
            else 
                localIndx++;
        }
    }
    else if (Global.IsString(index))
    {
        if (this._tableNamesMap[index]) // This is an issue only when the dataset definitions from the adapter script call get_Table and the table name has been changed. 'index' is the orig table name
            index = this._tableNamesMap[index]; // get the new name from the map
       return this.Tables[index];
    }
}
DataSet.prototype.IndexOfTable=function(tblName)
{
    var currentIdx = 0;
    var idx = -1;
    for(var tbl in this.Tables)
    {
        if(tbl==tblName) return currentIdx;
        currentIdx++;
    }
    
    return idx;
}
DataSet.prototype._syncStructure=function(templateDS)
{
    if(this._tableCount==0)
    {
        var tables = {};
        for(var tbl in templateDS.Tables)
        {
            var theTable = templateDS.Tables[tbl];
            var newTbl = new DataTable(theTable.TableName, {"Columns":theTable.Columns});
            newTbl.PrimaryKey=theTable.PrimaryKey;
            tables[theTable.TableName] = newTbl;
        }
        this.AddTables(tables);
        
        // Copy over the datarelations too
        var Rels = [];
        templateDS.Relations.CopyTo(Rels,0, new EpiOverloadedArgs("Array"));
        for (var r in Rels)
        {
            var rel = Rels[r];
            
            // Reset the parent and child table references to the new tables in this dataset.
            this.AddRelation(this.Tables[rel.ParentTable.TableName],this.Tables[rel.ChildTable.TableName],rel.ParentColumns,rel.ChildColumns);  // should copy over the relations to the parent and child tables via the ItemAdded event.
        }
    }
    else
    {
        for(var tbl in templateDS.Tables)
        {
            var theTable = templateDS.Tables[tbl];
            var existingTable=this.Tables[tbl];
            if(existingTable)
            {
                theTable.PrimaryKey=existingTable.PrimaryKey;
            }
        }
    }
}
DataSet.prototype._isSpecial=function()
{
    // There are some cases where server code does strange things, making the dirty row handling infeasible.
    return ((this.DataSetName=="POSuggDataSet"&&Global.Form.Name=="POSuggEntryForm")|| (this.DataSetName=="QueryDesignDataSet")||(this.DataSetName=="LaborDataSet")||(this.DataSetName=="BankAdjEntryDataSet")||
        ((this.DataSetName=="EmpExpenseDataSet" || this.DataSetName=="LaborApprovalDataSet") && Global.Form.Name=="TimeExpApprovalForm"));
}
DataSet.prototype.Merge=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "DataRowArr":
            this.Merge_2(a[0], false);
            break;
        case "DataSet":
            this.Merge_1(a[0], false);
            break;
        case "DataSet_Boolean":
            this.Merge_1(a[0], a[1]);
            break;
        case "DataRowArr_Boolean_MissingSchemaAction": // SchemaAction not implemented yet
            this.Merge_2(a[0], a[1]);
            break;
        case "DataSet_Boolean_MissingSchemaAction": 
            this.Merge_3(a[0].Tables, a[1],a[2]);
            break;
        case "DataTable"://Not implemented 
            this.Merge_2(a[0].get_RowsFull(),a[1]);
            break;
        case "DataTable_Boolean_MissingSchemaAction": 
            this.Merge_3([a[0]],a[1],a[2]);
            break;
        case "DataTable_Boolean":
            this.Merge_3([a[0]],a[1],MissingSchemaAction.Add); // SCR #66517
            break;
        case "DataSet_Custom":
            this.Merge_1(a[0],false,true);
        default:
            break;
    }
}
DataSet.prototype.Merge_1 = function(newDataSet, preserveChanges, mergeFromServer)
{
    if(newDataSet==null || newDataSet.Data==null) return;
    
    if(!preserveChanges) preserveChanges = false;
    if(!mergeFromServer) mergeFromServer = false;

    this._syncStructure(newDataSet);

    if(this.Data==null)
    {
        this.Load(newDataSet.Data, EpiBindType.Merge,true);
        this._populateOrigRows();
    }
    else
    {
        var origData = this.Data;
        var newData = newDataSet.Data;
        var newRowData;

        var map = this.GetRowMap();
        for(var tbl in newData)
        {
            expr=map.Expr[tbl];
        
            // We are having issues with the merge of attachment tables. Seems the rows
            // are created on the fly, so using RowIdent is not sufficient.  For now, 
            // because attachments are not yet supported, if the data for the attachments
            // has already been loaded into the dataset, then don't load it.
            if(tbl.EndsWith("Attch") && map[tbl]) continue;            
            
            if(mergeFromServer)
            {
                var redoMap = this._inferKeys(newDataSet,map,tbl);
                if(redoMap) map = this.GetRowMap();
            }
            var tblData = newData[tbl];

            if(!map.PK[tbl]) origData[tbl] = [];

            var eligibleRows=[];
            for(var ii=0, row; row=tblData[ii]; ii++)
            {
                var o=row;
                var foundRow=this._match(map,tbl,o,!mergeFromServer);
                if(foundRow==null)
                {
                    newRowData = this.CopyData(tblData[ii]);
                    
                    origData[tbl].push(newRowData);
                    if(this.Tables[tbl] && newRowData["RowMod"]==DataRowState.UnChanged)
                        this.Tables[tbl]._orig.push(newRowData);
                    else if (!this.Tables[tbl])// Table doesnt exist in the schema, add it in, otherwise the Data and Tables will be mismatched.
                        this.Tables[tbl] = new DataTable(tbl, {"Columns":row.get_Table().Columns});
                }
                else if(!preserveChanges)
                {
                    var origRowMod=origData[tbl][foundRow]["RowMod"];

                    newRowData = this.CopyData(tblData[ii]);
                    origData[tbl][foundRow] = newRowData;

                    // Messed up apps code workaround 
                    if(origRowMod==""&&newRowData["RowMod"]=="A"&&Global.Form.Name=="CustShipForm") origData[tbl][foundRow]["RowMod"]="";
                }
            }
        }
        this.Load(origData,EpiBindType.Merge,true);
    } 
}
DataSet.prototype._inferKeys=function(newDataSet,map,tbl)
{
    if(!map.New[tbl]||map.New[tbl].length==0) return false;
    
    var newMap=newDataSet.GetRowMap();
    
    var newRows=[];
    for(var r in map.New[tbl])
    {
        var o=this.Data[tbl][map.New[tbl][r]];
        var foundRow=this._match(newMap,tbl,o,true);
        if(foundRow==null) newRows.push(o);
    }
    if(newRows.length==0) return false;    
    
    var eligibleRows=[];
    for(var r in newDataSet.Data[tbl])
    {
        var o=newDataSet.Data[tbl][r];
        if(o["RowMod"]==""||o["RowMod"]=="A")
        {
            var foundRow=this._match(map,tbl,o,true);
            if(foundRow==null) eligibleRows.push(o);
        }
    }
    
    if(newRows.length==1&&eligibleRows.length==1)
    {
        if(this.Tables[tbl].PrimaryKey.length>0)
        {
            for(var pKey in this.Tables[tbl].PrimaryKey)
            {
                var pk="";
                if(Global.IsString(this.Tables[tbl].PrimaryKey[pKey]))
                    pk=this.Tables[tbl].PrimaryKey[pKey];
                else
                    pk=this.Tables[tbl].PrimaryKey[pKey].ColumnName;
                    
                newRows[0][pk]=eligibleRows[0][pk];
            } 
        }
        else if(eligibleRows[0]["RowIdent"])
        {
            newRows[0]["RowIdent"]=eligibleRows[0]["RowIdent"];
        }
        else
        {
            eligibleRows[0]["RowIdent"]=newRows[0]["RowIdent"]="1";
        }
        return true;
    }
    
    return false;
}
DataSet.prototype._match=function(map,tbl,o,skipEmpty)
{
    var foundRow=null;
    
    // First look for RowIdent match.
    var rowIdent=o["RowIdent"];
    if(rowIdent&&map.ID[tbl]&&map.ID[tbl][rowIdent]!=null)
    {
        foundRow=map.ID[tbl][rowIdent];
    }
    else
    {
        var pkIdent=eval(map.Expr[tbl]);
        if(pkIdent&&map.PK[tbl]&&map.PK[tbl][pkIdent]!=null)
        {
            foundRow=map.PK[tbl][pkIdent];
            if(foundRow!=null&&map.Empty[tbl]==foundRow) map.Empty[tbl]=null;
        }
        else if(!skipEmpty&&rowIdent&&map.Empty[tbl]!=null)
        {
            foundRow=map.Empty[tbl];
        }
    }
    
    return foundRow;
}
DataSet.prototype.Merge_2=function(rowArray, preserveChanges)
{
    // Create a dataset with the new data.      
    var ds = new DataSet();
    ds.Data = {};
    
    var tables = {};
    for(var r in rowArray)
    {
        var row = rowArray[r];
        
        var tbl = row.get_Table();
        if(tbl)
        {
            var tblName = tbl.TableName;
            
            if(!ds.Data[tblName]) ds.Data[tblName] = [];
            ds.Data[tblName].push(row);  
           
            if(!tables[tblName])
            {
                var newTbl = new DataTable(tblName, {"Columns":tbl.Columns});
                newTbl.PrimaryKey=tbl.PrimaryKey;
                tables[tblName] = newTbl;                
            }
        }
    }    
    
    ds.AddTables(tables);
    ds.Load(ds.Data,EpiBindType.Merge,true);
    this.Merge_1(ds, preserveChanges);
}
DataSet.prototype.Merge_3=function(srcTables, preserveChanges, missingSchemaAction)
{
    // Create a dataset with the new data.      
    var ds = new DataSet();
    ds.Data = {};
    var tables = {},srcTable, c, newRow,targetTbl,targetCols,rowArray,newTblColumns, r, row, tblName;
    
    for(var tbl in srcTables)
    {
        srcTable = srcTables[tbl];
        targetTbl = this.Tables[srcTable.TableName];
        targetCols = null;
        if (missingSchemaAction == MissingSchemaAction.Ignore && targetTbl)
            targetCols = targetTbl.Columns; // Use the target table's columns
        
        rowArray = srcTable.Rows; //get_RowsFull is throwing exception if srcTable was returned from a dialog
        if (rowArray.length == 0 && missingSchemaAction == MissingSchemaAction.Add) // There is no data but schema needs to be merged
        {
            tblName = srcTable.TableName;
            //if(!ds.Data[tblName]) ds.Data[tblName] = []; // Data is initialized if there are rows
            if(!tables[tblName])
            {
                tables[tblName] = new DataTable(tblName, {"Columns":srcTable.Columns});
            }
        }
        
        for(var r in rowArray)
        {
            row = rowArray[r];
            tblName = srcTable.TableName;
            
            if(!ds.Data[tblName]) ds.Data[tblName] = [];
            
            if(!tables[tblName])
            {
                newTblColumns=(missingSchemaAction == MissingSchemaAction.Ignore && targetCols)? targetCols: srcTable.Columns;               
                tables[tblName] = new DataTable(tblName, {"Columns":newTblColumns});
            }
            
            // If we have to ignore the source's new columns, we iterate the target's columns and update the new row using that.
            if (missingSchemaAction == MissingSchemaAction.Ignore && targetCols)
            {
                newRow = {};
                for (c in targetCols)
                {
                    // TODO: there might be Defaults set up in the dataset definition. We need to extract those at some point.
                    if (row[c]==undefined && targetCols[c].DefaultValue != undefined) 
                     newRow[c] = targetCols[c].DefaultValue.toString(); // Dont set a value for the column if there is no data for it
                    else
                      newRow[c] = row[c];
                }
                ds.Data[tblName].push(newRow); 
            }
            else
                ds.Data[tblName].push(row);  
        }    
    }
    ds.AddTables(tables);
    ds.Load(ds.Data, EpiBindType.Merge,true);
    this.Merge_1(ds, preserveChanges);
}
DataSet.prototype.GetMap=function()
{       
    var map = {};
    for(var tbl in this.Data)
    {
        var expr="o['RowIdent']";
        if(this.Tables[tbl]) expr=this.Tables[tbl]._getPKExpr();
        
        map[tbl] = {};
        for(var ii=0, o; o=this.Data[tbl][ii]; ii++)      
        {
            map[tbl][eval(expr)] = ii;
        }
    }
    return map;
}
DataSet.prototype.GetRowMap=function()
{   
    var map = {"PK":{},"ID":{},"Empty":{},"New":{},"Expr":{}};
    for(var tbl in this.Data)
    {
        map.Expr[tbl]=null;
        map.PK[tbl]={};
        map.ID[tbl]={};
        map.New[tbl]=[];
        map.Empty[tbl]=null;

        if(this.Tables[tbl]) map.Expr[tbl]=this.Tables[tbl]._getPKExpr();

        for(var ii=0, o; o=this.Data[tbl][ii]; ii++)      
        {
            if(map.Expr[tbl]) map.PK[tbl][eval(map.Expr[tbl])] = ii;
            
            if(o["RowIdent"]) 
                map.ID[tbl][o["RowIdent"]]=ii;
            else
                map.Empty[tbl]=ii;
                
            if(o["RowMod"]==DataRowState.Added)
                map.New[tbl].push(ii);
        }
    }
    return map;
}
DataSet.prototype.CopyData=function(origObj)
{
    var newObj = {};
    for(var itm in origObj)
    {
        newObj[itm] = origObj[itm];
    }
    
    return newObj;
}
DataSet.prototype.Copy=function()
{
    var newDataSet = new DataSet(this.DataSetName);
    var me = this;
    for(var tbl in this.Tables)
    {
        var theTable = this.Tables[tbl];
        var newTbl = theTable.Copy();
        newDataSet.AddTable(newTbl, new EpiOverloadedArgs("DataTable"));
        newDataSet["get_"+tbl] = function(){return me.Tables[tbl];};
    }
    // copy over the data
    var origData = this.Data;
    var newData = {};

    for(var tbl in origData)
    {
        var tblData = origData[tbl];
        newData[tbl] = [];
	if (newDataSet.Tables[tbl] && newDataSet.Tables[tbl].Rows.length == tblData.length)
	   newData[tbl] = newDataSet.Tables[tbl].Rows;
        else
        {
        var val;
        for(var ii=0, row; row=tblData[ii]; ii++)
        {
	    	var newRow={};
            	for(var c in row)
            	{
               	 val = row[c];
                  if (typeof(val) == "string" && c!="type" && c!= "Indx")
                   newRow[c]=val;
            	}
            	newData[tbl].push(newRow);
            
        }
        }
    }
    newDataSet.Data = newData;
    return newDataSet;
}
DataSet.prototype.GetXml=function()
{
    var xml = [];
    
    xml.push("<" + this.DataSetName + ">");
    for(var tbl in this.Data)
    {
        xml.push("<" + tbl + ">");
        for(var row in this.Data[tbl])
        {
            for(var col in this.Data[tbl][row])
            {
                if(this.Data[tbl][row][col]!=this.Data[tbl][row] && typeof this.Data[tbl][row][col]=="string")
                {
                    xml.push("<" + col + ">" + this.Data[tbl][row][col] + "</" + col + ">");
                }
            }
        }
        xml.push("</" + tbl + ">");
    }
    xml.push("</" + this.DataSetName + ">");
    
    return xml.join("");
}
function DataSetClone(templateDS)
{
    DataSet.call(templateDS.DataSetName); 
    
    for(var tbl in templateDS.Tables)
    {
        this._tableCount++;
        var theTable = templateDS.Tables[tbl];
        
        var newTbl = new DataTable(theTable.TableName, {"Columns":theTable.Columns});
        newTbl.DataSet = this;
        
        this[theTable.TableName] = this.Tables[theTable.TableName] = newTbl;
    }
}
DataSetClone.prototype = new DataSet();

var DataColumnCollection=System.Data.DataColumnCollection=function()
{
    Hashtable.call(this, "DataColumnCollection");
}
DataColumnCollection.prototype = new Hashtable();
DataColumnCollection.prototype.get_Item=function(key)
{
    var column=Hashtable.prototype.get_Item.call(this, key);
    if(column)
    {
        if(!(column.ExtendedProperties instanceof Hashtable))
        {
            var extProps = new Hashtable();
            for(var ep in column.ExtendedProperties)
            {
                extProps.Add(ep, column.ExtendedProperties[ep]);
            }
            column.ExtendedProperties = extProps;
        }
    }
    return column;
}

// ------------------------------------ DATATABLE --------------------------------------------
var DataTable = System.Data.DataTable = function(name, settings)
{
    EpiObject.call(this, "DataTable");

    this.Rows=[];
    this.DataSet;
    this.TableName;
    this.Columns = {};
    this.PrimaryKey = {};
    this.Count = 0;
    this.ColumnCount = -1; // This is set when GetColumnCount is called the first time.
    this.ExtendedProperties = new Hashtable();
    this.ColumnSeq = 0;
    this.ParentRelations=new DataRelationCollection();
    this.ChildRelations=new DataRelationCollection();
    this.Constraints=new ArrayList();
    this.defaultView;
    this._orig = [];
    this._origChanged = false;
    this._extPropsInit = false;

    if(name && Global.IsString(name)) this.TableName=this.origName = name;
    
    if(settings)
    {
        if(settings.Columns) this.Columns = settings.Columns;
        if(settings.PrimaryKey) this.PrimaryKey = settings.PrimaryKey;
    }
    this.Constraints=new ConstraintCollection();
}
DataTable.prototype=new EpiObject();
DataTable.prototype.BeginInit=function(){}
DataTable.prototype.EndInit=function(){}
DataTable.prototype.get_ExtendedProperties=function(){return this.ExtendedProperties;} // ExtProps on the datatable
DataTable.prototype.get_DataSet=function(){return this.DataSet;}
DataTable.prototype.get_DefaultView=function()
{
    if(!this.defaultView)
    {
        this.defaultView = new DataView(this);
    }
    return this.defaultView;
}

DataTable.prototype.RemoveRows=function(shouldRemoveRow) 
{
    var rows = this.get_Rows();
    for (var row in rows)
    {
        row = rows[row];
        if (shouldRemoveRow(row))
             this.Remove(row); // We can do this because the get_Rows returns the rows in a new array instance, so we are not modifying and iterating the DataTable rows at the same time
    }
}
DataTable.prototype.get_TableName=function() {return this.TableName;}
DataTable.prototype.set_TableName=function(val) 
{
    if(this.TableName==val) return;
    
    if (!this.origName) this.origName = this.TableName; // Save off the original table name
    
    if(this.DataSet)
    {
        if(this.TableName)
        {
            delete this.DataSet.Tables[this.TableName];
            delete this.DataSet[this.TableName];
        }
        this.DataSet.Tables[val] = this;
        this.DataSet[val] = this;
            
        if (this.origName == val && this.DataSet._tableNamesMap[this.origName]) // If the name was set back to the original name, remove it from the map
           delete this.DataSet._tableNamesMap[this.origName];
        else
            this.DataSet._tableNamesMap[this.origName] = val; // Map the original table name to the new name (used in DataSet.get_Table)
    }
    this.TableName = val; // Set new name
}
DataTable.prototype.SetColumns=function(cols) 
{
    //name:[type,format,like,readOnly,isHidden,external,systemColumn]
    for(var col in cols)
    {
        var c = cols[col];
        var tp = "System.String";
        if (c[0]=='I') tp="System.Int32";
	    else if (c[0]=='B') tp="System.Boolean";
	    else if (c[0]=='D') tp="System.Decimal";
	    else if (c[0]=='T') tp="System.DateTime";
	    else if (c[0]=='BA') tp="System.Byte[]";
	    else if (c[0] && c[0]!='S') tp=c[0];

        var ext = {};
        if (c[1]) {
            var f = c[1];
            if (f=="F1")      f="->>>,>>>,>>9.99999";
            else if (f=="F2") f=">,>>>,>>>,>>9.99999";
            else if (f=="F3") f=">>>>>>9";
            else if (f=="F4") f=">,>>>,>>9";
            else if (f=="F5") f=">>>,>>>,>>>,>>>,>>9.999";
            else if (f=="F6") f=">>>,>>>,>>>,>>>,>>9";
            ext["Format"] = f;
        }
        if (c[2]) ext["Like"] = c[2];
        if (c[3]) ext["ReadOnly"] = true;
        if (c[4]) ext["IsHidden"] = true;
        if (c[5]) ext["External"] = true;
        if (c[6]) ext["SystemColumn"] = c[6];
        this.Columns[col] = {"DataType":tp,"ExtendedProperties":ext};
    }    
}
DataTable.prototype.get_Columns=function() 
{
    // Need to return a hashtable of the columns
    var colsList = new DataColumnCollection();
    var col;
    for(var c in this.Columns)
    {
        col = this.Columns[c];
        if (!col.ColumnName) col.ColumnName=c;
        colsList.Add(c,col); // keyed by column name
    }
    return colsList;
}
DataTable.prototype.get_Rows=function() {return this.get_RowsFull();}
DataTable.prototype.get_RowsFull=function()
{
    var rows = [];
    for(var r in this.Rows)
    {
        rows.push(this.get_Row(r));
    }
    return rows;
}
DataTable.prototype.Merge = function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    var table = a[0];
    var preserveChanges = false, schemaAction=null;
    switch(overload)
    {
        case "DataTable_Boolean":
            preserveChanges = a[1];
            break;
        case "DataTable_Boolean_MissingSchemaAction": 
            preserveChanges = a[1];
            schemaAction = a[2];
            break;
    }
    
    var origTblName = null;
    var thisDS;
    if(this.DataSet)
    {
        thisDS = this.DataSet;
        if (this.TableName != table.TableName)
        {
            origTblName = table.TableName;
            table.TableName = this.TableName;
         }
    }
    else
    {
        thisDS = new DataSet();
        this.DataSet = thisDS;
        this.Columns = table.Columns;
        this.TableName = table.TableName;
        thisDS.AddTable(this, new EpiOverloadedArgs("DataTable"));
    }
    
    if (schemaAction)
        thisDS.Merge(table, preserveChanges, schemaAction, new EpiOverloadedArgs("DataTable_Boolean_MissingSchemaAction"));  
    else
        thisDS.Merge(table, preserveChanges,new EpiOverloadedArgs("DataTable_Boolean"));  
        
    if (origTblName) table.TableName = origTblName;
}

// Indicates whether the primary key columns of any row in the collection contain the specified value or values specified in the object array.
DataTable.prototype.RowsContains=function(pkVals)
{
    if (!Global.IsArray(pkVals)) pkVals = [pkVals];
    
    if (this.Find(pkVals) != null) return true;
    else return false;
}

DataTable.prototype.ColumnsContains=function(col)
{
    col = this._resolveColumnName(col);
    if(this.Columns[col])
        return true;
    else
        return false;
}
DataTable.prototype.AddColumns=function(columns)
{
    for(col in columns)
    {
        var theCol = columns[col];
        theCol.Table = this;
        
        if(!theCol.ColumnName) theCol.ColumnName = "_col" + this.ColumnSeq++;        
        
        if(Global.InstanceOf(theCol, 'DataColumn'))
        {
            this.Columns[theCol.ColumnName] = theCol;
            this[theCol.ColumnName] = theCol;
            this.Columns[theCol.ColumnName].Table = this;
            if (this.ColumnCount != -1) this.ColumnCount++; // Only if we already have a count
            if (this.ColumnIndexMap)
                this.ColumnIndexMap.Add(this.ColumnIndexMap.Count,theCol.ColumnName); // The index should be the last element in this arraylist
        }
        else
        {
            this.AddColumn(theCol.ColumnName, theCol.DataType,new EpiOverloadedArgs("String_String")); // AddColumns passes in array of DataColumns, but our Columns object does not store Datacolumns. so just use the column name.
        }
    }
}
DataTable.prototype.AddColumn=function()//columnName, dataType)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    var dataType="";
    var columnName="";
    switch(overload)
    {
        case "":
        break;
        case "DataColumn":
            this.Columns[a[0].ColumnName] = a[0];
            this[a[0].ColumnName] = a[0];
            this.Columns[a[0].ColumnName].Table = this;
            return;
        case "String":
            columnName = a[0];
            break;
        case "String_String": // Called from AddColumns
            columnName = a[0];
            dataType = a[1];
            break;
        case "String_Type":
        case "String_Type_String":
            columnName = a[0];
            var t = Type.Resolve(a[1]);
            if (t && t.Name) dataType = t.Name;
            else if (t && t.FullName) dataType = t.FullName;
            else dataType = a[1];      //a[1] instanceof Type       
        break;
    }
    this.Columns[columnName] = new DataColumn(columnName, dataType);   //{"DataType":dataType,"ExtendedProperties":{}};
    this[columnName] = this.Columns[columnName];
    this.Columns[columnName].Table = this;
    if (this.ColumnCount != -1) this.ColumnCount++; // Only if we already have a count
    if (this.ColumnIndexMap)
        this.ColumnIndexMap.Add(this.ColumnIndexMap.Count,columnName); // The index should be the last element in this arraylist
    return this.Columns[columnName];
}
DataTable.prototype.RemoveColumn=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    var columnName="";
    switch(overload)
    {
        case "String":
            columnName = a[0];
            break;
        case "DataColumn":
            columnName= a[0].ColumnName;
            break;
        default:
            return;
    }
    if (this.Columns[columnName])
    {
        
        
        if (this.ColumnCount != -1) this.ColumnCount--; // Only if we already have a count
        if (this.ColumnIndexMap)
        {
            var columnIndex = -1, cnt=0;
            for(var col in this.Columns)
            {
                if(columnName.toLowerCase()==col.toLowerCase()) 
                {
                    columnIndex = cnt;
                    break;
                }
                cnt++;
            }
            if (columnIndex >=0) 
                this.ColumnIndexMap.Remove(columnIndex);  
        }
        delete this.Columns[columnName];
        for(var ii=0, row; row=this._orig[ii]; ii++)
        {
            if (row[columnName]) 
               delete row[columnName];
        }
        // copy over rows
        for(var ii=0, row; row=this.Rows[ii]; ii++)
        {
            if (row[columnName]) 
               delete row[columnName];
        }
    }
}


DataTable.prototype._toRow=function(rowArray)
{
    var row = {};
    
    var idx = 0;
    for(var col in this.Columns)
    {
        if(rowArray.length>idx)
        {
            var isEmptyVal=false;
            if(this.Columns[col].DataType&&
                (this.Columns[col].DataType=="System.DateTime"||this.Columns[col].DataType=="System.Decimal"||this.Columns[col].DataType=="System.Int32") &&
                rowArray[idx]==""||rowArray[idx]==undefined) isEmptyVal=true;

            if(!isEmptyVal)
            {
                row[col] = rowArray[idx];
                if (row[col]==undefined || row[col]==null)
                {
                    var colO = this.Columns[col];
                    if (colO.DataType == "System.String")
                        row[col]="";
                }
            }
        }
        idx++;
    }
    return row;
}
DataTable.prototype.AddRow=function(row, epiOverloadedArgs)
{
    // Added code to check for this: var o=[]; tDS.get_OrderAllocList().AddRow(o,new EpiOverloadedArgs("ObjectArr"));
    if ((Global.IsArray(row) || (epiOverloadedArgs && epiOverloadedArgs instanceof EpiOverloadedArgs && epiOverloadedArgs.args=="ObjectArr")) 
        && !(Global.InstanceOf(row, "DataRow") && (row.get_Table() == this)))
        row = this._toRow(row);
    else if(arguments.length>2 && arguments[arguments.length-1] instanceof EpiOverloadedArgs && arguments[arguments.length-1].args=="ObjectArr")
    {
        var arr=[];
        for(var ii=0; ii<=arguments.length-2; ii++)
        {
            arr.push(arguments[ii]);
        }
        row = this._toRow(arr);
    }
    
    // First must make sure we are not violating pk constraints
    if (this.PrimaryKey && this.PrimaryKey.length > 0) // If primary keys are not set, allow the AddRow.
    {
        var pkExpr=this._getPKExpr();
        var o=row;
        var pkIdent=eval(pkExpr);
        if (pkIdent)
        {
            for(var ii=0, o; o=this.Rows[ii]; ii++)      
            {
                if(eval(pkExpr)==pkIdent) return;
            }
        }
    }
    if(!this.Rows) this.Rows = [];
    
    if(!row["RowMod"] || row["RowMod"] == "X") 
    {
        row["RowMod"]="A";
        row["_RowState"]="A";
    }
    var newLen = this.Rows.push(row);
    this.Count = this.Rows.length;
    
    row.Indx = newLen -1; // index of this row in the rows collection
    if (!this._inBeginLoadData)
    {
        if(Global.BindingEngine.IsBindingClear()&&this.DataSet)
        {
            try
            {
                var ds = this.DataSet;
                DialogHelper.RunOnAll(function(){Global.BindingEngine.Reload(EpiBindType.Merge,ds);});
            }
            catch(err){} 
        }
        else
        {
            var bFnd = false;
            // Find the EpiDataView for this table 
            for(var tbl in Global.BindingEngine.EpiDataViews)
            {
                var eDV=Global.BindingEngine.EpiDataViews[tbl];
                if (eDV.dataView.Table == this)
                {
                    eDV.Refresh(EpiBindType.Merge);
                    Global.BindingEngine.NotifyTabs(eDV.ViewName, eDV.Row);
                    
                    // Rebind the grids bound to this 
                    DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
                    // Notify the tree also about the new row
                    eDV.OnEpiViewNotificationTree(new EpiNotifyArgs(this, true, eDV.Row, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
                    bFnd = true;
                    break;
                }
            }    
            if (!bFnd)
            {
                for(vw in Global.BindingEngine.EpiDataViewsDangling.items)
                {
                    var danglingView = Global.BindingEngine.EpiDataViewsDangling.items[vw];
                    if(danglingView.dataView.Table && danglingView.dataView.Table == this)
                    {
                        danglingView.Refresh(EpiBindType.Merge);
                        DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(danglingView)});
                        bFnd = true;
                        break;
                    }
                }
            }
        }
    }
    
    if(this.DataSet && !this.DataSet.Data)
    {
        this.DataSet.Data = {};
    }
    
    if(this.DataSet)
    {
        this.DataSet.Data[this.TableName] = this.Rows;
    }
    return row.Indx; // return position of the row
}
DataTable.prototype.RowsInsertAt=function(row,pos)
{
    if(Global.IsArray(row)) row = this._toRow(row);

    if(!this.Rows) this.Rows = [];
    this.Rows.splice(pos,0,row);
    row.Indx = pos; // index of this row in the rows collection
    // VA
    // Find the EpiDataView for this table
    for(var tbl in eDV=Global.BindingEngine.EpiDataViews)
    {
        var eDV=Global.BindingEngine.EpiDataViews[tbl];
        if (eDV.dataView.Table == this)
        {
            eDV.Refresh(EpiBindType.Merge);
            break;
        }
    }    
}
DataTable.prototype.Remove=function(row)
{
    if (row && row.Delete)
    {
        // A developer can do this:  
        //    var row = ds1.Table["TheTable"].Rows[0];
        //    ds2.Table["TheTable"].Remove(row);
        // So, we're removing from a different table than where the row originated.  Figure this out.
    
    
        for(var rel in this.ChildRelations.items)
        {
            var childRows = row.GetChildRows(this.ChildRelations.items[rel]);
            for(var ii=0; ii<=childRows.length-1; ii++)
            {
                this.ChildRelations.items[rel].ChildTable.Remove(childRows[ii]);
            }
        }
    
        row.Delete();
        this.AcceptChanges();
        
        if(this.DataSet && !this.DataSet.Data)
        {
            this.DataSet.Data = {};
        }
        if(this.DataSet)
        {
            if(this.Rows.length==0)
                delete this.DataSet.Data[this.TableName];
            else
                this.DataSet.Data[this.TableName] = this.Rows;
        }
        
        for (var tbl in eDV = Global.BindingEngine.EpiDataViews)
        {
            var eDV = Global.BindingEngine.EpiDataViews[tbl];
            if (eDV.dataView.Table == this)
            {
                eDV.Refresh(EpiBindType.Merge,true);
                DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
                break;
            }
        }
        
    }
    
    
// Fire RowDeleted event
    
}
DataTable.prototype.get_ExtProps=function(dcName)
{
    if(!this._extPropsInit) this._initProps();

    var dcName = this._resolveColumnName(dcName);
    
    if(this.Columns[dcName])
    {
        if(!this.Columns[dcName].ExtendedProperties)
            this.Columns[dcName].ExtendedProperties = new Hashtable();
        
        return this.Columns[dcName].ExtendedProperties;
    }
    else
        return new Hashtable();
}
DataTable.prototype._initProps=function()
{   
    if(this.DataSet && this.DataSet.BOClass)
    {
        var ca = Global.ClassAttributes;
        var dsName = this.DataSet.DataSetName;
        if(dsName.EndsWith("DataSet")) dsName = dsName.substr(0,dsName.length-7);
        
        if(ca[this.DataSet.BOClass] && ca[this.DataSet.BOClass][dsName])
        {
            var tblAttr = ca[this.DataSet.BOClass][dsName][this.TableName];
            if(tblAttr)
            {
                for(col in tblAttr)
                {
                    if(this.Columns[col])
                    {
                        if(!this.Columns[col].ExtendedProperties) this.Columns[col].ExtendedProperties = new Hashtable();
                        for(attr in tblAttr[col])
                        {
                            if (attr == "Required" && !Global.ViewsWithRequiredCols[this.TableName])
                            {
                                Global.ViewsWithRequiredCols[this.TableName] = col;
                            }
                                
                            this.Columns[col].ExtendedProperties[attr] = tblAttr[col][attr];
                        }
                    }
                }
            }
            delete ca[this.DataSet.BOClass][dsName][this.TableName];
            if (!Global.ViewsWithRequiredCols[this.TableName]) Global.ViewsWithRequiredCols[this.TableName]="";
        }
    }    
    this._extPropsInit = true;
}
DataTable.prototype.GetExtendedProperty=function(dcName,propertyName,dflt)
{
    var prop = this.get_ExtProps(dcName)[propertyName];
    if(prop == undefined) 
    {
        prop = "";
        if(dflt!=null) prop=dflt;
    }

    return prop;
}
DataTable.prototype.SetExtendedProperty=function(dcName, propertyName, val)
{
    dcName =this._getColumnName(dcName); // Sometimes an index is being sent in
    dcName = this._resolveColumnName(dcName);
    if(this.Columns[dcName])
    {
        if((propertyName=="ReadOnly" || propertyName=="IsHidden" || propertyName=="Enabled") && Global.IsString(val))
        {
			val = Convert.ToBoolean(val, true);
        }
        
        var props = this.get_ExtProps(dcName);
        props[propertyName] = val;
    }
}
DataTable.prototype.Select=function(filter)
{
    return this._Select(filter,true);
}
function GetJSExpr(matchStr)
{
    var trimmedVal = matchStr.replace(/^\s*/, "").replace(/\s*$/, "");
    var repVal = trimmedVal;
    switch(trimmedVal.toLowerCase())
    {
        case "and": repVal = "&&"; break;
        case "or": repVal = "||"; break;
        case "not": repVal = "!"; break;
        case "<>": repVal = "!="; break;
        case "<=":  repVal = "<="; break;
        case ">=":  repVal = ">="; break;
        case "=":   repVal = "=="; break;
        case "true": case "'true'": repVal = "'true'"; break;
        case "false": case "'false'": repVal = "'false'"; break;
    }
                
    return repVal;
}
DataTable.prototype._Select = function(filter, isApps, includeDeleted)
{
    var Isnull = function(val, nullVal)
    {
        if (val == null || val == nullVal)
            return nullVal;
        else
            return null;
    }

    var me = this;
    var fixCase=function()
    {
        if(arguments[1].Contains(".")) return arguments[0];  
        var columnName = me._resolveColumnName(arguments[1]);
        if(!me.Columns[columnName]) return arguments[0];  

        var leftSide = "o['" + columnName + "']";
        var sign = arguments[2];
        var rightSide = arguments[3];
        if(me.Columns[columnName].DataType=="System.String")
        {
            leftSide = "(o['" + columnName + "']==undefined?null:o['" + columnName + "'].toLowerCase())";
            rightSide = rightSide.toLowerCase();
        }

        return leftSide + sign + rightSide;
    };

    if (!isApps) isApps = false;
    var items = [];

    // convert to js
    // VA - added true and false
    filter = filter.replace(/(?:'.*?'|".*?")|\b\s*true\s*\b|\b\s*false\s*\b|\'True\'|\'False\'|\b\s*and\s*\b|\b\s*or\s*\b|\b\s*not\s*\b|\s*<>\s*|\s*>\s+|\s*<\s+|\s*<=\s*|\s*>=\s*|\s*={1,2}\s*/gi, GetJSExpr);
    if (filter.indexOf("substring") == -1) // Temp fix...cant figure out a better way
        filter = filter.replace(/([^=<>'"\w\.\-\+\*/:]{1}|^)\s*([\w\.]+)\s*([^!=<>\|'"\(\w\.\-\+\*/\[]{1}|$)/gi, '$1Convert.ToBoolean($2, true)$3');

    filter = filter.replace(/(?:o\[')?(?:o.)?([a-zA-Z_][a-zA-Z0-9_^.]*)(?:'\])?\s*(={1,2}|<>|!=|>=|<=)\s*((?:')(?:[^']*)?(?:'))/gi, fixCase);

    var no_filter = (filter == "");
    var filter_func = null;
    
    try
    {
        //  Filter can be inciomplete or contain errors. In this case return nothing.
        var filter_func = new Function("o,Parent", "with(o) {return " + filter + ";}");
    }
    catch(e)
    {
        return items;
    }

    if (this.Rows)
    {
        var bltRow;
        var parentRows = [];
        if (filter.indexOf("Parent.") >=0 && this.ParentRelations && this.ParentRelations.Count > 0)
        {
            // 'Parent' is a keyword, referencing parent table data. build parent rows for all the child rows.
            for (var ii = 0, o; o = this.Rows[ii]; ii++)
                parentRows.push(this.GetParentRows(o, this.ParentRelations[0]));
        }

        for (var ii = 0, o; o = this.Rows[ii]; ii++)
        {
            try
            {
                if(!includeDeleted)
                {
                    if (o["RowMod"] != undefined && o["RowMod"] == "D") continue;
                }

                var Parent;
                if (parentRows && parentRows.length > 0 && parentRows[ii].length > 0)
                    Parent = parentRows[ii][0];
                    
                if (no_filter || filter_func(o,Parent))
                {
                    if (isApps)
                    {
                        bltRow = this.get_Row(ii);
                        items.push(bltRow);
                    }
                    else
                        items.push(o);
                }
            }
            catch (err) { }
        }
    }

    return items;
}
DataTable.prototype.Compute=function(expr,filter)
{
    var rows=this._Select(filter);

    var Count=function(col)
    {
        return rows.length;
    }     
    var Sum=function(col)
    {
        var s=0;
        for(var r in rows)
        {
            var val = rows[r][col];
            if(val)
            {
                s=s+Convert.ToDecimal(val);
            }
        }
        return s;
    }
    
    expr = expr.replace(/Count\(([\w]*)\)/,"Count('$1')");
    expr = expr.replace(/Sum\(([\w]*)\)/,"Sum('$1')");
    return eval(expr);
}
DataTable.prototype._Count=function(expr)
{
}
DataTable.prototype.get_Column=function(col)
{
    if(!this._extPropsInit) this._initProps();

    col = this._getColumnName(col);
    col = this._resolveColumnName(col);   
    var column = this.Columns[col];
    
    if(!column) column = new DataColumn(col);
    column.ColumnName = col;
    column.Table = this;
    column.toString=function(){return col;}
    column.Equals=function(val){return val==this;}
    
    if(!(column.ExtendedProperties instanceof Hashtable))
    {
        var extProps = new Hashtable();
        for(var ep in column.ExtendedProperties)
        {
            extProps.Add(ep, column.ExtendedProperties[ep]);
        }
        column.ExtendedProperties = extProps;
    }
    
    return column;
}

DataTable.prototype.get_Row=function(idx)
{
    if(idx<0) return null;

    var me = this;
    var row = null;
    if(this.Rows && this.Rows.length > 0)
    {    
        var row = this.Rows[idx];
        if (row)
        {
            row = this._buildRow(row);
            row.Indx = idx; // index of this row in the rows collection
            row.set_Item=function(col,val) {me.SetRowValue(idx,col,val);}
        }
    }
    return row;
}
DataTable.prototype._buildRow=function(row, idx)
{
    var me = this;

    row.EndEdit=function() {}
    row.BeginEdit=function() {}
    row.get_RowState=function(){return this["RowMod"];}
    row.Delete=function() {me._deleteRow(this);}
    row.get_Table=function(){return me;}
    row.set_Item=function(col,val)
    {
        if(this.Indx!=undefined)
            me.SetRowValue(this.Indx,col,val);
        else 
            me.SetRowValueNoIdx(this,col,val);
    }
    row.get_Item=function(col){return me.GetRowValue(this, col);}
    row.GetChildRows=function(rel) {return me.GetChildRows(this,rel);}
    row.GetParentRows=function(rel) {return me.GetParentRows(this,rel);}
    row.get_ItemArray=function(){return me._getRowItemArray(this);}
    row.SetAdded=function(){};
    row.SetModified=function(){if(this.get_Item("RowMod")==DataRowState.Unchanged) this.set_Item("RowMod","U")};
    row.IsNull=function(col)
    {
        var val = this[me._resolveColumnName(col)];
        if (val == null || val == undefined) return true;
        else return false;
    }
    row.AcceptChanges=function(){};
    row.type = "DataRow";
    //row.Row = row;
    
    return row;
}

DataTable.prototype._getRowItemArray=function(row)
{
    var values=[];
    var val;
    for(var c in this.Columns)
    {
        val = row[c];
        
        if (typeof(val) == "string" && c!="type" && c!= "Indx")
            values.push(val);
        else if (val == undefined)
            values.push("");
    }
    return values;
}

DataTable.prototype._deleteRow = function(row)
{
    this.get_Event("RowDeleting").fire(this, { "Row": row });

    var i, cnt = this.ChildRelations.Count;
    for (i = 0; i < cnt; i++)
    {
        var childRows = row.GetChildRows(this.ChildRelations[i]);
        var j, subCnt = childRows.length;
        for (j = 0; j < subCnt; j++)
            childRows[j].Delete();
    }

    if(row["RowMod"]=="A")
    {
        // find idx first
        var idx=-1;
        for(var ii=0;ii<this.Rows.length-1;ii++)
        {
            if(this.Rows[ii]==row)
            {
                idx=ii;
                break;
            }
        }     
        if(ii>-1) 
        {
            this.Rows.splice(ii, 1);
        }
    }
    else
    {
        row["RowMod"]="D";
        row["_RowState"]="D";
    }

//    row["RowMod"] = "D";
//    row["_RowState"] = "D";
    
    for (var tbl in eDV = Global.BindingEngine.EpiDataViews)
    {
        var eDV = Global.BindingEngine.EpiDataViews[tbl];
        if (eDV.dataView.Table == this)
        {
            eDV.Refresh(true);
        }
    }
}

// Returns the column name from col - since col can be an index or the name of the column
DataTable.prototype._getColumnName=function(col)
{
    var colName = null;
    if (Global.IsNumber(col))
    {
        if (this.ColumnIndexMap)
        {
            if (this.ColumnIndexMap.ContainsKey(col))
                colName = this.ColumnIndexMap[col];
        }
        else
        {
            this.ColumnIndexMap = new Hashtable();
            var cnt = 0;
            for(var col1 in this.Columns)
            {
                if(cnt==col) 
                {
                    colName = col1;
                   // break; // can't break because we want to fill the map. but this code should run only once, later the hash will be used.
                }
                this.ColumnIndexMap.Add(cnt,col1);
                cnt++;
            }
        }
    }
    else if (Global.IsString(col))
        colName = col;

    return colName;
}
DataTable.prototype._resolveColumnName=function(colName)
{
    if(colName!=null)
    {
        if(!this.Columns[colName]) 
        {
            // Maybe we have a case-sensitivity issue
            var lCase = colName.toLowerCase();
            for(var c in this.Columns)
            {
                if(c.toLowerCase()==lCase) 
                {
                    colName = c;
                    break;
                }
            }
        }
    }
    
    return colName;
}
DataTable.prototype.GetRowValue=function(row,col)
{
    if (col == "ItemArray")
        return this._getRowItemArray(row);
     
    if (col.ColumnName) col = col.ColumnName; // sometimes comes in as an object
    var colName = this._getColumnName(col);
    
    if(colName!=null)
    {
        if (row[colName] == undefined) 
        {
            // Maybe we have a case-sensitivity issue
            var lCase = colName.toLowerCase();
            for(var c in row)
            {
                if(c.toLowerCase()==lCase) 
                {
                    colName = c;
                    break;
                }
            }
        }
        
        
        if (row[colName] == undefined) 
            return this.GetTypedValue(colName, ""); // Passing a blank makes this method return the correct typed default. e.g. if a bool col is "", it returns false.
        else
            return this.GetTypedValue(colName, row[colName]);
    }
}
DataTable.prototype.GetChildRows=function(row, rel)
{
    var filter = "";
    var joiner = "";
    for(var col in rel.ChildColumns)
    {
        filter += joiner;
    
        var childColName = rel.ChildColumns[col];
        var parentColName = rel.ParentColumns[col];
        
        var parentVal = row[parentColName].toString().toLowerCase();
        filter += "(" + childColName + ".toString().toLowerCase()='" + parentVal + "')";
        
        joiner = " && ";
    }
    var rows = rel.ChildTable._Select(filter,null,true);
    
    for(var row in rows)
    {
        rows[row] = rel.ChildTable._buildRow(rows[row], row);
    }
    return rows;
}
DataTable.prototype.GetParentRows=function(row, rel)
{
    var filter = "";
    var joiner = "";
    for(var col in rel.ParentColumns)
    {
        filter += joiner;
    
        var childColName = rel.ChildColumns[col];
        var parentColName = rel.ParentColumns[col];
        
        var childVal = row[childColName];
        filter += "(" + parentColName + "='" + childVal + "')";
        
        joiner = " && ";
    }
    var rows = rel.ParentTable._Select(filter);
    
    for(var row in rows)
    {
        rows[row] = rel.ParentTable._buildRow(rows[row], row);
    }
    return rows;
}
DataTable.prototype.GetStrForTypedValue=function(colName,val)
{
    if(val==null) val = "";

    if(Global.IsString(val)) 
    {
        // Sometimes a date might come in as a string
        if (this.Columns[colName] && this.Columns[colName].DataType=="System.DateTime")
        {
            var dt = this.GetTypedValue(colName,val);
            val = dt;
        }
        else if (this.Columns[colName] && this.Columns[colName].DataType=="System.Boolean")
        {
            return val.toLowerCase();
        }
        else 
        return val;
    }

    var retVal = val;
    if(this.Columns[colName])
    {
        var col = this.Columns[colName];
        switch(col.DataType)
        {
            case "System.Boolean":
            case System.Boolean:
                retVal = val.toString().toLowerCase();
                break;
            case "System.DateTime":
                if(!val) retVal = undefined;
                else
                {
                    retVal = FormatEngine.FormatDate(val, "yyyy-MM-ddThh:mm:ss");
                }
                break;
            case "System.Int32":
            case "System.Int16":
            case "System.Decimal":
            case "System.Double":
            default: // covers string
                retVal = val.toString();
                break;
        }        
    }
    return retVal;
}

DataTable.prototype.GetTypedValue=function(colName,val)
{
    var retVal = val;
    if(this.Columns[colName])
    {
        var col = this.Columns[colName];
        switch(col.DataType)
        {
            case "System.Boolean":
                if(val=="")
                    retVal = false;
                else
                    retVal = Convert.ToBoolean(val);
                break;
            case "System.DateTime":
                if(val!="") retVal = Convert.ToDateTime(val);
                break;
            case "System.Int32":
            case "System.Int16":
                if(val=="") 
                    retVal=0;
                else
                    retVal = Convert.ToInt32(val);
                break;
            case "System.Decimal":
            case "System.Double":
                if(val=="") 
                    retVal = 0;
                else
                    retVal = Convert.ToDecimal(val);
                break;
        }        
    }
    return retVal;
}
DataTable.prototype.SetRowValueNoIdx=function(row,col,val)
{
    var foundFlg = false;
    var colName = this._getColumnName(col);
    colName = this._resolveColumnName(colName);
    if (colName == null) return;
    
    val = this.GetStrForTypedValue(colName,val);
    if (val == undefined) return;
    
    for(var tbl in eDV=Global.BindingEngine.EpiDataViews)
    {
        var eDV=Global.BindingEngine.EpiDataViews[tbl];
        if (eDV.dataView.Table == this)
        {
            eDV.SetRowValue(row,colName,val);
            foundFlg = true;
            break;
        }
    }    
    
    if(!foundFlg) row[colName] = val;
}
DataTable.prototype.SetRowValue=function(idx,col,val)
{
    var foundFlg = false;
    var colName = this._getColumnName(col);
    if (colName == null) return;
    
    val = this.GetStrForTypedValue(colName,val);
    if (val == undefined) return;
    
    var dv;
    var edvList=[];
    for(var tbl in eDV=Global.BindingEngine.EpiDataViews)
    {
        var eDV=Global.BindingEngine.EpiDataViews[tbl];
        dv = eDV.dataView;
        if (dv.Table == this)
        {
            // sometimes filters will cause edv to have fewer rows than the table, make sure we are updating the right edv.
            if (dv.Count != this.Count)
            {
                if (idx < dv.Count && dv.Rows[idx]==this.Rows[idx]) // make sure index is valid and this row exists in the edv
                {
                    eDV.SetValue(idx,colName,val);
                    eDV.Refresh(true);
                    DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
                    foundFlg = true;
                }
                else
                {
                   edvList.push(eDV);
                }
            }
            else
            {
                eDV.SetValue(idx,colName,val);
                eDV.Refresh(true);
                DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
                foundFlg = true;
            }
        }
    }    
    
    if(!foundFlg) 
    {
        this.Rows[idx][this._resolveColumnName(colName)] = val;
    }
    
    for(var itm in edvList)
    {
        eDV=edvList[itm];
        dv = eDV.dataView;
        if (dv.RowFilter || eDV.StaticFilter || eDV.AdditionalFilter)
        {
            eDV.Refresh(EpiBindType.Merge,true);
            DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
         }
         else if (dv && dv.Table && dv.Table.DataSet)
         {
            eDV.Refresh(EpiBindType.Merge,true, true);
            Global.BindingEngine.BindForm(dv.Table.DataSet);
         }
            
    }
}
DataTable.prototype.NewRow = function()
{
    var props = {};
    for (var colName in this.Columns)
    {
        if(!this.Columns[colName].DataType||this.Columns[colName].DataType!="System.DateTime")
            props[colName] = null;
    }
    props["RowMod"] = "X";

    return this._buildRow(props);
}

DataTable.prototype.Clear=function()
{
    this.Rows = [];
    this.Count = 0;
    this.ColumnCount = -1;
    
    if(this.DataSet&&this.DataSet.Data)
        delete this.DataSet.Data[this.TableName];

    if (this.ColumnIndexMap) this.ColumnIndexMap = null;
    
    for(var tbl in Global.BindingEngine.EpiDataViews)
    {
        var eDV=Global.BindingEngine.EpiDataViews[tbl];
        if (eDV.dataView.Table == this)
        {
//            eDV.dataView.Rows=[];
//            eDV.dataView.Count=0;
            eDV.Refresh(EpiBindType.Clear);
            Global.BindingEngine.NotifyTabs(eDV.ViewName, -1);
           break;
        }
    }   
   
//    Global.BindingEngine.BindForm(this.DataSet);
}
DataTable.prototype._getPKExpr=function()
{
    if(!this._pkExpr)
    {
        var pkExpr="";
        var firstTime=true;
        for(var pKey in this.PrimaryKey)
        {
            if(!firstTime) pkExpr+="+'|'+";
            if(Global.IsString(this.PrimaryKey[pKey]))
                pkExpr+="o['" + this.PrimaryKey[pKey] + "']";
            else
                pkExpr+="o['" + this.PrimaryKey[pKey].ColumnName + "']";
                
            firstTime=false;
        }
        
        if(pkExpr==""||!pkExpr) pkExpr="o['RowIdent']";
        
        this._pkExpr=pkExpr;
    }
    return this._pkExpr;
}
DataTable.prototype.set_PrimaryKey=function(pkArray)
{
    this.PrimaryKey = pkArray; // comes in as a string array
}
DataTable.prototype.get_PrimaryKey=function(key)
{
    if(key)
    {
        // old translation -- backwards compatability
        var pk = this.PrimaryKey[key];
        return new DataColumn(pk);
    }
    else
    {
        // new translation
        var pk = [];
        for(var pKey in this.PrimaryKey)
        {
            if(Global.IsString(this.PrimaryKey[pKey]))
                pk.push(new DataColumn(this.PrimaryKey[pKey]));
            else
                pk.push(this.PrimaryKey[pKey]);
        }
        return pk;
    }    
        
}

DataTable.prototype.Find=function(primaryKeyVals)
{
    var row = null;
    if (this.PrimaryKey && this.PrimaryKey.length > 0
        && primaryKeyVals && primaryKeyVals.length >0)
    {
        for(var ii=0, row; row=this.get_Row(ii); ii++)
        {
            var bFound = true;
            for (var i=0, key; key=this.PrimaryKey[i]; i++)
            {
                var keyVal = row[key];
                var pkVal = primaryKeyVals[i];
                if(Global.IsString(keyVal) && !Global.IsString(pkVal))
                {
                    keyVal = row.get_Item(key);    
                    
                    if(Global.IsDate(pkVal)) pkVal = FormatEngine.FormatDate(pkVal, "yyyy-MM-ddThh:mm:ss");
                    if(Global.IsDate(keyVal)) keyVal = FormatEngine.FormatDate(keyVal, "yyyy-MM-ddThh:mm:ss");
                }
                
                if (keyVal != pkVal)
                {
                    bFound = false;
                    break;
                }
            }
            if (bFound == true) // found the matching row
                break;
        }
    }
    return row;
}
DataTable.prototype.GetColumnCount=function()
{
    if (this.ColumnCount >= 0) return this.ColumnCount;
    
    var ctr = 0;
    for(var col in this.Columns)
    {
        ctr++;
    }
    this.ColumnCount = ctr;
    return ctr;
}

DataTable.prototype.CopyColumns=function(arr,idx)
{
    var ctr = 0;
    var newArrIdx = 0;
    for(var col in this.Columns)
    {
        this.Columns[col].ColumnName = col;
        if(ctr>=idx)
        {
            if(arr[newArrIdx]==undefined)
                arr[newArrIdx++] = this.Columns[col];
            else                
                arr.push(this.Columns[col]);
        }
        ctr++;
    }
}

DataTable.prototype._populateOrigRows=function()
{
    var origRows = [];
    for(var ii=0, row; row=this.Rows[ii]; ii++)
    {
        if(row["RowMod"]==DataRowState.UnChanged)
            origRows.push(this.CopyRow(row));
    }
    this._orig = origRows;
}
DataTable.prototype.AcceptChanges=function()
{ 
    var origRows = [];
    var rowsNotDel = [];
    var row, rowsDeleted = false, deleted = false, retVal = false;
    for(var ii = 0; ii < this.Rows.length; ii++)
    {
        row=this.Rows[ii];
        deleted = false;
        if (row["RowMod"]==DataRowState.Modified || row["RowMod"]==DataRowState.Added)
        {
            if (Global.Form.ID!="SelectSerialNumbersEntryForm" && Global.Form.ID!="JobEntryForm" && Global.Form.ID!="ExpressPartCheckoutForm")
            {
                row["RowMod"]=DataRowState.UnChanged; 
                row["_RowState"]=DataRowState.UnChanged;
            }
            retVal = true;
        }
        else if (row["RowMod"]==DataRowState.Deleted)
        {
            //  Delete doesn't shift keys in array as all JS arrays are hashtables
            delete this.Rows[ii];
            deleted = true;
            rowsDeleted = true;
            retVal = true;
        }
        if (!deleted) // If this row was not deleted...
        {
            origRows.push(this.CopyRow(row)); // This row will have RowMod of UnChanged and if a row had a rowstate of Deleted, it wont exist any more
            rowsNotDel.push(row);
        }
    }
    if (rowsDeleted)
    {
        this.Rows = rowsNotDel;
    }
    this._orig = origRows;
    return retVal;
}
DataTable.prototype.RejectChanges=function()
{ 
    var retVal = false;
    if(this.Rows.length > 0 || this._orig.length > 0)
    {
        if (this._orig.length == 0) this.Rows = [];
        else
        {
            this.Rows=[];
            for(var i=0; i<this._orig.length; i++)
            {
                this.Rows.push({});
                for(var col in this._orig[i])
                {
                    this.Rows[i][col] = this._orig[i][col];
                }
            }
        }
        retVal = true;
    }
    if (retVal == true && !this._inDataSetReject)
    {
        var bFnd = false;
        // Find the EpiDataView for this table 
        for(var tbl in Global.BindingEngine.EpiDataViews)
        {
            var eDV=Global.BindingEngine.EpiDataViews[tbl];
            if (eDV.dataView.Table == this)
            {
                eDV.Refresh(EpiBindType.Merge);
                bFnd = true;
                break;
            }
        }    
        if (!bFnd)
        {
            for(vw in Global.BindingEngine.EpiDataViewsDangling.items)
            {
                var danglingView = Global.BindingEngine.EpiDataViewsDangling.items[vw];
                if(danglingView.dataView.Table && danglingView.dataView.Table == this)
                {
                    danglingView.Refresh(EpiBindType.Merge);
                    bFnd = true;
                    break;
                }
            }
        }
    }
    return retVal;
}
DataTable.prototype.GetChanges=function()
{
    var newTbl = new DataTable(this.TableName, {"Columns":this.Columns,"PrimaryKey":this.PrimaryKey});
    for(var ii=0, row; row=this.Rows[ii]; ii++)
    {
        if(row["RowMod"]!=DataRowState.UnChanged)
            newTbl.Rows.push(this.CopyRow(row));
    }
    
    if(newTbl.Rows.length==0) newTbl = null;
    return newTbl;
}
DataTable.prototype.CopyRow=function(row)
{
    var newRow = {};
    for(var itm in row)
    {
        newRow[itm] = row[itm];
    }
    return newRow;
}

DataTable.prototype.Copy=function()
{
    // Copy structure and data
    var tblName = this.TableName;
    if (this.TableName instanceof DataColumn) tblName = this.origName;
    var newTbl = new DataTable(tblName, {"Columns":this.Columns,"PrimaryKey":this.PrimaryKey});
    newTbl.DataSet = this.DataSet;
    newTbl.ColumnCount = this.ColumnCount;
    
    // copy over _orig rows
    for(var ii=0, row; row=this._orig[ii]; ii++)
    {
        newTbl._orig.push(this.CopyRow(row));
    }
    // copy over rows
    for(var ii=0, row; row=this.Rows[ii]; ii++)
    {
       newTbl.Rows.push(this.CopyRow(row));
    }
    return newTbl;
}
DataTable.prototype.Clone=function()
{
    // Copy structure and data, not datarelations or dataset though.
    var newTbl = new DataTable(this.TableName, {"Columns":this.Columns,"PrimaryKey":this.PrimaryKey});
    newTbl.DataSet = null;
    
    return newTbl;
}
DataTable.prototype.BeginLoadData=function(){this._inBeginLoadData = true;}
DataTable.prototype.EndLoadData=function()
{
    this._inBeginLoadData = false;
    
    if(Global.BindingEngine.IsBindingClear()&&this.DataSet)
    {
        try
        {
            var ds = this.DataSet;
            DialogHelper.RunOnAll(function(){Global.BindingEngine.Reload(EpiBindType.Merge,ds);});
        }
        catch(err){} 
    }
    else
    {
        var bFnd = false;
        // Find the EpiDataView for this table 
        for(var tbl in Global.BindingEngine.EpiDataViews)
        {
            var eDV=Global.BindingEngine.EpiDataViews[tbl];
            if (eDV.dataView.Table == this)
            {
                eDV.Refresh(EpiBindType.Merge);
                Global.BindingEngine.NotifyTabs(eDV.ViewName, eDV.Row);
                
                // Rebind the grids bound to this 
                DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
                // Notify the tree also about the new row
                eDV.OnEpiViewNotificationTree(new EpiNotifyArgs(this, true, eDV.Row, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
                bFnd = true;
                break;
            }
        }    
        if (!bFnd)
        {
            for(vw in Global.BindingEngine.EpiDataViewsDangling.items)
            {
                var danglingView = Global.BindingEngine.EpiDataViewsDangling.items[vw];
                if(danglingView.dataView.Table && danglingView.dataView.Table == this)
                {
                    danglingView.Refresh(EpiBindType.Merge);
                    DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(danglingView)});
                    bFnd = true;
                    break;
                }
            }
        }
    }
}
DataTable.prototype.LoadDataRow=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "ObjectArr_Boolean": //Finds and updates a specific row. If no matching row is found, a new row is created using the given values.
             return this._loadDataRow(a[0],a[1]);

        case "ObjectArr_LoadOption":
            return this._loadDataRow(a[0], false, a[1]);
        break;
    }
}
DataTable.prototype.ImportRow=function(row)
{
    this._loadDataRow(row,false);
}
DataTable.prototype._loadDataRow=function(objVals,doAcceptChanges, loadOptions)
{
//    TODO: We dont handle loadOptions yet, because we dont maintain column versions.
//    OverwriteChanges: The incoming values for this row will be written to both the current value and the original value versions of the data for each column. 
//    PreserveChanges: The incoming values for this row will be written to the original value version of each column. The current version of the data in each column will not be changed. [This] is the default. 
//    Upsert: The incoming values for this row will be written to the current version of each column. The original version of each column's data will not be changed.
    if (!loadOptions) loadOptions = LoadOption.OverwriteChanges;
    
    // Use the primary keys to find a matching row.
    var pkVals = [];
    var colIndx = 0;
    
    if(Global.IsArray(objVals))
    {
        for (var i=0,pk; pk=this.PrimaryKey[i]; i++)
        {
            colIndx = 0;
            for(var col in this.Columns)
            {
               // Find all the primary key values from the objVals - we assume the index of the column is the same
               if (pk == col) pkVals.push(objVals[colIndx]);
               colIndx++;
            }
        }
    }
    else
    {
        for (var i=0,pk; pk=this.PrimaryKey[i]; i++)
        {
            pkVals.push(this._resolveColumnName(objVals[pk]));
        }
    }
    var row = null;
    if (pkVals.length > 0)
        row = this.Find(pkVals);
    if (row == null ) // row not found, add a new row
    {
        var rowI = this.AddRow(objVals);
        row = this.Rows[rowI];
        //row["RowMod"]=""; // This is a .Net method, shouldnt affect RowMod i think
        row["_RowState"]="";
    }
    else
    {
         // Need to update the existing row
         var i=0, objVal, rowVal;
         
         for (var col in row)
         {
            objVal = objVals[i];
            
            switch(loadOptions)
            {
                case LoadOption.OverwriteChanges:
                case LoadOption.PreserveChanges:
                case LoadOption.Upsert:
                default:
                    row[col] = objVal;
                    break;
            }
            i++;
         }
    }
    if (doAcceptChanges)
     this.AcceptChanges();
     
     // Do we need to refresh the dataviews??
     
     return row;
}

var DataColumn = System.Data.DataColumn = function(columnName, type)
{
    EpiObject.call(this, "DataColumn");

    this.ColumnName;
    this.Caption;
    if(columnName && Global.IsString(columnName)) this.ColumnName = columnName;
    this.ExtendedProperties = new Hashtable();
    this.AutoIncrement = false;
    this.ProposedValue;
    this.Table;
    
    if (!type) type = "System.String";
    if (type instanceof System.Type) type = type.Name;
    
    if (!Global.IsString(type))
    {
        switch(type)
        {
            case System.Boolean:
                type = "System.Boolean"; break;
            case System.String: 
                type = "System.String"; break;
            case System.Int32:
                type = "System.Int32"; break;
            case System.Double:
                type = "System.Double"; break;
            default:
                type = "System.String"; break;
        }
    }
    else if (type == "boolean")
        type = "System.Boolean";
    

    this.DataType = type;
}
DataColumn.prototype=new EpiObject();
DataColumn.prototype.set_ColumnName=function(val)
{
    if(this.ColumnName==val) return;

    if(this.Table)
    {
        var origColumnName=null;
        if(this.ColumnName)
        {
            origColumnName=this.ColumnName;
            delete this.Table.Columns[this.ColumnName];
            delete this.Table[this.ColumnName];
        }
        
        this.ColumnName = val;       
        this.Table.Columns[val] = this;
        this.Table[val] = this;
        // Update any existing rows too with the new column name
        if (origColumnName && this.Table.Rows && this.Table.Rows.length > 0)
        {
            var row;
            for (var r = 0; r < this.Table.Rows.length; r++)
            {
                row = this.Table.Rows[r];
                row[this.ColumnName] = row[origColumnName];
                delete row[origColumnName];
            }
        }
    }
    else
        this.ColumnName = val;
}
var DataColumnChangeEventArgs = System.Data.DataColumnChangeEventArgs=function(row,column,value)
{
    EventArgs.call(this,"DataColumnChangeEventArgs");
    this.Row = row;
    this.Column = column;
    this.ProposedValue = value;
}
DataColumnChangeEventArgs.prototype=new EventArgs();
DataColumnChangeEventArgs.prototype.get_Row=function()
{
    if (this.RowIdx != undefined)
        return this.Row.get_DataView().get_Row(this.RowIdx);
    else
        return this.Row;
}

var DataView = System.Data.DataView = function(tbl)
{
    EpiObject.call(this, "DataView");
    
    this.Table = tbl;
    this.Row = -1;
    this.RowFilter = "";
    this.ServerFilter = "";
    this.Sort="";
    this._EpiDataViews=[];
    if(tbl && tbl.Rows && tbl.Rows.length>0)
    {
        this.Count = tbl.Rows.length;
        this.Rows = tbl.Rows;
    }   
    else
    {
        this.Count = 0;
        this.Rows = [];
    }
}
DataView.prototype=new EpiObject();
DataView.prototype.BeginInit=function(){}
DataView.prototype.EndInit=function(){}
DataView.prototype.ToTable=function()
{
    var tbl=this.Table.Clone();
    tbl.Rows = this.Table.Select(this.RowFilter);
    tbl.Count = tbl.Rows.length;
    tbl._populateOrigRows();

    return tbl;
}
DataView.prototype.set_Sort = function(value)
{
    //  Skip unnecessary sorting
    if (this.Sort == value) return false;
        
    this.Sort = value;
    this.ApplySort(this.Rows);
    
    return true;
}
DataView.prototype._getSortArray=function(sort)
{
        var sortCols = new Array();
        var sortDirs = new Array();

        var terms = sort.Split(",");
        for (var i = 0; i < terms.length; i++)
        {
            var ids = terms[i].replace(new RegExp("^[\\s]", "g"), "").replace(new RegExp("[\\s]$", "g"), "").Split(" ");
            sortCols[i] = ids[0];
            if (ids.length == 1)
                sortDirs[i] = 1;
            else if (ids[1].toUpperCase() == "DESC")
                sortDirs[i] = -1;
            else
                sortDirs[i] = 1;
        }

    return {"Cols":sortCols,"Dirs":sortDirs};
}
DataView.prototype.ApplySort = function(rows,sort)
{
    if(!sort) sort=this.Sort;

    if (sort)
    {
        if (sort.length > 0)
        {
            var arrs=this._getSortArray(sort);
            sortCols=arrs["Cols"];
            sortDirs=arrs["Dirs"];

            var ds = this.Table.DataSet;

            var cacheInfo=null;
            var viewName=null;
            if(ds&&ds.CacheInfo)
            {
                // Get the list of grids that are bound to this data.
                var grids={};
                var filter="";
                for(var e in this._EpiDataViews)
                {
                    viewName=this._EpiDataViews[e].ViewName;
                    var gbv=Global.BindingEngine.GridsByView[viewName];
                    for(var g in gbv)
                    {
                        grids[g]=gbv[g];
                        
                        if(grids[g].GroupFilter&&grids[g].GroupFilter!="") 
                        {
                            if(filter!="") filter+=" AND ";
                            filter+=grids[g].GroupFilter;
                        }
                    }
                }
                if(this.ServerFilter) 
                {
                    if(filter!="") filter+=" AND ";
                    filter+=this.ServerFilter;
                }                
                if(filter=="") filter=null;             
                
                var cacheInfo=null;
                if(ds&&ds.CacheInfo&&ds.CacheInfo.Views&&ds.CacheInfo.Views[viewName])
                    cacheInfo=ds.CacheInfo.Views[viewName];
                else if(ds&&ds.CacheInfo)
                    cacheInfo=ds.CacheInfo;    
                
                if(cacheInfo.Sort==sort) return;
            
                var cnt=cacheInfo.End-cacheInfo.Start+1;
                Global.GetCachedDS(this,0,cnt,filter,grids);
            }
            else
            {
        this.SetSortInner(sortCols, sortDirs, rows);
    }
        }
    }
}
DataView.prototype.SetSortInner = function(sortCols, sortDirs, rows)
{
    var me = this;

    var f = function(a, b)
    {
        try
        {
            for (var i = 0; i < sortCols.length; i++)
            {
                var aVal = me.Table.GetTypedValue(sortCols[i], a[sortCols[i]]);
                var bVal = me.Table.GetTypedValue(sortCols[i], b[sortCols[i]]);

                // Undefined values are always greater than other values
                if (aVal == undefined)
                    return sortDirs[i]; 
                if (bVal == undefined)
                    return -sortDirs[i];

                if (Global.IsString(aVal)) // Do a case-insensitive comparison if the columns are strings.
                {
                    if (aVal.toLowerCase() < bVal.toLowerCase())
                        return -sortDirs[i];
                    else if (aVal.toLowerCase() > bVal.toLowerCase())
                        return sortDirs[i];
                }
                else
                {
                    if (aVal < bVal)
                        return -sortDirs[i];
                    else if (aVal > bVal)
                        return sortDirs[i];
                }
            }

            return 0;
        }
        catch (err)
        {
            return 0;
        }
    }

    rows.sort(f);
}
DataView.prototype.get_RowFilter = function()
{
    return this.RowFilter;
}
DataView.prototype.set_RowFilter=function(val) 
{
    if(!val) val="";

    // If there are any dates, make sure they are in the US format because the data in the dataview is always the US format
    var me = this;
    //val = val.replace(/(\d{1,2})\/(\d{1,2})\/((?:\d{4}|\d{2}))/gi, GetUSDate);
    val = val.replace(/(?:o\[')?(\w+[.]?\w*)(?:'\])?(?:.toLowerCase\(\))?\s*(={1,2}|<>|>=|<=)\s*(')((\d{1,2})\/(\d{1,2})\/((?:\d{4}|\d{2})))(')/gi, function(){return me.FixDateComparison.apply(me,arguments);});
    this.RowFilter = val;
    if (this._EpiDataViews.length == 0)
    {
        var tempView = new EpiDataView();
        tempView.set_dataView(this);
    }
    var eDV;
    for(var e in this._EpiDataViews)
    {
        eDV = this._EpiDataViews[e];
        
        var prevRow = eDV.Row;
        var prevLen = this.Rows.length;

        eDV.Refresh(EpiBindType.None);
        // Rebind the grids bound to this 
        DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
        // Same code as in set_StaticFilter - this updates the ui if the edv has changed as a result of the filter
        if(eDV.Row==-1 && this.Rows.length>0)
        {
            eDV.set_Row(0);
            Global.BindingEngine.BindDataView=eDV.ViewName;
            Global.BindingEngine.BindForm();
            Global.BindingEngine.BindDataView=null;
        }
        else if (prevRow >=0 && eDV.Row == -1 && prevLen >0 &&  this.Rows.length==0) // We dont have any rows in the edv now
        {
            Global.BindingEngine.BindDataView=eDV.ViewName;
            Global.BindingEngine.BindForm();
            Global.BindingEngine.BindDataView=null;
        }
    }
}
DataView.prototype.FixDateComparison=function()
{
    var columnName = arguments[1];
    var sign = arguments[2];
    var leftQuote = arguments[3];
    var dateVal = arguments[4];
    var rtQuote = arguments[8];
    var parentCol=false;
    if (columnName && columnName.StartsWith("Parent.")) // Parent is a keyword which refers to the parent table in the RowFilter.
    {
        columnName = columnName.replace("Parent.","");
        if (this.Table && this.Table.ParentRelations && this.Table.ParentRelations.Count > 0)
        {
            if (this.Table.ParentRelations[0].ParentTable.Columns[columnName])
                columnName = "Parent." + columnName + ".substring(0, 19)";
        }
    }
    else if (columnName && this.Table && this.Table.Columns[columnName])
    {
        columnName = "o['" + columnName + "'].substring(0, 19)";
    }
    
    try
    {
        var dt = FormatEngine.ToDate(dateVal);
        dateVal = FormatEngine.FormatDate(dt, "yyyy-MM-ddT00:00:00"); // setting the time to 00 specifically becuase FormatDate is changing the hh from 00 to 12.
    }catch(e){}
    
    if (columnName && sign)
        return columnName + sign + leftQuote+ dateVal + rtQuote;
    else
        return leftQuote+ dateVal + rtQuote;
}
//function GetUSDate(matchStr)
//{
//    var repVal = matchStr;
//    var dt = FormatEngine.ToDate(repVal);
//    repVal = FormatEngine.FormatDate(dt, "yyyy-MM-ddT00:00:00"); // setting the time to 00 specifically becuase FormatDate is changing the hh from 00 to 12.
//    return repVal;
//}
DataView.prototype.Delete=function(idx)
{
    var row = this.get_Row(idx);
    if(row) row.Delete();
}
DataView.prototype._deleteRow=function(row)
{
    this.Table.get_Event("RowDeleting").fire(this.Table,{"Row":row});    

    var i, cnt = this.Table.ChildRelations.Count;
    for (i = 0; i < cnt; i++)
    {
        var childRows = row.GetChildRows(this.Table.ChildRelations[i]);
        var j, subCnt = childRows.length;
        for (j = 0; j < subCnt; j++)
            childRows[j].Delete();
    }
    if(row["RowMod"]=="A")
    {
        // find idx first
        var idx=-1;
        for(var ii=0;ii<row.get_Table().Rows.length-1;ii++)
        {
            if(row.get_Table().Rows[ii]==row)
            {
                idx=ii;
                break;
            }
        }     
        if(ii>-1) 
        {
            row.get_Table().Rows.splice(ii, 1);
            
            // Filters might include this value, so refilter
            for(var dv in eDV=Global.BindingEngine.EpiDataViews)
            {
                var eDV=Global.BindingEngine.EpiDataViews[dv];
                if (eDV.dataView.Table == row.get_Table())
                {
                    eDV.Refresh(EpiBindType.Merge); 
                }
            } 
        }
    }
    else
    {
        row["RowMod"]="D";
        row["_RowState"]="D";
    }
}
DataView.prototype.get_Row = function(idx)
{
    if (idx != undefined)
    {
        if (idx < 0) return null;

        var me = this;
        var row = null;
        if (this.Rows && this.Rows.length > 0)
        {
            var row = this.Rows[idx];
            if (row)
            {
                if (typeof row == "string")
                    row = new String(row);

                row.EndEdit = function() { me.EndEditRow(this); }
                row.BeginEdit = function() { }
                row.CancelEdit = function() { }
                row.get_RowState = function() { return this["RowMod"]; }
                row.get_ItemArray = function() { return me.Table._getRowItemArray(this); }
                row.Delete = function() { me._deleteRow(this); }
                row.set_Item = function(col, val) { me.SetRowValue(idx, col, val); }
                row.get_Item = function(col) { return me.GetRowValue(this, col); }
                row.get_DataView = function() { return me };
                row.get_Table = function() { return me.Table };
                row.GetChildRows = function(rel) { return me.Table.GetChildRows(this, rel); }
                row.GetParentRows = function(rel) { return me.Table.GetParentRows(this, rel); }
                //row.Row = row;
                row.type = "DataRow";
            }
        }
        return row;
    }
    else
    {
        return this.Row;
    }
}
DataView.prototype.EndEditRow=function(row)
{
    if(this.Row==-1||this.Rows[this.Row]!=row)
    {   
        this.Table.get_Event("RowChanged").fire(this.Table,{"Row":row});
    }
}
DataView.prototype.GetRowValue=function(row,col)
{
    var colName = this._getColumnName(col);
    if(colName!=null)
    {
        if (row[colName] == undefined) 
        {
            // Maybe we have a case-sensitivity issue
            var lCase = colName.toLowerCase();
            for(var c in row)
            {
                if(c.toLowerCase()==lCase) 
                {
                    colName = c;
                    break;
                }
            }
        }
        
        if (row[colName] == undefined) 
            return this.Table.GetTypedValue(colName, ""); // Passing a blank makes this method return the correct typed default. e.g. if a bool col is "", it returns false.
        else
            return this.Table.GetTypedValue(colName, row[colName]);
    }
}
// Returns the column name from col - since col can be an index or the name of the column
DataView.prototype._getColumnName=function(col)
{
    var colName= null;
    if (Global.IsNumber(col))
    {
        var cnt = 0;
        for(var col1 in this.Table.Columns)
        {
            if(cnt==col) 
            {
                colName = col1;
                break;
            }
            cnt++;
        }
    }
    else if (Global.IsString(col))
    {
        colName = col;
    }

    return colName;
}
DataView.prototype.SetRowValue=function(idx,col,val)
{
    var colName = this._getColumnName(col);
    
    if (colName == null) return;

    val = this.Table.GetStrForTypedValue(colName,val);
    if (val == undefined) return;
    
    var refreshedViews = [];
    if(this._EpiDataViews.length>0)
    {
        for(var edv in this._EpiDataViews)
        {
            this._EpiDataViews[edv].SetValue(idx,colName,val);
            refreshedViews[this._EpiDataViews[edv].ViewName] = 1;
        }
    }
    else
        this.Rows[idx][colName] = val;
        
    // Filters might include this value, so refilter
    for(var dv in Global.BindingEngine.EpiDataViews)
    {
        if (refreshedViews[dv])
            continue;

        var eDV=Global.BindingEngine.EpiDataViews[dv];
        if (eDV.dataView.Table == this.Table)
        {
            eDV.Refresh(EpiBindType.Merge,true,true); // Passing merge sets the right row on the eDV.
            dv = eDV.dataView;
            if (dv.RowFilter || eDV.StaticFilter || eDV.AdditionalFilter)
                DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
           //break; // there may be more than one edv for a table, refresh all.
        }
    } 
}
DataView.prototype.AddNew=function()
{
    this.Table.Rows.push({});
    var row = this.Table.get_Row(this.Table.Rows.length-1);
    
    this.Rows.push(row);
    if (this.Sort && (this.Sort.length > 0)) this.ApplySort(this.Rows);
    
    return row;
}

DataView.prototype.Find=function()
{
    var sortKeyVals=[];
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "ObjectArr":
        sortKeyVals = a[0];
        break;
        case "String":
        case "Object":
        sortKeyVals.push(a[0]);
        break;
        default: // No parameters
         return -1;
    }
    
// DataView.Find accepts values for the columns on which DataView is sorted which is not always primary key columns. 
// The overload for DataView.Find(object[]) is used when multiple columns are used as sort columns
    var row = null;
    var mySortCols = this.Sort.split(","); // Sort columns are set as comma seperated when more than one
    if (mySortCols.length == 0 || sortKeyVals.length == 0) return -1;
    var keyVal,skVal,indx=-1;
    var bFound = false;
    
    for(var ii=0, row; row=this.get_Row(ii); ii++)
    {
        bFound = true;
        for (var i=0, key; key=mySortCols[i]; i++)
        {
            keyVal = row[key];
            skVal = sortKeyVals[i];
            if(Global.IsString(keyVal) && !Global.IsString(skVal))
            {
                keyVal = row.get_Item(key);    
                
                if(Global.IsDate(skVal)) skVal = FormatEngine.FormatDate(skVal, "yyyy-MM-ddThh:mm:ss");
                if(Global.IsDate(keyVal)) keyVal = FormatEngine.FormatDate(keyVal, "yyyy-MM-ddThh:mm:ss");
            }
            
            if (keyVal != skVal)
            {
                bFound = false;
                break;
            }
        }
        if (bFound == true) // found the matching row
        {
            indx=ii;
            break;
        }
    }
    
    return indx; // index
}
DataView.prototype.RegisterView=function(edv)
{
    var found=false;
    for(var v in this._EpiDataViews)
    {
        if(this._EpiDataViews[v]==edv)
        {
            found=true;
            break;
        }
    }
    if(!found) 
    {
        this._EpiDataViews.push(edv);
        if (this.Table) this.Table.eDV = edv;  
    }
    
}

var DataRelation=System.Data.DataRelation=function()
{
    EpiObject.call(this,"DataRelation");

    this.DataviewOnly=false;

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    this.ParentColumns = [];
    this.ChildColumns = [];
    switch(overload)
    {
        case "String_DataColumn_DataColumn":
            this.RelationName = a[0];
            this.ParentColumns.push(a[1].ColumnName);
            this.ChildColumns.push(a[2].ColumnName);
            this.ParentTable = a[1].Table;
            this.ChildTable = a[2].Table;
            break;
        case "String_DataColumnArr_DataColumnArr":
            this.RelationName = a[0];
            for(var p in a[1])
            {
                this.ParentColumns.push(a[1][p].ColumnName);
            }
            for(var c in a[2])
            {
                this.ChildColumns.push(a[2][c].ColumnName);
            }
            if(a[1].length>0) this.ParentTable = a[1][0].Table;
            if(a[2].length>0) this.ChildTable = a[2][0].Table;
            break;
        case "String_DataColumn_DataColumn_Boolean":
        case "String_DataColumnArr_DataColumnArr_Boolean":
        case "String_String_String_String_String_StringArr_StringArr_Boolean":
            MessageBox.Show("This overload of the System.Data.DataRelation constructor is not currently supported by the web framework. This operation may not work as expected.", new EpiOverloadedArgs("String"));
            break;
        case "String_String_StringArr_StringArr":  // custom
            this.ParentTable = a[0];
            this.ChildTable = a[1];
            this.ParentColumns = a[2];
            this.ChildColumns = a[3];
            break;
        case "String_String_String_StringArr_StringArr_Boolean":
            this.RelationName = a[0];
            this.ParentTable = a[1];
            this.ChildTable = a[2];
            this.ParentColumns = a[3];
            this.ChildColumns = a[4];
            break;
    }
}
DataRelation.prototype = new EpiObject();
DataRelation.prototype.get_ChildColumn=function(idx)
{
    var childCol = null;
    if(this.ChildColumns.length>=idx)
    {
        var col = this.ChildColumns[idx];
        if(this.ChildTable) childCol = this.ChildTable.get_Column(col);
    }
    return childCol;
}
// ----------------------------------- EPIDATAVIEW --------------------------------------------
var EpiDataView = Epicor.Mfg.UI.FrameWork.EpiDataView = function(addEnabled, addText, addImageText)
{
    EpiObject.call(this, "EpiDataView");

    this.ViewName = "View" + Global.BindingEngine.EpiDataViewsDangling.Count.toString();//""; Set some default name becuase some views are never added to EpiTransaction so never get assigned a name.
    this.dataView = new DataView();
    this.CurrentFilter = null;
    this.RowRules = {};
    this.MyRowRules = {};
    this.ReverseRules = {};
    this._rowrules = {};
    this._rrID=0;
    this.ChildRelations = {Children:[]};
    this.HasParent = false;
    this.ParentView;
    this.AddEnabled = addEnabled;            // TransactionLoad and occasional
    this.AddIcon = null;                // TransactionLoad and occasional
    this.AddImageName = addImageText;             // none
    this.AdditionalFilter = "";         // 
    this.AddText = addText;                  // TransactionLoad and occasional
    this.AddedIdx = 0;
    this.AllowAutoAttachments = true;   // TransactionLoad only
	this.attachBinding = "";
    this.isAttachView = false;
    this.hasAttachKidView = false;
    this.ChangeRowProps = true;         // occasional (correlates to EpiNotifyArgs.ChangeControlProperties
    this.Column = null;                 // Always used to call Notify, which we won't be doing.
    this.EpiX = null;                   // none
    this.HasRow = false;                // 
    this.MyRowProps = new Hashtable();   
    this.disableContexts = new ArrayList();     // TODO: filled by rowrule action  
    this.Row = -1;                      // !
    this.RowFilter = "";
    this.RowPropCount = 0;              // none
    this.RuleResults = null;            // none
    this.StaticFilter = "";             // 
    this.viewImageColumns = null;
    this.droppedImageColumns = null;
    this.ChildViews = new Hashtable();
    this.CompoundKey = false;
    this.ParentColumn = null;
    this._rowBeforeClear = -1;
    this.IsSyncing = false;
    this.okToNotifyOthers = true;
    this._tempRow=null;
    this._disposed = false;
    
    Global.BindingEngine.EpiDataViewsDangling.Add(this);
}
EpiDataView.prototype=new EpiObject();
EpiDataView.prototype.Dispose=function()
{
    if (this._disposed)
        return;

    this.ClearAllEventListeners();
    
    var index, obj;
    for (index in this._rowrules)
    {
        obj = this._rowrules[index];
        
        if (obj.Rule)
        {
            obj.Rule.Dispose();
            obj.Rule = null;
        }
        
        this._rowrules[index] = null;
    }
    
    for (index in this.RowRules)
    {
        obj = this.RowRules[index];
        
        for (var subIndex in obj)
            obj[subIndex] = null;
            
        this.RowRules[index] = null;
    }
    
    for (index in this.MyRowRules)
    {
        obj = this.MyRowRules[index];
        this.MyRowRules[index] = null;
    }
    
    for (index in this.ChildRelations.Children)
    {
        obj = this.ChildRelations.Children[index];
        this.ChildRelations.Children[index] = null;
    }
    this.ChildRelations.Children = [];
    
    if (this.MyRowProps)
        this.MyRowProps.Clear();    
    if (this.disableContexts)
        this.MyRowProps.Clear();    
    if (this.ChildViews)
        this.ChildViews.Clear();
    
    index = obj = null;
    this.dataView = null;
    
    this._disposed = true;
}
EpiDataView.prototype.get_HasRow=function()
{
    return (this.dataView.Rows.length>0);
}
EpiDataView.prototype.get_HasChildren=function()
{
    return this.ChildRelations.Children.length>0;
}
EpiDataView.prototype.HasBinding=function()
{
    var tabMgr = Global.BindingEngine.TabManager;
    for(tab in tabMgr)
    {
        if(tabMgr[tab][this.ViewName]) return true;
    }
    return false;
}
EpiDataView.prototype.get_EpiX=function() {return this.EpiX;}
EpiDataView.prototype.set_EpiX=function(val) 
{
    this.EpiX = val;
    this.OnSetEpiTransaction();
}

EpiDataView.prototype.OnSetEpiTransaction=function(){}
EpiDataView.prototype.set_dataView=function(dv)
{
    this.dataView = dv;
    dv.RegisterView(this);
    if(this.dataView.Table && this.dataView.Table.Rows.length>0)
        this.DoRowChange(0);
}
EpiDataView.prototype.OnSetParentView=function(Parent, ParentColumns, ChildColumns,Conditions){}

EpiDataView.prototype.SetParentView=function(dvParent,parentColumns,childColumns, conditions)
{
    if(!childColumns) childColumns = parentColumns;
    
    var childrenItm = {Name:this.ViewName,Keys:[]};
    
    var parentTbl = null;
    var childTbl = null;
    
    if(dvParent.dataView) parentTbl = dvParent.dataView.Table;
    if(this.dataView) childTbl = this.dataView.Table;

    var valToSend = null;
    if(Global.IsString(parentColumns))
    {
        this.ParentColumn = parentColumns;
        this.ChildColumn = childColumns;
        if(parentTbl) parentColumns = parentTbl._resolveColumnName(parentColumns);
        if(childTbl) childColumns = childTbl._resolveColumnName(childColumns);
        childrenItm.Keys.push({ParentColumn:parentColumns,DataColumn:childColumns});
        valToSend = childColumns;
        if (!conditions) conditions = "=";

        if(parentTbl&&childTbl&&parentTbl.DataSet==childTbl.DataSet&&parentTbl!=childTbl)
        {
            if (!parentTbl.DataSet)
            {
                parentTbl.DataSet = childTbl.DataSet = new DataSet();
                parentTbl.DataSet.AddTables([parentTbl, childTbl]);
            }
            
            parentTbl.DataSet.AddRelation(parentTbl, childTbl, [parentColumns],[childColumns],true);
        }
    }
    else
    {
        var setCondn = false;
        if (!conditions)
        {
            conditions = [];
            setCondn = true;
        }

        for(var ii=0, o; o=childColumns[ii]; ii++)
        {
            if(parentTbl) parentColumns[ii] = parentTbl._resolveColumnName(parentColumns[ii]);
            if(childTbl) o = childTbl._resolveColumnName(o);
        
            childrenItm.Keys.push({ParentColumn:parentColumns[ii],DataColumn:o});
            if (setCondn)
                conditions[ii] = "=";
        }
        this.ParentColumns = parentColumns;
        this.ChildColumns = childColumns;
        valToSend="CompoundKey";
        this.CompoundKey = true;
        
        if(parentTbl&&childTbl&&parentTbl.DataSet==childTbl.DataSet&&parentTbl!=childTbl)
        {
            if (!parentTbl.DataSet)
            {
                parentTbl.DataSet = childTbl.DataSet = new DataSet();
                parentTbl.DataSet.AddTables([parentTbl, childTbl]);
            }
            parentTbl.DataSet.AddRelation(parentTbl, childTbl, parentColumns,childColumns,true);
        }
    }
    
    this.ParentView = dvParent;
    
    dvParent.ChildRelations.Children.push(childrenItm);
    this.HasParent = true;
    this.ParentView.setChildView(this, valToSend);
    this.OnSetParentView(dvParent,parentColumns,childColumns, conditions);
}   
EpiDataView.prototype.setChildView=function(Child,BindingColumn)
{
	this.HasChildren = true;
	var kidViewID = Child.ViewName + ":" + BindingColumn;
	kidViewID = this.getKidViewId(kidViewID, Child);
	this.ChildViews.Add(kidViewID, Child);
}
EpiDataView.prototype.getKidViewId=function(kidViewID,kidView)
{
	var i=0;
	for(var o in this.ChildViews.items)
	{
	    o = this.ChildViews.items[o];
		var de = o;
		edv = o;
		var tKey = o.toString();
		var vNam = tKey.Substring(0,tKey.IndexOf("@"));
//		if (kidViewID == vNam)
//		{
//			if (edv.StaticFilter == kidView.StaticFilter) 
//				throw new Exception("Duplicate ChildView StaticFilter exception");
//			i++;
//		}
	}
	return kidViewID + "@" + i.toString();
}
EpiDataView.prototype.SetRowValue=function(theRow,dataColumnName,value)
{
    // this if for unattached values.  After the developer calls NewRow and changes a value, before we
    // have a row index.  
    if(this._equals(dataColumnName, theRow[dataColumnName], value)) return true;  
    
    var retVal = false;
    
    var prevRowMod = theRow["RowMod"];
    theRow["_RowState"]="U";
    
    var ea=new DataColumnChangeEventArgs(this.Row>-1?this.dataView.get_Row(this.Row):theRow,this.dataView.Table.get_Column(dataColumnName),value);
    if(this.OnColumnChanging(dataColumnName, ea))
    {
        value=ea.ProposedValue;
        theRow[dataColumnName] = value;
        
        if (dataColumnName != "RowMod" && prevRowMod != "A" && prevRowMod != "X") 
        {
            theRow["RowMod"] = "U";
            theRow["_RowState"]="U";
        }
        
        this.OnColumnChanged(dataColumnName, value);
        retVal = true;
    }
    else
    {
        theRow["RowMod"] = prevRowMod;
        theRow["_RowState"] = prevRowMod;
    }
    
    return retVal;
}
EpiDataView.prototype.SetValue=function(row, dataColumnName, value, skipNotifyFlg, sender, doTableUpdate)
{
    if(row==-1) return;
    
    if(dataColumnName=="RowMod" && value=="M") return;
    
    var theRow = this.dataView.Rows[row];
    if (!theRow) return;
    if (theRow[dataColumnName] == undefined) 
    {
        // Maybe we have a case-sensitivity issue
        var lCase = dataColumnName.toLowerCase();
        for(var c in theRow)
        {
            if(c.toLowerCase()==lCase) 
            {
                dataColumnName = c;
                break;
            }
        }
    }    

    if(dataColumnName=="RowMod" && theRow["RowMod"] == "A") return; // Not allowed to update the RowMod of newly added row

    var valueIsChanged=true;
    if(this._equals(dataColumnName, theRow[dataColumnName], value)) valueIsChanged=false;  
    
    var retVal = false;
    
    var prevRowMod = theRow["RowMod"];
    theRow["_RowState"]="U";

    var col = this.dataView.Table.get_Column(dataColumnName);
    
    var ea=new DataColumnChangeEventArgs(this.dataView.get_Row(this.Row),col,value);
    if(this.OnColumnChanging(dataColumnName, ea))
    {
        theRow = this.dataView.Rows[row];
                
        if(valueIsChanged)
        {
            value=ea.ProposedValue;

            theRow[dataColumnName] = value;

            if(value=="" && col && col.DataType && col.DataType=="System.DateTime")
                delete theRow[dataColumnName];

//            if ((this.dataView.Sort) && (this.dataView.Sort.length > 0) && (this.dataView.Sort.indexOf(dataColumnName) >= 0))
//                this.dataView.ApplySort(this.dataView.Rows);

            if(dataColumnName!="RowMod" && prevRowMod!="A") 
            {
                theRow["RowMod"] = "U";
                theRow["_RowState"]="U";
            }
        }
        
        this.OnColumnChanged(dataColumnName, value);
        
        if(valueIsChanged)
        {
            this.OnOnEpiDataChanged(); 
        }
        var flip = false;
        if(prevRowMod=="A" && Global.Form.allCtrlsDisabled == true) // New row
        {
           Global.Form.allCtrlsDisabled = false;
           flip = true;
        }
        
        if(valueIsChanged)
        {
            // Moved the event firing before the NotifyFields because there may be apps code that calls SetCurrentRowPropertyManually. 
            // We need NotifyFields to apply the new row rules.
            if(skipNotifyFlg!=true)
            {
                // The sender that's sent in would be a field.  We only want to notify
                // the tree if the sender is a field.  Otherwise, no need.
                var notifyTree=sender?true:false;
                if(!sender) sender=this;
                var args = new EpiNotifyArgs(sender, row, -1, notifyTree, new EpiOverloadedArgs("Object_Int32_Int32_Boolean"));
                args.ChangeGridPropsCurrentRowOnly=true;
                this.OnEpiViewNotification(args);
            }
            
            Global.BindingEngine.NotifyFields(this.ViewName, dataColumnName, row); 
            
            for(var rr in this.ReverseRules[dataColumnName])
            {
                Global.BindingEngine.NotifyFields(this.ViewName, rr, row);
            }
            
            if (doTableUpdate)
            {
                var edvList=[];
                for(var viewName in Global.BindingEngine.EpiDataViews)
                {
                    var eDV = Global.BindingEngine.EpiDataViews[viewName];
                    if (eDV.dataView.Table != this.dataView.Table)
                        continue;

                    edvList.push(eDV);
                }
        
                for(var itm in edvList)
                {
                    var eDV = edvList[itm];
                    dv = eDV.dataView;
                    if (dv.RowFilter || eDV.StaticFilter || eDV.AdditionalFilter)
                    {
                        if (eDV != this)
                            eDV.Refresh(EpiBindType.Merge,true);
                        else
                            DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
                    }
                }
				this.UpdateChildren(this.Row, false, EpiBindType.Merge); // SCR #66468 from 9.04
            }
        }
        
        if(flip == true) // New row
        {
           Global.Form.allCtrlsDisabled = true;
        }
        retVal = true;
    }
    else
    {
        theRow["RowMod"] = prevRowMod;
        theRow["_RowState"] = prevRowMod;
    }
    
    return retVal;   
}
EpiDataView.prototype._equals=function(dcName, dcVal, value)
{
    var tbl = this.dataView.Table;
    if(dcVal && tbl && tbl.Columns[dcName] && tbl.Columns[dcName].DataType=="System.DateTime"
        && dcVal.length>=10 && value.length>=10)
    {
        if(dcVal.substr(0,10)==value.substr(0,10)) return true;
    }
    else
    {
        if(dcVal==value) return true;  
    }
    return false;
}
EpiDataView.prototype.set_Row=function(val)
{
    this.DoRowChange(val);
}
EpiDataView.prototype.DoRowChange = function(newRow)
{
    var prevRow = this.Row;
    if (newRow == null) return true; // VA
    if(this.Row==newRow) return true;
    
    var retVal = false;    
    if(prevRow==-1 || this.OnEpiRowChanging(this, this.Row, newRow))
    {
        var lastRow = this.Row;

        this.NavigateToRow(newRow, true, EpiBindType.Full);   
        
        if (newRow == -1) this.Row = -1;
       
            
        if(prevRow>-1) this.OnEpiRowChanged(newRow, lastRow);
        retVal = true;
    }
       
    return retVal; 
}
EpiDataView.prototype.get_Row=function()
{
    // When the application code calls EpiDataView.get_Row(), it may be calling it after binding has happened
    // but before Notify is called.  In the win, the binding has not yet happened, so .Row has not been set
    // yet... possibly still -1.  In this case, we are maintaining a temporary row (_tempRow) that gets set
    // in NavigateToRow and gets cleared when Notify is called.  Use this row instead for the meantime.
//    if(this._tempRow!=null)
//        return this._tempRow;
//    else

    return this.Row;
}
EpiDataView.prototype.get_CurrentDataRow=function()
{
    return this.dataView.get_Row(this.Row);
}
EpiDataView.prototype.NavigateToRow = function(idx, pageFlg, bindType, skipGlobalRebind)
{
    this._tempRow=null;
    idx = parseInt(idx);

    if(pageFlg == true && this.Row==idx) {return false;}  
    
    this._clearRowProps();
    
    this.HasRow = false;
    if(idx==-1) return false;

    if(this.dataView.Rows.length > idx)
    {
        var prevRow = this.Row;
        this.Row = idx;
        this.HasRow = true;
        this._tempRow=prevRow;
                
        if(!this._isNotifying)        
        {
            this._isNotifying = true;   
			var args =  new EpiNotifyArgs(this, this.Row, -1, true, new EpiOverloadedArgs("Object_Int32_Int32_Boolean"));
			args.ChangeGridPropsCurrentRowOnly = true;
			args.NotifyTree=false;
            this.OnEpiViewNotification(args); 
            this._isNotifying = false;
        }
        
        if(pageFlg) Global.BindingEngine.NotifyTabs(this.ViewName, this.Row);

        this.UpdateChildren(idx, pageFlg, bindType); // SCR #66468 from 9.04

        // Rowchanged event fired from here is causing invalid apps code to run on Receipt Entry (even if prevRow is not -1).
        if(bindType==EpiBindType.Merge && prevRow!=this.Row && (prevRow!=-1||Global.Form.Name=="UserAccountForm") && Global.Form.Name != "ARInvoiceTrackerForm" && Global.Form.Name != "ReceiptEntryForm" && Global.Form.Name != "OpMasterForm" && Global.Form.Name != "COAForm")  // VA : added condn for prevRow != -1 becuase this event was firing when new row is created and apps code event handler was throwing an excption
            this.OnEpiRowChanged(this.Row, prevRow);
    }
    
    return true;
}
EpiDataView.prototype.UpdateChildren=function(idx, pageFlg, bindType)
{
    Global.BindingEngine.updatingChildren++;
    try
    {
        var filter, dc, childIdx;
        if(this.ChildRelations)
        {
            var dataviews = Global.BindingEngine.EpiDataViews;
            var danglingDVs = Global.BindingEngine.EpiDataViewsDangling;
            var children = this.ChildRelations.Children;
            for(var ii=0, o; o=children[ii]; ii++)
            {
                

                childName = o.Name;

                filter = "";
                for(var jj=0, o2; o2=o.Keys[jj]; jj++)
                {
                    dc = o2.DataColumn;
                    parentDC = o2.ParentColumn;
                    
                    if(jj>0) filter += " && ";
                    if (dc.IndexOf(".") != -1)
                    {
                        dc = "o['" + dc + "'] <> undefined && o['" + dc + "']";
                    }
                    if(this.dataView.Table && this.dataView.Table.Columns[parentDC] && this.dataView.Table.Columns[parentDC].DataType=="System.DateTime")
                    {
                        filter += dc + ".toLowerCase().substr(0,10)=='" + this.dataView.Rows[idx][parentDC].toString().toLowerCase().substr(0,10) + "'";
                    }
                    else
                    {
                        filter += dc + ".toLowerCase()=='" + this.dataView.Rows[idx][parentDC].toString().toLowerCase() + "'";
                    }
                }
                
                if (dataviews[childName])
                {
                    if (!(dataviews[childName] instanceof BAQDataView) || !dataviews[childName].get_HasFilterByPublisher())
                       childIdx = dataviews[childName].ApplyFilter(filter, pageFlg, bindType, true);
                }
                else 
                {
                    // Not part of Global EpiDataViews, try to get from the DanglingViews list
                     for(vw in danglingDVs.items)
                     {
                       var danglingView = danglingDVs.items[vw];
                       if(danglingView.ViewName == childName)
                       {
                            if (!(danglingView instanceof BAQDataView) || !danglingView.get_HasFilterByPublisher())
                            {
                                childIdx = danglingView.ApplyFilter(filter, pageFlg, bindType, true);
                                break;
                            }
                       }
                     }
                }
            }
        }
    }
    finally
    {
        Global.BindingEngine.updatingChildren--;
    }
}

EpiDataView.prototype.get_AdditionalFilter=function()
{
    if (this._origAdditionalFilter) return this._origAdditionalFilter;
    else return this.AdditionalFilter;
} 
EpiDataView.prototype.set_AdditionalFilter=function(val) 
{
    if(!val) val="";
    this._origAdditionalFilter = val;
    var me = this;
    // If there are any dates, make sure they are in the US format because the data in the dataview is always the US format
    val = val.replace(/(\w+[.]*\w*)\s*(={1,2}|<>|>=|<=)\s*(')((\d{1,2})\/(\d{1,2})\/((?:\d{4}|\d{2})))(')/gi, function(){return me.dataView.FixDateComparison.apply(me.dataView,arguments);});
    var prevFilter = this.AdditionalFilter;
    this.AdditionalFilter = val;
        
    if (Global.Form.ID=="TimeExpenseForm")
    {
        if(this.dataView.Table)
        {
           var prevRow = this.Row;
           this.Refresh(EpiBindType.Merge);
                      
           if (prevRow != this.Row || prevFilter != val)
           {
            // SCR#78475 (Rework, Issue 2): This bit of code is required for the Matrix T&EEntry (customized) form. 
            // We find the tab that is bound to this view and if its not the CurrentTab, set it to the CurrentTab and call NotifyTabs.
            // See SCR memo notes for details on this change.
             Global.BindingEngine.ClearDVReg(this, true);
             var tabs = Global.BindingEngine.Tabs;
             var tabMgr = Global.BindingEngine.TabManager;
             var prevTab, done=false;
             for(tab in tabMgr)
             {
                if(tabMgr[tab][this.ViewName] && tabs[tab].Invalidated)
                {
                    prevTab =Global.BindingEngine.CurrentTab;
                    Global.BindingEngine.CurrentTab = Global.document.getElementById(tab);
                    Global.BindingEngine.NotifyTabs(this, this.Row);
                    Global.BindingEngine.CurrentTab = prevTab;
                    done=true;
                    break;
                }
            }
            if (!done)
                Global.BindingEngine.NotifyTabs(this, this.Row);
           }
           
        }
    }
    else
    {
        this.Refresh(EpiBindType.Merge,true);
        DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(this)});
    }   
}
EpiDataView.prototype.FixColName=function(matchStr,left,sign,right)
{
     var repVal = left;
    if (repVal && this.dataView.Table)
        repVal = this.dataView.Table._resolveColumnName(repVal);
    
    if (repVal)
       return repVal + sign + right;
    else
        return matchStr;
}

EpiDataView.prototype.set_StaticFilter=function(filter)
{
    var orig = filter;
   
    // Sometime the static filters use column names with different case than the actual column name in the dataset. This wont work for us, so run a reg expr to replace the column names correctly.
    var me =this;
    filter = filter.replace(/(\w+)\s*(={1,2}|<>|>=|<=)\s*('\w*?'|true|false|\d+)/gi, function(){return me.FixColName.apply(me,arguments);});
     
    if (orig && !filter) filter = orig;
    
    this.StaticFilter=filter;
    
    if(this.dataView.Table)
    {
        var prevRow = this.Row;
        var prevLen = this.dataView.Rows.length;
        this.Refresh(EpiBindType.None);
        
        if(this.Row==-1 && this.dataView.Rows.length>0)
        {
            this.set_Row(0);
            Global.BindingEngine.BindDataView=this.ViewName;
            Global.BindingEngine.BindForm();
            Global.BindingEngine.BindDataView=null;
        }
        else if (prevRow >=0 && this.Row == -1 && prevLen >0 &&  this.dataView.Rows.length==0) // We dont have any rows in the edv now
        {
            Global.BindingEngine.BindDataView=this.ViewName;
            Global.BindingEngine.BindForm();
            Global.BindingEngine.BindDataView=null;
        }
        else if (prevRow != this.Row)
        {
            Global.BindingEngine.NotifyTabs(this, this.Row);
        }
    }
    
    return this.StaticFilter;
}

EpiDataView.prototype.Refresh=function(bindType,keepFilter,skipGlobalRebind)
{
    if (bindType == EpiBindType.None)
    {
        this.ApplyFilter(this.CurrentFilter, false, bindType, skipGlobalRebind);
    }
    else if (bindType == EpiBindType.Clear) // SCR #66468
    {
        this.ApplyFilter(this.CurrentFilter, false, bindType, skipGlobalRebind);
    }
    else
    {
        var filter="";
        if(keepFilter && bindType=="Merge" && this.CurrentFilter != "") filter=this.CurrentFilter;
        this.ApplyFilter(filter, false, bindType, skipGlobalRebind);
    }
}

EpiDataView.prototype._buildRowFilter=function()
{
    var fltrArr=[];
    
    if(this.dataView.RowFilter && this.dataView.RowFilter!="")
        fltrArr.push(this.dataView.RowFilter);
    
    if(this.StaticFilter && this.StaticFilter!="")
        fltrArr.push(this.StaticFilter);
        
    if(this.AdditionalFilter && this.AdditionalFilter!="")
        fltrArr.push(this.AdditionalFilter);
        
    return fltrArr.join(" && ");
}
EpiDataView.prototype.BuildFilter=function(baseFilter)
{
    var fltrArr=[];
    
    if(baseFilter!="" && baseFilter!=null) fltrArr.push(baseFilter);
    
    if(this.dataView.RowFilter && this.dataView.RowFilter!="")
        fltrArr.push(this.dataView.RowFilter);
    
    if(this.StaticFilter && this.StaticFilter!="")
        fltrArr.push(this.StaticFilter);
        
    if(this.AdditionalFilter && this.AdditionalFilter!="")
        fltrArr.push(this.AdditionalFilter);
        
    fltrArr.push("(o.RowMod==undefined||o.RowMod<>'D')");

    return fltrArr.join(" && ");
}

EpiDataView.prototype.ApplyFilter=function(filter, pageFlg, bindType, skipGlobalRebind)
{
    if(this.CurrentFilter==null) this.CurrentFilter = "";
    if(filter==null) filter="";

    var filterChanged = true;
    if(this.CurrentFilter==filter) filterChanged = false;

    this.CurrentFilter = filter;
    var addFlg;
 
    var prevRowCnt = this.dataView.Rows.length; 
    this.dataView.Rows = this.dataView.Table._Select(this.BuildFilter(filter));
    var didSort = false;
    if (this.dataView.Sort && (this.dataView.Sort.length > 0))
    {
        var ds = this.dataView.Table.DataSet;
        if(!ds || !ds.CacheInfo) 
        {
            this.dataView.ApplySort(this.dataView.Rows);
            didSort = true;
        }
    }
    
    var rowCnt = this.dataView.Rows.length;
    this.dataView.Count = rowCnt;
    
    if(bindType!=EpiBindType.None && bindType!=EpiBindType.Cache && rowCnt > 0)
    {
        var navRow = 0;
        if(bindType==EpiBindType.Merge)
        {
            // If there are new rows, go to the first new row.  Otherwise, try to stay on the current row.  
            if(this._rowBeforeClear>-1 && rowCnt > this._rowBeforeClear)
                navRow = this._rowBeforeClear;
            else if(rowCnt > prevRowCnt)
            {
                // If data is sorted in Ascending order, the new row is added to the beginning
                if (didSort && this.dataView.Sort.toUpperCase().indexOf(" ASC") != -1)
                    navRow =0;
                else
                    navRow = prevRowCnt;
                 
            }
            else if(this.Row > -1 && rowCnt > this.Row)
                navRow = this.Row;
            else if(rowCnt<prevRowCnt)
                navRow = rowCnt-1;
        }
        else
        {
            if(this.Row && this.Row!=-1) 
            {
                if(rowCnt-1>=this.Row)
                    navRow = this.Row;
                else
                    navRow = rowCnt-1;
            }
        }
        this._rowBeforeClear = -1;
        
        if(filterChanged && (this.Row>-1||(this.Row==-1 && navRow>=0))) 
        {
            Global.BindingEngine.ClearDVReg(this, true);
            this.Row = -1;
            if (navRow >= rowCnt) navRow = rowCnt - 1;
        }
        this.NavigateToRow(navRow, pageFlg, bindType, skipGlobalRebind);
        if (filterChanged && navRow >=-1 && !pageFlg && bindType!=EpiBindType.Clear && skipGlobalRebind && Global.Form.IsTracker)
        {
            // Want this only for the tracker forms.
            Global.BindingEngine.ClearDVReg(this);
            Global.BindingEngine.NotifyTabs(this, navRow);
        }
    }
    else
    {
        if(rowCnt==0 && bindType!=EpiBindType.Cache) 
        {
            this._rowBeforeClear = this.Row;
            
            if(filterChanged) 
                Global.BindingEngine.ClearDVReg(this,true); // Sets the Invalidated property on the tab so its refreshed.

            this.HasRow = false;
            this.Row = -1;
            
            if(!this._isNotifying)  // don't want to get into an endless loop
            {
                this._isNotifying = true;      
                this.OnEpiViewNotification(new EpiNotifyArgs(this, -1, -1, false, new EpiOverloadedArgs("Object_Int32_Int32_Boolean"))); 
                this._isNotifying = false;
            }
             if(filterChanged) Global.BindingEngine.NotifyTabs(this, this.Row);
        }
        
        var children = this.ChildRelations.Children;
        if(children && bindType!=EpiBindType.Cache)
        {
            var dataviews = Global.BindingEngine.EpiDataViews;
            for(var ii=0, o; o=children[ii]; ii++)
            {
                var child = dataviews[o.Name];
                
				// throws an exception during Clear
                if (!child) continue; 
                
                if(rowCnt==0)
                    child.ApplyFilter("", false, bindType, true);
                else
                    child.ApplyFilter(child.CurrentFilter, false, bindType, true);
            }
        }
    }
    
    if (bindType == EpiBindType.Merge && !skipGlobalRebind)
    {
        var edvList=[];
        for(var viewName in Global.BindingEngine.EpiDataViews)
        {
            var eDV = Global.BindingEngine.EpiDataViews[viewName];
            if (eDV.dataView.Table != this.dataView.Table)
                continue;

            edvList.push(eDV);
        }

        for(var itm in edvList)
        {
            var eDV = edvList[itm];
            dv = eDV.dataView;
            if (dv.RowFilter || eDV.StaticFilter || eDV.AdditionalFilter)
                DialogHelper.RunOnAll(function(){Global.BindingEngine._rebindGrids(eDV)});
        }
    }

    this.dataView.get_Event("ListChanged").fire(this.dataView,{});
}
EpiDataView.prototype.AddRowRule1=function(rowRule){} // This is here only for downward compatibility. All new translated code should directly call AddRowRule

var RowRuleArgument = Epicor.Mfg.UI.FrameWork.RowRuleArgument = function(value, isRuntime)
{
    this.Value = value;
    this.IsBoolean = Global.IsBoolean(value);
    this.IsRuntime = isRuntime;
}

RowRuleArgument.prototype.GetValue = function(r)
{
    if(this.IsRuntime)
    {
        var val = this.Value(r);
        if (this.IsBoolean && (Global.IsBoolean(val) || Global.IsBooleanString(val)))
            return Convert.ToBoolean(this.Value(r));
        else
            return val;
    }
    else
    {
         return this.Value;
    }
}

var RowRuleObject = Epicor.Mfg.UI.FrameWork.RowRuleObject = function(action, condition, arguments)
{
    this.Action = action ? action : true;
    this.FalseValue = false;
    this._condition = condition;
    this._arguments = arguments;
    this._disposed = false;
}
RowRuleObject.prototype.Clone=function()
{
    var rr = new RowRuleObject(this.Action, this._condition, this._arguments);
    rr.FalseValue = this.FalseValue;

    return rr;
}

RowRuleObject.prototype.SetActionContext = function(context)
{
    this.Action = this.Action.bind(context);
}

RowRuleObject.prototype.Execute = function(r,col)
{
    return this._condition(r,col) ? (typeof this.Action == "function" ? this.Action(r,col) : this.Action) : this.FalseValue;
}

RowRuleObject.prototype.Dispose = function()
{
    if (this._disposed)
        return;
        
    this._condition = null;
    this.Action = null;
    for (var index in this._arguments)
    {
        if(this._arguments[index]!=null)
        {
            this._arguments[index].Value = null;
            this._arguments[index] = null;
        }
    }
    this._disposed = true;
}


EpiDataView.prototype.AddRowRule=function(rowRule)
{
    var rule = null;
    rowRule.ownerDV = this;

    if(rowRule.Condition && typeof rowRule.Condition == "function")
    {
        if (rowRule.Arg1==null && rowRule.Arg2==null)
        {
            rule = rowRule.Condition;
            rule = new RowRuleObject(true, rowRule.Condition, []);
        }
        else if(rowRule.Arg1!=null && rowRule.Arg2!=null)
        {
            var arg1Part = this._buildRulePart(rowRule, rowRule.Arg1, rowRule.Arg2);
            var arg2Part = this._buildRulePart(rowRule, rowRule.Arg2, rowRule.Arg1);
            
            arg1Part.IsBoolean = arg1Part.IsBoolean || arg2Part.IsBoolean;
            arg2Part.IsBoolean = arg2Part.IsBoolean || arg2Part.IsBoolean;
            
            rule = new RowRuleObject(true,
                function(r){return rowRule.Condition(arg1Part.GetValue(r), arg2Part.GetValue(r));},
                [arg1Part, arg2Part])
        }
    }
    else
    {
        var arg1Part = this._buildRulePart(rowRule, rowRule.Arg1, rowRule.Arg2);
        var arg2Part = this._buildRulePart(rowRule, rowRule.Arg2, rowRule.Arg1);
        
        arg1Part.IsBoolean = arg1Part.IsBoolean || arg2Part.IsBoolean;
        arg2Part.IsBoolean = arg2Part.IsBoolean || arg2Part.IsBoolean;
        
        switch(rowRule.Condition)
        {
            case RuleCondition.Equals:
                rule = function(r){return arg1Part.GetValue(r) == arg2Part.GetValue(r)}; break;
            case RuleCondition.NotEqual:
                rule = function(r){return arg1Part.GetValue(r) != arg2Part.GetValue(r);}; break;
            case RuleCondition.GreaterThan:
                rule = function(r){return arg1Part.GetValue(r) > arg2Part.GetValue(r);}; break;
            case RuleCondition.LessThan:
                rule = function(r){return arg1Part.GetValue(r) < arg2Part.GetValue(r);}; break;
            case RuleCondition.Contains:
                rule = function(r){return arg1Part.GetValue(r).indexOf(arg2Part.GetValue(r)) > -1;}; break;
            case RuleCondition.StartsWith:
                rule = function(r){return arg1Part.GetValue(r).substring(0, arg2Part.GetValue(r).length) == arg2Part.GetValue(r);}; break;
            case RuleCondition.GreaterThanOrEqualTo:
                rule = function(r){return arg1Part.GetValue(r) >= arg2Part.GetValue(r);}; break;
            case RuleCondition.LessThanOrEqualTo:
                rule = function(r){return arg1Part.GetValue(r) <= arg2Part.GetValue(r);}; break;
            case RuleCondition.EndsWith:
                rule = function(r){return arg1Part.GetValue(r).substring(arg1Part.GetValue(r).length - arg2Part.GetValue(r).length) == arg2Part.GetValue(r);}; break;
            case RuleCondition.Has:
                rule = function(r){return parseInt(arg1Part.GetValue(r)) & BitFlagValue[arg2Part.GetValue(r)];}; break;
            case RuleCondition.DoesNotHave:
                rule = function(r){return !(parseInt(arg1Part.GetValue(r)) & BitFlagValue[arg2Part.GetValue(r)]);}; break;
        }
        
        rule = new RowRuleObject(true, rule, [arg1Part, arg2Part]);
    }
    rowRule.builtRule = rule;
    for(var ii=0, o; o=rowRule.Actions[ii]; ii++)
    {
        this._addRuleForAction(rowRule, o);
    }
}   

EpiDataView.prototype._addRuleForAction=function(rowRule,o) // o is the action
{
    if(!rowRule.builtRule) return;

    var rule = rowRule.builtRule.Clone();
    if (!rule) return;
    
    var tblName = this.dataView.Table.TableName;
    if(!tblName) tblName = this.ViewName;
    
    var dc, jj, o2;
    if (typeof o == "function")
    {
        rule.Action = o;
        if (rowRule.Context)
            rule.SetActionContext(rowRule.Context);
        this._addRule(rowRule, tblName, "ActionDelegate", rule);
        return;
    }
    
    switch(o.Type)
    {
        case "AddControlSettings":
            if(o.Style instanceof ControlSettings)
            {
                if(o.Style.IsEnabled==false||o.Style.IsReadOnly==true)
                    rule.Action = SettingStyle.ReadOnly;
                    
                if(o.Style.IsVisible==false)
                    rule.Action = SettingStyle.Invisible;
                    
                if(o.Style.BackColor)
                    rule.Action = {"BackColor": o.Style.BackColor};
                    
                if(o.Style.OverrideControlState==ControlSettings.OverrideState.Enabled)
                    rule.Action = "OverrideStateEnabled";
                    
                this._addRule(rowRule, o.EpiBinding, o.Style, rule);
            }
            else
            {
                rule.Action = o.Style;
                rule.FalseValue = null;
                this._addRule(rowRule, o.EpiBinding, o.Style, rule);
            }
            break;
        case "AddRowSettings":
            if(o.Style instanceof ControlSettings)
            {
                if(o.Style.IsEnabled==false||o.Style.IsReadOnly==true)
                    rule.Action = SettingStyle.ReadOnly;
                    
                if(o.Style.IsVisible==false)
                    rule.Action = SettingStyle.Invisible;
                    
                if(o.Style.BackColor)
                    rule.Action = {"BackColor": o.Style.BackColor};
                    
                if(o.Style.OverrideControlState==ControlSettings.OverrideState.Enabled)
                    rule.Action = "OverrideStateEnabled";
                    
                rule.GridOnly=o.GridOnly;
                    
                this._addRule(rowRule, o.ViewName, o.Style, rule);
            }
            else
            {
                rule.Action = o.Style;
                rule.FalseValue = null;
                rule.GridOnly=o.GridOnly;
                this._addRule(rowRule, o.ViewName, o.Style, rule);
            }
            break;
        case "DisableColumns":
            for(jj=0, o2; o2=o.DisableColumns[jj]; jj++)
            {
                this._addRule(rowRule, o.ViewName + "." + o2, SettingStyle.ReadOnly, rule);
            }
            break;
        case "DisableRow": 
            rule.Action =   function(r,dc)
                            {
                                for(jj=0, o2; o2=o.ExceptTheseColumns[jj]; jj++)
                                {
                                    if (dc == o2)
                                        return false;
                                }
                                        
                                return true;
                             };
            this._addRule(rowRule, o.ViewName, SettingStyle.ReadOnly, rule);
            break;
        case "SetColumnValue":
            rule.FalseValue = null;
            rule.Action = o.NewValue;
            this._addRule(rowRule, o.EpiBinding, "SetColumnValue", rule);
            break;
        case "SetImage":
            rule.FalseValue = null;
            rule.Action = o.ImageName;
            this._addRule(rowRule, o.EpiBinding, "SetImage", rule);
            break;
    }
}
EpiDataView.prototype._removeRowRule=function(rowRule)
{
    // Clear the row rules, remove the current one from the cache, and rebuild them again. 
    this.RowRules=[];
    delete this._rowrules[rowRule._id];
    for(var r in this._rowrules)
    {
        var rr = this._rowrules[r];
        this._addRule(rowRule,rr.EpiBinding,rr.Setting,rr.Rule);
    }
}
EpiDataView.prototype._addRule=function(rowRule, epiBinding, setting, rule)
{ 
    // Save off the row rule initialization info, in case any of the row rules are altered
    // later and we need to rebuild.  
    if(!rowRule._id) rowRule._id=this._rrID++;
    this._rowrules[rowRule._id] = {"EpiBinding":epiBinding,"Setting":setting,"Rule":rule};

    var colName = (epiBinding.indexOf(".") > 0)? epiBinding.substring(epiBinding.indexOf(".")+1):"";
    if (colName != "" && this.dataView.Table)
    {
        colName = this.dataView.Table._resolveColumnName(colName);
        epiBinding = epiBinding.substring(0,epiBinding.indexOf(".")) + "." + colName;
    }
        
    if(!this.RowRules[epiBinding]) this.RowRules[epiBinding] = {};
    
    if(setting=="SetColumnValue")
    {
        if(!this.RowRules[epiBinding]["GetValue"]) this.RowRules[epiBinding]["GetValue"] = [];

        this.RowRules[epiBinding]["GetValue"].push(rule);
    }
    else if(setting=="SetImage")
    {
        if(!this.RowRules[epiBinding]["SetImage"]) this.RowRules[epiBinding]["SetImage"] = [];
        
        this.RowRules[epiBinding]["SetImage"].push(rule);
    }
    else if(setting=="OverrideStateEnabled")
    {
        this.RowRules[epiBinding]["OverrideStateEnabled"]=true;
    }
    else if(setting==SettingStyle.Disabled || setting==SettingStyle.ReadOnly || setting==SettingStyle.Invisible)
    {
        var property="ReadOnly";
        if(setting==SettingStyle.Invisible) property = "IsHidden";
    
        if(!this.RowRules[epiBinding][property])
            this.RowRules[epiBinding][property] = [];
        
        this.RowRules[epiBinding][property].push(rule);
    }   
    else if(setting==SettingStyle.Bold || setting==SettingStyle.Error || setting[SettingStyle.BackColor] || setting==SettingStyle.Highlight || setting==SettingStyle.OK || setting==SettingStyle.Warning)
    {
        if(!this.RowRules[epiBinding]["Style"]) this.RowRules[epiBinding]["Style"] = [];
        
        this.RowRules[epiBinding]["Style"].push(rule);
    }
    else if (setting == "ActionDelegate")
    {
        if (!this.RowRules[epiBinding]["ActionDelegate"])
            this.RowRules[epiBinding]["ActionDelegate"] = [];
        
        this.RowRules[epiBinding]["ActionDelegate"].push(rule); 
    }
    
    if(epiBinding.indexOf(".") > -1)
    {
        var colName = epiBinding.substr(epiBinding.lastIndexOf(".")+1);
        for(var col in rowRule._actionCols)
        {
            if(!this.ReverseRules[col]) this.ReverseRules[col] = {};
            this.ReverseRules[col][colName] = null;
        }
    }
}
EpiDataView.prototype._buildRulePart=function(rowRule, arg, otherArg)
{
    var str = new RowRuleArgument(arg, false);
    if (typeof arg == "object")
    {
        return str;
    }

    if(Global.IsString(arg))
    {
        var isNum = Int32.TryParse(arg,new EpiOverloadedArgs("String_Int32"));
        if (isNum)
            arg = Global.ArgManager["Out1"]; // This is integer now
    }
    
    if(Global.IsBoolean(arg))
    {
    }    
    else if(Global.IsNumber(arg))
    {
        str.Value = arg;
    }
    else if (arg == "") str.Value = "";
    else if (arg && arg.toLowerCase() == "true")    {str.Value = true; str.IsBoolean = true;}
    else if (arg && arg.toLowerCase() == "false")   {str.Value = false; str.IsBoolean = true;}
    else
    {
        str.IsRuntime = true;

        if(arg && arg.StartsWith(this.ViewName + ".")) 
            arg = arg.substring(this.ViewName.length + 1);
        else if (arg && arg.indexOf(".") != -1)
        {
            var vwName = arg.substring(0,arg.indexOf("."));
            // Check if its in the epidataviews
            if (GBE.EpiDataViews[vwName])
            {
                var col = arg.substring(arg.indexOf(".")+1);
                str.Value = new Function("r", "return GBE.EpiDataViews['"+vwName+"'].Row!=-1 && GBE.EpiDataViews['"+vwName+"'].dataView.Rows[GBE.EpiDataViews['"+vwName+"'].Row]['"+col+"']");
                return str;
            }
        }
            
        if(otherArg && Global.IsString(otherArg) && otherArg.StartsWith(this.ViewName + ".")) 
            otherArg = otherArg.substring(this.ViewName.length + 1);
    
        var arg=this.dataView.Table._resolveColumnName(arg);
        var tableCol = this.dataView.Table.Columns[arg];
        if(tableCol)
        {  
            if(Global.IsNumber(otherArg))
                str.Value = ["Convert.ToDecimal(r['", arg, "'])"].join("");
            else 
            {
                var lCaseOther="";
                if(otherArg) lCaseOther=otherArg.toString().toLowerCase();
                if(lCaseOther=="true"||lCaseOther=="false")
                    str.Value = ["Convert.ToString(r['", arg, "']).toLowerCase()"].join("");
                else
                {
                    if (tableCol.DataType && tableCol.DataType=="System.DateTime")
                    {
                        if(otherArg==null)
                            str.Value = ["(r['", arg, "']==undefined)? null:r['", arg, "']"].join("");
                        else
                            str.Value = ["(r['", arg, "']==undefined)? '':r['", arg, "']"].join("");
                    }
                    else
                        str.Value = ["r['", arg, "']"].join("");
                }
            }
                
            if(!rowRule._actionCols[arg])
                rowRule._actionCols[arg] = {};
        }
        else
        {
             // If the other arg is a number, lets assume this is a column, because they probably wouldnt compare a constant string to a constant integer.
             if(Global.IsNumber(otherArg))
             {
                str.Value = ["Convert.ToDecimal(r.", arg, ")"].join("");
                
                if(!rowRule._actionCols[arg])
                    rowRule._actionCols[arg] = {};
             }
             else if (arg == null)
                str.Value = "(null||'')";
             else if (arg == "" || !Global.IsValidVarName(arg))
                str.Value = ["'", arg, "'"].join("");
             else
                str.Value = ["(r.",arg,"||'",arg, "')"].join("");
        }

        str.Value = new Function("r", "return " + str.Value.replace('"', '\\"'));
    }    
    return str;
}

EpiDataView.prototype.SetCurrentRowProperty=function(columnName, styleOrSetting)
{
    var settings;
    if(Global.IsObject(styleOrSetting))
        settings = styleOrSetting;
    else
        settings = ControlSettings.GetControlSettings(styleOrSetting);
        
	if (this.MyRowProps.ContainsKey(columnName)) 
	{
	    var existingSettings = this.MyRowProps[columnName];
		if (existingSettings != null && settings.SettingStyle)
		{
			ControlSettings.UpdateControlSettings(existingSettings, settings.SettingStyle);
		    this.MyRowProps[columnName] = existingSettings;
		}
		else
		    this.MyRowProps[columnName] = settings;
	}
	else 
	{
		this.MyRowProps.Add(columnName, settings);
	}
    
    this.RowPropCount = this.MyRowProps.Count;

    // The full NotifyFields is causing a slow script error on CustomerShipmentEntry.
    // Added a flag which will make NotifyFields only run the RefreshProperties
    if(this.Row>-1 && !Global.InRefreshProps) Global.BindingEngine.NotifyFields(this.ViewName, columnName, this.Row, true);
}
EpiDataView.prototype.SetCurrentRowPropertyManually=function(columnName, styleOrSetting)
{
    var settingProps;
    if(Global.IsObject(styleOrSetting))
        settingProps = styleOrSetting;
    else
        settingProps = ControlSettings.GetControlSettings(styleOrSetting);
        
    settingProps.ManuallySet = true;
    this.SetCurrentRowProperty(columnName, settingProps);
}        
EpiDataView.prototype.ClearManualRowProp=function(columnName)
{
	if (this.MyRowProps.ContainsKey(columnName))
	{
		if(this.MyRowProps[columnName].ManuallySet)
		{
			this.MyRowProps.Remove(columnName);

			// The full NotifyFields is causing a slow script error on CustomerShipmentEntry.
            // Added a flag which will make NotifyFields only run the RefreshProperties
			if(this.Row>-1 && !Global.InRefreshProps) Global.BindingEngine.NotifyFields(this.ViewName, columnName, this.Row,true);
	    }
	}
    this.RowPropCount = this.MyRowProps.Count;
}                  
EpiDataView.prototype.ClearManualRowProps=function()
{
    var keys = this.MyRowProps.get_Keys().items;
    for(var ii=0; ii<=keys.length-1; ii++)
    {
        if(this.MyRowProps[keys[ii]].ManuallySet)
            this.MyRowProps.Remove(keys[ii]);
    }
    this.RowPropCount = this.MyRowProps.Count;
}  
EpiDataView.prototype._clearRowProps=function()
{
    var keys = this.MyRowProps.get_Keys().items;
    for(var ii=0; ii<=keys.length-1; ii++)
    {
        if(!this.MyRowProps[keys[ii]].ManuallySet)
            this.MyRowProps.Remove(keys[ii]);
    }
    this.RowPropCount = this.MyRowProps.Count;
}                 
EpiDataView.prototype.Notify=function(args) 
{
    this._tempRow=null;
    if(args.Row != undefined && args.Row < 0) args.Row = -1;

    if (args.Sender && (Global.InstanceOf(args.Sender,'EpiTransaction') || args.Sender.ID == "WhseBinForm"))
    {
	    var epiTrans = args.Sender;
	    
        if (args.NotifyType == NotifyType.InitLastView)
	    {
		    if (epiTrans.LastView != this) epiTrans.InitEpiView(this);
	    }
	    
	    // args.NotifyType == NotifyType.Initialize // VA: this is commented out in the Win code
	    if (args.NotifyType == NotifyType.AddRow)
	    {
            if (epiTrans.LastView != this) epiTrans.InitEpiView(this);
	        // If the view is sorted in ASC order, the new row is added at index 0 and the view's Row is already set to row 0, so prevent any row changes to a different index
	        if (!(this.dataView.Sort.toUpperCase().indexOf(" ASC") != -1 && this.Row == 0))
            {
	            this.Row=args.Row;
                if(args.Row!=undefined && args.Row!=null && args.Row!=this.Row)
	            {
	                this.set_Row(args.Row);
	            }
	        }
	    }
	    else if(args.NotifyType==NotifyType.Initialize)
	    {
	        if(args.Row!=undefined && args.Row!=null && args.Row!=this.Row)
	        {
	            this.set_Row(args.Row);
	        }
	        if (this.dataView.Count > 0 && args.Row > -1)
            {
                var tblRR = this.RowRules[this.ViewName];
                if(tblRR)
                {
                    for(var rr in tblRR["ActionDelegate"])
                    {
                        var r = this.dataView.Rows[args.Row];
                        tblRR["ActionDelegate"][rr].Execute(r);
                    }
                }
            }
	    }
    }

    // Moved the event firing before the NotifyTabs because there may be apps code that calls SetCurrentRowPropertyManually. We need NotifyTabs to apply
    // the new row rules.
    if(!this._isNotifying)  // don't want to get into an endless loop
    {
    	if (this.dataView.Count==0) args.Row = -1;  
        this._isNotifying = true;      
        this.OnEpiViewNotification(args); 
        this._isNotifying = false;
    }    
    
    var flip = false;
    if (args.ChangeGridPropsCurrentRowOnly == true && Global.Form.allCtrlsDisabled == true)
    {
        Global.Form.allCtrlsDisabled = false;
        flip = true;
    }

    Global.BindingEngine.NotifyTabs(this, this.Row);
    
    if (flip == true)
        Global.Form.allCtrlsDisabled = true;    

    var epiX = this.get_EpiX();
	if ((epiX != null) && (epiX.LastView != null) && (epiX.LastView == this))
    {
        var frm = epiX.get_EpiBaseForm();
        if (frm)
        {
		    var enableAttach = (epiX.LastView.isAttachView || epiX.LastView.hasAttachKidView);
		    if (epiX.LastView.hasAttachKidView && epiX.LastView.dataView.Count<=0) enableAttach = false;
            frm.ToggleAttachButtonOnViewChanged(enableAttach);
        }
    }

	if(this.Row > -1 && !(args.Sender instanceof EpiTransaction))
	{
		if(this.okToNotifyOthers && !(this instanceof BAQDataView))
		{
			if(Global.Form.trans != null && !this.ViewName.StartsWith("AutoAttach"))
			{    
				var tTrans = Global.Form.trans;
				tTrans.NotifyAllOthers(this, args.ChangeGridPropsCurrentRowOnly, args.NotifyTree, args.Guid);
			}
		}
	}
}
EpiDataView.prototype.RegisterImageColumn=function(ColumnName, DefaultImage, Caption, VisibleIndex)
{
	if (this.viewImageColumns == null) this.viewImageColumns = new Hashtable();
	var viewImageColumn = new EpiViewImageColumn(ColumnName, DefaultImage, Caption, VisibleIndex);

	if (!this.viewImageColumns.ContainsKey(ColumnName))
		this.viewImageColumns.Add(ColumnName, viewImageColumn);
}
EpiDataView.prototype.DeregisterImageColumn=function(ColumnName)
{
    if (this.droppedImageColumns == null) this.droppedImageColumns = new ArrayList();
    if (!this.viewImageColumns.ContainsKey(ColumnName)) return;
    
    this.viewImageColumns.Remove(ColumnName);
    this.droppedImageColumns.Add(ColumnName);

    this.Notify(new EpiNotifyArgs(this.EpiX, this.Row, 0, new EpiOverloadedArgs("Object_Int32_Int32")));
}
EpiDataView.prototype.HasDroppedImageColumn=function(ColumnName)
{
    return (this.droppedImageColumns != null && this.droppedImageColumns.Contains(ColumnName));
}
EpiDataView.prototype.HasViewImageColumn=function(ColumnName)
{
	return (this.viewImageColumns != null && this.viewImageColumns.ContainsKey(ColumnName));
}
EpiDataView.prototype.GetViewImageName=function(ColumnName)
{
	if (this.HasViewImageColumn(ColumnName)) return (this.viewImageColumns.items[ColumnName]).imageName;
	return null;
}
EpiDataView.prototype.AddAttachmentView=function(table)
{
	if ((!table) || (!table.ExtendedProperties["IsAttachmentTable"]) || (!table.ExtendedProperties["BindingColumns"])) return;
    this.hasAttachKidView = true;
	var attachView = new EpiDataView();
	attachView.dataView = new DataView(table);
	attachView.isAttachView = true;
	attachView.attachBinding = table.ExtendedProperties["BindingColumns"];
	this.EpiX.Add("AutoAttach" + this.ViewName, attachView);
	this.EpiX.attachLink.Add(this.ViewName, attachView);
}
EpiDataView.prototype.BuildChildRowFilter=function(rowIndex, childView)
{
    // Builds the RowFilter value to use for the child EpiDataView for the specified row.
    var currentRow = this.dataView.get_Row(rowIndex);
    var childFilter = "";
    if (childView.CompoundKey)
    {
        var and = "";
        for(var i = 0; i < childView.ParentColumns.Length; i++)
        {
            var columnValue = currentRow[childView.ParentColumns[i]];
            if (currentRow.get_DataView().Table.Columns[childView.ParentColumns[i]].DataType == "System.DateTime")
            {
                columnValue = columnValue.ToShortDateString();
            }
            else
            {
                columnValue = EpiDataView.FormatFilterValue(columnValue);
            }
            childFilter = childFilter + and + childView.ChildColumns[i] + "='" + columnValue + "'";
            and = " AND ";
        }
    }
    else
    {
        if (!String.IsNullOrEmpty(childView.ParentColumn))
        {
            var columnValue = currentRow[childView.ParentColumn];
            if (currentRow.get_DataView().Table.Columns[childView.ParentColumn].DataType == "System.DateTime")
            {
                columnValue = columnValue.ToShortDateString();
            }
            else
            {
                columnValue = EpiDataView.FormatFilterValue(columnValue);
            }
            childFilter = childView.ChildColumn + "='" + columnValue + "'";
        }
    }

    if (childView.StaticFilter.length > 0)
    {
        childFilter = childView.StaticFilter + " AND " + childFilter;
    }

    var filter = this.dataView.RowFilter;
    if ((filter.length > 0) && (!childView.ViewName.StartsWith("AutoAttach")))
    {
        childFilter = filter + " AND " + childFilter;
    }
    return childFilter;
}
EpiDataView.prototype.AddRowProperty=function(){}                        // none, obsolete
EpiDataView.prototype.AddRowRuleRange=function(rowRules)
{
    for(var item in rowRules)
    {
        this.AddRowRule(rowRules[item]);
    }
}                       
EpiDataView.prototype.ClearRowRules=function(){}                         
EpiDataView.prototype.EpiDataChanged=function(){this.OnOnEpiDataChanged();}   
EpiDataView.prototype.Equals=function(dvName)
{
    if(this.ViewName==dvName) return true;
    else return false;
}     
EpiDataView.prototype.ProcessRowRules=function(){}                       // --! (todo)
EpiDataView.prototype.RaiseRowChanged=function(cRow,lRow){this.OnEpiRowChanged(cRow, lRow);}     
EpiDataView.prototype.RaiseRowChanging=function(cView, cRow, nRow){this.OnEpiRowChanging(cView, cRow, nRow);}
EpiDataView.prototype.RemoveRowRule=function(){}
EpiDataView.prototype.RemoveRowRuleRange=function(){}
EpiDataView.prototype.ResetDataView=function(){};                        // none
EpiDataView.prototype.RowRulesContain=function(){};                      
EpiDataView.prototype.ToString=function(){return this.ViewName};         // none

//Dataset
EpiDataView.prototype.Clear=function(){}
EpiDataView.prototype.AcceptChanges=function()
{
    if(this.dataView && this.dataView.Table)
    {
        this.dataView.Table.AcceptChanges();   
    }
}

EpiDataView.prototype.OnEpiRowChanging = function(currentView, currentRow, proposedRow)
{
    return this.get_Event("EpiRowChanging").fire({CurrentView:currentView, CurrentRow:currentRow, ProposedRow:proposedRow}); 
}
EpiDataView.prototype.OnEpiRowChanged = function(currentRow, lastRow)
{
    return this.get_Event("EpiRowChanged").fire({CurrentRow:currentRow, LastRow:lastRow, CurrentView:this}); 
}
EpiDataView.prototype.OnColumnChanging = function(dataColumnName, ea)
{
    return this.dataView.Table.get_Event("ColumnChanging").fire(this,ea, new EpiOverloadedArgs("Object_DataColumnChangeEventArgs")); 
}
EpiDataView.prototype.OnColumnChanged = function(dataColumnName, value)
{
    var retVal = false;
    if(this.Row>-1)
    { 
        var ea = new DataColumnChangeEventArgs(this.dataView.get_Row(this.Row), this.dataView.Table.get_Column(dataColumnName), value);
        ea.RowIdx = this.Row;
        retVal = this.dataView.Table.get_Event("ColumnChanged").fire(this, ea, new EpiOverloadedArgs("Object_DataColumnChangeEventArgs"));
    }
    
    return retVal;
}
EpiDataView.prototype.OnEpiViewNotification = function(args)
{
    return this.get_Event("EpiViewNotification").fire(this, args);
}
EpiDataView.prototype.OnEpiViewNotificationTree = function(args)
{
    if (Global.InLaunchCode) return; // If we are in launch code, the code is running for the launched form, so dont trigger tree notifications on parent form.
    
    return this.get_Event("EpiViewNotificationTree").fire(this, args);
}
EpiDataView.prototype.OnOnEpiDataChanged = function() // used only by APInvoiceEntry
{
    return this.get_Event("OnEpiDataChanged").fire({});
}
EpiDataView.FormatFilterValue=function(FilterValue)
{
	FilterValue = FilterValue.Replace("'", "''");
	return FilterValue;
}

// --------------------------------- ForeignKeyDataView -----------------------------------
var ForeignKeyDataView= Epicor.Mfg.UI.FrameWork.ForeignKeyDataView = function()
{
    EpiDataView.call(this, "ForeignKeyDataView");
    this.ForeignKeyData = new DataSet();
}
ForeignKeyDataView.prototype=new EpiDataView();

// --------------------------------- SUBSCRIBINGDATAVIEW -----------------------------------
var SubscribingDataView = Epicor.Mfg.UI.FrameWork.SubscribingDataView = function(type)
{
    if (!type) type = "SubscribingDataView";
    EpiDataView.call(this, false,"","");
    this._type = type;
    this._subscribers = new Hashtable();
    this._subKids = new Hashtable();
    this._subValues = new Hashtable();
    this._addNewSubs = new Hashtable();
    this._subConditions = new Hashtable();

}
SubscribingDataView.prototype=new EpiDataView();
SubscribingDataView.prototype.SubscribeToPublisher=function(Publisher,ChildColumn)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "String_String":
        this.SubscribeToPublisher_1(a[0],a[1]);
        break;
        case "String_String_String":
        this.SubscribeToPublisher_4(a[0],a[1],a[2]);
        break;
        case "IPublisher_String":
        this.SubscribeToPublisher_2(a[0],a[1]);
        break;
         case "IPublisher_String_String":
        this.SubscribeToPublisher_5(a[0],a[1],a[2]);
        break;
        case "Guid":
        this.SubscribeToPublisher_3(a[0]);
        break;
    }
}

SubscribingDataView.prototype.SubscribeToPublisher_1=function(PublisherName, ChildColumn)
{
    var itms = Global.BroadcastClient.BroadcastTower.Publishers.items;
    var ipub;
    for (var d in itms)
    {
        ipub = itms[d];
        if (ipub != null && ipub.PublishName == PublisherName)
        {
            this.SubscribeToPublisher_3(ipub.PublishKey);
            this._subKids.Add(ipub.PublishKey, ChildColumn);
            this._subValues.Add(ipub.PublishKey, String.Empty);
        }
    }

}

SubscribingDataView.prototype.SubscribeToPublisher_4=function(PublisherName, ChildColumn,Condition)
{
    var itms = Global.BroadcastClient.BroadcastTower.Publishers.items;
    var ipub;
    for (var d in itms)
    {
        ipub = itms[d];
        if (ipub != null && ipub.PublishName == PublisherName)
        {
            this.SubscribeToPublisher_3(ipub.PublishKey);
            this._subKids.Add(ipub.PublishKey, ChildColumn);
            this._subValues.Add(ipub.PublishKey, String.Empty);
            this._subConditions.Add(ipub.PublishKey, Condition);
        }
    }

}
SubscribingDataView.prototype.SubscribeToPublisher_2=function(Publisher,ChildColumn)
{
   this.SubscribeToPublisher_3(Publisher.PublishKey);
   this._subKids.Add(Publisher.PublishKey, ChildColumn);
   this._subValues.Add(Publisher.PublishKey, String.Empty);
}

SubscribingDataView.prototype.SubscribeToPublisher_5=function(Publisher,ChildColumn, Condition)
{
   this.SubscribeToPublisher_3(Publisher.PublishKey);
   this._subKids.Add(Publisher.PublishKey, ChildColumn);
   this._subValues.Add(Publisher.PublishKey, String.Empty);
   this._subConditions.Add(Publisher.PublishKey, Condition);
}
SubscribingDataView.prototype.SubscribeToPublisher_3=function(PublisherKey)
{
    var Subscriber = SubscribeAgent.RegisterSubscriber(PublisherKey);
    if (Subscriber == null) return;
        
    if (this._subscribers.ContainsKey(Subscriber.SubscribeKey))
        this._subscribers.set_Item(Subscriber.SubscribeKey,Subscriber);
    else
        this._subscribers.Add(Subscriber.SubscribeKey, Subscriber);
    
    // Subscribe to the broadcast event
    Subscriber.get_Event("BroadcastAlert").subscribe(this.Subscriber_BroadcastAlert, this,true);  
}

SubscribingDataView.prototype.SubscribeToAddNewPublisher=function(Publisher, ChildColumn)
{
    this.SubscribeToPublisher_3(Publisher.PublishKey);
    this._subKids.Add(Publisher.PublishKey, ChildColumn);
    this._addNewSubs.Add(Publisher.PublishKey, ChildColumn);
    this._subValues.Add(Publisher.PublishKey, String.Empty);
}

SubscribingDataView.prototype.get_HasFilterByPublisher=function()
{
   return (this._subscribers != null && this._subscribers.Count > 0); 
}
SubscribingDataView.prototype.IsSubscribedTo=function(Publisher)
{
    var b = false;
    var iEnum = this._subscribers.GetEnumerator();
    var sa;
    while (iEnum.MoveNext())
    {
        sa = iEnum.Value;
        if (sa.PublisherKey == Publisher.PublishKey) 
        {
            b = true;
            break;
        }
    }
    return b;
}
SubscribingDataView.prototype.Subscriber_BroadcastAlert=function(args)
{
    var Publisher = args.Publisher;
    if (this.IsSubscribedTo(Publisher) && this._subKids.ContainsKey(Publisher.PublishKey))
    {
        this.OnBroadcastEvent(Publisher,args);
    }
}
SubscribingDataView.prototype.OnBroadcastEvent=function(Publisher,args){}

SubscribingDataView.prototype.AddBAQFilter=function(Filter)
{
    // lazy load the collection
    if (this.staticFilters == null)
        this.staticFilters = new ArrayList();
    // ok to update collection?
    if (!this.staticFilters.Contains(Filter))
        this.staticFilters.Add(Filter);
}
SubscribingDataView.prototype.GetStaticFilter=function(forServer)
{
    // init
    var strFilter = "";
    var and = "";
    // verify
    if (this.staticFilters != null && this.staticFilters.Count > 0)
    {
        var filter;
        // enum the collection of filters
        for (var f in this.staticFilters.items)
        {
            filter = this.staticFilters.items[f];
            if(!forServer)
            strFilter += and + filter.GetFilter(this.EpiX);
            else
                strFilter += and + filter.GetServerFilter(this.EpiX);
            and = " AND ";
        }
    }
    return strFilter;
}
// --------------------------------- BAQVIEWFILTER -----------------------------------
var BAQViewFilter = Epicor.Mfg.UI.FrameWork.BAQViewFilter=function(ColumnName,Condition,Value,ValueIsColumn)
{
    this.ColumnName=ColumnName;
    this.Condition = Condition;
    this.value = Value;
    this.valueIsColumn = ValueIsColumn;
    this.FilterId = Guid.NewGuid();
}
BAQViewFilter.prototype.GetFilter=function(Sender)
{
    // init
    var quoteDelim = "'";
    if (this.valueIsColumn) quoteDelim = "";
    var colName = this.ColumnName;
    // If the column contains a period, change the syntax so our framework will support it. "Customer.CustID" becomes "o['Customer.CustID']"
    if (this.ColumnName.IndexOf(".") != -1)
    {
        colName = "o['" + this.ColumnName + "'] <> undefined && o['" + this.ColumnName + "'].toLowerCase()";
    }
    return colName + " " + this.Condition + " " + 
        quoteDelim + this.GetFilterValue(Sender) + quoteDelim + ".toLowerCase()";
}
BAQViewFilter.prototype.GetServerFilter=function(Sender)
{
    var filterVal = this.GetFilterValue(Sender,true);

    var quoteDelim = "'";
    if (this.valueIsColumn||filterVal=="true"||filterVal=="false") quoteDelim = "";
    return this.ColumnName + " " + this.Condition + " " + quoteDelim + filterVal + quoteDelim;
}
BAQViewFilter.prototype.GetFilterValue=function(Sender,forServer)
{
    var theVal = this.value;
    // TODO: We dont support this yet. Need to use ASP to get the Global constants.
    // TODO: for now, need to get the Global constants in the win and return the correct replacement for Constant:
    if (Sender.GetType().GetInterface("ILaunch",new EpiOverloadedArgs("String")) != null && theVal.StartsWith("Constant: "))
    {
        // make sure Constant: tag exists in 
        var colConstants = FormFunctions.GetGlobalConstants(Sender); 
        if (colConstants != null && colConstants.Contains(theVal))
            theVal = theVal.Replace(theVal, colConstants[theVal]);
    }
    if(!forServer)
    {
    if (theVal.toLowerCase() == "true") theVal = "true";
    if (theVal.toLowerCase() == "false") theVal = "false";
    }
    return theVal;
}
// --------------------------------- BAQDATAVIEW -----------------------------------
var BAQDataView = Epicor.Mfg.UI.FrameWork.BAQDataView = function(QueryID,Caption)
{
    SubscribingDataView.call(this, "BAQDataView");
    this.baqID = QueryID;
    this.caption = Caption;
    this._bypassLocalCompany = false;
}
BAQDataView.prototype=new SubscribingDataView();

BAQDataView.prototype.set_RefreshInterval=function(interval)
{
    var me = this;
    var intervalID = Global.window.setInterval(function(){me.timer_Tick()}, interval*1000);
    
    if (!BAQDataView.Timers) BAQDataView.Timers = [];
    BAQDataView.Timers.push({"IntID":intervalID,"Obj":me, "Interval":interval});
}

BAQDataView.prototype.timer_Tick=function()
{
DebugHelper.WriteMessage("Ran timer",false);
    this.OnSearch(null, null);
    //this.EpiX.NotifyAll(EpiTransaction.NotifyType.Initialize, this);
}
BAQDataView.ClearTimers=function(clearArr)
{
    if (BAQDataView.Timers && BAQDataView.Timers.length > 0)
    {
        var timerid;
        for (var i=0,timerObj; timerObj=BAQDataView.Timers[i];i++)
        {
            timerid = timerObj.IntID;
            Global.window.clearInterval(timerid);
            DebugHelper.WriteMessage("Cleared timer",false);
        }
        if (clearArr) // Passing false will not clear the array holding the timer objs. so they can be restarted later
            BAQDataView.Timers=[];
    }
}
BAQDataView.RestartTimers=function()
{
    if (BAQDataView.Timers && BAQDataView.Timers.length > 0)
    {
        var timerid, obj,interval
        for (var i=0,timerObj; timerObj=BAQDataView.Timers[i];i++)
        {
            timerid = timerObj.IntID;
            obj = timerObj.Obj;
            interval = timerObj.Interval;
            
            timerid = Global.window.setInterval(function(){obj.timer_Tick()}, interval*1000);
            timerObj.IntID = timerid;
            BAQDataView.Timers[i]=timerObj;
            
            DebugHelper.WriteMessage("restarted timer",false);
        }
    }
}
BAQDataView.ClearCaches=function()
{
    Global.LoadProxy("lib_Common");
    var lib = new lib_CommonService();
    for(var e in Global.BindingEngine.EpiDataViews)
    {
        var edv=Global.BindingEngine.EpiDataViews[e];
        if(edv instanceof BAQDataView&&edv.dataView&&edv.dataView.Table&&edv.dataView.Table.DataSet)
        {
            if(edv.dataView.Table.DataSet.CacheInfo||edv.dataView.Table.DataSet.PreviousCacheKey)
            {
                try
                {
	                var pageInfo={"cacheKey":[{"releaseID":edv.dataView.Table.DataSet.CacheInfo?edv.dataView.Table.DataSet.CacheInfo.CacheKey:edv.dataView.Table.DataSet.PreviousCacheKey}]};
                    edv.dataView.Table.DataSet.PreviousCacheKey=null;
                    lib.GetCachedDS("", JSON.stringify(pageInfo), "{}", null);

                    return;
                }
                catch(err)
                {
                    ExceptionBox.Show(err);
                }
            }
        }
    }
}
BAQDataView.prototype.OnSetEpiTransaction=function()
{
    this.initBAQView();
}
BAQDataView.prototype.vw_EpiNotification=function(view, args)
{
    if (this.filteredViews != null && this.filteredViews.Count > 0)
        this.handleNotify();
}
BAQDataView.prototype.get_IsUpdatable=function(chkCols)
{
    if (chkCols)
        return (this._updateOptions != null && this._updateOptions.UpdatableColumns != null && this._updateOptions.UpdatableColumns.length > 0);
    else
        return (this._updateOptions != null && this._updateOptions.UpdatableColumns != null);
}
BAQDataView.prototype.AddEnterpriseServer=function(ExtCompId)
{
    if (!this._entServerIds) this._entServerIds = new ArrayList();
    if (ExtCompId.indexOf(" (Current)") != -1) ExtCompId = Global.Form.Session.CompanyID; // local company
    if (!this._entServerIds.Contains(ExtCompId))
        this._entServerIds.Add(ExtCompId);
        
    // We always bypass because local company will be queried in executeLinkedQueries
    this._bypassLocalCompany = true; 
}
BAQDataView.prototype._getEnterpriseServerList=function()
{
    if (!this._entServerIds || this._entServerIds.Count == 0) return "";
    if (this._entServerIds.Contains("ALL")) 
        return "ALL";
    else
        return this._entServerIds.items.join(",");
}        
BAQDataView.prototype.set_UpdateOptions=function(UpdateOptions)
{
    // create new instance of the local member.  
    if (this._updateOptions == null)
    {
        this._updateOptions = new UpdatableBAQOptions(UpdateOptions.AllowAddNew, UpdateOptions.MultiDirtyRow);
        // only register the column changers one time... decide on the handler if its cool
        this.QueryResultsData.get_Table(0).get_Event("ColumnChanging").subscribe(this.BAQDataView_ColumnChanging, this,true);
        this.QueryResultsData.get_Table(0).get_Event("ColumnChanged").subscribe(this.BAQDataView_ColumnChanged, this,true);
        if (this._updateOptions != null && !this._updateOptions.MultiDirtyRow) 
                    this.get_Event("EpiRowChanging").subscribe(Global.Form.trans.baqView_EpiRowChanging,Global.Form.trans,true);
    }
    this._updateOptions.StaticGetNew = UpdateOptions.StaticGetNew;
    if (UpdateOptions.UpdatableColumns != null &&
        UpdateOptions.UpdatableColumns.length > 0)
    {
        // unset the ReadOnly 
        var column, view, EpiBinding,theView;
        for (var i = 0; i < UpdateOptions.UpdatableColumns.length; i++)
        {
            EpiBinding = UpdateOptions.UpdatableColumns[i];
            if (EpiBinding != null && EpiBinding.IndexOf(".") > 0)
			{
				column = EpiBinding.substring(EpiBinding.indexOf(".") + 1);
				view = EpiBinding.substring(0, EpiBinding.indexOf("."));
				if (column && view)
				{
				    theView = Global.BindingEngine.EpiDataViews[view];
				    if (theView != null && theView.dataView.Table.ColumnsContains(column))
				        theView.dataView.Table.SetExtendedProperty(column,"ReadOnly", false);
				}
			}
        }
    }
}
BAQDataView.prototype.BAQDataView_ColumnChanged=function(sender, e)
{
    // verify
    var options = this.getUpdateOptions(this.EpiX.get_LastControl());
    if (options == null || options.UpdatableColumns == null ||
        options.UpdatableColumns.length <= 0) return;
    var EpiBinding;
    for (var i = 0; i < options.UpdatableColumns.length; i++)
    {
        EpiBinding = options.UpdatableColumns[i];
        if (EpiBinding != null && EpiBinding.IndexOf(".") > 0)
		{
			column = EpiBinding.substring(EpiBinding.indexOf(".") + 1);
            if (column == e.Column.ColumnName && this.hasFieldLevelEvents(e.Column.ColumnName))
                BAQUpdater.BAQFieldUpdate(this, e.Column.ColumnName);
        }
    }
    return true;
}

BAQDataView.prototype.BAQDataView_ColumnChanging=function(sender, e)
{
    // verify
    var options = this.getUpdateOptions(this.EpiX.get_LastControl());
    if (options == null || options.UpdatableColumns == null ||
        options.UpdatableColumns.length <= 0) return;
    
    var EpiBinding, didValidate= false;
    for (var i = 0; i < options.UpdatableColumns.length; i++)
    {
        EpiBinding = options.UpdatableColumns[i];
        if (EpiBinding != null && EpiBinding.IndexOf(".") > 0)
		{
			column = EpiBinding.substring(EpiBinding.indexOf(".") + 1);
            if (column == e.Column.ColumnName && this.hasFieldLevelEvents(e.Column.ColumnName))
            {
                var result = BAQUpdater.BAQFieldValidate(this, e.Column.ColumnName);
                if (!result) throw new UIException();
                didValidate = true;
            }
        }
    }
    if (didValidate)
    {
        // There is code in ApplyFilter that doesnt allow the dataView rows to be updated from the table if we are in the ColumnChanging event, 
        // But we need to refresh the row in the dataView because BAQFieldValidate refreshes the datatable (the queryResultDataSet.Results table).
        if (this.dataView.Rows[this.Row] != this.dataView.Table.Rows[this.Row])
            this.dataView.Rows[this.Row] = this.dataView.Table.Rows[this.Row];
    }
    return true; // TODO: If BAQFieldValidate failed, we should be returning false so the column update is cancelled. Waiting for win implementation to do this.
}
BAQDataView.prototype.getUpdateOptions=function(control)
{
    if (control == null) return null;
    
    var updatableParent = AppController.getUpdatableParent(control);
    if (!updatableParent) return null;
   
    if (updatableParent && updatableParent._updateOptions)
        return updatableParent._updateOptions;
   
    return null;
}

BAQDataView.prototype.hasFieldLevelEvents=function(ColumnName)
{
    // enum the display columns
    for (var row in this.runtimeQueryData.Tables["SelectedField"].Rows)
    {
        row = this.runtimeQueryData.Tables["SelectedField"].Rows[row];
        // if column has events and we match name
        if (Convert.ToBoolean(row["RaiseEvent"],true) &&
            row["DisplayName"] == ColumnName)
            return true;
    }
    return false;
}

BAQDataView.prototype.fixRuntimeQuery=function()
{
    // Sometimes the query data that is returned from the server is missing some spaces that are required after an 'and' condition.
    // Not sure why this is happening only in the web. This method adds those spaces back in.
    var tbl = this.runtimeQueryData.get_Table("DynamicQuery");
    if (!tbl) return;
    var selFieldsCol = tbl.get_Row(0).get_Item("SelFields");
    if (selFieldsCol)
    {
        selFieldsCol = selFieldsCol.replace(/and \\n /g,"and \n    ");
        tbl.get_Row(0).set_Item("SelFields",selFieldsCol);
    }
}

BAQDataView.prototype._applyRowMods=function()
{
    // Need to set a U RowMod for all the rows so data is sent to the server.
    for(var tbl in this.runtimeQueryData.Tables)
    {
        var theTbl = this.runtimeQueryData.Tables[tbl];
        for(var row in theTbl.Rows)
        {
            row = theTbl.Rows[row];
            row["RowMod"] = "U";
        }
    }
    
}
BAQDataView.prototype.initBAQView=function()
{
    try
    {
        this.baqUpdateAdapter = Global.GetAdapter("BAQUpdateAdapter",this.EpiX);
        Global.LoadProxyForAdapter(this.baqUpdateAdapter,null,true);
        this.baqUpdateAdapter.BOConnect();
        this.BaqUpdateResultsData = this.baqUpdateAdapter.get_QueryResults();
        
        this.dqAdapter = Global.GetAdapter("DynamicQueryAdapter",this.EpiX);
        Global.LoadProxyForAdapter(this.dqAdapter,null,true);
        this.dqAdapter.BOConnect();
        this.dqAdapter.GetBaqDataViewQuery(this.baqID);
        this.runtimeQueryData = this.dqAdapter.get_RuntimeQuery();
        //this.fixRuntimeQuery(); // 
        this.QueryResultsData = this.dqAdapter.get_QueryResults();
        this.dataView = new DataView(this.QueryResultsData.get_Table("Results"));
        this.WhereItemMarkupColumnList = BAQMarkupHandler.GetWhereItemMarkupColumns(this);
        
    }
    catch (ex)
    {
        ExceptionBox.Show(ex);
    }
}
BAQDataView.prototype.HandleAppControlEvent=function(AppController,AppEvent)
{
    this.DidHandleAppEvent = false; // set the flag to let the caller decide to re-direct
    switch (AppEvent)
    {
        case AppControlEvent.Clear:
            // handle the Clear request
            this.QueryResultsData.Clear();
            if (this.get_Event("Cleared").subscribers.length>0) this.get_Event("Cleared").fire(this, {"AppController":AppController})
            this.initQueryWhereClause();
           AppController.NotifyAll(EpiTransaction.NotifyType.Initialize, this);
            this.DidHandleAppEvent = true;
            break;
        
        case AppControlEvent.GetNew:
            if (this._updateOptions == null || !this._updateOptions.AllowAddNew) return false;
            // handle the GetNew request
            var lastCount = this.dataView.Table.Rows.length;
            BAQUpdater.GetNewBAQRow(this);
            if (this.dataView.Table.Rows.length == lastCount + 1)
            {
                // stuff the publisher value onto 
                var theRow = this.dataView.Table.Rows.length - 1;
                this.newRowItemArray = this.dataView.Table.get_Row(theRow).get_ItemArray();
                var iEnum = this._subKids.GetEnumerator();
                var key,val;
                while (iEnum.MoveNext())
                {
                    key = iEnum.Key;
                    val = iEnum.Value;
                    if (this.dataView.Table.Columns[val] &&
                        this._subValues.ContainsKey(key) && !String.IsNullOrEmpty(this._subValues.get_Item(key).toString()))
                        this.dataView.Table.get_Row(theRow).set_Item(val,this._subValues.get_Item(key).toString());
                }
                this.set_Row(theRow);
            }
            this.DidHandleAppEvent = true;
            break;
        case AppControlEvent.Delete:
        case AppControlEvent.Open:
        case AppControlEvent.Undo:
          break;
        case AppControlEvent.Save:
            if (this._updateOptions == null) {this.DidHandleAppEvent = true; return true;}
            if (this.dataView.Count > 0 && this.dataView.Table.DataSet.HasChanges())
            {
               BAQUpdater.UpdateBAQ(this);
               this.Notify(new EpiNotifyArgs(this, this.Row, true, 0, new EpiOverloadedArgs("Object_Int32_Boolean_Int32")));
            }
            this.DidHandleAppEvent = true;
            break;
        case AppControlEvent.Refresh:
            // handle the Refresh request
            var getTrackerPrompts = this.getTrackerPanelPrompts(AppController);
            if ((this._updateOptions != null && this._updateOptions.UpdatableColumns != null && this._updateOptions.UpdatableColumns.length > 0)
                || this.isBaqUpdatable())
            {
                if (!getTrackerPrompts)
                {
                    // clear out the BAQ WhereClauses
                    this.initQueryWhereClause();
                    this.setNewValue(null, null, null);
                }
                BAQUpdater.BAQGetList(this);
                this.handleNotify();
                this.resetAllCharts();

                this.set_Row(0);
                this.OnEpiRowChanged(0, -1);
                AppController.NotifyAll(EpiTransaction.NotifyType.Initialize, this);
                this.DidHandleAppEvent = true;
                return true;
            }
            if (getTrackerPrompts)
            {
                this.invokeExecute(this.filteredViews != null && this.filteredViews.Count > 0);
//                if (calcColumnFilters != null) // TODO
//                            dataView.RowFilter = GetStringFilter(calcColumnFilters);
            }
            else
                this.OnSearch(null, null);
            var ro = 0;
            
            this._isNotifying = true;   
            this.set_Row(0);
            this._isNotifying = false;   

            this.OnEpiRowChanged(ro, -1);
            AppController.NotifyAll(EpiTransaction.NotifyType.Initialize, this);
            this.DidHandleAppEvent = true;
            break;
        case AppControlEvent.Search:
            // handle the search request
            this.DidHandleAppEvent = true;
            return AppController.InvokeSearch();
            break;
//    case AppControlEvent.GetByID:
//            // handle the GetByID
//            if (AppController.LastControl != null)
//                OnSearch(EpiBindingManager.GetColumnName(AppController.LastControl.EpiBinding), AppController.LastGetByID);
//            break;
        case AppControlEvent.CustomAction:
            // handle the Custom Action
            if (this._updateOptions == null) return false;
            if (this.dataView.Count > 0)
                BAQUpdater.BAQRunCustomAction(this, AppController.LastActionID);
            this.DidHandleAppEvent = true;
            break;
        
    }
    return true;
}

BAQDataView.prototype.isBaqUpdatable=function()
{
    // verify 
    if (this.runtimeQueryData != null && this.runtimeQueryData.Tables["DynamicQuery"] &&
        this.runtimeQueryData.Tables["DynamicQuery"].Rows.length == 1 &&
        this.runtimeQueryData.Tables["DynamicQuery"].Columns["Updatable"])
        return Convert.ToBoolean(this.runtimeQueryData.Tables["DynamicQuery"].Rows[0]["Updatable"]);
    return false;
    
}
BAQDataView.prototype.get_UpdateDataSet=function()
{
    if (this.QueryResultsData == null || !this.QueryResultsData.Tables["Results"]) return null;
    var tDS = this.QueryResultsData.Copy();
    //tDS.Data["Errors"] = [];
    var drv, rows=[], origRows=[];
    var resultsTable = tDS.Tables["Results"];
    for(var row in resultsTable.Rows)
    {
        drv = resultsTable.get_Row(row);
        if (drv["RowMod"]) 
        {
            rows.push(drv);
            origRows.push(resultsTable.CopyRow(drv));
        }
        else
            delete drv;                    
    }
    resultsTable.Rows=rows;
    resultsTable._orig = origRows;
    tDS.Data["Results"] = resultsTable.Rows;
    return tDS;
}
BAQDataView.prototype.handleNotify=function()
{
    var row = -1;
    if (this.dataView.Count > 0) row = 0;
    this.Notify(new EpiNotifyArgs(this, true, row, 0, new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
    // enum and notify the "child" filtered BAQ views
    this.NotifyFilteredViews();
    
}
BAQDataView.prototype.NotifyFilteredViews=function()
{
    if (this.filteredViews != null)
    {
        if (!this.dataView.Table.Columns["RowIdent"]) return;
        var findThis = null;
        if (this.Row > -1)
         findThis = this.dataView.Rows[this.Row]["RowIdent"].toString();

         var didNotify = false;
        for(var fv in this.filteredViews.items)
        {
            didNotify = false;
            FilteredView = this.filteredViews.items[fv];
            FilteredView.ResetFilter();
            
            if (this.Row < 0)
            {
               FilteredView.Notify(new EpiNotifyArgs(this.get_EpiX(), true, -1, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
               didNotify = true;
            }
            if (!didNotify)
            {
               var i = 0;
               var drv;
               for(var d in FilteredView.dataView.Rows)
               {
                    drv = FilteredView.dataView.Rows[d];
                    if (findThis && drv["RowIdent"].toString() == findThis)
                    {
                        FilteredView.Notify(new EpiNotifyArgs(this.get_EpiX(), true, i, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
                    }
                    i++;
               }
           }

           if (!didNotify && FilteredView.dataView.Count > 0)
           {
              FilteredView.Notify(new EpiNotifyArgs(this, true, 0, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
           } 

        }
    }

}
BAQDataView.prototype.getTrackerPanelPrompts=function(AppController)
{
 // get the EpiTrackerPanel
    var lastCtrl = AppController.get_LastControl();
    if (!lastCtrl || !lastCtrl.DashboardPrompt) return false;
    ctrl = Global.document.getElementById(lastCtrl.ID);
    if (!ctrl) return false;
    var tracker = Global.GetParentByType(ctrl, EpiTrackerPanel, true);//Find the parent EpiTrackerPanel
    if (!tracker) return false; 
    tracker = Global.BindingEngine.Controls[tracker.id];
    // fetch the collection of EpiTrackerPrompts
    var prompts = new EpiTrackerPrompts();
    if (tracker != null)
        tracker.GetTrackerPrompts(prompts, tracker); // Iterate all the controls on the search panel and build the where clause
    else
    {
         var _dataTyps = new Hashtable();
         var de;
        for (var key in this._subKids.items)
        {
            de = this._subKids.items[key];
            if (this.dataView != null && this.dataView.Table != null && this.dataView.Table.Columns[de])
                _dataTyps.Add(key, dataView.Table.Columns[de].DataType);
        }
        prompts = EpiTrackerPrompts.GetTrackerPrompts(this._subKids,this._subValues, this._subConditions, _dataTyps, this._addNewSubs);
    }
    // no tracker prompts
    if (!prompts || prompts.Columns.Count == 0) return false;
    
    // clear out the BAQ WhereClauses
    this.initQueryWhereClause();
    // reest where clause with the tracker values 
    this.ResetWhereClause(prompts.Columns, prompts.Values, prompts.Conditions, prompts.DataTypes);
    return true;
}
BAQDataView.prototype.initQueryWhereClause=function()
{
    for(var row in this.runtimeQueryData.Tables["QueryTable"].Rows)
    {
        row = this.runtimeQueryData.Tables["QueryTable"].Rows[row];
        row["WhereClause"] = "";
    }
}
BAQDataView.prototype.ResetWhereClause=function(columns, values, conditions, datatypes)
{
    this.resetWhereClauseFilters(columns, values, conditions, datatypes);
    var iEnum = columns.GetEnumerator();
    while (iEnum.MoveNext())
    {
        var pubKey = iEnum.Key;
        var ChildColumn = iEnum.Value;
        var newValue = values.get_Item(pubKey);
        var condition = "=";
         // decide if we use or drop the ticks (') surrounding where clause value
        var ticks = "'",isBoolValue = false;
        
         //try { Convert.ToBoolean(newValue); } catch(e) { isBoolValue = false; }
        if (newValue && (newValue.toUpperCase() == "TRUE" || newValue.toUpperCase() == "FALSE"))
            isBoolValue = true;
        
        var cName = ChildColumn.substring(ChildColumn.indexOf(".") + 1);
        var tName = ChildColumn.substring(0, ChildColumn.indexOf("."));
            
        if (datatypes != null && datatypes.ContainsKey(pubKey) &&
            datatypes.get_Item(pubKey) == "System.Boolean" && isBoolValue)
            ticks = "";
        else if (isBoolValue)
        {
            // Try to get column type in the whereclause
            if (this.dqAdapter.GetColumnType(tName, cName) == DynamicQueryAdapter.ColumnType.Boolean)
                ticks="";
        }
        if (conditions)
            condition = conditions.get_Item(pubKey);

        if (newValue.length > 0)
        {
            for(var row in this.runtimeQueryData.Tables["QueryTable"].Rows)
            {
                row = this.runtimeQueryData.Tables["QueryTable"].Rows[row];
                if (row["DataTableID"].toString().toUpperCase() == tName.toUpperCase())
                {
                    var wc = row["WhereClause"].toString();
                    var and = String.Empty;
                    if (wc.length > 0) and = " AND "; 
                    row["WhereClause"] = wc + and + ChildColumn + " " + condition + " " + ticks + newValue + ticks;
                }
            }
        }
    }
}

BAQDataView.prototype.resetWhereClauseFilters=function(columns,values,conditions,datatypes)
{
    // verify
    if (columns != null &&
        this.staticFilters != null && this.staticFilters.Count > 0)
    {
        var filter;
        // enum the collection of static filters
        for (var f in this.staticFilters.items)
        {
            filter = this.staticFilters.items[f];
            // update or add to collection
            if (columns.ContainsKey(filter.FilterId))
            {
                columns.set_Item(filter.FilterId,filter.ColumnName);
                values.set_Item(filter.FilterId,filter.GetFilterValue(this.EpiX));
                conditions.set_Item(filter.FilterId,filter.Condition);
            }
            else
            {
                columns.Add(filter.FilterId, filter.ColumnName);
                values.Add(filter.FilterId, filter.GetFilterValue(this.EpiX));
                conditions.Add(filter.FilterId, filter.Condition);
                if (this.QueryResultsData != null && this.QueryResultsData.Tables["Results"] != null &&
                    this.QueryResultsData.Tables["Results"].Columns[filter.ColumnName])
                  datatypes.Add(filter.FilterId,  this.QueryResultsData.Tables["Results"].Columns[filter.ColumnName].DataType);
            }
        }
    }
}

BAQDataView.prototype.invokeExecute=function(notify)
{
    if (this.EpiX != null) this.EpiX.PushStatusText(EpiString.GetString("retrievingData"), true);

    this.isCurrentlyExecuting = true;
    try
    {
        this.QueryResultsData.Clear();
        var FilteredView;
        if (this.filteredViews != null)
        {
            for(var fv in this.filteredViews.items)
            {
                FilteredView = this.filteredViews.items[fv];
                FilteredView.dataView.ServerFilter="";
                FilteredView.dataView.set_RowFilter("");
            }
        }
        
        try
        {
            var hasParams = false;
            var exeDs = null;
            if (this.runtimeQueryData.Tables["QueryParameter"] && this.runtimeQueryData.Tables["QueryParameter"].Rows.length > 0)
            {
            
                var x = new BAQParamTransaction(this.EpiX,{doProcessing:true});
                {
                    exeDs = new Epicor.Mfg.BO.QueryExecutionDataSet();
                    hasParams = x.FillParameters(exeDs, this.runtimeQueryData);
                }
            }
         
            var grids=Global.BindingEngine.GridsByView[this.ViewName];

            var pageSize=-1;
            if(grids)
            {
                for(var g in grids)
                {
                    var ps=-1;
                    if(grids[g].GroupByColumns.length>0&&grids[g].GroupGrid)
                        ps=1;
                    else
                    {
                        ps=grids[g].GetPageSize();
                        if(ps==-1) 
                        {
                            grids[g]._pageSize=1;
                            ps=1;
                        }
                    }

                if(ps>pageSize)pageSize=ps;
            }
            }
            
            if(pageSize>0)
            {
                var tblName=this.dataView.Table.TableName;
                var key=Guid.NewGuid().ToString();
                Global.PageInfo={"DS":this.dataView.Table.DataSet,"CacheKey":key,"Info":{"rows":[{"paging":(pageSize*5)}]}};
                
                if(this.dataView.Sort)
                {   
                    var arrs=this.dataView._getSortArray(this.dataView.Sort);
                    var sortCols=arrs["Cols"];
                    var sortDirs=arrs["Dirs"];
                    
                    var arr=Global.PageInfo.Info[tblName]=[];
                    for(var i in sortCols)
                    {
                        if(!this.dataView.Table.Columns[sortCols[i]])
                        {
                            delete Global.PageInfo.Info[tblName];
                            break;
                        }
                        arr.push({"column":sortCols[i],"sortOrder":sortDirs[i]==1?"A":"D"});
                    }
                }
                
                Global.PageInfo.SummaryInfo=null;
                var si=Global.GetSummaryInfo(Global.BindingEngine.GridsByView[this.ViewName]);
                if(si) 
                {
                    Global.PageInfo.SummaryInfo={};
                    Global.PageInfo.SummaryInfo["summary_"+this.dataView.Table.TableName]=si;
                }

                if(this.dataView.Table.DataSet.CacheInfo||this.dataView.Table.DataSet.PreviousCacheKey)
                {
                    Global.PageInfo.Info["cacheKey"]=[{"releaseID":this.dataView.Table.DataSet.CacheInfo?this.dataView.Table.DataSet.CacheInfo.CacheKey:this.dataView.Table.DataSet.PreviousCacheKey}];
                    this.dataView.Table.DataSet.PreviousCacheKey=null;
                }
            }
            if (!this._bypassLocalCompany)
            {
                this._applyRowMods();
                
                if (hasParams && exeDs != null)
                    this.dqAdapter.ExecuteDashboardParameterized(this.runtimeQueryData,exeDs);
                else 
                    this.dqAdapter.ExecuteBAQDataViewQuery(this.runtimeQueryData);
                this.QueryResultsData = this.dqAdapter.get_QueryResults();
            }
            else
                this.executeLinkedQueries(exeDs, hasParams);  // go try to execute the query on external companies
        }
        catch(err)
        {
            if (err.Message.StartsWith("TooManyRows"))
            {
                var msg = "The dashboard query resulted in too many rows.";
                if (err.Message.indexOf("_") != -1)
                {
                    var numRows = err.Message.substring(err.Message.indexOf("_") + 1);
                    if (numRows)
                        msg = msg + " Rows returned = " + numRows + "."; 
                }
                msg = msg + " Set a filter using the search and click on Refresh to load the data.";
                MessageBox.Show(msg); 
            }
            else
		        ExceptionBox.Show(err);
		        
            if (this.EpiX != null) this.EpiX.PopStatus();
		    
            return; 
        }
        Global.PageInfo=null;

        if (notify) this.handleNotify();
        this.resetAllCharts();
    }
    catch(ex)
    {
        DebugHelper.WriteError("error in invokeExecute", ex);
    }
    finally
    {
        this.isCurrentlyExecuting = false;
        if (this.get_Event("DoneExecuting").subscribers.length > 0)
                    this.get_Event("DoneExecuting").fire(this,{});
        if (this.EpiX != null) this.EpiX.PopStatus();
    }
    
}


BAQDataView.prototype.resetAllCharts=function()
{
    var FilteredView;
    this.get_Event("ResetChart").fire(this,null);
    if (this.filteredViews != null)
    {
        for(var fv in this.filteredViews.items)
        {
            FilteredView = this.filteredViews.items[fv];
            FilteredView.get_Event("ResetChart").fire(FilteredView,null);
        }
    }
}
BAQDataView.prototype.executeLinkedQueries=function(exeDS, hasParam)
{
    if (!this._entServerIds || this._entServerIds.Count == 0) return;
    var extCompList = this._getEnterpriseServerList();
    if (String.IsNullOrEmpty(extCompList)) return;
    // TODO: Call Web-service to make the actual calls
    // Parameters to web-service: this.runtimeQueryData,exeDs,hasParam,extCompList
    if (exeDS == null) exeDS = new Epicor.Mfg.BO.QueryExecutionDataSet();
        this._applyRowMods();
        Global.LoadProxy("lib_EnterpriseDashboardSupport"); // TODO: this needs to change when WS name changes
        var WS = new lib_EnterpriseDashboardSupportService();
        var results = null;
        try
        {
            results = WS.ExecuteLinkedQueries(this.runtimeQueryData,exeDS,extCompList,hasParam,"");
        }
        catch(err)
        {
             if (err.Message.indexOf("[102]Log-in required.") != -1)
             {
                // Prompt for password for the other company.
                var result;
                if (BrowserSniffer.FireFox15) {
                    sFeatures = "height=165,width=524,toolbar=no,menubar=no,scrollbars=no,scroll=no,status=no,help=no,resizable=yes,modal=yes";

                    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserWrite");

                    var win = Global.window.open("syslogin5629.html", "_blank", sFeatures);
                    result = true;
                }
                else if (BrowserSniffer.Safari13) {
                    sFeatures = "dialogHeight:130px; dialogWidth:532px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";

                    result = window.showModalDialog("SysEnterpriseLogin.aspx", null, sFeatures);
                }
                else //if(BrowserSniffer.IE)
                {
                    sFeatures = "dialogHeight:125px; dialogWidth:532px;toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
                    result = showModalDialog("SysEnterpriseLogin.aspx", null, sFeatures);
                }
                if (result == "Cancel") // user clicked on cancel
                {
                    // Call method with local company if it is in the list or if list contains 'ALL'.
                    if (this._entServerIds.Contains(Global.Form.Session.CompanyID) || extCompList == "ALL")
                    {
                        results = WS.ExecuteLinkedQueries(this.runtimeQueryData,exeDS,Global.Form.Session.CompanyID,hasParam,"");
                    }
                }
                else
                {
                    results = WS.ExecuteLinkedQueries(this.runtimeQueryData,exeDS,extCompList,hasParam,result);
                }
                
             }
        }
        
        if (results)
            this.QueryResultsData.Merge(results,new EpiOverloadedArgs("DataSet"));
    
}
    


BAQDataView.prototype.OnSearch=function(EpiBinding, newValue)
{
    // clear out the BAQ WhereClauses
    this.initQueryWhereClause();
    // Apply the new value to the EpiBinding
    this.setNewValue(EpiBinding, newValue, null);
    // execute the query -- click will handle Notify
    this.invokeExecute(this.filteredViews != null && this.filteredViews.Count>0);
}

BAQDataView.prototype.setNewValue=function(EpiBinding, newValue, condition)
{
    if (String.IsNullOrEmpty(condition)) 
    {
        condition = " = ";
        if (this.IsZoneSearch) condition = " BEGINS ";
    }
    // mock up new publisher / pubValue collections
    var myPub = new Hashtable();
    var myVal = new Hashtable();
    var myCon = new Hashtable();
    var myTyp = new Hashtable();
    if (!String.IsNullOrEmpty(EpiBinding) && !String.IsNullOrEmpty(newValue))
    {
        var key = Guid.NewGuid();
        myPub.Add(key, EpiBinding);
        myVal.Add(key, newValue);
        myCon.Add(key, condition);
        var dvName = "", dcName="";
        if (!String.IsNullOrEmpty(EpiBinding) && (EpiBinding.IndexOf(".") > 0))
		{
			dvName = EpiBinding.Substring(0, EpiBinding.IndexOf("."));
			dcName = EpiBinding.Substring(EpiBinding.IndexOf(".") + 1);
		}
		else if (!String.IsNullOrEmpty(EpiBinding))
            dvName = EpiBinding;
        
        if (dvName && dcName)
        {
            var dv = Global.BindingEngine.EpiDataViews[dvName];
            if (dv != null) // SCR #66517
            {
                var col = dv.dataView.Table.Columns[dcName].DataType;
                if (col != null) myTyp.Add(key, col);
            }
        }
    }
    // Reset the BAQ Where Clauses based on the new publisher collections
    this.ResetWhereClause(myPub, myVal, myCon, myTyp);
}
BAQDataView.prototype.OnSetParentView=function(Parent, ParentColumns, ChildColumns,Conditions)
{
    EpiDataView.prototype.OnSetParentView.call(this, Parent, ParentColumns, ChildColumns);
    try
    {
        if (!Conditions) Conditions = "=";
        if (!Global.IsArray(ParentColumns)) ParentColumns = [ParentColumns];
        if (!Global.IsArray(ChildColumns)) ChildColumns = [ChildColumns];
        if (!Global.IsArray(Conditions)) Conditions = [Conditions];
        
        for (var i = 0; i < ParentColumns.length; i++)
        {
            var pCol = ParentColumns[i];
            var cCol = ChildColumns[i];
            var cond = Conditions[i];
            if (String.IsNullOrEmpty(cond)) cond = "=";

            if (!this.QueryResultsData.Tables["Results"].ColumnsContains(cCol) ||
                cCol.indexOf(".") <= 0)
            {
                throw new Exception("Invalid BAQ Child Binding; Column " + cCol + " does not exist in BAQ results table");
            }
            var epiBind = Parent.ViewName + "." + pCol;
            var iPub = this.EpiX.GetPublisher(epiBind);
            if (iPub == null)
                this.EpiX.PublishColumnChange(epiBind, Guid.NewGuid().toString());
            this.SubscribeToPublisher(iPub, cCol,cond, new EpiOverloadedArgs("IPublisher_String_String"));
        }
        Parent.get_Event("Cleared").subscribe(this.ParentView_Cleared, this,true);
    }
    catch(ex)
    {
        ExceptionBox.Show(ex);
    }
}
BAQDataView.prototype.ParentView_Cleared=function(sender, e)
{
    this.HandleAppControlEvent(e.AppController, AppControlEvent.Clear);
}
BAQDataView.prototype.OnBroadcastEvent=function(Publisher,args)
{
    if (this.IsSubscribedTo(Publisher)) // && this._subKids.ContainsKey(Publisher.PublishKey)
    {
        this._subValues.set_Item(Publisher.PublishKey,args.NewValue);
        
        if (this.isCurrentlyExecuting)
        {
            // only register the event if not already registered
            if (this.get_Event("DoneExecuting").subscribers.length == 0) 
                this.get_Event("DoneExecuting").subscribe(this.BAQDataView_DoneExecuting,this,true);
        }
        else
        {
        // not currently executing, so go handle the broadcast, if not AddNew subscriber
          if (!Publisher.PublishName.StartsWith("EpiAddNew Subscriber:"))
          {
            this.handleBroadcast();
            this.dataView.get_Event("ListChanged").fire(this,{});
            this.set_Row(0);
            this.OnEpiRowChanged(0, -1);
          }
        }
    }
}
BAQDataView.prototype.BAQDataView_DoneExecuting=function(sender, e)
{
    // deregister
    this.get_Event("DoneExecuting").unsubscribe(this.BAQDataView_DoneExecuting,this);
    // go handle the broadcast
    this.handleBroadcast();
}
BAQDataView.prototype.handleBroadcast=function()
{
    this.initQueryWhereClause();
    var _dataTyps = new Hashtable();
    
    var de;
    var iEnum = this._subKids.GetEnumerator();
    while (iEnum.MoveNext())
    {
        de = iEnum.Key;
      
       if (this.dataView != null && this.dataView.Table != null && this.dataView.Table.Columns[iEnum.Value])
           _dataTyps.Add(de, this.dataView.Table.Columns[iEnum.Value].DataType);
    }
    var prompts = EpiTrackerPrompts.GetTrackerPrompts(this._subKids, this._subValues, this._subConditions, _dataTyps,this._addNewSubs);
    this.ResetWhereClause(prompts.Columns, prompts.Values, prompts.Conditions, prompts.DataTypes);
    this.invokeExecute(true);
}
BAQDataView.prototype.AddFilteredView=function(FilteredView)
{
    // create the collection if it doesn't exist
    if (this.filteredViews == null)
    {
        this.filteredViews = new ArrayList();
        this.get_Event("EpiViewNotification").subscribe(this.vw_EpiNotification,this,true);
    }
    
    // add the Filtered View to the local collection
    if (!this.filteredViews.Contains(FilteredView))
    {
        this.filteredViews.Add(FilteredView);

        var grids=Global.BindingEngine.GridsByView[FilteredView.ViewName];
        if(grids)
        {
            if(!Global.BindingEngine.GridsByView[this.ViewName]) Global.BindingEngine.GridsByView[this.ViewName]=[];

            for(var g in grids)
            {
                Global.BindingEngine.GridsByView[this.ViewName].push(grids[g]);          
            }    
        }
    }
}

BAQDataView.prototype.checkRefreshStatus=function()
{
    var status = {};
    
    // set the subscriber flag
    status.hasSubscriber = (this._subscribers != null && this._subscribers.Count > 0);
    status.hasFilteredViews = false;
    if (this.filteredViews != null && this.filteredViews.Count > 0)
    {
        // enum the collection of filtered views
        for (var fView in this.filteredViews.items)
        {
            fView = this.filteredViews.items[fView];
            // set the filtered view flag if there is subscriber on filtered view
            if (fView._subscribers != null && fView._subscribers.Count > 0) status.hasFilteredViews = true;
        }
    }
    return status;
}
BAQDataView.GetMatchedRows=function(updatedResults, sourceResults)
{
    // Put the updated rows into a Dictionary so we can quickly check if it is a matching row.
    // It appears that the server is sending back two rows for each row that is updated. I am assuming that the first
    // row is always the original row sent up and that the second row is always the row with the actual updated
    // values in it.
    var colKey = "RowIdent"; // This used to be SysRowID but there is a problem with the DQ contract not returning the updated rows with the original SysRowID. The RowIdent is there, so using that for now.
    var updatedRows = new Hashtable();
    var updatedRowLookup = new Hashtable();
    for (var updatedRow in updatedResults.Rows)
    {
        updatedRow = updatedResults.Rows[updatedRow];
        updatedRowLookup.set_Item(updatedRow[colKey],updatedRow);
    }

    // Find the source rows that were updated.
    for (var sourceRow in sourceResults.Rows)
    {
        sourceRow = sourceResults.Rows[sourceRow];
        if (updatedRowLookup.ContainsKey(sourceRow[colKey]))
            updatedRows.Add(updatedRowLookup.items[sourceRow[colKey]], sourceRow);

//        updatedRow;
//        if (updatedRowLookup.TryGetValue((Guid)sourceRow[sysRowIDColumn], out updatedRow))
//        {
//            yield return new KeyValuePair<DataRow, DataRow>(updatedRow, sourceRow);
//        }
    }

    return updatedRows;
}
BAQDataView.BuildListOfRowsFlaggedAsAdded=function(dataSet)
{
    var addedRows = [];

    // Exit if there is no Results table.
    var table = dataSet.Tables["Results"];
    if (table == null)
    {
        return addedRows;
    }

    // Exit if we don't have the expected columns.
    var sysRowIDColumn = table.Columns["RowIdent"];//table.Columns["SysRowID"];
    var rowModColumn = table.Columns["RowMod"];
    if ((sysRowIDColumn == null)
        || (rowModColumn == null))
    {
        return addedRows;
    }

    // Build the list of all the rows that are flagged as added.
    for (var row in table.Rows)
    {
        row = table.Rows[row];
        if (row[rowModColumn] && row[rowModColumn] == "A")
        {
          addedRows.push(row[sysRowIDColumn]);
        }
    }

    return addedRows;
}
BAQDataView.prototype.FindRowIndx=function(rowIdent)
{
    var inDV = this.dataView;
    var indx = 0;
    for (var inRow in inDV.Rows)
    {
        inRow = inDV.Rows[inRow];
        if (inRow["RowIdent"] == rowIdent)
            return indx;
        indx++;
    }
    return -1;
}
BAQDataView.MergeUpdatedRowsBackIntoSourceDataSet=function(updatedData,sourceData,addedRows,BAQView)
{
    var errorsTable = updatedData.Tables["Errors"];
    var updatedResults = updatedData.Tables["Results"];
    var sourceResults = sourceData.Tables["Results"];
    var sysRowIDColumn = "RowIdent"; //sourceResults.Columns["RowIdent"];// sourceResults.Columns["SysRowID"];
    var rowModColumn = "RowMod";// sourceResults.Columns["RowMod"];
    if (updatedResults == undefined) 
    {
        if (errorsTable != null)
        {
            // For the RowRules to work in the grid and show errors, we have to copy any errors into the source DataSet.
            sourceData.Tables["Errors"].Merge(errorsTable,false, new EpiOverloadedArgs("DataTable_Boolean"));
        }
        DebugHelper.WriteMessage("BAQ Update method returned empty dataset", true);
        return;
    }

    var col;
    var matchingRows = BAQDataView.GetMatchedRows(updatedResults, sourceResults);
    var iEnum = matchingRows.GetEnumerator();
	
    while (iEnum.MoveNext())
    {
        var updatedRow = iEnum.Key;
        var sourceRow = iEnum.Value;

        // The SysRowID value is used to identify columns in the different data tables.
        var sysRowID = sourceRow[sysRowIDColumn];

        // Update the source row data to match the updated row.
        //sourceRow.set_Item("ItemArray", updatedRow.get_ItemArray());
        for(var c in updatedRow)
        {
          sourceRow[c] = updatedRow[c];   
          Global.BindingEngine.NotifyFields(BAQView.ViewName, c, BAQView.FindRowIndx(sysRowID)); 
        }

        

        // Get the errors row associated with this updated row, if any.
        var errorRow = null;
        if (errorsTable != null)
        {
            errorRow = BAQDataView.GetErrorRow(sysRowID, errorsTable);
        }

        if (errorRow == null)
        {
            // Clear the RowMod flag if the row was updated without error.
            if (sourceRow[rowModColumn])
            {
                sourceRow[rowModColumn] = "";
            }

            // There was no error so flag this row as updated.
           // sourceRow.AcceptChanges();
        }
        else
        {
            // If this was an added row set the RowMod back to flag as added.
            if (addedRows.Contains(sysRowID))
            {
                sourceRow[rowModColumn] = "A";
            }

            // Set the row as modified so that it will get updated in the 
            //sourceRow.AcceptChanges();
            sourceRow.SetModified();
        }
    }

    // For the RowRules to work in the grid and show errors, we have to copy any errors into the source DataSet.
    sourceData.Tables["Errors"].Merge(errorsTable,false, new EpiOverloadedArgs("DataTable_Boolean"));
}
BAQDataView.GetErrorRow=function(sysRowID, errorsTable)
{
    for (var errorRow in errorsTable.Rows)
    {
        errorRow = errorsTable.Rows[errorRow];
        //if (errorRow["ErrorSysRowID"] == sysRowID)
        if (errorRow["ErrorRowIdent"] == sysRowID && errorRow["ErrorType"]=="Error")
        {
            return errorRow;
        }
    }

    return null;
}
BAQDataView.MergeUpdatedRowsBackIntoSourceDataSet_2=function(updatedData,sourceData,addedRows)
{
    var errorsTable = updatedData.Tables["Errors"];
    var updatedResults = updatedData.Tables["Results"];
    var sourceResults = sourceData.Tables["Results"];
    var sysRowIDColumn = sourceResults.Columns["RowIdent"];// sourceResults.Columns["SysRowID"];
    var rowModColumn = sourceResults.Columns["RowMod"];
    if (updatedResults == undefined) 
    {
        if (errorsTable != null)
        {
            // For the RowRules to work in the grid and show errors, we have to copy any errors into the source DataSet.
            sourceData.Tables["Errors"].Merge(errorsTable,false, new EpiOverloadedArgs("DataTable_Boolean"));
        }
        DebugHelper.WriteMessage("BAQ Update method returned empty dataset", true);
        return;
    }
    var errorRow = null,sysRowID;
    for(var updatedRow in updatedResults.Rows)
    {
        updatedRow = updatedResults.Rows[updatedRow];
        sysRowID = updatedRow[sysRowIDColumn];

        // Get the errors row associated with this updated row, if any.
        errorRow = null;
        if (errorsTable != null)
        {
            errorRow = BAQDataView.GetErrorRow(sysRowID, errorsTable);
        }
        if (errorRow == null)
        {
            // Clear the RowMod flag if the row was updated without error.
            if (updatedRow[rowModColumn])
            {
                updatedRow[rowModColumn] = "";
            }
        }
        else
        {
            // If this was an added row set the RowMod back to flag as added.
            if (addedRows[sysRowID])
            {
                updatedRow[rowModColumn] = "A";
            }
        }
    }
    sourceData.Merge(updatedData,new EpiOverloadedArgs("DataSet"));
    // For the RowRules to work in the grid and show errors, we have to copy any errors into the source DataSet.
    sourceData.Tables["Errors"].Merge(errorsTable,false, new EpiOverloadedArgs("DataTable_Boolean"));
}
BAQDataView.prototype._prepareResultPK = function (queryResults)
{
    if (queryResults != null && queryResults.Tables["Results"])
    {
        var resTable = queryResults.get_Table("Results");
        var pk = resTable.get_PrimaryKey();
        if (pk.length > 0 && pk[0].ColumnName == "SysRowID")
            resTable.PrimaryKey = {};
        
        if (resTable.get_PrimaryKey().length == 0)
        {
            resTable.set_PrimaryKey([resTable.get_Column("RowIdent")]);
        }

    }

}
// --------------------------------- FILTEREDBAQDATAVIEW -----------------------------------
var FilteredBAQDataView=Epicor.Mfg.UI.FrameWork.FilteredBAQDataView = function()
{
    SubscribingDataView.call(this, "FilteredBAQDataView");
}
FilteredBAQDataView.prototype=new SubscribingDataView();
FilteredBAQDataView.prototype.PreppedForPaging=false;
FilteredBAQDataView.prototype.get_IsUpdatable=function(chkCols)
{
    if(chkCols == undefined) chkCols = true;
    var flg=false;
    var parentView=Global.BindingEngine.EpiDataViews[this.ParentBAQName];
    if(parentView) flg=parentView.get_IsUpdatable(chkCols);
    return flg;
}
FilteredBAQDataView.prototype.set_UpdateOptions=function(updateOptions)
{
    var parentView=Global.BindingEngine.EpiDataViews[this.ParentBAQName];
    if(parentView) parentView.set_UpdateOptions(updateOptions);
}
FilteredBAQDataView.prototype.PrepForPaging=function()
{
    if(!this.PreppedForPaging)
    {
        this.dataView.OrigTable=this.dataView.Table.TableName;
        
        var tbl=this.dataView.Table.Clone();
        tbl.TableName=this.dataView.Table.TableName+Global.PagingIdx++;
        this.dataView.Table.DataSet.AddTable(tbl, new EpiOverloadedArgs("DataTable"));
        
        this.dataView.Table=tbl;
    
        this.PreppedForPaging=true;
    }
}
FilteredBAQDataView.AddFilteredBAQDataView=function(parentView,ViewName)
{
    // create a new instance
    var filteredView = new FilteredBAQDataView();
    filteredView.ViewName=ViewName;
    // set the dataView and the Filter
    filteredView.dataView = new DataView(parentView.dataView.Table);
    // add this instance to the Parent
    parentView.AddFilteredView(filteredView);
    filteredView.ParentBAQName = parentView.ViewName;
    filteredView.get_Event("EpiViewNotification").subscribe(filteredView.vw_EpiNotification,filteredView,true);
    return filteredView;
}
FilteredBAQDataView.prototype.vw_EpiNotification=function(view, args)
{
    if (!this.ParentBAQName) return;
    // If notify on filtered BAQ view, need to set Row prop on parent BAQDataView to fire RowChanged event
    var tView = Global.BindingEngine.EpiDataViews[view.ParentBAQName];
    if (tView && tView instanceof BAQDataView)
    {
        if (args.Row >=0 && args.Row == tView.Row) 
        {
                return; // Parent is already at the row we need, no need to continue.
        }

        if (args.Row >=0 && (this.dataView.Rows[args.Row]["RowIdent"].toString() != tView.dataView.Rows[args.Row]["RowIdent"].toString()))
        {
            // Rows dont match, find the exact matching row in the parent view.
            var findThis = this.dataView.Rows[args.Row]["RowIdent"].toString();
            var i=0;
            for (var drv in tView.dataView.Rows)
            {
                drv=tView.dataView.Rows[drv];
                if (drv["RowIdent"] && drv["RowIdent"].toString() == findThis)
                    tView.set_Row(i);
                i++;
			}
        }
        else
            tView.set_Row(args.Row);
    }
}
FilteredBAQDataView.prototype.OnBroadcastEvent=function(Publisher, args)
{
    if (this.IsSubscribedTo(Publisher))
    {
        // set the new Value onto collection of published values
        if (this._subValues.ContainsKey(Publisher.PublishKey) && 
            this._subKids.ContainsKey(Publisher.PublishKey))
        {
            if (this._subValues.get_Item(Publisher.PublishKey).toString() != args.NewValue)
            {
                this._subValues.set_Item(Publisher.PublishKey,args.NewValue);
                this.ResetFilter();
            }
        }
    }
}

FilteredBAQDataView.prototype.ResetFilter=function()
{
    // init the filter plus the AND string
    //string newFilter = GetGlobalConstantValue(StaticFilter);
    var newFilter = this.GetStaticFilter(false);
    var svrFilter = this.GetStaticFilter(true);

    var and = "";
    if (!String.IsNullOrEmpty(newFilter)) and = " AND ";
    // enum the subscribers
    var dict,d,val,condn;
    
    var iEnum = this._subKids.GetEnumerator();
    while (iEnum.MoveNext())
    {
        d = iEnum.Key;
        dict=iEnum.Value;
        svrDict=iEnum.Value;
   
        // If the column contains a period, change the syntax so our framework will support it. "Customer.CustID" becomes "o['Customer.CustID']"
        if (dict.IndexOf(".") != -1)
        {
            dict = "o['" + dict + "'] <> undefined && o['" + dict + "']";
        }
        if (this._subValues.ContainsKey(d))
        {
            val = this._subValues.get_Item(d).toString();
            condn = this._subConditions.get_Item(d).toString();
            // get the current published value and set Filter
            if (!String.IsNullOrEmpty(val))
            {
                newFilter = newFilter + and + dict.toString() + " " + condn + " '" + val + "' ";
                svrFilter = svrFilter + and + svrDict.toString() + " " + condn + " '" + val + "' ";
                and = " AND ";
            }
        }
    }
    // set the RowFilter
    this.dataView.ServerFilter=svrFilter;
    this.dataView.set_RowFilter(newFilter); 
}

// --------------------------------- UPDATABLEBAQOPTIONS -----------------------------------
var UpdatableBAQOptions=Epicor.Mfg.UI.FrameWork.FilteredBAQDataView = function(allowAddNew,multiDirtyRow)
{
    this.AllowAddNew = allowAddNew;
    this.MultiDirtyRow = multiDirtyRow;
    this.UpdatableColumns=[];
    this.StaticGetNew = false;
}

// --------------------------------- BAQUpdater -----------------------------------
var BAQUpdater = Epicor.Mfg.UI.FrameWork.BAQUpdater=
{
    UpdateBAQ:function(BAQView)
    {
        // clear Errors rows 
        if (BAQView.QueryResultsData.Tables["Errors"]) BAQView.QueryResultsData.Tables["Errors"].Clear();
       
        // status on Save
        BAQView.EpiX.PushStatusText(EpiString.GetString("savingData"), true);
        var addedRows = BAQDataView.BuildListOfRowsFlaggedAsAdded(BAQView.QueryResultsData);
       
        try
        {
           var dataToUpdate = BAQView.get_UpdateDataSet();
           var updatedResults = BAQView.baqUpdateAdapter.Update(dataToUpdate, BAQView.runtimeQueryData);
        }
        catch (ex)
        {
            ExceptionBox.Show(ex);
        }
        BAQView.EpiX.PopStatus();
        BAQView._prepareResultPK(updatedResults);
        BAQDataView.MergeUpdatedRowsBackIntoSourceDataSet(updatedResults,BAQView.QueryResultsData,addedRows,BAQView);

//        BAQView.QueryResultsData.Merge(updatedResults,new EpiOverloadedArgs("DataSet"));

//        if (BAQView.QueryResultsData.Tables["Results"] && BAQView.QueryResultsData.Tables["Results"].Columns["RowMod"])
//        {
//            var newRows = BAQView.QueryResultsData.Tables["Results"]._Select("RowMod = 'A'", false);
//            for (var row in newRows)
//                row["RowMod"] = "";
//            BAQView.QueryResultsData.AcceptChanges();
//        }
//        BAQView.QueryResultsData.AcceptChanges();
//        // re-dirty the Rows with Error table results so that next update they'll still be dirty
//        if (BAQView.QueryResultsData.Tables["Errors"] &&
//            BAQView.QueryResultsData.Tables["Results"].Columns["RowIdent"]&&
//            BAQView.QueryResultsData.Tables["Errors"].Columns["ErrorRowIdent"])
//        {
//            for (var errRo in BAQView.QueryResultsData.Tables["Errors"].Rows)
//            {
//                var resultRows = BAQView.QueryResultsData.Tables["Results"]._Select("RowIdent = '" + errRo["ErrorRowIdent"].toString() + "'", false);
//                if (resultRows != null && resultRows.length == 1)
//                {
//                    var s = resultRows[0]["RowIdent"].toString();
//                    resultRows[0]["RowIdent"] = "";
//                    resultRows[0]["RowIdent"] = s;
//                }
//            }
//        }
    },
    GetNewBAQRow:function(BAQView)
    {
        if (BAQView.QueryResultsData.Tables["Errors"]) BAQView.QueryResultsData.Tables["Errors"].Clear();
        
        // do we reuse the NewRow ItemArray 
        var appX = BAQView.EpiX;
        if (appX != null &&
            appX.LastUpdatePanel != null &&
            appX.LastUpdatePanel._updateOptions && 
            appX.LastUpdatePanel._updateOptions.StaticGetNew
            && BAQView.newRowItemArray != null)
        {
            var newRow = BAQView.QueryResultsData.Tables["Results"].NewRow();
            var newRowItems = BAQView.newRowItemArray;
            // reset the RowIdent guid
            if (BAQView.QueryResultsData.Tables["Results"].Columns["RowIdent"])
                newRowItems["RowIdent"] = Guid.NewGuid().toString();
            BAQView.QueryResultsData.Tables["Results"].AddRow(newRowItems);
            return;
        }
        BAQView.EpiX.PushStatusText(EpiString.GetString("getNew"), true);
        BAQView.baqUpdateAdapter.GetNew(BAQView.runtimeQueryData);
        BAQView.EpiX.PopStatus();
        //      BAQView.QueryResultsData.Clear();
        BAQView.QueryResultsData.Merge(BAQView.BaqUpdateResultsData,new EpiOverloadedArgs("DataSet"));
    },
    BAQGetList:function(BAQView)
    {
        // method variables
        var hasParams = false;
        var dqds = BAQView.runtimeQueryData.Copy();
        var exeDs = null;

        if (dqds != null && dqds.Tables["QueryWhereItem"] &&
            dqds.Tables["QueryWhereItem"].Rows.length > 0 &&
            dqds.Tables["QueryParameter"] &&
            dqds.Tables["QueryParameter"].Rows.length > 0)
        {
            // go prompt for the Parameters
            var x = new BAQParamTransaction(this.EpiX,{doProcessing:true});
            {
                exeDs = new Epicor.Mfg.BO.QueryExecutionDataSet();
                hasParams = x.FillParameters(exeDs, dqds);
            }
        }
        // if we did build up some Params
        if (hasParams && exeDs != null)
        {
            // lets enum the WhereItem Rows and reset the value using the param value
            var whereRow,paramRow ;
            for (var ii=0; ii< dqds.Tables["QueryWhereItem"].Rows.length;ii++)
            {
                whereRow=dqds.Tables["QueryWhereItem"].get_Row(ii);
                if (whereRow != null && !String.IsNullOrEmpty(whereRow["RValue"]))
                {
                    for (var iParam=0; iParam< exeDs.Tables["ExecutionParameter"].Rows.length;iParam++)
                    {
                        paramRow = exeDs.Tables["ExecutionParameter"].Rows[iParam];
                        if (whereRow["RValue"] == "{" + paramRow.ParameterName + "}")
                            whereRow.set_Item("RValue",paramRow.ParameterValue);
                    }
                }
            }
            //dqds.AcceptChanges();
        }
        BAQView.baqUpdateAdapter.GetList(dqds, 0, 0, true, new EpiOverloadedArgs("DataSet_Int32_Int32_Boolean"));
        BAQView.QueryResultsData.Clear();
        BAQView.QueryResultsData.Merge(BAQView.BaqUpdateResultsData,new EpiOverloadedArgs("DataSet"));
    },
    BAQFieldUpdate:function(BAQView, ColumnName)
    {
        if (ColumnName.IndexOf(".") > 0) ColumnName = ColumnName.Replace(".", "_");  
        BAQView.baqUpdateAdapter.FieldUpdate(BAQView.runtimeQueryData, ColumnName, BAQView.QueryResultsData);
        BAQView.QueryResultsData.Clear();
        BAQView.QueryResultsData.Merge(BAQView.BaqUpdateResultsData,new EpiOverloadedArgs("DataSet"));
    },
    BAQFieldValidate:function(BAQView, ColumnName)
    {
        if (ColumnName.IndexOf(".") > 0) ColumnName = ColumnName.Replace(".", "_");  
        var result = BAQView.baqUpdateAdapter.FieldValidate(BAQView.runtimeQueryData, ColumnName, BAQView.QueryResultsData);
        if (result)
        {
            BAQView.QueryResultsData.Clear();
            BAQView.QueryResultsData.Merge(BAQView.BaqUpdateResultsData,new EpiOverloadedArgs("DataSet"));
        }
        return result;
    },
    BAQRunCustomAction:function(BAQView, ActionId)
    {
        BAQView.baqUpdateAdapter.RunCustomAction(BAQView.runtimeQueryData, ActionId, BAQView.QueryResultsData);
        BAQView.QueryResultsData.Clear();
        BAQView.QueryResultsData.Merge(BAQView.BaqUpdateResultsData,new EpiOverloadedArgs("DataSet"));
    }
}

// --------------------------------- BINDING ENGINE -----------------------------------
function BindingEngine()
{
    this.CurrentTab;
//    this.BindDataSet;
    this.BindDatasets=[];
    this.Controls = {};
    this.BoundControls = {};
    this.TabManager = {};
    this.EpiDataViews = {}; 
    this.Tabs = {};
    this.Tree = null;
    this.RowChangeDV = null;
    this.IsBindAll = false;
    this.IsBindingReadOnlyGrid = false;
    this.RootHasBinding=false;
    this.GridsByView={};
    this.updatingChildren = 0;
    this.CurrentThread=null;
    
    this.EpiDataViewsDangling = new ArrayList();
}
BindingEngine._dsIdx=0;
BindingEngine.prototype.RunInThread=function(scope,fn,args)
{
    var retVal;
    var _debug = DebugHelper.Enter("BindingEngine","RunInThread", "");
    if(this.CurrentThread)
    {
        retVal = fn.apply(scope,args); 
    }
    else
    {
        var doBind=false;
        var trees=[];
        var datasets=[];
        var textchange=[];

        if(!this.CurrentThread) this.CurrentThread={"Rebind":false,"Datasets":{},"Trees":{},"TextChange":{}};

        try
        {
            retVal = fn.apply(scope,args); 
        }
        catch(err)
        {
             DebugHelper.WriteError("Error caught in RunInThread: ", err);
        }
        if (this.CurrentThread.CloseWindow)
        {
            if(Global.window.parent && Global.window.parent.IsWebMenu)
                    Global.window.parent.closeCurrentTab();
                else
                    Global.window.close();
                    
            return;
        }
        if(this.CurrentThread.Rebind)
            doBind=true;
        else
            for(var ds in this.CurrentThread.Datasets) datasets.push(this.CurrentThread.Datasets[ds]);

        for(var t in this.CurrentThread.Trees) trees.push(this.CurrentThread.Trees[t]);
        for(var c in this.CurrentThread.TextChange) textchange.push(this.CurrentThread.TextChange[c]);
        this.CurrentThread=null;

        if(doBind) 
            this.BindForm();
        else if(datasets.length>0)
        {
            this.BindDatasets=datasets;
            this.BindForm();
            this.BindDatasets=[];
        }

        for(var tc in textchange)
        {
            textchange[tc].Obj.set_Text(textchange[tc].Val);
        }

        for(var t in trees) trees[t].Tree.ProcessCache(trees[t].Notifications);
        
        Global.window.setTimeout(function(){Global.BindingEngine.FixFocus()}, 10);
    }
    DebugHelper.Leave(_debug);   
    return retVal;

}
BindingEngine.prototype.FixFocus=function()
{
    try
    {
        if(Global.Form._activeCtrl&&Global.Form._activeObj)
        {
            if(Global.Form._activeObj instanceof EpiTextBox)
            {
                Global.Form._activeCtrl.focus();
                Global.Form._activeCtrl.select();
            }
        }
    }
    catch(err){}
}
BindingEngine.prototype.ShouldWait=function(ds,dv,notifyFields)
{
    var waitFlg=false;
    if(this.CurrentThread)
    {
        waitFlg=true;
        
        if(!ds&&dv) 
        {
            if(dv.dataView&&dv.dataView.Table) ds=dv.dataView.Table.DataSet;
        }
        
        if(!ds) this.CurrentThread.Rebind=true;
        
        if(!this.CurrentThread.Rebind)
        {
            if(notifyFields)
            {
                // If we're notifying fields only, and we haven't said yet that the dataset should be rebound,
                // then go ahead and notify the fields.  Don't want to trigger a full rebind for such a quick
                // process.
                if(!this.CurrentThread.Datasets[ds.ID]) waitFlg=false;
            }
            else
            {
                this.CurrentThread.Datasets[ds.ID]=ds;
                this.RemoveTextChange(ds);
            }
        }
        else if(ds)
        {
            this.RemoveTextChange(ds);
        }
    }
    return waitFlg;
}
BindingEngine.prototype.TextChange=function(obj,val)
{
    // SCR 86499
    if(this.CurrentThread && obj.DataView)
    {
        var dView = Global.BindingEngine.EpiDataViews[obj.DataView];
        if(dView && dView.dataView.Table && dView.dataView.Table.DataSet)
        {
            this.CurrentThread.TextChange[obj.ID]={"Obj":obj,"Val":val,"DS":dView.dataView.Table.DataSet.ID};
        }
    }
}
BindingEngine.prototype.RemoveTextChange=function(ds)
{
    if(this.CurrentThread)
    {
        for(var t in this.CurrentThread.TextChange)
        {
            if(this.CurrentThread.TextChange[t].DS==ds.ID)
            {
                delete this.CurrentThread.TextChange[t];
            }
        }
    }
}
BindingEngine.prototype.IsBindingClear=function()
{
    for(var t in this.TabManager)
    {
        return false;
    }
    return true;
}
BindingEngine.prototype.Reload=function(bindType, dataset)
{
    var changedFlg = false;
    var parentInDataSet;
    
    for(var vw in this.EpiDataViews)
    {
        parentInDataSet = false;
        if(this.EpiDataViews[vw].HasParent)
        {
            if(this.EpiDataViews[vw].ParentView.dataView.Table.DataSet==dataset)
            {
                parentInDataSet = true;
                if(bindType==EpiBindType.Clear&&this.EpiDataViews[vw].ParentView.Row==-1)
                    parentInDataSet=false;              
            }                
        }
    
        if(parentInDataSet==false && this.EpiDataViews[vw].dataView.Table && dataset==this.EpiDataViews[vw].dataView.Table.DataSet &&
            !(bindType==EpiBindType.Clear && this.EpiDataViews[vw].Row==-1))
        {
            this.EpiDataViews[vw].Refresh(bindType, true, bindType!=EpiBindType.None && bindType!=EpiBindType.Cache);
            changedFlg = true;
        }
        
        // Commented because framework should not ever clear manual row props.  This code was added without
        // reference to an SCR number, so I can't verify the change against the original.  
        //if (bindType==EpiBindType.Clear && this.EpiDataViews[vw].dataView.Table.DataSet == dataset)
        //    this.EpiDataViews[vw].ClearManualRowProps();

        var cacheInfo=null;
        if(dataset&&dataset.CacheInfo&&dataset.CacheInfo.Views&&dataset.CacheInfo.Views[vw])
            cacheInfo=dataset.CacheInfo.Views[vw];
        else if(dataset&&dataset.CacheInfo)
            cacheInfo=dataset.CacheInfo;
        
        if(cacheInfo)
        {
            var grids=Global.BindingEngine.GridsByView[vw];
            if(grids)
            {
                for(var g in grids)
                {
                    grids[g].Summaries=cacheInfo.Summaries;
                }
            }
        }
    }
    for(var danglingVw in this.EpiDataViewsDangling.items)
    {
        var danglingView = this.EpiDataViewsDangling.items[danglingVw];
        if(danglingView.dataView.Table && dataset==danglingView.dataView.Table.DataSet &&
            !(bindType==EpiBindType.Clear && danglingView.Row==-1))
        {
            danglingView.Refresh(bindType, false, bindType!=EpiBindType.None && bindType!=EpiBindType.Cache);
            changedFlg = true;
        }
    }

    if(bindType!=EpiBindType.None && bindType!=EpiBindType.Cache && changedFlg) 
    {
        this.BoundControls = {};
        this.ClearDatasetReg(dataset);
        this.BindForm(dataset);
    }
}
BindingEngine.prototype.IsBindingDataset=function(ds,tblName)
{
    var flg=this.BindDatasets.length==0;
    for (var i=0,theDS;theDS=this.BindDatasets[i];i++)
    {
        if(ds&&theDS==ds)
        {
            flg=true;
            break;
        }
        else if(tblName&&theDS.Tables[tblName])
        {
            flg=true;
            break;
        }
    }
    return flg;
}
BindingEngine.prototype.BindForm=function(dataset)
{
    if(this.ShouldWait(dataset)) return;

    if(!dataset && !this.BindDataView) this.TabManager = {};

    if(dataset) this.BindDatasets=[dataset];
    this.FocusSet=false;
    
    var topPanel = Global.document.getElementById("div_TopLevelPanel");
    
    if(topPanel)
    {
        this.Controls["div_TopLevelPanel"] = new EpiPanel({"ID":"div_TopLevelPanel"});
        
        Global.IsBindAll = true;
        this.BindTab(topPanel);
        Global.IsBindAll = false;
    }
    
    Global.Form.bindToolbarCtrls();

    this.BindDatasets=[];
}

BindingEngine.prototype._tabIsHidden=function(tab)
{
    var oCurrentNode = tab;
    
    while(oCurrentNode)
    {
        if (oCurrentNode.style && oCurrentNode.style.display == "none") return true;
        oCurrentNode = oCurrentNode.parentNode;
	    
    }
    return false;
}
BindingEngine.prototype.BindTab=function(tab, boundGrids)
{
    if(this.RowChangeDV) return;
    
    var prevTab;
    if (!this.UserChgTab) prevTab=this.CurrentTab;
    if(tab) 
    {
        if(!this.Tabs[tab.id]) 
            this.Tabs[tab.id] = {"Visible":true,"Invalidated":false,"DataViews":{}};
        else
            this.Tabs[tab.id]["Visible"] = true;
        
       if (!this._tabIsHidden(tab))
            this.CurrentTab = tab;
    }
    else tab = this.CurrentTab;

    if(tab)
    {
        var invalidated = false;
        if(this.Tabs[tab.id]) invalidated = this.Tabs[tab.id].Invalidated;
   
        var tabObj = this.TabManager[tab.id];
        if((tabObj==null || tabObj==undefined) || Global.IsBindAll || invalidated)
        {            
            var obj = this.Controls[tab.id];
            if(obj) obj.Bind(this, tab, null, null, boundGrids);
            
            if(this.Tabs[tab.id]) this.Tabs[tab.id].Invalidated = false;
            if(prevTab) this.CurrentTab=prevTab;
        }
    }
}
BindingEngine.prototype.CloseTab = function(tab)
{
    var divElements = tab.getElementsByTagName("DIV");
    for(var i=0,ctrl; ctrl=divElements[i]; i++)    
    {
        if(this.Tabs[ctrl.id]) this.Tabs[ctrl.id].Visible = false;
    }
    if(this.Tabs[tab.id]) this.Tabs[tab.id].Visible = false;
}
BindingEngine.prototype.ClearDatasetReg=function(dataset)
{
    // Clears all of the binding registration for a dataset
    var tabMgr = this.TabManager;
    for(tab in tabMgr)
    {
        var all = true;
        for(dv in tabMgr[tab])
        {
            if(dataset==this.EpiDataViews[dv].dataView.Table.DataSet) 
            {
                delete tabMgr[tab][dv];
                if(this.Tabs[tab]) this.Tabs[tab].Invalidated = true;
            }
            else if(this.Tabs[tab] && this.Tabs[tab].DataViews[dv])
            {
                this.Tabs[tab].Invalidated = true;
                all = false;
            }
            else // VA
                all = false;
        }
        
        if(all) delete tabMgr[tab];
    }
}
BindingEngine.prototype.ClearDVReg=function(dv, onlyInvalidate)
{
    var tabMgr = this.TabManager;
    for(tab in tabMgr)
    {
        var all = true;
        for(vw in tabMgr[tab])
        {
            if(vw==dv.ViewName)
            {
                if (!onlyInvalidate)
                    delete tabMgr[tab][vw];
                if(this.Tabs[tab]) this.Tabs[tab].Invalidated = true;
            }
        }
    }
}
// This is called when a control is deleted (used in ConfigurationEntry)
BindingEngine.prototype.UnRegisterBinding=function(tabID,dv,dc,row,ctrl,grdFlg)
{
    if(ctrl.id && ctrl.id!="")
    {
        if(this.BoundControls && this.BoundControls[ctrl.id]) 
            delete this.BoundControls[ctrl.id];
    }
    var panelObj = this.TabManager[tabID];
    if (panelObj) return;
    var rowStr = row.toString();
    if(panelObj[dv][rowStr][dc][ctrl.id])
     delete panelObj[dv][rowStr][dc][ctrl.id];
     
    var ctrlObj = this.Controls[ctrl.id];
    if (ctrlObj && ctrlObj instanceof EpiComboBox && ctrlObj.DescColumn)
    {
        if(panelObj[dv][rowStr][ctrlObj.DescColumn] && panelObj[dv][rowStr][ctrlObj.DescColumn][ctrl.id]) 
            delete panelObj[dv][rowStr][ctrlObj.DescColumn][ctrl.id];
    }
    if (panelObj[dv][rowStr][dc].length == 0)
        delete panelObj[dv][rowStr][dc];
}
BindingEngine.prototype.RegisterBinding=function(tabID,dv,dc,row,ctrl,grdFlg)
{
    if(ctrl.id && ctrl.id!="")
    {
        if(!this.BoundControls) this.BoundControls = {};
        this.BoundControls[ctrl.id] = ctrl;
    }

    var panelObj = this.TabManager[tabID];
    if(!panelObj) panelObj = this.TabManager[tabID] = {};
    
    var rowStr = row.toString();
    
    if(!panelObj[dv]) panelObj[dv] = {};
    if(!panelObj[dv][rowStr]) panelObj[dv][rowStr] = {};
    if(!panelObj[dv][rowStr][dc]) panelObj[dv][rowStr][dc] = [];
    if(!panelObj[dv][rowStr][dc][ctrl.id]) panelObj[dv][rowStr][dc][ctrl.id] = ctrl;
    
    var ctrlObj = this.Controls[ctrl.id];
    if (ctrlObj && ctrlObj instanceof EpiComboBox && ctrlObj.DescColumn)
    {
        if(!panelObj[dv][rowStr][ctrlObj.DescColumn]) panelObj[dv][rowStr][ctrlObj.DescColumn] = [];
        if(!panelObj[dv][rowStr][ctrlObj.DescColumn][ctrl.id]) panelObj[dv][rowStr][ctrlObj.DescColumn][ctrl.id] = ctrl;
    }
    
    var tabObj = this.Tabs;
    if(!tabObj[tabID]) tabObj[tabID] = {};
    if(!tabObj[tabID].DataViews) tabObj[tabID].DataViews = {};
    if(!tabObj[tabID].DataViews[dv]) tabObj[tabID].DataViews[dv] = {};
}
BindingEngine.prototype.RegisterGrid=function(tabID,dv,grd)
{
    var panelObj = this.TabManager[tabID];
    if(!panelObj) panelObj = this.TabManager[tabID] = {};

    if(!panelObj[dv]) panelObj[dv] = {};
    if(!panelObj[dv].Grids) panelObj[dv].Grids = {};
    
    if(!panelObj[dv].Grids[grd.id]) panelObj[dv].Grids[grd.id] = grd;
    
    var tabObj = this.Tabs;
    if(!tabObj[tabID]) tabObj[tabID] = {};
    if(!tabObj[tabID].DataViews) tabObj[tabID].DataViews = {};
    if(!tabObj[tabID].DataViews[dv]) tabObj[tabID].DataViews[dv] = {};
}
BindingEngine.prototype.NotifyFields=function(dv,dc,row, propsOnly)
{    
    if(!propsOnly && this.ShouldWait(null,Global.BindingEngine.EpiDataViews[dv],true)) return;
    
    var tabMgr = this.TabManager;
    for(tab in tabMgr)
    {
        if(tabMgr[tab][dv])
        {
            var tabMgrRow = tabMgr[tab][dv][row];
            if(tabMgrRow)
            {
                // Take care of all non-grid fields.
                if(tabMgrRow[dc] && !propsOnly) // propsOnly is true if only RefreshProperties needs to be called.
                {
                    for(idx in tabMgrRow[dc])
                    {
                        var obj = this.Controls[tabMgrRow[dc][idx].id];
                        if (!obj) continue;
                        
                        obj.inNotifyFields = true;
                        if (obj instanceof EpiComboBox && obj.DescColumn == dc)
                        {
                            if (this.EpiDataViews[dv].dataView.Rows[row][obj.DataColumn]) // Sometimes, the descColumn is updated but the code column is missing from the dataview (ChartTracker). This clears out the combo.
                                obj.SetValue(tabMgrRow[dc][idx], this.EpiDataViews[dv].dataView.Rows[row][obj.DataColumn],this.EpiDataViews[dv].dataView.Rows[row][dc]);
                        }
                        else 
                            obj.SetValue(tabMgrRow[dc][idx], this.EpiDataViews[dv].dataView.Rows[row][dc]);
                        obj.inNotifyFields = false;
                    }
                }    

                for(col in tabMgrRow)
                {
                    for(idx in tabMgrRow[col])
                    {
                        var obj = this.Controls[tabMgrRow[col][idx].id];
                        if (obj)
                            obj.RefreshProperties(tabMgrRow[col][idx], this.EpiDataViews[dv], row);
                    }
                }          
            }
            
            if(tabMgr[tab] && tabMgr[tab][dv] && tabMgr[tab][dv].Grids && !propsOnly)
            {
                // Take care of all grid fields                
                for(var grd in tabMgr[tab][dv].Grids)
                {
                    this.Controls[grd].SetDataColumnValue(tabMgr[tab][dv].Grids[grd], this.EpiDataViews[dv], dc, row);
                }
            }
        }        

    }
    // If any toolbar containers are bound to this dataview, set the value in them too.
   if (Global.Form && Global.Form.myTool)
   {
        var obj,c,theTool;
        var tools = Global.Form.myTool.Tools;
        
        for(var tool in tools)
        { 
           theTool = tools[tool];
           if (Global.IsFunction(theTool)) continue;
           if (theTool.Type == "ControlContainerTool" && theTool.Control != "")
           {
                obj = this.Controls[theTool.Control];
                if (!obj) continue;
                c = Global.document.getElementById(obj.ID);
                if(obj && obj.DataView == dv && obj.DataColumn==dc && this.EpiDataViews[dv])
                {
                   if (!propsOnly)
                        obj.SetValue(c, this.EpiDataViews[dv].dataView.Rows[row][obj.DataColumn],this.EpiDataViews[dv].dataView.Rows[row][dc]);
                   obj.RefreshProperties(c, this.EpiDataViews[dv], row);
                }
           }
        }
    }

}
BindingEngine.prototype.NotifyTabs = function(dv, row, boundGrids)
{
    var epiDV=null;
    var origDV;
    if(dv instanceof EpiDataView)
    {
        epiDV=dv;
        origDV = dv.dataView;
        dv = dv.ViewName;
    }
    else
    {
        epiDV=Global.BindingEngine.EpiDataViews[dv];
    }
    
    var tabMgr = this.TabManager;
    
    // Made this happen only when there is data, because thats when the PurchaseAdvisor form needs it.
    if(this.RootHasBinding&&!tabMgr["div_TopLevelPanel"] && row >=0 && Global.Form.ID=="PurchaseAdvisorEntryForm") 
    {
        this.BindForm();
        return;
    }
    
    var hasBinding=false;
    for (tab in tabMgr)
    {
        hasBinding=true;
        if (tabMgr[tab][dv] && tabMgr[tab][dv].Grids)
        {
            for (var grd in this.TabManager[tab][dv].Grids)
            {
                this.Controls[grd].HiliteRow(tabMgr[tab][dv].Grids[grd], row);
            }
        }

        if (!(tabMgr[tab][dv] && tabMgr[tab][dv][row]) || this.Tabs[tab].Invalidated)
        {
        
            // If there are tabs already registered for this tab Id, that means the tab has been bound before. Do a rebind only if the tab has never been bound.
            // Exceptions: 1. Whole tab is invalidated 2. The row being processed is a new row (we have to rebind the controls bound to that row in this case)
            var doContinue = false;
            if (!tabMgr[tab][dv] && !this.Tabs[tab].Invalidated)
            {
                var quit = false;
                if (origDV && origDV.Rows && origDV.Rows[row] && origDV.Rows[row]["RowMod"]== "A")
                    quit = true;
                
                if (!quit)
                {
                    for (var d in tabMgr[tab]) // even if there is one property for some dv in this tab, it means this tab has been bound before, just not to the dv that was passed in.
                    {
                        doContinue = true;
                        break;
                    }
                }
            }
            if (doContinue) continue;

            // Moved from above the loop because we need to make sure that some binding will be done
            // before telling the CurrentThread we need it.
            if(this.ShouldWait(null,epiDV)) return; 

            var grids = null;
            var rebind = true;
            if (tabMgr[tab][dv])
            {
                rebind = false;

                grids = tabMgr[tab][dv].Grids;
                delete tabMgr[tab][dv];
                if (this.Tabs[tab]) this.Tabs[tab].Invalidated = true;
            }

            if (this.Tabs[tab] && this.Tabs[tab].Visible)
            {
                var obj = this.Controls[tab];

                this.BindDataView = dv;

                if (!rebind&&Global.BindingEngine.EpiDataViews[dv].dataView.Rows.length>0) this.RowChangeDV = dv;
                if (obj) obj.Bind(this, this.CurrentTab, null, null, boundGrids);
                this.RowChangeDV = null;

                this.BindDataView = null;
            }

            if (grids)
            {
                for (var grd in grids)
                {
                    this.RegisterGrid(tab, dv, grids[grd]);
                }
            }
        }
    }
    
    if(!hasBinding) this.BindForm();
}

BindingEngine.prototype.OnChange=function(ctrl)
{
    var ctrlStruct = this.Controls[ctrl.id];
    
    if(ctrlStruct)
    {
        try
        {
            if(!ctrlStruct.IsChanged(ctrl)) return false;
            
            var prevValue = ctrlStruct.GetDataVal(ctrl);  
            ctrlStruct._prevValue=prevValue;
          
            var eventArgs = {"Cancel":false,"Control":ctrl};
            if(ctrlStruct.CausesValidation) 
            {
                var fn = function(ctrlStruct,eventArgs){return ctrlStruct.get_Event("Validating").fire(ctrlStruct, eventArgs);}
                this.RunInThread(this,fn,[ctrlStruct,eventArgs]);
                //ctrlStruct.get_Event("Validating").fire(ctrlStruct, eventArgs); 
                if(eventArgs.Cancel) throw new UIException();
            }
            
            // might have changed during validation (rebinding)
            var val = ctrlStruct.GetValue(ctrl, true);
            var unformattedVal = ctrlStruct.Unformat(val);  
            
            var newValue = ctrlStruct.GetDataVal(ctrl);

            // If newValue==prevValue, then rebinding or something similar happened during
            // the validation.  In this case, the value is already in the dataview and nothing
            // further needs to happen.  
            if(ctrlStruct.DataView && ctrlStruct.DataColumn && this.EpiDataViews[ctrlStruct.DataView] && newValue==prevValue)
            {
                var rowNum = this.EpiDataViews[ctrlStruct.DataView].Row;
                if(ctrlStruct.InGrid) rowNum = ctrlStruct.GetRowNum(ctrl);

                if (rowNum != -1)
                {
                    if(!ctrlStruct.SaveFormatted) val = unformattedVal;

                    var fn = function(ctrlStruct,rowNum,val) {return this.EpiDataViews[ctrlStruct.DataView].SetValue(rowNum, ctrlStruct.DataColumn, val, false, ctrlStruct, true)}
                    var retVal=this.RunInThread(this,fn,[ctrlStruct,rowNum,val]);
                    
                    //if(!this.EpiDataViews[ctrlStruct.DataView].SetValue(rowNum, ctrlStruct.DataColumn, val, false, ctrlStruct, true))
                    if(!retVal)
                    {
                        throw new UIException();
                    }
                }
            }
            else
            {
                ctrlStruct.SetValue(ctrl, unformattedVal);
            }
            
            ctrlStruct.SetDialogProp(PropertyType.Value, unformattedVal);
            
            if(ctrlStruct.CausesValidation) 
            {
                eventArgs = {};
                ctrlStruct.get_Event("Validated").fire(ctrlStruct, eventArgs); 
            }
        }
        catch(err)
        {
            if(err.Message && Global.IsString(err.Message)) MessageBox.Show(err.Message, new EpiOverloadedArgs("String"));
            ctrlStruct.SetValue(ctrl, ctrlStruct._prevValue);
            Global.ValidationFailed = true;
            setTimeout(function() {Global.ValidationFailed = false; ctrlStruct.Focus(ctrl);},50);
            return false;
        }
    }
    return true;
}
BindingEngine.prototype.OnRowClick = function(ctrl)
{return;
    var tbl = Global.GetParentByTag(ctrl, "TABLE", true);
    
    var ctrlStruct = this.Controls[tbl.id];
    if(tbl && ctrlStruct.DataView)
    {
        if(!this.EpiDataViews[ctrlStruct.DataView].DoRowChange(ctrl.getAttribute("_idx")))
        {
//            //for(var ii=1; ii<=tbl.rows.length-1; ii++)
//            //{
//            //   if(tbl.rows[ii].getAttribute("DataIndex")==this.Tables[dView].Row)
//            //    {
//            //        // SET THE FOCUS BACK HERE.  
//            //    }
//            //}
        }
    }
}
BindingEngine.prototype.OnPage = function(ctrl,to)
{
    var ctrlStruct = this.Controls[ctrl.id];
    if(ctrlStruct)
    {
        ctrlStruct.OnPage(ctrl, to, this.EpiDataViews[ctrlStruct.DataView]);
    }  
}
BindingEngine.prototype._rebindGrids=function(dView)
{
    var grid;
    var flg = false;
    var dv = dView.ViewName;
    var tabMgr = this.TabManager;
    var boundGrids = [];
    for(tab in tabMgr)
    {
        if(tabMgr[tab][dv] && tabMgr[tab][dv].Grids)
        {
            for(var grd in this.TabManager[tab][dv].Grids)
            {
                grid = this.Controls[grd];
                if (grid && grid.DataView == dv)
                {
                    // Moved this here because there's no reason to force a rebind later if we don't ever 
                    // even reach this code.
                   if(this.ShouldWait(null,dView)) return; 

                   grid.Bind(this, Global.document.getElementById(grd), dView, dView.Row, true);
                   boundGrids[grd] = 1;
                   flg = true;
                }
            }
        }
    }
    if(flg) this.NotifyTabs(dView.ViewName, dView.Row, boundGrids);
}
