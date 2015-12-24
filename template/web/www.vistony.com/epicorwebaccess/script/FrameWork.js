// Standards 
//  - private variables should be preceded with an "_".
//  - public variables and functions should be UpperCamelCase
//  - non-static objects should use prototype for method definitions (example: StringBuilder)
//  - static objects should have method definitions inline the constructor (example: MessageBox)

var Epicor =  
{
    Mfg:
    {
        BO:{},
        Common:{},
        Core:
        {
            CallContext:{}
        }, 
        Lib:
        {
            Report:{},
            HelpViewer:{},
            GL:{},
            Custom:{Forms:{}}
        },
        Proc:{},
        Rpt:{},
        Shared:
        {
            ContextMenuAddNew:{}
        },
        UI:
        {
            Adapters:
            {
                Controls:{}
            },
            App:{},
            Attachments:{},
            Broadcast:{},
            CallContextHandler:{},
            Charting:{},
            ClassAttribute:{},
            Controls:
            {
                Combos:{}
            },
            Customization:{},
            Documentation:{},
            ExtendedProps:{},
            FormFunctions:{},
            FrameWork:
            {
                FormFunctions: {},
                UIApp: {},
                Gauges: {}
            },
            InfoPrompt:{},
            Searches:{},
            SecRights:{},
            Utilities:{}
        },
        Sec:{}
    }
}

Function.prototype.bind = function()
{
    if (arguments.length < 2 && (typeof arguments[0] == "undefined")) return this;
    var __method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function()
    {
        return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    }
}

function ProcessRowRules(rules, r, col)
{
    var value, result = false;
    for(index in rules)
        result = result || rules[index].Execute(r,col);
    
    return result;
}

var Infragistics =
{
    Win:
    {
        UltraWinDock: {},
        UltraWinEditors: {},
        UltraWinGrid: {},
        UltraWinToolbars: {},
        UltraWinTree: {},
        UltraWinChart: {},
        UltraWinMaskedEdit: {},
        UltraWinSchedule:
        {
            MonthViewMulti: {}
        },
        UltraStatusBar: {},
        UltraWinGauge: {}
    },
    WebUI:
    {
        WebSchedule: {},
        UltraWebGauge:{}
    }
}
var System=
{
    Collections:
    {
        Specialized:{}
    },
    ComponentModel:{},
    Data:
    {
        SqlTypes:{}
    },
    Diagnostics:{},
    Drawing:
    {
        Printing:{}
    },
    Globalization:{},
    IO:{},
    Reflection:{},
    Runtime:
    {
        Remoting:
        {
            Messaging:{}
        }
    },
    Text:
    {
        RegularExpressions:{}
    },
    Windows:
    {
        Forms:
        {
            "Control":{}
        },
        Input:{}
    },
    Xml:{}
}

var EpiObject = System.EpiObject = function(type)
{
    this._type = type;
    this._win = window;
    this._events = {};
    if (!this._assembly) this._assembly = "UI.EpiClientLib"; //default
    if (!this._impl) this._impl = [];
}
EpiObject.prototype.get_Event=function(eventName)
{
    if (!this._events[eventName]) this._events[eventName] = new EpiEvent(eventName, this);
    return this._events[eventName];
}
EpiObject.prototype.ClearAllEventListeners = function()
{
    for (eventName in this._events)
    {
        this._events[eventName].unsubscribeAll();
        this._events[eventName] = null;
    }
    this._events = [];
}
EpiObject.prototype.ctor=function(){} // trans issue
EpiObject.prototype.Dispose=function()
{
    this.ClearAllEventListeners();
    this._win = null;
} 
EpiObject.prototype.GetType=function()
{
    var t = new System.Type();
    t.Name = this._type;
    
    if(this._assembly) 
        t.Assembly = Global.Assemblies[this._assembly];        
    
    return t;
}
EpiObject.prototype.Equals=function(obj)
{
    if(obj==this)
        return true;
    else
        return false;
}
EpiObject.ReferenceEquals=function(val1,val2)
{
    return (val1==val2);
}
EpiObject.prototype.PopStatus=function()
{
    try {Global.SetStatus("");} catch(e){}
}

// ----------  System
var ISupportInitialize=System.ComponentModel.ISupportInitialize=function(){}
ISupportInitialize.prototype.BeginInit=function(){}
ISupportInitialize.prototype.EndInit=function(){}

var Attribute=System.Attribute=function(){}

var Component = System.ComponentModel.Component = function(){}
Component.prototype.get_DesignMode=function(){return false;}

var MarshalByValueComponent = System.ComponentModel.MarshalByValueComponent = function(){}
MarshalByValueComponent.prototype.Dispose=function(){}

var CancelEventArgs=System.ComponentModel.CancelEventArgs=function(val)
{
    this.Cancel = false;
    if(val && Global.IsBoolean(val)) this.Cancel = val;
}

var ProcessArgs = function ()
{}
ProcessArgs.prototype=new EpiObject();

var Exception = System.Exception = function(msg, innerException)
{
    EpiObject.call(this,"Exception");
    
    if (!msg) msg ="";
    if (!innerException) innerException = null;
    
    this.Message = msg
    this.InnerException = innerException;
}
Exception.prototype=new EpiObject();
Exception.prototype.GetBaseException=function()
{
    if (this.InnerException == null)
        return this;
    else
        return this.InnerException.GetBaseException();
}

var SystemException = System.SystemException=function(msg, innerException)
{
    Exception.call(this, msg, innerException);
}
SystemException.prototype = new Exception();

var ApplicationException = System.ApplicationException = function(msg, innerException)
{
    Exception.call(this, msg, innerException);
}
ApplicationException.prototype = new Exception();

var StringComparison=System.StringComparison={"CurrentCulture":0,"CurrentCultureIgnoreCase":1,"InvariantCulture":2,"InvariantCultureIgnoreCase":3,"Ordinal":4,"OrdinalIgnoreCase":5};

// ----------  Epicor.Mfg.Common
var BusinessObjectException = Epicor.Mfg.Common.BusinessObjectException = function(msg, innerException) 
{
    var message = "";
    if (msg) message = msg;
 
    ApplicationException.call(this, message, innerException);
    this.BusinessObjectMessages=[];
}
BusinessObjectException.prototype = new ApplicationException();

var BusinessObjectMessage = Epicor.Mfg.Common.BusinessObjectMessage = function() 
{
    EpiObject.call(this, "BusinessObjectMessage");
    this.Method = "";
}


var DateTime = System.DateTime = function (year, month, day)
{
    EpiObject.call(this, "DateTime");
    var val;
    if (arguments.length == 0)
        val = new Date();
    else
        val = new Date(year, month - 1, day); // When apps code instantiates DateTime, they send in month in the .NET format where Jan=1 and Dec=12.

    return val;
}
DateTime.prototype = new EpiObject();
DateTime.MinValue = new Date(0001, 1, 1, 0, 0, 0,0);

DateTime.get_Now=function()
{
    return new Date();
}
DateTime.get_Today=function()
{
    return this.get_Now();
}
DateTime.DaysInMonth=function(year, month)
{
    return new Date(year, month, 0).getDate(); 
}
DateTime.TryParse=function(inVal,culture,styles)
{
    try
    {
        
        var val;
        if (culture == undefined)
            val = DateTime.Parse(inVal, new EpiOverloadedArgs("String"));
        else
            val = DateTime.Parse(inVal,culture, new EpiOverloadedArgs("String_IFormatProvider"));
            
        if(val==null) return false;
        
        Global.ArgManager["Out1"] = val;
        return true;
    }
    catch(err)
    {
        return false;
    }
}
DateTime.Parse=function()
{
   var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "String":
        default:
            result= FormatEngine.ToDate(a[0], null, false);
        break;
            
        case "String_Object":
        case "String_IFormatProvider":
            result= FormatEngine.ToDate(a[0], null, false, a[1]);
            break;
    }
    return result;
}
DateTime.prototype.GetType=function()
{
    return {"FullName":"System.DateTime","Name":"System.DateTime"};
}

var Delegate = System.Delegate = function(callbackfn, obj)
{
    EpiObject.call(this, "Delegate");
    this.subscriber = new Subscriber(callbackfn,obj,true);
    var f=this;
    
    return function() {
        try
            {
                var s = f.subscriber;  
                retVal = s.fn.apply(s.obj,arguments);
                return retVal;
            }
            catch(err)
            {
                if (Delegate.rethrowEx) throw err;
            }
    }   
     return fnc;
}

Delegate.prototype = new EpiObject();

var MethodInvoker = Delegate;

//function(callbackfn, context)
//{
//    EpiObject.call(this, "MethodInvoker");
//    this.fn = context ? callbackfn.bind(context) : callbackfn;
//}
//MethodInvoker.prototype = new EpiObject();


var Guid = System.Guid = function() 
{
    EpiObject.call(this, "Guid");
    this.guid = "";
    for(var i = 0; i < 32; i++)
        this.guid += Math.floor(Math.random() * 0xF).toString(0xF) + (i == 8 || i == 12 || i == 16 || i == 20 ? "-" : "")
}
Guid.prototype = new EpiObject();
Guid._getEmpty = function () 
{
    var newGuid = new Guid();
    newGuid.guid = "00000000-0000-0000-0000-000000000000";
    return newGuid;
}
Guid.NewGuid=function()
{
    var newGuid = new Guid();
    return newGuid;
}
Guid.prototype.ToString=function()
{
    return this.guid;
}
Guid.prototype.toString=function()
{
    return this.guid;
}
Guid.Empty = Guid._getEmpty();

var Path=System.IO.Path=
{
    "Ctr":0,
    "GetFileNameWithoutExtension":function(path)
    {
        var fileName = Path.GetFileName(path);
        return fileName.substr(0,fileName.lastIndexOf("."));
    },
    "GetFileName":function(path)
    {
        return path.substr(path.lastIndexOf("\\")+1);
    },
    "GetTempFileName":function()
    {
        return "file" + Path.Ctr++;
    },
    "GetDirectoryName":function()
    {
        return "";
    },
    "Combine": function (path1, path2)
    {
        return path1 + "\\" + path2;
    }
}
var Stream=System.IO.Stream=function()
{
    EpiObject.call(this, "Stream");
    this.stream = [];
}
Stream.prototype = new EpiObject();
Stream.prototype.Write=function(str)
{
    this.stream.push(str);
}
Stream.prototype.Read=function()
{
    return this.stream.join("");
}
var StreamWriter=System.IO.StreamWriter=function()
{
    EpiObject.call(this, "StreamWriter");
    
    this.stream = null;
    this.closed = false;

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "Stream":
        case "Stream_Encoding":
        case "Stream_Encoding_Int32":
            this.stream = a[0];
            break;
        case "String":
        case "String_Boolean":
        case "String_Boolean_Encoding":
        case "String_Boolean_Encoding_Int32":
            this.stream = new Stream();
            MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "This overload of the System.IO.StreamWriter constructor is not implemented.", new EpiOverloadedArgs("String_Details"));
            break;
    }
}
StreamWriter.prototype = new EpiObject();
StreamWriter.prototype.Close=function()
{
    this.closed = true;
}
StreamWriter.prototype.WriteLine=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String":
            if(!this.closed) this.stream.Write(a[0] + "\r\n");
            break;
        default:
            MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "This overload of the System.IO.StreamWriter.WriteLine function is not implemented.", new EpiOverloadedArgs("String_Details"));
            break;
    }
}
var StreamReader=System.IO.StreamReader=function()
{
    EpiObject.call(this, "StreamReader");
    
    this.stream = null;
    this.closed = false;

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "Stream":
        case "Stream_Encoding":
        case "Stream_Boolean": // Ignore boolean parameter
        case "Stream_Encoding_Boolean": // Ignore boolean parameter
        case "Stream_Encoding_Boolean_Int32":
            this.stream = a[0];
            break;
        case "String":
        case "String_Boolean":
        case "String_Encoding":
        case "String_Encoding_Boolean":
        case "String_Encoding_Boolean_Int32":
            this.stream = new Stream();
            MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "This overload of the System.IO.StreamWriter constructor is not implemented.", new EpiOverloadedArgs("String_Details"));
            break;
    }
}
StreamReader.prototype = new EpiObject();
StreamReader.prototype.ReadToEnd=function()
{
    if(!this.closed && this.stream && this.stream.Read) 
        return this.stream.Read();
    else 
      return "";
}
StreamReader.prototype.Close=function()
{
    this.closed = true;
}
var Threading = System.Threading = function()
{
}
Threading.ThreadStart = Delegate;

//function(fn,scope)
//{
//    this.fn = fn;
//    this.scope = scope;
//}

var ParameterizedThreadStart=System.Threading.ParameterizedThreadStart=Threading.ThreadStart;

var Thread = System.Threading.Thread = function(start)
{
    this.start = start;
}
Thread.prototype.Start=function(parameter)
{
    var me = this;
    Global.window.setTimeout(function(){Thread._start(me.start, parameter);}, 0);
}
Thread._start=function(start,param)
{
    if (param)
        start.apply(start.scope,[param]);
    else   
        start.apply(start.scope);
}
Thread.CurrentThread = {"CurrentCulture":{"LCID":"en-us"}};
Thread.CurrentThread.get_CurrentCulture=function()
{
    var cInfo = FormatEngine.CultureInfo;
    cInfo.LCID="en-us";
    return cInfo;
}

var TimeSpan=System.TimeSpan=function(hours,minutes,seconds,milliseconds)
{
    this.Hours = hours;
    this.Minutes = minutes;
    this.Seconds = seconds;
    this.Milliseconds = milliseconds;
}
TimeSpan.prototype.toString=function()
{
    var hrStr = this.Hours.toString();
    var minStr = this.Minutes.toString();
    var secStr = this.Seconds.toString();
   
    if(hrStr.length==1) hrStr = "0" + hrStr;
    if(minStr.length==1) minStr = "0" + minStr;
    if(secStr.length==1) secStr = "0" + secStr;
   
    return hrStr + ":" + minStr + ":" + secStr;   
}
TimeSpan.FromDays=function(value)
{
    return new TimeSpan(value*24,0,0,0);
}
TimeSpan.FromHours=function(value)
{
    return new TimeSpan(value,0,0,0);
}
var Type = System.Type = function()
{
    EpiObject.call(this, "Type");
    this.Name = "";
}
Type.TypeList={};
Type.GetType=function(typeStr)
{
    var t = new System.Type();
    t.Name = typeStr;
    return t; 
}
Type.Equals=function(val1,val2)
{
    if(!(Global.IsString(val1)&&val1.StartsWith("System.")))
    {
        val1=Type.Resolve(val1).Name;
    }
    if(!(Global.IsString(val2)&&val2.StartsWith("System.")))
    {
        val2=Type.Resolve(val2).Name;
    }
    return (val1==val2);
}
Type.Resolve=function(val)
{
    if(val instanceof Type) 
        return val;
    
    if (val && typeof val.GetType == 'function')
        return val.GetType();
    
    if (val && val.prototype && typeof val.prototype.GetType == 'function')
        return val.prototype.GetType();
    
    return new System.Type();
}
Type.prototype.toString=function(obj)
{

    return this.Name;
}
Type.prototype.GetInterface=function(intFace)
{
    return {};
}
Type.prototype.InvokeMember=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_BindingFlags_Binder_Object_ObjectArr": 
        case "String_BindingFlags_Binder_Object_ObjectArr_CultureInfo": 
        case "String_BindingFlags_Binder_Object_ObjectArr_ParameterModifiedArr_CultureInfo_StringArr": 
            var member = a[0];
            var targetObj = a[3];
            var bindingFlgs = a[1];
            var args = a[4];
            
            if (bindingFlgs & BindingFlags.GetField)
                return targetObj[member]; // BindingFields.GetField is set, return field
            else if (bindingFlgs & BindingFlags.SetField)
                targetObj[member] = args[0];
            else if (bindingFlgs & BindingFlags.GetProperty)
                return targetObj["get_" + member].apply(targetObj, args);
            else if (bindingFlgs & BindingFlags.SetProperty)
                targetObj["set_" + member].apply(targetObj, args);
            else if (bindingFlgs & BindingFlags.InvokeMember)
                return targetObj[member].apply(targetObj, args);
            //else if (bindingFlgs & BindingFlags.CreateInstance) // Not sure what to do here.
            
            break;
    }
}
var EventArgs = System.EventArgs = function(type) 
{
    if (!type) type = "EventArgs";
    EpiObject.call(this, type);
}
EventArgs.prototype.ctor=function(){}
var DBNull = System.DBNull = {Value:null}

var EventHandler = System.EventHandler=function(callbackMethod, obj)
{
    EpiObject.call(this, "EventHandler");
    Subscriber.call(this,callbackMethod,obj,true);
}
EventHandler.prototype= new Subscriber();

var Environment=System.Environment=function(){}
Environment.NewLine = "\n";

var StackTrace=System.Environment.StackTrace=function(){}
StackTrace.IndexOf=function()
{
    return -1;
}

var Convert= System.Convert = 
{
    ToString:function(val)
    {   
        if(val==null) return "";
        return val.toString();
    },
    ToChar:function(val)
    {   
        if(val==null) return "";
        return val.toString();
    },
    ToDouble:function(val)
    {
        return System.Convert.ToDecimal(val);
    },
    ToDecimal:function(val)
    {
       if (Global.IsNumber(val)) return val;
    
       if (Global.IsString(val))
        {
            try
            {
                var fVal = parseFloat(val);
                return fVal;        
            }
            catch(e)
            {
                throw new FormatException(e.description);// Throw exception because its invalid
            }
        }
    },
    ToInt16:function(val) {return Convert.ToInt32(val);},
    ToInt64:function(val) {return Convert.ToInt32(val);},
    ToInt32:function(val)
    {
        if (Global.IsNumber(val)) return val;
        
        if (Global.IsString(val))
        {
            if (val == "") throw new FormatException("String is null");// Throw exception because its invalid
        
            try
            {
                var intVal = parseInt(val);
                if (isNaN(intVal)) 
                    throw new FormatException("String is not an integer");// Throw exception because its invalid
                
                return intVal;        
            }
            catch(e)
            {
                throw new FormatException(e.description);// Throw exception because its invalid
            }
        }
    },
    ToBoolean:function(val, silent) 
    {
        if (Global.IsString(val))
        {
            val = val.toLowerCase().Trim();
            if (val == "true")
                return true;
            else if (val == "false")
                return false;
            else if (silent)
                return false;
            else
                throw new FormatException("Invalid string format");// Throw exception because its invalid
        }
        else 
        {
            // Comparison of this type should be used here, because
            // 'true == null' => false and 'false == null' => false
            return val==true;
        }
    },
    ToDateTime:function(val)
    {
        if(val==null)
        {
            val = "1900-01-01T00:00:00";    
        }
            
        if(Global.IsDate(val)) return val;
    
        if(Global.IsString(val))
        {
            var dt = FormatEngine.ToDate(val, "global");
            if(!dt || isNaN(dt)) dt = FormatEngine.ToDate(val);
            return dt;
        }
    },
    IsDBNull:function(val)
    {
        return val==null;
    },
    ToArrayList:function(arr)
    {
        var al=new ArrayList();
        if (arr.TypeName == "ArrayList")
            al.AddRange(arr.items);        
        else
            al.AddRange(arr);
        return al;        
    },
    ToArray:function(arr)
    {
        // Some code does typecasting to arrays when it's already an array.
        return arr;
    }
};

var ArgumentOutOfRangeException = System.ArgumentOutOfRangeException = ArgumentNullException = System.ArgumentNullException = ArgumentException = System.ArgumentException = function(msg, paramName)
{
    EpiObject.call(this, "ArgumentOutOfRangeException");
    this.message=msg;
    this.Message = msg;
    if (paramName)
       this.ParamName = paramName;
}

var FormatException = System.FormatException = function(msg)
{
    EpiObject.call(this, "FormatException");
    this.message=msg;
    this.Message = msg;
}
// ----------- System.Data
var DataViewRowState = System.Data.DataViewRowState = {"Added":0,"CurrentRows":1,"Deleted":2,"ModifiedCurrent":3,"ModifiedOriginal":4,"None":5,"OriginalRows":6,"Unchanged":7}

// ----------- System.Data.SqlTypes
var SqlDateTime = System.Data.SqlTypes.SqlDateTime = {"Null":null};

// ----------- System.Diagnostics
var Debug = System.Diagnostics.Debug = function(){}
Debug.WriteLine=function(){}
Debug.Flush=function(){}

var Process = System.Diagnostics.Process = function() {}
Process.GetCurrentProcess=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The System.Diagnostics.Process is not implemented.", new EpiOverloadedArgs("String_Details"));
    return {"Handle":""}
}

// ----------- System.Drawing
var PrintDocument = System.Drawing.Printing.PrintDocument = function()
{
    return {"PrinterSettings":{"PrinterName":"<not supported>"}};
}
var PageSettings = System.Drawing.Printing.PageSettings = function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The System.Drawing.Printing.PageSettings object is not implemented.", new EpiOverloadedArgs("String_Details"));
}

var Font=System.Drawing.Font=function(){}
var Size = System.Drawing.Size = function(width,height)
{
    EpiObject.call(this, "Size");
    this.Width = width;
    this.Height = height;    
}
var Image= System.Drawing.Image = function(name, fullPath)
{
    EpiObject.call(this, "Image");
    this.IsDisabledImage = false;
    this.Name = name;
    this.Path = fullPath;
    this.Pos = {"Top":0,"Left":0};
}
var Point = System.Drawing.Point = function()
{
    this.X = null;
    this.Y = null;

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "Int32":
            // not yet supported.
            break;
        case "Size":
            // not yet supported.
            break;
        case "Int32_Int32":
            this.X = a[0];
            this.Y = a[1];
            break;
    }
}

var Color = System.Drawing.Color =
{
    Red: '#F00',
    Green: '#0F0',
    Yellow: '#FF0',
    Blue: '#00F',
    Black: '#000',
    White: '#FFF',
    ForestGreen:'#228B22',
    MediumBlue:'#3232CD',
    LightGrey:'#D3D3D3',
    PaleGoldenrod:'#EEE8AA'           
}
var ContentAlignment = System.Drawing.ContentAlignment = {"TopLeft":1,"TopCenter":2,"TopRight":4,"MiddleLeft":16,"MiddleCenter":32,"MiddleRight":64,"BottomLeft":256,"BottomCenter":512,"BottomRight":1024};

var Graphics = System.Drawing.Graphics = function(){}

Graphics.FromHwnd=function(hndl)
{   
    return  new Graphics();
}
Graphics.prototype.MeasureString=function(text,font)
{
     var lbl = Global.document.createElement("label");
     Global.document.body.appendChild(lbl);
     lbl.innerHTML = text;
     var lblWidth = lbl.offsetWidth;
     Global.document.body.removeChild(lbl);
     return {"Width":lblWidth}; // 9 is the font point set in the styles for the EpiLabel font
}

var SystemColors = System.Drawing.SystemColors={"WindowText":{}}; // TODO

// ----------- System.Globalization
var DayOfWeek = System.Globalization.DayOfWeek = System.DayOfWeek= {"Sunday":0,"Monday":1,"Tuesday":2,"Wednesday":3,"Thursday":4,"Friday":5,"Saturday":6}
var CalendarWeekRule = System.Globalization.CalendarWeekRule = {"FirstDay":1,"FirstFourDayWeek":2,"FirstFullWeek":3}
var DateTimeStyles = System.Globalization.DateTimeStyles={"None":0,"AllowLeadingWhite":1,"AllowTrailingWhite":2,"AllowInnerWhite":4,"AllowWhiteSpaces":7,"NoCurrentDateDefault":8,"AdjustToUniversal":16,"AssumeLocal":32,"AssumeUniversal":64,"RoundtripKind":128}

var GregorianCalendar = System.Globalization.GregorianCalendar = function ()
{
    EpiObject.call(this, "GregorianCalendar");
}
GregorianCalendar.prototype.GetWeekOfYear=function(time, rule, firstDayOfWeek)
{
    // TODO 
    return 1;  
}

var Calendar = System.Globalization.Calendar = function ()
{
    EpiObject.call(this, "Calendar");
}
Calendar.prototype = new EpiObject();
Calendar.prototype.GetDaysInMonth=function(iYear, iMonth)
{
    return 32 - new Date(iYear, iMonth-1, 32).getDate();
}
var Cultures = System.Globalization.Cultures = {};
var CultureInfo = System.Globalization.CultureInfo = function(localeStr)
{
    localeStr = localeStr.toLowerCase();
    if(Globalization.Cultures[localeStr]) return Globalization.Cultures[localeStr];

    var results = doVantageSoapCall('lib_CultureInfoService','GetCultureInfo(4)',['localeStr'],[],[localeStr]);
    if (results)
    {
        var ci = JSON.parse(results);
        ci.DateTimeFormat = {"ShortDatePattern":ci.ShortDatePattern,"ShortTimePattern":ci.ShortTimePattern,"DateSeparator":"/"};  // for tasklib
        ci.Calendar = new Calendar();
        Globalization.Cultures[localeStr] = ci;
        return ci;
    }
}
CultureInfo.GetCultures=function(types){return [];} // TODO: would need to be a server call to get the requested cultures.
CultureInfo.get_CurrentCulture=function(){return FormatEngine.CultureInfo;}

var NumberFormatInfo = System.Globalization.NumberFormatInfo = function(){}
NumberFormatInfo.get_CurrentInfo=function()
{
    return FormatEngine.CultureInfo;
}
var DateTimeFormatInfo = System.Globalization.DateTimeFormatInfo = function(){}

// ------------ System.Collections
//First-In First-Out (FIFO) 
var Queue= System.Collections.Queue = function(collection)
{
    EpiObject.call(this, "Queue");
    this.items=[]; 
    this.Count = 0;
    
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "":
        case "Int32":
        case "Int32_Single":
            break;
        case "ICollection":
            collection=a[0];
            if (collection)
            {
                var iEnum = collection.GetEnumerator();
                while (iEnum.MoveNext())
                {
                    this.Enqueue(iEnum.Current);
                }
            }
            break;
    }
}
Queue.prototype.GetEnumerator=function()
{
    return new Enumerator(this);
}
Queue.prototype.Clear=function()
{
    this.items = [];
    this.Count = 0;
}
Queue.prototype.Enqueue=function(itm)
{
    this.items.push(itm);
    this.Count++;
}
Queue.prototype.Dequeue=function()
{
    var val = this.items.shift();
    this.Count--;
    return val;
}

var Stack = System.Collections.Stack = function()
{
    EpiObject.call(this, "Stack");
    this.items=[]; 
    this.Count = 0;
}
Stack.prototype.GetEnumerator=function()
{
    return new Enumerator(this);
}
Stack.prototype.Clear=function()
{
    this.items = [];
    this.Count = 0;
}
Stack.prototype.Push=function(itm)
{
    this.items.unshift(itm);
    this.Count++;
}
Stack.prototype.Pop=function()
{
    var val = this.items[0];
    this.items.splice(0, 1);
    this.Count--;
    
    return val;
}
var Hashtable = System.Collections.Hashtable = function(type)
{
    if (!type || !(typeof type == 'string')) type = "Hashtable";
    EpiObject.call(this,type);
    this.items = {};
    this.hashCodes = []; // Maintains hashcodes for the keys (index in the array if they are objects).
    this.isDictionary = true;
    this.Count = 0;
}
Hashtable.prototype = new EpiObject();

// Returns the hashcode for the object key, which is really just its position in the hashCodes array (might change if elements are deleted from the ht).
Hashtable.prototype._getHCodeForKey=function(key)
{
    if (this.hashCodes.length > 0) // will be filled only if the keys are objects
    {
        for (var i=0,keyObj; keyObj=this.hashCodes[i]; i++)
        {
            if (keyObj == key)
                return i;
        }
        return null; // didnt find key in hashcodes
    }
    return key;
}
Hashtable.prototype.Clone=function()
{
    var ht = new Hashtable();
    for(var key in this.items)
    {
        ht.Add(key,this.items[key]);
    }
    return ht;
}
Hashtable.prototype.Get=function(key)
{
    key = this._getHCodeForKey(key);
    if(key==null || !this.items[key] || this.items[key]==null) return null;
    return this.items[key].toString();
}
Hashtable.prototype.TryGetValue=function(key,value)
{
    var retVal = true;
    key = this._getHCodeForKey(key);
    var val = null;
    if (key!= null) val = this.items[key];
    if(val==null)
    {
        retVal = false;
        if(value!=null && Global.IsBoolean(value))
            val = false;
        else if(value!=null && Global.IsArray(value))
            val = [];
        else 
            val = null;
    }
    
    Global.ArgManager["Out1"] = val;
    return retVal;
}
Hashtable.prototype.GetEnumerator=function()
{
    return new Enumerator(this);
}
Hashtable.prototype.Clear=function()
{
    if(this.hashCodes.length > 0)
    {
        // Have to do it this way because Remove does a splice on the hashCodes array, so indices will change as we iterate
        var keyObj=this.hashCodes[0];
        while(keyObj)
        {
            this.Remove(keyObj);
            keyObj=this.hashCodes[0];
        }
    }
    else
    {
        for(var itm in this.items)
        {
            this.Remove(itm);
        }
    }
    this.items = {};
    this.Count = 0;
    this.hashCodes=[];
}
Hashtable.prototype.Contains=function(key) {return this.ContainsKey(key);}
Hashtable.prototype.get_ItemPair=function(key)
{
    var obj={"Key":key,"Value":null};
    if(this.items[key])
    {
        obj.Value=this.items[key];
    }
    return obj;
}
Hashtable.prototype.get_Item=function(key)
{
    if (Global.IsString(key))
    {
        if(!this.items[key])
        {
            var lKey = key.toLowerCase();
            for(var k in this.items)
            {
                if(k.toLowerCase()==lKey)
                {
                    key = k;
                    break;
                }
            }
        }
    
       return this.items[key];
    }
    else 
    {
        key = this._getHCodeForKey(key);
        if (key!=null)
        {
            if (this.items[key] == null && Global.IsNumber(key))
            {
                // This is used by DataTable.get_Columns, which returns the columns list as a hashtable and columns can be accessed
                // using the index in that.
                var indx = 0;
                var item;
                for(var k in this.items)
                {
                    item = this.items[k];
                    if (indx == key) return item;
                    else indx++;
                }
            }
            else
                return this.items[key];
        }
    }
    return null;
}
Hashtable.prototype.set_Item=function(key, value)
{
    if (key == null)
        throw new ArgumentNullException("Key cannot be null","key"); // EpiString.GetString("ArgumentNull_Key")
    
    // If key is missing, add it. Else overwrite existing item
    if (!this.ContainsKey(key))
        this.Add(key,value);
    else
    {
       key = this._getHCodeForKey(key);
       this.items[key] = value;
       if (this.hashCodes.length ==0)
         this[key] = value;
   }
   return value;
}
Hashtable.prototype.IndexOf=function(key)
{
    var indx = 0;
    var fnd = false;
    
    key = this._getHCodeForKey(key);
    if (key == null) return -1;
    
    for(var itm in this.items)
    {
        if (itm == key) 
        {
            fnd = true;
            break;
        }
        indx++;
    }
    if (!fnd) return -1;
    else
        return indx;
}
Hashtable.prototype.ContainsKey=function(key)
{
    key = this._getHCodeForKey(key);

    if (key != null && (this.items[key]!=null || this.hashCodes.length > 0))
        return true;
    else
        return false;
}
Hashtable.prototype.ContainsValue=function(val)
{
    for(var itm in this.items)
    {
        if(val==this.items[itm]) return true;
    }
    return false;
}
Hashtable.prototype.Add=function(key, value)
{
    if (key == null || this.ContainsKey(key))
        return;
    
    // Code calling this method may not have a catch, cannot throw an exception
//    if (key == null)
//        throw new ArgumentNullException("Key cannot be null","key"); //  EpiString.GetString("ArgumentNull_Key")
//      
//    if (this.ContainsKey(key)) // Add should not overwrite existing items.
//        throw new ArgumentException("Item has already been added. Key in dictionary: '" + key.toString() + "'. Key being added: ' " + key.toString() +"'",key) // EpiString.GetStringFmt("Argument_AddingDuplicate__",key.toString(), new EpiOverloadedArgs("global.messages.ewa")) 

   if (Global.IsObject(key)) 
   {
       var len = this.hashCodes.push(key); // only if it doesnt already exist
       this.items[len-1] = value; // Store the value keyed by the index of key in the hashCodes (HashCode). In this mode, this[key] or this.items[key] will not work directly (where key is the object).
   }
   else
   {
       this[key] = value;
       this.items[key] = value;
   }
   this.Count++;

   this.get_Event("ItemAdded").fire({Key:key,Value:value}); 
}
Hashtable.prototype.Remove=function(key)
{
    key = this._getHCodeForKey(key);
    if (key == null) return;
    
    var value = this.items[key];    

    delete this.items[key];
    
    if (this.hashCodes.length == 0)
        delete this[key];
    else
        this.hashCodes.splice(key, 1);
        
    this.Count--;
    
    this.get_Event("ItemRemoved").fire({Key:key,Value:value});
}
Hashtable.prototype.get_Keys=function()
{
    var keys = new ArrayList();
    
    if(this.hashCodes.length > 0)
    {
        for (var i=0,keyObj; keyObj=this.hashCodes[i]; i++)
            keys.Add(keyObj);
    }
    else
    {
        for(var itm in this.items)
            keys.Add(itm);
    }
    return keys;
}
Hashtable.prototype.get_Values=function()
{
    var values = new ArrayList();

    for(var itm in this.items)
    {
        values.Add(this.items[itm]);
    }
    return values;
}
Hashtable.prototype.get_Count=function()
{
    return this.Count;
}
Hashtable.prototype.Insert=function(idx, key, val)
{
    var keys = this.get_Keys().items;
    var vals = this.get_Values().items;
    
    keys.splice(idx, 0, key);
    vals.splice(idx, 0, val);
    
    this.Fill(keys, vals);
 
}
Hashtable.prototype.AddList=function(list)
{
    if (!list) return;
    for(var key in list) this.Add(key,list[key]);
}
Hashtable.prototype.Fill=function(keys, vals)
{
    if(keys.length!=vals.length) return;
    
	this.Clear();
	
	var keyList = keys;
	var valList = vals;
	if(keys instanceof ArrayList) keyList = keys.items;
    if(vals instanceof ArrayList) valList = vals.items;
	
	for(var i = 0; i<keyList.length; i++)
	{
		if(valList[i] == null) valList[i] = "-Not Found-";
		if((keyList[i] != "") && (valList[i] != ""))
		{
			try
			{
				if(!this.ContainsKey(keyList[i]))
				{
					this.Add(keyList[i], valList[i]);
				}
				else
				{
					this.Clear();
					break;
				}
			}
			catch(ArgumentException)
			{
				this.Clear();
				break;
			}
		}
	}
}
Hashtable.prototype.KeyOf=function(val)
{
    if(this.hashCodes.length > 0)
    {
        for (var i=0,keyObj; keyObj=this.hashCodes[i]; i++)
            if(val==this.items[keyObj]) return keyObj;
    }
    else
    {
        for(var itm in this.items)
        {
            if(val==this.items[itm]) return itm;
        }
    }
    return null;
}
Hashtable.prototype.Exists=function(key)
{
    // issues when val is null, so doing it the hard way
    if(this.hashCodes.length > 0)
    {
        for (var i=0,keyObj; keyObj=this.hashCodes[i]; i++)
            if(keyObj==key) return true;
    }
    else
    {
        return typeof (this.items[key]) != "undefined";
    }
    return false;
}
var ArrayList = System.Collections.ArrayList = function(typeOrItems)
{
    var t = "ArrayList";
    if (typeof typeOrItems == 'string')
       t = typeOrItems;
   
    EpiObject.call(this, t);
    this.items = [];
    
    this.Count = 0;
    this.isDictionary = false;
   
    if (typeOrItems!= undefined && Global.IsArray(typeOrItems)) this.AddRange(typeOrItems);
}
ArrayList.prototype = new EpiObject();
ArrayList.prototype.TypeName="ArrayList";
ArrayList.prototype.get_Count=function(){return this.Count;}

ArrayList.prototype.GetEnumerator=function()
{
    return new Enumerator(this);
}
ArrayList.prototype.Clear=function()
{
    while(this.items.length > 0)
    {
        this.Remove(this.items[this.items.length-1]);
    }
    this.Count = 0;
}
ArrayList.prototype.Add = function(item)
{
    this.items.push(item);
    this[this.items.length-1] = item;
    this.Count++;
           
    this.get_Event("ItemAdded").fire({"Index":this.items.length-1, "Value":item}); 
}
ArrayList.prototype.AddRange = function(array)
{
    for(var itm in array)
    {
        this.items.push(array[itm]);
        this[this.items.length-1] = array[itm];
    }
    this.Count = this.items.length;
}
ArrayList.prototype.Contains = function(val)
{
    for(var itm in this.items)
    {
        if(this.items[itm]==val) return true;
    } 
    return false;
}
ArrayList.prototype.RemoveAt=function(idx)
{
    var value = this[idx];    
    
    this.items.splice(idx, 1);
    
    this.Count = this.items.length;

    this._refresh();      

    this.get_Event("ItemRemoved").fire({"Index":idx,"Value":value});
}
ArrayList.prototype.Remove=function(val)
{
    var flg = false;
    
    for(var itm in this.items)
    {
        if(this.items[itm]==val) 
        {
            this.items.splice(itm, 1);
            delete this[itm];

            flg = true;
            
            break;
        }
    }   
        
    this.Count = this.items.length;    
    
    if(flg)
    {
        this._refresh();
        this.get_Event("ItemRemoved").fire({"Index":itm,"Value":val});
    }
}
ArrayList.prototype.IndexOf=function(val)
{
    for(var ii=0; ii<=this.items.length; ii++)
    {
        if(this.items[ii]==val) return ii;
    }
    return -1;
}
ArrayList.prototype.Insert=function(newIdx,val)
{
    this.items.splice(newIdx, 0, val);
    this.get_Event("ItemAdded").fire({"Index":newIdx, "Value":val}); 
    
    this._refresh();
}
ArrayList.prototype._refresh=function()
{
    for(var itm in this.items)
    {
        this[itm] = this.items[itm];
    }
    
    if(this[++itm]) delete this[itm];
}
ArrayList.prototype.ToArray=function()
{
    return this.items;
}
ArrayList.prototype.set_Sort=function(columnName)
{
    //  AD.PO.POEntrySearchForm.js 
    //  Ex this: ((DataView)cmbBuyer.DataSource).Sort = "Name";
    //  Is translated to this: (Convert.ToArrayList(this.FindControl("cmbBuyer").get_DataSource())).set_Sort("Name");
    //  And causes JS exceptions
	this.Sort();
}
ArrayList.prototype.Sort=function(f)
{
    var arr = [];
    for(var itm in this.items)
    {
        arr.push(this.items[itm]);
    }
    
    if(f)
        arr.sort(f);
    else
        arr.sort();
        
    this.Clear();
    this.AddRange(arr);    
}
ArrayList.prototype.CopyTo=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    var target = null;
    var start = 0, cnt = this.items.length;
    var spliceStart = null;
    switch(overload)
    {
        case "Array":
            target = a[0];
            break;
        case "Array_Int32":
        case "UltraGridRowArr_Int32":
            target = a[0];
            spliceStart = a[1];
            break;
        case "Int32_Array_Int32_Int32":
            start = a[0];
            target = a[1];
            spliceStart = a[2];
            cnt = a[3]+1;
            break;
    }
    
    for(var ii=start; ii<=cnt-1; ii++)
    {
        if(spliceStart==null)
            target.push(this.items[ii]);
        else
            target.splice(spliceStart++, 0, this.items[ii]);
    }
}

var HybridDictionary = System.Collections.Specialized.HybridDictionary = function()
{
    Hashtable.call(this, "HybridDictionary");
}
HybridDictionary.prototype = new Hashtable();

var SortedList = System.Collections.SortedList = function ()
{
    Hashtable.call(this, "SortedList");
} 
SortedList.prototype = new Hashtable();

SortedList.prototype.Add=function(key,val)
{
    // As each item is added it needs to be inserted at the right sort position (sort using key)
    var i = 0;
    for(var itm in this.items)
    {
        if (key <= this.items[itm])
        {
            this.Insert(i,key,val);
            return;
        }
        i++;
    }
    Hashtable.prototype.Add.call(this,key,val);
}
SortedList.prototype.GetByIndex=function(indx)
{
    var i = 0;
    for(var itm in this.items)
    {
        if (i == indx) 
            return this.items[itm];
        i++;
    }
    // reached here means the index is invalid
    throw new ArgumentOutOfRangeException("Index is outside the range of valid indexes for the SortedList object.");
    
}
SortedList.prototype.IndexOfValue=function(val)
{
    var indx = 0;
    var fnd = false;
    for(var itm in this.items)
    {
        if (this.items[itm] == val) 
        {
            fnd = true;
            break;
        }
        indx++;
    }
    if (!fnd) return -1;
    else
        return indx;
}
// ----------  System.Collections.Specialized
var StringCollection = System.Collections.Specialized.StringCollections = function()
{
    ArrayList.call(this,"StringCollection");
}
StringCollection.prototype = new ArrayList();

//-----------  System.Enum
var Enum = System.Enum = function()
{
    EpiObject.call(this, "Enum");
}
Enum.prototype = new EpiObject();
Enum.Equals = function(val1, val2)
{
    return val1==val2;
}
Enum.ToString = function(val, enumerator)
{
    if(enumerator)
    {
        for(var itm in enumerator)
        {
            if(enumerator[itm]==val)
            {
                return itm;
            }
        }
    }

    return val.toString();
}
Enum.GetType = function(typeObj, typeStr)
{
    return typeStr;
}
Enum.Parse = function(enumerator, enumKey, ignoreCase)
{
    if(enumerator)
    {
        for(var itm in enumerator)
        {
            if((!ignoreCase && (itm==enumKey))|| 
            (ignoreCase && (itm.toString().toLowerCase() == enumKey.toString().toLowerCase()))            )
            {
                return enumerator[itm];
            }
        }
    }

    return null;
}

// ----------  System.Runtime.Remoting.Messaging
var CallContext = System.Runtime.Remoting.Messaging.CallContext = function()
{
}
CallContext.GetData=function(name)
{
    return null;
}

//-----------   System.Text.RegularExpressions
var Match = System.Text.RegularExpressions.Match=function()
{
    EpiObject.call(this, "Match");
    this.Groups = [];
    this.Success = false;
    this.Index=0;
}
Match.prototype = new EpiObject();
Match.prototype.toString=function()
{
    if(this.Groups.length>0)
        return this.Groups[0];
    else
        return "";
}

var RegexOptions = System.Text.RegularExpressions.RegexOptions = {"Compiled":0,"CultureInvariant":1,
    "ECMAScript":2,"ExplicitCapture":3,"IgnoreCase":4,"IgnorePatternWhitespace":5,"Multiline":6,"None":7,
    "RightToLeft":7,"Singleline":8}  // Only IgnoreCase used now

var Regex = System.Text.RegularExpressions.Regex = function(pattern,options)
{
    EpiObject.call(this, "Regex");
    
    pattern = pattern.Replace("\\\\","\\");

    options = (options && !(options instanceof EpiOverloadedArgs)) ? options : RegexOptions.None;
    
    var optFlag = "g";
    if(options==RegexOptions.IgnoreCase) optFlag += "i";
    else if(options==RegexOptions.Multiline) optFlag += "m";
    
    this.re = new RegExp(pattern,optFlag);
}
Regex.prototype = new EpiObject();
Regex.prototype.Match=function(input,beginning,length) // beginning and length are both optional
{
    var m = new Match();
    var arr = this.re.exec(input,"g");
    if(arr!=null && arr.length > 0)
    {
        for(var a in arr)
        {
            if(a!="input" && a!="index" && a!="lastIndex")
                m.Groups.push(arr[a]);
        }   
        m.Success = true;
    }
    else
    {
        m.Success = false;
    }
    return m;
}
Regex.prototype.Matches=function(input,beginning,length) // beginning and length are both optional
{
    var returnVal = [];
    var idx= 0;
    var arr = input.match(this.re);
    if(arr!=null && arr.length > 0)
    {
        for(var a in arr)
        {
            if(a!="input" && a!="index" && a!="lastIndex")
            {
                var match = new Match();
                match.Groups.push(arr[a]);
                match.Index = idx++;
                match.Success=true;
                match.Length=arr[a].length;
                match.Value=arr[a];
                returnVal.push(match);
            }
        }   
    }
    return returnVal;
}
Regex.prototype.IsMatch=function(input,startat) // startat is optional
{
    var m = this.Match(input);
    return m.Success;
}
Regex.prototype.Replace=function() // startat is optional
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_String": 
        case "String_String_Int32": 
        case "String_String_Int32_Int32": 
            return a[0].replace(this.re,a[1]);
            break;
        case "String_MatchEvaluator": 
        case "String_MatchEvaluator_Int32": 
        case "String_MatchEvaluator_Int32_Int32": 
            MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "This overload of the System.Test.RegularExpressions.Regex.Replace function is not implemented.", new EpiOverloadedArgs("String_Details"));
            break;
    }
}
Regex.prototype.Split=function(input,count,startat) // count and startat are optional
{
    return input.split(this.re);
}
Regex.Match=function(input,pattern,options) // options is optional
{
    var re = new Regex(pattern,options);
    return re.Match(input);
}
Regex.Matches=function(input,pattern,options)
{
    var re = new Regex(pattern,options);
    return re.Matches(input);
}
Regex.IsMatch=function(input,pattern,options) // options is optional
{
    var re = new Regex(pattern,options);
    return re.IsMatch(input);
}
Regex.Replace=function() // options is optional
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_String_String": // input, pattern, replacement
            var re = new Regex(a[1]);
            return re.Replace(a[0],a[2], new EpiOverloadedArgs("String_String"));
            break;
        case "String_String_String_RegexOptions": 
            var re = new Regex(a[1],a[3]);
            return re.Replace(a[0],a[2], new EpiOverloadedArgs("String_String"));
            break;
        case "String_String_MatchEvaluator": 
        case "String_String_MatchEvaluator_RegexOptions": 
            MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "This overload of the System.Test.RegularExpressions.Regex.Replace function is not implemented.", new EpiOverloadedArgs("String_Details"));
            break;
    }
}
Regex.Split=function(input,pattern,options) // options is optional
{
    var re = new Regex(pattern,options);
    return re.Split(input);
}

var StringBuilder = System.Text.StringBuilder = function()
{
    EpiObject.call(this, "StringBuilder");
    this._strings = new Array("");
    
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "":
        case "Int32":
        case "Int32_Int32":
        default:
            break;
        case "String":
        case "String_Int32":
        this.Append(a[0]);
        break;
        case "String_Int32_Int32_Int32":
        this.Append(a[0].Substring(a[1],a[2]));
        break;
    }
}
StringBuilder.prototype.Append = function (value)
{
    if (value) this._strings.push(value);
    return this;
}
StringBuilder.prototype.AppendLine=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String":
            this._strings.push(a[0]);
            this._strings.push("\r\n");
            break;
        default:
            this._strings.push("\r\n");
            break;
    }
    return this;
}
StringBuilder.prototype.get_Length=function()
{
    return this._strings.join("").length;
}
StringBuilder.prototype.set_Length=function(val)
{
    this._strings.length=val;
}
StringBuilder.prototype.AppendFormat=function()
{
    var a = arguments;
    var argList = "";
    for(var ii=1;ii<=a.length-1;ii++)
    {
        if (a[ii] instanceof EpiOverloadedArgs) continue; 
        argList = argList + ",a[" + ii + "]";
    }
    
    var str = a[0];
    if(argList!="")
    {
        str = eval("String.Format(\"" + str + "\"" + argList + ")");
    }
    return this.Append(str);
}
StringBuilder.prototype.Clear = function ()
{
    this._strings.length = 1;
}
StringBuilder.prototype.toString = function ()
{
    return this.ToString();
}
StringBuilder.prototype.ToString = function (start, len)
{
    var retVal = this._strings.join("");
    if (start >=0 && len > 0)
    {
        retVal = retVal.substr(start, len);
    } 
    return retVal;
}
StringBuilder.prototype.Remove=function(startIndex,length)
{
    var str = this.ToString();
    str = str.Remove(startIndex,length);
    
    this.Clear();
    this.Append(str);
    
    return this;
}
StringBuilder.prototype.Replace = function ()
{
    // To support this, we'll merge all the strings, do the replace and put it back into the array as one string.
    
    var myString = this.ToString();
    
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "Char_Char":
         case "String_String":
            myString = myString.Replace(a[0],a[1]);
            break;
        case "Char_Char_Int32_Int32":
        case "String_String_Int32_Int32":
            var leftStr = myString.substring(0, a[2]);
            var rightStr = myString.substring(a[2] + a[3]);
            var subStr = myString.substr(a[2],a[3]);
            subStr = subStr.Replace(a[0],a[1]);
            myString= leftStr + subStr + rightStr;
            break;
    }
    this.Clear();
    return this.Append(myString);
}

// ----------- System.Windows
var DragDropEffects = System.Windows.DragDropEffects = {"All":0,"Copy":1,"Link":2,"Move":3,"None":4,"Scroll":5};

var DataFormats = System.Windows.DataFormats = {"FileDrop":"FileDrop"};  // many more
var WindowState = System.Windows.WindowState = {"Normal":0,"Minimized":1,"Maximized":2};
var AnchorStyles = System.Windows.Forms.AnchorStyles = {"None":0,"Top":1,"Bottom":2,"Left":4,"Right":8};
var FormWindowState = System.Windows.Forms.FormWindowState = {"Normal":0,"Minimized":1,"Maximized":2};
var DockStyle = System.Windows.Forms.DockStyle = {"None":"None","Top":"Top","Bottom":"Bottom","Left":"Left","Right":"Right","Fill":"Fill"};
var CharacterCasing = System.Windows.Forms.CharacterCasing = {"Normal":0}; // TODO
var Keys = System.Windows.Forms.Keys = {"Escape":27};
// ----------- System.Windows.Forms

var Screen = System.Windows.Forms.Screen=
{
    "PrimaryScreen":{"get_Bounds":function(){return Screen.get_Bounds();}},
    "get_Bounds": function()
    { 
        if (Global.Form) return {"Width": Global.Form.get_Width(), "Height": Global.Form.get_Height()};
        else return {"Width": 0, "Height": 0};
    }
}

var ControlCollection = System.Windows.Forms.Control.ControlCollection=function()
{
    ArrayList.call(this,"ControlCollection");
}
ControlCollection.prototype = new ArrayList();


ControlCollection.prototype.Add=function(control)
{
    if (!this.tabIndxList) this.tabIndxList = [];
    var tIndx = control.get_TabIndex();
    if (tIndx) 
    {
        this.tabIndxList.push([tIndx,control.ID]);
        this.tabIndxList.sort(); // Maintain a sorted list of tabindex vs control id. used by GetNextControl.
    }
        
    ArrayList.prototype.Add.call(this, control); // add to the collection
}
ControlCollection.prototype.Remove=function(control)
{
    // Since this is a list of controls we also need to clean up the control that is removed
    var ctrl = Global.document.getElementById(control.ID);

    if (ctrl) 
    {
        if (this.tabIndxList.length > 0)
        {
            for (var i=0, rec; rec=this.tabIndxList[i]; i++) 
            {
                if (rec[1] == ctrl.id)
                {
                    this.tabIndxList.splice(i, 1);
                    break;
                }
            }
        }
         
        // Unregister binding for this control
        if (control.DataView && control.DataColumn)
        {
            var dv = Global.BindingEngine.EpiDataViews[control.DataView];
            if (dv)
                Global.BindingEngine.UnRegisterBinding(Global.BindingEngine.CurrentTab.id, control.DataView, control.DataColumn,dv.Row,ctrl,control.InGrid);
        }
        
        Global.Purge(ctrl);
        if (ctrl.parentNode) ctrl.parentNode.removeChild(ctrl);
    }
    if (Global.BindingEngine.Controls[control.ID])
     delete Global.BindingEngine.Controls[control.ID];
        
    ArrayList.prototype.Remove.call(this, control); // remove from the collection
    
}
ControlCollection.prototype.Clear=function()
{
    // Since this is a list of controls we also need to clean up the controls that are in the collection
    if (this.Count > 0)
    {
        var currCtrl;
        for(var ctrl in this.items)
        {
            currCtrl = this.items[ctrl];
            this.Remove(currCtrl);
        }
    }
    ArrayList.prototype.Clear.call(this);
    this.tabIndxList.length = 0;
    this.tabIndxList = null;
}
ControlCollection.prototype.ContainsKey=function(key)
{
    for(var c in this.items)
    {
        if(this.items[c].Name==key)
        {
            return true;
        }
    }
}

var Application = System.Windows.Forms.Application =
{
    "DoEvents":function(){},
    "AddMessageFilter": function() { },
    "RemoveMessageFilter": function() {},
    "StopMessageFilter":function(){}
}

var CheckState = System.Windows.Forms.CheckState={"Unchecked":0,"Checked":1,"Indeterminate":2}
var Cursors = System.Windows.Forms.Cursors={"WaitCursor":"wait","Arrow":"default"} // Cursors is not really an enum in .NET, but doing this for now.
var Cursor = System.Windows.Forms.Cursor={"Current":null}; // This is really a regular class, but not used, so putting only the static member for now

var MessageBox = System.Windows.Forms.MessageBox = 
{
    Show: function()
    {
        return this._show(false,arguments);
    },
    ShowLocale: function()
    {
        return this._show(true,arguments);
    },
    _show: function(showLocale,args)
    {
        if(FormTestManager) return FormTestManager.MessageBox(args);

        var msgForm = new LaunchEngineForm();
        if (showLocale==true)
        {
            //if overload exists we append "$" to it, otherwise create new overload with "$"
            var isOverload = (args[args.length-1] instanceof EpiOverloadedArgs);
            var ll = (isOverload==true)?args.length-2:args.length-1;
            for(var i=0; i<=ll; i++) msgForm.Args.push(args[i]);
            var overload = (isOverload==true)?Global.GetOLSeqForArgTypes(args):"";
            overload = "$" + overload;
            msgForm.Args.push(new EpiOverloadedArgs(overload));            
        }
        else
        {
            for(var i=0; i<=args.length-1; i++) msgForm.Args.push(args[i]);
        }
        msgForm.Assembly = "UI.EpiClientLib";
        msgForm.Name = "MessageBoxForm";
        return msgForm.ShowDialog();
    }
}
var EpiMessageBox = Epicor.Mfg.UI.EpiMessageBox = MessageBox;

var EpiDialog = Epicor.Mfg.UI.EpiDialog = 
{
    Show: function(assembly,name)
    {
        var args = arguments;
        if(FormTestManager) return FormTestManager.MessageBox(args);
        var msgForm = new LaunchEngineForm();
        for(var i=2; i<=args.length-1; i++) msgForm.Args.push(args[i]);
        msgForm.Assembly = assembly;
        msgForm.Name = name
        return msgForm.ShowDialog();
    }
}

var ExceptionBox = Epicor.Mfg.UI.ExceptionBox = 
{
    Show: function(err)  // TODO: Extend this.
    {
        var errMsg = (err.description)?err.description:err.Message;
        if(FormTestManager) 
        {
            FormTestManager.HandleError("Application error: " + errMsg );
        }
        //try to get business exception details
        var sMsg = null;
        if(err instanceof BusinessObjectException)
        {
            var m = null;
            var re = new RegExp("-->([\\s\\S]+)--->");
            m = errMsg.match(re);
            if (!m)
            {
                re = new RegExp("Protocols.SoapException:([\\s\\S]+)--->");                
                m = errMsg.match(re);
            }
            if (m) 
            {
                sMsg = errMsg.match(re)[1];
                var pos = sMsg.indexOf(":");
                if (pos >- 1) sMsg = sMsg.substr(pos+1);
            }
            else
            {
                re = new RegExp("Protocols.SoapException:([\\s\\S]+)\n");                
                m = errMsg.match(re);
                if (m)
                    sMsg = errMsg.match(re)[1];
            }
            
        }
        if (sMsg != null)
            MessageBox.Show(sMsg, errMsg, new EpiOverloadedArgs("String_Details"));
        else
            MessageBox.Show(errMsg, new EpiOverloadedArgs("String"));
    },
    ShowLocale: function(ex)  // TODO: Extend this.
    {
        ExceptionBox.Show(ex);
    }
}

var DialogResult = System.Windows.Forms.DialogResult = {"Abort":"Abort","Cancel":"Cancel","Ignore":"Ignore",
                        "No":"No","None":"None","OK":"OK","Retry":"Retry","Yes":"Yes"}
var MessageBoxButtons = System.Windows.Forms.MessageBoxButtons = {"AbortRetryIgnore":"AbortRetryIgnore", "OK":"OK", "OKCancel":"OKCancel", 
                         "RetryCancel":"RetryCancel", "YesNo": "YesNo", "YesNoCancel":"YesNoCancel"}
var MessageBoxIcon = System.Windows.Forms.MessageBoxIcon = {"Asterisk":"Asterisk","Error":"Error","Exclamation":"Exclamation","Hand":"Hand",
                      "Information":"Information","None":"None","Question":"Question", "Stop":"Stop",
                      "Warning":"Warning"}
var MessageBoxDefaultButton = System.Windows.Forms.MessageBoxDefaultButton = {"Button1":"Button1","Button2":"Button2","Button3":"Button3"};

var DataObject = System.Windows.Forms.DataObject = function(obj)
{
    // just taking care of what we need for dragdrop now.
    this._obj = obj;
}
DataObject.prototype.GetDataPresent=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    // just taking care of what we need for tree drag drop now.  
    switch(overload)
    {
        case "String":
            return false;
            break;
        case "Type":
            if(a[0]==System.String && Global.IsString(this._obj))
                return true;
            else 
                return (this._obj instanceof a[0]);
            break;
        case "String_Boolean":
            return false;
            break;
    }
}
DataObject.prototype.GetData=function()
{
    // More to this, but this works for what we need.
    return this._obj;
}

var ImageList = System.Windows.Forms.ImageList = function()
{
    EpiObject.call(this, "ImageList");
    this.IsDisabledList = false;
    this.Images=[]; // temp fix
}
ImageList.prototype.get_Image=function(img)
{
    var img = EpiUIImages.GetImage(img);
    if(this.IsDisabledList) img.IsDisabledImage = true;
    return img;
}

var ContextMenu = System.Windows.Forms.ContextMenu = function()
{
    EpiObject.call(this, "ContextMenu");
    this.MenuItems = new ArrayList();
    this._toolmap = {};
}
ContextMenu.prototype = new EpiObject();
ContextMenu.prototype.Show=function(ctrl, point)
{
    var tools = {};
    var cnt = 0;
    this._toolmap = {};

    // make menu items that our popup manager can understand
    for(var i in this.MenuItems.items)
    {
        var itm = this.MenuItems.items[i];
        
        var key = "itm" + cnt;
        tools[key] = new ButtonTool(key, {"Caption":itm.Text, "Type":"ButtonTool", "Visible":itm.Visible});
        this._toolmap[key] = itm; 
        
        cnt++;
    }

    Global.Form.baseToolbarsManager.get_Event("ToolClick").unsubscribe(this._toolclick,this);
    Global.Form.baseToolbarsManager.get_Event("ToolClick").subscribe(this._toolclick,this,true);
    Global.Form.baseToolbarsManager.ShowPopup(tools, null, "", point.X, point.Y);
}
ContextMenu.prototype._toolclick=function(sender,e)
{
    var mnuItem = this._toolmap[e.Tool.Key];
    if (mnuItem && mnuItem._events && mnuItem._events.Click)
    {
        try
        {
            mnuItem._events.Click.fire(sender,e);
        }
        catch(err)
        {
            DebugHelper.WriteError("ContextMenu._toolclick error in firing Click event.", err);
        }
        return;
    }
    if(mnuItem && mnuItem.Events.length>0)
    {
        var s = mnuItem.Events[0];
        var scope = (s.override) ? s.obj : this.scope;

        try
        {
            s.fn.apply(scope,arguments); 
        }
        catch(err)
        {
            DebugHelper.WriteError("ContextMenu._toolclick error.  Function text is: <br />" + s.fn.toString() + "<br/><br/>", err);
            retVal = false;
        }
   }
}

// Context menu item
var MenuItem = System.Windows.Forms.MenuItem = function()
{
    EpiObject.call(this, "MenuItem");
    
    this.Text = "";
    this.Events = [];
    this.Enabled = true;
    this.Visible = true;
    this.Checked = false;
    this.MenuItems = new ArrayList();
    this._tool = {};
    
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String":
            this.Text = a[0];
            break;
        case "String_EventHandler":
            this.Text = a[0];
            this.Events.push(a[1]);
            break;
        case "":
        case "String_MenuItemArr":
        case "String_EventHandler_Shortcut":
        case "MenuMerge_Int32_Shortcut_String_EventHandler_EventHandler_EventHandler_MenuItemArr":
            // not needed yet
            break;
    }    
}
MenuItem.prototype = new EpiObject();
MenuItem.prototype.PerformClick=function()
{
    // trigger the event handlers
    var s;
    for(var i=0,handlr;handlr=this.Events[i];i++)
    {
        // This is a Subscriber object
        handlr.fn.call(handlr.obj);
    }
    if (this.get_Event("Click").subscribers.length > 0)
        this.get_Event("Click").fire(this,{});
}

var Binding = System.Windows.Forms.Binding=function(propertyName,dataSource,dataMember)
{
    this.PropertyName = propertyName;
    this.DataSource = dataSource;
    this.DataMember = dataMember;
}

// TODO: For now, deriving this from ArrayList, but i think it might need to be implemented differently later
var ControlBindingsCollection = System.Windows.Forms.ControlBindingsCollection=function(){}
ControlBindingsCollection.prototype = new ArrayList();
ControlBindingsCollection.prototype.Add=function(propertyName,dataSource,dataMember)
{
    var obj=new Binding(propertyName,dataSource,dataMember);
    ArrayList.prototype.Add.call(this,obj); 
}

// ----------- System.Windows.Input
var MouseButtons = System.Windows.Input.MouseButtons = {"Left":0,"Middle":1,"Right":2,"XButton1":3,"XButton2":4};

// ----------- System.Reflection
var BindingFlags={"CreateInstance":0x200,"DeclaredOnly":2,"Default":0,"ExactBinding":0x10000,"FlattenHierarchy":0x40,"GetField":0x400,"GetProperty":0x1000,"IgnoreCase":1,"IgnoreReturn":0x1000000,"Instance":4,"InvokeMethod":0x100,"NonPublic":0x20,"OptionalParamBinding":0x40000,"Public":0x10,"PutDispProperty":0x4000,"PutRefDispProperty":0x8000,"SetField":0x800,"SetProperty":0x2000,"Static":8,"SuppressChangeType":0x20000};
var Assembly = System.Reflection.Assembly = function(assmName)
{
    EpiObject.call(this, "Assembly");
    this._name = assmName;
}
Assembly.prototype.GetName = function()
{
    return {"Name":this._name};
}
Assembly.GetCallingAssembly=function()
{
    return Global.Form.GetType().Assembly;
}
Assembly.GetExecutingAssembly=function()
{
    return Global.Form.GetType().Assembly;
}
Assembly.prototype.GetTypes=function()
{
    return {};
}
Assembly.prototype.GetCustomAttributes=function()
{
    if (!this.CustomAttributes) return [];
    else return this.CustomAttributes;
}
// ----------- System.Xml
var XmlNodeType= {"None":0,"Element":1,"Attribute":2,"Text":3,"CDATA":4,"EntityReference":5,"Entity":6,"ProcessingInstruction":7,"Comment":8,"Document":9,"DocumentType":10,"DocumentFragment":11,"Notation":12,"Whitespace":13,"SignificantWhitespace":14,"EndElement":15,"EndEntity":16,"XmlDeclaration":17};
var XmlDocument = System.Xml.XmlDocument = function ()
{
    EpiObject.call(this, "XmlDocument");
    this.ownerDocument = Sarissa.getDomDocument();
}

XmlDocument.prototype.CreateElement = function ()
{
    var a = arguments;
    var tempArray = new Array();
    for (i = 0; i < a.length; i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    var ns = "", elementName = "";
    switch (overload)
    {
        case "String":
            elementName = a[0];
            break;
        case "String_String":
            elementName = a[0];
            ns = a[1];
            break;
        case "String_String_String":
            elementName = ((a[0]) ? a[0] + ":" : "") + a[1];
            ns = a[2];
            break;
    }

    var newElement = createElementNS(ns, elementName, this.ownerDocument);
    return new XmlNode(newElement, this.ownerDocument);
}

XmlDocument.prototype.CreateNode = function ()
{
    var a = arguments;
    var tempArray = new Array();
    for (i = 0; i < a.length; i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    var newElement;
    // Right now we dont care about the XmlNodeType, we create the Text node when set_InnerText is called. 
    // This might need to change in the future.
    switch (overload)
    {
        case "XmlNodeType_String_String":
        case "String_String_String":
            newElement = this.CreateElement(a[1], a[2], new EpiOverloadedArgs("String_String"));
            break;
    }
    return newElement;
}

XmlDocument.prototype.AppendChild = function (childElement)
{
    this.ownerDocument.appendChild(childElement.xmlElement);
}

XmlDocument.prototype.get_DocumentElement = function ()
{
    return new XmlNode(this.ownerDocument.documentElement);
}

XmlDocument.prototype.LoadXml = function (xmlStr)
{
    this.ownerDocument.loadXML(xmlStr);
    var parseErr = Sarissa.getParseErrorText(this.ownerDocument);
    if (parseErr != Sarissa.PARSED_OK)
        throw parseErr;
}
XmlDocument.prototype.SelectSingleNode = function (xPath)
{
    var nodeList = this.ownerDocument.selectSingleNode(xPath);
    if (nodeList.length > 0)
       return new XmlNode(nodeList[0]);
    else
        return null;
}
XmlDocument.prototype.ImportNode = function (node, deep)
{
    var elem = this.ownerDocument.importNode(node, deep);
    return new XmlNode(elem, this.ownerDocument);
}



var XmlNode = System.Xml.XmlNode = function (element, ownerDocument)
{
    EpiObject.call(this, "XmlNode");

    this.ownerDocument = ownerDocument;
    this.isTextElement = false;
    if (element.hasChildNodes && element.childNodes[0].nodeType == Node.TEXT_NODE)
        this.isTextElement = true;

    this.xmlElement = element;
}

XmlNode.prototype.get_InnerText = function ()
{
    if (this.isTextElement) return this.xmlElement.childNodes[0].nodeValue;
    else return "";
}
XmlNode.prototype.set_InnerText = function (text)
{
    // To set the text, we need to create a text element.
    if (!this.isTextElement)
        this._createTextElement(text);
    else
        this.xmlElement.nodeValue = text;
}
XmlNode.prototype._createTextElement = function (text)
{
    var textElement = this.ownerDocument.createTextNode(text);
    this.xmlElement.appendChild(textElement);
    this.isTextElement = true;
}
XmlNode.prototype.AppendChild = function (childElement)
{
    this.xmlElement.appendChild(childElement.xmlElement);
}
XmlNode.prototype.RemoveChild=function(child)
{
    this.xmlElement.removeChild(child.xmlElement);
}
XmlNode.prototype.get_ChildNodes = function ()
{
    var xmlNodes = [];
    var nodes = this.xmlElement.childNodes;
    var node;
    for (var i = 0; i < nodes.length; i++)
    {
        node = nodes[i];
        xmlNodes.push(new XmlNode(node, this.ownerDocument));
    }

    return xmlNodes;
}
XmlNode.prototype.get_Name = function () { return this.xmlElement.nodeName; }

XmlNode.prototype.SelectNodes = function (xPath)
{
    var xNodeList = [];
    var nodeList = this.xmlElement.selectNodes(xPath);
    for(var i=0;i<nodeList.length;i++)
    {
        xNodeList.push(new XmlNode(nodeList[i], this.ownerDocument));
    }
    return xNodeList;
}
XmlNode.prototype.SelectSingleNode = function (xPath)
{
    var nodeList = this.xmlElement.selectSingleNode(xPath);
    if (nodeList.length > 0)
        return new XmlNode(nodeList[0]);
    else
        return null;
}
XmlNode.prototype.get_HasChildNodes = function () { return this.xmlElement.hasChildNodes; }

XmlNode.prototype.get_InnerXml = function () { return (new XMLSerializer()).serializeToString(this.xmlElement); }
XmlNode.prototype.set_InnerXml = function (xmlData)
{
    WebFrameworkManager.RedirectInvoke('System.Xml.XmlNode', 'InnerXml', false, false);
}

XmlNode.prototype.ReplaceChild = function (newChild, oldChild)
{
    this.xmlElement.replaceChild(newChild.xmlElement, oldChild.xmlElement);
}
XmlNode.prototype.InsertBefore = function (newChild, existingChild)
{
    this.xmlElement.insertBefore(newChild.xmlElement, oldChild.xmlElement);
}

var AppSettingsHandler=Epicor.Mfg.Lib.AppSettingsHandler=
{
    "GetValue":function(){return "";}
}
var AppSettingsSection=Epicor.Mfg.Lib.AppSettingsSections=
{
    "Application":null
}

// ----------  Epicor.Mfg.Lib.HelpViewer
var HtmlControl = Epicor.Mfg.Lib.HelpViewer.HtmlControl = function(browserPanel)
{
    this.bPanel = browserPanel;
    this.HtmlControl = this;
}
HtmlControl.prototype.get_Url = function()
{
    if(this.bPanel) return this.bPanel.Url;
    else return "";
}

// ----------  Epicor.Mfg.Lib.Report
var EpiReportFunctions = Epicor.Mfg.Lib.Report.EpiReportFunctions = function()
{
    EpiObject.call(this, "EpiReportFunctions");
}

EpiReportFunctions.CreateList=function(listTable, keyField)
{
	returnList = "";
	try
	{
		listTable.AcceptChanges();
		if(listTable.Rows.length > 0)
		{
			for(var i=0,searchRow;searchRow=listTable.Rows[i];i++)
			{
				if(searchRow[keyField].toString().length > 0)
				{
					if(returnList.length == 0)
						returnList = searchRow[keyField].toString();
					else
						returnList += "~" + searchRow[keyField].toString();
				}
			}
		}
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}

	return returnList;
}

EpiReportFunctions.AdjustReportToolBar=function(baseToolbarsManager)
{
    try
	{
		var actionMenu;
		if (baseToolbarsManager != null)
		{
			try 
			{
				var Caption = EpiString.GetString("SaveDefaults","MessageStrings.html");
				var buttonDefSave = new ButtonTool("DefSaveTool",{"Caption":Caption,"Type":"ButtonTool","Category":"Action"});
				EpiReportFunctions.setToolImage(buttonDefSave, "Save");

				Caption = EpiString.GetString("GetDefaults","MessageStrings.html");
		        var buttonDefGet = new ButtonTool("DefGetTool",{"Caption":Caption,"Type":"ButtonTool","Category":"ResetLayouts"});	
				EpiReportFunctions.setToolImage(buttonDefGet, "Import");

				Caption = EpiString.GetString("RemoveDefaults","MessageStrings.html");
				var buttonDefRemove = new ButtonTool("DefRemoveTool",{"Caption":Caption,"Type":"ButtonTool","Category":"Action"});	
				EpiReportFunctions.setToolImage(buttonDefRemove, "Delete");

                baseToolbarsManager.Tools.Add(buttonDefRemove);
				baseToolbarsManager.Tools.Add(buttonDefGet);
				baseToolbarsManager.Tools.Add(buttonDefSave);
			
				if (baseToolbarsManager.Tools.Exists("ActionsMenu"))
				{
					actionMenu = baseToolbarsManager.Tools["ActionsMenu"];
					actionMenu.Tools.AddTool("DefSaveTool");
					actionMenu.Tools.AddTool("DefGetTool");
					actionMenu.Tools.AddTool("DefRemoveTool");
				}

//                baseToolbarsManager.Tools["ProcessTool"].SetVisible(true);

                if(Global.Form._assembly.StartsWith("UIProc."))
                {
                    baseToolbarsManager.Tools["GenerateTool"].IsFirstInGroup = true;
                    baseToolbarsManager.Tools["GenerateTool"].SetVisible(true);
                }
			}
			catch(e1){}
		}
		baseToolbarsManager.Tools["ActionsMenu"].SetVisible(true);
		baseToolbarsManager.Tools["ActionsMenu"].SetEnabled(true);
		baseToolbarsManager.Tools["PrintTool"].SetVisible(true);
		baseToolbarsManager.Tools["PrintPreviewTool"].SetVisible(true);

   		if (Global.Form._assembly == "UIRpt.ProcessPayment")
		{			
            		Global.Form.baseToolbarsManager.Tools["PrintPreviewTool"].SetEnabled(true);           
		      	Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(false);                
		}

		if(baseToolbarsManager.Tools.Exists("AttachmentTool"))
			baseToolbarsManager.Tools["AttachmentTool"].SetVisible(false);
		if(baseToolbarsManager.Tools.Exists("RefreshTool"))
			baseToolbarsManager.Tools["RefreshTool"].SetVisible(false);				
		if(baseToolbarsManager.Tools.Exists("SendMenu"))
		{
			baseToolbarsManager.Tools["SendMenu"].SetVisible(false);				
			baseToolbarsManager.Tools["SendRecordEmailTool"].SetVisible(false);				
			baseToolbarsManager.Tools["SendRecordDeskTopTool"].SetVisible(false);				
			baseToolbarsManager.Tools["SendRecordFileTool"].SetVisible(false);				
		}
		EpiReportFunctions.setToolImage(baseToolbarsManager.Tools["GenerateTool"],"GenerateOnly");
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
}

EpiReportFunctions.setToolImage=function(tool, imageName)
{
    tool.SharedProps.AppearancesLarge.Appearance.set_Image(EpiUIImages.LargeEnabledImages.get_Image(EpiUIImages.IndexOf(imageName)));
	//tool.SharedProps.AppearancesSmall.Appearance.set_Image(EpiUIImages.SmallEnabledImages.get_Image(EpiUIImages.IndexOf(imageName)));
}

// ----------  Epicor.Mfg.UI.ClassAttribute
var ClassAttribute = Epicor.Mfg.UI.ClassAttribute;
var ClassAttributeHandler = Epicor.Mfg.UI.ClassAttribute.ClassAttributeHandler = function()
{
}
ClassAttributeHandler.GetAttributes=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "DataSet_String_String_Session":
            if(a[0]) a[0].BOClass=a[1];
            break;
        case "String_String_Session": 
            break;
    }
}
ClassAttributeHandler.GetAttributes_1=function(dataSet, className, nameSpace, session)
{
    dataSet.BOClass = className;
}

// ----------  Epicor.Mfg.UI.ExtendedProps
var ControlSettings = Epicor.Mfg.UI.ExtendedProps.ControlSettings = function()
{
    EpiObject.call(this, "ControlSettings");
    this.OverrideControlState=ControlSettings.OverrideState.Default;
    this.IsEnabled=true;
    this.IsReadOnly=false;
    this.IsVisible=true;
}
ControlSettings.GetControlSettings=function(style)
{
    var cs = {SettingStyle:style, ManuallySet:false, IsEnabled:true, IsReadOnly:false, IsVisible:true,ColumnName:""};
    switch(style)               
    {
        case SettingStyle.Disabled:
            cs.IsEnabled = false;
            break;
        case SettingStyle.Invisible:
            cs.IsVisible = false;
            break;
        case SettingStyle.ReadOnly:
            cs.IsReadOnly = true;
            break;
    } 
    return cs;
}
ControlSettings.UpdateControlSettings=function(currentSettings,style)
{
    switch(style)               
    {
        case SettingStyle.Disabled:
            currentSettings.IsEnabled = false;
            break;
        case SettingStyle.Invisible:
            currentSettings.IsVisible = false;
            break;
        case SettingStyle.ReadOnly:
            currentSettings.IsReadOnly = true;
            break;
    } 
    currentSettings.settingStyle = style;
}
ControlSettings.OverrideState = {Enabled:0,Disabled:1,ReadOnly:2,Default:3};

var ControlImageSettings = Epicor.Mfg.UI.ExtendedProps.ControlImageSettings = function()
{
    ControlSettings.call(this, "ControlImageSettings");
}

var KeyCodes = { 'Tab':9,'Ins':45,'Del':46,'F1':112,'F2':113,'F3':114,'F4':115,'F5':116,'F6':117,'F7':118,'F8':119,'F9':120,'F10':121,'F11':122,'F12':123,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'LeftArrow':37,'RightArrow':39,'UpArrow':38,'DownArrow':40,'Bksp':8};

// Added this to allow the translation to work (its requird for context help which we wont be supporting)
// Note: We have an issue with setting the extended properties on DataColumn directly.
// Translation might have to be different and pass in the DataTable along with the column name.
var ExtendedProperties = Epicor.Mfg.UI.ExtendedProps.ExtendedProperties =
{
    GetKeyFieldValue: function (ctrl) {
        var val = ctrl.get_Value();
        if (val == null) val = "";
        return val;
    },
    SetKeyFieldValue: function (ctrl, val) {
        ctrl.set_Value(val);
    },
    SetReadOnlyState: function () {
        // TODO
    },
    SetPartDescProps: function (PartNbr, PartDesc, HideForeign) {
        if (HideForeign == "undefined") HideForeign = false;
    },
    SetContextMenuProps: function (dvName, dc, cb) {
        cb.ReplaceMaint = false;
        cb.ReplaceSearch = false;
        cb.addMailDialog = false;

        var dv = Global.BindingEngine.EpiDataViews[dvName];
        if (dv) {
            var dt = dv.dataView.Table;
            var prop = dt.GetExtendedProperty(dc, "BaseForm");
            if (prop != "") cb.ReplaceMaint = Convert.ToBoolean(prop);

            prop = dt.GetExtendedProperty(dc, "BaseSearch");
            if (prop != "") cb.ReplaceSearch = Convert.ToBoolean(prop);

            prop = dt.GetExtendedProperty(dc, "CustomContext");
            if (prop == "") prop = ExtendedProperties.GetExtendedPropertyDefaultValue("CustomContext");
            cb.customContext = prop;

            var emailCol = dt.GetExtendedProperty(dc, "EmailColumn");
            if (emailCol != "") {
                var ch = false;
                if (emailCol.indexOf(".") > 0) {
                    var emVue = emailCol.substring(0, emailCol.indexOf("."));
                    emailCol = emailCol.substring(emailCol.indexOf(".") + 1);

                    if (emVue != dvName) {
                        dv = Global.BindingEngine.EpiDataViews[dvName];
                        if (dv.dataView.Table.Columns[emailCol] != undefined) {
                            cb.addMailDialog = true;
                            ch = true;
                        }
                    }
                }
                if (!ch) {
                    if (dt.Columns[emailCol] != undefined) cb.addMailDialog = true;
                }
            }
        }
        return cb;
    },
    GetExtendedPropertyDefaultValue: function (extendedProperty) {
        var defaultValue = "";
        switch (extendedProperty.toUpperCase()) {
            case "INVALIDATED":
            case "ALLOWATTACHMENT":
            case "ISATTACHMENTTABLE":
            case "EXTERNAL":
            case "HIDEFOREIGN":
            case "ISHIDDEN":
            case "READONLY":
            case "SECURED":
            case "SUPPRESSCONTEXTMAINT":
            case "SUPPRESSCONTEXTSEARCH":
            case "SYSTEMCOLUMN":
            case "INDEXED":
            case "DELIMITERCHECK":
                defaultValue = "False";
                break;

            case "ENABLED":
                defaultValue = "True";
                break;

            case "ATTACHMENTTABLENAME":
            case "BINDINGCOLUMNS":
            case "PARENTTABLENAME":
            case "BASEFORM":
            case "BASESEARCH":
            case "CUSTOMCONTEXT":
            case "EMAILCOLUMN":
            case "FORMAT":
            case "LIKE":
            case "PARTDESC":
            case "PARTNUM":
            case "TOOLTIP":
                defaultValue = "";
                break;

            default:
                defaultValue = "";
                break;
        }
        return defaultValue;
    },
    GetProperty: function (Col, prop) {
        var result = "";
        if (Col.DataV && Col.DataC) {
            var dv = Global.BindingEngine.EpiDataViews[Col.DataV];
            if (dv) {
                var dt = dv.dataView.Table;
                result = dt.GetExtendedProperty(Col.DataC, prop);
            }
        }

        return result;
    },
    HandleKeyPress: function (ctrl, e) {
        if (ctrl instanceof EpiTextBox || ctrl instanceof EpiDropControl) {
            if(Global.ServerSession.EnterpriseSearch && this.MatchesHotKey(Global.Form.FormOptions.EnterpriseSearchHotKey, e))
            {
                return this.HandleEnterpriseSearchHotKey(ctrl);
            }
        }
    },
    MatchesHotKey: function (shortcut, e){
        if(shortcut=="None") {return false;}

        var _alt = false;
        var _ctrl = false;
        var _shft = false;

        if(shortcut.indexOf("Alt") > -1)
		{
			_alt = true;
            shortcut = shortcut.replace("Alt","");
		}
        if(shortcut.indexOf("Ctrl") > -1)
        {
            _ctrl = true;
            shortcut = shortcut.replace("Ctrl","");
        }
        if(shortcut.indexOf("Shift") > -1)
        {
            _shft = true;
            shortcut = shortcut.replace("Shift", "");
        }

        if(KeyCodes[shortcut])
        {
            return (_ctrl == e.ctrlKey) && (_alt == e.altKey) && (_shft == e.shiftKey) && (KeyCodes[shortcut] == e.keyCode);
        }
        else {return false;}
    },
	HandleEnterpriseSearchHotKey: function(ctrl)
	{
		var searchSeed = ctrl.get_Text();
		var like = ctrl.get_EpiContextMenuKey();
		var calledFrom = Global.Form.get_WhoAmI();
		var url = "SysEnterpriseSearchDialog.aspx?q=" + searchSeed + "&Page=1&like=" + like + "&calledFrom=" + calledFrom;
		var dialogArgs = {"LaunchObj":this,"DialogQueue":null,"DialogProps":null,"DialogControls":null,"Opener":Global.window,"DialogResult":null,"ReturnObject":null};
	
		if(BrowserSniffer.IE || BrowserSniffer.FireFox15)
		{
			var sFeatures = "dialogHeight:507px; dialogWidth:661px;";
			sFeatures += "toolbar:no;menubar:no;scrollbars:yes;scroll:yes;status:no;help:no;resizable:no;";
			var result = showModalDialog(url, "", sFeatures);
			return result;
		}
		else
		{
			if(BrowserSniffer.Safari13)
			{
				if(!BrowserSniffer.SafariMobile)
				{
					var sFeatures = "dialogHeight:507px; dialogWidth:661px;";
					sFeatures += "toolbar:yes;menubar:yes;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
					
					var prevArguments = Global.DialogArguments;
					Global.window.Global.DialogArguments = dialogArgs;
					var result = Global.window.showModalDialog(url, dialogArgs, sFeatures);
					var retVal = Global.window.Global.DialogArguments.ReturnObject;
					Global.window.Global.DialogArguments = prevArguments;
					return retVal;
				}
				else
				{
					alert("This feature is not implemented at this time.");
					return null;
				}
			}
		}
	}
}

var RowRule = Epicor.Mfg.UI.ExtendedProps.RowRule = function(arg1, condition, arg2, actions, context)
{
    EpiObject.call(this, "RowRule");

    this._id=null;
    this.Arg1 = arg1;
    this.Arg2 = arg2;
    this.Condition = condition;
    this.Actions = [];
    this._actionCols = {};
    this.builtRule = "";
    if (context) this.Context = context; // context used by ActionDelegates
    
    if(actions)
    {
        if(Global.IsArray(actions))
            this.Actions = actions;
        else    
            this.Actions.push(actions);
    }    
   
    return this;
}
RowRule.prototype.AddAction=function(action)
{
    this.Actions.push(action);
    // This is to handle the case when the AddRowRule is called before AddAction
    if (this.builtRule != "" && this.ownerDV)
        this.ownerDV._addRuleForAction(this, action);
}
RowRule.prototype.AddActionRange=function(actions)
{
    if (actions && actions.length >0)
    {
         for(var ii=0, o; o=actions[ii]; ii++)
            this.AddAction(actions[ii]);
    }
}
RowRule.prototype.SetCondition=function(arg1, condition, arg2)
{
    if(this.ownerDV)
    {
        // We have to rebuild all the row rules that have the current rule's epibinding.
        this.ownerDV._removeRowRule(this);
        this.Arg1 = arg1;
        this.Condition = condition;
        this.Arg2 = arg2;
        this.ownerDV.AddRowRule(this);
    }
}

var RuleAction = Epicor.Mfg.UI.ExtendedProps.RuleAction = 
{
    AddControlSettings: function(sender, epiBinding, style)
    {
        return {Type:"AddControlSettings",EpiBinding:epiBinding,Style:style};
    },
    AddRowSettings: function(sender, viewName, gridOnly, style)
    {
        return {"Type":"AddRowSettings","ViewName":viewName,"GridOnly":gridOnly,"Style":style};
    },
    DisableColumns: function(sender, viewName, disableColumns)
    {
        return {Type:"DisableColumns",ViewName:viewName, DisableColumns:disableColumns};
    },
    DisableRow: function(sender, viewName, exceptTheseColumns)
    {
        if(!exceptTheseColumns) exceptTheseColumns = [];
        return {Type:"DisableRow",ViewName:viewName,ExceptTheseColumns:exceptTheseColumns};
    },
    SetColumnValue: function(sender, epiBinding, newValue)
    {
        return {Type:"SetColumnValue",EpiBinding:epiBinding,NewValue:newValue};
    },
    SetImage: function(sender, epiBinding, imageName)
    {
	    if (epiBinding.IndexOf(".") <= 0) epiBinding = epiBinding+".EpiGridIconColumn";
        return {Type:"SetImage",EpiBinding:epiBinding,ImageName:imageName};
    },
    DisableContext: function(sender, epiBinding)
    {
        // TODO: When this particular row rule is invoked, it adds the epiBinding to a list in epiDataView.
        // The list is used finally when building the context menu to check if any menu should be disabled.
        return {};
    }
}
var RowRuleAction = Epicor.Mfg.UI.ExtendedProps.RowRuleAction =
{
    AddControlSettings: function(sender, epiBinding, style) {
        return { Type: "AddControlSettings", EpiBinding: epiBinding, Style: style };
    },
    AddRowSettings: function(sender, viewName, gridOnly, style)
    {
        return {"Type":"AddRowSettings","ViewName":viewName,"GridOnly":gridOnly,"Style":style};
    },
    DisableColumns: function(sender, viewName, disableColumns) {
        return { Type: "DisableColumns", ViewName: viewName, DisableColumns: disableColumns };
    },
    DisableRow: function(sender, viewName, exceptTheseColumns) {
        if (!exceptTheseColumns) exceptTheseColumns = [];
        return { Type: "DisableRow", ViewName: viewName, ExceptTheseColumns: exceptTheseColumns };
    },
    SetColumnValue: function(sender, epiBinding, newValue) {
        return { Type: "SetColumnValue", EpiBinding: epiBinding, NewValue: newValue };
    },
    SetImage: function(sender, epiBinding, imageName) {
        if (epiBinding.IndexOf(".") <= 0) epiBinding = epiBinding + ".EpiGridIconColumn";
        return { Type: "SetImage", EpiBinding: epiBinding, ImageName: imageName };
    },
    DisableContext: function(sender, epiBinding) {
        // TODO: When this particular row rule is invoked, it adds the epiBinding to a list in epiDataView.
        // The list is used finally when building the context menu to check if any menu should be disabled.
        return {};
    },
    get_ViewName: function(sender, epiBinding) {
        if (epiBinding.indexOf(".", 0) > -1)
            return epiBinding.substr(0, epiBinding.indexOf(".", 0))
        else
            return "";
    },
    get_ColumnName: function(sender, epiBinding) {
        if (epiBinding.indexOf(".", 0) > -1)
            return epiBinding.substring(epiBinding.indexOf(".", 0) + 1, epiBinding.length)
        else
            return "";
    }
}

var RuleCondition = Epicor.Mfg.UI.ExtendedProps.RuleCondition = 
{
    Equals:0, NotEqual:1, GreaterThan:2, LessThan:3, Contains:4, StartsWith:5, 
        ColumnValueChanges:6, GreaterThanOrEqualTo:7, LessThanOrEqualTo:8, EndsWith:9,Delegate:10, Has:11, DoesNotHave:12
}
var SettingStyle = Epicor.Mfg.UI.ExtendedProps.SettingStyle = 
{
    Bold: "Bold", Error: "Error", Warning: "Warning", OK: "OK", Highlight: "Highlight", Disabled: "Disabled", Mandatory: "Mandatory", Invisible: "Invisible", ReadOnly: "ReadOnly", BackColor: "BackColor"
}
var BitFlagValue = Epicor.Mfg.UI.ExtendedProps.BitFlagValue = 
{
    NotSet:0,Memo:1,Attachment:2,CRMCall:3,ChangeLog:4,BPMHold:5
}

var RowRuleConditionDelegate=Epicor.Mfg.UI.ExtendedProps.RowRuleConditionDelegate=Delegate;
var RowRuleConditionDelegate2=Epicor.Mfg.UI.ExtendedProps.RowRuleConditionDelegate2=Delegate;
var RowRuleActionDelegate=Epicor.Mfg.UI.ExtendedProps. RowRuleActionDelegate=Delegate;

// ----------  Epicor.Mfg.UI.SecRights
var SecRightsHandler = Epicor.Mfg.UI.SecRights.SecRightsHandler=
{
    "GetSecSettings":function(BO,Session,RestrictedMethods,RestrictedColumns)
    {
        Global.ArgManager["Out1"]=RestrictedMethods; // out params
        Global.ArgManager["Out2"]=RestrictedColumns;
        return true; // BO is enabled
    }
}
// ----------  Epicor.Mfg.Sec.SecRights
var SecRights = Epicor.Mfg.Sec.SecRights=function(connPool){}
SecRights.prototype.GetReadOrWriteDeniedColumns=function(cID,uID,bo)
{
    Global.LoadProxy("sec_SecRights");
    var sec = new sec_SecRightsService();
    return sec.GetReadOrWriteDeniedColumns(cID,uID,bo);
}

// ----------  Epicor.Mfg.UI.Searches
var SearchMode = Epicor.Mfg.UI.Searches.SearchMode = {ShowDialog:0,AutoSearch:1}
var DataSetMode = Epicor.Mfg.UI.Searches.DataSetMode = {ListDataSet:0,RowsDataSet:1}
var SelectMode = Epicor.Mfg.UI.Searches.SelectMode = {SingleSelect:0,MultiSelect:1}
var SearchDataSetMode = Epicor.Mfg.UI.Searches.SearchDataSetMode = {ListDataSet:0,RowsDataSet:1}

var AlternateSearchMethod = Epicor.Mfg.UI.Searches.AlternateSearchMethod = Delegate;
	
var SearchOptions = Epicor.Mfg.UI.Searches.SearchOptions = function(Mode) 
{
    EpiObject.call(this, "SearchOptions");
    
    this.SearchMode = Mode;                         // srchMode
    this.DataSetMode = DataSetMode.ListDataSet;     // dsMode
    this.SelectMode = SelectMode.MultiSelect;       // selMode
    this.DSDefined = new DataSet();                 // dsDefined
    this.StartsWithColumn = "";                     // startsWithColumn
    this.PrimaryTableName = "";                     // primaryTableName
    this.SearchName = "";                           // sNamedSearch
    this.SearchMethod = null;
    
    if (Mode == SearchMode.AutoSearch)              // pageSize
        this.PageSize = 0;
    else
        this.PageSize = 40;
        
//    this.CustomArgs = new ArrayList();              // customArgs  (should be Hashtable)
    this.CustomArgs = new Hashtable();
    
    this.set_iNamedSearch(NamedSearch.RuntimeFactory(new Hashtable(), this.DataSetMode));
    
    this.PreLoadSearchFilter = "";    
    this.Like;
    this.CurrentAdapter;
    this.AbsolutePage = 0;
    this.WhoCalledSearch = "";
    this.HasFormOptsNamedSearch = false;
    this.IsSubTable = false;
    this.Sender;
    this.SelectedKeys;                              // arrSelectedKeys
    this.SearchTitle = "";
    this.EpiBinding = "";
    this.SuppressAutoByCondition = false;
    this.SortByColumn = "";
    this.SortDescending=false;
    this.SubTableWhereClauses = null;
    this.HandlesQuickSearchResultsInAlternateSearch = false;
    this._events = {};
}
SearchOptions.prototype=new EpiObject();
SearchOptions.prototype.get_Event=function(eventName)
{
    if (eventName != "SearchMethod" && !this._events[eventName]) this._events[eventName] = new EpiEvent(eventName, this);
    return this._events[eventName];
}
SearchOptions.prototype.get_Like=function(){return this.Like;}
SearchOptions.prototype.set_Like=function(val){this.Like=val;}
SearchOptions.prototype.get_SearchMode=function(){return this.SearchMode;}
SearchOptions.prototype.get_NamedSearch=function(){return this.NamedSearch;}
SearchOptions.prototype.get_PageSize=function(){return this.PageSize;}
SearchOptions.prototype.set_PageSize=function(value){this.PageSize=value;}
SearchOptions.prototype.get_PrimaryTableName=function(){return this.PrimaryTableName;}
SearchOptions.prototype.set_PrimaryTableName=function(value){this.PrimaryTableName=value;}
SearchOptions.prototype.get_SearchName=function(){return this.SearchName;}
SearchOptions.prototype.set_SearchName=function(value){this.SearchName=value;}
SearchOptions.prototype.get_SearchTitle=function(){return this.SearchTitle;}
SearchOptions.prototype.set_SearchTitle=function(value){this.SearchTitle=value;}
SearchOptions.prototype.get_Sender=function(){return this.Sender;}
SearchOptions.prototype.set_Sender=function(value){this.Sender=value;}
SearchOptions.prototype.get_DSDefined=function(){return this.DSDefined;}
SearchOptions.prototype.set_DSDefined=function(value){this.DSDefined=value;}
SearchOptions.prototype.get_EpiBinding=function(){return this.EpiBinding;}
SearchOptions.prototype.set_EpiBinding=function(value){this.EpiBinding=value;}
SearchOptions.prototype.get_StartsWithColumn=function(){return this.StartsWithColumn;}
SearchOptions.prototype.set_StartsWithColumn=function(value){this.StartsWithColumn=value;}
SearchOptions.prototype.get_WhoCalledSearch=function(){return this.WhoCalledSearch;}
SearchOptions.prototype.set_WhoCalledSearch = function(value) { this.WhoCalledSearch = value; }
SearchOptions.prototype.get_AbsolutePage = function() { return this.AbsolutePage; }
SearchOptions.prototype.set_AbsolutePage=function(value){this.AbsolutePage=value;}
SearchOptions.prototype.get_SelectMode=function(){return this.SelectMode;}
SearchOptions.prototype.set_SelectMode=function(val){this.SelectMode=val;}
SearchOptions.prototype.get_PreLoadSearchFilter=function(){return this.PreLoadSearchFilter;}
SearchOptions.prototype.set_PreLoadSearchFilter=function(val){this.PreLoadSearchFilter=val;}
SearchOptions.prototype.get_SortByColumn=function(val){return this.SortByColumn;}
SearchOptions.prototype.set_SortByColumn=function(val){this.SortByColumn=val;}
SearchOptions.prototype.get_SortDescending=function(val){return this.SortDescending;}
SearchOptions.prototype.set_SortDescending=function(val){this.SortDescending=val;}
SearchOptions.prototype.get_HasFormOptsNamedSearch=function(val){return this.HasFormOptsNamedSearch;}
SearchOptions.prototype.set_HasFormOptsNamedSearch=function(val){this.HasFormOptsNamedSearch=val;}
SearchOptions.prototype.get_DataSetMode=function(val){return this.DataSetMode;}
SearchOptions.prototype.set_DataSetMode=function(val)
{
	if (val == this.DataSetMode) return;
    this.DataSetMode = val;
	if (this.NamedSearch != null && this.SearchName == "EpiRuntime")
	{
		this.NamedSearch.resetDataSetMode(this.DataSetMode);
	}
}
SearchOptions.prototype.set_iNamedSearch=function(value)
{
	this.NamedSearch = value;                           // oNamedSearch
	this.SearchName = this.NamedSearch.get_NamedSearchID();   // sNamedSearch
}
SearchOptions.prototype.SetQuickSearchEnabledAlternateSearchMethod=function(SearchMethod)
{
    // set the method and the flag
    this.SearchMethod = SearchMethod;
    this.HandlesQuickSearchResultsInAlternateSearch = true;
}
SearchOptions.CreateRuntimeSearch=function(whereClauses, ReturnMode)
{
	var runtimeOpts = new SearchOptions(SearchMode.AutoSearch);
	runtimeOpts.NamedSearch = NamedSearch.RuntimeFactory(whereClauses, ReturnMode);
	runtimeOpts.DataSetMode = ReturnMode;
	runtimeOpts.PageSize = 0;
	runtimeOpts.AbsolutePage = 0;
	runtimeOpts.SearchName = "EpiRuntime";
	return runtimeOpts;
}
SearchOptions.CreateSearchForm=function(ReturnMode)
{
	var srchFormOpts = new SearchOptions(SearchMode.ShowDialog);
	srchFormOpts.DataSetMode = ReturnMode;
	return srchFormOpts;
}
SearchOptions.CreateSubtableSearch=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_String":
            return SearchOptions.CreateSubtableSearch_1(a[0], a[1]);
            break;
        case "String_String_Hashtable":
            return SearchOptions.CreateSubtableSearch_2(a[0], a[1], a[2]);
            break;
    }
}
SearchOptions.CreateSubtableSearch_1=function(TableName, PrimaryColumn)
{
	var subTblOpts = new SearchOptions(SearchMode.ShowDialog);
	subTblOpts.NamedSearch = NamedSearch.RuntimeFactory(new Hashtable(), DataSetMode.RowsDataSet);
	subTblOpts.DataSetMode = DataSetMode.RowsDataSet;
	subTblOpts.StartsWithColumn = PrimaryColumn;
	subTblOpts.PrimaryTableName = TableName;
	subTblOpts.IsSubTable = true;
	return subTblOpts;
}
SearchOptions.CreateSubtableSearch_2=function(TableName, PrimaryColumn, WhereClauses)
{
	var subTblOpts = SearchOptions.CreateSubtableSearch_1(TableName, PrimaryColumn);
	subTblOpts.SubTableWhereClauses = WhereClauses;
	return subTblOpts;
}

var NamedSearch = Epicor.Mfg.UI.Searches.NamedSearch = function() 
{
    EpiObject.call(this, "NamedSearch");
    this.AutoSelect=false;
    this.id=null;
}
NamedSearch.prototype.get_NamedSearchID=function(){return this.id;}
NamedSearch.prototype.resetDataSetMode=function(dsMode)
{
	switch (dsMode)
	{
		case DataSetMode.ListDataSet:
			this.SearchDSMode = SearchDataSetMode.ListDataSet;
			break;
		case DataSetMode.RowsDataSet:
			this.SearchDSMode = SearchDataSetMode.RowsDataSet;
			break;
	}
}
NamedSearch.RuntimeFactory=function(WhereClauses,dsMode)
{
	var sdsMode;
	if (dsMode == DataSetMode.ListDataSet) 	{
		sdsMode = SearchDataSetMode.ListDataSet;
	} else {
		sdsMode = SearchDataSetMode.RowsDataSet;
	}
	
	return NamedSearch.Create("EpiRuntime", "RuntimeFactory", WhereClauses, sdsMode);
}
NamedSearch.Create=function(id, FormName, WhereClauses, dsMode)
{
	var ns = new NamedSearch();
	ns.WhereClauses = WhereClauses;  // whereClauses
	ns.SearchDSMode = dsMode;              // dsMode
	ns.id = id;		
	
	return ns;
}
NamedSearch.Factory=function(searchName)
{
	var ns = new NamedSearch();
	if (searchName.length < 1)
	{
		ns.WhereClauses = new Hashtable();
	} 
	else 
	{
		ns.WhereClauses = new Hashtable();
		ns.SearchDSMode = SearchDataSetMode.RowsDataSet;  // suitable default???
		ns.unpinCrit = false;
		ns.autoSelect = false;
	}
	return ns;
}

NamedSearch.LoadHashTables=function(ds)
{
	if (ds.Tables["NamedSearch"].Rows.length<1)
	{
		var thisNS = new NamedSearch();
		return thisNS;
	}

	var wc = new Hashtable();
	for (var ro in ds.Tables["WhereClause"].Rows)
	{
		ro = ds.Tables["WhereClause"].Rows[ro];
		wc.Add(ro["TableName"].toString(), ro["WhereClause"].toString());
	}

	var row = ds.Tables["NamedSearch"].Rows[0];
	var dsMode = SearchDataSetMode.ListDataSet;
	if (row["DataSetMode"].toString() == "RowsDataSet")
		dsMode = SearchDataSetMode.RowsDataSet;
	return NamedSearch.Create(row["NSId"].toString(),"", wc, dsMode);
}
var EpiSearchEngine = Epicor.Mfg.UI.Searches.EpiSearchEngine = function(Adapter) 
{
    EpiObject.call(this, "EpiSearchEngine");
    this.oAdapter = Adapter;
    this.HasWhereClauseException = false;
    this.MorePages = false;
    
}
EpiSearchEngine.PerformSearch=function(AdapterName, Mode, preFilter, sender)
{
    return EpiSearchEngine.InvokeSearch(AdapterName, Mode, false, false, preFilter, "", sender, new EpiOverloadedArgs("String_String_Boolean_Boolean_String_String_Object"));
}
EpiSearchEngine.InvokeSearch=function(AdapterName, opts)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    switch(overload)
    {
        case "String_SearchOptions":
            return EpiSearchEngine.invokeSearch(a[0], a[1]);
	        break;
	    case "String_String_Boolean_Boolean_String_String_Object":
	        var AdapterName = a[0];
	        var Mode = a[1];
	        var singleSelect = a[2];
	        var showForm = a[3];
	        var preFilter = a[4];
	        var like = a[5];
	        var sender = a[6];
	    
			var rtnMode = DataSetMode.ListDataSet;
			if (Mode.toUpperCase() == "ROWS") rtnMode = DataSetMode.RowsDataSet;

			var opts;
			if (showForm)
				opts = SearchOptions.CreateSearchForm(rtnMode);
			else 
			{
				var ht = new Hashtable();
				ht.Add("BaseList", preFilter);
				opts = SearchOptions.CreateRuntimeSearch(ht, rtnMode);
			}
			if (singleSelect) opts.SelectMode = SelectMode.SingleSelect;
			if (like.Length >0) opts.Like = like;

     		opts.Sender = sender;
     		// For some reason this check is not working: if (Global.InstanceOf(sender,"IEpiSearchPanel")) - _impl doesnt contain this interface even though its added in the constructor for the panel
     		if (!opts.Sender.Session && Global.InstanceOf(sender.get_TopLevelControl(),"EpiSearchBase"))
     		{
     		    opts.Sender = sender.get_TopLevelControl();
     		} 
            
            return EpiSearchEngine.invokeSearch(AdapterName, opts);
	        break;
    }
    
}
EpiSearchEngine.invokeSearch=function(AdapterName, opts)
{
    if(!opts.Sender)
    {
        if(opts.sender)
            opts.Sender = opts.sender;
        else 
            opts.Sender = Global.Form; 
    }
           
    var adapter = Global.GetAdapter(AdapterName,opts.Sender);
    Global.LoadProxyForAdapter(adapter,null,true);
    Global.SrchAdapter = adapter; // Used in EpiString.GetString, if that method is called before the search form is opened and Global.Form is set
    var dr = adapter.InvokeSearch(opts);
    var returnDS = null;
	if (dr == DialogResult.Abort)  // InvokeSearch should only send back Abort due to securtiy checks
	{
		FormFunctions.DialogConfirmed("AccessDenied");
	}
	else if (dr == DialogResult.Cancel)
	{
		returnDS = null;
	}
	else
	{
		returnDS = adapter.GetCurrentDataSet(opts.DataSetMode);
	}
	Global.SrchAdapter = null;
    return returnDS;
}
EpiSearchEngine.prototype.SetBAQMorePages=function(morePages)
{
    this.MorePages = morePages;
}
EpiSearchEngine.prototype.ShowDialog = function(SearchForm, opts)
{
    //Check to see if the session is still active before open the search
    doVantageSoapCall('lib_SessionService', 'IsThereAnActiveSession(2)', [], [], []);

    if(SearchForm.DialogProps)
    {
	    SearchForm.DialogProps.push("ReturnDataSet");
	    SearchForm.get_ReturnDataSet=function()
	    {
	        return SearchForm.DialogPropVals["ReturnDataSet"];
	    }
    }

	opts.CurrentAdapter = this.oAdapter;
	SearchForm.SearchName = opts.SearchName;

	//Cancel if there is invalid Search Name
	if(FormTestManager)
	{
		if(!FormTestManager.ValidateSearchName(SearchForm.Assembly + "." + SearchForm.Name + ".aspx")) 
			return DialogResult.Cancel;
	}

	var dr;
	dr = SearchForm.ShowDialog(this, opts);
	if (dr == DialogResult.OK)
	{
		var resultSet = SearchForm.get_ReturnDataSet();
		this.oAdapter.LoadUserResults(resultSet, opts);
	} 
	else 
	{
		// do we clear out the List DS????
	}
	return dr;
}
EpiSearchEngine.prototype.verifyWhereClause=function(opts)
{
	if (opts.CurrentAdapter == null) return true;

	if (opts.NamedSearch.WhereClauses == null ||
		opts.NamedSearch.WhereClauses.Count<=0) return true;

    var tbl = "BaseList";
    var dataTable = null;
	try
	{
		if (opts.DataSetMode != DataSetMode.ListDataSet)
		{
			tbl = opts.PrimaryTableName;
			dataTable = opts.CurrentAdapter.GetCurrentDataSet(opts.DataSetMode).get_Table(tbl);
		}
		else
		{
			dataTable = opts.CurrentAdapter.GetCurrentDataSet(opts.DataSetMode).get_Table(0);
		}
	}
	catch (ex)
	{
//		TraceProvider.TraceCatchException(ex);
		return false; 
	}

	if (!opts.NamedSearch.WhereClauses.ContainsKey(tbl)) return true;

    var wc = opts.NamedSearch.WhereClauses[tbl];
	if (wc.length <=0) return true;

	wc = wc.toUpperCase();
	wc = wc.Replace(" AND ", " \n ");
	wc = wc.Replace(" OR ", " \n ");
    var wcConds = wc.Split('\n');
	for (var i=0; i<wcConds.length; i++)
	{
        var tmpWc = wcConds[i];
		if (tmpWc.StartsWith("BY "))
			tmpWc = String.Empty;
		if (tmpWc.indexOf(" BY ")>-1)
			tmpWc = tmpWc.substring(0, tmpWc.indexOf(" BY "));

		if (tmpWc.StartsWith("LOOKUP"))
			tmpWc = String.Empty;

		if (tmpWc.StartsWith("NOT"))
			tmpWc = String.Empty;

		if (tmpWc.length>0 && dataTable != null)
		{
			try
			{
//TODO				if (!EpiWhereClause.VerifyWhereClause(tmpWc, dataTable)) return false;
			} 
			catch (ex) 
			{
				ExceptionBox.Show(ex);
				return false;
			}
		}
	}

	return true;
}
EpiSearchEngine.prototype.addByConditionToWhereClause=function(opts)
{
	if (opts.SuppressAutoByCondition) return;
    var tbl = "BaseList";
	if (opts.DataSetMode != DataSetMode.ListDataSet)
		tbl = opts.PrimaryTableName;

	if (!opts.NamedSearch.WhereClauses.ContainsKey(tbl)) return;
	
	if (opts.StartsWithColumn.length<=0 && opts.SortByColumn.length<=0) return;
    var wc = opts.NamedSearch.WhereClauses[tbl];
	if (wc.toUpperCase().indexOf(" BY ")>=0) return;
	if (this.isCalculatedColumn(opts)) return;

	if (opts.SortByColumn.length>0)
		wc = wc + " BY " + opts.SortByColumn;
	else if (opts.StartsWithColumn.length>0)
		wc = wc + " BY " + opts.StartsWithColumn;
	if (opts.SortDescending) wc += " DESC";
	
	opts.NamedSearch.WhereClauses.set_Item(tbl,wc);
}
EpiSearchEngine.prototype.isCalculatedColumn=function(opts)
{
    var c = opts.StartsWithColumn;
	if (opts.SortByColumn.length>0) c = opts.SortByColumn;

    var tbl = opts.DSDefined.get_Table(0);
	if (opts.DataSetMode != DataSetMode.ListDataSet)
	{
		if (!opts.DSDefined.Tables[opts.PrimaryTableName]) return true;
		tbl = opts.DSDefined.Tables[opts.PrimaryTableName];
	}

	if (!tbl.Columns[c]) return true;
	
	var retVal = false;
	var extVal = tbl.GetExtendedProperty(c,"External");
	if(extVal!="") return Convert.ToBoolean(extVal);

	return false;
}
EpiSearchEngine.prototype.SearchIt=function(opts,dsList,epiArgs) // These parameters have been added intentionally, do not remove
{
    var result;
    var usedAdapter=false;
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "SearchOptions":
        default:
            result= this.SearchIt_1(a[0]);
            usedAdapter = Global.ArgManager["Out1"];
            Global.ArgManager["Out1"]= null;
            if (usedAdapter) this.SetExtendedPropertiesOnSearchResults(result);
            break;
       
        case "SearchOptions_DataSet":
            result = this.SearchIt_1(a[0]);
            dsList.Clear();
            dsList.Merge(result, true, MissingSchemaAction.Ignore,new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));
            usedAdapter = Global.ArgManager["Out1"];
            Global.ArgManager["Out1"]= null;
            if (usedAdapter)
            {
                 // The DataSetName is use to determine which ExtendedProperties to use so we have to make
                // sure the DataSetName is the one from the adapter.
                dsList.DataSetName = result.DataSetName;
                this.SetExtendedPropertiesOnSearchResults(dsList);
            }
            break;
     }
     
     return result;
}
EpiSearchEngine.prototype.SearchIt_1=function(opts)
{
	opts.CurrentAdapter = this.oAdapter;
    var resultSet = new DataSet();
    var sdsMode = opts.NamedSearch.SearchDSMode;
    this.HasWhereClauseException = false;

	if (opts.SearchMode == SearchMode.AutoSearch)
	{
		if (opts.DataSetMode == DataSetMode.ListDataSet) sdsMode=SearchDataSetMode.ListDataSet;
		if (opts.DataSetMode == DataSetMode.RowsDataSet) sdsMode=SearchDataSetMode.RowsDataSet;
	} 

// TODO AlternateSearchMethod
var morePages;
	if (opts.SearchMethod != null)
	{
	    Global.ArgManager["Out1"] = true; // usedAdapter
	    var ds = opts.SearchMethod(opts, morePages,"json", "", new EpiOverloadedArgs("SearchOptions_Boolean"));
        this.MorePages=Global.ArgManager["Out1"];
		resultSet.Merge(ds,new EpiOverloadedArgs("DataSet"));
	} 
	else 
	{
		if (!this.verifyWhereClause(opts)) 
		{
			this.HasWhereClauseException = true;
			return new DataSet();
		}
        this.addByConditionToWhereClause(opts);
        
        
		if (sdsMode == SearchDataSetMode.ListDataSet)
        {
            var ds = this.oAdapter.GetList(opts, morePages,"json", "");
            this.MorePages=Global.ArgManager["Out1"];
			resultSet.Merge(ds,new EpiOverloadedArgs("DataSet"));
		} 
		else 
		{
		    var ds = this.oAdapter.GetRows(opts, morePages,null,null,new EpiOverloadedArgs("SearchOptions_Boolean"));
		    this.MorePages=Global.ArgManager["Out1"];
			resultSet.Merge(ds,new EpiOverloadedArgs("DataSet"));
		}
	}

	return resultSet;
}
EpiSearchEngine.prototype.SetExtendedPropertiesOnSearchResults=function(ds)
{
    if (!ds || !ds.Tables) return;
   // Apply extended properties.
   for (var tbl in ds.Tables)
   {
     tbl = ds.Tables[tbl];
     tbl._initProps();
   }
}
EpiSearchEngine.ApplyAutoSearchFilter=function(opts)
{
    // DontUsePreLoadSearchFilter is set in EpiBaseForm._runSearchOnLoad for ARInvoiceUpdEntry only
	if (opts.PreLoadSearchFilter.length > 0 && !opts.DontUsePreLoadSearchFilter)
	{
		if (!opts.NamedSearch.WhereClauses.ContainsKey(opts.PrimaryTableName))
			opts.NamedSearch.WhereClauses.Add(opts.PrimaryTableName, "");
		if (!opts.NamedSearch.WhereClauses.ContainsKey("BaseList"))
			opts.NamedSearch.WhereClauses.Add("BaseList", "");
		var w = opts.NamedSearch.WhereClauses[opts.PrimaryTableName].toString();
		var wByClawz = "";
		var wByIdx = w.toUpperCase().indexOf(" BY ");
		if (wByIdx >=0)
		{
			wByClawz = " " + w.substring(wByIdx+1);
			w = w.substring(0, wByIdx);
		}
		var wAnd="";
		var bAnd="";
		if (w.length>0) wAnd = " AND ";

		if (w.toUpperCase().indexOf(opts.PreLoadSearchFilter.toUpperCase())<0)
			opts.NamedSearch.WhereClauses.set_Item(opts.PrimaryTableName,w + wAnd + opts.PreLoadSearchFilter + wByClawz);

		var b = opts.NamedSearch.WhereClauses["BaseList"].toString();
		var bByClawz = "";
		var bByIdx = b.toUpperCase().indexOf(" BY ");
		if (bByIdx >=0)
		{
			bByClawz = " " + b.substring(bByIdx+1);
			b = b.substring(0, bByIdx);
		}
		if (b.length>0) bAnd = " AND ";
		if (b.toUpperCase().indexOf(opts.PreLoadSearchFilter.toUpperCase())<0)
			opts.NamedSearch.WhereClauses.set_Item("BaseList", b + bAnd + opts.PreLoadSearchFilter + bByClawz);
	}
	return opts;
}
EpiSearchEngine.prototype.Show=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "Non-modal dialogs are not implemented.", new EpiOverloadedArgs("String_Details"));
}
//-------------------------------
// SearchResults
//-------------------------------
var SearchResults = Epicor.Mfg.UI.Searches.SearchResults = function(dialogResult,data) 
{
    EpiObject.call(this,"SearchResults");
    this.Data = data;
    this.DialogResult = dialogResult;
}
SearchResults.prototype=new EpiObject();

//-------------------------------
// SearchWorker
//-------------------------------
var SearchWorker = Epicor.Mfg.UI.Searches.SearchWorker = function() 
{
    EpiObject.call(this,"SearchWorker");
}
SearchWorker.prototype=new EpiObject();
SearchWorker.prototype.GetDataSet=function(Sender, Like, preFilter)
{
    if(!preFilter) preFilter = String.Empty;

    var pKey = SearchWorker.getBaseSearchProcess(Like);
	if (pKey.length <= 0) return null;

	var adapt = pKey.Substring(0, pKey.IndexOf('.'));
    var mode = pKey.Substring(pKey.IndexOf('.') + 1);

	return ProcessCaller.LaunchSearch(Sender, adapt, mode, true, true, Like, preFilter,new EpiOverloadedArgs("Object_String_String_Boolean_Boolean_String_String"));
}
SearchWorker.HandleMultiSelectQuickSearch=function(select, cmb, pKey)
{
    var EpiX;
    if(cmb.Sender instanceof EpiTransaction)
        EpiX = cmb.Sender;
    else
        EpiX = Global.Form.trans;

	try
	{
        var adapterName = pKey.Substring(0, pKey.IndexOf("."));
        var mode = pKey.Substring(pKey.IndexOf(".") + 1);
        
		if (adapterName.StartsWith("Epicor.Mfg.AD."))
			adapterName.Replace("Epicor.Mfg.AD.", "");
			
		if (adapterName.EndsWith(".dll"))
			adapterName.Replace(".dll", "");
			
        var adapter = Global.GetAdapter(adapterName,EpiX);
        Global.LoadProxyForAdapter(adapter,null,true);
        adapter.BOConnect();

		var workOpts = SearchOptions.CreateRuntimeSearch(null, DataSetMode.ListDataSet);
		workOpts.Like = cmb.Like;
		workOpts.DataSetMode = DataSetMode.ListDataSet;
		if (mode.toUpperCase() == "ROWS")
			workOpts.DataSetMode = DataSetMode.RowsDataSet;

		workOpts.CurrentAdapter = adapter;
		SearchWorker.RebuildWhereClauses(select, workOpts);
		
		if(adapter.InvokeSearch)
		{
		    adapter.InvokeSearch(workOpts);
		}
	}
	catch (ex)
	{
	}
}
SearchWorker.RebuildWhereClauses=function(al, opts)
{
    var wClawz = new Hashtable();
	for (var t in opts.CurrentAdapter.get_TableNames().items)
	{
	    t = opts.CurrentAdapter.get_TableNames().items[t];
		wClawz.Add(t, "");
	}
	wClawz.Add("BaseList", "");

    var like = opts.Like;
    var tNam = like.substring(0, like.IndexOf("."));
    var cNam = like.substring(like.IndexOf(".")+1);
    var isearch = opts.CurrentAdapter;
	if (isearch != null)
	{
		tNam = isearch.get_PrimaryTableName();
		cNam = isearch.get_PrimaryColumnName();
	}

    var quoteDelim = "'";
	if (opts.DSDefined != null &&
		opts.PrimaryTableName != null &&
		opts.PrimaryTableName.length > 0 &&
		opts.DSDefined.Tables[opts.PrimaryTableName] &&
		opts.DSDefined.Tables[opts.PrimaryTableName].Columns[cNam])
	{
		switch (opts.DSDefined.Tables[opts.PrimaryTableName].Columns[cNam].DataType)
		{
			case "System.Boolean":
			case "System.Int16":
			case "System.Int32":
			case "System.Int64":
			case "System.Decimal":
			case "System.Double":
			case "System.UInt16":
			case "System.UInt32":
			case "System.UInt64":
				quoteDelim = "";
				break;
		}
	}

    var prefix = "(";
    var suffix = ")";
    var idList = "";
    var comma = "";
    var iEnum = al.GetEnumerator();
	while (iEnum.MoveNext())
	{
        var s = iEnum.Current.toString();
		idList = idList + comma + cNam + " = " + quoteDelim + s + quoteDelim;
		comma = " OR ";
	}

	wClawz["BaseList"] = prefix + idList + suffix;
	if (!wClawz.ContainsKey(tNam) && opts.PrimaryTableName != null && tNam != opts.PrimaryTableName)
		tNam = opts.PrimaryTableName;
				
	if (wClawz.ContainsKey(tNam))
	{
		wClawz[tNam] = prefix + idList + suffix;
	}

	if (opts.DataSetMode == DataSetMode.ListDataSet)
		opts.set_iNamedSearch(NamedSearch.Create("EpiRuntime", 
			opts.SearchName, wClawz, SearchDataSetMode.ListDataSet));
	else 
		opts.set_iNamedSearch(NamedSearch.Create("EpiRuntime", 
			opts.SearchName, wClawz, SearchDataSetMode.RowsDataSet));
	opts.SelectedKeys = al;
}
SearchWorker.getBaseSearchProcess=function(Like)
{
   var sProc = "";
	
   if (!ECTM.ContextMenuData) ECTM.GetContextMenuXml();

   var contextM = ECTM.ContextMenuData[Like];
   if (contextM != undefined)
   {
        if (contextM.MenuItems)
        {
            var menuProcess, menuText,menuType;
            for (var i=0,menuItem;menuItem=contextM.MenuItems[i];i++)
            {   
                menuProcess = menuItem["ProcessCall"];
                menuText= menuItem["Name"];
                menuType = menuItem["ProcessType"];
                if (menuType == "BaseSearch")
                {
                    sProc = menuProcess;
                    break;
                }
            }
        }
   }
	return sProc;
}

var Startup=Epicor.Mfg.UI.Startup=
{
    "PreStart":function(){},
    "InitializeContextMenu":function(){}
}

var QueueType = {"ControlProperty":0,"Variable":1,"Function":2};
function LaunchEngineTrans() {}
LaunchEngineTrans.prototype = new EpiObject();
LaunchEngineTrans.prototype.set_AutomateAttachments=function() {}
function LaunchEngineForm()
{
    EpiObject.call(this,"LaunchEngineForm");
    this.GlobalObject = null;
    this.Args = [];
    this.Variables = {};
    this.DialogControls = [];
    this.DialogProps = [];
    this.DialogQueue = [];
    this.DialogPropVals = {};
    this.DialogControlVals = {};
    this.Name = "LaunchEngineForm";
    this.IsLaunch = false;
    this.DialogResult = DialogResult.None;
    this.ArgsInUrl = {};
}
LaunchEngineForm.prototype = new EpiObject();
LaunchEngineForm.Concat=function(obj,dialogProps,variables,controls)
{
    if(!obj.DialogProps) obj.DialogProps=[];
    for(var i in dialogProps)
    {
        var found=false;
        for(var j in obj.DialogProps)
        {
            if(obj.DialogProps[j]==dialogProps[i])
            {
                found=true;
                break;
            }
        }
        if(!found) obj.DialogProps.push(dialogProps[i]);
    }
    
    if(!obj.Variables) obj.Variables={};
    for(var v in variables)
    {
        if(!obj.Variables[v]) obj.Variables[v]=variables[v];
    }
    
    if(!obj.DialogControls) obj.DialogControls=[];
    for(var i in controls)
    {
        var found=false;
        for(var j in obj.DialogControls)
        {
            if(obj.DialogControls[j]==controls[i])
            {
                found=true;
                break;
            }
        }
        if(!found) obj.DialogControls.push(controls[i]);
    }
}
LaunchEngineForm.prototype.set_DisplayAddButton=function(){}
LaunchEngineForm.prototype.get_DialogResult=function()
{
    return this.DialogResult;
}

// This method is usually called to either subscribe or unsubscribe
LaunchEngineForm.prototype.get_Event=function(eventN)
{
    var lEngine = this;
    var newEvent = 
    {
        "EventName": eventN,
        "subscribe":function(fn, obj, bOverride)
        {
            var args=[];
            args[0] = this.EventName;
            for(var i=0;i<=arguments.length-1;i++){args.push(arguments[i]);}
            lEngine.CallFunction("SubscribeEvent", args);
        }, 
        "unsubscribe":function(){}
    };
    return newEvent;
}
LaunchEngineForm.prototype.GetType=function()
{
    var t = new System.Type();
    t.Name = this._type;
    
    if(this._assembly) 
        t.Assembly = Global.Assemblies[this._assembly];        
    
    return t;
}
LaunchEngineForm.GetFormSettings=function(assembly, form)
{
    var formInfo;
    var formInfoScript = Global.GetScript("script/" + assembly + "/AssemblySettings.js");
    if(formInfoScript!="")
    {
        eval(formInfoScript);
        formInfo = AssemblyFormInfo[form];
    }
    
    if(!formInfo) formInfo = {"Width":300,"Height":300};
    
    return formInfo;
}
LaunchEngineForm.prototype.ShowFormDialog = function(args)
{   
    this.LaunchFormOpts = args;
    if (Global.psuedoLaunchCalling) 
    {
        Global.launchForm = this;
        return;
    }
    
    
    if (args.showAsModal == true) args.IsModal = true;
    
    if(!args.IsModal)
    {
        var formInfo = LaunchEngineForm.GetFormSettings(this.Assembly, this.Name);
    
        var url=this.ASPX+".aspx";

        this._setParentMenuID();
        
        LaunchEngine.ArgsInUrl=this.ArgsInUrl;
        LaunchEngine.OpenForm(url,this,formInfo);
    }
    else
    {
        this.LaunchFormOpts.IsLaunch = true;
        return this.ShowDialog();
    }
}
LaunchEngineForm.prototype.Show = function(OwnerForm)
{    
//   this.LaunchFormOpts = args;
//   this.LaunchFormOpts.IsLaunch = true;
//   return this.ShowDialog();
    var formInfo = LaunchEngineForm.GetFormSettings(this.Assembly, this.Name);
    if (!this.ASPX)
        this.ASPX = this.Assembly + "." + this.Name;
    var url=this.ASPX+".aspx";
    this.LaunchFormOpts = {"Sender":OwnerForm};
    this.uiReflector = new UIReflector(OwnerForm, this.ASPX, this.LaunchFormOpts);
    this._setParentMenuID(OwnerForm);
        
    LaunchEngine.ArgsInUrl=this.ArgsInUrl;
    LaunchEngine.OpenForm(url,this,formInfo);
}
LaunchEngineForm.prototype.GetDialogPropVal=function(prop,dsType)
{
    var val="";

    if(((this.DialogPropVals[prop]==null || this.DialogPropVals[prop] == "") && this.DialogPropVals[prop]!=false))
    {
        if(dsType)
        {
            try
            {
                var theType=eval(dsType);
                val=new theType();
                this.DialogPropVals[prop]=val;
                
                this["set_"+prop](val);
            }
            catch(err){}
        }
        else if(this.Name==Global.Form.Name)
        {
            try
            {
                if(Global.Form["get_"+prop])
                {
                    val=Global.Form["get_"+prop]();
                }
            }
            catch(err){}
        }
        else if(prop=="Height"||prop=="Width")
        {
            var formInfo=LaunchEngineForm.GetFormSettings(this.Assembly, this.Name);
            var offsets=BrowserHelper.GetFormSizeOffsets();
            if(formInfo)
            {
                if(prop=="Height") 
                    val=formInfo.Height+offsets.HeightOffset;
                else    
                    val=formInfo.Width+offsets.WidthOffset;
            }
        }
    }
    else
    {
        val = this.DialogPropVals[prop];
    }
    return val;
}
// If the form being launched is in the same assembly, pass the menuid of the parent to the server. this will be used to check
// for customizations
LaunchEngineForm.prototype._setParentMenuID = function(ownerForm)
{
    var sender = ownerForm;
    if (!sender)
    {
     if(this.LaunchFormOpts && this.LaunchFormOpts.Sender 
        && Global.InstanceOf(this.LaunchFormOpts.Sender,"EpiBaseForm"))
            sender = this.LaunchFormOpts.Sender;
    }
    
    if (sender && this.Assembly == sender._assembly)
    {
        var ds = sender.get_MenuItemDS();
        if (ds)
        {
            var menuID = ds.get_Table(0).Rows[0]["MenuID"];
            if (menuID)
                this.ArgsInUrl["menuID"] = menuID;
        }
    }
    else if(this.LaunchFormOpts && this.LaunchFormOpts.MenuID) // If form is being launched from a different assembly, see if we could retrieve the menuid for the launched form.
    {
        this.ArgsInUrl["menuID"] = this.LaunchFormOpts.MenuID;
    }
}

LaunchEngineForm.prototype.ShowDialog = function()
{
    if (this.Assembly != "UI.EpiClientLib" && this.Name != "MessageBoxForm") 
        doVantageSoapCall('lib_SessionService', 'IsThereAnActiveSession(2)', [], [], []);

    if(this._type=="Epicor.Mfg.Shared.CCEntryDialog.CCEntryForm")
    {
        //redirect
        this.Assembly="UI.EpiClientLib";
        LaunchEngineForm.Concat(window.CCEntryForm,[],{},["txtName","cmbCreditCard","estbCCNumber","cmbExpMonth","numExpYear","estbCSCID"]);
    }

    var formInfo = LaunchEngineForm.GetFormSettings(this.Assembly, this.Name);

    if(!this.LaunchFormOpts)
        this.LaunchFormOpts = this.Args;
    
    this._setParentMenuID();
    
    var url = this.Assembly + "." + this.Name + ".aspx";
    if(FormTestManager) url = url + "?isTester=true";
    
    var argChar = (url.indexOf('?') > 0 )? "&" : "?";
    if (Global.ServerSession && Global.ServerSession.CurrentUserInfo)
    {
		url = url + argChar + "UserInfo=" + Global.ServerSession.CurrentUserInfo;
    }
    if (this.ArgsInUrl)
    {        
        argChar = (url.indexOf('?') > 0 )? "&" : "?";
        for(var key in this.ArgsInUrl)
        {
            url = url + argChar + key + "=" + this.ArgsInUrl[key];
        }
    }

    this.PrepareForDialog();
    var dialogArgs = {"LaunchObj":this,"DialogQueue":this.DialogQueue,"DialogProps":this.DialogProps,"DialogControls":this.DialogControls,"Opener":Global.window};

    var showDlgArgs = [];
    for(var i=0,a; a=arguments[i]; i++) {showDlgArgs.push(a);}
    if(showDlgArgs.length>0) dialogArgs["ShowDialogArgs"]=showDlgArgs;    
    var retVal;

    if(BrowserSniffer.IE||BrowserSniffer.FireFox15)
    {
        var sFeatures = "toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
        if(Global.GetBrowserVersion()=="7.0")
        {
            sFeatures = "dialogHeight:" + (formInfo.Height-34) + "px; dialogWidth:" + (formInfo.Width-10) + "px;" + sFeatures;
        }
        else
        {
            sFeatures = "dialogHeight:" + (formInfo.Height) + "px; dialogWidth:" + (formInfo.Width-10) + "px;" + sFeatures;
        }

        var result = showModalDialog(url, dialogArgs, sFeatures);

        if(!this.LaunchFormOpts.IsLaunch)
        {
            this.ProcessReturn(dialogArgs);
            retVal = this.DialogResult = dialogArgs.DialogResult;
        }
        else
        {
            retVal = dialogArgs.ReturnObject;
            this.DialogResult = dialogArgs.DialogResult;
        }
    }
    else
    {
		if(BrowserSniffer.Safari13)
		{
			if(!BrowserSniffer.SafariMobile)
			{
				var sFeatures = "toolbar:no;menubar:no;scrollbars:no;scroll:no;status:no;help:no;resizable:yes";
				sFeatures = "dialogHeight:" + (formInfo.Height) + "px; dialogWidth:" + (formInfo.Width + 20) + "px;" + sFeatures;
					
				var prevArguments = Global.DialogArguments;
				Global.DialogArguments = dialogArgs;
				var result = Global.window.showModalDialog(url, dialogArgs, sFeatures);

				if ((this.LaunchFormOpts.IsLaunch == null) || (!this.LaunchFormOpts.IsLaunch))
			    {
			        this.ProcessReturn(Global.DialogArguments);
			        retVal = this.DialogResult = Global.DialogArguments.DialogResult;
			    }
			    else
			    {
			        retVal = Global.DialogArguments.ReturnObject;
			        this.DialogResult = Global.DialogArguments.DialogResult;
			    }
				Global.DialogArguments = prevArguments;
			}
			else
			{
				alert("This feature is not implemented at this time.");
				return retVal;
			}
		}
    }
    
    if(Global.Form && Global.Form.trans)
    {
        Global.Form.trans.set_EpiBaseForm(Global.Form);
    }
    
    return retVal;
}
LaunchEngineForm.prototype.PrepareForDialog=function(dialogArgs)
{
    // Prepare variables
    for(var vrbl in this.Variables)
    {
        if(this.Variables[vrbl]!=null)
        {
            this.DialogQueue.push({"QueueType":QueueType.Variable, "Name":vrbl, "Value":this.Variables[vrbl]});
        }
    }
}
LaunchEngineForm.prototype.ProcessReturn=function(dialogArgs)
{
    this.GlobalObject = dialogArgs.DialogObject;
    this.DialogPropVals = dialogArgs.DialogPropVals;
    this.DialogControlVals = dialogArgs.DialogControlVals;
    
    for(var vrbl in this.Variables)
    {
        this.Variables[vrbl] = null;
        this[vrbl] = this.GlobalObject.Form[vrbl];
    }

    if(this._type=="Epicor.Mfg.Shared.CCEntryDialog.CCEntryForm")
    {
       for(var c in this.DialogControlVals)
       {
            this[c]=this.GetControl(c);
       }
    }
    
    this.DialogQueue = [];
    this.GlobalObject = null;
}
LaunchEngineForm.prototype.set_IsEpiReadOnly=function(val)
{
    this.CallFunction("set_IsEpiReadOnly", [val]); 
}
LaunchEngineForm.prototype.get_Text=function() {return ""};
LaunchEngineForm.prototype.set_Text=function(txt)
{
    this.CallFunction("set_Text", [txt]); // for trans;   
}
LaunchEngineForm.prototype.set_HelpLinkAlternateName=function(name)
{
    this.CallFunction("set_HelpLinkAlternateName", [name]); // for trans;   
}
LaunchEngineForm.prototype.set_COACode=function(val)
{
    this.CallFunction("set_COACode", [val]);   
}
LaunchEngineForm.prototype.CallFunction=function(fnName, args)
{
    var retVal;
    var cacheFlg = false;
    var done=false;
    if(this.GlobalObject)
    {
        try
        {
            retVal = Global.CallWithArgs(this.GlobalObject.Form, fnName, args);
        }
        catch(err)
        {
            cacheFlg = true;   
        }        
    }
    else if (Global.Form!=null && Global.Form.Name == this.Name && Global.Form.FormLoaded)
    {
        retVal = Global.CallWithArgs(Global.Form, fnName, args);
        done=true;
    } 
    else if (this.uiReflector && this.uiReflector.UIForm)
    {
        if (!this.uiReflector.UIForm.InParentCallBack)
            retVal = this.uiReflector.InvokeUIMethod(fnName,args);
        else
            this.uiReflector.CacheUICall(fnName,args); // UIForm will call back after the parent call is done to purge this Q
    }
    if((!this.GlobalObject || cacheFlg)&&!done)
    {
        this.DialogQueue.push({"QueueType":QueueType.Function, "Name":fnName, "Args":args});
    }
    return retVal;
}
LaunchEngineForm.prototype.GetControl=function(ctrlID)
{
    return new DialogControl(this, ctrlID);
}
LaunchEngineForm.prototype.SetControlProperty=function(ctrlID, property, val)
{
    this.DialogQueue.push({"QueueType":QueueType.ControlProperty, "ID":ctrlID, "Property":property, "Value":val});
}
LaunchEngineForm.prototype.GetControlProperty=function(ctrlID, property)
{
    var val;
    
    if(this.DialogControlVals && this.DialogControlVals[ctrlID])
    {
        if(property==PropertyType.ReadOnly)
        {
            val = !this.DialogControlVals[ctrlID].DialogControls[Enum.ToString(PropertyType.Enabled,PropertyType)];
        }
        else
        {
                property = Enum.ToString(property,PropertyType);
            val = this.DialogControlVals[ctrlID].DialogControls[property];
        }
    }
    
    return val;    
}
LaunchEngineForm.prototype.Dispose=function()
{
    EpiObject.prototype.Dispose.call(this);
    for(var vrbl in this.Variables)
    {
        this[this.Variables[vrbl]] = null;
    }
    this.DialogQueue = [];
    this.GlobalObject = null;
}
// TEMP start ----------------
LaunchEngineForm.prototype.ClearEpiSearchColumns=function()
{
    var args = [];
    for(var i=0,a; a=arguments[i]; i++) {args.push(a);}
    this.CallFunction("ClearEpiSearchColumns", args)
}
LaunchEngineForm.prototype.SetEpiSearchColumn=function()
{
    var args = [];
    for(var i=0,a; a=arguments[i]; i++) {args.push(a);}
    this.CallFunction("SetEpiSearchColumn", args)
}
// TEMP end ------------------

var BasicSearchForm = Epicor.Mfg.UI.Searches.BasicSearchForm = function()
{
  LaunchEngineForm.call(this);
  for(var i=0,a; a=arguments[i]; i++) {this.Args.push(a);}
  this.Assembly='UI.EpiClientLib';
  this.Name='BasicSearchForm';
}
BasicSearchForm.prototype = new LaunchEngineForm();
BasicSearchForm.prototype.get_Name = function()
{
    return this.name;
}

var EpiSearchColumn = Epicor.Mfg.UI.Searches.EpiSearchColumn = function() 
{
    EpiObject.call(this, "EpiSearchColumn");

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_String_Int32_Boolean_Int32":
            this.InitColumn("", a[0], a[1], a[2], a[3], a[4]); break;
        case "String_String_Int32_Boolean":
            this.InitColumn("", a[0], a[1], a[2], a[3], -1); break;
        case "String_String_Int32":
            this.InitColumn("", a[0], a[1], a[2], false, -1); break;
        case "String_String_Int32_Int32":
            this.InitColumn("", a[0], a[1], a[2], false, a[3]); break;
        case "String_String_Boolean":
            this.InitColumn("", a[0], a[1], -1, a[2], -1); break;
        case "String_Boolean":
            this.InitColumn("", a[0], "", -1, a[1], -1); break;
        case "String_Int32":
            this.InitColumn("", a[0], "", a[1], false, -1); break;
        case "String_Int32_Int32":
            this.InitColumn("", a[0], "", a[1], false, a[2]); break;
        case "String":
            this.InitColumn("", a[0], "", -1, false, -1); break;
        case "String_String":
            this.InitColumn(a[0], a[1], "", -1, false, -1); break;
        case "String_String_String_Boolean":
            this.InitColumn(a[0], a[1], a[2], -1, a[3], -1); break;
        case "String_String_String_Int32":
            this.InitColumn(a[0], a[1], a[2], a[3], false, -1); break;
        case "String_String_String_Int32_Boolean":
            this.InitColumn(a[0], a[1], a[2], a[3], a[4], -1); break;
        case "String_String_String_Int32_Boolean_Int32":
            this.InitColumn(a[0], a[1], a[2], a[3], a[4], a[5]); break;
    }
}
EpiSearchColumn.prototype.InitColumn=function(TableName, ColumnName, ColumnCaption, ColumnWidth, IsResult, ColumnPosition)
{
    if(!ColumnCaption) ColumnCaption = ColumnName;

    this.ColumnName = ColumnName;
    this.ColumnCaption = ColumnCaption;
    this.ColumnWidth = ColumnWidth;
    this.TableName = TableName;
    this.IsSearchResultColumn = IsResult;
    this.ColumnPosition = ColumnPosition;
}

// ----------  Epicor.Mfg.Core
var Session = Epicor.Mfg.Core.Session = function() 
{
    EpiObject.call(this, "Session");

    this.ProductCode = Global.ServerSession.ProductCode;
    this.UserID = Global.ServerSession.UserID; //gVNUsername
    this.UserName=this.UserID; 
    this.PlantID = Global.ServerSession.PlantID;
    this.PlantName = Global.ServerSession.PlantName;
    this.CompanyID = Global.ServerSession.CompanyID;
    this.CompanyName = Global.ServerSession.CompanyName;
    this.LanguageID = Global.ServerSession.LanguageID;
    this.EmployeeID = Global.ServerSession.EmployeeID;
    this.UOMGlobalID = Global.ServerSession.UOMGlobalID;
    this.UOMInfoList = Global.ServerSession.UOMInfoList;
    this.CurrencyCodes=Global.ServerSession.CurrencyCodes;
    this.CurrencyInfoList=Global.ServerSession.CurrencyInfoList;
    this.Client=Session.ClientType.Default;
    this.ModuleAccess=Global.ServerSession.ModuleAccess;
    this.CountryCode = Global.ServerSession.CountryCode;
    this.AppServer = Global.ServerSession.AppServer;
    this.data = new Hashtable();

    this.FormatCultureName=Global.ServerSession.FormatCultureName;
    var ci = Global.ServerSession.FormatCultureInfo;
    ci.Calendar = new Calendar();
    
    try
    {
        Globalization.Cultures[this.FormatCultureName.toLowerCase()] = ci;
    }
    catch(err){}

    this.MenuDataSet; // member
    this.WorkstationID = "";
    this.GLLib = null;

}
var ClientType=Session.ClientType={"Default":0,"Mes":1,"Handheld":2};
Session.Module={"AP":0,"AM":1,"AR":2,"AV":3,"BM":4,"CM":5,"CR":6,"CC":7,"AIM":8,"FA":9,"DE":10,"EQ":11,
    "ES":12,"ED":13,"FS":14,"GL":15,"IM":16,"JC":17,"MS":18,"MR":19,"OM":20,"PC":21,"PM":22,"PR":23,"QA":24,
    "RQ":25,"SR":26,"SV":27,"EB":28,"AS":29,"XS":30,"PJ":31,"PS":32,"AC":33,"MW":34,"PU":35,"MD":36,
    "CP":37,"MP":38,"HD":39,"MJ":40,"PD":41,"MQ":42,"SE":43,"ME":44,"PZ":45,"VZ":46,"HH":47,"SS":48,
    "PH":49,"LP":50,"BP":51,"PY":52,"GJ":53,"CD":54,"RP":55,"WB":56,"SP":57,"RS":58,"IC":59,"MB":60,
    "SI":61,"CI":62,"LC":63,"WE":64,"TC":65,"EES":66,"MM":67,"EQA":68,"PB":69,"TM":70,"EM":71,"AA":72,"PI":73,"SY":74,"SRM":75,"SCS":76,"SOC":77,"SCI":78,"SCC":79,"SAF":80,"SOE":81,"SDK":82,"TCS":83,"TCU":84,"MFS":85,"DRV":86,"CRL":87,"PYC":88,"GU":89};

Session.prototype.ContainsKey=function(key)
{
    return this.data.ContainsKey(key);
}
Session.prototype.Add=function(key, value)
{
    this.data.Add(key, value);
    this[key]=value;
}
Session.prototype.Remove=function(key)
{
   this. data.Remove(key);
}
Session.prototype.ModuleLicensed=function(module)
{
    try
    {
        if(this.ModuleAccess)
        {
            var str = Enum.ToString(module,Session.Module);
            return this.ModuleAccess[str];
        }
        else
        {
            return true; 
        }
    }
    catch(err)
    {
        return true;
    }        
}

// ----------  Epicor.Mfg.Shared.ContextMenuAddNew
var ContextMenuAddNewProxy = Epicor.Mfg.Shared.ContextMenuAddNew.ContextMenuAddNewProxy = function() 
{
    EpiObject.call(this, "ContextMenuAddNewProxy");
}

var TraceProvider=Epicor.Mfg.UI.TraceProvider=function(){}
TraceProvider.TraceCatchException=function(){}
TraceProvider.TraceException=function(){}

// ----------  Epicor.Mfg.UI.Adapters 
var ResetListMode = Epicor.Mfg.UI.Adapters.ResetListMode={AddRow:0,DeleteRow:1,UpdateRow:2,NoChange:3};

var AutoWidthOptions=Epicor.Mfg.UI.FrameWork.AutoWidthOptions={"Manual":0,"ControlWidth":1,"Auto":2};
var ContextMenuBinding=Epicor.Mfg.UI.FrameWork.ContextMenuBinding=function(){}
var EpiRowChanging = Epicor.Mfg.UI.FrameWork.EpiRowChanging = Delegate;
var CurrencyDecimalType=Epicor.Mfg.UI.FrameWork.CurrencyDecimalType={"General":"G","Cost":"C","Price":"P","Unspecified":"U"};

var CMenuXmlAdapter=Epicor.Mfg.UI.FrameWork.CMenuXmlAdapter=function(){}
CMenuXmlAdapter.SetContextMenuXml=function(sender){}
CMenuXmlAdapter.GetContextMenuXml=function(){return null;}

var CompoundKeyBinding=Epicor.Mfg.UI.FrameWork.CompoundKeyBinding=function(keys,likes,publishers)
{
    EpiObject.call(this, "CompoundKeyBinding");

    this.CompoundKeys = keys;
    this.LikeValues = likes;
    this.Publishers = publishers;
}
CompoundKeyBinding.prototype = new EpiObject();

var ContextMenuProvider=Epicor.Mfg.UI.FrameWork.ContextMenuProvider=function(){}
ContextMenuProvider.HasSearch=function(like,includeQuickSearch)
{
    if (!ECTM.ContextMenuData) ECTM.GetContextMenuXml();
    var contextM = ECTM.ContextMenuData[like];
    if (contextM && contextM.MenuItems)
    {
        for (var i=0,menuItem;menuItem=contextM.MenuItems[i];i++)
        {   
            if (menuItem["ProcessType"]=="BaseSearch" || menuItem["ProcessType"]=="QuickSearch") 
                return true;
        }
    }
   
    return false;
}
ContextMenuProvider.prototype.GetValidationNode=function(node,key)
{
    if (!ECTM.ContextMenuData) ECTM.GetContextMenuXml();
    var contextM = ECTM.ContextMenuData[key];

    if (contextM && contextM.ValidationItems)
    {
        for (var i=0,valItem;valItem=contextM.ValidationItems[i];i++)
        {   
            if (valItem[node]) 
            {
                return valItem[node];
            }
        }
    }

    return "";
}

var NSTreeOptionsForm=Epicor.Mfg.UI.FrameWork.NSTreeOptionsForm=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The Tree Options dialog is not implemented.", new EpiOverloadedArgs("String_Details"));
}
NSTreeOptionsForm.prototype.ShowDialog=function(){return DialogResult.Cancel;}

// ----------  Epicor.Mfg.UI.Styling
var Styling=Epicor.Mfg.UI.Styling=
{
    "LoadThemeByConfiguration":function(){}
}
var Casper=Epicor.Mfg.UI.Utilities.Casper=
{
    "RegisterObject":function(){}
}

// ----------  Epicor.Mfg.UI.FrameWork.UIApp

var AppControlPublisher = Epicor.Mfg.UI.FrameWork.UIApp.AppControlPublisher = function(publisherID,publishedColumn,publisherName)
{
    EpiObject.call(this,"AppControlPublisher"); 
    this.PublisherID = publisherID;
    this.PublishedColumn = publishedColumn;
    this.PublisherName = publisherName;
    this.ViewName = this.PublisherName.Substring(0, this.PublisherName.indexOf("-"))+"View";
    this.DashboardPublisherName = this.PublisherName + ": " + this.PublishedColumn;
}
AppControlPublisher.prototype = new EpiObject();
AppControlPublisher.prototype.GetPublisher=function()
{
    return {"DashboardQueryID":this.ViewName,"PublisherID":this.PublisherID,"PublishedColumn":this.PublishedColumn,"PublisherName":this.PublisherName};
}


var EpiTrackerPrompts = Epicor.Mfg.UI.FrameWork.UIApp.EpiTrackerPrompts=function()
{
    this.Columns = new Hashtable();
    this.Values = new Hashtable();
    this.Conditions = new Hashtable();
    this.DataTypes = new Hashtable();
}
EpiTrackerPrompts.prototype.Add=function(column, value, cond,dataType)
{
    var key = System.Guid.NewGuid();
    this.Columns.Add(key, column);
    this.Values.Add(key, value);
    this.Conditions.Add(key, cond);
    this.DataTypes.Add(key, dataType);
}
EpiTrackerPrompts.GetTrackerPrompts=function(Columns,Values,Conditions,DataTypes,AddNewSubs)
{
    // init
    var prompts = new EpiTrackerPrompts();
    var iEnum = Columns.GetEnumerator();
    // enum
    while (iEnum.MoveNext())
    {
        var key = iEnum.Key;
        if (key != null)
        {
            // verify
            if (Values.ContainsKey(key) && Conditions.ContainsKey(key) && !AddNewSubs.ContainsKey(key))
            {
                // update local collections
                prompts.Columns.Add(key, Columns.get_Item(key));
                prompts.Values.Add(key, Values.get_Item(key));
                prompts.Conditions.Add(key, Conditions.get_Item(key));
                if (DataTypes.ContainsKey(key))
                    prompts.DataTypes.Add(key, DataTypes.get_Item(key));
            }
        }
    }
    return prompts;
}
var AppControlNavSettings = Epicor.Mfg.UI.FrameWork.UIApp.AppControlNavSettings =function(Like, ValueMember,BAQBinding, Label, DropDownColumns)
{
    this.Like = Like;
    this.ValueMember = ValueMember;
    this.BaqBinding = BAQBinding;
    this.LabelText = Label;
    this.DropDownColumns = DropDownColumns;
}
AppControlNavSettings.prototype.GetViewName= function()
{
    if (this.BaqBinding != null && this.BaqBinding.IndexOf(".") > 0)
	{
		return this.BaqBinding.Substring(0, this.BaqBinding.IndexOf("."));
	}

    if (!String.IsNullOrEmpty(this.BaqBinding))
    {
        return this.BaqBinding;
    }
    
    return String.Empty;
}
AppControlNavSettings.prototype.GetColumnName= function()
{
    if (this.BaqBinding && this.BaqBinding.IndexOf(".") > 0)
    {
        return this.BaqBinding.Substring(this.BaqBinding.IndexOf(".") + 1);
    }
    return "";
}

var AppControlNavManager = Epicor.Mfg.UI.FrameWork.UIApp.AppControlNavManager=function(AppController,NavControl, NavSettings, BaqView)
{
    // verify the BAQ View and verify there is BaseSearch process for the Like Value
    if (BaqView==null && AppController)
         BaqView = AppController.get_MainDataView();
        
    if (BaqView && BaqView.ViewName != NavSettings.GetViewName() )
        //|| string.IsNullOrEmpty(Searches.SearchWorker.getBaseSearchProcess(NavSettings.Like))) // VA: This involves building the context menu - ignore for now
        throw new Exception("Invalid NavControl settings");

    this.baqView = BaqView;
    // back off the instance members
    this.navSettings = NavSettings;
    this.navControl = NavControl;
    this.appController = AppController;
    // init the Nav EpiDataView 
    this.initNavView(NavSettings.ValueMember);
    // init the Nav Control
    this.navControl.get_EpiCombo().EpiKeyField = true;
    this.navControl.set_EpiBinding(this.navViewID + "." + NavSettings.ValueMember);
    this.navControl.get_EpiCombo().SetColumnFilter([NavSettings.ValueMember]);
    Global.Form.bindToolbarCtrls(); // Rebind the nav control because the binding changed.
    this.navControl.get_EpiCombo().get_Event("ComboTabPressed").subscribe(this.EpiCombo_ComboTabPressed, this, true);
}

AppControlNavManager.prototype.initNavView=function(BindingColumn)
{
    // create the local search table
    this.searchTable = new DataTable();
    this.searchTable.AddColumn(BindingColumn, new EpiOverloadedArgs("String"));
    // create the EpiDataView against the local search table
    this.navView = new EpiDataView();
    this.navView.dataView = new DataView(this.searchTable);
    if (this.appController != null)
    {
        this.navViewID = "NavView_" + this.navControl.ID;
        this.appController.Add(this.navViewID, this.navView);
    }
    // register the RowChanged event
    this.navView.get_Event("EpiRowChanged").subscribe(this.NavView_EpiRowChanged, this, true);
}
AppControlNavManager.prototype.NavView_EpiRowChanged=function(args)
{
    // bail when no BAQ view to filter using the new Value
    if (this.baqView == null) return;
    // get the new value
    var newValue = "";
    if (args.CurrentRow > -1)
        newValue = this.navView.dataView.Rows[args.CurrentRow][this.navSettings.ValueMember].toString();
        
    if (!newValue) return;
    
    // perform the search
    this.baqView.OnSearch(this.navSettings.GetColumnName(), newValue);
    var row = -1;
    if (this.baqView.dataView.Count > 0) row = 0;
    this.baqView.set_Row(row);
    this.baqView.Notify(new EpiNotifyArgs(this.appController, true, row, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
}
AppControlNavManager.prototype.InvokeSearch=function()
{
    this.searchTable.Clear(); // clear current contents
    var row = -1;
    var o = null;
    // try to invoke the Base Search using the Like
    try
    {
        var searchProcess = SearchWorker.getBaseSearchProcess(this.navSettings.Like);
        o = ProcessCaller.LaunchSearch(this.appController,
            searchProcess.Substring(0, searchProcess.IndexOf(".")),
            searchProcess.Substring(searchProcess.IndexOf(".") + 1), true,new EpiOverloadedArgs("Object_String_String_Boolean"));
    }
    catch (ex)
    {
        // trace the exception
       DebugHelper.WriteError("Error in AppControlNavManager.InvokeSearch",ex);
       return false;
    }
   
    var prevRow = this.navView.Row;
    // set the current row; notify and return
    if (o != null && o instanceof DataSet && o.get_Table(0).Rows.length > 0)
        this.searchTable.Merge(o.get_Table(0), false, MissingSchemaAction.Add, new EpiOverloadedArgs("DataTable_Boolean_MissingSchemaAction"));
    
    if (this.searchTable.Rows.length > 0) row = 0;
    this.navView.set_Row(row); // set_Row will throw the OnEpiRowChanged event.
    if (prevRow == -1 && row == 0) // set_Row does not trigger the OnEpiRowChanged event if prevRow =-1. so do it manually for that case
    {
        this.navView.OnEpiRowChanged(row, prevRow);
    }
    this.navView.Notify(new EpiNotifyArgs(this.appController, true, row, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
    return true;
}

AppControlNavManager.prototype.EpiCombo_ComboTabPressed=function(combo)
{
    if (this.baqView != null && this.navControl != null && !String.IsNullOrEmpty(combo.get_Text()))
          this.performSearch();
}

AppControlNavManager.prototype.performSearch=function()
{
    if (this.navControl == null || this.navControl.get_EpiCombo() == null ||
        String.IsNullOrEmpty(this.navControl.get_EpiCombo().get_Text())) return;
    // set the filter
    var filter = this.navSettings.ValueMember + " = '" + this.navControl.get_EpiCombo().get_Text() + "'";
    // clear current contents
    this.searchTable.Clear();
    var row = -1;
    this.navView.set_Row(row);
    this.navView.Notify(new EpiNotifyArgs(this.appController, true, row, 0),new EpiOverloadedArgs("Object_Boolean_Int32_Int32"));
    var o = null;
    // try to perform the Base Search using the Like
    try
    {
        var searchProcess = SearchWorker.getBaseSearchProcess(this.navSettings.Like);
        o = ProcessCaller.PerformSearch(this.appController,
            searchProcess.substring(0, searchProcess.indexOf(".")),
            searchProcess.substring(searchProcess.indexOf(".") + 1),
            filter, new EpiOverloadedArgs("Object_String_String_String"));
    }
    catch (ex)
    {
        // trace the exception
        //TraceProvider.TraceCatchException(ex);
        DebugHelper.WriteError("Error in AppControlNavManager.performSearch",ex);
        return;
    }
    
    var prevRow = this.navView.Row;
    
    // set the current row; notify and return
    if (o != null && o instanceof DataSet && o.get_Table(0).Rows.length > 0)
        this.searchTable.Merge(o.get_Table(0), false, MissingSchemaAction.Add, new EpiOverloadedArgs("DataTable_Boolean_MissingSchemaAction"));
    if (this.searchTable.Rows.length > 0) row = 0;
    this.navView.set_Row(row);
    if (prevRow == -1 && row == 0) // set_Row does not trigger the OnEpiRowChanged event if prevRow =-1. so do it manually for that case
        this.navView.OnEpiRowChanged(row, prevRow);

    this.navView.Notify(new EpiNotifyArgs(this.appController, true, row, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
}

var AppControlReportManager = Epicor.Mfg.UI.FrameWork.UIApp.AppControlReportManager =function(){}

AppControlReportManager.GetReportData=function(AppPanel)
{
    if (AppPanel == null) return null;
    return AppControlReportManager.getReportDataSet(AppPanel.AppController, AppPanel.GridPanels, true);
}
AppControlReportManager.getReportDataSet=function(Sender, GridPanels, includeData)
{
    var runtimeDS = new DataSet();
    runtimeDS.Namespace = "http://www.epicor.com/Mfg/100";
    for (var i = GridPanels.length - 1; i>=0 ; i--)
    {
        // set up the TableName
        var tblName = GridPanels[i].ReportTableName.Replace(":", " ");
        tblName = tblName.Trim().Replace(" ", "_");
        var view = Global.BindingEngine.EpiDataViews[GridPanels[i].get_BaseGrid().DataView].dataView;
        // create new Table
        var runtimeTable = new DataTable(tblName);
        // build up list of Columns
        var cols = view.Table.get_Columns();
        for (var col in cols.items)
        {
            col = cols.items[col];
            runtimeTable.AddColumn(col.ColumnName, col.DataType,new EpiOverloadedArgs("String_String"));
        }
        // verify if ok to add rows to the DataSet
        if (includeData && view.Count > 0)
        {
            // add rows to the DataSet
            for (var drv in view.Rows)
                runtimeTable.AddRow(view.Rows[drv]);
        }
        // add the new Table
        runtimeDS.AddTable(runtimeTable,new EpiOverloadedArgs("DataTable"));
        runtimeDS.AcceptChanges();
    }
    // add the Session Table
    runtimeDS = AppControlReportManager.addSessionTableToRuntimeDataSet(Sender, runtimeDS);
    return runtimeDS;
}
AppControlReportManager.addSessionTableToRuntimeDataSet=function(Sender, RuntimeDS)
{
    // make sure we have a Core.Session
    var coreSession = Sender.Session;
    if (coreSession == null) return;
    // build up the Session table
    var sessionTable = new DataTable("Session");
    RuntimeDS.AddTable(sessionTable,new EpiOverloadedArgs("DataTable"));
    sessionTable.AddColumns([new DataColumn("AppServer"),
                            new DataColumn("CompanyID"),
                            new DataColumn("CompanyName"),
                            new DataColumn("LanguageID"),
                            new DataColumn("PlantID"),
                            new DataColumn("PlantName"),
                            new DataColumn("UserEmail"),
                            new DataColumn("UserID"),
                            new DataColumn("UserName"),
                            new DataColumn("WorkstationID")]);
    // add the one Session Row
    sessionTable.AddRow([coreSession.AppServer,
                        coreSession.CompanyID,
                        coreSession.CompanyName,
                        coreSession.LanguageID,
                        coreSession.PlantID,
                        coreSession.PlantName,
                        coreSession.UserEmail,
                        coreSession.UserID,
                        coreSession.UserName,
                        coreSession.WorkstationID]);
   return RuntimeDS;
}

// ---------- Epicor.Mfg.UI.CallContextHandler
var CallContextDataHelper = Epicor.Mfg.UI.CallContextHandler.CallContextDataHelper=function(){}
CallContextDataHelper.ResetCallContextClientData=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "EpiTransaction":
            CallContextDataHelper.ResetCallContextClientData_1(a[0]);
            break;
        case "CallContextDataSet_ILaunch":
            CallContextDataHelper.ResetCallContextClientData_2(a[0],a[1]);
            break;
    }
        
}
CallContextDataHelper.ResetCallContextClientData_1=function(transaction)
{
    var callContextView = transaction.Factory("CallContextClientData");
    if (callContextView != null)
    {
        var ccds = callContextView.dataView.Table.DataSet;
        if (ccds != null)
            CallContextDataHelper.ResetCallContextClientData_2(ccds, Global.Form);
    }
}
CallContextDataHelper.ClearCallContextBpmData=function(transaction)
{
    var callContextView = transaction.Factory("CallContextClientData");
    if (callContextView != null)
    {
        var ccds = callContextView.dataView.Table.DataSet;
        if (ccds != null)
        {
            ccds.BpmData.Clear();
            ccds.BpmData.AddRow(new EpiOverloadedArgs("ObjectArr"));
            Global.BindingEngine.BindForm(ccds.BpmData.DataSet);
        }
    }    
}
CallContextDataHelper.ResetCallContextClientData_2=function(ccds,sender)
{
    if (ccds == null) ccds = new CallContextDataSet();
    ccds.Client.Clear();
    ccds.Client.AddRow(new EpiOverloadedArgs("ObjectArr"));
    var client=ccds.Client.get_Row(0);
    if (sender == null) return;
    client.AssemblyName = sender.get_WhoAmI();
    var session = FormFunctions.getILaunchSession(sender);
    if (session != null)
    {
        client.CurrentCompany = session.CompanyID;
        client.CurrentPlant = session.PlantID;
        client.CurrentUserId = session.UserID;
    }
    client.ClientType = "EWAClient";
}
CallContextDataHelper.CreateCallContextData=function(sender)
{
    window.CallContextDataSet=Epicor.Mfg.Core.CallContext.CallContextDataSet=function()
    {
	    DataSet.call(this,"CallContextDataSet");
	    if(typeof CallContextDataSet._init=="undefined")
	    {
		    window.ClientTable=function()
		    {
			    DataTable.call(this,"Client");
			    this.Columns={"ClientType":{"DataType":"System.String","ExtendedProperties":{}},"ProcessId":{"DataType":"System.String","ExtendedProperties":{}},"AssemblyName":{"DataType":"System.String","ExtendedProperties":{}},"CustomizationId":{"DataType":"System.String","ExtendedProperties":{}},"CurrentUserId":{"DataType":"System.String","ExtendedProperties":{}},"CurrentCompany":{"DataType":"System.String","ExtendedProperties":{}},"CurrentPlant":{"DataType":"System.String","ExtendedProperties":{}}};
			    this.PrimaryKey=[];
		    }
		    ClientTable.prototype=new DataTable();
		    window.CallStateTable=function()
		    {
			    DataTable.call(this,"CallState");
			    this.Columns={"ArgumentName":{"DataType":"System.String","ExtendedProperties":{}},"ChunkSeq":{"DataType":"System.Int32","ExtendedProperties":{}},"ValueChunk":{"DataType":"System.String","ExtendedProperties":{}}};
			    this.PrimaryKey=['ArgumentName','ChunkSeq'];
		    }
		    CallStateTable.prototype=new DataTable();
		    window.CallStackTable=function()
		    {
			    DataTable.call(this,"CallStack");
			    this.Columns={"Milestone":{"DataType":"System.String","ExtendedProperties":{}},"State":{"DataType":"System.String","ExtendedProperties":{}}};
			    this.PrimaryKey=['Milestone'];
		    }
		    CallStackTable.prototype=new DataTable();
		    window.ClientHandlerTable=function()
		    {
			    DataTable.call(this,"ClientHandler");
			    this.Columns={"HandlerId":{"DataType":"System.String","ExtendedProperties":{}},"Data":{"DataType":"System.String","ExtendedProperties":{}}};
			    this.PrimaryKey=['HandlerId'];
		    }
		    ClientHandlerTable.prototype=new DataTable();
		    window.BpmDataTable=function()
		    {
			    DataTable.call(this,"BpmData");
			    this.Columns={"Password":{"DataType":"System.String","ExtendedProperties":{}},"ButtonValue":{"DataType":"System.Int32","ExtendedProperties":{}},"Character01":{"DataType":"System.String","ExtendedProperties":{}},"Character02":{"DataType":"System.String","ExtendedProperties":{}},"Character03":{"DataType":"System.String","ExtendedProperties":{}},"Character04":{"DataType":"System.String","ExtendedProperties":{}},"Character05":{"DataType":"System.String","ExtendedProperties":{}},"Character06":{"DataType":"System.String","ExtendedProperties":{}},"Character07":{"DataType":"System.String","ExtendedProperties":{}},"Character08":{"DataType":"System.String","ExtendedProperties":{}},"Character09":{"DataType":"System.String","ExtendedProperties":{}},"Character10":{"DataType":"System.String","ExtendedProperties":{}},"Character11":{"DataType":"System.String","ExtendedProperties":{}},"Character12":{"DataType":"System.String","ExtendedProperties":{}},"Character13":{"DataType":"System.String","ExtendedProperties":{}},"Character14":{"DataType":"System.String","ExtendedProperties":{}},"Character15":{"DataType":"System.String","ExtendedProperties":{}},"Character16":{"DataType":"System.String","ExtendedProperties":{}},"Character17":{"DataType":"System.String","ExtendedProperties":{}},"Character18":{"DataType":"System.String","ExtendedProperties":{}},"Character19":{"DataType":"System.String","ExtendedProperties":{}},"Character20":{"DataType":"System.String","ExtendedProperties":{}},"Number01":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number02":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number03":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number04":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number05":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number06":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number07":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number08":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number09":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number10":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number11":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number12":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number13":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number14":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number15":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number16":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number17":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number18":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number19":{"DataType":"System.Decimal","ExtendedProperties":{}},"Number20":{"DataType":"System.Decimal","ExtendedProperties":{}},"Date01":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date02":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date03":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date04":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date05":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date06":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date07":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date08":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date09":{"DataType":"System.DateTime","ExtendedProperties":{}},"Date10":{"DataType":"System.DateTime","ExtendedProperties":{}},"Checkbox01":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox02":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox03":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox04":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox05":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox06":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox07":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox08":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox09":{"DataType":"System.Boolean","ExtendedProperties":{}},"Checkbox10":{"DataType":"System.Boolean","ExtendedProperties":{}},"ShortChar01":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar02":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar03":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar04":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar05":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar06":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar07":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar08":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar09":{"DataType":"System.String","ExtendedProperties":{}},"ShortChar10":{"DataType":"System.String","ExtendedProperties":{}},"RowIdent":{"DataType":"System.String","ExtendedProperties":{}},"RowMod":{"DataType":"System.String","ExtendedProperties":{}},"DBRowIdent":{"DataType":"System.Byte[]","ExtendedProperties":{}}};
			    this.PrimaryKey=['RowIdent'];
		    }
		    BpmDataTable.prototype=new DataTable();
		    CallContextDataSet.prototype.get_Client=function(){return this.get_Table("Client");}
		    CallContextDataSet.prototype.get_CallState=function(){return this.get_Table("CallState");}
		    CallContextDataSet.prototype.get_CallStack=function(){return this.get_Table("CallStack");}
		    CallContextDataSet.prototype.get_ClientHandler=function(){return this.get_Table("ClientHandler");}
		    CallContextDataSet.prototype.get_BpmData=function(){return this.get_Table("BpmData");}
		    CallContextDataSet._init = true;
	    }
	    this.AddTables({"Client":new ClientTable(),"CallState":new CallStateTable(),"CallStack":new CallStackTable(),"ClientHandler":new ClientHandlerTable(),"BpmData":new BpmDataTable()});
    }
    CallContextDataSet.prototype = new DataSet();

    // init and set Client table using Sender
    var ccds = new CallContextDataSet();
    CallContextDataHelper.ResetCallContextClientData_2(ccds, sender);
    
    // create new BpmData row
    ccds.BpmData.AddRow(new EpiOverloadedArgs("ObjectArr"));
    return ccds;
}


// ----------  Epicor.Mfg.UI.FrameWork
var DashboardCondition = Epicor.Mfg.UI.FrameWork.DashboardCondition={"Equals":"Equals","NotEqual":"NotEqual","GreaterThan":"GreaterThan","LessThan":"LessThan","GreaterThanOrEqualTo":"GreaterThanOrEqualTo","LessThanOrEqualTo":"LessThanOrEqualTo","StartsWith":"StartsWith","Matches":"Matches"};
var DashboardMode= Epicor.Mfg.UI.FrameWork.DashboardMode={"Tracker":0,"AdvancedSearch":1,"Dashboard":2,"DashboardAssembly":3,"Maintenance":4};
var StatusTypes = Epicor.Mfg.UI.FrameWork.StatusTypes={"OK":0,"Warning":1,"Stop":2,"Global":3};

var CallLogHelper = Epicor.Mfg.UI.FrameWork.CallLogHelper=function(){}  // TODO

var EpiBackgroundWorker = Epicor.Mfg.UI.FrameWork.EpiBackgroundWorker=function()
{
    EpiObject.call(this, "EpiBackgroundWorker");
    this.tasks = arguments;
    this.isCompleted = false;
    this.hasBeenDisposed = false;
    Delegate.rethrowEx = true;
    this.ExecuteBackgroundTasks();
    Delegate.rethrowEx = false;
}
EpiBackgroundWorker.prototype = new EpiObject();
EpiBackgroundWorker.prototype.Dispose=function()
{
    if (this.hasBeenDisposed) return;
    
    this.hasBeenDisposed = true;
    if (this.firstException != null)
        ExceptionBox.Show(this.firstException);
}
EpiBackgroundWorker.prototype.ExecuteBackgroundTasks=function()
{

    // We execute all the tasks right away.
    for (var i = 0; i < this.tasks.length; i++)
    {
        // Queue this task on a ThreadPool thread.
        var task = this.tasks[i];
        try
        {
            task.apply(null); // The tasks are MethodInvoker delegates (void with no parameters)
        }
        catch(ex)
        {
            var msg = (ex.description)? ex.description:ex.Message;
            if (this.firstException == null) // We need to re-throw the first exception.
                this.firstException = new Exception(msg);
        }
    }
    this.isCompleted = true;
   
}
EpiBackgroundWorker.prototype.get_IsCompleted=function(){return this.isCompleted;}

var LaunchDashboardOptions = Epicor.Mfg.UI.FrameWork.LaunchDashboardOptions=function(mode, embeddedDashboard)
{
    if (!embeddedDashboard) embeddedDashboard = false;
    this.EmbeddedDashboard = embeddedDashboard;
    
    this.Mode = mode;
    this.DefinitionID = String.Empty;
    this.NamedSearchID = String.Empty;
    this.Like = String.Empty;
}

var DashboardTrackerLaunchArgs=Epicor.Mfg.UI.FrameWork.DashboardTrackerLaunchArgs=function()
{
    this.likeVals = new Hashtable();
    this.likePubs = new Hashtable();
}

var EpiFormOptions = Epicor.Mfg.UI.FrameWork.EpiFormOptions = function () {
    this.ConfirmOptions = new DialogConfirmOptions();

    this.SearchHotKey = "CtrlS";
    this.EnterpriseSearchHotKey = "CtrlShiftE";
    this.MaintHotKey = "CtrlM";
    this.ClearHotKey = "None";
    this.DeleteHotKey = "None";
    this.ExitHotKey = "None";
    this.NewHotKey = "None";
    this.RefreshHotKey = "None";
    this.SaveHotKey = "None";
    this.UndoHotKey = "None";
    this.RequiredIndicator = false;
    this.RequiredIndicatorColor = "Salmon";
    
    if (Global.UserGlobalOptions) {
        if (Global.UserGlobalOptions.HotKeysProperties && Global.UserGlobalOptions.HotKeysProperties.length > 0) {
            if (Global.UserGlobalOptions.HotKeysProperties[0].EnterpriseSearchHotKey != '') { this.EnterpriseSearchHotKey = Global.UserGlobalOptions.HotKeysProperties[0].EnterpriseSearchHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].SearchHotKey != '') { this.SearchHotKey = Global.UserGlobalOptions.HotKeysProperties[0].SearchHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].MaintHotKey != '') { this.MaintHotKey = Global.UserGlobalOptions.HotKeysProperties[0].MaintHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].ClearHotKey != '') { this.ClearHotKey = Global.UserGlobalOptions.HotKeysProperties[0].ClearHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].DeleteHotKey != '') { this.DeleteHotKey = Global.UserGlobalOptions.HotKeysProperties[0].DeleteHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].ExitHotKey != '') { this.ExitHotKey = Global.UserGlobalOptions.HotKeysProperties[0].ExitHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].NewHotKey != '') { this.NewHotKey = Global.UserGlobalOptions.HotKeysProperties[0].NewHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].RefreshHotKey != '') { this.RefreshHotKey = Global.UserGlobalOptions.HotKeysProperties[0].RefreshHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].SaveHotKey != '') { this.SaveHotKey = Global.UserGlobalOptions.HotKeysProperties[0].SaveHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].UndoHotKey != '') { this.UndoHotKey = Global.UserGlobalOptions.HotKeysProperties[0].UndoHotKey; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].RequiredIndicator == "True") { this.RequiredIndicator = Global.UserGlobalOptions.HotKeysProperties[0].RequiredIndicator; }
            if (Global.UserGlobalOptions.HotKeysProperties[0].RequiredIndicatorColor != '') { this.RequiredIndicatorColor = Global.UserGlobalOptions.HotKeysProperties[0].RequiredIndicatorColor; }
        }
    }
}
var ProcessCallerCallBack = Epicor.Mfg.UI.FrameWork.ProcessCallerCallBack=Delegate;

var DialogConfirmedArgs = Epicor.Mfg.UI.FrameWork.DialogConfirmedArgs=function(currentEvent, dialogResult)
{ 
    EventArgs.call(this,"DialogConfirmedArgs");
    this.CurrentEvent = currentEvent;
	this.DialogResult = dialogResult;
}
DialogConfirmedArgs.prototype = new EventArgs();

var DialogConfirmOptions = Epicor.Mfg.UI.FrameWork.DialogConfirmOptions=function(){}
DialogConfirmOptions.prototype.GetConfirmOption=function(Event)
{
    if(Event==TransactionEvent.UpdateOnPrimaryKey || Event==TransactionEvent.UpdateOnFormClose ||
        Event==TransactionEvent.UpdateOnInvokeSearch || Event==TransactionEvent.AddNewOnPrimaryKey ||
        Event==TransactionEvent.DeleteOnDeleteButton || Event==TransactionEvent.UndoOnClearButton)
        return true;
    else
        return false;
}

var EpiContextValue = Epicor.Mfg.UI.FrameWork.EpiContextValue=
{
 "ValueType": {"Like":0,"NodeKey":1,"SourceBinding":2}
}

var ContextValueProvider= CVP = Epicor.Mfg.UI.FrameWork.ContextValueProvider=
{
    "GetNamedContextValueNode":function(NodeName,ContextValue)
    {
        if (ContextValue[NodeName])
            return ContextValue[NodeName];
        else
            return "";
    },
    "GetValuesByNodeKey":function(NodeKeyList,ContextValue)
    {
		if (NodeKeyList == null || NodeKeyList.length<=0) return null;
		
		var substituteNode = ContextValue["SubstitutionTokens"];// get the substitution node
		
		if (substituteNode != null) // return the EpiContextValue[] array of the TokenNodes
		{
			// CVP.getValuesArray Start   (NodeKeyList, EpiContextValue.ValueType.NodeKey, substituteNode);
			var epiContextValues = [];
			// enum the List and get the EpiContextValue
			for (var i=0; i<NodeKeyList.length; i++)
			{
				epiContextValues.push(CVP.getValueByToken(substituteNode, EpiContextValue.ValueType.NodeKey, NodeKeyList[i]));
		    }
			return epiContextValues; // return the array[]
			// CVP.getValuesArray End
	    }
		// return null when something wrong
		return null;
    },
    "getValueByToken":function(SubstituteNode,Type,Value)
    {
        for(var tokenNode in SubstituteNode)
		{
		    var token = SubstituteNode[tokenNode];
		    token.Name = token.Token;
			// use the Factory to serve up the EpiContextValue
			var epiContextValue = CVP.Factory(token);
			switch (Type)
			{
				case EpiContextValue.ValueType.Like:
					// return when Like value matches key
					if (epiContextValue.Like == Value) return epiContextValue;
					break;
				case EpiContextValue.ValueType.NodeKey:
					// return when NodeKey value matches the key
					if (epiContextValue.NodeKey == Value) return epiContextValue;
					break;
				case EpiContextValue.ValueType.SourceBinding:
					// return when the SourceBinding matches the key
					if (epiContextValue.SourceBinding == Value) return epiContextValue;
					break;
			}
		}
		// nothing found so return null
		return null;
    },
    "Factory":function(TokenNode)
    {
        epiContextValue = {};
		// set the NodeKey based on the Name of the TokenNode
		epiContextValue.NodeKey = TokenNode.Token;
		// enumerate thru the Attributes
		for (var i in TokenNode)
		{
			// get the Name and Value of each attribute
			var attr = i;
			var valu = TokenNode[i];
			switch (attr)
			{
				case "LikeKey":
				case "ColumnKey":
				case "EpiBinding":
				case "ConstantKey":
					// set the KeyType & KeyValue
					epiContextValue.KeyType = attr;
					epiContextValue.KeyValue = valu;
					break;
				case "Like":
					// set the Like string
					epiContextValue.Like = valu;
					break;
				case "Value":
					// set the Value string
					epiContextValue.Value = valu;
					break;
				case "SourceBinding":
					// set the SourceBinding string
					epiContextValue.SourceBinding = valu;
					break;
			}
		}
		// return the EpiContextValue instance
		return epiContextValue;
    }
}
var ContextToolEventArgs = Epicor.Mfg.UI.FrameWork.ContextToolEventArgs=function(ContextMenuPopup,ContextBinding,type)
{
    if (!type) type = "ContextToolEventArgs";
    EventArgs.call(this,type);
    this.ContextMenuPopup = ContextMenuPopup;
    this.ContextBinding = ContextBinding;
}
ContextToolEventArgs.prototype=new EventArgs();

var HandleableContextToolEventArgs = Epicor.Mfg.UI.FrameWork.ContextToolEventArgs=function(ContextMenuPopup,ContextBinding)
{
    ContextToolEventArgs.call(this, ContextMenuPopup,ContextBinding,"HandleableContextToolEventArgs");
    this.Handled = false;
}
HandleableContextToolEventArgs.prototype=new ContextToolEventArgs();

ContextToolEventArgs.prototype=new EventArgs();
var ECTM = EpiContextToolsManager = Epicor.Mfg.UI.FrameWork.EpiContextToolsManager=
{
    _contextMenuPopup:undefined,
    _contextMorePopup:undefined,
    _defQuickSrch:"",
    _defSharedQuickSrch:"",
    RegisterUltraContextMenu:function() {},
    BeforeBuildContextMenu:new EpiEvent("BeforeBuildContextMenu", this),
    AfterBuildContextMenu:new EpiEvent("AfterBuildContextMenu", this),
    ToolClick:new EpiEvent("ToolClick", this),
    get_Event:function(e){return ECTM[e];},
    BuildContextMenu:function(epiControl, ctrl, posX,posY)
    {    
        if (!ECTM._contextMenuPopup)
        {
            ECTM._contextMenuPopup = new Tool("EpiContextMenu",{"Type":"PopupMenuTool"});
            ECTM._epiPanelPopup = new Tool("EPI_PANEL_POPUP",{"Type":"PopupMenuTool"});
            ECTM._quickSearchPopup = new Tool("EpiQuickSearches",{"Type":"PopupMenuTool","Caption":EpiString.getString("QuickSearches")});
            
            if (!Global.Form.myTool) // Form doesnt have toolbarmanager
            {
                Global.Form.myTool = new EpiToolbarsManager({}, {},false);
            }
            if (Global.Form.myTool)
            {
                Global.Form.myTool.Tools.Add(ECTM._contextMenuPopup);
                Global.Form.myTool.Tools.Add(ECTM._epiPanelPopup);
                Global.Form.myTool.Tools.Add(ECTM._quickSearchPopup);
            }
        }
        else
        {
            // Clear the popup if it exists
            ECTM._contextMenuPopup.Tools.Clear();
            ECTM._epiPanelPopup.Tools.Clear();
            if (ECTM._contextMorePopup) ECTM._contextMorePopup.Tools.Clear();
            if (ECTM._quickSearchPopup) ECTM._quickSearchPopup.Tools.Clear();
        }
         
         ECTM.hasSuppressedSearch = false;
         ECTM.hasSuppressedMaint = false;
         // Handle differently for a panel
         
            if (epiControl instanceof EpiPanel)
            {
                // TODO: Handle case when context menu is shown on a search form
//                SearchOptionsForm searchOptsForm = Panel.TopLevelControl as SearchOptionsForm;
//                EpiSearchBase search = Panel.TopLevelControl as EpiSearchBase;
//                EpiBaseForm form = FormFunctions.GetTopEpiBaseForm(Panel);
//                if (search == null && searchOptsForm != null)
//                    search = searchOptsForm.SearchBase;
//                if (search != null)
//                    _epiPanelPopup.ResetContextBinding(search);
                   
              if (Global.Form)
              {
                if (!ECTM.OnBeforeBuildContextMenu(cb)) return false;
                ECTM._createContextMenuForForm();
                ECTM.OnAfterBuildContextMenu(cb);
                
                if (ECTM._epiPanelPopup.Tools.Count > 0)
                {
                    Global.Form.myTool._openContextMenuItem(ECTM._epiPanelPopup,posX,posY,epiControl); 
                    return true;
                }
              }
              
              return false;
            }

        var cb;
        //trap exception for web pages that do not have a tree
        var isUltraTree = false;
        try{ isUltraTree = (epiControl instanceof UltraTree); } catch(e){}
        if (isUltraTree)
            cb = ECTM._getTreeNodeContextBinding(epiControl,ctrl);
        else
            cb = ECTM._getContextBinding(epiControl,ctrl);
                 
        if (!cb) return false;
        
        if (!cb.isTreeControl)
        {
            var thisView = Global.BindingEngine.EpiDataViews[epiControl.DataView];
            if (thisView != undefined)
            {
                if(thisView.disabledContexts && thisView.disabledContexts.Contains(ctrlEpiBinding)) 
                    return false;
            }
        }
        if (!ECTM.OnBeforeBuildContextMenu(cb)) return false;
        
        ECTM._createContextMenu(cb, thisView, epiControl.DataColumn);
        
        // fire the after build event
        ECTM.OnAfterBuildContextMenu(cb);
        
        if (ECTM._contextMenuPopup && ECTM._contextMenuPopup.Tools.Count > 0)
        {    
            Global.Form.myTool._openContextMenuItem(ECTM._contextMenuPopup,posX,posY, epiControl);  
            return true;
        }
        return false;
    },
    _getContextBinding:function(epiControl,ctrl) // Handles for controls and grid
    {
         var cb= {};
         cb.isTreeControl = false;
         //if (!Global.Form.trans) return cb;

         var ctrlEpiBinding = epiControl.DataView + "." + epiControl.DataColumn;
         cb.EpiBinding = ctrlEpiBinding;
         
         if(Global.Form.trans)
         {
         cb.Sender = Global.Form.trans;
         cb.WhoAmI = Global.Form.trans.WhoAmI;
         cb = ExtendedProperties.SetContextMenuProps(epiControl.DataView,epiControl.DataColumn,cb);
         cb.SuppressSearch = Global.Form.trans.suppressSearches.Contains(ctrlEpiBinding);
         cb.SuppressMaint = Global.Form.trans.suppressMaints.Contains(ctrlEpiBinding);
         }
         else
         {
            cb = ExtendedProperties.SetContextMenuProps(epiControl.DataView,epiControl.DataColumn,cb);
         }
         cb.Control = epiControl;
         cb.Grid = epiControl.InGrid;
         
         if (cb.Grid == true && epiControl.OwnerGrid)
         {
            var gridCtrl = Global.BindingEngine.Controls[epiControl.OwnerGrid];
            if (gridCtrl)
            {
                cb.DivCtrl = gridCtrl.FindGridControl(document.getElementById(gridCtrl.ID),epiControl.GetRowNum(ctrl),epiControl.ID);
                cb.GridObj=gridCtrl;
         }
         }
         else if(epiControl instanceof EpiGrid)
         {
            cb.GridObj=epiControl;
         }
         
         if (!Global.Form.trans) return cb;
         
         cb.Like = epiControl.get_EpiContextMenuKey();
         if (cb.Like == "") cb.Like = ctrlEpiBinding;
         
          cb.isReadOnly = epiControl.GetReadOnly(ctrl);
         var val = epiControl.GetValue(ctrl); // TODO: Add code to EpiButton, EpiNumericEditor,EpiListBox - see ExtendedProperties.GetKeyFieldValue.
         cb.originalValue = val; 
         if (epiControl instanceof EpiTextBox || epiControl instanceof EpiDropControl) // this applies to all controls that allow text selection, like the combos etc.
         {
            // set the Selected Text props on ContextMenuBinding
            cb.addCutCopyPaste = true;
            cb.hasSelectableText = (val)? val.toString().length > 0 : false; //epiControl.GetValue(ctrl).toString().length > 0;
            cb.hasSelectedText = epiControl.HasSelectedText(); //false; // TODO: (iSelectText.IsInEditMode && iSelectText.SelectedText != null && iSelectText.SelectedText.Length > 0);
         }
        if ((epiControl instanceof  EpiTextBox || epiControl instanceof EpiComboBox) &&
        (!(epiControl instanceof EpiNumericEditor) && !(epiControl instanceof EpiCurrencyEditor)))
        {
            // set the UltraTextEditor props on ContextMenuBinding
            cb.addSpellCheck = true;
            // Reg expression to capture name@address.com
            if (val.indexOf("@") > 0 && val.match(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-z�A-Z]{2,4}|[0-9]{1,3})(\]?)$/))
                contextBinding.addMailDialog = true;
            if (epiControl instanceof  EpiTextArea) cb.addInsertFile = true; // Multiline
            cb.isPasswordControl = false;
            //if (txt.PasswordChar != 0x0000) contextBinding.isPasswordControl = true; //TODO
        }
        if (epiControl instanceof  EpiComboBox && (epiControl.retrieveOnActivate || (epiControl.InGrid == true && epiControl.ValueList != null)))
                cb.addRefreshList = true;
                
        // ic control Num or Curr editor (add calc cool)
        if (epiControl instanceof EpiNumericEditor || epiControl instanceof EpiCurrencyEditor)
            cb.addCalculator = true;
            
         
        // TODO: There is some code specific to Grid that we need here - See getContextMenuBinding(UltraGrid Grid)

        return cb;
    },
    _getTreeNodeContextBinding:function(EpiTree,ctrl)
    {
        var EpiNode = EpiTree._nodeUnderMouse;
        if (!EpiNode) return;
        var ContextBinding = {};
        ContextBinding.isTreeControl = true;
        ContextBinding.Control = EpiTree;
        ContextBinding.currentNode = EpiNode;
        ContextBinding.Like = EpiNode.get_EpiContextMenuKey();

        if((!ContextBinding.Like || ContextBinding.Like=="") &&
            (EpiNode.get_IsAttachmentFolder() || EpiNode.get_IsAttachmentParent()))
            ContextBinding.Like = "AttachmentFolder"; 
        return ContextBinding;
    },
    _createContextMenu:function(cb, dv, dc)
    {
       if (!cb.Like || cb.Like.length <= 0)
       {
         if (!cb.isTreeControl)
            ECTM._buildStandardCMTools(cb);
         else if (cb.isTreeControl)
            ECTM._buildTreeTools(cb);
         return;
       }
       var bpmHoldTool;
       var quickSearches=new Queue();

       // Find the context menu object for this epibinding and build the context menu
       if (!ECTM.ContextMenuData) ECTM.GetContextMenuXml();

       var contextM = ECTM.ContextMenuData[cb.Like];
       if (contextM != undefined)
       {
            if (contextM.MenuItems)
            {
                var menuCall, menuText,menuType,contextTool;
                for (var i=0,menuItem;menuItem=contextM.MenuItems[i];i++)
                {   
                    menuCall = menuItem["ProcessCall"];
                    menuText= menuItem["Name"];
                    menuType = menuItem["ProcessType"];

                    if (String.IsNullOrEmpty(menuType) && cb.isTreeControl)
                        menuType = "EpiTreeTool";
                    
                    if ((cb.ReplaceMaint && menuType == "BaseForm") || (cb.ReplaceSearch && menuType == "BaseSearch"))// check if CustomHandler replaces BaseForm or BaseSearch
                    {
                        var customMenuText = ECTM._getCustomContextMenu(menuType, cb); // get the CustomHandler text
                        // base out if no MenuText
                        if (customMenuText == null || customMenuText.length <= 0) return null; 
                        if (customMenuText != menuType)
                        {
                            menuText = customMenuText;
                            menuCall = menuText;
                        }
                        else
                            menuCall = menuType;

                        // check the Menu Type
                        if (menuType == "BaseSearch")
                        {
                            // bail if we already have suppressed the search or set the flag
                            if (ECTM.hasSuppressedSearch) continue;
                            ECTM.hasSuppressedSearch = true;
                        }
                        if (menuType == "BaseForm")
                        {
                            // bail if we already have suppressed the maint or set the flag
                            if (ECTM.hasSuppressedMaint) continue;
                            ECTM.hasSuppressedMaint = true;
                        }
                        // set the type as CustomContext so click handler knows what to do
                        menuType = "CustomContext";
                    }
                    // bail out if Suppressing Search or Maint
                    if (cb.SuppressSearch && menuType == "BaseSearch") continue;
                    if (cb.SuppressMaint && menuType == "BaseForm") continue;
                
                    if ((menuType == "DescForm") && dv && dv.dataView && dv.dataView.Table)
                    { 
                        var isSet = false, enPartDesc = false;
                        var dt = dv.dataView.Table;
                        var partNum = dt.GetExtendedProperty(dc, "PartNum");
                        if (partNum != "") // if has PartNum column check if has PartDesc column
                        {
                            isSet = true;
                            if (dv.Row > -1) enPartDesc = dt.Rows[dv.Row][partNum].length > 0;
                            var partDesc = dt.GetExtendedProperty(dc,"PartDesc");
                            if (partDesc == "") isSet = false; 
                        }
                        if (!isSet) continue;
                    }
                     
                    if (menuType == "BPMHoldAttach")
                    {
                        var boName = menuItem["BOName"];
                        if (boName == undefined) continue;
                        menuCall = boName; // reset the MenuCall to be the BPMHold BOName
                    }
                   
                    if (menuType == "BPMHoldAttach") // Add this in the end
                    {
                        if (Global.Form.myTool)
                            bpmHoldTool = Global.Form.myTool.Tools[menuCall];
                        if (!bpmHoldTool)
                        {
                            bpmHoldTool = ECTM._createTool(menuType,menuText, menuCall);
                            bpmHoldTool.IsFirstInGroup = true;
                            
                            bpmHoldTool = ECTM._processMenuOptions(menuItem, bpmHoldTool, menuType, cb,dv,dc);
                        }
                    }
                    else
                    {
                        if (menuType == "QuickSearch")
                        {
                            var tool = ECTM._createTool(menuType,menuText, menuCall);
                            tool = ECTM._processMenuOptions(menuItem, tool, menuType, cb,dv,dc);
                            if (tool)
                                quickSearches.Enqueue(tool); // Save to process later
                        }
                        else
                        {
                            var tool = ECTM._addTool(menuType,menuCall,menuText, ECTM._contextMenuPopup,cb,true);
                            if (menuType == "DescForm" && !enPartDesc) tool.Enabled = false;
                            ECTM._processMenuOptions(menuItem, tool, menuType, cb,dv,dc);
                            // disable the AddAttachment when no default by Company and no DocTypes
                            if ((menuCall == "AddAttachment") && cb != null && cb.Control != null && (menuType == "EpiTreeTool"))
                            {
                                tool.SharedProps.set_Enabled( AttachmentHandler.CanAttach() );
                            }
                        }
                    }
                }
            }
       }

       // do QuickSearch here
       if (quickSearches && quickSearches.Count > 0) 
       {
         // get the pre-processed default Quick Search process
            var qsDefault = ECTM._defQuickSrch;
            if (qsDefault.length <= 0) qsDefault = ECTM._defSharedQuickSrch;
            // get the count of Quick Searches
            var qsCount = quickSearches.Count;

            // enumerate the Queue of QS tools
            while (quickSearches.Count > 0)
            {
                var tool = quickSearches.Dequeue();
                if (qsCount > 1 && tool.Key != qsDefault) // if QS count >1 and not the default tool add to QS popup; else add to CM popup
                {
                    Global.Form.myTool.Tools.Add(tool);
                    ECTM._addTool("QuickSearch", tool.Key,tool.SharedProps.Caption,ECTM._quickSearchPopup,cb,false);
                }
                else
                {
                    Global.Form.myTool.Tools.Add(tool);
                    ECTM._addTool("QuickSearch", tool.Key,tool.SharedProps.Caption,ECTM._contextMenuPopup,cb,true);
                }
            }
       }
                
       ECTM._processCustomContexts(cb,dv,dc);
                
//        if(bpmHoldTool && !ECTM._contextMenuPopup.Tools[bpmHoldTool.Key])
//        {
//            Global.Form.myTool.Tools.Add(bpmHoldTool);
//            ECTM._addTool("BPMHoldAttach", bpmHoldTool.Key,bpmHoldTool.SharedProps.Caption,ECTM._contextMenuPopup,cb);
//        }
        
        if (ECTM._contextMorePopup)
        {
            if (ECTM._contextMorePopup.Tools.Count == 1)
            {
                ECTM._contextMenuPopup.Tools.Add(ECTM._contextMorePopup.Tools.get_Values()[0]);
                ECTM._contextMorePopup.Tools.Clear();
            }
            else  if (ECTM._contextMorePopup.Tools.Count > 1)
            {
                if (!ECTM._contextMenuPopup.Tools["EpiContextMore"])
                    ECTM._contextMenuPopup.Tools.Add(ECTM._contextMorePopup);
            }
        }
       
        if (!cb.isTreeControl)
            ECTM._buildStandardCMTools(cb);
        else if (cb.isTreeControl)
            ECTM._buildTreeTools(cb);
        
        // Add Quick Search Maintenance tool
//        if (!cb.isTreeControl && gSessionInfo.CanDesignQSearch=="True")
//        {
//            var popup = (ECTM._quickSearchPopup.Tools.Count > 0)? ECTM._quickSearchPopup:ECTM._contextMenuPopup;
//            var tool =ECTM._addTool("NewQuickSearch", "NewQuickSearch",EpiString.getString("QuickSearchEntry"),popup,cb);
//            tool.IsFirstInGroup = true;  
//            if (! ECTM._contextMenuPopup.Tools[ECTM._quickSearchPopup.Key] && ECTM._quickSearchPopup.Tools.Count > 0) ECTM._contextMenuPopup.Tools.Add(ECTM._quickSearchPopup);
//        }
    },
    _buildStandardCMTools:function(cb)
    {
       var tool;
        //(menuType,menuCall,menuText,popupMenu, isBaseTool)
       if (cb.Grid||cb.Control instanceof EpiGrid) // Add standard grid tools
       {
            if(Global.Form instanceof EpiHostForm&&!cb.Control.IsGroupChild)
            {            
                tool = ECTM._addTool("EpiStateGroupBy","EpiStateGroupBy",EpiString.getString("GridShowGroupBy"),ECTM._contextMenuPopup,cb);
                tool.IsFirstInGroup = true;
                tool.Checked=cb.GridObj.get_HasGroupByShown();
                
                tool = ECTM._addTool("EpiStateSummary","EpiStateSummary",EpiString.getString("GridShowSummaries"),ECTM._contextMenuPopup,cb);
                tool.Checked=cb.GridObj.get_HasSummariesShown();
            }  
            
           
//           
//           tool = ECTM._addTool("EpiClearSort","EpiClearSort",EpiString.getString("GridClearSort"),ECTM._contextMenuPopup,cb);
//           tool.Enabled = false;
           
//           tool = ECTM._addTool("EpiGridCopyAll","EpiGridCopyAll",EpiString.getString("GridCopyAll"),ECTM._contextMenuPopup,cb);
//           tool.Enabled = false;
//           
//           tool = ECTM._addTool("EpiGridCopySelected","EpiGridCopySelected",EpiString.getString("GridCopySelected"),ECTM._contextMenuPopup,cb);
//           tool.Enabled = false;
//           

            tool = ECTM._addTool("EpiGridTagAll","EpiGridTagAll",EpiString.getString("EpiGridTagAll"),ECTM._contextMenuPopup,cb);
            tool.IsFirstInGroup=true;
            tool = ECTM._addTool("EpiGridTagSelected","EpiGridTagSelected",EpiString.getString("EpiGridTagSelected"),ECTM._contextMenuPopup,cb);
            tool.Enabled=(cb.GridObj&&cb.GridObj.get_Selected().Rows.Count > 0);
            // code to disable/enable            

//           tool = ECTM._addTool("EpiGridPasteInsert","EpiGridPasteInsert",EpiString.getString("GridPasteInsert"),ECTM._contextMenuPopup,cb);
//           tool.Enabled = false;
//           
//           tool = ECTM._addTool("EpiGridPasteUpdate","EpiGridPasteUpdate",EpiString.getString("GridPasteUpdate"),ECTM._contextMenuPopup,cb);
//           tool.Enabled = false;
           
//           tool = ECTM._addTool("EpiSaveLayouts","EpiSaveLayouts",EpiString.getString("GridSaveLayout"),ECTM._contextMenuPopup,cb);
//           tool.Enabled = false;
           
       }
       else if(cb.Control.DataView)
       {
            tool = ECTM._addTool("EpiTagRecord","EpiTagRecord",EpiString.getString("EpiTagRecord"),ECTM._contextMenuPopup,cb); 
            tool.IsFirstInGroup=true;
       }
//       if (cb.addCutCopyPaste)
//       {
//            // Cut,Copy,Paste...
//           tool = ECTM._addTool("EpiCut","EpiCut",EpiString.getString("CutTool"),ECTM._contextMenuPopup,cb);
//           tool.IsFirstInGroup = true;
//           tool.Enabled = (!cb.isPasswordControl && cb.hasSelectedText && !cb.isReadOnly); // set the Enabled (if not password, not readonly, has selected text)
//           
//          // create the Copy Tool
//          tool = ECTM._addTool("EpiCopy","EpiCopy",EpiString.getString("CopyTool"),ECTM._contextMenuPopup,cb);
//          tool.Enabled = (!cb.isPasswordControl && cb.hasSelectedText);
//         
//          // create the Paste Tool
//          tool = ECTM._addTool( "EpiPaste","EpiPaste",EpiString.getString("PasteTool"),ECTM._contextMenuPopup,cb);
//          tool.Enabled = false; // TODO: Need to implement clipboard first(!cb.isReadOnly && clipboardObject != null && clipboardObject.ToString().Length > 0);// set the Enabled (not readonly, has clipboard text)
//          
//          // create the Select All Tool
//          tool = ECTM._addTool( "EpiSelectAll","EpiSelectAll",EpiString.getString("SelectAllTool"),ECTM._contextMenuPopup,cb);
//          tool.Enabled = cb.hasSelectableText;   // set the Enabled (has selectable text)
//      }
//       if (cb.addCalculator)
//       {
//            var tool =ECTM._addTool("EpiCalc","EpiCalc",EpiString.getString("CalculatorTool"),ECTM._contextMenuPopup,cb);
//            // set the Enabled (not readonly)
//            tool.Enabled = !cb.isReadOnly;
//            tool.IsFirstInGroup = true;
//       }
//       // _addTool:function(menuType,menuCall,menuText,popupMenu)
//       // MenuText,MenuType,MenuCall
//       if (cb.addSpellCheck) 
//       {
//          var tool =ECTM._addTool("EpiSpell","EpiSpell",EpiString.getString("SpellingTool"),ECTM._contextMenuPopup,cb);
//          // set the Enabled (not readonly)
//          tool.Enabled = (!cb.isReadOnly && cb.hasSelectableText);
//          tool.IsFirstInGroup = true;       
//       }
//        if (cb.addInsertFile) 
//        {
//          var tool =ECTM._addTool("EpiInsertFile", "EpiInsertFile",EpiString.getString("ImportFileTool"),ECTM._contextMenuPopup,cb);
//          // set the Enabled (not readonly)
//          tool.Enabled = !cb.isReadOnly;
//        }
//        if (cb.addMailDialog) 
//        {
//            var tool =ECTM._addTool("EpiContextEmail", "EpiContextEmail",EpiString.getString("EmailTool"),ECTM._contextMenuPopup,cb);
//            tool.IsFirstInGroup = true;  
//        }
        if (cb.addRefreshList) 
        {
            var tool =ECTM._addTool("EpiRefreshList", "EpiRefreshList",EpiString.getString("RefreshList"),ECTM._contextMenuPopup,cb);
            // set the Enabled (not readonly)
            tool.Enabled = !cb.isReadOnly;
        }
    
    },
    _buildTreeTools:function(ContextBinding)
    {
        // find the current EpiTreeView and EpiTreeNode
        var EpiTree = ContextBinding.Control;
        if (EpiTree == null) return;
        var EpiNode = EpiTree._nodeUnderMouse;//EpiTree.GetNodeFromPoint(EpiTree.lastTreePosition)
        if (EpiNode == null) return;
        ContextBinding.TreeNode=EpiNode;
        var Form = Global.Form;//EpiTree.TopLevelControl as EpiBaseForm;
        // add personalize tool if TopLevel node
        // Personalize context menu not required
//        if (EpiNode.IsRootLevelNode)
//        {
//            ToolBase personalizeTool = EpiContextTool.BuildContextTool(EpiString.getString("Personalization"),
//                "EpiTreeTool", "Personalize", "Personalization", ContextBinding);
//            // add the tool
//            addToolToPopupMenu(personalizeTool, _contextMenuPopup);
//        }
        // build the AddNew tools?
        // EpiNode.IsFolderNode && EpiNode.EpiDataView.AddEnabled
        if (Form != null && EpiNode.EpiDataView && 
            (EpiNode.IsRootLevelNode && EpiNode.EpiDataView.AddEnabled
            || EpiNode.IsRootLevelNode && Form.trans.get_AddNewText().length > 0))
        {
            // get the AddNew text
            var s;
            if (EpiNode.EpiDataView.AddText.length > 0)
            {
                s = EpiNode.EpiDataView.AddText;
            }
            else
            {
                s = "Add New...";
                if (EpiNode.IsRootLevelNode && Form.trans.get_AddNewText().length > 0)
                    s = Form.trans.get_AddNewText();
            }
            var txt = EpiString.GetAddText(s, Form);
            if (txt.length <= 0) txt = s;
            // build the tool
            var addNewTool = ECTM._addTool("EpiTreeTool","EpiAddNew" + EpiNode.EpiDataView.AddText,txt,ECTM._contextMenuPopup,ContextBinding);
            // check if AddNew is enabled
            var menuTool = Form.myTool.Tools["EpiAddNew" + EpiNode.EpiDataView.AddText];
            if (menuTool)
                addNewTool.Enabled = menuTool.Enabled;
                
//            var addNewTool = EpiContextTool.BuildContextTool(txt,
//                "EpiTreeTool", "EpiAddNew" + EpiNode.EpiDataView.AddText, "New", ContextBinding);
//            addToolToPopupMenu(addNewTool, _contextMenuPopup);
        }
        if(EpiNode.EpiDataView)
        {
            tool = ECTM._addTool("EpiTagRecord","EpiTagRecord",EpiString.getString("EpiTagRecord"),ECTM._contextMenuPopup,ContextBinding); 
            tool.IsFirstInGroup=true;
        }
    },
   _createContextMenuForForm:function()
   {
   return;
        // Create help menu if missing
        var helpTool = Global.Form.myTool.Tools["EPI_PANEL_HELP"];
        if (!helpTool) // Do this only the first time...thereafter use the same menus - not sure if this will work when we implement the tool clicks
        {
            helpTool = new Tool("EPI_PANEL_HELP",{"Type":"PopupMenuTool","Caption":EpiString.getString("Help")});
            
            ECTM._addTool("EpiBasePanelTool","CustomerCenterTool",EpiString.getString("CustomerCenter"),helpTool);
            ECTM._addTool("EpiBasePanelTool","OnlineSupportTool",EpiString.getString("OnlineSupport"),helpTool);
            ECTM._addTool("EpiBasePanelTool","TechUpdateTool",EpiString.getString("TechUpdate"),helpTool);
            ECTM._addTool("EpiBasePanelTool","HelpTool",EpiString.getString("ApplicationHelp"),helpTool);
            ECTM._addTool("EpiBasePanelTool","HelpTutorialTool",EpiString.getString("ApplicationTutorial"),helpTool);
            ECTM._addTool("EpiBasePanelTool","AboutTool",EpiString.getString("About"),helpTool);
            Global.Form.myTool.Tools.Add(helpTool);
        }
        
        if (!ECTM._epiPanelPopup.Tools["EPI_PANEL_HELP"])
            ECTM._epiPanelPopup.Tools.Add(helpTool);
            
        ECTM._addTool("EpiBasePanelTool","Options",EpiString.getString("Options"),ECTM._epiPanelPopup);
        ECTM._addTool("EpiBasePanelTool","TranslationUtility",EpiString.getString("TranslationUtility"),ECTM._epiPanelPopup);
        ECTM._addTool("EpiBasePanelTool","RefreshTranslation",EpiString.getString("RefreshTranslation"),ECTM._epiPanelPopup);
        ECTM._addTool("EpiBasePanelTool","SaveLayouts",EpiString.getString("SaveLayouts"),ECTM._epiPanelPopup);
        ECTM._addTool("EpiBasePanelTool","ResetLayoutstoBase",EpiString.getString("ResetLayoutstoBase"),ECTM._epiPanelPopup);
        ECTM._addTool("EpiBasePanelTool","ResetLayoutstoLastSaved",EpiString.getString("ResetLayoutstoLastSaved"),ECTM._epiPanelPopup);
        ECTM._addTool("EpiBasePanelTool","Personalization",EpiString.getString("Personalization"),ECTM._epiPanelPopup);
        
       
     },
     _addTool:function(menuType,menuCall,menuText,popupMenu,cb,isBaseTool)
     {
        var epiTool = {"MenuType":menuType,"MenuCall":menuCall,"MenuText":menuText,"CB":cb,"IsContextMenu":true};
        var tool = null;
        if (Global.Form.myTool) tool = Global.Form.myTool.Tools[menuCall];
        if (!tool)
        {
            tool = ECTM._createTool(menuType,menuText, menuCall);
            if (Global.Form.myTool) Global.Form.myTool.Tools.Add(tool);
        }

        if ((isBaseTool) && (menuType != "EpiTreeTool"))
        {
            if (!ECTM._contextMorePopup)
            {
              ECTM._contextMorePopup = new Tool("EpiContextMore",{"Type":"PopupMenuTool","Caption":EpiString.getString("ContextOpenWithOptions")});
            }
            if (!ECTM._contextMorePopup.Tools[menuCall]) ECTM._contextMorePopup.Tools.Add(tool);
        }
        else if (!popupMenu.Tools[menuCall])
        {
            popupMenu.Tools.Add(tool);
        }
        tool.Tag = epiTool;
        return tool;
     },
     _createTool:function(menuType,menuText,menuCall)
     {
        var contextTool;
        if (menuType.toUpperCase().StartsWith("EPISTATE"))
            contextTool = new StateButtonTool(menuCall,{"Type":"StateButtonTool","Caption":menuText,"DisplayStyle":"DisplayCheckmark"});
        else
            contextTool = new ButtonTool(menuCall,{"Type":"ButtonTool","Caption":menuText});
            
        return contextTool;
     },
     _processMenuOptions : function(menuItem,tool,menuType,cb,view,dc)
     {
         if (!tool.Tag) tool.Tag = {};
         var epicontextTool=tool.Tag;
         
         switch (menuType)
         {
            case "BPMHoldAttach":
                {
                    var needAltKey = Convert.ToBoolean(menuItem.NeedAlternateKey);
                    if (needAltKey == undefined) needAltKey = false;
                    var contextOptions;
                    if (needAltKey) contextOptions = ECTM._processAlternateKeyOptions(menuItem,cb);
                    if ((needAltKey && !contextOptions) ||
                            !view || view.Row < 0 ||
                            view.dataView.Rows[view.Row]["RowMod"] == DataRowState.Added ||
                            !view.dataView.Rows[view.Row][dc] ||
                            view.dataView.Rows[view.Row][dc].toString().length <= 0)
                    {
                       delete tool;
                       return; // return undefined
                    }
                    if (needAltKey) epicontextTool.ContextOptions = contextOptions;

                    return tool;
                }
                break;
            case "BaseForm":
                {
                
                    var contextOptions = ECTM._processAlternateKeyOptions(menuItem,cb);
                    epicontextTool.ContextOptions = contextOptions;
                    epicontextTool.ContextValue = ECTM._getContextValue(menuItem,cb,view,dc);
                    return tool;
                }
                break;
                
            case "BaseSearch":
                // process the BaseSearch options (Search filter)
                epicontextTool.ContextOptions = ECTM._processSearchFilterOptions(menuItem,cb);
                break;
            case "QuickSearch": 
            {
                var setDefault = (menuItem.QSContextDef && Convert.ToBoolean(menuItem.QSContextDef));
                var hasCaller = false;
                 // no launch node and no shared default set
                if (menuItem.LaunchOptions && menuItem.LaunchOptions.CalledFrom)
                {
                     var caller = menuItem.LaunchOptions.CalledFrom[cb.WhoAmI];
                     if (caller)
                     {
                        hasCaller = true;
                        if (setDefault && ECTM._defQuickSrch.length <= 0)
                            ECTM._defQuickSrch = tool.Key;
                     }
                }
                else
                {
                    hasCaller = true;
                    // no launch node and no shared default set
                    if (setDefault && ECTM._defQuickSrch.length <= 0)
                        ECTM._defSharedQuickSrch = tool.Key;
                }
                
                if (!hasCaller)
                {
                    delete tool;
                    return; // return undefined
                }
                return tool;
            }
            break;
         }
     },
     _processCustomContexts:function(cb,dv,dc)
     {
        // verify the EpiX and the collection of CustomHandlers
        var EpiX = Global.Form.trans;
        if (!EpiX || !EpiX.CustomContextHandlers || !EpiX.CustomContextHandlers.ContainsKey(cb.EpiBinding)) return;
        
        var customHandlers = EpiX.CustomContextHandlers[cb.EpiBinding]; // enum the collection of Handlers by EpiBinding
        var cci;
        var iEnum = customHandlers.GetEnumerator();
	    while (iEnum.MoveNext())
	    {
			cci = iEnum.Current;
            if (cci && cci.ReplacesProcessType.length <= 0)
            {
                // make sure the item is not already in the menu
                if (ECTM._contextMorePopup != null)
                {
                    for(var itm in ECTM._contextMorePopup.Tools.items)
                    {
                        if(ECTM._contextMorePopup.Tools.items[itm].SharedProps.Caption==cci.MenuText)
                        {
                            ECTM._contextMorePopup.Tools.items[itm].SetVisible(false);
                        }
                    }
                }
                ECTM._addTool("CustomContext",cci.MenuText,cci.MenuText, ECTM._contextMenuPopup,cb,true);
            }
        }
     },
     _processSearchFilterOptions:function(menuItem, cb)
     {
        var contextOptions = {};
        var srchOptions = menuItem.SearchOptions;
        if (srchOptions)
        {
            var calledFrom = srchOptions.CalledFrom[cb.WhoAmI];
            if (calledFrom)
            {
                for (var i=0,wcB; wcB = calledFrom.WhereClauseBinding[i];i++)
                {
                    if ((wcB.CurrentBinding && wcB.CurrentBinding == cb.EpiBinding) ||
                        calledFrom.WhereClauseBinding.length == 1)
                    {
                        contextOptions.CurrentBinding = cb.EpiBinding;
                        contextOptions.SearchTable = wcB.SearchTable;
                        contextOptions.SearchTitle = wcB.SearchTitle;
                        contextOptions.WhereClauseString = wcB.WhereClauseString;
                        contextOptions.WhereClauseTokens = wcB.WhereClauseBindingToken;
                        return contextOptions;
                    }
                }    
            
            }
        }
     },
     _getContextValue:function(menuItem,cb,dv,dc)
     {
        var contextNode = menuItem.ContextValue;
        if (menuItem.LaunchOptions && menuItem.LaunchOptions.CalledFrom)
        {
            var calledFrom = menuItem.LaunchOptions.CalledFrom[cb.WhoAmI];
            if (calledFrom)
            {
                if (calledFrom.ContextValue) contextNode = calledFrom.ContextValue;
                if (calledFrom.AlternateKey)
                {
                    for (var i=0,altKey; altKey = calledFrom.AlternateKey[i];i++)
                    {
                        if (altKey.CurrentBinding == cb.EpiBinding)
                        {
                            if (altKey.ContextValue) contextNode = altKey.ContextValue;
                            break;
                        }
                    }
                }
            }
        }
        
        if (contextNode && contextNode.SubstitutionTokens)
        {
            var keyType="",keyValue="",NewValue="",NewLike="",epiBind="",attr="",hasValueAttr=false,origValue="",origLike="",hasLikeAttr=false,hasBindAttr=false;
            for (var i=0,subs; subs=contextNode.SubstitutionTokens[i];i++)
            {
                for (var a in subs)
                {
                    attr=subs[a];
                    switch(a)
                    {
                        case "ConstantKey":  // get the ConstantKey args
	                        keyType = a;
	                        keyValue = attr;
	                    break;
                        case "LikeKey":
                        case "ColumnKey":
                        case "EpiBinding": // get the Like/Column or EpiBinding args
	                        keyType = a;
	                        keyValue = attr;
	                        break;
                        case "Value":// get the Value args
	                        origValue = attr;
	                        hasValueAttr = true;
	                        break;
                        case "Like":  // get the Like args
	                        origLike = attr;
	                        hasLikeAttr = true;
	                        break;
                        case "SourceBinding":  // get the SourceBinding args
	                        hasBindAttr = true;
	                        break;
                    }
                 }
                 if (keyType.length > 0 && keyValue.length > 0)
                 {
                    epiBind = keyValue;
                    switch (keyType)
                    {
                        case "LikeKey":
                            epiBind = ECTM._getEpiBindingFromLike(keyValue, cb,dv);  // get the EpiBinding based on the "Like" value
                            epiBind = ECTM._getColumnValue(epiBind, cb,dv);// get the Value using the EpiBinding
                            NewValue = Global.ArgManager['Out1'];
                            NewLike = Global.ArgManager['Out2'];
                            break;
                        case "ColumnKey":
                        case "EpiBinding":
                            epiBind = ECTM._getColumnValue(epiBind, cb,dv);// get the Value using the Column or EpiBinding
                            NewValue = Global.ArgManager['Out1'];
                            NewLike = Global.ArgManager['Out2'];
                            break;
                        case "ConstantKey":
                            epiBind = "GlobalConstant." + KeyValue;// dont set the SourceBinding attribute
                            NewLike = epiBind;
                            try
                            {
                                NewValue = ""; // TODO: This is a server call, we shud get the Global.Constants using ASP. FormFunctions.GetGlobalConstants(cmb.ILaunchSender)["Constant: " + args.KeyValue].ToString(); // get the GlobalConstant value
                                DebugHelper.WriteMessage("ConstantKey accessed for: "+epiBind, false);
                            }
                            catch (ex)
                            {
                                DebugHelper.WriteError("Error caught in _getContextValue: ", ex);
                            }
                            break;
                    }
                    
                    if (origValue.length<=0)
                          subs.Value = NewValue;
                    if (origLike.length<=0 && NewLike.length>0)
                        subs.Like = NewLike;
                    subs.SourceBinding = epiBind;
                }
                //keyType = "EpiBinding";
                //keyValue = subs.EpiBinding;
                //if (keyValue)
                //{
                //        subs.Value = dv.dataView.Rows[dv.Row][dc].toString();
                //        subs.Like = dv.dataView.Table.GetExtendedProperty(dc,"Like");
                //        subs.SourceBinding = cb.EpiBinding;
                //}
                     
		    }
		    return contextNode;
	    }
        return null;
     },
	_getColumnValue:function(EpiBinding,cmb,dv)
	{
		// init the out string parameters
		var NewValue = String.Empty;
		var NewLike = String.Empty;
		
		// Get the Value and Like from EpiBinding
		if (EpiBinding.IndexOf(".") <=0)
		{
			// only sent in column name, use current binding to get EDV name
			EpiBinding = cmb.EpiBinding.Substring(0, cmb.EpiBinding.IndexOf("."))
				+ "." + EpiBinding;
		}
		// parse the EpiBinding and get the EpiDataView
		var tVueNam = EpiBinding.Substring(0, EpiBinding.IndexOf("."));
		var tColNam = EpiBinding.Substring(EpiBinding.IndexOf(".")+1);
		var tEDV = Global.BindingEngine.EpiDataViews[tVueNam];
		try
		{
			// get the Value and Like from EDV DataColumn
			NewValue = tEDV.dataView.Rows[tEDV.Row][tColNam].toString();
			NewLike = tEDV.dataView.Table.GetExtendedProperty(tColNam,"Like");
		}	
		catch (ex)
		{
          DebugHelper.WriteError("Error caught in _getColumnValue: ", ex);
		}
		
	    Global.ArgManager['Out1'] = NewValue;
	    Global.ArgManager['Out2'] = NewLike;
	    return EpiBinding;
	},
     _getEpiBindingFromLike:function(Like,cmb,dv)
     {
        for(var dc in dv.dataView.Table.Columns)
        {
            if (dv.dataView.Table.GetExtendedProperty(dc,"Like") == Like)
                return dc;
        }
        return null;
        
     },
     _processAlternateKeyOptions:function(menuItem,cb)
     {
        var launchOp = menuItem.LaunchOptions;
        if (!launchOp) return null;
        var caller = launchOp.CalledFrom[cb.WhoAmI];
        if (caller)
        {
            var CMAltKey = {};
            CMAltKey.CurrentBinding = cb.EpiBinding;
            CMAltKey.IsModal = (caller.LaunchModal != undefined && Convert.ToBoolean(caller.LaunchModal));
            CMAltKey.StopPubs = (caller.SuppressPublisher != undefined && Convert.ToBoolean(caller.SuppressPublisher));
            CMAltKey.IsReadOnly = (caller.EpiReadOnly != undefined && Convert.ToBoolean(caller.EpiReadOnly));
            // Build Alternatebinding
            var altKeys = [];
            if (caller.AlternateKey && caller.AlternateKey.length > 0)
            {
                for (var i=0,altKey; altKey = caller.AlternateKey[i];i++)
                {
                    if (!altKey.CurrentBinding || altKey.CurrentBinding == cb.EpiBinding)
                    {
                        for (var iKey=0,altKeyB;altKeyB=altKey.AlternateKeyBinding[iKey];iKey++)
                            altKeys.push(altKeyB);
                        break;
                    }
                }
            }
            if (altKeys.length == 0)
                altKeys.push(cb.EpiBinding);
            
            if (altKeys.length > 1)
            {
                CMAltKey.IsCompoundKey= true;
                CMAltKey.CompoundKeyBinding= altKeys;
                CMAltKey.AlternateKeyBinding = ""; // clear
            }
            else if (altKeys.length == 1)
                CMAltKey.AlternateKeyBinding = altKeys[0];
           
                
            return CMAltKey;
        }
        return null;
     },
     _getCustomContextMenu:function(MenuType, cb)
    {
        var customHandlers = Global.Form.trans.CustomContextHandlers[cb.EpiBinding];
        if (customHandlers)
        {
            var iEnum = customHandlers.GetEnumerator();
		    while (iEnum.MoveNext())
		    {
			    var cci = iEnum.Current;
			    if (cci.ReplacesProcessType == MenuType)
				    return cci.MenuText;
		    }
       
        }
        return null;
    },
    AddContextMenuItem:function()
    {
        var a = arguments;
        var tempArray = new Array();
        for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
        var overload = Global.GetOLSeqForArgTypes(tempArray);
        
        switch(overload)
        {
            case "MenuItem_ContextMenuBinding_String":
            ECTM.AddContextMenuItem_1(a[0],a[1],a[2]);
            break;
            case "MenuItem_ContextMenuBinding":
            ECTM.AddContextMenuItem_2(a[0],a[1]);
            break;
        }
    },
    AddContextMenuItem_1:function(ContextItem,ContextBinding,PopupMenuText)
    {
        var newPopup;
        if (!Global.Form.myTool.Tools[PopupMenuText])
        {
            newPopup = new Tool(PopupMenuText,{"Type":"PopupMenuTool","Caption":PopupMenuText});
            Global.Form.myTool.Tools.Add(newPopup);
        }
        else
        {
            newPopup = Global.Form.myTool.Tools[PopupMenuText];
        }
        if (!ECTM._contextMenuPopup.Tools[PopupMenuText])
                ECTM._contextMenuPopup.Tools.Add(newPopup);
        var iconName = String.Empty;
        if (ContextItem.Tag != null && ContextItem.Tag.toString().length > 0)
            iconName = ContextItem.Tag.toString();
        var tool = ECTM._addTool("",ContextItem.Text,ContextItem.Text,newPopup,ContextBinding);
        var epiTool = tool.Tag;
        epiTool.MenuItem = ContextItem;
    },
    AddContextMenuItem_2:function(ContextItem,ContextBinding)
    {
        var iconName = String.Empty;
        if (ContextItem.Tag != null && ContextItem.Tag.toString().length > 0)
            iconName = ContextItem.Tag.toString();

        var tool = ECTM._addTool("",ContextItem.Text,ContextItem.Text,ECTM._contextMenuPopup,ContextBinding);
        var epiTool = tool.Tag;
        epiTool.MenuItem = ContextItem;
    },
    _doMenuClick:function(toolCtrl, toolObj) // if we handle the event, return true else return false
    {
        var epiTool = toolObj.Tag; // cast the Tool.Tag as EpiContextTool or bail
        if (!epiTool) return false;
        
        if (epiTool.MenuItem != null)
        {
            epiTool.MenuItem.PerformClick();
            return;
        }

        var eventHandled = true;
        switch (epiTool.MenuType)
        {
            case "BPMHoldAttach":
            case "BaseForm":
                // Handle the Launch of BaseForm
                ECTM._handleBaseForm(epiTool); // TODO
                break;
            case "BaseSearch":
                // Handle the Search Dialog
                ECTM._handleBaseSearch(epiTool); // TODO
                break;
            case "EpiRefreshList":
                // Handle the Combo Refresh list request
                var comboObj= epiTool.CB.Control;
                comboObj.ForceRefreshList();
                break;
            case "EpiSelectAll":
                // Handle the SelectAll Tool click event
                var obj = epiTool.CB.Control;
                if (epiTool.CB.Grid && obj.SelectAll) // if it has a SelectAll method
                    obj.SelectAll(Global.document.getElementById(obj.ID));
                else
                    obj.SelectText(Global.document.getElementById(obj.ID));
                break;
            case "NewQuickSearch":
                // Handle the Launch of QuickSearch Maintenance UIApp
                {
                    var lfo = new LaunchFormOptions();  // create new LaunchFormOptions
                    lfo.Sender = epiTool.CB.Sender;// set the LFO properties
                    lfo.Like = epiTool.CB.Like;
                    lfo.CallBackToken = "NewQuickSearch";
                    ProcessCaller.LaunchForm(lfo.Sender, "Epicor.Mfg.UI.QuickSearchEntry.dll", lfo, new EpiOverloadedArgs("Object_String_Object"));  // use the ProcessCaller to launch the QS Entry

                }
                break;
            case "EpiBasePanelTool":
//                handleBasePanelTool(epiTool); 
                break;
            case "CustomContext":
                {
                    var EpiX = epiTool.CB.Sender;
                    if (EpiX)
                    {
                        var mi = new EpiContextMenuItem();
                        mi.Binding=epiTool.CB;
                        mi.Like=epiTool.CB.Like;
                        mi.ContextValue=epiTool.CB.originalValue
                        mi.Text=epiTool.MenuCall;
                        
                        ECTM._handleReturnValue(epiTool, EpiX.HandleContextClick(
                            mi, epiTool.CB.originalValue,
                            epiTool.CB.EpiBinding, epiTool.MenuCall));
                    }
                }
                break;
            case "EpiTreeTool":
                ECTM._handleTreeToolClick(epiTool);
                break;
            case "QuickSearch":
                ECTM._handleLaunchQuickSearch(epiTool);
                break;
            case "EpiTagRecord":
                ECTM._showTagMaintDialog(epiTool,TagType.SingleRecord);
                break;
            case "EpiGridTagAll":
                ECTM._showTagMaintDialog(epiTool,TagType.AllRecords);
                break;
            case "EpiGridTagSelected":
                ECTM._showTagMaintDialog(epiTool,TagType.SelectedRecords);
                break;
            case "EpiStateGroupBy":
                ECTM._handleGridGroupBy(epiTool);
                break;
            case "EpiStateSummary":
                ECTM._handleGridSummary(epiTool);
                break;
            case "ZoneBAQ":
                ECTM._handleZoneBAQ(epiTool); // Handle the Zone BAQ
                break;
            case "EpiCMMaint":
            case "EpiContextEmail":
            case "DescForm":
            case "EpiCut":
            case "EpiCopy":
            case "EpiPaste":
            case "EpiSpell":
            case "EpiInsertFile":
            case "EpiCalc":
            case "EpiClearSort":
            case "EpiGridCopyAll":
            case "EpiGridCopySelected":
            case "EpiGridPasteInsert":
            case "EpiGridPasteUpdate":
            case "EpiSaveLayouts":
            case "EpiStatusBarTool":
                break;           
            default:
                eventHandled = false; // Event not handled
                break;
        }
        
        return eventHandled;
    },
    _handleZoneBAQ:function(epiTool)
    {
        // get the UIElement Parent
        var parent = null;
        // get the parent from the current Control
        var cmb = epiTool.CB;
        if (cmb.Control)
        {
            if (cmb.Control.InGrid)
                parent = cmb.DivCtrl;
            else
                parent = Global.document.getElementById(cmb.Control.ID);
        }
        if (parent != null)
        {
            this.epizoneExt = true;
            cmb.Control._createEpiZone(parent, null, true, epiTool.MenuCall);
            cmb.Control.EpiZone._showContextPopup();
        }
    },
    _handleLaunchQuickSearch:function(epiTool)
    {
        var keyFieldSearch = false;
        var baseSearchId = String.Empty;

        var cmb = epiTool.CB;
        if (cmb.Control)
        {
            var iebc = cmb.Control;
            if (iebc.EpiKeyField)
            {
                baseSearchId = SearchWorker.getBaseSearchProcess(cmb.Like);
                if (baseSearchId.length > 0)
                    keyFieldSearch = true;
            }
        }
        var origSender = cmb.Sender;
        if (origSender == null) origSender = Global.Form.trans;
        
        var o = Global.LaunchQuickSearch(origSender,epiTool.MenuCall, keyFieldSearch, new DataTable());
        if (keyFieldSearch)
        {
            // freed thread
            var al = new ArrayList();
            for(var itm in o.items)
            {
                al.Add(o.items[itm]);
            }
            
            if (al!=null && al.TypeName=="ArrayList" && al.Count > 0)
            {
                if (al.Count == 1)
                {
                    ECTM._handleReturnValue(epiTool, al[0].toString());  
                }
                else
                {
                    SearchWorker.HandleMultiSelectQuickSearch(al, cmb, baseSearchId);
                }
            }
        }
        else if(o!=null)
        {
            ECTM._handleReturnValue(epiTool, o);  
        }
    },
    _showTagMaintDialog:function(epiTool,tagType)
    {
        var tag=new DataTagging();
        tag.ShowMaintForm(epiTool,tagType);        
    },
    _handleGridGroupBy:function(epiTool)
    {
        var epiGrid = epiTool.CB.GridObj
        if(epiGrid)
        {
            epiGrid.ToggleGroupBy(!epiGrid.get_HasGroupByShown());
        }
    },
    _handleGridSummary:function(epiTool)
    {
        var epiGrid = epiTool.CB.GridObj
        if(epiGrid)
        {
            epiGrid.ToggleSummaries(!epiGrid.get_HasSummariesShown());
        }
    },
    _handleTreeToolClick:function(epiTool)
    {
        var EpiTree = epiTool.CB.Control;
        if (EpiTree == null) return;

        var EpiNode = epiTool.CB.currentNode;
        if (EpiNode == null) return;

        if (EpiTree.MethodTree_ToolClick)
        {
            EpiTree.MethodTree_ToolClick(epiTool);
            return;
        }

        Form = Global.Form;
        // determine behavior based on MenuCall
        switch (epiTool.MenuCall)
        {
/*
            case "Personalize":
                // Personalize TreeView
//                if (Form != null)
//                    Form.myTVP_EpiTreeCustomizing(EventArgs.Empty);
                break;
            case "PrintAttachment":
                // Print Attachment
//                if (EpiNode.IsAttachmentNode) Panel.printAttachment(EpiNode);
                break;
*/
            case "RemoveAttachment":
                if (EpiNode.IsAttachmentNode) AttachmentHandler.RemoveAttachment(EpiNode);
                break;
            case "EditAttachment":
                if (EpiNode.IsAttachmentNode) AttachmentHandler.EditAttachment(EpiNode);
                break;
            case "OpenAttachment":
                if (EpiNode.IsAttachmentNode) EpiTree.openAttachment(EpiNode);
                break;
            case "AddAttachment":
                var nd = null;
                if (EpiNode.IsAttachmentFolder || EpiNode.IsAttachmentParent)
                    nd = EpiNode;
                else if (EpiNode.Parent && EpiNode.Parent.IsAttachmentFolder)
                    nd = EpiNode.Parent;
                if (nd) AttachmentHandler.AddAttachment(nd);                
                break;
            default:
                // AddNew tools?
                if (epiTool.MenuCall.StartsWith("EpiAddNew") && Form != null)
                {
                    var txt = epiTool.MenuCall.replace("EpiAddNew", "");
                    Form.myTVP_EpiTreeNodeAdding({"AddText":txt});
                }
                break;
        }
    },
    _handleBaseSearch:function(EpiTool)
    {
        // check if KeyField control that launched the Context
        var iEpiBoundCtrl = EpiTool.CB.Control;
        if (iEpiBoundCtrl != null && iEpiBoundCtrl.EpiKeyField)
        {
            if (iEpiBoundCtrl.EpiLabel)
            {
                var btnControl = Global.BindingEngine.Controls[iEpiBoundCtrl.EpiLabel];
                if (btnControl) 
                {
                    btnControl.get_Event("Click").fire();
                    return;
                }
            }
        }

        // if not valid LIKE or LIKE ends with GLControl
        if (EpiTool.CB.Like.length <= 0 || EpiTool.CB.Like.toUpperCase().EndsWith("GLCONTROL") || EpiTool.CB.Like.toUpperCase().EndsWith("GLACCOUNTEDITOR") || EpiTool.CB.Like.toUpperCase().EndsWith("GLACCOUNT"))
        {
            // go handle standard adapter search
//            handleAdapterSearch(EpiTool);
            // Get the adapter name and search mode
            var parts = EpiTool.MenuCall.split(".");
            var adapter = parts[0];
            var mode =parts[1];
            var returnVal = null;

            // if GLControl invoke different search
            if (EpiTool.CB.Like.toUpperCase().EndsWith("GLCONTROL"))
                returnVal = ProcessCaller.LaunchSearch(EpiTool.CB.Sender,adapter, mode, true, true, EpiTool.CB.Like,new EpiOverloadedArgs("Object_String_String_Boolean_Boolean_String"));
            else if (EpiTool.CB.Like.toUpperCase().EndsWith("GLACCOUNTEDITOR") || EpiTool.CB.Like.toUpperCase().EndsWith("GLACCOUNT"))
            {
                var accountEditor = EpiTool.CB.Control;
                if(accountEditor!=null)
                {
                    var opts = accountEditor.GetSearchOptions(mode, EpiTool.CB.Like);
                    returnVal = ProcessCaller.LaunchSearch(EpiTool.CB.Sender, adapter, opts,new EpiOverloadedArgs("Object_String_SearchOptions"));
                }
            }
            else
            {
                returnVal = ProcessCaller.LaunchSearch(EpiTool.CB.Sender,adapter, mode,new EpiOverloadedArgs("Object_String_String"));
            }

            if (returnVal != null) ECTM._handleReturnValue(EpiTool, returnVal);  // if Return value not null go invoke the ReturnValue handler
            return;
        }
        // init some method members
        var table = "";
        var title = "";
        var filter = "";
        // check if we have ContextMenu where clause
        var contextWC = EpiTool.ContextOptions;
        if (contextWC && EpiTool.CB.Sender instanceof EpiTransaction)
        {
            // re-config the Table, Title, and Filter from ContextMenuWC
            table = contextWC.SearchTable;
            title = contextWC.SearchTitle;
            filter = contextWC.WhereClauseString;
            // enum the WhereClause tokens
            if(contextWC.WhereClauseTokens)
            {
                for(var counter=0,tokenBinding;tokenBinding=contextWC.WhereClauseTokens[counter];counter++)
                {
                    var token = ECTM._getCurrentValue(tokenBinding); // get the current value from the EpiBinding Manager
                    if (token != null) filter = filter.replace("%"+counter, token);  // do the token replace
                }
            }
        }

       // Find the process key using the Like
       if (!ECTM.ContextMenuData) ECTM.GetContextMenuXml();
//       var contextM = ECTM.ContextMenuData.CustomCMenu[EpiTool.CB.Like];
//       if (!contextM) 
       var contextM = ECTM.ContextMenuData[EpiTool.CB.Like];
       var pKey = "";
       if (contextM != undefined && contextM.MenuItems)
       {
            var menuCall, menuText,menuType,contextTool;
            for (var i=0,menuItem;menuItem=contextM.MenuItems[i];i++)
            {   
                if (menuItem["ProcessType"] == "BaseSearch")
                {
                    pKey = menuItem["ProcessCall"];
                    if (menuItem["BOName"] && menuItem["BOName"]!="")
                        pKey = menuItem["BOName"];
                        
                     break;
                }
            }
       }
             
	    if (pKey.length <= 0) return null;
        var parts = pKey.split(".");
		var adapt = parts[0];
		var mode = parts[1];

	    var rtnMode = (mode.toUpperCase() == "ROWS")? DataSetMode.RowsDataSet: DataSetMode.ListDataSet;
		var opts = SearchOptions.CreateSearchForm(rtnMode);
		opts.SelectMode = SelectMode.SingleSelect;
		opts.Like = EpiTool.CB.Like;

		if (filter != null && filter.length>0)
			opts.PreLoadSearchFilter = filter;
		if (table != null && table.length>0)
			opts.PrimaryTableName = table;
		if (title != null && title.length>0)
			opts.SearchTitle = title;

		var iLaunch = EpiTool.CB.Sender;
		if (iLaunch != null) opts.WhoCalledSearch = iLaunch.WhoAmI;
		opts = EpiSearchEngine.ApplyAutoSearchFilter(opts);

		var rslt = ProcessCaller.LaunchSearch(EpiTool.CB.Sender, adapt, opts, new EpiOverloadedArgs("Object_String_SearchOptions"));
		if (!rslt) return rslt;

        parts = EpiTool.CB.Like.split(".");
		var tableName = parts[0];
		var columnName = parts[1];
		if (mode == "List") tableName = tableName + "List";
//		return getColumnFromSearchResults(columnName, rslt, tableName, 0);
        var tbl =  rslt.Tables[tableName];
        var val = "";
        if (tbl &&  tbl.Rows[0])
        {
            val = tbl.Rows[0][columnName].toString();
        }
		ECTM._handleReturnValue(EpiTool, Global.InstanceOf(EpiTool.CB.Control, "EpiGLAccountEditor") ? rslt : val);
    },
    _handleReturnValue:function(EpiTool, ReturnValue)
    {
        if (ReturnValue == null) return;
        // get the Initiating control
        var ctrl = EpiTool.CB.Control;
        if (ctrl && Global.InstanceOf(ctrl,"EpiGLAccountEditor") && ReturnValue != null)
        {
            // for the GL Control, ReturnValue is a dataset.
            EpiTool.ReturnValue = ReturnValue;
            ctrl.ReturnHandler(EpiTool, new EventArgs()); // fire the ReturnHandler
            return; // and bail out
        }
        // verify the Control and return value
        if (ctrl && !EpiTool.CB.isReadOnly && ReturnValue.toString().length > 0)
        {
            //if (EpiTool.CB.Grid && ctrl.ActiveCell != EpiTool.CB.GridCell) return; // TODO: need to add ActiveCell and GridCell properties first
       
            // cast the Return Value to string
            EpiTool.ReturnValue = ReturnValue;
            // fire the ReturnHandler
            ctrl.ReturnHandler(EpiTool, new EventArgs());
            // and bail out
            return;
        }
    },
    _handleBaseForm:function(epiTool)
    {
        var contextAK = epiTool.ContextOptions;
        var iTrans = epiTool.CB.Sender;
        var compoundBinding;
        var currentVal = epiTool.CB.originalValue;
        // if there is ContextMenuAlternateKeys lets use these
        if (contextAK != null)
        {
            // has compound alternate keys?
            if (contextAK.IsCompoundKey)
            {
                // init the string arrays
                var contextValues = [];
                var contextLikes = [];
                // enum the CompoundKeyBindings
                for (var i = 0; i < contextAK.CompoundKeyBinding.length; i++)
                {
                    var altKey = contextAK.CompoundKeyBinding[i];
                    // get the values from the Dashboard
                    if (iTrans != null) // get the values from EpiBinding Manager
                    {
                        contextValues[i] = ECTM._getCurrentValue(altKey);
                        contextLikes[i] = EpiBindingManager.GetLikeValue(altKey);
                    }
                }
                // build up a CompoundKeyBinding instance
                compoundBinding = new CompoundKeyBinding(contextValues,contextLikes, null);
            }
            else // not compound, only a single alternate key binding
            {
               if (iTrans) // get the value from EpiBindingMgr
                    currentVal = ECTM._getCurrentValue(contextAK.AlternateKeyBinding);
            }
        }
        // build up the LFO
        var lfo = new LaunchFormOptions();
        lfo.IsModal = (contextAK && contextAK.IsModal);
        lfo.EpiReadOnly = (contextAK && contextAK.IsReadOnly);
        lfo.Like = epiTool.CB.Like;
        lfo.ContextValue = epiTool.ContextValue;
        lfo.ValueIn = currentVal;
        if (compoundBinding) lfo.ValueIn = compoundBinding;
        if (epiTool.CB.CallBackToken && epiTool.CB.CallBackToken.length > 0)
            lfo.CallBackToken = epiTool.CB.CallBackToken;
        // init the Return Object
        var ReturnVal;
        // go handle the BPM Hold dialog
        if (epiTool.MenuType == "BPMHoldAttach")
        {
            var bKeyReplaced = false;
            if (contextAK != null)
            {
                bKeyReplaced = true;
                if (compoundBinding == null) lfo.Like = contextAK.AlternateKeyBinding;
            }
            
//            ReturnVal = ProcessCaller.LaunchBPMHoldsForm(epiTool.ContextBinding.Sender,
//                epiTool.MenuCall, bKeyReplaced, (compoundBinding != null), lfo);
                
            var c=new ProcessCaller(iTrans);
	        lfo.Sender = iTrans;
            var launchParams = new ArrayList();
	        launchParams.Add(lfo);
	        launchParams.Add(epiTool.MenuCall);
	        launchParams.Add(bKeyReplaced);
	        launchParams.Add(compoundBinding != null);
	        var o = c.callBaseForm("Epicor.Mfg.UI.BPHoldsEntry", "LaunchBPMForm", true, "", launchParams);
        }
        else // launch the standard UIApp
        {
            ReturnVal = ProcessCaller.LaunchForm(epiTool.CB.Sender,epiTool.MenuCall, lfo, new EpiOverloadedArgs("Object_String_Object"));
        }
        //if (ReturnVal != null) handleReturnValue(epiTool, ReturnVal); // TODO: Not sure if LaunchForm returns a value 
    },
    _getCurrentValue:function(epiBinding)
    {
        var parts  = epiBinding.split('.');
        var column = parts[1];
        var theView = Global.BindingEngine.EpiDataViews[parts[0]];
        if (!theView || theView.Row < 0 || !theView.dataView.Table.Columns[column]) return "";

        return theView.dataView.Rows[theView.Row][column].toString();
    },
    _getLikeValue:function(epiBinding)
    {
        var parts  = epiBinding.split('.');
        var column = parts[1];
        var theView = Global.BindingEngine.EpiDataViews[parts[0]];
        if (!theView || theView.Row < 0 || !theView.dataView.Table.Columns[column]) return "";
        return theView.dataView.Table.GetExtendedProperty(column,"Like");
    },
    OnBeforeBuildContextMenu:function(ContextBinding)
    {
        // bail out if not event listeners
        if (ECTM.get_Event("BeforeBuildContextMenu").subscribers.length == 0) return true;
        // create the cancel-able args
        var args = new HandleableContextToolEventArgs(ECTM._contextMenuPopup, ContextBinding);
        // fire the event
        ECTM.get_Event("BeforeBuildContextMenu").fire(Global.Form.myTool, args);
        // return Not Cancel
        return !args.Handled;
    },
    OnAfterBuildContextMenu:function(ContextBinding)
    {
        // bail out if no event listeners
        if (ECTM.AfterBuildContextMenu == null) return;
        // fire the event
        ECTM.get_Event("AfterBuildContextMenu").fire(Global.Form.myTool, new ContextToolEventArgs(ECTM._contextMenuPopup, ContextBinding));
    },
    GetContextMenuXml:function()
    {
        if (ECTM.ContextMenuData) return ECTM.ContextMenuData; 
        
        var boName = "lib_GenX";
	    if(!Global.LoadedProxies[boName])
	    { 	
            var proxyScript = Global.GetScript("script/Client" + boName + "ServiceProxies.js");
            eval(proxyScript);
            Global.window[boName + "Service"] = eval(boName + "Service");
            Global.LoadedProxies[boName] = boName;
        }
        var bo = new lib_GenXService();
        var cmData=bo.GetContextMenuInfo(); // Returns a merged version of the context menu doc.
        ECTM.ContextMenuData= JSON.parse(cmData);
    }
    
}

var EpiStyleSettings = Epicor.Mfg.UI.FrameWork.EpiStyleSettings = function() {}

var NodeTextGroup = Epicor.Mfg.UI.FrameWork.NodeTextGroup=function()
{
}
NodeTextGroup.prototype.Add=function(){}
NodeTextGroup.GetNTGFromPersonalization=function(){}
NodeTextGroup.GetKeyedNTGFromPersonalization=function(){}

var EpiControlHelper = Epicor.Mfg.UI.FrameWork.EpiControlHelper=function(ctrl)
{
    this.ctrlObj = ctrl;
}
EpiControlHelper.GetDesignMode=function() {return false;}
EpiControlHelper.GetBindingParse=function(value, binding, dataViewName)
{
	binding = null;
	dataViewName = null;
	var columnName = null;
	if (!String.IsNullOrEmpty(value))
	{
		// make sure the binding string is in the correct format
		if (value.IndexOf(".") > 0)
		{
			var tempColName = value.Substring(value.IndexOf(".") + 1);
			if (tempColName.IndexOf(".") > 0)
			{
				throw new SystemException("Invalid format for binding string. Correct format is 'DataViewName.ColumnName'");
			}
			columnName = tempColName;
			dataViewName = value.Substring(0, value.IndexOf("."));
			binding = value;
		}
		else
		{
			throw new SystemException("Invalid format for binding string. Correct format is 'DataViewName.ColumnName'");
		}
	}
	Global.ArgManager['Out1']=binding;
	Global.ArgManager['Out2']=dataViewName;
	
	return columnName;
}
EpiControlHelper.prototype.ColumnExists=function(ownerControl, dv, columnName, throwException)
{
    var ret = dv.dataView.Table.Columns[columnName];
    if (!ret)
    {
	    if (throwException)
	    {
		    if (ownerControl != null)
		    {
                var ctrl = ownerControl;
                var name = (ctrl == null) ? ctrl.Name : "unknown";
			    throw new SystemException(ownerControl.GetType().Name + " - " + name +
				    " - Bound Column - " + columnName + " - does not exist in " + dv.ViewName + "table.");
		    }
		    else
			    throw new SystemException("Bound Column - " + columnName + " - does not exist in " + dv.ViewName + "table.");
	    }
    }			
    return ret;
}
EpiControlHelper.prototype.CheckNotificationValidity=function(view, ar)
{
    if ((ar.Sender != this.ctrlObj) && (ar.Row >= 0) && (ar.Row > view.dataView.Count - 1))
    {
        //TraceProvider.TraceCatchException(new Exception("Invalid Notify Request -- current Row pointer exceeds count of available DataView rows"));
        return false;
    }
    return true;
}

var ManualEnabledState = Epicor.Mfg.UI.FrameWork.ManualEnabledState = {"None":0, "Enabled":1, "Disabled":2}
var EpiBaseAdapter = Epicor.Mfg.UI.FrameWork.EpiBaseAdapter = function()
{
    EpiObject.call(this, "EpiBaseAdapter");
    this.isBOEnabled = true;
    this.oSearchForm;
    this.searchFormName = "SearchForm";
}
EpiBaseAdapter.prototype = new EpiObject();

EpiBaseAdapter.get_Event=function(e) { return EpiBaseAdapter[e] };
EpiBaseAdapter.prototype.set_OverrideSortDescending=function(val){this.OverrideSortDescending=val;}
EpiBaseAdapter.prototype.get_OverrideSortDescending=function(){return this.OverrideSortDescending;}
EpiBaseAdapter.prototype.get_IsBOEnabled=function(){return this.isBOEnabled;}
EpiBaseAdapter.prototype.get_PrimarySearchForm=function(){return this.searchFormName;}
EpiBaseAdapter.BeforeDataSetClear = new EpiEvent("BeforeDataSetClear", this);  

EpiBaseAdapter.OnBeforeClearDataSet=function(tables) 
{
    if(tables.Count > 0) 
    {
        return EpiBaseAdapter.get_Event("BeforeDataSetClear").fire(tables, {}); 
    }
}
EpiBaseAdapter.prototype.OnBeforeAdapterMethod=function(MethodName)
{
    var args = {"MethodName":MethodName};
    this.get_Event("BeforeAdapterMethod").fire(this,args); 
    return !args.Cancel;
} 
EpiBaseAdapter.prototype.OnAfterAdapterMethod=function(MethodName)
{
    this.get_Event("AfterAdapterMethod").fire(this,{"MethodName":MethodName}); 
}
EpiBaseAdapter.prototype.GetString=function(id)
{ 
    return EpiString.GetString(id,"Msg.Epicor.Mfg." + this._assembly + ".xml");
}
EpiBaseAdapter.prototype.GetStringFmt=function(id,args)
{ 
    return EpiString.GetStringFmt(id,"Msg.Epicor.Mfg." + this._assembly + ".xml",args);
}

var ILauncher = Epicor.Mfg.UI.FrameWork.ILauncher = function(session)
{
    EpiObject.call(this, "ILauncher");
    this.Session = session;
}

var EpiBaseLaunch = Epicor.Mfg.UI.FrameWork.EpiBaseLaunch = function()
{
    EpiObject.call(this, "EpiBaseLaunch");

    this.lTrans = null;
    this.lForm = null;
    this.abortFormLaunch = false;
    if (arguments.length > 0)
        this.LaunchFormOptions = arguments[0];
}
EpiBaseLaunch.prototype.ctor=function(){}
EpiBaseLaunch.prototype.get_Session=function(){return null;}
EpiBaseLaunch.prototype.InitializeLaunch=function(){}
EpiBaseLaunch.prototype.LoadTransScript=function(){}
EpiBaseLaunch.prototype.LaunchForm=function(LaunchOptions)
{   
    this.LoadTransScript();
    
    Global.InLaunchCode= true;
    this.InitializeLaunch();
    Global.InLaunchCode = null;
    
    if (this.LoadTransScript!=EpiBaseLaunch.prototype.LoadTransScript) // If the method was overriden that means the launch code instantiated the trans object
      this.lTrans.IsTransaction = true; // This causes the launched form to re-instantiate the transaction.
        
    var retVal = null;
    if(this.lForm!=null && !this.abortFormLaunch)
    {
        retVal = this.lForm.ShowFormDialog(LaunchOptions);
        LaunchOptions.Result = this.lForm.DialogResult;
    }
    return retVal;
}
EpiBaseLaunch.prototype.get_AbortFormLaunch=function()
{
    return this.abortFormLaunch;
}
EpiBaseLaunch.prototype.set_AbortFormLaunch=function(val)
{
    this.abortFormLaunch = val;
}

var AppLauncher = Epicor.Mfg.UI.FrameWork.AppLauncher = function()
{
    EpiBaseLaunch.apply(this, arguments);
    this._type = "AppControllerPanel";
}
AppLauncher.prototype = new EpiBaseLaunch();

var LaunchFormOptions = Epicor.Mfg.UI.FrameWork.LaunchFormOptions = function()
{
    EpiObject.call(this, "LaunchFormOptions");

    this.ValueIn = null;
    this.Sender = null;
    this.SuppressFormSearch = true;
    this.IsModal = false;
    this.PublisherKey = Guid.Empty;
    this.LaunchSearchOptions = null;
    this.ContextValue = null;
    this.EpiReadOnly = false;
    this.Result = DialogResult.None;
    this.Like = null;
    this.CallBackMethod = null;
    this.CallBackToken = null;
}
LaunchFormOptions.prototype = new EpiObject();
LaunchFormOptions.prototype.set_CallBackMethod=function(val){ this.CallBackMethod = val; }
LaunchFormOptions.prototype.set_CallBackToken=function(val){ this.CallBackToken = val; }
LaunchFormOptions.prototype.set_Result=function(val){ this.Result = val; }
LaunchFormOptions.prototype.get_Sender=function(){ return this.Sender; }
LaunchFormOptions.prototype.set_Sender=function(val){ this.Sender = val; }
LaunchFormOptions.prototype.get_Like=function(){ return this.Like; }
LaunchFormOptions.prototype.set_Like=function(val){ this.Like = val; }
LaunchFormOptions.prototype.get_ValueIn=function() { return this.ValueIn; }
LaunchFormOptions.prototype.set_ValueIn=function(val){ this.ValueIn = val; }
LaunchFormOptions.prototype.set_ContextValue=function(val){ this.ContextValue = val; }
LaunchFormOptions.prototype.set_EpiReadOnly=function(val){ this.EpiReadOnly = val; }  // TODO
LaunchFormOptions.prototype.set_SuppressFormSearch=function(value) { this.SuppressFormSearch = value; }
LaunchFormOptions.prototype.set_IsModal=function(value) {this.IsModal = value;}
LaunchFormOptions.prototype.set_PublisherKey=function(value) {this.PublisherKey = value;}
LaunchFormOptions.prototype.get_NeedsSearchOptions=function() 
{
    return (this.LaunchSearchOptions == null && this.ValueIn != null);
}
LaunchFormOptions.prototype.set_MenuDataSet=function(value) {this.menuDS = value;}
LaunchFormOptions.prototype.get_MenuDataSet=function(value) {return this.menuDS;}

var PartDescLaunchArgs = Epicor.Mfg.UI.FrameWork.PartDescLaunchArgs = function(PartNum, PartDesc, HideForeign, SetReadOnly)
{
    LaunchFormOptions.call(this);

	this.partNum = PartNum;
	this.partDesc = PartDesc;
	this.hideForeign = HideForeign;
	this.setReadOnly = SetReadOnly|false;
	this.SuppressFormSearch = true;
}
PartDescLaunchArgs.prototype = new LaunchFormOptions();
var NamedSearchLaunchArgs=Epicor.Mfg.UI.FrameWork.NamedSearchLaunchArgs=function(SearchForm,AppCalledSearch,CalledSearchOptions)
{
    this.calledSearchForm = SearchForm;
    this.appCalledSearch = AppCalledSearch;
    this.calledSearchOptions = CalledSearchOptions;
}
NamedSearchLaunchArgs.prototype = new LaunchFormOptions();

var ProcessCallerCallBack = Epicor.Mfg.UI.FrameWork.ProcessCallerCallBack=Delegate;
var ProcessCaller = Epicor.Mfg.UI.FrameWork.ProcessCaller = function(sender)
{
    EpiObject.call(this, "ProcessCaller");
    this.sender = sender;
    this.CallBackToken = "";
}
ProcessCaller.prototype = new EpiObject();
ProcessCaller.ProcessXRef;
ProcessCaller.invoke=function(Sender, boConnect, AdapterName, Method, Params)
{
    var adapt = Global.GetAdapter(AdapterName,Sender);
    Global.LoadProxyForAdapter(adapt,null,true);
    if(boConnect)
    {
        adapt.BOConnect();
    }
    return adapt[Method].apply(adapt, Params);
}
ProcessCaller.LaunchNamedSearchForm=function(Sender,thisSearch,appCalledSearch,calledSearchOptions)
{
	var launchArgs = new NamedSearchLaunchArgs(thisSearch,appCalledSearch,calledSearchOptions);
    launchArgs.IsModal = true;
	ProcessCaller.LaunchForm(Sender, "Epicor.Mfg.UI.NamedSearchEntry", launchArgs, new EpiOverloadedArgs("Object_String_Object"));
}
ProcessCaller.InvokeAdapterMethod=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "Object_String_String_String_ObjectArr":
            return ProcessCaller.InvokeAdapterMethod_1(a[0],a[1],a[2],a[3],a[4]);
            break;
        case "Object_String_String_DataSet_ObjectArr":
            return ProcessCaller.InvokeAdapterMethod_2(a[0],a[1],a[2],a[3],a[4]);
            break;
        case "Object_String_String_ObjectArr":
            return ProcessCaller.InvokeAdapterMethod_3(a[0],a[1],a[2],a[3]);
            brak;
    }
}
ProcessCaller.InvokeAdapterMethod_1=function(Sender, AdapterName, Method, TableName, Params)
{
    var ds=new DataSet();
    var returnValue = ProcessCaller.invoke(Sender, true, AdapterName, Method, Params);

	if(returnValue instanceof DataSet)
	{
		ds.Merge(returnValue, false, MissingSchemaAction.Add,new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));
	}
	else
	{
		for(var p in Params)
		{
		    var myObj = Params[p];
			if(myObj instanceof DataSet)
			{
				ds.Merge(myObj, false, MissingSchemaAction.Add,new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));
				break;
			}
		}
	}

	if(ds == null)
	{
		throw new System.Exception("Unable to locate returned DataSet.");
	}
	
	var returnTable;
	if(ds.Tables[TableName])
	{
		returnTable = ds.Tables[TableName];
	}
	else
	{
		throw new System.Exception("Requested table - " + TableName + " - does not exist in the returned DataSet.");
	}

	return returnTable;
}
ProcessCaller.InvokeAdapterMethod_2=function(Sender, AdapterName, Method, ds, Params)
{
    var returnValue = this.invoke(Sender, true, AdapterName, Method, Params);

	if(returnValue instanceof DataSet)
	{
		ds.Merge(returnValue, false, MissingSchemaAction.Add,new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));
	}
	else
	{
		for(var p in Params)
		{
		    var myObj = Params[p];
			if(myObj instanceof DataSet)
			{
				ds.Merge(myObj, false, MissingSchemaAction.Add,new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));
				break;
			}
		}
	}
}
ProcessCaller.InvokeAdapterMethod_3=function(Sender, AdapterName, Method, Params)
{
    return this.invoke(Sender, true, AdapterName, Method, Params);
}
ProcessCaller.LaunchPartDesc=function(Sender, partNbr, partDesc, partDescColName, curView, hideForeign, curDesc)
{
    var setReadOnly = false;
    
    var enabledProp = curView.dataView.Table.GetExtendedProperty(partDescColName, "Enabled");
    var readOnlyProp = curView.dataView.Table.GetExtendedProperty(partDescColName, "ReadOnly");
    
    if(enabledProp!=undefined && enabledProp!="" && enabledProp!=true) setReadOnly = true;
    if(!setReadOnly && readOnlyProp!=undefined && readOnlyProp==true) setReadOnly = true;

	if (!setReadOnly)
	{
		if (curView.MyRowProps.ContainsKey(partDescColName))
		{
			var mySettings = curView.MyRowProps[partDescColName];
			setReadOnly = mySettings.IsReadOnly;
		}
	}	

	curDesc = partDesc;

	if (!hideForeign &&  partNbr=="")
	{
		MessageBox.Show(EpiString.GetString("MustEnterPart"), new EpiOverloadedArgs("String") );
		return;
	}
    var launchArgs = new Epicor.Mfg.UI.FrameWork.PartDescLaunchArgs(partNbr,partDesc,hideForeign,setReadOnly);
	launchArgs.IsModal = true;
    var retVal = ProcessCaller.LaunchForm(Sender, "Epicor.Mfg.UI.PartDescription", launchArgs, new EpiOverloadedArgs("Object_String_Object"));
	if(retVal)
	{
    	curDesc=retVal;
	}
	Global.ArgManager["Out1"] = curDesc;

}
ProcessCaller.PerformSearch=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    var processCaller =  new ProcessCaller(a[0]);
    
    switch(overload)
    {
        case "Object_String":
            return processCaller.performBaseSearch(a[1], "List", "");
            break;
        case "Object_String_String":
            return processCaller.performBaseSearch(a[1], "List", a[2]);
            break;
        case "Object_String_String_String":
            return processCaller.performBaseSearch(a[1], a[2], a[3]);
            break;
    }
}
ProcessCaller.LaunchSearch=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    var processCaller =  new ProcessCaller(a[0]);
    
    switch(overload)
    {
        case "Object_String_String":
            return processCaller.invokeBaseSearch(a[1], a[2], false, "", true, null, null);
            break;
        case "Object_String_String_Boolean":
            return processCaller.invokeBaseSearch(a[1], a[2], false, "", a[3], null, null);
            break;
        case "Object_String_String_Boolean_Boolean":
            return processCaller.invokeBaseSearch(a[1], a[2], a[4], "", a[3], null, null);
            break;
        case "Object_String_String_Boolean_Boolean_String":
            return processCaller.invokeBaseSearch(a[1], a[2], a[4], a[5], a[3], null, null);
            break;
        case "Object_String_String_Boolean_Boolean_String_String":
            return processCaller.invokeBaseSearch(a[1], a[2], a[4], a[5], a[3], null, a[6]);
            break;
        case "Object_String_SearchOptions":
            return processCaller.invokeBaseSearch(a[1], "", false, "", true, a[2], null);
            break;
    }
}

ProcessCaller.LaunchForm=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    var processCaller;
    if(window!=Global.window)
    {
        processCaller = new Global.window.ProcessCaller(a[0]);
    }
    else
    {
        processCaller = new ProcessCaller(a[0]);
    }
    var o;
    
    switch(overload)
    {
        case "Object_String":
            o = processCaller.callBaseForm(a[1], "", true, "", null)
            break;
        case "Object_String_String":
            o = processCaller.callBaseForm(a[1], "", true, a[2], null)
            break;
        case "Object_String_Object":
            o = processCaller.callBaseForm(a[1], "", true, "", a[2])
            break;
        case "Object_String_Object_Boolean":
            o = processCaller.callBaseForm(a[1], "", a[3], "", a[2])
            break;
        case "Object_String_String_String_Boolean":
            o = processCaller.callBaseForm(a[1], a[2], a[4], a[3], null)
            break;            
    }
    return o;
}
ProcessCaller.LaunchTracker=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The ProcessCaller.LaunchTracker function is not implemented.", new EpiOverloadedArgs("String_Details"));

}
ProcessCaller.prototype.performBaseSearch=function(AdapterName, SearchMode, PreFilter)
{
    return EpiSearchEngine.PerformSearch(AdapterName, SearchMode, PreFilter, this.sender);
}
ProcessCaller.prototype.invokeBaseSearch=function(AdapterName, SearchMode, SingleSelect, like, ReturnVal, SearchOpts, preFilter)
{
	if (SearchOpts == null)
	{
		var rtnMode = DataSetMode.ListDataSet;
		if (SearchMode.toUpperCase() == "ROWS") rtnMode = DataSetMode.RowsDataSet;

		var opts = SearchOptions.CreateSearchForm(rtnMode);
		if (SingleSelect) opts.SelectMode = SelectMode.SingleSelect;
		if (like.Length > 0) opts.Like = like;
        if (!String.IsNullOrEmpty(preFilter)) opts.PreLoadSearchFilter = preFilter;

		SearchOpts = opts;
	}
	SearchOpts.sender = this.sender;
	
	if(preFilter)
	{
		var ht = new Hashtable();
		ht.Add("BaseList", preFilter);
		SearchOpts.NamedSearch = NamedSearch.RuntimeFactory(ht, SearchOpts.DataSetMode);
	}
	
	return EpiSearchEngine.InvokeSearch(AdapterName, SearchOpts, new EpiOverloadedArgs("String_SearchOptions"));
}
ProcessCaller.prototype.callBaseForm=function(AssemblyName, MethodName, ReturnValue, CurrentValue, LaunchObject)
{
    if(LaunchObject==null)
    {
        var LaunchObject = new LaunchFormOptions();
        LaunchObject.ValueIn = CurrentValue;
    }
    LaunchObject.Sender = this.sender;
    
    if(AssemblyName.indexOf("Dashboard")>-1)
    { 
        MessageBox.Show("Dashboard forms are not supported.", new EpiOverloadedArgs("String"));
        return;
    }
    
    // TODO:  Just standard is supported now.  Bunch of other stuff here that I don't want to
    // mess with right now. 
    
    var orig = AssemblyName;
    
    // We are passed a string (which is not an assembly name), try to find the menuId from ProcessXRef
    AssemblyName = this._findMenuId(AssemblyName,this.sender);
    if (!AssemblyName) AssemblyName = orig;
    
    var menuID = "";
    if (AssemblyName.indexOf("Epicor.Mfg") < 0) // If the _findMenuId found a menu id, save it to pass to the server
        menuID = AssemblyName;

    AssemblyName = this._findAssemblyName(AssemblyName); // Find the Program from the menuId
    if (!AssemblyName) return; // AssemblyName will be null if user does not have access to the menu id of the program that is being launched.
    
    
    LaunchObject.processCaller = this;
    if (menuID)
        LaunchObject.MenuID = menuID;
    this.CallBackToken = LaunchObject.CallBackToken;
    var retVal = this._LaunchIt(AssemblyName, LaunchObject); 

    return retVal;
}
ProcessCaller.CallLaunchCode=function(assemblyName)
{

    var valueIn = Global.GetUrlArg("ID");
    var likeValue = Global.GetUrlArg("Like");
    if (valueIn=='' || likeValue == '' || !assemblyName) return;

    // build up the LFO
    var lfo = new LaunchFormOptions();
    lfo.IsModal = false;
    lfo.EpiReadOnly = false;
    lfo.Like = likeValue;
    lfo.ContextValue = null;
    lfo.ValueIn = valueIn;
    lfo.Sender = this;

    var processCaller = new ProcessCaller(null);
    lfo.processCaller = processCaller;
    Global.psuedoLaunchCalling = true;
    processCaller._LaunchIt(assemblyName, lfo); 
    Global.LaunchArgs = {"LaunchObj":Global.launchForm};
    Global.psuedoLaunchCalling = null;
    Global.launchForm = null;
}
ProcessCaller.ProcessCallBack = new EpiEvent("ProcessCallBack", ProcessCaller);
ProcessCaller.HandleProcessCallBack=function(sender, args)
{
    if (ProcessCaller.ProcessCallBack.subscribers.length > 0)
        ProcessCaller.ProcessCallBack.fire(sender,args); 
   
     var opener = BrowserHelper.GetParentOpener();
     if (opener && opener.ProcessCaller.ProcessCallBack.subscribers.length > 0)
     {
        if (Global.Form.IsDialog)
        {
           // Case: Main form opens a dialog, and the dialog opens a modeless form, the ProcessCallBack event subscribers are not available. 
           // If we fire the ProcessCallBack event on the opener, the GetRows is failing (Global object gets set to the parent form instead of the dialog),
           // so call the method directly.
           Global.Form.trans.ProcessCaller_ProcessCallBack(sender, args);
        }
        else
        {
            // Case: modeless form opened from main form (Eng WB opened from Part Entry), we need to fire the event on the opener.
           opener.ProcessCaller.ProcessCallBack.fire(sender,args);
        }
     }
}
ProcessCaller.prototype.oTransaction_TransactionCallBack=function(Sender, args)
{
	ProcessCaller.HandleProcessCallBack(Sender, args);
}
ProcessCaller.prototype.calledForm_Closed=function(sender, e)
{
	ProcessCaller.HandleProcessCallBack(sender, new TransactionCallBackArgs(TransactionEvent.FormClosed, this.CallBackToken));
}
ProcessCaller.LaunchCallbackForm=function(Sender, AssemblyName, launchObject)
{
	var uiR = new UIReflector(Sender, AssemblyName, launchObject);
	uiR.LaunchCallbackForm();
	return uiR;
}

ProcessCaller.prototype._LaunchIt=function(assemblyName, launchObj)
{
    if(assemblyName=="Epicor.Mfg.UI.SysMonitorEntry")
    {
        // In EWA , we do not support System Monitor, but we do support Process Monitor, which is very similar
        assemblyName="Epicor.Mfg.UI.ProcessMonitorEntry"; 
        launchObj.MenuID="SUMN140";
    }

    var assm = assemblyName.Replace("Epicor.Mfg.", "");
    assm = assemblyName.Replace("Epicor.Mfg.", "");
    assm = assm.Replace(".dll", "");
    
    //assm = "UI." + assm;
    var id = "launch" + assm;
    var url = "script\\" + assm + "\\Launch." + assm + ".js";

    var lnchScript = Global.GetScript(url);
    if(lnchScript)
    {
        try
        {
            eval(lnchScript);
        }
        catch(err)
        {
            MessageBox.Show("The launch form script failed to load.  Script file: " + url);
            return;
        }

        var lnch = new Launch(launchObj);
        
        lnch.LoadTransScript();
        var retVal=lnch.LaunchForm(launchObj);
        
        return retVal;
    }
}
ProcessCaller.prototype._findAssemblyName=function(AssemblyName)
{
    var returnAsmName = AssemblyName;
    
    if (AssemblyName.toUpperCase().indexOf("EPICOR.MFG") < 0) // If its a menu id, make sure user has access to it and find the assembly for it
    {
		Global.LoadProxy("lib_Common");
         var lib = new lib_CommonService();
		 if (lib.GetProgramForMenuID)
		 {
             try
             {
                 
                 returnAsmName = lib.GetProgramForMenuID(AssemblyName);
             }
             catch(err)
             {
                ExceptionBox.Show(err);
                returnAsmName = String.Empty;
             }
        }
		else // temp code for context menu to work with old builds.
		{
			var menuDS = ProcessCaller.GetMenuProcess(this.sender,AssemblyName);
		       if (menuDS == null || menuDS.Tables.length <=0 || menuDS.get_Table(0).Rows.length <=0)
		       {
		           MessageBox.Show("Menu ID " + AssemblyName + " is invalid for current user.");
		          returnAsmName = String.Empty;
		       }
		       else
		       {
		            returnAsmName = FormFunctions.GetMenuItemColumnValue(menuDS, "Program");
					if(returnAsmName == String.Empty)
					{
						MessageBox.Show("Menu ID " + AssemblyName + " is invalid for current user.");
					}
					//else  Win code runs BO security check
				}

		}
    }
    if(returnAsmName != String.Empty)
	{
		if(returnAsmName.toUpperCase().EndsWith(".DLL") || returnAsmName.toUpperCase().EndsWith(".EXE"))
			returnAsmName = returnAsmName.Substring(0,returnAsmName.length-4);
	}
	return returnAsmName;
}

ProcessCaller.prototype._findMenuId = function (assemblyName, sender)
{

    if (!ProcessCaller.ProcessXRef) ProcessCaller.GetProcessXRefXml();
    if (ProcessCaller.ProcessXRef)
    {
        var whoAmI = sender.WhoAmI;
        if (!whoAmI) whoAmI = "";
        assemblyName = assemblyName.toLowerCase();
        whoAmI = whoAmI.toLowerCase();

        var thisProcKeyElements = [];
        var procKey;
        var menuKey = "";

        for (var p = 0, pKey; pKey = ProcessCaller.ProcessXRef.XRefference[p]; p++)
        {
            procKey = pKey.ProcessKey.toLowerCase();

            // If whoAmI is empty, pick the first match we find
            if (whoAmI == "" && procKey == assemblyName)
            {
                menuKey = pKey.MenuID;
                break;
            }
            else
            {
                // Build a list of nodes whose ProcessKey=assemblyName
                if (procKey == assemblyName)
                    thisProcKeyElements.push(pKey);
            }
        }

        // We did not find a match, now look through the subset of nodes whose ProcessKey=assemblyName
        // first try to find the one with AssemblyName == whoAmI. If this fails,
        // pick the node which doesn't have AssemblyName set at all.
        if (whoAmI != "" && menuKey == "" && thisProcKeyElements.length > 0)
        {
            for (var p = 0, pKey; pKey = thisProcKeyElements[p]; p++)
            {
                if (pKey.AssemblyName && pKey.AssemblyName.toLowerCase() == whoAmI)
                {
                    menuKey = pKey.MenuID;
                    break;
                }
            }

            if (menuKey == "")
            {
                for (var p = 0, pKey; pKey = thisProcKeyElements[p]; p++)
                {
                    if (!pKey.AssemblyName)
                    {
                        menuKey = pKey.MenuID;
                        break;
                    }
                }
            }

        }

    }
    return menuKey;
}
ProcessCaller.GetMenuProcess=function(sender,menuKey)
{
    Global.LoadProxy("Menu");
    var menuWS = new MenuService();
    try
    {
        Session.MenuDataSet = menuWS.GetByID(menuKey); // This mehtod will throw an exception if the user doesnt have access to this menuid
    }
    catch(err)
    {
         //if(err instanceof BusinessObjectException && err.Message.toLowerCase().indexOf("record not found") != -1)
            return null;   
    }

    // TODO: If not found in the menu, use FormFunctions.CustomValidator - Look in ProcessCaller.GetMenuProcess in ECL.
    
    return Session.MenuDataSet;
}

ProcessCaller.GetProcessXRefXml=function()
{
    if (ProcessCaller.ProcessXRef) return ProcessCaller.ProcessXRef;
    var boName = "lib_GenX";
	if(!Global.LoadedProxies[boName])
	{ 	
        var proxyScript = Global.GetScript("script/Client" + boName + "ServiceProxies.js");
        eval(proxyScript);
        Global.window[boName + "Service"] = eval(boName + "Service");
        Global.LoadedProxies[boName] = boName;
    }
    var bo = new lib_GenXService();
    var serverData = bo.GetProcessXRefInfo();
    ProcessCaller.ProcessXRef = JSON.parse(serverData);
    //ProcessCaller.ProcessXRef = Global.ConvertXmlToJson("ProcessXref.xml","ProcessXRefTransform.xslt","xmlns:p='http://tempuri.org/dsXRefference.xsd'");
}
ProcessCaller.GetAdapterRowsData=function(Sender, AdapterName)
{
    return ProcessCaller.invoke(Sender, false, AdapterName, "GetCurrentDataSet",[DataSetMode.RowsDataSet]);
}

var UIReflector = Epicor.Mfg.UI.FrameWork.UIReflector=function(Sender,AssemblyName, LaunchFormOptions)
{
    EpiObject.call(this, "UIReflector");
    this.launchFormOptions = LaunchFormOptions;
	this.sender = Sender;
	this.assembly = AssemblyName;
	
	if(this.launchFormOptions)
	{
		this.launchFormOptions.Sender = this.sender;
		this.launchFormOptions.CallBackToRegister = true;
		this.launchFormOptions.uiReflector = this;
		this.launchFormOptions.IsModal = false; // modeless
    }
}

UIReflector.prototype.LaunchCallbackForm=function()
{
    ProcessCaller.LaunchForm(this.sender,this.assembly,this.launchFormOptions, new EpiOverloadedArgs("Object_String_Object"));
}

// Calls a method on the opener form (this is a callback from the launched form)
UIReflector.prototype.CallFunction=function(scope,fn,args)
{
    var args1 = [];
    for (var i=0;i<args.length;i++) { args1[i] = args[i] }
    fn.apply(scope,args1);
}

UIReflector.prototype._callBackToRegister=function(uiForm,trans)
{
    this.UIForm = uiForm;
    this.UITrans = trans;
}

UIReflector.prototype._launchedFormClose=function()
{
    this.UIForm = null;
    this.UITrans = null;
    // The modeless form sets the trans.ebf to its own Form. Reset it back to the opener form.
    if(Global.Form && Global.Form.trans)
    {
        Global.Form.trans.set_EpiBaseForm(Global.Form);
    }
}
UIReflector.prototype.InvokeUIMethod=function()
{
    if (arguments.length <1) return;
    
    var a = arguments;
    var Params = new Array();
    for (var i=0,j=1;j<a.length;i++,j++) { Params[i] = a[j] }

    var Method = a[0];
    
	if(this.UIForm != null)
	   return this.UIForm[Method].apply(this.UIForm, Params);
	else
		return null;  //maybe throw an error instead?
}

UIReflector.prototype.InvokeTransactionMethod=function()
{
    if (arguments.length <1) return;
    
    var a = arguments;
    var Params = new Array();
    for (i=1;i<a.length;i++) { Params[i] = a[i] }

    var Method = a[0];
    
	if(this.UITrans != null)
		return this.UITrans[Method].apply(this.UITrans, Params);
	else
		return null; //maybe throw an error instead?
}

UIReflector.prototype.CacheUICall=function(fnName,args)
{
    if (!this.UICallQ) this.UICallQ=[];
    this.UICallQ.push({"Fn":fnName,"Args":args});
}

var EpiContextMenuItem = Epicor.Mfg.UI.FrameWork.EpiContextMenuItem = function()
{
    EpiObject.call(this, "EpiContextMenuItem");
    this.Binding=null;
    this.Like=null;
    this.ContextValue=null;
    this.Text=null;
}

var EpiUIUtils = Epicor.Mfg.UI.FrameWork.EpiUIUtils = function(parent, oTransaction, tbMan, dockMan)
{
    EpiObject.call(this, "EpiUIUtils");
    this.parentForm = parent;
    this.oTransaction = oTransaction;

//    if(this.parentForm.HasGL) Global.GLLib = new GLLib();
}
EpiUIUtils.prototype.set_Transaction=function(trans) {this.oTransaction = trans;}
EpiUIUtils.prototype.set_ParentForm=function(frm) {this.parentForm = frm;}
EpiUIUtils.prototype.initCustomScriptManager=function()
{
    this.csm = new CustomScriptManager();
    this.csm.InitCustomGlobalVars(); // Doing this so we can call SetExtendedProperties in the custom script
}
EpiUIUtils.prototype.Execute=function()
{
    this.currentSession = this.oTransaction.Session;
    if(this.parentForm.HasGL && !this.currentSession["GLLib"])
    {
        this.currentSession["GLLib"] = Global.GLLib;
    }
    FormatEngine.GetCultureInfo();
    
    this.csm.InitCustomScript();
}
EpiUIUtils.prototype.OnCustomCodeFormLoad=function(sender,args)
{
    this.csm.CallCustomFormLoad(sender,args);
}
EpiUIUtils.prototype.UIDataCleared=function()
{
    if (this.oTransaction != null)
    {
        // clear the BPM data off the CallContext DS
        var epix=Global.As(this.oTransaction,"EpiTransaction");
        if (epix != null && epix.get_ClearBpmDataOnClear())
            CallContextDataHelper.ClearCallContextBpmData(epix);
    }
}

var EpiViewImageColumn = Epicor.Mfg.UI.FrameWork.EpiViewImageColumn = function(ColumnName, ImageName, Caption, VisibleIndex)
{
	if (ColumnName == null || ColumnName.length<=0)
	    MessageBox.Show("Invalid View Image Column Name", new EpiOverloadedArgs("String"));
		
	if (ImageName == null) ImageName = String.Empty;
	if (Caption == null) Caption = String.Empty;

	this.columnName = ColumnName;
	this.imageName = ImageName;
	this.caption = Caption;
	this.visibleIndex = VisibleIndex;
}

// TODO
var TaxConnectionManager = Epicor.Mfg.UI.FrameWork.TaxConnectionManager = function()
{
    EpiObject.call(this, "TaxConnectionManager");
}
TaxConnectionManager.get_Event=function(e)
{
    return TaxConnectionManager[e];
}
TaxConnectionManager.TAX_AVAILABLE = "TaxAvailable";
TaxConnectionManager.TAX_UNAVAILABLE = "Tax_Unavailable";
TaxConnectionManager.TAX_CONNECTED_ON = "Tax_ConnectOn";
TaxConnectionManager.TAX_CONNECTED_OFF = "Tax_ConnectOff";
TaxConnectionManager.TAX_CONNECTED = "TaxConnected";
TaxConnectionManager.TaxStatusChanged = new EpiEvent("TaxStatusChanged", this);
TaxConnectionManager.GetTaxAvailableStatus=function()
{
    return false;
}
TaxConnectionManager.GetTaxConnectStatus=function()
{
    return false;
}
TaxConnectionManager.GetTaxStatusString=function()
{
    return TaxConnectionManager.TAX_UNAVAILABLE;
}
TaxConnectionManager.SetTaxConnectStatus=function()
{
}
TaxConnectionManager.SetTaxAvailableStatus=function()
{
}
var TransactionEvent = Epicor.Mfg.UI.FrameWork.TransactionEvent =
{
	UpdateOnRowChange:0,
	UpdateOnSaveButton:1,
	UpdateOnPrimaryKey:2,
	UpdateOnFormClose:3,
	UpdateOnNewButton:4,
	UpdateOnSaveAndNew:5,
	UpdateOnInvokeSearch:6,
	AddNewOnNewButton:7,
	AddNewOnNewFromGrid:8,
	AddNewOnPrimaryKey:9,
	DeleteOnDeleteButton:10,
	DeleteOnDeleteAddNew:11,
	DeleteAttachment:12,
	UndoOnUndoButton:13,
	UndoOnUndoAddNew:14,
	UndoOnClearButton:15,
	UndoOnRefreshButton:16,
	None:17,
	FormClosed:18
};

// TODO: The following two are actually members of EpiTransaction... need to figure the namespaces out here.
var NotifyType = Epicor.Mfg.UI.FrameWork.NotifyType = {Initialize:0,AddRow:1,DeleteRow:2,InitLastView:3,InitAndResetTreeNodes:4};
var StatusDisposer = Epicor.Mfg.UI.FrameWork.StatusDisposer = function(trans)
{
    EpiObject.call(this, "StatusDisposer");
}

var ForeignKeyAgent = Epicor.Mfg.UI.FrameWork.ForeignKeyAgent=function()
{
    EpiObject.call(this, "ForeignKeyAgent");
    
}
ForeignKeyAgent.prototype = new EpiObject();
ForeignKeyAgent.prototype.RegisterView=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "String":
            this.bindTblName = a[0];
            break;
        case "EpiTransaction_String_String_String":
            // verify the EpiBinding Table and Column and Like
            var EpiBinding = a[1];
			var bindToVue = EpiBinding.Substring(0, EpiBinding.IndexOf("."));
			var bindToCol = EpiBinding.Substring(EpiBinding.IndexOf(".")+1);
			var epiDataView = Global.BindingEngine.EpiDataViews[bindToVue];
			if (!epiDataView.dataView.Table.GetExtendedProperty(bindToCol,"Like")) return;

			// register the new FKView
			this.registerView(a[0], [EpiBinding], a[2], a[3], epiDataView.dataView.Table.GetExtendedProperty(bindToCol,"Like"));
            break;
        case "EpiTransaction_StringArr_String_String_String":
		    this.registerView(a[0], a[1], a[2], a[3], a[4]);
            break;
    }
}
ForeignKeyAgent.prototype.registerView=function(trans, EpiBindings, ViewName, TableName, Like)
{
	// get the and verify validation node
	var cmp = new ContextMenuProvider();
	var keyType = cmp.GetValidationNode("ValidationType", Like);
	this.keyTypes = keyType.split('~');
	if (this.keyTypes.length != EpiBindings.length)
	{
		MessageBox.Show("Invalid FKView registration, count of Binding strings must match ValidationType from ContextMenu.xml");
	    return;
	}

	trans.AddForeignKeyAgent(this);
	this.Sender = trans;
	// build up collections of BindingViews/Columns/EDV and current values
	this.bindViewNames = [];
	this.bindColNames = [];
	this.epiDataViews = [];
	this.currentValues = [];

	// enumerate the Binding strings
	for (var i=0; i<EpiBindings.length; i++)
	{
		var inArray = false;
		var strBinding = EpiBindings[i]; // parse the EpiBinding string
		this.bindViewNames[i] = strBinding.Substring(0, strBinding.IndexOf("."));
		this.bindColNames[i] = strBinding.Substring(strBinding.IndexOf(".")+1);
		this.epiDataView = Global.BindingEngine.EpiDataViews[this.bindViewNames[i]];
		// check if EDV already in array
		for (var p=0; p<this.epiDataViews.length; p++)
			if (this.epiDataViews[p] == this.epiDataView) inArray = true;

		this.epiDataViews[i] = this.epiDataView;
		// register the ViewNotification if not already done
		if (!inArray)
			this.epiDataViews[i].get_Event("EpiViewNotification").subscribe(this.edv_EpiViewNotification, this, true);
		this.currentValues[i] = null;
	}

	// create and config the FKV
	this.fKeyView = new ForeignKeyDataView();
	this.fKeyView.dataView = new DataView();
	if (this.bindViewNames.length>0)
		this.fKeyView.BindingViewName = this.bindViewNames[0];
	// set the props on local FVAgent
	this.fkeyViewName = ViewName;
	this.bindTblName = TableName;
	this.fKeyLike = Like;

	try 
	{
		this.getEmptyFKData();
		if (this.bindTblName != null && this.bindTblName != "")
			this.fKeyView.dataView.Table = this.fKeyView.ForeignKeyData.Tables[this.bindTblName];
		else
			this.fKeyView.dataView.Table = this.fKeyView.ForeignKeyData.get_Table(0);
		trans.Add(ViewName, this.fKeyView);
	} 
	catch (ex) { ExceptionBox.Show(ex, "Bind to ForeignKeyView"); }
}	
ForeignKeyAgent.prototype.edv_EpiViewNotification=function(view, args)
{
	var viewRow = null;
	if (args.Row>=0 && view.dataView.Count>0)
		viewRow = view.dataView.Rows[args.Row];
	for (var i=0; i<this.epiDataViews.length; i++)
	{
		if (this.bindViewNames[i] == view.ViewName)
		{
			var viewValue = "";
			if (viewRow != null)
				viewValue = viewRow[this.bindColNames[i]];
			var pubBind = this.bindViewNames[i] + "." + this.bindColNames[i];
            if (args.Row < 0 || viewValue.toString() == "")
            {
                this.currentValues[i] = null;
                var allNulls = true;
                for (var valCnt = 0; valCnt < this.currentValues.length; valCnt++)
                {
                    if (this.currentValues[valCnt] != null && this.currentValues[valCnt].toString().length > 0)
                    {
                        allNulls = false;
                        break;
                    }
                }
                if (allNulls)
                {
                    this.fKeyView.ForeignKeyData.Clear();
                    this.fKeyView.Notify(new EpiNotifyArgs(this, -1, 0,new EpiOverloadedArgs("Object_Int32_Int32")));
                }
            } 
			else 
			{
				if (this.currentValues[i] == null || viewValue.toString() != this.currentValues[i].toString())
				{
					try 
					{
						this.currentValues[i] = viewValue;

						for (var j=0; j<this.bindColNames.length; j++)
						{
							if (this.bindViewNames[j]+"."+this.bindColNames[j] != pubBind)
							{
								this.currentValues[j] = viewRow[this.bindColNames[j]];
							}
						}
						this.getFKData(this.currentValues);
						this.fKeyView.Notify(new EpiNotifyArgs(this, 0, 0,new EpiOverloadedArgs("Object_Int32_Int32")));
					} 
					catch (err) 
					{
						ExceptionBox.Show(err); //, "FKV Notification exception, please check your FKV binding");
					}
				}
			}
		}
	}
}
ForeignKeyAgent.prototype.getFKData=function(Keys)
{
	try
	{
		var sParams = [];
		for (var i=0; i<this.keyTypes.length; i++)
		{
			if (this.keyTypes[i].toUpperCase().StartsWith("INTEGER"))
				sParams[i] = Convert.ToInt32(Keys[i].toString());
			else
				sParams[i] = Keys[i].toString();
		}

		var tDS = new DataSet();
		ProcessCaller.InvokeAdapterMethod(this.Sender, this.getFKeyAdapter(), "GetData", tDS, sParams, new EpiOverloadedArgs("Object_String_String_DataSet_ObjectArr"));
		this.setFKData(tDS);
	}
	catch (ex) { ExceptionBox.Show(ex, "getForeignKeyData"); }
}
ForeignKeyAgent.prototype.getFKeyAdapter=function()
{
	var cmp = new ContextMenuProvider();
	var vAdap = "";
	if (this.fKeyAdapter != null && this.fKeyAdapter.length>0)
		vAdap = this.fKeyAdapter;
	else	
		vAdap = cmp.GetValidationNode("ValidationAdapter", this.fKeyLike);
	return vAdap;
}
ForeignKeyAgent.prototype.getEmptyFKData=function()
{
	this.setFKData(ProcessCaller.GetAdapterRowsData(this.Sender, this.getFKeyAdapter()));
}
ForeignKeyAgent.prototype.setFKData=function(tDS)
{
	this.fKeyView.ForeignKeyData.Clear();
	this.fKeyView.ForeignKeyData.Merge(tDS, false, MissingSchemaAction.Add, new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));

	if (this.fKeyView.dataView != null)
	{
		try
		{
			this.setReadOnly(this.fKeyView.ForeignKeyData);
		}
		catch (ex)
		{
			DebugHelper.WriteError("ForeignKeyAgent.setFKData", ex);
		}

		if (this.fKeyView.dataView.Count >0)
			this.fKeyView.set_Row(0);
		else
			this.fKeyView.set_Row(-1);
	}
}
ForeignKeyAgent.prototype.setReadOnly=function(ds)
{
	for(var tbl in ds.Tables)
	{
	    tbl = ds.Tables[tbl];
		for(var col in tbl.Columns)
		{
		    tbl.SetExtendedProperty(col, "ReadOnly", true);
		}
	}
}

ForeignKeyAgent.AddSubTableView=function(trans, ParentView, SubTableViewName, SubTableName,ParentColumns, SubTableColumns)
{
	// verify the Parent View exists
	var parentView = Global.BindingEngine.EpiDataViews[ParentView];
	if (parentView == null || !(parentView instanceof ForeignKeyDataView)) return;
	// verify the SubTable exists as child table in FKV DataSet
	if (!parentView.ForeignKeyData.TablesContains(SubTableName)) return;
	
	// create and configure the SubTable FKView
	var childView = new ForeignKeyDataView();
	childView.ForeignKeyData = parentView.ForeignKeyData;
	childView.dataView = new DataView();
	childView.dataView.Table = childView.ForeignKeyData.Tables[SubTableName];

	// add the SubTable FKV and set the Parent relationship
	trans.Add(SubTableViewName, childView);
	var rootParent = Global.BindingEngine.EpiDataViews[parentView.BindingViewName];
	if (rootParent != null)
	{
		var stvAgent = new ForeignKeyAgent();
		stvAgent.registerSubtableView(trans, rootParent,SubTableViewName, childView, ParentColumns, SubTableColumns);
	}
}

ForeignKeyAgent.prototype.registerSubtableView=function(trans,ParentView,SubTableViewName,childView,ParentColumns,SubTableColumns)
{
	this.fKeyView = childView;
	this.fkeyViewName = SubTableViewName;
	this.bindColNames = SubTableColumns;
	this.parentColNames = ParentColumns;
	this.epiDataViews = [ParentView];

	ParentView.get_Event("EpiViewNotification").subscribe(this.parentView_EpiViewNotification, this,true);
	trans.AddForeignKeyAgent(this);
}
ForeignKeyAgent.prototype.parentView_EpiViewNotification=function(view, args)
{
    if (args.Row < 0 || view.dataView.Count <= 0)
    {
        this.fKeyView.Notify(new EpiNotifyArgs(this, -1, 0,new EpiOverloadedArgs("Object_Int32_Int32")));
        return;
    }

	for (var i=0; i<this.parentColNames.length; i++)
		if (!view.dataView.Table.Columns[this.parentColNames[i]]) return;
	var viewRow = view.dataView.Rows[args.Row];

	var sb = new StringBuilder();
	var and = String.Empty;
	for (var j=0; j<this.bindColNames.length; j++)
	{
		sb.Append(and);
		sb.Append(this.bindColNames[j]);
		sb.Append(".toLowerCase() = '");
		sb.Append(viewRow[this.parentColNames[j]].toString().toLowerCase());
		sb.Append("' ");
		and = " AND ";
	}
	this.fKeyView.dataView.set_RowFilter(sb.ToString());
	if (this.fKeyView.dataView.Count > 0)
	{
	Global.BindingEngine.ClearDVReg(this.fKeyView);
    Global.BindingEngine.NotifyTabs(this.fKeyView.ViewName, 0);
    }

}

var EpiTransaction = Epicor.Mfg.UI.FrameWork.EpiTransaction = function(settings,type)
{
    if(!type) type=="EpiTransaction"
    EpiObject.call(this, type);
    
    if (!settings) return;
    this._impl.push("IEpiTransaction");
    this._views = {};
    this.view;
    this.LastView;
    this.saveView;
    this.ViewChangeAsRowChange = true;
    this.DialogReject = false;
    this.currentEvent = TransactionEvent.None;
    this.Session = new Session();
    this.BeforeTransactionLoad();
    // Set the TrackerMode for the Journal Tracker form based on the formName in the menurow. This code is in the Launch code that is not run in our framework when a form is opened from the menu.
    if(this._assembly== "UI.ChartTracker" && Global.Form)
    {
        var ds = Global.Form.get_MenuItemDS();
        if (ds)
        {
            var arg = FormFunctions.GetMenuItemColumnValue(Global.Form.get_MenuItemDS(), "Arguments").toString();
		    var formName = FormFunctions.GetArgumentValuePerToken(arg, "formName");
            if (formName == "JournalTrackerForm")
                this.trackerMode = TrackerMode.JournalTracker;
        }
        else if (Global.Form.Name == "JournalTrackerForm")
                this.trackerMode = TrackerMode.JournalTracker;
    }
    this.ebf;

    this.AutomateAttachments = true;
    this.attachLink = new Hashtable();
    this.attachMaps = new Hashtable();

    this.ContextClicked=Delegate;
    this.AddEpiDataViews = new Hashtable();
    this.suppressSearches = new ArrayList();
	this.suppressMaints = new ArrayList();
	this.CustomContextHandlers = new Hashtable(); // TODO: Need to fill this up
    this.CountAddViews = 0;
    this.AddViewIndex = 0;
    this.colAdapters = new ArrayList();
    this.wasDialogConfirmed = false;
	this.didDeleteAddNew = false;
	this.didDeleteOnDelete = false;
	this.didUndoAddNew = false;
	this.didUndoOnClear = false;
	this.didUpdateOnClose = false;
	this.isTrans = true;
	this.notifyInitAndResetTreeNodes = false;     
	this.clearBpmDataOnClear=true;
	this.hasInitializedCallContextData=false;
	this.priorEpidataViewBeforeBpmView=null;

    this.TransactionLoad();
    this.AddRowRulesForForm();
    this.KeyFieldName;
    this.MainDataView;
    this.SearchResult = DialogResult.OK;
    
    if(Global.IsScriptLoaded)
        this.OnScriptLoaded();
    else
        Global.ScriptLoaded.subscribe(this.OnScriptLoaded,this,true);  
        
    ProcessCaller.ProcessCallBack.subscribe(this.ProcessCaller_ProcessCallBack, this,true); 
    if (this.AutomateAttachments==true) this._setupAttachments();
} 
EpiTransaction.prototype = new EpiObject();
EpiTransaction.didCancelClose = false;
EpiTransaction.NotifyType = NotifyType;  // This is hokey... need time to research...
EpiTransaction.ContextClicked=Delegate;
EpiTransaction.prototype.ctor=function() {}
EpiTransaction.prototype.get_AdapterList=function(){return this.colAdapters;}
EpiTransaction.prototype.SetupAttachments=function()
{
	if(this.attachMaps.Count > 0) return;
	this._setupAttachments();    
}
EpiTransaction.prototype._setupAttachments=function()
{
	var iEnum = this.attachLink.GetEnumerator();
	while (iEnum.MoveNext())
	{
		var attachV = iEnum.Value;
		var parentV = Global.BindingEngine.EpiDataViews[iEnum.Key];
		if ((parentV.CompoundKey==true) || (attachV.attachBinding.indexOf('~') > 0))
		{
			attachV.SetParentView(parentV, attachV.attachBinding.split('~'), attachV.attachBinding.split('~'));
		}
		else
		{
			attachV.SetParentView(parentV, attachV.attachBinding);
		}
    }
    this.registerAdapterThread();
}
EpiTransaction.prototype.registerAdapterThread=function()
{
    //here win client would read attachment maps from referenced adapters
    for(var key in this.colAdapters.items)
    {
        var adapter = this.colAdapters.items[key];
        var maps = {};
        if (Global.IsFunction(adapter._getAttachmentInfo))
            try{ maps = adapter._getAttachmentInfo(); }catch(e){}
        for(var mapKey in maps)
        {
            var map = maps[mapKey];
            if (!map) continue;
            var newMap = {"Adapter":key,"Map":map};
            this.attachMaps.Add(mapKey, newMap);
        }        
    }
}
EpiTransaction.prototype.set_AutomateAttachments=function(value) {this.AutomateAttachments = value;}
EpiTransaction.prototype.get_Session=function(){return this.Session;}
EpiTransaction.prototype.get_DialogReject=function(){return this.DialogReject;}
EpiTransaction.prototype.get_EpiBaseForm=function(){this.ebf=Global.Form; return this.ebf;}
EpiTransaction.prototype.set_EpiBaseForm=function(value){this.ebf=value;}
EpiTransaction.prototype.get_PrimaryAdapter=function(){return this.PrimaryAdapter;}
EpiTransaction.prototype.set_PrimaryAdapter=function(value){this.PrimaryAdapter = value;}
EpiTransaction.prototype.set_StatusPanel=function(value){this.StatusPanel = value;}
EpiTransaction.prototype.get_StatusPanel=function(){return this.StatusPanel;}
EpiTransaction.prototype.get_ViewChangeAsRowChange=function() {return this.ViewChangeAsRowChange;}
EpiTransaction.prototype.set_ViewChangeAsRowChange=function(value) {this.ViewChangeAsRowChange = value;}
EpiTransaction.prototype.get_View=function() {return this.view;}
EpiTransaction.prototype.get_KeyFieldName=function() {return this.KeyFieldName;}
EpiTransaction.prototype.set_KeyFieldName=function(value) {this.KeyFieldName = value;}
EpiTransaction.prototype.get_MainDataView=function() {return this.MainDataView;}
EpiTransaction.prototype.set_MainDataView=function(value) {this.MainDataView = value;}
EpiTransaction.prototype.set_TransChangeData=function(value) {this.TransChangeData = value;}
EpiTransaction.prototype.get_TransChangeData=function() {return this.TransChangeData;}
EpiTransaction.prototype.get_LastControl=function() {return this.lastControl;}
EpiTransaction.prototype.SubscribeToPublisher=function(){} // TODO
EpiTransaction.prototype.OnLastControlChanged=function(){};
EpiTransaction.prototype.OnProcessCallBack=function(){}
EpiTransaction.prototype.RegisterCallContextSubscriber=function(EpiBinding, BPMDataColumn){}

EpiTransaction.prototype.OnScriptLoaded=function()
{
    this.WhoAmI = Assembly.GetCallingAssembly().GetName().Name;
}
EpiTransaction.prototype.SuspendNotifications=function(){} // TODO
EpiTransaction.prototype.ResumeNotifications=function(){}  // TODO
EpiTransaction.prototype.get_WhoAmI=function()
{
    return this.WhoAmI;
}
EpiTransaction.prototype.setStatusText=function(status,busy)
{
    Global.SetStatus(status);
}
EpiTransaction.prototype.get_EpiDataViews=function()
{
    var ht = new Hashtable();
    for(var edv in Global.BindingEngine.EpiDataViews)
    {
        ht.Add(edv, Global.BindingEngine.EpiDataViews[edv]);
    }
    return ht;
}
EpiTransaction.prototype.set_LastControl=function(value) 
{
    this.lastControl = value; 
    this.enableAddDelete();
    this.OnLastControlChanged();
}
EpiTransaction.prototype.TranEndEdit=function(dr)
{
    dr.EndEdit();
    this.TransChangeData = false; 
}
EpiTransaction.prototype.TranBeginEdit=function()
{
    this.TransChangeData = true;
}
EpiTransaction.prototype.GetCompoundPublisher=function(ViewName, Columns)
{
    return {"PublishKey":""};
}
EpiTransaction.prototype.disableAddDelete=function()
{
	if(this.ebf!=null&&this.ebf.baseToolbarsManager!=null& this.ebf.FormLoaded)
	{
		if (this.ebf.baseToolbarsManager.Tools["DeleteTool"] && this.ebf.AutoToggleDeleteButton)
		{
			var okToDisable = true;
			if(this.BeforeDisableDelete != null)
			{
//				System.ComponentModel.CancelEventArgs args = new System.ComponentModel.CancelEventArgs(false);
//				BeforeDisableDelete(this, args);
//				if(args.Cancel == true) okToDisable = false;
			}

			this.ebf.baseToolbarsManager.Tools["DeleteTool"].SharedProps.set_Enabled(!okToDisable);
		}
	}
}
EpiTransaction.prototype.get_AddNewText=function()
{
    if (!this.AddNewText) this.AddNewText = "";
    return this.AddNewText;
}
EpiTransaction.prototype.set_AddNewText=function(val){this.AddNewText=val;}

EpiTransaction.prototype.InitEpiView=function(view)	{this.LastView=view;}
EpiTransaction.prototype.RegisterAdapter=function(adapter)
{
    if (this.PrimaryAdapter == null) this.PrimaryAdapter = adapter;
    this.colAdapters.Add(adapter);
}
EpiTransaction.prototype.PushDisposableStatusText=function(statusMsg, hourGlass)
{
    //this.PushStatusText(statusMsg, hourGlass); // On Task Set form, this causes a Retrieving... message to be displayed all the time on the status bar.
	return new StatusDisposer(this);
}
EpiTransaction.prototype.get_KeyField=function()
{
	if(this.mainDataView.dataView.Count > 0)
		return this.mainDataView.dataView[mainDataView.Row][this.KeyFieldName].toString();
	else
		return "";
}
EpiTransaction.prototype.resetTransactionEvent=function()
{
	this.didDeleteAddNew = false;
	this.didDeleteOnDelete = false;
	this.didUndoAddNew = false;
	this.didUndoOnClear = false;
	this.didUpdateOnClose = false;
	this.currentEvent = TransactionEvent.None;
}
EpiTransaction.prototype.isNewRow=function(currentView)
{
	if(!(currentView.dataView.Count > 0)) { return false; }
	return (currentView.dataView.get_Row(currentView.Row).get_RowState() == DataRowState.Added);
}
EpiTransaction.prototype.OnEpiViewChanging = function(currentView, proposedView)
{
    return this.get_Event("EpiViewChanging").fire({CurrentView:currentView, ProposedView:proposedView}); 
}
EpiTransaction.prototype.OnEpiViewChanged = function(currentView, lastView)
{
    return this.get_Event("EpiViewChanged").fire({CurrentView:currentView, LastView:lastView}); 
}
EpiTransaction.prototype.Update=function() {return true;}
EpiTransaction.prototype.PushStatusText=function(statusMsg)
{
     Global.SetStatus(statusMsg);
}

EpiTransaction.prototype.PopStatus=function()
{
     Global.SetStatus("");
}

//EpiTransaction.ContextClicked=function(delegate)
//{
//    this.callbackMethod = function() {delegateMethod();}
//}

EpiTransaction.prototype.BeforeTransactionLoad=function(){}
EpiTransaction.prototype.TransactionLoad=function(){}
EpiTransaction.prototype.AddRowRulesForForm=function(){}

EpiTransaction.prototype.SetCurrentEvent=function(Event)
{
    this.currentEvent = Event;
}
EpiTransaction.prototype.GetCurrentEvent=function()
{
    return this.currentEvent;
}
EpiTransaction.prototype.SyncGlobal=function(syncGlobalObj)
{
    if (syncGlobalObj) // When a form is opened modeless, 'Global' is the global object of the opener form. But we want to sync the Global of the opened form, which is syncGlobalObj.
        syncGlobalObj.BindingEngine.EpiDataViews = this._views;
    else   
        Global.BindingEngine.EpiDataViews = this._views;
}
EpiTransaction.prototype.Add=function(viewName, dv)
{
    if ((dv==null) || (dv.dataView==null)) return;
    var dvt = dv.dataView.Table;
    if (dvt && dvt.Rows.length > 0 && dv.dataView.Rows.length == 0)
    {
        dv.Refresh(true);
    }
    if (dv.ViewName && dv.ParentView && dv.ParentView.ChildRelations.Children.length > 0)
    {
        // If ViewName for dv is changing, make sure we also update the name in the parent view's child dv list
        for(var ii=0, o; o=dv.ParentView.ChildRelations.Children[ii]; ii++)
             if (o.Name == dv.ViewName) o.Name = viewName;
        
        var keys = dv.ParentView.ChildViews.get_Keys();
        var newKey, val;
        for(var ii=0, o; o=keys[ii]; ii++)
        {
             if (o.indexOf(dv.ViewName) != -1) // remove this item and add it back using the new key
             {
                newKey = o.replace(dv.ViewName, viewName);
                val = dv.ParentView.ChildViews.get_Item(o);
                dv.ParentView.ChildViews.Remove(o);
                dv.ParentView.ChildViews.Insert(ii,newKey,val);
             }
        }
    }
    dv.ViewName = viewName;
    dv.set_EpiX(this);
    
    Global.BindingEngine.EpiDataViews[viewName] = dv;
    this._views[viewName] = dv;
    
    if (dv.AddEnabled) 
	{
		this.AddEpiDataViews.Add(viewName, dv); 
		this.CountAddViews ++;
		dv.AddedIdx = this.AddViewIndex;
		this.AddViewIndex++;
	}
	
	dvt = dv.dataView.Table; // For dashboards, the dataView.Table is set at set_EpiX.
	if (dvt)
	{
        var nameA = dvt.ExtendedProperties["AttachmentTableName"];
        if ((nameA) && (nameA.length > 0) && (dv.AllowAutoAttachments == true) && (this.AutomateAttachments == true) && 
            (dvt.ExtendedProperties["AllowAttachment"]==true) && (dvt.DataSet.Tables[nameA]))
        {
            dv.AddAttachmentView(dvt.DataSet.Tables[nameA]);
        }
    }

	dv.dataView.RegisterView(dv);
	Global.BindingEngine.EpiDataViewsDangling.Remove(dv);
}
// Note: this is incomplete, to be completed when context menus start working in the framework.
EpiTransaction.prototype.RegisterContextHandler=function(EpiBinding, MenuText, Handler, CustomOnlyOrReplacesProcessType)
{
    var ReplacesProcessType = "";
    var CustomOnly = false;
    if (Global.IsString(CustomOnlyOrReplacesProcessType))
    {
        ReplacesProcessType = CustomOnlyOrReplacesProcessType;
        if (ReplacesProcessType != "BaseForm" && ReplacesProcessType != "BaseSearch")
		{
			MessageBox.Show("Custom Context option can only replace BaseForm or BaseSearch process Types", new EpiOverloadedArgs("String"));
			
			return;
	    }
				
	    if (MenuText.length==0 && ReplacesProcessType.length>0)
	        MenuText = ReplacesProcessType;
    }
    else if (Global.IsBoolean(CustomOnlyOrReplacesProcessType))
        CustomOnly = CustomOnlyOrReplacesProcessType;
        
    if (this.CustomContextHandlers.ContainsKey(EpiBinding))
	{
		var q = this.CustomContextHandlers[EpiBinding];
		var iEnum = q.GetEnumerator();
		var isInQ = false;
		while (iEnum.MoveNext())
		{
			var cci = iEnum.Current;
			if (cci.MenuText == MenuText)
			{
				isInQ = true;
				cci.Handler = Handler;
			}
		}
		if (!isInQ)
		{
			cItem = {"MenuText":MenuText,"ReplacesProcessType":ReplacesProcessType,"Handler":Handler};
			q.Enqueue(cItem);
		}
	} 
	else 
	{
		var q = new Queue();
		var cci = {"MenuText":MenuText,"ReplacesProcessType":ReplacesProcessType,"Handler":Handler};
		q.Enqueue(cci);
		this.CustomContextHandlers.Add(EpiBinding, q);
	}
	var parts = EpiBinding.split(".");
	var vName = parts[0]; //EpiBinding.substring(0, EpiBinding.indexOf("."));
	var cName = parts[1]; //EpiBinding.substring(EpiBinding.indexOf(".")+1);
	var edv = Global.BindingEngine.EpiDataViews[vName];
	if (!edv || !edv.dataView || !(edv.dataView.Table.Columns[cName])) return;
	var ctx = "CustomContext";
	if (CustomOnly) ctx = "CustomContextOnly";
	edv.dataView.Table.SetExtendedProperty(cName,"CustomContext",ctx);
    if (ReplacesProcessType.length > 0)
    {
        edv.dataView.Table.SetExtendedProperty(cName,ReplacesProcessType,true);
        if (MenuText != null && MenuText.length>0)
            edv.dataView.Table.SetExtendedProperty(cName,"CustomContextText", MenuText);
    }   
}
EpiTransaction.prototype.HandleContextClick=function(Sender,CurrentValue,EpiBinding,MenuText)
{
	if (this.CustomContextHandlers.ContainsKey(EpiBinding))
	{
		var q = this.CustomContextHandlers[EpiBinding];
		var iEnum = q.GetEnumerator();
		var cci;
		while (iEnum.MoveNext())
		{
			cci = iEnum.Current;
			if (cci.MenuText == MenuText)
				return cci.Handler(Sender, CurrentValue);
		}
		return null;
	} 
	else return null;
}
EpiTransaction.prototype.OnButtonClicked = function(button) 
{
    if (this.set_LastView(Global.BindingEngine.EpiDataViews[button.DataView]))
    {
        this.OnButtonClick_1(button.DataView + "." + button.DataColumn); //, new EpiOverloadedArgs("String")
        this.OnButtonClick_2(new EpiButtonClickArgs(button)); //, new EpiOverloadedArgs("EpiButtonClickArgs")
    }
}
//EpiTransaction.prototype.OnButtonClick = function(arg, overload)
//{
//    var a = arguments;
//    var tempArray = new Array();
//    for (i = 0; i < a.length; i++) { tempArray[i] = a[i] }
//    var overload = Global.GetOLSeqForArgTypes(tempArray);

//    switch (overload)
//    { 
//        case 'String':
//            this.OnButtonClick_1(arg);
//        break;
//        case 'EpiButtonClickArgs':
//            this.OnButtonClick_2(arg);
//        break;
//    }
//}
EpiTransaction.prototype.OnButtonClick = function(arg, overload){}
EpiTransaction.prototype.OnButtonClick_1=function(epiBinding){}
EpiTransaction.prototype.OnButtonClick_2=function(epiButtonArgs){}

EpiTransaction.prototype.OnInvokeSearch=function(o)
{
    this.InvokeSearch(o);
}
EpiTransaction.prototype.InvokeSearch=function(o){}
EpiTransaction.prototype.ConfirmAddNew=function(ForceDialog)
{
	//Don't do any thing if it is running in FormTester
	if(FormTestManager) ForceDialog = false;

	if((this.ebf != null) && (this.ebf.IsEpiReadOnly))
	{
		if(!this.ebf.EpiReadOnlyAllowAddNew)
		{
			FormFunctions.DialogConfirmed("AddNewOnReadOnly");
			return false;
		}
	}

	return this.dialogConfirmed(ForceDialog, Enum.ToString(this.currentEvent,TransactionEvent));
}
EpiTransaction.prototype.ConfirmUpdate=function(ForceDialog)
{
    var isAdding = false;
	if (this.currentEvent == TransactionEvent.AddNewOnNewButton)
	{
		this.currentEvent = TransactionEvent.UpdateOnNewButton;
		isAdding = true;
	}
    var isPrimaryKey = false;
	if (this.currentEvent == TransactionEvent.AddNewOnPrimaryKey)
	{
		this.currentEvent = TransactionEvent.UpdateOnPrimaryKey;
		isAdding = true;
	}
    var conf = this.dialogConfirmed(ForceDialog, Enum.ToString(this.currentEvent,TransactionEvent));
	
	if (isAdding) this.currentEvent = TransactionEvent.AddNewOnNewButton;
	if (isPrimaryKey) this.currentEvent = TransactionEvent.AddNewOnPrimaryKey;
	if (this.currentEvent == TransactionEvent.UpdateOnFormClose)
	{
		this.currentEvent = TransactionEvent.None;
		if (conf) this.didUpdateOnClose = true;
		EpiTransaction.didCancelClose = !conf;
	}
	return conf;
}
EpiTransaction.prototype.dialogConfirmed=function(ForceDialog, ConfirmKey)
{
	this.wasDialogConfirmed = false;
	this.DialogReject = false;
    var _res = false;

	if (!ForceDialog && !this.ebf.FormOptions.ConfirmOptions.GetConfirmOption(this.currentEvent)) 
	{
		this.wasDialogConfirmed = true;
		return true;
	}

	if (this.currentEvent == TransactionEvent.UndoOnClearButton && this.dataHasChanges())
		ConfirmKey = "UndoOnClearDataChangeButton";
	if (this.currentEvent == TransactionEvent.UndoOnRefreshButton && this.dataHasChanges())
		ConfirmKey = "UndoOnRefreshDataChangeButton";

    var ecmr = FormFunctions.CheckDialogConfirmed(ConfirmKey);

//	// ** Notify subscribers of dialog result 
//	DialogConfirmedArgs args = new DialogConfirmedArgs(sCurrentEvent, ecmr.Result);
//	this.OnDialogConfirmed(args);

    if (ecmr.Result == DialogResult.Cancel) return false;
	if (ecmr.Result == DialogResult.Yes) _res = true;
	if ((ecmr.Buttons == MessageBoxButtons.YesNoCancel && ecmr.Result == DialogResult.No) ||
	    (ConfirmKey=="UpdateOnFormClose" && ecmr.Result==DialogResult.No))
	{
		_res = true;
		this.DialogReject = true;
	}

	if (!(this.currentEvent == TransactionEvent.DeleteOnDeleteButton) && 
		!(this.currentEvent == TransactionEvent.DeleteOnDeleteAddNew))
		this.wasDialogConfirmed = _res;
	if (!_res)
		this.SetCurrentEvent(TransactionEvent.None);
	return _res;
}
EpiTransaction.prototype.get_LastView=function()
{
    if(!this.LastView) this.LastView = new EpiDataView();
    return this.LastView;
}
EpiTransaction.prototype.set_LastView=function(value)
{
    if (this.LastView == value) 
	    return true;
	    
    var isChangeToBpmView = false;
    var isChangeFromBpmView = false;
	var hadLastView = false;
	var hasChanged = false;
	var lastRow = 0;

    try
    {
        if (value.dataView.Table.TableName.toUpperCase() == "BPMDATA" || value.dataView.Table.TableName.toUpperCase() == "DTSEGMENTSEWA") 
            isChangeToBpmView = true;
    }
    catch(err){}


	if (this.LastView != null) 
	{
	    try
	    {
            if (isChangeToBpmView)
            {
                this.priorEpidataViewBeforeBpmView = this.LastView;
            }
            else
            {
                if (this.LastView.dataView.Table && (this.LastView.dataView.Table.TableName.toUpperCase() == "BPMDATA" || this.LastView.dataView.Table.TableName.toUpperCase() == "DTSEGMENTSEWA")) 
                {
                    isChangeFromBpmView = true;
                }
                else
                {
                    this.priorEpidataViewBeforeBpmView = null;
                }
            }
	    
		    lastRow = this.LastView.Row;
		    this.saveView = this.LastView; 
		    hadLastView = true;
        }
        catch(err)
        {
        }
	}

	try 
	{
		if (hadLastView)    // okay to send before chg event
		{
		    if (!isChangeToBpmView && !isChangeFromBpmView)
            {
			    if (this.ViewChangeAsRowChange) 
			    {
				    this.currentEvent = TransactionEvent.UpdateOnRowChange;
				    this.LastView.OnEpiRowChanging(this.LastView, this.LastView.Row, 0);
			    } 
			    else 	
			    {
				    this.OnEpiViewChanging(this.LastView, value);
			    }
		    }
            else
            {
                if (isChangeFromBpmView && (this.priorEpidataViewBeforeBpmView != null))
                {
                    if (this.priorEpidataViewBeforeBpmView != value)
                    {
                        if (this.ViewChangeAsRowChange)
                        {
                            this.currentEvent = TransactionEvent.UpdateOnRowChange;
                            this.priorEpidataViewBeforeBpmView.OnEpiRowChanging(this.LastView,this.priorEpidataViewBeforeBpmView.Row, 0);
                        }
                        else
                        {
                            this.OnEpiViewChanging(this.priorEpidataViewBeforeBpmView, value);
                        }
                    }
                }
            }
		}
		this.LastView = value;
		hasChanged = true;
	} 
	catch (err) 
	{
		return false;
	}
	
	if (hasChanged && hadLastView)
	{
        if (!isChangeToBpmView && !isChangeFromBpmView)
        {
		    if (this.ViewChangeAsRowChange)
		    {
			    this.LastView.OnEpiRowChanged(this.LastView.Row, lastRow);
		    } 
		    else 
		    {
			    this.OnEpiViewChanged(this.LastView, this.saveView);
    			
                if(this.ebf && this.ebf.MainTreeViewPanel)
                {
                    this.ebf.MainTreeViewPanel.get_EpiTreeView().NodeActivator(this.LastView);
                }
		    }
	    }
        else
        {
            if (isChangeFromBpmView && (this.priorEpidataViewBeforeBpmView != null))
            {
                if (this.priorEpidataViewBeforeBpmView != this.LastView)
                {
                    if (this.ViewChangeAsRowChange)
                    {
                        this.priorEpidataViewBeforeBpmView.OnEpiRowChanged(this.priorEpidataViewBeforeBpmView.Row, lastRow);
                    }
                    else
                    {
                        this.OnEpiViewChanged(this.LastView, this.priorEpidataViewBeforeBpmView);
                    }
                }
            }
        }
	}
	
	return true;
}
EpiTransaction.prototype.NotifyAllExceptTree=function()
{
    this.NotifyAll();
}
EpiTransaction.prototype.NotifyAll=function(typeOrBruteForce, view)
{
    if(typeOrBruteForce==null)
    {
        // TODO
    }
    else if(Global.IsBoolean(typeOrBruteForce))
    {
        // TODO
        var bruteForce = typeOrBruteForce;
    }
    else
    {
        var type = typeOrBruteForce;
        
		if ((type == NotifyType.Initialize) || (type == NotifyType.InitAndResetTreeNodes))
		{
			if(type == NotifyType.InitAndResetTreeNodes)
				this.notifyInitAndResetTreeNodes = true;
//			this.notifyInit = true;
//			this.notifyDelete = false;
            this.LastView=view;
//			this.NotifyAll();
		}

		if(type == NotifyType.InitLastView)
		{
			this.LastView=view;
//			this.NotifyAll();
		}

		if (type == NotifyType.DeleteRow)
		{
//			this.deleteView = view;
//			this.notifyDelete = true;
//			this.NotifyAll();
		}

//		this.notifyInit = false;
//		this.notifyDelete = false;
    }

    //special notification for the trees
    Global.IsTreeReset=false;
    Global.IsTreeNotifying=true;
    for(var edv in Global.BindingEngine.EpiDataViews)
    {   
        var dv = Global.BindingEngine.EpiDataViews[edv];
        if(!dv.HasParent)
        dv.OnEpiViewNotificationTree(new EpiNotifyArgs(this, true, dv.Row, 0,new EpiOverloadedArgs("Object_Boolean_Int32_Int32")));
    }
    Global.IsTreeReset=false;
    Global.IsTreeNotifying=false;
}
EpiTransaction.prototype.NotifyAllOthers=function(eView,ChangeGridPropsCurrentRowOnly,NotifyTree,NotifyGuid)
{
    if (!eView.dataView.Table.Columns["RowIdent"]) return;
    if (eView.dataView.Count == 0 || eView.dataView.Rows.length <= eView.Row) return;
    if(eView.dataView.Rows[eView.Row]["RowIdent"]==undefined) return;
    var findThis = eView.dataView.Rows[eView.Row]["RowIdent"].toString();
	var eTable = eView.dataView.Table.TableName;
	if (findThis != null && findThis.length>0)
	{
		for (var o in Global.BindingEngine.EpiDataViews)
		{
		    o=Global.BindingEngine.EpiDataViews[o];
			var tView = o;
			var tTable = tView.dataView.Table.TableName;
			if (tView != eView && tTable == eTable)
			{
				var i=0;
				for (var drv in tView.dataView.Rows)
				{
				    drv=tView.dataView.Rows[drv];
					if (drv["RowIdent"] && drv["RowIdent"].toString() == findThis)
					{
                        if (eView instanceof FilteredBAQDataView && tView instanceof BAQDataView)
                            tView.Row = i;
                        else
                        {
                            tView.set_Row(i);
//							var args = new EpiNotifyArgs(this, tView.Row, 0,new EpiOverloadedArgs("Object_Int32_Int32"));
//							args.ChangeGridPropsCurrentRowOnly = ChangeGridPropsCurrentRowOnly;
//                            args.NotifyTree = NotifyTree;
//							if(!String.IsNullOrEmpty(NotifyGuid))args.Guid = NotifyGuid; // persist this notify ID
//							tView.Notify(args);
				        }
					}
					i++;
				}
			}
		}
	}
}
EpiTransaction.prototype.ConfirmUndo=function(forceDialog)
{
    if (this.currentEvent != TransactionEvent.UndoOnUndoButton &&
        this.currentEvent != TransactionEvent.UndoOnUndoAddNew &&
        this.currentEvent != TransactionEvent.UndoOnRefreshButton &&
        this.currentEvent!=TransactionEvent.UndoOnClearButton)
    {
        // That's smart client EpiClientLib behavior
        return true;
    }
    if(this.currentEvent==TransactionEvent.UndoOnClearButton && !Global.Form.FormLoaded)
        return false;
	if (this.currentEvent == TransactionEvent.UndoOnUndoButton && !this.dataHasChanges())
		return true;
	var conf = this.dialogConfirmed(forceDialog, Enum.ToString(this.currentEvent, TransactionEvent));
	if (conf)
	{
		if (this.currentEvent == TransactionEvent.UndoOnUndoAddNew) this.didUndoAddNew = true;
		if (this.currentEvent == TransactionEvent.UndoOnClearButton) this.didUndoOnClear = true;
	}
	return conf;
}
EpiTransaction.prototype.validateCurrentEvent=function(ValidEvents)
{
	var _rtn = false;
	for (var idx in ValidEvents)
	{
		if (ValidEvents[i] == ValidEvents[idx]) _rtn = true;
	}	
	return _rtn;
}
EpiTransaction.prototype.PublishColumnChange=function(EpiBinding,BroadcastName)
{
	var p = PublishAgent.RegisterTransactionEvent(this, BroadcastName, EpiBinding); // register with broadcasttower
    
    if (!this._publishers)
        this._publishers = new Hashtable();
   if (this._publishers.ContainsKey(EpiBinding))
		this._publishers[EpiBinding] = p;//publisherKey; // publisherKey represents the publisher
	else 
		this._publishers.Add(EpiBinding,p);//publisherKey);
}
EpiTransaction.prototype.GetPublisher=function(EpiBinding)
{
    if (!this._publishers) return null;
    if (this._publishers.ContainsKey(EpiBinding))
		return this._publishers[EpiBinding]; // publisherKey represents the publisher
	else 
		return null;
}

//EpiTransaction.prototype.DoPublish=function(EpiBinding, newValue)
//{
//    if (this.get_Event("BroadcastEvent").subscribers.length ==0 || this.inBroadCast) return; // noone is subscribed

//    // If we are a publisher for this epibinding, fire the Broadcast event.
//    if (this._publishers.ContainsKey(EpiBinding))
//    {
//        this.inBroadCast = true;
//        this.get_Event("BroadcastEvent").fire({"Publisher":this._publishers[EpiBinding],"NewValue":newValue});
//        this.inBroadCast = false;
//    }
//}
EpiTransaction.prototype.dataHasChanges=function()
{   
	if (this instanceof EpiSingleViewTransaction)
	{
	    if (this.view && this.view.dataView && this.view.dataView.Table && this.view.dataView.Table.DataSet)
		    return this.view.dataView.Table.DataSet.HasChanges();
		else return false;
    }
	if (this instanceof EpiMultiViewTransaction)
	{
	    if (this.mainDataView && this.mainDataView.dataView && this.mainDataView.dataView.Table && this.mainDataView.dataView.Table.DataSet)
	    	return this.mainDataView.dataView.Table.DataSet.HasChanges();
		else return false;
    }
		
	var hasChg = false;
	for(var dv in Global.BindingEngine.EpiDataViews)
    {
        var tEDV = Global.BindingEngine.EpiDataViews[dv];
		if (tEDV != null &&
			tEDV.dataView != null && tEDV.dataView.Table != null &&
			tEDV.dataView.Table.DataSet != null &&
			(!tEDV.dataView.Table.DataSet.DataSetName.EndsWith("ListDataSet")) &&
			tEDV.dataView.Table.DataSet.HasChanges())
        {
			hasChg = true;
			break;
	    }
	}
	return hasChg;
}
EpiTransaction.prototype.ConfirmDelete=function(ForceDialog)
{
	var conf = this.dialogConfirmed(ForceDialog, Enum.ToString(this.currentEvent, TransactionEvent));

	if (conf)
	{
		if (this.currentEvent == TransactionEvent.DeleteOnDeleteAddNew) this.didDeleteAddNew = true;
		if (this.currentEvent == TransactionEvent.DeleteOnDeleteButton) this.didDeleteOnDelete = true;
	}
	return conf;
}
EpiTransaction.prototype.Factory=function(table)
{
    return Global.BindingEngine.EpiDataViews[table];
}
EpiTransaction.prototype.loadEpiDataView=function(currentView, viewName, currentTable, addRowChangeEvent)
{
	currentView.set_dataView(new DataView(currentTable));
	this.Add(viewName,currentView);	
//	if (addRowChangeEvent)
//	{
//	    currentView.get_Event("EpiRowChanging").subscribe(EpiRowChanging,this,true);
//	}
}
EpiTransaction.prototype.SuppressContextMenus=function(EpiBinding,SuppressSrch,SuppressMaint)
{
    var vName = EpiBinding.substring(0, EpiBinding.indexOf("."));
	var cName = EpiBinding.substring(EpiBinding.indexOf(".")+1);
	var edv = Global.BindingEngine.EpiDataViews[vName];
	if (!edv || !edv.dataView || !(edv.dataView.Table.Columns[cName])) return;
	if (SuppressSrch == true)
		this.suppressSearches.Add(EpiBinding);
	if (SuppressMaint == true)
		this.suppressMaints.Add(EpiBinding);
}
EpiTransaction.prototype.PublishMultipleColumns=function(){}
EpiTransaction.prototype.OnDataChanged=function()
{
    this.get_Event("DataChanged").fire();
}
EpiTransaction.prototype.disableAddDelete=function()
{
	if(this.ebf!=null&&this.ebf.baseToolbarsManager!=null& this.ebf.FormLoaded)
	{
		if (this.ebf.baseToolbarsManager.Tools["DeleteTool"] && this.ebf.AutoToggleDeleteButton)
		{
			var okToDisable = true;
			if(this.BeforeDisableDelete != null)
			{
			    var eventArgs = {Cancel:false};
				this.get_Event("BeforeDisableDelete").fire(this, eventArgs);
				if(eventArgs.Cancel) okToEnable = false;
			}

			this.ebf.baseToolbarsManager.Tools["DeleteTool"].SharedProps.set_Enabled(!okToDisable);
		}
	}
}
EpiTransaction.prototype.enableAddDelete=function()
{
    if (this.ebf && this.ebf.myTool && this.ebf.FormLoaded ==true)
	{
		if (this.ebf.myTool.Tools["DeleteTool"])
		{
			if(!this.ebf.IsEpiReadOnly && this.ebf.AutoToggleDeleteButton)
			{
				var okToEnable = true;
				if(this.BeforeEnableDelete)
				{
				    var eventArgs = {Cancel:false};
   					this.get_Event("BeforeEnableDelete").fire(this, eventArgs);
					if(eventArgs.Cancel) okToEnable = false;
				}

				this.ebf.myTool.Tools["DeleteTool"].SharedProps.set_Enabled(okToEnable);
			}
		}
	}
}
EpiTransaction.prototype.OnTransactionCallBack=function()
{
	if (!Global.Form || !Global.Form.LaunchFormOpts || !Global.Form.LaunchFormOpts.CallBackToken ||
		Global.Form.LaunchFormOpts.CallBackToken.length <=0 ||
		this.currentEvent == TransactionEvent.None || !this.wasDialogConfirmed ) return;
	this.wasDialogConfirmed = false;
	
	var args = new TransactionCallBackArgs(this.currentEvent, Global.Form.LaunchFormOpts.CallBackToken);
	
	this.get_Event("TransactionCallBack").fire(args); 
    if(window.opener && Global.Form.LaunchFormOpts.processCaller)
    {
        Global.Form.LaunchFormOpts.processCaller.oTransaction_TransactionCallBack(this, args);
    }
}
EpiTransaction.prototype.ProcessCaller_ProcessCallBack=function(Sender,args)
{
	if (args.CallBackToken == "NewQuickSearch")
	{
		//if (qsHandler != null) qsHandler.ResetValidators();
	}
	else
	{
		this.OnProcessCallBack(Sender, args);
	}
}
EpiTransaction.prototype.get_ClearBpmDataOnClear=function(){return this.clearBpmDataOnClear;}
EpiTransaction.prototype.set_ClearBpmDataOnClear=function(val){this.clearBpmDataOnClear=val;}
EpiTransaction.prototype.SetupCallContext=function()
{
//    // verify
    if(this.hasInitializedCallContextData) return;
//    if (AdapterList == null ||
//        AdapterList.Count <= 0 ||
//        hasInitializedCallContextData) return;
    // create and init new CallContext dataset
    var ccds=CallContextDataHelper.CreateCallContextData(Global.Form);
//    // enum the adapters and set the CCDS
//    for (int i = 0; i < AdapterList.Count; i++)
//    {
//        EpiBaseAdapter adapter = AdapterList[i] as EpiBaseAdapter;
//        // share THE CallContext dataset across adapters.
//        if (adapter != null && adapter.CallContext != null)
//            adapter.CallContext = ccds;
//    }
    this.createCallContextEpiDataViews(ccds);
    Global.CallContextDS=ccds;
    
    // set the flag has been init flag
    this.hasInitializedCallContextData = true;
}
EpiTransaction.prototype.createCallContextEpiDataViews=function(ccds)
{
    // create the Client view
    var ccClientView = new EpiDataView();
    ccClientView.set_dataView(new DataView(ccds.Client));
    // add and init to Row 0;
    this.Add("CallContextClientData", ccClientView);
    ccClientView.set_Row(0);

    // create the Bpm view
    var ccBpmView = new EpiDataView();
    ccBpmView.set_dataView(new DataView(ccds.BpmData));
    // add and init to Row 0;
    this.Add("CallContextBpmData", ccBpmView);
    ccBpmView.set_Row(0);
}
EpiTransaction.prototype.OnProcessCallBack=function(){}
EpiTransaction.prototype.AddForeignKeyView=function()
{
	var fkAgent = new ForeignKeyAgent();

    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "String_String":
        fkAgent.RegisterView(this, a[0], a[1], "", new EpiOverloadedArgs("EpiTransaction_String_String_String"));
        break;
        case "String_String_String":
	    fkAgent.RegisterView(this, a[0], a[1], a[2], new EpiOverloadedArgs("EpiTransaction_String_String_String"));
        break;
        case "StringArr_String_String_String":
	    fkAgent.RegisterView(this, a[0], a[1], a[2],a[3], new EpiOverloadedArgs("EpiTransaction_StringArr_String_String_String"));
        break;
    }
}
EpiTransaction.prototype.AddForeignKeyAgent=function(agent)
{
	if (this.foreignKeyAgents == null)
		this.foreignKeyAgents = new ArrayList();
	if (!this.foreignKeyAgents.Contains(agent))
		this.foreignKeyAgents.Add(agent);
}

var EpiProcedureTrans = Epicor.Mfg.UI.FrameWork.EpiProcedureTrans=function(Sender)
{
    this.ReportParmsView = new EpiDataView();
    this.Schedules = new DataView();
    EpiTransaction.call(this,{doProcessing:true}, "EpiProcedureTrans");
}
EpiProcedureTrans.prototype = new EpiTransaction();
EpiProcedureTrans.prototype.get_ReportParmsView=function(){return this.ReportParmsView;}
EpiProcedureTrans.prototype.set_ReportParmsView=function(val){this.ReportParmsView = val;}
EpiProcedureTrans.prototype.get_Schedules=function(){return this.Schedules;}
EpiProcedureTrans.prototype.get_ProcessSets=function(){return this.processView;}

EpiProcedureTrans.prototype.PreTransactionLoad=function(Sender)
{
    this.sysAgentAdapter = Global.GetAdapter("SysAgentAdapter",Sender);
    Global.LoadProxyForAdapter(this.sysAgentAdapter,null,true);
    this.sysAgentAdapter.BOConnect();
	this.Schedules = new DataView(this.sysAgentAdapter.get_SysAgentSchedListData().get_SysAgentSchedList());
   ({_call:function(me){var _ret_=me.sysAgentAdapter.GetDefaultTaskAgentID(me.defaultAgentID);me.defaultAgentID=Global.ArgManager["Out1"];return _ret_;}})._call(this);
	
	this.sysAgentAdapter.getSchedules(this.defaultAgentID);
    
    var recSelected = false;
    this.processSetDS = ({_call:function(me){var _ret_=Epicor.Mfg.UI.FormFunctions.SearchFunctions.listLookup(me,"ProcessSetAdapter",recSelected,false,"",true ,new EpiOverloadedArgs("Object_String_Boolean_Boolean_String_Boolean"));recSelected=Global.ArgManager["Out1"];return _ret_; }})._call(this);
    this.processView = new DataView(this.processSetDS.get_Table(0));
    this.processView.Sort = "Description";
}
EpiProcedureTrans.prototype.GetNewParameters=function()
{

    var _sucess = true;
    try
    {
	    _sucess = this.adapterGetNewParameters();
    	
	    this.ReportParmsView.dataView.Rows[0]["AgentSchedNum"]= 0;
	    this.ReportParmsView.dataView.Rows[0]["AgentID"]= this.defaultAgentID;

	    if(this.ReportParmsView.dataView.Table.ColumnsContains("DateFormat"))
	    {
		    this.ReportParmsView.dataView.Rows[0]["DateFormat"]= FormatEngine.CultureInfo.ShortDatePattern.toLowerCase();
	    }
	    if(this.ReportParmsView.dataView.Table.ColumnsContains("NumericFormat"))
	    {
		    var numberFormat = FormatEngine.CultureInfo.NumberGroupSeparator + FormatEngine.CultureInfo.NumberDecimalSeparator;
		    this.ReportParmsView.dataView.Rows[0]["NumericFormat"]= numberFormat;
	    }

	    this.NotifyAll(NotifyType.Initialize, this.ReportParmsView);
	}
	catch(e)
	{   
		ExceptionBox.Show(e);
        _sucess=false;
	}
	return _sucess;
}
EpiProcedureTrans.prototype.adapterGetNewParameters=function(){}
EpiProcedureTrans.prototype.RunDirect=function(outputType)
{
	var _success = true;
	var schedID = 0;
	
	try
	{
		var row = this.ReportParmsView.dataView.get_Row(0);
		schedID = System.Convert.ToInt32(row["AgentSchedNum"]);
		if (schedID == undefined) return false;
		switch(outputType)
		{
		    case "Generate":
				row["AutoAction"] = "";
				row.EndEdit();
				
				if(this.SubmitToAgent(this.defaultAgentID,schedID,0))
					this.PushStatusText(EpiString.GetString("SubmitProcess"));
				break;
		}
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		_success = false;
	}

	return _success;
}
EpiProcedureTrans.prototype.SubmitToAgent=function(agentID, angetSchedNum, agentTaskNum)
{
	var returnValue = true;
	try
	{
		if (Global.Form.ID=="COSWIPForm")
		{
			this.ReportParmsView.dataView.Rows[0]["RowMod"]= "A";
 			this.ReportParmsView.dataView.Rows[0]["_RowState"]= "A";
		}
		this.adapterSubmitToAgent(agentID, angetSchedNum, agentTaskNum);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		returnValue = false;
	}
	return returnValue;
}
EpiProcedureTrans.prototype.adapterSubmitToAgent=function(){}
EpiProcedureTrans.prototype.SaveProcessTask=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The EpiProcedureTrans.SaveProcessTask function is not implemented.", new EpiOverloadedArgs("String_Details"));
    return false;
}
EpiProcedureTrans.prototype.GetParamsFromAgent=function(agentID,angetSchedNum,agentTaskNum)
{
	try
	{
		this.adapterGetParamsFromAgent(agentID, angetSchedNum, agentTaskNum);
		this.NotifyAll(NotifyType.Initialize, this.ReportParmsView);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
}
EpiProcedureTrans.prototype.adapterGetParamsFromAgent=function(){}
EpiProcedureTrans.prototype.GetParamTaskDef=function(processID,processTask)
{
	try
	{
		this.GetNewParameters();
		var row = this.ReportParmsView.dataView.get_Row(0);
		row["ProcessID"]= processID;
		row["ProcessTaskNum"]= processTask;
		this.adapterGetParamTaskDef();
		this.NotifyAll(NotifyType.Initialize, this.ReportParmsView);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
}
EpiProcedureTrans.prototype.adapterGetParamTaskDef=function(){}

EpiProcedureTrans.prototype.Delete=function()
{
    if(this.get_LastView().ViewName == this.ReportParmsView.ViewName)
				return;
	if(this.LastView.HasRow)
	{
		this.get_LastView().dataView.get_Row(this.get_LastView().Row).Delete();
		this.get_LastView().dataView.Table.DataSet.AcceptChanges();
		Global.BindingEngine.Reload(EpiBindType.Merge, this.get_LastView().dataView.Table.DataSet);
	}
	
	if(this.get_LastView().Row >= this.get_LastView().dataView.Rows.length -1)
		if(this.get_LastView().dataView.Rows.length == 1)
			this.get_LastView().Row = 0;
		else 
			this.get_LastView().Row--;
	this.get_LastView().Notify(new EpiNotifyArgs(this, this.get_LastView().Row, this.LastView.Column, new EpiOverloadedArgs("Object_Int32_Int32")));
	this.ReportParmsView.Notify(new EpiNotifyArgs(this, this.ReportParmsView.Row, this.ReportParmsView.Column, new EpiOverloadedArgs("Object_Int32_Int32")));
}

EpiProcedureTrans.prototype.GetTokenList=function(tokenDataType)
{
	var tokenList = "";
	try
	{
		tokenList = this.adapterGetTokenList(tokenDataType);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
	return tokenList;
}
EpiProcedureTrans.prototype.adapterGetTokenList=function(tokenDataType){}

EpiProcedureTrans.prototype.GetNewRecord=function(viewName)
{
	var recordAdded = false;
	var myDataRow;
	var tempView;

	try
	{
		if(Global.BindingEngine.EpiDataViews[viewName])
		{
			recordAdded = true;
			tempView = Global.BindingEngine.EpiDataViews[viewName];
			myDataRow = tempView.dataView.Table.NewRow();
			tempView.dataView.Table.AddRow(myDataRow);
			tempView.Notify(new EpiNotifyArgs(this, tempView.dataView.Count - 1, NotifyType.AddRow,new EpiOverloadedArgs("Object_Int32_Int32")));
			this.ReportParmsView.Notify(new EpiNotifyArgs(this, this.ReportParmsView.Row, this.ReportParmsView.Column,new EpiOverloadedArgs("Object_Int32_Int32")));
		}
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}

	return recordAdded;
}	
EpiProcedureTrans.prototype.setTableKey=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "DataTable_String":
        this.setTableKey_0(a[0],a[1]);
        break;
        case "DataTable_String_Object":
        this.setTableKey_1(a[0],a[1],a[2]);
        break;
    }
}
EpiProcedureTrans.prototype.setTableKey_0=function(sourceTable, primaryKey)
{
	var tableKey = [sourceTable.Columns[primaryKey]];
	sourceTable.PrimaryKey = tableKey;
	sourceTable.Columns[primaryKey].DefaultValue = "";
	
	var searchCol;
	for(var searchColN in sourceTable.Columns)
	{
        searchCol = sourceTable.Columns[searchColN];
   		searchCol.AllowDBNull = true;
   		
   		var readOnlyProp = sourceTable.GetExtendedProperty(searchColN, "ReadOnly");
		if(readOnlyProp!=undefined && readOnlyProp!="")
			if(searchCol.ColumnName == primaryKey)
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",false);
			else
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",true);
		else
			if((searchCol.ColumnName == primaryKey)||(searchCol.ColumnName == undefined && searchColN == primaryKey))
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",false);
		    else
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",true);
	}	
}
EpiProcedureTrans.prototype.setTableKey_1=function(sourceTable, primaryKey, keyDefaultValue)
{
	var tableKey = [sourceTable.Columns[primaryKey]];
	sourceTable.PrimaryKey = tableKey;
	sourceTable.Columns[primaryKey].DefaultValue = keyDefaultValue;
	var searchCol;
	for(var searchColN in sourceTable.Columns)
	{
	    searchCol = sourceTable.Columns[searchColN];
	    var readOnlyProp = sourceTable.GetExtendedProperty(searchColN, "ReadOnly");
		if(readOnlyProp !=undefined && readOnlyProp!="")
			if(searchCol.ColumnName == primaryKey)
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",false);
			else
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",true);
		else
			if(searchCol.ColumnName == primaryKey)
			   sourceTable.SetExtendedProperty(searchColN,"ReadOnly",false);
		    else
				sourceTable.SetExtendedProperty(searchColN,"ReadOnly",true);
	}	
}
var EpiReportTransaction = Epicor.Mfg.UI.FrameWork.EpiReportTransaction = function(Sender)
{
    this.StyleList = new DataTable();
    this.Schedules = new DataView();
    this.ReportType = "Text";
    this.ReportParmsView = new EpiDataView();
    EpiTransaction.call(this,{doProcessing:true}, "EpiReportTransaction");
}
EpiReportTransaction.prototype = new EpiTransaction();
EpiReportTransaction.prototype.ctor=function(Sender)
{
    if (this._assembly=="UIRpt.BAQReport" && Global.Form.ID=="BAQReportForm")
    {
        if (Global.Form.get_MenuItemDS())
            this.LoadMemuData(Global.Form.get_MenuItemDS());
        else if (Global.Form.ReportName) // Form is generated at runtime (customization)
        {
            this.LoadBAQReportData(Global.Form.ReportName); // Will happen when the custom form is opened directly, without the menuid in the url. but the runtime form has the report name in its metadata.
        }
    }
}
EpiReportTransaction.prototype.get_StyleList=function(){ return this.StyleList; }
EpiReportTransaction.prototype.set_StyleList=function(dt){ this.StyleList = dt; }
EpiReportTransaction.prototype.get_ReportType=function(){return this.ReportType;}
EpiReportTransaction.prototype.set_ReportType=function(val){this.ReportType = val;}
EpiReportTransaction.prototype.get_ReportParmsView=function(){return this.ReportParmsView;}
EpiReportTransaction.prototype.set_ReportParmsView=function(val){this.ReportParmsView = val;}
EpiReportTransaction.prototype.get_Schedules = function(){return this.Schedules;}
EpiReportTransaction.prototype.get_DefaultAgentID=function(){return this.defaultAgentID;}
EpiReportTransaction.prototype.adapterGetDefaults=function(){}
EpiReportTransaction.prototype.adapterSaveDefaults=function(){}
EpiReportTransaction.prototype.adapterRemoveDefaults=function(){}
EpiReportTransaction.prototype.adapterGetParamsFromAgent=function(agentID,angetSchedNum,agentTaskNum){}
EpiReportTransaction.prototype.adapterGetParamTaskDef=function(){}
EpiReportTransaction.prototype.Undo=function(){return true;}

EpiReportTransaction.prototype.Delete=function()
{
    if(this.get_LastView().ViewName == this.ReportParmsView.ViewName)
				return;
	if(this.LastView.HasRow)
	{
		this.get_LastView().dataView.get_Row(this.get_LastView().Row).Delete();
		this.get_LastView().dataView.Table.DataSet.AcceptChanges();
		Global.BindingEngine.Reload(EpiBindType.Merge, this.get_LastView().dataView.Table.DataSet);
	}
	
	if(this.get_LastView().Row >= this.get_LastView().dataView.Rows.length -1)
		if(this.get_LastView().dataView.Rows.length == 1)
			this.get_LastView().Row = 0;
		else 
			this.get_LastView().Row--;
	this.get_LastView().Notify(new EpiNotifyArgs(this, this.get_LastView().Row, this.LastView.Column, new EpiOverloadedArgs("Object_Int32_Int32")));
	this.ReportParmsView.Notify(new EpiNotifyArgs(this, this.ReportParmsView.Row, this.ReportParmsView.Column, new EpiOverloadedArgs("Object_Int32_Int32")));
}
EpiReportTransaction.prototype.FillStyles=function()
{
	var myDataRow = this.StyleList.NewRow();
	myDataRow["ReportStyleNum"] = 0;
	myDataRow["StyleDescription"] =  EpiString.GetString("plainText", "MessageStrings.html");
	this.StyleList.AddRow(myDataRow);
}
EpiReportTransaction.prototype.adapterGetTokenList=function(){}
EpiReportTransaction.prototype.GetTokenList=function(tokenDataType)
{
	var tokenList = "";
	try
	{
		tokenList = this.adapterGetTokenList(tokenDataType);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
	return tokenList;
}
EpiReportTransaction.prototype.GetRptArchiveList=function() 
{
    var archiveList = "";
	try
	{
		archiveList = this.adapterGetRptArchiveList();
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		archiveList = "";
	}
	return archiveList;
}

EpiReportTransaction.prototype.PreTransactionLoad=function(Sender) 
{
    this.sysAgentAdapter = Global.GetAdapter("SysAgentAdapter",Sender);
    Global.LoadProxyForAdapter(this.sysAgentAdapter,null,true);
    this.sysAgentAdapter.BOConnect();
	this.Schedules = new DataView(this.sysAgentAdapter.get_SysAgentSchedListData().get_SysAgentSchedList());
   ({_call:function(me){var _ret_=me.sysAgentAdapter.GetDefaultTaskAgentID(me.defaultAgentID);me.defaultAgentID=Global.ArgManager["Out1"];return _ret_;}})._call(this);
	
	this.sysAgentAdapter.getSchedules(this.defaultAgentID);
}

EpiReportTransaction.prototype.setTableKey=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "DataTable_String":
        this.setTableKey_0(a[0],a[1]);
        break;
        case "DataTable_DataColumnArr_ObjectArr":
        this.setTableKey_1(a[0],a[1],a[2]);
        break;
        case "DataTable_String_Object":
        this.setTableKey_2(a[0],a[1],a[2]);
        break;
    }
}

EpiReportTransaction.prototype.setTableKey_0=function(sourceTable, primaryKey)
{
    if (sourceTable.ColumnsContains(primaryKey))
    {
        var tableKey = sourceTable.get_Column(primaryKey);
        sourceTable.set_PrimaryKey([tableKey]);
        switch (tableKey.DataType)
        {
            case "System.String":
                tableKey.DefaultValue = "";
                break;
            case "System.Boolean":
                tableKey.DefaultValue = false;
                break;
            case "System.Decimal":
                tableKey.DefaultValue = 0;
                break;
            case "System.DateTime":
                tableKey.DefaultValue = DateTime.Now;
                break;
            case "System.Int32":
                tableKey.DefaultValue = 0;
                break;
            default:
                tableKey.DefaultValue = "";
                break;
            
        }
    
    }
    for(var searchCol in sourceTable.Columns)
	{
		//searchCol.AllowDBNull = true;
		if(sourceTable.GetExtendedProperty(searchCol,"ReadOnly") !="")
			if(searchCol == primaryKey)
				sourceTable.SetExtendedProperty(searchCol,"ReadOnly","False");
			else
				sourceTable.SetExtendedProperty(searchCol,"ReadOnly","True");
		else
			if(searchCol == primaryKey)
			 sourceTable.SetExtendedProperty(searchCol,"ReadOnly","False");
		else
			sourceTable.SetExtendedProperty(searchCol,"ReadOnly","True");
		
	}	
}

EpiReportTransaction.prototype.setTableKey_1=function(sourceTable, tableKeys, tableDefaultValue)
{
	sourceTable.PrimaryKey = tableKeys;
	var htTableKeys = new Hashtable();
	
	for(var icolumn in tableKeys)
	{
	    var col = tableKeys[icolumn];
		htTableKeys.Add(col.ColumnName.toUpperCase(),col.ColumnName); 
		sourceTable.Columns[col.ColumnName].DefaultValue = tableDefaultValue[icolumn];
	}
	for(var searchCol in sourceTable.Columns)
	{
		if(sourceTable.GetExtendedProperty(searchCol,"ReadOnly") != "")
			if(htTableKeys.Contains(searchCol.toUpperCase()))
				sourceTable.SetExtendedProperty(searchCol,"ReadOnly","False");
			else
				sourceTable.SetExtendedProperty(searchCol,"ReadOnly","True");
		else
			if(htTableKeys.Contains(searchCol.toUpperCase()))
			    sourceTable.SetExtendedProperty(searchCol,"ReadOnly","False");
		else
			sourceTable.SetExtendedProperty(searchCol,"ReadOnly","True");
		
	}	
}
EpiReportTransaction.prototype.setTableKey_2=function(sourceTable, primaryKey, keyDefaultValue)
{
	var tableKey = sourceTable.Columns[primaryKey];
	sourceTable.PrimaryKey = tableKey;
	sourceTable.Columns[primaryKey].DefaultValue = keyDefaultValue;
	for(var searchCol in sourceTable.Columns)
	{
		if(sourceTable.GetExtendedProperty(searchCol,"ReadOnly") != "")
			if(searchCol == primaryKey)
				sourceTable.SetExtendedProperty(searchCol,"ReadOnly","False");
			else
				sourceTable.SetExtendedProperty(searchCol,"ReadOnly","True");
		else
			if(searchCol == primaryKey)
			sourceTable.SetExtendedProperty(searchCol,"ReadOnly","False");
		else
			sourceTable.SetExtendedProperty(searchCol,"ReadOnly","True");
		
	}	
}

EpiReportTransaction.prototype.loadEpiDataView=function(currentView, viewName, currentTable, addRowChangeEvent)
{
    EpiTransaction.prototype.loadEpiDataView.call(this,currentView, viewName, currentTable, addRowChangeEvent);
    // handle event for ColumnChanged
    if (!this.hasEvent&&this.ReportParmsView.dataView.Table) {
        this.ReportParmsView.dataView.Table.get_Event("ColumnChanged").subscribe(this.columnChangedHandler, this, true);
        this.hasEvent = true;
    }
}

EpiReportTransaction.prototype.GetNewParameters=function(reportType)
{
    var _sucess = true;
    try
    {
	    _sucess = this.adapterGetNewParameters();
    	
	    this.ReportParmsView.dataView.Rows[0]["AutoAction"]= "Print";
	    this.ReportParmsView.dataView.Rows[0]["AgentSchedNum"]= 0;
	    this.ReportParmsView.dataView.Rows[0]["AgentID"]= this.defaultAgentID;

	    if(this.ReportParmsView.dataView.Table.ColumnsContains("DateFormat"))
	    {
		    this.ReportParmsView.dataView.Rows[0]["DateFormat"]= FormatEngine.CultureInfo.ShortDatePattern.toLowerCase();
	    }
	    if(this.ReportParmsView.dataView.Table.ColumnsContains("NumericFormat"))
	    {
		    var numberFormat = FormatEngine.CultureInfo.NumberGroupSeparator + FormatEngine.CultureInfo.NumberDecimalSeparator;
		    this.ReportParmsView.dataView.Rows[0]["NumericFormat"]= numberFormat;
	    }

	    this.NotifyAll(NotifyType.Initialize, this.ReportParmsView);

        // handle event for ColumnChanged
        if (!this.hasEvent) {
            this.ReportParmsView.dataView.Table.get_Event("ColumnChanged").subscribe(this.columnChangedHandler, this, true);
            this.hasEvent = true;
        }
        if (IsRunningSSRS(this.ReportParmsView.dataView.Rows[0]["ReportStyleNum"], this.StyleList))
            Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(true);           // SSRS    
        else
            Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(false);            // Not SSRS        

	}
	catch(e)
	{   
		ExceptionBox.Show(e);
        _sucess=false;
	}
	return _sucess;
}
 
EpiReportTransaction.prototype.columnChangedHandler = function(sender, e) {
    var colName = e.Column.ColumnName;
    var nValue = e.ProposedValue.toString();
    // TODO: fix this code to enable/disable the right tool.
    if (colName == "ReportStyleNum") {
        	if (Global.Form._assembly == "UIRpt.ProcessPayment")
		{			
			//If it is SSRS report
			if (IsRunningSSRS(this.ReportParmsView.dataView.Rows[0]["ReportStyleNum"], this.StyleList))
			{
		      		Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(true);            
            			Global.Form.baseToolbarsManager.Tools["PrintPreviewTool"].SetEnabled(false);    
			}
			else
			{
		      		Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(false);            
            			Global.Form.baseToolbarsManager.Tools["PrintPreviewTool"].SetEnabled(true);  
			}        
		}
		else
		{
        		if (IsRunningSSRS(nValue, this.StyleList))
            			Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(true);           // SSRS    
       			 else
            			Global.Form.baseToolbarsManager.Tools["PrintTool"].SetEnabled(false);            // Not SSRS
		}

    }
}
EpiReportTransaction.prototype.RunDirect=function(outputType)
{
	var _success = true;
	var schedID = 0;
	var taskID = 0;
	
	try
	{
		var row = this.ReportParmsView.dataView.get_Row(0);
		var isSSRS = IsRunningSSRS(row["ReportStyleNum"], this.StyleList);

   		if (!isSSRS) {
    		row["RptPrinterSettings"] = "";
    		row["RptPageSettings"] = "";
    	}

		schedID = System.Convert.ToInt32(row["AgentSchedNum"]);
		if (schedID == undefined) return false;
		taskID = System.Convert.ToInt32(row["AgentTaskNum"]);
		row["WorkstationID"] = "";//System.Environment.MachineName + " " + consoleSessionID;
		switch(outputType)
		{
		    case "Generate":
            	if (isSSRS)
                	row["AutoAction"] = "SSRSGenerate"; // SSSRS Reports 
            	else
                	row["AutoAction"] = "WPreview"; //For other Reports should always have this action in Win2Web

				if(this.SubmitToAgent(this.defaultAgentID,schedID,taskID))
					this.PushStatusText(EpiString.GetString("SubmitGenerate"));
				break;
				
		    case "GenerateDirect":
				row["AutoAction"] = "";

				_success = this.adapterRunDirect();
				break;

            case "Preview":
                if (isSSRS)
                    row["AutoAction"] = "SSRSPreview"; // SSSRS Reports 
                else
                    row["AutoAction"] = "WPreview"; //For other Reports should always have this action in Win2Web
				if(schedID == 0)
				{
					//adapterRunDirect();
					if(this.SubmitToAgent("SystemTaskAgent",0,0))
						this.PushStatusText(EpiString.GetString("SubmitPreview"));
				}
				else
				{
					if(this.SubmitToAgent(this.defaultAgentID,schedID,taskID))
						this.PushStatusText(EpiString.GetString("SubmitPreview"));
				}
//				NotifySystemMonitor();
				break;

            case "Print":
                var ssrsPrinteForm=new SSRSPrinterForm(this,new EpiOverloadedArgs("EpiTransaction"));
                
                if( ssrsPrinteForm.ShowDialog(new EpiOverloadedArgs("")) == System.Windows.Forms.DialogResult.OK)
                {        
		            row["PrinterName"] = ssrsPrinteForm.SSRSReturnObject.PrinterName;            		
		            row["RptPrinterSettings"] = ssrsPrinteForm.SSRSReturnObject.RptPrinterSettings;
		            row["RptPageSettings"] = ssrsPrinteForm.SSRSReturnObject.RptPageSettings;
            		
            		if (ssrsPrinteForm.SSRSReturnObject.EMailTo != "")
            		{
                        row["EMailTo"] = ssrsPrinteForm.SSRSReturnObject.EMailTo;
                        row["EMailCC"] = ssrsPrinteForm.SSRSReturnObject.EMailCC;
                        row["EMailBCC"] = ssrsPrinteForm.SSRSReturnObject.EMailBCC;
                        row["EMailBody"] = ssrsPrinteForm.SSRSReturnObject.EMailBody;
                        row["EMailBCC"] = ssrsPrinteForm.SSRSReturnObject.EMailBCC;
                        row["EMailBody"] = ssrsPrinteForm.SSRSReturnObject.EMailBody;
                        row["AttachmentType"] = ssrsPrinteForm.SSRSReturnObject.AttachmentType;
                    }
            		
            		if (ssrsPrinteForm.SSRSReturnObject.FaxNumber != "")
            		{
                        row["FaxTo"] = ssrsPrinteForm.SSRSReturnObject.FaxTo;
                        row["FaxNumber"] = ssrsPrinteForm.SSRSReturnObject.FaxNumber;
                        row["FaxSubject"] = ssrsPrinteForm.SSRSReturnObject.FaxSubject;
                        
                        if (row["EMailBody"] != "")
                            row["EMailBody"] = ssrsPrinteForm.SSRSReturnObject.FaxBody;
                    }                    
                }

                if (isSSRS)
                    row["AutoAction"] = "SSRSPrint"; // SSSRS Reports 
                else
                    return;

                if (schedID == 0) {
                    //adapterRunDirect();
                    if (this.SubmitToAgent("SystemTaskAgent", 0, 0))
                        this.PushStatusText(EpiString.GetString("SubmitPreview"));
                }
                else {
                    if (this.SubmitToAgent(this.defaultAgentID, schedID, taskID))
                        this.PushStatusText(EpiString.GetString("SubmitPreview"));
                }
                break;

            case "PreviewDirect":
                if (isSSRS)
                    row["AutoAction"] = "SSRSPreview"; // SSSRS Reports 
                else
                    row["AutoAction"] = "WPreview"; //For other Reports should always have this action in Win2Web
				_success = this.adapterRunDirect();
				
				break;
				
			case "Submit":
				var currentAction = "";
				currentAction = row["AutoAction"].toString();
				switch(currentAction)
				{
					case "Print":
						this.RunDirect("Print");
						break;
					case "Preview":
						this.RunDirect("Preview");
						break;
					default:
				        row["AutoAction"] = "WPreview";// Reports should always have this action in Win2Web
						this.adapterRunDirect();
						break;
				}
				break;
		}
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		_success = false;
	}
//	if(Cursor.Current != Cursors.Arrow)
//		Cursor.Current = Cursors.Arrow;
	return _success;
}
if(!(window.SSRSPrinterForm&&window.SSRSPrinterForm.prototype&&window.SSRSPrinterForm.Assm=="Lib.EpiReportLib"))
{
    window.SSRSPrinterForm=Epicor.Mfg.Lib.Report.SSRSPrinterForm=function()
    {
        LaunchEngineForm.call(this);
        for(var i=0;i<=arguments.length-1;i++){this.Args.push(arguments[i]);}
        this.Assembly="Lib.EpiReportLib";
        this.Name="SSRSPrinterForm";
        this._type="Epicor.Mfg.Lib.Report.SSRSPrinterForm";
        this.DialogProps=SSRSPrinterForm.DialogProps;
        this.DialogControls=SSRSPrinterForm.DialogControls;
        this.Variables=SSRSPrinterForm.Variables;
    }
    SSRSPrinterForm.Assm="Lib.EpiReportLib";
    SSRSPrinterForm.prototype = new LaunchEngineForm();
}
LaunchEngineForm.Concat(window.SSRSPrinterForm,[],{"SSRSReturnObject":null},[]);

EpiReportTransaction.prototype.SubmitToAgent=function(agentID, angetSchedNum, agentTaskNum)
{
	returnValue = true;
	try
	{
		this.adapterSubmitToAgent(agentID, angetSchedNum, agentTaskNum);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		returnValue = false;
	}
	return returnValue;
}
EpiReportTransaction.prototype.SaveProcessTask=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The EpiReportTransaction.SaveProcessTask function is not implemented.", new EpiOverloadedArgs("String_Details"));
    return false;
}
EpiReportTransaction.prototype.GetDefaults=function()
{
	var _success = false;
	try
	{
		_success = this.adapterGetDefaults();
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		_success = false;
	}
	return _success;
}

EpiReportTransaction.prototype.SaveDefaults=function()
{
	var _success = false;
	try
	{
		_success = this.adapterSaveDefaults();
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		_success = false;
	}
	return _success;
}
EpiReportTransaction.prototype.RemoveDefaults=function()
{
	var _success = false;
	try
	{
		_success = this.adapterRemoveDefaults();
	}
	catch(e)
	{
		ExceptionBox.Show(e);
		_success = false;
	}
	return _success;
}
EpiReportTransaction.prototype.GetNewRecord=function(viewName)
{
	var recordAdded = false;
	var myDataRow;
	var tempView;

	try
	{
		if(Global.BindingEngine.EpiDataViews[viewName])
		{
			recordAdded = true;
			tempView = Global.BindingEngine.EpiDataViews[viewName];
			myDataRow = tempView.dataView.Table.NewRow();
			tempView.dataView.Table.AddRow(myDataRow);
			tempView.Notify(new EpiNotifyArgs(this, tempView.dataView.Count - 1, NotifyType.AddRow,new EpiOverloadedArgs("Object_Int32_NotifyType")));
			this.ReportParmsView.Notify(new EpiNotifyArgs(this, this.ReportParmsView.Row, this.ReportParmsView.Column,new EpiOverloadedArgs("Object_Int32_Int32")));
		}
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}

	return recordAdded;
}	
EpiReportTransaction.prototype.GetParamsFromAgent=function(agentID,angetSchedNum,agentTaskNum)
{
	try
	{
		this.adapterGetParamsFromAgent(agentID, angetSchedNum, agentTaskNum);
		this.NotifyAll(NotifyType.Initialize, this.ReportParmsView);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	
	}
}
EpiReportTransaction.prototype.GetParamTaskDef=function(processID, processTask)
{
	try
	{
		this.GetNewParameters("");
		this.ReportParmsView.dataView.Rows[0]["ProcessID"]= processID;
		this.ReportParmsView.dataView.Rows[0]["ProcessTaskNum"]= processTask;
		this.adapterGetParamTaskDef();
		this.NotifyAll(NotifyType.Initialize, this.ReportParmsView);
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
}

EpiReportTransaction.prototype.GetBookCurrencyCode = function(bookID) {
    try {
        var boName = "lib_BOReader";
        if (!Global.LoadedProxies[boName]) {
            var proxyScript = Global.GetScript("script/Client" + boName + "ServiceProxies.js");
            eval(proxyScript);
            Global.window[boName + "Service"] = eval(boName + "Service");
            Global.LoadedProxies[boName] = boName;
        }
        var _boReader = new lib_BOReaderService();

        var dsBook = new DataSet();
        dsBook = _boReader.GetList("JSON", "", "GLBook", "BookID = '" + bookID + "'", "CurrencyCode");
        if (dsBook.TablesContains("ttGLBookList", new EpiOverloadedArgs("String")) && !String.IsNullOrEmpty(dsBook.get_Table("ttGLBookList").get_Row(0).get_Item(0))) {
            return dsBook.get_Table("ttGLBookList").get_Row(0).get_Item(0);

        }
        return "";

    }
    catch (e) {
        ExceptionBox.Show(e);
    }
}

function IsRunningSSRS(rptStyleNum, dsStyleList) {
    var isSSRS = false;
    for (ii = 0; ii < dsStyleList.Rows.length; ii++) {
        if (dsStyleList.Rows[ii].StyleNum == rptStyleNum) {
            isSSRS = dsStyleList.Rows[ii].RptTypeID == "SSRS" ? true : false;
            break;
        }
    }
    return isSSRS;
}


var EpiSingleViewTransaction = Epicor.Mfg.UI.FrameWork.EpiSingleViewTransaction = function(settings, type)
{
    if (!type) type = "EpiSingleViewTransaction";
    this.view = new EpiDataView();
    this.SearchResult;
    //{doProcessing:true}
    EpiTransaction.call(this,settings, type);
}
EpiSingleViewTransaction.prototype = new EpiTransaction();

EpiSingleViewTransaction.prototype.get_SearchResult=function() {return this.SearchResult}
EpiSingleViewTransaction.prototype.set_SearchResult=function(value) {this.SearchResult = value;}
EpiSingleViewTransaction.prototype.OnInvokeSearch=function(options)
{
    EpiViewUtils.OnInvokeSearch(this, this.view, this, false, options); 
}
EpiSingleViewTransaction.prototype.DisableKeyField=function() // Only SingleViewTransaction
{
    try
    {
        var pk = this.GetPrimaryKey();
        if (pk != "")
        {
            var keyField=this.view.ViewName + "." + pk;
    	    var disabled=RuleAction.AddControlSettings(this.view, keyField, SettingStyle.ReadOnly);
    	    var rr=new RowRule("RowMod", RuleCondition.NotEqual, "A", [disabled]);
    	    this.view.AddRowRule(rr);
	    }
    }
    catch(err){}	    
}
EpiSingleViewTransaction.prototype.OnUndo=function()
{
	var didUndo = EpiViewUtils.OnUndo(this, this.view);
	if (didUndo) this.FireDataChanged();
	return didUndo;
}

EpiSingleViewTransaction.prototype.OnGetNew=function()
{
	var didGetNew = EpiViewUtils.OnGetNew(this, this.view, this, true);
	if (didGetNew) this.FireDataChanged();
	return didGetNew;
}
EpiSingleViewTransaction.prototype.OnUpdate=function()
{
	var didUpdate = EpiViewUtils.OnUpdate(this, this.view, this, true);
	if (didUpdate)	this.FireDataChanged();
	return didUpdate;
}
EpiSingleViewTransaction.prototype.FireDataChanged=function()
{
    this.get_Event("DataChanged").fire(); 
}
EpiSingleViewTransaction.prototype.OnClearDataSets=function()
{
	var _success = true;
    _success = this.OnUndo();

	if (_success)
	{
		this.ClearDataSets();
		this.NotifyAll();
	}

	return _success;
}
EpiSingleViewTransaction.prototype.ClearDataSets=function(){} // This method is implemented in the apps code
EpiSingleViewTransaction.prototype.GetByID=function(){} // This method is implemented in the apps code

EpiSingleViewTransaction.prototype.OnGetByID=function(id)
{
    var _rowCount = this.view.dataView.Count;
    this.PushStatusText(EpiString.GetString("retrievingData"));
    var row = this.FindID(id);
    if(row < 0)
	{
		try
		{
			this.GetByID(id);
		}
		catch(e) // Epicor.Mfg.Common.BusinessObjectException
		{
			// TODO: Check something here to ensure the exception is caught only when GetById is missing
		   
			// This is the way Santiago suggested I determine whether a record was not found.
			// He said this exception is only thrown from GetByID when the record isn't found.
			return false;
		}

		this.view.Notify(new EpiNotifyArgs(this, this.view.dataView.Count-1, NotifyType.Initialize, new EpiOverloadedArgs("Object_Int32_NotifyType")));
		this.FireDataChanged();
	}
	else
		this.view.Notify(new EpiNotifyArgs(this, row, NotifyType.Initialize, new EpiOverloadedArgs("Object_Int32_NotifyType")));
    this.PopStatus();
    return true;
}
EpiSingleViewTransaction.prototype.FindID=function(id)
{
    var pk = this.GetPrimaryKey();
    if (pk != "")
    {
	    for(var i=0; i< this.view.dataView.Rows.length; i++)
	    {
		    var rowId=view.dataView.Rows[i][pk];

		    if(id.toLowerCase() == rowId.toLowerCase())
			    return i;
	    }
	}
	return -1;
}

EpiSingleViewTransaction.prototype.GetPrimaryKey=function()
{
    var COMPANY_COLUMN_NAME="company";
    var errorMsg="An exception was thrown from EpiSingleViewTransaction.PrimaryKey. This class expects tables to have a single primary key (not including the company code).";
    var kc=this.view.dataView.Table.PrimaryKey;
    if(kc.length!=1 && kc.length!=2)
	{    
	    MessageBox.Show(errorMsg, new EpiOverloadedArgs("String"));
	    return "";
    }
    for(var i=0; i<kc.length; ++i)
    {
	    var columnName=kc[i];

	    if(columnName.toLowerCase() != COMPANY_COLUMN_NAME)
		    return columnName;
    }

    MessageBox.Show(errorMsg, new EpiOverloadedArgs("String"));
	return "";
}

EpiSingleViewTransaction.prototype.OnValidateKeyField=function(tb)
{
    var success = true;
    var ctrlStruct;
    if(tb instanceof EpiTextBox)
    {
        ctrlStruct = tb;
        tb = Global.document.getElementById(ctrlStruct.ID);
    }
    else
    {
        ctrlStruct = Global.BindingEngine.Controls[tb.id];
    }    
        
	var newId= ctrlStruct.GetValue(tb);
	var originalId = "";

	if(this.view.dataView.Count>0)
	{
		originalId=this.view.dataView.Rows[this.view.Row][this.GetPrimaryKey()];
	}
	if (originalId == newId) return true;
	if (EpiViewUtils.isNewRow(this.view)) return true;
	if (!this.OnUpdate()) 
	{
		ctrlStruct.SetValue(tb, originalId);
		return false;
	}

    if(!EpiViewUtils.isNewRow(this.view) && !this.OnGetByID(newId))
	{
		this.SetCurrentEvent(TransactionEvent.AddNewOnPrimaryKey);
		if(this.OnGetNew())
		{
			ctrlStruct.SetValue(tb, newId);
		} 
		else 	
		{
			success = false;
			ctrlStruct.SetValue(tb,originalId);
			EpiViewUtils.undoChanges(this, this.view);
		}			
	}
	return success;
}
EpiSingleViewTransaction.prototype.OnDelete=function()
{
    if (EpiViewUtils.OnDelete(this, this.view, this, true))
	    this.FireDataChanged();
}

EpiSingleViewTransaction.prototype.OnRefresh=function()
{
	try
	{
		if(this.view.HasRow && this.view.dataView.get_Row(this.view.Row)["RowMod"] != "A")
		{
			this.SetCurrentEvent(TransactionEvent.UndoOnRefreshButton);
			if(this.OnUndo())
				EpiViewUtils.OnRefresh(this, this.view, this, this.GetPrimaryKey());
			this.SetCurrentEvent(TransactionEvent.None);
		}
	}
	catch(e)
	{
		ExceptionBox.Show(e);
	}
}

var EpiMultiViewTransaction = Epicor.Mfg.UI.FrameWork.EpiMultiViewTransaction = function(settings,type)
{
    if (!type) type = "EpiMultiViewTransaction";
    this.mainDataView = null;
    EpiTransaction.call(this,settings,type);
}
EpiMultiViewTransaction.prototype = new EpiTransaction();
EpiMultiViewTransaction.prototype.get_MainDataView = function() { return this.mainDataView; }
EpiMultiViewTransaction.prototype.set_MainDataView = function(value) { this.mainDataView = value; }

EpiMultiViewTransaction.prototype.InvokeSearch=function(opts)
{
    this.didLastSearch = false;
	if (!this.Update()) { return; }
	opts.DataSetMode = DataSetMode.RowsDataSet;
	this.PushStatusText(EpiString.GetString("retrievingData"), true);
	this.adapterInvokeSearch(opts);
	if(this.SearchResult == DialogResult.OK)
	{
	    this.NotifyAll(NotifyType.Initialize, this.mainDataView);
		this.OnDataChanged();
	}
	this.PopStatus();
    this.didLastSearch = true;
}
EpiMultiViewTransaction.prototype.Update=function()
{
    var updateStatus = false;
    
    if(!this.mainDataView.dataView.Table.DataSet.HasChanges()) return true;
    if(!this.ConfirmUpdate(false)) return false;
    
    if(this.DialogReject)
    {
        this.undoChanges();
        return true;
    }
    this.PushStatusText(EpiString.GetString("savingData"), true);
    
    try
    {
        updateStatus = this.adapterUpdate();
        this.OnDataChanged();        
    }
    catch(e)
    {
		ExceptionBox.Show(e, "Update Error");
		updateStatus = false;
		this.PopStatus();
    }
    return updateStatus;
}
EpiMultiViewTransaction.prototype.undoChanges=function()
{
    this.mainDataView.dataView.Table.DataSet.RejectChanges();
	if(this.get_LastView().Row > (this.get_LastView().dataView.Count - 1))
		this.get_LastView().Row--;  // changing the row number will cause a notify to be fired
	else
		this.get_LastView().Notify(new EpiNotifyArgs(this, this.get_LastView().Row, this.get_LastView().Column, new EpiOverloadedArgs("Object_Int32_Int32")));
	this.OnDataChanged();
}
EpiMultiViewTransaction.prototype.adapterUpdate=function(){}
EpiMultiViewTransaction.prototype.adapterInvokeSearch=function(opts){}
EpiMultiViewTransaction.prototype.adapterGetByID=function(){}
EpiMultiViewTransaction.prototype.adapterGetNew=function(){}
EpiMultiViewTransaction.prototype.adapterClearDataSets=function(){}
EpiMultiViewTransaction.prototype.get_KeyField=function()
{
	if(this.mainDataView.dataView.Rows.length > 0)
		return this.mainDataView.dataView.get_Row(this.mainDataView.Row)[this.get_KeyFieldName()].toString();
	else
		return "";
}   
EpiMultiViewTransaction.prototype.Undo=function()
{
	if (!this.ConfirmUndo(false)) { return false; }		
    this.undoChanges();						
	return true;
}
EpiMultiViewTransaction.prototype.ClearDataSets=function()
{
   this.didLastClear = false;
	if(EpiMultiViewTransaction.prototype.Undo.call(this))
	{
		this.adapterClearDataSets();
		this.NotifyAll();
		this.didLastClear = true;
	}
}
EpiMultiViewTransaction.prototype.Refresh=function()
{
    this.didLastRefresh = false;
    if(this.mainDataView.HasRow && this.mainDataView.dataView.get_Row(this.mainDataView.Row)["RowMod"].toString() != "A")
    {
	    this.SetCurrentEvent(TransactionEvent.UndoOnRefreshButton);
	    try
	    {
		    if(this.Undo())
		    {
			    this.PushStatusText(EpiString.GetString("retrievingData"), true);
				this.adapterGetByID(this.mainDataView.dataView.get_Row(this.mainDataView.Row)[this.get_KeyFieldName()].toString(), new EpiOverloadedArgs("String"));
				this.NotifyAll();
                this.didLastRefresh = true;
			    this.PopStatus();
		    }
	    }
	    catch(e) 
	    { 
		    ExceptionBox.Show(e); 
	    }
	    this.SetCurrentEvent(TransactionEvent.None);
    }
}

EpiMultiViewTransaction.prototype.Delete=function()
{
    this.didLastDelete = false; 
    if (!this.get_LastView()) return;
	if (this.get_LastView().dataView.Count <=0) return;	
	var pk = this.get_LastView().dataView.Table.PrimaryKey;
	var _keys = [pk.length];
	var _index = 0;
	for(var i=0,dc; dc=pk[i];i++)
	{
		_keys[_index] = this.get_LastView().dataView.get_Row(this.get_LastView().Row)[dc];
		_index++;
	}
	var dr = this.mainDataView.dataView.Table.DataSet.Tables[this.get_LastView().dataView.Table.TableName].Find(_keys);

	if(dr!=null)
	{
		if(dr.get_RowState()==DataRowState.Added)	
		{							
			this.SetCurrentEvent(TransactionEvent.DeleteOnDeleteAddNew); 
			if (this.ConfirmDelete(false)) 			
			{						
				this.undoChanges();
                this.didLastDelete = true; 
                return;					
			}						
		} 
		else 
		{						
			this.SetCurrentEvent(TransactionEvent.DeleteOnDeleteButton);
			if (!this.ConfirmDelete(false)) return;		
			this.PushStatusText("Deleting from " + dr.get_Table().TableName + "...", true);
			try
			{
				this.adapterDelete(dr);
				if((this.get_LastView().dataView.Count - 1) < this.get_LastView().Row)
					this.get_LastView().Row--;
				this.NotifyAll();
				this.OnDataChanged();
			}
			catch(e)
			{
				ExceptionBox.Show(e, "Delete Error");
			}
			finally
			{
				this.PopStatus();
			}
		}
	}
    this.didLastDelete = true; 
}
EpiMultiViewTransaction.prototype.GetNew=function()
{
    var recordAdded = false;
	if (this.isNewRow(this.mainDataView)) { return true; }
	if (!this.Update()) { return false; }			
	if (!this.ConfirmAddNew(false)) { return false; }		
	this.PushStatusText(EpiString.GetString("getNew"), true);
	try
	{
		recordAdded = this.adapterGetNew();
        this.OnDataChanged();
	}
	catch(e)
	{
		ExceptionBox.Show(e, "Get New Error");
	}
	this.mainDataView.Notify(new EpiNotifyArgs(this, this.mainDataView.dataView.Rows.length - 1, NotifyType.AddRow, new EpiOverloadedArgs("Object_Int32_NotifyType")));
	this.PopStatus();
	return recordAdded; 
}
EpiMultiViewTransaction.prototype.GetByID=function(ID)
{
	var _success = true;
	this.PushStatusText(EpiString.GetString("retrievingData"), true);
	try
	{
        var _row = this.FindID(ID);
		if(_row < 0)
		{
            this.adapterGetByID(ID,new EpiOverloadedArgs("String"));
            this.mainDataView.Notify(new EpiNotifyArgs(this, this.mainDataView.dataView.Rows.length-1, NotifyType.Initialize, new EpiOverloadedArgs("Object_Int32_NotifyType")));
            this.OnDataChanged();
		}
		else
            this.mainDataView.Notify(new EpiNotifyArgs(this, _row, NotifyType.Initialize, new EpiOverloadedArgs("Object_Int32_NotifyType")));
	}
	catch (ex)
	{
		_success = false;
	}
	this.PopStatus();
	return _success;
}
EpiMultiViewTransaction.prototype.FindID=function(ID)
{
	var _indexPos = -1;
	var _index = 0;

	for(var drIndex=0; drIndex < this.mainDataView.dataView.Rows.length; ++drIndex)
	{
		if(this.mainDataView.dataView.get_Row(drIndex)[this.get_KeyFieldName()].toString().toUpperCase()==ID.toUpperCase())
		{
			_indexPos = _index;
			break;
		}
		_index++;
	}
	return _indexPos;
}
EpiMultiViewTransaction.prototype.ValidateKeyField=function(tb)
{
    var _success = true;
    if(this.get_KeyField() == tb.get_Text()) { return true; }
	if(this.isNewRow(this.mainDataView)) return true;

    var newCode = tb.get_Text();
	if (!this.Update()) 
	{
		tb.set_Text(this.get_KeyField());
		return false; 
	}

	tb.set_Text(newCode);
	if(!this.isNewRow(this.mainDataView) && !this.GetByID(newCode))
	{
        this.SetCurrentEvent(TransactionEvent.AddNewOnPrimaryKey);
		if (this.GetNew())
		{
			tb.set_Text(newCode);
		} 
		else 
		{ 
			_success = false;
			tb.set_Text(this.get_KeyField());
			this.undoChanges();
		}
	}
	return _success;
}
EpiMultiViewTransaction.prototype.isNewRow=function(currentView)
{
	if ((currentView.dataView.Rows.length == 0) || (currentView.Row < 0)){ return false; }
	return (currentView.dataView.get_Row(currentView.Row).get_RowState() == DataRowState.Added);
}	

var TransactionCallBackArgs = Epicor.Mfg.UI.FrameWork.TransactionCallBackArgs = function(currentEvent, Token, customArgs)
{
    this.TransactionEvent = currentEvent;
    this.CallBackToken = Token;
    if(customArgs)
        this.CustomArgs = customArgs;
    else
        this.CustomArgs = new Hashtable();
}

var AppControlEvent = Epicor.Mfg.UI.FrameWork.UIApp.AppControlEvent={"Clear":0,"Delete":1,"GetNew":2,"Open":3,"Refresh":4,"Save":5,"Search":6,"Undo":7,"GetByID":8,"CustomAction":9};
var AppController = Epicor.Mfg.UI.FrameWork.AppController = function(settings, args)
{
    EpiMultiViewTransaction.call(this,settings, "AppController");
    this._clearedOfData = true;
}
AppController.prototype = new EpiMultiViewTransaction();

AppController.prototype.handleControllerEvent=function(handler,AppEvent)
{
    var _success = false;
    try
    {
        // fire the before event
        if (!this.OnBeforeAppEvent(AppEvent)) return false;
        var baqView = this.getCurrentBAQView(AppEvent == AppControlEvent.Refresh || AppEvent == AppControlEvent.RefreshAll);
        
        // handle the delegate using the BAQ DataView -- or use the delegate
        if (baqView)
            _success = baqView.HandleAppControlEvent(this, AppEvent);
        if (!baqView || !baqView.DidHandleAppEvent)
            _success = handler.apply(this);
        // fire the after event
        this.OnAfterAppEvent(AppEvent);
    }
    catch (ex)
    {
        //TraceProvider.TraceCatchException(ex);
    }
    if (AppEvent == AppControlEvent.Refresh)this._clearedOfData = false;
    return _success;
}
AppController.prototype.getCurrentBAQView=function(isRefresh)
{
    if (isRefresh && !String.IsNullOrEmpty(this.LastAppControlViewName))
    {
        var baqVu = this.Factory(this.LastAppControlViewName);
        if (baqVu != null) return baqVu;
    }
    var baqView = this.get_MainDataView();
    if (!String.IsNullOrEmpty(this.LastAppControlViewName))
    {
        var edv = this.Factory(this.LastAppControlViewName);
        if (baqView == null || (edv.ViewName != baqView.ViewName && (!isRefresh || !edv.HasParent)))
        {
            // try to reconcile active BAQ view
            baqView = this.Factory(this.LastAppControlViewName);
            if (baqView != null && baqView instanceof FilteredBAQDataView && !String.IsNullOrEmpty(baqView.ParentBAQName))
                baqView = this.Factory(baqView.ParentBAQName);
        }
    }
    return baqView;
}
AppController.getUpdatableParent=function(control)
{
    if (control == null) return null;
    var ctrl = Global.document.getElementById(control.ID);
    if (!ctrl) return null;
    
    var oCurrentNode=ctrl.parentNode;
    var oCurrentObj;
	
	if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];		    
    	
    while(oCurrentNode && !(Global.InstanceOf(oCurrentObj,"IUpdatableAppPanel")))
    {
	    oCurrentNode = oCurrentNode.parentNode;
	    if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];
    }
    return oCurrentObj;
}

AppController.prototype.OnLastControlChanged=function()
{
    if (!this.LastUpdatePanel)
    {
        this.LastUpdatePanel = AppController.getUpdatableParent(this.lastControl);
    }
    if (this.LastUpdatePanel && this.LastUpdatePanel.ViewButtons && Global.Form.AppControlPanel)
         Global.Form.AppControlPanel.SetActionsMenu(this.LastUpdatePanel.ViewButtons);
}
AppController.prototype.OnBeforeAppEvent=function(AppEvent)
{
    if (this.get_Event("BeforeAppControllerEvent").subscribers.length == 0) return true; // make sure there are registrars
    this.get_Event("BeforeAppControllerEvent").fire(this, {"AppControlEvent":AppEvent,"Cancel":false});
    return !args.Cancel; // return false when consumer cancels
}
AppController.prototype.OnAfterAppEvent=function(AppEvent)
{
    // fire the event when there are registrars
    if (this.get_Event("AfterAppControllerEvent").subscribers.length > 0)
        this.get_Event("AfterAppControllerEvent").fire(this, {"AppControlEvent":AppEvent,"Cancel":false});
}

AppController.prototype.OnClear=function()
{
    // return response from handler
   var ret =  this.handleControllerEvent(this.ClearDataSets, AppControlEvent.Clear);
   if (ret) this._clearedOfData = true;
   return ret;
}
AppController.prototype.OnDelete=function()
{
    // return response from handler
    return this.handleControllerEvent(this.Delete, AppControlEvent.Delete);
}
AppController.prototype.OnGetNew=function(NewText)
{
    // set local member
    this.LastGetNewText = NewText;
    // return response from handler
    return this.HandleAdapterGetNew();
    //return this.handleControllerEvent(this.GetNew, AppControlEvent.GetNew);
}
AppController.prototype.OnRefresh=function()
{
    // return response from handler
    return this.handleControllerEvent(this.Refresh, AppControlEvent.Refresh);
}
AppController.prototype.OnSave=function()
{
    // return response from handler
    return this.handleControllerEvent(this.Update, AppControlEvent.Save);
}
AppController.prototype.OnSearch=function(opts)
{
    // set local member
    this.LastSearchOptions = opts;
    // return response from handler
    return this.handleControllerEvent(this.InvokeSearch, AppControlEvent.Search);
}
AppController.prototype.OnUndo=function()
{
    // return response from handler
    return this.handleControllerEvent(this.Undo, AppControlEvent.Undo);
}
AppController.prototype.HandleCustomAction=function(ActionId)
{
    // set the local member
    this.LastActionID = ActionId;
    var baqView = this.getCurrentBAQView(true);
    if (baqView != null)
        return baqView.HandleAppControlEvent(this, AppControlEvent.CustomAction);
    return true;
}
AppController.prototype.InvokeSearch=function()
{
    // invoke base handler with local member
    EpiMultiViewTransaction.prototype.InvokeSearch.call(this, this.LastSearchOptions);
    return this.didLastSearch;
}
AppController.prototype.ClearDataSets=function()
{
    // invoke base handler
    EpiMultiViewTransaction.prototype.ClearDataSets.call(this);
    return this.didLastClear;
}
AppController.prototype.Refresh=function()
{
    // invoke base handler
    EpiMultiViewTransaction.prototype.Refresh.call(this);
    return this.didLastRefresh;
}
AppController.prototype.Delete=function()
{
    // invoke base handler
    EpiMultiViewTransaction.prototype.Delete.call(this);
    return this.didLastDelete;
}
AppController.prototype.get_MultiDirtyRow=function(){return this.MultiDirtyRow;}
AppController.prototype.set_MultiDirtyRow=function(val){this.MultiDirtyRow=val;}
AppController.prototype.adapterGetNew=function(){return this.HandleAdapterGetNew();}
AppController.prototype.HandleAdapterGetNew=function(){return true;}
AppController.prototype.adapterInvokeSearch=function(searchOptions){this.HandleAdapterInvokeSearch(o);}
AppController.prototype.HandleAdapterInvokeSearch=function(srchOptions) { }
AppController.prototype.adapterGetByID=function(id){return this.HandleAdapterGetByID(id);}
AppController.prototype.HandleAdapterGetByID=function(id){return true;}
AppController.prototype.adapterGetRows=function(srchOptions, morePages)
{
    // Need to test this out. I think Global.ArgManager will have the value for morePages.
    this.HandleAdapterGetRows(srchOptions, morePages);
}
AppController.prototype.HandleAdapterGetRows=function(srchOptions,morePages) { }
AppController.prototype.adapterUpdate=function() {return this.HandleAdapterUpdate();}
AppController.prototype.HandleAdapterUpdate=function() {return true;}
AppController.prototype.adapterDelete=function(dr){ return this.HandleAdapterDelete(dr);}
AppController.prototype.HandleAdapterDelete=function(dr){return true;}
AppController.prototype.adapterClearDataSets=function(){this.HandleAdapterClearData();}
AppController.prototype.HandleAdapterClearData=function() { }
AppController.prototype.SetBaqRefreshStatus=function()
{
    // init the collections
    if (this._topLevelViews == null) this._topLevelViews = new ArrayList();
    if (this._secondLevelViews == null) this._secondLevelViews = new ArrayList();
    // enum all EpiDataViews
    var GBE = Global.BindingEngine.EpiDataViews;
    for (var dict in GBE)
    {
        var baqView = GBE[dict];
        // only act on BAQ DataView
        if (baqView instanceof BAQDataView)
        {
           // baqView.InitEnterpriseServers(); // TODO
            // check the refresh status 
            var result = baqView.checkRefreshStatus();
            var hasSubscriber = result.hasSubscriber;
            var hasFilteredView = result.hasFilteredViews;
            
            // no subscriber, no filtered view is top level view
            if (!hasSubscriber && !hasFilteredView) this._topLevelViews.Add(baqView);
            // no subscriber, but has filtered view is second level view
            if (!hasSubscriber && hasFilteredView) this._secondLevelViews.Add(baqView);
        }
    }
    // now lets handle the Auto Refresh on Load bit
    
    for(var b in this._topLevelViews.items)
    {
        var baqView = this._topLevelViews.items[b];
        if (baqView.AutoRefreshOnLoad) this.handleBaqRefresh(baqView);
    }
}

AppController.prototype.baqView_EpiRowChanging=function(args)
{
    var baqView = args.CurrentView;
    if (baqView == null) return;
    if (args.CurrentRow != -1 && args.CurrentRow <= args.CurrentView.dataView.Count - 1)
    {
        var row = args.CurrentView.dataView.get_Row(args.CurrentRow);
        // handle the Update on Row Changed when we dont allow multi dirty row
        if (row.get_Table().DataSet.HasChanges())
        {
            this.SetCurrentEvent(TransactionEvent.UpdateOnRowChange);
            if (!baqView.HandleAppControlEvent(this, AppControlEvent.Save)) throw new UIException("");
        }
    }
}
AppController.prototype.handleBaqRefresh=function(lastBaqView)
{
    var _success = true;
    if (!this._clearedOfData)
    {
        // if there is data, then only refresh last active view
        _success = lastBaqView.HandleAppControlEvent(this, AppControlEvent.Refresh);
    }
    else
    {
        // first refresh the BAQ views that dont subscribe and have no filtered views
        for (var baqView in this._topLevelViews.items)
            this._topLevelViews.items[baqView].HandleAppControlEvent(this, AppControlEvent.Refresh);
        for (var baqView in this._secondLevelViews.items)
           this._secondLevelViews.items[baqView].HandleAppControlEvent(this, AppControlEvent.Refresh);
    }
    this._clearedOfData = false;
    return _success;
}

AppController.prototype.GetCurrentPublishedValue=function(PublisherName)
{
    try
    {
        var assy = Global.Assemblies[Global.Form._assembly];
        if (assy == null) return null;
        // get collection of Custom Assembly Attributes
        var attrs = assy.GetCustomAttributes();
        for(var i=0,Att;Att=attrs[i];i++)
        {
            // cast attribute and add to collection
            if (Att != null && Att.DashboardPublisherName == PublisherName)
            {
                var thePubId = Att.PublisherID;
                // use the publisher ID to find the publisher and get last pub value
                var pubs = Global.BroadcastClient.BroadcastTower.Publishers;
                for (var de in pubs.items)
                {
                    var pub = pubs.get_Item(de);
                    if (pub != null && pub.PublishName == thePubId && !String.IsNullOrEmpty(pub.GetLastPublishedValue()))
                        return pub.GetLastPublishedValue();
                }
             }
        }
    }
    catch (ex)
    {
        //TraceProvider.TraceException(ex);
        DebugHelper.WriteError(null, ex);
    }
    return null;
}
AppController.prototype.HandleBaqUpdate=function()
{
    var baqView = this.getCurrentBAQView(false);
    if (baqView != null)
        return baqView.HandleAppControlEvent(this, AppControlEvent.Save);
    return true;
}
AppController.prototype.HandleBaqGetNew=function()
{
    // use the last GetNewView name to find the correct BAQ
    var baqView = null;
    var GBE = Global.BindingEngine.EpiDataViews;
    var tbaq;
    for (var dict in GBE)
    {
        tbaq = GBE[dict];
        if (tbaq != null && tbaq._updateOptions!=null &&
            tbaq._updateOptions.AllowAddNew && tbaq.AddText == this.LastGetNewText)
        {
            baqView = tbaq;
            break;
        }
    }
    // ok thenno view found by name, we try to find current active view.
    if (baqView == null) baqView = this.getCurrentBAQView(false);
    if (baqView != null && baqView.AddEnabled)
    {
        if (baqView.dataView.Count > 0 && baqView.dataView.Table.DataSet.HasChanges() &&
            baqView._updateOptions != null && !baqView._updateOptions.MultiDirtyRow)
            if (!baqView.HandleAppControlEvent(this, AppControlEvent.Save)) return false;
        return baqView.HandleAppControlEvent(this, AppControlEvent.GetNew);
    }
    return true;
}
var BAQParamTransaction = Epicor.Mfg.UI.FrameWork.UIApp.BAQParamTransaction=function(sender,settings)
{
    EpiTransaction.call(this,settings,"BAQParamTransaction");
}
BAQParamTransaction.prototype = new EpiTransaction();
BAQParamTransaction.prototype.FillParameters=function(executionDS, QueryDesignDataSet)
{
    if (QueryDesignDataSet.QueryParameter.Rows.length <= 0) return true;
    // convert the parameters from QueryDesignDataSet to BAQDesignerDataSet
    var designData = this.getBAQDesignData(QueryDesignDataSet);
    // build up and add the EpiDataViews
    var queryCtrlView = new EpiDataView();
    var queryCtrlValuesView = new EpiDataView();
    var paramView = new EpiDataView();
    queryCtrlView.set_dataView(new DataView(designData.QueryCtrlDesigner));
    queryCtrlView.dataView.set_Sort("DataSource");
    queryCtrlValuesView.set_dataView(new DataView(designData.QueryCtrlValuesDesigner));
    paramView.set_dataView(new DataView(designData.QueryParameterDesigner));
    this.Add("Ctrl", queryCtrlView);
    this.Add("CtrlValues", queryCtrlValuesView);
    this.Add("Param", paramView);
   
    return this.showParamDialog(this,executionDS.ExecutionParameter);
}

BAQParamTransaction.prototype.showParamDialog=function(formTrans, substTable)
{
    //if (!BAQParamTransaction.DoneLoad) // TODO: second time this method is called, the TestParamTransaction is undefined.
    {
        var transScript = Global.GetScript('script/UI.TestParam/Lib.FormBuilderLib.js');
        if (transScript != '') eval(transScript);
        transScript = Global.GetScript('script/UI.TestParam/Lib.Custom.DiagramQueryLib.js');
        if (transScript != '') eval(transScript);
        BAQParamTransaction.DoneLoad = true;
    }
   
    try
    {
        return TestParamTransaction.ShowDialog(formTrans, substTable);
    }
    catch(err)
    {
        return false;
    }
}

BAQParamTransaction.prototype.getBAQDesignData=function(QueryDesignDataSet)
{
    // create and suspend constraints
    if (!Global.LoadedAdapters["BAQDesignerAdapter"]) Global.GetAdapter("BAQDesignerAdapter",Global.Form);
    var designData = new Epicor.Mfg.BO.BAQDesignerDataSet();
    designData.EnforceConstraints = false;
    // convert the QueryCtrl rows to QueryCtrlDesigner
    var ctrlDesignRow,col;
    var tbl = QueryDesignDataSet.QueryCtrl;
    var newTbl = designData.QueryCtrlDesigner;
    for(var ctrlRow in tbl.Rows)
    {
        ctrlRow = tbl.Rows[ctrlRow];
        ctrlDesignRow = newTbl.NewRow();
        for (var col in tbl.Columns)
        {
            col = tbl.get_Column(col);
            if (newTbl.Columns[col.ColumnName])
                ctrlDesignRow.set_Item(col.ColumnName, ctrlRow[col.ColumnName]);
        }
        newTbl.AddRow(ctrlDesignRow);
    }
    
    // convert the QueryCtrlValues rows to QueryCtrlValuesDesigner
    var cValDesignRow,col;
    tbl = QueryDesignDataSet.QueryCtrlValues;
    newTbl = designData.QueryCtrlValuesDesigner;
    for(var cValRow in tbl.Rows)
    {
        cValRow = tbl.Rows[cValRow];
        cValDesignRow =newTbl.NewRow();
        for (var col in tbl.Columns)
        {
            col = tbl.get_Column(col);
            if (newTbl.Columns[col.ColumnName])
                cValDesignRow.set_Item(col.ColumnName,cValRow[col.ColumnName]);
        }
        newTbl.AddRow(cValDesignRow);
    }
    // convert the QueryParameter rows to QueryParameterDesigner
    var paramDesignRow, col;
    tbl = QueryDesignDataSet.QueryParameter;
    newTbl = designData.QueryParameterDesigner;
    for(var paramRow in tbl.Rows)
    {
        paramRow = tbl.Rows[paramRow];
        var paramDesignRow = newTbl.NewRow();
        for(var col in tbl.Columns)
        {
            col = tbl.get_Column(col);
            if (newTbl.Columns[col.ColumnName])
                paramDesignRow.set_Item(col.ColumnName,paramRow[col.ColumnName]);
        }
        newTbl.AddRow(paramDesignRow);
    }
    return designData;
}
var BitState=Epicor.Mfg.UI.FrameWork.BitState={"Unknown":0,"NoRow":1,"NewRow":2,"NotSet":3,"Set":4};

var BitFlagViewWatcher=Epicor.Mfg.UI.FrameWork.BitFlagViewWatcher=function(form,columnName,bitToWatch)
{
    if(!form) return;

    EpiObject.call(this, "BitFlagViewWatcher");
    this.Form=form;

    this.Transaction=form.trans;
    this.ColumnName=columnName;
    this.BitToWatch=bitToWatch;
    this.CurrentView=null;
    this.AllowButtonEnabled=true;
    this.hasBeenInitialized=false;
    this.viewsBeingWatched=new ArrayList();
    this.aliasViews=new Hashtable();
    
    if(this.Transaction) this.Transaction.get_Event("EpiViewChanged").subscribe(this.EpiViewChangedHandler,this,true);
    this.Form.get_Event("Shown").subscribe(this.Form_Shown,this,true);
}
BitFlagViewWatcher.prototype = new EpiObject();
BitFlagViewWatcher.prototype.get_Transaction=function()
{
    return this.Transaction;
}
BitFlagViewWatcher.prototype.get_Form=function()
{
    return this.Form;
}
BitFlagViewWatcher.prototype.get_CurrentView=function()
{
    return this.CurrentView;
}
BitFlagViewWatcher.prototype.set_AllowButtonEnabled=function(value)
{
    this.AllowButtonEnabled=value;
}
BitFlagViewWatcher.prototype.Form_Shown=function()
{
    if (!this.hasBeenInitialized)
    {
        this.Initialize();
        this.hasBeenInitialized = true;
    }
}
BitFlagViewWatcher.prototype.Initialize=function()
{
    this.hasBeenInitialized = true;
}
BitFlagViewWatcher.prototype.ViewHasFlagColumnColumn=function(view)
{
    if ((view.dataView)
        && (view.dataView.Table))
    {
        var flagColumn = view.dataView.Table.get_Column(this.ColumnName);
        return (flagColumn) && (flagColumn.DataType == "System.Int32");
    }

    return false;
}
BitFlagViewWatcher.prototype.EpiViewChangedHandler=function(args)
{
    if (this.viewsBeingWatched.Count == 1)
    {
        if (this.CurrentView != null)
        {
            return;
        }
    }

    this.CurrentView = this.FindViewToUse(args.CurrentView);
    if (this.CurrentView == null)
    {
        this.set_CurrentValue(this.DetermineBitState(null, -1, new EpiOverloadedArgs("EpiDataView_Int32")));
    }
    else if (this.ShouldUpdateCurrentValueUsingView(this.CurrentView))
    {
        this.set_CurrentValue(this.DetermineBitState(this.CurrentView, this.CurrentView.Row, new EpiOverloadedArgs("EpiDataView_Int32")));
    }
}
BitFlagViewWatcher.prototype.ShouldUpdateCurrentValueUsingView=function(view)
{
    return (view != null) && this.CurrentView==view;
}
BitFlagViewWatcher.prototype.DetermineBitState=function(view,rowIndex)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    switch(overload)
    {
        case "DataRow":
            return Global.CallWithArgs(this,"DetermineBitState_1",arguments);break;
        case "EpiDataView_Int32":
            return Global.CallWithArgs(this,"DetermineBitState_2",arguments);break;
    }
}
BitFlagViewWatcher.prototype.DetermineBitState_1=function(row)
{
    var column = row.Table.get_Column(this.ColumnName);
    if ((column == null) || (column.DataType != "System.Int32"))
    {
        return BitState.Unknown;
    }
    else if (row.IsNull(column))
    {
        return BitState.Unknown;
    }
    else
    {
        var bitMask = 1 << this.BitToWatch;
        var columnValue = Convert.ToInt32(row[this.ColumnName]);

        if ((columnValue & bitMask) == bitMask)
        {
            return BitState.Set;
        }
        else
        {
            return BitState.NotSet;
        }
    }
}
BitFlagViewWatcher.prototype.DetermineBitState_2=function(view,rowIndex)
{
    if (view == null)
    {
        return BitState.Unknown;
    }

    if ((rowIndex < 0) || (rowIndex >= view.dataView.Rows.length))
    {
        return BitState.NoRow;
    }

    var row = view.dataView.get_Row(rowIndex);
    switch (row.get_RowState())
    {
        case DataRowState.Added:
            return BitState.NewRow;
        case DataRowState.Deleted:
        case DataRowState.Detached:
            return BitState.NoRow;
        default:
            var column = row.get_Table().get_Column(this.ColumnName);
            if ((column == null) || (column.DataType != "System.Int32"))
            {
                return BitState.Unknown;
            }
            else if (row[this.ColumnName]==null)
            {
                return BitState.Unknown;
            }
            else
            {
                var bitMask = 1 << this.BitToWatch;
                var columnValue = Convert.ToInt32(row[this.ColumnName]);

                if ((columnValue & bitMask) == bitMask)
                {
                    return BitState.Set;
                }
                else
                {
                    return BitState.NotSet;
                }
            }
    }
}
BitFlagViewWatcher.prototype.Button_ToolClick=function(sender,e)
{
    if(e.Tool.Key==this.ButtonKey)
        this.OnToolClick(sender,e);
}
BitFlagViewWatcher.prototype.OnToolClick=function(sender,e){}
BitFlagViewWatcher.prototype.AddViewToWatch=function(viewToWatch)
{
    if (viewToWatch == null)
    {
        return;
    }

    if (this.viewsBeingWatched.Contains(viewToWatch))
    {
        return;
    }

    if(!this.EnsureColumnExistsInView(viewToWatch))
    {
        return;
    }

    viewToWatch.get_Event("EpiViewNotification").subscribe(this.EpiViewNotificationHandler, this,true);

    this.viewsBeingWatched.Add(viewToWatch);
}
BitFlagViewWatcher.prototype.EpiViewNotificationHandler=function(view,args)
{
    if ((this.CurrentView == null) && (this.Transaction.get_LastView() != null))
    {
        this.EpiViewChangedHandler(new EpiViewChangedArgs(this.Transaction.get_LastView(),null));
    }

    if (this.CurrentView == null) return;

    var viewToUse = this.FindViewToUse(view);
    if (viewToUse == null) return;

    //if (this.CurrentView==viewToUse) return;

    if (viewToUse==view)
    {
        this.set_CurrentValue(this.DetermineBitState(viewToUse, args.Row, new EpiOverloadedArgs("EpiDataView_Int32")));
    }
    else
    {
        this.set_CurrentValue(this.DetermineBitState(viewToUse, viewToUse.Row, new EpiOverloadedArgs("EpiDataView_Int32")));
    }
}
BitFlagViewWatcher.prototype.FindViewToUse=function(viewToWatch)
{
    if (this.viewsBeingWatched.Contains(viewToWatch))
    {
        return viewToWatch;
    }

    var viewToUse;
    if (this.aliasViews.TryGetValue(viewToWatch, viewToUse))
    {
        return Global.ArgManager["Out1"]
    }

    return null;
}
BitFlagViewWatcher.prototype.EnsureColumnExistsInView=function(view)
{
    var column = view.dataView.Table.get_Column(this.ColumnName);
    if ((column == null) || (column.DataType != "System.Int32"))
    {
        return false;
    }
    return true;
}
BitFlagViewWatcher.prototype.OnCurrentValueChanged=function()
{
    if (!this.hasBeenInitialized)
    {
        this.Initialize();
        this.hasBeenInitialized = true;
    }
}
BitFlagViewWatcher.prototype.set_CurrentValue=function(value)
{
    if (this.CurrentValue != value)
    {
        this.CurrentValue = value;
        this.OnCurrentValueChanged();
    }
}
BitFlagViewWatcher.prototype.SetBitFlag=function(view,value)
{
    if (view == null)
    {
        return;
    }

    var rowIndex = view.Row;
    if ((rowIndex < 0) || (rowIndex >= view.dataView.Rows.length))
    {
        return;
    }

    var row = view.dataView.get_Row(rowIndex);
    var column = row.get_Table().get_Column(this.ColumnName);
    if ((column == null) || (column.DataType != "System.Int32"))
    {
        return;
    }

    var oldValue;
    if (row[this.ColumnName]==null)
    {
        oldValue = 0;
    }
    else
    {
        oldValue = Convert.ToInt32(row[this.ColumnName]);
    }

    var bitMask = 1 << this.BitToWatch;
    var newValue;
    if (value)
    {
        newValue = oldValue | bitMask;
    }
    else
    {
        newValue = oldValue & ~bitMask;
    }

    if ((oldValue != newValue) || row.IsNull(column))
    {
        row[this.ColumnName] = newValue;

        if (view==this.CurrentView)
        {
            this.CurrentValue = this.DetermineBitState(view, rowIndex, new EpiOverloadedArgs("EpiDataView_Int32"));
        }
    }
}
BitFlagViewWatcher.prototype.AddViewAlias=function(viewToWatch,viewToUse)
{
    if (viewToWatch == null)
    {
        return;
    }

    if (viewToUse == null)
    {
        return;
    }

    if (!this.viewsBeingWatched.Contains(viewToUse))
    {
        return;
    }

    viewToWatch.get_Event("EpiViewNotification").subscribe(this.EpiViewNotificationHandler, this,true);

    this.aliasViews.Add(viewToWatch, viewToUse);
}
var BitFlagViewWatcherButtonHelper=Epicor.Mfg.UI.FrameWork.BitFlagViewWatcherButtonHelper=function(form,columnName,bitToWatch,buttonKey)
{
    if(!form) return;
    BitFlagViewWatcher.call(this,form,columnName,bitToWatch);
    this.ButtonKey=buttonKey;
}
BitFlagViewWatcherButtonHelper.prototype = new BitFlagViewWatcher();
BitFlagViewWatcherButtonHelper.prototype.Initialize=function()
{
    if (this.Form.myTool && this.Form.myTool.Tools[this.ButtonKey])
    {
        this.Button = this.Form.myTool.Tools[this.ButtonKey];
        this.Form.myTool.get_Event("ToolClick").subscribe(this.Button_ToolClick,this,true);
        this.UpdateButtonState();
    }
}
BitFlagViewWatcherButtonHelper.prototype.UpdateButtonState=function()
{
    if (this.Button == null) return;

    var buttonProps = this.Button.SharedProps;

    if (!this.Button.SharedProps.Visible)
    {
        this.Button.SetVisible(true);
    }

    var valueToUse;
    if (this.AllowButtonEnabled)
    {
        valueToUse = this.CurrentValue;
    }
    else
    {
        valueToUse = BitState.Unknown;
    }

    switch (valueToUse)
    {
        case BitState.NotSet:
            this.Button.SharedProps.set_Enabled(true);
            this.Form.setToolImage(this.Button,this.SmallEmptyImage)
            break;

        case BitState.Set:
            this.Button.SharedProps.set_Enabled(true);
            this.Form.setToolImage(this.Button,this.SmallNonEmptyImage);
            break;

        default:
            this.Button.SharedProps.set_Enabled(false);
            this.Form.setToolImage(this.Button,this.SmallEmptyImage);
            break;
    }
}
BitFlagViewWatcherButtonHelper.prototype.OnCurrentValueChanged=function()
{
    BitFlagViewWatcher.prototype.OnCurrentValueChanged.call(this); 
    this.UpdateButtonState();
}

var ChangeLogHelper=Epicor.Mfg.UI.FrameWork.ChangeLogHelper=function(form)
{
    if(!form) return;
    BitFlagViewWatcherButtonHelper.call(this,form,"BitFlag",3,"ChangeLogTool");
    this.LargeEmptyImage = "ChangeLog";
    this.LargeNonEmptyImage = "ChangeLogWithData";
    this.SmallEmptyImage = "ChangeLog";
    this.SmallNonEmptyImage = "ChangeLogWithData";

    this.GroupedDataView = new Hashtable();
}
ChangeLogHelper.prototype = new BitFlagViewWatcherButtonHelper();
ChangeLogHelper.AdapterLoaded=false;
ChangeLogHelper.prototype.AddViewToWatch=function(viewToWatch)
{
    var rowIdentColumn = viewToWatch.dataView.Table.get_Column("RowIdent");
    if ((rowIdentColumn == null) || (rowIdentColumn.DataType != "System.String"))
    {
        return;
    }
    BitFlagViewWatcherButtonHelper.prototype.AddViewToWatch.call(this,viewToWatch); 
}
ChangeLogHelper.prototype.OnToolClick=function(sender,e)
{
    this.LaunchChangeLogViewer();
}
ChangeLogHelper.prototype.LaunchChangeLogViewer=function()
{
    // Exit if there isn't a valid row.
    if ((this.CurrentView == null)
        || (this.CurrentView.Row < 0)
        || (this.CurrentView.Row >= this.CurrentView.dataView.Rows.length))
    {
        return;
    }

    var row = this.CurrentView.dataView.get_Row(this.CurrentView.Row);
    switch (row.get_RowState())
    {
        case DataRowState.Added:
        case DataRowState.Deleted:
        case DataRowState.Detached:
            return;
    }

    var rowIdentColumn = row.get_Table().get_Column("RowIdent");
    if ((rowIdentColumn == null)
        || (rowIdentColumn.DataType != "System.String")
        || row["RowIdent"]==null)
    {
        return;
    }

    this.ChangeLogLauncher(this.Form, this.CurrentView.dataView.Table.TableName, row["RowIdent"], this.HandleChangeLogCallBack);
}
ChangeLogHelper.prototype.HandleChangeLogCallBack=function(){}
ChangeLogHelper.prototype.ChangeLogLauncher=function(form,tableName,rowIdent,callbackMethod)
{
    if (ChangeLogHelper.AdapterLoaded == false)
    {
        var adapt = Global.GetAdapter("ChgLogAdapter",this.Form,["ChgLogArgs"]);
        Global.LoadProxyForAdapter(adapt,null,true);
        adapt.BOConnect();   
        ChangeLogHelper.AdapterLoaded=true;
    }
    ChgLogArgs.Start(form,tableName,rowIdent,false,new EpiOverloadedArgs("Object_String_String_Boolean"));
}
ChangeLogHelper.prototype.AddChangeLogViewGroup=function(groupId)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    switch(overload)
    {
        case "String":
            return Global.CallWithArgs(this,"AddChangeLogViewGroup_1",arguments);break;
        case "String_EpiDataViewArr":
            return Global.CallWithArgs(this,"AddChangeLogViewGroup_2",arguments);break;
    }
}
ChangeLogHelper.prototype.AddChangeLogViewGroup_1=function(groupId)
{
    this.EnsureGroupDoesNotAlreadyExist(groupId);

    var viewsInThisGroup = [];
    for (var view in Global.BindingEngine.EpiDataViews)
    {
        view = Global.BindingEngine.EpiDataViews[view];
        if (!ChangeLogHelper.IsCallContextView(view)
            && (this.FindGroupContainingView(view) == null)
            && !this.viewsBeingWatched.Contains(view))
        {
            viewsInThisGroup.push(view);
        }
    }

    if (viewsInThisGroup.length == 0)
    {
        throw new Exception("There are no views left that are not already used in other groups.");
    }

    this.SubscribeToViewEvents(viewsInThisGroup);

    this.GroupedDataView.Add(groupId, viewsInThisGroup);
}
ChangeLogHelper.prototype.AddChangeLogViewGroup_2=function(groupId,views)
{
    if(!Global.IsArray(views))
    {
        var _params=[];
        var _idx=1;
        while(arguments[_idx]!=undefined)
        {
            if(arguments[_idx] instanceof EpiOverloadedArgs) break;
            _params.push(arguments[_idx++]);
        }
        views=_params;
    }

    this.EnsureGroupDoesNotAlreadyExist(groupId);

    if (views.length == 0)
    {
        throw new Exception("You must specify at least one view.", "views");
    }

    this.VerifyViewsAreNotAlreadyBeingWatched(views);
    this.VerifyAtLeastOneViewHasTheRequiredColumn(views);

    this.SubscribeToViewEvents(views);

    this.GroupedDataView.Add(groupId, views);
}
ChangeLogHelper.prototype.EnsureGroupDoesNotAlreadyExist=function(groupId)
{
    if (this.GroupedDataView.ContainsKey(groupId))
    {
        throw new ArgumentException(
            String.Format("The group '{0}' has already been added.",groupId),
            "groupId");
    }
}
ChangeLogHelper.prototype.FindGroupContainingView=function(view)
{
    for (var entry in this.GroupedDataView.items)
    {
        entry=this.GroupedDataView.get_ItemPair(entry);
        for (var groupView in entry.Value)
        {
            groupView = entry.Value[groupView];
            if(groupView==view)
            {
                return entry.Key;
            }
        }
    }

    return null;
}
ChangeLogHelper.prototype.SubscribeToViewEvents=function(views)
{
    if(Global.IsArray(views))
    {
        for (var view in views)
        {
            this.SubscribeToViewEvents(views[view]);
        }
    }
    else
    {
        views.get_Event("EpiViewNotification").subscribe(this.EpiViewNotificationHandler,this,true);
    }
}
ChangeLogHelper.prototype.VerifyViewsAreNotAlreadyBeingWatched=function(views)
{
    for (var view in views)
    {
        view=views[view];
        var containingGroup = this.FindGroupContainingView(view);
        if (containingGroup != null)
        {
            throw new Exception(
                String.Format("The view '{0}' is already being used in the '{1}' group.",
                    view.ViewName,
                    containingGroup));
        }

        if (this.viewsBeingWatched.Contains(view))
        {
            throw new Exception(
                String.Format("The view '{0}' is already being watched.", view.ViewName));
        }
    }
}
ChangeLogHelper.prototype.VerifyAtLeastOneViewHasTheRequiredColumn=function(views)
{
    // If any of the views have the RowIdent column the return.
    for (var view in views)
    {
        if (this.ViewHasTheRequiredColumns(views[view]))
            return;
    }

    throw new Exception(
        String.Format("At least one of the views must have a string RowIdent column and the integer {0} column.",
            this.ColumnName));
}
ChangeLogHelper.prototype.ViewHasTheRequiredColumns=function(view)
{
    return this.ViewHasFlagColumnColumn(view)
        && ChangeLogHelper.ViewHasStringRowIdentColumn(view);
}
ChangeLogHelper.prototype.FindViewToUse=function(groupId,viewToWatch)
{
    if(arguments.length==1) return this.FindViewToUse_1(groupId);

    var bestView = viewToWatch;
    var bestBitState = this.DetermineBitState(viewToWatch, viewToWatch.Row, new EpiOverloadedArgs("EpiDataView_Int32"));

    for(var groupView in this.GroupedDataView[groupId])
    {
        groupView = this.GroupedDataView[groupId][groupView];

        if (viewToWatch!=groupView)
        {
            var thisState = this.DetermineBitState(groupView, groupView.get_Row(), new EpiOverloadedArgs("EpiDataView_Int32"));
            if (thisState > bestBitState)
            {
                bestBitState = thisState;
                bestView = groupView;
            }
        }
    }

    return bestView;
}
ChangeLogHelper.prototype.FindViewToUse_1=function(viewToWatch)
{
    var groupId = this.FindGroupContainingView(viewToWatch);
    if (groupId == null)
    {
        return BitFlagViewWatcher.prototype.FindViewToUse.call(this,viewToWatch);
    }

    return this.FindViewToUse(groupId,viewToWatch);
}
ChangeLogHelper.prototype.DetermineBitState_1=function(row)
{
    var rowIdentColumn = row.Table.get_Column("RowIdent");
    if ((rowIdentColumn == null)
        || (rowIdentColumn.DataType != "System.String")
        || row.IsNull(rowIdentColumn))
    {
        return BitState.Unknown;
    }

    return BitFlagViewWatcher.prototype.DetermineBitState.call(this,row, new EpiOverloadedArgs("DataRow"));
}
ChangeLogHelper.ViewHasStringRowIdentColumn=function(view)
{
    if ((view.dataView)
        && (view.dataView.Table))
    {
        var rowIdentColumn = view.dataView.Table.get_Column("RowIdent");
        return (rowIdentColumn) && (rowIdentColumn.DataType=="System.String");
    }

    return false;
}
ChangeLogHelper.IsCallContextView=function(view)
{
    return (view)
        && (view.dataView)
        && (view.dataView.Table)
        && (Global.InstanceOf(view.dataView.Table.DataSet,"CallContextDataSet"));
}
var MemoHelper=Epicor.Mfg.UI.FrameWork.MemoHelper=function(form)
{
    if(!form) return;
    BitFlagViewWatcherButtonHelper.call(this,form,"BitFlag",0,"MemoTool");
    this.LargeEmptyImage = "MemoEmpty";
    this.LargeNonEmptyImage = "MemoWithData";
    this.SmallEmptyImage = "MemoEmpty";
    this.SmallNonEmptyImage = "MemoWithData";
    this.get_Event("MemoLauncher").subscribe(this.LaunchMemo, this, true);
}
MemoHelper.prototype = new BitFlagViewWatcherButtonHelper();
MemoHelper.AdapterLoaded=false;
MemoHelper.prototype.OnToolClick=function(sender,e)
{
    this.LaunchMemoEditor();
}
MemoHelper.prototype.LaunchMemoEditor = function ()
{
    var a = arguments;
    var tempArray = new Array();
    for (i = 0; i < a.length; i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    var key1 = "", key2 = "", key3 = "", key1Description = "", key2Description = "", key3Description = "";

    switch (overload)
    {
        case "String_String":
            key1 = a[0];
            key1Description = a[1];
            this.LaunchMemoEditor(key1, key2, key3, key1Description, key2Description, key3Description, new EpiOverloadedArgs("String_String_String_String_String_String"));
            break;
        case "String_String_String_String":
            key1 = a[0];
            key2 = a[1];
            key1Description = a[2];
            key2Description = a[3];
            this.LaunchMemoEditor(key1, key2, key3, key1Description, key2Description, key3Description, new EpiOverloadedArgs("String_String_String_String_String_String"));
            break;
        case "String_String_String_String_String_String":
            key1 = a[0];
            key2 = a[1];
            key3 = a[2];
            key1Description = a[3];
            key2Description = a[4];
            key3Description = a[5];
            this.LaunchMemo(this.Form, this.CurrentView.ViewName, key1, key2, key3, key1Description, key2Description, key3Description, this.HandleMemoCallBack);
            break;
    }

}

MemoHelper.prototype.HandleMemoCallBack=function(sender,callBackArgs)
{
//    var memoForm = sender;
//    var numberOfMemos = Convert.ToInt32(memoForm.ReturnObject);
//    this.SetBitFlag(numberOfMemos > 0);
}
MemoHelper.prototype.LaunchMemo=function(form,viewName,key1,key2,key3,key1Description,key2Description,key3Description,callbackMethod)
{
    if (MemoHelper.AdapterLoaded == false)
    {
        var adapt = Global.GetAdapter("MemoAdapter",this.Form,["MemoArgs"]);
        Global.LoadProxyForAdapter(adapt,null,true);
        adapt.BOConnect();   
        MemoHelper.AdapterLoaded=true;
    }
    MemoArgs.StartNonModal(form,viewName,key1,key2,key3,key1Description,key2Description,key3Description,callbackMethod,new EpiOverloadedArgs("Form_String_String_String_String_String_String_String_ProcessCallerCallBack"));
}
var CallLogHelper=Epicor.Mfg.UI.FrameWork.CallLogHelper=function(form)
{
    if(!form) return;

    BitFlagViewWatcherButtonHelper.call(this,form, "BitFlag", 2, "CallLogTool");
    this.LargeEmptyImage = "CallLog";
    this.LargeNonEmptyImage = "CallLogWithData";
    this.SmallEmptyImage = "CallLog";
    this.SmallNonEmptyImage = "CallLogWithData";

    var session = form.get_Session();
    if(session) this.AllowButtonEnabled = session.ModuleLicensed(Session.Module.CR);
}
CallLogHelper.prototype = new BitFlagViewWatcherButtonHelper();
CallLogHelper.AdapterLoaded=false;
CallLogHelper.prototype.OnToolClick=function(sender,e)
{
    this.LaunchCallLogViewer();
}
CallLogHelper.prototype.LaunchCallLogViewer=function(){}
CallLogHelper.prototype.HandleCallLogCallBack=function(sender,callBackArgs)
{
//    var callingForm = sender;
//    var numberOfCalls = Convert.ToInt(callingForm.ReturnObject);
//    this.SetBitFlag(numberOfCalls > 0);
}

var EpiViewUtils = Epicor.Mfg.UI.FrameWork.EpiViewUtils = 
{
    OnGetNew:function(trans, view, link, displayExceptions)
    {
		if (!EpiViewUtils.OnUpdate(trans, view, link, displayExceptions)) { return false; }			
		if (!trans.ConfirmAddNew(false)) { return false; }		

		try 
		{
		    trans.PushStatusText(EpiString.GetString("getNew"), true);
		    link.GetNew();
			view.Notify(new EpiNotifyArgs(trans, view.dataView.Count - 1, NotifyType.AddRow, new EpiOverloadedArgs("Object_Int32_NotifyType")));
			trans.NotifyAll(NotifyType.AddRow, view);
			trans.PopStatus();
		} 
		catch(e) 
		{
			if(displayExceptions) 
			{
				ExceptionBox.Show(e);
				return false;
			}
		}
		
		return true;
    },
    OnUpdate:function(trans, view, link, displayExceptions)
    {
		if (trans.ebf != null && trans.ebf.IsEpiReadOnly) { return true; } 
		if(!view.dataView.Table.DataSet.HasChanges()) { return true; }
		if (!trans.ConfirmUpdate(false)) { return false; }	
		if (trans.DialogReject)
		{
			EpiViewUtils.undoChanges(trans, view);
			return true;
		}
		try 
		{
		    trans.PushStatusText(EpiString.GetString("savingData"), true);
			link.Update();
			view.Notify(new EpiNotifyArgs(trans, view.Row, view.Column, new EpiOverloadedArgs("Object_Int32_Int32")));
			trans.PopStatus();
		}
		catch(e)
		{
			if(displayExceptions)
				ExceptionBox.Show(e, EpiString.GetString("BusinessObjectException"));
			
			return false;
		}
		return true;
    },
    undoChanges:function(trans, view)
    {
		view.dataView.Table.DataSet.RejectChanges();
		if(view.Row > (view.dataView.Count - 1)) { view.Row--; }
		view.Notify(new EpiNotifyArgs(trans, view.Row, view.Column, new EpiOverloadedArgs("Object_Int32_Int32")));
    },
    isNewRow:function(view)
	{
		if(!(view.dataView.Count > 0)) { return false; }
		return (view.dataView.get_Row(view.Row).get_RowState() == DataRowState.Added);
	},
	OnRefresh:function(trans,view,link,keyColName)
	{
		if(view.HasRow)
		{
			try
			{
				trans.PushStatusText(EpiString.GetString("retrievingData"), true);
				link.GetByID(view.dataView.Rows[view.Row][keyColName]);
				trans.NotifyAll();
				trans.PopStatus();
			}
			catch(e) 
			{ 
				ExceptionBox.Show(e); 
			}
		}
	},
	OnUndo:function(trans,view)
	{
		if (EpiViewUtils.isNewRow(view)) trans.SetCurrentEvent(TransactionEvent.UndoOnUndoAddNew);
		if (!trans.ConfirmUndo(false)) { return false; }
		EpiViewUtils.undoChanges(trans, view);
		return true;
	},
	OnDelete:function(trans,view,link,displayExceptions)
	{
	    var returnVal = false;
//		if(view.dataView.Count==0) return returnVal;
//		var pkCols = view.dataView.Table.PrimaryKey;
//		var _keys = [];
//		var dc;
//		// Build an array with the values of the PK
//		for (var _index=0, dc; dc=pkCols[_index]; _index++) 
//		{
//		   	_keys[_index] = view.dataView.Rows[view.Row][dc];
//		}
//		var dr = view.dataView.Table.DataSet.get_Table(view.dataView.Table.TableName).Find(_keys);
        var dr = null;
        if (trans.LastView.HasRow)
        {
            dr = trans.LastView.dataView.Rows[trans.LastView.Row];
        }
		if(dr!=null)
		{
			if(dr.get_RowState()==DataRowState.Added)	
			{							
				trans.SetCurrentEvent(TransactionEvent.DeleteOnDeleteAddNew); 
				if (trans.ConfirmDelete(false)) 			
				{						
					EpiViewUtils.undoChanges(trans, view);				
					return returnVal;					
				}						
			} 
			else 
			{						
				trans.SetCurrentEvent(TransactionEvent.DeleteOnDeleteButton);
				if (!trans.ConfirmDelete(false)) return returnVal;		
				trans.PushStatusText(EpiString.GetString("deleting"), true);
			    try 
			    {
				    link.Delete(dr,new EpiOverloadedArgs("DataRow"));
			    // tgc - the EpiDataView will handle decrementing the row
			    // number for us when you pass it a NotifyType of delete
			   	if((view.dataView.Count - 1) < view.Row)
			    		view.Row--;
			    //	view.Notify(new EpiNotifyArgs(trans, view.dataView.Count - 1, EpiTransaction.NotifyType.DeleteRow, new EpiOverloadedArgs("Object_Int32_NotifyType")));
				    
				    trans.NotifyAll(NotifyType.DeleteRow, view);
				    trans.PopStatus();
				    returnVal = true;
			    } 
			    catch(e)
			    {
				    if(displayExceptions)
					    ExceptionBox.Show(e, "Delete Error");
				    view.Notify(new EpiNotifyArgs(trans, view.Row, EpiTransaction.NotifyType.Initialize, new EpiOverloadedArgs("Object_Int32_NotifyType")));
			    }
			    trans.PopStatus();
				
			}
		}
	    return returnVal;
	},
	OnInvokeSearch:function(transaction,view,link,displayExceptions,options)
	{
        if (!EpiViewUtils.OnUpdate(transaction, view, link, displayExceptions))
        {
            return;
        }
        transaction.PushStatusText(EpiString.GetString("retrievingData"), false);

        try
        {
            link.InvokeSearch(options);
            if (link.SearchResult == DialogResult.OK)
            {
                view.dataView.Table.AcceptChanges();
                transaction.NotifyAll(EpiTransaction.NotifyType.Initialize, view);
            }
        }
        catch (e)
        {
            if (displayExceptions)
            {
                ExceptionBox.Show(e, "Search Error");//*LRH*Localize
            }
        }
        transaction.PopStatus();
	}		
}

var EpiNotifyArgs = Epicor.Mfg.UI.FrameWork.EpiNotifyArgs = function()
{
    EpiObject.call(this, "EpiNotifyArgs");
	this.Guid = System.Guid.NewGuid().toString();
	this.Row = null;
	this.Column = null;
	this.Sender = null;
	this.NotifyType = null;
	this.NotifyTree = true;
	this.BruteForce = false;
	this.PreserveTreeNodeState = true;
	this.ReEvaluateRowRules = false;
	this.ChangeControlProperties = true;
	this.ChangeGridPropsCurrentRowOnly = false;
	this.JustNavigating = false;   
    
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "Object_Int32_Int32":
			this.Sender = a[0];
			this.Row = a[1];
			this.Column = a[2];
			this.NotifyType = NotifyType.Initialize;
            break;
        case "Object_Int32_Boolean_Int32":
			this.Sender = a[0];
			this.Row = a[1];
			this.Column = a[3];
			this.ReEvaluateRowRules = a[2];
			this.NotifyType = NotifyType.Initialize;
            break;
        case "Object_Int32_Boolean_Int32_Boolean":
			this.Sender = a[0];
			this.Row = a[1];
			this.Column = a[3];
			this.ReEvaluateRowRules = a[2];
			this.JustNavigating = a[4];
			this.NotifyType = NotifyType.Initialize;
            break;
        case "Object_Boolean_Int32_Int32":
			this.Sender = a[0];
			this.Row = a[2];
			this.Column = a[3];
			this.NotifyType = NotifyType.Initialize;
			this.BruteForce = a[1];
            break;
        case "Object_Boolean_Boolean_Int32_Int32":
			this.Sender = a[0];
			this.Row = a[3];
			this.Column = a[4];
			this.NotifyType = NotifyType.Initialize;
			this.BruteForce = a[1];
			this.PreserveTreeNodeState = a[2];
            break;
        case "Object_Int32_Int32_Boolean":
			this.Sender = a[0];
			this.Row = a[1];
			this.Column = a[2];
			this.NotifyType = NotifyType.Initialize;
			this.NotifyTree = a[3];
            break;
        case "Object_Boolean_Int32_Int32_Boolean":
			this.Sender = a[0];
			this.Row = a[2];
			this.Column = a[3];
			this.NotifyType = NotifyType.Initialize;
			this.NotifyTree = a[4];
			this.BruteForce = a[1];
            break;
        case "Object_Int32_NotifyType":
			this.Sender = a[0];
			this.Row = a[1];
			this.NotifyType = a[2];
            break;
    }
}
EpiNotifyArgs.prototype = new EpiObject();


var CurrencyCheckChangeArgs = Epicor.Mfg.UI.FrameWork.CurrencyCheckChangeArgs = function(currCode)
{
    EpiObject.call(this, "CurrencyCheckChangeArgs");
    this.SelectedCurrencyCode=currCode;
}

var EpiViewChangedArgs = Epicor.Mfg.UI.FrameWork.EpiViewChangedArgs=function(currentView,lastView)
{
    EpiObject.call(this, "EpiViewChangedArgs");

    this.CurrentView = currentView;
    this.LastView = lastView;
}
var UIException = Epicor.Mfg.UI.FrameWork.UIException = function(message, innerException)
{
    Exception.call(this, message, innerException);
}
UIException.prototype = new Exception();


var EpiString = Epicor.Mfg.UI.FrameWork.EpiString =
{
    Strings: {},

    _GetMessageList: function(xmlStringFile) {
        var ret = null;
        if ((xmlStringFile == null) || (xmlStringFile == "") || (!Global)) return ret;

        xmlStringFile = xmlStringFile.toLowerCase();
        var key = xmlStringFile;

        ret = Global.MessagesStore[key];
        if (ret) return ret;

        var asmName = xmlStringFile;
        var p = xmlStringFile.lastIndexOf(".xml");
        if (p > 0) asmName = xmlStringFile.substr(0, p);
        if (asmName.StartsWith("msg.epicor.mfg.")) asmName = asmName.substr(15);

        if (key == "messagestrings-2.html") {
            key = "global.messages.app";
            ret = Global.MessagesStore[key];
        }
        else if (key == "msg.epicor.mfg.ui.epiclientlib.html") {
            key = "global.messages.lib";
            ret = Global.MessagesStore[key];
        }
        else if ((Global.Form) && (Global.Form.AssemblyStrings) && (Global.Form._assembly) && (Global.Form._assembly.toLowerCase() == asmName)) {
            //Check if it points to current application
            ret = Global.Form.AssemblyStrings;
        }
        var _opmsg = null;
        if (!ret) {
            //try to get string list from opener, if this window was opened from another window
            try {
                var _opener = BrowserHelper.GetParentOpener();
                if (_opener) {
                    if (_opener.GlobalObject && _opener.GlobalObject.MessagesStore)
                        _opmsg = _opener.GlobalObject.MessagesStore;
                    if (!_opmsg && _opener.Global && _opener.Global.MessagesStore)
                        _opmsg = _opener.Global.MessagesStore;
                    if (_opmsg) ret = _opmsg[key];

                    if (ret)
                    {
                        var hasStrings = false;
                        for (var s in ret)
                        {
                            hasStrings = true;
                            break; // Need to check if there is anything inside the list, if not, we have a dummy js object.
                        }

                        if (!hasStrings)
                            ret = null;
                    }
                }
            }
            catch (e) { _opener = null; _opmsg = null; ret = null; };
        }
        if (!ret && Global.ServerSession)
        {
            //retrieve using url, may be cached
            var resId = key.StartsWith("global.messages.") ? "GlobalStrings" : key;
            var url = "EpiString.axd?ResourceID=" + resId + "&LangID=" + Global.ServerSession.LanguageID + "&Ver=" + Global.ServerSession.LangVersion;
            var ss = Global.GetScript(url);
            if (ss != null) eval(ss);
            ret = Global.MessagesStore[key];
        }
        if (!ret) {
            //did not find anywhere, fetch using web service         
            try {
                var x = WebServiceAction.WSAction("GetTranslation", { "AssemblyName": asmName, "ProgramID": "" }, null, "string");
                ret = JSON.parse(x);
            } catch (e) { ret = null; }
        }
        if (_opmsg) _opmsg[key] = ret;
        Global.MessagesStore[key] = ret;
        return ret;
    },
    _GetString: function(id, xmlStringFile) {
        var msg = "";
        var msgStrings = null;

        //Check xmlStringFile parameter first
        if ((xmlStringFile) && (xmlStringFile != "")) {
            msgStrings = EpiString._GetMessageList(xmlStringFile);
        }
        else if (Global && Global.Form && Global.Form.AssemblyStrings) {
            msgStrings = Global.Form.AssemblyStrings;
        }
        else {
            //avoid adapter searches
            var isSearch = (Global && Global.Form && Global.Form.oSearchEngine);
            if (!isSearch) {
                //in case GetString() was called from a dialog try to get AssemblyStrings from opener
                try {
                    if (_opener) {
                        if (_opener.Global && _opener.Global.Form) {
                            msgStrings = _opener.Global.Form.AssemblyStrings;
                        }
                        if (!msgStrings && _opener.GlobalObject && _opener.GlobalObject.Form) {
                            msgStrings = _opener.GlobalObject.Form.AssemblyStrings;
                        }
                    }
                } catch (e) { }
            }
        }

        if (msgStrings != undefined) {
            if (msgStrings != undefined) msg = msgStrings[id];
        }
        if ((!msg) || (msg == "")) {
            var list = "application.messages";
            if (Global.MessagesStore[list]) msg = Global.MessagesStore[list][id];
            if ((!msg) || (msg == "")) {
                //If we did not find string in form's strings start looking in global strings
                var lists = ["ewa", "app", "sys", "lib"]
                for (key in lists) {
                    if ((!msg) || (msg == "")) {
                        list = "global.messages." + lists[key];
                        msgStrings = EpiString._GetMessageList(list);
                        if (msgStrings) msg = msgStrings[id];
                    }
                    else break;
                }
            }
        }
        if (!msg) msg = "";
        return msg;
    },
    GetString: function(key, xmlStringFile) {
        // GetString has 2 overloads: one with just key, second with key and xmlStringFile
        if (xmlStringFile instanceof EpiOverloadedArgs) xmlStringFile = ""; // Will happen only when the overload with just key is used.
        return EpiString._GetString(key, xmlStringFile);
    },
    GetGlobalAppString: function(id, args) {
        return EpiString.GetStringFmt(id, args, new EpiOverloadedArgs("global.messages.app"));
    },
    GetGlobalSysString: function(id, args) {
        return EpiString.GetStringFmt(id, args, new EpiOverloadedArgs("global.messages.sys"));
    },
    GetDialogInfoFmt: function(Key) {
        return EpiString.GetDialogInfo(Key);
    },
    GetDialogInfo: function(Key, xmlStringFile) {
        var di = {};
        di["Message"] = EpiString.GetString(Key, xmlStringFile);
        if (di["Message"]) {
            di["Title"] = EpiString.GetString(Key + "_title", xmlStringFile);
            di["Icon"] = EpiString.GetString(Key + "_icon", xmlStringFile);
            di["Buttons"] = EpiString.GetString(Key + "_buttons", xmlStringFile);
        }
        return di;
    },
    GetAddText: function(id) {
        var tKey = id.Replace(" ", "_");
        var ret = EpiString._GetString(tKey);
        if ((!ret) || (ret == "")) ret = id;
        return ret;
    },
    getString: function(key) // This GetString method is only to be used within EpiClientLib. To retrieve strings from Msg.Epicor.Mfg.UI.EpiClientLib.xml.
    {
        return EpiString._GetString(key, "global.messages.lib");
    },
    ReplaceHotKey: function(str) {
        var ret = str;
        var posHotKey = ret.indexOf("&");
        if ((posHotKey > -1) && (posHotKey < ret.length - 1)) {
            var s = "";
            if (posHotKey > 0) s = ret.substr(0, posHotKey);
            s += "<u>" + ret.substr(posHotKey + 1, 1) + "</u>";
            if (posHotKey + 2 < ret.length) s += ret.substr(posHotKey + 2);
            ret = s;
        }
        return ret;
    },
    GetStringFmt: function() {
        var a = arguments;
        var tempArray = new Array();
        for (i = 0; i < a.length; i++) { tempArray[i] = a[i] }
        var overload = Global.GetOLSeqForArgTypes(tempArray);

        var str = (overload) ? EpiString._GetString(a[0], overload) : EpiString._GetString(a[0]);
        var start = 1;
        var argList = "";
        for (var ii = start; ii <= tempArray.length - 1; ii++) {
            if (tempArray[ii] instanceof EpiOverloadedArgs) continue;
            argList = argList + ",tempArray[" + ii + "]";
        }
        if (argList != "") {
            return eval("String.Format(\"" + str + "\"" + argList + ")");
        }
        return str;
    }
}

var EpiRetrievalSequencer = Epicor.Mfg.UI.FrameWork.EpiRetrievalSequencer = function(trans)
{
    EpiObject.call(this, "EpiRetrievalSequencer");
    this.trans = trans;
}
EpiRetrievalSequencer.prototype.Retrieve=function(p)
{
    if(Global.IsArray(p))
    {
	    for(var i=0; i<p.length; ++i)
	    {
		    var param=p[i];
		    param.t=param.retriever.Retrieve(param.searchOptions, param.adapter, param.reset);
	    }   
    }
    else
    {
        var param=p;
	    param.t=param.retriever.Retrieve(param.searchOptions, param.adapter, param.reset);
    }
}
// TODO: this is actually part of EpiRetrievalSequencer, kept it seperate for now
var Params = Epicor.Mfg.UI.FrameWork.Params = function(sRetriever, srchOptions, sAdapter)
{
    EpiObject.call(this, "Params");
    this.retriever=sRetriever;
	this.searchOptions=srchOptions;
	this.adapter=sAdapter;
}
var EpiRetriever = Epicor.Mfg.UI.FrameWork.EpiRetriever = function(comboObj)
{
    EpiObject.call(this, "EpiRetriever");
    this.retrieveDone=false;
    if (comboObj && comboObj instanceof EpiComboBox)
        this.ComboObj = comboObj;
}
EpiRetriever.prototype.SetUpForRetriveOnDemand=function(Params)
{
    this.set_searchOptions(Params.searchOptions);
	this.searchOptions.PageSize=0;//int.MaxValue;
	this.adapter = Params.adapter; // name of the adapter
}

EpiRetriever.prototype.set_searchOptions=function(opts)
{
    var currentOpts = this.searchOptions;
    if (!currentOpts)
    {
        this.searchOptions = opts;
        this.doRetrieve = true; 
    }
    else
    {
        var newWClause = "";
        if(opts.NamedSearch.WhereClauses != null && opts.NamedSearch.WhereClauses.ContainsKey('BaseList'))
			    newWClause = opts.NamedSearch.WhereClauses['BaseList'];  
	    var oldWClause = "";
	    if(currentOpts.NamedSearch.WhereClauses != null && currentOpts.NamedSearch.WhereClauses.ContainsKey('BaseList'))
			    oldWClause = currentOpts.NamedSearch.WhereClauses['BaseList'];
        
        if (newWClause != oldWClause)
        {
            this.searchOptions = opts;
            this.doRetrieve = true; 
        }
        else if (this.retrieveDone==true)
        {
            this.doRetrieve = false; // Dont retrieve if we have already got data and the filter hasnt changed
        }
	}
}

EpiRetriever.prototype.Retrieve=function(searchOptions, adapter, reset)
{
    this.set_searchOptions(searchOptions);
	this.searchOptions.PageSize=0;//int.MaxValue;
	this.adapter = adapter; // name of the adapter
 	this.ComboObj.Retriever.InsertRowForZeroValue = true; 
		
	this.RetrieveNow(this.ComboObj, this.ComboObj.ValColIsInt, new EpiOverloadedArgs("Custom"));
}
EpiRetriever.prototype.RetrieveNow=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    switch(overload)
    {
        case "":
        case "Boolean_String_String_String":
        case "String_String_String":
            this.RetrieveNow_1(this.ComboObj,this.ComboObj.ValColIsInt);
            break;
        case "Custom":
            this.RetrieveNow_1(a[0],a[1]);
            break;
    }
}
EpiRetriever.prototype.RetrieveNow_1=function(ComboObj, ValColIsInt)
{
    // Eventually this will be triggering an async process.     
   
    if (this.doRetrieve == false)
    {
        // Dont call the server, return from here
        if(ComboObj.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
	    {
		    // need to reset the flag now that we have retrieved data
		    ComboObj.TheDataSet.ExtendedProperties["Invalidated"]= false;
	    }
        return true;
    }
	this.isGridValueList = true;
    var morePages;
	var ds;
    Global.window.status = "Retrieving dropdown data...";
    try
    {
    if (this.adapter) // != null
    {
        if (ComboObj.AssociatedCombo)
            this.adapter = ComboObj.AssociatedCombo.GetAdapter(ComboObj.AssociatedCombo.adapter);
        else
            this.adapter = ComboObj.GetAdapter(this.adapter);
            
        if(!this.adapter.isConnected)
	        this.adapter.BOConnect(); // Creates an instance of the web-service
	    
	    switch(this.searchOptions.DataSetMode)
	    {
		    case DataSetMode.ListDataSet:
			    ds=this.adapter.GetList(this.searchOptions, morePages, 'ARRAY', this.ValueMember + "," + this.DisplayMembers + ",''");
			    if (ds instanceof DataSet) 
			        ds= this._fillDataArrayFromDS(ds);
			    break;

		    case DataSetMode.RowsDataSet:
			    ds=this.adapter.GetRows('ARRAY', this.ValueMember + "," + this.DisplayMembers + ",''", this.searchOptions, morePages);
			    break;
        }
    }
    else
        Global.window.status = "Adapter is undefined for this combo box."
    if (ds && ds.length > 0)
    {
	    this._postRetrieve(ds, ComboObj, ValColIsInt);
//	    ComboObj.DataSource = new DataView(ds);
    }
    Global.window.status = "";
	return true;
	}
	catch(err)
	{
	    MessageBox.Show(err.description, new EpiOverloadedArgs("String"));
	    return false;
	}
}

EpiRetriever.prototype._postRetrieve=function(ds, ComboObj, ValColIsInt)
{
//    ds = ds.replace(/\r||\r/g, ""); // get rid of newlines

    Global.ComboManager.ComboArrays[ComboObj.ID] = ds; //eval(ds);
    if(ComboObj.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
	{
		// need to reset the flag now that we have retrieved data
		ComboObj.TheDataSet.ExtendedProperties["Invalidated"] = false;
	}
	// if the retriever is being used as the valuelist for a
	// grid column - then we need to make sure there is a row
	// for a value of '0' (if the valuemember column is numeric)
	if (this.isGridValueList && this.InsertRowForZeroValue && ValColIsInt)
	{
		// If there is no row with value=0, add one in
		ComboObj.AddZeroValueEntry();
	}
	this.retrieveDone=true;
}
EpiRetriever.prototype._fillDataArrayFromDS=function(ds) //// Fills the dataarray from the datatable rows
{
    var dt;
    if(Global.InstanceOf(ds,"DataTable"))
		dt = ds;
	else if(Global.InstanceOf(ds,"DataView"))
		dt = ds.Table;
	else if(Global.InstanceOf(ds,"DataSet") && ds.GetTableCount()>0)
		dt = ds.get_Table(0);
		
    if (!dt) return;

    var dt,val,elem;
    var dataVal = "";
    var dataArray=[];
    var dtRows = dt.Rows;
    var desc = '';

    if ((!this.ValueMember || !this.DisplayMembers) || dtRows.length == 0)
        return ds;
        
    var displayCols = this.DisplayMembers.split("~");
    var addedCodes = {};
    
    for(var rowNum=0, row; row=dtRows[rowNum]; rowNum++)
    {
        if (addedCodes[row[this.ValueMember]]) continue;
        desc= [];
        dataVal = [];
        elem = [];
        dataVal.push(row[this.ValueMember]); // Code column
        addedCodes[row[this.ValueMember]] = 1;
        
        for(var c=0, col; col=displayCols[c]; c++)
        {
            val = row[col];
            desc.push(val);
        }
        elem.push(dataVal);
        elem.push(desc); 
        dataArray.push(elem);
    }
    
   return dataArray;
}


var FormFunctions = Epicor.Mfg.UI.FrameWork.FormFunctions = 
{
    IsNum: function(numberToValidate)
	{
        var valueIsNumber = false;

        if (!numberToValidate || numberToValidate == String.Empty)
            valueIsNumber = false;
        else
        {
            var decimalPattern = "^[-]?[0-9]{0,50}[.][0-9]{1,10}$";
            var integerPattern = "^[-]?[0-9]+$";
            var numberPattern = new Regex("(" + decimalPattern + ")|(" + integerPattern + ")");

            valueIsNumber = numberPattern.IsMatch(numberToValidate) == true;
        }

        return valueIsNumber;
    },
    ComboFillDescrp: function(xlist, listTable, comboCtrl, fillTable)
    {
        if (!comboCtrl) return;
        var id = comboCtrl.ID;
        if (!xlist || xlist == "")
        {
            Global.ComboManager.ComboArrays[id]= [];
            return;
        }

        if (fillTable)
		{
			//Add colums if there are no columns in the table
			listTable.Clear();
			if(listTable.GetColumnCount() == 0)
			    listTable.Columns={"Code":{"DataType":"System.String","ExtendedProperties":{}},"Description":{"DataType":"System.String","ExtendedProperties":{}}};
			    
            var items = xlist.split("~");
            var code, desc, indx=0,myDataRow;
            for(var i=0,item; item = items[i]; i++)
            {
               codeDesc = item.split("`");
               code = codeDesc[0];
               desc = codeDesc[1];
               myDataRow = listTable.NewRow();
		       myDataRow["Code"] = code;
		       myDataRow["Description"] = desc;
		       listTable.AddRow(myDataRow);
            }
			    
			comboCtrl.preFilled = false; // forces combo to refresh
			comboCtrl.set_DataSource(listTable);
	        comboCtrl.set_DisplayMember("Description");
	        comboCtrl.set_ValueMember("Code");
	        comboCtrl.SetColumnFilter("Description");
	        comboCtrl.preFilled = true;
	        comboCtrl.getDataFromDataSrc(true); // This method builds the data array from the datasource and sets it into Global.ComboManager.ComboArrays 
	        return comboCtrl._getDataArray();
        }
        else
        {
            var items = xlist.split("~");
            var comboData = new Array();
            var code, desc, indx=0;
            for(var i=0,item; item = items[i]; i++)
            {
               codeDesc = item.split("`");
               code = codeDesc[0];
               desc = codeDesc[1];
               comboData[indx] = [[],[]];
               comboData[indx][0]=[code];
               comboData[indx][1]=[desc];
               indx++;
            }
            
	        comboCtrl._saveDataArray(comboData); //Global.ComboManager.ComboArrays[id]= comboData;
    //	    comboCtrl.set_DataSource(listTable);
	        comboCtrl.DisplayMember = "Description";
	        comboCtrl.ValueMember = "Code";
	        comboCtrl.preFilled = true;
	        return comboData;
	    }
    },
    DialogConfirmed:function(DialogKey)
	{
		var di = EpiString.GetDialogInfo(DialogKey);
		return MessageBox.Show(di.Message, di.Title, di.Buttons, di.Icon, new EpiOverloadedArgs("String_String_MessageBoxButtons_MessageBoxIcon"));
	},  
	CheckDialogConfirmed:function(DialogKey)
	{
	    var di = EpiString.GetDialogInfo(DialogKey);
	    if(DialogKey=="UpdateOnFormClose") di.Buttons = "YesNo";  // Can't always cancel in web.
		var retVal = MessageBox.Show(di.Message, di.Title, di.Buttons, new EpiOverloadedArgs("String_String_MessageBoxButtons"));
		return {"IsChecked":false, "Result":retVal, "Buttons":di.Buttons};
	},
    GetActiveSheetKey: function(dockPanel)
    {
        var selectedSheet = dockPanel.get_EpiSelectedSheet();
		if(selectedSheet != null && selectedSheet != "")
		{
		    var pane = dockPanel.PaneFromKey(selectedSheet);
			if(pane.IsActive || pane.IsSelectedTab)
			{
				if(pane.get_Control() instanceof EpiDockManagerPanel)
				{
                    var subSelectedSheet = FormFunctions.GetActiveSheetKey(pane.get_Control());
					if(subSelectedSheet.length > 0)
					{
						selectedSheet = subSelectedSheet;
					}
				}
				else if(pane.get_Control() instanceof EpiPanel)
				{
				    // TODO
				}
			}
		}
		return selectedSheet;
    },
    GetDateString: function(date,format)
    {
        var a = arguments;
        var tempArray = new Array();
        for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
        var overload = Global.GetOLSeqForArgTypes(tempArray);
        var result = "";
        var format = "MM/dd/yyyy";
        switch(overload)
        {
            case "DateTime":
                    //if(!format) format = "yyyy-MM-ddThh:mm:ss";
                result = FormatEngine.FormatDate(a[0], format);
                break;
            case "DateTime_String":
                result = FormatEngine.FormatDate(a[0], a[1]);
                break;
            default:
        }
        return result;
    },
    GetRowsNamedSearches: function(sender, SearchForm, AppCalledFrom, knownID, CRMbegins)
    {
        var ds = null;
        
	    try
	    {
            var prod = "";
            var user = "";

            var coreSession = sender.get_Session();
		    if (coreSession == null) return null;

            var user = coreSession.UserID;			
            var prod = coreSession.ProductCode;		
            
            var adapt = Global.GetAdapter("NamedSearchAdapter",sender);
            Global.LoadProxyForAdapter(adapt,null,true);
            adapt.BOConnect();

            if(adapt.GetRows)
            {
                var ht = new Hashtable();
                var s="";

                if (CRMbegins)
                {
                    var baseSName = SearchForm.substring(0, SearchForm.IndexOf("-"));

				    s = "ProductID = '" + prod +"' AND " +
					    "SearchForm BEGINS '" + baseSName + "' AND " +
					    "CalledFrom = '" + AppCalledFrom + "' AND " +
					    "DcdUserID = '" + user +"'";
			    }
			    else
			    {
				    s = "ProductID = '" + prod +"' AND " +
					    "SearchForm = '" + SearchForm + "' AND " +
					    "CalledFrom = '" + AppCalledFrom + "' AND " +
					    "DcdUserID = '" + user +"'";
			    }

			    if (knownID!="")
			    {
				    s += " AND NSId = '" + knownID + "'";
			    }

			    ht.Add("NamedSearch", s);

                var sOpts = SearchOptions.CreateRuntimeSearch(ht, DataSetMode.RowsDataSet);
                var retVal = adapt.GetRows(sOpts, true);
			    if (retVal != null)
			    {
				    ds = retVal;
			    }
			    else if (knownID != "" && retVal ==null)
			    {
				    MessageBox.Show("Unable to find Named Search: " + knownID, new EpiOverloadedArgs("String"));
			    }
		    }
	    }
	    catch (ex) { ExceptionBox.Show(ex, "GetRowsNamedSearches"); }

	    return ds;
    },
    CheckBOSecurity:function(boName,session)
	{
	    //TODO
        return true;
	},
    GetMenuItemColumnValue:function(dsMenuItem,colName) // test when we implement dsMenuItem
    {
	    var colValue = null;
	    if (dsMenuItem)
	    {
		    if(dsMenuItem.GetTableCount() > 0 && dsMenuItem.get_Table(0).Rows.length > 0)
		    {
			    var drMenuItem = dsMenuItem.get_Table(0).get_Row(0);
			    if (dsMenuItem.get_Table(0).ColumnsContains(colName))
				    colValue = drMenuItem[colName];
		    }
	    }
	    return colValue;
    },
	GetArgumentValuePerToken:function(arguments,token) // test when we implement dsMenuItem
	{
		var retValue = String.Empty;
		var tokenExists = false;
        var longDash = '–';  // ascii 8211
        var shortDash = '-'; // ascii 45
		var slash = '../index-2.html';
		arguments = arguments.Replace(longDash, shortDash );
		arguments = arguments.Replace(slash, shortDash);
		if (token.toUpperCase() == "AUT" && arguments.toUpperCase().IndexOf("-" + "AUTOLOADSUPPRESS")>-1)
			arguments = arguments.toUpperCase().Replace("AUTOLOADSUPPRESS", "AUT");
		arguments += " -";
		// token and value can be separated by space or by equal sign.
		if(arguments.IndexOf("-" + token + " ") > -1 ||
			arguments.IndexOf("-" + token + "=") > -1)
		{
			var startIdx = arguments.IndexOf("-" + token);
			var stopIdx = arguments.IndexOf(" -", startIdx+token.length+1, new EpiOverloadedArgs("String_Int32"));
			var myToken = arguments.Substring(startIdx, stopIdx - startIdx);
			if (myToken == "-"+token)
			{
				tokenExists = true;
				retValue = String.Empty;
			}
			else
			{
				tokenExists = true;
				retValue = myToken.Substring(token.length+2);
			}
		}
		if (tokenExists && (retValue == String.Empty))
			retValue = "true";
		return retValue;
	},
	GetTableFromDataSource:function(dataSource,dataMember)
	{
	    var dt = null;
	    if(Global.InstanceOf(dataSource,"DataSet"))
        {
            if (dataMember && dataSource.TablesContains(dataMember))
                dt = dataSource.get_Table(dataMember);
            else
                dt = dataSource.get_Table(0);
        }
        else if(Global.InstanceOf(dataSource,"DataView"))
            dt = dataSource.Table;
        else if(Global.InstanceOf(dataSource,"DataTable"))
            dt = dataSource;
            
        return dt;
    },
    GetGlobalConstants:function(sender)
    {
        if (Global.GlobalConstants && Global.GlobalConstants.Count > 0) return Global.GlobalConstants;
        // Get the constants from the server
        
	    try
	    {
	        Global.GlobalConstants = new Hashtable();
            var ds = new DataSet();
	        var hasToday = false;
	        ProcessCaller.InvokeAdapterMethod(sender, "DynamicQueryAdapter", "GetConstants", ds, [0], new EpiOverloadedArgs("Object_String_String_DataSet_ObjectArr"));
            if (ds.GetTableCount()>0)
		    {
		        var tbl = ds.get_Table(0);
		        if (tbl.Rows.length>0)
		        {
		            var colVal;
			        for(var c in tbl.Rows[0])
			        {
			            colVal = tbl.Rows[0][c];
				        if (c == "Today") hasToday = true;
				        var key = "Constant: " + c;
				        var val = colVal;
				        // Since we dont have the schema for this dataset, just use this roundabout way to figure out if its a datetime column. 
				        // To get the schema we'd have to make another server call and process the returned data.
				        try
				        {
				            var d = Convert.ToDateTime(colVal)
				            if (d)
				                val = FormFunctions.GetDateString(d, new EpiOverloadedArgs("DateTime")); // Convert didnt throw an exception, so this is a date.
				        }
				        catch(e){}
				        					        
				        Global.GlobalConstants.Add(key, val);
			        }
			    }
		    }
		    if (!hasToday)
			    Global.GlobalConstants.Add("Constant: Today", FormFunctions.GetDateString(DateTime.get_Today(),new EpiOverloadedArgs("DateTime")));
		    Global.GlobalConstants.Add("Constant: NullValue", String.Empty);
        }
        catch(err)
        {
			ExceptionBox.Show(err);
			Global.GlobalConstants = null;
        }
        return Global.GlobalConstants;
    },
    ComboRetrieve:function(combo)
	{
		combo.SetupCombo();
		var parm = combo.get_SequencerParams();
		parm.retriever.SetUpForRetriveOnDemand(parm);

		combo.retrieveOnActivate = true;
		combo.InvalidateOnDemandRetriever(true);
	},
	GetRetrieverCombo:function(AdapterName,ComboName)
	{
	    try
	    {
	        var combo = new Epicor.Mfg.UI.Controls.Combos[ComboName]();
	        combo.ctor();
	        return combo;
	    }
	    catch(err)
	    {
	    }
	},
	ComboRetrieveCustom:function(combo)
    {
        // For static combos whose data is already retrieved, don't retrieve again.
        if (combo.retrieveOnActivate == false && combo._getDataArray())
            return;
            
        combo.SetupCombo();
        var parm = combo.get_SequencerParams();
        rSeq = new EpiRetrievalSequencer();
        rSeq.Retrieve(parm);
    },
    getILaunchSession:function(obj)
    {
        var coreSession = null;
        if (obj != null && obj.Session != null)
        {
            coreSession = obj.Session;
    }
        return coreSession;
    },
    SearchFunctions_AdapterEmptyDS:function(Sender,AdapterName,returnFullDS)
    {
        var adapterDS=new DataSet(new EpiOverloadedArgs(""));
        var instance=Global.GetAdapter(AdapterName,Sender);
        var Params=[];
        if(returnFullDS)
        {
            Params[0]=Epicor.Mfg.UI.Searches.DataSetMode.RowsDataSet;
            
        }
        else 
        {
            Params[0]=Epicor.Mfg.UI.Searches.DataSetMode.ListDataSet;
            
        }
        var rVal=null;
        if(!instance.GetCurrentDataSet)
        {
            throw new ApplicationException("Unable to load method.",new EpiOverloadedArgs("String"));
        }
        else 
        {
            try
            {
                rVal = instance.GetCurrentDataSet(Params);
                if(Global.InstanceOf(rVal,"DataSet"))
                {
                    adapterDS=rVal;
                }
                
            }
            catch(_err)
            {
               if(_err.InnerException != null)
                {
                    throw _err.InnerException;
                }
                else 
                {
                    throw _err;
                }
            }
        }
        return adapterDS;
    }
}

var EpiTreeBinding = Epicor.Mfg.UI.FrameWork.EpiTreeBinding = function(EpiBinding, ImageIndex)
{
    EpiObject.call(this, "EpiTreeBinding");
    
    var a = arguments;
    var overload = Global.GetOLSeqForArgTypes(a);
    
    switch(overload)
    {
        case "String":
			this.initTreeBinding([a[0]], [""], -1, false, false, "", "");
            break;
        case "StringArr_StringArr":
            this.initTreeBinding(a[0], a[1], -1, false, false, "", "");
            break;
        case "String_Int32": //
            this.initTreeBinding([a[0]], [""], a[1], false, false, "", "");
            break;
        case "StringArr_StringArr_Int32":
            this.initTreeBinding(a[0], a[1], a[2], false, false, "", "");
            break;
        case "String_Int32_String":
            this.initTreeBinding([a[0]], [""], a[1], false, false, a[2], "");
            break;
        case "StringArr_Int32_StringArr_Int32_String":
            this.initTreeBinding(a[0],a[1], a[2], false, true, a[3], "");
            break;
        case "String_Int32_String_String":
            this.initTreeBinding([a[0]],[""],a[1],false,true,a[2],a[3]);
            break;
        case "StringArr_StringArr_Int32_String_String":
            this.initTreeBinding(a[0], a[1], a[2], false, true, a[3], a[4]);
            break;
        case "String_Int32_Boolean":
            this.initTreeBinding([a[0]], [""], a[1], a[2], false, "", "");
            break;
        case "StringArr_StringArr_Int32_Boolean":
            this.initTreeBinding(a[0], a[1], a[2], a[3], false, "", "");
            break;
        case "String_Boolean":
            this.initTreeBinding([a[0]], [""], -1, a[1], false, "", "");
            break;
        case "StringArr_StringArr_Boolean":
            this.initTreeBinding(a[0], a[1], -1, a[2], false, "", "");
            break;
        case "String_Boolean_Boolean":
            this.initTreeBinding([a[0]], [""], -1, a[1], a[2], "", "");
            break;
        case "StringArr_StringArr_Boolean_Boolean":
            this.initTreeBinding(a[0], a[1], -1, a[2], a[3], "", "");
            break;
        case "String_Boolean_String":
            this.initTreeBinding([a[0]], [""], -1, a[1], true, a[2], "");
            break;
        case "StringArr_StringArr_Boolean_String":
            this.initTreeBinding(a[0], a[1], -1, a[2], true, a[3], "");
            break;
        case "String_String":
            this.initTreeBinding([a[0]], [""], -1, false, true, a[1], "");
            break;
        case "StringArr_StringArr_String":
            this.initTreeBinding(a[0], a[1], -1, false, true, a[2], "");
            break;
        case "String_Int32_Boolean_Boolean": 
            this.initTreeBinding([a[0]], [""], a[1], a[2], a[3], "", "");
            break;
        case "StringArr_StringArr_Int32_Boolean_Boolean":
            this.initTreeBinding(a[0], a[1], a[2], a[3], a[4], "", "");
            break;
        case "String_Int32_Boolean_String":
            this.initTreeBinding([a[0]], [""], a[1], a[2], true, a[3], "");
            break;
        case "StringArr_StringArr_Int32_Boolean_String":
            this.initTreeBinding(a[0], a[1], a[2], a[3], true, a[4], "");
            break;
        case "String_Int32_Boolean_Boolean_String":
            this.initTreeBinding([a[0]], [""], a[1], a[2], a[3], "", a[4]);
            break;
        case "StringArr_StringArr_Int32_Boolean_String_String":
            this.initTreeBinding(a[0], a[1], a[2], a[3], true, a[4], a[5]);
            break;
        default:
            this.initTreeBinding([EpiBinding], [""], ImageIndex, false, false, "", "");
            break;
    }
}
EpiTreeBinding.prototype.initTreeBinding=function(EpiBindings,Prefixes,ImageIndex,Attachments,ShowColumnCaption,ColumnString,ContextMenuKey)
{
	this.EpiBinding = EpiBindings[0];
	this.EpiBindings = EpiBindings;
	this.Prefixes = Prefixes;
	this.ImageIndex = ImageIndex;
	this.TakesAttachments = Attachments;
	this.ColumnCaption = ShowColumnCaption;
	this.ColumnString = ColumnString;
	this.ContextMenuKey = ContextMenuKey;
	this.DateTimeFormats = null;
	this.DateTimeFormat = null;
	this.SeparatorCharacter = "";
	
	// not a folder node by default
	this.InFolderNode = false;
	this.HideEmptyFolders = false;
	this.FolderName = "";
	this.ExpandFolder = false;
	this.HideFolderCount = false;
	this.FolderImageIndex = -1;
	this.IsAttachmentBinding = false;
}
EpiTreeBinding.prototype.SetAsFolderNode=function(FolderText,HideEmpty,ExpandFolder,HideCount,FolderImageIndex)
{
    this.InFolderNode = true;
    this.FolderName = FolderText;
    if(HideEmpty!=undefined && !(HideEmpty instanceof EpiOverloadedArgs)) this.HideEmptyFolders = HideEmpty;
    if(ExpandFolder!=undefined && !(ExpandFolder instanceof EpiOverloadedArgs)) this.ExpandFolder = ExpandFolder;
    if(HideCount!=undefined && !(HideCount instanceof EpiOverloadedArgs)) this.HideFolderCount = HideCount;
    if(FolderImageIndex!=undefined && !(FolderImageIndex instanceof EpiOverloadedArgs)) this.FolderImageIndex = FolderImageIndex;
}
EpiTreeBinding.prototype.get_DateTimeFormats=function()
{
    if((this.DateTimeFormats==null || this.DateTimeFormats.length==0) && this.DateTimeFormat!=null)
    {
        this.DateTimeFormats = [this.DateTimeFormat];
    }
        
    if(this.DateTimeFormats!=null)
    {
        for(var itm in this.DateTimeFormats)
        {
            if(this.DateTimeFormats[itm]=="d") this.DateTimeFormats[itm]="MM/dd/yyyy";
        }
    }
        
    return this.DateTimeFormats;
}

var EpiChunk = Epicor.Mfg.UI.FrameWork.EpiChunk=function()
{
    EpiObject.call(this, "EpiChunk");

    this.CHUNK_SIZE = 7000;
    this.chunkQ = new Queue();
}

EpiChunk.prototype.stringToChunkQueue=function(str)
{
    this.chunkQ.Clear();
    this.recursiveChunker(str);
}
EpiChunk.prototype.recursiveChunker=function(str)
{
    var sb = new StringBuilder(str, new EpiOverloadedArgs("String"));

    sb.Replace("\r", String.Empty);		// ** remove CR character

    while (sb.get_Length() > this.CHUNK_SIZE)
    {
        this.chunkQ.Enqueue(sb.ToString(0, this.CHUNK_SIZE));
        sb.Remove(0, this.CHUNK_SIZE).ToString();
    }
    if (sb.get_Length() > 0)
        this.chunkQ.Enqueue(sb.ToString());
}
EpiChunk.StringToChunkQueue=function(str)
{
    var es = new EpiChunk();
    es.stringToChunkQueue(str);
    return es.chunkQ;
}


var EpiBindingManager=Epicor.Mfg.UI.FrameWork.EpiBindingManager=
{
    GetLikeValue:function(EpiBinding)
    {
        var column = EpiBindingManager.GetColumnName(EpiBinding);
        var theView = EpiBindingManager.GetEpiDataView(EpiBinding);
        
        if (theView == null || !theView.dataView.Table.Columns[column]) return String.Empty;

        return theView.dataView.Table.GetExtendedProperty(column, "Like");

    },
    GetEpiBindingFromLike:function(Like,dv)
    {
        for(var dc in dv.dataView.Table.Columns)
        {
            if (dv.dataView.Table.GetExtendedProperty(dc,"Like") == Like)
                return (String.IsNullOrEmpty(dv.ViewName) || Global.BindingEngine.EpiDataViewsDangling.Contains(dv)) ? dc : dv.ViewName + "." + dc;
        }
        return null;
    },
    GetEpiDataView:function(EpiBinding, globalObj)
    {
        var viewN="";
        if (EpiBinding != null && EpiBinding.indexOf(".") > 0)
            viewN = EpiBinding.Substring(0, EpiBinding.indexOf("."));
        if (viewN)
        {
            if (globalObj)
                return globalObj.BindingEngine.EpiDataViews[viewN];
            else
                return Global.BindingEngine.EpiDataViews[viewN];
        }
        else 
            return null;
    },
    GetColumnName:function(EpiBinding)
    {
        var column = "";
        if (EpiBinding != null && EpiBinding.indexOf(".") > 0)
            column = EpiBinding.substring(EpiBinding.indexOf(".") + 1);
        return column;
    },
    GetCurrentValue:function(EpiBinding, globalObj)
    {
        var column = this.GetColumnName(EpiBinding);
        var theView = this.GetEpiDataView(EpiBinding,globalObj);
        if (theView == null || theView.Row < 0 ||
            !theView.dataView.Table.Columns[column]) return String.Empty;

        return theView.dataView.Rows[theView.Row][column].toString();
    }
    
}

var BAQMarkupHandler=Epicor.Mfg.UI.FrameWork.BAQMarkupHandler=
{
  START_MARKUP_TOKEN:"[",
  END_MARKUP_TOKEN: "]",
  MARKUP_DELIM: ":",
  ParseStringMarkup:function(SourceString,EpiX)
  {
     if (!this.hasMarkupString(SourceString)) return SourceString;
     var markup = this.getMarkupString(SourceString);
     return this.ParseStringMarkup(SourceString.replace(markup, this.convertMarkup(markup, EpiX)), EpiX);
  },
  GetWhereItemMarkupColumns:function(BAQView)
  {
    // set the collection of Columns filtered by Markup
    var whereItemMarkupColumnList = new ArrayList();
    // enum the QueryWhereItem rows on QDDS
    var queryDt = BAQView.runtimeQueryData.Tables["QueryWhereItem"];
    for(var row in queryDt.Rows)
    {
        row = queryDt.Rows[row];
        if (BAQView.EpiX != null && queryDt.Columns["IsConst"] &&
            queryDt.Columns["RValue"] && Convert.ToBoolean(row["IsConst"].toString()))
        {
            // do we have mark up value
            if (!String.IsNullOrEmpty(this.convertMarkup(row["RValue"].toString(), BAQView.EpiX)))    
            {
                //  add the filter column to collection of whereItemMarkupColumnList
                if (queryDt.Columns["DataTableID"] && queryDt.Columns["FieldName"])
                {
                    var sColName = row["DataTableID"].toString() + "." + row["FieldName"].toString();
                    if (!whereItemMarkupColumnList.Contains(sColName)) whereItemMarkupColumnList.Add(sColName);
                }
            }
        }
    }
    return whereItemMarkupColumnList;
  },
  ParseWhereItemMarkup:function(BAQView)
  {
    // enum the QueryWhereItem rows on QDDS
    var dt = BAQView.runtimeQueryData.Tables["QueryWhereItem"];
    for(var row in dt.Rows)
    {
        row = dt.Rows[row];
        var theValue = "";
        if (dt.Columns["IsConst"] &&
            dt.Columns["RValue"] && Convert.ToBoolean(row["IsConst"].toString()))
        {
            var rVal = row["RValue"].toString();
            // parse the BAQMarkup and return the value
            theValue = this.convertMarkup(rVal);
            if (!String.IsNullOrEmpty(theValue))    // we have mark up value
            {
                // reset the QueryWhereItem row value and add the filter column to collection of Marked up
                row["RValue"] = theValue;
                //row.AcceptChanges();
            }
        }
    }
  },
  convertMarkup:function(MarkupString)
  {
    // verify the MarkupString is in the Format of "{Type:Binding}" when Type == "LIKE" then we use the Binding value to seek
    // out the first column that has that LIKE value and will then return that Column's DataValue.
    // when Type != "LIKE" then we use the Binding value to seek out that Column's DataValue
    MarkupString = this.getMarkupString(MarkupString);
    if (String.IsNullOrEmpty(MarkupString)) return null;

    var theValue = null;
    // parse MarkupString
    MarkupString = MarkupString.substr(1, MarkupString.length - 2);
    var markupType = MarkupString.substr(0, MarkupString.indexOf(":"));
    var markupColumn = MarkupString.substr(MarkupString.indexOf(":") + 1);

    switch (markupType.toUpperCase())
    {
        case "LIKE": // Get the Value from the LIKE binding
            // Since we need the views from the parent, use the parent;s Global object
            var parentGlobal = Global.window.parent.window.Global;
            if (!parentGlobal) return;
            var views = parentGlobal.BindingEngine.EpiDataViews;
            for (var entry in views)
            {
                var view = views[entry];
                if (String.IsNullOrEmpty(theValue) && view != null)
                {
                    // get the EpiBinding from the Like value
                    var theColumnn = EpiBindingManager.GetEpiBindingFromLike(markupColumn, view);
                    if (!String.IsNullOrEmpty(theColumnn))
                    {
                        // now see if that LIKE value's binding has data
                        theValue = EpiBindingManager.GetCurrentValue(theColumnn,parentGlobal);
                        if (!String.IsNullOrEmpty(theValue)) continue;
                    }
                }
            }
            break;
        default:
            // see if the EpiBinding has Data
            theValue = EpiBindingManager.GetCurrentValue(markupColumn);
            break;
    }
    return theValue;
  },
  getMarkupString:function(SourceString)
    {
        if (!this.hasMarkupString(SourceString)) return null;
        // local members 
        var startPos = SourceString.indexOf(this.START_MARKUP_TOKEN);
        var endPos = SourceString.indexOf(this.END_MARKUP_TOKEN);
        return SourceString.substr(startPos, endPos - startPos + 1);
    },
    hasMarkupString:function(SourceString)
    {
        // local members 
        var startPos = SourceString.indexOf(this.START_MARKUP_TOKEN);
        var endPos = SourceString.indexOf(this.END_MARKUP_TOKEN);
        // if its a non-starter
        if (startPos < 0) return false;
        var delimPos = SourceString.substr(startPos).indexOf(this.MARKUP_DELIM) + startPos;
        // verify
        return !(String.IsNullOrEmpty(SourceString) ||
            startPos < 0 || endPos <= startPos ||
            delimPos >= endPos);
    }
}

//----------- Epicor.Mfg.UI.Broadcast
var BroadcastTower = Epicor.Mfg.UI.Broadcast.BroadcastTower=function()
{
    EpiObject.call(this, "BroadcastTower");
    this.Publishers = new Hashtable();
}
BroadcastTower.prototype=new EpiObject();

BroadcastTower.prototype.RegisterPublisher=function(Publisher)
{
	if (this.IsBroadcasting(Publisher.PublishKey))
		this.Publishers.set_Item(Publisher.PublishKey,Publisher);
	else
		this.Publishers.Add(Publisher.PublishKey, Publisher);
}
BroadcastTower.prototype.DeregisterPublisher=function(Publisher)
{
	if (this.IsBroadcasting(Publisher.PublishKey))
		this.Publishers.Remove(Publisher.PublishKey);
}
BroadcastTower.prototype.IsBroadcasting=function(PublishKey)
{
	return this.Publishers.ContainsKey(PublishKey);
}
BroadcastTower.prototype.Publish=function(Publisher, args)
{
	if (this.IsBroadcasting(Publisher.PublishKey))
		this.OnPublish(Publisher, args);
}
BroadcastTower.prototype.OnPublish=function(Publisher, args)
{
    if (this.get_Event("Broadcast").subscribers.length > 0)
    {
        args.Publisher = Publisher;
        this.get_Event("Broadcast").fire(args);
    }
}

var BroadcastClient = Epicor.Mfg.UI.Broadcast.BroadcastClient=function()
{
    EpiObject.call(this, "BroadcastClient");
    this.BroadcastTower = new BroadcastTower();
}
var PublishType = Epicor.Mfg.UI.Broadcast.PublishType={"EpiTransaction":0,"DashBoard":1,"Custom":2,"FKV":3};
var PublishAgent = Epicor.Mfg.UI.Broadcast.PublishAgent=function(sender,Name,EpiBinding)
{
    EpiObject.call(this, "PublishAgent");
    this.PublishKey = Guid.NewGuid();
	this.PublishName = Name;
	this._initiator = sender;
	this._bindingString = EpiBinding;
	if (this._bindingString !=null && this._bindingString.length>0)
	{
		this._viewName = this._bindingString.Substring(0, this._bindingString.IndexOf("."));
		this.ColumnName = this._bindingString.Substring(this._bindingString.IndexOf(".")+1);
		var dv = Global.BindingEngine.EpiDataViews[this._viewName];
		if (dv)
		{
		    dv.get_Event("EpiRowChanged").subscribe(this.OnPublishRowChange,this,true);
		    dv.get_Event("ColumnChanged").subscribe(this.OnPublishColumnChange,this,true);
		}
	}
}
PublishAgent.prototype = new EpiObject();


// Every publisher registers for row change event and fires the broadcast event.
PublishAgent.prototype.OnPublishRowChange=function(args)
{
    if (this.inBroadCast) return;
    
    this.pea = {};//PublishEventArgs();
    
    if (args.CurrentView.dataView.Table.ColumnsContains(this.ColumnName) && args.CurrentRow>=0)
	{
		var undoit = false;
		if (args.LastRow > args.CurrentRow && args.CurrentView.dataView.Count-1 <= args.LastRow) undoit = true;
		if(args.CurrentView.dataView.Count > 0 && args.CurrentView.Row > -1)
		{
		   
			if (undoit || (args.LastRow == -1 && args.CurrentRow == 0) || (args.LastRow>=0 && args.CurrentView.dataView.get_Row(args.LastRow).get_Item(this.ColumnName).toString() != args.CurrentView.dataView.get_Row(args.CurrentRow).get_Item(this.ColumnName).toString()))
			{
			    var newVal = args.CurrentView.dataView.get_Row(args.CurrentRow).get_Item(this.ColumnName).toString();
			
			    if (args.CurrentView.dataView.Table.Columns[this.ColumnName].DataType =="System.DateTime")
			    {
			        var origVal = newVal;
			        try
                    {
                        newVal = FormatEngine.ToDate(newVal, "global");
                        if(isNaN(newVal)) newVal = FormatEngine.ToDate(origVal);
                    }
                    catch(err)
                    {
                        newVal = "";
                    }
                    newVal = FormatEngine.FormatDate(newVal);
			    }
                              
				this.pea.NewValue = newVal;
                listChangedToValue = this.pea.NewValue; 
				try 
				{
					this.inBroadCast = true;
                    Global.BroadcastClient.BroadcastTower.Publish(this, this.pea); 
                    this.inBroadCast = false;
				} 
				catch (exc) 
				{
					ExceptionBox.Show(exc);
				}
			}
		}
	}
}

PublishAgent.prototype.OnPublishColumnChange=function(sender, e)
{
    if (this.inBroadCast) return;
	var colNam = e.Column.ColumnName;
	var nValue = e.ProposedValue.toString();

	if (colNam == this.ColumnName)
	{
		// construct the BroadcastEA & Publish
		this.pea = {};//new PublishEventArgs();
		
		var dv = Global.BindingEngine.EpiDataViews[this._viewName];
	    if (dv && dv.dataView.Table.Columns[colNam].DataType =="System.DateTime")
	    {
	        var origVal = nValue;
	        try
            {
                nValue = FormatEngine.ToDate(nValue, "global");
                if(isNaN(nValue)) nValue = FormatEngine.ToDate(origVal);
            }
            catch(err)
            {
                nValue = "";
            }
            nValue = FormatEngine.FormatDate(nValue);
	    }
	    
		this.pea.NewValue = nValue;
		//listChangedToValue = pea.NewValue;

		try 
		{
		   this.inBroadCast = true;
           Global.BroadcastClient.BroadcastTower.Publish(this, this.pea); 
           this.inBroadCast = false;
		} 
		catch (exc) 
		{
			ExceptionBox.Show(exc);
		}
	}
}
PublishAgent.GetPublisher=function(PublishKey)
{
	if (Global.BroadcastClient.BroadcastTower.IsBroadcasting(PublishKey))
		return Global.BroadcastClient.BroadcastTower.Publishers.get_Item(PublishKey);
	else 
		return null;
}

PublishAgent.RegisterTransactionEvent=function(sender,Name,EpiBinding)
{
	var agent = new PublishAgent(sender, Name, EpiBinding);
	agent.Type = PublishType.EpiTransaction;
	Global.BroadcastClient.BroadcastTower.RegisterPublisher(agent);
	return agent;
}
PublishAgent.prototype.GetLastPublishedValue=function()
{
    if (this.pea == null) return null;
    return this.pea.NewValue;
}

var SubscribeAgent = Epicor.Mfg.UI.Broadcast.SubscribeAgent=function(binding)
{
    EpiObject.call(this, "SubscribeAgent");
    this.ColumnName = binding;
	this.SubscribeKey = Guid.NewGuid();
	this._isGlobal = true;
    Global.BroadcastClient.BroadcastTower.get_Event("Broadcast").subscribe(this.BroadcastTower_Broadcast, this,true); 
}
SubscribeAgent.prototype = new EpiObject();

SubscribeAgent.RegisterSubscriber=function(bindingColumnOrGuid)
{
    if (Global.IsString(bindingColumnOrGuid))
    {
	    var agent = new SubscribeAgent(bindingColumn);
	    return agent;
	}
	else
	{ 
        var p = PublishAgent.GetPublisher(bindingColumnOrGuid);
		if (p == null) return null;
		var agent = new SubscribeAgent(p.ColumnName);
		agent.PublisherKey = bindingColumnOrGuid;
		agent._publisher = p;
		agent._isGlobal = false;
		return agent;
	}
}

SubscribeAgent.prototype.BroadcastTower_Broadcast=function(args)
{
    var Publisher = args.Publisher;
    if ((this._isGlobal && Publisher.ColumnName.Equals(this.ColumnName))
        || (!this._isGlobal && Publisher.Equals(this._publisher))) 
	{   
	    this.OnBroadcast(args);
	}
	
}

SubscribeAgent.prototype.OnBroadcast=function(args)
{
	try 
	{
		if (this.get_Event("BroadcastAlert").subscribers.length > 0)
			this.get_Event("BroadcastAlert").fire(args);
	} 
	catch (ex)
	{
//		TraceProvider.TraceCatchException(ex);
	}
}

SubscribeAgent.prototype.UnSubscribe=function()
{
	Global.BroadcastClient.BroadcastTower.get_Event("Broadcast").unsubscribe(this.BroadcastTower_Broadcast,this);
}
SubscribeAgent.prototype.DeregisterPublisher=function(agent)
{
	Global.BroadcastClient.BroadcastTower.DeregisterPublisher(agent);
}
// EpiUIImages

var EpiUIImages = Epicor.Mfg.UI.EpiUIImages =
{
    Loc:"",
    GetImage:function(AltIndx)
    {
        return img = new Image(AltIndx,"img/" + AltIndx + ".png");
    },
    IndexOf:function(AltIndex){ return AltIndex;},
    SmallEnabledImages:new ImageList(),
    LargeEnabledImages:new ImageList(),
    LargeDisabledImages:new ImageList(),
    SmallDisabledImages:new ImageList(),
    ImageSizes:{"Small":0,"Large":1},
    ImageAppearanceTypes:{ Enabled:0, Disabled:1 },
    ImageFlavors:{Vantage:0, Vista:1, Base:2, Custom:3 }
};
EpiUIImages.SmallDisabledImages.IsDisabledList = true;

var EpiImages = Epicor.Mfg.UI.EpiImages=
{
    "get_LargeImages":function(){return {};},
    "get_SmallImages":function(){return{};}
};

// ---------- Epicor.Mfg.Lib
var AssemblyReflector = Epicor.Mfg.Lib.AssemblyReflector=
{
    LoadAssembly:function(assemblyFileName) {return new Assembly(assemblyFileName); }

}

// ---------- Epicor.Mfg.UI.Customization
var CustomizeMode=Epicor.Mfg.UI.Customization.CustomizeMode={"StandardCustomization":0,"StandardPersonalization":1,"DashboardTracker":2};

var ForeignKeyViewInfo=Epicor.Mfg.UI.Customization.ForeignKeyViewInfo=function()
{
    this.SubTableViewsHT = new Hashtable();
    this.KeyColumns = new Queue();
}
var ChildViewInfo=Epicor.Mfg.UI.Customization.ChildViewInfo=function()
{
   this.ParentViewColumnLinksHT = new Hashtable();
   this.ChildViewColumnLinksHT = new Hashtable();
   this.SubTableViewsHT = new Hashtable();
}

var PersonalizeCustomizeManager = Epicor.Mfg.UI.Customization.PersonalizeCustomizeManager=function()
{
    EpiObject.call(this, "PersonalizeCustomizeManager");
    this.CustControlMan={};
    this.CustControlMan.CustomControlsHT =new Hashtable();
    this.ControlsHT = new Hashtable();
}
PersonalizeCustomizeManager.prototype = new EpiObject();

// Predefine the static classes so that we dont see an error if they are not defined in the custom script
var Script=Script_BE=Script_PE=Script_V=Script_L=Script_C=
{
    InFramework:true // The actual custom code should override this definition.
}

var CustomScriptManager = Epicor.Mfg.UI.Customization.CustomScriptManager=function()
{
    EpiObject.call(this, "CustomScriptManager");
    this.CustomizeMode = CustomizeMode.StandardCustomization; // TODO: set to Dashboard Tracker when customization for dashboards is supported.
    this.TransAdaptersHT = new Hashtable();
    this.PersonalizeCustomizeManager = new PersonalizeCustomizeManager();
    this.scriptObjects = [];
    this._fillScriptObjects();
}

CustomScriptManager.prototype._fillScriptObjects=function()
{
    
    if (!Script_BE.InFramework)
    {
        if (Script_BE._isStatic)
            this.scriptObjects.push(Script_BE);
        else
            this.scriptObjects.push(new Script_BE());
    }
    if (!Script_PE.InFramework)
    {
        if (Script_PE._isStatic)
            this.scriptObjects.push(Script_PE);
        else
            this.scriptObjects.push(new Script_PE());
    }
    if (!Script_V.InFramework)
    {
        if (Script_V._isStatic)
            this.scriptObjects.push(Script_V);
        else
            this.scriptObjects.push(new Script_V());
    }
    if (!Script_L.InFramework)
    {
        if (Script_L._isStatic)
            this.scriptObjects.push(Script_L);
        else
            this.scriptObjects.push(new Script_L());
    }
    if (!Script.InFramework)
    {
        if (Script._isStatic)
            this.scriptObjects.push(Script);
        else
            this.scriptObjects.push(new Script());
    }
}

CustomScriptManager.prototype.CallCustomFormLoad=function(sender,args)
{
    var fnName = Global.Form.ID + "_Load";
    // Invoke Load method on every layer available in this order: BaseExtension->Productization->Verticalization->Localization->Customization 
    // The topmost layer's code will always be within a class called Script. So if we are generating the code for a Base extension, the code for it
    // will be within a class called Script. But if we have a Verticalization over a Base Extension, code for Verticalization will be within Script
    // and code for Base Extension will be in Script_BE.
    for (var i=0,scriptObj; scriptObj = this.scriptObjects[i]; i++)
    {
        if (scriptObj[fnName])
            scriptObj[fnName].call(scriptObj,sender,args);
    }
}
CustomScriptManager.prototype.InitCustomGlobalVars=function()
{
    // Invoke the methods on every layer available in this order: BaseExtension->Productization->Verticalization->Localization->Customization 
    // The topmost layer's code will always be within a class called Script. So if we are generating the code for a Base extension, the code for it
    // will be within a class called Script. But if we have a Verticalization over a Base Extension, code for Verticalization will be within Script
    // and code for Base Extension will be in Script_BE.
    for (var i=0,scriptObj; scriptObj = this.scriptObjects[i]; i++)
    {
        if (scriptObj.InitializeGlobalVariables)
            scriptObj.InitializeGlobalVariables(this);
        if (scriptObj.SetExtendedProperties)
            scriptObj.SetExtendedProperties();
    }
}
CustomScriptManager.prototype.InitCustomScript=function()
{
    if (Script.InFramework) return; // Script is a global static object that contains the custom code.
   
    Script._inInitCustomCode = true;
    for (var i=0,scriptObj; scriptObj = this.scriptObjects[i]; i++)
    {
       if (scriptObj.InitializeCustomCode)
            scriptObj.InitializeCustomCode();
    }
    Script._inInitCustomCode = false;
}

CustomScriptManager.prototype.GetNativeControlReference=function(epiGuid)
{
    var ctrls = Global.BindingEngine.Controls;
     
    if (this.ctrlGuidMap && this.ctrlGuidMap.ContainsKey(epiGuid))
        return ctrls[this.ctrlGuidMap[epiGuid]];
   
    // If its a base control, get it from the EpiGuids list
    var id = Global.Form.GetControlIDByGuid(epiGuid)
    if (id ) return ctrls[id];
    
    // Hard way (might be a custom control) - have to go through the Global controls and find the control for this epiguid
    var ctrl;
    for (var c in ctrls)
    {
        var ctrl = ctrls[c];
        if (ctrl.EpiGuid == epiGuid)
            return ctrl;
    }
    return null;
}
CustomScriptManager.prototype.GetRetrieverCombo=function(name)
{
    var retrieverCombo = Global.BindingEngine.Controls[name];
    
    if (Global.Form instanceof EpiBaseForm)
        FormFunctions.ComboRetrieveCustom(retrieverCombo);  // Call old method for EpiBaseForm
    else
        FormFunctions.ComboRetrieve(retrieverCombo);
        
    return retrieverCombo;
}
CustomScriptManager.prototype.GetAdapter=function(owner,adapterName,memberName)
{
    var adapter = Global.Form.trans[memberName];
    if (adapter != null)
    {
        // TODO: Added additional check for adapter Name
    }
    return adapter;
}
CustomScriptManager.prototype.GetGlobalInstance=function(name)
{
    try
		{
			if (name == "oTrans") // ** EpiTransaction object **
                return Global.Form.trans;
            else if (name == Global.Form.get_Name().Replace("-", "_")) // ** event source item is Parent Form **
                return Global.Form;
            else if (name == "DBTVP_" + Global.Form.get_Name().Replace("-", "_")) // ** event source item is Tracker Panel **
                return Global.Form;
            else if (name == "baseToolbarsManager") // ** event source item is UltraToolbarsManager **
            {
                if (Global.Form.baseToolbarsManager)
                    return Global.Form.baseToolbarsManager;
                else if (Global.Form.ToolManager)
                    return Global.Form.ToolManager;
                else return null;
            }
            else if (name == "TrackerQueryView")  // ** event source item is TrackerQueryView **
            {
                return this.oQueryView; // TODO: Appbuilder
            }
            else if (name == "TrackerEvents")
            {
                return this.iTrackerEvents; // TODO: Appbuilder
            }
            else if (name.Substring(name.LastIndexOf("_"), name.length - name.LastIndexOf("_")) == "_Row") // ** event source item is EpiDataView **
            {
                var key = name.Replace("_Row", "");
                if (Global.BindingEngine.EpiDataViews[key] != null)
                    return Global.BindingEngine.EpiDataViews[key];
                    // TODO: Appbuilder
//                if (this.PersonalizeCustomizeManager.ForeignKeyViews != null)
//                {
//                    return this.PersonalizeCustomizeManager.ForeignKeyViews[key];
//                }
            }
            else if (name.Substring(name.LastIndexOf("_"), name.length - name.LastIndexOf("_")) == "_Column") // ** event source item is DataTable **
            {
                var key = name.Replace("_Column", "");
                if (Global.BindingEngine.EpiDataViews[key] != null)
                    return Global.BindingEngine.EpiDataViews[key].dataView.Table;
                else
                {
                    for (var deEDV in Global.BindingEngine.EpiDataViews)
                    {
                        var edView = Global.BindingEngine.EpiDataViews[deEDV];
                        if (edView.dataView.Table.TableName == key)
                            return edView.dataView.Table;
                    }
                }
                
                // TODO : Appbuilder
//                if (this.PersonalizeCustomizeManager.ForeignKeyViews != null)
//                {
//                    if (this.PersonalizeCustomizeManager.ForeignKeyViews.ContainsKey(key))
//                        return ((ForeignKeyDataView)this.PersonalizeCustomizeManager.ForeignKeyViews[key]).dataView.Table;
//                    else
//                        return null;
//                }
                return null;

            }
            else  // ** event source item is a Control **
            {
                // var pos = name.IndexOf("_");
                var eventKey = name;
                // if (pos != -1)
                //     eventKey = name.Remove(0, pos + 1);
                //eventKey = eventKey.Replace("_", "-");
                var ctrl = Global.BindingEngine.Controls[eventKey];

                if(!ctrl)
                {
                    ctrl = Global.BindingEngine.Controls[name];
                }


                if (ctrl && ctrl.EpiGuid)
                {
                    // ctrlGuidMap maps the epiguids to the ID for the custom controls.
                    if (!this.ctrlGuidMap) this.ctrlGuidMap = new Hashtable();
                    this.ctrlGuidMap.Add(ctrl.EpiGuid, eventKey);
                }
                return ctrl;
            }
		}
		catch (ex) { ExceptionBox.Show(ex, "GetGlobalInstance"); }
		return null;

}
CustomScriptManager.prototype.GetBO=function(scriptObj, boName, forceReload)
{
    var ad=scriptObj;
    if (boName == "DynamicQuery")
    {
        ad = Global.LoadedAdapters["DynamicQueryAdapter"];
        if (!ad)
            ad = Global.GetAdapter("DynamicQueryAdapter",Global.Form.trans); // Need this for the QueryDesignDataSet
    }
    var bo = Global.GetBO(ad,boName,forceReload);
    return bo;
}
CustomScriptManager.prototype.CallAddForeignKeyView=function(colName,viewName,tableName,epiGuid,adapterName,getByType,parViewName,defaultAdapter,subTableViews)
{
    var _success = true;
    try
    {
        if (this.CustomizeMode == CustomizeMode.DashboardTracker)
        {
            // TODO: Dashboards. See ECL.PersonalizeCustomizeManager.CallAddForeignKeyView
        }
        else if (this.CustomizeMode == CustomizeMode.StandardCustomization)
        {
            // ** create foreign Key view **
            var fkAgent = new ForeignKeyAgent();
            fkAgent.RegisterView(Global.Form.trans, colName, viewName, tableName, new EpiOverloadedArgs("EpiTransaction_String_String_String"));
            //this.ExtractDataViews(this.Transaction.EpiDataViews); // Not needed at runtime for EWA
           //  this.SetCustomColumnLikeProperty(viewName); TODO
        }

        // ** load ForeignKeyView info **
        var fkvInfo = new ForeignKeyViewInfo();
        fkvInfo.ViewName = viewName;
        fkvInfo.ColumnName = colName;
        fkvInfo.TableName = tableName;
        fkvInfo.AdapterName = adapterName;
        fkvInfo.GetByType = getByType;
        fkvInfo.ParentViewName = parViewName;
        fkvInfo.DefaultAdapter = defaultAdapter;

        if (parViewName == "TrackerQueryView")
            fkvInfo.ParentIsQuery = true;
        else
            fkvInfo.ParentIsQuery = false;

        fkvInfo.EpiGuid = epiGuid;
        if (!this.htForeignKeyInfo) this.htForeignKeyInfo = new Hashtable();
        if (!this.htForeignKeyInfo.ContainsKey(viewName))
            this.htForeignKeyInfo.Add(viewName, fkvInfo);

        // ** add sub table table views **
        if (subTableViews) this.AddForeignKeySubTableViews(epiGuid, subTableViews);
    }
    catch (ex) { ExceptionBox.Show(ex, "CallAddForeignKeyView"); _success = false; }

    return _success;
}

CustomScriptManager.prototype.CallAddForeignMultiKeyView=function(bindings, viewName, tableName, epiGuid, like, adapterName,subTableViews)
{
    var _success = true;

    if (this.CustomizeMode == CustomizeMode.DashboardTracker)
    {
        // TODO - Dashboards
    }
    else if (this.CustomizeMode == CustomizeMode.StandardCustomization)
    {
        // ** create foreign multi-Key view **
        var fkAgent = new ForeignKeyAgent();
        fkAgent.RegisterView(Global.Form.trans, bindings, viewName, tableName, like, new EpiOverloadedArgs("EpiTransaction_StringArr_String_String_String"));
        //this.ExtractDataViews(this.Transaction.EpiDataViews); // Not needed by EWA
        // this.SetCustomColumnLikeProperty(viewName); // TODO: Dont know whether it works in the win
//        var dvFMKV = Global.BindingEngine.EpiDataViews[viewName].dataView;
//        if (!this.ForeignKeyDataViews.ContainsKey(viewName))
//        {
//            this.ForeignKeyDataViews.Add(viewName, dvFMKV);
//        }
    }

    // ** load ForeignKeyView info **
    var fkvInfo = new ForeignKeyViewInfo();
    var parentViewName = "";
    var colName = "";
    var parts=[];
    for (var i = 0; i < bindings.length; i++)
    {
        fkvInfo.KeyColumns.Enqueue(bindings[i]);

        parts = bindings[i].split('.');
        if (parentViewName != "") parentViewName += "~";
        if (colName != "") colName += "~";

        parentViewName += parts[0];
        colName += parts[1];
    }
    fkvInfo.MultiKey = true;
    fkvInfo.ViewName = viewName;
    fkvInfo.EpiGuid = epiGuid;
    fkvInfo.TableName = tableName;
    fkvInfo.AdapterName = adapterName;
    fkvInfo.LikeValue = like;
    fkvInfo.ParentViewName = parentViewName;
    fkvInfo.ColumnName = colName;
    
    if (!this.htForeignKeyInfo) this.htForeignKeyInfo = new Hashtable();
    
    if (!this.htForeignKeyInfo.ContainsKey(viewName))
        this.htForeignKeyInfo.Add(viewName, fkvInfo);

    // ** add sub table table views **
    if (subTableViews) this.AddForeignKeySubTableViews(epiGuid,subTableViews);

    return _success;
}

CustomScriptManager.prototype.AddForeignKeySubTableViews=function(keyParent,subTableViews)
{
    try
    {
        var keyGuid = "";
        
        //subTableViews = {'ChildViews':[{'CKey':'fd7b80d7-af9f-4a20-ac72-6fc1af00ddc0','PV':'PartMaster','CV':'PartDetail','SubTbl':'PartUOM','PLnkFld':'PartNum','CLnkFld':'PartNum'}]}
        if (subTableViews && subTableViews.ChildViews)
        {
            var dr;
            // ** get associated property records for stv **
            for (var i = 0; i < subTableViews.ChildViews.length; i++)
            {
                dr = subTableViews.ChildViews[i];
                keyGuid = dr["CKey"];
                this.CallAddForeignKeySubTableView(dr.PV, dr.CV, dr.SubTbl, dr.PLnkFld, dr.CLnkFld, keyGuid);
                
                // ** recursively call function for child fkstv **
                if (dr.CV && keyGuid)
                    this.AddForeignKeySubTableViews(keyGuid);
            }
        }
    }
    catch (ex)
    {
        ExceptionBox.Show(ex, "AddForeignKeySubTableViews");
    }
}

CustomScriptManager.prototype.CallAddForeignKeySubTableView=function(parentViewName, childViewName, childTableName, parentLinkFields, childLinkFields, epiGuid)
{
    var _success = true;
    try
    {
        var parLinkFlds = [];
        var chdLinkFlds=[];
        if (parentLinkFields != "")
        {
            parLinkFlds = parentLinkFields.split(':');
            chdLinkFlds = childLinkFields.Split(':');
        }
       

        if (this.CustomizeMode == CustomizeMode.DashboardTracker)
        {
            // TODO: Dashboard
        }
        else if (this.CustomizeMode == CustomizeMode.StandardCustomization)
        {
            // ** create sub table foreign Key view **
            try
            {
                ForeignKeyAgent.AddSubTableView(Global.Form.trans, parentViewName, childViewName, childTableName, parLinkFlds, chdLinkFlds);
                var dvTemp = Global.BindingEngine.EpiDataViews[childViewName].dataView;
                //this.ForeignKeyDataViews.Add(childViewName, dvTemp);
                //this.ExtractDataViews(this.Transaction.EpiDataViews); // Not required for EWA
                // this.SetCustomColumnLikeProperty(childViewName); // TODO
            }
            catch (ex)
            {
                //TraceProvider.TraceCatchException(ex);
                DebugHelper.WriteMessage("Failed in CallAddForeignKeySubTableView",ex);
            }
        }

        // ** set ChildViewInfo object  **
        var cvInfo = new ChildViewInfo();
        cvInfo.ChildViewName = childViewName;
        cvInfo.ParentViewName = parentViewName;
        cvInfo.ChildTableName = childTableName;
        cvInfo.EpiGuid = epiGuid;
        if (parLinkFlds.length > 0)
        {
            for (var i = 0; i < parLinkFlds.length; i++)
            {
                cvInfo.ParentViewColumnLinksHT.Add(i.toString(), parLinkFlds[i]);
                cvInfo.ChildViewColumnLinksHT.Add(i.toString(), chdLinkFlds[i]);
            }
        }
        if (this.htForeignKeyInfo.ContainsKey(parentViewName))
        {
            if (!this.htForeignKeyInfo[parentViewName].SubTableViewsHT.ContainsKey(childViewName))
                this.htForeignKeyInfo[parentViewName].SubTableViewsHT.Add(childViewName, cvInfo);
        }
        else
        {
            // ** add ChildViewInfo object to correct parent Info object **
            for (var de in this.htForeignKeyInfo.items)
            {
                var fkvInfo = this.htForeignKeyInfo.items[de];
                if (fkvInfo.SubTableViewsHT.ContainsKey(parentViewName))
                {
                    if (!fkvInfo.SubTableViewsHT[parentViewName].SubTableViewsHT.ContainsKey(childViewName))
                        fkvInfo.SubTableViewsHT[parentViewName].SubTableViewsHT.Add(childViewName, cvInfo);
                }
                else
                {
                    for(var de1 in fkvInfo.SubTableViewsHT.items)
                    {
                        var itm = fkvInfo.SubTableViewsHT.items[de1];
                        this.EnumerateFKSTV(parentViewName, cvInfo, itm);
                    }
                }
            }
        }
    }
    catch (ex)
    {
        ExceptionBox.Show(ex, "CallAddForeignKeySubTableView");
        _success = false;
    }

    return _success;
}

CustomScriptManager.prototype.EnumerateFKSTV=function(parentFKSTVName, cvInfo, cvInfoParent)
{
    if (cvInfoParent.SubTableViewsHT.ContainsKey(parentFKSTVName))
    {
        cvInfoParent.SubTableViewsHT[parentFKSTVName].SubTableViewsHT.Add(cvInfo.ChildViewName, cvInfo);
        return;
    }
    else
    {
        for(var de in cvInfoParent.SubTableViewsHT.items)
        {
            var cvInfo1 = cvInfoParent.SubTableViewsHT.items[de];
            this.EnumerateFKSTV(parentFKSTVName, cvInfo, cvInfo1);
            return;
        }
    }
}

CustomScriptManager.prototype.SetLikeValue=function(viewName,columnName,likeValue)
{
    // See if we can get the appropriate DataView.
    var dataView = null;
    if (this.CustomizeMode == CustomizeMode.DashboardTracker)
    {
        // TODO: Dashboards
    }
    else if (this.CustomizeMode == CustomizeMode.StandardCustomization)
    {
        var epiDataView = Global.BindingEngine.EpiDataViews[viewName];
        if (epiDataView != null)
        {
            dataView = epiDataView.dataView;
        }
    }

    // Set the ExtendedProperties value if the column exits.
    if (dataView != null)
    {
        if (dataView.Table.Columns[columnName])
        {
            dataView.Table.SetExtendedProperty(columnName,"Like",likeValue);
        }
    }
}


var Serialization = Epicor.Mfg.UI.FrameWork.Serialization =
{
    SerializeAsBinaryString: function (o) { return o; } // Stub method
}

// ---------- Infragistics.Win
var UIElementBorderStyle=Infragistics.Win.UIElementBorderStyle = {"Default":0,"None":1,"Dotted":2,"Dashed":3,"Solid":4,"Inset":5,"Raised":6,"InsetSoft":7,"RaisedSoft":8,"Etched":9,"Rounded1":10,"Rounded1Etched":11,"Rounded4":12,"Rounded4Thick":13,"TwoColor":14};
var SortIndicator=Infragistics.Win.UltraWinGrid.SortIndicator={"None":0,"Ascending":1,"Descending":2,"Disabled":3};
var ColumnStyle=Infragistics.Win.UltraWinGrid.ColumnStyle={"Default":0,"Edit":1,"EditButton":2,"CheckBox":3,"TriStateCheckBox":4,"DropDown":5,"DropDownList":6,"DropDownValidate":7,"Button":8,"DropDownCalendar":9,"Date":10,"DateWithoutDropDown":11,"DateWithSpin":12,"DateTime":13,"DateTimeWithoutDropDown":14,"DateTimeWithSpin":15,"Color":16,"Currency":17,"CurrencyNonNegative":18,"CurrencyPositive":19,"Double":20,"DoubleWithSpin":21,"DoubleNonNegative":22,"DoubleNonNegativeWithSpin":23,"DoublePositive":24,"DoublePositiveWithSpin":25,"Font":26,"Image":27,"ImageWithShadow":28,"Integer":29,"IntegerWithSpin":30,"IntegerPositive":31,"IntegerPositiveWithSpin":32,"IntegerNonNegative":33,"IntegerNonNegativeWithSpin":34,"Time":35,"TimeWithSpin":36,"TimeZone":37,"URL":38,"FormattedText":39,"FormattedTextEditor":40};
var UltraComboStyle=Infragistics.Win.UltraWinGrid.UltraComboStyle={"DropDown":0,"DropDownList":1};
var Activation=Infragistics.Win.UltraWinGrid.Activation={"AllowEdit":0,"ActivateOnly":1,"Disabled":2,"NoEdit":3}
var VisibleRelation=Infragistics.Win.UltraWinGrid.VisibleRelation={"First":0,"Last":1,"Next":2,"Previous":3}
var SelectType=Infragistics.Win.UltraWinGrid.SelectType={"NotSet":0,"None":1,"Single":2,"Extended":3};
var HeaderClickAction=Infragistics.Win.UltraWinGrid.HeaderClickAction={"NotSet":0,"Select":1,"SortSingle":2,"SortMulti":3};
var NumericType=Infragistics.Win.UltraWinEditors.NumericType={"Integer":0,"Double":1,"Decimal":2};
var MaskMode=Infragistics.Win.UltraWinMaskedEdit.MaskMode={"Raw" : 0,"IncludeLiterals" : 1,"IncludePromptChars" : 2,"IncludeBoth" : 3,"IncludeLiteralsWithPadding" : 4};
var PanelSizingMode=Infragistics.Win.UltraStatusBar.PanelSizingMode={"Fixed":"Fixed","Automatic":"Automatic","Adjustable":"Adjustable","Spring":"Spring"};
var PanelStyle=Infragistics.Win.UltraStatusBar.PanelStyle={"ControlContainer":"ControlContainer","Date":"Date","Text":"Text","Time":"Time"};
var ButtonDisplayStyle = Infragistics.Win.ButtonDisplayStyle = {"Always":"Always","Never":"Never","OnMouseEnter":"OnMouseEnter"};

var ValueList = Infragistics.Win.ValueList=function()
{
    EpiObject.call(this,"ValueList");
    this.ValueListItems = new Hashtable();
}
ValueList.prototype = new EpiObject();

var ControlPaneEventArgs=Infragistics.Win.UltraWinDock.ControlPaneEventArgs=function(pane)
{
    this.Pane = pane;
}
var RowsCollection = Infragistics.Win.UltraWinGrid.RowsCollection=function()
{
    ArrayList.call(this, "RowsCollection");
}
RowsCollection.prototype = new ArrayList();
RowsCollection.prototype.CopyTo=function(array, index)
{
    for(var itm in this.items)
    {
        array.splice(index++,0,this.items[itm]);       
    }
}
RowsCollection.prototype.GetRowWithListIndex=function(index)
{
    for(var itm in this.items)
    {
        if(this.items[itm].ListIndex==index) return this.items[itm];
    }
    return null;
}
RowsCollection.prototype.GetAllNonGroupByRows=function()
{
    return this.items;
}
RowsCollection.prototype.get_All=function()
{
    return this.items;
}

var InitializeLayoutEventArgs = Infragistics.Win.UltraWinGrid.InitializeLayoutEventArgs=function (grd)
{
    EpiObject.call(this,"InitializeLayoutEventArgs");
    this.grid = grd;    
}
InitializeLayoutEventArgs.prototype = new EpiObject();
InitializeLayoutEventArgs.prototype.get_Layout=function()
{
    return this.grid.get_DisplayLayout();
}

var Selected = Infragistics.Win.UltraWinGrid.Selected = function(grd)
{
    EpiObject.call(this,"Selected");
    this.grid = grd;    
    
    // selected rows
    this.Rows = new SelectedRowsCollection(this);
  
}
Selected.prototype = new EpiObject();
var SelectedRowsCollection = Infragistics.Win.UltraWinGrid.SelectedRowsCollection=function(selObj)
{
    ArrayList.call(this, "SelectedRowsCollection");
    this.selObj = selObj;
    
    var ctrl = Global.document.getElementById(this.selObj.grid.ID);
    var gridParts = this.selObj.grid._getGridParts(ctrl);
    obj = gridParts["BodyTable"];  
    var edv = Global.BindingEngine.EpiDataViews[this.selObj.grid.DataView];
    for(var ii=0; ii<=obj.rows.length-1; ii++)
    {
        if(obj.rows[ii].className=="selected") 
        {
            var listObj = null;
            if(edv) listObj = edv.dataView.get_Row(ii);
            
            var rowObj = new UltraGridRow(this.selObj.grid, ii);
            rowObj.Element = obj.rows[ii];
            rowObj.ListObject = listObj;

            this.Add(rowObj);
        }
    }
}
SelectedRowsCollection.prototype = new ArrayList();
SelectedRowsCollection.prototype.Clear=function()
{
    for(var row in this.items)
    {
        this.items[row].Element.className = (ii&1)?"odd":"even";
    }
    ArrayList.prototype.Clear.call(this); 
}
SelectedRowsCollection.prototype.AddRange=function(rows)
{
    ArrayList.prototype.AddRange.call(this, rows);
    
    var ctrl = Global.document.getElementById(this.selObj.grid.ID); 
    var gridParts = this.selObj.grid._getGridParts(ctrl);
    obj = gridParts["BodyTable"];
    for(var row in this.items)
    {
        obj.rows[this.items[row]._idx].className = "selected";
    }    
}
SelectedRowsCollection.prototype.get_All=function()
{ 
    return this.items;
}

var ViewStyleBand=Infragistics.Win.UltraWinGrid.ViewStyleBand={"Vertical":0,"Horizontal":1,"OutlookGroupBy":2};
        
var UltraGridBand=Infragistics.Win.UltraWinGrid.UltraGridBand=function(grd)
{
    EpiObject.call(this, "UltraGridRow");
    this._grid = grd;
    this.Columns = {"Count":0};
    this.Columns.items={};
    for (var c in this._grid._columns)
        this.Columns.items[this._grid._columns[c]] = this._grid._columns[c];
	    
    this.Override = {};
    this.BorderStyleCell=0;
    this.BorderStyleRow=0;
}
UltraGridBand.prototype=new EpiObject();
UltraGridBand.prototype.get_Column=function(columnName)
{
    if (Global.IsNumber(columnName))
    {
        var i = 0;
        for (var o2 in this._grid._columns)
	    {
			if (i == columnName) 
			{
			    columnName = this._grid._columns[o2];
			    break;
			}
			i++;
	    }
    }
    var col = Global.GetGridColumn(columnName);
    col.set_SortIndicator(Infragistics.Win.UltraWinGrid.SortIndicator.None);
    col.set_Format=function(fmt) { };
    col.Key = columnName.replace("col","");
    if(col.InGrid) col.OwnerGrid=this._grid.ID;
    return col;
}
UltraGridBand.prototype.GetFirstVisibleCol=function()
{
    return this.get_Column(""); // returns a column structure for now since this is not implemented yet.
}

var UltraGridRow = Infragistics.Win.UltraWinGrid.UltraGridRow=function(grid, idx)
{
    EpiObject.call(this, "UltraGridRow");
    
    this._grid = grid;
    this._idx = idx;
    
    this.ListIndex = idx;

    // Sometimes the references could get mixed up when getting the ListObject based on the ListIndex.
    // Let's get the RowIdent to try to find the correct one.  
    this._rowIdent=null;
    try
    {
        this._rowIdent=Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.Rows[this.ListIndex]["RowIdent"];
    } catch(e){}
}
UltraGridRow.prototype = new EpiObject();
UltraGridRow.prototype.HasChild=function() {return false;}  // we support 1 band only
UltraGridRow.prototype.Activate=function()
{
    this.set_Selected(true);
}
UltraGridRow.prototype.set_Selected=function(flag)
{
    var ctrl = Global.document.getElementById(this._grid.ID); 
    var gridParts = this._grid._getGridParts(ctrl);
    obj = gridParts["BodyTable"];
    if(this._idx>=0)
    {
        if (flag== true)
            obj.rows[this._idx].className = "selected";
        else
            obj.rows[this._idx].className = (this._idx&1)?"odd":"even"; 
    }
}
UltraGridRow.prototype.get_Selected=function()
{
    var ctrl = document.getElementById(this._grid.ID); 
    var gridParts = this._grid._getGridParts(ctrl);
    obj = gridParts["BodyTable"];
    
    return obj.rows[this._idx].className=="selected";
}
UltraGridRow.prototype.get_ListIndex=function()
{
    return this._idx;
}
UltraGridRow.prototype.get_ListObject = function()
{
    if(this._rowIdent&&this._grid.DataView&&Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView)
    {
        var rows = Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.Rows;
        for(var ii=0;ii<=rows.length-1;ii++)
        {
            if(rows[ii]["RowIdent"]==this._rowIdent)
                return Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.get_Row(ii);
        }
    }

    if(this.ListObject)
        return this.ListObject;
    else
        return Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.get_Row(this.ListIndex);
}
UltraGridRow.prototype.Delete=function() {}  // TODO
UltraGridRow.prototype.get_Cell=function(name)
{
    if(Global.IsNumber(name))
    {
        var cnt=0;
        for(var col in this._grid._columns)
        {
            if(cnt==name) 
            {
                name = col;
                break;
            }
            cnt++;
        }
    }

    return new UltraGridCell(this._grid, this._idx, name);
}
UltraGridRow.prototype.CellExists=function(name)
{
    return this._grid._columns[name]!=null;
}
UltraGridRow.prototype.GetSibling=function(sibling)
{
    var rowCnt=this._grid.get_RowCount();
    var idx = this._idx;
    switch(sibling)
    {
        case SiblingRow.First:      idx=0; break;
        case SiblingRow.Last:       idx=rowCnt-1; break;
        case SiblingRow.Next:       idx=this._idx+1; break;
        case SiblingRow.Previous:   idx=this._idx-1; break;
    }
    
    if(idx>rowCnt-1 || idx<0) return null;

    return this._grid.get_Row(idx);    
}

var UltraGridCellCombo = function(val)
{
    this.Value= this.Text = val;
    this.OriginalValue = val;
}
UltraGridCellCombo.prototype.get_Value=function()
{
    if (this.Value == "true") return true;
    if (this.Value == "false") return false;
    return this.Value;
    
}
var UltraGridCell = Infragistics.Win.UltraWinGrid.UltraGridCell=function(grid, idx, name)
{
    EpiObject.call(this, "UltraGridCell");

    this._grid = grid;
    
    this.ID = this._grid._columns[name] || name;
    this.Row = idx;
    
    var grdCtrl = Global.document.getElementById(this._grid.ID);
    this.Control = this._grid.FindGridControl(grdCtrl, idx, this.ID);
    this.Object = Global.BindingEngine.Controls[this.ID];

    this.IsEditorSet = false;
}
UltraGridCell.prototype = new EpiObject();
UltraGridCell.prototype.set_Value=function(val)
{
    var edv=Global.BindingEngine.EpiDataViews[this._grid.DataView];
    if(edv && edv.dataView && edv.dataView.get_Row(this.Row))
    {
        if (this.Object != null)
            Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.get_Row(this.Row).set_Item(this.Object.DataColumn, val);
        else
            Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.get_Row(this.Row).set_Item(this.ID, val);
            
    }
    else if(this.Object != null && this.Control != null) 
        this.Object.SetValue(this.Control,val);

    this._grid.get_Event("AfterCellUpdate").fire(this._grid, {"Cell":this});
}
UltraGridCell.prototype.get_Value=function()
{
    return (this.Object != null && this.Control != null) ? this.Object.GetValue(this.Control) : Global.BindingEngine.EpiDataViews[this._grid.DataView].dataView.get_Row(this.Row).get_Item(this.ID);
}
UltraGridCell.prototype.Activate=function()
{
    if (this.Control)
        this.Object.FocusInGrid(this.Control);
}
UltraGridCell.prototype.set_Editor=function(obj)
{
    if(this.IsEditorSet) return;

    if(this.Control && this.Object)
    {
        var newID = this.Object.ID + "_" + this.Row;
        this.Control.id = newID;

        obj.ID = newID;
        obj.DataView = this.Object.DataView;
        obj.DataColumn = this.Object.DataColumn;
        obj.InGrid = true;
        obj.OwnerGrid = this._grid.ID;

        Global.BindingEngine.Controls[newID] = this.Object = obj;
    }
}

var HeaderBase=Infragistics.Win.UltraWinGrid.HeaderBase=function(ownerCtrl)
{
    this.Control = ownerCtrl; // This control is the control within a grid column
    this.Caption = "";
}
HeaderBase.prototype = new EpiObject();
HeaderBase.prototype.set_Caption=function(caption)
{
    if(this.Control.InGrid &&  this.Control.OwnerGrid)
    {
        var grid = Global.BindingEngine.Controls[this.Control.OwnerGrid];
        if (grid) grid._setColHeaderCaption(this.Control,caption);
        this.Caption = caption;
    }
}

HeaderBase.prototype.get_Caption=function()
{
    if (this.Caption) return this.Caption;
    
    if(this.Control.InGrid &&  this.Control.OwnerGrid)
    {
        var grid = Global.BindingEngine.Controls[this.Control.OwnerGrid];
        if (grid) return grid._getColHeaderCaption(this.Control);
    }
    return "";
}

HeaderBase.prototype.set_VisiblePosition=function(value)
{
    if(this.Control.InGrid && this.Control.OwnerGrid)
    {
        var grid=Global.BindingEngine.Controls[this.Control.OwnerGrid];
        if(grid) 
        {
            grid.MoveColumnInSettings(this.Control.ID, value, true);
        }
    }
}

HeaderBase.prototype.get_VisiblePosition=function()
{
    if (this.Control.InGrid && this.Control.OwnerGrid)
    {
        var grid = Global.BindingEngine.Controls[this.Control.OwnerGrid];
        if (grid) return grid._getColumnControlIndex(this.Control);
    }
    
    return 0;
}

// TODO: this needs to be implemented fully.
var ColScrollRegion=Infragistics.Win.UltraWinGrid.ColScrollRegion=function(){}
ColScrollRegion.prototype.Scroll=function(){}
ColScrollRegion.prototype.Split=function(){}
ColScrollRegion.prototype.ScrollColIntoView=function(){}

var ColScrollRegionsCollection=Infragistics.Win.UltraWinGrid.ColScrollRegionsCollection=function()
{
    ArrayList.call(this,"ColScrollRegionsCollection");
    this.AddRange([new ColScrollRegion(),new ColScrollRegion()]); // Add 2 objects by default
}
ColScrollRegionsCollection.prototype = new ArrayList();

// Not putting all the actions now, because there are so many.  Will add as we need.
var UltraGridAction=Infragistics.Win.UltraWinGrid.UltraGridAction={"EnterEditMode":0};
var UltraComboAction=Infragistics.Win.UltraWinGrid.UltraComboAction={"ToggleDropdown":0,"Dropdown":1,"CloseDropdown":2,"UndoChange":3,"NextRow":4,"PrevRow":5,"FirstRow":6,"LastRow":7,"PageUp":8,"PageDown":9};
var Scrollbar = Infragistics.Win.UltraWinGrid.Scrollbar={"Default":0,"Show":1,"ShowIfNeeded":2,"Hide":3};
var SiblingRow = Infragistics.Win.UltraWinGrid.SiblingRow={"First":0,"Last":1,"Next":2,"Previous":3};

var AppearancesCollection = Infragistics.Win.AppearancesCollection=function()
{
    Hashtable.call(this, "AppearancesCollection");
}
AppearancesCollection.prototype = new Hashtable();

AppearancesCollection.prototype.Add = function(key)
{
    var app = new Appearance();
    Hashtable.prototype.Add.call(this,key,app);
    
}
var Appearance = Infragistics.Win.Appearance = function()
{
    EpiObject.call(this, "Appearance");
    this.Image = null;
    this.tool = null;
    this.TextHAlign=null;
    this.TextVAlign=null;
    this.FontData={"Bold":DefaultableBoolean.False};
}
Appearance.prototype = new EpiObject();
Appearance.prototype.ResetBackColor=function(){}
Appearance.prototype.set_Image=function(image)
{
    this.Image = image;
    if (this.tool != undefined && this.tool.UIOwner != null)
        this.tool.SetImage(image); // set image on the actual tool button
}

Appearance.prototype.get_Image=function()
{
    return this.Image;
}
Appearance.prototype.setAppearance=function(newApp)
{
    // the appearance contains the new image we need to set
    if (newApp.Image)
    {
        this.set_Image(newApp.Image);
    }
}

// ----------  Infragistics.Win.UltraWinTree
var DefaultableBoolean = Infragistics.Win.DefaultableBoolean = {"True":0, "False":1};
var ShowExpansionIndicator = Infragistics.Win.UltraWinTree.ShowExpansionIndicator = {"Default":0,"Always":1,"Never":2,"CheckOnDisplay":3,"CheckOnExpand":4}
var HAlign=Infragistics.Win.HAlign={"Default":0,"Left":1,"Center":2,"Right":3};
var VAlign=Infragistics.Win.VAlign={"Default":0,"Top":1,"Middle":2,"Bottom":3};

var Override = Infragistics.Win.UltraWinTree.Override = function(tree)
{
    this.ShowExpansionIndicator = false;
    this.Tree = tree;
    this.NodeAppearance = {"FontData":{"Bold":DefaultableBoolean.False}};
    this.ExpandedNodeAppearance = {"LeftImages":null};
}
Override.prototype.get_NodeAppearance = function()
{
    return this.NodeAppearance;
}
Override.prototype.set_ShowExpansionIndicator=function(val){this.Tree.set_ShowExpansionIndicator(val);}
Override.prototype.set_BorderStyleNode=function(val){}

// ----------  Infragistics.Win.UltraWinToolbars
var ToolsCollectionBase=Infragistics.Win.UltraWinToolbars.ToolsCollectionBase=function(type)
{
    if (!type) type = "ToolsCollectionBase";

    Hashtable.call(this,type);
    this.ToolbarsManager;
}
ToolsCollectionBase.prototype = new Hashtable();
ToolsCollectionBase.prototype.get_Tool=function(key)
{
    if(key!=null)
    {
        if (Global.IsNumber(key)) // By index
        {
            var i =0;
           for(var k in this.items)
           {
                if (i == key)
                    return this.items[k];
                i++;
           }
           return null;
        }
        if(this[key])
            return this[key];
        else
        {
            // Maybe we have a case-sensitivity issue
            var lCase = key.toLowerCase();
            for(var k in this.items)
            {
                if(k.toLowerCase()==lCase) 
                {
                    return this.items[k];
                    break;
                }
            }
        }
    }
    
    return null;
}
ToolsCollectionBase.prototype.Add=function(tool)
{
    if (Global.IsString(tool) && !this.ContainsKey(tool))
    {
        var key = tool;
        var val = arguments[1];
        Hashtable.prototype.Add.call(this,key, val);
    }
    else if (!this.ContainsKey(tool.Key))
        Hashtable.prototype.Add.call(this,tool.Key, tool);
}

ToolsCollectionBase.prototype.AddToolbar=function(tbKey)
{
    var tb =new Toolbar(tbKey, {"Type":"Toolbar"});
    this.Add(tb);
}
ToolsCollectionBase.prototype.AddRange=function(tools)
{
    for (var i=0,tool; tool=tools[i];i++)
    {
        this.Add(tool);
    }
}
ToolsCollectionBase.prototype.IndexOf=function(toolkey) 
{
    var fnd = false;
    var index = 0;
    for(var tool in this.items)
    {
        tool = this[tool];
        if (tool.Key == toolkey)
        {
            fnd= true;
            break;
        }
        index++;
    }
    
    if (fnd) return index;
    else return -1;
}
ToolsCollectionBase.prototype.Exists=function(toolkey)
{
     return this.ContainsKey(toolkey);
}
ToolsCollectionBase.prototype.Contains=function(tool)
{
    return this.ContainsKey(tool);
}
ToolsCollectionBase.prototype.Remove=function(tool) 
{
    if (tool instanceof Tool)
        Hashtable.prototype.Remove.call(this,tool.Key); 
    else
        Hashtable.prototype.Remove.call(this,tool); 
    
}

var ToolsCollection=Infragistics.Win.UltraWinToolbars.ToolsCollection=function(tools)
{
   ToolsCollectionBase.call(this, "ToolsCollection");

   if(tools == undefined) tools =[];

    for(var i=0,tool; tool=tools[i]; i++)
    {
        this.Add(tool);
    }
}
ToolsCollection.prototype = new ToolsCollectionBase();

ToolsCollection.prototype.AddTool=function(toolkey)
{
      var tool = this.ToolbarsManager.Tools[toolkey];
      if (tool) this.Add(tool);
}
ToolsCollection.prototype.AddToolRange=function(keys)
{
    for (var i=0,key; key=keys[i];i++)
    {
        this.AddTool(key);
    }
} 
ToolsCollection.prototype.InsertTool=function(index,key)
{
    var tool = this.ToolbarsManager.Tools[key];
    if (tool == undefined) return;
    if (this[key]) return; // Already exists in the collection
    
    this.Insert(index, key, tool);
    // If this is a popup menu, then we just need to add the tool to the collection since the html is built when menu is opened. 
    // If this is a toolbar, we will need to insert the html for it.  Only if the original
    // initialization has already been completed.
    if ((this.Owner instanceof Toolbar) && !this.ToolbarsManager.initialized)
    {
        // TODO: find the toolbar and insert the html for this tool in it
    }
} 

var SharedProps = Infragistics.Win.UltraWinToolbars.SharedProps = function(ownerTool, caption, visible, category)
{
    this.ownerTool = ownerTool;
    this.AppearancesSmall = new ToolAppearances(this.ownerTool.Appearance);
    this.AppearancesLarge = new ToolAppearances(this.ownerTool.Appearance);
    this.Caption = caption;
    this.Visible = visible;
    this.Category = category;
}
SharedProps.prototype.set_Enabled=function(val)
{
    this.ownerTool.SetEnabled(val);
}
SharedProps.prototype.get_Enabled=function()
{
    return this.ownerTool.Enabled;
}
SharedProps.prototype.set_Visible=function(val)
{
    this.ownerTool.SetVisible(val);
}
SharedProps.prototype.set_Caption=function(val)
{
    this.ownerTool.SetCaption(val);
}

var ToolAppearances = Infragistics.Win.UltraWinToolbars.ToolAppearances=function(appearance)
{
    this.Appearance = appearance;
}
ToolAppearances.prototype.get_Appearance = function() {return this.Appearance;}
ToolAppearances.prototype.set_Appearance = function(app){this.Appearance.setAppearance(app);}

var StateButtonMenuDisplayStyle = Infragistics.Win.UltraWinToolbars.StateButtonMenuDisplayStyle = {"DisplayToolImage":0, "DisplayCheckmark":1}
var Tool = Infragistics.Win.UltraWinToolbars.Tool = function(key, settings, type) // ToolBase
{
    if(!type) type = "Tool";
    EpiObject.call(this, type);
    
    if(!settings) settings = {};
    
    this.Key = key;
    this.UIOwner = null;
    
    var caption = settings.Caption||"";
    caption = EpiString.ReplaceHotKey(caption);

    var visible = true;
    visible = (settings.Visible == false)? false:true;
    var category = settings.Category||"";

    this.Appearance = new Appearance(); // Since we dont have Large and Small appearances, we can share the same appearance object for both set of properties
    this.Appearance.tool = this;
    
    this.SharedProps = new SharedProps(this, caption, visible, category);
    this.InstanceProps = this.SharedProps;

    this.Type = settings.Type||"ButtonTool";
   
    this.Control = settings.Control||"";

    this.ToolTipText = settings.ToolTipText||"";
    if (settings.ImageKey != null)
        this.ImageKey = settings.ImageKey;
    
    this.IsFirstInGroup = settings.IsFirstInGroup||false;
    if (settings.Tools)
        this.toolKeys = settings.Tools; // Array of keys of child tools
    if (settings.DisplayStyle)
        this.DisplayStyle = settings.DisplayStyle;
        
    this.Tools = new ToolsCollection();
    
    var ownerForm = settings.Owner||"";
    if (ownerForm != "") 
    {
        if (Global && Global.Form && Global.Form.myTool && ownerForm == Global.Form.ID)
            this.Tools.ToolbarsManager = Global.Form.myTool;
        else if (Global.BindingEngine.Controls)
        {
            ownerForm = Global.BindingEngine.Controls[ownerForm];
            this.Tools.ToolbarsManager = ownerForm;//Global.Form.myTool;
        }
    }
    else if (Global && Global.Form && Global.Form.myTool) 
        this.Tools.ToolbarsManager = Global.Form.myTool; // Assume if the settings doesnt have the ownerForm its either old code or it belongs to the main form
           
    this.Tools.Owner = this; // Owner of the tools collection
  
    var enabled = true;
    enabled = (settings.Enabled == false)? false:true;
    this.Enabled = enabled;
    
    this.Init = false;
    this.Index = -1;
    
}
Tool.prototype = new EpiObject();

Tool.prototype.InitToolsCollection=function(tbManager)
{
    if (this.Init == true) return;
    
    this.ToolbarsManager = tbManager;

    if (this.Type == "PopupMenuTool")
    {
        this.Tools.ToolbarsManager = tbManager;
        this.Tools.AddToolRange(this.toolKeys);
    }
    this.Init = true;
}

Tool.prototype.SetEnabled=function(val)
{
    this.Enabled = val;
    // Also enable/disable the arrow if it exists
    if (Global.Form && Global.Form.myTool)
    {
        var arr = Global.Form.myTool.Tools["arr_" + this.Key];
        if (arr) arr.Enabled = val;
    }
        
    if(this.UIOwner)
    {
        var toolButtons = this.UIOwner.getElementsByTagName("SPAN");
        for(var ii=0, o; o=toolButtons[ii]; ii++)
        {
            if(o.id==this.Key)
            {
                if(o.className.StartsWith("Menu-ToolButton")) 
                {
                    if(val==false)
                        o.className = "Menu-ToolButton btnDisabled";
                    else
                        o.className = "Menu-ToolButton";
                }
                else
                {
                    if(val==false)
                        o.className = "Menu-Root itemDisabled";
                    else
                        o.className = "Menu-Root";
                }
            }
            else if ("arr_" + o.id == "arr_" + this.Key) // arrow next to the popupmenu
            {
                if(val==false)
                    o.className = "Menu-ToolButton btnDisabled";
                else
                    o.className = "Menu-ToolButton";
            }
        }
    }
}
Tool.prototype._checkSprites=function(img)
{
    var sprites = {"_ReportsTool":0,"Attachment":20,"AuditLog":40,"CallLog":60,"ChangeLog":80,"Clear":100,
    "Copy":120,"Cut":140,"Delete":160,"MemoEmpty":180,"New":200,"Paste":220,"Print":240,"PrintPreview":260,
    "Refresh":280,"Save":300,"SaveMenuTool":300,"Search":320,"TaskTool":340,"ToDo":360,"Undo":380};
            
    if(sprites[img.Name]!=undefined)
    {
        img.Path = "img/_sprites_tools.png";
        img.Pos.Top = sprites[img.Name];
    }
    return img;
}
Tool.prototype.GetImageExt=function()
{
    var img;
    if(this.Appearance.Image!=null)
        img = this.Appearance.Image;
    else if (this.ImageKey && this.ImageKey!='')
        img = new Image(this.ImageKey, "img/" + this.ImageKey + ".png");
    else
        img = new Image(this.Key, "img/" + this.Key + ".png");
     
    return this._checkSprites(img);
}
Tool.prototype.GetImage=function()
{
    if (this.Appearance.Image != null)
        return this.Appearance.Image.Path;
    else
        return "img/" + this.Key + ".png"; //"img/EpicorLogo.png"; // TODO: Fix this later!
}
Tool.prototype.SetImage=function(image)
{
    if(this.UIOwner)
    {
        var toolButtons = this.UIOwner.getElementsByTagName("SPAN");
        for(var ii=0, o; o=toolButtons[ii]; ii++)
        {
            if(o.id==this.Key)
            {
                if(o.className.StartsWith("Menu-ToolButton")) // only for toolbar right now. 
                {
                    image = this._checkSprites(image);
                
                    var imgCtrl = o.childNodes[0].childNodes[0];
                    imgCtrl.style.backgroundImage = "url(./" + image.Path + ")";
                    imgCtrl.style.backgroundPosition = "0px -" + image.Pos.Top + "px";
                    break;
                }
            }
        }
    }
}

Tool.prototype.SetVisible=function(value)
{
    if(this.UIOwner)
    {
        var toolButtons = this.UIOwner.getElementsByTagName("SPAN");
        for(var ii=0, o; o=toolButtons[ii]; ii++)
        {
            if(o.id==this.Key || o.id == "arr_" + this.Key)
            {
                o.style.display=(value == true)? '':'none';
                if (this.IsFirstInGroup) // means it has a seperator before it, hide that too
                {
                    var prevSib = o.previousSibling;
                    if (prevSib.tagName == 'SPAN')
                    {
                        prevSib.className = (value == true)? 'Separator':'Separator hidden';
                    }
                }
            }
        }
    }
    this.SharedProps.Visible = value;
}

Tool.prototype.SetCaption=function(value)
{
    if(this.UIOwner)
    {
        var toolButtons = this.UIOwner.getElementsByTagName("SPAN");
        for(var ii=0, o; o=toolButtons[ii]; ii++)
        {
            if(o.id==this.Key || o.id == "arr_" + this.Key)
                o.innerText=value;
        }
    }
    this.SharedProps.Caption = value;
}

var PopupMenuTool = Infragistics.Win.UltraWinToolbars.PopupMenuTool = function(key, settings, type)
{
    if(!type) type = "PopupMenuTool";
    if (!settings) settings={};
    settings["Type"] = "PopupMenuTool";
    Tool.call(this,key,settings, type);
}
PopupMenuTool.prototype = new Tool();

var ButtonTool = Infragistics.Win.UltraWinToolbars.ButtonTool = function(key, settings, type)
{
    if(!type) type = "ButtonTool";
    Tool.call(this,key,settings, type);
}
ButtonTool.prototype = new Tool();

var StateButtonTool = Infragistics.Win.UltraWinToolbars.StateButtonTool = function(key, settings)
{
    this.Checked = settings.Checked;
    this.MenuDisplayStyle = settings.MenuDisplayStyle;
    
    ButtonTool.call(this,key,settings, "StateButtonTool");
}
StateButtonTool.prototype = new ButtonTool();
StateButtonTool.prototype.set_Checked = function (value) // Programmatic call to check the button.
{
    this.Checked = !value; // _doMenuClick sets Checked to inverse of current Checked value.

    if(this.ToolbarsManager!=null)
        this.ToolbarsManager._doMenuClick(null, this); // Ok to send in null because all uses of the parameter handle the case.
}
var Toolbar = Infragistics.Win.UltraWinToolbars.Toolbar = function(key, settings) // UltraToolbar
{
    EpiObject.call(this, "Toolbar");
    this.Key = key;
    
    if(!settings) settings = {};
    
    this.Type = settings.Type||"Toolbar";
    this.Visible = (settings.Visible == false)? false:true;
    
    this.Tools = new ToolsCollection(settings.Tools);
     
    var ownerForm = settings.Owner||"";

    if (ownerForm != "") 
    {
        if (Global && Global.Form && Global.Form.myTool && ownerForm == Global.Form.ID)
            this.Tools.ToolbarsManager = Global.Form.myTool;
        else if (Global.BindingEngine.Controls)
        {
            ownerForm = Global.BindingEngine.Controls[ownerForm];
            this.Tools.ToolbarsManager = ownerForm;//Global.Form.myTool;
        }
    }
    else if (Global && Global.Form && Global.Form.myTool) 
        this.Tools.ToolbarsManager = Global.Form.myTool; // Assume if the settings doesnt have the ownerForm its either old code or it belongs to the main form
    
    this.Tools.Owner = this;
}
Toolbar.prototype.SetVisible=function(value)
{
    var ctrl= Global.document.getElementById(this.Key);
    if (ctrl)
    {
        var curr = ctrl.style.display;
    
        if (value == true)
        {
            ctrl.style.display='';
            if(this.Type=="Toolbar" && !Global.Form.ToolbarInMeta) this.AdjustForToolbar();
        }
        else
        {
            ctrl.style.display='none';
        }       
    }

    this.Visible = value;
}
Toolbar.prototype.AdjustForToolbar=function()
{     
    var topPanel = Global.document.getElementById("div_TopLevelPanel");
    if(!topPanel)
    {
        Global.Form.get_Event("Load").subscribe(this.AdjustForToolbar, this,true); 
    }
    else if(topPanel.style.position=="absolute")
    {
        topPanel.style.top = "24px";
    }
}

// ----------------------------------------------------------------------------------
//  The rest has no equivalent in .NET or Vantage.  It's our own helper code.
// ----------------------------------------------------------------------------------
function ErrorObject(type)
{
    EpiObject.call(this, "ErrorObject");
    this.type = type;
}

function CursorWait() 
{
document.documentElement.style.cursor= 'wait';
}

function CursorClear() 
{
    document.documentElement.style.cursor= 'default';
}

var Enumerator = System.Collections.Enumerator = System.Collections.IEnumerator = function(coll)
{
    EpiObject.call(this, "Enumerator");
    this.coll = coll;
    this.currentIdx = -1;
    this.Current;
    this.Key;
    this.Value;
}
Enumerator.prototype.MoveNext=function()
{
    if(this.coll instanceof Array)
    {
        this.currentIdx++;
        if(this.currentIdx >= this.coll.length) return false;
        
        this.Current = this.coll[this.currentIdx];
    }
    else if (this.coll instanceof String)
    {
        this.currentIdx++;
        if(this.currentIdx >= this.coll.length) return false;
        
        this.Current = this.coll.substr(this.currentIdx,1);
    }
    else
    {
    this.currentIdx++;
    if(this.currentIdx >= this.coll.Count) return false;
    
    var idx = -1;
    for(var itm in this.coll.items)
    {
        idx++;
        if(idx==this.currentIdx) 
        {
            if(this.coll.isDictionary)
            {
                if (this.coll instanceof Hashtable && this.coll.hashCodes.length > 0)
                    this.Key = this.coll.hashCodes[parseInt(itm)];
                else
                    this.Key = itm;
                this.Value = this.coll.items[itm];
                this.Entry = {Key:this.Key,Value:this.Value};
            }
            else
            {
                this.Current = this.coll.items[itm];
            }
            break;
        }
    }
    }
    
    return true;
}
Enumerator.prototype.Reset = function()
{
    this.currentIdx = -1;
}

var CharEnumerator = System.CharEnumerator = function(str)
{
    Enumerator.call(this, str);
    this._type = "CharEnumerator";
}
CharEnumerator.prototype = new Enumerator();

// I think this should be same as EpiToolbarsManager, but the code thats instantiating doesn't do anything with the object. So just leaving it as a stub for now.
var UltraToolbarsManager = Infragistics.Win.UltraWinToolbars.UltraToolbarsManager = function(){}

var MenuNames = {"newMenu":"NewMenuTool"};
function EpiToolbarsManager(tools, toolbars,allTools)    // UltraToolbar
{
    EpiObject.call(this, "EpiToolbarsManager");
    this.ActiveRoot = null;
    this.allTools = allTools; // Means we have all the tools already extracted, so no need to run the runtime insertions.
    this.Tools = new ToolsCollectionBase();
    if(tools == undefined) tools ={};
    for(var i in tools)
    {
      var tool = tools[i];
      this.Tools.Add(tool);
    }
    this.Toolbars = new ToolsCollectionBase();
    if(toolbars == undefined) toolbars ={};
    for(var i in toolbars)
    {
      var toolbar = toolbars[i];
      this.Toolbars.Add(toolbar);
    }
    
    this.Popup;
    this.MenuJustOpened = false;
    this.Control = null;
    this.initialized = false;
    this.OwnerForm = Global.Form; // By default set it to the main form.

//    this.ToolClick = new EpiEvent("ToolClick", this);
}
EpiToolbarsManager.prototype = new EpiObject();

EpiToolbarsManager.prototype._initTools=function()
{
    var tool,tb;
    var toolsColl= this.Tools.items;
    for(var t in toolsColl)
    {
        tool = toolsColl[t];
        tool.InitToolsCollection(this); // For popupmenu tools this updates the Tools collection with references to the actual tools
    }
    toolsColl=this.Toolbars.items;
    for(var t in toolsColl)
    {
        tb = toolsColl[t];
        tb.Tools.ToolbarsManager = this;
    }
}
EpiToolbarsManager.prototype.Init=function(ctrl,ownerID)    // UltraToolbarsManager
{      
    if (!ownerID || ownerID == Global.Form.ID) 
        this.OwnerForm = Global.Form; 
    else
    {
        this.OwnerForm = Global.BindingEngine.Controls[ownerID]; // This could belong to a EpiDockingToolManagerPanel or a form.
        this.OwnerForm.hasNav = true;
    }
        
    // First things... we need to know if there are any toolbars by default, before we alter things.
    var toolbars = this.Toolbars.items;
    if (this.OwnerForm == Global.Form)
    {
        for(toolbar in toolbars)
        {
            var tb = toolbars[toolbar];
            if(tb.Type=="Toolbar" && tb.Visible)
            {
                Global.Form.ToolbarInMeta = true;
                break;
            }
        }  
    }  

    var i =0;   
    this._initTools();

    if (this.OwnerForm == Global.Form) // Only for the main toolbar
        Global.Form.setupUIElements(this); // Add runtime changes to the toolbar structure
        
    Global.Form.SetupToolbarImages(this);
    
    this.Control = ctrl;
    this.visibleTbs = 0;
    var tbMgrArr = [];
    var oThis = this;
    var styleStr, classNameStr;
    var containerTools = [];
    var i = 0;
    var toolbars = this.Toolbars.items;
    this._ContainerTools = [];

    for(toolbar in toolbars)
    {
        var tb = toolbars[toolbar];
        var itemsArr = [];
        
        if(tb.Type=="Menu")
        {    
            if(tb.Visible) Global.Form.MenubarCount++;
        
            var toolsC = tb.Tools.items;
            for(tool in toolsC)
            {
                var theTool = toolsC[tool];
                theTool.UIOwner = ctrl;
  
                styleStr = "";                
                if(theTool.SharedProps.Visible==false) styleStr = "style='display:none;'";
                
                if(theTool.Enabled==false) 
                    classNameStr = "Menu-Root itemDisabled";
                else
                    classNameStr = "Menu-Root";
                
                if(theTool.SharedProps.Caption && theTool.SharedProps.Caption!="" && (theTool.Type=="PopupMenuTool"||theTool.Type=="ButtonTool"))
                {
                    itemsArr.push("<span " + styleStr + " class='" + classNameStr + "' id='" + theTool.Key + "'>" + theTool.SharedProps.Caption + "</span>");
                }
            }
            
            if(itemsArr.length > 0)
            {
                tbMgrArr.push("<div class='Menu-Bar menu' id='" + tb.Key + "'><div class='Menu-Buttons'>");
                tbMgrArr.push(itemsArr.join(""));
                tbMgrArr.push("</div></div>");
            }
        }
        else if(tb.Type=="Toolbar")
        {    
            if(tb.Visible && this.OwnerForm == Global.Form) Global.Form.ToolbarCount++;
        
            var tbC = tb.Tools.items;
            for(tool in tbC)
            {
                var theTool = tbC[tool];
                theTool.UIOwner = ctrl;
                var toolTipText = "";

                styleStr = "";   
          
                if(theTool.SharedProps.Visible==false) styleStr = "style='display:none;'";

                if(theTool.Enabled==false) 
                    classNameStr = "Menu-ToolButton btnDisabled";
                else
                    classNameStr = "Menu-ToolButton";
                    
                if(theTool.IsFirstInGroup)
                {
                    if(theTool.SharedProps.Visible==false || theTool.Enabled==false || tb.Visible==false)
                        itemsArr.push("<span class='Separator hidden'> </span>");
                    else
                        itemsArr.push("<span class='Separator'> </span>");
                }
                
                if (theTool.Type=="PopupMenuTool")
                {
                    var img = theTool.GetImageExt();
                
                    arrowID= "arr_" + theTool.Key;
                    itemsArr.push("<span " + styleStr + " class='" + classNameStr + "' id='" + theTool.Key + "' _tb=1><div><div style='background-image:url(./" + img.Path + ");background-position:0px -" + img.Pos.Top + "px;' class='image'></div></div></span>");
                    itemsArr.push("<span " + styleStr + " class='" + classNameStr + "' id='arr_" + theTool.Key + "' _tb=1 style='width:9px;'><div><div class='image arrow'></div></div></span>");
                    if (this.Tools[arrowID] == undefined);
                    {
                        var arrTool = new Tool(arrowID,{"Caption":"","Type":"PopupMenuToolArr","Control":""});
                        arrTool.Enabled = theTool.Enabled;
		                this.Tools.Add(arrTool);
		           }
                }
                else if (theTool.Type=="ButtonTool")
                {
                    if ((theTool.ToolTipText!=null) && (theTool.ToolTipText != "")) toolTipText = " title='" + theTool.ToolTipText + "'";
                    if (theTool.DisplayStyle && theTool.DisplayStyle == "TextOnlyAlways")
                        itemsArr.push("<span " + styleStr + " class='" + classNameStr + "' id='" + theTool.Key + "' _tb=1><div" + toolTipText +">" + theTool.SharedProps.Caption + "</div></span>");
                    else  
                    {
                        var img = theTool.GetImageExt();
                        itemsArr.push("<span " + styleStr + " class='" + classNameStr + "' id='" + theTool.Key + "' _tb=1><div><div" + toolTipText + " style='background-image:url(./" + img.Path + ");background-position:0px -" + img.Pos.Top + "px;' class='image'></div></div></span>");
                    }
                }
                else if (theTool.Type=="LabelTool")
                {
                    if ((theTool.ToolTipText!=null) && (theTool.ToolTipText != "")) toolTipText = " title='" + theTool.ToolTipText + "'";
                    itemsArr.push("<span " + styleStr + " class='" + classNameStr + "' id='" + theTool.Key + "' _tb=1><div" + toolTipText +">" + theTool.SharedProps.Caption + "</div></span>");
                }
                else if (theTool.Type == "ControlContainerTool" && theTool.Control != "")
                {
                    containerTools[i] = theTool.Key;
                    i++;
                    itemsArr.push("<span " + styleStr + " class='" + classNameStr + " Ctrl' id='" + theTool.Key + "' _tb=1><div id='PH_"+ theTool.Control + "'></div></span>");
                }
            }
            
            if(itemsArr.length > 0)
            {
                styleStr = "";   
                if(tb.Visible==false) styleStr = "style='display:none;'";
                else this.visibleTbs++;
                                
                tbMgrArr.push("<span class='Menu-Bar toolbar' id='" + tb.Key + "' " + styleStr + "><span class='Menu-Endcap'> </span><span class='Menu-Buttons'>");
                tbMgrArr.push(itemsArr.join(""));
                tbMgrArr.push("</span><span class='Menu-Endcap flip'> </span></span>");
            }
        }
    }

    Global.Purge(ctrl);
    ctrl.innerHTML = tbMgrArr.join("");

    if (containerTools.length > 0)
    {
        var theTool,contrlDiv,uiCtrl;
        var tools = this.Tools; // Global.Form.myTool.Tools
        for (var i=0,cn;cn=containerTools[i];i++)
        {
            theTool = tools[cn];
            contrlDiv = Global.document.getElementById("PH_" + theTool.Control);
            uiCtrl = Global.document.getElementById(theTool.Control);
            
            var parentDiv = contrlDiv.parentNode;
            if (uiCtrl)
            {
                parentDiv.replaceChild(uiCtrl,contrlDiv);
                Global.Purge(contrlDiv);

                var styleStr = "";
                // Apply different display styles for IE and FF
                if (Global.document.all)
                {
                    styleStr =  "inline";
                    
                    if(Global.GetBrowserVersion()=="7.0")
                    {
                        if(uiCtrl.className=="EpiNavigator")
                            uiCtrl.style.marginTop = "-2px";
                        else
                            uiCtrl.style.marginTop = "-1px";
                    }
                        
                }
                else
                {
                   styleStr =  "-moz-inline-box;";
                }
                
                var cbo = uiCtrl.getElementsByTagName("TABLE");
                if(cbo.length > 0) 
                {
                  cbo = cbo[0];
                  cbo.style.display = styleStr;
                }
            }           
        }
        this._ContainerTools = containerTools;
    }
    EpiEventManager.addListener(this.Control, "mousemove", this._mousemove, this, true); 
    EpiEventManager.addListener(this.Control, "mouseout", this._mouseout, this, true); 
    EpiEventManager.addListener(this.Control, "mousedown", this._mousedown, this, true); 
    EpiEventManager.addListener(this.Control, "mouseup", this._mouseup, this, true);
    EpiEventManager.addListener(this.Control, "click", this._click, this, true); 
    Global.Form.get_Event("Load").subscribe(this._sizeContainers, this,true);
    
    this.initialized = true;
}
EpiToolbarsManager.prototype._sizeContainers=function()
{
    var containerTools = this._ContainerTools;
    if (containerTools.length > 0)
    {
        var theTool,contrlDiv,uiCtrl;
        var tools = this.Tools;//Global.Form.myTool.Tools;
        for (var i=0,cn;cn=containerTools[i];i++)
        {
            theTool = tools[cn];
            uiCtrl = Global.document.getElementById(theTool.Control);
            
            if (!uiCtrl) continue;
            if (uiCtrl.className == "Menu-ToolButton Ctrl") uiCtrl = uiCtrl.childNodes[0];
            if (uiCtrl.offsetWidth > 0 && uiCtrl.parentElement)
            {
                if(uiCtrl.className != "EpiNavigator")
				{
					uiCtrl.parentElement.style.width = uiCtrl.offsetWidth - 1 + "px";
				}
				else
				{
					if(!BrowserSniffer.Safari13)
					{
						uiCtrl.parentElement.style.width = uiCtrl.offsetWidth - 1 + "px";
					}
				}
            }           
        }
    }
}
EpiToolbarsManager.prototype._openContextMenuItem=function(tool, posX,posY, sourceControl)
{
    var eventArgs = {"Cancel":false,"Tool": tool,"SourceControl":sourceControl};
    tool.get_Event("BeforeToolDropdown").fire(this, eventArgs);
    if (eventArgs.Cancel == true) return;
    this.ShowPopup(tool.Tools.items, null, "", posX,posY);
}
EpiToolbarsManager.prototype._openitem=function(tool, toolCtrl)
{
    var activeItem = Global.MenuManager.ActiveItem;

    pos = Global.GetPosition(toolCtrl);
    
    var eventArgs = {"Cancel":false,"Tool": tool,"SourceControl":null};
    this.get_Event("BeforeToolDropdown").fire(this, eventArgs); // Fire the UltraToolbarsManager.BeforeToolDropdown event
    if (eventArgs.Cancel == true) return;
    
    this.ShowPopup(tool.Tools.items, toolCtrl, "bottom");

    Global.MenuManager.ActiveItem = toolCtrl;
}
EpiToolbarsManager.prototype._mousemove=function(e)
{
    var ctrl = e.target||e.srcElement;

    var toolCtrl = this._searchForToolCtrl(ctrl, this.Tools);
        
    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        var isTB = toolCtrl.getAttribute("_tb");
        if (isTB == undefined) isTB=0;
        
        if(isTB == 0 && tool.Type=="PopupMenuTool")
        {
            var activeItem = Global.MenuManager.ActiveItem;
            
            if(activeItem && activeItem!=toolCtrl)
            {
                activeItem.className = "Menu-Root";
                this._openitem(tool, toolCtrl);
                toolCtrl.className = "Menu-Root itemFocus";
            }
            else if(!activeItem)
            {
                toolCtrl.className = "Menu-Root itemActive";
            }
        }
        else if(tool.Type=="ButtonTool")
        {
            toolCtrl.className = "Menu-ToolButton btnActive";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuTool")
        {
            toolCtrl.className = "Menu-ToolButton btnActive";
            toolCtrl.style.marginRight='0px';
            toolCtrl.nextSibling.className = "Menu-ToolButton arwActive";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuToolArr")
        {
            toolCtrl.previousSibling.className = "Menu-ToolButton btnActive";
            toolCtrl.previousSibling.style.marginRight='0px';
            toolCtrl.className = "Menu-ToolButton arwActive";
        }
    }
}
EpiToolbarsManager.prototype._mouseout=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var toolCtrl = this._searchForToolCtrl(ctrl, this.Tools);
    
    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        
        var isTB = toolCtrl.getAttribute("_tb");
        if (isTB == undefined) isTB=0;
        
        if(isTB == 0 && tool.Type=="PopupMenuTool")
        {
            if(Global.MenuManager.ActiveItem!=toolCtrl)
                toolCtrl.className = "Menu-Root";
        }
        else if(tool.Type=="ButtonTool")
        {
            toolCtrl.className = "Menu-ToolButton";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuTool")
        {
            toolCtrl.className = "Menu-ToolButton";
            toolCtrl.nextSibling.className = "Menu-ToolButton";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuToolArr")
        {
            toolCtrl.previousSibling.className = "Menu-ToolButton";
            toolCtrl.className = "Menu-ToolButton";
        }
    }
}
EpiToolbarsManager.prototype._mousedown=function(e)
{
    var ctrl = e.target||e.srcElement;

    var toolCtrl = this._searchForToolCtrl(ctrl, this.Tools);

    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        
        var isTB = toolCtrl.getAttribute("_tb");
        if (isTB == undefined) isTB=0;
        
        if(isTB == 0 && tool.Type=="PopupMenuTool")
        {
            if(Global.MenuManager.ActiveItem!=toolCtrl)
            {
                toolCtrl.className = "Menu-Root itemFocus";
                this._openitem(tool, toolCtrl);
                this.MenuJustOpened = true;
            }
            
            if (!e) var e = Global.window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
        }
        else if(tool.Type=="ButtonTool")
        {
            toolCtrl.className = "Menu-ToolButton btnFocus";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuTool")
        {
            toolCtrl.className = "Menu-ToolButton btnFocus";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuToolArr")
        {
            toolCtrl.previousSibling.className = "Menu-ToolButton btnFocus";
            toolCtrl.className = "Menu-ToolButton arwFocus";
        }
    }
}
EpiToolbarsManager.prototype._mouseup=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var toolCtrl = this._searchForToolCtrl(ctrl, this.Tools);
    
    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        
        var isTB = toolCtrl.getAttribute("_tb");
        if (isTB == undefined) isTB=0;
        
        if(isTB == 0 && tool.Type=="PopupMenuTool")
        {
            if(Global.MenuManager.ActiveItem==toolCtrl && !this.MenuJustOpened)
            {
                this.HidePopups();
                toolCtrl.className = "Menu-Root itemActive";
            }
        }
        else if(tool.Type=="ButtonTool")
        {
            toolCtrl.className = "Menu-ToolButton btnActive";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuTool")
        {
            toolCtrl.className = "Menu-ToolButton btnActive";
        }
        else if (isTB == 1 && tool.Type=="PopupMenuToolArr")
        {
            toolCtrl.previousSibling.className = "Menu-ToolButton btnActive";
            toolCtrl.previousSibling.style.marginRight='0px';
            toolCtrl.className = "Menu-ToolButton arwActive";
        }
    }
    this.MenuJustOpened = false;
}
EpiToolbarsManager.prototype._click=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var toolCtrl = this._searchForToolCtrl(ctrl, this.Tools);
    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        
        var tool = this.Tools[toolCtrl.id];
        if (tool.Type == "PopupMenuToolArr")
        {
            toolCtrl = toolCtrl.previousSibling;
            tool = this.Tools[toolCtrl.id];
            this._openitem(tool, toolCtrl);
            Global.MenuManager.ActiveItem = null;
        }
        else
        {
            // do menu item click
            try
            {
                var fn=function(toolCtrl,tool) {return this._doMenuClick(toolCtrl, tool)}
                Global.BindingEngine.RunInThread(this,fn,[toolCtrl,tool]);
                //this._doMenuClick(toolCtrl, tool);
            }
            catch(err){}
        }
    }
}
EpiToolbarsManager.prototype._doMenuClick=function(toolCtrl, toolObj)
{            
    var menuID = (toolCtrl == null)? toolObj.Key: toolCtrl.id;
    var ownerForm = this.OwnerForm; //Global.Form; 
    
    this.get_Event("ToolClick").fire(this, {"Tool":toolObj,"ListToolItem":{"Key":menuID}});    
    if (ownerForm.OnBeforeToolClick(menuID,toolObj))
        return;

    if (menuID == MenuNames.newMenu || menuID.indexOf("EpiAddNew") == 0) // New menu
    {
        var msg;
        if (menuID == MenuNames.newMenu)
            msg= "";
	    else
	        msg = menuID.substring(9);
	        
	    Global.GettingNew=true;
        ownerForm.OnClickNew(msg, new EpiOverloadedArgs('String'));
        Global.GettingNew=false;
    }
    else
    {
        if(toolObj instanceof StateButtonTool)
        {
            toolObj.Checked = !toolObj.Checked;
        }

        switch(menuID)
        {
			case "ExitTool":
            	ownerForm.trans.SetCurrentEvent(TransactionEvent.UpdateOnFormClose);
				ownerForm.OnClickExit();
				break;
            case "NewTool": 
                ownerForm.trans.SetCurrentEvent(TransactionEvent.AddNewOnNewButton);
                var callWithNoArgs = true;
                if(ownerForm.trans instanceof EpiSingleViewTransaction &&
                    ownerForm.trans.view.AddText && ownerForm.trans.view.AddText.length>0)
                    callWithNoArgs = false;
                ownerForm.beforeAdapterUpdateException = false;
                if (callWithNoArgs) ownerForm.OnClickNew(new EpiOverloadedArgs(""));
                if (!ownerForm.beforeAdapterUpdateException)
                    ownerForm.OnClickNew(toolObj.SharedProps.Caption, new EpiOverloadedArgs('String'));
                ownerForm.beforeAdapterUpdateException = false;
                ownerForm.trans.OnTransactionCallBack();
                break;
            case "SaveTool":
				ownerForm.trans.SetCurrentEvent(TransactionEvent.UpdateOnSaveButton);
				ownerForm.OnClickSave();
				if(ownerForm.trans) ownerForm.trans.OnTransactionCallBack();
				break;
            case "ClearTool":
	            ownerForm.clearTransaction();
	            ownerForm.utils.UIDataCleared();
	            break;
	        case "DeleteTool":
                EpiToolbarsManager.onDeleteTool(ownerForm);
	            break;
            case "RefreshTool":
			    ownerForm.OnClickRefresh();
			    break;
			case "CallLogTool":
			    ownerForm.OnClickCallLog();
			    break;
            case "ChangeLogTool":
                ownerForm.trans.SetCurrentEvent(TransactionEvent.None);
                ownerForm.OnClickChangeLog();
                break; 
			case "_DebugTool":
			    if(Global.DebugHelper!=null)
			        Global.DebugHelper.Launch();
			    break;
			case "PrimarySearchTool":
                if(ownerForm.trans)
                    ownerForm.trans.SetCurrentEvent(TransactionEvent.UpdateOnInvokeSearch);
                var opts = new SearchOptions(Epicor.Mfg.UI.Searches.SearchMode.ShowDialog);
                ownerForm.OnClickSearch(opts);
	            break;
			case "AttachmentTool":
				ownerForm.trans.SetCurrentEvent(TransactionEvent.None);
				ownerForm.OnClickAttachment();
				break;
            case "MemoTool":
                ownerForm.trans.SetCurrentEvent(TransactionEvent.None);
                ownerForm.OnClickMemo();
                break;
            case "HelpTool": 
                HelpManager.ShowFormHelp(null,false);
                break;
            case "FieldHelpTool": 
                HelpManager.ShowFieldHelp(toolObj.Checked);
                break;
			case "AuditLogTool":
                ownerForm.trans.SetCurrentEvent(TransactionEvent.None);
                ownerForm.OnClickAuditLog();
                break;
            case "UndoTool":
                ownerForm.trans.SetCurrentEvent(TransactionEvent.UndoOnUndoButton);
                ownerForm.OnClickUndo();
                if (ownerForm.trans.didUndoAddNew)
                    ownerForm.trans.SetCurrentEvent(TransactionEvent.UndoOnUndoAddNew);
                ownerForm.trans.OnTransactionCallBack();
                ownerForm.trans.resetTransactionEvent();
                break;
            case "ResetLayoutsTool":
                for(var g in Global.GridSettings)
                {
                    var obj = Global.BindingEngine.Controls[g];
                    if(obj) obj.ApplySettings(Global.GridSettings[g]);
                }
                break;
            default:
                // Check if this is a context menu, if not call form's misc toolhandler
                if (!ECTM._doMenuClick(toolCtrl, toolObj)) // ECTM._doMenuClick doesnt use toolCtrl, so its ok if its null
                    ownerForm.OnClickMiscTool(toolObj.Key);
                break;
        }
    }    
}
EpiToolbarsManager.onDeleteTool=function(ownerForm)
{
	ownerForm.trans.SetCurrentEvent(TransactionEvent.DeleteOnDeleteButton);

        // are we deleting attachment row?
    	if (ownerForm.trans.LastView != null &&
        ownerForm.trans.LastView.isAttachView &&
        ownerForm.trans.LastView.Row > -1)        
            AttachmentHandler.OnRemoveAttachment(ownerForm.trans.LastView, ownerForm.trans.LastView.Row);
	else
	    ownerForm.OnClickDelete();	    

	if (ownerForm.trans.didDeleteOnDelete)
		ownerForm.trans.SetCurrentEvent(TransactionEvent.DeleteOnDeleteButton);
	if (ownerForm.trans.didDeleteAddNew)
		ownerForm.trans.SetCurrentEvent(TransactionEvent.DeleteOnDeleteAddNew);
	if (ownerForm.trans.didUndoAddNew)
		ownerForm.trans.SetCurrentEvent(TransactionEvent.DeleteOnDeleteAddNew);
	ownerForm.trans.wasDialogConfirmed = true;
	ownerForm.trans.OnTransactionCallBack();
	ownerForm.trans.resetTransactionEvent();
}
EpiToolbarsManager.prototype._searchForToolCtrl=function(currentCtrl, tools)
{
    var toolCtrl;
    
    while(currentCtrl && currentCtrl.className!="Menu-Manager" && currentCtrl.className!="Popup" && !toolCtrl)
    {
        var idStr = currentCtrl.id;
        
        if(idStr) 
        {
            if(tools[idStr]) toolCtrl = currentCtrl;
        }
    
	    currentCtrl = currentCtrl.parentNode;
    }
        	
    return toolCtrl;
}
EpiToolbarsManager.prototype.ShowPopup=function(items, relativeCtrl, relative, posX, posY)
{
    this.HidePopups();    
    var oPopup = new PopupMenu(this);        
    oPopup.Show(items, relativeCtrl, relative, posX, posY);
    this.Popup = oPopup;

    EpiEventManager.addListener(Global.document, "mousedown", this.HidePopups, this, true); 
}
EpiToolbarsManager.prototype.HidePopups=function()
{
    var activeItem = Global.MenuManager.ActiveItem;
    if(activeItem)
    {
        activeItem.className = "Menu-Root";
        Global.MenuManager.ActiveItem = null;
    }

    if(this.Popup)
    { 
        this.Popup.Hide();
        this.Popup = null;
        
        EpiEventManager.removeListener(Global.document, "mousedown", this.HidePopups);
    }    
}
function PopupMenu(mgr)
{
    EpiObject.call(this, "PopupMenu");
    this.MenuManager = mgr;
    this.Control;
    this.ChildPopup;
    this.ActiveItem;
    this.CurrentPopup;
}
PopupMenu.prototype.Show=function(items, relativeElem, relativePos, PosX, PosY)
{
    var left, top;
    
    if(!items)
    {
        items = {"EmptyTool":new Tool("EmptyTool", {"Caption":"(Empty)","Type":"ButtonTool","Enabled":false})};
    }
    this.Tools = items;

    var htmlStr = this._getMenuHTML(items);
    
    this.CurrentPopup = new Popup(htmlStr);
    
    if (relativeElem)
    {
        if(relativePos=="right")
            this.CurrentPopup.ShowRelative(relativeElem, relativePos, 3);
        else
            this.CurrentPopup.ShowRelative(relativeElem, relativePos);
    }
    else if (PosX != undefined && PosY != undefined)
    {
        this.CurrentPopup.Show(PosX,PosY);
    }       
    
    this.Control = this.CurrentPopup.Control;

    EpiEventManager.addListener(this.Control, "mousemove", this._mousemove, this, true); 
    EpiEventManager.addListener(this.Control, "mouseout", this._mouseout, this, true); 
    EpiEventManager.addListener(this.Control, "mousedown", this._mousedown, this, true); 
    EpiEventManager.addListener(this.Control, "click", this._click, this, true); 
}
PopupMenu.prototype.Hide=function()
{
    if(this.ChildPopup) this.ChildPopup.Hide();
    this.CurrentPopup.Hide();
}
PopupMenu.prototype._getMenuHTML=function(items)
{
    var itm, className;

    var menuArr = [];
    
    var outerTableStyle=Global.FormDir=="rtl"?"outerTableRtl":"outerTable";
    menuArr.push("<table class='" + outerTableStyle + "' cellSpacing='0' cellPadding='1'><tbody>");
    var itemIndx = 0;
    for(tool in items)
    {
        itm = items[tool];
        className = "";
        
        if(itm.IsFirstInGroup && itemIndx > 0)
        {
            var sepClass=Global.FormDir=="rtl"?"separatorRtl":"separator";
            menuArr.push("<tr><td class='" + sepClass + "' noWrap><center><div width='100%'></div><center></center></center></td></tr>");
        }
         
        if(!itm.Enabled && !itm.SharedProps.Visible) className = "disabled hidden";
        else if(!itm.Enabled) className = "disabled";
        else if(!itm.SharedProps.Visible) className = "hidden";

        var imgClass = "";
        if(itm instanceof StateButtonTool)
        {
            if(itm.Checked) imgClass = " class='Checked'";
        }           
        
        menuArr.push("<tr class='" + className + "' height='20'><td id='" + itm.Key + "' class='Menu-ToolButton' width='100%'><table cellspacing='0' cellpadding='0' width='100%' >");
        menuArr.push("<tbody><tr><td nowrap width='1' /><td nowrap width='30'><div" + imgClass + "/></td><td nowrap>" + itm.SharedProps.Caption.Replace("&","") + "</td>");
        if(itm.Tools && itm.Type=="PopupMenuTool")
        {
            var arrowClass=Global.FormDir=="rtl"?"arrowRtl":"arrow";
            menuArr.push("<td class='" + arrowClass + "' nowrap width='20' />");
        }
        else
            menuArr.push("<td nowrap width='20' />");
        menuArr.push("<td nowrap width='5' /></tr></tbody></table></td></tr>");
        itemIndx++;
    }
    
    menuArr.push("</tbody></table>");
    
    return menuArr.join("");
}
PopupMenu.prototype._mousemove=function(e)
{
    var ctrl = e.target||e.srcElement;

    var toolCtrl = this.MenuManager._searchForToolCtrl(ctrl, this.Tools);
    
    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        
        toolCtrl.className = "Menu-ToolButton btnActive";
        
        if(this.ActiveItem!=toolCtrl)
        {   
            if(this.ChildPopup) 
            {
                this.ChildPopup.Hide();
                this.ChildPopup = null;
            }           
        
            if(tool.Type=="PopupMenuTool" && this.ActiveItem!=toolCtrl)
            {
                var pos = Global.GetPosition(toolCtrl);
                
                var eventArgs = {"Cancel":false,"Tool": tool,"SourceControl":null};
                tool.get_Event("BeforeToolDropdown").fire(this, eventArgs);
                if (eventArgs.Cancel == true) return;
                
                var oPopup = new PopupMenu(this.MenuManager);  
                oPopup.Show(tool.Tools.items, toolCtrl, "right");
                
                this.ChildPopup = oPopup;
                
                this.ActiveItem = toolCtrl;
            }
        }
    }
}
PopupMenu.prototype._mouseout=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var toolCtrl = this.MenuManager._searchForToolCtrl(ctrl, this.Tools);
    if(toolCtrl) toolCtrl.className = "Menu-ToolButton";
    
    this.ActiveItem = null;
}
PopupMenu.prototype._click=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var toolCtrl = this.MenuManager._searchForToolCtrl(ctrl, this.Tools);
    if(toolCtrl)
    {
        var tool = this.Tools[toolCtrl.id];
        if(tool.Enabled==false) return;
        
        if(tool.Type=="ButtonTool" || tool.Type=="StateButtonTool")
        {
            // do menu item click
            this.MenuManager.HidePopups();
            
            var fn = function(toolCtrl, tool){return this.MenuManager._doMenuClick(toolCtrl, tool);}
            Global.BindingEngine.RunInThread(this,fn,[toolCtrl, tool]);
            //this.MenuManager._doMenuClick(toolCtrl, tool);
        }
        
    }
}
PopupMenu.prototype._mousedown=function(e)
{
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}

function Popup(htmlStr, maxWidth, maxHeight, minWidth, minHeight)
{
    EpiObject.call(this, "Popup");
    this.Sizing = 
    {
        MaxWidth:maxWidth,
        MaxHeight:maxHeight,
        MinWidth:minWidth,
        MinHeight:minHeight
    }

    var newElement = Global.document.createElement("DIV");
	newElement.className = "Popup";
    
    newElement.style.position="absolute";
	newElement.style.left="-1000px";
	newElement.style.top="-1000px";
	newElement.overflowX = "hidden";
	newElement.overflowY = "auto";
	
	Global.Purge(newElement);
	newElement.innerHTML = htmlStr;
	
    Global.document.body.appendChild(newElement);
       
    this.Control = newElement;
    this.Resize();

    newElement.style.display = "none";
}
Popup.prototype.Resize=function()
{
    var ctrl = this.Control;

    var sbWidth = 17;
    if(!Global.document.all) sbWidth = 19;  // FF
    
    var sbFlg = false;

    var h = ctrl.firstChild.offsetHeight;
    if(this.Sizing.MaxHeight && h>this.Sizing.MaxHeight) 
    {
        ctrl.style.overflowY = "auto";
        h = this.Sizing.MaxHeight;
        sbFlg = true;
    }

    var w = ctrl.firstChild.offsetWidth;

    if (this.Sizing.MaxWidth && w > this.Sizing.MaxWidth)
    {
        ctrl.style.overflowX = "auto";
        w = this.Sizing.MaxWidth;
    }

    var outerW = w;
    var innerW = w;
    if(this.Sizing.MinWidth)
    {
        if(!sbFlg)
        {
            if(w<this.Sizing.MinWidth)
            {
                innerW = this.Sizing.MinWidth;
                outerW = this.Sizing.MinWidth;
            }
            else
            {
                innerW = w;
                outerW = w;
            }
        }
        else
        {
            if(w<this.Sizing.MinWidth)
            {
                if( (w+sbWidth) < this.Sizing.MinWidth )
                {
                    innerW = this.Sizing.MinWidth-sbWidth;
                    outerW = this.Sizing.MinWidth;
                }
                else
                {
                    innerW = w;
                    outerW = w+sbWidth;
                }
            }
            else
            {
                innerW = w;
                outerW = w + sbWidth;
            }
        }
    }   
    ctrl.firstChild.style.width = innerW + "px";
    
    if(this.Sizing.MinHeight && h<this.Sizing.MinHeight) h = this.Sizing.MinHeight;
    
//    if(this.Sizing.MaxWidth && w>this.Sizing.MaxWidth) w = this.Sizing.MaxWidth;

    ctrl.style.width = outerW + "px";
    ctrl.style.height = h + "px";
}
Popup.prototype.Show=function(x, y)
{
    var top=y, left=x;
    this.Control.style.display = "block";
    
    var docScrollTop = Global.document.body.scrollTop;
    var docHeight = (Global.window.innerHeight)?Global.window.innerHeight:Global.document.documentElement.clientHeight;
    var docWidth = (Global.window.innerWidth)?Global.window.innerWidth:Global.document.documentElement.clientWidth;
    
    var w = this.Control.offsetWidth;
    var h = this.Control.offsetHeight;
    
    if(Global.FormDir=="rtl"||(x+w) > docWidth)
    {
        if(x-w-20 > 0)
            left = x - w-20;
        else
            left = docWidth - w;
    }
        
    if((y+h) > docHeight)
    {
        if(y-h >= docScrollTop && y+h > docHeight+docScrollTop)
            top = y - h;
        else
            top = y + h - 1;
    }
        
    this.Control.style.left = left + "px";
    this.Control.style.top = top + "px";
}
Popup.prototype.ShowRelative=function(relativeElem, relativePos, offsetX, offsetY)
{
    var srcPosition = Global.GetPosition(relativeElem);
    var top, left;
    
    this.Control.style.display = "block";
    
    var w = this.Control.offsetWidth;
    var h = this.Control.offsetHeight;

    var docScrollTop = Global.document.body.scrollTop;
    var docHeight = (Global.window.innerHeight)?Global.window.innerHeight:Global.document.documentElement.clientHeight;
    var docWidth = (Global.window.innerWidth)?Global.window.innerWidth:Global.document.documentElement.clientWidth;
    
    if(relativePos=="right")
    {
        if((Global.FormDir=="rtl"&&srcPosition.x-w + 1>0)||(Global.FormDir=="ltr"&&srcPosition.x + srcPosition.width + w > docWidth))
        {
            if(srcPosition.x-w>0)
                left = srcPosition.x-w-3;
            else
                left = docWidth - w;
        }
        else
            left = srcPosition.x + srcPosition.width - 1;
            
        if(srcPosition.y-h>=docScrollTop && srcPosition.y+h > docHeight+docScrollTop)
            top=srcPosition.y-h;
        else
            top=srcPosition.y-1;
    }
    else
    {
        if((Global.FormDir=="rtl"&&srcPosition.x + srcPosition.width - w>0)||(Global.FormDir=="ltr"&&srcPosition.x + w > docWidth))
            left = srcPosition.x + srcPosition.width - w;
        else
            left = srcPosition.x;
            
        if(srcPosition.y-h >= docScrollTop && srcPosition.y + srcPosition.height + h > docHeight + docScrollTop)
            top = srcPosition.y-h;
        else
            top = srcPosition.y+srcPosition.height-1;
    }
    
    if(offsetX) left = left + offsetX;
    if(offsetY) top = top + offsetY;

    this.Control.style.left = left + "px";
    this.Control.style.top = top + "px";
}
Popup.prototype.Hide=function()
{
    Global.Purge(this.Control);
    this.Control.parentNode.removeChild(this.Control);
}
function ZonePopupManager()
{
    this.activepopup = null;
    this.hasFocus =false;
    EpiObject.call(this, "ZonePopupManager");
}
ZonePopupManager.prototype.get_HasActiveZonePopup=function(){ return (this.activepopup != null)}

ZonePopupManager.prototype.ShowZonePopup=function(Zone, ctrl)
{
    this.zone = Zone;
    LaunchEngine.Index++;
    var idx = LaunchEngine.Index.toString();
    LaunchEngine.Forms[idx] = this.getLaunchParams(ctrl);
    var url = "UI.EpiClientLib.EpiZoneForm.aspx?source=parent&formidx=" + idx;
    if (Global.ServerSession && Global.ServerSession.CurrentUserInfo)
    {
        url = url + "&UserInfo=" + Global.ServerSession.CurrentUserInfo;
    }
    var iframeData = [];
    iframeData.push("<iframe id='"+this.zone.ID+"' style='border:0px;overflow:hidden;width:285px;height=65px;' src='"+url+"'></iframe>");
    this.activepopup = new Popup(iframeData.join(""), null, null, 290, 65);
    this.epiZonePos = null;
    
    EpiEventManager.addListener(this.activepopup.Control, "focus", this._focusin, this, true);
    EpiEventManager.addListener(this.activepopup.Control, "mouseout", this._handleMouseOut, this, true);
    EpiEventManager.addListener(Global.document, "mouseover", this._handleMouseMove, this, true); 
    EpiEventManager.addListener(Global.document, "mousedown", this._handleMouseMove, this, true); 
    
    this.activepopup.Control.style.overflow = "hidden";
    this.activepopup.ShowRelative(ctrl, "right");
    this.activepopup.Resize();
    if (!this.epiZonePos && this.activepopup && this.activepopup.Control)
        this.epiZonePos = Global.GetPosition(this.activepopup.Control);
     
}
ZonePopupManager.prototype._focusin=function(evt)
{
    this.hasFocus = true;
}
ZonePopupManager.prototype._handleMouseMove=function(evt)
{
    var mouse_X = evt.clientX + document.body.scrollLeft;
    var mouse_Y = evt.clientY + document.body.scrollTop;
    if (mouse_X < 0){mouse_X = 0;}
    if (mouse_Y < 0){mouse_Y = 0;}
    this.currMousePos = {"X":mouse_X,"Y":mouse_Y};
}

ZonePopupManager.prototype.ClearTimer=function()
{
    if (this.timeoutID) 
        Global.window.clearTimeout(this.timeoutID);
}
ZonePopupManager.prototype.ResetTimer=function()
{
   if (this.timeoutID) 
   {
        Global.window.clearTimeout(this.timeoutID);
        var me = this;
        me.timeoutID = Global.window.setTimeout(function(){me.timer_Tick()}, 2*1000);
   }
}
ZonePopupManager.prototype._handleMouseOut=function(e)
{
    if (this.InRetrieve) return;
    // set up a timer for 4sec to close the popup
    this.CancelClose = false;
    var me = this;
    me.timeoutID = Global.window.setTimeout(function(){me.timer_Tick()}, 4*1000);
}
ZonePopupManager.prototype.timer_Tick=function(e)
{
   if (this.activepopup && this.activepopup.Control)
   {
        var cancel = false;
        if (this.currMousePos)
        {
            if (this.currMousePos.X >= this.epiZonePos.x && this.currMousePos.X <= (this.epiZonePos.x + this.epiZonePos.width)
              && this.currMousePos.Y >= this.epiZonePos.y && this.currMousePos.Y <= (this.epiZonePos.y + this.epiZonePos.height))
            {
              this.CancelClose = true
            }
        }
        
        if (this.CancelClose || this.hasFocus) cancel = true;

        if (cancel)
        {
            if (this.timeoutID) Global.window.clearTimeout(this.timeoutID)
            return;
        }
              
        this.closePopup();
   }
}
ZonePopupManager.prototype.closePopup=function()
{
    this.activepopup.Control.removeChild(this.activepopup.Control.childNodes[0]);
    this.activepopup.Hide();
    this.activepopup = null;
    this.hasFocus = false;
    if (this.timeoutID) Global.window.clearTimeout(this.timeoutID)
    this.zone.Control.Focus(this.zone.parentCtrl);
}


ZonePopupManager.prototype.getLaunchParams=function(thectrl)
{
    var params = {};
    // verify or bail
    if (this.zone.Control == null || String.IsNullOrEmpty(this.zone.ZoneBAQ)) return null;
        
            try
            {
                if (this.zone.Control.InGrid)
                {
                    this.zone.CurrentValue= this.zone.Control.GetDataVal(thectrl); // value from the correct grid row
                    this.zone.parentCtrl = thectrl; // the actual control in the grid.
                }
                
                var theValue = this.zone.CurrentValue;
                var proposedValue = this.zone.Control.GetValue(thectrl, true); // value typed into the control
                var likeColumn = EpiBindingManager.GetLikeValue(this.zone.EpiBinding);
                
                params = {"NewValue":theValue,"ProposedValue":proposedValue,"LikeColumn":likeColumn,"EpiZone":this.zone,"ZonePopupMgr": this};
                return params;
            }
            catch (ex)
            {
                 ExceptionBox.Show(ex);
            }
            finally
            {
                Cursor.Current = Cursors.Arrow;
            }
    
}
var LaunchEngine = 
{
    Index:0,
    Forms:{},
    ArgsInUrl:{},
    DoneLaunching:new EpiEvent("DoneLaunching", this),
    GetFormCount:function()
    {
        var frmCnt = 0;
        for(var f in LaunchEngine.Forms)
        {
            frmCnt++;
        }
        return frmCnt;
    },    
    FormLaunched:function(frmID)
    {
        delete LaunchEngine.Forms[frmID];
                
        if(LaunchEngine.GetFormCount()==0) LaunchEngine.DoneLaunching.fire();
    },
    OpenForm:function(url, frm, formInfo)
    {
        var urlStr = url;
        
        if(frm)
        {
            var idx = (LaunchEngine.Index++).toString();
            LaunchEngine.Forms[idx] = {"LaunchObj":frm};
            urlStr = urlStr + "?source=opener&formidx=" + idx;
            if (Global.ServerSession && Global.ServerSession.CurrentUserInfo)
            {
                urlStr = urlStr + "&UserInfo=" + Global.ServerSession.CurrentUserInfo;
            }
            if (this.ArgsInUrl)
            {        
                var argChar = (urlStr.indexOf('?') > 0 )? "&" : "?";
                for(var key in this.ArgsInUrl)
                {
                    urlStr = urlStr + argChar + key + "=" + this.ArgsInUrl[key];
                }
            }
        }
        
        if(formInfo)
        {
            var sFeatures = "toolbar=no,menubar=no,scrollbars=no,scroll=no,status=no,help=no,resizable=yes,dialog=yes,modal=yes";
			if(!BrowserSniffer.Safari13)
			{
				sFeatures = "height=" + (formInfo.Height-34) + ",width=" + (formInfo.Width-8) + "," + sFeatures;
			}
			else
			{
				sFeatures = "height=" + (formInfo.Height) + ",width=" + (formInfo.Width) + "," + sFeatures;
			}
			
			// use a window name of "_blank" to prevent window re-use
            Global.window.open(urlStr,"_blank",sFeatures);
        }
        else
        {
            Global.window.open(urlStr);
        }
    },
    GetParams:function()
    {
        if (Global.LaunchArgs) return Global.LaunchArgs;

        if((BrowserSniffer.IE || BrowserSniffer.FireFox15) && Global.window.dialogArguments)
        {
            var op = Global.window.dialogArguments.Opener;
            if(Global.DebugHelper) Global.DebugHelper.DebugDialog(op);
            if (op.DialogHelper) op.DialogHelper.Register(Global);
            
            Global.Form.IsDialog = true;
            return Global.window.dialogArguments;
        }
        
		// Safari
		if(!Global.document.all && Global.window.dialogArguments)
        {
            var op = Global.window.dialogArguments.Opener;
            if(Global.DebugHelper) Global.DebugHelper.DebugDialog(op);
            if (op.DialogHelper) op.DialogHelper.Register(Global);
            
            Global.Form.IsDialog = true;
            return Global.window.dialogArguments;
        }
		
		try
		{
		    if(!Global.document.all && 
		    Global.window.opener && 
		    Global.window.opener.Global && 
		    Global.window.opener.Global.DialogArguments && 
		    Global.window.opener.Global.DialogArguments.Opener)
            {
                var op = Global.window.opener.Global.DialogArguments.Opener;
                if(Global.DebugHelper) Global.DebugHelper.DebugDialog(op);
                if (op.DialogHelper) op.DialogHelper.Register(Global);
        
                Global.Form.IsDialog = true;
                return Global.window.opener.GlobalObject.DialogArguments;
            }
        else
        {        
            // Called from Launched form.
            var src = Global.GetUrlArg("source");
            var formIdx = Global.GetUrlArg("formidx");
            if(src!="" && formIdx!="")
            {
                var srcObj;
                if(src=="opener") 
                {
                    srcObj = Global.window.opener;
                    if(!srcObj && Global.window.parent)
                        srcObj = Global.window.parent;
                }
                else if(src=="parent")
                    srcObj = Global.window.parent;
                    
                if(srcObj)
                {
                    try
                    {
                        if(srcObj && srcObj.LaunchEngine)
                        {
                            var formObj = srcObj.LaunchEngine.Forms[formIdx];
                            
                            srcObj.LaunchEngine.FormLaunched(formIdx);
                            if(formObj) return formObj;
                        }
                    }
                    catch(err) {}
                }            
            }
        }
        }
        catch(e){}
    }
}

function DialogControl(form,ctrlID)
{
    this.form = form;
    this.ID = ctrlID;
}
DialogControl.prototype.get_Text=function()         {return this.form.GetControlProperty(this.ID, PropertyType.Text);}
DialogControl.prototype.get_Value=function()        {return this.form.GetControlProperty(this.ID, PropertyType.Value);}
DialogControl.prototype.get_Checked=function()      {return this.form.GetControlProperty(this.ID, PropertyType.Checked);}
DialogControl.prototype.get_DateTime=function()     
{
    var dt = this.form.GetControlProperty(this.ID, PropertyType.Value);
    if(dt!=null) dt = FormatEngine.ToDate(dt);
    return dt;
}
DialogControl.prototype.set_Text=function(val)      {this.form.SetControlProperty(this.ID, PropertyType.Text, val);}
DialogControl.prototype.set_Value=function(val)     {this.form.SetControlProperty(this.ID, PropertyType.Value, val);}
DialogControl.prototype.set_Checked=function(val)   {this.form.SetControlProperty(this.ID, PropertyType.Checked, val);}
DialogControl.prototype.set_Image=function(val)     {this.form.SetControlProperty(this.ID, PropertyType.Image, val);}
DialogControl.prototype.SetSegmentDefinition=function() 
{
    var args=[this.ID,"SetSegmentDefinition"]; 
    
    for (var i=0,a=2;i<arguments.length;i++,a++) { args[a] = arguments[i] }
    this.form.CallFunction("CallFunctionOnControl",args);
}

DialogControl.prototype.SetProperty=function(property, val)
{
    this.form.SetControlProperty(this.ID, property, val);
}

function EpiOverloadedArgs(typeList)
{
    this.args = typeList;
}

function EpiButtonClickArgs(button)
{
    this.Button = button
}

var MaskEngine = 
{
    Masks:{},
    Get:function(maskStr)
    {
        if(!MaskEngine.Masks[maskStr]) 
        {
            var mask = new MaskItem(maskStr);
            MaskEngine.Masks[maskStr] = mask;
        }
        
        return MaskEngine.Masks[maskStr];        
    }
}
var MaskSectionType={"Standard":0,"Literal":1,"Day":2,"Month":3,"Year":4};
function MaskItemSection()
{
    this.DisplayChars = [];
    this.Type = MaskSectionType.Standard;
}
function MaskItem(maskStr)
{
    EpiObject.call(this, "MaskItem");
    this.MaskStr = maskStr;
    
    this.RegExpr;
    this.RegExprDyn;
    this.FormatStr = "";
    this.UnformatStr = "";
    this.JustDateLiterals = "";
    this.CharArray = [];
    this.Sections = [];
    this.IsDate=false;
    
    this.InputChar = "_";
    if(maskStr.indexOf(this.InputChar) > -1) this.InputChar = " ";

    this.Init();  
}
MaskItem.prototype.Init=function()
{
    var DATE_CHARS="dMy";
    var MASK_CHARS = "#&Aa9?@" + DATE_CHARS;
    var	REGEXP_ESC_CHARS = "$()*+.[]?/^{}|";  

    var charStr, literalFlg, prevLiteralFlg, srcChar, lowerLimit, cnt, maskStr, formatCnt=0, formatStr="", unformatStr="";
    var dayFound=false, monthFound=false, yearFound=false;

    regExpr = "";
    regExprDyn = "";
    var maskChars = [];

    this.Sections.push(new MaskItemSection());
    
    var maskCnt = this.MaskStr.length;
    var idx = 0;
    for(var ii=0; ii<=maskCnt-1; ii++)
    {    
	    charStr = this.MaskStr.substr(ii, 1);
	    srchChar = charStr;
	    lowerLimit = 1;
		
	    literalFlg = false;
	    if(charStr=="\\")
	    {
     	    ii++;
		    charStr = this.MaskStr.substr(ii, 1);
		    literalFlg = true;		
			
		    srchChar = "\\" + srchChar;
	    }
	    else if(MASK_CHARS.indexOf(charStr)==-1)
	    {
		    literalFlg = true;
	    }
		
	    if(literalFlg)
	    {
	        if(prevLiteralFlg!=true && regExpr!="") 
	    	{
	    	    regExpr += ")";
	    	    formatStr += "$" + (++formatCnt).toString();
	    	    
	    	    regExprDyn += ")";
	    	    unformatStr += "$" + (formatCnt).toString();
	    	}
	    	formatStr+=charStr;
            if(this.IsDate) 
            {
                unformatStr+=charStr;
                this.JustDateLiterals+=charStr;
            }
	    
		    // Check if it needs to be escaped.
		    if(charStr=="\\" || REGEXP_ESC_CHARS.indexOf(charStr)==-1)
			    regExprDyn += "[" + charStr + "]";
		    else
			    regExprDyn += "[\\" + charStr + "]";
			
			maskChars[idx++] = {"Literal":true,"Char":charStr,"SectionIndex":this.Sections.length-1};
			this.Sections.push(new MaskItemSection());
			this.Sections[this.Sections.length-1].DisplayChars.push({"Pos":idx-1});
		    
		    this.Sections.push(new MaskItemSection());
	    }
	    else
	    {
	        if(prevLiteralFlg==true || regExpr=="") 
	        {
	            regExpr += "(";
	            regExprDyn += "(";
	        }

            var section = this.Sections[this.Sections.length-1];
	        
		    switch(charStr)
		    {
			    case "&": 
			    case "@": 
				    lowerLimit = 0;
				    regExpr += "[\\S| ]";				
				    regExprDyn += "[\\S|" + this.InputChar + "]"; break;
			    case "#": 
				    regExpr += "[0-9]";			
				    regExprDyn += "[0-9" + this.InputChar + "]"; break;
			    case "9": 
                case "d":
                case "M":
                case "y":
				    lowerLimit = 0;
				    regExpr += "[0-9 ]";			
				    regExprDyn += "[0-9" + this.InputChar + "]"; 
                    
                    this.IsDate=true;
                    if(charStr=="d")
                        section.Type = MaskSectionType.Day;
                    else if(charStr=="M")
                        section.Type = MaskSectionType.Month;
                    else if(charStr=="y")
                        section.Type = MaskSectionType.Year;
                    else 
                        this.IsDate=false;

                    break;
			    case "?": 
				    regExpr += "[A-Za-z]";		
				    regExprDyn += "[A-Za-z" + this.InputChar + "]"; break;
			    case "A": 
				    regExpr += "[A-Za-z0-9]";	
				    regExprDyn += "[A-Za-z0-9" + this.InputChar + "]"; break;
			    case "a": 
				    lowerLimit = 0;
				    regExpr += "[A-Za-z0-9 ]";	
				    regExprDyn += "[A-Za-z0-9" + this.InputChar + "]"; break;
		    }
			
		    maskChars[idx++] = {"Literal":false,"Char":charStr,"SectionIndex":this.Sections.length-1};
		    section.DisplayChars.push({"Pos":idx-1});
	    }

	    cnt = 1;
	    moveOnFlg = false;
	    charInfo = maskChars[idx-1];
	    while(!moveOnFlg)
	    {
		    if((ii+srchChar.length<=this.MaskStr.length) && this.MaskStr.substr(ii + srchChar.length, srchChar.length)==srchChar)
		    {
			    cnt++
			    ii = ii + srchChar.length;
			    maskChars[idx++] = {"Literal":charInfo["Literal"],"Char":charInfo["Char"],"SectionIndex":this.Sections.length-1};
			    this.Sections[this.Sections.length-1].DisplayChars.push({"Pos":idx-1});
		    }
		    else
			    moveOnFlg = true;
	    }
		
	    if(lowerLimit==0)
	    {
		    regExpr = regExpr + "{0," + cnt.toString() + "}";
		    regExprDyn = regExprDyn + "{0," + cnt.toString() + "}";
	    }
	    else if(cnt>1)
	    {
		    regExpr = regExpr + "{" + cnt.toString() + "}";
		    regExprDyn = regExprDyn + "{" + cnt.toString() + "}";
	    }
	    prevLiteralFlg = literalFlg;	    
    }
    
    if(regExpr!="" && prevLiteralFlg!=true) 
    {
	    regExpr += ")";
	    formatStr += "$" + (++formatCnt).toString();
	    
	    regExprDyn += ")";
	    unformatStr += "$" + (formatCnt).toString();
	}
    
    if(regExpr!="") regExpr = "^" + regExpr + "$";
    if(regExprDyn!="") regExprDyn = "^" + regExprDyn + "$";
    
    this.FormatStr = formatStr;
    this.UnformatStr = unformatStr;
    this.RegExpr = new RegExp(regExpr);
    this.RegExprDyn = new RegExp(regExprDyn);
    this.CharArray = maskChars;
    this.EmptyText = this.Format("");
}
MaskItem.prototype.GetDateCharPosition=function(charVal,pos,checkNext)
{
    if(!this.IsDate) return true;

    var returnPos = null;

    var newTxt = "", currentTxt = "";
    var sectionIndex = this.CharArray[pos-1].SectionIndex;
    var section = this.Sections[sectionIndex];

    if(section.Type!=MaskSectionType.Month && section.Type!=MaskSectionType.Day && section.Type!=MaskSectionType.Year) return false;

    for(var d in section.DisplayChars)
    {
        var theChar = section.DisplayChars[d];
        if(theChar.Pos==pos-1)
        {
            newTxt+=charVal;
        }
        else if(theChar.Char!=this.InputChar)
        {
            newTxt+=theChar.Char;
        }
        currentTxt+=theChar.Char;
    }

    if(this.IsValidDateValue(section,newTxt))
    {
        returnPos = pos;
    }
    else if(checkNext && this.IsValidDateValue(section,currentTxt))
    {
        var nextSection = sectionIndex+1;
        while(nextSection<this.Sections.length)
        {
            var sect = this.Sections[nextSection];
            if(sect.Type==MaskSectionType.Day || sect.Type==MaskSectionType.Month || sect.Type==MaskSectionType.Year)
            {
                returnPos = this.GetDateCharPosition(charVal,sect.DisplayChars[0].Pos+1,false);
                break;
            }
            nextSection++;
        }
    }

    return returnPos;
}
MaskItem.prototype.IsValidDateValue=function(section,val)
{
    if(!Int32.TryParse(val)) return false;
    var num = Global.ArgManager["Out1"];

    var valid = false;
    switch(section.Type)
    {
        case MaskSectionType.Day:
            if(num=="0" || (num>0 && num<32)) valid = true;
            break;
        case MaskSectionType.Month:
            if(num=="0" || (num>0 && num<13)) valid = true;
            break;
        case MaskSectionType.Year:
            valid = true;
            break;
    }
    return valid;
}
MaskItem.prototype._getText=function()
{
    var txt = "";
    for(var s in this.Sections)
    {
        s=this.Sections[s];
        for(var d in s.DisplayChars)
        {
            txt+=s.DisplayChars[d].Char;
        }
    }

    txt = txt.Replace(" ", this.InputChar);
    return txt;
}
MaskItem.prototype.Format=function(val)
{
    var str = "";
    if(val!="" && val.match(this.RegExpr))
    {
        str=val.replace(this.RegExpr, this.FormatStr);
    }
    else
    {
        var idx = 0;
	    var charVal;
	    var masked = "";

	    for(var ii=0; ii<=this.CharArray.length-1; ii++)
	    {
		    if(this.CharArray[ii].Literal)	// Literal
		    {
			    masked += this.CharArray[ii].Char;
		    }
		    else
		    {
			    if(val.length > idx)
			    {
				    charVal = val.substr(idx++, 1);
				    if(charVal==" ") charVal = this.InputChar;
			    }
			    else
				    charVal = this.InputChar;
    				
			    masked += charVal; 
		    }
	    }
	    if(masked.match(this.RegExprDyn)) str = masked;
    }
    
    str = str.Replace(" ", this.InputChar);
    this.SyncChars(str);
    
    return str;
}
MaskItem.prototype.SyncChars=function(str)
{
    str = str.Replace(this.InputChar, " ");
    for(var s in this.Sections)
    {
        s=this.Sections[s];
        for(var d in s.DisplayChars)
        {
            d = s.DisplayChars[d];
            var ch = str.substr(d.Pos,1);
            if(ch==this.InputChar) ch=" ";
            d.Char=ch;            
        }
    }
}
MaskItem.prototype.Unformat=function(val)
{
    if(val==this.EmptyText || val=="") return "";

    var str = "";
    if(val.match(this.RegExprDyn))
    {
        str=val.replace(this.RegExprDyn, this.UnformatStr);
        str = str.Replace(this.InputChar, " ");
        str = str.Trim();
    }

    if(this.IsDate)
    {
        str = str.Replace(" ", "");
        if(str==this.JustDateLiterals) str = "";
    }
    
    if(str.match(this.RegExpr) || this.IsDate) 
        return str;
    else
        throw new UIException("That is an incomplete value.");
}
MaskItem.prototype.IsValid=function(val, dynFlg)
{
    if(dynFlg)
        return this.RegExprDyn.test(val);
    else
        return this.RegExpr.test(val);
}

var FormatEngine = 
{
    CultureInfo:{"LongTimePattern":"h:mm:ss tt","ShortTimePattern":"h:mm tt","ShortDatePattern":"M/d/yyyy","FirstDayOfWeek":"0","MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"DayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"AbbreviatedDayNames":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"AbbreviatedMonthNames":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"NumberDecimalSeparator":".","NumberGroupSeparator":",","NumberNegativePattern":"1","CurrencyPositivePattern":"0","CurrencyNegativePattern":"0","NegativeSign":"-"},
    GetCultureInfo:function()
    {
        FormatEngine.CultureInfo = Globalization.CultureInfo(FormatEngine.GetLocale());
    },    
    GetLocale:function()
    {
	    return Global.ServerSession.FormatCultureName;
    },
    ToNumber:function(str, formattedFlg)
    {
        if(str==null) return "";

        var isPercentage=false;
        if(formattedFlg)
        {
            var decSep = FormatEngine.CultureInfo.NumberDecimalSeparator;
            var grpSep = FormatEngine.CultureInfo.NumberGroupSeparator;
            
            if(str.indexOf('%')!=-1)
            {
                str=str.replace(/\%/g, '');
                isPercentage=true;
            }
            
            var re = new RegExp('[^\\'+decSep+'\\d\\-\\+\\(\\)eE]', 'g');
            str=str.replace(re, '');
            var tempRe = new RegExp('['+decSep+']', 'g');
            var treArray = tempRe.exec(str);
            
            if(treArray!=null)
            {
                var tempRight = str.substring(treArray.index+treArray[0].length);
                str=str.substring(0, treArray.index)+ "." +tempRight.replace(tempRe, '');
            }
            
            if(str.charAt(str.length-1)=="-")
            {
                str=str.substring(0, str.length-1);
                str='-'+str;
            }
            else if(str.charAt(0)=="("&&str.charAt(str.length-1)==")")
            {
                str=str.substring(1, str.length-1);
                str='-'+str;
            }
        }
        
        str=parseFloat(str);

        if(!isFinite(str))
            throw new UIException("That is an invalid number.");
        else if(isPercentage)
            str=this._moveDecimal(str, true, 2);

        return str;
    },
    FormatNumber:function(val,mask, ci)
    {
        if((Global.IsString(val) && val=="") || val==undefined || val==null) return "";

        var pos;
        var str;
        var splitString = new Array(2);
        
        if (!ci) ci = FormatEngine.CultureInfo;
        
		// Use the format information from the cultureinfo was passed in (if so)
        var decSep = ci.NumberDecimalSeparator;
        var grpSep = ci.NumberGroupSeparator;
        var numPattern = ci.NumberNegativePattern;
        var isPercentage=false;
        
        if(mask)
        {
            var places = 0;
            if(mask.indexOf('%')!=-1)
            {
                mask=mask.replace(/\%/g, '');
                isPercentage=true;
            }
            var maskArr = mask.split(".");
            if(maskArr.length>1) places = maskArr[1].length;

            val = this._roundNumber(val, places);
            str = this._preserveZeros(Math.abs(val), places);
            
            if(mask.indexOf(",")>-1)
                str = this._addSeparators(str, ".", decSep, grpSep);
            else
                str = this._addSeparators(str, ".", decSep, "");
        }
        else
        {
            str = Math.abs(val);
        }

        if(val<0)
        {
            switch(numPattern)
            {
                case "0":
                    str = "(" + str + ")"; break;
                case "1":
                    str = "-" + str; break;
                case "2":
                    str = "- " + str; break;
                case "3":
                    str = str + "-"; break;
                case "4":
                    str = str + " -"; break;
            }
        }
        if (isPercentage) 
        {
            str=this._moveDecimal(str, false, 2); // For percentage format, we need to multiply by 100 or move 2 decimal places to the right
            str = str + "%";
        }
        return str;
    },
    _roundNumber:function(val, places)
    {
        val=this._moveDecimal(val, false, places);
        val=Math.round(val);
        val=this._moveDecimal(val, true, places);
        
        return val;
    },
    _preserveZeros:function(val,places)
    {
        var i;
        val=this._expandExponential(val);

        if(places<=0) return val;

        var decimalPos = val.indexOf('.');

        if(decimalPos==-1)
        {
            val+='.';

            for (i=0; i<places; i++)
            {
                val+='0';
            }
        }
        else
        {
            var actualDecimals = (val.length-1)-decimalPos;
            var difference = places-actualDecimals;

            for (i=0; i<difference; i++)
            {
                val+='0';
            }
        }

        return val;
    },
    _expandExponential:function(origVal)
    {
        if(isNaN(origVal)) return origVal;

        var newVal = parseFloat(origVal)+'';
        var eLoc = newVal.toLowerCase().indexOf('e');

        if(eLoc!=-1)
        {
            var plusLoc = newVal.toLowerCase().indexOf('+');
            var negLoc = newVal.toLowerCase().indexOf('-', eLoc);
            var justNumber = newVal.substring(0, eLoc);

            if(negLoc!=-1)
            {
                var places = newVal.substring(negLoc+1, newVal.length);
                justNumber=this.moveDecimalAsString(justNumber, true, parseInt(places));
            }
            else
            {
                if(plusLoc==-1)
                    plusLoc=eLoc;

                var places = newVal.substring(plusLoc+1, newVal.length);
                justNumber=this.moveDecimalAsString(justNumber, false, parseInt(places));
            }

            newVal=justNumber;
        }

        return newVal;
    },
    _addSeparators:function(nStr, inD, outD, sep)
    {
        nStr+='';
        var dpos = nStr.indexOf(inD);
        var nStrEnd = '';

        if(dpos!=-1)
        {
            nStrEnd=outD+nStr.substring(dpos+1, nStr.length);
            nStr=nStr.substring(0, dpos);
        }

        if(sep.length==1)
        {
            var rgx = /(\d+)(\d{3})/;

            while(rgx.test(nStr))
            {
                nStr=nStr.replace(rgx, '$1'+sep+'$2');
            }
        }

        return nStr+nStrEnd;
    },
    _moveDecimal:function(val, left, places)
    {
        var spaces = (arguments.length<3) ? this.places : places;

        if(spaces<=0)
            return val;

        var newVal = val+'';
        var extraZ = this._getZeros(spaces);
        var re1 = new RegExp('([0-9.]+)');

        if(left)
        {
            newVal=newVal.replace(re1, extraZ+'$1');
            var re2 = new RegExp('(-?)([0-9]*)([0-9]{'+spaces+'})(\\.?)');
            newVal=newVal.replace(re2, '$1$2.$3');
        }
        else
        {
            var reArray = re1.exec(newVal);

            if(reArray!=null)
            {
                newVal=newVal.substring(0, reArray.index)+reArray[1]+extraZ
                           +newVal.substring(reArray.index+reArray[0].length);
            }

            var re2 = new RegExp('(-?)([0-9]*)(\\.?)([0-9]{'+spaces+'})');
            newVal=newVal.replace(re2, '$1$2$4.');
        }
        
        newVal=newVal.replace(/^(0*)/, '');
        newVal=newVal.replace(/\.$/, '');
        return newVal;
    },
    _getZeros:function(places)
    {
        var extraZ = '';
        var i;

        for (i=0; i<places; i++)
        {
            extraZ+='0';
        }

        return extraZ;
    },
    ToDate:function(val, format, isTime, ci)
    {
        if(val=="" || val==null) return null;
    
        if(!ci) ci = this.CultureInfo;
    
        if(format==null)  // User entered.
        {
            var generalFormats=new Array('yyyy-M-dThh:mm:ss', 'y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d','MMM-d','d-MMM');
		    var monthFirst=new Array('M/d/y','M-d-y','M.d.y','M/d','M-d');
		    var dateFirst =new Array('d/M/y','d-M-y','d.M.y','d/M','d-M');
		    var timeArray = new Array('h:mm tt','H:mm', 'tt h:mm');
		    
		    var checkList;
		    
		    if(isTime)
		        checkList = new Array(timeArray);
		    else if(ci.ShortDatePattern.charAt(0).toLowerCase()=="m")
		        checkList=new Array(monthFirst,generalFormats,dateFirst);
		    else
		        checkList=new Array(dateFirst,generalFormats,monthFirst);
		    
		    for (var i=0; i<checkList.length; i++) 
		    {
			    var l=checkList[i];
			    for (var j=0; j<l.length; j++) 
			    {
				    var d=this.ToDate(val,l[j]);
				    if (d!=null) return d; 
				}
			}
			
			if(isTime)
			    throw new UIException("That is not a valid time.");
			else
			{
			    if(val.length==25)  // Might be format "2009-04-28T00:00:00-05:00"
			        return FormatEngine.ToDate(val.substring(0,19),"global",isTime,ci);

    		    throw new UIException("That is not a valid date.");
    	    }
        }
        
        if(format=="global")
        {
            if (val.indexOf("T") == -1) return null; // If format is 'global' it should be like this: "2009-02-27T00:00:00-08:00"
            return new Date(val.substr(0, 4),this._getInt(val.substr(5, 2),0,2,2)-1, val.substr(8,2), val.substr(11,2), val.substr(14,2), val.substr(17,2));
        }

        val = val+"";
        format=format+"";

        var iVal = 0, iFormat=0;
        var c="",token="",token2="";
        var x,y;
        var year = new Date().getFullYear();
        var month=1, date=1, hh=0, mm=0, ss=0, ampm="";
        
        while(iFormat < format.length)
        {
            c=format.charAt(iFormat);
            token="";
		    while ((format.charAt(iFormat)==c) && (iFormat < format.length)) 
		    {
			    token += format.charAt(iFormat++);
		    }
		    if(token=="yyyy"||token=="yy"||token=="y")
		    {
		        if(token=="yyyy")   {x=4;y=4;}
		        if(token=="yy")     {x=2;y=2;}
		        if(token=="y")      {x=2;y=4;}
		        
		        year=this._getInt(val,iVal,x,y);
		        if(year==null) return null;
    		    
		        iVal+=year.length;
		        if(year.length==2)
		        {
		            if(year>70) 
		                year=1900+(year-0);
		            else
		                year=2000+(year-0);
		        }
		    }
            else if(token=="MMM"||token=="NNN")
            {
                month=0;
                var names = (token=="MMM"?(ci.MonthNames.concat(ci.AbbreviatedMonthNames)):ci.AbbreviatedMonthNames);
			    for (var i=0; i<names.length; i++) 
			    {
				    var month_name=names[i];
				    if (val.substring(iVal,iVal+month_name.length).toLowerCase()==month_name.toLowerCase()) 
				    {
					    month=(i%12)+1;
					    iVal += month_name.length;
					    break;
				    }
			    }
			    if ((month < 1)||(month>12)) return null;
            }
            else if(token=="EE"||token=="E")
            {
                var names = (token=="EE"?ci.DayNames:ci.AbbreviatedDayNames);
			    for (var i=0; i<names.length; i++) 
			    {
				    var day_name=names[i];
				    if (val.substring(iVal,iVal+day_name.length).toLowerCase()==day_name.toLowerCase()) 
				    {
					    iVal += day_name.length;
					    break;
				    }
			    }
            }
 		    else if (token=="MM"||token=="M") 
 		    {
			    month=this._getInt(val,iVal,token.length,2);
			    if(month==null||(month<1)||(month>12)) return null;
			    iVal+=month.length;
		    }
		    else if (token=="dd"||token=="d") 
		    {
			    date=this._getInt(val,iVal,token.length,2);
			    if(date==null||(date<1)||(date>31))return null;
			    iVal+=date.length;
		    }
		    else if (token=="hh"||token=="h") 
		    {
			    hh=this._getInt(val,iVal,token.length,2);
			    if(hh==null||(hh<1)||(hh>12)) return null;
			    iVal+=hh.length;
		    }
		    else if (token=="HH"||token=="H") 
		    {
			    hh=this._getInt(val,iVal,token.length,2);
			    if(hh==null||(hh<0)||(hh>23)) return null;
			    iVal+=hh.length;
		    }
		    else if (token=="KK"||token=="K") 
		    {
			    hh=this._getInt(val,iVal,token.length,2);
			    if(hh==null||(hh<0)||(hh>11)) return null;
			    iVal+=hh.length;
			    hh++;
		    }
		    else if (token=="kk"||token=="k") 
		    {
			    hh=this._getInt(val,iVal,token.length,2);
			    if(hh==null||(hh<1)||(hh>24)) return null;
			    iVal+=hh.length;
			    hh--;
		    }
		    else if (token=="mm"||token=="m") 
		    {
			    mm=this._getInt(val,iVal,token.length,2);
			    if(mm==null||(mm<0)||(mm>59)) return null;
			    iVal+=mm.length;
		    }
		    else if (token=="ss"||token=="s") 
		    {
			    ss=this._getInt(val,iVal,token.length,2);
			    if(ss==null||(ss<0)||(ss>59)) return null;
			    iVal+=ss.length;
		    }
		    else if (token=="a"|token=="tt") 
		    {
			    if (val.substring(iVal,iVal+2).toLowerCase()=="am") ampm="AM";
			    else if (val.substring(iVal,iVal+2).toLowerCase()=="pm") ampm="PM";
			    else if (val.substring(iVal,iVal+2).toLowerCase()=="a.m.") ampm="AM";
			    else if (val.substring(iVal,iVal+2).toLowerCase()=="p.m.") ampm="PM";
			    else return null;
			    iVal+=2;
		    }
		    else 
		    {
			    if (val.substring(iVal,iVal+token.length)!=token) 
			        return null;
			    else 
			        iVal+=token.length;
		    }
        }
        
	    // If there are any trailing characters left in the value, it doesn't match
	    if (iVal != val.length)  return null; 
	    
	    // Is date valid for month?
	    if (month==2) 
	    {
		    // Check for leap year
		    if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) 
		    { 
			    if (date > 29) return null; 
		    }
		    else 
		    { 
			    if (date > 28)  return null; 
		    }
	    }
	    if ((month==4)||(month==6)||(month==9)||(month==11)) 
	    {
		    if (date > 30)  return null; 
	    }
	    // Correct hours value
	    if (hh<12 && ampm=="PM") hh=hh-0+12; 
	    else if (hh>11 && ampm=="AM")  hh-=12; 
	    
	    return new Date(year,month-1,date,hh,mm,ss);
    },
    ToTime:function(val, decimals)
    {
        if(val=="")
        {
            return "0";
        }
    
        var timeVal;
        var cDateTime = this.ToDate(val, null, true);
		var workSeconds = cDateTime.getHours() * 3600;
		workSeconds += cDateTime.getMinutes() * 60;
		workSeconds += cDateTime.getSeconds();
		
		if(decimals)
		{
    		timeVal = workSeconds/3600;
            timeVal = this._roundNumber(timeVal,2);
            
            timeVal = Convert.ToDecimal(timeVal);
		}
		else
		{
			timeVal = workSeconds;
		}
        
        return timeVal.toString();
    },
    FormatTime:function(val, decimals, zeroEqNull, roundToMinute)
    {
        var retVal = "";
        if(!(zeroEqNull && val=="0") && val!="")
        {
            var workDateTime;
            if(decimals)
            {
                var dWorkTime = Convert.ToDecimal(val);
                workDateTime = this._convertTime(dWorkTime * 3600, roundToMinute);
            }
            else
            {
                var iWorkTime = Convert.ToInt32(val);
                workDateTime = this._convertTime(iWorkTime, roundToMinute);
            }
            
            retVal = this.FormatDate(workDateTime, FormatEngine.CultureInfo.ShortTimePattern);
        }
        
        return retVal;    
        
    },
    _convertTime:function(seconds, roundToMinute)
    {   
        var workDateTime;
        var workHours=0, workMinutes=0, workSeconds=0, workDMinutes=0;
        
        if(roundToMinute)
        {
		    workDMinutes = seconds/60.0;
		    workDMinutes = this._roundNumber(workDMinutes, 0);
		    workDateTime = new Date();
		    workDateTime.setHours(0, workDMinutes, 0, 0);
        }
        else
        {
			workHours = seconds/3600;
			seconds = seconds % 3600;
			workMinutes = seconds/60; 
			workSeconds = seconds % 60;
			workDateTime = new Date();
			workDateTime.setHours(workHours, workMinutes, workSeconds, 0);
        }
        return workDateTime;
    },
    GetShortDateMaskPattern:function()
    {
        if(FormatEngine.CultureInfo.ShortDateMaskPattern==null)
        {
            var format=this.CultureInfo.ShortDatePattern;

            var maskPattern = format.Replace("yyyy","<1>").Replace("yy","<1>").Replace("y","<1>");
            maskPattern = maskPattern.Replace("MMM","<2>").Replace("MM","<2>").Replace("M","<2>").Replace("NNN","<2>");
            maskPattern = maskPattern.Replace("dd","<3>").Replace("d","<3>");
            maskPattern = maskPattern.Replace("<1>","yyyy").Replace("<2>","MM").Replace("<3>","dd");

            FormatEngine.ShortDateMaskPattern = maskPattern;
        }

        return FormatEngine.ShortDateMaskPattern;
    },
    FormatDate:function(val, format)
    {
        if(val==null) return "";
    
        var ci = this.CultureInfo;
    
        if(format==null) format=ci.ShortDatePattern;
	    var result="";
	    var iFormat=0;
	    var c="";
	    var token="";
	    var y=val.getYear()+"";
	    var M=val.getMonth()+1;
	    var d=val.getDate();
	    var E=val.getDay();
	    var H=val.getHours();
	    var m=val.getMinutes();
	    var s=val.getSeconds();
	    var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
	    // Convert real date parts into formatted versions
	    var value=new Object();
	    if (y.length < 4) 
	    {
		    y=""+(+y+1900);
	    }
	    value["y"]=""+y;
	    value["yyyy"]=y;
	    value["yy"]=y.substring(2,4);
	    value["M"]=M;
	    value["MM"]=this._LZ(M);
	    value["MMM"]=ci.MonthNames[M-1];
	    value["NNN"]=ci.AbbreviatedMonthNames[M-1];
	    value["d"]=d;
	    value["dd"]=this._LZ(d);
	    value["E"]=ci.AbbreviatedDayNames[E];
	    value["EE"]=ci.DayNames[E];
	    value["H"]=H;
	    value["HH"]=this._LZ(H);
	    if (H==0)
		    value["h"]=12;
	    else if (H>12)
		    value["h"]=H-12;
	    else 
		    value["h"]=H;

	    value["hh"]=this._LZ(value["h"]);
	    value["K"]=value["h"]-1;
	    value["k"]=value["H"]+1;
	    value["KK"]=this._LZ(value["K"]);
	    value["kk"]=this._LZ(value["k"]);
	    if (H > 11) 
	    {
		    value["a"]="PM"; 
		    value["tt"]="PM";
		}
	    else 
	    {
		    value["a"]="AM"; 
		    value["tt"]="AM";
		}
	    value["m"]=m;
	    value["mm"]=this._LZ(m);
	    value["s"]=s;
	    value["ss"]=this._LZ(s);
	    while (iFormat < format.length) 
	    {
		    c=format.charAt(iFormat);
		    token="";
		    while ((format.charAt(iFormat)==c) && (iFormat < format.length)) 
		    {
			    token += format.charAt(iFormat++);
		    }
		    if (value[token] != null) 
		    { 
			    result=result + value[token]; 
		    }
		    else 
		    { 
			    result=result + token; 
		    }
	    }
	    return result;
    },
    _getInt:function(str,i,minlength,maxlength) 
    {
		for (var x=maxlength; x>=minlength; x--) 
		{
			var token=str.substring(i,i+x);
			if (token.length < minlength) return null; 
			if (this._isInt(token)) return token; 
		}
	    return null;    
    },
    _isInt:function(val)
    {
		for (var i=0; i < val.length; i++) 
		{
			if ("1234567890".indexOf(val.charAt(i))==-1) return false; 
		}
		return true;
    },
    _LZ:function(x)
    {
        return(x<0||x>9?"":"0")+x;
    }
};

var GridState = { Default: 0, Resize: 1, HoverEdge: 2, ReadyToDrag: 3, Drag: 4, SkipOnClick: 5 }
var DragState={Default:0,Header:1,GroupBy:2};

var BrowserHelper = 
{
    GetFormSizeOffsets:function()
    {
        var offsets = {HeightOffset:0,WidthOffset:0};
        if(Global.document.all)
        {
            if(Global.GetBrowserVersion()=="7.0")
            {
                offsets.WidthOffset = -10;
                offsets.HeightOffset = -34;
            }
            else
            {
                offsets.WidthOffset = -10;     
            }
        }
        else
        {
            offsets.HeightOffset = 22;
        }
        return offsets;
    },
    ConvertFormSize:function(size)
    {
        var offsets = BrowserHelper.GetFormSizeOffsets();
        
        return {"Height":size.Height+offsets.HeightOffset,"Width":size.Width+offsets.WidthOffset};
    },
    SetFormSize:function(size)
    {
        size = BrowserHelper.ConvertFormSize(size);
        
        if(document.all)
        {
            Global.window.dialogHeight = size.Height + "px";
            Global.window.dialogWidth = size.Width + "px";
        }
        else
        {        
            Global.window.resizeTo(size.Width, size.Height);
        }
    },
    GetEvent:function(e)
    { 
        return (window.event)? event : e; 
    },
    GetEventSource:function(e)
    { 
        var evtobj = this.GetEvent(e);
        return (evtobj.srcElement)? evtobj.srcElement : evtobj.target; 
    },    
    GetOpener:function()
    {
        var opener=null;
        if((GlobalObject.Form) && (GlobalObject.Form.IsDialog))
        {
            if(document.all)
            {
                var args = GlobalObject.window.dialogArguments;
                opener=args.Opener;
            }
            else
            {
                opener=GlobalObject.window.opener;
            }
        }
        return opener;
    },
    GetParentOpener:function()
    {
        var srcObj = null;
        //this method returns an opener or a parent depending where it is called from
        if(Global.document.all && Global.window.dialogArguments)
        {
            return Global.window.dialogArguments.Opener;
        }        
		// Safari
		if(!Global.document.all && Global.window.dialogArguments)
        {
            return Global.window.dialogArguments.Opener;
        }		
		if(!Global.document.all && 
		    Global.window.opener && 
		    Global.window.opener.GlobalObject && 
		    Global.window.opener.GlobalObject.DialogArguments && 
		    Global.window.opener.GlobalObject.DialogArguments.Opener)
        {
            return Global.window.opener.GlobalObject.DialogArguments.Opener;
        }
        else
        {        
            var src = Global.GetUrlArg("source");
            var formIdx = Global.GetUrlArg("formidx");
            if(src!="" && formIdx!="")
            {
                var srcObj;
                if(src=="opener") 
                {
                    srcObj = Global.window.opener;
                    if(!srcObj && Global.window.parent)
                        srcObj = Global.window.parent;
                }
                else if(src=="parent")
                {
                    srcObj = Global.window.parent;
                }
            }
            else if (Global.window.parent != Global.window.top) // Make sure its really the parent window. parent points to the same window if there is no real parent.
            {
                srcObj = Global.window.parent;
            }
        }
        return srcObj;
    }
}

/* 
Copyright (C) 2007 Apple Computer, Inc.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var WebKitDetect = {  };

// If the user agent is WebKit, returns true. Otherwise, returns false.
WebKitDetect.isWebKit = function isWebKit()
{
    return RegExp("AppleWebKit/index.html").test(navigator.userAgent);
}

// If the user agent is WebKit, returns an array of numbers matching the "." separated 
// fields in the WebKit version number, with an "isNightlyBuild" property specifying
// whether the user agent is a WebKit nightly build. Otherwise, returns null.
//
// Example: 418.10.1 => [ 418, 10, 1 ] isNightlyBuild: false
WebKitDetect.version = function version() 
{
    /* Some example strings: 
            Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/418.9.1 (KHTML, like Gecko) Safari/419.3
            Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Safari/521.32
     */
     
    // grab (AppleWebKit/)(xxx.x.x)
    var webKitFields = RegExp("( AppleWebKit/)([^ ]+)").exec(navigator.userAgent);
    if (!webKitFields || webKitFields.length < 3)
        return null;
    var versionString = webKitFields[2];

    var isNightlyBuild = versionString.indexOf("+") != -1;

    // Remove '+' or any other stray characters
    var invalidCharacter = RegExp("[^\\.0-9]").exec(versionString);
    if (invalidCharacter)
        versionString = versionString.slice(0, invalidCharacter.index);
    
    var version = versionString.split(".");
    version.isNightlyBuild = isNightlyBuild;
    return version;
}

// If the user agent is a WebKit version greater than or equal to the version specified
// in the string minimumString, returns true. Returns false otherwise. minimumString 
// defaults to "".
//
// Example usage: WebKitDetect.versionIsAtLeast("418.10.1")
WebKitDetect.versionIsAtLeast = function versionIsAtLeast(minimumString)
{
    function toIntOrZero(s) 
    {
        var toInt = parseInt(s);
        return isNaN(toInt) ? 0 : toInt;
    }

    if (minimumString === undefined)
        minimumString = "";
    
    var minimum = minimumString.split(".");
    var version = WebKitDetect.version();

    if (!version)
        return false;
        
    if (version.isNightlyBuild)
        return true;

    for (var i = 0; i < minimum.length; i++) {
        var versionField = toIntOrZero(version[i]);
        var minimumField = toIntOrZero(minimum[i]);
        
        if (versionField > minimumField)
            return true;
        if (versionField < minimumField)
            return false;
    }

    return true;
}

WebKitDetect.isMobile = function isMobile()
{
    return WebKitDetect.isWebKit() && RegExp("Mobile/index.html").test(navigator.userAgent);
}

WebKitDetect.mobileDevice = function mobileDevice()
{
    if (!WebKitDetect.isMobile())
        return null;
        
    var fields = RegExp("(Mozilla/5.0 \\()([^;]+)").exec(navigator.userAgent);
    if (!fields || fields.length < 3)
        return null;
    return fields[2];
}

// Example: 1C28 => [ 1, C, 28 ]
WebKitDetect._mobileVersion = function _mobileVersion(versionString)
{
    var fields = RegExp("([0-9]+)([A-Z]+)([0-9]+)").exec(versionString);
    if (!fields || fields.length != 4)
        return null;
    return [ fields[1], fields[2], fields[3] ];
}

WebKitDetect.mobileVersion = function mobileVersion()
{
    // grab (Mobile/)(nxnnn)
    var fields = RegExp("( Mobile/)([^ ]+)").exec(navigator.userAgent);
    if (!fields || fields.length < 3)
        return null;
    var versionString = fields[2];
    
    return WebKitDetect._mobileVersion(versionString);
}

WebKitDetect.mobileVersionIsAtLeast = function mobileVersionIsAtLeast(minimumString)
{
    function toIntOrZero(s) 
    {
        var toInt = parseInt(s);
        return isNaN(toInt) ? 0 : toInt;
    }

    if (minimumString === undefined)
        minimumString = "";

    var minimum = WebKitDetect._mobileVersion(minimumString);
    var version = WebKitDetect.mobileVersion();

    if (!version)
        return false;
        
    var majorVersInt = toIntOrZero(version[0]);
    var majorMinInt = toIntOrZero(minimum[0]);
    if (majorVersInt > majorMinInt)
        return true;
    if (majorVersInt < majorMinInt)
        return false;
    
    var majorVersAlpha = version[1];
    var majorMinAlpha = minimum[1];
    if (majorVersAlpha > majorMinAlpha)
        return true;
    if (majorVersAlpha < majorMinAlpha)
        return false;
    
    var minorVersInt = toIntOrZero(version[2]);
    var minorMinInt = toIntOrZero(minimum[2]);
    if (minorVersInt > minorMinInt)
        return true;
    if (minorVersInt < minorMinInt)
        return false;
    
    return true;
}

var BrowserSniffer =
{
	init : function()
	{	
		var c = [];
		this.IE = ((document.all) && (window.opera == null)) ? true : false;
		if (this.IE) this._getMSIEVersions();
//		this.IE6 = (this.IE && (document.implementation!=null) && (document.compatMode!=null) && (window.XMLHttpRequest==null)) ? true : false;
//		this.IE7 = (this.IE && (window.XMLHttpRequest != null)) ? true : false;

		this.Gecko = ((navigator.product == 'Gecko')) ? true : false;
		this.FireFox15 = (navigator.vendor != 'Apple Computer, Inc.' && navigator.vendor != 'Google Inc.' && navigator.product == 'Gecko' && window.find && !navigator.savePreferences) ? true : false;
		this.Safari13 = (!this.FireFox15 && !this.IE && (navigator.vendor == 'Apple Computer, Inc.' || navigator.vendor != 'Google Inc.')
			&& (document.implementation != null) && (document.implementation.createHTMLDocument != null) && (window.opera == null)) ? true : false;
		this.SafariMobile = (this.Safari13 && WebKitDetect.isMobile()) ? true : false;
	},
   _getMSIEVersions: function()
   {
        var ua = navigator.userAgent;
        var msie = ua.indexOf("MSIE ")
        if (msie > 0)      // If Internet Explorer, get version number
        {
          this.IEVersion= parseInt(ua.substring (msie+5, ua.indexOf (".", msie )))
          // If version is 7, check if documentMode exists, which means it is IE 8/9 pretending to be IE 7 or in compat mode	
          if (this.IEVersion == 7 && document.documentMode) 
          {
            var tridentVer = ua.match(/trident\/([\d.]+)/i);
            if(tridentVer == "4.0") // Trident/4.0 means this is IE 8 in Compatibility mode
            {
                this.IEVersion = 8;
                this.ieBrowserMode = "Compat Mode";
            }
            else if (tridentVer == "5.0")
            {
                this.IEVersion=9;
                this.ieBrowserMode = "Compat Mode";
            }
            else // This means its IE8 or IE9 in IE7 mode
            {
                this.ieBrowserMode = "IE 7 Mode";
            }
          }
          else if (this.IEVersion == 8)
          {
                var tridentVer = ua.match(/trident\/([\d.]+)/i);
                if(tridentVer == "4.0") // Trident/4.0 means this is IE 9 in IE 8 mode
                {
                    this.IEVersion = 9;
                    this.ieBrowserMode = "IE 8 Mode";
                }
          }
          if (this.IEVersion == 6) this.IE6=true;
          if (this.IEVersion == 7) this.IE7=true;
        }
    }
	
}

BrowserSniffer.init();

var DialogHelper = 
{
    "Register": function(dlgGlobal)
    {
        if(!Global.DialogParent)
        {
            while(Global.DialogGlobal)
            {
                if(Global==Global.DialogGlobal) break;
                Global=Global.DialogGlobal;
            }
        }

        if(Global==dlgGlobal)
        {
            Global.DialogSelfCount++;
        }
        else
        {
            Global.DialogGlobal=dlgGlobal;
            dlgGlobal.RRDelegates=Global.RRDelegates; // Copy over the RRDelegates to the Global of the dialog
            dlgGlobal.DialogParent=Global;
            Global=dlgGlobal;
        }

        // If this is a dialog, then we need to register the current global on the
        // opener of this dialog.
        var opener=BrowserHelper.GetOpener();
        if(opener)
        {
            opener.DialogHelper.Register(dlgGlobal);
        }
    },
    "Deregister": function()
    {
        var opener=BrowserHelper.GetOpener();
        if(opener)
        {
            opener.DialogHelper.Deregister();
        }

        while(Global.DialogGlobal)
        {
            if(Global==Global.DialogGlobal) break;
            Global=Global.DialogGlobal;
        }

        if(Global.DialogSelfCount>0)
        {
            Global.DialogSelfCount--;
        }
        else
        {
            if(Global.DialogParent)
            {
                Global=Global.DialogParent;
            }
            else
            {
                Global=GlobalObject;
            }
            Global.DialogGlobal=null;
        }
    },
    "RunOnAll": function(fn)
    {
        var saveGlobal = null;
        try
        {
            if(GlobalObject && GlobalObject!=Global)
            {
                saveGlobal = Global;
                Global = GlobalObject;
            }
            
            fn();

            if (Global != Global.DialogGlobal)
            {
                var saveIt=Global;
                while(Global.DialogGlobal)
                {
                    Global=Global.DialogGlobal;
                    fn();
                    if (Global==Global.DialogGlobal) break;
                }
                Global=saveIt;
            }
            
            if(saveGlobal) Global = saveGlobal;
        }
        catch(err)
        {
            if (saveGlobal) Global = saveGlobal;
            throw err;
        }
    }
}

var GlobalObject;
var Global = GlobalObject =
{
    window:window,
    document:document,
    Assemblies:{"UI.EpiClientLib":new Assembly("Epicor.Mfg.UI.EpiClientLib")},
    ScriptLoaded:new EpiEvent("ScriptLoaded", this),
    IsScriptLoaded:false,
    Form:null,
    SrchAdapter:null,
    BindingEngine:null,
    HasGL:false,
    Grids:{},
    GridSettings:{},
    GridManager:{Current:null,State:GridState.Default,DragState:DragState.Default,Target:null,Grids:[]},
    IsReadOnly:false,
    MenuManager:{ActiveItem:null},
    TabManager:{PaneStyle:"tab",TabGroups:[]},
    DropControlManager:{ActiveDropControl:null,ActiveControlIsOpen:false,ActiveDropContents:null,ActivePopup:null,FocusDropControl:null}, 
    CalendarManager:{Year:null,Month:null,CurrentDate:null},
    ComboManager:{ComboArrays:[]},
    ValidationFailed:false, 
    KeyboardManager:{ShiftKey:false,CtrlKey:false},
    DialogArguments:{},
    ArgManager:{},
    GLLib:{},
    DebugHelper:null,
    LoadedAdapters:{},
    LoadedProxies:{},
    ArgTypes:{"String":"0","Boolean":"1","Int":"2","EpiDataView":"3","EpiTransaction":"4","Object":"5"},
    DialogGlobal:null,
    DialogParent:null,
    DialogSelfCount:0,
    RRDelegates:[],
    BroadcastClient: new BroadcastClient(),
    ClassAttributes:{},
    ViewsWithRequiredCols:{},
    GlobalConstants:null,
    SkipBeforeUnload:false,
    MessagesStore:{},
    HelpForm:null,
    CallContextDS:null,
    GettingNew:false,
    IsTreeReset:false,
    WebScheduleInfos:{},
    PagingIdx:0,
    UserGlobalOptions:{},
    FormDir:"ltr",
    StatusPanel:null,
    ScriptIsLoaded:function()
    {
        Global.IsScriptLoaded = true;
    },
    CopyInitialData: function(globalObj)
    {
	//TO DO: remove this next release.
    },
    Purge: function(d)
    {return;
        var a = d.attributes, i, l, n;
        if (a)
        {
            if (typeof a.ClearAllEventListeners == 'function')
                a.ClearAllEventListeners();
            
            l = a.length;
            for (i = 0; i < l; i += 1)
            {
                if (!a[i])
                    continue;

                n = a[i].name;
                if (typeof d[n] === 'function')
                {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a)
        {
            l = a.length;
            for (i = 0; i < l; i += 1)
            {
                Global.Purge(d.childNodes[i]); EpiEventManager.clearListeners(d.childNodes[i]);
            }
        }
    },
    GetOverloadSeq: function(args)
    {
        var types = Global.ArgTypes;
        var overload = "";
        for(var ii=0; ii<=args.length-1; ii++)
        {
            var arg = args[ii];
        
            if (arg instanceof EpiOverloadedArgs)
                continue; // Ignore this type
                
            if(Global.IsBoolean(arg))
                overload += types.Boolean;
            else if(Global.IsNumber(arg))
                overload += types.Int;
            else if(arg instanceof EpiDataView)
                overload += types.EpiDataView;
            else if(arg instanceof EpiTransaction)
                overload += types.EpiTransaction;
            else if(Global.IsObject(arg))
                overload += types.Object;
            else
                overload += types.String;
        }
        return overload;
    },  
    GetOLSeqForArgTypes:function(args)
    {
        var overload = "";
        if(args.length==0) return "";
        if (args[args.length-1] instanceof EpiOverloadedArgs)
        {
            var arg;
            var epiArgs = args[args.length-1];
            overload = epiArgs.args;//epiArgs.GetOverloadArgSeq();
        }
        else if(args[args.length-1] && args[args.length-1].args && Global.IsString(args[args.length-1].args))
        {
            overload = args[args.length-1].args;
        }
        return overload;
    },  
    GetPosition: function(_ctrl)
    {
        var x=0, y=0;
        for(var ctrl = _ctrl; ctrl; ctrl = ctrl.offsetParent)
        {
            x += ctrl.offsetLeft;
//            if (ctrl.scrollLeft > 0)
//                x -=  ctrl.scrollLeft;
//            
            y += ctrl.offsetTop;
//            if (ctrl.scrollTop > 0)
//                y -= ctrl.scrollTop;
        }
        return {"x":x,"y":y,"height":_ctrl.offsetHeight,"width":_ctrl.offsetWidth};
    },
    GetOffset: function(childCtrl,toCtrl)
    {
        var x=0, y=0;
        for(var ctrl = childCtrl; ctrl&&ctrl!=toCtrl; ctrl = ctrl.offsetParent)
        {
            x += ctrl.offsetLeft;
            if (ctrl.scrollLeft > 0)
                x -=  ctrl.scrollLeft;

            y += ctrl.offsetTop;
            if (ctrl.scrollTop > 0)
                y -= ctrl.scrollTop;
        }
        if(!BrowserSniffer.IE)
        {
            for(var ctrl = childCtrl; ctrl&&ctrl!=toCtrl; ctrl = ctrl.parentNode)
            {
                y-=ctrl.scrollTop;
            }
        }
        
        return {"x":x,"y":y};
    },
    GetParentById: function(oNode, parentId, skipCurrentFlag)
    {
    	var oCurrentNode;
	
	    if(skipCurrentFlag) 
		    oCurrentNode = oNode.parentNode;
	    else
		    oCurrentNode = oNode;
    	
	    while(oCurrentNode && oCurrentNode.id != parentId)
	    {
		    oCurrentNode = oCurrentNode.parentNode;
	    }
    	
	    return oCurrentNode;
    },
    GetParentByTag: function(oNode, parentTagName, skipCurrentFlag)
    {
    	var oCurrentNode;
	
	    if(skipCurrentFlag) 
		    oCurrentNode = oNode.parentNode;
	    else
		    oCurrentNode = oNode;
    	
	    while(oCurrentNode && oCurrentNode.tagName != parentTagName)
	    {
		    oCurrentNode = oCurrentNode.parentNode;
	    }
    	
	    return oCurrentNode;
    },
    GetParentByType: function(oNode, parentType, skipCurrentFlag)
    { 
    	var oCurrentNode;
    	var oCurrentObj;
	
	    if(skipCurrentFlag) 
		    oCurrentNode = oNode.parentNode;
	    else
		    oCurrentNode = oNode;
		    
		if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];		    
    	
	    while(oCurrentNode && !(oCurrentObj instanceof parentType))
	    {
		    oCurrentNode = oCurrentNode.parentNode;
		    if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];
	    }
    	
	    return oCurrentNode;
    },
    GetChildrenByName: function(oNode, name)
    {
        var children = [];
        var i, j, subCnt, cnt = oNode.childNodes.length;
        for (var i = 0; i < cnt; i++)
        {
            var child = oNode.childNodes[i];
            if (child.name == name||child.id==name)
                children[children.length] = child;

            if (child.childNodes && child.childNodes.length > 0)
            {
                var subChildren = Global.GetChildrenByName(child, name);
                subCnt = subChildren.length;

                for (j = 0; j < subCnt; j++)
                    children[children.length] = subChildren[j];
            }
        }

        return children;
    },
    PositionedOffset: function(element)
    {
        var valueT = 0, valueL = 0;
        do
        {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
            if (element)
            {
                if (element.tagName.toUpperCase() == 'BODY') break;
            }
        } while (element);

        return { Top: valueT, Left: valueL };
    },
    IsFunction: function(a) 
    {
        return typeof a == 'function';
    },

    IsObject: function(a)
    {
        return (a && typeof a == 'object') || this.IsFunction(a);
    },
    IsArray: function(a)
    {
        return this.IsObject(a) && a.constructor == Array;
    },
    IsBoolean: function(a) 
    {
        return typeof a == 'boolean';
    },
    IsBooleanString: function(a)
    {
         return typeof a == 'string' && (a.toLowerCase()=="true" || a.toLowerCase()=="false");
    },
    IsNumber: function(a) 
    {
        return typeof a == 'number' && isFinite(a);
    },
    IsString: function(a) 
    {
        return typeof a == 'string';
    },
    IsDate: function(a)
    {
        return Global.GetType(a).Name.FullName=="System.DateTime";
    },
    IsDBNull:function(val)
    {
        if (val == null || val == "")
            return true;
        else
            return false;
    },
    SetInnerHtml: function(ctrl, html)
    {
        ctrl.innerHTML = html;
    },
    ToNumber: function(str)
    {
        var val = 0;
        try
        {
            if(str.indexOf(".") > -1)
                val = parseInt(str);
            else
                val = parseFloat(str);
                
            if(isNaN(val)) val = 0;
        }
        catch(err){ val=0 }
        
        return val;
    },
    GetType: function(o)
    {
        var nm;
        if(o.GetType)
        {
            nm = o.GetType();
        }
        else
        {
            var a=/function\s+(.+)\s*\(\)\s*\{/.exec(o.constructor) 
            var nm = (a && a[1] ? a[1] : 'Unknown') 
            
            if(nm=="Array")
            {
                nm="System.String[]";
                if(o.length>0)
                {
                    var arrType=Global.GetType(o[0]);
                    if(arrType.Name)
                    {
                        if(arrType.Name.FullName)
                            nm=arrType.Name.FullName+"[]";
                        else
                            nm=arrType.Name+"[]";    
                    }
                }
            }
        }
        
        var newType = new System.Type();
        newType.Name = nm;
        return newType;
    },
    InstanceOf: function(oIn, typeName)
    {
        var o = oIn;
        if(o==null || typeName=="") return false;
    
        if (typeName=="DataRow" || typeName=="System.Data.DataRow")
        {
            if (o.type == "DataRow") return true;
            else return false;
        } 
        if (oIn == Global.Form && "_" + typeName== Global.Form._ClassName)
            return true;
            
        var type =null;
        try
        {
            if(o._win && o._win!=window)
            {
                if(o._win.closed) return true;  // Can't think of any other way to handle this.
                                                // This happens when a dialog returns a value.
                type = eval("o._win." + typeName);  // for dialogs
            }
            else
                type = eval(typeName);
        }
        catch(e1){type =null;}
        
        if (!type) 
        {
            if(o._impl && o._impl.length>0)
            {
                for(var ii=0; ii<=o._impl.length-1; ii++)
                {
                    if(typeName==o._impl[ii]) return true;
                }
            }
            return false;
        }
        
        var retVal = false;  
     
        if((typeName=="System.String" || typeName=="String") && Global.IsString(o))  // Need more of these probably.
        {
            return true;
        }
        else if((typeName=="System.Int32" || typeName=="Int32") && Global.IsNumber(o))
        {
            return true;
        }
        else if(typeName=="System.Boolean" && Global.IsBoolean(o))
        {
            return true;
        }
        else if (typeName=="System.DateTime" || typeName=="DateTime")
        {
            try
            {
                var dt = Convert.ToDateTime(o);
                if (dt)
                    return true;
            }catch(err){}
        }
        else if (typeName=="DBNull" || typeName=="System.DBNull")
        {
            if (o == null)
                return true;
            else 
                return false;
        }
        else if (typeName=="PopupMenuTool" && o instanceof Tool)
        {
            if (o.Type=="PopupMenuTool") return true;
            else return false;
        }
        else
        {
            try
            {
                if(o instanceof type) retVal = true;
            }
            catch(err) 
            {
                    // temp fix:  Sometimes this fails when referring to the opener form.  Until I can figure out why, 
                    // we'll always return true.
                    if(o._win && o._win!=window)
                    {
                        try
                        {
                            retVal = o._win.Global.InstanceOf(o,typeName);
                        }
                        catch(e1){retVal = true}
                    }
                    else
                        retVal = true;
            }
        }
        
        if(!retVal && o.tagName)  // Is it a control on the form?  
        {
            var ctrlObj = Global.BindingEngine.Controls[o.id];
            if(ctrlObj instanceof type) retVal = true;
        }
        
        return retVal;
    },
    As:function(obj, typeName)
    {
        if(typeName=="DataRow" || typeName=="System.Data.DataRow" || typeName=="QuickSearchCriteriaRow" 
        || (obj && obj.type=="DataRow") || (obj && obj._type=="DataSet" && obj.DataSetName=="QueryDesignDataSet" && typeName=="QueryDesignDataSet")) return obj; // gotta be a better way

        if(typeName=="int?")
        {
            try
            {
                var val = Convert.ToInt32(obj);
                return {"Value":val,"HasValue":true};
            }
            catch(err) {return {"Value":null,"HasValue":false};}
        }
    
        if(Global.InstanceOf(obj,typeName))
            return obj;
        else
            return null;
    },
    GetScript: function(urlPath)
    {
        var oXML;
        try
        {
            oXML = new XMLHttpRequest();
            oXML.open('GET.html', urlPath, false);
            oXML.send('');
            
            if(oXML.status==200) 
                return oXML.responseText;
        }
        catch(err){}
        finally
        {
            if (oXML) 
                oXML = null;
        }
        
        return "";
    },
    CloneObject: function(obj)
    {
        var i; 
        var newObj = new Object(); 
        for (i in obj) 
        { 
            newObj[i] = obj[i]; 
        } 
        return newObj; 
    },
    GetBrowserVersion: function()
    {
        var nu = "";
        if(Global.document.all)
        {
            var nua=navigator.userAgent;
            var str_pos=nua.indexOf('MSIE');
            nu=nua.substr((str_pos+5),3);
        }

        return nu;  
    },
    GetUrlArg: function(argName)
    {
	    var urlArgStr;
	    var paramArray;
	    var param;
	    var val = "";
    	
	    urlArgStr = Global.window.location.search;
	    if(urlArgStr.substr(0,1)=="?")
	    {
		    urlArgStr = urlArgStr.substr(1);
	    }

	    var argsArray = urlArgStr.split("&");
    	
	    for(ii=0; ii<argsArray.length; ii++)
	    {
		    paramArray = argsArray[ii].split("=");
    		
		    if(paramArray.length==2)
		    {
			    if(paramArray[0]==argName) 
			    {
				    val = paramArray[1];
				    break;
			    }
		    }
	    }
    	
	    return val;
    },
    GetDefaultForType:function(typeStr) // This is equivalent for 'default' keyword in CSharp e.g. default(double)== Global.GetDefaultForType("System.Double")
    {
        var defaultVal = null;
        switch (typeStr)
        {
            case "System.Boolean":
                defaultVal = false;
                break;
            case "System.Byte":
            case "System.SByte":
            case "System.Int32":
            case "System.UInt32":
            case "System.Int64":
            case "System.UInt64":
            case "System.Int16":
            case "System.UInt16":
                defaultVal = 0;
                break;
            
            case "System.Char":
                defaultVal = '\0';
                break;
                
            case "System.Decimal":
            case "System.Double":
            case "System.Single": // float
                defaultVal = 0.0;
                break;
            case "System.String":
            case "System.Object":
            default:
                defaultVal =null ;
                break;
        }
        return defaultVal;
    },
    Namespaces:{},
    NamespaceQueue:{},
    AddNamespace:function(nsStr)
    {
        if(Global.Namespaces[nsStr]) return;
        
        var nsBuild = "";
        
        var nsNew;
        var parts = nsStr.split(".");
        for(var part in parts)
        {
            if(nsBuild!="")
                nsNew = nsBuild + "." + parts[part];
            else
                nsNew = nsBuild + parts[part];
                
            if(!eval(nsNew)) eval(nsNew + "={};");
            nsBuild = nsNew;            
        }
        Global.Using(nsStr);
    },
    Using:function(nsStr, alias, fromQueue)
    {
        if(Global.Namespaces[nsStr]) 
        {
            if(alias) window[alias] = eval(Global.Namespaces[nsStr]);
            return;
        }
        
        try
        {
            var ns = eval(nsStr);
            if(!ns) throw "";
        }
        catch(err) 
        {
            if(!fromQueue) 
            {
                var itm = Global.NamespaceQueue[nsStr];
                if(!itm) itm = Global.NamespaceQueue[nsStr] = [];
                if(alias) itm.push(alias);
            }
            return;
        }
        
        for(var obj in ns)
        {
            eval("if (!Global.window." + obj + ") Global.window." + obj + " = ns[obj];");
        }
        
        var nsBuild = "";
        var parts = nsStr.split(".");
        for(var part in parts)
        {
            if(nsBuild!="")
            {
                nsBuild +="." + parts[part];
                eval("if (!Global.window." + parts[part] + ") Global.window." + parts[part] + " = " + nsBuild);
            }
            else
            {
                nsBuild += parts[part];
            }
        }
        
        Global.Namespaces[nsStr] = nsStr;
        if(alias) window[alias] = eval(Global.Namespaces[nsStr]);
    },
    ProcessNamespaceQueue:function()
    {
        for(var obj in Global.NamespaceQueue)
        {
            objArr = Global.NamespaceQueue[obj];
            if(objArr.length==0)
            {
                Global.Using(obj, null, true);
            }
            else
            {
                for(var itm in objArr)
                {
                    Global.Using(obj, objArr[itm], true);
                }
            }
        }
        Global.NamespaceQueue = {};
    },
    CallWithArgs:function(obj,fnName,args)
    {
        var retVal;
        // For some reason,when this fn is called from modeless dialogs, it throws a 'jscript object expected' error.
        // Copying it to a local array variable fixed the problem.
        var args1 = [];
        for(var i=0;i<=args.length-1;i++){args1.push(args[i]);}
        
        if(obj && obj[fnName])
        {
            retVal = obj[fnName].apply(obj, args1);
        }
        return retVal;
    },
    GetAdapter:function(name,sender,otherObjs)
    {
        // Make sure the first letter in the adapter name is capitalized.
        name=name.substr(0,1).toUpperCase()+name.substr(1);

        var adapter;
        var err = false;
        if(Global.LoadedAdapters[name])
        {
            adapter = eval("try{new " + name + "(sender,new EpiOverloadedArgs('Object'));}catch(e1){err=true;}");
        }
        else
        {
            var assmName = "AD." + name.Replace("Adapter", "");
            var adapterFile = "script/" + assmName + "/" + assmName + ".js";
        
            var adapterScript = Global.GetScript(adapterFile);
            if(adapterScript)
            {
                eval(adapterScript);
                Global.window[name] = Epicor.Mfg.UI.Adapters[name] = eval(name);
                
                if(otherObjs)
                {
                    for(var obj in otherObjs)
                    {
                        Global.window[otherObjs[obj]]=eval(otherObjs[obj]);
                    }
                }
                
                adapter = eval("new " + name + "(sender,new EpiOverloadedArgs('Object'));");
                Global.LoadedAdapters[name] = name;
            }
        }
        
        return adapter;
    },
    LoadProxyForAdapter:function(adapter,boName,forceReload,isProc)
    {
        if (Global.InLaunchCode) forceReload = true;
        
        // In some cases we need to reload the whole proxy.  In these cases, call the alternate function.
        if(forceReload) return Global.ReloadProxyForAdapter(adapter,boName);
    
        if (!boName)
        {
            boName = adapter.get_BusinessObjectName();
            var parts = boName.split(".");
            boName = parts[parts.length-1];
        }

    	var err = false;
    	eval("try{err = typeof " + boName + "Service == \"undefined\";}catch(e){err=true;}");
	    if(err == true)
	    {
	        var fileName = "script/Client" + boName + "ServiceProxies.js";
	        var bo = boName + "Service";
	        if(isProc) 
	        {
	            fileName = "script/Clientproc_" + boName + "ServiceProxies.js"
	            bo = "proc_" + boName + "Service";
	        }
	    
            var proxyScript = Global.GetScript(fileName);
            eval(proxyScript);
            Global.window[boName + "Service"] = eval(bo);

        }
        
        return window[boName + "Service"];
    },
    ReloadProxyForAdapter:function(adapter,boName)
    {
        if (!boName)
        {
            boName = adapter.get_BusinessObjectName();
            var parts = boName.split(".");
            boName = parts[parts.length-1];
        }
        return this.LoadProxy(boName, false);
    },
    LoadProxy:function(boName)
    {
    	var err = false;
    	if(Global.LoadedProxies[boName])
    	{
    	    eval("try{err = typeof " + boName + "Service == \"undefined\";}catch(e){err=true;}");
        }
        else
	    {
	        var fileName = "script/Client" + boName + "ServiceProxies.js";
	        var bo = boName + "Service";
            var proxyScript = Global.GetScript(fileName);
            eval(proxyScript);
            Global.window[boName + "Service"] = eval(bo);
            Global.LoadedProxies[boName] = boName;
        }        
        return window[boName + "Service"];
    },
    GetBO:function(adapter,boName,forceReload)
    {
        boName = boName.replace("Epicor.Mfg.Rpt.","");
        
        var isProc = false;
        if (boName.StartsWith("Epicor.Mfg.Proc.")) 
        {
            boName = boName.replace("Epicor.Mfg.Proc.", "");
            isProc = true;
        }
        else if (boName.StartsWith("Epicor.Mfg.Lib.")) 
        {
            boName = boName.replace("Epicor.Mfg.Lib.", "lib_");
        }
        else if (boName.StartsWith("Epicor.Mfg.Sec.") || boName.EndsWith("Sec.SecRights")) 
        {
            boName = boName.replace("Epicor.Mfg.", "");
            boName = boName.replace("Sec.", "sec_");
        }
        Global.LoadProxyForAdapter(adapter, boName, forceReload, isProc);
        var bo = eval("new " + boName + "Service();");
        return bo;
    },
    ConvertXmlToJson:function(xml,xslt,namespaces) // xml should have the .xml extension
    {
        var xmlDoc = Sarissa.getDomDocument();
        xmlDoc.async=false;
		if (namespaces)
		    Sarissa.setXpathNamespaces(xmlDoc, namespaces);
        
        var result;
        // window.location.url // window.location.pathname
        var path = Global.window.location.href;
        path = path.substring(0, path.lastIndexOf('../index-2.html'));
        var xmlpath = path + "/xml/" + xml;
                
        xmlDoc.load(xmlpath);
        if(xmlDoc.parseError != 0)
            MessageBox.Show("Failed to load xml document: " + xml+ ".Error:" + Sarissa.getParseErrorText(xmlDoc), new EpiOverloadedArgs("String"));
        else
        {
            var xslpath = path + "\\xsl\\" + xslt;
            var xslDoc = Sarissa.getDomDocument();
            xslDoc.async=false;
            xslDoc.load(xslpath);
            if (xslDoc.parseError ==0)
            {
                var processor = new XSLTProcessor();  // create an instance of XSLTProcessor
                processor.importStylesheet(xslDoc); // configure the processor to use our stylesheet 
                var oResultDom = processor.transformToDocument(xmlDoc); // transform and store the result as a new doc
                
                var sResult = "";
                if(oResultDom.childNodes.length > 0)
                {
                    var oResultNode = oResultDom.childNodes[0];
                    
                    if(oResultNode.text)
                        sResult = oResultNode.text;
                    else
                        sResult = oResultNode.textContent;
                }
                
                result = JSON.parse(sResult);
            }
            else
                MessageBox.Show("Failed to transform xslt file: " + xslt + ".Error:" + Sarissa.getParseErrorText(Doc), new EpiOverloadedArgs("String"));
        }
        return result;
    },
    EscapeRegExp:function(text) 
    {
         if (!arguments.callee.sRE) 
         {
            var specials = [
              '/', '.', '*', '+', '?', '|',
              '(', ')', '[', ']', '{', '}', '\\'
            ];
            arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
          }
          return text.replace(arguments.callee.sRE, '\\$1');
    },
    GetGridColumn:function(colID)
    {
        var obj = Global.BindingEngine.Controls[colID];
        if(!obj)
        {
            obj = new EpiTextBox({"ID":colID,"InG":true});
        }
        return obj;
    },
    IsValidVarName:function(varName)
    {
        try
        {
            eval("var " + varName + ";");
            return true;
        }
        catch(err)
        {
            return false;
        }
    },
    LaunchQuickSearch:function(sender,QuickSearchID,multiSelect,ControlSetting)
    {
        var adapt = Global.GetAdapter("QuickSearchAdapter",sender);
        Global.LoadProxyForAdapter(adapt,null,true);
        adapt.BOConnect();    

        if(QuickSearchID == null || QuickSearchID.length <= 0)
        {
            return null;        
        }
        if(!adapt.GetByID(String.Empty,QuickSearchID))
        {
            return null;
        }
        var searchForm=new QuickSearchForm(adapt,new EpiOverloadedArgs("QuickSearchAdapter"));

        var opts=SearchOptions.CreateSearchForm(DataSetMode.ListDataSet);
        opts.Sender=this;
        opts.SelectMode=SelectMode.SingleSelect;
        if(multiSelect)
        {
            opts.SelectMode=SelectMode.MultiSelect;
        }
        
        searchForm.CallFunction("Initialize", [QuickSearchID,ControlSetting]);
        
        var dr=searchForm.ShowDialog(new EpiSearchEngine(adapt,new EpiOverloadedArgs("IEpiAdapter")),opts,new EpiOverloadedArgs("EpiSearchEngine_SearchOptions"));
        if(dr == DialogResult.OK)
        {
            return searchForm.selectObject;
        }
        if(dr == DialogResult.Abort)
        {
            return dr;
        }

        return null;
    },
    PerfStart:function()
    {
        d = new Date();
        window._perf = parseInt((((d.getMinutes()*60) + d.getSeconds())* 1000) + d.getMilliseconds());
    },
    PerfEnd:function()
    {
        d = new Date();
	    perf2 = parseInt((((d.getMinutes()*60) + d.getSeconds())* 1000) + d.getMilliseconds());
    	
	    alert((perf2 - window._perf) + " milliseconds");
    },
    AddAssemblyCustomAttribute:function(assbly, attr)
    {
        var currAssembly = Global.Assemblies[assbly];
        if (!currAssembly.CustomAttributes)
            currAssembly.CustomAttributes = [];
        currAssembly.CustomAttributes.push(attr);
    },
    GetTextSize:function(txt)
    {
        var lbl = Global.document.createElement("label");
        lbl.innerHTML=txt;
        lbl.style.position = "absolute";
        lbl.style.left = "0px";
        lbl.style.top= "0px";
        lbl.style.className="EpiLabel";
        Global.document.body.appendChild(lbl);
        
        var size={"Height":lbl.offsetHeight,"Width":lbl.offsetWidth};
        Global.document.body.removeChild(lbl);
        return size;
    },
    NextNode:function(node)
    {
        while(node.nextSibling)
        {
            node=node.nextSibling;
            if(node.nodeType==1) return node;
        }
        return null;
    },
    PrevNode:function(node)
    {
        while(node.previousSibling)
        {
            node=node.previousSibling;
            if(node.nodeType==1) return node;
        }
        return null;
    },
    SetStatus:function(val)
    {
        if(!Global.StatusPanel)
        {
            var st=Global.BindingEngine.Controls["baseStatusBar"];
            if(st) Global.StatusPanel=st.get_Panels()["sbpStatus"];
        }
        if(Global.StatusPanel) 
        {
            Global.StatusPanel.set_Text(val);
        }
        Global.window.status = val;    
    },
    GetSummaryInfo:function(grids)
    {
        if(!grids) return null;
    
        var si=null;
        var sObj=null;

        for(var g in grids)
        {
            var grid=grids[g];
            var hasSummaries=false;
            for(var sum in grid.SummaryColumns) {hasSummaries=true;break;}
            
            if(hasSummaries)
            {
                if(!si) 
                {
                    si=[{}];
                    sObj=si[0];
                }
                
                for(var s in grid.SummaryColumns)
                {
                    var obj=Global.BindingEngine.Controls[grid._columns[s]];
                    if(obj)
                    {
                        sObj[obj.DataColumn]={"Average":false,"Count":false,"Max":false,"Min":false,"Sum":false};
                        for(var itm in grid.SummaryColumns[s])
                        {
                            if(grid.SummaryColumns[s][itm]) sObj[obj.DataColumn][itm]=true;
                        }
                    }
                }
            }
        }    
        return si;        
    },
    GetSummaries:function(grid)
    {    
        var edv=Global.BindingEngine.EpiDataViews[grid.DataView];
        var ds = edv.dataView.Table.DataSet;
        
        if(!ds.CacheInfo) return;

        var summInfo={};
        var pageInfo = {"rowID":[{"paging":0}],"rows":[{"paging":1}]};

        var tblName=edv.dataView.Table.TableName;
        if(edv.dataView.OrigTable) tblName=edv.dataView.OrigTable;
        
        var filter="";
        if(grid.GroupFilter||edv.dataView.ServerFilter)
        {
            if(grid.GroupFilter) filter=grid.GroupFilter;
            if(edv.dataView.ServerFilter.length>0) 
            {
                if(grid.GroupFilter) filter+=" AND ";
                filter+=edv.dataView.ServerFilter;
            }            
            pageInfo["filter_"+tblName]=[{"filter":filter}];
        }
        var si=Global.GetSummaryInfo(Global.BindingEngine.GridsByView[edv.ViewName]);

        if(si) 
        {
            summInfo["summary_"+tblName]=si;
            if(filter!="") summInfo["filter_"+tblName]=[{"filter":filter}];
        }

        Global.LoadProxy("lib_Common");
        var lib = new lib_CommonService();
        try
        {
            var data; 
            var newDS = lib.GetCachedDS(ds.CacheInfo.CacheKey, JSON.stringify(pageInfo), JSON.stringify(summInfo), data);
            data = JSON.parse(Global.ArgManager['Out1']);
            grid.Summaries=data["Summaries"];

            return;
        }
        catch(err)
        {
            if(err instanceof BusinessObjectException)
            {
                var errMsg = (err.description)?err.description:err.Message;
                if(errMsg.Contains("DataSet cache has expired"))
                {
               
                    MessageBox.Show("The data session has expired.  The form will be refreshed.");
                    if (Global.Form.AppControlPanel) Global.Form.AppControlPanel.OnClickRefresh();
                    throw(err);
                }
            }
            ExceptionBox.Show(err);
        }
    },
    GetCachedDS:function(dv,startIdx,cnt,filter,grids)
    {
        var ds = dv.Table.DataSet;
        if(!ds.CacheInfo||!ds.CacheInfo.CacheKey) return;
        
        var summInfo={};
        var pageInfo = {"rowID":[{"paging":startIdx}],"rows":[{"paging":cnt}]};
        
        var tblName=dv.Table.TableName;
        if(dv.OrigTable) tblName=dv.OrigTable;
        
        if(dv.Sort)
        {   
            var arrs=dv._getSortArray(dv.Sort);
            var sortCols=arrs["Cols"];
            var sortDirs=arrs["Dirs"];
 
            var arr=pageInfo[tblName]=[];
            for(var i in sortCols)
            {
                if(!dv.Table.Columns[sortCols[i]])
                {
                    delete pageInfo[tblName];
                    break;
                }
                arr.push({"column":sortCols[i],"sortOrder":sortDirs[i]==1?"A":"D"});
            }
        }
        if(filter)
        {
            pageInfo["filter_"+tblName]=[{"filter":filter}];
        }
        
        var si=Global.GetSummaryInfo(grids);
        if(si) 
        {
            summInfo["summary_"+tblName]=si;
            if(filter) summInfo["filter_"+tblName]=[{"filter":filter}];
        }

        Global.LoadProxy("lib_Common");
        var lib = new lib_CommonService();
        try
        {
            var data; 
            var newDS = lib.GetCachedDS(ds.CacheInfo.CacheKey, JSON.stringify(pageInfo), JSON.stringify(summInfo), data);
            data = JSON.parse(Global.ArgManager['Out1']);

            ds.CacheInfo.Views={};
            for(var edv in dv._EpiDataViews)
            {
                if(data.rows&&data.rows.length>0)
                    ds.CacheInfo.Views[dv._EpiDataViews[edv].ViewName]={"RowCount":data["dsRowCount"],"Start":data.rows[0]["firstRowIDReturned"],"End":data.rows[0]["lastRowIDReturned"],"Summaries":data["Summaries"]};
                else
                    ds.CacheInfo.Views[dv._EpiDataViews[edv].ViewName]={"RowCount":data["dsRowCount"],"Summaries":data["Summaries"]};
            }
            

            if(!data.rows||data.rows.length==0)
            {
                dv.Table.Rows=ds.Data[dv.Table.TableName]=[];
                dv.Table.Count=0;
            }
            else
            {
                dv.Table.Rows = ds.Data[dv.Table.TableName] = newDS.Data[tblName];
                dv.Table.Count = dv.Table.Rows.length;
            }

            Global.BindingEngine.Reload(EpiBindType.Cache,ds);

            for(var g in grids)
            {
                grids[g].Summaries=data["Summaries"];
            }

            return;
        }
        catch(err)
        {
            if(err instanceof BusinessObjectException)
            {
                var errMsg = (err.description)?err.description:err.Message;
                if(errMsg.Contains("DataSet cache has expired"))
                {
               
                    MessageBox.Show("The data session has expired.  The form will be refreshed.");
                    if (Global.Form.AppControlPanel) Global.Form.AppControlPanel.OnClickRefresh();
                    throw(err);
                }
            }
            ExceptionBox.Show(err);
        }
    }
}
Global.ScriptLoaded.subscribe(Global.ScriptIsLoaded,null,true);  

var FormTestManager = null;
if(Global.GetUrlArg("isTester")=="true")
{
    var testFormScript = Global.GetScript("script/FormTestManager.js");
    if(testFormScript!=null)
    {
        eval(testFormScript);
    }
}

function ResetFieldFormat(queryDesignDS, queryResults)
{
    if (queryResults.Data == null || (queryResults.Tables && queryResults.Tables[0] && queryResults.Tables["Results"].Count == 0)) return;
    for(var dr in queryDesignDS.get_SelectedField().get_Rows())
    {
        dr=queryDesignDS.get_SelectedField().get_Row(dr);
        var format=dr.get_Item("FieldFormat").toString();
        if(format.length > 0)
        {
            var colName="";
            if(dr.get_Item("DataTableID").toString() != "")
            {
                colName=dr.get_Item("DataTableID") + ".";
                
            }
            colName=colName + dr.get_Item("FieldName");
            if(queryResults.get_Table(0).ColumnsContains(colName))
            {
                var col=queryResults.get_Table(0).get_Column(colName);
                if(col.ExtendedProperties.ContainsKey("Format"))
                {
                    col.ExtendedProperties.set_Item("Format",format);
                    
                }
                else 
                {
                    col.ExtendedProperties.Add("Format",format);
                    
                }
                if(queryDesignDS.get_QueryCtrl().Select("DataSource = '" + colName + "' and IsMandatory = true",new EpiOverloadedArgs("String")).length == 1)
                {
                    if(col.ExtendedProperties.ContainsKey("Required"))
                    {
                        col.ExtendedProperties.set_Item("Required",true );
                        
                    }
                    else 
                    {
                        col.ExtendedProperties.Add("Required",true );
                        
                    }
                }
                switch(dr.get_Item("DataType").toUpperCase())
                {
                    case "DATE":
                        col.DataType = "System.DateTime";
                        break;
                    case "DECIMAL":
                        col.DataType = "System.Decimal";
                        break;
                    case "INTEGER":
                        col.DataType = "System.Int32";
                        break;
                    case "LOGICAL":
                        col.DataType = "System.Boolean";
                        break;
                }
            }
        }
    }
    return queryResults;
}
function DebugHelper()
{
    this.queue = [];
    this.StatusWin = null;
    this.Indents = 0;
    this.Items = {};
}
DebugHelper.prototype.SetStatusWin=function(win)
{
    this.StatusWin = win;
    this.WriteQueue();
}
DebugHelper.prototype.WriteQueue=function()
{
    if(this.CheckStatusWin())
    {
        for(var ii=0; ii<=this.queue.length-1; ii++)
        {
            if(this.queue[ii].type=="enter")
            {
                var idx = DebugHelper.Enter(this.queue[ii].obj, this.queue[ii].method, this.queue[ii].note, this.queue[ii].start, this.queue[ii].indents);
                if(this.queue[ii].closed)
                    DebugHelper.Leave(idx, this.queue[ii].end);
            }
            else if(this.queue[ii].type=="error")
            {
                DebugHelper.WriteError(this.queue[ii].pre, this.queue[ii].err);
            }
            else if(this.queue[ii].type=="msg")
            {
                DebugHelper.WriteMessage(this.queue[ii].msg, this.queue[ii].isError);
            }
        }
        this.queue = [];
    }
}
DebugHelper.prototype.Launch=function()
{    
    if(!this.CheckStatusWin())
        Global.window.open("syslogin403c.html");
}
DebugHelper.prototype.DebugDialog=function(opener)
{
    if(opener.Global.DebugHelper && opener!=window)
    {
        for(var itm in this.queue)
        {
            opener.Global.DebugHelper.queue.push(this.queue[itm]);
        }
        this.queue = [];
        
        if(opener.Global.DebugHelper.CheckStatusWin()) opener.Global.DebugHelper.WriteQueue();
        Global.DebugHelper = opener.Global.DebugHelper;
    }
}
DebugHelper.WriteMessage=function(msg, isError)
{
    if(!Global.DebugHelper) return;

    if(Global.DebugHelper.CheckStatusWin())
    {
        Global.DebugHelper.StatusWin.GridHelper.AddMessageRow(msg, isError);
    }
    else
    {
        Global.DebugHelper.queue.push({"type":"msg","msg":msg,"isError":isError});
    }
}
DebugHelper.WriteError=function(pretext, err)
{
    if(!Global.DebugHelper) return;

    if(Global.DebugHelper.CheckStatusWin())
    {
        var msg = "";
        if(pretext!=null) msg = pretext;
        
        if(err instanceof Error)
            msg = msg + "Javascript Error: " + err.description;
        else
        {
            if(err.description)
                msg = msg + err.description;
            else if(err.Message)
                msg = msg + err.Message;
        }
            
        try
        {
            Global.DebugHelper.StatusWin.GridHelper.AddMessageRow(msg, true);
        }
        catch(err){}
    }
    else
    {
        Global.DebugHelper.queue.push({"type":"error","pre":pretext,"err":err});
    }
}
DebugHelper.Enter=function(obj, method, note, start,indents)
{
    if(!Global.DebugHelper) return;
    
    var d = new Date();
    var calcStart = parseInt((((d.getMinutes()*60) + d.getSeconds())* 1000) + d.getMilliseconds());

    var retVal = null;
    if(Global.DebugHelper.CheckStatusWin())
    {
        if(!start) start = calcStart;
        if(!indents) indents = Global.DebugHelper.Indents;
        retVal = Global.DebugHelper.StatusWin.GridHelper.AddMethodRow(obj, method, note, start, indents);
    }
    else
    {
        Global.DebugHelper.queue.push({"type":"enter","obj":obj,"method":method,"note":note,"closed":false,"start":calcStart,"end":null,"indents":Global.DebugHelper.Indents});
        retVal = Global.DebugHelper.queue.length-1;
    }
    Global.DebugHelper.Items[retVal] = Global.DebugHelper.Indents;
    Global.DebugHelper.Indents++;
    return retVal;
}
DebugHelper.Leave=function(idx, end)
{
    if(!Global.DebugHelper) return;
    
    var d = new Date();
    var calcEnd = parseInt((((d.getMinutes()*60) + d.getSeconds())* 1000) + d.getMilliseconds());

    if(Global.DebugHelper.CheckStatusWin())
    {
        if(!end) end = calcEnd;
        Global.DebugHelper.StatusWin.GridHelper.CloseRow(idx,end);
    }
    else
    {
        if(Global.DebugHelper.queue.length>idx)
        {
            Global.DebugHelper.queue[idx].closed = true;
            Global.DebugHelper.queue[idx].end = calcEnd;
        }
    }
    Global.DebugHelper.Indents = Global.DebugHelper.Items[idx];
}
DebugHelper.prototype.CheckStatusWin=function()
{
    var ruthere = false;
    if(this.StatusWin!=null)
    {
        try
        {
            var ruthere = this.StatusWin.AreYouThere();
        }
        catch(err){}
    }
    return ruthere;
}

// Javascript data type functions
// ----------  System.Boolean
System.Boolean=Boolean;
Boolean.TrueString="True";
Boolean.prototype.Equals=function(val)
{
    return this==val;
}
Boolean.prototype.GetType=function()
{
    return {"FullName":"System.Boolean","Name":"System.Boolean"};
}
Boolean.TryParse=function(inVal,outVal)
{
    try
    {
        var boolVal = Convert.ToBoolean(inVal);
        Global.ArgManager["Out1"] = boolVal;
        return true;
    }
    catch(err)
    {
        return false;
    }
}

// ----------  System.String
var StringSplitOptions = System.StringSplitOptions= {"None":0,"RemoveEmptyEntries":1};

System.String = String;
System.Char = String;
String.prototype.ToString=function()
{
    return this;
}
String.prototype.Split=function(splitCh, splitOptions)
{
    var retArr = this.split(splitCh);
    if (retArr.length > 0 && splitOptions && splitOptions == StringSplitOptions.RemoveEmptyEntries)
    {
        // Remove empty elements
        for (var i=retArr.length;i>=0;i--) 
            if (!retArr[i]) retArr.splice(i, 1);  
    }
    return retArr;
}
String.prototype.Substring=function(start,len)
{
    if(len!=null && Global.IsNumber(len))
        return this.substr(start,len);
    else
        return this.substring(start);
}
String.prototype.LastIndexOf=function(substring)
{
    return this.lastIndexOf(substring);
}
String.prototype.Equals=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    var str = a[0];
    switch(overload)
    {
        case "String_StringComparison":
            if(a[1]==StringComparison.InvariantCultureIgnoreCase)
                return this.toLowerCase()==str.toLowerCase();
            else
                return this==str;
            break;
        case "Object":
            if (str != null && this == str.toString()) return true;
            else return this==str;
            break;
        default:
            return this==str;
            break;
    }
}
String.prototype.IndexOf=function(value)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String":
        case "Char":
        case "":  // backwards compat
            return this.indexOf(a[0]);
            break;
        case "String_Int32":
        case "Char_Int32":
            return this.indexOf(a[0],a[1]);
            break;
        case "String_Int32_Int32":
        case "Char_Int32_Int32":
            var substr = this.substr(0,a[1]+a[2]-1);
            return substr.indexOf(a[0],a[1]);
            break;
    }
}
String.prototype.StartsWith=function(str)
{
    if(this.substr(0, str.length)==str)
        return true;
    else
        return false;
}
String.prototype.EndsWith=function(str)
{
    if(str.length > this.length) return false;

    if(this.substr(this.length - str.length)== str)
        return true;
    else
        return false;
}
String.prototype.Replace=function(str1,str2)
{
    var	REGEXP_ESC_CHARS = "$()*+.[]?/^{}|";
    // Escape special characters
    
    //if(str1.length==1 && REGEXP_ESC_CHARS.indexOf(str1)>-1) str1 = "\\" + str1;
    str1 = Global.EscapeRegExp(str1);
    return this.replace(new RegExp(str1, "g"), str2);
}
String.prototype.ToCharArray=function(str)
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "Int32_Int32":
        {
            if ((a[0] < 0 || a[1] < 0) || (a[0] + a[1] > this.length))
                throw new ArgumentOutOfRangeException("The value of an argument is outside the allowable range of values.");
                
            if (a[1] == 0)
                return this.split("");
            else
            {
                var substr = this.substr(a[0], a[1]);
                return substr.split("");
            }
        }
        break;
        case "":
            return this.split("");
            break;
    }
    
}
String.prototype.Trim=function(arr)
{
    var theArr = [" "];
    if(arr && Global.IsArray(arr)) theArr = arr;

    return this.TrimEnd(theArr).TrimStart(theArr);
}
String.prototype.TrimEnd=function(chars)
{
    var compareStr = " ";
    if(Global.IsString(chars)) chars = [chars];  // backward compatability
    if(chars) compareStr=chars.join("");

    var retStr = this;
    while(retStr.length > 0 && compareStr.indexOf(retStr.substr(retStr.length-1))>-1)
    {
        retStr = retStr.substr(0, retStr.length-1);
    }
    return retStr.toString();
}
String.prototype.TrimStart=function(chars)
{
    var compareStr = " ";
    if(chars&&!Global.IsString(chars)) compareStr=chars.join("");

    var retStr = this;
    while(retStr.length>0 && compareStr.indexOf(retStr.substr(0,1))>-1)
    {
        retStr = retStr.substr(1);
    }
    return retStr.toString();
}
String.prototype.Remove=function(startIndex,count)
{
    if(count)
        return this.substr(0,startIndex) + this.substr(startIndex+count);
    else
        return this.substr(0,startIndex);
}
String.prototype.PadRight=function(totalWidth, paddingChar)
{
    if(!paddingChar) paddingChar = " ";
    
    var arr = [];
    arr.push(this);
    
    var len = this.length;
    for(var ii=len; ii<=totalWidth-1; ii++)
    {
        arr.push(paddingChar);
    }
    
    return arr.join("");
}
String.prototype.PadLeft=function(totalWidth, paddingChar)
{
    if(!paddingChar) paddingChar = " ";
    
    var arr = [];
    var len = this.length;
    for(var ii=len; ii<=totalWidth-1; ii++)
    {
        arr.push(paddingChar);
    }
    arr.push(this);
    
    return arr.join("");
}
String.prototype.Contains=function(value)
{
    return this.indexOf(value)>-1;
}
String.prototype.IsDigit=function()
{
    if(this.length==1 && "0123456789".indexOf(this)>-1)
        return true;
    else
        return false;
}
String.prototype.Insert=function(index,insertStr) 
{
    if (this.length < index) 
        return this; // maybe return null? .NET throws an exception
    else if (this.length == index) 
        return this + insertStr;
    else 
        return this.substr(0, index) + insertStr + this.substr(index);
    
}
String.prototype.GetType=function() // temp for TaskLib
{
    return {"FullName":"System.String","Name":"System.String"};
}
String.prototype.GetEnumerator=function()
{
    return new CharEnumerator(this);
}
String.Compare=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_String":
            return String.Compare_1(a[0], a[1], false);
            break;
        case "String_String_Boolean":
            return String.Compare_1(a[0], a[1], a[2]);
            break;
        // there's more
    }
}
String.Compare_1=function(strA,strB,ignoreCase)
{
    if(ignoreCase) 
    {
        strA = strA.toLowerCase();
        strB = strB.toLowerCase();
    }    

    if(strA==strB)
        return 0;
    else if(strA<strB)
        return -1;
    else 
        return 1;
}
String.Format=function()
{
    if(arguments.length==0) return "";

    // Prepare it.  {{1}} means that this is a literal and that the output for that should
    // always be {1}, and never replaced.
    var str = arguments[0];
    
    if(str) str = str.replace(/\{\{(\d)\}\}/g, function(sMatch){return "__" + sMatch.replace(/\{\{/,"").replace(/\}\}/,"") + "__";});
    
    for(var ii=1; ii<=arguments.length-1; ii++)
    {
        if (arguments[ii] instanceof EpiOverloadedArgs) continue; 
        
		str = str.replace(new RegExp("\\{" + (ii-1).toString() + "\\}", "g"),arguments[ii])
     }
     str = str.replace(/__(\d)__/g, function(sMatch){return "{" + sMatch.replace(/__/g,"") + "}";});
    return str;
}
String.IsNullOrEmpty=function(str)
{
    if(!str||str.Trim()=="") 
        return true;
    else
        return false;
}
String.Join=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "String_StringArr":
            return a[1].join(a[0]);
            break;
        case "String_StringArr_Int_Int":
            // Need to implement correct -- not used yet.
            return a[1].join(a[0]);
            break;
    }
}
String.Concat=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "StringArr":
            return a[0].join("");
            break;
        case "String_String":
            return a[0]+a[1];
            break;
    }
}

String.Empty = "";
String.prototype.Empty = "";

System.Array = Array;
Array.IndexOf=function(arr, obj)
{
    var idx = 0;
    for(var itm in arr)
    {
        if(arr[itm]==obj) return idx;
        idx++;
    }
    return -1;
}
Array.GetEnumerator=function(arr)
{
    return new Enumerator(arr);
}
Array.GetUpperBound=function(arr)
{
    return arr.length;
}
Array.GetLength=function(arr)
{
    return arr.length;
}
Array.GetValue=function(arr,idx)
{
    var val = null;
    if(arr.length > idx) val = arr[idx];
    
    return val;
}

System.Date = Date;
Date.prototype.GetType=function()
{
    return {"FullName":"System.DateTime","Name":"System.DateTime"};
}
Date.prototype.get_Year=function()
{
    return this.getFullYear();
}
Date.prototype.get_Month=function()
{
    return this.getMonth() + 1;
}
Date.prototype.get_Day=function()
{
    return this.getDate();
}
Date.prototype.get_Date=function()
{
    // A new DateTime with the same date as this instance, and the time value set to 12:00:00 midnight (00:00:00).
    return new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0,0);
    //return this;
}
Date.prototype.get_Minute=function()
{
    return this.getMinutes();
}
Date.prototype.get_Second=function()
{
    return this.getSeconds();
}
Date.prototype.get_Hour=function()
{
    return this.getHours();
}
Date.prototype.get_Millisecond=function()
{
    return this.getMilliseconds();
}
Date.prototype.get_TimeOfDay=function()
{
    return new TimeSpan(this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
}
Date.prototype.GetServerString=function()
{
    var format = "yyyy-MM-ddThh:mm:ss";
    return FormatEngine.FormatDate(this, format);
}
Date.prototype.ToString = function ()
{
    return this.toString();
}
Date.prototype.toString=function()
{
    return FormatEngine.FormatDate(this);
}
Date.prototype.ToShortDateString=function()
{
    return FormatEngine.FormatDate(this, FormatEngine.CultureInfo.ShortDatePattern);
}
Date.prototype.ToShortTimeString=function()
{
    return FormatEngine.FormatDate(this, FormatEngine.CultureInfo.ShortTimePattern);
}
Date.prototype.ToLongTimeString=function()
{
    return FormatEngine.FormatDate(this, FormatEngine.CultureInfo.LongTimePattern);
}
Date.prototype.Equals=function(val)
{
    if (Global.IsDate(val))
        return(this.getTime()==val.getTime());
    else 
        return (this == val);  
      
}
Date.prototype.GetOffset=function(timespan)
{
    var dt = new Date(this.getYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
    dt.Add(timespan);
    return dt;
}
Date.prototype.clone=function()
{
    return new Date(this.getTime());
}
Date.prototype.Add=function(timespan)
{
	// Old method failed if hours was a decimal value
    var totMilliseconds = timespan.Hours *3600000 + timespan.Minutes*60000 + timespan.Seconds * 1000 + timespan.Milliseconds;
    this.setMilliseconds(this.getMilliseconds() + totMilliseconds);
    return this;
}
Date.prototype.Subtract=function(timespan)
{
    var newDate = this.clone();
    if (timespan.Hours >= this.getHours())
        newDate.setHours(this.getHours()-timespan.Hours);
    if (timespan.Minutes >= this.getMinutes())
        newDate.setMinutes(this.getMinutes()-timespan.Minutes);
    if(timespan.Seconds >= this.getSeconds())
        newDate.setSeconds(this.getSeconds()-timespan.Seconds);
    if(timespan.Milliseconds >= this.getMilliseconds())
        newDate.setMilliseconds(this.getMilliseconds()-timespan.Milliseconds);
        
    return newDate;
}
Date.prototype.AddHours=function(hrs)
{
    var newDate = this.clone();
    var currentHours = this.getHours();
    newDate.setHours(currentHours + hrs);
    return newDate;
}
Date.prototype.AddMinutes=function(min)
{
    var newDate = this.clone();
    var currentMinutes = this.getMinutes();
    newDate.setMinutes(currentMinutes + min);
    return newDate;
}
Date.prototype.AddSeconds=function(secs)
{
    var newDate = this.clone();
    var currentSeconds = this.getSeconds();
    newDate.setSeconds(currentSeconds + secs);
    return newDate;
}
Date.prototype.AddDays=function(days)
{
    var newDate = this.clone();
    var currentDays = this.getDate();
    newDate.setDate(currentDays + days);
    return newDate;
}
Date.prototype.AddMonths=function(months)
{
    var newDate = this.clone();
    var currentMo = this.getMonth();
    newDate.setMonth(currentMo + months);
    return newDate;
}
Date.prototype.CompareTo=function(value)
{
    if(Global.IsString(value))
    {
        value = Convert.ToDateTime(value);
    }
    
    var thisStr = this.GetServerString();
    var compareStr = value.GetServerString();
    if(thisStr==compareStr)
        return 0;
    else if(thisStr>compareStr)
        return 1;
    else
        return -1;
}

Date.prototype.get_DayOfWeek=function()
{
    return this.getDay();
}

Number.prototype.GetType=function()
{
    return {"FullName":"System.Decimal","Name":"System.Decimal"};
}
Number.prototype.Equals=function(val)
{
    return this==val;
}
Number.prototype.ToInt32=function()
{
    return this;
}
Number.prototype.ToString=function(format)
{
    if (!format) return this.toString();
    else return FormatEngine.FormatNumber(this,format);
}
System.Decimal = Decimal;
var Decimal = decimal = System.Decimal = function () { }
Decimal.Round=function(val, decimals)
{
    if (decimals && decimals > 0)
    {
        var multiplier = Math.pow(10, decimals);
        return Math.round(val*multiplier)/multiplier;
    }
    return Math.round(val);
}
Decimal.prototype.Equals=function(val)
{
    return this==val;
}
Decimal.TryParse=function(val)
{
    var result=true;

    try
    {
        Global.ArgManager["Out1"] = Convert.ToDecimal(a[0]);
    }
    catch(err)
    {
        Global.ArgManager["Out1"] = 0;
        result=false;
    }

    return result;
}

Decimal.prototype.GetType=function()
{
    return {"FullName":"System.Decimal","Name":"System.Decimal"};
}

System.Math = Math;
Math.Round=function(val)
{
    return Math.round(val);
}
Math.Min=function(x,y)
{
    return Math.min(x,y);
}
Math.Abs=function(x)
{
    return Math.abs(x);
}
Math.Floor=function(x)
{
    return Math.floor(x);
}

var Double = System.Double = function (){}
Double.prototype.GetType=function()
{
    return {"FullName":"System.Double","Name":"System.Double"}; 
}
Double.TryParse=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    var result=true;
    
    switch(overload)
    {
        case "String_Double":
        default:
        {
            try
            {
                Global.ArgManager["Out1"] = Convert.ToInt32(a[0]);
            }
            catch(err)
            {
                Global.ArgManager["Out1"] = 0;
                result=false;
            }
        }
    }
    
    return result;
}
var Int32 = System.Int32 = function(){}
Int32.MaxValue=2147483647;
Int32.prototype.GetType=function()
{
    return {"FullName":"System.Int32","Name":"System.Int32"};
}
Int32.prototype.Equals=function(val)
{
    return this==val;
}
Int32.TryParse=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    var result=true;
    
    switch(overload)
    {
        case "String_Int32":
        default:
        {
            try
            {
                Global.ArgManager["Out1"] = Convert.ToInt32(a[0]);
            }
            catch(err)
            {
                Global.ArgManager["Out1"] = 0;
                result=false;
            }
        }
    }
    
    return result;
}


function DragDrop(ctrl, data, floatObj)
{
    if(DragDrop.Current!=null) return;

    this._control = ctrl;
    this._float = floatObj;
    this.Target = null;
    this.Data = new DataObject(data);
    
    floatObj.style.display = "block";
    
    EpiEventManager.addListener(Global.document.documentElement, "mousemove", this.Drag, this, true);
    EpiEventManager.addListener(Global.document.documentElement, "mouseup", this.End, this, true);
    EpiEventManager.addListener(Global.document.documentElement, "mouseout", this.Out, this, true);
}
DragDrop.Current = null;
DragDrop.Start=function(ctrl, data, floatObj)
{
    DragDrop.Current = new DragDrop(ctrl, data, floatObj);
}
DragDrop.prototype.Out=function(e)
{
    if(document.all)
        toElem = e.toElement;
    else
        toElem = e.relatedTarget;
        
    if(toElem==null) this.End();
}
DragDrop.prototype.Drag=function(e)
{
	var dragDrop_x = e.clientX/1 + 15 + document.body.scrollLeft;
	var dragDrop_y = e.clientY/1 + document.documentElement.scrollTop;	
			
	this._float.style.left = dragDrop_x + 'px';
	this._float.style.top = dragDrop_y + 'px';
	
    if(e.preventDefault) e.preventDefault();
	    
	return false;
	
}
DragDrop.prototype.End=function()
{
    Global.Purge(this._float);
    Global.document.body.removeChild(this._float);

    DragDrop.Current = null;
    EpiEventManager.removeListener(Global.document.documentElement, "mousemove", this.Drag);
    EpiEventManager.removeListener(Global.document.documentElement, "mouseup", this.End);
    EpiEventManager.removeListener(Global.document.documentElement, "mouseout", this.Out);
    
    this._control = null;
    this._float = null;
    this.Target = null;
}
function IsNull(val,defVal)
{
    if (val == null) return defVal;
    else return val;
}

var AsyncCallbackManager=function()
{
    EpiObject.call(this,"AsyncCallbackManager");
}
AsyncCallbackManager.prototype = new EpiObject();

AsyncCallbackManager.prototype.makeAsyncCallback=function(args,context)
{
    var AsyncContext = {"Manager":this,"ContextObj":context};
    CallBasePageAsync(args,AsyncContext);
}

// The server calls this method when done processing the asynch call. 
function BasePageAsyncCallback(callbackResult,AsyncContext)
{
var i=0;
    if (AsyncContext && AsyncContext.ContextObj)
        AsyncContext.Manager.get_Event("BasePageAsyncCallbackDone").fire(callbackResult,AsyncContext.ContextObj);
}
// This method is called by the server if the asynch callback method throws an exception
function BasePageAsyncCallbackError(callbackResult,AsyncContext)
{
    var i = "<Unavailable>";
    if (AsyncContext && AsyncContext.ContextObj && AsyncContext.ContextObj.ID) i = AsyncContext.ContextObj.ID;
   DebugHelper.WriteError("Error in callback for WebSchedule", {"Message":"Error occured in asynch callback. Context object ID: " + i + " ,Callback result: " + callbackResult});
}

var WebFrameworkManager =
{
    "RedirectCreate":function(objName,suppress)
    {
        if(!suppress)
        {
            MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The " + objName + " object is not implemented.", new EpiOverloadedArgs("String_Details"));
        }
    },
    "RedirectInvoke":function(objName,fnName,objIsValid, suppress)
    {
        if(!suppress)
        {
            if(objIsValid)
                MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The " + objName + "." + fnName +  " function is not implemented.", new EpiOverloadedArgs("String_Details"));
            else
                MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework. The operation may not work as expected.", "The " + objName + " object is currently not implemented, so the function " + fnName + " is also unsupported.", new EpiOverloadedArgs("String_Details"));
        }
    }
}

// SPECIFIC TO CUSTOMER
var Mode = {"Customer":0,"CustContact":1,"ShipToContact":2,"ShipTo":3}

// TEMP FOR JOBLIB
function ImageBinding()
{
    this.columnNames = [];
    this.columnValues = [];
    this.image = null;
}

var returnFormat="json";
var xslParameters="";

//HELP Functionality
document.onhelp = function()
{
	return false;  // necessary for cancel original F1 event in IE
}
function keyDownEventCtrl(e, ctrl)
{
    var evtobj = BrowserHelper.GetEvent(e);
    if (!evtobj) return;    

    var keyID = evtobj.keyCode ? evtobj.keyCode : evtobj.which;  
    if (keyID == KeyCodes.F1) //F1
    {
        var noTree = (keyID == KeyCodes.F1 && evtobj.shiftKey);
        HelpManager.ShowFormHelp(ctrl,noTree)
        if (evtobj.preventDefault) evtobj.preventDefault();
        evtobj.cancelBubble = true;
    }
}

var HelpManager= 
{
    ArgsInUrl:{},
    Current:null,
    FieldHelpMode:false,
    Show:function()
    {
	    var helpUrl = "syslogineb21.html";
        if (this.ArgsInUrl)
        {        
            for(var key in this.ArgsInUrl)
            {
                var argChar = (helpUrl.indexOf('?') > 0 )? "&" : "?";
                helpUrl = helpUrl + argChar + key + "=" + this.ArgsInUrl[key];
            }
        }
        var _opener=BrowserHelper.GetParentOpener();
        var cc  = (_opener!=null) ? _opener.Global.HelpForm:Global.HelpForm;	    
        var winHelp = (cc!=null)? cc.Current: null;
	    if(BrowserSniffer.Safari13) winHelp = null;
        if((winHelp) && (!winHelp.closed))
        {           		
    	    winHelp.location = helpUrl;
        } 
        else
        {
            winHelp = window.open( helpUrl, "_blank","location=0,resizable=1,status=0,scrollbars=1,menubar=0,toolbar=0,height=500,width=700");
            Global.HelpForm = this;
            if (_opener) _opener.Global.HelpForm = this;            
        }
        winHelp.focus();
        this.Current = winHelp;
    },
    ShowFormHelp:function(ctrl,noTree)
    {
	    var app = Global.Form._assembly;
	    var frm = "";	    
	    if (Global.window.document.getElementsByTagName("html").length > 0)
	    {
            var el = document.getElementsByTagName("html")[0];	        
	        frm = el.getAttribute("id");
            if (el.getAttribute("helpapp")) app = el.getAttribute("helpapp");
            if (el.getAttribute("helpform")) frm = el.getAttribute("helpform");
            
            // Help path is different for dashboards.
            if (frm && Global.Form && Global.Form.HelpLinkAlternateName && frm.indexOf(Global.Form.HelpLinkAlternateName) == -1)
            {
                app = app + "_" + Global.Form.HelpLinkAlternateName;
                frm = frm + "_" + Global.Form.HelpLinkAlternateName;
            }
	    }
        var activePaneId = null;
        if (ctrl)
        {
            var tabCtrl = Global.BindingEngine.Controls[ctrl.getAttribute("id")];
            var paneCtrl = tabCtrl.get_Controls()[0];
            if (paneCtrl) activePaneId = paneCtrl.ID;
        }     
        var epiguid = (activePaneId)?Global.Form.GetEpiGuid(activePaneId):"";
	    var shiftKey = (noTree)?"1":"0";
	    this.ArgsInUrl = {"helpapp":app,"helpform":frm,"epiguid":epiguid,"shiftKey":shiftKey};
        this.Show();
    },
    ShowFieldHelp:function(onOff)
    {
        if (this.FieldHelpMode)
        {
            EpiEventManager.removeListener(document, "mouseover", this.onmouseoverHandler); 
            EpiEventManager.removeListener(document, "mousemove", this.onmousemoveHandler); 
            EpiEventManager.removeListener(document, "mouseout", this.onmouseoutHandler); 
        }
        else
        {
            EpiEventManager.addListener(document, "mouseover", this.onmouseoverHandler, this, true); 
            EpiEventManager.addListener(document, "mousemove", this.onmousemoveHandler, this, true); 
            EpiEventManager.addListener(document, "mouseout", this.onmouseoutHandler, this, true); 

            var ttElem = document.getElementById("ToolTip");
            if (ttElem!=null) ttElem.style.visibility = "hidden";
        }
        this.FieldHelpMode = onOff;
    },
    onmouseoutHandler:function(e)
    {
        if (this.FieldHelpMode==false) return;

        var ttElem = document.getElementById("ToolTip");
        if (ttElem!=null) ttElem.style.visibility = "hidden";

        var srcEl = BrowserHelper.GetEventSource(e);
        if (this.isFieldHelpEnabledForCtrl(srcEl)== false) return;
        var prevCursor = srcEl.getAttribute("prevCursor");
        if ((prevCursor==null) || (prevCursor=="")) prevCursor = "default";
        srcEl.style.cursor = prevCursor;
    },
    onmouseoverHandler:function(e)
    {
        if (this.FieldHelpMode==false) return;
        var evt = BrowserHelper.GetEvent(e);
        var srcEl = BrowserHelper.GetEventSource(e);

        if ((!evt) || (this.isFieldHelpEnabledForCtrl(srcEl)== false)) return;

        var oldCursor = srcEl.style.cursor;
        if ((oldCursor !="help") && (srcEl.getAttribute("prevCursor")!="help"))
        {
            srcEl.setAttribute("prevCursor", oldCursor);
            srcEl.style.cursor = "help";
        }
        var ttElem = document.getElementById("ToolTip");
        if (ttElem==null)
        {
            ttElem = document.createElement("DIV");
            ttElem.style.visibility = "hidden";
            ttElem.id = "ToolTip";
            ttElem.style.position = "absolute";
            ttElem.style.width = "200px";
            ttElem.style.top = "0px";
            ttElem.style.left = "0px";
            ttElem.className = "FieldHelp";
            document.body.appendChild(ttElem);
        }
        var srcID = srcEl.getAttribute("id");
        var srcCtrl = Global.BindingEngine.Controls[srcID];
        var dv = srcCtrl.DataView;
        var dc = srcCtrl.DataColumn;

	    var fhDiv = document.getElementById("_fieldHelperDiv");
        if ((fhDiv!=null) && (fhDiv.getAttribute("_srcID")!=srcID))
        {
            document.body.removeChild(fhDiv);
            fhDiv = null;  
        }
        if (!fhDiv)
        {
            document.body.setAttribute("fieldHelpFlag","#");
            this.setFieldHelpContent(ttElem);

            var app = Global.Form._assembly;
            var frm = "";	    
            if (document.getElementsByTagName("html").length > 0)
            {
                var el = document.getElementsByTagName("html")[0];	        
                frm = el.getAttribute("id");;
                if (el.getAttribute("helpapp")) app = el.getAttribute("helpapp");
                if (el.getAttribute("helpform")) frm = el.getAttribute("helpform");
            }
            var sheetguid = this.getActivePanelGuid(srcEl);
            var srcguid = Global.Form.GetEpiGuid(srcID);

            var argsInUrl = {"helpapp":app,"helpform":frm,"ctrlguid":srcguid,"sheetguid":sheetguid,"table":dv,"column":dc};
            var helpUrl = "syslogincd49.html";
            for(var key in argsInUrl)
            {
                var argChar = (helpUrl.indexOf('?') > 0 )? "&" : "?";
                helpUrl = helpUrl + argChar + key + "=" + argsInUrl[key];
            }

            var div = document.createElement("DIV");
            div.style.visibility = "hidden";
            div.id = "_fieldHelperDiv";
            div.setAttribute("_srcID",srcID);
            document.body.appendChild(div);
    	
            var iFrame = document.createElement("IFRAME");
            iFrame.id="_fieldHelperFrame";
            iFrame.name="_fieldHelperFrame";
            iFrame.src = helpUrl;
            iFrame.runat="server";

            div.appendChild(iFrame);

            //this.setFieldHelpContent(ttElem);
            setTimeout("HelpManager.keepChecking(0)", 100);
	    }
        else
        {
            this.setFieldHelpContent(ttElem);
        }
    },    
    onmousemoveHandler:function(e)
    {
        if (this.FieldHelpMode==false) return;
        var evt = BrowserHelper.GetEvent(e);
        var srcEl = BrowserHelper.GetEventSource(e);

        if ((!evt) || (this.isFieldHelpEnabledForCtrl(srcEl)== false)) return;

        var ttElem = document.getElementById("ToolTip");
	    var fhDiv = document.getElementById("_fieldHelperDiv");
        if ((!fhDiv) || (!ttElem)) return;

        //update current position
        var mouse_X = evt.clientX + document.body.scrollLeft;
        var mouse_Y = evt.clientY + document.body.scrollTop;
        if (mouse_X < 0){mouse_X = 0;}
        if (mouse_Y < 0){mouse_Y = 0;}
        ttElem.style.left = (mouse_X + 20) + "px";
        ttElem.style.top  = mouse_Y + "px";

        this.setFieldHelpContent(ttElem);
    },
    keepChecking:function(count)
    {
        if (this.FieldHelpMode==false) return;
        if (count>10) return;
        var flg = document.body.getAttribute("fieldHelpFlag");
        if (flg=="1")
        {
            var ttElem = document.getElementById("ToolTip");
            if (ttElem) this.setFieldHelpContent(ttElem);
        }
        else
        {
            count++;
            setTimeout("HelpManager.keepChecking(" + count + ")", 100);
        }
    },
    isFieldHelpEnabledForCtrl:function(elem)
    {
        if (!elem) return false;
        var c = Global.BindingEngine.Controls[elem.getAttribute("id")];
        if (!c) return false;
        if ((c instanceof  EpiTextBox) || (c instanceof EpiCheckBox) || (c instanceof EpiComboBox) || (c instanceof EpiNumericEditor) ||
            (c instanceof EpiButton) || (c instanceof EpiCurrencyEditor) || (c instanceof EpiRadioButton))
            return true;
    	return false;
    },
    setFieldHelpContent:function(contentDiv)
    {    
        if (this.FieldHelpMode==false)
        {
            contentDiv.style.visibility = "hidden";
            return;
        }
        contentDiv.style.visibility = "visible";

        var flg = document.body.getAttribute("fieldHelpFlag");
        if (flg=="2") return; //content already set

        var content = '<table class="FieldHelpActivate" cellspacing="1" cellpadding="0"><tr><td>Activating Field Help...</td></tr></table>';
        if (flg=="#")
        {	
		    var elTxt = document.getElementById("fieldHelpTxt");
		    if (elTxt) 
            {
                elTxt.innerHTML = "<label>Loading Field Help...</label>";
                return;
            }
        }
        else
        {        
	        content = document.body.getAttribute("fieldHelpHtml");
	        document.body.setAttribute("fieldHelpFlag","2");
	    }
        contentDiv.innerHTML = content;
        contentDiv.style.width = (content.length > 1000)?"400px":"200px";
    },
    getActivePanelGuid:function(ctrl)
    {
        var ret = "";
        var oCurrentNode = ctrl;
	    var oCurrentObj;
	    if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[ctrl.id];		    
    	
	    var pnlKey = null;
        while(oCurrentNode && !(oCurrentObj instanceof EpiTabGroup))
        {
            if(oCurrentObj instanceof EpiPanel) 
            {
                ret = Global.Form.GetEpiGuid(oCurrentObj.ID);
                break;
            }
	        oCurrentNode = oCurrentNode.parentNode;
	        if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];
        }
        return ret;
    }
}

//Styling
//set default style instead of styles.css. Used in include.js
function setDefaultStyle(css_name)
{
    if (!css_name) return;
    var link = document.getElementsByTagName("link");
    if ((!link) || (!link.length) || (link.length < 1)) return;

    var i = 0;
    if (css_name == "") css_name = "styles";
    for (i = 0; i < link.length; i++) 
    {
        if ((link[i].href) && (link[i].rel.indexOf("stylesheet") != -1))
        {
            var lhref = link[i].href.toLowerCase();
            if ((link[i].getAttribute("styled") != null) || ((css_name.toLowerCase() != "styles") && ((lhref.indexOf("style/index.html\\styles.css") != -1) || (lhref.indexOf("style/styles-2.css") != -1) || (lhref.indexOf("style/styles.css") != -1))))
            {
                link[i].href = "style\\" + css_name + ".css";
                link[i].setAttribute("styled","1");
            }            
            break;
        }
    }
}

//------------------------------------
// Generic Action Web Service
//------------------------------------
var WebServiceAction = function()
{
}
WebServiceAction.prototype = new EpiObject();
WebServiceAction.WSAction=function(action,paramList,dataSet,rettype)
{    
    //paramsList must be in the format {"ParamName":ParamValue,...} or null or ""
    if (!paramList) paramList = {};
    var paramstr = JSON.stringify({"Params":[paramList]});
    var datastr = (dataSet)? getDatasetForServer(dataSet):"";    
    Global.LoadProxy("lib_Common");
    var lib = new lib_CommonService();
    var ret = lib.AttachmentAction(action,paramstr,datastr);
    if (rettype == "ds")
    {
        var dsRet = new DataSet();
        dsRet.Load(JSON.parse(ret),EpiBindType.None,true);
        return dsRet;
    }
    if (rettype == "bool")
    {
        return (ret == "true");
    }
    return ret;
}

//------------------------------
// Data Tagging
//------------------------------
var TagType = Epicor.Mfg.UI.FrameWork.TagType = {"SingleRecord":0,"SelectedRecords":1,"AllRecords":2}

window.TagMaintenance=function()
{
    LaunchEngineForm.call(this);
    for(var i=0;i<=arguments.length-1;i++){this.Args.push(arguments[i]);}
    this.Assembly="UI.EpiClientLib";
    this.Name="TagMaintenance";
    this._type="Epicor.Mfg.UI.Framework.TagMaintenance";
    this.DialogProps=TagMaintenance.DialogProps;
    this.DialogControls=TagMaintenance.DialogControls;
    this.Variables=TagMaintenance.Variables;
}
TagMaintenance.Assm="UI.EpiClientLib";
TagMaintenance.prototype = new LaunchEngineForm();
LaunchEngineForm.Concat(window.TagMaintenance,[],{},["txtTableName","txtMyTags","txtSharedTags"]);

var DataTagging=function()
{
    this.myTagListBefore=new ArrayList();
    this.sharedTagListBefore=new ArrayList();
    
    if(!window.SysTagListDataSet)
    {
        window.SysTagListDataSet=Epicor.Mfg.BO.SysTagListDataSet=function()
        {
	        DataSet.call(this,"SysTagListDataSet");
	        if(typeof SysTagListDataSet._init=="undefined")
	        {
		        window.SysTagListTable=function()
		        {
			        DataTable.call(this,"SysTagList");
			        this.Columns={"SysRowID":{"DataType":"System.String","ExtendedProperties":{"Format":"x(36)","SystemColumn":true}},"ForeignTableName":{"DataType":"System.String","ExtendedProperties":{"Format":"x(32)"}},"ForeignSysRowID":{"DataType":"System.String","ExtendedProperties":{"Format":"x(36)"}},"Tag":{"DataType":"System.String","ExtendedProperties":{"Format":"x(30)"}},"CreatedOn":{"DataType":"System.DateTime","ExtendedProperties":{}},"CreatedBy":{"DataType":"System.String","ExtendedProperties":{"Format":"x(75)"}},"IsShared":{"DataType":"System.Boolean","ExtendedProperties":{}},"SysRevID":{"DataType":"System.Int32","ExtendedProperties":{"Format":">>,>>>,>>9","SystemColumn":true}},"RowIdent":{"DataType":"System.String","ExtendedProperties":{"External":true,"SystemColumn":true}},"RowMod":{"DataType":"System.String","ExtendedProperties":{"External":true,"SystemColumn":true}},"DBRowIdent":{"DataType":"System.Byte[]","ExtendedProperties":{"External":true,"SystemColumn":true}}};
			        this.PrimaryKey=[];
		        }
		        SysTagListTable.prototype=new DataTable();
		        SysTagListDataSet.prototype.get_SysTagList=function(){return this.get_Table("SysTagList");}
		        SysTagListDataSet._init = true;
	        }
	        this.AddTables({"SysTagList":new SysTagListTable()});
        }
        SysTagListDataSet.prototype = new DataSet();
    }
    if(!window.SysTagDataSet)
    {
        window.SysTagDataSet=Epicor.Mfg.BO.SysTagDataSet=function()
        {
	        DataSet.call(this,"SysTagDataSet");
	        if(typeof SysTagDataSet._init=="undefined")
	        {
		        window.SysTagTable=function()
		        {
			        DataTable.call(this,"SysTag");
			        this.Columns={"SysRowID":{"DataType":"System.String","ExtendedProperties":{"Format":"x(36)","SystemColumn":true}},"ForeignTableName":{"DataType":"System.String","ExtendedProperties":{"Format":"x(32)"}},"ForeignSysRowID":{"DataType":"System.String","ExtendedProperties":{"Format":"x(36)"}},"Tag":{"DataType":"System.String","ExtendedProperties":{"Format":"x(30)"}},"CreatedOn":{"DataType":"System.DateTime","ExtendedProperties":{}},"CreatedBy":{"DataType":"System.String","ExtendedProperties":{"Format":"x(75)"}},"IsShared":{"DataType":"System.Boolean","ExtendedProperties":{}},"SysRevID":{"DataType":"System.Int32","ExtendedProperties":{"Format":">>,>>>,>>9","SystemColumn":true}},"RowIdent":{"DataType":"System.String","ExtendedProperties":{"External":true,"SystemColumn":true}},"RowMod":{"DataType":"System.String","ExtendedProperties":{"External":true,"SystemColumn":true}},"DBRowIdent":{"DataType":"System.Byte[]","ExtendedProperties":{"External":true,"SystemColumn":true}}};
			        this.PrimaryKey=['SysRowID'];
		        }
		        SysTagTable.prototype=new DataTable();
		        SysTagDataSet.prototype.get_SysTag=function(){return this.get_Table("SysTag");}
		        SysTagDataSet._init = true;
	        }
	        this.AddTables({"SysTag":new SysTagTable()});
        }
        SysTagDataSet.prototype = new DataSet();
    }
//    if(!window.SysTagMatchDataSet)
//    {
//        window.SysTagMatchDataSet=Epicor.Mfg.BO.SysTagMatchDataSet=function()
//        {
//	        DataSet.call(this,"SysTagMatchDataSet");
//	        if(typeof SysTagMatchDataSet._init=="undefined")
//	        {
//		        window.SysTagMatchTable=function()
//		        {
//			        DataTable.call(this,"SysTagMatch");
//			        this.Columns={"ForeignSysRowID":{"DataType":"System.String","ExtendedProperties":{"Format":"x(36)","External":true,"Like":"SysTag.ForeignSysRowID"}},"Tag":{"DataType":"System.String","ExtendedProperties":{"Format":"x(30)","External":true,"Like":"SysTag.Tag"}},"RowIdent":{"DataType":"System.String","ExtendedProperties":{"External":true,"SystemColumn":true}},"RowMod":{"DataType":"System.String","ExtendedProperties":{"External":true,"SystemColumn":true}},"DBRowIdent":{"DataType":"System.Byte[]","ExtendedProperties":{"External":true,"SystemColumn":true}}};
//			        this.PrimaryKey=['ForeignSysRowID','Tag'];
//		        }
//		        SysTagMatchTable.prototype=new DataTable();
//		        SysTagMatchDataSet.prototype.get_SysTagMatch=function(){return this.get_Table("SysTagMatch");}
//		        SysTagMatchDataSet._init = true;
//	        }
//	        this.AddTables({"SysTagMatch":new SysTagMatchTable()});
//        }
//        SysTagMatchDataSet.prototype = new DataSet();
//    }
}
DataTagging.prototype.UniqueWords=function(text)
{
    var tags = new ArrayList();
    var tagStr="";
    var splitArr=text.Split(" "); //.Split("\n").Split("\r");
    for(var tag in splitArr)
    {
        tag=splitArr[tag];
        var trimmedTag = tag.Trim();
        if (!String.IsNullOrEmpty(trimmedTag))
        {
            if(tagStr.indexOf("%"+trimmedTag.toLowerCase()+"%")==-1)
            {
                tags.Add(trimmedTag);
                tagStr+="%"+trimmedTag.toLowerCase()+"%";
            }
        }
    }

    return tags;
}
DataTagging.prototype.ShowMaintForm=function(epiTool,tagType)
{
    var tagMaintForm = new TagMaintenance();
    var viewName = String.Empty;
    var foreignSysRowID = String.Empty;
    var tableName = String.Empty;
    var edvBind = null;
    var session = Global.Form.Session;

    if (epiTool.CB.Sender&&epiTool.CB.Sender.Session)
    {
        session=epiTool.CB.Sender.Session;
    }
    var userID = session.UserID;

    Global.LoadProxy("SysTag");
    var sysTagBO = new SysTagService();

    var iEpiCtrlBase = epiTool.CB.Control;
    if (iEpiCtrlBase != null)
    {
        if(iEpiCtrlBase instanceof EpiTreeView)
        {
            if (epiTool.CB.TreeNode!=null)
            {
                edvBind = epiTool.CB.TreeNode.EpiDataView;
                viewName=edvBind.ViewName;
                tableName = edvBind.dataView.Table.TableName.Replace("List", String.Empty);
            }
        }
        else
        {
            viewName=iEpiCtrlBase.DataView;
            edvBind=Global.BindingEngine.EpiDataViews[viewName];
            if(edvBind)
                tableName=edvBind.dataView.Table.TableName;
            else    
                tableName=viewName;
        }
    }

    tagMaintForm.GetControl("txtTableName").set_Text(tableName);

    var sysTagListMy = null;
    var sysTagListShared = null;

    switch (tagType)
    {
        case TagType.SingleRecord:
            if(edvBind.Row==-1) return;
            foreignSysRowID = edvBind.dataView.get_Row(edvBind.Row)["SysRowID"].toString();
            var morePages=false;
            
            sysTagListMy=({_call:function(me){var _ret_=sysTagBO.GetList("json", "","ForeignSysRowID = '" + foreignSysRowID + "' AND ForeignTableName = '" + tableName + "' AND IsShared = false",0,1,morePages);morePages=Global.ArgManager["Out1"];return _ret_; }})._call(this);
            sysTagListShared=({_call:function(me){var _ret_=sysTagBO.GetList("json", "","ForeignSysRowID = '" + foreignSysRowID + "' AND ForeignTableName = '" + tableName + "' AND IsShared = true",0,1,morePages);morePages=Global.ArgManager["Out1"];return _ret_; }})._call(this);
            
            myTags = String.Empty;
            for (var dr in sysTagListMy.get_SysTagList().get_Rows())
            {
                dr=sysTagListMy.get_SysTagList().get_Row(dr);
                if (!this.myTagListBefore.Contains(dr["Tag"].toString()))
                {
                    this.myTagListBefore.Add(dr["Tag"].toString());
                    myTags += dr["Tag"].toString() + " ";
                }
            }
            tagMaintForm.GetControl("txtMyTags").set_Text(myTags.Trim());

            shareTags = String.Empty;
            for (var dr in sysTagListShared.get_SysTagList().get_Rows())
            {
                dr=sysTagListShared.get_SysTagList().get_Row(dr);
                if (!this.sharedTagListBefore.Contains(dr["Tag"].toString()))
                {
                    this.sharedTagListBefore.Add(dr["Tag"].toString());
                    shareTags += dr["Tag"].toString() + " ";
                }
            }
            tagMaintForm.GetControl("txtSharedTags").set_Text(shareTags.Trim());

            break;

        case TagType.SelectedRecords:
        case TagType.AllRecords:
            break;
    }

    var diaRes = tagMaintForm.ShowDialog();

    if (diaRes == DialogResult.OK)
    {
        try
        {
            var sysTagDataSet = new Epicor.Mfg.BO.SysTagDataSet();

            var listMyTagsAfter=this.UniqueWords(tagMaintForm.GetControl("txtMyTags").get_Text());
            var listSharedTagsAfter=this.UniqueWords(tagMaintForm.GetControl("txtSharedTags").get_Text());

            switch (tagType)
            {
                case TagType.SingleRecord:
                    foreignSysRowID = edvBind.dataView.get_Row(edvBind.Row)["SysRowID"].toString();
                    for(var myTag in listMyTagsAfter.items)
                    {
                        myTag=listMyTagsAfter.items[myTag];
                        if (!this.myTagListBefore.Contains(myTag))
                        {
                            this.addSysTagRecord(sysTagBO, sysTagDataSet, tableName, foreignSysRowID, myTag, userID, false);
                        }
                    }
                    for (var sharedTag in listSharedTagsAfter.items)
                    {
                        sharedTag=listSharedTagsAfter.items[sharedTag];
                        if (!this.sharedTagListBefore.Contains(sharedTag))
                        {
                            this.addSysTagRecord(sysTagBO, sysTagDataSet, tableName, foreignSysRowID, sharedTag, userID, true);
                        }
                    }
                    for (var myTag in this.myTagListBefore.items)
                    {
                        myTag=this.myTagListBefore.items[myTag];
                        if (!listMyTagsAfter.Contains(myTag))
                        {   
                            this.deleteSysTagRecord(sysTagBO, sysTagListMy, foreignSysRowID, myTag);
                        }
                    }
                    for (var myTag in this.sharedTagListBefore.items)
                    {
                        myTag=this.sharedTagListBefore.items[myTag];
                        if (!listSharedTagsAfter.Contains(myTag))
                        {   
                            this.deleteSysTagRecord(sysTagBO, sysTagListShared, foreignSysRowID, myTag);
                        }
                    }

                    break;

                case TagType.SelectedRecords:
                    for (var cntX=0; cntX < epiTool.CB.GridObj.get_Selected().Rows.Count; cntX++)
                    {
                        var ugRow = epiTool.CB.GridObj.get_Selected().Rows[cntX];
                        var dataRow = ugRow.ListObject;
                        if (dataRow != null)
                        {
                            if (dataRow.get_Table().Columns["SysRowID"])
                            {
                                foreignSysRowID = dataRow["SysRowID"];
                            }
                            else
                            {
                                MessageBox.Show("SysRowID's are missing!");
                                return;
                            }
                        }
                        else
                        { alert("test");
//                            var dataRowView = ugRow.ListObject;
//                            if (dataRowView != null)
//                            {
//                                if (dataRowView.Row.Table.Columns.Contains("SysRowID"))
//                                {
//                                    foreignSysRowID = (string)dataRowView.Row["SysRowID"];
//                                }
//                                else
//                                {
//                                    MessageBox.Show("SysRowID's are missing!");
//                                    return;
//                                }
//                            }

                        }

                        for(var newMyTag in listMyTagsAfter.items)
                        {
                            newMyTag=listMyTagsAfter.items[newMyTag];
                            this.addSysTagRecord(sysTagBO, sysTagDataSet, tableName, foreignSysRowID, newMyTag, userID, false);
                        }
                        for(var newSharedTag in listSharedTagsAfter.items)
                        {
                            newSharedTag=listSharedTagsAfter.items[newSharedTag];
                            this.addSysTagRecord(sysTagBO, sysTagDataSet, tableName, foreignSysRowID, newSharedTag, userID, true);
                        }
                    }
                    break;

                case TagType.AllRecords:
                    for (var cntX = 0; cntX < epiTool.CB.GridObj.get_Rows().Count; cntX++)
                    {
                        var ugRow = epiTool.CB.GridObj.get_Rows()[cntX];
                        var dataRow = ugRow.get_ListObject();
                        foreignSysRowID = dataRow["SysRowID"];

                        for(var newMyTag in listMyTagsAfter.items)
                        {
                            newMyTag=listMyTagsAfter.items[newMyTag];
                            this.addSysTagRecord(sysTagBO, sysTagDataSet, tableName, foreignSysRowID, newMyTag, userID, false);
                        }
                        for(var newSharedTag in listSharedTagsAfter.items)
                        {
                            newSharedTag=listSharedTagsAfter.items[newSharedTag];
                            this.addSysTagRecord(sysTagBO, sysTagDataSet, tableName, foreignSysRowID, newSharedTag, userID, true);
                        }
                    }
                    break;
            }
        }
        catch(err) {}
    }
    else if (diaRes == DialogResult.Cancel)
    {

    }
}
DataTagging.prototype.addSysTagRecord=function(sysTagBO,sysTagDataSet,tableName,foreignSysRowID,tagValue,userID,isShared)
{
    try
    {
        sysTagDataSet.Clear();
        sysTagBO.GetNewSysTag(sysTagDataSet);

        sysTagRow = sysTagDataSet.get_SysTag().get_Row(0);
        sysTagRow.BeginEdit();
        sysTagRow.set_Item("ForeignTableName",tableName);
        sysTagRow.set_Item("ForeignSysRowID",foreignSysRowID);
        sysTagRow.set_Item("Tag",tagValue);
        sysTagRow.set_Item("CreatedOn",System.DateTime.get_Now().get_Date());
        sysTagRow.set_Item("CreatedBy",userID);
        sysTagRow.set_Item("IsShared",isShared);
        sysTagRow.EndEdit();

        sysTagBO.Update(sysTagDataSet);
    }
    catch (ex)
    {
        ExceptionBox.Show(ex);
    }
}
DataTagging.prototype.deleteSysTagRecord=function(sysTagBO,sysTagList,foreignSysRowID,theTag)
{
    var sysRowID = String.Empty;
    var drs = sysTagList.get_SysTagList().Select("ForeignSysRowID = '" + foreignSysRowID + "' AND Tag = '" + theTag + "'");
    for (var i = 0; i < drs.length; i++)
    {
        sysRowID = drs[i]["SysRowID"];
        sysTagBO.DeleteByID(sysRowID);
    }

}

window.SummariesForm=function()
{
    LaunchEngineForm.call(this);
    for(var i=0;i<=arguments.length-1;i++){this.Args.push(arguments[i]);}
    this.Assembly="UI.EpiClientLib";
    this.Name="SummariesForm";
    this._type="Epicor.Mfg.UI.Framework.SummariesForm";
    this.DialogProps=SummariesForm.DialogProps;
    this.DialogControls=SummariesForm.DialogControls;
    this.Variables=SummariesForm.Variables;
}
SummariesForm.Assm="UI.EpiClientLib";
SummariesForm.prototype = new LaunchEngineForm();
LaunchEngineForm.Concat(window.SummariesForm,[],{},["chkAverage","chkCount","chkMaximum","chkMinimum","chkSum"]);

Global.AddNamespace("Epicor.Mfg.Shared.UDSupport");
var IsKeyControlVisibleHandler = Epicor.Mfg.Shared.UDSupport.IsKeyControlVisibleHandler=Delegate;

var InfoMessage=Epicor.Mfg.UI.FrameWork.InfoMessage=function(boName,methodName,userName,companyName,plantName,version)
{
    this.BO=boName;
    this.Method=methodName;
    this.User=userName;
    this.Company=companyName;
    this.Plant=plantName;
    this.Version=version;
    this.ItemsDisplayMode=InfoMessage.DisplayMode.Individual;
    this.MessageItems=new ArrayList();
}
InfoMessage.DisplayMode={"Individual":0,"Grid":1};
InfoMessage.Severity={"Info":0,"Question":1,"Warning":2,"Error":3,"UpdateConflict":4};
InfoMessage.prototype.RecalcDisplayMode=function()
{
    this.ItemsDisplayMode = (this.MessageItems.Count > 1) ? InfoMessage.DisplayMode.Grid : InfoMessage.DisplayMode.Individual;
}
InfoMessage.prototype.GetMessageTable=function()
{
    var table = new DataTable("Messages");
    table.AddColumn("Severity",new EpiOverloadedArgs("String"));
    table.AddColumn("Message",new EpiOverloadedArgs("String"));
    for (var item in this.MessageItems.items)
    {
        item=this.MessageItems.items[item];
        table.AddRow([item.Severity.toString(),item.Text.Replace("\\n","\n")],new EpiOverloadedArgs("ObjectArr"));
    }
    return table;
}

window.ExceptionDialog=Epicor.Mfg.UI.FrameWork.ExceptionDialog=function()
{
    LaunchEngineForm.call(this);
    for(var i=0;i<=arguments.length-1;i++){this.Args.push(arguments[i]);}
    this.Assembly="UI.EpiClientLib";
    this.Name="ExceptionDialog";
    this._type="Epicor.Mfg.UI.FrameWork.ExceptionDialog";
    this.DialogProps=ExceptionDialog.DialogProps;
    this.DialogControls=ExceptionDialog.DialogControls;
    this.Variables=ExceptionDialog.Variables;
}
ExceptionDialog.Assm="UI.EpiClientLib";
ExceptionDialog.prototype = new LaunchEngineForm();
LaunchEngineForm.Concat(window.ExceptionDialog,[],{"isInfoMessage":null,"isSummary":null},[]);
ExceptionDialog.prototype.showInfoMessageGrid=function()
{
    var args=[];
    for(var i=0;i<=arguments.length-1;i++){args.push(arguments[i]);}
    return this.CallFunction("showInfoMessageGrid", args);
}
ExceptionDialog.prototype.setInfoMessage=function()
{
    var args=[];
    for(var i=0;i<=arguments.length-1;i++){args.push(arguments[i]);}
    return this.CallFunction("setInfoMessage", args);
}
ExceptionDialog.prototype.handleDetailView=function()
{
    var args=[];
    for(var i=0;i<=arguments.length-1;i++){args.push(arguments[i]);}
    return this.CallFunction("handleDetailView", args);
}
ExceptionDialog.ShowInfoMessage=function(OwnerForm,infoMsg)
{
    var dialog = new ExceptionDialog();
    dialog.isInfoMessage = true;
    dialog.set_Text(EpiString.GetString("InfoMessage"));
    if (infoMsg.ItemsDisplayMode == InfoMessage.DisplayMode.Grid &&
        infoMsg.MessageItems.Count > 0)
    {
        dialog.showInfoMessageGrid(infoMsg);
        dialog.ShowDialog();
    }
    else
    {
        for(var item in infoMsg.MessageItems.items)
        {
            item=infoMsg.MessageItems.items[item];
            dialog.setInfoMessage(infoMsg, item);
            dialog.ShowDialog();
////            if (!dialog.isSummary)
////                dialog.handleDetailView();
        }
    }
}


