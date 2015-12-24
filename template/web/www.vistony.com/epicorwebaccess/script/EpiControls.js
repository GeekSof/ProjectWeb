var PropertyType = {"Enabled":0,"Visible":1,"Value":2,"ReadOnly":3,"Text":4,"Checked":5,"Image":6,"SelectedRow":7}

//---------------------------
// EpiControls (BASE)
//---------------------------
var EpiControl = Epicor.Mfg.UI.FrameWork.EpiControl = function(settings)
{
    if(Global.Form) Global.Form.CacheSettings(settings);
    
    if(!settings) settings = {};

    this._win = window;
    this._impl = [];
    this._events = [];
    this.Queue = [];
    this.DialogQueue = [];
    
    if(settings.DV!=undefined) this.DataView = settings.DV;
    if(settings.DC!=undefined) this.DataColumn = settings.DC;
    if(settings.EpiGuid!=undefined) this.EpiGuid = settings.EpiGuid;
    if(settings.KeyFld!=undefined) this.EpiKeyField = settings.KeyFld;
    if(settings.InG!=undefined) this.InGrid = settings.InG;
    if(settings.Vis!=undefined) this.Visible = settings.Vis;
    if(settings.MaskInput!=undefined) this.MaskInput = settings.MaskInput;
    if(settings.ID!=undefined) this.ID = this.Name = settings.ID;
    if(settings.ControlMap!=undefined) this.ControlMap = settings.ControlMap;
    if(settings.EpiCxtMenuK!=undefined) this.EpiContextMenuKey = settings.EpiCxtMenuK;
    if(settings.Height!=undefined) this.Height=settings.Height;
    if(settings.Width!=undefined) this.Width=settings.Width;
    if(settings.DBPrompt!=undefined) this.DashboardPrompt=settings.DBPrompt;
    if(settings.DBCndn!=undefined) this.DashboardCondition=settings.DBCndn; 
    if(settings.DBHNull!=undefined) this.DashboardHonorNull=settings.DBHNull; 
    if(settings.InpTrkPnlPrnt !=undefined) this.HasInputTrackerPanelParent = true; // These controls in an EpiTrackerPanel should not update values when the dataview changes.
    if(settings.InSrchPnl !=undefined) this.InSearchPnl = true; // Dashboard specific, these controls become keyfields in RefreshProperties
    if(settings.InUpdtPnl !=undefined) this.InUpdatePnl = true; // Dashboard specific, updatable controls, these are enabled when there is data in RefreshProperties
    if(settings.Tag!=undefined) this.Tag = settings.Tag;
    if(settings.Padding!=undefined) this.Padding = settings.Padding;
    if(settings.Dock!=undefined) this.Dock = settings.Dock;
    if(settings.MaximumSize!=undefined) this.MaximumSize=settings.MaximumSize;
    if(settings.MinimumSize!=undefined) this.MinimumSize=settings.MinimumSize;
    if(settings.EpiL!=undefined) this.EpiLabel=settings.EpiL;

    this.Anchor=settings.Anchor!=undefined?settings.Anchor:{"Top":true,"Left":true,"Right":false,"Bottom":false};
    this.AnchorPad=settings.AnchorPad!=undefined?settings.AnchorPad:{"Top":0,"Left":0,"Right":0,"Bottom":0};

    if(settings.AI!=undefined)
    {
       settings.LocationX=settings.AI[0];
       var a=settings.AI[1];
       if (a==2) this.Anchor = {"Top":true,"Left":true,"Right":true,"Bottom":true};
       else if (a!=1) this.Anchor = {"Top":a[0]?true:false,"Left":a[1]?true:false,"Right":a[2]?true:false,"Bottom":a[3]?true:false};
       var p=settings.AI[2];
       if (p==1) this.AnchorPad = {"Top":-1,"Left":-1,"Right":1,"Bottom":1};
       else if (p==2) this.AnchorPad = {"Top":-1,"Left":0,"Right":0,"Bottom":1};
       else if (p!=undefined) this.AnchorPad = {"Top":p[0],"Left":p[1],"Right":p[2],"Bottom":p[3]};
    }

    if(Global.FormDir=="rtl"&&settings.AI)
    {
        if(this.Dock==DockStyle.Right) this.Dock=DockStyle.Left;
        if(this.Dock==DockStyle.Left) this.Dock=DockStyle.Right;
        
        var anchorR=this.Anchor.Right;
        var anchorL=this.Anchor.Left;
        
        var anchorPadR=this.AnchorPad.Right;
        var anchorPadL=this.AnchorPad.Left;
        
        this.Anchor.Left=anchorR?true:false;
        this.Anchor.Right=anchorL?true:false;
        
        if(anchorL) this.AnchorPad.Right=settings.LocationX?settings.LocationX:0;
        if(anchorR) this.AnchorPad.Left=anchorPadR;
        
        this.RtlInit=true;
    }

    EpiControl.prototype.DialogProps = {"Visible":this.Visible,"Enabled":true,"ReadOnly":false,"Text":"", "Value":"", "Checked":false, "Image":null, "CodesDesc":null};
    if(!this._assembly) this._assembly = "UI.EpiClientLib"; //default
}
EpiControl.prototype.Appearance = null;
EpiControl.prototype.AllowDrop = false;
EpiControl.prototype.SaveFormatted = false;
EpiControl.prototype.SkipRefreshProperties = false;
EpiControl.prototype.OnChangeSet = false;
EpiControl.prototype.hasContextMenu = true;
EpiControl.prototype.OwnerGrid = null;
EpiControl.prototype.IsEpiReadOnly = false;
EpiControl.prototype.IsDockArea = false;
EpiControl.prototype.ContextMenu = null;
EpiControl.prototype._overrideRO = false;
EpiControl.prototype.TypeName = "EpiControl";
EpiControl.prototype._ClassName = null;
EpiControl.prototype.DataView = null;
EpiControl.prototype.DataColumn = null;
EpiControl.prototype.EpiGuid = null;
EpiControl.prototype.EpiKeyField = false;
EpiControl.prototype.InGrid = false;
EpiControl.prototype.Visible = true;
EpiControl.prototype.MaskInput = null;
EpiControl.prototype.ID = null;
EpiControl.prototype.Name = null;
EpiControl.prototype.ControlMap = null;
EpiControl.prototype.EpiContextMenuKey = "";
EpiControl.prototype.Height=null;
EpiControl.prototype.Width=null;
EpiControl.prototype.DesignMode = false;
EpiControl.prototype.DashboardPrompt=false;
EpiControl.prototype.CausesValidation=true;
EpiControl.prototype.Tag=null;
EpiControl.prototype.Handle=null;
EpiControl.prototype.Resize=function(){}
EpiControl.prototype.Padding={"Top":0,"Left":0,"Right":0,"Bottom":0};
EpiControl.prototype.MaximumSize={"Height":0,"Width":0};
EpiControl.prototype.MinimumSize={"Height":0,"Width":0};
EpiControl.prototype.Dock=DockStyle.None;
EpiControl.prototype.RtlInit=false;
EpiControl.prototype.DataBindings = null;
EpiControl.prototype.IsUpdatableColumn=false;
EpiControl.prototype.Dispose=function()
{
    this.ClearAllEventListeners();
    this._win = null;
    this.HtmlObject = null;
}
EpiControl.prototype.Update=function(){}
EpiControl.prototype.PointToClient=function(){}
EpiControl.prototype.get_MousePosition=function(){}
EpiControl.prototype.BeginInit=function(){}
EpiControl.prototype.set_Dock=function(val){this.Dock = val;}
EpiControl.prototype.set_EpiContextMenuKey=function(val){this.EpiContextMenuKey=val;}
EpiControl.prototype.set_TextAlign=function(){}
EpiControl.prototype.set_Name=function(name){this.Name= name;}
EpiControl.prototype.set_Anchor=function(val){}
EpiControl.prototype.set_Cursor=function(){}
EpiControl.prototype.set_TabStop=function(){}
EpiControl.prototype.set_EpiTransaction=function(){}
EpiControl.prototype.get_Location=function(){return {"X":this.get_Left(), "Y":this.get_Top()};}
EpiControl.prototype.get_EpiColumn=function()
{
    return {"DataV":this.DataView,"DataC":this.DataColumn};
}
EpiControl.prototype.get_Appearance=function()
{
    if(this.Appearance==null) this.Appearance = new Appearance();
    return this.Appearance;
}
EpiControl.prototype.get_Header = function()
{
    if (this.Header) return this.Header;
    var header = new HeaderBase(this);
    this.Header = header;
    return header;
}
EpiControl.prototype.get_SortIndicator=function()
{
    if(this.InGrid&&this.OwnerGrid)
    {
        var grid=Global.BindingEngine.Controls[this.OwnerGrid];
        if(grid)
        {
            var settings=grid._loadSettings();
            if(settings.OrderBy)
            {
                if(settings.OrderBy.Column==this.ID)
                {
                    if(settings.OrderBy.Direction=="ASC")
                        return Infragistics.Win.UltraWinGrid.SortIndicator.Ascending;
                    if(settings.OrderBy.Direction=="DESC")
                        return Infragistics.Win.UltraWinGrid.SortIndicator.Descending;
                    return Infragistics.Win.UltraWinGrid.SortIndicator.Disabled;
                }
            }
        }
    }
    return Infragistics.Win.UltraWinGrid.SortIndicator.None;
}
EpiControl.prototype.set_SortIndicator=function(value)
{
    if(this.InGrid&&this.OwnerGrid)
    {
        var grid=Global.BindingEngine.Controls[this.OwnerGrid];
        if(grid)
        {
            var settings=grid._loadSettings();

            var direction="";

            if(value==Infragistics.Win.UltraWinGrid.SortIndicator.Ascending)
                direction="ASC";
            else if(value==Infragistics.Win.UltraWinGrid.SortIndicator.Descending)
                direction="DESC";

            if(direction=="")
            {
                if(settings.OrderBy&&settings.OrderBy.Column==this.ID)
                {
                    delete settings["OrderBy"];
                    settings.OrderBy={ Column: null,Direction: null };
                }
            }
            else
            {
                if(settings.OrderBy)
                    delete settings["OrderBy"];
                settings.OrderBy={ Column: this.ID,Direction: direction };
            }
            grid._saveSettings(settings);
        }
    }
}
EpiControl.prototype.GetAncestor=function(type) { return null; }
EpiControl.prototype.ResetText=function(){}
EpiControl.prototype.get_Event=function(eventName)
{
    if (eventName=="Load" && this == Global.Form 
        && !Script.InFramework && Script._inInitCustomCode)
    {
        // Send back a stub Event object because we dont want this event to fire.
        return {"subscribe":function(){}};
    }
    if (!this._events[eventName]) this._events[eventName] = new EpiEvent(eventName, this);
    return this._events[eventName];
}
EpiControl.prototype.ClearAllEventListeners = function()
{
    for (eventName in this._events)
    {
        this._events[eventName].unsubscribeAll();
        this._events[eventName] = null;
    }
    this._events = [];
}
EpiControl.prototype.ctor=function(){}
EpiControl.prototype.get_Tag=function(){return this.Tag;}
EpiControl.prototype.set_Tag=function(val){this.Tag = val;}
EpiControl.prototype.get_Name=function(){return this.ID;}
EpiControl.prototype.get_ContextMenu=function(){return this.ContextMenu;}
EpiControl.prototype.set_ContextMenu=function(val){this.ContextMenu=val;}
EpiControl.prototype.get_DesignMode=function(){return this.DesignMode;}
EpiControl.prototype.set_CausesValidation=function(value){this.CausesValidation=value;}
EpiControl.prototype.get_Sender=function(){return Global.Form;}
EpiControl.prototype.get_Font=function(){return {"Height":9};}// 9 is the point for hte font used by EpiLabel in the css
EpiControl.prototype.BeginUpdate=function(){}
EpiControl.prototype.EndUpdate=function(){}
EpiControl.prototype.ExternalValidate=function(){return true;}
EpiControl.prototype.CanFocus=function(){return this.get_Enabled();}
EpiControl.prototype.Hide=function(){this.set_Visible(false);}
EpiControl.prototype.get_IsDisposed=function(){return false;}
EpiControl.prototype.Get=function(){return Global.document.getElementById(this.ID);}
EpiControl.prototype._focusinit=false;
EpiControl.prototype._initFocus=function(){}
EpiControl.prototype.ElementFromPoint=function(){return this;}
EpiControl.prototype.GetContext=function(){return this;}
EpiControl.prototype.SuspendLayout=function(){}
EpiControl.prototype.ResumeLayout=function(){}
EpiControl.prototype.set_EpiKeyField=function(value){this.EpiKeyField=value;}
EpiControl.prototype.PopStatus=function()
{
     Global.window.status = "";
}
EpiControl.prototype.get_DataBindings=function()
{
    if(!this.DataBindings)
    {
        this.DataBindings=new ControlBindingsCollection();
        this.DataBindings.get_Event("ItemAdded").subscribe(this._bindingAdded,this,true);
    }
    return this.DataBindings;
}
EpiControl.prototype._bindingAdded=function(item)
{
    var binding=item.Value;

    if(!this["set_"+binding.PropertyName]||!binding.DataSource["get_"+binding.DataMember]) return;
    var fn=function(sender) {this["set_"+binding.PropertyName](sender["get_"+binding.DataMember]())}
    binding.DataSource.get_Event(binding.DataMember+"Changed").subscribe(fn,this,true);
    
    this["set_"+binding.PropertyName](binding.DataSource["get_"+binding.DataMember]());
}
EpiControl.prototype.resizeChildren=function(ctrl,h,w,limits)
{
    if(!limits) limits = {"Top":this.Padding.Top,"Right":this.Padding.Right,"Bottom":this.Padding.Bottom,"Left":this.Padding.Left};

    var fill=[];
    if(this.IsDockArea)
    {   
        // go backwards, because of the way things get ordered with docking.
        for (var c = ctrl.lastChild; c; c = c.previousSibling) 
        {
            if(c.nodeType==1)
            {
                var obj = Global.BindingEngine.Controls[c.id];
                if(obj) 
                {
                    if(obj.Dock==DockStyle.Fill)
                        fill.push({"obj":obj,"c":c});
                    else
                        obj.Resize(c,h,w,limits);
                }
            }
        }
    }
    else
    {
        for (var c = ctrl.firstChild; c; c = c.nextSibling) 
        {
            if(c.nodeType==1)
            {
                var obj = Global.BindingEngine.Controls[c.id];
                if(obj) 
                {
                    if(obj.Dock==DockStyle.Fill)
                        fill.push({"obj":obj,"c":c});
                    else
                        obj.Resize(c,h,w,limits);
                }
            }
        }
    }
    
    for(var o in fill)
    {
        fill[o]["obj"].Resize(fill[o]["c"],h,w,limits);
    }
}
EpiControl.prototype.getBounds = function(h, w, t, l, pH, pW, limits, hPercent, wPercent)
{
	var bounds = {};

	// Two different methods, docking or anchoring.
	if (this.Dock == DockStyle.None)
	{
	    
		if (Global.FormDir=="ltr" && this.Anchor.Top && this.Anchor.Left && !this.Anchor.Right && !this.Anchor.Bottom) return null;
        
        var hOffset=0;
        if(Global.Form.Name=="ScheduleForm") hOffset=34; 
        
		bounds.Dock = false;
		if (this.Anchor.Top)
		{
			bounds.Top = t;
			if (this.Anchor.Bottom)
				bounds.Height = pH - t - this.AnchorPad.Bottom + hOffset;
			else
				bounds.Height = h;
		}
		else if (this.Anchor.Bottom)
		{
			bounds.Top = pH - h - this.AnchorPad.Bottom + hOffset;
			bounds.Height = h;
		}
		else
		{
			bounds.Top = t;
			bounds.Height = h;
		}

	    if (this.Anchor.Left)
	    {
	        if(Global.FormDir=="ltr")
            {
		        bounds.Left = l;
		        
		        if (this.Anchor.Right)
		            bounds.Width = pW - l - this.AnchorPad.Right;
	            else
		            bounds.Width = w;
		    }
		    else
		    {
		        bounds.Left = this.AnchorPad.Left;
		        
		        if (this.Anchor.Right)
		            bounds.Width = pW - bounds.Left - this.AnchorPad.Right;
	            else
		            bounds.Width = w;
		    }
	    }
	    else if (this.Anchor.Right)
	    {
		    bounds.Left = pW - w - this.AnchorPad.Right;
		    bounds.Width = w;
	    }
	    else
	    {
		    bounds.Left = l;
		    bounds.Width = w;
	    }
	}
	else
	{
		// Dealing with the limits here.  Limits include any padding on the control and any controls that were
		// docked before this one.  
		bounds.Dock = true;
		switch (this.Dock)
		{
			case DockStyle.Left:
				if (wPercent) w = pW * (wPercent / 100);
				bounds.Top = limits.Top;
				bounds.Left = limits.Left;
				bounds.Width = w;
				bounds.Height = pH - limits.Top - limits.Bottom;
				this._reconcile(bounds, hPercent, wPercent);
				limits.Left = limits.Left + bounds.Width;
				break;
			case DockStyle.Top:
				if (hPercent) h = pH * (hPercent / 100);
				bounds.Top = limits.Top;
				bounds.Left = limits.Left;
				bounds.Width = pW - limits.Left - limits.Right;
				bounds.Height = h;
				this._reconcile(bounds, hPercent, wPercent);
				limits.Top = limits.Top + bounds.Height;
				break;
			case DockStyle.Right:
				if (wPercent) w = pW * (wPercent / 100);
				bounds.Top = limits.Top;
				bounds.Left = pW - limits.Right - w;
				bounds.Width = w;
				bounds.Height = pH - limits.Top - limits.Bottom;
				this._reconcile(bounds, hPercent, wPercent);
				limits.Right = limits.Right + bounds.Width;
				break;
			case DockStyle.Bottom:
				if (hPercent) h = pH * (hPercent / 100);
				bounds.Top = pH - limits.Bottom - h;
				bounds.Left = limits.Left;
				bounds.Width = pW - limits.Left - limits.Right;
				bounds.Height = h;
				this._reconcile(bounds, hPercent, wPercent);
				limits.Bottom = limits.Bottom + bounds.Height;
				break;
			case DockStyle.Fill:
				bounds.Top = limits.Top;
				bounds.Left = limits.Left;
				bounds.Width = pW - limits.Left - limits.Right;
				bounds.Height = pH - limits.Top - limits.Bottom;
				this._reconcile(bounds, hPercent, wPercent);
				break;
		}

	}

	return bounds;
}
EpiControl.prototype._reconcile=function(bounds,hPercent,wPercent)
{
//    if(wPercent && this.MaximumSize.Width>0 && bounds.Width>this.MaximumSize.Width) bounds.Width=this.MaximumSize.Width;
    if(hPercent && this.MaximumSize.Height>0 && bounds.Height>this.MaximumSize.Height) bounds.Height=this.MaximumSize.Height;
    
//    if(wPercent && this.MinimumSize.Width>0 && bounds.Width<this.MinimumSize.Width) bounds.Width=this.MinimumSize.Width;
    if(hPercent && this.MinimumSize.Height>0 && bounds.Height<this.MinimumSize.Height) bounds.Height=this.MinimumSize.Height;
}
EpiControl.prototype.set_Location=function(value)
{
    this.set_Left(value.X);
    this.set_Top(value.Y);
}
EpiControl.prototype.set_Left=function(leftPos)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        ctrl.style.left=leftPos+"px";
    }
    this.Left =leftPos;
}
EpiControl.prototype.set_Top=function(topPos)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        ctrl.style.top=topPos+"px";
    }
    this.Top =topPos;
}
EpiControl.prototype.get_Handle=function()
{
    if(this.Handle==null) this.Handle = Global.Form._handleCtr++;
    return this.Handle;
}
EpiControl.prototype.set_TabIndex=function(idx)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl) ctrl.tabIndex = idx;
    this.TabIndex = idx;
}
EpiControl.prototype.get_TabIndex=function()
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl) return ctrl.tabIndex;
    
    return 0;
}
EpiControl.prototype._focusin=function(ctrl)
{
    if(ctrl) 
    {
        if(!ctrl.tagName) ctrl = ctrl.target||ctrl.srcElement;
        Global.Form._setActiveControl(ctrl);
    }
}
EpiControl.prototype.get_CanFocus=function()
{
    return this.get_Enabled();
}
EpiControl.prototype.get_ContainsFocus=function()
{
    if(Global.Form._activePath[this.ID]) 
        return true;
    else    
        return false;
}
EpiControl.prototype.get_Focused=function()
{
    return (this==Global.Form._activeObj);
}
EpiControl.prototype.get_Parent=function()
{
    var ctrl = Global.document.getElementById(this.ID);
    var controls = Global.BindingEngine.Controls;
    
    if(ctrl) ctrl = ctrl.parentNode;
    while(ctrl && ctrl.id!="div_TopLevelPanel" && ctrl.tagName!="BODY")
    {
        var o = controls[ctrl.id];
        if(o) return o;
        ctrl = ctrl.parentNode;
    }
    return null;
}
EpiControl.prototype.get_EpiTransaction=function()
{
    return Global.Form.trans;
}
var zPosIndex=15;
EpiControl.prototype.BringToFront = function (ctrl)
{
    if (!ctrl)
        ctrl = Global.document.getElementById(this.ID);

    if (!ctrl && this.HtmlObject)
        ctrl = this.HtmlObject;

    if (ctrl)
    {
        ctrl.style.zIndex = zPosIndex;
        zPosIndex++;
    }
}
var zNegIndex=0;
EpiControl.prototype.SendToBack=function()
{
    var ctrl = Global.document.getElementById(this.ID);
    if (ctrl)
    {  
        ctrl.style.zIndex=zNegIndex;
        //zNegIndex--;
    }
}
EpiControl.prototype.Equals=function(obj)
{
    if(obj==this)
        return true;
    else
        return false;
}
EpiControl.prototype.CreateGraphics=function()
{
    return new Graphics();
}
EpiControl.prototype.get_IsEpiReadOnly=function() 
{
    if(this._overrideRO)
        return this.IsEpiReadOnly;
    else
        return Global.Form.IsEpiReadOnly;
}
EpiControl.prototype.set_IsEpiReadOnly=function(val) 
{
    this.IsEpiReadOnly = val; 
    this._overrideRO = true; 
}
EpiControl.prototype.set_ValueList=function(valueList)
{
    if (!valueList) return;
    
    if(this.InGrid) 
    {
        if (valueList instanceof EpiComboBox)
        {
            var descCol = this.DataColumn;
            if (this.DataView && Global.Form.ID!="POEntryForm")
            {
                var dv = Global.BindingEngine.EpiDataViews[this.DataView];
                if (dv && dv.dataView.Table.Columns[valueList.DescColumn])
                    descCol = valueList.DescColumn;
            }
            var ctrl;
            if (valueList.cboType == "cboContact")
                ctrl = new cboContact({"ID":this.ID,"DV":this.DataView,"DC":this.DataColumn,"DescC":descCol,"CboType":valueList.cboType,"InG":true});
            else
                ctrl = new EpiComboBox({"ID":this.ID,"DV":this.DataView,"DC":this.DataColumn,"DescC":descCol,"CboType":valueList.cboType,"InG":true});
             ctrl.ValueList = valueList;
			 ctrl.InUpdatePnl = this.InUpdatePnl;
             valueList.isGridValueList =true;
             Global.BindingEngine.Controls[this.ID] =ctrl;
             
             if (this.OwnerGrid)
             {
                var ownerGrid = Global.BindingEngine.Controls[this.OwnerGrid];
                if (ownerGrid && !ownerGrid.IsEmpty)
                {
                    var dView = Global.BindingEngine.EpiDataViews[this.DataView];
                    var grdCtrl = Global.document.getElementById(this.OwnerGrid);
                    var gridParts = ownerGrid._getGridParts(grdCtrl);
                    // If the grid is already bound, rebind it now.
                    if (dView.dataView.Rows.length == gridParts["BodyTable"].rows.length && dView.dataView.Rows.length > 0)
                        ownerGrid.Bind(Global.BindingEngine,grdCtrl, dView, dView.Row, true);
                }
             }
        }
        else if (this instanceof EpiComboBox && valueList instanceof ValueList)
        {
            this.ValueList = valueList;
        }
    }
	
}

EpiControl.prototype.set_EpiGuid=function(val) {this.EpiGuid=val;}
EpiControl.prototype.get_EpiGuid=function(){return this.EpiGuid;}
EpiControl.prototype.get_HasChildren=function()
{
    return this.get_Controls().Count>0;
}

EpiControl.prototype.get_Controls=function()
{
    if(this.Controls) return this.Controls;

    this.Controls = new ControlCollection();//ArrayList();
    
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        this._recurseGetControls(ctrl, this.Controls);
    }
    return this.Controls;
}
EpiControl.prototype._recurseGetControls=function(ctrl, list)
{
    for (var c = ctrl.firstChild; c; c = c.nextSibling) 
    {
        if(c.nodeType==1)
        {
            var obj = Global.BindingEngine.Controls[c.id];        
            if(obj) 
            {
                list.Add(obj);
                if (obj.Name)
                    list[obj.Name] = obj;
            }
            else
            {
                // if not an object, then we need to keep going until we find one.
                this._recurseGetControls(c, list);
            }
        }
    }
}

EpiControl.prototype._findRequiredCtrl=function(parentCtrl)
{
    var dv, ret;
    for (var c = parentCtrl.firstChild; c; c = c.nextSibling) 
    {
        if(c.nodeType==1)
        {
            var res = null;
            var obj = Global.BindingEngine.Controls[c.id];        
            if(obj)
            { 
                if (obj.DataView && obj.DataColumn)
                { 
                    dv = Global.BindingEngine.EpiDataViews[obj.DataView];
                    if (dv && dv.dataView && dv.dataView.Table)
                    {
                        var extProp = dv.dataView.Table.GetExtendedProperty(obj.DataColumn, "Required","");
                        if (extProp == "True") return obj;   
                    }
                }
                var ret = obj._findRequiredCtrl(c);
                if (ret) return ret;
            }
        }
    }
    return null;
}
EpiControl.prototype.GetNextControl=function(beginControl,goFwd)
{
    var ctrls = this.get_Controls();
    if (!ctrls.tabIndxList) return beginControl;
    var nextCtrl;
    for (var i=0, rec; rec=ctrls.tabIndxList[i]; i++) 
    {
        if (rec[1] == beginControl.ID)
        {
            if (goFwd)
                nextCtrl=Global.BindingEngine.Controls[ctrls.tabIndxList[i+1][1]];
            else
                nextCtrl=Global.BindingEngine.Controls[ctrls.tabIndxList[i-1][1]];
            break;
        }
    }
    
    return  nextCtrl;
}
EpiControl.prototype.ReturnHandler=function(sender,ea)
{
    if (!sender) return;
    try
    {
        var ctrl;
        if (sender.CB.Control.InGrid)
            ctrl = sender.CB.DivCtrl;
        else
            ctrl = Global.document.getElementById(this.ID);
        if (ctrl && sender.ReturnValue)
        {
            this.SetValue(ctrl,sender.ReturnValue);
            this.OnChange(ctrl);
        }
    }
    catch(err){
        
		//MessageBox.Show("Unable to apply returned value. Error:" + err.description);
    }
}
EpiControl.prototype.SelectText=function(ctrl){}
EpiControl.prototype.HasSelectedText=function()
{
    var userSelection;
    if (window.getSelection) {
	    userSelection = window.getSelection();
    }
    else if (document.selection) { // should come last; Opera!
        userSelection = document.selection.createRange();
    }

    var selectedText = userSelection;
    if (userSelection.text) selectedText = userSelection.text;
    if (selectedText.length > 0) return true;
    else return false;
}
EpiControl.prototype.SetChangeEvent = function() { }
EpiControl.prototype.GetType=function()
{
    var t = new System.Type();
    t.Name = this._type;
    
    if(!t.Name) t.Name = this.TypeName;
    
    if(this._assembly) 
        t.Assembly = Global.Assemblies[this._assembly];        
    
    return t;
}
EpiControl.prototype.OnChange = function(ctrl)
{
    var retVal = Global.BindingEngine.OnChange(ctrl);
    if(retVal)
    {
        this.get_Event("TextChanged").fire();
        this.get_Event("ValueChanged").fire();
    }
    return retVal;
}
EpiControl.prototype.OnEnabledChanged = function(ctrl)
{
    this.get_Event("EnabledChanged").fire();
}
EpiControl.prototype._fireLoad=function()
{
    this.get_Event("Load").fire();
}
EpiControl.prototype.get_TopLevelControl=function()
{
    return Global.Form;
}
EpiControl.prototype.GetDataVal = function(ctrl)
{
    var dataVal = "";
    if(this.DataView && this.DataColumn)
    {
        if(Global.BindingEngine.EpiDataViews[this.DataView])
        {
            var rowNum = Global.BindingEngine.EpiDataViews[this.DataView].Row;
            if(this.InGrid) var rowNum = this.GetRowNum(ctrl);
            if (rowNum != -1)
            {
                dataVal = Global.BindingEngine.EpiDataViews[this.DataView].dataView.Rows[rowNum][this.DataColumn];
            }
        }
    }
    
    return dataVal;
}
EpiControl.prototype.IsChanged = function(ctrl)
{
    var isChanged = true;
    try
    {   
        var dataVal = this.GetDataVal(ctrl);
        var ctrlVal = ctrl.value;
        if (ctrlVal == undefined) ctrlVal = this.GetValue(ctrl);
        
        if(this.SaveFormatted)
        {
            if(ctrlVal==dataVal) isChanged = false;
        }
        else
        {
            var unformattedVal = this.Unformat(ctrlVal);
            if(unformattedVal==dataVal) isChanged = false;
        }
    }
    catch(err){}
    
    return isChanged;
}
EpiControl.prototype.set_Enabled=function(val,toolsFlg) 
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) this.SetEnabled(ctrl,val,toolsFlg);
}

EpiControl.prototype.set_ReadOnly=function(val) 
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) this.SetReadOnly(ctrl,val);
}
EpiControl.prototype.SetReadOnly=function(ctrl, readOnlyFlg, toolsFlg)
{
    this.SetEnabled(ctrl, !readOnlyFlg, toolsFlg);
}
EpiControl.prototype.SetEnabledInGrid=function(ctrl, enabledFlg)
{
    if(ctrl.tagName!="DIV") 
    {
        this._focusOutGrid(ctrl);
        var div = ctrl.parentNode.getElementsByTagName("DIV");
        if(div) ctrl = div[0];
    }
    
    if(!enabledFlg)
    {
        ctrl.className = "disabled";
        ctrl.tabIndex = "-1";
        ctrl.setAttribute("_disabled", "true");
    }
    else
    {
        ctrl.className = "";
        ctrl.tabIndex = "0";
        ctrl.setAttribute("_disabled", "false");
    }   
}
EpiControl.prototype.get_Enabled=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) return this.GetEnabled(ctrl);
}
EpiControl.prototype.GetEnabled=function(ctrl)
{
    if(this.InGrid)
    {
        if(ctrl.tagName!="DIV") 
        {
            var div = ctrl.parentNode.getElementsByTagName("DIV");
            if(div) ctrl = div[0];
        }
        return !(ctrl.className == "disabled");
    }
    else
    {
        return !(ctrl.disabled);
    }
}
EpiControl.prototype.get_ReadOnly=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) return this.GetReadOnly(ctrl);
}
EpiControl.prototype.GetReadOnly=function(ctrl)
{
    return !this.GetEnabled(ctrl);
}
EpiControl.prototype.get_Visible=function() 
{
    var vis = false;
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) vis = this.GetVisible(ctrl);
	return vis;
}
EpiControl.prototype.GetVisible=function(ctrl)
{
    return !(ctrl.style.display=="none");
}
EpiControl.prototype.set_Hidden=function(val) 
{
    if (this.InGrid && !this.OwnerGrid && Global.InstanceOf(Global.Form,"EpiSearchBase"))
    {
        this.OwnerGrid="ugdSearchResults";
    }

    if (this.InGrid && this.OwnerGrid)
    {
        var grid = Global.BindingEngine.Controls[this.OwnerGrid];
        if (grid)
        {
            var gridCtrl = Global.document.getElementById(grid.ID);  
            // SetColumnHidden expects the key within the _columns collection. If the _columns is filled at runtime, the key is missing the 'col' in the beginning.
            // find the actual column key
            var key = "";
            for (var c in grid._columns)
            {
                if (grid._columns[c] == this.ID)
                {
                    key=c;
                    break;
                }
            }
            if (key != "")
            {
                grid.SetColumnHidden(gridCtrl, key, val);

                if(val==false && Global.InstanceOf(Global.Form,"EpiSearchBase") && !Global.Form._initDone)
                {
                    // Column is being explicitly displayed by apps load code.  Cannot hide it in the _initLoad of
                    // EpiSearchBase.
                    var colCtrl = Global.BindingEngine.Controls[grid._columns[key]];
                    if(colCtrl)
                    {
                        var caption=grid._getColHeaderCaption(colCtrl);
                        Global.Form.ShownColumns.Add({"Key":key,"Caption":caption});
                    }
                }
            }
            else if(Global.InstanceOf(Global.Form,"EpiSearchBase") &&
                this.DataColumn && this.DataColumn!="" && grid.DataView && !grid._columns[this.DataColumn]) 
            {
                var edv=Global.BindingEngine.EpiDataViews[grid.DataView];
                if(edv && edv.dataView && edv.dataView.Table)
                {
                    var col = edv.dataView.Table.get_Column(this.DataColumn);
                    if(col)
                    {
                        var cap=(col.Caption&&(col.Caption.length>0))?col.Caption:
                          ((col.ExtendedProperties&&col.ExtendedProperties.Caption&&col.ExtendedProperties.Caption.length>0)?
                              col.ExtendedProperties.Caption:col.ColumnName);
                        if((!grid._columns["col"+col.ColumnName])&&(!grid._columns[col.ColumnName]))
                            grid.AddColumn(gridCtrl,edv.dataView.Table,{ "ColumnName": col.ColumnName,"ColumnWidth": -1,"ColumnCaption": cap,"Enabled": false },true);

                        key=this.DataColumn;
                    }
                }
            }
        }
    }
}
EpiControl.prototype.set_EpiHiddenControl = function (val)
{
    this.set_Visible(!val);
}
EpiControl.prototype.set_EpiHideControl = function (val)
{
    this.set_Visible(!val);
}
EpiControl.prototype.set_Visible=function(val) 
{ 
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) this.SetVisible(ctrl,val);
	else this.Visible = val; // set the property if the control is still not created.
}
EpiControl.prototype.SetVisible=function(ctrl,visibleFlg,fromRR)
{
    if(this.InGrid) return;

    if (ctrl != null)
    {
    if(visibleFlg)
        ctrl.style.display = "";
    else
        ctrl.style.display = "none";
    }
	if (this.EpiLabel) // Change the visible for the attached label too.
    {
        var lbl = Global.BindingEngine.Controls[this.EpiLabel];
        if (lbl)
            lbl.SetVisible(Global.document.getElementById(this.EpiLabel), visibleFlg);
    }
        
    if(!fromRR) this.Visible = visibleFlg;
    
}
EpiControl.prototype.set_Value=function(val) 
{
	var ctrl = Global.document.getElementById(this.ID);
	
	if(ctrl) 
	{
	    this.SetValue(ctrl,val);    
//	    this.OnChange(ctrl);
    }
}
EpiControl.prototype.SetValue=function()
{
}
EpiControl.prototype.get_NullableValue=function()
{
    var val = this.get_Value();
    if(val=="") val = null;
    return val;
}
EpiControl.prototype.get_Value=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) return this.GetValue(ctrl);
}
EpiControl.prototype.GetValue=function()
{
    return "";
}
EpiControl.prototype.set_Checked=function(val) 
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) 
	{
	    this.SetChecked(ctrl,val);
//	    this.OnChange(ctrl);
    }
}
EpiControl.prototype.SetChecked=function(ctrl,checkedFlg)
{
    this.SetValue(ctrl, checkedFlg);
}
EpiControl.prototype.get_Checked=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) return this.GetChecked(ctrl);
}
EpiControl.prototype.GetChecked=function(ctrl)
{
    return this.GetValue(ctrl);
}
EpiControl.prototype.set_Text=function(val) 
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) this.SetText(ctrl,val);
	this.Text = val;
}
EpiControl.prototype.SetText = function(ctrl, val)
{
    this.SetValue(ctrl, val);
}
EpiControl.prototype.get_Text=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) return this.GetText(ctrl);  
}
EpiControl.prototype.GetText = function(ctrl)
{
    var txt = this.GetValue(ctrl, false);
    if(txt==null && this.Text==null) txt = "";
    if(txt==null && this.Text!=null) txt = this.Text;
    return txt;
}
EpiControl.prototype.Format=function(val)
{
    return val;
}
EpiControl.prototype.Unformat=function(val)
{
    return val;
}
EpiControl.prototype.IsValid=function(val)
{
    return true;
}

EpiControl.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);

    if(this.InGrid)
    {
        this.SetEnabledInGrid(ctrl, enabledFlg);   
    }
    else
    {
        ctrl.disabled=!enabledFlg;
    }    
    this.OnEnabledChanged(ctrl);
}
EpiControl.prototype.Bind = function(bEngine, ctrl, dv, rowNum, boundGrids)
{
    if(dv && !bEngine.IsBindingDataset(dv.dataView.Table.DataSet))
        return false;
        
    if(dv && bEngine.BindDataView && bEngine.BindDataView!=dv.ViewName)
        return false;

    var dataviews = bEngine.EpiDataViews;
    var controls = bEngine.Controls;
    for (var c = ctrl.firstChild; c; c = c.nextSibling) 
    {
        if(c.nodeType==1)
        {
            var flg = false;
            var obj = controls[c.id];

            if(obj) obj._initFocus(c);

            if(obj && obj.DataView && bEngine.EpiDataViews[obj.DataView])
            {
                var doBind = obj.DataView != "NoBoundFields";   //SCR 65480
                
                if(bEngine.EpiDataViews[obj.DataView].dataView.Table.DataSet && !bEngine.IsBindingDataset(bEngine.EpiDataViews[obj.DataView].dataView.Table.DataSet))
                    doBind = false;
                    
                if(doBind && bEngine.BindDataView && obj.DataView!=bEngine.BindDataView)
                    doBind = false;

                if (doBind)
                {
	            // Do not rebind child controls of grid, they are already bound by EpiGrid
                    if (boundGrids && boundGrids[c.id])
                        flg = true;
                    else
                    {
                        var dView = dataviews[obj.DataView];
                        flg = obj.Bind(bEngine, c, dView, dView.Row);
                        
                        if(bEngine.CurrentTab.id=="div_TopLevelPanel")
                        {
                            bEngine.RootHasBinding=true;
                        }
                    }
                }
            }
            else if(obj && obj.TypeName=="EpiTabGroup")
            {
                flg = obj.Bind(bEngine, c, null, null, boundGrids);
            }
            else if(obj) 
            {
                obj.SetChangeEvent(c);
            }

            if (!flg) this.Bind(bEngine, c, null, null, boundGrids);                
        }
    }
    
    if(dv && rowNum!=null) this.RefreshProperties(ctrl, dv, rowNum);
    
    return false;
}

EpiControl.prototype._setRequiredStyle=function(ctrl)
{
    if (Global.Form.FormOptions.RequiredIndicator && Global.Form.FormOptions.RequiredIndicatorColor)
    {
        ctrl.style.border = "solid 2px " + Global.Form.FormOptions.RequiredIndicatorColor;
        if (this.InGrid) 
            this._showReqd = true;
    }
}
EpiControl.prototype.RefreshProperties = function (ctrl, dv, row)
{
    if (this.SkipRefreshProperties) return;

    Global.InRefreshProps = true;
    if (this.DashboardPrompt && this.InSearchPnl)
        this.EpiKeyField = true;

    //Removed the EpiNavigator from this check because it should be enabled if its a keyfield for the dashboards.
    if (row == -1 || (Global.Form && Global.Form.allCtrlsDisabled == true && this.TypeName != "EpiShape" && (this.TypeName == "EpiComboBox" && !this.InNavCtrl)))
    {
        if (!this.EpiKeyField)
            this.SetEnabled(ctrl, false, true);
        else
        {
            this.SetEnabled(ctrl, true, true);

            if (!this.DashboardPrompt && !Global.GettingNew && !Global.BindingEngine.FocusSet)
            {
                this.Focus(ctrl);
                if (this.TypeName != "EpiButton") Global.BindingEngine.FocusSet = true;
            }

            if (FormTestManager) FormTestManager.RegisterKeyField(this);
        }

        if (dv && this.DataColumn)
        {
            var tbl = dv.dataView.Table;

            var props;

            var dc = tbl._resolveColumnName(this.DataColumn);
            var col = tbl.Columns[dc];
            if (col && this.TypeName != "EpiShape") props = tbl.get_ExtProps(dc);
            if (props)
            {
                if (props["IsHidden"] == true || props["SystemColumn"] == true) this.SetVisible(ctrl, false, true);
                if (this.TypeName != "EpiTreeView" && Global.Form.FormOptions && Global.Form.FormOptions.RequiredIndicator && props["Required"] == "True")
                    this._setRequiredStyle(ctrl);
            }

            if (this._hasEpizone(tbl, props))
            {
                this._createEpiZone(ctrl, props);
                if (this.EpiZone && !this.InGrid)
                {
                    var epiZoneCtrl = Global.document.getElementById(this.ID + "_epizone");
                    if (epiZoneCtrl) this.EpiZone.SetEnabled(false, epiZoneCtrl);
                }
            }
        }
    }
    else
    {
        if (dv && this.DataColumn)
        {
            var tbl = dv.dataView.Table;

            var props;
            var dc = tbl._resolveColumnName(this.DataColumn);
            var col = tbl.Columns[dc];
            if (col && this.TypeName != "EpiShape") props = tbl.get_ExtProps(dc);  //props = col["ExtendedProperties"];

            var ro = false, hdn = !this.Visible, val;

            if (!this.EpiKeyField && this.get_IsEpiReadOnly() && this.TypeName != "EpiShape") ro = true;
            if (ro && dv.RowRules[this.DataView + "." + dc] && dv.RowRules[this.DataView + "." + dc]["OverrideStateEnabled"]) ro = false;

            if (this.TypeName == "EpiRadioButton" && this.EpiManualEnabled == ManualEnabledState.Disabled) ro = true;

            if (props && (props["ReadOnly"] == true || props["ReadOnly"] == "True" || props["Enabled"] == false || props["Enabled"] == "False" || props["Secured"] == true)) ro = true;
            // Dashboard
            if (this.DashboardPrompt && this.InSearchPnl)
                ro = false;

            // The Extended property is overridden for a combo within a navigator, when there is data.
            if (this.InNavCtrl)
                ro = false;

            if (props && (props["IsHidden"] == true || props["SystemColumn"] == true)) hdn = true;
            if (this.TypeName != "EpiTreeView" && Global.Form.FormOptions && Global.Form.FormOptions.RequiredIndicator && props && props["Required"] == "True")
                this._setRequiredStyle(ctrl);

            // We enable grid controls that are updatable in the dashboard but only if they dont have the 'Secured' ext. prop. set 
            if (Global.BindingEngine.IsBindingReadOnlyGrid && (!this.InUpdatePnl || props["Secured"])) ro = true;
            if (!ro && this.InUpdatePnl && !this.IsUpdatableColumn) ro = true;

            var colRR = dv.RowRules[this.DataView + "." + dc];
            var tblRR = dv.RowRules[this.DataView];
            var r = dv.dataView.Rows[row];

            var rowProps;

            if (!ro)
            {
                var roRule;
                if (tblRR && col) // DataView rowrules apply only to the columns of the dataview
                {
                    roRule = tblRR["ReadOnly"];
                    if (roRule) ro = ProcessRowRules(roRule, r, dc);
                }
                if (!ro && colRR && colRR["ReadOnly"])
                {
                    roRule = colRR["ReadOnly"];
                    if (roRule) ro = ProcessRowRules(roRule, r, dc);
                }
                if (!ro && dv.MyRowProps[dc])
                {
                    rowProps = dv.MyRowProps[dc];
                    if (rowProps["IsReadOnly"] == true || rowProps["IsEnabled"] == false) ro = true;
                }
            }

            // Combo in navcontrol should always be enabled if there is data (dont apply rowrules)
            if (this.InNavCtrl)
                ro = false;
            if (this.isDisabled) ro = true;
            this.SetEnabled(ctrl, !ro, true);

            if (!hdn && colRR && colRR["IsHidden"]) hdn = ProcessRowRules(colRR["IsHidden"], r, dc);

            if (!ro && dv.MyRowProps[dc])
            {
                rowProps = dv.MyRowProps[dc];
                if (rowProps["IsVisible"] == false) hdn = true;
            }

            // Combo in navcontrol should always be visible if there is data (dont apply rowrules)
            if (this.InNavCtrl)
                hdn = false;

            this.SetVisible(ctrl, !hdn, true);

            var val;
            if (colRR && colRR["GetValue"])
            {
                for (var rr in colRR["GetValue"])
                {
                    val = colRR["GetValue"][rr].Execute(r);
                    if (val != undefined && val != "null") this.SetValue(ctrl, val);
                }
            }

            var style;
            ctrl.style.fontWeight = "";
            ctrl.style.backgroundColor = "";
            if (tblRR && tblRR["Style"])
            {
                for (var rr in tblRR["Style"])
                {
                    if (this.InGrid || !tblRR["Style"][rr].GridOnly)
                    {
                        style = tblRR["Style"][rr].Execute(r);
                        if (style != undefined) this._setStyle(ctrl, style);
                    }
                }
            }
            if (colRR && colRR["Style"])
            {
                for (var rr in colRR["Style"])
                {
                    style = colRR["Style"][rr].Execute(r);
                    if (style != undefined) this._setStyle(ctrl, style);
                }
            }
        }

        if (this.Queue.length > 0)
        {
            for (itm in this.Queue)
            {
                var queueItm = this.Queue[itm];

                switch (queueItm.Type)
                {
                    case PropertyType.Enabled:
                        this.SetEnabled(ctrl, queueItm.Value, true);
                        break;
                }
            }
            this.Queue = [];
        }
        if (this._hasEpizone(tbl, props))
        {
            this._createEpiZone(ctrl, props);
            if (this.EpiZone && !this.InGrid)
            {
                var epiZoneCtrl = Global.document.getElementById(this.ID + "_epizone");
                if (epiZoneCtrl)
                {
                    this.EpiZone.SetEnabled(true, epiZoneCtrl);
                    //                    if(ctrl.className == "DropControl")
                    //                    {
                    //                         this.EpiZone.adjustInfozoneAndParent(epiZoneCtrl);
                    //                    }
                }

            }
        }
    }

    Global.InRefreshProps = false;

}

EpiControl.prototype._hasEpizone=function(dt, props)
{
    if (this.epizoneExt) return this.epizoneExt;
    
    if (props)
        this.epizoneExt = (props["ZoneBAQ"])? true:false;
    else if (dt)
    {    
        var extProp = dt.GetExtendedProperty(this.DataColumn,"ZoneBAQ","");
        this.epizoneExt=(extProp)? true:false;
    }
    return this.epizoneExt;
}
EpiControl.prototype._createEpiZone=function(ctrl, props, hideZone, baqZone)
{
    try
    {
        if (hideZone == undefined) hideZone = false;
        if (!this.DataColumn || !this.epizoneExt) return;
        if (Global.InstanceOf(this,"EpiTextBox") || Global.InstanceOf(this,"EpiComboBox"))
        {
            if (this.hasEpiZone && this.EpiZone)
            {
                if (!this.EpiZone.CurrentValue) // This doesnt make sense for the grid because all controls point to the same object.
                    this.EpiZone.initZone();
                if (this.InGrid) // For the grid controls, add a handler for the mouse
                {
                    if (ctrl && ctrl.parentNode)
                        EpiEventManager.addListener(ctrl.parentNode, "mouseover",this.EpiZone._domouseover, this.EpiZone, true);
                }
                return;
            }
            
            // TODO: Check if EpiFormOptions suppresses the indicator. Also get the color from the form options.
            //if (ebf != null && ebf.FormOptions != null && !ebf.FormOptions.ZoneIndicatorSuppressed)
            {
                var color = "Green";//ebf.FormOptions.ZoneIndicatorColor;
                var newEpiZone = EpiZone.AddZoneIndicator(this, ctrl, color, hideZone);
                newEpiZone.ZoneBAQ = (props!=undefined)? props["ZoneBAQ"]: baqZone;
                newEpiZone.searchOnEmpty = (props!=undefined)? props["ZoneSearchOnEmptyControl"]:"";
                if (newEpiZone.searchOnEmpty) 
                    newEpiZone.searchOnEmpty = Convert.ToBoolean(newEpiZone.searchOnEmpty);
                if (this.InGrid && ctrl && ctrl.parentNode && !hideZone)
                        EpiEventManager.addListener(ctrl.parentNode, "mouseover",this.EpiZone._domouseover, this.EpiZone, true);
                this.hasEpiZone = true;
            }
        }
        }
        catch(err)
        {
            DebugHelper.WriteError("error creating Infozone", err);
        }
}
EpiControl.prototype.AddZoneIndicator=function(epiZone, parentControl)
{
    var imageCtrl;
    if (parentControl)
    {
        imageCtrl = epiZone.GetZoneIndicatorImage(this,parentControl);
        parentControl.parentNode.appendChild(imageCtrl);
    }
    return imageCtrl;
}
EpiControl.prototype.get_EpiContextMenuKey=function()
{
    // apply Like extended property
    if (!this.validECMK) // Even if EpiContextMenuKey property might be set, but the Like property overrides that.
    {
        if(this.DataView && this.DataColumn)
        {
            try
            {
                var dv = Global.BindingEngine.EpiDataViews[this.DataView];
                var colName = dv.dataView.Table._resolveColumnName(this.DataColumn);
                
                //var props = dv.dataView.Table.Columns[colName]["ExtendedProperties"];
                var props = dv.dataView.Table.get_ExtProps(colName);
                
                if (!props["Like"] && props["LikeTable"] && props["LikeField"])
                {
                   props["Like"]= props["LikeTable"] + "." + props["LikeField"];
                }
                
                if (props["Like"].length > 0)
                {
                    this.EpiContextMenuKey = props["Like"];
                    this.validECMK = true; // indicates that we already extracted the 'Like' from the extendedprops
                }
            }
            catch(ex){}
        }
    }
    
    return this.EpiContextMenuKey;
     
    
}

EpiControl.prototype._setSingleStyle = function(ctrl, style, value)
{
    switch (style)
    {
        case "Bold": ctrl.style.fontWeight = "bold"; break;
        case "Error": ctrl.style.backgroundColor = "#FFB6B4"; break;
        case "Highlight": ctrl.style.backgroundColor = "#DFE1FF"; break;
        case "OK": ctrl.style.backgroundColor = "#BBF5BB"; break;
        case "Warning": ctrl.style.backgroundColor = "#FEFF8D"; break;
        case SettingStyle.BackColor: ctrl.style.backgroundColor = value; break;
    }
}
EpiControl.prototype._setStyle = function(ctrl, style)
{
    if (Global.IsArray(style) || Global.IsObject(style))
    {
        for (styleItem in style)
            this._setSingleStyle(ctrl, styleItem, style[styleItem]);
    }
    else
        this._setSingleStyle(ctrl, style);
}
EpiControl.prototype.GetRowNum=function(ctrl)
{
    var rowIdx = -1;
    if(this.InGrid)
    {
        var rowCtrl = Global.GetParentByTag(ctrl, "TR", true)
        if(rowCtrl) rowIdx = rowCtrl.getAttribute("_idx");
    }
    
    return rowIdx;
}
EpiControl.prototype._selectstart=function(e)
{
    // IE only
    var ctrl = e.target||e.srcElement;

    if(ctrl.tagName=="TD"||ctrl.tagName=="LABEL"||ctrl.tagName=="DIV"||ctrl.tagName=="H2")
    {
        return false;
    }
}
EpiControl.prototype._change=function(e)
{
    if (this.hasEpiZone && EpiZone.popupMgr && EpiZone.popupMgr.get_HasActiveZonePopup())
        return;
    var ctrl = e.target||e.srcElement;
    this.OnChange(ctrl);
}
EpiControl.prototype.GetHtmlForGrid=function(val){return "";}
EpiControl.prototype.GetValFromRow=function(dt,row,dc)
{
    var val = row[dc];
    if (val == undefined)
    {
        var col = dt._resolveColumnName(dc);
        val = row[col];
    }
    return val;
}

EpiControl.prototype.FocusInGrid=function(ctrl){this._focusin(ctrl);}
EpiControl.prototype._focusOutGrid=function(ctrl){}

EpiControl.prototype.OnResize = function(width, height)
{
    return this.get_Event("Resize").fire({Width:width,Height:height}); 
}
EpiControl.prototype._focusTab=function(ctrl)
{
    var oCurrentNode = ctrl.parentNode;
	    
	var oCurrentObj;
	if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];		    
	
	var pnlKey = null;
    while(oCurrentNode && !(oCurrentObj instanceof EpiTabGroup))
    {
        if(oCurrentObj instanceof EpiPanel) pnlKey = oCurrentObj.ID;
    
	    oCurrentNode = oCurrentNode.parentNode;
	    if(oCurrentNode) oCurrentObj = Global.BindingEngine.Controls[oCurrentNode.id];
    }

    if(oCurrentObj instanceof EpiTabGroup && pnlKey && oCurrentObj.Pages[pnlKey])
    {
        if(!Global.BindingEngine.Tabs[pnlKey] || !Global.BindingEngine.Tabs[pnlKey].Visible)
        {
            this._focusTab(oCurrentNode);
            oCurrentObj.Pages[pnlKey].Activate();
        }
    }
}
EpiControl.prototype.Focus = function(ctrl)
{
    try
    {
        if(!ctrl) ctrl = Global.document.getElementById(this.ID);
        this._focusTab(ctrl);
    
        if(ctrl.className!="TabGroup") ctrl.focus();

	    if (ctrl.className!="TabGroup" && ctrl.className!="EpiGrid" &&
		    Global.IsFunction(ctrl.select)) 
            ctrl.select();
    }
    catch(err){}
}
EpiControl.prototype.SelectAll = function()
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl) this.Focus(ctrl);
}
EpiControl.prototype.Select=function()
{
    this.SelectAll();
}
EpiControl.prototype.FindForm=function(ctrl)
{
    // we know the first element is the form element, so we 
    // will be exiting the loop on the first iteration itself.
    for (ctrlObj in Global.BindingEngine.Controls) 
    {
        var ctrlStruct = Global.BindingEngine.Controls[ctrlObj];
        if (ctrlStruct.TypeName=="EpiBaseForm")
            return ctrlStruct;
    }
}
EpiControl.prototype.set_EpiBinding=function(value)
{
    var parts = value.split(".");
    if(parts.length>0) this.DataView = parts[0];
    if(parts.length>1) this.DataColumn = parts[1];
}
EpiControl.prototype.get_EpiBinding=function()
{
    var str = "";
    if(this.DataView)
    {
        str = this.DataView;
        if(this.DataColumn) str = str + "." + this.DataColumn;
    }
    return str;
}
EpiControl.prototype.get_Height=function()
{   
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        if (ctrl.offsetHeight > 0)
            this.Height = ctrl.offsetHeight;
    }

    if (!this.Height) 
        return 0;
    else 
        return this.Height;
}
EpiControl.prototype.set_Height=function(height)
{
    if(!height) return;
    
    var width = this.Width;
    if(!width || width<=0)
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl)
        {
            width = ctrl.offsetWidth;
        }
    }
    
    this.set_Size({"Height":height,"Width":width});
}
EpiControl.prototype.get_Width=function()
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        if (ctrl.offsetWidth > 0)
            this.Width = ctrl.offsetWidth;
    }

    if (!this.Width) return 0;
    else return this.Width;
}
EpiControl.prototype.set_Width=function(width)
{
    if(!width) return;

    var height = this.Height;
    if(!height || height<=0)
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl)
        {
            height = ctrl.offsetHeight;
        }
    }

    this.set_Size({"Height":height,"Width":width});
}
EpiControl.prototype.set_Size=function(size)
{
    if (!size) size = {"Height":0,"Width":0};
    this.Height = size.Height;
    this.Width = size.Width;
    
    if(size.Height>0 && size.Width>0)
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl)
        {
            ctrl.style.height = size.Height + "px";
            ctrl.style.width = size.Width + "px";
        }
    }
}
EpiControl.prototype.get_Size=function()
{
    return {"Height":this.get_Height(),"Width":this.get_Width()};
}
EpiControl.prototype.set_AllowDrop=function(value) {this.AllowDrop = value;}
EpiControl.prototype.get_AllowDrop=function(){return this.AllowDrop;}
EpiControl.prototype.manageQueue=function(type,val)
{
    if(this.IsOnHold() == true)
    {
        this.Queue.push({"Type":type,"Value":val});
    }
}
EpiControl.prototype.IsOnHold=function()
{
    var flg = false;
    
    if(this.DataView)
    {
        var dv = this.DataView;
        var dView = Global.BindingEngine.EpiDataViews[dv];
        if(dView && dView.dataView.Rows.length > 0)  // Check if we have data loaded 
        {
            if(!Global.BindingEngine.BoundControls[this.ID])
                flg = true;
        }
    }
    return flg;
}
EpiControl.prototype.FindControl=function(id)
{
    if(this.ControlMap && this.ControlMap[id])
        return Global.BindingEngine.Controls[this.ControlMap[id]];
    else
        return Global.BindingEngine.Controls[id];
}
EpiControl.prototype.SetDialogProp=function(prop, val)
{
    this.DialogProps[prop] = val;
}
EpiControl.prototype.ShowContextMenu=function(ctrl, clientX, clientY)
{
    return EpiContextToolsManager.BuildContextMenu(this,ctrl, clientX, clientY);
}
EpiControl.prototype.Refresh=function(){}
EpiControl.prototype.BeginInvoke=function(del, args)
{
    // del can also be an EpiEvent, in which case use the fire method to trigger it.
    if (del._type == "EpiEvent")
        del.fire(args);
    else
        del.apply(this,[args]);
}
EpiControl.prototype.Invoke=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    var method, args;
    switch(overload)
    {
        case "Delegate":
			return a[0].apply(this);
            break;
        case "Delegate_ObjectArr":
			return a[0].apply(this,[a[1]]);
            break;
    }
}
EpiControl.prototype.DoDragDrop=function(data, allowedEffects)
{
    DragDrop.Start(this, data);
}
EpiControl.prototype.set_Appearance=function()
{
}
EpiControl.prototype.GetRelatedVisibleColumn=function(relation)
{
    // This method is for the controls in the grid returned via code like: grd.get_DisplayLayout().get_Band(0).get_Column(0);
    if (this.InGrid && this.OwnerGrid)
    {
        return Global.BindingEngine.Controls[this.OwnerGrid]._findRelatedVisibleColumn(this, relation);
    }
    else
        return null;
}
EpiControl.prototype.get_Format=function()
{
    if (this.DataView && this.DataColumn)
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        return dv.dataView.Table.GetExtendedProperty(this.DataColumn,"Format");
    }
    return "";
}
EpiControl.prototype.get_DataType=function()
{
    if (this.DataView && this.DataColumn)
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        return dv.dataView.Table.Columns[this.DataColumn].DataType;
    }
    return "";
}
EpiControl.prototype.get_ControlByName=function(idx)
{
    var controls = this.get_Controls();

    if(controls.items[idx]!=null)
        return controls.items[idx];
    else 
    {
        for(var c in controls.items)
        {
            if(controls.items[c].Name==idx)
                return controls.items[c];
        }
    }
    return null;
}
EpiControl.prototype.set_EditorControl=function(obj)
{
    if(this.InGrid && Global.InstanceOf(obj, "EpiGLControl") )
    {
        Global.BindingEngine.Controls[this.ID] = new EpiGLControlGrid(this, obj);
    }
}
EpiControl.prototype.set_EditorComponent=function(obj)
{
    this.set_EditorControl(obj);
}

//------------------------------------
// EpiForm
//------------------------------------
var EpiForm = Epicor.Mfg.UI.FrameWork.EpiForm = function(settings, type)
{
    if (settings.SkipProcessing == true) return;
    EpiControl.call(this,settings);

    if(type) this.TypeName = type;
    
    this._loadparams = {};
    this.DialogResult = "None";
    this.IsDialog = false;
    this.ReturnObject = null;
    this.ToolbarInMeta = false;
    this._activeObj=null;
    this._activeCtrl=null;
    this._activePath={};
    this._panes={};
    this.MainTreeViewPanel=null;
    this._isClosed=false;
    
    this.MyEpiGrids = new Hashtable();
	if(BrowserSniffer.Safari13 && navigator.vendor == 'Google Inc.')
	{
		// unload event is not firing in Chrome, use the beforeunload instead
		EpiEventManager.addListener(Global.window, "beforeunload", this._unload, this, true);
	}
	else
	{
		EpiEventManager.addListener(Global.window, "unload", this._unload, this, true);
	}
    
    if (Global.document.all) 
        EpiEventManager.addListener(Global.window, "load", this.OnLoadForm, this, true);
    else
        EpiEventManager.addListener(Global.document, "DOMContentLoaded", this.OnLoadForm, this, true);
        
    this.FormCache = new Hashtable();
} 
EpiForm.prototype = new EpiControl();
EpiForm.prototype.TypeName = "EpiForm";
EpiForm.prototype.LaunchFormOpts = null;
EpiForm.prototype._handleCtr=0;
EpiForm.prototype.Owner = null;
EpiForm.prototype.set_Enabled=function(){}  // TODO
EpiForm.prototype.CacheSettings=function(){}
EpiForm.prototype.get_Cursor=function(){return {"Current":Cursors.Arrow}}
EpiForm.prototype.OnLoad = function()
{
    if (this instanceof EpiHostForm) return;
    
    var panesToActivate = [];
    var firstPane = null;
    for (var paneName in this._panes)
    {
        var pane = this._panes[paneName];
        if (!firstPane && pane.IsVisible)
            firstPane = pane;
        if (pane.IsActive)
            panesToActivate.push(pane);
    }

    //  Activate last 'Active' panels
    if (panesToActivate.length > 0)
        panesToActivate[0].Activate();
    else if (firstPane)
        firstPane.Activate();
}
EpiForm.prototype.set_ReturnObject=function(val)
{
    this.ReturnObject=val;
}
EpiForm.prototype.set_DialogResult=function(val, doNotClose)
{
    this.DialogResult=val;
    if (!doNotClose)
        this.Close();
}
EpiForm.prototype.get_Modal=function(){return this.IsDialog;}
EpiForm.prototype.get_DialogResult=function(){return this.DialogResult;}
EpiForm.prototype.set_AcceptButton=function(){} // TODO: sets the button on the form that is clicked when the user presses the ENTER key. 
EpiForm.prototype.get_AcceptButton=function(){} // TODO: gets the button on the form that is clicked when the user presses the ENTER key. 
EpiForm.prototype.RegisterAdapter=function(){}
EpiForm.prototype.bindToolbarCtrls=function(){}
EpiForm.prototype.ShowDialog=function(){}
EpiForm.prototype.Show=function(){}
EpiForm.prototype.Hide=function(){}
EpiForm.prototype.OnClosing=function(){}
EpiForm.prototype.OnClosed=function(){}
EpiForm.prototype.set_Icon=function(){}
EpiForm.prototype.Dispose=function() {}
EpiForm.prototype.get_Icon=function(){}
EpiForm.prototype.set_Icon=function(val){}
EpiForm.prototype.set_ShowInTaskbar=function(){}
EpiForm.prototype._setActiveControl=function(ctrl)
{
    if(this._activeCtrl==ctrl) return;
    this._activeCtrl=ctrl;
    this._activeObj = null;
    
    var enterItems = [];
    var newPath = {};
    var controls = Global.BindingEngine.Controls;
    while(ctrl && ctrl.id!="div_TopLevelPanel" && ctrl.tagName!="BODY")
    {
        var id=ctrl.id;
        var o = controls[id];
        if(o) 
        {
            if(!this._activeObj)
            {
                this._activeObj = o;
                this._focusTrans(ctrl);
            }
        
            newPath[id] = {"Ctrl":ctrl,"Obj":o};
            if(!this._activePath[id] || this._activePath[id].Ctrl!=ctrl)
            {
                enterItems.push(o);
            }
        }
        ctrl=ctrl.parentNode;
    }
    
    var leaveList = [];
    for(var itm in this._activePath)
    {
        var theItem = this._activePath[itm];
        if(!newPath[itm] || newPath[itm].Ctrl!=theItem.Ctrl)
        {
            theItem.Obj.get_Event("Leave").fire(this);
            theItem.Obj.get_Event("LostFocus").fire(this);
        }
    }
    
    for(var ii=enterItems.length-1;ii>=0;ii--)
    {
        enterItems[ii].get_Event("Enter").fire(enterItems[ii]);
        enterItems[ii].get_Event("GotFocus").fire(enterItems[ii]);
    }   
       
    this._activePath = newPath;
}
EpiForm.prototype.Dispose=function()
{
    if((this.Name=="MesActivityForm"||this.Name=="BWForm") && !this.IsDisposing) 
    {
        this.IsDisposing = true;
        this.Close();
    }
}
EpiForm.prototype._focusTrans=function(){}
EpiForm.prototype.get_WindowState=function() 
{
    var win = Global.window;
    if (win.screenLeft<0 && win.screenTop<0)
        return  FormWindowState.Minimized;
    else if (win.screenRight==win.screen.availWidth && win.screenTop==window.screen.availHeight)
        return FormWindowState.Maximized;
    else
        return FormWindowState.Normal;
}
EpiForm.prototype.set_WindowState=function(state) {}
EpiForm.prototype.Activate=function() {this.Focus();}
EpiForm.prototype.Focus=function() {Global.window.focus();}
EpiForm.prototype.set_CancelButton=function(btn)
{
    btn.DialogResult = DialogResult.Cancel;
}
EpiForm.prototype.GetControl=function(id)
{
    return Global.BindingEngine.Controls[id];
}
EpiForm.prototype.setupAddNewOptions=function(){}
EpiForm.prototype.getMenuItemDS=function(){}

EpiForm.prototype.OnLoadForm=function() 
{
    this.WhoAmI = Assembly.GetCallingAssembly().GetName().Name;  

    EpiEventManager.addListener(Global.document.body, "click", this._click, this, true);
    EpiEventManager.addListener(Global.document.body, "contextmenu", this._contextMenu, this, true);
    EpiEventManager.addListener(Global.document.body, "keydown", this._keydown, this, true);
    EpiEventManager.addListener(Global.document.body, "keyup", this._keyup, this, true);
    EpiEventManager.addListener(Global.document.body, "selectstart", this._selectstart, this, true);
    EpiEventManager.addListener(Global.window, "resize", this.ResizeForm, this, true);
    this.ResizeForm();
       
    this._loadparams = LaunchEngine.GetParams();
    this.getMenuItemDS(); // Gets the menudata row from the default.aspx if this form was opened from the main menu
         
    this.get_Event("BeforeLoad").fire();  
    this.RunCtor();
    
    if (this.ID == "MaterialQueueEntryForm")
        if(!this.trans.EmployeeSelected())
            this.Close();
            
    this.setupAddNewOptions(); 
    
    try
    {
    this.OnLoad();
    }
    catch(e)
    {
        DebugHelper.WriteError("Error caught in EpiForm.OnLoadForm, call to OnLoad: ", e);
    }
    
    if(this.TypeName=="EpiForm") 
        this.get_Event("Load").fire();  
        
    this.get_Event("Shown").fire();
}
EpiForm.prototype.get_WhoAmI=function()
{
    return this.WhoAmI;
}
EpiForm.prototype.set_Size=function(size)
{
    this.Width = size.Width;
    this.Height = size.Height;
    BrowserHelper.SetFormSize(size);
}
EpiForm.prototype.set_ClientSize=function(size)
{
    this.set_Size(size);
}
EpiForm.prototype.get_ClientSize=function()
{
    return this.get_Size();
}
EpiForm.prototype._click=function(e)
{
    var ctrl = e.target||e.srcElement;

    if(ctrl && ctrl.id)
    {
        var ctrlObj = Global.BindingEngine.Controls[ctrl.id];
        if(ctrlObj) 
        {
            if (ctrlObj.GetEnabled(ctrl) == true)
            {
                if(ctrlObj instanceof EpiButton)
                {
                    var fn=function(ctrlObj,e){return ctrlObj.get_Event("Click").fire(ctrlObj, e)};
                    Global.BindingEngine.RunInThread(this,fn,[ctrlObj,e]);
                }
                else
                {
                    ctrlObj.get_Event("Click").fire(ctrlObj, e);
                }
            }
        }
    }
}
EpiForm.prototype._contextMenu=function(e)
{
    var i =0;
    var ctrl = e.target||e.srcElement;
  
    if (ctrl)
    {
        // Find the object from the global controls
        var ctrlObj;
        
        while (!ctrlObj)
        {
            if (!ctrl)
                break;
                
            if(ctrl.id) ctrlObj = Global.BindingEngine.Controls[ctrl.id];
            if (ctrl.id && !ctrlObj && ctrl.ig_mark)
                ctrlObj = Global.BindingEngine.Controls[ctrl.ig_mark];

            if (!ctrlObj || ctrlObj.hasContextMenu == false) 
            {
                ctrl = ctrl.parentNode;
                ctrlObj = null;
            }
        }
       
        if (ctrlObj) 
        {
            var tempX;
            var tempY;
            if (document.all) 
            { // grab the x-y pos.s if browser is IE 
                tempX = e.clientX + Global.document.documentElement.scrollLeft; 
                tempY = e.clientY + Global.document.documentElement.scrollTop; 
            } 
            else 
            {  // grab the x-y pos.s if browser is NS 
                tempX = e.pageX; 
                tempY = e.pageY; 
            }   
        
            if (ctrlObj.ContextMenu)
                ctrlObj.ContextMenu.Show(ctrl, new Point(tempX, tempY, new EpiOverloadedArgs("Int32_Int32")));
            else
                ctrlObj.ShowContextMenu(ctrl,tempX,tempY);
        }
    }
    EpiEventManager.stopEvent(e);
    return false;
}
EpiForm.prototype._keydown=function(e)
{
    if(e.keyCode == KeyCodes.Tab && Global.KeyboardManager.ShiftKey && this._activeObj)
    {
        var obj = this._activeObj;
        if(obj.InGrid && obj.OwnerGrid)
        {
            var grd = Global.BindingEngine.Controls[obj.OwnerGrid];
            if(grd && grd.MoveToPreviousCol(obj,this._activeCtrl)) 
            {
                EpiEventManager.stopEvent(e);
                return false;
            }
        }
    }

    if(e.keyCode==16) Global.KeyboardManager.ShiftKey = true;
    if(e.keyCode==17) Global.KeyboardManager.CtrlKey = true;
    
    if(e.keyCode==8&&this._activeCtrl&&this._activeObj&&!this._activeObj.GetEnabled(this._activeCtrl))
        EpiEventManager.stopEvent(e);

    if (BrowserSniffer.Safari13 && this.IsDialog)
    {
        var key;
        if (e.keyCode) key = e.keyCode;
        else if (e.which) key = e.which;

        if (/[A-Za-z0-9 ]/.test(String.fromCharCode(key)))
        {
            EpiEventManager.stopEvent(e);
            return false;
        }
        return true;
    }
}
EpiForm.prototype._keyup=function(e)
{
    if(e.keyCode==16) Global.KeyboardManager.ShiftKey = false;
    if(e.keyCode==17) Global.KeyboardManager.CtrlKey = false;
}
EpiForm.prototype._unload=function(e)
{
    //Global.Form.OnClosed(this,{});
    this.OnClosed(this,{});

    var iEnum = this.MyEpiGrids.GetEnumerator();
    while (iEnum.MoveNext())
    {
        //  Unsubscribe events not to get "Can't execute code from a freed script" error when form is closed but DataView is still in use.
        iEnum.Value.Dispose();
    }

    // If this form was launched, inform the parent form that its closing.
    if(window.opener && !window.opener.closed && this.LaunchFormOpts && this.LaunchFormOpts.processCaller)
    {
        this.LaunchFormOpts.processCaller.calledForm_Closed(this);
    }
    // The BAQDataView might have created some timers for some appbuilt project. Make sure they get stopped
    BAQDataView.ClearTimers(true);
    BAQDataView.ClearCaches();
    
    if(this.IsDialog)
    {
        if(this.DialogResult==DialogResult.None) this.DialogResult = DialogResult.Cancel;

        var args;
        var o;

        if(BrowserSniffer.IE||BrowserSniffer.FireFox15)
        {
            args = Global.window.dialogArguments;
            args.DialogPropVals = this.GetDialogProperties(args);
            args.DialogControlVals = this.GetDialogControls(args);
            if (args.Opener.DialogHelper)
                args.Opener.DialogHelper.Deregister();
            args.DialogResult = this.DialogResult;
            args.DialogObject = Global;
            args.ReturnObject = this.ReturnObject;
        }
        else
        {
            if (Global.window.opener.DialogHelper)
                Global.window.opener.DialogHelper.Deregister();
            Global.window.opener.Global.DialogArguments.DialogPropVals = this.GetDialogProperties(Global.window.opener.Global.DialogArguments);
            Global.window.opener.Global.DialogArguments.DialogControlVals = this.GetDialogControls(Global.window.opener.Global.DialogArguments);
            Global.window.opener.Global.DialogArguments.DialogResult = this.DialogResult;
            Global.window.opener.Global.DialogArguments.DialogObject = Global;
            Global.window.opener.Global.DialogArguments.ReturnObject = this.ReturnObject;
        }
    }

    for (ctrlId in Global.BindingEngine.Controls)
    {
        var ctrl = Global.BindingEngine.Controls[ctrlId];
        if (Global.IsFunction(ctrl.Dispose))
            ctrl.Dispose();
        else if (Global.IsFunction(ctrl.ClearAllEventListeners))
            ctrl.ClearAllEventListeners();

        Global.BindingEngine.Controls[ctrlId] = null;
    }

    //  If current form is owner of it's transaction => clear transaction and nested DataViews
    if (this.trans && this.trans.get_EpiBaseForm() == this)
    {
        for (memberName in this.trans)
        {
            var member = this.trans[memberName];
            if (!Global.IsObject(member))
                continue;

            if (Global.InstanceOf(member, "EpiDataView") && (!member._win || !member._win.closed))
            {
                member.Dispose();
                this.trans[memberName] = null;
            }
            
            if (member._win)
                member._win = null;
        }
        this.trans = null;
    }
    
    this.ClearAllEventListeners();
    Global.Purge(Global.document.body);
}
EpiForm.prototype.GetDialogControls=function(controlArgs)
{
    var dialogControls = {};
    if(controlArgs.DialogControls)
    {
        for(var c in controlArgs.DialogControls)
        {
            try
            {
                dialogControls[controlArgs.DialogControls[c]]={"DialogControls":{}};
            
                if(Global.BindingEngine.Controls[controlArgs.DialogControls[c]])
                {
                    var dc=dialogControls[controlArgs.DialogControls[c]].DialogControls;
                    var ctrl = Global.BindingEngine.Controls[controlArgs.DialogControls[c]];
                    
                    dc["Visible"]=ctrl.get_Visible();
                    dc["Enabled"]=ctrl.get_Enabled();
                    dc["ReadOnly"]=!dc["Enabled"];
                    dc["Value"]=ctrl.get_Value();
                    dc["Text"]=ctrl.get_Text();
                    dc["Checked"]=false;
                    
                    if(ctrl instanceof EpiCheckBox) dc["Checked"]=ctrl.get_CheckedValue();
                }
            }
            catch(err)
            {
                dialogControls[controlArgs.DialogControls[c]]={"DialogControls":{}};
            }
        }
    }
    return dialogControls;
}
EpiForm.prototype.GetDialogProperties=function(dialogArgs)
{
    var dialogPropVals = {};
    if(dialogArgs.DialogProps)
    {
        for(var prop in dialogArgs.DialogProps)
        {
            try
            {
                var val=this["get_" + dialogArgs.DialogProps[prop]]();
                if(Global.IsDate(val)) 
                {
                    try
                    {
                        var op=BrowserHelper.GetOpener();
                        val=op.FormatEngine.ToDate(val.GetServerString(),"global");
                    } catch(err){}
                }
                dialogPropVals[dialogArgs.DialogProps[prop]]=val;
            }
            catch(err)
            {
                dialogPropVals[dialogArgs.DialogProps[prop]]="";
            }
        }
    }
    return dialogPropVals;

}
EpiForm.prototype.set_Text=function(txt)
{
    Global.window.Global.document.title = txt;
}
EpiForm.prototype.get_Text=function()
{
    return Global.window.Global.document.title;
}
EpiForm.prototype.RunCtor=function()
{
    if(!this.RunCtorWithArgs())
        this.ctor();

    this.ProcessQueue();
}
EpiForm.prototype.RunCtorWithArgs=function()
{
    var retVal = false;

    var params = this._loadparams;
    if(this._loadparams && this._loadparams.LaunchObj)
    {
        var argArr = [];
        var argList = [];
        
        if(params.LaunchObj.LaunchFormOpts) 
        {
            this.LaunchFormOpts = params.LaunchObj.LaunchFormOpts;
        }
        
        for(var arg in params.LaunchObj.Args)
        {
            var theArg = params.LaunchObj.Args[arg];
            if(theArg==null)
                argList.push("null");
            else
            {            
                if(theArg.IsTransaction) 
                {
                    var comma="";
                    argStr="";
                    if(theArg.Args)
                    {
                        for(var ii=0;ii<=theArg.Args.length-1;ii++)
                        {
                            argStr+=comma+"theArg.Args["+ii+"]";
                            comma=",";
                        }
                    }
                
                    theArg = eval("new " + theArg.Name + "(" + argStr + ")");
                    this.trans = theArg;
                    
                    if (this.ID=="SelectSerialNumbersEntryForm")
                        this.trans.loadFromSerialNumberArgs(this.LaunchFormOpts) //This is run from within the Launch.InitializeLaunch.

                }
                else if(theArg.isTrans)
                {
                    if (Global.Form.trans != theArg)
                        theArg.SyncGlobal(Global);
                    else    
                        theArg.SyncGlobal();
                        
                    theArg._synced=true;
                }
                
                argArr.push(theArg);
                argList.push("argArr[" + (argArr.length-1).toString() + "]");
            }
        }
        
        var argStr = argList.join(",");
        eval("this.ctor(" + argStr + ");");
        
        retVal = true;
    }
   
    return retVal;
}
EpiForm.prototype.ProcessQueue=function()
{
    var dlgQ = null;
    if(this._loadparams && this._loadparams.DialogQueue)
        dlgQ = this._loadparams.DialogQueue;
    else if (this._loadparams && this._loadparams.LaunchObj && this._loadparams.LaunchObj.DialogQueue) // For modeless dialogs
        dlgQ = this._loadparams.LaunchObj.DialogQueue; // This is how the launchEngineForm is available for modeless forms
        
    if (dlgQ)
    {
        // Performed any queue items for this dialog
        for(var itm in dlgQ)
        {
            var q = dlgQ[itm];
            if(q.QueueType==QueueType.ControlProperty)
            {
                Global.BindingEngine.Controls[q.ID]["Set" + Enum.ToString(q.Property,PropertyType)](Global.document.getElementById(q.ID), q.Value);
            }
            else if(q.QueueType==QueueType.Variable)
            {
                this[q.Name] = q.Value;
            }
            else if(q.QueueType==QueueType.Function)
            {
                Global.CallWithArgs(this, q.Name, q.Args);
            }
        }
    }
}
EpiForm.prototype.CallFunctionOnControl=function()
{
    var ctrlID = arguments[0];
    var methodName = arguments[1];
    var methodArgs = [];
    for (i=2;i<arguments.length;i++)
    {
        methodArgs.push(arguments[i]);
    }
    var ctrl = Global.BindingEngine.Controls[ctrlID];
    if (ctrl) ctrl[methodName](methodArgs);
        
}
EpiForm.prototype.EpiGuids=function()
{
    if (this._epiGuids == null)
    {
        try{
            var theScript = Global.GetScript("script/" + this._assembly + "/" + this.Name + "_EpiGuids.js"); 
            if(theScript!=null)
            {
                eval(theScript);
                this._epiGuids = FormEpiGuids;
            }
        }
        catch(err){ this._epiGuids ={}; }
    }
    return this._epiGuids;
}
EpiForm.prototype.GetEpiGuid=function(id)
{
    var o = this.EpiGuids();
    return (o)?o[id]:"";
}
EpiForm.prototype.GetControlIDByGuid=function(guid)
{
    //return control ID by EpiGuid
    if (!this._ControlsByGuid)
    {
        this._ControlsByGuid = new Hashtable();
        var o = this.EpiGuids();
        for(var id in o) this._ControlsByGuid.Add(o[id],id);
    }
    return (this._ControlsByGuid)?this._ControlsByGuid[guid]:"";
}
EpiForm.prototype.Close=function()
{
    if(FormTestManager) return FormTestManager.CloseForm();

    if(LaunchEngine.GetFormCount()>0)
        LaunchEngine.DoneLaunching.subscribe(this.Close,this,true);  
    else    
    {
        try
        {
            if(Global.Form._isClosed) return;

            var eventArgs = {"Cancel":false};
            Global.Form.OnClosing(eventArgs);
            if (eventArgs.Cancel == true) 
                    return;
            else 
                Global.Form.userClosedForm = true;
            if (this.IsDialog && Global.BindingEngine.CurrentThread)
            {
                Global.BindingEngine.CurrentThread.CloseWindow = true;
            }
            else
            {      
                if(Global.window.parent && Global.window.parent.IsWebMenu)
                    Global.window.parent.closeCurrentTab();
                else
                    Global.window.close();

                Global.Form._isClosed = true;
            }
        }
        catch(err)
        {
            Global.window.close();
        }
    }
}
EpiForm.prototype.ResizeForm=function(e)
{
    var dh = (Global.window.innerHeight)?Global.window.innerHeight:Global.document.documentElement.clientHeight;
    var dw = (Global.window.innerWidth)?Global.window.innerWidth:Global.document.documentElement.clientWidth;
    if (e && this.prevDh && dh == this.prevDh && this.prevDw && this.prevDw == dw)
    {
        EpiEventManager.stopEvent(e);
        return;
    }
    var topPanel = Global.document.getElementById("div_TopLevelPanel");
    if(topPanel)
    {   
        this.resizeChildren(topPanel,dh-topPanel.offsetTop,dw);
    }
    this.prevDh = dh;
    this.prevDw = dw;
}

//------------------------------------
// EpiBaseForm
//------------------------------------
var EpiBaseForm = Epicor.Mfg.UI.FrameWork.EpiBaseForm = function (settings, type)
{
    if (settings.SkipProcessing == true) return;
    if (!type) type = "EpiBaseForm";
    EpiForm.call(this,settings, type);
    
    // Custom for Win 2 Web 
    this.trans;
    this.baseDockManager = new EpiDockManagerPanel();
    this.keyControl;        // This is actually in the EpiTransaction, but when the controls are created Transaction doesnt exist yet.
    this.HasGL = settings.HasGL || false;
    
    // From Framework
    this.utils = new EpiUIUtils(this);
        
    if (settings)
    {
        this.navHandleID = settings.NavH;
        if (settings.AutoData) this.AutoData = settings.AutoData;
        if (settings.AutoSrch) this.AutoSrch = settings.AutoSrch;
        if (settings.AutoLdNamedSrch) this.AutoLdNamedSrch = settings.AutoLdNamedSrch;
        if (settings.RptName) this.ReportName = settings.RptName;
    }
    
    this.newTool = "NewTool";
	this.newMenu = "NewMenuTool";
	this.fileMenu = "FileMenu";

    this.myTool;
    this._currencyChecked = false;
    this._currencyCaption = EpiString.getString("BaseCurrency");
    this.CurrencyCheckedState = false;
    this.CurrentCurrencyCode = "";
    this.MyCurrencyConvers = new Hashtable();
    
    this.SuppressInitialSearch=false;
    
    this.hiddenTools=new ArrayList();
    this.hiddenTools.AddRange(["CutTool","CopyTool","PasteTool","ResetLayoutsToLastSavedTool","ResetLayoutsToBaseTool","SaveLayoutsTool","LaunchXmlHelpTool","PersonalizeTool","CustomizeTool","SaveCustomTool","TransUIUtilTool","RefreshTranslationTool","OptionsTool","SendMenu", "PrintTool", "PrintPreviewTool", "MemoTool", "CallLogTool", "AuditLogTool", "ChangeLogTool","AboutTool"]);
    this._enabledTools=new ArrayList();
    this.Session = new Session();

    this.IsEpiReadOnly = false;
    this.AutoToggleDeleteButton = true;
    this.AllowSendTools = true;
    this.showBaseCurrencyForDocCurrency=false;

    this.FormLoaded = false;
    this.EpiReadOnlyAllowAddNew = false;
    
    this.ExtensionName = null;
    this.AddTaxConnectStatusBarPanel = false;
    this.FormOptions = new EpiFormOptions();
    
    this.allowAutoPopulate=true;
    this.allowAutoSearch=true;

    this.AttachmentMaps={};
    this.ManuallyDisableAttachmentTool = false;
} 
EpiBaseForm.prototype = new EpiForm({"SkipProcessing":true});
EpiBaseForm.prototype.LaunchFormOpts= null; // new LaunchFormOptions();//{"ContextValue":null};
EpiBaseForm.prototype.get_LaunchFormOptions=function(){return this.LaunchFormOpts;} // new LaunchFormOptions();//{"ContextValue":null};
EpiBaseForm.prototype.navControl= {"get_EpiCombo":function(){return {"SetColumnFilter":function(){}}}}; // Fix for UI.PcConDataEntry.PcConDataForm.aspx (Configuration Control Data) form. navcontrol in the toolbar is not added to the Form.Controls collection.
EpiBaseForm.prototype.get_Session=function() {return this.Session;}
EpiBaseForm.prototype.get_FormOptions=function() {return this.FormOptions;}
EpiBaseForm.prototype.get_EpiReadOnlyAllowAddNew=function() {return this.EpiReadOnlyAllowAddNew;}
EpiBaseForm.prototype.set_EpiReadOnlyAllowAddNew=function(val) {this.EpiReadOnlyAllowAddNew = val;}
EpiBaseForm.prototype.get_ExtensionName=function() {return this.ExtensionName;}
EpiBaseForm.prototype.set_ExtensionName=function(val) {this.ExtensionName = val;}
EpiBaseForm.prototype.get_ReportName=function() {return this.ReportName;}
EpiBaseForm.prototype.set_ReportName=function(val) {this.ReportName = val;}
EpiBaseForm.prototype.get_AllowAutoPopulate=function() {return this.allowAutoPopulate;}
EpiBaseForm.prototype.set_AllowAutoPopulate=function(val) {this.allowAutoPopulate = val;}
EpiBaseForm.prototype.get_AllowAutoSearch=function() {return this.allowAutoSearch;}
EpiBaseForm.prototype.set_AllowAutoSearch=function(val) {this.allowAutoSearch = val;}
EpiBaseForm.prototype.get_AddTaxConnectStatusBarPanel=function() {return this.AddTaxConnectStatusBarPanel;}
EpiBaseForm.prototype.set_AddTaxConnectStatusBarPanel=function(val) {this.AddTaxConnectStatusBarPanel = val;}
EpiBaseForm.prototype.set_AutoSubscribe=function(val) {this.manualSubscribe = !val;}
EpiBaseForm.prototype.get_CurrencyCheckedState=function() {return this.CurrencyCheckedState;}
EpiBaseForm.prototype.set_AutoConfigureStatusBar=function(val) {this.AutoConfigureStatusBar=val;}
EpiBaseForm.prototype.set_NavHandle=function() {}
EpiBaseForm.prototype.get_IsClosing=function() {return false;}
EpiBaseForm.prototype.set_SuppressAllContextMenus=function() {}
EpiBaseForm.prototype.get_IsTracker=function(){return this.IsTracker;}
EpiBaseForm.prototype.get_IsVerificationMode=function(){return this.IsVerificationMode;}
EpiBaseForm.prototype.get_MenuItemDS=function() {return this.MenuItemDS;}
EpiBaseForm.prototype.OnFormLoad=function() {}
EpiBaseForm.prototype.OnClickUndo=function(){}
EpiBaseForm.prototype.OnClickTaxConnect=function(){}
EpiBaseForm.prototype.OnBeforeToolClick=function(){return false;}
EpiBaseForm.prototype.GetKeyedGenericProperty=function() {return "";}
EpiBaseForm.prototype.SetKeyedGenericProperty=function(){}
EpiBaseForm.prototype.RegisterHotKey=function(){}
EpiBaseForm.prototype.LaunchForm=function(){}
EpiBaseForm.prototype.set_ShowBaseCurrencyForDocCurrency=function(val){this.showBaseCurrencyForDocCurrency=val;}
EpiBaseForm.prototype.get_ShowBaseCurrencyForDocCurrency=function(){return this.showBaseCurrencyForDocCurrency;}
EpiBaseForm.prototype.set_HelpLinkAlternateName=function(val){this.HelpLinkAlternateName = val;}
EpiBaseForm.prototype.get_IsEpiReadOnly=function() {return this.IsEpiReadOnly;}
EpiBaseForm.prototype.get_GenericPersonalizationProperty=function()
{
    return val=getCookie("GenericPersonalization");
}
EpiBaseForm.prototype.set_GenericPersonalizationProperty=function(val)
{
    saveCookie("GenericPersonalization",val);
}
EpiBaseForm.prototype.SetInsertPersonalizationPropertyOnly=function(val)
{
    this.set_GenericPersonalizationProperty(val);
}
EpiBaseForm.prototype.set_IsEpiReadOnly=function(val) 
{
    this.IsEpiReadOnly = val;
    this.toggleToolsForReadOnly(val); // SCR #65056
}
EpiBaseForm.prototype.ctor=function(trans) 
{
    if (!this.trans && trans && Global.InstanceOf(trans,"EpiTransaction")) this.trans = trans;
}
EpiBaseForm.prototype.get_NavHandle=function()
{
    if(this.navHandleID)
    {
        return Global.BindingEngine.Controls[this.navHandleID];
    }
}
EpiBaseForm.prototype.OnLoadForm=function()
{
    var fn=function(){return this._onLoadForm();};
    Global.BindingEngine.RunInThread(this,fn,[]);
}
EpiBaseForm.prototype._onLoadForm=function()
{
    FormatEngine.GetCultureInfo();
    EpiForm.prototype.OnLoadForm.call(this);

    if(!this.trans._synced) this.trans.SyncGlobal();
    this.trans.SetupCallContext();
    this.utils.initCustomScriptManager();
    
    Global.BindingEngine.BindForm();

    if(this.LaunchFormOpts && this.LaunchForm!=EpiBaseForm.prototype.LaunchForm)  // 84997
    {
        if(this.ID!="TimeExpenseForm" && this.ID!="QuickEntryForm") // Needs to run later.
            this.LaunchForm(this.LaunchFormOpts);
    }

    this.utils.set_Transaction(this.trans);
    this.utils.Execute();
    
    try
    {
        this.SetDisplay();
    }
    catch(e)
    {
        DebugHelper.WriteError("Error caught in EpiBaseForm.SetDisplay: ", e);
    }
    this.get_Event("Load").fire();     
    this.OnFormLoad();
            
    if (this.trans && !(this instanceof EpiHostForm))
    {
        for(var edv in Global.BindingEngine.EpiDataViews)
        {
            var dv = Global.BindingEngine.EpiDataViews[edv]
            if (dv && dv.get_Event("EpiViewNotification").subscribers.length > 0)
                dv.OnEpiViewNotification(new EpiNotifyArgs(this.trans, dv.Row, 0, new EpiOverloadedArgs("Object_Int32_Int32")));
        }
        
         //this.trans.NotifyAll();
    }
    
    if (this.myTool) 
    {
        if (!this.myTool.allTools)
        {
            this.hideTools();

            //hide "AttachmentTool" if necessary
            var attchTool = this.myTool.Tools["AttachmentTool"];
            if (attchTool && (this.ManuallyDisableAttachmentTool != true))
            {
                if (this.trans && this.trans.attachMaps && (this.trans.attachMaps.Count <= 0) || (this.trans.AutomateAttachments==false))
                {
                    attchTool.IsFirstInGroup = false;
                    attchTool.SetVisible(false);                
                }
            }
        }
        //start out with attach button disabled until we get data
        this.ToggleAttachButtonOnViewChanged(false);        
    }
        
    if (this.IsEpiReadOnly) { this.toggleToolsForReadOnly(true); }
    try
    {
        this.OnFormLoaded();
        if (this.LaunchFormOpts &&  this.LaunchFormOpts.IsTemp == true)
             this.LaunchFormOpts=null; // just something we set in the _runsearchonLoad.
        if (this.UltraCalendarInfo) this.UltraCalendarInfo._processPropCallbacks();     
    }
    catch(err)
    {
        DebugHelper.WriteError("Error caught in EpiBaseForm.OnLoadForm: ", err);
    }
    
    this.FormLoaded = true;
    if (this.ID=="TimeExpenseForm"||this.ID=="QuickEntryForm")
        this.LaunchForm(this.LaunchFormOpts);
        
    this.CallbackParentForm("CallBackToRegister"); //Check if this launched form needs to call back to the opener and set a reference to itself.
    
    this.utils.OnCustomCodeFormLoad(this,{});  // calls into custom script Form_Load "event"
    
    this.ProcessQueue();
    
	//Run Report process if needed
	startRptMonitor(false);	
	
	this._handleSpecialForms();
	
    window.onbeforeunload = this.onbeforeunload;
    if(FormTestManager) FormTestManager.PerformTests();
}
EpiBaseForm.prototype._handleSpecialForms=function()
{
    if(this.Name=="CashRecForm"&&this.trans)  // 65046
    {
        this.trans.get_Event("SelectInvoices").subscribe(function(){Global.BindingEngine._rebindGrids(this.invcHeadView);}, this.trans, true);
    }
}
EpiBaseForm.prototype.OnClosing=function(eventArgs)
{
    if (this.trans != null && this.trans.didUpdateOnClose)
    {
        this.trans.SetCurrentEvent(TransactionEvent.UpdateOnFormClose);
        this.trans.OnTransactionCallBack();
    }
    this.CallbackParentForm("Close");
    
    if (!eventArgs.Cancel)
        this.get_Event("Closing").fire(this,eventArgs);
        
}
EpiBaseForm.prototype.onbeforeunload=function()
{
    if(!Global.SkipBeforeUnload)
    {
        var eventArgs = {"Cancel":false};
        if (!Global.Form.userClosedForm)
            Global.Form.OnClosing(eventArgs); // We already call this in EpiForm.Close.
        
        if(eventArgs.Cancel && !FormTestManager)
        {
            return "If you continue, you might lose changes that you have made.";
        }
    }
}
EpiBaseForm.prototype.OnFormLoaded=function() 
{
    if(this.LaunchFormOpts!=null&&
        this.ID!="WhseBinForm") // SCR 64292
    {
        if (this.LaunchFormOpts.LaunchSearchOptions instanceof SearchOptions)
        {
            this.OnClickSearch(this.LaunchFormOpts.LaunchSearchOptions);
        }
        else if (this.LaunchFormOpts != null && this.LaunchFormOpts.ValueIn 
		&& !Global.InstanceOf(this.LaunchFormOpts.ValueIn, "CompoundKeyBinding") 
		&& this.LaunchFormOpts.ValueIn.toString().length>0 
        && !this.SuppressInitialSearch && !this.manualSubscribe && !(Global.Form._assembly.StartsWith("UIRpt.")))
        {
            var searchValue = this.LaunchFormOpts.ValueIn.toString();
            this._runSearchOnLoad(searchValue);
        }
        else
        {
            var searchValue = Global.GetUrlArg("ID");
            var likeVal = Global.GetUrlArg("Like");
            
            if (searchValue != "" && likeVal=="")
            {
                 var searchColumn = Global.GetUrlArg("SrchCol");
                 this._runSearchOnLoad(searchValue,searchColumn);
            }
        }
	}
	else
	{
	     var searchValue = Global.GetUrlArg("ID");
	     var searchColumn = Global.GetUrlArg("SrchCol");
	     if (searchValue != "")
            this._runSearchOnLoad(searchValue,searchColumn);
         else if(this.AutoData || this.AutoLdNamedSrch)
         {
            var opts = null;
            var noDefaultSearch = false;
            var baqName = "";
            if (this.AutoData == true)
            {
                if (!this.AutoLdNamedSrch)
                    opts = SearchOptions.CreateRuntimeSearch(new Hashtable(), DataSetMode.ListDataSet);
                else
                    opts = new SearchOptions(Epicor.Mfg.UI.Searches.SearchMode.AutoSearch);
            }
            else if (this.AutoSrch == true)
               opts = new SearchOptions(Epicor.Mfg.UI.Searches.SearchMode.ShowDialog);
            
            var sType = "BAQ";
            var ds = new DataSet();
            if (this.AutoLdNamedSrch && this.SearchName)
            {
                var callingAssembly = this.WhoAmI + ".dll";
                
                if (this.AutoLdNamedSrch == "Use Default")
                {
                    var baseSName = "";
                    if (this.SearchName.indexOf("-") > 0)
                    {
                        baseSName = this.SearchName.Substring(0, this.SearchName.IndexOf("-"));
                    }

                    if (baseSName == EpiString.GetString("CRMCallSearch"))
                    {
                        ds = FormFunctions.GetRowsNamedSearches(this, this.SearchName, callingAssembly, "", true);
                    }
                    else
                    {
                        ds = FormFunctions.GetRowsNamedSearches(this, this.SearchName, callingAssembly, "", false);
                    }

                    if (ds == null || ds._tableCount <= 0 || ds.get_Table(0).Rows.length <=0) return;

                    // ds should only have 1 row unless came from CRM Call, if so then the 
                    // returned ds with all named searches for CRM Call, regardless of related to file
                    // now filter out based on full search name and get the default
                    var dt = ds.get_Table(0);
                    var nsCnt = dt.Rows.length;
                    
                    for (var ii = 0; ii < nsCnt; ii++)
                    {
                        var dr = dt.get_Row(ii);
                        if (dr["SearchForm"].toString().toUpperCase() == this.SearchName.toUpperCase() && dr["IsDefault"].toString().toUpperCase() == "TRUE")
                        {
                        }
                        else
                        {
                            dr.Delete();
                            ds.AcceptChanges();
                            ii = ii - 1;
                            nsCnt = nsCnt - 1;
                        }
                    }

                    // was set to Use Default, if there wasn't any default found then no action to be taken
                    if (dt.Rows.length < 1)
                    {
                        noDefaultSearch = true;
                    }
                    else
                    {
                        opts.set_SearchName(dt.Rows[0]["NSId"].toString());
                        opts.set_iNamedSearch(NamedSearch.LoadHashTables(ds));
                        opts.HasFormOptsNamedSearch = true;
                    }
                }
                else
                {
                    ds = FormFunctions.GetRowsNamedSearches(this, this.SearchName, callingAssembly, this.AutoLdNamedSrch, false);
                    if (ds == null || ds._tableCount <= 0 || ds.get_Table(0).Rows.length <= 0) return;
                    opts.set_SearchName(this.AutoLdNamedSrch);
                    opts.set_iNamedSearch(NamedSearch.LoadHashTables(ds));
                    opts.HasFormOptsNamedSearch = true;
                }

                // see if the named search uses a BAQ so we can branch off and do special stuff
                if (ds != null && ds._tableCount > 0 && ds.get_Table(0).Rows.length > 0)
                {
                    baqName = ds.get_Table(0).Rows[0]["SearchUsing"].toString();
                    sType = ds.get_Table(0).Rows[0]["SearchType"].toString();
                }
            }

            if (!noDefaultSearch)
            {
                if (baqName != "")
                {
                    //Epicor.Mfg.UI.EpiMessageBox.Show("using BAQ");
                    if (sType == "BAQ")
                    {
                        this.processBAQSearch(baqName, opts);
                    }
                    else
                    {
                        if (!this.processQuickNamedSearch(baqName, opts, ds)) return;
                    }
                }

                // this onclicksearch is the one in the application
                this.OnClickSearch(opts);
            }
         }
	}

}

EpiBaseForm.prototype.processQuickNamedSearch=function(quickSearchId, searchOptions, nsDs)
{
    // search options are not set here
    searchOptions.CurrentAdapter = this.trans.PrimaryAdapter;
    var isearch = searchOptions.CurrentAdapter;
    if (isearch == null) return false;
    searchOptions.PrimaryTableName = isearch.get_PrimaryTableName();
    searchOptions.Like = this.trans.PrimaryAdapter.get_Like();
    searchOptions.DSDefined = this.trans.PrimaryAdapter.GetCurrentDataSet(DataSetMode.RowsDataSet);
    var tblSettings = new DataTable();
    if (nsDs.Tables["ControlSetting"])
        tblSettings = nsDs.Tables["ControlSetting"];

    var al = null;
    if (searchOptions.SearchMode == SearchMode.ShowDialog)
    {
        var o = Global.LaunchQuickSearch(this,quickSearchId,true,(searchOptions.SelectMode == SelectMode.MultiSelect), DataTable());
        if (o == null) return false;

        var al=o;
        if (!al instanceof ArrayList)
        {
            al = new ArrayList();
            al.Add(o.toString());
        }
        else
        {
            var altemp = new ArrayList();
            for(var itm in al.items)
            {
                altemp.Add(al.items[itm]);
            }
            al=altemp;
        }
        searchOptions.SearchMode = SearchMode.AutoSearch;
    }
    else
    {
        this.trans.PushStatusText(EpiString.GetString("retrievingData"), true);
        var o = ProcessCaller.InvokeAdapterMethod(this, "QuickSearchAdapter","InvokeNamedQuickSearch", [this, quickSearchId, tblSettings],new EpiOverloadedArgs("Object_String_String_ObjectArr"));
        al = o;
        searchOptions.SearchMode = SearchMode.AutoSearch;
        this.trans.PopStatus()
    }
    if (al != null) SearchWorker.RebuildWhereClauses(al, searchOptions);
    return true;
}

EpiBaseForm.prototype.processBAQSearch=function(baqSearch, oSearchOptions)
{
    // search options are not set here
    oSearchOptions.CurrentAdapter = this.trans.PrimaryAdapter;
    oSearchOptions.Like = this.trans.PrimaryAdapter.get_Like();
    if (oSearchOptions.SearchMode == SearchMode.ShowDialog) return;

    // similar code can be found in EpiSearchBase, get the BAQ results
    var dbAdapter = "DynamicQueryAdapter";
    var method = "GetQuerySearchResults";

    this.lastBAQ = baqSearch;
    var parms = [ baqSearch ];
    var tbl = ProcessCaller.InvokeAdapterMethod(this, dbAdapter, method, parms, new EpiOverloadedArgs("Object_String_String_ObjectArr"));
     
    if (tbl != null)
    {
        // get the column within the BAQ results that is LIKE what we want ..for the selected BAQ id
        method = "GetLikeColumnForBAQ";

        parms = [this.lastBAQ, oSearchOptions.Like];
        var o = ProcessCaller.InvokeAdapterMethod(this, dbAdapter, method, parms, new EpiOverloadedArgs("Object_String_String_ObjectArr"));
        var col = o.toString();

        // build up all of the keys in the table based on that column
        if (col != null && col.length > 0)
        {
            // here go through the table rows and build up the array
            var al = new ArrayList();
            for (var dr in tbl.Rows)
            {
                dr = tbl.Rows[dr];
                var selValue = dr[col].toString();
                if (!al.Contains(selValue))
                    al.Add(selValue);
            }
            SearchWorker.RebuildWhereClauses(al, oSearchOptions);
        }
    }
}
EpiBaseForm.prototype.CallbackParentForm=function(command, scope,fn,args)
{
    
	if (!this.LaunchFormOpts) return;
	if (this.LaunchFormOpts.IsModal == false) this.isModeLess = true;
	
	if (!this.LaunchFormOpts.uiReflector) return;
		
    if (command == "CallBackToRegister")
    { 
        if(window.opener && this.LaunchFormOpts.CallBackToRegister)
        {
            this.LaunchFormOpts.uiReflector._callBackToRegister(this, this.trans);
        }
    }
    else if (command == "Close")
    {
        if(window.opener && this.LaunchFormOpts.CallBackToRegister)
        {
            this.LaunchFormOpts.uiReflector._launchedFormClose();
        }
    }
    else if (command == "CallFunction")
    {
        if(window.opener && this.LaunchFormOpts.CallBackToRegister)
        {
            this.InParentCallBack = true;
            this.LaunchFormOpts.uiReflector.CallFunction(scope,fn,args); // Calls a method on the parent form
            this.InParentCallBack = false;
            // If some calls were made back to this launched form when we were in the CallFunction, run those now.
            // TODO: This wouldnt work if the caller form needed data back immediately. Need to address this.
            var uiR = this.LaunchFormOpts.uiReflector;
            for(var itm in uiR.UICallQ)
            {
                var q = uiR.UICallQ[itm];
                var args = [];
                for(var i=0;i<=q.Args.length-1;i++){args.push(q.Args[i]);}
                this[q.Fn].apply(this, args);
            }
        }
    }
}
EpiBaseForm.prototype.getMenuItemDS=function()
{
    // Copy over props from parent, for dialogs etc which were not opened directly from the menu
    if (this.Owner!=null && this.Owner instanceof EpiBaseForm)
    {
        this.IsEpiReadOnly = this.Owner.get_IsEpiReadOnly();
        this.CustomizationName = this.Owner.get_CustomizationName();
        this.ExtensionName = this.Owner.get_ExtensionName();
        this.ReportName = this.Owner.get_ReportName();
    }
    else
    {
        this.CustomizationName = "";
        this.ExtensionName = "";
        if (!this.ReportName) this.ReportName = "";
    }
    this.IsTracker = false;
    this.IsVerificationMode = false;
    this.baseExtensionName = "";
    this.MenuItemDS = null;
    
    if(this._loadparams && this._loadparams.HasMenu == true)
    {
        // Create a dataset to hold this row.
        this.MenuItemDS = new MenuDataSet();
        var newRow = this.MenuItemDS.get_Table(0).NewRow();
        for(var c in this._loadparams.MenuRow)
            newRow[c] = this._loadparams.MenuRow[c];
        this.MenuItemDS.get_Table(0).AddRow(newRow);
        
//        var items =this.MenuItemDS.get_Table(0)._getRowItemArray(this._loadparams.MenuRow);
//        this.MenuItemDS.get_Table(0).LoadDataRow(items, true, new EpiOverloadedArgs("ObjectArr_Boolean"));
     } 
     else
     {
        // Check if menu id was passed in the url.
        var menuID = Global.GetUrlArg("menuID");
        if (menuID)
        {
            this.MenuItemDS = ProcessCaller.GetMenuProcess(this,menuID); 
        }
     }
     if (this.MenuItemDS != null)
     {  
        // Init all the properties
        var optionSubTypeSettingFromMenuRow = FormFunctions.GetMenuItemColumnValue(this.MenuItemDS, "OptionSubType").toString();
        if(optionSubTypeSettingFromMenuRow.toUpperCase() == "T") this.IsTracker = true;
        
        var args = FormFunctions.GetMenuItemColumnValue(this.MenuItemDS, "Arguments").toString();
        
        if (FormFunctions.GetArgumentValuePerToken(args, "VerCust") == "true")
            this.IsVerificationMode = true;

		if(FormFunctions.GetArgumentValuePerToken(args, "ro") == "true")
		    this.IsEpiReadOnly = true;

	    this.ExtensionName = FormFunctions.GetArgumentValuePerToken(args, "e");
		this.baseExtensionName = FormFunctions.GetArgumentValuePerToken(args, "be");
        this.ReportName = FormFunctions.GetArgumentValuePerToken(args, "r");
    }
}

EpiBaseForm.prototype.OnClickExit=function()
{
    try
    {
        if(Global.window.parent && Global.window.parent.IsWebMenu)
            Global.window.parent.closeCurrentTab();
        else
            Global.window.close();
    }
    catch(err)
    {
        Global.window.close();
    }
}
EpiBaseForm.prototype.OnClickAttachment=function()
{
    MessageBox.Show("This feature is currently not supported by the Epicor Web Access framework.", "Attachments are accessed through the tree panel.", new EpiOverloadedArgs("String_Details"));
}
EpiBaseForm.prototype.ToggleAttachButtonOnViewChanged=function(enableAttachTool)
{
    if ((this.ManuallyDisableAttachmentTool) || (!this.myTool)) return;
    var tKey = "AttachmentTool";
    var tool = this.myTool.Tools[tKey];
    if (!tool) return;

    var buttonProps = tool.SharedProps;

    if (!this.attachPanelIsVisible) buttonProps.set_Enabled( enableAttachTool );
    // The LastView is the view of the table that has the associated attachments.
    if(this.trans)
    {
        var currentView = this.trans.LastView;
        if (currentView != null)
        {
            var showHasAttachments = false;
            if (currentView.Row >= 0)
            {
                var attachmentView = this.trans.attachLink[currentView.ViewName];
                if (attachmentView != null)
                {
                    // The attachmentView's filter isn't always up to date so we have to build the filter ourselves.
                    var attachmentRowFilter = currentView.BuildChildRowFilter(currentView.Row, attachmentView);
                    var attachmentRows = attachmentView.dataView.Table.Select(attachmentRowFilter);
                    showHasAttachments = (attachmentRows.length > 0);
                }
            }
            var img = (showHasAttachments)? "AttachmentWithData":"Attachment";
            this.setToolImage(tool, img);
        }
    }
}
EpiBaseForm.prototype.performUpdate=function(silent)
{
    var attachEdv = null;
    if (this.trans && this.trans.LastView)
    {
        if (this.trans.LastView.isAttachView || this.trans.LastView.hasAttachKidView)
            attachEdv = this.trans.LastView;
    }
    this.trans.SetCurrentEvent(TransactionEvent.UpdateOnSaveButton);
    this.OnClickSave();
    if (attachEdv != null)
    {
        attachEdv.Notify(new EpiNotifyArgs(this, true, attachEdv.Row, 0, true));
    }
    else if (this.trans)
    {
        this.trans.NotifyAll(EpiTransaction.NotifyType.InitAndResetTreeNodes, this.trans.LastView);
    }
}
EpiBaseForm.prototype.clearTransaction=function()
{
	this.trans.SetCurrentEvent(TransactionEvent.UndoOnClearButton);
	this.OnClickClear();
	if (this.trans.didUndoOnClear)
    {
        //on successful clear, disable attachments
        this.ToggleAttachButtonOnViewChanged(false);
		this.trans.SetCurrentEvent(TransactionEvent.UndoOnClearButton);
    }
    this.trans.OnTransactionCallBack();
	this.trans.resetTransactionEvent();
}
EpiBaseForm.prototype._runSearchOnLoad=function(searchValue,searchCol) 
{
    if (!searchValue || searchValue == '')  return;
            
    var isearch = this.trans.PrimaryAdapter;
    var searchTable = isearch.get_PrimaryTableName();
	var searchColumn = isearch.get_PrimaryColumnName();
	if (searchCol) searchColumn = searchCol;
	
    // If this is a dashboard form and there is a navcontrol, then set the value on it and invoke performsearch.
    if (this instanceof EpiHostForm && this.AppControlPanel 
        && this.AppControlPanel.appControlNavManager && this.AppControlPanel.navControl)
    {
        this.AppControlPanel.navControl.set_Text(searchValue);
        this.AppControlPanel.appControlNavManager.performSearch();
        return;
    }

    var loaded = false;
	 // VA Start - 03/26/08 Use an alternate way to find the navhandle
	if (!this.navHandleID)
	   this.navHandleID = Global.Form.myTool.Tools["NavigationTool"].Control;
	
	if (this.navHandleID)
	{
	    this.navHandle = Global.BindingEngine.Controls[this.navHandleID];
	    if (this.navHandle && this.navHandle.get_EpiCombo().DataView) 
    	{	
	        var ht = new Hashtable();
	        var dsName = "ListDataSet";
	        var dv = Global.BindingEngine.EpiDataViews[this.navHandle.get_EpiCombo().DataView];
	        if (dv.dataView.Table.DataSet && dv.dataView.Table.DataSet.DataSetName)
		        dsName = dv.dataView.Table.DataSet.DataSetName;

	        try 
	        {
		        var quoteDelim = "'";
		        if (dv.dataView.Table.Columns[searchColumn] != undefined)
		        {
		            switch (dv.dataView.Table.Columns[searchColumn].DataType)
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
		        var tbl = "";

		        var wClause = searchColumn + " = " + quoteDelim + searchValue + quoteDelim;
		        var dsMode = DataSetMode.ListDataSet;
		        if (dsName.toUpperCase().EndsWith("LISTDATASET"))
		        {
			        tbl = "BaseList";
			        if (searchTable && Global.Form.ID == "ARInvoiceUpdtForm")
			            ht.Add(searchTable,wClause);
		        } 
		        else 
		        {
			        tbl = searchTable;
			        dsMode = DataSetMode.RowsDataSet;
		        }

		        ht.Add(tbl,wClause);
		        var opts = SearchOptions.CreateRuntimeSearch(ht, dsMode);
		        if (searchTable && Global.Form.ID == "ARInvoiceUpdtForm")
			        opts.DontUsePreLoadSearchFilter = true;
			        
		        this.OnClickSearch(opts);
		        if (dv.dataView.Table.Rows.length > 0)
		            loaded = true;
	        } 
	        catch (err)
	        {
		        var eTxt = "Failed to Auto-Search; Possible invalid primary adapter defined for "+ this.WhoAmI + ". Error:" + err.description;
		        MessageBox.Show(eTxt, new EpiOverloadedArgs("String"));
	        }
	    }
	}
	if (!loaded)
	{
	    if (Global.Form.keyControl)
        {
            var ctrl = Global.document.getElementById(Global.Form.keyControl.ID);
            if (ctrl)
            {
                Global.Form.keyControl.set_Text(searchValue);
                Global.Form.keyControl.OnChange(ctrl);
            }
        }
        else if(this.LaunchFormOpts==null) // Nothing worked, so trick the form by setting the LaunchFormOpts
        {
            this.LaunchFormOpts = {"ValueIn":searchValue, "IsTemp":true};
        }
	}
}
EpiBaseForm.prototype.RunCtor=function() 
{
    if(!this.RunCtorWithArgs())
    {
        try
        {
            var transObj = localTrans;
        }
        catch(err)
        {
            var transObj = EpiTransaction;
        }
        this.trans = new transObj();
        if (this["ctor_1"]) // Only if ctor is overloaded, send in EpiOverloadedArgs.
            this.ctor(this.trans, new EpiOverloadedArgs('EpiTransaction'));
        else
            this.ctor(this.trans);
    }
    
    var transForm = this.trans.get_EpiBaseForm();
    if (transForm != null && transForm != this)
    {
        this.Owner = transForm; // This is the form that opened this current form (usually the main uiapp form). We use it only to copy over the default menu properties for now.
    }
    this.trans.set_EpiBaseForm(this);
}
EpiBaseForm.prototype._focusTrans=function(ctrl)
{
    if (this.trans == null) return;
    if(ctrl && ctrl.id) 
    {
        ctrl = Global.BindingEngine.Controls[ctrl.id];
        if (ctrl &&  ctrl.DataView)
        {
            if(ctrl.DataView && Global.BindingEngine.EpiDataViews[ctrl.DataView]) 
            {
                this.trans.set_LastView(Global.BindingEngine.EpiDataViews[ctrl.DataView]);
            }
            this.trans.set_LastControl(ctrl); 
        }
    }
}
EpiBaseForm.prototype.bindToolbarCtrls=function()
{
    if (!this.myTool) return;
    var theTool,obj,c,flg;
    var tools = this.myTool.Tools;
    var bEngine = Global.BindingEngine;
    var dataviews = bEngine.EpiDataViews;
    for(var tool in tools)
    { 
       theTool = tools[tool];
       if (Global.IsFunction(theTool)) continue;
       if (theTool.Type == "ControlContainerTool" && theTool.Control != "")
       {
            obj = bEngine.Controls[theTool.Control];
            if(obj && obj.DataView && dataviews[obj.DataView])
            {
                var doBind = true;
                // This check fails on the form when user types in the primary key value because the table
                // that the navigator is bound to is not part of the main dataset.
                if(!bEngine.IsBindingDataset(bEngine.EpiDataViews[obj.DataView].dataView.Table.DataSet))
                    doBind=false;
                    
//                if(bEngine.BindDataSet && !bEngine.BindDataSet.Tables[obj.DataView])
//                    doBind = false;
            
                if( doBind)
                {
                    var dView = dataviews[obj.DataView];
                    c = Global.document.getElementById(theTool.Control);
                    flg = obj.Bind(bEngine, c, dView, dView.Row);
                }
            }
       }
    }
}
EpiBaseForm.prototype.toggleToolsForReadOnly=function(EpiReadOnlyState)
{
    if (this.myTool == null) return;

    for (var t in this.myTool.Tools.items)
    {
        var tb = this.myTool.Tools.items[t];
        var okToDisable = true;

        switch (tb.Key)
        {
            case this.UTB_CURRENCY:
            case "HelpMenu":
            case "EpicorMenu":
            case "ToolsMenu":
            case "PrimarySearchTool":
            case "NavigationTool":
            case "ClearTool":
            case "MemoTool":
            case "RefreshTool":
            case "PrintTool":
            case "AttachmentTool":
            case "PrintPreviewTool":
            case "ActionsMenu":
            case "FileMenu":
            case "ExitTool":
            case "SendMenu":
            case "SendRecordEmailTool":
            case "SendRecordFileTool":
            case "SendListEmailTool":
            case "SendListFileTool":
            case "JobMenu":
            //case "ScheduleMenu": // SCR 68336 as "Job Scheduling Board is not supported in EWA"
            case "Print":
            case "MRUTool":
            case "JobTravPrint":
            case "ProdDtlPrint":
            case "_DebugTool":
                okToDisable = false;
                break;
        }
        
        if(okToDisable && this._enabledTools.Contains(tb.Key))
        {
            okToDisable=false;
        }

        if (okToDisable)
        {
            tb.SetEnabled(!EpiReadOnlyState);
        }
    }
    
    if (EpiReadOnlyState)
    {
        if (this.myTool.Tools.IndexOf("HelpMenu") > -1)
        {
            for (var j in  this.myTool.Tools["HelpMenu"].Tools.items)
            {
                this.myTool.Tools["HelpMenu"].Tools.items[j].SetEnabled(true);
            }
        }
        if (this.myTool.Tools.IndexOf("EpicorMenu") > -1)
        {
            for (var j in  this.myTool.Tools["EpicorMenu"].Tools.items)
            {
                this.myTool.Tools["EpicorMenu"].Tools.items[j].SetEnabled(true);
            }
        }
        if (this.myTool.Tools.IndexOf("ToolsMenu") > -1)
        {
            for (var j in  this.myTool.Tools["ToolsMenu"].Tools.items)
            {
                this.myTool.Tools["ToolsMenu"].Tools.items[j].SetEnabled(true);
            }
        }
    }
}
EpiBaseForm.prototype.setupUIElements=function(tb)
{
    this.myTool = tb;

    var st=Global.BindingEngine.Controls["baseStatusBar"];
    if(st) 
    {
        this.mySBP=st;
        this.setupStatusBarPanels();
    }
    
    this._addTools();
    
    if (this.myTool.Tools["UndoTool"]!= null)
        this.myTool.Tools["UndoTool"].IsFirstInGroup=true;
    
    // show the action menu
    if(this.myTool.Tools.Exists("ActionsMenu") && this.myTool.Tools["ActionsMenu"].Tools.Count > 0)
		this.myTool.Tools["ActionsMenu"].SharedProps.Visible = true;
    if (this.myTool && !this.myTool.allTools) // Runtime creation of menus
    {
        this.setupSendOptions();
        this.setupCustomizationOptions();
    }
    
    // disabling tools that are not valid in win2web
    try
    {
        var hideTools = ["CutTool","CopyTool","PasteTool","AboutTool","PrintTool1","PrintPreviewTool",
            "SendMenu","hideAttach"];
            
        if(Global.Form._assembly.StartsWith("UIProc.")||Global.Form._assembly.StartsWith("UIRpt."))
            hideTools.push("GenerateTool");

        var hasEnabledPrint = false;
        for(var i=0,tool;tool=this.myTool.Tools[hideTools[i]];i++)
        {                        
            if ((hideTools[i] == "PrintPreviewTool" || hideTools[i] == "PrintTool")&& this._assembly.StartsWith("UIRpt.")) {
                tool.IsFirstInGroup = true;
                tool.SetVisible(true);   
                continue; // We want Print Preview for report forms
            }

            tool.IsFirstInGroup = false;
            tool.SetVisible(false);
        }
    } catch(err){}
    
    
}
EpiBaseForm.prototype.setupStatusBarPanels=function()
{
    var panels=this.mySBP.get_Panels();
    if(panels["sbpCompany"]&&this.Session)
    {
        panels["sbpCompany"].set_Text(this.Session.CompanyName);
    }
}
EpiBaseForm.prototype.hideTools=function()
{
    if(!this.myTool) return;
    
    // hide the hidden tools, form adds/removes items from list in its ctor
	for(var i=0,sTool;sTool=this.hiddenTools.items[i];i++)
	{
	    if((this.hiddenTools.items[i] =="PrintPreviewTool" || this.hiddenTools.items[i] =="PrintTool") && this._assembly.StartsWith("UIRpt.")) 
            continue; // We want Print Preview for report forms

	    var theTool = this.myTool.Tools[sTool];
		if (theTool != undefined) 
		{
			theTool.SetVisible(false);
		}
	}
}

// adds the tool to the hiddenTools list, so they are hidden at runtime
EpiBaseForm.prototype.DisableTool=function(ToolKey) 
{
    if (!this.myTool) return;
    this.hiddenTools.Add(ToolKey);
    
    var theTool = this.myTool.Tools[ToolKey];
    if (theTool != undefined) 
    {
	    theTool.SetEnabled(false);
    }
    
    if (this._enabledTools.Contains(ToolKey))
    {
        this._enabledTools.Remove(ToolKey);
    }
}
// Removes tool from hiddenTools list so they appear at runtime
EpiBaseForm.prototype.EnableTool=function(ToolKey)
{
    if (!this.myTool) return;

    if (this.hiddenTools.Contains(ToolKey))
    {
        this.hiddenTools.Remove(ToolKey);
    }
    
    if (!this._enabledTools.Contains(ToolKey))
    {
        this._enabledTools.Add(ToolKey);
    }
    
    var theTool = this.myTool.Tools[ToolKey];
    if (theTool != undefined) 
    {
	    theTool.SetEnabled(true);
    }
}

EpiBaseForm.prototype._addTools=function()
{
    if(!this.myTool) return;

     // Currency toggle
     if (this.myTool.allTools == true)
     {
        if (this.myTool.Tools["ActionsMenu"].Tools.Count == 0)
		   this.myTool.Tools["ActionsMenu"].SetEnabled(false);
		        
        this.setToolImage(this.myTool.Tools["ClearTool"], "Clear");
        this.setToolImage(this.myTool.Tools["RefreshTool"], "Refresh");
        this.setToolImage(this.myTool.Tools["AttachmentTool"], "Attachment");
        this.setToolImage(this.myTool.Tools["CallLogTool"], "CallLog");
        this.setToolImage(this.myTool.Tools["MemoTool"], "MemoEmpty");
        this.setToolImage(this.myTool.Tools["AuditLogTool"], "AuditLog");
        this.setToolImage(this.myTool.Tools["ChangeLogTool"], "ChangeLog");
        this.setToolImage(this.myTool.Tools["HelpTool"], "Help");
        
        //In this case, the currency toggle toolbar doesnt exist yet. So create it and add the checkeditor to it
		// the Toolbar
		if (!this.myTool.Toolbars[CurrStrings.UTB_CURRENCY])
    		this.myTool.Toolbars.AddToolbar(CurrStrings.UTB_CURRENCY);
    		
		this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].SetVisible(false);
	    this.cbtCurrencyDropdown = Global.BindingEngine.Controls[CurrStrings.SBT_CURRENCY];
	    if (this.cbtCurrencyDropdown)
	        this.cbtCurrencyDropdown.get_Event("ValueChanged").subscribe(this.cbtCurrencyDropdown_ToolValueChanged, this, true);
		var cctCurrency = this.myTool.Tools[CurrStrings.SBT_CURRENCYTOOL];
		if (!cctCurrency)
		{
		    cctCurrency = new Tool(CurrStrings.SBT_CURRENCYTOOL,{"Caption":"","Type":"ControlContainerTool","Control":CurrStrings.SBT_CURRENCY});
		    this.myTool.Tools.Add(cctCurrency);
		    this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].Tools.AddTool(CurrStrings.SBT_CURRENCYTOOL);
		}
		else if (cctCurrency.Type != "ControlContainerTool")
		{
		    cctCurrency = new Tool(CurrStrings.SBT_CURRENCYTOOL,{"Caption":"","Type":"ControlContainerTool","Control":CurrStrings.SBT_CURRENCY});
		    this.myTool.Tools[CurrStrings.SBT_CURRENCYTOOL] = cctCurrency;
		    if (!this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].Tools.Exists(CurrStrings.SBT_CURRENCYTOOL))
		        this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].Tools.AddTool(CurrStrings.SBT_CURRENCYTOOL);
		}

        // Launch Debugger
	    if(Global.DebugHelper!=null)
	    {
	        tKey = "_DebugTool";
	        if (!this.myTool.Tools[tKey])
	        {
	            var debugTool = new Tool(tKey, {"Caption":"Debug Helper", "Type":"ButtonTool"});
    	        
	            this.setToolImage(debugTool, "_DebugTool");
	            this.myTool.Tools.Add(debugTool);
	            this.myTool.Toolbars.AddToolbar("_DebugToolbar");
	            this.myTool.Toolbars["_DebugToolbar"].Tools.Add(debugTool);
	        }
	    }
     }
     else
	 {
    
    // make sure the action menu exists
        var tKey = "ActionsMenu";
		if(!this.myTool.Tools["ActionsMenu"])
		{
			var actionMenu = new Tool(tKey,{"Caption":EpiString.getString("ActionsMenu"),"Type":"PopupMenuTool"});
			this.myTool.Tools.Add(actionMenu);
			this.myTool.Toolbars["MainMenu"].Tools.InsertTool(this.myTool.Toolbars["MainMenu"].Tools.IndexOf("HelpMenu"), "ActionsMenu");
		}
		else
		{
		    if (this.myTool.Tools["ActionsMenu"].Tools.Count == 0)
		        this.myTool.Tools["ActionsMenu"].SetEnabled(false);
		        
		}
        // Clear Tool
	    tKey = "ClearTool";
	    if (!this.myTool.Tools[tKey])
	    {
		    var caption = EpiString.getString("Clear");
	        var clearTool = new Tool(tKey,{"Caption":caption,"Type":"ButtonTool","ToolTipText":caption});
		    this.setToolImage(clearTool, "Clear");
	        this.myTool.Tools.Add(clearTool);
	        // Add the tool to the Standard Tools and Edit menu - note we dont support this yet
	        this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("EditMenu", tKey);
	    }
	    
        
        // Refresh Tool
	    tKey = "RefreshTool";
	    if (!this.myTool.Tools[tKey])
	    {
		    var caption = EpiString.getString("Refresh");
	        var refreshTool = new Tool(tKey,{"Caption":caption,"Type":"ButtonTool","ToolTipText":caption});
		    this.setToolImage(refreshTool, "Refresh");
		    this.myTool.Tools.Add(refreshTool);
		    this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("EditMenu", tKey);
	    }
	    
	    // Launch Debugger
	    if(Global.DebugHelper!=null)
	    {
	        tKey = "_DebugTool";
	        if (!this.myTool.Tools[tKey])
	        {
	            var debugTool = new Tool(tKey, {"Caption":"Debug Helper", "Type":"ButtonTool"});
    	        
	            this.setToolImage(debugTool, "_DebugTool");
	            this.myTool.Tools.Add(debugTool);
	            this.myTool.Toolbars.AddToolbar("_DebugToolbar");
	            this.myTool.Toolbars["_DebugToolbar"].Tools.Add(debugTool);
	        }
	    }
	    
	    // Attachment Tool
	    tKey = "AttachmentTool";
	    if (!this.myTool.Tools[tKey])
	    {
	        var attachmentTool = new Tool(tKey,{"Caption":EpiString.getString("Attachments"),"Type":"ButtonTool"});
		    this.setToolImage(attachmentTool, "Attachment");
		    this.myTool.Tools.Add(attachmentTool);
		    this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("ActionsMenu", tKey);
	        
	        this.myTool.Tools["ActionsMenu"].SetEnabled(true);
	    }
    	
	    // CallLog Tool
	    tKey = "CallLogTool";
	    if (!this.myTool.Tools[tKey])
	    {
	        var callLogTool = new Tool(tKey,{"Caption":EpiString.getString("CallLog"),"Type":"ButtonTool"});
		    this.setToolImage(callLogTool, "CallLog");
		    this.myTool.Tools.Add(callLogTool);
		    this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("ActionsMenu", tKey);
	    }

        tKey = "MemoTool";
	    if (!this.myTool.Tools[tKey])
	    {
	        var memoTool = new Tool(tKey,{"Caption":EpiString.getString("Memo"),"Type":"ButtonTool"});
		    this.setToolImage(memoTool, "MemoEmpty");
		    this.myTool.Tools.Add(memoTool);
		    this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("ActionsMenu", tKey);
	    }

        // AuditLog Tool
	    tKey = "AuditLogTool";
	    if (!this.myTool.Tools[tKey])
	    {
	        var auditLogTool = new Tool(tKey,{"Caption":EpiString.getString("AuditLog"),"Type":"ButtonTool"});
		    this.setToolImage(auditLogTool, "AuditLog");
		    this.myTool.Tools.Add(auditLogTool);
		    this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("ActionsMenu", tKey);
	    }
    	
	    // ChangeLog Tool
	    tKey = "ChangeLogTool";
	    if (!this.myTool.Tools[tKey])
	    {
	        var changeLogTool = new Tool(tKey,{"Caption":EpiString.getString("ChangeLog"),"Type":"ButtonTool"});
		    this.setToolImage(changeLogTool, "ChangeLog");
		    this.myTool.Tools.Add(changeLogTool);
		    this.addToolbarTool("Standard Tools", tKey);
	        this.addPopupMenuTool("ActionsMenu", tKey);
	    }

	    // Help Tool
	    tKey = "HelpTool";
	    if (!this.myTool.Tools[tKey])
	    {
	        var helpTool = new Tool(tKey,{"Caption":EpiString.getString("ApplicationHelp"),"Type":"ButtonTool"});
		    this.setToolImage(helpTool, "Help");
		    this.myTool.Tools.Add(helpTool);
		    this.addPopupMenuTool("HelpMenu", tKey);
	    }
	    tKey = "FieldHelpTool";
	    if (!this.myTool.Tools[tKey])
	    {
            var helpTool = new StateButtonTool("FieldHelpTool",{"Type":"StateButtonTool","Caption":EpiString.getString("FieldHelp"),"DisplayStyle":"DisplayCheckmark"});
		    this.setToolImage(helpTool, tKey);
		    this.myTool.Tools.Add(helpTool);
		    this.addPopupMenuTool("HelpMenu", tKey);
	    }	    
	    
        // Refresh Tool
        if(this._assembly.StartsWith("UIRpt.")||this._assembly.StartsWith("UIProc."))
        {
	        tKey = "ProcessTool";
	        if (!this.myTool.Tools[tKey])
	        {
    		    var Caption = EpiString.GetString("SaveProcessSet","MessageStrings.html");
	            var buttonProcess = new ButtonTool("ProcessTool",{"Caption":Caption,"Type":"ButtonTool","Category":"Action","Visible":false});		
			    EpiReportFunctions.setToolImage(buttonProcess, "ExternalProcess");
		        this.myTool.Tools.Add(buttonProcess);
		        this.addToolbarTool("Standard Tools", tKey);
	        }
	    }
	    
	    //In this case, the currency toggle toolbar doesnt exist yet. So create it and add the checkeditor to it
		// the Toolbar
		this.myTool.Toolbars.AddToolbar(CurrStrings.UTB_CURRENCY);
		this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].SetVisible(false);
	    this.cbtCurrencyDropdown = Global.BindingEngine.Controls[CurrStrings.SBT_CURRENCY];
	    this.cbtCurrencyDropdown.get_Event("ValueChanged").subscribe(this.cbtCurrencyDropdown_ToolValueChanged, this, true);
		
		var cctCurrency = new Tool(CurrStrings.SBT_CURRENCYTOOL,{"Caption":"","Type":"ControlContainerTool","Control":CurrStrings.SBT_CURRENCY});
		this.myTool.Tools.Add(cctCurrency);
		this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].Tools.AddTool(CurrStrings.SBT_CURRENCYTOOL);
	} 
}

EpiBaseForm.prototype.setupSendOptions=function()
{
	if (this.myTool != null)
	{
//	    if(this.myTool.Tools["SendMenu"]) return; // We already have the menus
	    
		//try
		{
		    //popupMenuToolSend.DropDownArrowStyle = Infragistics.Win.UltraWinToolbars.DropDownArrowStyle.None; //??
	
			if (this.AllowSendTools && !this.myTool.Tools["SendMenu"])
			{
			    var Caption = EpiString.getString("Send"); //"&Send";
	            var popupMenuToolSend = new Tool("SendMenu",{"Category":"Send","Caption":Caption,"Type":"PopupMenuTool",Tools:[]});			
	            this.setToolImage(popupMenuToolSend, "Send");
    			
	            Caption = EpiString.getString("RecordbyEmail");// "Record by E-mail";
	            var buttonSendTool1 = new ButtonTool("SendRecordEmailTool",{"Caption":Caption,"Type":"ButtonTool","Category":"Send"});	
	            this.setToolImage(buttonSendTool1, "SendRecByEmail");
    			
	            Caption = EpiString.getString("RecordtoDesktop"); //"Record to Desktop";
	            var buttonSendTool2 = new ButtonTool("SendRecordDeskTopTool",{"Caption":Caption,"Type":"ButtonTool","Visible":false,"Category":"Send"});		
    			
	            Caption = EpiString.getString("RecordtoFile"); //    "Record to File";
	            var buttonSendTool3 = new ButtonTool("SendRecordFileTool",{"Caption":Caption,"Type":"ButtonTool"});		
	            this.setToolImage(buttonSendTool3, "SendRecToFile");
    						
	            Caption = EpiString.getString("WorkListbyEmail"); //"Work List by E-mail";
	            var buttonSendTool4 = new ButtonTool("SendListEmailTool",{"Caption":Caption,"Type":"ButtonTool","Category":"Send"});	
	            this.setToolImage(buttonSendTool4, "SendWlistByEmail");
    			
	            Caption = EpiString.getString("WorkListtoDesktop"); //"Work List to Desktop";
	            var buttonSendTool5 = new ButtonTool("SendListDesktopTool",{"Caption":Caption,"Type":"ButtonTool","Visible":false});	
    				
	            Caption = EpiString.getString("WorkListtoFile"); //"Work List to File";
	            var buttonSendTool6 = new ButtonTool("SendListFileTool",{"Caption":Caption,"Type":"ButtonTool","Category":"Send"});		
	            this.setToolImage(buttonSendTool6, "SendWlistToFile");
    			
	            var fileMenu;
	            var toolMenu;
	            
				this.myTool.Tools.Add(popupMenuToolSend);
				this.myTool.Tools.Add(buttonSendTool1);
				this.myTool.Tools.Add(buttonSendTool2);
				this.myTool.Tools.Add(buttonSendTool3);
				this.myTool.Tools.Add(buttonSendTool4);
				this.myTool.Tools.Add(buttonSendTool5);
				this.myTool.Tools.Add(buttonSendTool6);

				popupMenuToolSend.Tools.AddRange([buttonSendTool1,
												  buttonSendTool2,
												  buttonSendTool3,
												  buttonSendTool4,
												  buttonSendTool5,
												  buttonSendTool6]);

				if (this.myTool.Tools.Exists("FileMenu"))
				{
					fileMenu = this.myTool.Tools["FileMenu"];
					var insertPosition = 3;
					if (fileMenu.Tools.Exists("DeleteTool"))
						insertPosition = fileMenu.Tools.IndexOf("DeleteTool") + 1;
					fileMenu.Tools.InsertTool(insertPosition, "SendMenu");
				}
			}
			// ** sets custom menu (per CK) jdm **
			if (this.myTool.Tools.Exists("SaveCustomTool"))
			{
				this.myTool.Tools["SaveCustomTool"].SetVisible(false); //.SharedProps.Visible = false;
			}

			if (this.myTool.Tools.Exists("ToolsMenu"))
			{
				toolMenu = this.myTool.Tools["ToolsMenu"];

                if (this.myTool.Tools.Exists("CustomizeTool")) this.myTool.Tools["CustomizeTool"].SetVisible(false);
//				if (!this.myTool.Tools.Exists("CustomizeTool"))
//				{
////					this.myTool.Tools.Remove(this.myTool.Tools["CustomizeTool"]);
//				    Caption = EpiString.getString("Customization"); // "Customization";
//				    var btCustom = new ButtonTool("CustomizeTool",{"Caption":Caption,"Type":"ButtonTool"});
//				    this.setToolImage(btCustom, "Customize");

//				    this.myTool.Tools.Add(btCustom);
//				    toolMenu.Tools.InsertTool(0, "CustomizeTool");
//				}

				// ** Lauch Personalization Tool **
				if (!this.myTool.Tools.Exists("PersonalizeTool"))
				{
					//this.myTool.Tools.Remove(myTool.Tools["PersonalizeTool"]);
					
				    Caption = EpiString.getString("Personalization"); // "Personalization";
				    var btPersonalize = new ButtonTool("PersonalizeTool",{"Caption":Caption,"Type":"ButtonTool"});
				    this.setToolImage(btPersonalize, "Personalization");
    				
				    this.myTool.Tools.Add(btPersonalize);
				    toolMenu.Tools.InsertTool(6, "PersonalizeTool");
				}

				// ** Launch XmlHelp Tool **
				if (!this.myTool.Tools.Exists("LaunchXmlHelpTool"))
			    {
			    //this.myTool.Tools.Remove(myTool.Tools["LaunchXmlHelpTool"]);
					
				    Caption = EpiString.getString("HelpLinkEditor"); // "Help Link Editor";
				    var btLaunchXmlHelp = new ButtonTool("LaunchXmlHelpTool",{"Caption":Caption,"Type":"ButtonTool"});
				    this.setToolImage(btLaunchXmlHelp, "HelpLinkEditor");
				    this.myTool.Tools.Add(btLaunchXmlHelp);
				    toolMenu.Tools.InsertTool(1, "LaunchXmlHelpTool");
				}

				// ** Save Layouts Tool **
				if (!this.myTool.Tools.Exists("SaveLayoutsTool"))
				{
//					this.myTool.Tools.Remove(myTool.Tools["SaveLayoutsTool"]);
			        Caption = EpiString.getString("SaveLayouts"); // "Save Layouts";
				    var btSaveLayouts = new ButtonTool("SaveLayoutsTool",{"Caption":Caption,"Type":"ButtonTool"});
    				
				    this.setToolImage(btSaveLayouts, "SaveLayouts");
				    this.myTool.Tools.Add(btSaveLayouts);
				    toolMenu.Tools.InsertTool(6, "SaveLayoutsTool");
				}
			}

			//locate forms nav control
//					if (this.navHandle == null)
//					{
//						foreach (Control formControl in this.Controls)
//						{
//                            if (formControl is Epicor.Mfg.UI.FrameWork.EpiUltraComboPlus)
//                            {
//                                this.NavHandle = (Epicor.Mfg.UI.FrameWork.EpiUltraComboPlus)formControl;
//                                break;
//                            }
//						}
//					}
		}
		//catch (ex)
		{
			
		}
	}

}

EpiBaseForm.prototype.setupCustomizationOptions=function()
{
	try
	{
		var toolMenu;
		if ((this.myTool != null) &&
			(this.myTool.Tools.Exists("ToolsMenu")))
		{
			toolMenu = this.myTool.Tools["ToolsMenu"];
			// ** Reset To Base **
			if (!this.myTool.Tools.Exists("ResetLayoutsToBaseTool"))
			{
			    //this.myTool.Tools.Remove(myTool.Tools["ResetLayoutsToBaseTool"]);
			    var btResetLayoutsToBase = new ButtonTool("ResetLayoutsToBaseTool",{"Type":"ButtonTool","Caption":EpiString.getString("ResetLayoutstoBase")});
			    this.setToolImage(btResetLayoutsToBase, "ResetLayouts");
			    this.myTool.Tools.Add(btResetLayoutsToBase);
			    toolMenu.Tools.InsertTool(7, "ResetLayoutsToBaseTool");
            }
            else
				toolMenu.Tools["ResetLayoutsToBaseTool"].SetVisible(true);
            
			// ** Reset To Last Saved **
			if (!this.myTool.Tools.Exists("ResetLayoutsToLastSavedTool"))
			{
				//this.myTool.Tools.Remove(this.myTool.Tools["ResetLayoutsToLastSavedTool"]);
			    var btResetLayoutsLastSaved = new ButtonTool("ResetLayoutsToLastSavedTool",{"Type":"ButtonTool","Caption":EpiString.getString("ResetLayoutstoLastSaved")});
			    this.setToolImage(btResetLayoutsLastSaved, "ResetLayouts");
			    this.myTool.Tools.Add(btResetLayoutsLastSaved);
			    toolMenu.Tools.InsertTool(8, "ResetLayoutsToLastSavedTool");
			}

		    if (!toolMenu.Tools["TransUIUtilTool"])
		    {
		        var bt = new ButtonTool("TransUIUtilTool",{"Type":"ButtonTool","Caption":EpiString.getString("TranslationUtility")});
			    this.setToolImage(bt, "TranslationUtility");
			    this.myTool.Tools.Add(bt);
			    toolMenu.Tools.InsertTool(8, "TransUIUtilTool");
		    }
		    else
                toolMenu.Tools["TransUIUtilTool"].SetVisible(true);
            
             if (!toolMenu.Tools["RefreshTranslationTool"])
		    {
		        var bt = new ButtonTool("RefreshTranslationTool",{"Type":"ButtonTool","Caption":EpiString.getString("RefreshTranslation")});
			    this.setToolImage(bt, "RefreshTranslationTool");
			    this.myTool.Tools.Add(bt);
			    toolMenu.Tools.InsertTool(8, "RefreshTranslationTool");
		    }
		    else
                toolMenu.Tools["RefreshTranslationTool"].SetVisible(true);
		}
	}
	catch (ex)
	{
		//TraceProvider.TraceCatchException(ex);
	}
}
EpiBaseForm.prototype.setupAddNewOptions=function()
{
    var addMenu = null;
    var addTool = null;
    var filMenu = null;

    if (this.myTool != null)
    {
        if(this.myTool.allTools == true  && !(this instanceof EpiHostForm))
        {
            if (this.myTool.Tools[this.fileMenu] && this.trans.CountAddViews > 1)
			{
			    filMenu = this.myTool.Tools[this.fileMenu];
		        filMenu.Tools[this.newMenu].SharedProps.Caption = EpiString.getString("NewElipses"); // "New...";
		    }
		    return;
        }
	    try
	    {
		    if (this.myTool.Tools[this.newMenu])
			    addMenu = this.myTool.Tools[this.newMenu];

		    if (this.myTool.Tools[this.fileMenu])
			    filMenu = this.myTool.Tools[this.fileMenu];

		    if (this.myTool.Tools[this.newTool])
			    addTool = this.myTool.Tools[this.newTool];

		    if (this.trans.CountAddViews > 1)
		    {
			    if (addTool != null)
			    {
				    addTool.SetVisible(false); 
			    }
			    if (addMenu != null)
			    {
				    addMenu.SetVisible(true);
                    this.setToolImage(addMenu, "New");

				    var newAddButtons = new SortedList();                   
				    var transDVs = this.trans.AddEpiDataViews;
				    for (var de in transDVs.items)
				    {
					    var edv = transDVs[de];
					    if (edv.AddText)
					    {
					        var tKey = "EpiAddNew" + edv.AddText;

                            // TODO: this needs message strings per assembly which we dont have yet
					        var txt = EpiString.GetAddText(edv.AddText);
    					   					   
					        if (txt.length <= 0)
						        txt = edv.AddText;
					        if (txt.length > 0)
					        {
						        var addBtn = new Tool(tKey, {"Caption":txt,"Type":"ButtonTool"});
                                this.setToolImage(addBtn, "New");

						        // ** remove if already exists **
						        // We don't really need this since we clear the item before adding the new tool.
    //						    if (this.myTool.Tools[tKey])
    //							    this.myTool.Tools.Remove(this.myTool.Tools[tKey]);
						        this.myTool.Tools.Add(addBtn);
						        newAddButtons.Add(edv.AddedIdx, addBtn);
					        }
					    }
				    }
				    
				    var keys = newAddButtons.get_Keys();
				    for (var de in keys.items)
				    {
					    var bt = newAddButtons.items[keys[de]];
					    addMenu.Tools.AddTool(bt.Key);
				    }

                    if (newAddButtons.Count == 0)
				        addMenu.SetVisible(false);
                    else
                    {    
				        if (filMenu != null)
				        {
					        var hasTool = false;
					        var hasMenu = false;
					        if (filMenu.Tools[this.newTool] != undefined) hasTool = true;
					        if (filMenu.Tools[this.newMenu] != undefined) hasMenu = true;
    					    
    //					    for (var tb in filMenu.Tools)
    //					    {
    //					        tb = filMenu.Tools[tb];
    //						    if (tb.Key == this.newTool)
    //							    hasTool = true;
    //						    if (tb.Key == this.newMenu)
    //							    hasMenu = true;
    //					    }
					        if (hasTool & !hasMenu)
					        {
						        var newPos = filMenu.Tools.IndexOf(this.newTool);
						        filMenu.Tools.InsertTool(newPos, this.newMenu);
						        filMenu.Tools[this.newMenu].SharedProps.Caption = EpiString.getString("NewElipses"); // "New...";
					        }
				        }
				    }
			    }
		    }
		    else
		    {
			    if (addMenu != null)
			    {
				    addMenu.SetVisible(false);
			    }
			    if (addTool != null)
			    {
				    addTool.SetVisible(true);
                    this.setToolImage(addTool, "New");
			    }
		    }
	    }
	    catch (ex)
	    {
		    MessageBox.Show(ex.description, new EpiOverloadedArgs("String"));
	    }
    }
}

EpiBaseForm.prototype.OnCurrencyCheckChanged=function(sender,args)
{
    this.CurrentCurrencyCode = args.SelectedCurrencyCode;
	var iEnum = this.MyCurrencyConvers.GetEnumerator();
	while (iEnum.MoveNext())
	{
		iEnum.Value.ToggleCurrency(args.SelectedCurrencyCode);
	}

	iEnum = this.MyEpiGrids.GetEnumerator();
	while (iEnum.MoveNext())
	{
		iEnum.Value.HideShowCurrencyColumns(args.SelectedCurrencyCode);
	}

//	//set the text in the status bar
//	adjustStatusBarText(args.SelectedCurrencyCode);
}
EpiBaseForm.prototype.OnAfterGetByID=function()
{
    this.get_Event("AfterGetByID").fire(); 
}
EpiBaseForm.prototype.EnableControls=function(ctrl) 
{
    if (ctrl == this)
    {
        this.allCtrlsDisabled = false;
        var topPanel = Global.document.getElementById("div_TopLevelPanel");
        
        if(topPanel)
        {
            Global.BindingEngine.Controls["div_TopLevelPanel"] = new EpiPanel({"ID":"div_TopLevelPanel"});
            
            Global.IsBindAll = true;
            Global.BindingEngine.BindTab(topPanel);
            Global.IsBindAll = false;
        }
    }
    else if (ctrl && ctrl.ID)
    {
        var htmlElem = Global.document.getElementById(ctrl.ID);
        if (htmlElem)
            ctrl.SetEnabled(htmlElem, true);
    }
}
EpiBaseForm.prototype.DisableControls=function(parentCtrl)
{
    if (parentCtrl == this)
    {
        this.allCtrlsDisabled = true;
         var topPanel = Global.document.getElementById("div_TopLevelPanel");
        
        if(topPanel)
        {
            Global.BindingEngine.Controls["div_TopLevelPanel"] = new EpiPanel({"ID":"div_TopLevelPanel"});
            
            Global.IsBindAll = true;
            Global.BindingEngine.BindTab(topPanel);
            Global.IsBindAll = false;
        }
    }
    else if (parentCtrl && parentCtrl.ID)
    {
        var htmlElem = Global.document.getElementById(parentCtrl.ID);
        if (htmlElem)
            parentCtrl.SetEnabled(htmlElem, false);
    }
}
EpiBaseForm.prototype.OnClickDelete=function(){}
EpiBaseForm.prototype.OnClickRefresh=function(){}
EpiBaseForm.prototype.OnClickRefreshTranslation=function(){}
EpiBaseForm.prototype.OnClickClear=function(){}
EpiBaseForm.prototype.OnClickSave=function(){}
EpiBaseForm.prototype.OnClickMemo=function(){}
EpiBaseForm.prototype.OnClickAuditLog=function(){}
EpiBaseForm.prototype.OnClickNew_1=function(addText){}
EpiBaseForm.prototype.OnClickNew_2=function(){}
EpiBaseForm.prototype.OnClickNew=function()
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    switch(overload)
    {
        case "String":
             this.OnClickNew_1(a[0]);
             break;
        case "": 
            this.OnClickNew_2();
            break;
    }
}

EpiBaseForm.prototype.OnClickCallLog=function(){}
EpiBaseForm.prototype.OnClickChangeLog=function(){}
EpiBaseForm.prototype.OnClickMiscTool=function(ToolKey){}
EpiBaseForm.prototype.SetDisplay=function(){};

EpiBaseForm.prototype.OnClickViewReports=function()
{
    LaunchEngine.OpenForm("EWAReport.aspx");
}

EpiBaseForm.prototype.addPopupMenuTool=function(PopupMenuKey, ToolKey)
{
    if(!this.myTool) return;

	var pmt;
	if(this.myTool.Tools.IndexOf(PopupMenuKey) > -1)
	{
		pmt = this.myTool.Tools[PopupMenuKey];
	}
	else
	{
		return;
	}

	if (pmt != null)
	{
		switch(PopupMenuKey)
		{
			case "EditMenu":
				if (pmt.Tools.IndexOf("UndoTool")>=0)
					pmt.Tools.InsertTool(pmt.Tools.IndexOf("UndoTool"), ToolKey);
				else
					pmt.Tools.AddTool(ToolKey);
				break;

			case "FileMenu":
				if (pmt.Tools.IndexOf("PrintPreviewTool")>=0)
					pmt.Tools.InsertTool(pmt.Tools.IndexOf("PrintPreviewTool"), ToolKey);
				else
					pmt.Tools.InsertTool(pmt.Tools.Count-1, ToolKey);
				break;
			
			case "ToolsMenu":
				pmt.Tools.InsertTool(pmt.Tools.Count-1, ToolKey);
				break;

			case "HelpMenu":
				pmt.Tools.InsertTool(0, ToolKey);
				break;

			default:
				pmt.Tools.AddTool(ToolKey);
				break;
		}
	}
}

EpiBaseForm.prototype.addToolbarTool=function(Toolbar, ToolKey)
{
    if(!this.myTool) return;

	var utb = this.myTool.Toolbars[Toolbar];
	if (utb != null)
	{
		switch(Toolbar)
		{
			case "Standard Tools":
//			    if(this._assembly.StartsWith("UIRpt.") && ToolKey=="ProcessTool") // GenerateOnly is replaced by Print Preview for report forms
//			    {
//				    utb.Tools.InsertTool(utb.Tools.IndexOf("GenerateTool")+1, ToolKey);
//				}
//				else
//				{
				    utb.Tools.InsertTool(utb.Tools.IndexOf("DeleteTool")+1, ToolKey);
//				}
				break;

			case "Navigation":
				utb.Tools.InsertTool(utb.Tools.IndexOf("PrimarySearchTool")+1, ToolKey);
				break;
		}
	}
}


EpiBaseForm.prototype.SetupToolbarImages=function(ToolbarManager)
{
    if(!ToolbarManager) return;
    if (ToolbarManager.tbImagesSet == true) return;
    var toolkey = "";
    var image = "";
    var tc = ToolbarManager.Tools.items;
    
    for(var tk in toolbaritems)
    {
        toolkey = tk;
        image = toolbaritems[tk];
        if (tc[toolkey])
        {
            try
            {
                this.setToolImage(tc[toolkey], image);
            }
            catch(e) {}
        }
        
    }
    ToolbarManager.tbImagesSet = true;
}
EpiBaseForm.prototype.SetToolImage = function (tool, imageName)
{
    if (!this.myTool) return;
    this.setToolImage(this.myTool.Tools[tool], imageName);
}
EpiBaseForm.prototype.setToolImage=function(tool, imageName)
{
    tool.SharedProps.AppearancesLarge.Appearance.set_Image(EpiUIImages.LargeEnabledImages.get_Image(EpiUIImages.IndexOf(imageName)));
	//tool.SharedProps.AppearancesSmall.Appearance.set_Image(EpiUIImages.SmallEnabledImages.get_Image(EpiUIImages.IndexOf(imageName)));
}


// Currency toggle methods
var CurrStrings={"UTB_CURRENCY":"_utbCurrencyToggle","SBT_CURRENCY":"_sbtCurrencyToggle","SBT_CURRENCYTOOL":"_cctCurrencyToggleTool","CCT_CURRENCY":"_cctCurrencyToggle","UTB_STANDARD":"Standard Tools"};
var CurrencyToggleCode = {"BASE":"BASE","DOC":"DOC","RPT1":"RPT1","RPT2":"RPT2","RPT3":"RPT3","GLOBAL":"GLOBAL","Unspecified":"Unspecified"};
EpiBaseForm.CurrencyCheckedState = false;
EpiBaseForm.prototype.AddCurrencyToggle=function()
{    
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    switch(overload)
    {
        case "String_String_String_Boolean":
            this.AddCurrencyToggle_1(a[0],a[1],a[2],a[3]);
            break;
        case "String":
            this.AddCurrencyToggle_2(a[0]);
            break;
        case "String_String_String":
            this.AddCurrencyToggle_3(a[0],a[1],a[2]);
            break;
        case "String_String_String_Boolean_String_String":
            this.AddCurrencyToggle_4(a[0],a[1],a[2],a[3],a[4],a[5]);
            break;
        case "String_String":
            this.AddCurrencyToggle_5(a[0],a[1]);
            break;
        case "":
            this.AddCurrencyToggle_6();
            break;
    }
}
EpiBaseForm.prototype.AddCurrencyToggle_1=function(Caption,CheckedText,UnCheckedText,IsChecked)
{
    this._currencyCaption = Caption;
	this._currencyCheckedText = CheckedText;
	this._currencyUncheckedText = UnCheckedText;
	this._currencyChecked = IsChecked;
	this.AddCurrencyToggle_6();
}
EpiBaseForm.prototype.AddCurrencyToggle_2=function(Text)
{
	this._currencyCaption = Text;
	this.AddCurrencyToggle_6();
}
EpiBaseForm.prototype.AddCurrencyToggle_3=function(Text,BaseCurrCodeBinding,DocCurrCodeBinding)
{
    this._currencyCaption = Text;
	this.baseCurrCodeBinding = BaseCurrCodeBinding;
	this.docCurrCodeBinding = DocCurrCodeBinding;
	this.AddCurrencyToggle_6();
}
EpiBaseForm.prototype.AddCurrencyToggle_4=function(Caption,CheckedText,UnCheckedText,IsChecked,BaseCurrCodeBinding,DocCurrCodeBinding)
{
    this._currencyCaption = Caption;
	this._currencyCheckedText = CheckedText;
	this._currencyUncheckedText = UnCheckedText;
	this._currencyChecked = IsChecked;
	this.baseCurrCodeBinding = BaseCurrCodeBinding;
	this.docCurrCodeBinding = DocCurrCodeBinding;
	this.AddCurrencyToggle_6();
}
EpiBaseForm.prototype.AddCurrencyToggle_5=function(BaseCurrCodeBinding,DocCurrCodeBinding)
{
   this.baseCurrCodeBinding = BaseCurrCodeBinding;
   this.docCurrCodeBinding = DocCurrCodeBinding;
   this.AddCurrencyToggle_6();
}
EpiBaseForm.prototype.AddCurrencyToggle_6=function()
{
    if(this.myTool == null || this.myTool.Toolbars[CurrStrings.UTB_CURRENCY] == undefined) { return; }
	if (this.hasCurrencyToggleAdded) return;
    this.hasCurrencyToggleAdded = true;

    //set text after added & after the check state is init
    var uiCtrl = Global.document.getElementById(this.cbtCurrencyDropdown.ID);
    if (Global.document.all)
        uiCtrl.style.display = "inline";
   else
        uiCtrl.style.display = "-moz-inline-box";

	this.currencyVisible = true;
	this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].SetVisible(this.currencyVisible);

    //get the text for the status panel
	this.baseCurrText = EpiString.getString("EpiBaseCurrency");
	this.docCurrText = EpiString.getString("DocCurrency");
    this.rpt1CurrText = "Reporting";
    this.rpt2CurrText = "Reporting";
    this.rpt3CurrText = "Reporting";
    
    this.docCurrCode = "";
    
    this.currencyList = new DataTable(new EpiOverloadedArgs(""));
    this.currencyList.AddColumn("Code",System.String,new EpiOverloadedArgs("String_Type"));
    this.currencyList.AddColumn("CurrCode",System.String,new EpiOverloadedArgs("String_Type"));
    this.cbtCurrencyDropdown.set_DataSource(this.currencyList);
    this.cbtCurrencyDropdown.set_DisplayMember("CurrCode");
    this.cbtCurrencyDropdown.set_ValueMember("Code");
    this.cbtCurrencyDropdown.SetColumnFilter("CurrCode");
    this.cbtCurrencyDropdown.InitDropControl(uiCtrl);

	// verify that the currency code bindings are valid
	if(this.baseCurrCodeBinding != "" || this.docCurrCodeBinding != "")
	{
		var baseBad = false;
		var docBad = false;
		var sb = new StringBuilder("The following error(s) occured: ");

		if(this.baseCurrCodeBinding.indexOf(".") == -1)
			baseBad = true;
		else
		{
			var table = this.baseCurrCodeBinding.substring(0, this.baseCurrCodeBinding.indexOf("."));
			var dv = Global.BindingEngine.EpiDataViews[table];
			if(!dv)
				baseBad = true;
			else
			{
				var sep = this.baseCurrCodeBinding.indexOf(".");
				if(!(dv.dataView.Table.Columns[this.baseCurrCodeBinding.substring(sep+1)]))
					baseBad = true;
			}
		}

		if(this.docCurrCodeBinding.indexOf(".") == -1)
			docBad = true;
		else
		{
			var table = this.docCurrCodeBinding.substring(0, this.docCurrCodeBinding.indexOf("."));
			var dv = Global.BindingEngine.EpiDataViews[table];
			
			if(!dv)
				docBad = true;
			else
			{
				var sep = this.baseCurrCodeBinding.indexOf(".");
				if(!(dv.dataView.Table.Columns[this.baseCurrCodeBinding.substring(sep+1)]))
					docBad = true;
			}
		}

		if(docBad)
			sb.Append("The doc currency binding is invalid.");

		if(baseBad)
		{
			if(docBad)
				sb.Append("\r\n");

			sb.Append("The base currency binding is invalid.");
		}

		if(docBad || baseBad)
		{
//		    MessageBox.Show(sb.ToString());
		    return;
		}
		else
		{
			var table = this.baseCurrCodeBinding.substring(0, this.baseCurrCodeBinding.indexOf("."));
			var baseView = Global.BindingEngine.EpiDataViews[table];
			
			baseView.get_Event("EpiViewNotification").subscribe(this.baseView_EpiViewNotification, this, true);
		}
	}
	
	this._currencyToggleEnabled = true;

	// make sure all of the currency controls are synched up
	this.OnCurrencyCheckChanged(this.cbtCurrencyDropdown,new CurrencyCheckChangeArgs(CurrencyToggleCode.DOC));
}
EpiBaseForm.prototype.SetCurrencyToggleCode=function(currencyCode)
{
    var result = false;
    if (this.cbtCurrencyDropdown != null && this.cbtCurrencyDropdown.get_RowCount() > 0 )
    {
        var selCode = currencyCode.toString();
        this.cbtCurrencyDropdown.set_Value(currencyCode);
        if(this.cbtCurrencyDropdown.get_Value()==currencyCode) result=true;
    }

    return result;
}
EpiBaseForm.prototype.baseView_EpiViewNotification=function(view, args)
{
    var stateToSet = this.GetCurrentCurrencyToggleCode();

    if(this.myTool!=null && this.myTool.Toolbars[CurrStrings.UTB_CURRENCY] &&
        this.myTool.Toolbars[CurrStrings.UTB_CURRENCY].Tools[CurrStrings.SBT_CURRENCYTOOL])
    {
        this.settingCurrencyList = true;
        if (args.Row > -1)
        {
            var currCodeChanged = false;
			var table = this.docCurrCodeBinding.substring(0, this.docCurrCodeBinding.indexOf("."));
			var docView = Global.BindingEngine.EpiDataViews[table];
			if (docView && docView.Row > -1 && docView.dataView.Count > 0)
            {
                var col = this.docCurrCodeBinding.substring(this.docCurrCodeBinding.indexOf(".") + 1);
                if (this.docCurrCode != docView.dataView.Rows[docView.Row][col].toString())
                {
                    this.docCurrCode = docView.dataView.Rows[docView.Row][col].toString();
                    currCodeChanged = true;
                }
            }

            if (currCodeChanged)
            {
                var val = "";
                this.currencyList.Clear();
                if(this.docCurrCode && this.docCurrCode!="")
                {
                    this.currencyList.AddRow(["DOC",this.docCurrCode],new EpiOverloadedArgs("ObjectArr"));
                    stateToSet = CurrencyToggleCode.DOC;
                    if(val=="") val = "DOC";
                }

                var session = this.Session;
                if (session != null)
                {
                    if (session.CurrencyCodes["BASE"]
                        && (this.baseCurrCodeBinding != this.docCurrCodeBinding)
                        && (this.docCurrCode != session.CurrencyCodes["BASE"].CurrencySymbol))
                    {
                        this.currencyList.AddRow(["BASE",session.CurrencyCodes["BASE"].CurrencySymbol],new EpiOverloadedArgs("ObjectArr"));
                        if(val=="") val = "BASE";
                    }

                    if (session.CurrencyCodes["RPT1"])
                    {
                        this.currencyList.AddRow(["RPT1",session.CurrencyCodes["RPT1"].CurrencySymbol],new EpiOverloadedArgs("ObjectArr"));
                        if(val=="") val = "RPT1";
                    }

                    if (session.CurrencyCodes["RPT2"])
                    {
                        this.currencyList.AddRow(["RPT2",session.CurrencyCodes["RPT2"].CurrencySymbol],new EpiOverloadedArgs("ObjectArr"));
                        if(val=="") val = "RPT2";
                    }

                    if (session.CurrencyCodes["RPT3"])
                    {
                        this.currencyList.AddRow(["RPT3",session.CurrencyCodes["RPT3"].CurrencySymbol],new EpiOverloadedArgs("ObjectArr"));
                        if(val=="") val = "RPT3";
                    }
                }
                
                this.cbtCurrencyDropdown.set_Enabled(true,true);
                this.cbtCurrencyDropdown.set_Value(val);
                this.CurrentCurrencyCode = val;
            }
        }
        else
        {
            if (view.dataView.Count == 0)
            {
                this.currencyList.Clear();
                this.docCurrCode = String.Empty;
                this.cbtCurrencyDropdown.set_Value("");
                this.cbtCurrencyDropdown.set_Enabled(false,true);
                this.CurrentCurrencyCode = "";
            }
        }
        this.settingCurrencyList = false;
    }

	this.adjustStatusBarText(this.CurrencyCheckedState);
}
EpiBaseForm.prototype.get_CurrentCurrencyToggleCode=function()
{
    return this.GetCurrentCurrencyToggleCode();
}
EpiBaseForm.prototype.GetCurrentCurrencyToggleCode=function()
{
    var selCode = CurrencyToggleCode.DOC;
    if(this.cbtCurrencyDropdown!=null)
    {
        var value = this.cbtCurrencyDropdown.get_Value();
        if(value!=null) selCode = value;
    }
    return selCode;
}
EpiBaseForm.prototype.cbtCurrencyDropdown_ToolValueChanged=function(sender, e)
{
    if (!this.settingCurrencyList)
    {
        this.OnCurrencyCheckChanged(this.cbtCurrencyDropdown, new CurrencyCheckChangeArgs(this.GetCurrentCurrencyToggleCode()));
    }
}
// TODO: Status bar with panels
EpiBaseForm.prototype.adjustStatusBarText=function(IsBase)
{
    // TODO
//	if(mySBP == null) return;
//	
//	// make sure our panel is still there
//	bool found = false;
//	foreach(UltraStatusPanel usp in mySBP.Panels)
//	{
//		if(usp.Key == SBT_CURRENCY)
//		{
//			found = true;
//			break;
//		}
//	}

//	if(!found) return;

//	if(IsBase)
//		mySBP.Panels[SBT_CURRENCY].Text = baseCurrText;
//	else
//		mySBP.Panels[SBT_CURRENCY].Text = docCurrText;

	var currCode = new StringBuilder("");

    if(IsBase == 'true')
		currCode.Append(this.baseCurrText);
	else
		currCode.Append(this.docCurrText);
 

	if( this.baseCurrCodeBinding != "" || this.docCurrCodeBinding != "")
	{
		var baseCurr = "";
		var docCurr = "";
		
		var table = this.baseCurrCodeBinding.substring(0, this.baseCurrCodeBinding.indexOf("."));
		this.baseView = Global.BindingEngine.EpiDataViews[table];
		if(this.baseView && this.baseView.Row > -1 && this.baseView.dataView.Count > 0)
		{
			baseCurr = this.baseView.dataView.Rows[this.baseView.Row][this.baseCurrCodeBinding.substring(this.baseCurrCodeBinding.indexOf(".")+1)].toString();
			if(IsBase == 'true')
			{
				currCode.Append(": ");
				currCode.Append(baseCurr);
			}
		}	
		
		table = this.docCurrCodeBinding.substring(0, this.docCurrCodeBinding.indexOf("."));
		var docView = Global.BindingEngine.EpiDataViews[table];
		if(docView && docView.Row > -1 && docView.dataView.Count > 0)
		{
			docCurr = docView.dataView.Rows[docView.Row][this.docCurrCodeBinding.substring(this.docCurrCodeBinding.indexOf(".")+1)].toString();
			if(IsBase == 'false')
			{
				currCode.Append(": ");
				currCode.Append(docCurr);
			}
		}

		// if the curr codes are the same then disable the toggle
		// TODO: this code never seems to run in the win code, so the toggle toolbar item is always enabled.
		
//		if (this.uceCurrency != undefined)
//		{
//            var uiCtrl = Global.document.getElementById(this.uceCurrency.ID);
//		    
//			if(baseCurr == docCurr)
//			{
//    			    this.uceCurrency.SetEnabled(uiCtrl,false);
//			}
//			else
//			    this.uceCurrency.SetEnabled(uiCtrl,true);
//		}

//		mySBP.Panels[SBT_CURRENCY].Text += currCode.toString(); // TODO
		Global.window.status = currCode.toString();

	}
}
EpiBaseForm.prototype._getCurrencyToggleText=function(sender,senderCtrl)
{
    var sb = this._currencyCaption;

	if (this._currencyCheckedText && this._currencyCheckedText.length > 0)
	{
		if (sender.GetValue(senderCtrl) == true) // TODO: check if this should be "true"
			sb = this._currencyCheckedText;
		else
			sb = this._currencyUncheckedText;
	}
	return sb;
}

EpiBaseForm.prototype.myTVP_EpiTreeNodeAdding=function(args)
{
	var txt = "";
	if (args.AddText.length>0) txt = args.AddText;
	if (txt.length>0)
		this.OnClickNew(txt, new EpiOverloadedArgs('String'));
	else
		this.OnClickNew(new EpiOverloadedArgs(""));
}
// This is called from the opener form into a modeless launched form.
EpiBaseForm.prototype.SubscribeEvent=function(eventName, fn, obj, bOverride)
{
   var me = this;
   var p = obj;
   // Need to do this because the EpiEvent cannot call the method from the opener form directly (throws a 'Jscript object required' error). It has to go through the UIReflector interface.
   var evnt = this.get_Event(eventName).subscribe(function(){me.CallbackParentForm("CallFunction", this,fn, arguments);}, p, bOverride);
}
// Special processing for strange dialog code in UI.InspectionProcessEntry.SerialNumberStatusForm
EpiBaseForm.prototype.set_InspProcessingDataSet=function(value)
{
    if(this.Name=="SerialNumberStatusForm")
    {
        this.trans.Add("snsView",this.trans.snsView);
        this.trans.Add("uiView",this.trans.uiView);
        this.get_InspProcessingDataSet().get_SelectedSerialNumbers().Clear();
        this.get_InspProcessingDataSet().get_SNFormat().Clear();
        this.get_InspProcessingDataSet().Merge(value,true ,MissingSchemaAction.Ignore,new EpiOverloadedArgs("DataSet_Boolean_MissingSchemaAction"));

        this.loadSelectedSerialNumbers();
        Global.BindingEngine.BindForm();
    }
}

//------------------------------------
// EpiHostForm
//------------------------------------
var EpiHostForm = Epicor.Mfg.UI.FrameWork.UIApp.EpiHostForm = function (settings)
{
    if (settings.SkipProcessing == true) return;
    this.AppControllerPanel = settings.AppCtrlrPnl; // ID of the appcontrollerpanel
    EpiBaseForm.call(this,settings, "EpiHostForm");
}
EpiHostForm.prototype = new EpiBaseForm({"SkipProcessing":true});

EpiHostForm.prototype.get_Transaction=function() {return this.trans;}

EpiHostForm.prototype.OnFormLoaded=function()
{
    this.AppControlPanel = Global.BindingEngine.Controls[this.AppControllerPanel];
    this.AppControlPanel.GridPanels =this.gridPanels;
    this.AppControlPanel.IsHostedOnEpiHostForm=true;
    this.resetToolsOnAppController();
    this.AppControlPanel.AppController.SetBaqRefreshStatus();
    EpiBaseForm.prototype.OnFormLoaded.call(this);
}

EpiHostForm.prototype.resetToolsOnAppController=function()
{

    // if not BAQ main view then show the tools (let multiview transaction handle)
    if (!(this.trans.get_MainDataView() instanceof BAQDataView)) return;

    // collection of tools and methods that handle the click
    var tools = ["NewTool", "SaveTool", "DeleteTool"];
    var methods = ["HandleAdapterGetNew", "HandleAdapterUpdate", "HandleAdapterDelete"];
    for (var i = 0; i < methods.length; i++)
    {
    
        // Hide the Tool when derived AppController does not implement handler
        // The prototype methods will not match if the method is overridden.
        if ((localTrans.prototype[methods[i]]==AppController.prototype[methods[i]]) &&
            this.myTool.Tools.Exists(tools[i]))
            this.myTool.Tools[tools[i]].SharedProps.set_Visible(false);
            
        // hide undo when MainDataView is BAQDataView
        if ((this.myTool.Tools["SaveTool"] && !this.myTool.Tools["SaveTool"].SharedProps.Visible) &&
            this.trans.get_MainDataView() instanceof BAQDataView &&
            this.myTool.Tools.Exists("UndoTool"))
            this.myTool.Tools["UndoTool"].SharedProps.set_Visible(false);
    }
    if (this.myTool.Tools["NewTool"].SharedProps.Visible)
    {
        //addUptakeTool(); // TODO
    }
}

EpiHostForm.prototype.OnBeforeToolClick=function(tKey,toolObj)
{
    if (toolObj && toolObj.Tag && toolObj.Tag.IsContextMenu) return false;
     
    if (this.AppControlPanel && this.AppControlPanel.HandleToolClick(tKey,toolObj))
                return true;
    return false; //base.OnBeforeToolClick(tKey, ea);
}

//------------------------------------
// EpiTextBox
//------------------------------------
var EpiTextBox = Epicor.Mfg.UI.FrameWork.EpiTextBox = function (settings)
{
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");
    if (settings) 
    {
        this.Nullable = settings.Nullable;
    }
    if (this.EpiKeyField == true) Global.Form.keyControl = this;
    this.MaxLength = null;
} 
EpiTextBox.prototype = new EpiControl();
EpiTextBox.prototype.TypeName = "EpiTextBox";
EpiTextBox.prototype.set_MaxLength=function(val) {this.MaxLength=val;} // TODO
EpiTextBox.prototype.get_MaxLength=function() {return this.MaxLength;}
EpiTextBox.prototype.set_CharacterCasing=function(casing) {}
EpiTextBox.prototype.Resize = function(ctrl, h, w, limits)
{
	if (ctrl.style.display == "none") return;

	var bounds = this.getBounds(ctrl.offsetHeight, ctrl.offsetWidth, ctrl.offsetTop, ctrl.offsetLeft, h, w, limits);
	if (bounds)
	{
		ctrl.style.top = bounds.Top + "px";
		ctrl.style.left = bounds.Left + "px";
		ctrl.style.width = (bounds.Width - 6 > 0 ? bounds.Width - 6 : 0) + "px";
		ctrl.style.height = (bounds.Height - 6 > 0 ? bounds.Height - 6 : 0) + "px";

		if (this.EpiZone) 
		{
		    var zoneCtrl = Global.document.getElementById(this.EpiZone.ID);
		    if (zoneCtrl) this.EpiZone.adjustInfozoneAndParent(zoneCtrl);
		}
		
	}
}
EpiTextBox.prototype.get_TextLength=function() 
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) 
	{
	    return ctrl.value.length;
    }
    return 0;
}
EpiTextBox.prototype.set_Size=function(size)
{
    if (!size) size = {"Height":0,"Width":0};
    this.Height = size.Height;
    this.Width = size.Width;
    
    if(size.Height>0 && size.Width>0)
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl)
        {
            ctrl.style.height = (size.Height>=6)? (size.Height-6) + "px" : size.Height + "px";
            ctrl.style.width = (size.Width >= 6)?(size.Width-6) + "px": size.Width + "px";
        }
    }
}
EpiTextBox.prototype._initFocus=function(ctrl)
{
    if(!this.InGrid && !this._focusinit)
    {
        EpiEventManager.addListener(ctrl, "focus", this._focusin, this, true);
        this._focusinit=true;
    }
}
EpiTextBox.prototype.set_Text=function(val)
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) 
	{
	    this.SetText(ctrl,val);
        this.get_Event("TextChanged").fire();
        this.get_Event("ValueChanged").fire();

        Global.BindingEngine.TextChange(this,val);
    }
}

EpiTextBox.prototype.SelectText=function(ctrl)
{
    ctrl.select();
}
EpiTextBox.prototype.GetEnabled=function(ctrl)
{
    if(this.InGrid)
    {
        if(ctrl.tagName!="DIV") 
        {
            var div = ctrl.parentNode.getElementsByTagName("DIV");
            if(div) ctrl = div[0];
        }
        return !(ctrl.className == "disabled");
    }
    else
    {
        return  !(ctrl.className == this.TypeName + " ctrl-disabled");   
    }
}
EpiTextBox.prototype.SetEnabled=function(ctrl,enabledFlg, toolsFlg)
{
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);
    
    if(this.InGrid)
    {
        this.SetEnabledInGrid(ctrl, enabledFlg);   
    }
    else
    {
        if(!enabledFlg)
        {
            ctrl.className = this.TypeName + " ctrl-disabled";
            ctrl.readOnly = true;
            if(ctrl.tabIndex!="-1") ctrl.setAttribute("_tabIndex", ctrl.tabIndex);
            ctrl.tabIndex = "-1";             
        }
        else
        {
            ctrl.className = this.TypeName;
            ctrl.readOnly = false;
            if(ctrl.tabIndex<0 && ctrl.getAttribute("_tabIndex")!=null)
                ctrl.tabIndex = ctrl.getAttribute("_tabIndex");
        }
    }    
    
    this.OnEnabledChanged(ctrl);
}
EpiTextBox.prototype.SetValue=function(ctrl,val)
{
    this._prevValue=val;
    if(val==undefined) val = "";
    val = val.toString();
    if(!this.SaveFormatted || val=="") val = this.Format(val);

    if(this.InGrid && ctrl.style.display=="none") 
    {
        // When the setValue started, the grid control had focus, but it no longer does
        var td=ctrl.parentNode;
        if (td)
        {
            var divs = td.getElementsByTagName("DIV");
            if(divs.length > 0) ctrl = divs[0];        
        }
    }

    if(this.InGrid && ctrl.tagName=="DIV")
    {
        if(ctrl.innerHTML != val) ctrl.innerHTML = val;
    }
    else
    {
        ctrl.value = val;
    }
}
EpiTextBox.prototype.GetValue=function(ctrl, formattedFlg)
{
    var val;
    
    if(this.InGrid && ctrl.tagName=="DIV")
    {
        val = ctrl.innerHTML;
        if(val=="&nbsp;") val = "";
    }
    else
    {
        val = ctrl.value;
    }
    
    try
    {
        if(formattedFlg!=true && val != "") val = this.Unformat(val);
    }
    catch(err) 
    {
        return null;
    }
    
    return val;
}
EpiTextBox.prototype.SetChangeEvent=function(ctrl)
{
    if(!this.InGrid && !this.OnChangeSet)
    {
        EpiEventManager.addListener(ctrl, "change", this._change, this, true);
		EpiEventManager.addListener(ctrl, "keyup", this._keyuphandler, this, true);
        this.OnChangeSet = true;
    }
}

EpiTextBox.prototype._handleKeyPress = function (e) {
	var like = this.get_EpiContextMenuKey();
	if(like && like != "")
	{
        var ctrl = e.target||e.srcElement;//Global.document.getElementById(this.ID);

		var returnVal = ExtendedProperties.HandleKeyPress(this, e);
                
		if (returnVal) {

			if(!this.get_ReadOnly())
			{
				this.set_Text(returnVal);
				if(ctrl) 
				{
					this.OnChange(ctrl);
				}
			}
		}

        if(this.InGrid)
        {
            //Use the DIV instead... firefox likes it better
            var td=ctrl.parentNode;
            if (td)
            {
                var divs = td.getElementsByTagName("DIV");
                if(divs.length > 0) ctrl = divs[0];        
            }  
        
		    if(Global.KeyboardManager.ShiftKey==true) { Global.KeyboardManager.ShiftKey = false; }
		    if(Global.KeyboardManager.CtrlKey==true) { Global.KeyboardManager.CtrlKey = false; }
            this.Focus(ctrl);
        }
	}
	return;
}

EpiTextBox.prototype._keyuphandler = function (e) {
	var like = this.get_EpiContextMenuKey();
	if(like && like != "")
	{
		var returnVal = ExtendedProperties.HandleKeyPress(this, e);
		if (returnVal) {
			if(!this.get_ReadOnly())
			{
				this.set_Text(returnVal);
				var ctrl = Global.document.getElementById(this.ID);
				if(ctrl) 
				{
					this.OnChange(ctrl);
				}
				return;
			}
		}
	}
    var iKeyCode = (e) ? e.keyCode : Global.window.event.keyCode;
    if ((iKeyCode < 32 && iKeyCode != 8) || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
        return;
    }
    this.get_Event("TextChanged").fire();
}

EpiTextBox.prototype.Bind = function(bEngine, ctrl, dv, rowNum)
{
    this.SetChangeEvent(ctrl);

    var data = dv.dataView.get_Row(rowNum);

    if (!(this.HasInputTrackerPanelParent == true && this.DashboardPrompt == true))
    {
        var prevValue = this.get_Value();
        if (data && this.DataColumn)
            this.SetValue(ctrl, data.get_Item(this.DataColumn), true);
        else
        {
            if (this.TypeName == "EpiNumericEditor" && rowNum == -1)
                this.SetValue(ctrl, "0");
            else
                this.SetValue(ctrl, "");
        }

        if (prevValue != this.get_Value())
        { 
            this.get_Event("TextChanged").fire();
            this.get_Event("ValueChanged").fire();
        }
    }

    if (this.DataView && this.DataColumn && rowNum > -1 && bEngine.CurrentTab)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);

    this.RefreshProperties(ctrl, dv, rowNum);

    if (!this.initMaxLen)
    {
        this._applyMaxLength(dv, ctrl);
        this.initMaxLen = true;
    }

    return true;
}

EpiTextBox.prototype._applyMaxLength = function(dv,ctrl)
{
    if(this.DataView && this.DataColumn)
    {
        if(dv)
        {
            var tbl = dv.dataView.Table;
            var format = tbl.GetExtendedProperty(this.DataColumn, "Format");
            if (format.length > 0)
            {
                var length = 0;
                if (format.toUpperCase().StartsWith("X(") && format.EndsWith(")"))
                {
                    Int32.TryParse(format.Substring(2, format.length - 3));
                    length = Global.ArgManager["Out1"];
                    Global.ArgManager["Out1"] = null;
                }

                if (length == 0)
                {
                    length = format.length;
                }
                if (length > 0)
                    ctrl.maxLength = this.MaxLength = length;
            }
        }
   }
}
EpiTextBox.prototype.Format=function(val)
{
    if(this.Mask)  val = this.Mask.Format(val);

    return val;
}
EpiTextBox.prototype.Unformat=function(val)
{
    if(this.Mask) val = this.Mask.Unformat(val);

    return val;
}
EpiTextBox.prototype.GetHtmlForGrid=function(id, row,dt)
{
    var val = this.GetValFromRow(dt,row,this.DataColumn); //row[this.DataColumn];
    
    if(!this.SaveFormatted) val = this.Format(val);
    if (val && Global.IsString(val))
    {
        val = val.replace("<","&lt;");
        val = val.replace(">","&gt;");
    }
    
    var styleStr = "style='";
    if(this.TypeName=="EpiNumericEditor" || this.TypeName=="EpiCurrencyEditor") styleStr += "text-align:right;"
    styleStr+="height:13px;'";

    if(!val) val = "&nbsp";
    return "<div id='" + id + "' " + styleStr + "tabIndex='0'>" + val + "</div>";
}
EpiTextBox.prototype.FocusInGrid=function(ctrl)
{
    if(ctrl.getAttribute("_disabled")=="true") return;

    var td = ctrl.parentNode;

    var val = this.GetValue(ctrl, true);
    ctrl.innerHTML = "";
    
    var newCtrl = this._createInGrid(td, ctrl.id, val);     
    ctrl.style.display = "none";
        
    EpiEventManager.removeListener(newCtrl, "change", this._change);
    EpiEventManager.removeListener(newCtrl, "blur", this._blur);
	EpiEventManager.removeListener(newCtrl, "keyup", this._handleKeyPress);
        
    EpiEventManager.addListener(newCtrl, "change", this._change, this, true);
    EpiEventManager.addListener(newCtrl, "blur", this._blur, this, true);
	EpiEventManager.addListener(newCtrl, "keyup", this._handleKeyPress, this, true);
    
    var me = this;
    setTimeout(function() {try{newCtrl.focus(); newCtrl.select(); me._focusin(newCtrl); }catch(err){}},200); 
}
EpiTextBox.prototype._blur=function(e)
{
    var ctrl = e.target||e.srcElement;
    this._focusOutGrid(ctrl);
}

EpiTextBox.prototype._createInGrid=function(td, id, val)
{
    if(td==null) return;

    var ctrl;
    var fields = td.getElementsByTagName("input");
    
    if(fields.length > 0)
    {
        ctrl = fields[0];
    }
    else
    {
        ctrl = Global.document.createElement("input");
        if(this.TypeName=="EpiNumericEditor" || this.TypeName=="EpiCurrencyEditor" || this.TypeName=="EpiCurrencyConverGrid")
            ctrl.className = "EpiNumericEditor";

        td.appendChild(ctrl);
    }
    
    if(this.Mask)
    {
        this.ApplyMask(ctrl);
    }
    
    ctrl.style.display = "block";
    ctrl.id = id;
    ctrl.value = val;

    if (this._showReqd) this._setRequiredStyle(ctrl);
    return ctrl;
}
EpiTextBox.prototype._focusOutGrid=function(ctrl)
{
    var td = ctrl.parentNode;

    var div = td.getElementsByTagName("DIV");
    if(div.length>0)
    {
        ctrl.style.display = "none";

        var val = this.GetValue(ctrl, true);

        div[0].innerHTML = val;
        div[0].style.display = "";
    }
}
EpiTextBox.prototype.set_MaskText=function(value) 
{
    if(value==this.MaskText) return;

    var val = this.get_Value();
    this.MaskText = value;
    this.Mask = MaskEngine.Get(value);
    this.set_Value(val);    
}
EpiTextBox.prototype.get_Value=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) 
	{
	    var val = this.GetValue(ctrl);
	    // The Nullable property determines how an empty string is interpretted by the control for purposes of the Value property. When set to True the control.Value
        // will return null when the control contains no text. Otherwise, the Value will return String.Empty.
	    if (this.Nullable && val == "")
	        val = null;
	     return val;
	}
}
EpiTextBox.prototype.ApplyMask=function(ctrl)
{
    if(this.Mask)
    {
        if(Global.FormDir=="rtl") ctrl.dir="ltr";
    
        EpiEventManager.removeListener(ctrl, "keydown", this._keypressmask);
        EpiEventManager.removeListener(ctrl, "keypress", this._keypressmask);
        EpiEventManager.removeListener(ctrl, "focus", this._focusmask);
        EpiEventManager.removeListener(ctrl, "blur", this._blurmask);
        
        EpiEventManager.addListener(ctrl, "keydown", this._keypressmask, this, true);
        EpiEventManager.addListener(ctrl, "keypress", this._keypressmask, this, true);
        EpiEventManager.addListener(ctrl, "blur", this._blurmask, this, true);
       
    }
}
EpiTextBox.prototype.RemoveMask=function(ctrl)
{
    if(this.Mask)
    {
        var val = this.Mask.Unformat(ctrl.value);

        EpiEventManager.removeListener(ctrl, "keydown", this._keypressmask);
        EpiEventManager.removeListener(ctrl, "keypress", this._keypressmask);
        EpiEventManager.removeListener(ctrl, "focus", this._focusmask);
        EpiEventManager.removeListener(ctrl, "blur", this._blurmask);

        this.MaskText=null;
        this.Mask=null;

        ctrl.value = val;
    }
}

EpiTextBox.prototype._keypressmask=function(e)
{
    var charArr = this.Mask.CharArray;

    if(!this.Mask) return;
    if(charArr.length==0) return;
    
    var ctrl = e.target||e.srcElement;
    if(!this.GetEnabled(ctrl)) 
    {
        EpiEventManager.stopEvent(e);
        return;  
    }
    
    var pos = this.GetCaretPosition(ctrl);
    var emptySel = this.GetEmptySelText(ctrl, pos);
    var emptyLen = emptySel.length;    
    
    if(e.keyCode==8 || e.keyCode==46)  // Del & BkSp
    {
        var beforeText = ctrl.value.substring(0, pos-1);
        var afterText = emptySel + ctrl.value.substr((pos-1) + emptyLen);
        
        if(emptySel!="")
        {
            ctrl.value = beforeText + afterText;
            this.MoveToCaret(ctrl, beforeText.length);
        }
        else if(e.keyCode==8 && pos>1)
        {
            if(charArr[pos-2].Literal)
                this.MoveToCaret(ctrl, beforeText.length-1);
            else
            {
                ctrl.value = beforeText.substr(0, beforeText.length-1) + this.Mask.InputChar + afterText;
                this.MoveToCaret(ctrl, beforeText.length-1);
            }               
        }
        else if(e.keyCode==46 && pos<=ctrl.value.length)
        {
            if(charArr[pos-1].Literal)
                this.MoveToCaret(ctrl, beforeText.length +1);
            else
            {
                ctrl.value = beforeText + this.Mask.InputChar + afterText.substr(1);
                this.MoveToCaret(ctrl, beforeText.length+1);
            }    
        }
        EpiEventManager.stopEvent(e);
        this.Mask.SyncChars(ctrl.value);
        return;
    }
    else if(e.ctrlKey && ((Global.document.all && e.keyCode==86) || (!Global.document.all && e.charCode==118))) // Paste
    {
        var me = this;
        var val = ctrl.value;
        setTimeout(function() {me.ValidatePaste(ctrl, val, pos)},1); 
        return;
    }
    else if(e.ctrlKey && ((Global.document.all && e.keyCode==88) || (!Global.document.all && e.charCode==120))) // Cut
    {
        var me = this;
        setTimeout(function() {me.FillEmpty(ctrl, emptySel)},1); 
        return;
    }
    
    if(e.ctrlKey || e.altKey) return;

    var charVal;
    if(Global.document.all)
    {
        if(e.type=="keydown") return;
        charVal = String.fromCharCode(e.keyCode);
    }
    else
    {
        if(e.charCode==0) return;
        charVal = String.fromCharCode(e.charCode);
    }

    // The cursor is right before a literal, and the user typed the literal.
    if(emptyLen==0 && pos<=charArr.length && charArr[pos-1].Literal && charVal==charArr[pos-1].Char)
    {
        this.MoveToCaret(ctrl, pos);
        EpiEventManager.stopEvent(e);
        this.Mask.SyncChars(ctrl.value);
        return;
    }

    // If the selected text begins with a literal, then move the position over to the right until it's no longer a literal,
    // and alter the emptySel to not include the leading literal(s).
    while(pos < charArr.length && charArr[pos-1].Literal)
    {
        pos++;
        if(emptySel.length > 0) 
        {
            emptySel = emptySel.substr(1);
            emptyLen--;
        }
    }
    
    var beforeText = ctrl.value.substring(0, pos-1);
    var afterText = emptySel + ctrl.value.substr((pos-1) + emptyLen);

    // Find out what the next literal is.  
    var currPos = pos, nextLiteral;
    while(currPos < charArr.length && !nextLiteral)
    {
        if(charArr[currPos-1].Literal) 
        {
            nextLiteral = charArr[currPos-1].Char;

            // If the user typed in the value of the next literal, check to see if the only thing between the next literal 
            // and the cursor position is input characters (_).  If so, then move the cursor to after the literal that was
            // typed.
            if(nextLiteral==charVal)
            {
                for(var ii=0; ii<=afterText.length-1; ii++)
                {
                    var currChar = afterText.substr(ii,1);
                    if(currChar==nextLiteral)
                    {
                        beforeText=beforeText+afterText.substr(0,ii+1);
                        afterText=afterText.substr(ii+1);

                        this.MoveToCaret(ctrl, beforeText.length);
                        EpiEventManager.stopEvent(e);
                        this.Mask.SyncChars(ctrl.value);
                        return;
                    }
                    else if(currChar!=this.Mask.InputChar)
                    {
                        break;  //Do nothing
                    }
                }
            }
        }
        currPos++;
    }

    if(this.Mask.IsDate)
    {
        // Is this is a date attempt to figure out if the value entered is valid for the current mask section.  If not, try
        // it for the next section.  
        var newPos = this.Mask.GetDateCharPosition(charVal,pos,true);
        if(newPos==null)
        {
            EpiEventManager.stopEvent(e);
            this.Mask.SyncChars(ctrl.value);
            return;
        }
        else if(newPos!=pos)
        {
            var charDiff = newPos-pos;
            beforeText = beforeText + afterText.substr(0,charDiff);
            afterText = afterText.substr(charDiff);
        }
    }


    // Make sure the next position accepts input (_).  If it's not, then anything you type is ignored.
    if(afterText.substr(0, 1)==this.Mask.InputChar)
    {
        afterText = afterText.substr(1);
    }
    else
    {
        EpiEventManager.stopEvent(e);
        this.Mask.SyncChars(ctrl.value);
        return;
    }
    
    if(charVal==" ") charVal = this.Mask.InputChar;
    
    var newText = beforeText + charVal + afterText; 
    if(!this.Mask.IsValid(newText, true))
    {
        EpiEventManager.stopEvent(e);
        this.Mask.SyncChars(ctrl.value);
        return;
    }
    
    ctrl.value = newText;
    this.MoveToCaret(ctrl, beforeText.length + 1);
    this.CheckPosition(ctrl);
    
    EpiEventManager.stopEvent(e);
    this.Mask.SyncChars(ctrl.value);

    this.get_Event("MaskedTextChanged").fire(this,{"NewValue":newText});
}
EpiTextBox.prototype.ValidatePaste=function(ctrl, prevVal, prevPos)
{
    if(!this.Mask.IsValid(ctrl.value, true))
    {
        ctrl.value = prevVal;
        this.MoveToCaret(ctrl, prevPos-1);
    }
    this.Mask.SyncChars(ctrl.value);
}
EpiTextBox.prototype.FillEmpty=function(ctrl, emptySel)
{
    var pos = this.GetCaretPosition(ctrl);
    var beforeText = ctrl.value.substring(0, pos-1);
    var afterText = emptySel + ctrl.value.substr(pos-1);
    ctrl.value = beforeText + afterText;
    this.MoveToCaret(ctrl, beforeText.length);
    this.Mask.SyncChars(ctrl.value);
}
EpiTextBox.prototype._blurmask=function(e)
{
    if(!this.Mask) return;
    
    var ctrl = e.target||e.srcElement;
    if(!this.GetEnabled(ctrl)) return;
    
    this.OnChange(ctrl);
}
EpiTextBox.prototype.CheckPosition=function(ctrl)
{
	var origPos = this.GetCaretPosition(ctrl);
    var pos = origPos;

    while(pos < this.Mask.CharArray.length && this.Mask.CharArray[pos-1].Literal) pos++;
    
    if(origPos!=pos)
    {
		this.MoveToCaret(ctrl, pos-1);
    }
}
EpiTextBox.prototype.GetCaretPosition=function(ctrl)
{
    var i;
    if (Global.document.all)
    { 
    	i = ctrl.value.length+1; 
    
        var rng = Global.document.selection.createRange().duplicate(); 
        while (rng.parentElement()==ctrl && rng.move("character",1)==1) --i; 
    } 
    else
    {
        if(ctrl.selectionStart < ctrl.selectionEnd)
            i = ctrl.selectionStart + 1;
        else
            i = ctrl.selectionEnd + 1;
    }

    return i; 
}
EpiTextBox.prototype.MoveToCaret=function(ctrl, pos)
{
    if(Global.document.all)
    {
	    var rng = ctrl.createTextRange();
	    rng.collapse(true);
	    rng.move("character", pos);
	    rng.select();
    }
    else
    {
        ctrl.setSelectionRange(pos, pos);
    }
}
EpiTextBox.prototype.GetEmptySelText=function(ctrl, pos)
{
    if(!this.Mask) return;
    
    var emptyVal = "";
    var selLength = 0;   
    if(Global.document.all)
    {
	    var rng = Global.document.selection.createRange(); 
	    if (rng.parentElement() == ctrl) selLength = rng.text.length;
    }
    else
    {
        if(ctrl.selectionStart < ctrl.selectionEnd)
            selLength = ctrl.selectionEnd - ctrl.selectionStart;
        else
            selLength = ctrl.selectionStart - ctrl.selectionEnd;
    }
    
    if(selLength > 0)
    {
    	for(var ii=pos; ii<(pos + selLength); ii++)
	    {
		    if(this.Mask.CharArray[ii-1].Literal)
			    emptyVal += this.Mask.CharArray[ii-1].Char;
		    else
			    emptyVal += this.Mask.InputChar;
	    }
    }    
    
    return emptyVal;
}
//------------------------------------
// EpiTextArea
//------------------------------------
var EpiTextArea = Epicor.Mfg.UI.FrameWork.EpiTextArea = function (settings)
{
    EpiTextBox.call(this,settings);
    this._impl.push("IEpiBoundControl");
}
EpiTextArea.prototype = new EpiTextBox();
EpiTextArea.prototype.TypeName = "EpiTextArea";
EpiTextArea.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height-6>0?bounds.Height-6:0) + "px"; 
        ctrl.style.width = (bounds.Width-2>0?bounds.Width-2:0) + "px"; 
    }
}
EpiTextArea.prototype.SetValue=function(ctrl,val)
{
    this._prevValue=val;
    if(val==undefined) val = "";

    val = this.Format(val);
    
    if(ctrl.value!=val)
        ctrl.value = val; 
}
EpiTextArea.prototype.GetValue=function(ctrl)
{
    var val = ctrl.value;
    if(val=="&nbsp;") val = "";

    val = this.Unformat(val);
    
    return val;
}
EpiTextArea.prototype.Format=function(val)
{
    if(val==null) val="";
    val=val.toString();
    val = val.Replace("\\n","\n");

    return val;
}
EpiTextArea.prototype.Unformat=function(val)
{
    val = val.Replace("\r\n", "\n");
    
    return val;
}
EpiTextArea.prototype._createInGrid=function(td, id, val)
{
    var ctrl;
    var fields = td.getElementsByTagName("textarea");
    if(fields.length > 0)
    {
        ctrl = fields[0];
    }
    else
    {
        ctrl = Global.document.createElement("textarea");
        td.appendChild(ctrl);
    }

    ctrl.id = id;
    ctrl.innerHTML = val;
    ctrl.style.display = "block";
    if (this._showReqd) this._setRequiredStyle(ctrl);
    
    return ctrl;
}
//------------------------------------
// EpiNumericEditor
//------------------------------------
var EpiNumericEditor = Epicor.Mfg.UI.FrameWork.EpiNumericEditor = function (settings)
{
    EpiTextBox.call(this,settings);
    this.UOMIsQuantity = null;
    this._formatsInit = false;
    this.epiFormatResolved = null;
    
    this.IsCurrency = null;
    this.CurrencyDecimalType = CurrencyDecimalType.Unspecified;
    this.CurrencyType = CurrencyToggleCode.Unspecified;
    this.HasCurrencySiblings = true;
    this.useBaseCurrencyFormat = false;
    this._numericType = Infragistics.Win.UltraWinEditors.NumericType.Integer;
}
EpiNumericEditor.prototype = new EpiTextBox();
EpiNumericEditor.prototype.TypeName = "EpiNumericEditor";
EpiNumericEditor.prototype.set_FormatString=function(val){this.MaskInput=val;}
EpiNumericEditor.prototype.set_MaskInput=function(val){this.MaskInput=val;}
EpiNumericEditor.prototype._focusin=function(ctrl)
{
    if(ctrl) 
    {
        if(!ctrl.tagName) ctrl = ctrl.target||ctrl.srcElement;
        Global.Form._setActiveControl(ctrl);
        
        if (this.HasInputTrackerPanelParent == true && this.DashboardPrompt == true)
            return; // Dont update the control from the dataview if its a input prompt on a dashboard
        
	if (!this.DataView && !this.DataColumn)
	    return;

        var val = this.GetDataVal(ctrl);
        if(val==0) val = "0";
        var fVal = this.Format(val,true);
        if(fVal!=ctrl.value) 
        {
            ctrl.value = fVal;
            ctrl.select();

            EpiEventManager.removeListener(ctrl, "blur", this._focusout);
            EpiEventManager.addListener(ctrl, "blur", this._focusout, this, true);
        }
    }
}
EpiNumericEditor.prototype._focusout=function(ctrl)
{
    if(ctrl) 
    {
        if(!ctrl.tagName) ctrl = ctrl.target||ctrl.srcElement;
        
	if (!this.DataView && !this.DataColumn)
	    return;

        var val = this.GetValue(ctrl);
        if(val==0) val = "0";
        var fVal = this.Format(val,false);
        if(fVal!=ctrl.value) 
        {
            ctrl.value = fVal;
        }
    }
}
EpiNumericEditor.prototype.get_UOMIsQuantity=function()
{        
    if(this.UOMIsQuantity==null)
    {
        this.UOMIsQuantity = false;
        if(this.DataView && this.DataColumn)
        {
            var tbl = Global.BindingEngine.EpiDataViews[this.DataView].dataView.Table;
            var bizType = tbl.GetExtendedProperty(this.DataColumn,"BizType");
            if(bizType=="quantity") this.UOMIsQuantity = true;
        }
    }
    return this.UOMIsQuantity;    
}
EpiNumericEditor.prototype.Format=function(val,editFlg,ci)
{ 
    if(!this.formatsInit) this._initFormats();
    if(this.get_IsCurrency())
        return FormatEngine.FormatNumber(val, this._getFormatForCurrencyCode(editFlg),ci);
    else
        return FormatEngine.FormatNumber(val, this._getFormatForUom(editFlg),ci);
}
EpiNumericEditor.prototype._getFormatForUom=function(editFlg)
{
    var formatStr = this.FormatString;
    if(editFlg) formatStr = this.MaskInput;
    
    if(!this.InGrid && this.DataView && this.DataColumn && this.get_UOMIsQuantity())
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        if(dv!=null && dv.Row>=0)
        {
            var tbl = dv.dataView.Table;

            var uomColumn = tbl.GetExtendedProperty(this.DataColumn,"UomColumn");
            if(uomColumn!="") 
            {
                var uomCode = dv.dataView.Rows[dv.Row][uomColumn];

                var session = Global.Form.Session;
                if(session && !String.IsNullOrEmpty(uomCode) && session.UOMInfoList[uomCode])
                {
                    var decPlace = formatStr.LastIndexOf(".");
                    if (decPlace > -1) formatStr = formatStr.Substring(0, decPlace);

                    formatStr = formatStr.Substring(0, formatStr.length - 1) + "0";

                    var globalNumDecimals = session.UOMInfoList[uomCode].NumberOfDecimals;
                    if (globalNumDecimals > 0) formatStr += ".";
                    for (var x = 0; x < globalNumDecimals; x++)
                    {
                        formatStr += "0";
                    }
                }
            }
        }
    }
    return formatStr;
}
EpiNumericEditor.prototype._initFormats=function()
{
    if(this.MaskInput==null)
    {
        if(this.DataView && this.DataColumn)
        {
            var dv = Global.BindingEngine.EpiDataViews[this.DataView];
            if(dv)
            {
                var tbl = dv.dataView.Table;
                this.MaskInput = this.FormatString = tbl.GetExtendedProperty(this.DataColumn, "Format");
                if(this.get_UOMIsQuantity())
                {
                    var baseMask = this.MaskInput;
                    var decPlace = baseMask.LastIndexOf(".");
                    if (decPlace > -1)
                    {
                        baseMask = baseMask.Substring(0, decPlace);
                    }

                    // we always have eight decimal places for edit mode
                    this.MaskInput = baseMask + ".99999999";
                    var formatString = baseMask.Replace("n", "9");

                    if (Global.Form.Session != null)
                    {
                        formatString = formatString.Substring(0, formatString.length - 1);
                        formatString += "0";

                        session = Global.Form.Session;
                        var globalNumDecimals = session.UOMInfoList[session.UOMGlobalID].NumberOfDecimals;

                        if (globalNumDecimals > 0) formatString += ".";

                        for (var x = 0; x < globalNumDecimals; x++)
                        {
                            formatString += "0";
                        }
                    }
                    this.FormatString = formatString;
                }
            }
        }
        this.epiFormatResolved = this.MaskInput;
    }
    this.formatsInit = true;
}
EpiNumericEditor.prototype.Unformat=function(val)
{
    return FormatEngine.ToNumber(val, true);
}
EpiNumericEditor.prototype.IsValid=function(val)
{
    if(this.MaskInput!=null)
    {
    }
}
EpiNumericEditor.prototype.GetValue=function(ctrl,formattedFlg)
{
    var val = EpiTextBox.prototype.GetValue.call(this,ctrl,formattedFlg);
    //if(val=="" && val!=0) val = null;
    if(Global.IsString(val) && val=="") val = null;
    return val;
}
EpiNumericEditor.prototype.GetCultureValue=function(ci)
{
    var val = this.GetValue(Global.document.getElementById(this.ID), false);
    if (val == null) return "";
    if (ci == null)
        ci = Globalization.CultureInfo(""); // Invariant culture
    
    return this.Format(val, false, ci);
}
EpiNumericEditor.prototype.get_IsCurrency=function()
{
    if(this.IsCurrency==null)
    {
        this.IsCurrency = false;
        if(this.DataView && this.DataColumn)
        {
            var tbl = Global.BindingEngine.EpiDataViews[this.DataView].dataView.Table;
            var bizType = tbl.GetExtendedProperty(this.DataColumn,"BizType");
            if(bizType=="currency") this.IsCurrency = true;
            
            if(this.IsCurrency)
            {
                this.CurrencyDecimalType = tbl.GetExtendedProperty(this.DataColumn,"CurrencyDecimalType","G").toUpperCase();

                var currCodeCol = tbl.GetExtendedProperty(this.DataColumn,"CurrencyCodeCol","");
                if (currCodeCol=="") this.useBaseCurrencyFormat = true;
                this.CurrencyCodeColumn = currCodeCol;
                
                var dfltCurrType = CurrencyToggleCode.Unspecified;
                if(currCodeCol!="") dfltCurrType = "D";
                
                var currType = tbl.GetExtendedProperty(this.DataColumn,"CurrencyType",dfltCurrType);
                switch(currType.toUpperCase())
                {
                    case "B": this.CurrencyType=CurrencyToggleCode.BASE; break;
                    case "D": this.CurrencyType=CurrencyToggleCode.DOC; break;
                    case "R1": this.CurrencyType=CurrencyToggleCode.RPT1; break;
                    case "R2": this.CurrencyType=CurrencyToggleCode.RPT2; break;
                    case "R3": this.CurrencyType=CurrencyToggleCode.RPT3; break;
                    case "G": this.CurrencyType=CurrencyToggleCode.GLOBAL; break;
                }
                
                var colName = this.DataColumn.toUpperCase();
                if(!colName.StartsWith("DOC") && !colName.StartsWith("RPT"))
                {
                    if(!tbl.Columns["Doc"+this.DataColumn] && !tbl.Columns["Rpt1"+this.DataColumn])
                        this.HasCurrencySiblings = false;
                }
            }
        }
    }
    return this.IsCurrency;
}
EpiNumericEditor.prototype._getFormatForCurrencyCode=function(editFlg)
{
    var formatStr = this.MaskInput;

    if(this.get_IsCurrency() && this.DataView && this.DataColumn)
    {
        var session = Global.Form.Session;
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        var tbl = dv.dataView.Table;
        if(dv!=null && dv.Row>-1)
        {
            var dec = -1;
            if(this.InGrid && !editFlg)
                dec = 2;
            else
            {            
                if(this.HasCurrencySiblings || !this.useBaseCurrencyFormat) 
                {                                                           
                    if(this.CurrencyType!=CurrencyToggleCode.DOC)
                    {   
                        if(session!=null && this.CurrencyType!=CurrencyToggleCode.Unspecified)
                        {
                            if(session.CurrencyCodes[this.CurrencyType])
                            {
                                switch(this.CurrencyDecimalType)
                                {
                                    case CurrencyDecimalType.General:
                                    case CurrencyDecimalType.Unspecified:
                                        dec = session.CurrencyCodes[this.CurrencyType].DecimalsGeneral;
                                        break;
                                    case CurrencyDecimalType.Price:
                                        dec = session.CurrencyCodes[this.CurrencyType].DecimalsPrice;
                                        break;
                                    case CurrencyDecimalType.Cost:
                                        dec = session.CurrencyCodes[this.CurrencyType].DecimalsCost;
                                        break;
                                }
                                if(dec==null) dec = -1;
                            }                       
                        }
                    }
                    else
                    {   // Test this too
                        if(session!=null && !String.IsNullOrEmpty(this.CurrencyCodeColumn))
                        {
                            var currCode = dv.dataView.Rows[dv.Row][this.CurrencyCodeColumn];
                            if(currCode)
                            {
                                if(session.CurrencyInfoList[currCode])
                                {
                                    switch(this.CurrencyDecimalType)
                                    {
                                        case CurrencyDecimalType.General:
                                        case CurrencyDecimalType.Unspecified:
                                            dec = session.CurrencyInfoList[currCode].DecimalsGeneral;
                                            break;
                                        case CurrencyDecimalType.Price:
                                            dec = session.CurrencyInfoList[currCode].DecimalsPrice;
                                            break;
                                        case CurrencyDecimalType.Cost:
                                            dec = session.CurrencyInfoList[currCode].DecimalsCost;
                                            break;
                                    }
                                    if(dec==null) dec = -1;
                                }
                            }
                        }
                    }
                }
                if(dec==-1)
                {   
                    if(session!=null)
                    {
                        switch(this.CurrencyDecimalType)
                        {
                            case CurrencyDecimalType.General:
                            case CurrencyDecimalType.Unspecified:
                                dec = session.CurrencyCodes["BASE"].DecimalsGeneral;
                                break;
                            case CurrencyDecimalType.Price:
                                dec = session.CurrencyCodes["BASE"].DecimalsPrice;
                                break;
                            case CurrencyDecimalType.Cost:
                                dec = session.CurrencyCodes["BASE"].DecimalsCost;
                                break;
                        }
                        if(dec==null) dec = -1;
                    }
                }
            }
            if(dec > -1)
            {
                var decLoc = formatStr.indexOf(".");
                if(decLoc!=-1) formatStr = formatStr.Substring(0,decLoc);
                
                if(dec>0)
                {
                    formatStr+=".";
                    for(var x=0;x<dec;x++)
                    {
                        formatStr+="0";
                    }
                }
            }
        }
    }
    return formatStr;
}
EpiNumericEditor.prototype.set_NumericType=function(value)
{
    this._numericType = value;
}
//------------------------------------
// EpiCurrencyEditor
//------------------------------------
var EpiCurrencyEditor = Epicor.Mfg.UI.FrameWork.EpiCurrencyEditor = function (settings)
{
    EpiNumericEditor.call(this,settings);

    this.InCurrencyConver = (settings.InConver==undefined)? false:settings.InConver;
    this.Visible = (settings.InConver==undefined)? this.Visible:settings.InConver;
}
EpiCurrencyEditor.prototype = new EpiNumericEditor();
EpiCurrencyEditor.prototype.TypeName = "EpiCurrencyEditor";

//------------------------------------
// EpiCurrencyConverGrid
//------------------------------------
var EpiCurrencyConverGrid = Epicor.Mfg.UI.FrameWork.EpiCurrencyConverGrid = function (settings)
{
    EpiControl.call(this,settings);
    
    this.DocBinding = settings.DocBinding;
    this.BaseBinding = settings.BaseBinding;
    this.Rpt1Binding = settings.Rpt1Binding;
    this.Rpt2Binding = settings.Rpt2Binding;
    this.Rpt3Binding = settings.Rpt3Binding;
}
EpiCurrencyConverGrid.prototype = new EpiNumericEditor();
EpiCurrencyConverGrid.prototype.TypeName = "EpiCurrencyConverGrid";
EpiCurrencyConverGrid.prototype.GetHtmlForGrid=function(id, row,dt)
{
    var docVal = this.GetValFromRow(dt,row,this.DocBinding) || "0";
    var baseVal = this.GetValFromRow(dt,row,this.BaseBinding) || "0";
    var rpt1Val = this.GetValFromRow(dt,row,this.Rpt1Binding) || "0";
    var rpt2Val = this.GetValFromRow(dt,row,this.Rpt2Binding) || "0";
    var rpt3Val = this.GetValFromRow(dt,row,this.Rpt3Binding) || "0";

    if(!this.SaveFormatted) 
    {
        docVal = this.Format(docVal);
        baseVal = this.Format(baseVal);
        rpt1Val = this.Format(rpt1Val);
        rpt2Val = this.Format(rpt2Val);
        rpt3Val = this.Format(rpt3Val);
    }

    var val = "";
    switch(Global.Form.CurrentCurrencyCode)
    {
        case CurrencyToggleCode.BASE: val = baseVal; break;
        case CurrencyToggleCode.DOC: val = docVal; break;
        case CurrencyToggleCode.RPT1: val = rpt1Val; break;
        case CurrencyToggleCode.RPT2: val = rpt2Val; break;
        case CurrencyToggleCode.RPT3: val = rpt3Val; break;
    }
   
    var styleStr = "style='text-align:right;' "
    return "<div id='" + id + "' " + styleStr + "tabIndex='0' doc='" + docVal + "' base='" + baseVal + "' rpt1='" + rpt1Val + "' rpt2='" + rpt2Val + "' rpt3='" + rpt3Val + "'>" + val + "</div>";
}
EpiCurrencyConverGrid.prototype._focusOutGrid=function(ctrl)
{
    var td = ctrl.parentNode;
    
    var div = td.getElementsByTagName("DIV");
    if(div.length>0)
    {
        ctrl.style.display = "none";
        var val = this.GetValue(ctrl, true);
        
        switch(Global.Form.CurrentCurrencyCode)
        {
            case CurrencyToggleCode.BASE: div[0].setAttribute("base", val); break;
            case CurrencyToggleCode.DOC: div[0].setAttribute("doc", val); break;
            case CurrencyToggleCode.RPT1: div[0].setAttribute("rpt1", val); break;
            case CurrencyToggleCode.RPT2: div[0].setAttribute("rpt2", val); break;
            case CurrencyToggleCode.RPT3: div[0].setAttribute("rpt3", val); break;
        }

        div[0].innerHTML = val;
        div[0].style.display = "";
    }
}
EpiCurrencyConverGrid.prototype.ShowBase=function(ctrl, dispBase)
{
    var val = ctrl.getAttribute("doc");
    if(dispBase) val = ctrl.getAttribute("base");
        
    ctrl.innerHTML = val;
}
EpiCurrencyConverGrid.prototype.ToggleCurrency=function(ctrl,activeCurrency)
{
    val = "&nbsp;";
    switch (activeCurrency)
    {
        case CurrencyToggleCode.BASE: val = ctrl.getAttribute("base"); break;
        case CurrencyToggleCode.DOC: val = ctrl.getAttribute("doc"); break;
        case CurrencyToggleCode.RPT1: val = ctrl.getAttribute("rpt1"); break;
        case CurrencyToggleCode.RPT2: val = ctrl.getAttribute("rpt2"); break;
        case CurrencyToggleCode.RPT3: val = ctrl.getAttribute("rpt3"); break;
    }
    ctrl.innerHTML = val;
}
//------------------------------------
// EpiCurrencyConver
//------------------------------------
var EpiCurrencyConver = Epicor.Mfg.UI.FrameWork.EpiCurrencyConver = function EpiCurrencyConver(settings)
{
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");
    
    this.EpiShowBase = settings.EpiShowBase;
    this.DocCtrl = settings.DocCtrl;
    this.BaseCtrl = settings.BaseCtrl;
    this.Rpt1Ctrl = settings.Rpt1Ctrl;
    this.Rpt2Ctrl = settings.Rpt2Ctrl;
    this.Rpt3Ctrl = settings.Rpt3Ctrl;
    
    Global.Form.MyCurrencyConvers.Add(this.ID, this);
}
EpiCurrencyConver.prototype = new EpiControl();
EpiCurrencyConver.prototype.TypeName = "EpiCurrencyConver";
EpiCurrencyConver.prototype.ShowBase=function(dispBase)
{
    var baseCtrl = Global.document.getElementById(this.BaseCtrl);
    var docCtrl = Global.document.getElementById(this.DocCtrl);
    
    var baseObj = Global.BindingEngine.Controls[this.BaseCtrl];
    var docObj = Global.BindingEngine.Controls[this.DocCtrl];
    
    baseObj.SetVisible(baseCtrl, dispBase);
    docObj.SetVisible(docCtrl, !dispBase);
}
EpiCurrencyConver.prototype.GetEnabled=function(ctrl)
{
    var fields = ctrl.getElementsByTagName("input");
    var docCtrl = fields[0];
    var baseCtrl = fields[1];
    
    var baseObj = Global.BindingEngine.Controls[this.BaseCtrl];
    var docObj = Global.BindingEngine.Controls[this.DocCtrl];
    
    if (baseObj.GetEnabled(baseCtrl) && docObj.GetEnabled(docCtrl))
        return true;
    else
        return false;
}
EpiCurrencyConver.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{
    
    var bec = Global.BindingEngine.Controls;
    var baseObj = bec[this.BaseCtrl];
    var docObj = bec[this.DocCtrl];
    var rpt1Obj = bec[this.Rpt1Ctrl];
    var rpt2Obj = bec[this.Rpt2Ctrl];
    var rpt3Obj = bec[this.Rpt3Ctrl];

    var fields = ctrl.getElementsByTagName("input");
    var docCtrl = fields[0];
    var baseCtrl = fields[1];
    var rpt1Ctrl = fields[2];
    var rpt2Ctrl = fields[3];
    var rpt3Ctrl = fields[4];
    
    baseObj.SetEnabled(baseCtrl, enabledFlg, toolsFlg);
    docObj.SetEnabled(docCtrl, enabledFlg, toolsFlg);
    rpt1Obj.SetEnabled(rpt1Ctrl, enabledFlg, toolsFlg);
    rpt2Obj.SetEnabled(rpt2Ctrl, enabledFlg, toolsFlg);
    rpt3Obj.SetEnabled(rpt3Ctrl, enabledFlg, toolsFlg);
    
    this.OnEnabledChanged(ctrl);
}
EpiCurrencyConver.prototype.ToggleCurrency=function(activeCurrency)
{
    var bec = Global.BindingEngine.Controls;
    var baseCtrl = bec[this.BaseCtrl];
    var docCtrl = bec[this.DocCtrl];
    var rpt1Ctrl = bec[this.Rpt1Ctrl];
    var rpt2Ctrl = bec[this.Rpt2Ctrl];
    var rpt3Ctrl = bec[this.Rpt3Ctrl];

    // EpiHiddenControl??
    switch (activeCurrency)
    {
        case CurrencyToggleCode.BASE:   
            baseCtrl.set_Visible(true);
            docCtrl.set_Visible(false);
            rpt1Ctrl.set_Visible(false);
            rpt2Ctrl.set_Visible(false);
            rpt3Ctrl.set_Visible(false);
            break;

        case CurrencyToggleCode.DOC:
            baseCtrl.set_Visible(false);
            docCtrl.set_Visible(true);
            rpt1Ctrl.set_Visible(false);
            rpt2Ctrl.set_Visible(false);
            rpt3Ctrl.set_Visible(false);
            break;

        case CurrencyToggleCode.RPT1:
            baseCtrl.set_Visible(false);
            docCtrl.set_Visible(false);
            rpt1Ctrl.set_Visible(true);
            rpt2Ctrl.set_Visible(false);
            rpt3Ctrl.set_Visible(false);
            break;

        case CurrencyToggleCode.RPT2:
            baseCtrl.set_Visible(false);
            docCtrl.set_Visible(false);
            rpt1Ctrl.set_Visible(false);
            rpt2Ctrl.set_Visible(true);
            rpt3Ctrl.set_Visible(false);
            break;

        case CurrencyToggleCode.RPT3:
            baseCtrl.set_Visible(false);
            docCtrl.set_Visible(false);
            rpt1Ctrl.set_Visible(false);
            rpt2Ctrl.set_Visible(false);
            rpt3Ctrl.set_Visible(true);
            break;
    }
}
//------------------------------------
// EpiTimeEditor
//------------------------------------
var EpiTimeEditor = Epicor.Mfg.UI.FrameWork.EpiTimeEditor = function (settings)
{
    EpiTextBox.call(this,settings);
    
    this.Use24HourClock = settings.Use24HourClock;
    this.EpiDecimal = settings.EpiDecimal;
    this.EpiRoundToMinute = settings.EpiRoundToMinute;
    this.EpiTreatZeroAsNull = settings.EpiTreatZeroAsNull;
}
EpiTimeEditor.prototype = new EpiTextBox();
EpiTimeEditor.prototype.TypeName = "EpiTimeEditor";
EpiTimeEditor.prototype.Format=function(val)
{ 
    return FormatEngine.FormatTime(val, this.EpiDecimal, this.EpiTreatZeroAsNull, this.EpiRoundToMinute);
}
EpiTimeEditor.prototype.Unformat=function(val)
{
    return FormatEngine.ToTime(val, this.EpiDecimal);
}
EpiTimeEditor.prototype._applyMaxLength = function(dv,ctrl)
{
}
//------------------------------------
// EpiCheckBox
//------------------------------------
var EpiCheckBox = Epicor.Mfg.UI.FrameWork.EpiCheckBox = function (settings)
{
    if(settings && settings.SkipProcessing==true) return;
    
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");
    this.get_Event("Click").subscribe(this.DoChange, this, true);
}
EpiCheckBox.prototype = new EpiControl({"SkipProcessing":true});
EpiCheckBox.prototype.TypeName = "EpiCheckBox";
EpiCheckBox.prototype.Resize = function(ctrl, h, w, limits)
{
	if (ctrl.style.display == "none") return;
	var offSetTop = ctrl.offsetTop;
	if (!BrowserSniffer.IE)
	{
		if (ctrl.style.marginTop == "")
		{
			if (offSetTop > 3){ offSetTop = offSetTop - 3; }
		}
	}

	var bounds = this.getBounds(ctrl.offsetHeight, ctrl.offsetWidth, offSetTop, ctrl.offsetLeft, h, w, limits);
	if (bounds)
	{
		ctrl.style.top = bounds.Top + "px";
		ctrl.style.left = bounds.Left + "px";
	}
}
EpiCheckBox.prototype._initFocus=function(ctrl)
{
    if(!this.InGrid && !this._focusinit) 
    {
        EpiEventManager.addListener(ctrl, "focus", this._focusin, this, true);
        this._focusinit=true;
    }
}
EpiCheckBox.prototype.Get=function(ctrl)
{
    if (!ctrl) 
        return EpiControl.prototype.Get.call(this);
    
    // Returns the correct ctrl depending on the current State.
    if (this.InGrid)
    {
        var td = ctrl.parentNode;
        if (this._currentState == CheckState.Indeterminate && ctrl.tagName == "INPUT") // The ctrl points to the checkbox but we need to use the image div
        {
            var newCtrl = ctrl;
            var fields = td.getElementsByTagName("div");
            if(fields.length > 0)
                newCtrl = fields[0];
            return newCtrl;
        }
        else if ((this._currentState == CheckState.Checked || this._currentState == CheckState.Unchecked)
                && ctrl.tagName == "DIV") // The ctrl points to the image but we should use the actual checkbox.
        {
            var newCtrl = ctrl;
            var fields = td.getElementsByTagName("input");
            if(fields.length > 0)
                newCtrl = fields[0];
            return newCtrl;
        }
    }
    
    return ctrl;
}

EpiCheckBox.prototype._changeState=function(ctrl,val)
{
    var newState = CheckState.Unchecked;
    if (val == "auto")
    {
        if (this._currentState == CheckState.Indeterminate || this._currentState == CheckState.Checked)
            newState = CheckState.Unchecked;
        else if (this._currentState == CheckState.Unchecked) // Later we might add a check for the ThreeState property to support the InDeterminate state.
            newState = CheckState.Checked;
    }
    else
    {
        if (val == true||val=="true"||val=="True")
            newState = CheckState.Checked;
        else if (val == undefined)
            newState = CheckState.Indeterminate;
        else
            newState = CheckState.Unchecked;
    }
    
    if (this.InGrid)
    {
        var td = ctrl.parentNode;
        
        if (newState == CheckState.Indeterminate && ctrl.tagName == "INPUT") // control shows a checkbox currently, switch it to the div
        {
            var fields = td.getElementsByTagName("div");
            var newCtrl;
            if(fields.length > 0)
                newCtrl = fields[0];
            else
            {
                newCtrl = Global.document.createElement("div");
                newCtrl.className = "IndeterminateCheckbox";
                newCtrl.id = ctrl.id;
                td.appendChild(newCtrl);
            }
            newCtrl.style.display = "";
            ctrl.style.display = "none";
            if (this._showReqd) this._setRequiredStyle(newCtrl);
        }
        else if ((newState == CheckState.Checked || newState == CheckState.Unchecked) 
                    && ctrl.tagName == "DIV") // Control is showing image, switch to checkbox.
        {
            var fields = td.getElementsByTagName("input");
            var newCtrl;
            if(fields.length > 0)
            {
                newCtrl = fields[0];
            }
            else
            {
                newCtrl = Global.document.createElement("input");
                newCtrl.className = "checkbox";
                newCtrl.type = 'checkbox';
                td.appendChild(newCtrl);
            }
            
            newCtrl.style.display = "";
            newCtrl.id = ctrl.id;
            newCtrl.checked = (newState==CheckState.Checked)?true:false;
            ctrl.style.display="none";
            if (this._showReqd) this._setRequiredStyle(newCtrl);
            var me = this;
            setTimeout(function() {try{newCtrl.focus(); newCtrl.select(); me._focusin(newCtrl); }catch(err){}},200); 
        }
        else if ((newState == CheckState.Checked || newState == CheckState.Unchecked) 
            && ctrl.tagName == "INPUT") 
        {
            ctrl.checked = (newState==CheckState.Checked)?true:false;
        }
    }
    else
        ctrl.checked = (newState==CheckState.Checked)?true:false;
        
    this._currentState = newState; 
}

EpiCheckBox.prototype.DoChange=function(sender, e)
{
    var ctrl = e.target||e.srcElement;

    this._changeState(ctrl,"auto");
   
    this._change(e);

    this.get_Event("CheckedChanged").fire(sender, e);
    this.get_Event("CheckStateChanged").fire(sender, e);
}
EpiCheckBox.prototype.GetEnabled=function(ctrl)
{
    ctrl = this.Get(ctrl);
    return !(ctrl.disabled);
}
EpiCheckBox.prototype.SetEnabled=function(ctrl,enabledFlg, toolsFlg)
{
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);
    
    ctrl = this.Get(ctrl);
    ctrl.disabled = !enabledFlg;
    
    this.OnEnabledChanged(ctrl);
}
EpiCheckBox.prototype.SetVisible=function(ctrl,visibleFlg,fromRR)
{
    if(this.InGrid) return;
    
    if(visibleFlg)
        ctrl.style.display = "";
    else
        ctrl.style.display = "none";
        
    if(!fromRR) this.Visible = visibleFlg;
}
EpiCheckBox.prototype.SetValue=function(ctrl,val)
{
    this._prevValue=val;
    ctrl = this.Get(ctrl);
    
    var prevVal = (this.InGrid && ctrl.className=="IndeterminateCheckbox")? undefined: ctrl.checked;
    
    this._changeState(ctrl,val);

    var newVal = (this.InGrid && ctrl.className=="IndeterminateCheckbox")? undefined: ctrl.checked;

    if (newVal != prevVal) // If checked value changed
    {
        this.get_Event("CheckedChanged").fire(this);
        this.get_Event("CheckStateChanged").fire(this);
    }
}
EpiCheckBox.prototype.get_CheckedValue=function()
{
    var ctrl = this.Get();
    return this.GetChecked(ctrl);
}
EpiCheckBox.prototype.set_CheckedValue=function(val)
{
    var ctrl = this.Get(); // Since there is no ctrl being passed in, ignore this for now for 'tristate' because it will never work for a grid anyways.
    return this.SetValue(ctrl,val);
}
EpiCheckBox.prototype.get_CheckState=function()
{
    var ctrl = this.Get();
    if(ctrl.checked)
        return CheckState.Checked;
    else
        return CheckState.Unchecked;
}
EpiCheckBox.prototype.set_CheckState=function(val)
{
    var ctrl = this.Get();
    this.SetValue(ctrl,val==CheckState.Checked);
}
EpiCheckBox.prototype.GetChecked=function(ctrl)
{
    ctrl = this.Get(ctrl);
    var val = (this.InGrid && ctrl.className=="IndeterminateCheckbox")? false: ctrl.checked;

    return val;
}
EpiCheckBox.prototype.GetValue=function(ctrl)
{
    ctrl = this.Get(ctrl);
    
    var val = (this.InGrid && ctrl.className=="IndeterminateCheckbox")? undefined: ctrl.checked;

    if(val)
        return "true";
    else
        return "false";
}
EpiCheckBox.prototype.SetText = function(ctrl, val)
{
   if (this.EpiLabel != "")
   {
     var lblCtrl = Global.BindingEngine.Controls[this.EpiLabel];
     lblCtrl.SetText(Global.document.getElementById(this.EpiLabel), val);
   }
}
EpiCheckBox.prototype.GetText = function(ctrl)
{
   if (this.EpiLabel != "")
   {
     var lblCtrl = Global.BindingEngine.Controls[this.EpiLabel];
     lblCtrl.GetText(Global.document.getElementById(this.EpiLabel));
   }
}
EpiCheckBox.prototype.GetHtmlForGrid=function(id, row,dt)
{
    var val=this.GetValFromRow(dt,row,this.DataColumn);

    var checkStr="";
    if(val=="true"||val=="True") 
    {
        checkStr=" checked='true'";
        this._currentState = CheckState.Checked;
    }
    else if(val!="false"&&val!="False") 
    {
        this._currentState = CheckState.Indeterminate;
        return "<div id='"+id+"' class='IndeterminateCheckbox' tabIndex='0'></div>"; //>"+val+"
    }
    else
        this._currentState = CheckState.Unchecked;
        
    return "<input id='"+id+"'"+checkStr+" type='checkbox' class='checkbox' />"
}
EpiCheckBox.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
    var data = dv.dataView.get_Row(rowNum);

    if(data && this.DataColumn)
        this.SetValue(ctrl, data.get_Item(this.DataColumn));
    else
        this.SetValue(ctrl, false);
        
    if(this.DataView && this.DataColumn && rowNum>-1 && bEngine.CurrentTab)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);
        
    this.RefreshProperties(ctrl, dv, rowNum);
    
    return true;
}
//------------------------------------
// EpiRadioButton
//------------------------------------
var EpiRadioButton = Epicor.Mfg.UI.FrameWork.EpiRadioButton = function (settings)
{
    if (!settings) settings = {};
    
    if(this.EpiRadioText!="")
    {
        var obj={};
        if(settings.ID) obj.ID=settings.ID+"Lbl";
        obj.LocationX=settings.LocationX?settings.LocationX+18:0;
        obj.Anchor=settings.Anchor?{"Top":settings.Anchor.Top,"Left":settings.Anchor.Left,"Right":settings.Anchor.Right,"Bottom":settings.Anchor.Bottom}:{"Top":true,"Left":true,"Right":false,"Bottom":false};
        obj.AnchorPad=settings.AnchorPad?{"Top":settings.AnchorPad.Top,"Left":settings.AnchorPad.Left,"Right":settings.AnchorPad.Right,"Bottom":settings.AnchorPad.Bottom}:{"Top":0,"Left":0,"Right":0,"Bottom":0};
    
        this.RadioLabel = new EpiLabel(obj);
        Global.ScriptLoaded.subscribe(this._scriptLoaded,this,true);  
        Global.Form.get_Event("Load").subscribe(this.Init, this, true);
    }
    
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");
    this.EpiRadioText = settings.EpiRadioText? settings.EpiRadioText:"";
    if(this.EpiRadioText=="True"||this.EpiRadioText=="False") 
    {
        this.EpiRadioText=this.EpiRadioText.toLowerCase();
    }
    this.get_Event("Click").subscribe(this.DoChange, this,true);
}
EpiRadioButton.prototype = new EpiControl();
EpiRadioButton.prototype.TypeName = "EpiRadioButton";
EpiRadioButton.prototype.EpiManualEnabled = ManualEnabledState.None;
EpiRadioButton.prototype.set_EpiManualEnabled=function(val){this.EpiManualEnabled = val;}
EpiRadioButton.prototype.get_EpiManualEnabled=function(){return this.EpiManualEnabled;}
EpiRadioButton.prototype.set_EpiRadioText=function(val){this.EpiRadioText = val;}
EpiRadioButton.prototype.set_EpiLabel=function(val){this.EpiLabel = val;}
EpiRadioButton.prototype._scriptLoaded=function()
{
    if(!Global.BindingEngine.Controls[this.ID+"Lbl"])
    {
        Global.BindingEngine.Controls[this.ID+"Lbl"]=this.RadioLabel;
    }
}
EpiRadioButton.prototype.Init=function()
{
    if(Global.FormDir=="rtl")
    {
        var ctrl = Global.document.getElementById(this.ID+"Lbl");
        if(ctrl) ctrl.style.textAlign="right";
    }
}
EpiRadioButton.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;
    
    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);

    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
    }
}
EpiRadioButton.prototype._initFocus=function(ctrl)
{
    if(!this.InGrid && !this._focusinit)
    {
        EpiEventManager.addListener(ctrl, "focus", this._focusin, this, true);
        this._focusinit=true;
    }
}
EpiRadioButton.prototype.PerformClick=function()
{   
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl) ctrl.click();
}
EpiRadioButton.prototype.DoChange=function(sender, e)
{
    this._change(e);
    this.get_Event("CheckedChanged").fire(sender, e);

    if(this.get_Checked())
    {
        var parentPanel = this.get_Parent();
        if (parentPanel._currentCheckedRadio)
        {
            var theCtrl = parentPanel._currentCheckedRadio;
            theCtrl.set_Checked(false); // set_Checked wont fire the CheckedChanged event because at this point this radio is already unchecked
            theCtrl.get_Event("CheckedChanged").fire(sender, e); 
        }
        parentPanel._currentCheckedRadio = this;

//        var controls = parentPanel.get_Controls();
//        for (var ctrl in controls.items)
//        {
//            var theCtrl = controls.items[ctrl];
//            if (theCtrl != this && theCtrl.TypeName == "EpiRadioButton" && theCtrl._isChecked == true)
//            {
//                theCtrl.set_Checked(false);
//                theCtrl.get_Event("CheckedChanged").fire(sender, e);
//                theCtrl._isChecked = false;
//            }
//            else if (theCtrl != this && theCtrl.TypeName == "EpiRadioButton")
//            {
//                if (!(theCtrl.DataView && Global.BindingEngine.EpiDataViews[theCtrl.DataView])) // There is no data behind, so the CheckedChanged needs to fire.
//                    theCtrl.get_Event("CheckedChanged").fire(sender, e);
//            }
//        }
    }
}
EpiRadioButton.prototype.SetValue = function (ctrl, val)
{
    this._prevValue = val;
    if (val == undefined) val = false;
    var prevVal = ctrl.checked;

    if (Global.IsBoolean(val) && (val == true || val == false)) // This usually comes from set_Checked.
        ctrl.checked = val;
    else
    {
        if (val == "True" || val == "False") val = val.toLowerCase();
        ctrl.checked = (val.toString() == this.EpiRadioText) ? true : false;
    }

    if (ctrl.checked != prevVal) // If checked value changed
    {
        // This code is needed when SetValue is called from within the code, we need to fire the CheckedChanged event on the previous radio button and reset it to this control
        if (ctrl.checked)
        {
            var parentPanel = this.get_Parent();
            if (parentPanel._currentCheckedRadio)
                parentPanel._currentCheckedRadio.get_Event("CheckedChanged").fire(this);

            parentPanel._currentCheckedRadio = this;
        }
        this.get_Event("CheckedChanged").fire(this);
    }
}
EpiRadioButton.prototype.GetValue=function(ctrl)
{
    var val = "";
    if(ctrl.checked)
    {
        val = this.EpiRadioText;
    }
    else
    {
        var radios = Global.document.getElementsByName(ctrl.name);
        for(var i=0,radio; radio=radios[i]; i++)
        {
            if(radio.checked)
            {
                var ctrlObj = Global.BindingEngine.Controls[radio.id];
                val = ctrlObj.EpiRadioText;
                break;
            }
        }
    }
    
    return val;
}
EpiRadioButton.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
   if (Global.InstanceOf(Global.Form, "EpiSearchBase")) return;

    var data = dv.dataView.get_Row(rowNum);

    if(data && this.DataColumn)
    {
        var val=data.get_Item(this.DataColumn);
        if(Global.IsBoolean(val))
        {
            if(val==true) val="True";
            else val="False";
        }
        this.SetValue(ctrl, val);
    }
    else
        this.SetValue(ctrl, false);
        
    if(this.DataView && this.DataColumn && rowNum>-1 && bEngine.CurrentTab)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);
        
    this.RefreshProperties(ctrl, dv, rowNum);
    
    return true;
}
EpiRadioButton.prototype.GetChecked=function(ctrl)
{
    return ctrl.checked;
}
//------------------------------------
// EpiDropControl
//------------------------------------
var EpiDropControl = Epicor.Mfg.UI.FrameWork.EpiDropControl = function (settings)
{
    EpiControl.call(this, settings);
    this._impl.push("IEpiBoundControl");
}
EpiDropControl.prototype = new EpiControl();
EpiDropControl.prototype.TypeName = "EpiDropControl";
EpiDropControl.prototype.Resize = function(ctrl, h, w, limits)
{
	if (ctrl.style.display == "none") return;

	var bounds = this.getBounds(ctrl.offsetHeight, ctrl.offsetWidth, ctrl.offsetTop, ctrl.offsetLeft, h, w, limits);
	if (bounds)
	{
		ctrl.style.top = bounds.Top + "px";
		ctrl.style.left = bounds.Left + "px";
		if (bounds.Width > 0)
		    ctrl.style.width = bounds.Width + "px";
		    
		if (!this.InGrid && bounds.Width-20>0)
		{
		    var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
		    textControl.style.width=bounds.Width-20+"px";
		}
		
		if (this.EpiZone) 
		{
		    var zoneCtrl = Global.document.getElementById(this.EpiZone.ID);
		    if (zoneCtrl) this.EpiZone.adjustInfozoneAndParent(zoneCtrl);
		}
	}
}
EpiDropControl.prototype._initFocus=function(ctrl)
{
    if(!this.InGrid && !this._focusinit)
    {
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        var anchorCtrl = ctrl.rows[0].cells[1].getElementsByTagName("a")[0];
    
        EpiEventManager.addListener(textControl, "focus", this._focusin, this, true);
        EpiEventManager.addListener(anchorCtrl, "focus", this._focusin, this, true);
        this._focusinit=true;
    }
}
EpiDropControl.prototype.SelectText=function(ctrl)
{
    var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
    try
    {
        textControl.select();
    } catch(err) {}
}

EpiDropControl.prototype.Focus=function(ctrl)
{
    if(!ctrl) ctrl = Global.document.getElementById(this.ID);
    try
    {
        this._focusTab(ctrl);
        if (this.InGrid && ctrl.tagName=="DIV") 
            this.FocusInGrid(ctrl);
        else
        {    
            var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
            textControl.focus();
            textControl.select();
        }
    } catch(err) {}
}

EpiDropControl.prototype.GetEnabled=function(ctrl)
{
    if(this.InGrid)
    {
        if(ctrl.tagName!="DIV") 
        {
            var div = ctrl.parentNode.getElementsByTagName("DIV");
            if(div) ctrl = div[0];
        }
        return !(ctrl.className == "disabled");
    }
    else
    {
        return !(ctrl.className == "DropControlDis");   
    }
}
EpiDropControl.prototype.SetEnabled = function(ctrl, enabledFlg, toolsFlg) 
{
    if (!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);

    if (this.InGrid) 
    {
        if (ctrl.tagName != "DIV") 
        {
            this._focusOutGrid(ctrl);
            var div = ctrl.parentNode.getElementsByTagName("DIV");
            if (div) ctrl = div[0];
        }

        if (!enabledFlg) 
        {
            ctrl.className = "disabled";
            ctrl.tabIndex = "-1";
            ctrl.setAttribute("_disabled", "true");
        }
        else 
        {
            ctrl.className = "";
            ctrl.tabIndex = "0";
            ctrl.setAttribute("_disabled", "false");
        }
    }
    else 
    {
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        if (!enabledFlg) 
        {
            ctrl.className = "DropControlDis";
            textControl.readOnly = true;
            if (textControl.tabIndex != "-1") textControl.setAttribute("_tabIndex", textControl.tabIndex);
            textControl.tabIndex = "-1";
        }
        else 
        {
            ctrl.className = "DropControl";
            textControl.readOnly = false;

            if (textControl.tabIndex < 0 && textControl.getAttribute("_tabIndex") != null)
                textControl.tabIndex = textControl.getAttribute("_tabIndex");
        }

    }
    
    this.OnEnabledChanged(ctrl);
}
EpiDropControl.prototype.get_ReadOnly=function(ctrl)
{
    if(!ctrl) ctrl = Global.document.getElementById(this.ID);

    if(this.InGrid)
    {
        if(ctrl.tagName!="DIV") 
        {
            var div = ctrl.parentNode.getElementsByTagName("DIV");
            if(div) ctrl = div[0];
        }
        
        if(ctrl.className == "disabled")return true;
        else return false;
    }
    else
    {
        if ( ctrl.className == "DropControlDis") return true;
        else return false;
    }

}

EpiDropControl.prototype.SetVisible=function(ctrl,visibleFlg,fromRR)
{ 
    if(this.InGrid) return;

    if(visibleFlg)
        ctrl.style.display = "";
    else
        ctrl.style.display = "none";

    if(!fromRR) this.Visible = visibleFlg;
}
EpiDropControl.prototype.FocusInGrid=function(ctrl)
{  
    if(ctrl.getAttribute("_disabled")=="true"||Global.ValidationFailed) return;

    var oThis = this;
    var val = ctrl.getAttribute("_val");
    var desc = ctrl.innerHTML;
    if (desc == "&nbsp;") desc = "";
   
    var td = ctrl.parentNode;
    ctrl.style.display = "none";
     
    var newCtrl = this._createInGrid(td, ctrl.id, val, desc);
    if (newCtrl != null)
    {
        var ComboText=newCtrl.rows[0].cells[0].getElementsByTagName("input")[0];
        setTimeout(function() {ComboText.focus(); ComboText.select(); oThis._focusin(newCtrl);},0); 
    }
}
EpiDropControl.prototype._change=function(e)
{
    var ctrl = e.target||e.srcElement;
    if(ctrl.tagName=="INPUT") ctrl = Global.GetParentByTag(ctrl, "TABLE");

    Global.BindingEngine.OnChange(ctrl);
}
EpiDropControl.prototype._blur=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var tbl = Global.GetParentByTag(ctrl, "TABLE");
    
    var dcm = Global.DropControlManager;
    
    if (this.InGrid && !dcm.ActiveControlIsOpen)
    {
        var oThis = this;
        if(!BrowserSniffer.Safari13)
		{
        	setTimeout(function() {oThis._preFocusOutGrid(tbl);}, 50);
        }
        else
        {
        	setTimeout(function() {oThis._preFocusOutGrid(tbl);}, 300);
        }
    }
    Global.DropControlManager.FocusDropControl = null;
}
EpiDropControl.prototype._focus=function(e)
{
    var ctrl = e.target||e.srcElement;
    var tbl = Global.GetParentByTag(ctrl, "TABLE");

    Global.DropControlManager.FocusDropControl = tbl;
}
EpiDropControl.prototype._preFocusOutGrid=function(ctrl)
{
     if(ctrl!=Global.DropControlManager.FocusDropControl) this._focusOutGrid(ctrl);
}
EpiDropControl.prototype._focusOutGrid=function(ctrl)
{
    var td = ctrl.parentNode;
    var div = td.getElementsByTagName("DIV");
    if(div.length>0)
    {
        ctrl.style.display = "none"; // Hide the table
        
        var val = this.GetValue(ctrl);
    
        div[0].setAttribute("_val", val);
        div[0].style.display = "";
    } 
}
EpiDropControl.prototype._createInGrid=function(td, id, val, descVal)
{
    if (!td) return;
    var ctrl;
    var fields = td.getElementsByTagName("table"); // See if there is already a combo control
    
    if(fields.length > 0)
    {
        ctrl = fields[0];
        
	    var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
    	textControl.style.width=td.offsetWidth-21+"px";
    	ctrl.rows[0].cells[0].style.width=td.offsetWidth-21+"px";
    	ctrl.rows[0].style.width=td.offsetWidth-1+"px";
    	ctrl.style.width=td.offsetWidth-1+"px";
    }
    else
    {
        var ctrl = Global.document.createElement("table");  // 216
        ctrl.id = id;
        ctrl.className="DropControl";
        ctrl.cellSpacing=0;
        ctrl.cellPadding=0;
        var tblBody = Global.document.createElement("tbody");
        var row = Global.document.createElement("tr");    // 216
        row.className = "dropTr";
        var cell = Global.document.createElement("td");   // 196
        cell.className="dropTextTd";
        cell.innerHTML = "<input id='" + id + "_dropText' class='dropText' type='text' tabIndex='0'></input>";  // 196
        row.appendChild(cell);
        var ComboText=cell.getElementsByTagName("input")[0];
            
        cell = Global.document.createElement("td");
        cell.className="dropArrowTd";
        cell.innerHTML = "<a class='arrowInGrid' href='javascript:void(0);' tabIndex='-1' id='_dropArrow'></a>";
        row.appendChild(cell);
        var arrowCtrl=cell.getElementsByTagName("a")[0];
        
        EpiEventManager.addListener(arrowCtrl, "blur", this._blur, this, true);
        EpiEventManager.addListener(ComboText, "blur", this._blur, this, true);
        
        EpiEventManager.addListener(arrowCtrl, "focus", this._focus, this, true);
        EpiEventManager.addListener(ComboText, "focus", this._focus, this, true);
         
        tblBody.appendChild(row);
        ctrl.appendChild(tblBody);
        td.appendChild(ctrl);
        
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        
    	textControl.style.width=td.offsetWidth-21+"px";
    	ctrl.rows[0].cells[0].style.width=td.offsetWidth-21+"px";
    	ctrl.rows[0].style.width=td.offsetWidth-1+"px";
    	ctrl.style.width=td.offsetWidth-1+"px";

        EpiEventManager.addListener(textControl, "change", this._change, this, true);
        
        this.InitDropControl(ctrl); // Set up event handlers
    }
    ctrl.style.display = "block";
    if (this._showReqd) this._setRequiredStyle(ctrl);
    
    if(val)
    {
        var oThis = this;
        setTimeout(function() {oThis.SetValue(ctrl, val, descVal);},0); 
    }
    
    return ctrl;
}
EpiDropControl.prototype._applyFocusOut=function()
{
    var td = ctrl.parentNode;
    var div = td.getElementsByTagName("DIV");
    if(div.length>0)
    {
        ctrl.style.display = "none"; // Hide the table
        
        var val = this.GetValue(ctrl);
    
        div[0].setAttribute("_val", val);
        div[0].style.display = "";
    } 
}
EpiDropControl.prototype.InitDropControl=function(ctrl)
{
    if((!this.InGrid) || (this.InGrid && ctrl.tagName!="DIV"))
    {
        // Set up event handling for the arrow
        var oThis = this;
       
        var anchorCtrl = ctrl.rows[0].cells[1].getElementsByTagName("a")[0];
        EpiEventManager.removeListener(anchorCtrl, "click", this._toggleContents); // Remove if it exists already
        EpiEventManager.addListener(anchorCtrl, "click", this._toggleContents, this, true);
     
        EpiEventManager.removeListener(ctrl, "mousedown", this._mousedown); // Remove if it exists already
        EpiEventManager.addListener(ctrl, "mousedown", this._mousedown, this, true);
    }
}
EpiDropControl.prototype._mousedown=function(e)
{
    var ctrl = e.target||e.srcElement;
	    
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	
	// Event can come from either the dropdown or the main combo.
	try
	{
		if(ctrl.id!=null && ctrl.id.EndsWith("_dropText"))
		{
		    this._deactivateDropControl();
		}
	}
	catch (err) { }
}
EpiDropControl.prototype._deactivateDropControl=function(e)
{
    var Ctrl = e.target||e.srcElement;
    if (Ctrl.className == "")
    {
        if(Global.DropControlManager.ActiveControlIsOpen)
        { 
            this._hideContents();
        }
    }    
}
EpiDropControl.prototype._toggleContents=function(e)
{
    var imgCtrl = e.target||e.srcElement;
    var ctrl = Global.GetParentByTag(imgCtrl, "TABLE", true); 

	if(BrowserSniffer.Safari13)
	{
    	Global.DropControlManager.FocusDropControl = ctrl;
	}

    if (Global.DropControlManager.ActiveControlIsOpen == true) // Combo is open, close it
    {
        this._hideContents();
        if(BrowserSniffer.Safari13 && this.InGrid)
		{
			var ComboText=ctrl.getElementsByTagName("input")[0];
			setTimeout(function() {ComboText.focus();}, 50);
		}
    }
    else 
        this._showContents(ctrl);
        
    EpiEventManager.stopEvent(e);
        
    return;
    
}
EpiDropControl.prototype._hideContents=function(){}
EpiDropControl.prototype._showContents=function(){}

//------------------------------------
// EpiDateTimeEditor
//------------------------------------
var EpiDateTimeEditor = Epicor.Mfg.UI.FrameWork.EpiDateTimeEditor = function (settings)
{
    EpiDropControl.call(this,settings);
    
    if(settings)
    {
        if(settings.MinDate!=undefined)
        { 
            this.MinDate = FormatEngine.ToDate(settings.MinDate, "M/d/yyyy hh:mm:ss tt");
            if (this.MinDate == null)
                this.MinDate = FormatEngine.ToDate(settings.MinDate, "M/d/yyyy HH:mm:ss");
        }

        if(settings.MaxDate!=undefined) 
        {
            this.MaxDate = FormatEngine.ToDate(settings.MaxDate, "M/d/yyyy hh:mm:ss tt");
            if (this.MaxDate == null)
                this.MaxDate = FormatEngine.ToDate(settings.MaxDate, "M/d/yyyy HH:mm:ss");
        }

        if (settings.Text != undefined && Global.Form) 
        {
            this.defaultVal = DateTime.get_Now(); // FormatEngine.ToDate(settings.Text, "M/d/yyyy");
            Global.Form.get_Event("Load").subscribe(this._load, this,true);
        }
        
        if (settings.Nullable == false)
            this.Nullable = false;
    }

    var dropTextID = this.ID + "_dropText";
    this.TextObject = Global.BindingEngine.Controls[this.ID + "_dropText"] = new EpiTextBox({"ID":this.ID+"_dropText"});
}
EpiDateTimeEditor.prototype = new EpiDropControl();
EpiDateTimeEditor.prototype.TypeName = "EpiDateTimeEditor";
EpiDateTimeEditor.prototype.MinDate = null;
EpiDateTimeEditor.prototype.MaxDate = null;
EpiDateTimeEditor.prototype.Nullable = true;
EpiDateTimeEditor.prototype.get_IsDateValid=function(){return true;}
EpiDateTimeEditor.prototype.get_Nullable=function(){return this.Nullable;}
EpiDateTimeEditor.prototype.get_NullText=function(){return "";}
EpiDateTimeEditor.prototype.get_MinDate=function(){return this.MinDate;}
EpiDateTimeEditor.prototype.get_MaxDate=function(){return this.MaxDate;}
EpiDateTimeEditor.prototype.GetDataVal = function(ctrl)
{
    // Need to be sure it's in the correct format.
    var val = EpiControl.prototype.GetDataVal.call(this, ctrl);
    val = this.Format(val);
    val = this.Unformat(val);
    
    return val;
}
EpiDateTimeEditor.prototype._load = function()
{
    if (!this.get_DateTime()&&!this.Nullable)
    {
        this.SetValue(this.Get(),this.defaultVal);
    }
}
EpiDateTimeEditor.prototype.get_DateTime=function()
{
    var ctrl = this.Get();
    var dt = this.GetValue(ctrl);
    
    if(dt==null && this.defaultVal && !this.Nullable)
    {
        this.SetValue(ctrl,this.defaultVal);
        dt = this.defaultVal;
    }
    else if(dt!=null) 
    {
        dt = FormatEngine.ToDate(dt);
    }
    return dt;
}
EpiDateTimeEditor.prototype.set_DateTime = function(val)
{
    var ctrl = this.Get();
    this.SetValue(ctrl, val);
    this.OnChange(ctrl); 
}
EpiDateTimeEditor.prototype.get_MinDate=function()
{
    return this.MinDate;
}
EpiDateTimeEditor.prototype.get_MaxDate=function()
{
    return this.MaxDate;
}
EpiDateTimeEditor.prototype._focusin=function(ctrl)
{
    if(ctrl) 
    {
        if(!ctrl.tagName) ctrl=ctrl.target||ctrl.srcElement;

        if(ctrl.id==this.ID) ctrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];

        var dateControl = Global.GetParentById(ctrl, this.ID, false);
        Global.Form._setActiveControl(dateControl);

        if(ctrl.id==this.TextObject.ID)
        {
            this.TextObject.MaskText = FormatEngine.GetShortDateMaskPattern();
            this.TextObject.Mask = MaskEngine.Get(this.TextObject.MaskText);
            this.TextObject.ApplyMask(ctrl);

            var fVal = "";
            var val = this.GetValue(dateControl);
            if(val!=null)
            {
                var date = FormatEngine.ToDate(val);
                var fVal = FormatEngine.FormatDate(date,FormatEngine.GetShortDateMaskPattern());
                if(fVal!=ctrl.value) 
                {
                    ctrl.value = fVal;
                }
            }
            else
            {
                ctrl.value = this.TextObject.Mask.Format("");
            }      
            ctrl.select();
        }
    }
}
EpiDateTimeEditor.prototype.Format=function(val)
{
    if(Global.IsString(val)) 
    {
        try
        {
            var origVal = val;
            val = FormatEngine.ToDate(val, "global");
            if(isNaN(val)) val = FormatEngine.ToDate(origVal);
        }
        catch(err)
        {
            val = "";
        }
    }        
        
    return FormatEngine.FormatDate(val);
}
EpiDateTimeEditor.prototype.Unformat=function(val)
{
    var dt = FormatEngine.ToDate(val);
    return FormatEngine.FormatDate(dt, "yyyy-MM-ddThh:mm:ss");
}
EpiDateTimeEditor.prototype.SetChangeEvent=function(ctrl)
{
    if(!this.InGrid && !this.OnChangeSet)
    {
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        EpiEventManager.addListener(textControl, "blur", this._textchange, this, true);
        this.OnChangeSet = true;
    }

    this.InitDropControl(ctrl);
}
EpiDateTimeEditor.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
    this.SetChangeEvent(ctrl);

    var data = dv.dataView.get_Row(rowNum);
    if (!(this.HasInputTrackerPanelParent == true && this.DashboardPrompt == true))
    {
        if(data && this.DataColumn)
            this.SetValue(ctrl, data.get_Item(this.DataColumn));
        else
            this.SetValue(ctrl, "");
    }
    if(this.DataView && this.DataColumn && rowNum>-1 && bEngine.CurrentTab)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);
        
    this.RefreshProperties(ctrl, dv, rowNum);

    this.InitDropControl(ctrl);
    
    return true;
}
EpiDateTimeEditor.prototype._focusOutGrid=function(ctrl)
{
    var textCtrl =  ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
    this.TextObject.RemoveMask(textCtrl);

    var td = ctrl.parentNode;
    var div = td.getElementsByTagName("DIV");
    if(div.length>0)
    {
        ctrl.style.display = "none"; // Hide the table
    
        var fail = false;
        try
        {
            var val = textCtrl.value;
            val = this.Unformat(val);
        }
        catch(err)
        {
            div[0].style.display = "";
            var prevValue = this.GetDataVal(ctrl);  
            this.SetValue(ctrl, prevValue);
            return;
        }

        if(!val) 
            div[0].innerHTML = "";
        else 
            div[0].innerHTML = this.Format(val);

        div[0].setAttribute("_val", val);
        div[0].style.display = "";
    } 
}
EpiDateTimeEditor.prototype._textchange=function(e)
{
    if(!e.tagName) ctrl = textCtrl = e.target||e.srcElement;
    this.TextObject.RemoveMask(textCtrl);

    var fail = false;
    try
    {
        var val = textCtrl.value;
        val = this.Unformat(val);
    }
    catch(err)
    {
        fail = true;
    }
    
    ctrl = Global.GetParentByTag(ctrl, 'TABLE');
    if (fail || !this.Nullable && !val) // cannot be null, reset to old value
    {
        var prevValue = this.GetDataVal(ctrl);  
        this.SetValue(ctrl, prevValue);
        return;
    }
    this.OnChange(ctrl);    
}
EpiDateTimeEditor.prototype.set_Value=function(val) 
{
	var ctrl = Global.document.getElementById(this.ID);
	
	if(ctrl) 
	{
	    if(Global.IsString(val))
	    {
	        val=this.Unformat(val);
	    }
	
	    this.SetValue(ctrl,val);    
    }
}
EpiDateTimeEditor.prototype.SetValue=function(ctrl,val)
{
    if (this.inNotifyFields && this.HasInputTrackerPanelParent && this.DashboardPrompt)
        return; // Dont respond to value changes via NotifyFields (dataview changes) if control is on a tracker panel
        
    this._prevValue=val;
    if(val==undefined) val = "";
    if(Global.IsDate(val))
    {
        val = val.GetServerString();
    }
    else if(val!="")
    {
        val = Convert.ToDateTime(val)
        val = val.GetServerString();
    }
    
    val = this.Format(val);

    if(this.InGrid && ctrl.tagName=="DIV")
    {
        if(ctrl.innerHTML != val) ctrl.innerHTML = val;
    }
    else
    {
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        if(textControl!=null) textControl.value = val;
    }
}
EpiDateTimeEditor.prototype.GetValue=function(ctrl, formattedFlg)
{
    if(this.InGrid && ctrl.tagName=="DIV")
    {
        var val = ctrl.innerHTML;
        if(val=="&nbsp;") val = "";
    }
    else
    {
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        val = textControl.value;
    }
    
    try
    {
        if(formattedFlg!=true) val = this.Unformat(val);
    }
    catch(err)
    {
        return null;
    }
    
    if(Global.IsString(val) && val=="") val = null;
    
    return val;
}
EpiDateTimeEditor.prototype.GetHtmlForGrid=function(id, row,dt)
{
    var val = this.GetValFromRow(dt,row,this.DataColumn);
    if(!val) val = "";
    
    var formattedVal = this.Format(val);
    
    return "<div id='" + id + "' class='DropControl' tabIndex='0' _val='" + val + "'>" + formattedVal + "</div>";
}
EpiDateTimeEditor.prototype._showContents=function(ctrl)
{
	var inMonth, inYear, inDay;
	var dateVar;
 
    var dateVar;
    try
    {
        var textControl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        dateVar = FormatEngine.ToDate(textControl.value);
    }
    catch(err)
    {
        dateVar = new Date();
    }
    if (!dateVar)
        dateVar = new Date();
        
    Global.CalendarManager.CurrentDate = dateVar;

	inMonth = dateVar.getMonth();
	inYear = dateVar.getFullYear();
	inDay = dateVar.getDate();   
    
    var calendarContents = this._getCalendar(inYear, inMonth);
    
    Global.DropControlManager.ActivePopup = new Popup(calendarContents);
    this._initializeContents(Global.DropControlManager.ActivePopup.Control);
    if(this.InGrid)
    {
        var grd = Global.GetParentByTag(ctrl, "TABLE", true);
        Global.DropControlManager.ActivePopup.ShowRelative(ctrl, "below", 1 - grd.parentNode.scrollLeft, 2 - grd.parentNode.scrollTop);
    }
    else
        Global.DropControlManager.ActivePopup.ShowRelative(ctrl, "below");
        
    Global.DropControlManager.ActiveDropControl = ctrl;
    Global.DropControlManager.ActiveControlIsOpen = true;
}
EpiDateTimeEditor.prototype._hideContents=function(ctrl)
{
    if (Global.DropControlManager.ActivePopup)
    {
        Global.DropControlManager.ActivePopup.Hide();
        Global.DropControlManager.ActivePopup = null;
        Global.DropControlManager.ActiveControlIsOpen = false;
    }
}
EpiDateTimeEditor.prototype._getCalendar=function(year, month)
{
    var daysArray = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var headerdays;

	var rowIdx = 0;
	var colIdx = 0;
	
	Global.CalendarManager.Year = year;
	Global.CalendarManager.Month = month;
	
	var currentDate = Global.CalendarManager.CurrentDate;
	var currentYear = currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	var currentDay = currentDate.getDate();	

	var firstdayOfWeek = parseInt(FormatEngine.CultureInfo.FirstDayOfWeek);
	var dayDiff = firstdayOfWeek - 0;
	
    if (month == 1) 
    {
        if ((year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0))) 
            daysArray[1] = 29;
        }

    var headerText = FormatEngine.CultureInfo.MonthNames[month] + ' ' + year;

	var firstDate = new Date(year, month, 1);
	var firstday = (firstDate.getDay() + 1) - dayDiff;
	if (firstday <= 0) firstday = firstday + 7;
   
    var prevMonthDays;
    if(month==0)
        prevMonthDays=daysArray[11];
    else if(month==2&&((year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0))))
        prevMonthDays=29;
    else
        prevMonthDays=daysArray[month-1];
        
    var prevMonthCounter=prevMonthDays-firstday+2;
   
	var rows = 6;
	var dayCounter = 1;
	var loopCounter = 1;
	var nextMonthCounter = 1;
	
	var dayNames = FormatEngine.CultureInfo.DayNames;
	switch(firstdayOfWeek)
	{
		case 0:	headerdays = '<td>' + dayNames[0].substr(0,1) + '</td><td>' + dayNames[1].substr(0,1) + '</td><td>' + dayNames[2].substr(0,1) + '</td><td>' + dayNames[3].substr(0,1) + '</td><td>' + dayNames[4].substr(0,1) + '</td><td>' + dayNames[5].substr(0,1) + '</td><td>' + dayNames[6].substr(0,1) + '</td>'; break;
		case 1:	headerdays = '<td>' + dayNames[1].substr(0,1) + '</td><td>' + dayNames[2].substr(0,1) + '</td><td>' + dayNames[3].substr(0,1) + '</td><td>' + dayNames[4].substr(0,1) + '</td><td>' + dayNames[5].substr(0,1) + '</td><td>' + dayNames[6].substr(0,1) + '</td><td>' + dayNames[0].substr(0,1) + '</td>'; break;
		case 2:	headerdays = '<td>' + dayNames[2].substr(0,1) + '</td><td>' + dayNames[3].substr(0,1) + '</td><td>' + dayNames[4].substr(0,1) + '</td><td>' + dayNames[5].substr(0,1) + '</td><td>' + dayNames[6].substr(0,1) + '</td><td>' + dayNames[0].substr(0,1) + '</td><td>' + dayNames[1].substr(0,1) + '</td>'; break;
		case 3:	headerdays = '<td>' + dayNames[3].substr(0,1) + '</td><td>' + dayNames[4].substr(0,1) + '</td><td>' + dayNames[5].substr(0,1) + '</td><td>' + dayNames[6].substr(0,1) + '</td><td>' + dayNames[0].substr(0,1) + '</td><td>' + dayNames[1].substr(0,1) + '</td><td>' + dayNames[2].substr(0,1) + '</td>'; break;
		case 4:	headerdays = '<td>' + dayNames[4].substr(0,1) + '</td><td>' + dayNames[5].substr(0,1) + '</td><td>' + dayNames[6].substr(0,1) + '</td><td>' + dayNames[0].substr(0,1) + '</td><td>' + dayNames[1].substr(0,1) + '</td><td>' + dayNames[2].substr(0,1) + '</td><td>' + dayNames[3].substr(0,1) + '</td>'; break;
		case 5:	headerdays = '<td>' + dayNames[5].substr(0,1) + '</td><td>' + dayNames[6].substr(0,1) + '</td><td>' + dayNames[0].substr(0,1) + '</td><td>' + dayNames[1].substr(0,1) + '</td><td>' + dayNames[2].substr(0,1) + '</td><td>' + dayNames[3].substr(0,1) + '</td><td>' + dayNames[4].substr(0,1) + '</td>'; break;
		case 6:	headerdays = '<td>' + dayNames[6].substr(0,1) + '</td><td>' + dayNames[0].substr(0,1) + '</td><td>' + dayNames[1].substr(0,1) + '</td><td>' + dayNames[2].substr(0,1) + '</td><td>' + dayNames[3].substr(0,1) + '</td><td>' + dayNames[4].substr(0,1) + '</td><td>' + dayNames[5].substr(0,1) + '</td>'; break;
	}
	   
	var htmlStr = '<table id="idCalendarTable" class="calendarTable" cellspacing=1 cellpadding=0 border=0>';
		htmlStr	+= '<tr class="calendarHeader"><td colspan=7>' + headerText + '</td></tr>';
		htmlStr += '<tr class="calendarWeekdays">' + headerdays + '</tr>';
   
	for (var j = 1; j <= rows; j++) 
	{
		htmlStr += '<tr class="calendarRow">';
      
		var rowIdx = j-1;
      
		for (var i = 1; i < 8; i++) 
		{
			
			var colIdx = i-1;
			if ((loopCounter >= firstday) && (dayCounter <= daysArray[month])) 
			{
				if (dayCounter == currentDay && year==currentYear && month==currentMonth) 
				{
					htmlStr += '<td _day="' + dayCounter + '" class="calendarCurrent calendarSelected"><LABEL>' + dayCounter + '</LABEL></td>';
				}
				else if(dayCounter == currentDay || (dayCounter==daysArray[month] && currentDay > daysArray[month]))
				{
					// FOCUS DATE
					htmlStr += '<td _day="' + dayCounter + '" class="calendarCurrent"><LABEL>' + dayCounter + '</LABEL></td>';
					currentDay = dayCounter;
				}
				else 
				{
					// PLAIN JANE DATE
					htmlStr += '<td _day="' + dayCounter + '" class="calendarday"><LABEL>' + dayCounter + '</LABEL></td>';
				}
            
				dayCounter++;    
			}
			else 
			{
			    if(loopCounter<firstday)
			    {
			        // OFF-MONTH DATE
			        htmlStr += '<td _day="' + prevMonthCounter + '" _mo="prev" class="calendardayoff"><LABEL>' + prevMonthCounter + '</LABEL></td>';
			        prevMonthCounter++;
			    }
			    else if(dayCounter>daysArray[month])
			    {
			        // OFF-MONTH DATE
			        htmlStr += '<td _day="' + nextMonthCounter + '" _mo="next" class="calendardayoff"><LABEL>' + nextMonthCounter + '</LABEL></td>';
			        nextMonthCounter++;
			    }
			    else
			    {
				htmlStr += '<td>&nbsp;</td>';
			}
			}
			loopCounter++;
		}
      
		htmlStr += '</tr>';
	}
   
	htmlStr += '<tr class="calendarHeader"><td colspan=7><div id="idCancel" class="calendarLink">Cancel</div></td></tr>';
	htmlStr += '</table>';
   
	// Scrollers to move from month to month.
	htmlStr = htmlStr + '<div id="Scrollers"><table cellpadding="0" cellspacing="0">';
	htmlStr = htmlStr + '<tr>';
	htmlStr = htmlStr + '<td align="left"><div class="calendarLink" id="idScrollLeft">&#171;&#171;</div></td>';
	htmlStr = htmlStr + '<td width="100%"></td>';
	htmlStr = htmlStr + '<td align="right"><div class="calendarLink" id="idScrollRight">&#187;&#187;</div></td>';
	htmlStr = htmlStr + '</tr></table></div>'; 
	
	return htmlStr;
}
EpiDateTimeEditor.prototype._initializeContents=function(ctrl)
{
    EpiEventManager.addListener(ctrl, "click", this._docontentsclick, this, true);
	
    EpiEventManager.addListener(ctrl, "mousedown", this._mousedown, this, true);
    
    EpiEventManager.removeListener(Global.document, "mousedown", this._deactivateDropControl);
    EpiEventManager.addListener(Global.document, "mousedown", this._deactivateDropControl, this, true);
}
EpiDateTimeEditor.prototype._docontentsclick=function(e)
{
    var ctrl = e.target||e.srcElement; 
    
    if(ctrl.tagName=="LABEL") ctrl = ctrl.parentNode;
    
    if(ctrl.getAttribute("_day"))
    {
        this._selectdate(ctrl);
    }
    else if(ctrl.id=="idCancel")
    {
        this._hideContents();
    }
    else if(ctrl.id=="idScrollLeft")
    {
        this._scrollMonth(-1);
    }
    else if(ctrl.id=="idScrollRight")
    {
        this._scrollMonth(1);
    }
    EpiEventManager.stopEvent(e);
}
EpiDateTimeEditor.prototype._selectdate=function(ctrl)
{
    this._hideContents();

    var dy = ctrl.getAttribute("_day");
    var mo = ctrl.getAttribute("_mo");
    var selectedMo=Global.CalendarManager.Month;
    var selectedYr=Global.CalendarManager.Year;
    if(mo)
    {
        if(mo=="prev")
        {
            selectedMo=selectedMo-1;
            if(selectedMo<0) 
            {
                selectedMo=11;
                selectedYr--;
            }
        }
        else if(mo=="next")
        {
            selectedMo=selectedMo+1;
            if(selectedMo>11) 
            {
                selectedMo=0;
                selectedYr++;
            }
        }    
    }
    
    var dt = new Date(selectedYr, selectedMo, parseInt(dy));

    var formattedVal = this.Format(dt); 
    
    var dateControl = Global.DropControlManager.ActiveDropControl;
    var textControl = dateControl.rows[0].cells[0].getElementsByTagName("input")[0];
    textControl.value = formattedVal;
    
    Global.BindingEngine.OnChange(dateControl);
    this.get_Event("ValueChanged").fire();
    textControl.select();
}
EpiDateTimeEditor.prototype._scrollMonth=function(offset)
{
    var month = Global.CalendarManager.Month + offset;
    var year = Global.CalendarManager.Year;
    
    if(month==-1)
    {
        month = 11;
        year = year - 1;
    }
    else if(month==12)
    {
        month = 0;
        year = year + 1;
    }
    
    var calendarContents = this._getCalendar(year, month);
    Global.DropControlManager.ActivePopup.Control.innerHTML = calendarContents;
}

//------------------------------------
// EpiComboBox
//------------------------------------
var OverrideZeroValueSettings = {Never:0,Always:1,None:2}; // private enum

var EpiComboBox = Epicor.Mfg.UI.FrameWork.EpiComboBox = function (settings)
{
    EpiDropControl.call(this,settings);

    if (!settings) settings={};

//    this.gHeight; 
//    this.SelectedRowIndx = -1;
//    this.gUIFilter = ""; // this would be the text that the user enters manually in the combo, used only in the autocomplete state
//    //TheDataSet = new Epicor.Mfg.BO.FobListDataSet(); // ?? not used	
	
	this.DescColumn = settings.DescC? settings.DescC : ""; // Description from the record. Used when combo's data is not retrieved yet
	this.DisplayMember = this.EpiDisplayMember = settings.DescrpC? settings.DescrpC : ""; // Same as EpiRetrieverCombo.EpiDisplayMember 
	this.ValueMember = this.EpiValueMember = settings.CodeC? settings.CodeC : ""; // Same as EpiRetrieverCombo.EpiValueMember
	if (!this.ValueMember && this.DisplayMember)
	    this.ValueMember = this.DisplayMember; // win code seems to work without ValueMember but we depend on it. So just use the DisplayMember for now
	    
	if (settings.FCols) // Columns to display in the dropdown area
	    this.EpiColumns = settings.FCols.split(','); // build an array of columns
	else
	    this.EpiColumns = [];
	    
	this.EpiSort = settings.SortC? settings.SortC : "";	// Same as EpiRetrieveCombo.EpiSort		
	this.EpiTableName = settings.EpiTbl? settings.EpiTbl : "";  
	this.EpiFieldName = settings.EpiFld? settings.EpiFld : "";                   
	this.retrieveOnActivate = settings.ROnAct? true:false; 
	this.adapterName = settings.Adptr? settings.Adptr:"";  
	this.ValColIsInt = settings.ValInt? settings.ValInt:false;
	this.InNavCtrl = settings.InNavCtrl? settings.InNavCtrl:false;
	this.ChangesRows = settings.ChRows? settings.ChRows:false;
	var TableName = settings.Tbl? settings.Tbl:"ComboTable";
	this.TheDataSet  = new DataSet();
	this.TheDataSet.AddTables({TableName:new DataTable(TableName)});
	this.epiFilters = settings.EpiFltr? settings.EpiFltr:[];
	this.epiFiltersAppend = settings.EpiFltrApnd? settings.EpiFltrApnd:[];
	this.epiFilterParams = settings.EpiFltrParms? settings.EpiFltrParms:[];
	this.epiHiddenCol = settings.EpiHdnC? settings.EpiHdnC:[];
	this.epiHiddenColAppend = settings.EpiHdnCApnd? settings.EpiHdnCApnd:[];
	this.epiDSMode = settings.EpiDSMode? settings.EpiDSMode: DataSetMode.ListDataSet;
	this.epiBOName = settings.EpiBO? settings.EpiBO: "";
	this.epiSearchFilter = settings.SearchFltr? settings.SearchFltr: "";
	this.OverrideZeroValue = settings.OvZVal? settings.OvZVal : OverrideZeroValueSettings.None;
	this.cboType = settings.CboType? settings.CboType : ""; // This is the datatype of the combo e.g. FactorDirectionCombo
	if (settings.StaticData)
	    this.StaticData = settings.StaticData.split("~"); // on custom forms data is set as array of strings - Verify if CODE and Desc are the same element
	
	if (settings.EpiStaticData)
    	this.set_EpiStaticDataList(settings.EpiStaticData.split("`"));
	if (settings.DynQueryID) this.DynamicQueryID = settings.DynQueryID;
	// The combos which dont have the onDemandRetreveDelegate get the Invalidated property set when data is retrieved on the form.
    // Since we dont have that mechanism working yet we set it to true here. 
    // There is code in EpiRetriever which prevents server retrieval every time if the whereClause has not changed.
	if(this.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
		this.TheDataSet.ExtendedProperties["Invalidated"] = true;
	else
	    this.TheDataSet.ExtendedProperties.Add("Invalidated", true)
	    
	if (this.InNavCtrl && this.ChangesRows) this.ValueMember = this.DataColumn;
	
    if (this.cboType == 'FactorDirectionCombo')
    {
        this.comboType=0; //enumFactorDirectionType.Selling
        this._initFactorDirCombo();
    }
    
    if (Global.Form && (Global.Form.ID == "ServiceCallCenterEntryForm" ||Global.Form.ID == "ServiceContractEntryForm" ) && this.cboType == 'cboContact')
    {
        this.set_CustomerNumberColumnName("CustNum");
    }

    this.setupAppBuiltCombos=settings.RunSetup;
    if(Global.Form) Global.Form.get_Event("Load").subscribe(this._load,this,true);
    
}
EpiComboBox.prototype = new EpiDropControl();
EpiComboBox.prototype.TypeName = "EpiComboBox";
EpiComboBox.prototype.isBeingNotified=false;
EpiComboBox.prototype.gHeight = null; 
EpiComboBox.prototype.SelectedRowIndx = -1;
EpiComboBox.prototype.gUIFilter = ""; // this would be the text that the user enters manually in the combo, used only in the autocomplete state
EpiComboBox.prototype.epiSearchFilter = "";
EpiComboBox.prototype.ValueList=null; // combo that is the source of data for this combo (only if this combo is in a grid)
EpiComboBox.prototype.NoneSel = "None Selected";
EpiComboBox.prototype.hasStaticData = false;
EpiComboBox.prototype.BeforeOnDemandRetrieveDelegate = null;
EpiComboBox.prototype.IsGridValueList = false; 
EpiComboBox.prototype.hasBeenRetrieved = false;
EpiComboBox.prototype.set_EpiDataSetMode=function(val){this.epiDSMode=val;}
EpiComboBox.prototype.set_EpiHiddenColumns=function(cols){this.epiHiddenCol=val;}
EpiComboBox.prototype.set_DropDownWidth=function() {}
EpiComboBox.prototype.set_DropDownStyle=function() {}
EpiComboBox.prototype.set_AutoWidthOption=function() {}
EpiComboBox.prototype.set_Col1ManualWidth=function(){}
EpiComboBox.prototype.set_Col2ManualWidth=function(){}
EpiComboBox.prototype.set_Col3ManualWidth=function(){}
EpiComboBox.prototype.set_Col4ManualWidth=function(){}
EpiComboBox.prototype.set_CharacterCasing=function(){}
EpiComboBox.prototype.set_RetrieveOnActivate=function(val){this.retrieveOnActivate = val;}
EpiComboBox.prototype.get_RetrieveOnActivate=function(){return this.retrieveOnActivate;}
EpiComboBox.prototype.set_DashboardPrompt=function(val){this.DashboardPrompt = val;}
EpiComboBox.prototype.set_DashboardCondition=function(val){this.DashboardCondition=val;} 
EpiComboBox.prototype.set_DashboardHonorNull=function(val){this.DashboardHonorNull = val;}
EpiComboBox.prototype.set_DropDownButtonDisplayStyle = function () { }

EpiComboBox.prototype.SetDataBinding=function(tbl)
{
    this.set_DataSource(tbl);
}
EpiComboBox.prototype.set_AutoEdit=function(){}
EpiComboBox.prototype.get_EpiFiltersAppend=function()
{
    if(!this.epiFiltersAppend)
        return [];
    else
        return this.epiFiltersAppend;
}
EpiComboBox.prototype.set_EpiFiltersAppend=function(value)
{
    this.epiFiltersAppend = this._appendToArr(value,null);
}
EpiComboBox.prototype.get_DisplayLayout=function()
{ 
    return {"BandsSerializer":{"Add":function(band){}},"ColHeadersVisible":false,"Bands":[new UltraGridBand(this)],"get_Band":function(indx){return this.Bands[0];}};
}
EpiComboBox.prototype.set_DescColumnName=function(val){this.DescColumn = val; this.rebind();}
EpiComboBox.prototype.set_DisplayMember=function(val) 
{
    this.DisplayMember = this.EpiDisplayMember = val;
    if (this.EpiColumns.length == 0)
        this.SetColumnFilter(this.DisplayMember);
    this.rebind();
}
EpiComboBox.prototype.get_DisplayMember=function(){return this.DisplayMember;}
EpiComboBox.prototype.set_ValueMember=function(val) {this.ValueMember = this.EpiValueMember = val; this.rebind();}
EpiComboBox.prototype.get_ValueMember=function(){return this.ValueMember;}
EpiComboBox.prototype.SetSearchFilter=function(){}
EpiComboBox.prototype.set_AutoWidthGrid=function(filterArr){}
EpiComboBox.prototype.set_EpiComboID=function(id){}
EpiComboBox.prototype.set_EpiBOName=function(bo){this.epiBOName=bo;}
EpiComboBox.prototype.set_EpiSort=function(val){this.EpiSort = val;}
EpiComboBox.prototype.set_EpiColumns=function(epiC){this.EpiColumns = epiC;}
EpiComboBox.prototype.set_EpiTableName=function(epiT){this.EpiTableName = epiT;}
EpiComboBox.prototype.set_DropDownStyle=function(style)
{
    // UltraComboStyle.DropDown - the user can select from the list or type into the textbox.
    //UltraComboStyle.DropDownList - the user can only select from the list.
    this.DropDownStyle=style;  
}
EpiComboBox.prototype.set_EpiStaticDataList=function(val)
{   
    this.retrieveOnActivate = false;
    this.epiStaticDataList=val;
}
EpiComboBox.prototype.get_EpiStaticDataList=function()
{
    if (!this.epiStaticDataList)
        this.epiStaticDataList=[];
    return this.epiStaticDataList;
}

EpiComboBox.prototype.PerformAction=function() {}
EpiComboBox.prototype._load=function()
{
    //Only for an AppBuilt combo or an unbound combo
    if((!this.DataColumn&&!this.DataView)||(this.setupAppBuiltCombos==true))
    {
        var ctrl=Global.document.getElementById(this.ID);

        if(this.setupAppBuiltCombos&&this.adapterName) // Call the method only for combos which have adapters.
            FormFunctions.ComboRetrieve(this);
        if(ctrl) this.SetChangeEvent(ctrl); // setup event handlers
    }

    if(this.DataView && Global.Form.ID=="WhseBinForm")
        Global.BindingEngine.EpiDataViews[this.DataView].get_Event("EpiRowChanged").subscribe(this.processColumnChanged,this,true);
}

EpiComboBox.prototype.set_SelectedText=function(val)
{
    if (!val) return;
    
    // Set the selected text in the textbox of the combo
    var ctrl = Global.document.getElementById(this.ID);
    var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
    
    // select the text that was passed in
    var currentVal = txtCtrl.value; 
    var start = currentVal.indexOf(val);
    if(currentVal.length > 0 && start != -1)
        this._selectRange(txtCtrl, start, val.length);
}

EpiComboBox.prototype.get_HasODataViewData=function()
{
    return (this.DataView && Global.BindingEngine.EpiDataViews[this.DataView] && Global.BindingEngine.EpiDataViews[this.DataView].get_HasRow());
}
EpiComboBox.prototype.get_EpiODataView=function()
{
    var DV;
    if (this.DataView)
        DV = Global.BindingEngine.EpiDataViews[this.DataView];
    return DV;
}
EpiComboBox.prototype.set_RowFilter=function(value)
{
    this.rowFilter = value;
 
    if (this._getDataArray() != null)
        this._applyRowFilter();
}
EpiComboBox.prototype.get_RowFilter=function(){return this.rowFilter; } 
EpiComboBox.prototype.get_RowCount=function()
{
    if (this.ChangesRows == true && this.InNavCtrl == true)
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        return dv.dataView.Rows.length;
    }
    else
    {
        var dArr = this._getDataArray();
        if(dArr)
            return dArr.length;
        else
            return this.get_Rows().Count;
    }
} 
EpiComboBox.prototype.set_Text=function(txt){} // TODO: This sets the text in the combo, but we need to select the correct value too?
EpiComboBox.prototype.get_Row=function(idx)
{   
    return this.get_Rows()[idx];
}
EpiComboBox.prototype.get_Rows=function()
{
    this._retrieveComboData(Global.document.getElementById(this.ID));
    if(this.dataSrc)
    {
        return this._getRowsFromDataSrc();
    }
    else
    {
        return this._getRowsFromArray();
    }
}

EpiComboBox.prototype.set_EpiFiltersParams=function(value)
{
    this.epiFilterParams = this._appendToArr(value,null);
}
EpiComboBox.prototype._getRowsFromDataSrc=function()
{
    var me = this;
    
    var dt;
    if(Global.InstanceOf(this.dataSrc,"DataTable"))
        dt = this.dataSrc;
    else if(Global.InstanceOf(this.dataSrc,"DataView"))
        dt = this.dataSrc.Table;
    else if(Global.InstanceOf(this.dataSrc,"DataSet") && this.dataSrc.GetTableCount()>0)
        dt = this.dataSrc.get_Table(0);
   
    var rowsColl = new RowsCollection();
    if (!dt) return rowsColl;
    
    var rowIndx = 0;
    for(var r in dt.Rows)
    {
        var newRowObj = {"Cells":{},"Index":rowIndx};
        
        var idx = 0;
        for(var c in dt.Rows[r])
        {
            if (Global.InstanceOf(c,"Object") || (typeof c)=="object")
                continue;
                
            newRowObj.Cells[idx] = newRowObj.Cells[c] = new UltraGridCellCombo(dt.Rows[r][c]);
            idx++;
        }
        
        newRowObj.get_Cell=function(idx)
        {
            return this.Cells[idx];
        }
        
        newRowObj.set_Selected=function(val)
        {
            if(val==true) 
                me.SetSelectedRow(Global.document.getElementById(me.ID), this);
        }
        
        newRowObj.set_Hidden=function(val)
        {
            var comboData = me._getDataArray();
            if(val==true) 
                comboData[this.Index][0].push("IsHidden"); // Add a second element to the Code to indicate this row is hidden
            else
               comboData[this.Index][0].splice(1,1); // Remove the IsHidden element
               
            me._saveDataArray(comboData);
        }
        
        rowsColl.Add(newRowObj);
        rowIndx++;
    }
    
    return rowsColl;
}
EpiComboBox.prototype._getRowsFromArray=function()
{
    var me = this;

    var dataArr = this._getDataArray();
    
    var rowsColl = new RowsCollection();
    var rowIndx = 0;
    for(var r in dataArr)
    {
        var newRowObj = {"Cells":{},"Index":rowIndx};
    
        var row = dataArr[r];
        
        newRowObj.Cells[0] = newRowObj.Cells[this.ValueMember] = new UltraGridCellCombo(row[0][0]);
        
        var cellIdx=1,dIndx = 0;
        var descArr = row[1];
        for(var c in this.EpiColumns) // Get all the description columns
        {
            newRowObj.Cells[cellIdx] = newRowObj.Cells[this.EpiColumns[c]] = new UltraGridCellCombo(descArr[dIndx]);
            cellIdx++;dIndx++;
        }     
        // this.hdnCols holds the values for the hidden columns for all the rows. Create cells for those too. 
        // Note: The column index in hdnCols may not be same as the original data, so might be an issue if cells are referenced by index. 
        var hdnCol;
        for(var c in this.epiHiddenCol)
        {
            hdnCol = this.epiHiddenCol[c];
            if (hdnCol== this.ValueMember) continue;
            
            row = this.hdnCols.Rows[rowIndx];
            newRowObj.Cells[cellIdx] = newRowObj.Cells[hdnCol] = new UltraGridCellCombo(row[hdnCol]);

            cellIdx++;
        }     
        newRowObj.get_Cell=function(idx)
        {
            return this.Cells[idx];
        }
        
        newRowObj.set_Selected=function(val)
        {
            if(val==true) 
                me.SetSelectedRow(Global.document.getElementById(me.ID), this);
        }
        newRowObj.set_Hidden=function(val)
        {
            var comboData = me._getDataArray();
            if(val==true) 
                comboData[this.Index][0].push("IsHidden"); // Add a second element to the Code to indicate this row is hidden
            else
               comboData[this.Index][0].splice(1,1); // Remove the IsHidden element
               
            me._saveDataArray(comboData);
        }
        newRowObj.get_ListObject=function()
        {
            var me=this;
            row.get_Item=function(col){return me.Cells[0].Value;}
            return row;
        }
        rowsColl.Add(newRowObj);
        rowIndx++;
    }
    return rowsColl;
}


EpiComboBox.prototype.SetColumnFilter=function()
{
    this.EpiColumns = []; // Clear the list
    for(var i = 0; i < arguments.length; i++)
    {
        if(Global.IsArray(arguments[i]))
        {
            for(var j=0;j<arguments[i].length;j++)
            {
                this.EpiColumns.push(arguments[i][j]);
            }
        }
        else
        {
        this.EpiColumns.push(arguments[i]);
    }
    }
    this.rebind();
}
EpiComboBox.prototype.FilterColumns=function()
{
    // tb... temp code... this function is supposed to do something different, but for
    // now I'm going to do the same as SetColumnFilter
    this.EpiColumns = []; // Clear the list
       
    for(var i = 0; i < arguments.length; i++)
    {
        if(Global.IsArray(arguments[i]))
        {
            for(var j=0;j<arguments[i].length;j++)
            {
                this.EpiColumns.push(arguments[i][j]);
            }
        }
        else
        {
        this.EpiColumns.push(arguments[i]);
    }
    }
     this.rebind();
}
EpiComboBox.prototype.set_BeforeOnDemandRetrieveDelegate=function(value)
{
	this.BeforeOnDemandRetrieveDelegate = value;
}
EpiComboBox.prototype.SetChangeEvent=function(ctrl)
{
    this.InitDropControl(ctrl);
}
EpiComboBox.prototype.Bind=function(bEngine, ctrl, dv, rowNum, isTool) 
{
    this.isBeingNotified=true;
    if (!isTool) isTool = false;
    
    if (!this.preFilled)
    {
        this.hasBeenRetrieved = false; // reset this becuase the combo is being re-bound.
        this.TheDataSet.ExtendedProperties["Invalidated"] = true;
        this.hasStaticData = false;
    }
    
    var data = null;
    if (dv && rowNum != -1)
        data = dv.dataView.get_Row(rowNum);

    if (!(this.HasInputTrackerPanelParent == true && this.DashboardPrompt == true))
    {
        if(data && this.DataColumn)
        {    
            var descData;
            var dColumn = data.get_Item(this.DataColumn);
           
            if(this.DescColumn) 
            {
                descData = data.get_Item(this.DescColumn);
                
                if(dv.dataView && dv.dataView.Table.Columns[this.DescColumn] && 
                    dv.dataView.Table.Columns[this.DescColumn].DataType=="System.DateTime" && descData!="")
                {
                    descData = Convert.ToDateTime(descData).ToShortDateString();
                }
                if (dColumn.toString() != "" && descData.toString() == "" && this.retrieveOnActivate == true)
                {
                    var overridesetting = true; //InsertRowForZeroValue
		            if(this.OverrideZeroValue == OverrideZeroValueSettings.Never)
			            overridesetting = false;
		            else if(this.OverrideZeroValue == OverrideZeroValueSettings.Always)
			            overridesetting = true;
			            
		            if (overridesetting) descData = this.NoneSel;
                }
            }
            if (!descData) // Couldnt find it from the dataview, check if we can find it from the combo's data.
            {
                // Removed condition for not being a navcontrol because when a new item is created on the form, this was causing the navcontrol to enable the wrong buttons.
                if (this.retrieveOnActivate == false) //&& this.InNavCtrl == false
                {
                      this._retrieveComboData(); // Dont need the comboCtrl since we know either getDataFromDataSrc or checkAndLoadListData will be called.
                      
                    //if (this.hasBeenRetrieved == true)  
                    descData=""; // SetValue will look for the description in the retrieved data
                }
                else
                {
                    descData = dColumn;
                    if(dv.dataView && dv.dataView.Table.Columns[this.DataColumn] && 
                        dv.dataView.Table.Columns[this.DataColumn].DataType=="System.DateTime" && descData!="")
                    {
                        descData = Convert.ToDateTime(descData).ToShortDateString();
                    }
                }
            }
        
            this.SetValue(ctrl, dColumn, descData.toString());
        }
        else
            this.SetValue(ctrl, "", "");
    }
    if(this.DataView && this.DataColumn && rowNum>-1 && !isTool && bEngine.CurrentTab)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);

    this.RefreshProperties(ctrl, dv, rowNum);
    
    this.SetChangeEvent(ctrl); // sets up event handlers for the bound controls
    this.isBeingNotified=false;
}

EpiComboBox.prototype.RefreshProperties=function(ctrl,dv,row)
{
    if(this.SkipRefreshProperties) return;

    if(!this.InNavCtrl) 
    {
       EpiControl.prototype.RefreshProperties.call(this,ctrl,dv,row);
       return;
    }
    // Combo within navcontrol, Row rules dont apply to navcontrols
    if(row==-1)
    {
        if(!this.EpiKeyField)
            this.SetEnabled(ctrl, false, true);
        else
        {
            this.SetEnabled(ctrl, true, true);
            if(!this.DashboardPrompt) this.Focus(ctrl);
            
            if(FormTestManager) FormTestManager.RegisterKeyField(this);
        }
    }
    else
    {
        // Make sure navcontrol not hidden or disabled
        this.SetEnabled(ctrl, true, true);
        this.SetVisible(ctrl, true, true); 
    }
     if(dv && this.DataColumn && Global.Form.FormOptions && Global.Form.FormOptions.RequiredIndicator)
     {
        var tbl = dv.dataView.Table;
        var col = tbl.Columns[this.DataColumn];
        if(col) 
        {
            var prop=tbl.GetExtendedProperty(this.DataColumn,"Required","False"); 
            if(prop=="True")
              this._setRequiredStyle(ctrl);
        }
     }
}
EpiComboBox.prototype.SetupCombo=function()
{
   this.Retriever=new EpiRetriever(this);
   this._initCombo(this.Retriever);
   
   this.Retriever.ValueMember = this.Retriever.EpiValueMember = this.ValueMember;
   var descList = this.DisplayMember;
   if (this.EpiColumns && this.EpiColumns.length>0)
	    descList = this.EpiColumns.join("~");
	this.Retriever.DisplayMembers=descList;
	this.Retriever.EpiSort = this.EpiSort;
	
   this.DataSource = new DataView(this.TheDataSet.get_Table(0));
}


EpiComboBox.prototype.AssociateCombo=function(AssociatedCombo)
{
    this.AssociatedCombo = AssociatedCombo;
   	this._initCombo(AssociatedCombo.Retriever);
	this.retrieveOnActivate = AssociatedCombo.retrieveOnActivate;
	//	this.callBackToken = AssociatedCombo.callBackToken;
   	this.BeforeOnDemandRetrieveDelegate = AssociatedCombo.BeforeOnDemandRetrieveDelegate;
}

EpiComboBox.prototype.InitDropControl=function(ctrl)
{
    // Do this only if the combo is not within a grid, or if its within a grid then
    // its being displayed as a combo and not a DIV
    if((!this.EventsAdded && !this.InGrid) || (this.InGrid && ctrl.tagName!="DIV"))
    {
        // Set up event handling for the arrow
        var oThis = this;
       
        var anchorCtrl = ctrl.rows[0].cells[1].getElementsByTagName("a")[0];
        EpiEventManager.addListener(anchorCtrl, "click", this._toggleContents, this, true);
        
        var ComboText=ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        EpiEventManager.addListener(ComboText, "keyup", this._autoSearch, this, true);
                
        EpiEventManager.addListener(ctrl, "keyup", this._keyNavigate, this, true);
    
        EpiEventManager.addListener(ComboText, "change", this._textchange, this, true); 
        EpiEventManager.addListener(ComboText, "blur", this._textBlur, this, true); 

        if (this.DropDownStyle == UltraComboStyle.DropDownList) // DropdownList means only selection from dd, cannot type in
        {
            // Disable only the textbox
            ComboText.readOnly = true;
            if(ComboText.tabIndex!="-1") ComboText.setAttribute("_tabIndex", ComboText.tabIndex);
            ComboText.tabIndex = "-1"; 
        }
        EpiEventManager.addListener(ctrl, "mousedown", this._mousedown, this, true);
        this.EventsAdded = true;
    }
}

EpiComboBox.prototype.set_SelectedRow=function(val) 
{
    if(val==undefined) return;

	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) this.SetSelectedRow(ctrl,val);
}
EpiComboBox.prototype.SetSelectedRow=function(ctrl, row)
{
    var rowVal = row.Cells[this.ValueMember].Value;
    this.SetValue(ctrl,rowVal);
}
EpiComboBox.prototype.get_SelectedRow=function()
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) return this.GetSelectedRow(ctrl);
}
EpiComboBox.prototype.get_ActiveRow=function()
{
	return this.get_SelectedRow();
}
EpiComboBox.prototype.set_ActiveRow = function(val)
{
    return this.set_SelectedRow(val);
}
EpiComboBox.prototype.GetSelectedRow=function(ctrl)
{
    var val = this.GetValue(ctrl);
    
    var rows = this.get_Rows();
    for(var r in rows.items)
    {
        var row = rows[r];
        if (row.get_Cell(this.ValueMember).Value == val)
            return row;
    }
    return null;
}

// If there is a dataSrc, checks if there is a code=""
EpiComboBox.prototype._isBlnkCodeinDataSrc=function(ctrl)
{
    var ret = false;
    if (this.dataSrc || (this.ChangesRows && this.InNavCtrl))
    {
        if (this.hasBeenRetrieved == false)
            this._retrieveComboData(ctrl);
            
        var indexCode =  this._getCodeMatchIndex(""); // Get the index of the code="" from the data array
        if (indexCode != -1) ret = true;
    }
    
    return ret;
}

EpiComboBox.prototype._getBlnkCodefromDataSrc=function(ctrl)
{
    var ret = -1;
    if (this.dataSrc || (this.ChangesRows && this.InNavCtrl))
    {
        if (this.hasBeenRetrieved == false)
            this._retrieveComboData(ctrl);
            
        var indexCode =  this._getCodeMatchIndex(""); // Get the index of the code="" from the data array
        if (indexCode != -1) ret = indexCode;
    }
    
    return ret;
}

// ctrl=Combo control
// val=Code
// descVal= string or string array of Description 
EpiComboBox.prototype.SetValue=function(ctrl,val,description)
{ 
    var theVal=val;
    if(theVal==null) theVal="";
    var currVal = ctrl.getAttribute("_val"); // GetValue replaces 'undefined' with '', which causes the following condition to be true
    
    if (theVal.toString() == currVal) 
    {
        // Make sure the description is set.
        var currentDesc = "";
        if(this.InGrid && ctrl.tagName=="DIV") currentDesc = ctrl.innerHTML; 
        else
        {
            var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
            currentDesc = txtCtrl.value;
        }
        if (!currentDesc && description)
        {
            if(this.InGrid && ctrl.tagName=="DIV")  ctrl.innerHTML = description; 
            else
            {
                // Set the code in the ctrl's _val expando property
                var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
                txtCtrl.value = description;
            }
            if (Global.IsString(val) && val == "") this.SelectedRowIndx = this._getBlnkCodefromDataSrc(ctrl); // returns -1 if Blank code doesnt exist.
            return;
        }
        if (this.hasBeenRetrieved)
        {
            var indexCode =  this._getCodeMatchIndex(val); // Get the index of the code from the data array
            if (indexCode != -1) // found the code and find the description
            {
                // If we found the code, use the description from the data array
                var arrDesc = this._getDisplayStringFromIndex(indexCode);
                if (arrDesc && currentDesc != arrDesc)
                {
                    if(this.InGrid && ctrl.tagName=="DIV")  ctrl.innerHTML = arrDesc; 
                    else
                    {
                        // Set the code in the ctrl's _val expando property
                        var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];

                        arrDesc = arrDesc.toString();
                        arrDesc = arrDesc.replace("&lt;", "<");
                        arrDesc = arrDesc.replace("&gt;", ">");

                        txtCtrl.value = arrDesc;
                    }
                }
                    
            }
        }
        if (Global.IsString(val) && val == "") this.SelectedRowIndx = this._getBlnkCodefromDataSrc(ctrl); // returns -1 if Blank code doesnt exist.
        return; // combo is already set to this value.
    }

    this._prevValue=val;
    var prevSelectedIndex= this.SelectedRowIndx;
    if(val==undefined) val = "";
    
    if (Global.IsString(val) && val == "" && !this._isBlnkCodeinDataSrc(ctrl))
    {
        ctrl.setAttribute("_val", val);
        
        if(this.InGrid && ctrl.tagName=="DIV")
            ctrl.innerHTML = ""; 
        else
        {
            // Set the code in the ctrl's _val expando property
            var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
            txtCtrl.value = "";
        }
        this.SelectedRowIndx = -1;
        this.OnValueChanged(); // Trigger the ValueChanged event
        if (prevSelectedIndex != this.SelectedRowIndx)
            this._selectedIndexChanged();
        return;
    }
        
    var DisplayString = "";
    
    // description was not passed in see if we can retrieve data
    if (description == undefined && this.hasBeenRetrieved == false)  this._retrieveComboData(ctrl);

    // Check if value is in the current dropdown options. if not, add it in 
    var indexCode =  this._getCodeMatchIndex(val); // Get the index of the code from the data array
    if (indexCode != -1) // found the code and there is no description
    {
        // If we found the code, use the description from the data array
        DisplayString = this._getDisplayStringFromIndex(indexCode);
        if (DisplayString==undefined && description) // If we cant find the description from the data array, use what is passed in
            DisplayString = description;
        else if ((description!=undefined && description!="")  && this.retrieveOnActivate==true && DisplayString != description)
            DisplayString= description; // means data array is invalid at this point
        else if (DisplayString == undefined)
            return;
    }
    
    if(this.InGrid && ctrl.tagName=="DIV")
    {
        if (DisplayString == "")
            DisplayString = description;
        
        if(!DisplayString) DisplayString = "&nbsp";
        ctrl.setAttribute("_val", val);
        ctrl.innerHTML = DisplayString;
    }
    else 
    {
        // If the code doesnt exist in the combo, then add it to the data array and the ui.
        // If at this point we have retrieved data and the code could not be found in the retrieved data, dont add the new value to the combo contents, just set the text.
        if (indexCode == -1)
        {
            if (!this.hasBeenRetrieved)
            {
                var descArr;
                var newOption = "";
               
                if (description)
                {
                    if (Global.IsArray(description))
                    {
                        DisplayString = description[0]; 
                        descArr = description;
                    }
                    else
                    {
                       descArr = new Array();
                       descArr.push(description); 
                       DisplayString = description;
                    }
                }
                else
                {
                    var overridesetting = true; //InsertRowForZeroValue
		            if(this.OverrideZeroValue == OverrideZeroValueSettings.Never)
		            {
			            overridesetting = false;
		            }
		            else if(this.OverrideZeroValue == OverrideZeroValueSettings.Always)
		            {
			            overridesetting = true;
		            }
                    if (this.isGridValueList && overridesetting && this.ValColIsInt && val == 0)
	                {
    	            
		                // If there is no row with value=0, add one in
		                descArr = new Array();
                        descArr.push(this.NoneSel); 
                        DisplayString = this.NoneSel;
	                }
	                else
	                {
    	            
	                    // set it as ""
		                descArr = new Array();
                        descArr.push(""); 
                        DisplayString = "";//this.NoneSel;
	                }
                   
                }
                
                if (descArr.length > 0) // For now, we cannot add new option if no description is provided. Maybe later this can be a default description like 'Unknown'
                {
                    var codeArr = new Array();
                    codeArr.push(val);
                    var dataArray = this._getDataArray();
                    if (!dataArray)
                        dataArray = [];
                        
                    var len = dataArray.push(new Array(codeArr,descArr));
                    this._saveDataArray(dataArray,true); // Save back to global structure
                    indexCode = 0;
                }
            }
            else // data was retrieved but val doesnt exist in the combo contents, just set the text
            {
                if (!description && val) DisplayString = val; // For Matrix Job Entry, when the SCR has a Target SP that doesnt exist in the dd any more.
                if (description && !DisplayString) DisplayString = description;
            }
        }
        
        // Set the value in the textbox
        if (DisplayString != undefined) // Found the description
        {
       
            DisplayString = DisplayString.toString();
            DisplayString = DisplayString.replace("&lt;", "<");
            DisplayString = DisplayString.replace("&gt;", ">");
        
            // Set the code in the ctrl's _val expando property
            ctrl.setAttribute("_val", val);
            var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
            txtCtrl.value = DisplayString;
            // If the combo is in the grid, also set the value to the hidden div
            if(this.InGrid)
            {
                 var td = ctrl.parentNode;
                 var div = td.getElementsByTagName("DIV");
                 if(div.length>0) div[0].innerHTML = DisplayString;
            }
        }
    }
    
    this.SelectedRowIndx = indexCode;
    this.OnValueChanged(); // Trigger the ValueChanged event
    if (prevSelectedIndex != this.SelectedRowIndx)
            this._selectedIndexChanged();
}

EpiComboBox.prototype.get_Text=function()
{
    // Return the text in the combo (that would be the description)
    var ctrl = Global.document.getElementById(this.ID);
    
    if(this.InGrid && ctrl.tagName=="DIV")
    {
       return ctrl.innerHTML;
    }
    else
    {
        var txtCtrl = ctrl.rows[0].cells[0].getElementsByTagName("input")[0];
        return txtCtrl.value;
    }
}
EpiComboBox.prototype.GetValue=function(ctrl)
{
    // Get the currently selected value 
    var val = ctrl.getAttribute("_val");
    if (val == undefined) val = "";
    if(val=="&nbsp;") val = "";
    return val.toString();
}

EpiComboBox.prototype.GetHtmlForGrid=function(id, row,dt)
{
    var val = this.GetValFromRow(dt,row,this.DataColumn);
    if(!val) val = "";
    
    var desc = "";
    if (this.DescColumn != "")
        desc = this.GetValFromRow(dt,row,this.DescColumn); // get display string from 
    
    var DisplayString = "";
    if (val != "")
    {
        var indx = this._getCodeMatchIndex(val);
        if (indx != -1)
            DisplayString = this._getDisplayStringFromIndex(indx);
    }
   
    if (!DisplayString && desc) // If we cant find the description from the data array, use desc from the dataview
        DisplayString = desc;
    else if (!String.IsNullOrEmpty(desc)  && this.retrieveOnActivate==true && DisplayString != desc)
        DisplayString= desc; // means data array is invalid at this point
       
    if(!DisplayString) DisplayString = "&nbsp";
    return "<div style='height:13px;' id='" + id + "' class='DropControl' tabIndex='0' _val='" + val + "'>" + DisplayString + "</div>";
}

EpiComboBox.prototype.set_SearchFilter=function(str)
{
    this.epiSearchFilter=str;
}

EpiComboBox.prototype.get_Retriever=function()
{
	return this.Retriever;
}
EpiComboBox.prototype.set_Retriever=function(value)
{
    this.Retriever = value;
}
EpiComboBox.prototype.get_SequencerParams=function()
{
    var wHash = new Hashtable(); 
	var dsMode = DataSetMode.ListDataSet;
	if (this.TableName != null && this.TableName.length>0)
	{
        dsMode = DataSetMode.RowsDataSet;
		if (this.wClauses != null && this.wClauses.Count >0)
			wHash = this.wClauses;
		else if (this.epiSearchFilter!=null && this.epiSearchFilter.length>0) 
		    wHash[TableName] = epiSearchFilter;
	} 
	else
	{
		if(this.epiSearchFilter.length > 0)
		{
			wHash["BaseList"]= this.epiSearchFilter;
		}
	}
	var opts = SearchOptions.CreateRuntimeSearch(wHash, dsMode);
	return  new Params(this.Retriever, // Changed EpiRetrievalSequencer.Params to Params
		                opts,
		                this.adapterName); // changed this.GetAdapter() to this.adapterName
}
EpiComboBox.prototype.GetAdapter=function(adapter) // Adapter is passed when EpiRetrievalSequencer is used
{
    if (!this.oAdapter)
    {
        var  adp= this.adapterName;
        if (!adp && adapter) adp = adapter;
        if (adp)
        {
            this.oAdapter = Global.GetAdapter(adp,Global.Form);
            Global.LoadProxyForAdapter(this.oAdapter,null,true);
        }
        
        if(this.adapterName=="IRWarehseSearchAdapter")
        {
            //Special combo code in adapter.  
			if(this.TranType) this.oAdapter.tranType = this.TranType;
			if(this.WhseType) this.oAdapter.whseType = this.WhseType;
			if(this.PartNum) this.oAdapter.partNum = this.PartNum;
        }
    }
    return this.oAdapter;
}

EpiComboBox.prototype.AppendEpiFilters=function(filterArr)
{
    this.epiFiltersAppend = this._appendToArr(this.epiFiltersAppend,filterArr,false);
}
EpiComboBox.prototype.set_EpiFilters=function(filterArr)
{
    this.epiFilters = this._appendToArr([],filterArr,false);
}

// **********************
// Event handlers
// **********************

EpiComboBox.prototype.OnValueChanged=function()
{
    if(!this.isBeingNotified)
    {
        this.get_Event("EpiComboChanged").fire(this);
        return this.get_Event("ValueChanged").fire(this);
    }
}
EpiComboBox.prototype._selectedIndexChanged=function()
{
    this.get_Event("SelectedIndexChanged").fire(this,{});
    if (this.get_Event("RowSelected").subscribers.length > 0) // This is causing a reload of many combos when we select a value from a combo, even though there are no subscribers to this event.
        this.get_Event("RowSelected").fire(this,{"Row":this.get_SelectedRow()});  
}
EpiComboBox.prototype._textchange=function (e)
{
   // Update data source.
   var textControl = e.target||e.srcElement; 
   var comboControl = Global.GetParentByTag(textControl, "TABLE", false);
    
   var txtValue = textControl.value; // text in the combo's text control
   var val = this.GetValue(comboControl); // Original value in the combo
   if (txtValue == "")
   {
     this.SetValue(comboControl,"");
     this._updateDataSource(-1, comboControl);
     if (this.InNavCtrl) this.get_Event("ComboTabPressed").fire(this);
     return;
   }
   
   var indx = this._getIndexForDesc(txtValue); // see if the text value exists in the combo data
   if (indx >= 0) // Desc exists in combo data
   {
        var code = this._getDataArray()[indx][0];
        
        // Make sure the dataview has the same value, if not update it
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        if (dv && dv.Row != -1)
        {
            var cVal = dv.dataView.get_Row(dv.Row).get_Item(this.DataColumn).toString();
            if (cVal != code)
            {
                this.SetValue(comboControl,code,txtValue);
                this._updateDataSource(indx,comboControl); // update the data source since its a valid value
            }
            
        }
        if (this.InNavCtrl) this.get_Event("ComboTabPressed").fire(this);
        return;
   }
   else if (indx < 0) // user typed in something that isnt in the combo data
   {
        // Reset combo to value from the dataview
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        if (dv && dv.Row != -1)
        {
            if (this.DisplayMember != this.ValueMember)
            {
                // Reset combo to value from the dataview
                var theRow = dv.dataView.get_Row(dv.Row);
                var cVal = theRow.get_Item(this.DataColumn).toString();
                var descVal = "";
                if(this.DescColumn) descVal = theRow.get_Item(this.DescColumn);
                this.SetValue(comboControl,cVal,descVal); //reset back to last value
                if (this.InNavCtrl) this.get_Event("ComboTabPressed").fire(this);
                return; 
            }
            else
            {
                // _updateDataSource calls BE.OnChange which looks at the combo's current value.
                // Since in this case we dont set the value, just update the dataview directly.
                //this._updateDataSource(indx,comboControl); // Update to the dataview
                dv.SetValue(dv.Row, this.DataColumn, txtValue, false, this)
                if (this.InNavCtrl) this.get_Event("ComboTabPressed").fire(this);
                return;
            }
        }
        
   }
  
}
EpiComboBox.prototype._autoSearch=function(e)
{
    var textControl = e.target||e.srcElement; 
    var comboControl = Global.GetParentByTag(textControl, "TABLE", false);

	var like = this.get_EpiContextMenuKey();
	if(like && like != "")
	{
		var returnVal = ExtendedProperties.HandleKeyPress(this, e);

		if (returnVal) {
			if(!this.get_ReadOnly())
			{
                if (comboControl)
                {
                    this.SetValue(comboControl,returnVal);
                    this.OnChange(comboControl);
                }
			}
		}
        if(this.InGrid)
        {
		    if(Global.KeyboardManager.ShiftKey==true) { Global.KeyboardManager.ShiftKey = false; }
		    if(Global.KeyboardManager.CtrlKey==true) { Global.KeyboardManager.CtrlKey = false; }

            var me=this;
            setTimeout(function() {me.Focus(comboControl);}, 50);
        }
        if(Global.ServerSession.EnterpriseSearch && ExtendedProperties.MatchesHotKey(Global.Form.FormOptions.EnterpriseSearchHotKey, e)) 
        {
            EpiEventManager.stopEvent(e);
            return;
        }
	}
	
    if (this.get_ReadOnly()) return;

    var iKeyCode = (e)?e.keyCode:Global.window.event.keyCode;
    if ( (iKeyCode < 32 && iKeyCode != 8) || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) 
    {
        return;
    } 
    
    //autosuggest
   var BackSp = (iKeyCode == 8 || iKeyCode == 46)? true: false;
    
    // Based on the text entered, filter the combo dropdown values.

        
    // Get the dropdown entries based on the text entered in the combo
    this.gUIFilter = textControl.value;
    
    if (BackSp && textControl.value== "") 
    {
        comboControl.setAttribute("_val","");
        return;
    }
    
    if (Global.DropControlManager.ActiveControlIsOpen == true)
    {
        this._getDiv(true);
    }
    else
    {
        Global.DropControlManager.ActiveDropControl = comboControl;
        this._getDiv();  // Setting the gUIFilter causes the dropdown contents to be filtered
    }   
    var firstRow = Global.DropControlManager.ActiveDropContents.childNodes[0].rows[0];
    
    var code = ""; 
     var desc = "";
        
    var dataArray = this._getDataArray();
    if (!dataArray || dataArray.length == 0) return; // No data in the combo
    
    if (!firstRow && this.gUIFilter != "") // no match found and there was a valid filter string
    {
		// Don't force user to select a valid value. When they tab off, the previous value will get selected.
		this.gUIFilter = "";
		return;
    }
    else if (!firstRow && this.gUIFilter == "") // The combo has no items in it
    {
        return;
    }
    else if (firstRow)
    {
        code = dataArray[firstRow.cells[0].id][0].toString();
        desc = firstRow.cells[0].innerHTML;
    }
    
   
    // If backsp was clicked, then only refresh the list with the new value
    if (!BackSp)
    { 
        this.inAutoFilter = true;
        
        //this.SetValue(comboControl, code,desc); // Set value to the first item in the auto search list
        textControl.value = desc;
             
        // If there are more than 1 row that match, then open and show them
        if (Global.DropControlManager.ActiveDropContents.childNodes[0].rows.length > 1)
        {
            this._showContents(comboControl, false); // open the combo to display contents, set flag to not refresh data
	        this._highlightComboRow(Global.DropControlManager.ActiveDropContents.childNodes[0],0); // hightlight the first row
    	}
    	else 
        {
            this._hideContents();
            if(BrowserSniffer.Safari13 && this.InGrid)
		    {
			    setTimeout(function() {textControl.focus();}, 50);
		    }
//		    // We found a match, update the datasource
//		    this._textchange({"target":textControl});
        }
	    // select the text that was auto completed
	    var currentVal = textControl.value; //element.all._dropText.value;
	    var overflow = currentVal.substring(this.gUIFilter.length);
	    if(currentVal.length > 0 && overflow != "" && currentVal != overflow )
	    {
	        var iLen = this.gUIFilter.length; 
            this._selectRange(textControl, iLen, currentVal.length);
	    }
	    this.gUIFilter = "";
	}
//	else //if (textControl.value == "") // User clicked backpsace and cleared all the text
//	{
//	    // Force selection of first item in list
//	    this.SetValue(comboControl, code); // Set value to the first item in the auto search list
//	    this._highlightComboRow(Global.DropControlManager.ActiveDropContents.childNodes[0],0); // hightlight the first row
//	    textControl.select();
//	}
}

EpiComboBox.prototype._updateDataSource=function(index,comboCtrl,desc)
{
    if (!desc && index >= 0)
    {
        var dataArray = this._getDataArray();
	    desc = dataArray[index][1][0].toString();
	}
	if (desc == undefined) desc = "";
	
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    
    if (this.ChangesRows == true && this.InNavCtrl == true)
    {
        if (dv)
        {
            if (index > -1 && dv.Row != index)
                dv.DoRowChange(index, true);
            else if (dv.Row != -1)
            {
                var curVal = this.GetValue(comboCtrl);
                if (curVal == "")
                {
                    var cVal = dv.dataView.get_Row(dv.Row).get_Item(this.DataColumn).toString();
                    this.SetValue(comboCtrl, cVal);
                }
            }
        }
    }
    else
    {
        if (!dv || dv.Row == -1)
        {
			Global.BindingEngine.OnChange(comboCtrl); // Update the code to the dataview too
            
        }
        else
        {
            var row = dv.Row;
            var theRow = dv.dataView.get_Row(row);
            var cVal = theRow.get_Item(this.DataColumn).toString();
            var descVal = "";
            if(this.DescColumn) descVal = theRow.get_Item(this.DescColumn);
            try
            {
				Global.BindingEngine.OnChange(comboCtrl); // Update the code to the dataview too
            
                // If this is a RetriveOnDemand combo. we need to set the description of the selected item back into the rows description colum
			    if(this.retrieveOnActivate)
				    if(this.DescColumn.length > 0  && this.DescColumn != this.DataColumn)
					 theRow[this.DescColumn] = desc; // Not called set_Row here becuase we dont want the row changing events to be fired for this.
			    
            }
            catch(ex)
            {
                // Reset everything back as before
                theRow.set_Item(this.DataColumn, cVal);
                if (descVal != "") theRow.set_Item(this.DescColumn, descVal);
                
                this.SetValue(comboCtrl,cVal,descVal);
            }
        }
    }
}
EpiComboBox.prototype._keyNavigate=function(e)
{
    var iKeyCode = (e)?e.keyCode:Global.window.event.keyCode;
    if (iKeyCode == 13 && Global.DropControlManager.ActiveControlIsOpen) // Enter key, close the combo if its open
    {
        this._hideContents();
        if(BrowserSniffer.Safari13 && this.InGrid)
		{
			var ComboText=ctrl.getElementsByTagName("input")[0];
			setTimeout(function() {ComboText.focus();}, 50);
		}
		return;
    }
    if (iKeyCode == 38 || iKeyCode == 40) // up/down arrow
    {   
        var index = -1, hiliteRow=-1;
        var comboCtrl = (Global.DropControlManager.ActiveControlIsOpen)?Global.DropControlManager.ActiveDropControl:Global.document.getElementById(this.ID);
        if (!Global.DropControlManager.ActiveControlIsOpen && !this.hasBeenRetrieved)
            this._retrieveComboData(comboCtrl,false);
            
        var dataArray = this._getDataArray();
        if (!dataArray) return;
        
        if(Global.DropControlManager.ActiveControlIsOpen && this.currHighlightedRow)
        {
            hiliteRow = this.currHighlightedRow.rowIndex; // index of the html row element currently highlighted
            var elem = this.currHighlightedRow.getElementsByTagName("TD");
            if (elem.length > 0)
               index = elem[0].id; // id stores the code value of the row
               
            if (iKeyCode == 38) // 38 = up arrow key
            {
                if (hiliteRow == 0) return; // We are already on the first item
                index--;
                hiliteRow--;
            }
            else if (iKeyCode == 40) //40 = down arrow key
            {
                if (hiliteRow == this.currHighlightedRow.parentElement.rows.length -1) return; // We are already at the last item.
                index++;
                hiliteRow++;
            }
        }
        else
        {
            var currVal = this.GetValue(comboCtrl); 
            index = this._getCodeMatchIndex(currVal);
            if (index == -1) return;
            
            if (iKeyCode == 38) // 38 = up arrow key
            {
                if (index == 0) return; // We are already on the first item
                index--;
            }
            else if (iKeyCode == 40) //40 = down arrow key
            {
                if (index == dataArray.length -1) return; // We are already at the last item.
                index++;
            }
        }
        
        if (comboCtrl)
        {
            this.inAutoFilter = false; // user is navigating using keys

            var code = dataArray[index][0].toString(); 
	        var desc = this._getDisplayStringFromIndex(index);
	        this.SetValue(comboCtrl, code, desc);
	        var textControl = comboCtrl.rows[0].cells[0].getElementsByTagName("input")[0];
	        this._updateDataSource(index,comboCtrl,desc);
            textControl.select();
            if (Global.DropControlManager.ActiveControlIsOpen)
            {
                if (hiliteRow != -1)
                    this._highlightComboRow(Global.DropControlManager.ActiveDropContents.childNodes[0], hiliteRow);
                else
                    this._highlightComboRow(Global.DropControlManager.ActiveDropContents.childNodes[0], index);
            }
        }
    } 
    
}
EpiComboBox.prototype._docontentsclick=function(e)
{
    // User clicked on an entry in the dropdown
    var ctrl = e.target||e.srcElement; 
    if (ctrl.tagName == "TD")
    {
        this.inAutoFilter = false; // user clicked on an item to select it.
    
        var comboCtrl = Global.DropControlManager.ActiveDropControl;
        
        var index = parseInt(ctrl.id);
        var dataArray = this._getDataArray();
        var code = dataArray[index][0].toString(); 
	    var desc = this._getDisplayStringFromIndex(index);//dataArray[index][1][0].toString();
	    this.SetValue(comboCtrl, code, desc);
	    var textControl = comboCtrl.rows[0].cells[0].getElementsByTagName("input")[0];
	    this._hideContents();
	    this._updateDataSource(index,comboCtrl,desc);
	   
        textControl.select();
        //this.get_Event("RowSelected").fire(this, {});
    }
    EpiEventManager.stopEvent(e);
}

EpiComboBox.prototype._docontentsmouseover=function(e)
{
    var ctrl = e.target||e.srcElement; 
    if(ctrl.tagName!="TABLE")
	{
		var oRow =  Global.GetParentByTag(ctrl, "TR", false);
		var oTable =  Global.GetParentByTag(oRow, "TABLE", false);
		if (oTable && oRow)
		{
		    this._highlightComboRow(oTable, oRow.rowIndex);
		}
	}
}
EpiComboBox.prototype.InvalidateOnDemandRetriever=function(ClearData)
{
	if(this.retrieveOnActivate)
	{
		if(this.TheDataSet != null)
		{
			// no match - so we need to clear the datasource and add a new row
			if(!this.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
			{
				this.TheDataSet.ExtendedProperties.Add("Invalidated", false);
			}

			this.TheDataSet.ExtendedProperties["Invalidated"] = true;

			if(ClearData)
			{
				this._clearDataArray();
			}
		}
	}
}

EpiComboBox.BeforeOnDemandRetrieve=function(callbackFn, obj)
{
    //return function() {callbackFn();}
    return new Subscriber(callbackFn, obj, true);
}

EpiComboBox.prototype.AddZeroValueEntry=function()
{
    var indexCode =  this._getCodeMatchIndex("0"); // Get the index of the code from the data array
    if (indexCode != -1)
		return; // we already have a value of 0
	else
	{
        var dataArray = this._getDataArray();
        if (!dataArray) dataArray = [];
        var elem = [[['0'],[this.NoneSel]]];    
        dataArray = elem.concat(dataArray);
        this._saveDataArray(dataArray);
	}		
}

EpiComboBox.prototype.set_DataSource=function(datasource)
{
    this.dataSrc = datasource;
    this.rebind();
}
EpiComboBox.prototype.get_DataSource=function()
{
    if(this.dataSrc) return this.dataSrc;
    if(this.DataSource) return this.DataSource;

    var dataArray = this._getDataArray();
    if (dataArray && this.EpiTableName)
    {
        var ds = this._getDataSetFromArray(dataArray, this.EpiTableName);
        return ds.Tables[this.EpiTableName];
    }
    
    return null;
}

EpiComboBox.prototype.getDataFromDataSrc=function(forceRetrieve)
{
    if(this.hasStaticData && !forceRetrieve) return;

    //if (this.EpiColumns.length == 0) return;
    var dt;
    var rowFilter = "";
    if(Global.InstanceOf(this.dataSrc,"DataTable"))
		dt = this.dataSrc;
	else if(Global.InstanceOf(this.dataSrc,"DataView"))
	{
		dt = this.dataSrc.Table;
	    rowFilter = this.dataSrc.RowFilter;
	}
	else if(Global.InstanceOf(this.dataSrc,"DataSet") && this.dataSrc.GetTableCount()>0)
		dt = this.dataSrc.get_Table(0);
		
    if (!dt) return;
    
    this._refreshDataArray(dt, false, rowFilter);
    
    if (dt.Rows.length > 0)
    {
        this.hasStaticData = true; // makes sure data is not retrieved again later.
        this.hasBeenRetrieved = true;
    }
}

// Fills the dataarray from the datatable rows
EpiComboBox.prototype._refreshDataArray=function(dt, addhidden, rowFilter)
{
    var dataVal = "";
    var dataArray=[];


    var desc = '';
    var elem, val;
    
    var dtRows = rowFilter?dt.Select(rowFilter):dt.Rows;

    // If ValueMember and DisplayMember are not set, use the first column in the datasource
    if ((!this.ValueMember || !this.DisplayMember) && dt.Columns && dtRows.length > 0)
    {
        var firstCol = dt._getColumnName(0);
        if (!this.ValueMember)
            this.ValueMember = firstCol;
        if (!this.DisplayMember)
        {
            this.DisplayMember = firstCol;
            this.EpiColumns.push(this.DisplayMember);
        }
    }
    if (this.DisplayMember && this.EpiColumns.length == 0)
           this.EpiColumns.push(this.DisplayMember);
        
    var hiddenColumns = [];
    if (addhidden)
      hiddenColumns = this._appendToArr(this.epiHiddenCol, this.epiHiddenColAppend, true );
    
    var addedCodes = {};
    
    for(var rowNum=0, row; row=dtRows[rowNum]; rowNum++)
    {
        //if (addedCodes[row[this.ValueMember]]) continue;
        desc= [];
        dataVal = [];
        elem = [];
        dataVal.push(row[this.ValueMember]); // Code column
        addedCodes[row[this.ValueMember]] = 1;
        
        for(var c=0, col; col=this.EpiColumns[c]; c++)
        {
            val = row[col];
            if (this.cmbCols && this.cmbCols[col])
                desc[this.cmbCols[col]-1] = val;
            else
                desc.push(val);
        }
        if (addhidden)
        {
            for(var c=0, col; col=hiddenColumns[c]; c++)
            {
                //if (col == this.ValueMember) continue;
                val = row[col];
                if (this.cmbCols && this.cmbCols[col])
                    desc[this.cmbCols[col]-1] = val;
                else
                    desc.push(val);
            }
        }
        elem.push(dataVal);
        elem.push(desc); 
        dataArray.push(elem);
    }
    
    //if (dtRows.length > 0)
    if (dt) // As long as the datatable is valid, the data in the combo should be same as the rows. If there are no rows, the combo should be empty
        this._saveDataArray(dataArray); 
}

EpiComboBox.prototype.getDataFromStaticList=function(forceRetrieve)
{
    if(this.hasStaticData && !forceRetrieve) return;

    var comboData = [];
    var code, desc, indx=0;
    comboData[indx] = [[],[]];
    comboData[indx][0]=[""];
    comboData[indx][1]=[""];
    indx++;
    for(var i=0,item; item = this.StaticData[i]; i++)
    {
       code = desc = item; // setting the code and description to the same value
       comboData[indx] = [[],[]];
       comboData[indx][0]=[code];
       comboData[indx][1]=[desc];
       indx++;
    }
    
    this._saveDataArray(comboData); 
    this.preFilled = true;
}
EpiComboBox.prototype.ForceRefreshList=function()
{
    this._retrieveComboData(Global.document.getElementById(this.ID),true);
}
// ********************
// Other methods
// ********************

EpiComboBox.prototype.rebind=function()
{
    if (!this.dataSrc || this.ValueMember == "" || this.DisplayMember == "")
        return;

    // Invalidate the data because the binding members changed.
    if (!this.preFilled)
    {
        this.hasStaticData = false; 
        this.hasBeenRetrieved = false;
    }
    
    if (this.DataView)
    {
        var edv = Global.BindingEngine.EpiDataViews[this.DataView];
        if (!edv) return;
        
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl)
            this.Bind(Global.BindingEngine,ctrl,edv,edv.Row,false);
    }
    else
    {
        var val=this.get_Value();
        if(val&&val!="")
        {
            var ctrl = Global.document.getElementById(this.ID);
            this._retrieveComboData(ctrl,true)
            this.SetValue(ctrl,val);
        }
    }
}
EpiComboBox.prototype.processColumnChanged=function(args)
{
    if(this.DataView && !this.InGrid)
    {
        var edv=Global.BindingEngine.EpiDataViews[this.DataView];
        if(!edv) return;
        var ctrl=Global.document.getElementById(this.ID);
        if(!ctrl) return;
        var row = args.CurrentRow;
        if (row == -1) return;
        
        if (this.DescColumn == this.DataColumn) // Code copied from NotifyFields
        {
            if (edv.dataView.Rows[row][this.DataColumn]) 
                this.SetValue(ctrl, edv.dataView.Rows[row][this.DataColumn],edv.dataView.Rows[row][this.DataColumn]);
        }
        else 
            this.SetValue(ctrl, edv.dataView.Rows[row][this.DataColumn]);
    }            
  
}
EpiComboBox.prototype._isHiddenColumn=function(hdnColArr,colName)
{
    var ret = false;
    for(var i=0,hdnC;hdnC=hdnColArr[i];i++)
    {
        if (colName == hdnC)
        {
            ret = true;
            break;
        }
    }
    
    return ret;
}
EpiComboBox.prototype._hideColumns=function()
{
    // Based on the index, find the hidden columns from the combo data
    var comboData = this._getDataArray();
    if (comboData == null || comboData == undefined)
        return;
    
    this.hdnCols={Rows:[]};
    
    var hiddenColumns = this._appendToArr(this.epiHiddenCol, this.epiHiddenColAppend, true );
    if (hiddenColumns.length == 0)
        return;
//    else if (hiddenColumns.length == 1 && hiddenColumns[0] == this.ValueMember)
//        return;
        
    var colIndx,hideCVal,colObj,cmbD,keepData,keepCVal;
    
    // Go through the combo data and delete the columns from the data. Add the hidden col/val pairs to new structure
    for (var iC=0,cmbDt; cmbDt=comboData[iC];iC++) // We can safely ignore Code columns i think
    {
        cmbD = cmbDt[1];
        colObj = {};
        for(var i=0,hdnC;hdnC=hiddenColumns[i];i++)
        {
            colIndx = this.cmbCols[hdnC]; // find column index of this column
            if (colIndx)
            {
                hideCVal = cmbD[colIndx-1];      // find actual column from combo data
                colObj[hdnC] = hideCVal;
            }
        }
        this.hdnCols.Rows.push(colObj);

        keepData = [];
        for(var i=0,epiC;epiC=this.EpiColumns[i];i++)
        {
            if (this._isHiddenColumn(hiddenColumns, epiC)) continue; // Skip the columns that are hidden
            
            colIndx = this.cmbCols[epiC]; // find column index of this column
            if (colIndx)
            {
                  keepCVal = cmbD[colIndx-1];      // find actual column from combo data
                  keepData.push(keepCVal);
            }
        }
        cmbD = null;
        cmbDt[1] = keepData;
    }
    // Adjust the index for the hidden columns in the cmbCols
    if (this.hdnCols.Rows.length > 0)
    {
        var i = 0;
        for(var col in this.cmbCols)
        {
            colIndx = this.cmbCols[col];
            if (this.hdnCols.Rows[0][col] == undefined) // this is not a hidden column
            {
                this.cmbCols[col] = i;
                i++;
            }
        }
    }
}

EpiComboBox.prototype._applyRowFilter=function()
{
    if (!this.rowFilter)
        return;
    else if((this.filterRows != undefined) && (this.filterRows["RowFilter"] == this.rowFilter))
        return; 
     
    var addFlg, filter,descCol;
    var comboData = this._getDataArray();
    this.rowFilter = this.rowFilter.replace(/(?:'.*?'|".*?")|\btrue\b|\bfalse\b|\band\b|\bor\b|<>|={1,2}/gi, GetJSExpr);
    if(comboData != null && this.cmbCols != undefined)
    {
        var filterObj = {};
        this.filterRows = {};
        var colIndx, colVal,hdnRow, desc;
        var regExpr = "";
        for(var ii=0, cmbElem; cmbElem=comboData[ii]; ii++)
        {
            // Code col is cmbElem[0], descriptions are in cmbElem[1]
            // Build one object with all the displayed and hidden columns
            filterObj[this.ValueMember.toLowerCase()] = cmbElem[0][0];
            hdnRow = this.hdnCols.Rows[ii];
            desc = cmbElem[1];
            
            for (var col in this.cmbCols)
            {
                // Make sure the column names have the right case
                if (col == this.ValueMember)
                {
                    regExpr = new RegExp("\\b"+col+"\\b","gi");
                    this.rowFilter = this.rowFilter.replace(regExpr,col);
                    continue;
                }
                
                colIndx = this.cmbCols[col];
                // check if this is a hidden column
                colVal = (hdnRow && hdnRow[col] != undefined)? hdnRow[col] : (colIndx==0? desc[0]: desc[colIndx-1]);
                filterObj[col.toLowerCase()] = colVal.toLowerCase(); // Convert column and vlaue to lowercase because there are case-sensitivity issues
				// Make sure the column names have the right case
                regExpr = new RegExp("\\b"+col+"\\b","gi");
                this.rowFilter = this.rowFilter.replace(regExpr,col);
            }
            addFlg = true;
            with(filterObj)
            {
				filter = this.rowFilter.toLowerCase(); // Convert the filter to lowercase becuase there are case sensitivity issues in the column names as well as the values
                if(this.rowFilter!="") addFlg = eval(filter);
                if(addFlg == false) 
                    this.filterRows[ii]=true;
            }
        }
        this.filterRows["RowFilter"] = this.rowFilter;
    }
}

EpiComboBox.prototype.checkAndLoadListData=function(forceRetrieve)
{
    if (!forceRetrieve && this.preFilled) return this.preFilled;
    
    var ret = this.hasStaticData;
    
    // Need to retrieve data.
    var associatedCombo = this.AssociatedCombo;

    if ((ret == false && !forceRetrieve) && associatedCombo!=null) 
    {
	    ret = associatedCombo.hasStaticData; //First check if associated combo already has data
	    if (ret==false)
	    {
		    //have to load data ourselves and share it
		    ret = associatedCombo.checkAndLoadListData(forceRetrieve);
	    }
	    if (ret==true)
	    {
	        // Copy over the data from the Associated combo
		    this.DataSource = associatedCombo.DataSource;
		    this.hasStaticData = associatedCombo.hasStaticData;
		    this._saveDataArray(associatedCombo._getDataArray()); // Dont want to call _saveDataArray because it will try to update the Associated combo
		    //make sure that our combo hides the code column:
		    this.DisplayMember = this.EpiDisplayMember = associatedCombo.DisplayMember;
		    this.ValueMember = this.EpiValueMember = associatedCombo.ValueMember;
		    this.SetColumnFilter(this.DisplayMember);
	    }
    }
    if (ret == false ||forceRetrieve) // Get data
	{
	    if ((this.epiStaticDataList != null) && (this.epiStaticDataList.length > 0))
        {
            this.loadStaticList();
            ret = this.hasStaticData;
        }
		else if (this.EpiTableName != "" && this.EpiFieldName != "") //If Table or Field names are defined then retrieve list
		{
			var descrpList = "";
			try
			{
			    var boName = "lib_BOReader";
	            if(!Global.LoadedProxies[boName])
	            { 	
                    var proxyScript = Global.GetScript("script/Client" + boName + "ServiceProxies.js");
                    eval(proxyScript);
                    Global.window[boName + "Service"] = eval(boName + "Service");
                    Global.LoadedProxies[boName] = boName;
                }
			    var boReader = new lib_BOReaderService();
				descrpList = boReader.GetCodeDescList(this.EpiTableName,this.EpiFieldName);
				this.hasStaticData = true;
                this.hasBeenRetrieved = true;
			}
			catch(e){
			    ExceptionBox.Show(e);
			    this.hasStaticData = false;
			};
			FormFunctions.ComboFillDescrp(descrpList, new DataTable(), this, true); // This saves the dataarray into the ComboManager array
			ret = this.hasStaticData;
		}
	}
	
	return ret;
}

EpiComboBox.prototype._appendToArr=function(srcArr,dstArr,allowDup)
{
    var newArr=[];
    if (typeof(allowDup) == "undefined") allowDup = true;
    
//    if (allowDup == true)
//    {
//        if (srcArr != null && dstArr != null)
//            newArr = srcArr.concat(dstArr);
//        else if (srcArr != null)
//            newArr = srcArr;
//        else if (dstArr != null)
//            newArr = dstArr;
//    }
//    else
    {
        // duplicates not allowed.
         var arrItems = new ArrayList();
        
        if (srcArr != null)
        {
            for(var i=0,val; val = srcArr[i]; i++)
            {
                if ((val==null) || (val == "")) continue;
                //val = val.replace(" = ", "=");
                if ( (allowDup==false) && arrItems.Contains(val)) continue;
                arrItems.Add(val);
            }
        }
        if (dstArr != null)
        {
            for(var i=0,val; val = dstArr[i]; i++)
            {
                if ((val==null) || (val == "")) continue;
                //val = val.replace(" = ", "=");
                if ( (allowDup==false) && arrItems.Contains(val)) continue;
                arrItems.Add(val);
            }
        }
        for(var i=0,itm; itm =arrItems.items[i]; i++)
        {
            newArr[i] = itm;
        }
        
    }
    
    return newArr;
}

EpiComboBox.prototype._retrieveNowBAQCombo = function (forceRetrieve) {

    if (!this.DynamicQueryID || !this.DisplayMember || !this.ValueMember ||
        (this._baqResults != null && this._markupColumns != null && this._markupColumns.Count <= 0)) return;
    // use a BAQDataView to handle the load of data
    var baqView = new BAQDataView(this.DynamicQueryID);
    try {
        // lets get a handle on the EpiX and set that on the BAQView (this will fire the Init logic
        var epix = Global.Form.trans;
        if (epix != null)
            baqView.set_EpiX(epix);                            // this will fire the init and set the EDV.Epix
        else
            baqView.initBAQView();   // no EpiX, so we force the init

        if (this._markupColumns == null)
            this._markupColumns = BAQMarkupHandler.GetWhereItemMarkupColumns(baqView);
        BAQMarkupHandler.ParseWhereItemMarkup(baqView);     // go parse the whereitems for BAQ Markup
        baqView.OnSearch(null, null);
        // setup the local table as the data source
        this._baqResults = new DataTable();
        this._baqResults.Merge(baqView.QueryResultsData.get_Table(0), false, new EpiOverloadedArgs("DataTable_Boolean"));

        // EWA combo is fine with the '.', so we wont do this circus for now.
        // the base Combo DisplayMember and ValueMember dont like "."
//        var columns = this._baqResults.get_Columns();
//        var rows = this._baqResults.get_Rows();
//        var col, r, origColName;

//        for (var c in columns.items) 
//        {
//            col = columns.items[c];
//            origColName = col.ColumnName;
//            col.set_ColumnName(col.ColumnName.replace('.', '_'));
//            for (var r in rows) 
//            {
//                r = rows[r];
//                r.set_Item(
//            }
//        }
//        this.set_DisplayMember(this.DisplayMember.replace('.', '_'));
//        this.set_ValueMember(this.ValueMember.replace('.', '_'));

        this.set_DataSource(this._baqResults);
        this.getDataFromDataSrc(forceRetrieve);
        //        foreach (Infragistics.Win.UltraWinGrid.UltraGridColumn col in DisplayLayout.Bands[0].Columns)
        //            col.Hidden = col.Key != base.DisplayMember;
    }
    catch (ex) {
        //TraceProvider.TraceCatchException(ex);
    }
    finally {
        // and clean up the mess
        //baqView.Dispose();
        this.baqView = null;
    }

}

EpiComboBox.prototype.loadStaticList=function()
{
    if (this.get_EpiStaticDataList().length <= 0)
        return;

    if (this.BeforeOnDemandRetrieveDelegate)
    {
        // This is a Subscriber object
        var s = this.BeforeOnDemandRetrieveDelegate;
        s.fn.call(s.obj);
    }
    
    var listTable = null;
    if(!this.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
		this.TheDataSet.ExtendedProperties.Add("Invalidated", false);
    else if (this.TheDataSet.ExtendedProperties["Invalidated"] != true)
        return;
	        
	this.TheDataSet.ExtendedProperties["Invalidated"] = false;

    listTable = new DataTable();
    var columns = this.epiStaticDataList[0].split("~"); // 0th index has the column names
    for(var colName in columns)
        listTable.Columns[colName]={"DataType":"System.String","ExtendedProperties":{}};
        
    if ((columns.length > 0) && (String.IsNullOrEmpty(this.ValueMember)))
    {
        this.ValueMember = columns[0];
    }
    var ColumnCount = listTable.GetColumnCount();
    var cols;
    for (var i = 1; i < this.epiStaticDataList.length; i++)
    {
        cols = this.epiStaticDataList[i].split("~");
        var dr = listTable.NewRow();
        for (var k = 0; ((k < cols.length) && (k < ColumnCount)); k++)
        {
            dr.set_Item(columns[k], cols[k]);
        }
        listTable.AddRow(dr);
    }
    this.set_DataSource(listTable);
    this._refreshDataArray(listTable);
    if (listTable != null)
    {
        //Call DataRetrieved event if defined
        if((this.get_Event("DataRetrieved").subscribers.length > 0))
        {
            var ds = new DataSet();
            ds.AddTable(listTable, new EpiOverloadedArgs("DataTable"));
	        this.get_Event("DataRetrieved").fire(ds);
        }

//        //Apply sorting-TODO
//        string sortCol = ((epiSortCol != null) && listTable.Columns.Contains(epiSortCol)) ? epiSortCol : DisplayMember;
//        if (listTable.Columns.Contains(sortCol))
//            listTable.DefaultView.Sort = sortCol;
    }
    
    this.hasStaticData = true;
    
}

EpiComboBox.prototype.retrieveNow=function(forceRetrieve)
{
    EpiComboBox.prototype.RetrieveNow.call(this,forceRetrieve);
}
EpiComboBox.prototype.RetrieveNow=function(forceRetrieve)
{
    if (!forceRetrieve) forceRetrieve = true;
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        this._retrieveNowSimpleCombo(ctrl,forceRetrieve);
    }
}
EpiComboBox.prototype._retrieveNowSimpleCombo=function(ctrl, forceRetrieve)
{
    var rVal = false;
	var okToRetrieve = false;
	var saveVal = this.GetValue(ctrl);

    this.SetSearchFilter(); // apps code overrides this method
	if (this.BeforeOnDemandRetrieveDelegate)
    {
        // This is a Subscriber object
        var s = this.BeforeOnDemandRetrieveDelegate;
        s.fn.call(s.obj);
    }
    
    //Prepare new search expression and if it differs from previous then reset Invalidated Flag
	this._prepareSearchExpression();
	
    if(this.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
       okToRetrieve = this.TheDataSet.ExtendedProperties["Invalidated"];
    else
       okToRetrieve = false; 


	if(okToRetrieve || forceRetrieve ) //&& (!this.get_IsEpiReadOnly() || this.EpiKeyField) 
	{
        ctrl.style.cursor="wait";

    	var overridesetting = true; //InsertRowForZeroValue
		if(this.OverrideZeroValue == OverrideZeroValueSettings.Never)
		{
			overridesetting = false;
		}
		else if(this.OverrideZeroValue == OverrideZeroValueSettings.Always)
		{
			overridesetting = true;
		}
        var  result = this._getList(overridesetting);
		if (result == true)
		{
//			this.DataSource = dt; // TODO?
			this._hideColumns(); // TODO

            // TODO : ROWFILTER!
			//Apply row filter if it was set beforehand
//			if ((this.rowFilter != null) && (this.filterRows != undefined) 
//			    && (this.filterRows["RowFilter"] != this.rowFilter))
			this._applyRowFilter(); 

        	this.hasBeenRetrieved = true;

            if (!this.gUIFilter)
			    this.SetValue(ctrl,saveVal);
			rVal = true;

			//assign the data table to the associated combo
//			if (this.associatedCombo!=null)
//			{
//				this.associatedCombo.DataSource = this.DataSource;
//			}
		}
        ctrl.style.cursor="default";

	}
	else if (this.hasBeenRetrieved==false)
	{
		//Make sure we hide columns that need to be hidden
		//prepare column list. Add ValueMember if missing in  all column lists
		this._addValueMemberToHidden(); 
		//this._hideColumns(); 
	}
	this.hasBeenRetrieved = true;
	return rVal;
}

EpiComboBox.prototype._prepareSearchExpression=function()
{
    this.curSrchExpr = "";
	if (this.epiSearchFilter && this.epiSearchFilter != "") 
		this.curSrchExpr = this.epiSearchFilter;

	var sEpiFilter = this._buildEpiFiltersCondition();
	if (sEpiFilter.length>0)
	{
		if (this.curSrchExpr.length>0)
			this.curSrchExpr = "(" + this.curSrchExpr + ") AND " + sEpiFilter;
		else
			this.curSrchExpr = sEpiFilter;
	}

//	dt = getSourceDataTable(); // Not sure what this signifies
//	if (dt == null) return;
    var dt = this._getDataArray();
   
   if (this.lastSrchExpr != undefined && this.curSrchExpr != undefined)
   {
	 if (this.lastSrchExpr == this.curSrchExpr && dt != null) 
		return;
	}
	this.InvalidateOnDemandRetriever(false);
}
 
EpiComboBox.prototype._buildEpiFiltersCondition=function()
{
    var ret = "";
	var filters = this._appendToArr(this.epiFilters,this.epiFiltersAppend );

	if (filters.length == 0) return ret;
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    
    //Regular expression to capture columns ?[ColumnX] or ?[ColumnX,YYY] /\?\[(\w*,?\S*)\]/g;
	//Reg expression to capture ?{Parameter} or ?{Parameter,YYY}
	var rgPar = /\?{(\w*(,\S*)*)}/g; 
	var mPar, mCol;
	
	var htParams = this._getFilterParams(false);
	var countFilters = 0;
	
	for(var iF=0,epiFilter; epiFilter=filters[iF]; iF++)
    {
    if (epiFilter == "") continue;
    var skipFilter = false;
    var sExpr = epiFilter;

    //Replace all parameters in filter expression (either by constant or column definition)
    rgPar.lastIndex = 0;
    mPar = rgPar.exec(sExpr);
    while (mPar != undefined) 
    {
        var paramName = mPar[1];
        var sDfltFilter = this._getParDflt(paramName);
        paramName = sDfltFilter.param;
        sDfltFilter = sDfltFilter.sDefault;
        
        var paramKey = paramName.Trim().toLowerCase();
        //If parameter is not found, the whole filter is skipped
        if (htParams[paramKey] == undefined)
        {
	        skipFilter = true;
	        break;
        }

        var param = htParams[paramKey];	
        mCol = param.match(/\?\[(\w*,?\S*)\]/g);
        if ( mCol!= undefined)
        {
	        var col = mCol[0];
	        if (col) 
	        {
	            //Remove the ?[...] from the matched result
	            col = col.replace("?[", "");
	            col = col.replace("]", "");
	        }
	        var sDfltParam = this._getParDflt(col);
	        col = sDfltParam.param;
	        sDfltParam = sDfltParam.sDefault;
	        
	        if ((sDfltParam != null) || (sDfltFilter==null))
	        {
		        //If default is defined in parameter it has higher priority than default in filter
		        sExpr = sExpr.replace(mPar[0], param);
	        }
	        else
	        {
		        sExpr = sExpr.Replace(mPar[0], String.Format("?[{0},{1}]",col,sDfltFilter));
	        }
        }
        else
        {
	        //The parameter is a constant value expression
	        sExpr = sExpr.replace(mPar[0], param);							
        }
        mPar = rgPar.exec(sExpr);
    }

    //Now look for the columns in filter expression
	var rgCol = /\?\[(\w*,?\S*)\]/g; 
    rgCol.lastIndex = 0;
    mCol = rgCol.exec(sExpr) ;
    while ((mCol != undefined) && (skipFilter==false) )
    {
        var col = mCol[1];
        var sDflt = this._getParDflt(col);
        col = sDflt.param;
        sDflt = sDflt.sDefault;

        if (col.Trim() == "")
        {
	        skipFilter = true;
	        break;
        }

        if ((dv != null) && (dv.HasRow))
        {
            col = dv.dataView.Table._resolveColumnName(col);
            var dc = dv.dataView.Table.Columns[col];
                
	        if (!dc)
	        {
		        MessageBox.Show("Invalid Column Name in EpiFilter Condition:" + col, new EpiOverloadedArgs("String"));
		        skipFilter = true;
		        break;
	        }
	        var val = dv.dataView.Rows[dv.Row][col];
	        if ((val == null) || (val.length==0))
	        {
		        if (sDflt == null)
		        {
			        skipFilter = true;
			        break; //skip this condition if no default value was defined
		        }
		        else
			        val = sDflt;
	        }
	        sExpr = sExpr.replace(mCol[0], val);
        }
        else if (sDflt != null)
        {
	        //No data but we have a default value, then use it
	        sExpr = sExpr.replace(mCol[0], sDflt);							
        }
        mCol = rgCol.exec(sExpr) ;
    }
    if ((sExpr.length>0) && (skipFilter==false))
    {
    if (ret.length>0) ret += " AND ";
    ret += "(" + sExpr + ")";
    countFilters++;
    }
    }
    //Place whole expression into brackets, if it consists of several filters
    if ((ret.length>0) && (countFilters>1))
    {
    ret = "(" + ret + ")";
    }
    return ret;
}

EpiComboBox.prototype._getParDflt=function(param)
{
    var retObj = {};
	var sDefault = null;
	var pos = param.indexOf(",");
	if (pos>-1)
	{		
		//There is default value, so take it and adjust column name
		sDefault = (pos+1 <= param.length)? param.substring(pos+1) : "";
		if (sDefault == "''") sDefault = ""; //allow expresion like {Column,''}
		param = param.substring(0,pos);
	}
	retObj.sDefault = sDefault;
	retObj.param = param;
	return retObj;
}

EpiComboBox.prototype._getList=function(insertRowForZeroValue)
{
	var Ret = false;
	if (!this.epiBOName) return false;
	
	var ds = this._getDataSet();
	
	if (ds) //&& ds.length > 0
    {
        this._saveDataArray(ds); 
	    //Global.ComboManager.ComboArrays[this.ID] = ds; 
	    
        if(this.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
	    {
		    // need to reset the flag now that we have retrieved data
		    this.TheDataSet.ExtendedProperties["Invalidated"] = false;
	    }
	    // if the retriever is being used as the valuelist for a
	    // grid column - then we need to make sure there is a row
	    // for a value of '0' (if the valuemember column is numeric)
	    if (this.isGridValueList && insertRowForZeroValue && this.ValColIsInt)
	    {
		    // If there is no row with value=0, add one in
		    this.AddZeroValueEntry();
	    }
	   Ret = true;
	}
	
    if((this.get_Event("DataRetrieved").subscribers.length > 0) && (ds!=null))
    {
        // The _getDataSetFromArray now looks at hdnCols, but when we call it from here we dont want it to do that because this is a new retrieve
        // so clear the collection 
        this.hdnCols = { Rows: [] };
	    var dataset = this._getDataSetFromArray(ds); // Convert array to dataset
	    this.get_Event("DataRetrieved").fire(dataset);
	    this._refreshDataArray(dataset.get_Table(0),true); // refresh dataarray with new data
	}
    
	return Ret;
}

EpiComboBox.prototype._getDataSetFromArray=function(dataArray, tableName)
{
    var dataset = new DataSet();
    if (!tableName) tableName = "ComboTable";
    var tbl = new DataTable(tableName);
    dataset.AddTable(tbl, new EpiOverloadedArgs("DataTable"));
    // Add columns
    var Columns = {};
    for (var c in this.cmbCols)
       tbl.AddColumn(c,"System.String", new EpiOverloadedArgs("String_String"));
    
    if (!dataArray) return dataset; // no data
    
    // Create data using the array. At this point, the data in the array has not been hidden yet. cmbCols has the list of all the column names
    // and their index in the description element of the dataarray.
    var rowIndx = 0;
    var dr, row, code, desc, hdnRow,colIndx, colVal;

    for (var r in dataArray) 
	{
        var dr = tbl.NewRow();
        var row = dataArray[r];
        
        // Set the code column, we know its always [0][0]
        dr.set_Item(this.ValueMember, row[0][0]);
        hdnRow = (this.hdnCols.Rows.length > 0)? this.hdnCols.Rows[rowIndx]:null;
        desc = row[1];

        for (var c in this.cmbCols) // Set all the visible and hidden description columns
        {
            if (c == this.ValueMember) continue;

            colIndx = this.cmbCols[c];
            // If column is hidden, get its value from the hdnCols, else from the combo array
            colVal = (hdnRow && hdnRow[c] != undefined) ? hdnRow[c] : (colIndx == 0 ? desc[0] : desc[colIndx - 1]);

            //row[1][this.cmbCols[c] - 1]
            dr.set_Item(c, colVal);
        }

        tbl.AddRow(dr, new EpiOverloadedArgs("DataRow"));
        rowIndx++;
    }
    
    return dataset;
}
EpiComboBox.prototype._getDataSet=function()
{
	var ds = null;
	var sColList = "";
    Global.window.status = "Retrieving dropdown data...";
	
	try
	{
		//prepare column list. Add ValueMember if missing in all column lists
		var hiddenColumns = this._appendToArr(this.epiHiddenCol, this.epiHiddenColAppend, true );
		
		var descList = hiddenColumns.join("~"); // need the hidden columns without the ValueMember
		descList = (descList == "")?  this.EpiColumns.join("~"): descList + "~" + this.EpiColumns.join("~");
        var xslParams= this.ValueMember + "," + descList;

        this.cmbCols = {};
        this.cmbCols[this.ValueMember] = 0;// used for rowFilter

        var descArr = descList.split("~");
        for(var i=0,desc;desc=descArr[i];i++)
            this.cmbCols[desc] = i+1;
        
		this._addValueMemberToHidden(); // Add ValueMember to the hidden columns
        hiddenColumns = this._appendToArr(this.epiHiddenCol, this.epiHiddenColAppend, true );
        
		sColList = hiddenColumns.join(",");
		sColList = (sColList.length >0)? sColList +"," + this.EpiColumns.join(","): this.EpiColumns.join(",");
		
		// Make sure sort column exists in the data that is returned, if not use DisplayMember
		var sort = (this.EpiSort && sColList.indexOf(this.EpiSort) >=0)? this.EpiSort:this.DisplayMember;
		xslParams= xslParams + "," + sort;
		
		
		var boName = "lib_BOReader";
        if(!Global.LoadedProxies[boName])
        { 	
            var proxyScript = Global.GetScript("script/Client" + boName + "ServiceProxies.js");
            eval(proxyScript);
            Global.window[boName + "Service"] = eval(boName + "Service");
            Global.LoadedProxies[boName] = boName;
        }
		var lr = new lib_BOReaderService();
		if (this.epiDSMode==DataSetMode.RowsDataSet)
			ds = lr.GetRows('ARRAY', xslParams, this.epiBOName,this.curSrchExpr,"");
		else
			ds = lr.GetList('ARRAY', xslParams, this.epiBOName,this.curSrchExpr,sColList);
			
		this.lastSrchExpr = this.curSrchExpr;
	}
	catch (ex) 
	{ 
		ExceptionBox.Show(ex); 
	}
	finally
	{
        Global.window.status = "";
	}

	return ds;
}

EpiComboBox.prototype._addValueMemberToHidden=function()
{
	var valIdx = this._getColIdxInArr(this.EpiColumns,this.ValueMember);
	if ((valIdx==-1) && (this._getColIdxInArr(this.epiHiddenCol,this.ValueMember)==-1) &&
		(this._getColIdxInArr(this.epiHiddenColAppend,this.ValueMember)==-1))
	{
		this.epiHiddenCol = this._appendToArr(this.epiHiddenCol,[this.ValueMember],false);
	}
}

EpiComboBox.prototype._getColIdxInArr=function(arr,val)
{
	for(var i=0,descColumn; descColumn=arr[i];i++)
	{
		if (descColumn == val) 
			return i;
	}
	return -1;
}

EpiComboBox.prototype._getFilterParams=function(prepMode)
{
    var paramSep = ['='];
    var htCurParams = {};
    for(var i=0,paramLine;paramLine=this.epiFilterParams[i]; i++)
    {
	    if (paramLine.Trim() == "") continue;
	    var curParSplit = paramLine.split(paramSep);
	    var minCountSplit = (prepMode == true)? 0:1;
	    if (curParSplit.length>minCountSplit)
	    {
		    if (curParSplit[0].Trim()== "") continue;
		    var curParam = curParSplit[0];
		    var key = curParam.Trim().toLowerCase();
		    if (htCurParams[key] != null) 
		        continue;
		        
		    if (prepMode)
			    htCurParams[key] = paramLine;
		    else
		    {
			    var curParamValue = curParSplit[1].Trim();
			    if (curParamValue.length==0) continue;
			    if (curParamValue == "''") curParamValue = ""; //allow empty string constant
			    htCurParams[key]= curParamValue;
		    }
	    }
    }
    return htCurParams;
}

EpiComboBox.prototype._getDataArray=function()
{
    if (this.ValueList != null && !(this.ValueList instanceof ValueList)) // If there is a ValueList use its data
        return Global.ComboManager.ComboArrays[this.ValueList.ID];
    else
        return Global.ComboManager.ComboArrays[this.ID];
}
EpiComboBox.prototype._saveDataArray=function(dataArray, checkValueList)
{
    if (!checkValueList) checkValueList = false;
    if (checkValueList)
    {
        if (this.ValueList != null)
            Global.ComboManager.ComboArrays[this.ValueList.ID]=dataArray;
        else
            Global.ComboManager.ComboArrays[this.ID]=dataArray;
    }
    else
        Global.ComboManager.ComboArrays[this.ID]=dataArray;
}

EpiComboBox.prototype._clearDataArray=function()
{
    if (this.ValueList != null)
        Global.ComboManager.ComboArrays[this.ValueList.ID]=[];
    else
        Global.ComboManager.ComboArrays[this.ID]=[];
}

EpiComboBox.prototype._selectRange=function (ctrl, iStart, iLength)
{
    if (ctrl.createTextRange) {
        var oRange = ctrl.createTextRange(); 
        oRange.moveStart("character", iStart); 
        oRange.moveEnd("character", iLength - ctrl.value.length); 
        oRange.select();
    } else if (ctrl.setSelectionRange) {
        ctrl.setSelectionRange(iStart, iLength);
    } 
}

EpiComboBox.prototype._showContents=function(ctrl, doRefresh)
{
    var eventArgs = {Cancel:false};
    
    var prevRows = -1, dt =null,forceRetrieve=false;
    if (this.dataSrc)
    {
        if(Global.InstanceOf(this.dataSrc,"DataTable"))
		    dt = this.dataSrc;
	    else if(Global.InstanceOf(this.dataSrc,"DataView"))
		    dt = this.dataSrc.Table;
	    else if(Global.InstanceOf(this.dataSrc,"DataSet") && this.dataSrc.GetTableCount()>0)
		    dt = this.dataSrc.get_Table(0);
		if (dt) prevRows = dt.Count;
    }
    this.get_Event("BeforeDropDown").fire(this, eventArgs); // This event sometimes populates the combo
    if(eventArgs.Cancel) return;
    
    if (dt && prevRows >= 0 && dt.Count != prevRows)
    {
        forceRetrieve = true; // If the BeforeDropDown event changed the datasource, re-load data into the combo
    }
    
    Global.DropControlManager.ActiveDropControl = ctrl;
    
    if (doRefresh == undefined)
        doRefresh = true;
        
    var lastVal = this.GetValue(ctrl); 
    if (this.ChangesRows == true && this.InNavCtrl == true)
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        if (dv && dv.Row) lastVal = dv.Row;
    }
    // Get the contents
    this._initializeContents(ctrl, doRefresh, forceRetrieve);
//    Global.DropControlManager.ActiveDropContents.style.display="block";

    if(this.InGrid)
    {
        var grd = Global.GetParentByTag(ctrl, "TABLE", true);
        Global.DropControlManager.ActivePopup.ShowRelative(ctrl, "below", 1 - grd.parentNode.scrollLeft, 2 - grd.parentNode.scrollTop);
    }
    else
        Global.DropControlManager.ActivePopup.ShowRelative(ctrl, "below");
    
    // Calculate the position every time
	
	Global.DropControlManager.ActiveControlIsOpen = true;
    
	if(Global.DropControlManager.ActiveDropContents && lastVal)
	{
	    this._highlightComboRow(Global.DropControlManager.ActiveDropContents.childNodes[0], lastVal);
	}

}
EpiComboBox.prototype._initializeContents=function(ctrl, doRefresh, forceRetrieve)
{
    if (doRefresh) // refresh the data
        this._getDiv(false,forceRetrieve);
    
    var oDiv = Global.DropControlManager.ActiveDropContents; //_getDiv refreshes the active dropdown contents
	var oContentsTable = oDiv.childNodes[0];
    
    EpiEventManager.removeListener(oContentsTable, "click", this._docontentsclick);
    EpiEventManager.addListener(oContentsTable, "click", this._docontentsclick, this, true);
    
	EpiEventManager.removeListener(oContentsTable, "mouseover",this._docontentsmouseover);
	EpiEventManager.addListener(oContentsTable, "mouseover",this._docontentsmouseover, this, true);
	
	EpiEventManager.removeListener(oContentsTable, "mousedown", this._mousedown);
    EpiEventManager.addListener(oContentsTable, "mousedown", this._mousedown, this, true);
    
    EpiEventManager.removeListener(Global.document, "mousedown", this._deactivateDropControl);
    EpiEventManager.addListener(Global.document, "mousedown", this._deactivateDropControl, this, true);
}

EpiComboBox.prototype._getDiv=function(refreshDataOnly, forceRetrieve)
{

     var comboData = this._getComboData(this.gUIFilter, Global.DropControlManager.ActiveDropControl, forceRetrieve);
    comboData = "<TABLE cellspacing='0' cellpadding='0'>" + comboData + "</TABLE>";
    
    if (refreshDataOnly && Global.DropControlManager.ActiveDropContents)
    {
        Global.DropControlManager.ActiveDropContents.innerHTML = comboData;
        Global.DropControlManager.ActiveDropContents.style.display = "";
        Global.DropControlManager.ActivePopup.Resize();
        Global.DropControlManager.ActiveDropContents.style.display = "none";
        
        return;
    }
    
    Global.DropControlManager.ActivePopup = new Popup(comboData, 600, 156, Global.DropControlManager.ActiveDropControl.scrollWidth - 2, 12);
    Global.DropControlManager.ActiveDropContents = Global.DropControlManager.ActivePopup.Control;
}

EpiComboBox.prototype._getDataFromInfraValueList=function(forceRetrieve)
{
    if(this.hasStaticData && !forceRetrieve) return;

    var dataItems = this.ValueList.ValueListItems;
    
    var dataVal,desc,elem,dataArray=[],gotData=false;
    
    for (var key in dataItems.items)
    {
        val = dataItems.items[key];
        desc=[];
        dataVal = [];
        elem=[];
        dataVal.push(key); // Code column
        desc.push(val); // Description column
        elem.push(dataVal);
        elem.push(desc); 
        dataArray.push(elem);
        gotData=true;
    }
    if (dataArray.length > 0)
    {
        this._saveDataArray(dataArray); 
        this.hasStaticData = true; // makes sure data is not retrieved again later.
        this.hasBeenRetrieved = true;
    }
}

EpiComboBox.prototype._retrieveComboData=function(comboCtrl,forceRetrieve)
{
    // ValueList: if this combo has a Valuelist it means this is a combo within a cell in a grid. Its values come from another combo on the form i.e. the ValueList combo. 
    //   So the data is retrieved by the ValueList combo, and used by this combo (when we get the dataarray, we get it using the ValueList's id).
    // AssociatedCombo: if this combo has an AssociatedCombo, it means data is retrieved by the AssociatedCombo. Once data is retrieved, we copy it over from there to our dataarray in the ComboManager array.
    // AssociatedCombo is accessed/used only within the checkAndLoadListData.

    if (forceRetrieve == undefined) forceRetrieve = false;
    // This method retrieves the data for the combo. 
    var combObj = this;
    if (this.ValueList != null)
    {  
        if (this.ValueList instanceof ValueList)
        {
            // This is an Infragistics ValueList. Get the data from it...
            this._getDataFromInfraValueList(forceRetrieve);
            return;
        }
        combObj = this.ValueList; 
        comboCtrl = Global.document.getElementById(this.ValueList.ID); // Get the right control too.
    }
    if (combObj.Retriever != null && combObj.retrieveOnActivate == true)
    {
        combObj._retrieveNow(combObj, comboCtrl, forceRetrieve); // On Demand
    }
    else if (!combObj.Retriever && combObj.retrieveOnActivate == true)
    {
        combObj._retrieveNowSimpleCombo(comboCtrl, forceRetrieve); // On Demand simple combo
    }
	else if (combObj.DynamicQueryID && combObj.cboType == "BAQCombo") 
    {
        combObj._retrieveNowBAQCombo(comboCtrl, forceRetrieve); //BAQCombo
    }
    else if (combObj.retrieveOnActivate == false && combObj.InNavCtrl == false)
    {
        if (combObj.dataSrc)
            combObj.getDataFromDataSrc(forceRetrieve); // data comes from a datatable/dataview/datasource set via set_DataSource.
        else if (this.StaticData)
            combObj.getDataFromStaticList(forceRetrieve); // data is a string array. Used on custom forms via ListItems property.
        else
            combObj.checkAndLoadListData(forceRetrieve); // Static combo
    }
    else if (combObj.ChangesRows == true && combObj.InNavCtrl == true)
    {
        combObj._loadDataFromDataView(); // NavControl
    }
}
EpiComboBox.prototype._getComboData=function(filter, comboCtrl, forceRetrieve)
{
    this._retrieveComboData(comboCtrl,forceRetrieve);
    var combObj = this;

    var dataArray = this._getDataArray(); // _retrieveComboData should save the data array
    if (!dataArray) 
    {   
        return "";
    }
        
    var StringBuilder = new Array();
    var re = new RegExp("^" + filter +".*","i");
    var passedFilter = true;
    var styleStr = '', rowStyle='width:100%;'; 
    var desc;
    for (var j=0, record; record=dataArray[j]; j++) 
    {
         // Check to make sure this row is not filtered out
        if((this.filterRows != undefined) && (this.filterRows[j] != undefined))
            continue;
         
         if (record[1].length > 1)
            styleStr = "padding-right:16px;";
         else
            styleStr = "";
            
         for (var d =0; d < record[1].length; d++) // For each column that will be displayed, make sure its valid
         {
            desc = record[1][d];
            if (desc == undefined) desc = "";
            if (desc == "") 
            {
                record[1][d] = "&nbsp;";
                styleStr = styleStr + "height:13px;";
            }
           
            desc = desc.replace("<","&lt;");
            desc = desc.replace(">","&gt;");
            record[1][d] = desc;
         }
         
         if (styleStr)
            styleStr = "style='" + styleStr + "'";
            
         if (record[0].length > 1 && record[0][1] == "IsHidden") rowStyle = rowStyle + "display:none;";
         
         // Return all data if no filter. Return list filtered by keyword- filter on the first Description field
         passedFilter = (filter && filter != "")? re.test(record[1]): true;
         if (passedFilter)
                StringBuilder.push("<TR style='"+ rowStyle +"'><TD " + styleStr + " id='" + j +"'>" + record[1].join("</TD><TD " + styleStr + " id='" + j + "'>")+"</TD></TR>");
    }
    return StringBuilder.join("");
}


// Load data from the bound dataview for the current row and display the EpiColumns.
EpiComboBox.prototype._loadDataFromDataView=function()
{
    if (this.EpiColumns.length == 0) return;
        
    var dataVal = "";
    var dataArray=[];
    if(this.DataView && this.DataColumn)
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView].dataView;
        var dvNodes = dv.Rows;
        var desc = '';
        var elem, val;
        for(var rowNum=0, row; row=dvNodes[rowNum]; rowNum++)
        {
            if (row[this.DataColumn] == undefined) continue;
            desc= [];
            dataVal = [];
            elem = [];
            dataVal.push(row[this.DataColumn]);
            for(var c=0, col; col=this.EpiColumns[c]; c++)
            {           
                val = row[col];
                
                if (val == undefined) continue;
                
                if(val!="" && dv.Table && dv.Table.Columns[col].DataType=="System.DateTime")
                {
                    val = Convert.ToDateTime(val).ToShortDateString();
                }
                
                desc.push(val.toString());
            }
                
            elem.push(dataVal);
            elem.push(desc); 
            dataArray.push(elem);
        }
        
        this._saveDataArray(dataArray);
        
        if (dataArray.length > 0) this.hasBeenRetrieved = true;
    }
}
EpiComboBox.prototype._textBlur = function(e)
{
    if (Global.DropControlManager.ActiveDropControl) return; // Combo was opened
    if (this.inAutoFilter==true) // User clicked out of the combo without explicitly clicking on an item, but autofilter selected a value
    {
        var textControl = e.target||e.srcElement; 
        //var comboControl = Global.GetParentByTag(textControl, "TABLE", false);
        
	    this._textchange({"target":textControl});
	    //this.SetValue(comboControl, code,desc);
        
        this.inAutoFilter = false;
    }
}
EpiComboBox.prototype._toggleContents=function(e)
{
    var comboCtrl = Global.DropControlManager.ActiveDropControl;
    EpiDropControl.prototype._toggleContents.call(this,e);   

    if (!comboCtrl) return;
    if (this.inAutoFilter==true) // User closed the dropdown without explicitly clicking on an item, but autofilter selected a value
    {
        var ctrlVal = this.GetValue(comboCtrl);
        var indx = this._getCodeMatchIndex(ctrlVal);
        if (indx >= 0)
            this._updateDataSource(indx,comboCtrl);
        
        this.inAutoFilter = false;
    }
}
EpiComboBox.prototype._hideContents=function()
{
    if (Global.DropControlManager.ActivePopup)
    {
        Global.DropControlManager.ActivePopup.Hide();
        Global.DropControlManager.ActivePopup = null;
        Global.DropControlManager.ActiveDropContents = null;
    }
    Global.DropControlManager.ActiveControlIsOpen = false;
    Global.DropControlManager.ActiveDropControl = null;
}

EpiComboBox.prototype._highlightComboRow=function(tbl, val)
{
    var dataArray = this._getDataArray();

    if (!dataArray) return;
    var highlightRow;
    if (Global.IsNumber(val))
	     highlightRow = tbl.rows[val];
	// else Its the code for the value in the text box
	
	var oRow;
	var code;
    
    for (var j=0, oRow; oRow= tbl.rows[j]; j++) 
    {
        if (!highlightRow)
        {
            code = dataArray[oRow.cells[0].id][0].toString();
            if (code == val)
            {
                highlightRow = oRow;
            }
            if(oRow.style.backgroundColor!="")
            {
                oRow.style.backgroundColor = "";
		        oRow.style.color = "";
		        if (highlightRow) // If we found the row to highlight, then break from the loop
		            break;
		    }
        }
        else
        {
            if(oRow.style.backgroundColor!="") // We dont need to iterate all the rows. break when we find the correct row
            {
                oRow.style.backgroundColor = "";
		        oRow.style.color = "";
		        break;
		    }
        }
    }
    
	if(highlightRow)
	{
		highlightRow.style.backgroundColor = "#316AC5";
		highlightRow.style.color = "white";
		var oDiv =  Global.GetParentByTag(tbl, "DIV", false);

		if(highlightRow.offsetTop < oDiv.scrollTop)
			highlightRow.scrollIntoView(true);

		if(highlightRow.offsetTop>=(oDiv.scrollTop + oDiv.clientHeight)) 
			highlightRow.scrollIntoView(false);
			
		this.currHighlightedRow = highlightRow;
	}
}

EpiComboBox.prototype._getCodeMatchIndex=function(code)
{
    var dataArray = this._getDataArray();
    
    if (!dataArray) return -1;
    var exists = false;
    for (var j=0, record; record=dataArray[j]; j++) 
    {
        if (record[0].toString() == code.toString())
        {
            exists = true;
            break;
         } 
    }
    
    if (exists) // If the code exists then the value of j is the index of the match
        return j;
    else
        return -1;
}
EpiComboBox.prototype._getIndexForDesc=function(descToFnd)
{
    var dataArray = this._getDataArray();
    if (!dataArray || dataArray.length ==0) return -1;
    
    var descIndx = 0;
    var descStrings = dataArray[0][1];
    var compare = (!this.DisplayMember)? this.ValueMember: this.DisplayMember;
    if (descStrings.length > 1 && this.EpiColumns.length == descStrings.length)
    {
        for (var d=0,dVal;dVal = this.EpiColumns[d];d++)
        {
            if (dVal == compare)
            {   
                descIndx = d;
                break;
            }
        }
    }
    var exists = false;
    var desc;
    for (var j=0, record; record=dataArray[j]; j++) 
    {
        var descStrings = record[1];
        desc = descStrings[descIndx];
        if (desc.toLowerCase() == descToFnd.toLowerCase())
         {
            exists = true;
            break;
         }
    }
     if (exists) // If the code exists then the value of j is the index of the match
        return j;
    else
        return -1;
}

EpiComboBox.prototype._getDisplayStringFromIndex=function(index)
{
    var dataArray = this._getDataArray();

    var descStrings = dataArray[index][1];
    var compare = (!this.DisplayMember)? this.ValueMember: this.DisplayMember;
    if (descStrings.length > 1 && this.EpiColumns.length == descStrings.length)
    {
        for (var d=0,dVal;dVal = this.EpiColumns[d];d++)
        {
            if (dVal == compare)
                return descStrings[d];
        }
    }
    return descStrings[0];
}
EpiComboBox.prototype._retrieveNow=function(comboObj, ctrl, forceRetrieve)
{
    var okToRetrieve = false;
    var rVal = false;

    if (this.BeforeOnDemandRetrieveDelegate)
    {
        // This is a Subscriber object
        var s = this.BeforeOnDemandRetrieveDelegate;
        s.fn.call(s.obj);
    }
           
    if(comboObj.TheDataSet.ExtendedProperties.ContainsKey("Invalidated"))
		if(comboObj.TheDataSet.ExtendedProperties["Invalidated"] == true)
			okToRetrieve = true;
			
    if(okToRetrieve || forceRetrieve)
    {
        ctrl.style.cursor="wait";
        var saveVal = comboObj.GetValue(ctrl); 
		comboObj.Retriever.InsertRowForZeroValue = true; 

		if (comboObj.Retriever.RetrieveNow(comboObj, this.ValColIsInt, new EpiOverloadedArgs("Custom")))
		{
		    comboObj.SetValue(ctrl, saveVal);
		    rVal = true;
		}
        ctrl.style.cursor = "default";
    }
    
	return rVal;
}
EpiComboBox.prototype._initCombo=function(retriever,valueList)
{
	this.Retriever=retriever;
}
EpiComboBox.prototype.set_ValueList=function(valueList)
{
    this.ValueList = valueList;
    if (this.InGrid)
    {
        if (valueList instanceof EpiComboBox)
        {
            var descCol = this.DataColumn;
    //        if (this.DataView)
    //        {
    //            var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    //            if (dv && dv.dataView.Table.Columns[valueList.DescColumn])
    //                descCol = valueList.DescColumn;
    //        }
            this.DescColumn = descCol;
        }
        else if (valueList instanceof ValueList)
        {
            this.ValueList = valueList;
            this._getDataFromInfraValueList(true);
        }
        // Set the description from the valuelist now
        var ctrl = Global.document.getElementById(this.ID);
        if (ctrl)
        {
            var val = this.GetValue(ctrl);
            if (val != "")
            {
                var indx = this._getCodeMatchIndex(val);
                if (indx != -1)
                    ctrl.innerHTML = this._getDisplayStringFromIndex(indx);
            }
        }
   
    }
}

EpiComboBox.prototype.set_FactorDirectionType=function(val){this.comboType=val;this._initFactorDirCombo();}
EpiComboBox.prototype.get_FactorDirectionType=function(){this.comboType;}

EpiComboBox.prototype._initFactorDirCombo=function()
{
    // enumFactorDirectionType {Selling, Purchasing}; // Dont want to create an enum for this
   var dtList = new DataTable("",{"Columns":{"Value":{"DataType":"System.String"},"Display":{"DataType":"System.String"}}});
   
	switch(this.comboType)
	{
		case 0://enumFactorDirectionType.Selling:
			dtList.AddRow(["M",EpiString.GetString("SellingFromTo")]);
			dtList.AddRow(["D",EpiString.GetString("SellingToFrom")]);
			break;
		case 1: //enumFactorDirectionType.Purchasing:
			dtList.AddRow(["M",EpiString.GetString("PurchasingFromTo")]);
			dtList.AddRow(["D",EpiString.GetString("PurchasingToFrom")]);
			break;
	}
	dtList.get_DefaultView().Sort = "Display";
	this.dataSrc = dtList.get_DefaultView();
	this.DisplayMember = this.EpiDisplayMember = "Display";
	this.ValueMember = this.EpiValueMember = "Value";
	this.SetColumnFilter("Display");
	this.retrieveOnActivate = false; 
	this.InNavCtrl =false; // Make sure getDataFromDataSrc gets called from retrieveComboData
	this._retrieveComboData(); // Dont need the comboCtrl since we know getDataFromDataSrc.
}
// SCR#52380: the WarehseCombo is defined in an adapter and this method exists there. Since we dont support combos from adapters, added this method here.
EpiComboBox.prototype.FillList = function()
{
    if (this.cboType != "WarehseCombo") return;
    
    var wAdapter = Global.GetAdapter("WarehseAdapter",Global.Form);
    Global.LoadProxyForAdapter(wAdapter,null,true);
    wAdapter.BOConnect();
	var opts = SearchOptions.CreateRuntimeSearch(new Hashtable(), DataSetMode.ListDataSet);
	wAdapter.InvokeSearch(opts);
	this.set_DisplayMember("Description");
	this.set_ValueMember("WarehouseCode");
	this.set_DataSource(wAdapter.get_WarehseList().get_WarehseList());
	this.SetColumnFilter("Description");
}

// The following are functions on the IRWarehouseCombo, which lives in IRWarehseSearch Adapter
EpiComboBox.prototype.set_TranType=function(val){this.TranType=val;}
EpiComboBox.prototype.set_WhseType=function(val){this.WhseType=val;}
EpiComboBox.prototype.set_PartNum=function(val){this.PartNum=val;}

//------------------------------------
// EpiTokenDate
//------------------------------------
var EpiTokenDate = Epicor.Mfg.UI.FrameWork.EpiTokenDate = function (settings)
{
    if (!settings) settings={};
    EpiControl.call(this,settings);
       
    if(settings.EpiShowToken!=undefined) 
        this.EpiShowToken = settings.EpiShowToken;    
    
    this.set_EpiBindingToken(settings.EpiBindingToken);
    this.set_EpiBindingShowToken(settings.EpiBindingShowToken);
    
    this.ComboCtrl = settings.ComboCtrl;
    this.DateCtrl = settings.DateCtrl;
    this.CheckCtrl = settings.CheckCtrl;
    this.LabelCtrl = settings.LabelCtrl;
    
    if(Global.Form) Global.Form.get_Event("Load").subscribe(this.ctor, this,true);
}
EpiTokenDate.prototype = new EpiControl();
EpiTokenDate.prototype.TypeName = "EpiTokenDate";
EpiTokenDate.prototype.TokenChangeByCode = false;
EpiTokenDate.prototype.EpiShowToken=false;
EpiTokenDate.prototype.columnNameShowToken = null;
EpiTokenDate.prototype.dataViewNameShowToken = null;
EpiTokenDate.prototype.columnNameTokenDate = null;
EpiTokenDate.prototype.dataViewNameTokenDate = null;
EpiTokenDate.prototype.oDataViewShowToken = null;
EpiTokenDate.prototype.oDataViewTokenDate = null;
EpiTokenDate.prototype.SetEnabled=function(ctrl, val)
{
    Global.BindingEngine.Controls[this.ComboCtrl].set_Enabled(val,true);
    Global.BindingEngine.Controls[this.DateCtrl].set_Enabled(val,true);
    Global.BindingEngine.Controls[this.CheckCtrl].set_Enabled(val, true);
}
EpiTokenDate.prototype.SetChangeEvent=function(ctrl)
{
    if(!this.OnChangeSet)
    {
        var obj = Global.BindingEngine.Controls[this.ComboCtrl];
        var dtCtrl = Global.document.getElementById(this.ComboCtrl);
        
        var chkObj = Global.BindingEngine.Controls[this.CheckCtrl];
        var chkCtrl = Global.document.getElementById(this.CheckCtrl);
        
        if(obj&&dtCtrl)
        {
            EpiEventManager.addListener(dtCtrl, "change", obj._change, this, true);
        }
        
        if(chkObj && chkCtrl)
        {
            EpiEventManager.addListener(chkCtrl, "click", this.chkFloat_CheckedChanged, this, true);
        }
        
        this.OnChangeSet = true;
    }
}
EpiTokenDate.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
    var obj = Global.BindingEngine.Controls[this.ComboCtrl];
    var dtCtrl = Global.document.getElementById(this.ComboCtrl);
    
    if(obj && dtCtrl)
    {
        this.SetChangeEvent(ctrl);
        obj.Bind(bEngine, dtCtrl, dv, rowNum);
    }    
    
    this.RefreshProperties(ctrl, dv, rowNum);
}
EpiTokenDate.prototype.set_EpiBindingToken=function(value)
{
	if (value != null && value != "")
	{
		//this.cboTokenDate.EpiBinding = value;
		// make sure the binding string is in the correct format
		if(value.indexOf(".") > 0)
		{
			var tempColName = value.substring(value.indexOf(".")+1);
			if (tempColName.IndexOf(".") > 0) 
			{
			    return;
				//throw new SystemException("Invalid format for binding string. Correct format is 'DataViewName.ColumnName'");
			}
	
			this.columnNameTokenDate = tempColName;
			this.dataViewNameTokenDate = value.substring(0,value.indexOf("."));
			this.EpiBindingToken = value; 
		} 

	}
	else 
	{
		this.EpiBindingToken = null; 
	}
}

EpiTokenDate.prototype.set_EpiBindingShowToken=function(value)
{
	if (value != null && value != "")
	{
		// make sure the binding string is in the correct format
		if(value.indexOf(".") > 0)
		{
			var tempColName = value.substring(value.IndexOf(".")+1);
			if (tempColName.indexOf(".") > 0) 
			{
				//throw new SystemException("Invalid format for binding string. Correct format is 'DataViewName.ColumnName'");
				return;
			}
			this.columnNameShowToken = tempColName;
			this.dataViewNameShowToken = value.substring(0,value.indexOf("."));
			this.EpiBindingShowToken = value; 
		} 
		else 
		{
		    return;
			//throw new SystemException("Invalid format for binding string. Correct format is 'DataViewName.ColumnName'");
		}				
	} 
	else 
	{
		this.EpiBindingShowToken = null;
		this.columnNameShowToken = null;
		this.dataViewNameShowToken = null;
	}
}

EpiTokenDate.prototype.ctor=function()
{
    this.ShowToken(this.EpiShowToken);

    this.EventSetup();
}
EpiTokenDate.prototype.get_CboTokenDate = function()
{
    if (this.ComboCtrl)
        return Global.BindingEngine.Controls[this.ComboCtrl];
    else if (this.tempCombo) 
        return this.tempCombo;
    else
    {
        this.tempCombo = new EpiComboBox({"ID":"tempCbo"});
        return this.tempCombo;
    }
    
}
EpiTokenDate.prototype.EventSetup = function()
{
	if(this.EpiBindingShowToken != null && this.EpiBindingShowToken != "")
	{
       
        this.oDataViewShowToken = Global.BindingEngine.EpiDataViews[this.dataViewNameShowToken];
        if(this.oDataViewShowToken!=null)
        {
			if (!this.oDataViewShowToken.dataView.Table.ColumnsContains(this.columnNameShowToken))
			{
			    return;
				//throw new SystemException("EpiEpiCurrencyConver - " + this.Name + 
				//	" - Bound Column does not exist in " + dataViewNameShowToken + "table.");
			}
			
			this.oDataViewShowToken.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotification, this,true);
        }
        else
        {
            return;
            //throw new SystemException("EpiCurrencyConver - " + this.Name + " - Bound to invalid EpiDataView.");
        }
	}

	if(this.EpiBindingToken != null && this.EpiBindingToken != "")
	{
		this.oDataViewTokenDate = Global.BindingEngine.EpiDataViews[this.dataViewNameTokenDate];
		if (this.oDataViewTokenDate != null)
		{
			if (!this.oDataViewTokenDate.dataView.Table.ColumnsContains(this.columnNameTokenDate))
			{
			    return;
				//throw new SystemException("EpiTokenDate - " + this.Name + 
				//	" - Bound Column does not exist in " + dataViewNameTokenDate + "table.");
			}
			
			this.oDataViewTokenDate.get_Event("EpiViewNotification").subscribe(this.oDataViewTokenDate_EpiViewNotification, this,true);
		} 
		else 
		{
		    return;
			//throw new SystemException("EpiTokenDate - " + this.Name + " - Bound to invalid EpiDataView.");
		}
	}
	
	Global.BindingEngine.Controls[this.ComboCtrl].set_Value(" ");
	Global.BindingEngine.Controls[this.ComboCtrl].set_Visible(false);
	Global.BindingEngine.Controls[this.DateCtrl].set_Visible(true);
	Global.BindingEngine.Controls[this.CheckCtrl].set_Checked(false);
}
EpiTokenDate.prototype.oDataView_EpiViewNotification=function(view, args){}
EpiTokenDate.prototype.oDataViewTokenDate_EpiViewNotification=function(view, ar)
{
	// when we get notified of changes from DataView
	if (ar.Row >= 0) 
	{
		if(this.oDataViewTokenDate.dataView.Rows[ar.Row][this.columnNameTokenDate].toString() == " " || 
		    this.oDataViewTokenDate.dataView.Rows[ar.Row][this.columnNameTokenDate].toString().length == 0)
		{
			if(Global.BindingEngine.Controls[this.CheckCtrl].get_Checked()=="true")
			{
				this.TokenChangeByCode = true;
				Global.BindingEngine.Controls[this.CheckCtrl].set_Checked(false);
				this.chkFloat_CheckedChanged();
				this.TokenChangeByCode = false;
				
			}
		}
		else
		{
			if(Global.BindingEngine.Controls[this.CheckCtrl].get_Checked()=="false")
			{
				this.TokenChangeByCode = true;
				Global.BindingEngine.Controls[this.CheckCtrl].set_Checked(true);
				this.chkFloat_CheckedChanged();
				this.TokenChangeByCode = false;
			}
		}
		
	}
}
EpiTokenDate.prototype.ShowToken=function(dispToken) 
{
	if(dispToken)
	{
	    Global.BindingEngine.Controls[this.DateCtrl].set_Visible(true);
	    Global.BindingEngine.Controls[this.ComboCtrl].set_Visible(false);
	}
	else
	{
	    Global.BindingEngine.Controls[this.DateCtrl].set_Visible(false);
	    Global.BindingEngine.Controls[this.ComboCtrl].set_Visible(true);
	}
}

EpiTokenDate.prototype.chkFloat_CheckedChanged=function(sender, e)
{
    var chkFloat = Global.BindingEngine.Controls[this.CheckCtrl];
    var cboTokenDate = Global.BindingEngine.Controls[this.ComboCtrl];
    var dteActualDate = Global.BindingEngine.Controls[this.DateCtrl];

    var checked = chkFloat.get_Checked();
	if(checked=="true"||checked==true)
	{
		cboTokenDate.set_Visible(true);
		dteActualDate.set_Visible(false);
		if(!this.TokenChangeByCode)
		{
			cboTokenDate.set_Value("&Today");
		}		
	}
	else
	{
		if(!this.TokenChangeByCode)
		{
			cboTokenDate.set_Value("");
		}
		cboTokenDate.set_Visible(false);
		dteActualDate.set_Visible(true);
	}
}

//------------------------------------
// EpiGrid
//------------------------------------
var EpiGrid = Epicor.Mfg.UI.FrameWork.EpiGrid = function (settings)
{
    EpiControl.call(this,settings);

    if(settings)
    {
        this.GroupByColumns=[];
        this.SummaryColumns={};
        this.BaseCurrencyCols = [];
        this.DocCurrencyCols = [];
        this.PreserveColSettings = [];
    
        this._columns=settings.Columns;
        this.AllowUpdate = (settings.AllowUpdate==undefined)? true:settings.AllowUpdate;
        this.firstTimeInHideShowCurrencyColumns = true;
        if ((settings.SingleSel != undefined && settings.SingleSel == true) || Global.Form instanceof EpiHostForm)
            this.MultiRowSelect = false;
        this.DataMember = settings.DataMember; // If the datasource for the grid is dataset, DataMember represents the table that the grid is bound to.
        Global.Form.MyEpiGrids.Add(this.ID, this);

        if(settings.HasGroupByShown!=undefined&&settings.HasGroupByShown==true)
        {
            this._hasGroupByShown=true;
            this.GroupByColumns=settings.GroupByColumns;
            this.GroupGrid=new EpiGroupGrid(this);
        }

        if(this.DataView&&(Global.Form instanceof EpiHostForm || Global.Form.ID=="EpiZoneForm"))
        {
            if(!Global.BindingEngine.GridsByView[this.DataView]) Global.BindingEngine.GridsByView[this.DataView]=[];
            Global.BindingEngine.GridsByView[this.DataView].push(this);   
        }
        
    }

}
EpiGrid.prototype = new EpiControl();
EpiGrid.prototype.TypeName = "EpiGrid";
EpiGrid.prototype.ActiveRow = {ListIndex:0};
EpiGrid.prototype.MultiRowSelect = true;  // Multiselect by default
EpiGrid.prototype.Summaries=null;
EpiGrid.prototype.DataSource = null;
EpiGrid.prototype.IsEmpty = true;
EpiGrid.prototype.InsertNewRowAfterLastRow = true;
EpiGrid.prototype.DataMember = null;
EpiGrid.prototype.HasPaging=false;
EpiGrid.prototype.ResetDisplayLayout=function(){}
EpiGrid.prototype.set_DataMember=function(value){this.DataMember=value;}
EpiGrid.prototype.UpdateData=function(){}
EpiGrid.prototype.PropsApplied=false;
EpiGrid.prototype._hasGroupByShown=false;
EpiGrid.prototype._hasSummariesShown=false;
EpiGrid.prototype.get_BaseCurrencyCols=function(){return this.BaseCurrencyCols;}
EpiGrid.prototype.get_DocCurrencyCols=function(){return this.DocCurrencyCols;}
EpiGrid.prototype.GroupGrid=null;
EpiGrid.prototype.IsGroupChild=false;
EpiGrid.prototype.IsSorting=false;
EpiGrid.prototype.GroupFilter=null;
EpiGrid.prototype.get_HasGroupByShown=function() {return this._hasGroupByShown;}
EpiGrid.prototype.get_HasSummariesShown=function() {return this._hasSummariesShown;}
EpiGrid.prototype.DataBind=function(){}
EpiGrid.prototype.SetCellEditor=function(cell,editor)
{
    cell.set_Editor(editor);
}
EpiGrid.prototype._findRequiredCtrl=function()
{
    var obj,dv;
    bec = Global.BindingEngine.Controls;
    for(var c in this._columns)
    {
       obj = bec[this._columns[c]];
       if(obj && obj.DataView && obj.DataColumn)
       {
          dv = Global.BindingEngine.EpiDataViews[obj.DataView];
          var colName = dv.dataView.Table._resolveColumnName(obj.DataColumn);
          var extProp = dv.dataView.Table.GetExtendedProperty(colName, "Required","False");
          if (extProp == "True") return obj;   
       }
    }
    return null; 
}
EpiGrid.prototype.get_ColumnArr=function()
{
    var colArr=[];
    for(var i in this._columns)
    {
        this._colArr.push({"Key":i,"ID":this._columns[i]});
    }
    return colArr;
}
EpiGrid.prototype.get_ActiveColScrollRegion=function()
{
    return new ColScrollRegion();
}
EpiGrid.prototype.set_InsertNewRowAfterLastRow=function(value)
{
    this.InsertNewRowAfterLastRow = value;
}
EpiGrid.prototype.get_Rows=function()
{
    var ctrl = document.getElementById(this.ID); 
    var gridParts = this._getGridParts(ctrl);
    obj = gridParts["BodyTable"];
    var rows = new RowsCollection();
    for(var ii=0; ii<=obj.rows.length-1; ii++)
    {
        rows.Add(this.get_Row(ii));
    }
    return rows;
}
EpiGrid.prototype.get_Row=function(idx)
{
    return new UltraGridRow(this, idx);
}
EpiGrid.prototype.get_DisplayLayout=function()      // temp, until we can expand it
{
    var viewStyle=(this.get_HasGroupByShown())? ViewStyleBand.OutlookGroupBy:ViewStyleBand.Vertical;
    return {"ViewStyleBand":viewStyle,"Bands":[new UltraGridBand(this)],"get_Band":function(indx){return this.Bands[0];},"Override":{"RowAppearance":{}},"ColScrollRegions":new ColScrollRegionsCollection(),"UIElement":{"LastElementEntered":{"GetAncestor":function(type){return null;}}}};
}
EpiGrid.prototype.LastElementWasRowUIElement=function() {return true;}
EpiGrid.prototype.Resize=function(ctrl,h,w,limits,skipPaging)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        var prevHeight=ctrl.offsetHeight;
    
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height-2>0?bounds.Height-2:0) + "px"; 
        ctrl.style.width = (bounds.Width-2>0?bounds.Width-2:0) + "px"; 
     
        this.FixSize(ctrl);   
        this.ResizeColumns(ctrl);
        
        this.HasPaging=this._hasPaging(ctrl);
        if(ctrl.offsetHeight!=prevHeight&&this.HasPaging&&!skipPaging)
        {
            var dv=Global.BindingEngine.EpiDataViews[this.DataView];
            if(dv&&dv.dataView&&dv.dataView.Table.DataSet.CacheInfo) 
            {
                this._page(ctrl);
            }
            else
        {
            this.Bind(Global.BindingEngine,ctrl,Global.BindingEngine.EpiDataViews[this.DataView]);
            
                
            var me = this;
            setTimeout(function(){me._page(ctrl);}, 10);
        }
    }
    }
}
EpiGrid.prototype._hasPaging=function(ctrl)
{
    var hasPaging=false;
    var gridParts=this._getGridParts(ctrl);

    var dv=Global.BindingEngine.EpiDataViews[this.DataView];
    if((Global.Form instanceof EpiHostForm && (dv instanceof BAQDataView||dv instanceof FilteredBAQDataView) && !dv.get_IsUpdatable())
        || Global.Form.ID=="EpiZoneForm")
    {
        var cacheInfo=null;
        var ds=dv.dataView.Table.DataSet;
        var cnt=0;
        if(ds&&ds.CacheInfo)
        {
            cnt=ds.CacheInfo.RowCount;
        }
        else
        {
            var dvNodes = dv.dataView.Rows;
            cnt=dvNodes.length;
        }
        var pageSize=gridParts["PageSize"];
        if(pageSize>0&&cnt>pageSize*3) 
        {
            hasPaging=true;
        }
    }
    return hasPaging;
}
EpiGrid.prototype.Create=function(parentCtrl, position, pWidth)
{
    if(!pWidth) pWidth=parentCtrl.offsetWidth;

    var div = document.createElement("DIV");
    parentCtrl.appendChild(div);
    
    div.className = "EpiGrid";
    div.setAttribute("id", this.ID);
    div.style.position="absolute";
    div.style.height=position.Height+"px";
    div.style.width=position.Width+"px";
    div.style.top=position.Top+"px";
    
    if(Global.FormDir=="rtl")
        div.style.left=pWidth-position.Width-position.Left+"px";
    else
        div.style.left=position.Left+"px";
            
    var inner = "<div class='EpiGrid-Cpt' style='display:none'></div>" + 
                "<div class='EpiGrid-Hdr'><table cellspacing='0' cellpadding='0' style='width:10px'><tbody><tr></tr></tbody></table></div>" +
                "<div class='EpiGrid-Bdy'><table cellspacing='0' cellpadding='0' style='width:10px'><colgroup></colgroup><tbody></tbody></table></div>";
                
    div.innerHTML = inner;
    
    return div;    
}
EpiGrid.prototype.RemoveColumn=function(idx)
{
    var colName = this._getColumnName(idx);

    var gridParts = this._getGridParts(Global.document.getElementById(this.ID));
    var headerCells = gridParts.HeaderTable.rows[0].cells;
    headerCells[idx].parentNode.removeChild(headerCells[idx]);
    
    var i, j, cnt = gridParts.BodyTable.rows.length;
    for (i = 0; i < cnt; i++)
    {
        if (gridParts.BodyTable.rows[i].cells.length > 0)
        {
            if(gridParts.BodyTable.rows[i].getAttribute("summary")!="true")
                gridParts.BodyTable.rows[i].removeChild(gridParts.BodyTable.rows[i].cells[idx]);
        }
    }

    var colGroup = gridParts.BodyTable.getElementsByTagName("COLGROUP");
    if (colGroup && colGroup[0])
    {
        colGroup = colGroup[0];
        colGroupNodes = colGroup.children ? colGroup.children : colGroup.childNodes;
        colGroup.removeChild(colGroupNodes[idx]);
    }

    delete this._columns[colName];
    
    if(this._hasSummariesShown) this._refreshSummaries(false);
}
EpiGrid.prototype.MoveColumn = function(FromIndex, ToIndex, SavePosition)
{
    if (FromIndex == ToIndex)
        return;

    var leftToRight = FromIndex < ToIndex;
    var gridParts = this._getGridParts(Global.document.getElementById(this.ID));
    var headerCells = gridParts.HeaderTable.rows[0];

    if(ToIndex>=headerCells.cells.length) ToIndex=-1;
    var moveToEnd=ToIndex==-1;

    if (FromIndex < 0 || (ToIndex < 0 && !moveToEnd) || FromIndex >= headerCells.cells.length)
        return;

    var iCell = headerCells.cells[FromIndex];
    var jCell = headerCells.cells[ToIndex];

    //var moveToEnd = jCell.nextSibling == null;
    if (moveToEnd)
        headerCells.appendChild(iCell);
    else
        headerCells.insertBefore(iCell, jCell);
        //headerCells.insertBefore(iCell, leftToRight ? jCell.nextSibling : jCell);

    //  Swap data grid cells
    var i, j, cnt = gridParts.BodyTable.rows.length;
    if (moveToEnd)
    {
        for (i = 0; i < cnt; i++)
        {
            if (gridParts.BodyTable.rows[i].cells.length > 0)
            {
                if(gridParts.BodyTable.rows[i].getAttribute("summary")!="true")
                    gridParts.BodyTable.rows[i].appendChild(gridParts.BodyTable.rows[i].cells[FromIndex]);
            }
        }
    }
    else
    {
        for (i = 0; i < cnt; i++)
        {
            if (gridParts.BodyTable.rows[i].cells.length > 0&&gridParts.BodyTable.rows[i].cells[FromIndex]&&gridParts.BodyTable.rows[i].cells[ToIndex])
            {
                if(gridParts.BodyTable.rows[i].getAttribute("summary")!="true")
                    gridParts.BodyTable.rows[i].insertBefore(gridParts.BodyTable.rows[i].cells[FromIndex],gridParts.BodyTable.rows[i].cells[ToIndex]);
            }
        }
    }

    //  Swap colgroups to keep correct width of data columns
    var colGroup = gridParts.BodyTable.getElementsByTagName("COLGROUP");
    if (colGroup && colGroup[0])
    {
        colGroup = colGroup[0];
        colGroupNodes = colGroup.children ? colGroup.children : colGroup.childNodes;
        if (moveToEnd)
            colGroup.appendChild(colGroupNodes[FromIndex]);
        else
            colGroup.insertBefore(colGroupNodes[FromIndex], colGroupNodes[ToIndex]);
            //colGroup.insertBefore(colGroupNodes[FromIndex], leftToRight ? colGroupNodes[ToIndex] : colGroupNodes[ToIndex]);
    }

    var colArr=[];
    for(var i in this._columns)
        colArr.push({"Key":i,"ID":this._columns[i]});

    if(colArr[FromIndex])
    {
        var fromCol=colArr[FromIndex];
        colArr.splice(FromIndex,1);
        if(moveToEnd) 
            colArr.push(fromCol);
        else
        {
            if(leftToRight)
                colArr.splice(ToIndex-1,0,fromCol);
            else
                colArr.splice(ToIndex,0,fromCol);
        }
    }

    var newColumns={};
    for(var ii=0;ii<=colArr.length-1;ii++)
    {
        newColumns[colArr[ii].Key]=colArr[ii].ID;
    }
    
    this._columns = newColumns;

    if (SavePosition)
    {
        var settings = this._loadSettings();

        settings.Columns = [];
        for (var col in this._columns)
            settings.Columns[settings.Columns.length] = col;

        this._saveSettings(settings);
    }
    
    if(this._hasSummariesShown) this._refreshSummaries(false);
}
EpiGrid.prototype.MoveColumnInSettings=function(columnId,ToIndex)
{
    var settings=this._loadSettings();

    if(!settings.Columns)
    {
        settings.Columns=[];
        for(var col in this._columns)
            settings.Columns[settings.Columns.length]=col;
    }

    var FromIndex= -1;
    for(var i=0;i<settings.Columns.length;i++)
    {
        if(settings.Columns[i]==columnId)
        {
            FromIndex=i;
            break;
        }
    }

    if(FromIndex== -1) return;
    if(FromIndex==ToIndex) return;

    var fromCol=settings.Columns[FromIndex];
    var leftToRight=FromIndex<ToIndex;
    var moveToEnd=ToIndex== -1;

    settings.Columns.splice(FromIndex,1);
    if(moveToEnd)
        settings.Columns.push(fromCol);
    else
    {
        if(leftToRight)
            settings.Columns.splice(ToIndex-1,0,fromCol);
        else
            settings.Columns.splice(ToIndex,0,fromCol);
    }

    this._saveSettings(settings);
}

EpiGrid.prototype._getSettingsStorageId = function()
{
    return "epigrid_for_" + Global.ServerSession.UserID;
}

EpiGrid.prototype._saveSettings = function(settings)
{
    var today = new Date()
    var expires_date = new Date(today.getTime() + (7 * 24 * 3600 * 1000));  //Expires after week

    var allSettings = this._loadSettings(true);
    if (!settings || JSON.stringify(settings) == '{}')
        delete allSettings[this.ID];
    else
        allSettings[this.ID] = settings;
    document.cookie = this._getSettingsStorageId() + "=" + escape(JSON.stringify(allSettings)) +
                    ";expires=" + expires_date.toGMTString();
}
EpiGrid.prototype._persistSettings = function()
{
    if(Global.GridSettings[this.ID]) return;
    
    Global.GridSettings[this.ID]={"Columns":[],"OrderBy":{"Column":null,"Direction":null}};
    for (var col in this._columns)
        Global.GridSettings[this.ID].Columns[Global.GridSettings[this.ID].Columns.length] = col;
}
EpiGrid.prototype._loadSettings = function(GetAll)
{

    var name = this._getSettingsStorageId();

    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length)))
        return {};

    if (start == -1)
        return {};

    var end = document.cookie.indexOf(";", len);
    if (end == -1)
        end = document.cookie.length;

    var settings = JSON.parse(unescape(document.cookie.substring(len, end)));
    return GetAll ? settings : (settings[this.ID] ? settings[this.ID] : {});
}

EpiGrid.prototype.SetText=function(ctrl, value)
{
    var grdParts = this._getGridParts(ctrl);
    grdParts["Caption"].innerHTML = value;
}
EpiGrid.prototype.set_Text=function(value)
{
    var ctrl = Global.document.getElementById(this.ID);
    this.SetText(ctrl, value);
}
EpiGrid.prototype.set_DisabledColumns=function(value){}//TODO
EpiGrid.prototype._fillColumns = function(view)
{
    if(view.dataView.Table.get_Columns().Count==0) return;
    if(!this._hasColumns())
    {
        var ctrl=Global.document.getElementById(this.ID);

        // If the grid doesnt have any columns, create them now based on the datasource
        var col;var cap;
        var cols=view.dataView.Table.get_Columns().items;
        for(var c in cols)
        {
            col=cols[c];
            cap=(col.Caption&&(col.Caption.length>0))?col.Caption:
	            ((col.ExtendedProperties&&col.ExtendedProperties.Caption&&col.ExtendedProperties.Caption.length>0)?
	                col.ExtendedProperties.Caption:col.ColumnName);
            if((!this._columns["col"+col.ColumnName])&&(!this._columns[col.ColumnName]))
                this.AddColumn(ctrl,view.dataView.Table,{ "ColumnName": col.ColumnName,"ColumnWidth": -1,"ColumnCaption": cap,"Enabled": false },true);
        }
        this._applyProps(ctrl);
    }
}
EpiGrid.prototype._setCaptions=function(view,gridParts) // Sets the captions from the datatable's columns at runtime for the dashboard form grids
{
    if (view.dataView.Table.TableName == "Results")
    {
        var col, cap,idx;
        var cols = view.dataView.Table.get_Columns().items;
        var headerCells = gridParts["HeaderCells"];
        idx= 0;
        var ctrlStruct = Global.BindingEngine.Controls;
        for(var c in this._columns) // _columns is the columns of the grid
        {
            col = cols[c]; // Find this column in the datatable
            if (!col) continue;
            cap = (col.Caption && (col.Caption.length > 0)) ? col.Caption : col.ColumnName; // Find the Caption from the datacolumn
			var obj = ctrlStruct[this._columns[c]];
            if (obj && obj.Header && obj.Header.Caption)
                cap = obj.Header.Caption;
            headerCells[idx].getElementsByTagName("label")[0].innerHTML = cap; // replace the caption in the grid header
            idx++;
        }
    }
}
EpiGrid.prototype.oDataView_EpiViewNotification=function(view, args)
{
    this._fillColumns(view);
}
EpiGrid.prototype.set_BaseCurrencyCols=function(value)
{
    this.BaseCurrencyCols = value;
    this.rpt1CurrCols = [];
    this.rpt2CurrCols = [];
    this.rpt3CurrCols = [];

    for(var ii=0; ii<=this.BaseCurrencyCols.length-1; ii++)
    {
        this.rpt1CurrCols.push("Rpt1" + this.BaseCurrencyCols[ii]);
        this.rpt2CurrCols.push("Rpt2" + this.BaseCurrencyCols[ii]);
        this.rpt3CurrCols.push("Rpt3" + this.BaseCurrencyCols[ii]);
    }

    this.InitCurrencyCols();
}
EpiGrid.prototype.set_DocCurrencyCols=function(value)
{
    this.DocCurrencyCols = value;
    this.InitCurrencyCols();
}
EpiGrid.prototype.set_PreserveColSettings=function(value)
{
    this.PreserveColSettings = value;
}
EpiGrid.prototype.get_PreserveColSettings=function(){return this.PreserveColSettings;}

EpiGrid.prototype.InitCurrencyCols=function()
{
    if(this.BaseCurrencyCols.length==this.DocCurrencyCols.length)
    {    
        var gridCtrl = Global.document.getElementById(this.ID);
        this.currencyColumns = [];
        for(var ii=0; ii<=this.BaseCurrencyCols.length-1; ii++)
        {
            var baseCtrlName = this._columns[this.BaseCurrencyCols[ii]];
		    var baseObj = Global.BindingEngine.Controls[baseCtrlName];
		    
		    var docCtrlName = this._columns[this.DocCurrencyCols[ii]];
		    var docObj = Global.BindingEngine.Controls[docCtrlName];

		    var ctrlName = "";
		    if(baseObj)
		    {
		        if(docObj && docObj != baseObj) this.SetColumnHidden(gridCtrl, this.DocCurrencyCols[ii], true);
		        ctrlName = baseCtrlName;
		        this.currencyColumns.push(ctrlName);
				if (!Global.Form.CurrentCurrencyCode) Global.Form.CurrentCurrencyCode = CurrencyToggleCode.BASE;
		    }        
		    else if(docObj)
		    {
		        ctrlName = docCtrlName;
		        this.currencyColumns.push(ctrlName);
				if (!Global.Form.CurrentCurrencyCode) Global.Form.CurrentCurrencyCode = CurrencyToggleCode.DOC;
		    }
		    
		    this.SetColumnHidden(gridCtrl, this.rpt1CurrCols[ii], true);;
		    this.SetColumnHidden(gridCtrl, this.rpt2CurrCols[ii], true);
		    this.SetColumnHidden(gridCtrl, this.rpt3CurrCols[ii], true);
            
            if(ctrlName!="")
            {
                var obj = Global.BindingEngine.Controls[ctrlName];
                if(obj) 
                {
                    Global.BindingEngine.Controls[ctrlName] = new EpiCurrencyConverGrid({"ID":ctrlName,"DC":obj.DataColumn,"DV":obj.DataView,"InG":true,"DocBinding":this.DocCurrencyCols[ii],"BaseBinding":this.BaseCurrencyCols[ii],"Rpt1Binding":this.rpt1CurrCols[ii],"Rpt2Binding":this.rpt2CurrCols[ii],"Rpt3Binding":this.rpt3CurrCols[ii]});
                    Global.BindingEngine.Controls[ctrlName].Index=obj.Index;
                }
            }
        }
        
        if(Global.Form.CurrentCurrencyCode)
            this.HideShowCurrencyColumns(Global.Form.CurrentCurrencyCode);
    }
}
EpiGrid.prototype.HideShowCurrencyColumns=function(activeCurrency)
{
	if(this.BaseCurrencyCols.length > 0)
	{
        if (this.firstTimeInHideShowCurrencyColumns)
        {
            this.FilterHideShowColumns();
            this.firstTimeInHideShowCurrencyColumns = false;
        }

     	if(this.BaseCurrencyCols.length != this.DocCurrencyCols.length)
			throw new Exception("Mismatch in the number of elements in the BaseCurrCols array and the DocCurrCols array");

		for(var i=0; i<this.BaseCurrencyCols.length; i++)
		{
            var ctrlName = this.currencyColumns[i];
            var obj = Global.BindingEngine.Controls[ctrlName];
		    if(obj && obj instanceof EpiCurrencyConverGrid)
		    {
		        var newBinding = "";
		        
                switch (activeCurrency)
                {
                    case CurrencyToggleCode.BASE: newBinding = obj.BaseBinding; break;
                    case CurrencyToggleCode.DOC: newBinding = obj.DocBinding; break;
                    case CurrencyToggleCode.RPT1: newBinding = obj.Rpt1Binding; break;
                    case CurrencyToggleCode.RPT2: newBinding = obj.Rpt2Binding; break;
                    case CurrencyToggleCode.RPT3: newBinding = obj.Rpt3Binding; break;
                }
		    
		        if(obj.DataColumn!=newBinding)
		        {
		            obj.DataColumn = newBinding;
		            if(obj.DataView && obj.DataColumn)
		            {
		                var grdCtrl = Global.document.getElementById(this.ID);
		                if(grdCtrl)
		                {
		                    var gridParts = this._getGridParts(grdCtrl);
		                    var bdyTable = gridParts["BodyTable"];
		                    for(var j=0; j<=bdyTable.rows.length-1; j++)
		                    {
		                        if(bdyTable.rows[j].cells.length>0)
		                        {
		                            var ctrl = bdyTable.rows[j].cells[obj.Index].childNodes[0];
		                            obj.ToggleCurrency(ctrl,activeCurrency);
		                        }
		                    }
		                }
		            }
		        }
		    }    
		}
	}
}
EpiGrid.prototype.FilterHideShowColumns=function()
{
    try
    {
        // determine if any of the doc/base currency columns should
        // remain hidden.
        // we do this by checking both the base and associated doc column
        // if both are hidden now then we assume that they should stay that 
        // way

        for (var cCnt = this.BaseCurrencyCols.length-1; cCnt >= 0; cCnt--)
        {
            var ctrlName = this._columns[this.BaseCurrencyCols[cCnt]];
		    var obj = Global.BindingEngine.Controls[ctrlName];
		    if(!obj)
		    {
                ctrlName = this._columns[this.DocCurrencyCols[cCnt]];
		        obj = Global.BindingEngine.Controls[ctrlName];
		        
		        if(!obj)
		        {
		            this.BaseCurrencyCols.splice(cCnt,1);
		            this.DocCurrencyCols.splice(cCnt,1);
		            this.rpt1CurrCols.splice(cCnt,1);
		            this.rpt2CurrCols.splice(cCnt,1);
		            this.rpt3CurrCols.splice(cCnt,1);
		        }
		    }
	    }	    
	}    
	catch(err) {}
}
EpiGrid.prototype._getHeaderColumnIndex = function(column)
{
    var gridParts = this._getGridParts(Global.document.getElementById(this.ID));
    var headerRowCells = gridParts.HeaderTable.rows[0].cells;

    for (var i = 0; i < headerRowCells.length; i++)
    {
        if (headerRowCells[i] == column)
            return i;
    }

    return -1;
}
EpiGrid.prototype._getColumnName = function(index)
{
    if (index < 0)
        return null;
    
    for (var name in this._columns)
        if (!index--)
            return name;

    return null;
}
EpiGrid.prototype._getColumnIndexByName = function(colName)
{
    var index = 0;

    for (var name in this._columns)
    {
        if (name == colName)
            return index;

        index++;
    }

    return -1;
}
EpiGrid.prototype._getColumnControlIndex=function(ctrlCol)
{
    var ii=0;
    for(var o in this._columns)
    {
        o=this._columns[o];
        if(o==ctrlCol.ID)
        {
            return ii;
            break;
        }
        ii++;
    }
    return -1;
}
EpiGrid.prototype.OrderByColumn=function(columnName,direction,SaveOrderDirection)
{
    if(this.IsSorting) return;

    var parts = this._getGridParts(Global.document.getElementById(this.ID));
    if(parts)
    {
        var header = parts["Header"];
        var orderCaps = Global.GetChildrenByName(header, 'order');
        for (var i = 0; i < orderCaps.length; i++)
            orderCaps[i].style.display = 'none';
    }


    var oDataView = Global.BindingEngine.EpiDataViews[this.DataView];
    if (oDataView)
    {
        if(oDataView.dataView&&oDataView.dataView.Table)
        {
            columnName = oDataView.dataView.Table._resolveColumnName(columnName);
        }

        this.IsSorting=true;
        if (SaveOrderDirection)
        {
            var settings = this._loadSettings();
            if (columnName && settings.OrderBy)
                delete settings["OrderBy"];
            settings.OrderBy = { Column: columnName, Direction: direction };
            this._saveSettings(settings);
        }

        var sortingExpression = columnName ? columnName + ' ' + direction : null;
        var ds = oDataView.dataView.Table.DataSet;
        if(ds&&ds.CacheInfo&&this.HasPaging)
        {
            if (oDataView.dataView.set_Sort(sortingExpression))
            {
                this._page(Global.document.getElementById(this.ID),true);
            }
        }
        else
        {
            if (oDataView.dataView.set_Sort(sortingExpression))
            {
                var grd = Global.document.getElementById(this.ID);
            
                if(!Global.BindingEngine.ShouldWait(null,oDataView))
                this.Bind(Global.BindingEngine, grd, oDataView, 0);
                
                var me = this;
                setTimeout(function(){me._page(grd);}, 10);
            }
        }

        var columnCell = this._getGridParts(Global.document.getElementById(this.ID)).HeaderCells[this._getColumnIndexByName(columnName)];
        if (columnCell)
        {
            var source = Global.GetChildrenByName(columnCell, 'order')[0];
            if (source == null)
            {
                source = document.createElement('A');
                source.href = '#';
                source.name = 'order';
                source.id = 'order';
                source.style.fontSize = '12px';
                source.style.lineHeight = '14px';
                source.style.textDecoration = 'none';
                source.style.display = 'none';
                source.style.color = '#5987D6';
                
                var sum=Global.GetChildrenByName(columnCell, 'summary')[0];
                if(sum==null)
                    columnCell.appendChild(source);
                else
                    columnCell.insertBefore(source,sum);
            }

            source.innerHTML = direction == 'ASC' ? '▲' : '▼';
            source.style.display = '';
            
            if(direction=='ASC') columnCell.sortOrder = 0;
            else columnCell.sortOrder=1;
        }
        this.IsSorting=false;
    }
}

        
// Move the Linked columns around.
EpiGrid.prototype.processLinkedColumns = function()
{
    if (this._linkedColumns && this._linkedColumns.length >0) return;
    
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    if (dv)
    {
        var dt = dv.dataView.Table;
        if (dt.get_Columns().Count == 0) return;
        
        var foundLinked = false;
        // TODO: The _columns collection contains only the visible columns of the grid. 
        // But the linking needs to be done on all the columns, so maybe we should process all the dv columns that the grid is bound to? 
       // for (var baseCol in this._columns)
       var cols = dt.get_Columns().items 
        for (var baseCol in cols) 
        {
            var linkedCol = dt.GetExtendedProperty(baseCol,"LinkedColumn","");
            if (linkedCol != "")
            {
                if (!this._linkedColumns) this._linkedColumns=[];
                if (this.setupLinkedColumns(baseCol,linkedCol))
                    foundLinked = true;
            }
        }
        
        if (foundLinked)
        {
            this.adjustColumnLayoutForLinkedColumns();

        }
    }
}

EpiGrid.prototype.setupLinkedColumns=function(columnName, linkedColumnName)
{
    var ret = true;
    try
    {
        var parentColumnList = null;
        var childColumnList = null;
        
        // first see if these two columns are already in a list
        for (var i=0,linkedList; linkedList = this._linkedColumns[i];i++)
        {
            if (linkedList.Contains(columnName))
            {
                parentColumnList = linkedList;
            }

            if (linkedList.Contains(linkedColumnName))
            {
                childColumnList = linkedList;
            }

            if (parentColumnList != null && childColumnList != null) break;
        }

        /* now run some validation logic */

        // check to see if the child is already the linked column for another column.
        // if so we ignore this linking.
        if (childColumnList != null)
        {
            var childNode = childColumnList.IndexOf(linkedColumnName);
            if (childNode > 0) // If the node already has a parent column
            {
                DebugHelper.WriteError("EpiGrid.setupLinkedColumns", {"Message":"Linking column: " + columnName + ", Linked Column: " + linkedColumnName + " - linked column is already linked to column " + childColumnList.items[childNode-1]});
                return false;
            }
        }

        // check to see if the parent column already has a linked column. if so then we ignore this linking.
        if (parentColumnList != null)
        {
            var parentNode = parentColumnList.IndexOf(columnName);
            if (parentNode != -1 && parentColumnList.Count > parentNode+1)
            {
                DebugHelper.WriteError("EpiGrid.setupLinkedColumns",{"Message":"Linking column: " + columnName + ", Linked Column: " + linkedColumnName + " - linking column is already linked to column " + parentColumnList.items[parentNode+1]});
                return false;
            }
        }

        // make sure we aren't creating a circular reference. If the parent column and the child column already exist
        // in a list and they aren't linked together then throw an exception.
        if (parentColumnList != null)
        {
            var childNode = parentColumnList.IndexOf(linkedColumnName);
            if (childNode != -1)
            {
                var badLink = true;
                if (childNode > 0)
                {
                    if (parentColumnList.items[childNode-1] == columnName)
                    {
                        badLink = false;
                    }
                }

                if (badLink)
                {
                    DebugHelper.WriteError("EpiGrid.setupLinkedColumns",{"Message":"Linking column: " + columnName + ", Linked Column: " + linkedColumnName + " - linked column is already part of a linked list."});
                    return false;
                }
            }
        }

        if (childColumnList != null)
        {
            var parentNode = childColumnList.IndexOf(columnName);
            if (parentNode != -1)
            {
                var badLink = true;
                if (parentNode < childColumnList.Count)
                {
                    if (childColumnList.items[parentNode+1] == linkedColumnName)
                    {
                        badLink = false;
                    }
                }

                if (badLink)
                {
                    DebugHelper.WriteError("EpiGrid.setupLinkedColumns",{"Message":"Linking column: " + columnName + ", Linked Column: " + linkedColumnName + " - linking column is already part of a linked list."});
                    return false;
                }
            }
        }

        // check to see if the lists point to the same instance. If so null out the childColumnList variable
        if ((parentColumnList != null) && (childColumnList != null))
        {
            if (parentColumnList == childColumnList)
            {
                childColumnList = null;
            }
        }

        /* now create the link */

        // if both lists are null then create a new list
        if (parentColumnList == null && childColumnList == null)
        {
            var list = [columnName, linkedColumnName];
            var newList = new ArrayList();
            newList.AddRange(list);
            this._linkedColumns.push(newList);
            return true;
        }

        // if one list is null then add the correct value to the other list
        if (childColumnList == null)
        {
            var node = parentColumnList.IndexOf(columnName);
            var newList = new ArrayList();
            newList.Add(linkedColumnName);
            parentColumnList.Insert(node + 1, newList);
            return true;
        }
        else
        {
            if (parentColumnList == null)
            {
                var node = childColumnList.IndexOf(linkedColumnName);
                var newList = new ArrayList();
                newList.Add(columnName);
                childColumnList.Insert(node-1, newList);
                return true;
            }
        }

        // if neither list is null then we need to merge the two together
        var childList = [];
        childList = childColumnList.ToArray();

        for (var x = 0; x < childList.length; x++)
        {
            parentColumnList.Add(childList[x]);
        }

        childColumnList.Clear();
        this._linkedColumns.splice(childColumnList,1);
        return true;
    }
    catch (ex)
    {
        DebugHelper.WriteError("Exception in EpiGrid.setupLinkedColumns",ex);
        return false;
    }
}
EpiGrid.prototype.adjustColumnLayoutForLinkedColumns=function()
{
    var linkCol,linkColIdx;
    for (var list in this._linkedColumns)
    {
        list = this._linkedColumns[list]
        
        if (list.Count > 0)
        {
            var baseCol = list.items[0];
            var baseColIdx = this._getColumnIndex(baseCol);
            if (baseColIdx != undefined)
            {
                var childColIdx = baseColIdx + 1; // Move the first linked column to the right of the base column
                for (i=1;i<list.items.length;i++)
                {
                    linkCol = list.items[i];
                    linkColIdx=this._getColumnIndex(linkCol);
                     if (linkColIdx != undefined)
                     {
                        this.MoveColumn(linkColIdx,childColIdx,false);
                        if(linkColIdx>baseColIdx) childColIdx++; // in case there are more than one linked columns
                     }
                }
            }
        }
    }
}
EpiGrid.prototype.ApplySettings = function(settings)
{
    if (this._processSettings&&!settings)
        return;
        
    if(!settings) this._persistSettings();
        
    this._processSettings = true;

    try
    {
        if(!settings) 
            settings = this._loadSettings();
        else
            this._saveSettings(settings);
            
        if (settings.Columns)
        {
            // First remove any columns that are in the groupby
            if(this.GroupByColumns.length>0)
            {
                for(var ii=settings.Columns.length-1;ii>=0;ii--)
                {
                    for(var jj=0;jj<=this.GroupByColumns.length-1;jj++)
                    {
                        if(settings.Columns[ii]==this.GroupByColumns[jj].Key)
                        {
                            settings.Columns.splice(ii,1);
                            break;
                        }
                    }
                }
            }

            var colsSet=settings.Columns;
            for(var colSet in colsSet)
            {
                if (!this._columns[colsSet[colSet]])
                    delete settings.Columns[colSet];
            }

            var i,j,cnt=settings.Columns.length;
            for (i = 0; i < cnt; i++)
            {
                j = 0;
                for(var colName in this._columns)
                {
                    if(settings.Columns[i]==colName)
                        break;
                    j++;
                }
                if(j<cnt && j > i)
                    this.MoveColumn(j,i);
            }
        }

        if (settings.OrderBy&&settings.OrderBy.Column&&settings.OrderBy.Direction)
            this.OrderByColumn(settings.OrderBy.Column, settings.OrderBy.Direction);

    }
    catch (e)
    {
        this._processSettings = false;
        throw e;
    }

    this._processSettings = false;
}

EpiGrid.prototype.Init=function(ctrl)
{
    var gridParts = this._getGridParts(ctrl);
    var isGroupChild=Global.BindingEngine.Controls[ctrl.id].IsGroupChild;

    var bdy = gridParts["Body"];
    var hdr = gridParts["Header"];
    var caption = gridParts["Caption"];
    var grp = gridParts["GroupBy"];

    var headerCells = gridParts.HeaderTable.rows[0].cells;
    for (var i = 0; i < headerCells.length; i++)
    {
        headerCells[i].sortOrder = null;
        headerCells[i].cssClass = 'unselectable';
    }
    if (ctrl.getAttribute("_init") == null)
    {
        if(isGroupChild)
        {
            var childGridObj=Global.BindingEngine.Controls[ctrl.id];
            EpiEventManager.addListener(bdy, "dblclick", this._dblclick, childGridObj, true);
            EpiEventManager.addListener(bdy, "scroll", this._scroll, childGridObj, true);
        }
        else
        {
            EpiEventManager.addListener(bdy, "dblclick", this._dblclick, this, true);
            EpiEventManager.addListener(bdy, "scroll", this._scroll, this, true);
        }
        EpiEventManager.addListener(hdr, "mousemove", this._hdrmousemove, this, true);
        EpiEventManager.addListener(hdr, "mouseout", this._hdrmouseout, this, true);
        EpiEventManager.addListener(hdr, "mousedown", this._hdrmousedown, this, true);
        EpiEventManager.addListener(bdy, "keydown", this._keyDown, this, true);
        
        if(grp) 
        {
            EpiEventManager.addListener(grp, "mousemove", this._grpmousemove, this, true);
            EpiEventManager.addListener(grp, "mouseout", this._grpmouseout, this, true);
            EpiEventManager.addListener(grp, "mousedown", this._grpmousedown, this, true);
            var idx=0;
            var nextNode = Global.NextNode(gridParts["GroupByLbl"]);
            while(nextNode)
            {
                if(this.GroupByColumns[idx]) 
                {
                    var txt = nextNode.innerHTML;
                    txt=txt.substr(0,txt.length-2);
                    this.GroupByColumns[idx].Caption=txt;
                }
                idx++;
                nextNode = Global.NextNode(nextNode);
            }
        }

        if (BrowserSniffer.IE)
        {
            EpiEventManager.addListener(bdy, "focusin", this._focus, this, true);
        }
        else
        {
            if (BrowserSniffer.FireFox15)
            {
                EpiEventManager.addListener(bdy, "focus", this._focus, this, true);
            }

            if (BrowserSniffer.Safari13)
            {
                EpiEventManager.addListener(bdy, "click", this._focus, this, true);
                EpiEventManager.addListener(bdy, "keyup", this._safariKeyUp, this, true);
            }
        }
    }

    if (ctrl.offsetHeight > 0)
    {
        this.FixSize(ctrl);
    }
    ctrl.setAttribute("_init", "true");
    
    if(!isGroupChild)
    {
        if(grp&&this.GroupByColumns.length>0)
        {
            this.GroupGrid.Show();
        }

        var oDataView = Global.BindingEngine.EpiDataViews[this.DataView];
        if (oDataView)
        {
            oDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotification, this, true);
        }

        this.get_Event("InitializeLayout").fire(this, new InitializeLayoutEventArgs(this));
        if (this.get_Event("InitializeLayout").subscribers.length == 0)
            this.noSubsForInitLayout = true;

        this.ApplySettings();
        this.processLinkedColumns();
    }
}
EpiGrid.prototype.set_EpiBinding = function(value)
{
    //  Remove previous listners
    this._unsubscribeViewNotifications();
    
    this.DataView = value; // Grids only have the DataView name in the EpiBinding.
    var ctrl = Global.document.getElementById(this.ID);
    this.Init(ctrl);
    this.Bind(Global.BindingEngine, ctrl, Global.BindingEngine.EpiDataViews[this.DataView], -1)
}
EpiGrid.prototype._keyDown = function(e)
{
    this.get_Event("KeyDown").fire(this,e);
	if (e.keyCode == 13)
	{
		//if the enter key then fire the BeforeRowInsert method.
		this.get_Event("BeforeRowInsert").fire(this, e);
		if (e.Cancel)
		{
			this.FocusFirstVisibleColumn();
		}
	}
}
EpiGrid.prototype._safariKeyUp = function(e) {
    if (e.keyCode == 9) {
        this._focus(e);
    }
}
EpiGrid.prototype.set_Height=function(ctrl,height)
{
    ctrl.style.height=height + "px";
    this.FixSize(ctrl);
    this.ResizeColumns(ctrl);
}
EpiGrid.prototype.FixSize=function(ctrl)
{
    var gridParts = this._getGridParts(ctrl);

    var bdy = gridParts["Body"];
    var hdr = gridParts["Header"];
    var caption = gridParts["Caption"];
    var bdyGrp = gridParts["BodyGroup"];
    var grpBy = gridParts["GroupBy"];
 
    var h = ctrl.clientHeight - hdr.offsetHeight - caption.offsetHeight - 2;
    if(grpBy) h-=grpBy.offsetHeight;
    if(bdyGrp)
    {
        if(h>=0) bdyGrp.style.height = h + "px";
        bdyGrp.style.paddingTop = hdr.offsetHeight + "px";
    }
    
    if(h>=0) bdy.style.height = h + "px";
    bdy.style.paddingTop = hdr.offsetHeight + "px";

    if(ctrl.clientHeight<5)
        ctrl.style.borderWidth="0px";
    else 
        ctrl.style.borderWidth="1px";
}
EpiGrid.prototype.AddColumn=function(ctrl, tbl, col, skipGrdID, idx)
{
    if(col.ColumnName=="RowIdent") return;

    if(idx==undefined) idx=-1;

    var gridParts = this._getGridParts(ctrl);
    
    var colName = "col" + col.ColumnName;
    if (!skipGrdID) // if column name already starts with col, dont build the column name, use what is sent in
        colName = "col" + col.ColumnName + this.ID;
    
    var dc=col.ColumnName;
    if(col.DataColumn) dc=col.DataColumn;
    
    this._addColumnUI(ctrl, col.ColumnName, col.ColumnWidth, col.ColumnCaption, idx,skipGrdID);
        
    if(!this.DataView) this.DataView = tbl.TableName;
    var colDef = tbl.Columns[col.ColumnName];
    
    var dType = "System.String";
    if(colDef) dType = colDef.DataType;
    
    var newCol;
    switch(dType)
    {
        case "System.Int32":
        case "System.Decimal":
            newCol = new EpiNumericEditor({"ID":colName,"DV":this.DataView,"DC":dc,"InG":true});
            break;
        case "System.Boolean":
            newCol = new EpiCheckBox({"ID":colName,"DV":this.DataView,"DC":dc,"InG":true});
            break;
        case "System.DateTime":
            newCol = new EpiDateTimeEditor({"ID":colName,"DV":this.DataView,"DC":dc,"InG":true});
            break;
        default:
            newCol = new EpiTextBox({"ID":colName,"DV":this.DataView,"DC":dc,"InG":true});
            break;
    }
    newCol.InGrid = true;
    newCol.OwnerGrid = this.ID;
    Global.BindingEngine.Controls[colName] = newCol;
    
    return gridParts["HeaderCells"].length-1;
}
EpiGrid.prototype._findRowIndex=function(ctrl, key, val)
{
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    if(dv)
    {
        for(var ii=0; ii<=dv.dataView.Rows.length-1; ii++)
        {
            if(dv.dataView.Rows[ii][key]==val) return ii;
        }
    }
    return -1;
}

EpiGrid.prototype.SetColumnHidden=function(ctrl, key, hideFlg)
{
    var ctrlName = this._columns[key];
    if(ctrlName) 
    {
        // Get rid of the column in the UI
        var gridParts = this._getGridParts(ctrl);
        var hdr_cols = gridParts["HeaderCells"];
        var bdy_cols = gridParts["BodyCols"]; 

        // have to reorder columns
        var ii=0;
        for(var col in this._columns)
        {
            if(col==key)
            {
                if(hideFlg)
                {
                    hdr_cols[ii].style.display = "none";
                    if (BrowserSniffer.IE)
                        bdy_cols[ii].style.display = "none";
                    else
                        bdy_cols[ii].style.visibility="collapse"; // FF and Safari support this property to hide col elements in the colgroup
                }
                else
                {
                    hdr_cols[ii].style.display = "";
                    
                    if (BrowserSniffer.IE)
                        bdy_cols[ii].style.display = "";
                    else
                        bdy_cols[ii].style.visibility="";

                }
                break;//done here
            }
            ii++;
        }
    }    
}
EpiGrid.prototype._addColumnUI = function(ctrl, columnName, columnWidth, columnCaption, visibleIdx, SkipGrdID)
{
	var gridParts = this._getGridParts(ctrl);
	var colName = "col" + columnName;
	if (!SkipGrdID)
		colName = "col" + columnName + this.ID;

	if (!columnCaption || columnCaption == undefined) columnCaption = "";

	var w = 100;
	if (columnWidth > -1) w = columnWidth;
	var hdrRow = gridParts["HeaderTable"].tBodies[0].rows[0];

	var newCell = hdrRow.insertCell(visibleIdx);
	newCell.style.width = w + "px";

	if (columnCaption.length == 0) columnCaption = "&nbsp;"
	var labelElem = Global.document.createElement("label");
	labelElem.innerHTML = columnCaption;
	newCell.appendChild(labelElem);

	var colGrp = gridParts["BodyColGroup"];
	var colElem = Global.document.createElement("col");
	colElem.style.width = w + "px";

	if (visibleIdx == -1||!colGrp.childNodes[visibleIdx])
	{
		colGrp.appendChild(colElem);
		
        // Need to reorder here because of the way memory is holding on to previous columns.		
		var ii = 0;
		var newColumns = {};
		for (var col in this._columns)
		{
			newColumns[col] = this._columns[col];
			ii++;
		}
		newColumns[columnName]=colName;
		this._columns = newColumns;
	}
	else
	{
		colGrp.insertBefore(colElem, colGrp.childNodes[visibleIdx]);

		// have to reorder columns
		var ii = 0;
		var newColumns = {};
		for (var col in this._columns)
		{
			if (ii == visibleIdx) newColumns[columnName] = colName;
			newColumns[col] = this._columns[col];
			ii++;
		}
		if (!newColumns[columnName]) newColumns[columnName] = colName;
		this._columns = newColumns;
	}
}
EpiGrid.prototype._applyProps=function(ctrl)
{
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    if(dv)
    {
        var gridParts = this._getGridParts(ctrl);
        var hdr_cols = gridParts["HeaderCells"];
        var bdy_cols = gridParts["BodyCols"]; 

        var bec = Global.BindingEngine.Controls;
        var ii = 0;
        var trueIdx = 0;
        for(var c in this._columns)
        {
            var obj = bec[this._columns[c]];
            if(obj && obj.DataColumn && obj.DataColumn.length>0)
            {
                var colName = dv.dataView.Table._resolveColumnName(obj.DataColumn);
                var extProps = dv.dataView.Table.get_ExtProps(colName);
                if (!extProps) continue;
                if((extProps["SystemColumn"] && extProps["SystemColumn"] != "False")
                 || (extProps["IsHidden"] && extProps["IsHidden"] != "False" || colName=="ForeignTableName" || colName=="ForeignSysRowID" || colName=="SysRowID" || colName=="SysRevID")
                 || (!dv.dataView.Table.Columns[colName]))
                {
                    hdr_cols[ii].parentNode.removeChild(hdr_cols[ii]);
                    bdy_cols[ii].parentNode.removeChild(bdy_cols[ii]);
                    ii--;
                    delete this._columns[c];
                }
                if (Global.Form.FormOptions && Global.Form.FormOptions.RequiredIndicator && extProps["Required"]=="True")
                    this._setRequiredStyle(hdr_cols[ii]);
            }
            ii++;
            
        }
        delete Global.GridManager.Grids[ctrl.id];
        this.PropsApplied = true;
    }
}
EpiGrid.prototype.ResizeColumns = function(ctrl)
{
    if (ctrl.offsetHeight > 0)
    {
        if (ctrl.getAttribute("_init") == null) this.Init(ctrl);

        var gridParts = this._getGridParts(ctrl);
        var bdy = gridParts["Body"];
        var hdr = gridParts["Header"];
        var bdy_tbl = gridParts["BodyTable"];

        var isHidden=bdy.style.display=="none";
        if(isHidden) bdy.style.display="";

        if (ctrl.offsetWidth >= 4)
            bdy.style.width = ctrl.offsetWidth - 4 + "px";
        else
            bdy.style.width = ctrl.offsetWidth + "px";

        bdy_tbl.style.width = bdy.clientWidth + "px";

        var noSBFlg = ((bdy.offsetWidth - bdy_tbl.clientWidth) == 2);
        var isNewIE = BrowserSniffer.IEVersion > 7 && BrowserSniffer.ieBrowserMode != "Compat Mode";

        if (bdy_tbl.tBodies[0].rows.length > 0)
        {
            var hdr_cols = gridParts["HeaderCells"];
            var bdy_cols = gridParts["BodyCols"];
            var length = hdr_cols.length;
            
            var isGroupChild=Global.BindingEngine.Controls[ctrl.id].IsGroupChild;
            var newWidth,adjust,colWidth;

            for (var ii = 0, o; o = bdy_cols[ii]; ii++)
            {
				var adjust = ((noSBFlg) && (ii == length - 1) ? 2 : isGroupChild?1:0);
                var newWidth = (o.offsetWidth - 4) + adjust;
 		        colWidth = parseInt(o.style.width);

                if(!BrowserSniffer.Safari13 && !BrowserSniffer.FireFox15 && !isNewIE)
				{
					if (hdr_cols[ii].style.display != "none")
					{
					    if (newWidth > 0)
						    hdr_cols[ii].style.width = newWidth + 'px';
						else if (colWidth > 0) 
				        	hdr_cols[ii].style.width = (colWidth-1) + "px";
			        }
			    }
				else
				{
					if (hdr_cols[ii].style.display != "none")
						hdr_cols[ii].style.width = parseInt(o.style.width)-4  + 'px';
				}				
            }
        }

        gridParts["HeaderTable"].style.width = hdr.style.width = bdy.clientWidth + "px";
        
        if(isHidden) bdy.style.display="none";
        gridParts["Init"] = false;
    }
}
EpiGrid.prototype.HiliteRow=function(ctrl,row,shiftKey,ctrlKey) 
{  
    var prevRowIdx=-1;
    var gridParts = this._getGridParts(ctrl);
    obj = gridParts["BodyTable"];
    
    var activeRow = this.get_ActiveRowObject(ctrl);
    
    if(!activeRow)
    {
        shiftKey = false;
        ctrlKey = false; 
    }
    else
    {
        prevRowIdx=activeRow.ListIndex;
    }
    var shiftLower, shiftUpper;
    if(shiftKey)
    {
        var frstSelRow = this.KeySelectedRows[0];
        if(frstSelRow > row) 
        {
            shiftLower = row;
            shiftUpper = frstSelRow;
        }
        else
        {
            shiftLower = frstSelRow;
            shiftUpper = row;
        }
    }

    for(var ii=0; ii<=obj.rows.length-1; ii++)
    {
        var isSummary=obj.rows[ii].getAttribute("summary")=="true";
        if(ctrlKey)
        {
            if(ii==row)
            {
                if(obj.rows[ii].className=="selected" && obj.rows[ii]!=activeRow && !isSummary)
                    obj.rows[ii].className = (ii&1)?"odd":"even";
                else
                {
                    obj.rows[ii].className = "selected";
                    this.set_ActiveRowObject(obj.rows[ii]);
                    
                    if (!this.KeySelectedRows)
                        this.KeySelectedRows = new ArrayList();
                    this.KeySelectedRows.Add(ii);
                }
            }
        }
        else if(shiftKey)
        {
            if(ii>=shiftLower && ii<=shiftUpper)
            {
                obj.rows[ii].className = "selected";
                this.set_ActiveRowObject(obj.rows[ii]);
                
                if (!this.KeySelectedRows)
                    this.KeySelectedRows = new ArrayList();
                this.KeySelectedRows.Add(ii);
            }
            else if(!isSummary)
            {
                obj.rows[ii].className = (ii&1)?"odd":"even";
            }
        }
        else if (this.MultiRowSelect == false) // SingleSelect
        {
            if(ii==row)
            {
                obj.rows[ii].className = "selected";
                this.set_ActiveRowObject(obj.rows[ii]);
            }
            else if(!isSummary)
                obj.rows[ii].className = (ii&1)?"odd":"even";
        }
        else if (this.MultiRowSelect == true)
        {
            // Retain the selection state of the rows
            if(ii==row)
            {
                obj.rows[ii].className = "selected";
                this.set_ActiveRowObject(obj.rows[ii]);
                
            }
            else if ((!this.KeySelectedRows || !this.KeySelectedRows.Contains(ii)) && !isSummary)
            {
                obj.rows[ii].className = (ii&1)?"odd":"even";
            }
        }
    }

    this.ActiveRow.ListIndex = row;
    
    if(prevRowIdx!=row) this.get_Event("ActiveRowChanged").fire(this,{"Row":row});
}
EpiGrid.prototype.SelectAll=function(ctrl)
{
    if(this.MultiRowSelect)
    {
        var gridParts = this._getGridParts(ctrl);
        obj = gridParts["BodyTable"];
        
        for(var ii=0; ii<=obj.rows.length-1; ii++)
        {
            obj.rows[ii].className = "selected";
        }
    }
}
EpiGrid.prototype.get_RowCount=function()
{
    var ctrl = document.getElementById(this.ID);
    return this.GetRowCount(ctrl);
}
EpiGrid.prototype.GetRowCount=function(ctrl)
{
    if (!ctrl) 
        ctrl = Global.document.getElementById(this.ID);
    var obj = Global.GridManager.Grids[ctrl.id] = this._getGridParts(ctrl);
    
    // If the grid has not yet been bound, go ahead and bind it.
    if(obj["BodyTable"].tBodies[0].rows.length==0||
        (obj["BodyTable"].tBodies[0].rows.length==1&&obj["BodyTable"].tBodies[0].rows[0].cells.length==0))
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        if(dv&&dv.dataView&&dv.dataView.Rows.length>0) 
        {
            this.Bind(Global.BindingEngine, ctrl, dv, dv.Row, true);
            obj = Global.GridManager.Grids[ctrl.id] = this._getGridParts(ctrl);
        }
    }

    var tbl = obj["BodyTable"];
    var len = tbl.rows.length;
    if(len==1 && tbl.rows[0].cells.length==0) len = 0;  // If not bound yet, there is a dummy row.
    
    return len; 
}
EpiGrid.prototype.Clear=function(ctrl)
{
    var bdy = ctrl.getElementsByTagName("div")[2];
    var bdy_tbl = bdy.getElementsByTagName("table")[0];
    var tbody = bdy_tbl.tBodies[0];
    
    while(tbody.rows.length>0)
    {   
        Global.Purge(tbody.rows[0]);
        tbody.deleteRow(0);
    }   
}
EpiGrid.prototype.ClearAll=function(ctrl)
{
    var gridParts = this._getGridParts(ctrl);


  
    var emptyHdrTable = "<table cellspacing='0' cellpadding='0' style='width:10px'><tbody><tr></tr></tbody></table>";
    gridParts["Header"].innerHTML = emptyHdrTable;
    
    var emptyTbl = "<div style='height:0px;'></div><table cellpadding='0' cellspacing='0' style='width:10px'><colgroup></colgroup><tbody><tr></tr></tbody></table><div style='height:0px;'></div>";
    gridParts["Body"].innerHTML = emptyTbl;
    
    this._columns = {};
    this.IsEmpty = true;
    delete Global.GridManager.Grids[ctrl.id];
}
EpiGrid.prototype.FindGridControl=function(ctrl, row, tdName)
{
    var divObj = null;
    var gridParts = this._getGridParts(ctrl);
    tbl = gridParts["BodyTable"];

    if(tbl.tBodies[0].rows.length > row)
    {   
        var ii=0;
        for(var o in this._columns)
        {
            var obj = Global.BindingEngine.Controls[this._columns[o]];
            if(obj["ID"]==tdName)
            {
                var theCell = tbl.tBodies[0].rows[row].cells[ii];
                if(theCell) 
                {
                    var divs =  theCell.getElementsByTagName("div");
                    if(divs.length>0) divObj = divs[0];
                }
                return divObj;
            }
            ii++;
        }
        
        for(var jj=0;jj<=tbl.tBodies[0].rows[row].cells.length-1;jj++)
        {
            var cell = tbl.tBodies[0].rows[row].cells[jj];
            var divs = cell.getElementsByTagName("div");
            if(divs.length>0 && divs[0].id==tdName)
            {
                return divs[0];
            }
        }

    }  
    return null;
}

EpiGrid.prototype.SetDataColumnValue=function(ctrl, dv, dc, row)
{
    var gridParts = this._getGridParts(ctrl);
    tbl = gridParts["BodyTable"];

    if(tbl.tBodies[0].rows.length > row)
    {   
        var ii=0;
        for(var o in this._columns)
        {
            var obj = Global.BindingEngine.Controls[this._columns[o]];
            if(obj["DataColumn"]==dc)
            {
                var td = tbl.tBodies[0].rows[row].cells[ii];
                if(td)
                {
                    var children = td.getElementsByTagName("*");
                    if(children.length > 0)
                    {
                        obj.SetValue(children[0], dv.dataView.GetRowValue(dv.dataView.Rows[row], dc));
                        
                        if(children.length>1)
                            obj.SetValue(children[1], dv.dataView.GetRowValue(dv.dataView.Rows[row], dc));
                    }
                }
            }
            ii++;
        }
        this.RefreshProperties(ctrl, dv, row);
    }  
}
EpiGrid.prototype.Bind = function(bEngine, ctrl, dv, rowNum, skipGlobalRebind)
{
	if (!this.PropsApplied) this._applyProps(ctrl);

	if((bEngine.RowChangeDV!=dv.ViewName)||(bEngine.updatingChildren>0))
	{
	    if(this.GroupByColumns.length>0&&this.GroupGrid) 
	    {
	        this.GroupGrid.Bind();
	        return;
	    }

		this.get_Event("BeforeBind").fire();
		
		this._refreshViewImages(ctrl, dv);

		var gridParts = this._getGridParts(ctrl);
		
		var currentRow = this.Row;
		var dvNodes = dv.dataView.Rows;

		if(dv.dataView.Table.DataSet && dv.dataView.Table.DataSet.CacheInfo && dv instanceof FilteredBAQDataView)
		{
		    dv.PrepForPaging();
		    try
		    {
                Global.GetCachedDS(dv.dataView,0,gridParts["PageSize"]*5,dv.dataView.ServerFilter,[this]);
		    }
            catch(err)
            {
                return;
            }
		}

		if (!this.IsEmpty && dvNodes.length == gridParts["BodyTable"].rows.length && dvNodes.length > 0 &&
		        gridParts["HeaderCells"].length==gridParts["BodyCells"].length)
		{
			for (var ii = 0, o; o = dvNodes[ii]; ii++)
			{
				var gridRow = gridParts["BodyTable"].rows[ii];
				for (var jj = 0, c; c = gridRow.cells[jj]; jj++)
				{
					if (c.childNodes.length > 0)
					{
						var itm = c.childNodes[0];

						var obj = Global.BindingEngine.Controls[itm.id];
						if (obj && (obj.DataView == dv.ViewName||this.IsGroupChild) && obj.DataColumn)
						{
							if (obj instanceof EpiComboBox)
								Global.BindingEngine.Controls[itm.id].SetValue(itm, o[obj.DataColumn], o[obj.DescColumn]);
							else
								Global.BindingEngine.Controls[itm.id].SetValue(itm, o[obj.DataColumn]);
						}
					}
				}
				// fire initializeRow
			}
			this.IsEmpty = false;
		}
		else
		{
			this._fillColumns(dv);
			if (dv.dataView.Table && dv.dataView.Table.TableName == "Results") this._setCaptions(dv, gridParts);

            var tableArr=this._buildGrid(gridParts,dv);

			Global.Purge(gridParts["Body"]);
			gridParts["Body"].innerHTML = tableArr.join("");
		}

		//reset
		delete Global.GridManager.Grids[this.ID];
		gridParts = this._getGridParts(ctrl);

		if (bEngine.CurrentTab)
			bEngine.RegisterGrid(bEngine.CurrentTab.id, this.DataView, ctrl);
		else
			bEngine.RegisterGrid("div_TopLevelPanel", this.DataView, ctrl);

		// Row Rules
		var rows = gridParts["Body"].getElementsByTagName("table")[0].tBodies[0].rows;
		if (!this.AllowUpdate) Global.BindingEngine.IsBindingReadOnlyGrid = true;
		for (var ii = 0, o; o = rows[ii]; ii++)
		{
			this.RefreshProperties(ctrl, dv, ii);
		}
		Global.BindingEngine.IsBindingReadOnlyGrid = false;

		var hilite = rowNum;
		if (dvNodes.length > currentRow) hilite = currentRow;
		if (this.KeySelectedRows && (rowNum < 0 || !this.KeySelectedRows.Contains(hilite)))
		{
			this.KeySelectedRows.Clear();
		}
		this.HiliteRow(ctrl, rowNum);
				
		if (this.noSubsForInitLayout && this.get_Event("InitializeLayout").subscribers.length > 0)
		{
		    this.get_Event("InitializeLayout").fire(this,new InitializeLayoutEventArgs(this));
            this.noSubsForInitLayout=false;
        }
        
        if(this._hasSummariesShown) this._refreshSummaries(true);
        
        this.FixSize(ctrl);   
        this.ResizeColumns(ctrl);
        //this.ResizeColumns(ctrl);
		// tgc- hack to make sure columns and headers line up.
		// the following causes search grid columns to squish in IE and FF
		//if (BrowserSniffer.Safari13) 
		
		if(ctrl.style.display!="none") this._sizeBodyColumns(gridParts, 0);
	}

	this.ApplySettings();
    this.processLinkedColumns();
	return true;
}
EpiGrid.prototype.GetPageSize=function()
{
    var pageSize=-1;
    if(Global.Form instanceof EpiHostForm|| Global.Form.ID=="EpiZoneForm")
    {
        var ctrl = Global.document.getElementById(this.ID);
        var gridParts = this._getGridParts(ctrl);
        pageSize=gridParts["PageSize"];
    }
    return pageSize;    
}
EpiGrid.prototype._buildGrid=function(gridParts,dv)
{
    var cacheInfo=null;
    var ds=dv.dataView.Table.DataSet;
    if(ds&&ds.CacheInfo&&ds.CacheInfo.Views&&ds.CacheInfo.Views[dv.ViewName])
        cacheInfo=ds.CacheInfo.Views[dv.ViewName];
    else if(ds&&ds.CacheInfo)
        cacheInfo=ds.CacheInfo;

    var dvNodes = dv.dataView.Rows;
    var cnt=dvNodes.length;
    
	var tableArr = [];
    
    tableArr.push("<div style='height:0px;'></div>");
	tableArr.push("<table cellpadding='0' cellspacing='0' style='width:10px'><colgroup>");
	tableArr.push(gridParts["BodyColGroup"].innerHTML);
	tableArr.push("</colgroup><tbody>");

	var ctrlStruct = Global.BindingEngine.Controls;

    var pageSize=gridParts["PageSize"];
        
	var start=0;
	var end=cnt;
	
    if((Global.Form instanceof EpiHostForm|| Global.Form.ID=="EpiZoneForm")&&pageSize>0&&cnt>gridParts["PageSize"]*3 &&
        (dv instanceof BAQDataView||dv instanceof FilteredBAQDataView) && !dv.get_IsUpdatable())
    {
        end=pageSize*3;
        this.HasPaging=true;
    }
    else
    {
        this.HasPaging=false;
    }

    for(var ii=start;ii<=end-1;ii++)
	{
	    var o=dvNodes[ii];
		tableArr.push("<tr _idx='" + ii + "' class='" + ((ii & 1) ? "odd" : "even") + "'>");

		var idx = 0;
		for (var o2 in this._columns)
		{
			var ctrlName = this._columns[o2];
			var obj = ctrlStruct[ctrlName];

			if (obj)
			{
				if (dv.viewImageColumns != null && obj.DataColumn && dv.viewImageColumns.items[obj.DataColumn] && obj.TypeName != "EpiPictureBox")
				{
					obj = Global.BindingEngine.Controls[ctrlName] = new EpiPictureBox({ "ID": ctrlName,
						"EpiHideControl": false, "DV": obj.DataView, "DC": obj.DataColumn, "InG": true});
				}
				tableArr.push("<td");
                if (obj._hasEpizone(dv.dataView.Table)) tableArr.push(" class='Infozone'");
				tableArr.push(">" + obj.GetHtmlForGrid(ctrlName, o, dv.dataView.Table) + "</td>");

				obj.OwnerGrid = this.ID;

				if (ii == 0) obj.Index = idx++;
			}
		}
		tableArr.push("</tr>");
	}

	this.IsEmpty = false;
	if (ii == 0)
	{
		tableArr.push("<tr></tr>");
		this.IsEmpty = true;
	}
	
    tableArr.push("</tbody></table>");

	this.HasPaging=this._hasPaging(gridParts["Grid"]);
	if(this.HasPaging)
	{
	    if(cacheInfo&&cacheInfo.Views&&cacheInfo.Views[dv.ViewName])
	    {
	        if(cacheInfo.Views[dv.ViewName].RowCount>cnt) cnt=cacheInfo.Views[dv.ViewName].RowCount;
	    }
	    else if(cacheInfo&&cacheInfo.RowCount>cnt) cnt=cacheInfo.RowCount;
	
	    var ht=(cnt-end)*18;
        tableArr.push("<div style='height:"+ht+"px;'></div>");
	}
    
    return tableArr;
}
EpiGrid.prototype._moveRow=function(table, from, to)
{
    var tbody = table.tBodies[0]; // Use tbody
    var trFrom = tbody.rows[from]; // Make sure row stays referenced
    tbody.removeChild(trFrom); // Remove the row before inserting it (dupliate id's etc.)
    var trTo = tbody.rows[to];
    if(trTo)
        tbody.insertBefore(trFrom, trTo);
    else    
        tbody.appendChild(trFrom);
  
    return trFrom;
}

EpiGrid.prototype._page=function(ctrl,force)
{
    if(!this.HasPaging) return;

    var gridParts=this._getGridParts(ctrl);
    var pageSize=gridParts["PageSize"];
    var scrollTop=gridParts["Body"].scrollTop;
    var scrollHeight=gridParts["Body"].scrollHeight;
    
    var dv=Global.BindingEngine.EpiDataViews[this.DataView];
    var rows=dv.dataView.Rows;
    
    var rowCnt=rows.length;
    
    // Get the first row that should be displayed in the grid.
    var dsRowCnt,dsTopRow,dsTopIdx=0,dsBottomIdx,dvStart,dvEnd;
    var ds = dv.dataView.Table.DataSet;
    
    var topRow=Math.floor((scrollTop/scrollHeight)*rowCnt);
    if(scrollTop==0) topRow=0;
    
    var cacheInfo=null;
    if(ds&&ds.CacheInfo&&ds.CacheInfo.Views&&ds.CacheInfo.Views[dv.ViewName])
        cacheInfo=ds.CacheInfo.Views[dv.ViewName];
    else if(ds&&ds.CacheInfo)
        cacheInfo=ds.CacheInfo;

    if(cacheInfo&&cacheInfo.RowCount>rows.length)
    {
        dvStart=cacheInfo.Start;
        dvEnd=cacheInfo.End;
    
        dsRowCnt=cacheInfo.RowCount;
        dsTopRow=Math.floor(((scrollTop+17)/scrollHeight)*dsRowCnt);
        if(scrollTop==0) dsTopRow=0;

        dsTopIdx=0;
        if(dsTopRow-pageSize>0) dsTopIdx=dsTopRow-pageSize;
        dsBottomIdx = dsTopIdx+(pageSize*3)-1;
        if(dsBottomIdx>dsRowCnt-1) dsBottomIdx=dsRowCnt-1;
        
        if(dsTopIdx>0&&(dsTopRow>=dsRowCnt-(pageSize*3))) dsTopIdx=(dsRowCnt-(pageSize*4));
        
        topRow = dsTopRow-dvStart;
    }

    // Find the first row that is generated in the grid.
    var topIdx=0;
    if(topRow-pageSize>0) topIdx=topRow-pageSize;
    if(topIdx>0&&(topRow>rowCnt-(pageSize*2))) topIdx=(rowCnt-(pageSize*3));
    
    // Find the last row that is generated
    var bottomIdx = topIdx+(pageSize*3)-1;
    
    // possibly need to do a round trip
    if((cacheInfo&&cacheInfo.RowCount>rows.length)||(rowCnt==0&&dsRowCnt>0)||this._pageSize!=pageSize)
    {
        // topIdx<pageSize --> Generated rows are moving in to the top cushion
        // bottomIdx>(pageSize*4-1) --> Generated rows are moving in to the bottom cushion
        if(this._pageSize&&this._pageSize!=pageSize||(rowCnt==0&&dsRowCnt>0)||((dvStart!=dsTopIdx-pageSize) && (topIdx<pageSize&&dvStart>0 || (bottomIdx>(pageSize*4-1)&&cacheInfo.RowCount>bottomIdx))))
        {
            var filter=this.GroupFilter?this.GroupFilter:"";
            if(dv.dataView.ServerFilter) 
            {
                if(filter!="") filter+=" AND ";
                filter+=dv.dataView.ServerFilter;
            }
            if(filter=="") filter=null;
        
            try
            {
                Global.GetCachedDS(dv.dataView,dsTopIdx-pageSize,pageSize*5,filter,Global.BindingEngine.GridsByView[dv.ViewName]);
                
                if((rowCnt==0&&dsRowCnt>0)||this._pageSize&&this._pageSize!=pageSize)
                {
                    this._pageSize=pageSize;
                    this.Bind(Global.BindingEngine,ctrl,dv);
                    var me = this;
                    setTimeout(function(){me._page(ctrl);}, 10);
                }
                else
                {
                    this._page(ctrl,true);
                }
            }
            catch(err) 
            {
                this._page(ctrl);
            }
            
            return;
        }
    }
 
    var tbl=gridParts["BodyTable"];
    var currRowIdx=(tbl.rows.length > 0)? Convert.ToInt32(tbl.rows[0].getAttribute("_idx")): -1;
    var lastRowIdx=(tbl.rows.length > 0)?Convert.ToInt32(tbl.rows[tbl.rows.length-1].getAttribute("_idx")):-1;
    if(currRowIdx!=topIdx||force)
    {
        var idx=topIdx;
        for(var ii=0;ii<=tbl.rows.length-1;ii++)
        {
            var gridRow = tbl.rows[ii];
            var o=rows[idx];
			for (var jj = 0, c; c = gridRow.cells[jj]; jj++)
			{
				if (c.childNodes.length > 0)
				{
					var itm = c.childNodes[0];

					var obj = Global.BindingEngine.Controls[itm.id];
					if (obj && obj.DataView == dv.ViewName && obj.DataColumn)
					{
						if (obj instanceof EpiComboBox)
							Global.BindingEngine.Controls[itm.id].SetValue(itm, o[obj.DataColumn], o[obj.DescColumn]);
						else
							Global.BindingEngine.Controls[itm.id].SetValue(itm, o[obj.DataColumn]);
					}
				}
			}
			gridRow.setAttribute("_idx",idx);
			idx++;
		}
		
	    if(!gridParts["TopPad"])
        {
            gridParts["TopPad"]=Global.document.createElement("DIV");
            gridParts["Body"].insertBefore(gridParts["BodyTable"]);
        }
		
		var bottomPadHt=0;
		if(topIdx<0) topIdx=0;
	    if(cacheInfo&&cacheInfo.RowCount>rows.length&&topIdx>0)
        {
            gridParts["TopPad"].style.height=(dvStart+topIdx)*18 + "px";
            bottomPadHt=(dsRowCnt-dsBottomIdx-1)*18;
        }
        else
        {
        gridParts["TopPad"].style.height=topIdx*18 + "px";
            bottomPadHt=(rowCnt-bottomIdx-1)*18;
   }
        
        if(bottomPadHt<=0)
        {
            if(gridParts["BottomPad"]) gridParts["BottomPad"].parentNode.removeChild(gridParts["BottomPad"]);
        }
        else
        {
            if(!gridParts["BottomPad"])
            {
                gridParts["BottomPad"]=Global.document.createElement("DIV");
                gridParts["Body"].appendChild(gridParts["BottomPad"]);
            }
            gridParts["BottomPad"].style.height=bottomPadHt+"px";
        }
   }
   this._pageSize=pageSize;
}
EpiGrid.prototype._fillRow=function(dv,gridRow,o)
{
	for (var jj = 0, c; c = gridRow.cells[jj]; jj++)
	{
		if (c.childNodes.length > 0)
		{
			var itm = c.childNodes[0];

			var obj = Global.BindingEngine.Controls[itm.id];
			if (obj && obj.DataView == dv.ViewName && obj.DataColumn)
			{
				if (obj instanceof EpiComboBox)
					Global.BindingEngine.Controls[itm.id].SetValue(itm, o[obj.DataColumn], o[obj.DescColumn]);
				else
					Global.BindingEngine.Controls[itm.id].SetValue(itm, o[obj.DataColumn]);
			}
		}
	}
}
EpiGrid.prototype.ResizeHdrAndBody = function(ctrl)
{
	this.ResizeColumns(ctrl);
	var gridParts = this._getGridParts(ctrl);
	this._sizeBodyColumns(gridParts, 0);
}
EpiGrid.prototype._refreshViewImages=function(ctrl, dv)
{
    if (dv.droppedImageColumns != null) 
    {
        var gridParts = this._getGridParts(ctrl);
        for(var oDropCol in dv.droppedImageColumns.items)
        {
            var colName = dv.droppedImageColumns.items[oDropCol];
            if (!dv.HasViewImageColumn(colName) && this._columns[colName])
            {
                var idx = this._getColumnIndex(colName);
                var hdrRow = gridParts["HeaderTable"].tBodies[0].rows[0];
                
                Global.Purge(hdrRow.cells[idx]);
                hdrRow.removeChild(hdrRow.cells[idx]);
                
                var colGrp = gridParts["BodyColGroup"];
                Global.Purge(colGrp.childNodes[idx]);
                colGrp.removeChild(colGrp.childNodes[idx]);
                
                delete this._columns[colName];
            }
        }
    }
    
    if(dv.viewImageColumns!=null)
    {
        for(var oNewCol in dv.viewImageColumns.items)
        {
            var viewImageColumn = dv.viewImageColumns.items[oNewCol];
            if (!this._columns[viewImageColumn.columnName])
            {
                var colName = "col" + viewImageColumn.columnName + this.ID
            
                this._addColumnUI(ctrl, viewImageColumn.columnName, 25, viewImageColumn.caption, viewImageColumn.visibleIndex);
                
                var newCol = new EpiPictureBox({"ID":colName, "EpiHideControl":false,
                        "DV":dv.ViewName, "DC":viewImageColumn.columnName, "InG":true});
                        
                Global.BindingEngine.Controls[colName] = newCol;
            }
        }
    }
}
EpiGrid.prototype._setColHeaderCaption=function(col, caption)
{
    var idx=this._getColumnControlIndex(col);
    if (idx < 0) return;
    
    var ctrl = Global.document.getElementById(this.ID);
    var gridParts = this._getGridParts(ctrl);
    var headerCells = gridParts["HeaderCells"];
    headerCells[idx].getElementsByTagName("label")[0].innerHTML = caption;
}
EpiGrid.prototype._getColHeaderCaption=function(col)
{
    var idx=this._getColumnControlIndex(col);
    if (idx < 0) return;
    
    var ctrl = Global.document.getElementById(this.ID);
    var gridParts = this._getGridParts(ctrl);
    var headerCells = gridParts["HeaderCells"];
    return headerCells[idx].getElementsByTagName("label")[0].innerHTML;
}
EpiGrid.prototype._getColumnValue=function(row, col)
{
    var idx = this._getColumnIndex(col);
    var cellCtrl = row.cells[idx].childNodes[0];
    if(cellCtrl)
    {
        return Global.BindingEngine.Controls[cellCtrl.id].GetValue(cellCtrl);
    }
}
EpiGrid.prototype._getColumnIndex=function(col)
{
    var ii=0;
    for(var o in this._columns)
    {
        if(o==col) return ii;
        ii++;
    }
}
EpiGrid.prototype.RefreshProperties=function(ctrl,dv,row)
{
    var gridParts = this._getGridParts(ctrl);

    var oRow = gridParts["BodyTable"].rows[row];
    if(oRow)
    {
        for(var ii=0, o; o=oRow.cells[ii]; ii++)
        {
            if(o.childNodes.length>0)
            {
                var itm = o.childNodes[0];
                if(itm.nodeName=="DIV" || (itm.nodeName=="INPUT" && itm.type=="checkbox"))
                {
                    Global.BindingEngine.Controls[itm.id].RefreshProperties(itm, dv, row);
                }
            }
        }
        if(Global.Form.Name=="SelectionCriteriaForm")  // Fulfillment Workbench Filter
        {
            this.get_Event("InitializeRow").fire(this,{"Row": new UltraGridRow(this, oRow.rowIndex)}); 
        }
    }
}
EpiGrid.prototype._findRelatedVisibleColumn=function(currCol,relation)
{
    var ctrl = Global.document.getElementById(this.ID);
    var gridParts = this._getGridParts(ctrl);
    var hdr_cols = gridParts["HeaderCells"];
    
    if (hdr_cols.length == 0) return null;
    
    var fndIndx = -1,startIndx=0;
    var fwd = (relation==VisibleRelation.First || relation==VisibleRelation.Next)? true: false;
    switch (relation)
    {
        case VisibleRelation.First:
            fwd = true;
            startIndx=0;
            break;
        case  VisibleRelation.Next:
            fwd = true;
            startIndx=currCol.Index + 1;
            break;
        case VisibleRelation.Last:
            fwd = false;
            startIndx=hdr_cols.length -1;
            break;
        case VisibleRelation.Previous:
            fwd = false;
            startIndx=(currCol.Index>0)? currCol.Index-1:currCol.Index
            break;
    }
    var ii = startIndx;
    var o;
    while (true)
    {
        o = hdr_cols[ii];
        if (!o) break;
        
        if (o.style.display == "")
        {
            fndIndx = ii;
            break;
        }
        
        if (fwd) ii++;
        else i--;
    }

    if (fndIndx == -1) return null;
    else
    {
        var ii=0;
        for(var key in this._columns)
        {
            if (ii == fndIndx)
            {
                var col = Global.GetGridColumn(this._columns[key]);
                col.set_SortIndicator(Infragistics.Win.UltraWinGrid.SortIndicator.None);
                col.Key = key;
                return col;
            }
            ii++;
        }
    }
    
}
EpiGrid.prototype.FocusFirstVisibleColumn=function()
{
    var ctrl = Global.document.getElementById(this.ID);
    var gridParts = this._getGridParts(ctrl);
    var rows = gridParts["BodyTable"].rows;
    if(rows.length>0)
    {
        var oRow = this.get_ActiveRowObject(ctrl);
        if(!oRow) oRow = rows[rows.length-1];
        
        for(var ii=0, o; o=oRow.cells[ii]; ii++)
        {
            var itm = o.childNodes[0];
            if(itm.getAttribute("_disabled")!="true" && !(itm.nodeName=="INPUT" && itm.type=="checkbox" && itm.disabled==true))
            {
                Global.BindingEngine.Controls[itm.id].FocusInGrid(itm);
                return;
            }
        }
    }
}
EpiGrid.prototype.set_ActiveCell=function(val)
{
    var ctrl = Global.document.getElementById(this.ID);
    var gridParts = this._getGridParts(ctrl);
    var rows = gridParts["BodyTable"].rows;
    if(rows.length>0)
    {
        var oRow = this.get_ActiveRowObject(ctrl);
        if(!oRow) oRow = rows[rows.length-1];
        
        for(var ii=0, o; o=oRow.cells[ii]; ii++)
        {
            if(o.childNodes.length>0 && o.childNodes[0].id==val.ID)
            {
                var itm = o.childNodes[0];
                if(itm.getAttribute("_disabled")!="true" && !(itm.nodeName=="INPUT" && itm.type=="checkbox" && itm.disabled==true))
                {
                    Global.BindingEngine.Controls[itm.id].FocusInGrid(itm);
                }
                return;
            }
        }
    }
}
EpiGrid.prototype._sizeBodyColumns = function(gridParts, idx)
{ // In the future see about rolling this into ResizeColumns.... similar code.
    var bdy = gridParts["Body"];
    var bdy_tbl = gridParts["BodyTable"];
    var hdr = gridParts["Header"];
    var hdr_cols = gridParts["HeaderCells"];

	var aCols = gridParts["BodyCols"];
	var length = aCols.length;
	var noSBFlg = ((bdy.offsetWidth - bdy_tbl.clientWidth) == 2);
	var adjust;

    var htWidth=gridParts["HeaderTable"].offsetWidth;
    if(htWidth==0) htWidth=gridParts["BodyColGroup"].offsetWidth;
    if(htWidth==0) return;
    
    var ieHasRow=Global.document.all&&((bdy_tbl.rows.length==1&&bdy_tbl.rows[0].cells.length>0)||bdy_tbl.rows.length>1);
    
    gridParts["BodyTable"].style.width=htWidth+"px";

    if(gridParts["Init"]==false)
	{
	    //this.ResizeColumns(Global.document.getElementById(this.ID)); // SCR #66472
	    for(var ii=0, o; o=aCols[ii]; ii++)
	    {
	        adjust = (ieHasRow?3:0) - (((noSBFlg && ii) == (length - 1))?2:0);
    		    
	        if(o.style.display!="none") 
	        if (BrowserSniffer.IEVersion > 7 && BrowserSniffer.ieBrowserMode != "Compat Mode")
	            o.style.width = hdr_cols[ii].offsetWidth + 'px';
	         else
	            o.style.width = (hdr_cols[ii].offsetWidth >= adjust)? hdr_cols[ii].offsetWidth - adjust + 'px': hdr_cols[ii].offsetWidth + 'px';
	    }
	    gridParts["Init"]=true;
    }
    else
    {
        adjust = (((Global.document.all)?3:0)) - (((noSBFlg && idx) == (length - 1))?2:0);
        
        if(hdr_cols[idx].style.display=="none")
        {           
            this._sizeBodyColumns(gridParts, idx-1);
        }
        else
        {
            if (BrowserSniffer.IEVersion > 7 && BrowserSniffer.ieBrowserMode != "Compat Mode")
                aCols[idx].style.width = hdr_cols[idx].offsetWidth + 'px'; 
            else
                aCols[idx].style.width = (hdr_cols[idx].offsetWidth >= adjust) ? hdr_cols[idx].offsetWidth - adjust + 'px' : hdr_cols[idx].offsetWidth + 'px';
        }
    }
}
EpiGrid.prototype._setGridState=function(container, state, target, startX)
{
    Global.GridManager.Control = container;
    Global.GridManager.State = state;
    Global.GridManager.Target = target;
    Global.GridManager.StartX = startX;
    
    var hdr = container.getElementsByTagName("div")[1];
    if(hdr)
    {
        if(state==GridState.HoverEdge)
            hdr.style.cursor = "e-resize";
        else if(state==GridState.Resize)
            hdr.style.cursor = "e-resize";
        else if(state==GridState.Default)
            hdr.style.cursor = "default";
    }
}
EpiGrid.prototype._getGridParts=function(ctrl)
{
    var parts = Global.GridManager.Grids[ctrl.id];

    if(!parts)
    {
        parts = [];
        parts["Grid"]=ctrl;
        parts["Caption"] = ctrl.getElementsByTagName("div")[0];

        if(Global.NextNode(parts["Caption"]).className=="EpiGrid-Grp")
        {
            parts["GroupBy"]=Global.NextNode(parts["Caption"]);
            parts["Header"]=Global.NextNode(parts["GroupBy"]);
            parts["GroupByLbl"] = parts["GroupBy"].getElementsByTagName('label')[0];
        }
        else
        {
            parts["Header"]=Global.NextNode(parts["Caption"]);
        }
        parts["Body"]=Global.NextNode(parts["Header"]);
        parts["BodyGroup"]=Global.NextNode(parts["Body"]);
        parts["HeaderTable"] = parts["Header"].getElementsByTagName("table")[0];
        parts["BodyTable"] = parts["Body"].getElementsByTagName("table")[0];
        parts["TopPad"] = Global.PrevNode(parts["BodyTable"]);
        parts["BottomPad"] = Global.NextNode(parts["BodyTable"]);
        parts["HeaderCells"] = parts["HeaderTable"].tBodies[0].rows[0].getElementsByTagName("td");
        parts["BodyColGroup"] = parts["BodyTable"].getElementsByTagName('colgroup')[0];
        parts["BodyCols"] = parts["BodyColGroup"].getElementsByTagName('col');
        parts["ActiveRow"] = null;
        parts["Init"] = false;
    }

    parts["BodyCells"] = [];
    if(parts["BodyTable"].tBodies[0]&&parts["BodyTable"].tBodies[0].rows.length>0)
    {
        parts["BodyCells"] = parts["BodyTable"].tBodies[0].rows[0].cells; // SCR 79376
    }

    if (parts["ActiveRow"] == null && Global.BindingEngine.EpiDataViews[this.DataView] && Global.BindingEngine.EpiDataViews[this.DataView].get_Row() >= 0)
        parts["ActiveRow"] = parts["BodyTable"].rows[Global.BindingEngine.EpiDataViews[this.DataView].get_Row()];
        
    var bodyHeight=parts["Body"].offsetHeight;
    if(bodyHeight-17>0)
        parts["PageSize"]=Math.floor((bodyHeight)/18);
    else
    {
        if(ctrl.offsetHeight-17>0)
            parts["PageSize"]=Math.floor((ctrl.offsetHeight)/18);
    else
        parts["PageSize"]=-1;
    }
    
    Global.GridManager.Grids[ctrl.id] = parts;
    
    return parts;
}
EpiGrid.prototype._scroll=function(e)
{
    var ctrl = e.target||e.srcElement;
    this.get_Event("BodyScroll").fire(this, e);
    
    var container = ctrl.parentNode;
    var parts=this._getGridParts(container);
    var hdr = parts["Header"];
    hdr.scrollLeft = ctrl.scrollLeft;
    
    if(this.HasPaging) this._page(ctrl.parentNode);
}
EpiGrid.prototype._hdrmousedown = function(e)
{
    var ctrl = e.target || e.srcElement;
    var hdr = Global.GetParentByTag(ctrl, "DIV", false);
    var grd = Global.GetParentByTag(hdr, "DIV", true);

    if (Global.GridManager.State == GridState.HoverEdge)
    {
        var pageX = 0;
        if (e.pageX)
            pageX = e.pageX + hdr.scrollLeft;
        else if (e.x)
            pageX = e.x + Global.GetPosition(grd).x + 1 + hdr.scrollLeft;

        this._setGridState(grd, GridState.Resize, Global.GridManager.Target, pageX);

        EpiEventManager.addListener(grd, "mousemove", this._mousemove, this, true);
    }
    else if (Global.GridManager.State == GridState.Default)
    {
        var source = e.srcElement || e.target;
        if(source.tagName=="TD")
            source = source.getElementsByTagName("label")[0];

        if(source.tagName!="A")
        {
            Global.GridManager.State = GridState.ReadyToDrag;
            EpiEventManager.addListener(Global.document.getElementById(this.ID), "mousemove", this._mousemove, this, true);

            if (!Global.GridManager.DragObject) this._createMarker();

            var c=Global.GridManager.DragObject.Container;
            Global.GridManager.DragObject.Column = source.nodeName == 'TD' ? source : source.parentNode;
            Global.GridManager.DragObject.Index = Global.BindingEngine.Controls[grd.id]._getHeaderColumnIndex(Global.GridManager.DragObject.Column);

            c.style.backgroundColor = '#eee';
            c.style.border = '1px solid #ccc';
            c.style.cursor = 'move';
            c.style.padding = '4px';
            c.style.textAlign="center";

            if(source.innerHTML!="")
                c.style.width = Global.GetTextSize(source.innerHTML).Width + 2 + "px";
            else
                c.style.width = Math.min(100, parseInt(Global.GridManager.DragObject.Column.style.width)) + 'px';
            
            c.style.height = '12px';
            c.style.zIndex = 2;

            c.innerHTML = source.innerHTML;
        }
    }

    Global.GridManager.DragState=DragState.Header;
    EpiEventManager.addListener(Global.document, "mouseup", this._mouseup, this, true);
	
	if (e && e.preventDefault) {
        e.preventDefault();
    }
    else {
        window.event.returnValue = false;
    }
	return false;
}
EpiGrid.prototype._createMarker=function()
{
    Global.GridManager.DragObject = { Container: document.createElement('DIV'),
        Marker: document.createElement('DIV'),
        Index: -1,
        Column: null,
        Offset: { X: 0, Y: 0 }
    };

    var m=Global.GridManager.DragObject.Marker;

    //m.innerHTML = '⇂';
    m.innerHTML="&darr;";
    m.style.color = '#FF0000';
    m.style.fontSize = '28px';
    m.style.fontWeight="bold";
    m.style.width = '10px';
    m.style.height = '30px';
    m.style.zIndex = 2;
    m.style.display = 'none';
    document.body.appendChild(m);

    Global.GridManager.DragObject.Container.style.display = 'none';
    document.body.appendChild(Global.GridManager.DragObject.Container);
}
EpiGrid.prototype._getGrpByIdx=function(ctrl)
{
    var idx=-1;
    var labels=ctrl.parentNode.getElementsByTagName("label");
    for(var ii=1;ii<=labels.length-1;ii++)
    {
        if(labels[ii]==ctrl) 
        {
            idx=ii-1;
            break;
        }
    }
    return idx;
}
EpiGrid.prototype._grpclick=function(e)
{
    var ctrl = e.target||e.srcElement;   
    var grd = ctrl.parentNode.parentNode;

    var idx=this._getGrpByIdx(ctrl);
    if(idx>-1)
    {
        var gb=this.GroupByColumns[idx];
        gb.Order=gb.Order=="Ascending"?"Descending":"Ascending";
        this._refreshGroupBy();
        this.Bind(Global.BindingEngine, grd, Global.BindingEngine.EpiDataViews[this.DataView], 0);
    }
}

EpiGrid.prototype._grpmousedown=function(e)
{
    var ctrl = e.target || e.srcElement;

    if (Global.GridManager.State == GridState.Default)
    {
        var source = e.srcElement || e.target;
        if(source.className!="EpiGrid-Grp-Col") return;
        var grd = source.parentNode.parentNode;
        
        Global.GridManager.State = GridState.ReadyToDrag;
        EpiEventManager.addListener(grd, "mousemove", this._mousemove, this, true);

        if (!Global.GridManager.DragObject) this._createMarker();

        var found=false;
        var c=Global.GridManager.DragObject.Container;
        var labels=source.parentNode.getElementsByTagName("label");
        for(var ii=1;ii<=labels.length-1;ii++)
        {
            if(labels[ii]==source) 
            {
                found=true;
                Global.GridManager.DragObject.Index=ii-1;
                break;
            }
        }
        if(!found) return;

        c.style.backgroundColor = '#eee';
        c.style.border = '1px solid #ccc';
        c.style.cursor = 'move';
        c.style.padding = '4px';
        c.style.textAlign="center";

        c.style.width = Global.GetTextSize(source.innerHTML).Width + 2 + "px";
        c.style.height = '12px';
        c.style.zIndex = 2;

        c.innerHTML = source.innerHTML;
        
        Global.GridManager.DragState=DragState.GroupBy;
    }

    EpiEventManager.addListener(Global.document, "mouseup", this._mouseup, this, true);
	
	if (e && e.preventDefault) {
        e.preventDefault();
    }
    else {
        window.event.returnValue = false;
    }
	return false;
}
EpiGrid.prototype._hdrmouseout = function(e)
{
    var ctrl = e.target || e.srcElement;
    if (ctrl.tagName == "LABEL") ctrl = ctrl.parentNode;
    if (ctrl.tagName == "TD")
    {
        ctrl.style.backgroundColor = '';

        if (Global.GridManager.DragObject && Global.GridManager.DragObject.Marker)
            Global.GridManager.DragObject.Marker.style.display = 'none';
    }
}
EpiGrid.prototype._grpmouseout = function(e)
{
    if (Global.GridManager.DragObject && Global.GridManager.DragObject.Marker)
        Global.GridManager.DragObject.Marker.style.display = 'none';
}
EpiGrid.prototype._hdrmousemove=function(e)
{    
    var ctrl = e.target||e.srcElement;
    var hdr = Global.GetParentByTag(ctrl, "DIV", false);
    var grd = Global.GetParentByTag(hdr, "DIV", true);
    if (ctrl.tagName == "LABEL") ctrl = ctrl.parentNode;

    if (Global.GridManager.State != GridState.Resize && Global.GridManager.State != GridState.ReadyToDrag && Global.GridManager.State != GridState.Drag)
    {
        if(ctrl.tagName=="TD")
        {
            var colPosition = Global.GetPosition(ctrl);     
             
            var pageX = 0;
            if(e.pageX)
                pageX = e.pageX + hdr.scrollLeft;
            else if(e.x)
                pageX=e.x + Global.GetPosition(grd).x + 1 + hdr.scrollLeft;

            var left = colPosition.x;
            var right = left + ctrl.offsetWidth;
            
            if(Global.FormDir=="rtl")
            {
                if(ctrl.cellIndex>0 && pageX>right-7)
                {
                    var hdr_tbl = hdr.getElementsByTagName("table")[0];
                    var next=hdr_tbl.tBodies[0].rows[0].cells[ctrl.cellIndex-1];
                    this._setGridState(grd, GridState.HoverEdge,next,null);
                }
                else if (pageX<left+7)
                {
                    this._setGridState(grd, GridState.HoverEdge, ctrl,null);
                }
                else
                    this._setGridState(grd, GridState.Default, ctrl,null);
            }
            else
            {
                if(ctrl.cellIndex>0 && pageX<left+7)
                {   
                    var hdr_tbl = hdr.getElementsByTagName("table")[0];
                    var prev = hdr_tbl.tBodies[0].rows[0].cells[ctrl.cellIndex-1];
                    this._setGridState(grd, GridState.HoverEdge, prev,null);
                }
                else if (pageX>right-7)
                {
                    this._setGridState(grd, GridState.HoverEdge, ctrl,null);
                }
                else 
                    this._setGridState(grd, GridState.Default, ctrl,null);
            }
        }
        else
            this._setGridState(grd, GridState.Default, ctrl,null);
    }
    else if (Global.GridManager.State == GridState.Drag && ctrl.tagName == "TD")
    {
        ctrl.style.backgroundColor = '#fff';

        var pos = Global.PositionedOffset(ctrl);

        Global.GridManager.DragObject.Marker.style.position = 'absolute';
        Global.GridManager.DragObject.Marker.style.left = (pos.Left) + 'px';
        Global.GridManager.DragObject.Marker.style.top = (pos.Top - parseInt(Global.GridManager.DragObject.Marker.style.height)) + 'px';
        Global.GridManager.DragObject.Marker.style.display = '';
        
        if(Global.FormDir=="rtl")
        {
            Global.GridManager.DragObject.Marker.style.left = (pos.Left) + (ctrl.offsetWidth-2) + 'px';
        }
    } 
}
EpiGrid.prototype._grpmousemove=function(e)
{   
    var ctrl = e.target||e.srcElement;
    var hdr = Global.GetParentByTag(ctrl, "DIV", false);
    var grd = Global.GetParentByTag(hdr, "DIV", true);

    if(Global.GridManager.State==GridState.Drag)
    { 
        var offset=-5;        
        if(ctrl.className=="EpiGrid-Grp") 
        {
            var cols=ctrl.getElementsByTagName("label");
            if(cols.length>0)
            {
                ctrl=cols[cols.length-1];
                if(ctrl.className=="EpiGrid-Grp-Col") offset=ctrl.offsetWidth;
            }
        }
    
        if(ctrl.className=="EpiGrid-Grp-Lbl"||ctrl.className=="EpiGrid-Grp-Col")
        {
            var pos = Global.PositionedOffset(ctrl);

            Global.GridManager.DragObject.Marker.style.position = 'absolute';
            Global.GridManager.DragObject.Marker.style.left = (pos.Left)+offset + 'px';
            Global.GridManager.DragObject.Marker.style.top = (pos.Top - parseInt(Global.GridManager.DragObject.Marker.style.height)) + 'px';
            Global.GridManager.DragObject.Marker.style.display = '';
        }
    }  
}
EpiGrid.prototype._mousemove = function(e)
{
    if (Global.GridManager.State == GridState.Resize)
    {
        var grd = Global.GridManager.Control;
        var resizeCol = Global.GridManager.Target;
        var gridParts = this._getGridParts(grd);

        var pageX = 0;
        if (e.pageX)
            pageX = e.pageX + gridParts["Header"].scrollLeft;
        else if (e.x)
            pageX = e.x + Global.GetPosition(grd).x + 1 + gridParts["Header"].scrollLeft;
            
        var wAdjust = 0;
        if(Global.FormDir=="rtl")
        {
            if (BrowserSniffer.Safari13)
            {
                if (pageX < Global.GridManager.StartX)
                {
                    wAdjust = Global.GridManager.StartX-pageX;
                    if (wAdjust > 5) wAdjust = wAdjust - 4;
                }
                else
                {
                    wAdjust = pageX - Global.GridManager.StartX;
                }
            }
            else
            {
                wAdjust = Global.GridManager.StartX - pageX - 4;
            }
        }
        else
        {
            if (BrowserSniffer.Safari13)
            {
                if (pageX > Global.GridManager.StartX)
                {
                    wAdjust = pageX - Global.GridManager.StartX;
                    if (wAdjust > 5) wAdjust = wAdjust - 4;
                }
                else
                {
                    wAdjust = pageX - Global.GridManager.StartX;
                }
            }
            else
            {
                wAdjust = pageX - Global.GridManager.StartX - 4;
            }
        }

        var w = resizeCol.offsetWidth + wAdjust;
        var tw = gridParts["HeaderTable"].offsetWidth + wAdjust;
        if (w > 5)
        {
            gridParts["HeaderTable"].style.width = tw + "px";
            resizeCol.style.width = w + "px";
            this._sizeBodyColumns(gridParts, resizeCol.cellIndex);
            Global.GridManager.StartX = pageX;
        }
    }
    else if (Global.GridManager.State == GridState.ReadyToDrag || Global.GridManager.State == GridState.Drag)
    {
        Global.GridManager.State = GridState.Drag;
        var tmpX = 0, tmpY = 0;
        if (e.pageX)
        {
            tmpX = e.pageX + window.pageXOffset;
            tmpY = e.pageY + window.pageYOffset;
        }
        else if (e.clientX)
        {
            tmpX = e.clientX + document.body.scrollLeft;
            tmpY = e.clientY + document.body.scrollTop;
        }

        Global.GridManager.DragObject.Container.style.position = 'absolute';
        Global.GridManager.DragObject.Container.style.left = (tmpX + 5) + 'px';
        Global.GridManager.DragObject.Container.style.top = (tmpY + 5) + 'px';
        Global.GridManager.DragObject.Container.style.display = '';
		
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		else {
			window.event.returnValue = false;
		}
		return false;
    }
}
EpiGrid.prototype._mouseup = function(e)
{
    var container = Global.GridManager.Control;
    EpiEventManager.removeListener(container, "mousemove", this._mousemove);
    EpiEventManager.removeListener(Global.document, "mouseup", this._mouseup);

    var doReorder=false;
    if (Global.GridManager.State == GridState.ReadyToDrag || Global.GridManager.State == GridState.Drag)
    {
        Global.GridManager.DragObject.Container.style.display = 'none';

        var source = e.srcElement || e.target;
 
        var c = source.className;
        if(c=="EpiGrid-Grp"||c=="EpiGrid-Grp-Lbl"||c=="EpiGrid-Grp-Col")
        {
            var idx=0;
            if(source.className=="EpiGrid-Grp") 
            {
                var cols=source.getElementsByTagName("label");
                if(cols.length>1) idx=cols.length-1;
            }
            else if(source.className=="EpiGrid-Grp-Col")
            {
                var cols=source.parentNode.getElementsByTagName("label");
                var cIdx=1;
                while(cols[cIdx]!=source) {cIdx++;}
                idx=cIdx-1;
            }
            
            if(Global.GridManager.DragState==DragState.GroupBy)
            {
                // group by to group by
                if(Global.GridManager.DragObject.Index!=idx)
                {
                    this._moveGroupByCol(Global.GridManager.DragObject.Index,idx);
                    this.Bind(Global.BindingEngine, Global.document.getElementById(this.ID), Global.BindingEngine.EpiDataViews[this.DataView], 0);
                }
            }
            else
            {
                // column header to group by
                this._addGroupByCol(Global.GridManager.DragObject.Index,idx,Global.GridManager.DragObject.Container.innerHTML);
                this.RemoveColumn(Global.GridManager.DragObject.Index);
                this.Bind(Global.BindingEngine, Global.document.getElementById(this.ID), Global.BindingEngine.EpiDataViews[this.DataView], 0);
            }
        }
        else
        {
            // Get the grid related to the source
            var grd=Global.GetParentByType(source, EpiGrid, true);
            
            if(grd)
            {        
                var targetIndex = Global.BindingEngine.Controls[grd.id]._getHeaderColumnIndex(source.nodeName == 'TD' ? source : source.parentNode);
                if(Global.GridManager.DragState==DragState.GroupBy)
                {
                    // group by to column header
                    var gb=this.GroupByColumns[Global.GridManager.DragObject.Index];
                    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
                    
                    if(dv&&dv.dataView&&dv.dataView.Table)
                    {
                        var ctrl=Global.document.getElementById(this.ID);
                        var colName = gb.Col;
                        this.GroupByColumns.splice(Global.GridManager.DragObject.Index,1);

                        if(colName.StartsWith("col")) colName=colName.substr(3);
                        if(targetIndex==-1&&gb.OriginalIdx!=undefined) targetIndex=gb.OriginalIdx;
                        var newIdx=this.AddColumn(ctrl, dv.dataView.Table, {"DataColumn":gb.Key,"ColumnName":colName,"ColumnWidth":-1, "ColumnCaption":gb.Caption, "Enabled":false},true,targetIndex);
                        
                        this._refreshGroupBy();
                        
                        this.Bind(Global.BindingEngine, ctrl, dv, 0);
                     }
                }
                else
                {
                    // header to header
                    if (!(Global.GridManager.DragObject.Index == targetIndex))
                    {
                        this.MoveColumn(Global.GridManager.DragObject.Index, targetIndex, this.GroupByColumns.length==0);
                        if(this.GroupGrid) this.GroupGrid.MoveColumn(Global.GridManager.DragObject.Index, targetIndex);
                    }
                    else
                        doReorder=true;
                }
            }
        }
    }

    if (!e) e = window.event;
    source = e.srcElement || e.target;    
    if ((Global.GridManager.State != GridState.Resize && doReorder) || (source.id=="summary"&&Global.GridManager.State==GridState.Default))
    {
        if(source.id=="summary")
            this.SumsClicked(source);
        else
        {
            var grd=Global.GetParentByType(source, EpiGrid, true);
            
            if ((e.which==undefined && e.button&1)||(e.which!=undefined&&e.which==1)) 
                Global.BindingEngine.Controls[grd.id]._setHeaderSortArrowDirection(source.nodeName == 'TD' ? source : source.parentNode);
        }
    }
        
    this._setGridState(container, GridState.Default, null);
    Global.GridManager.DragState=DragState.Default;
    
    if (Global.GridManager.DragObject && Global.GridManager.DragObject.Marker)
        Global.GridManager.DragObject.Marker.style.display = 'none';
}
EpiGrid.prototype.ClearGroupBy=function()
{
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];

    if(dv&&dv.dataView&&dv.dataView.Table)
    {
        var ctrl=Global.document.getElementById(this.ID);
        for(var ii=this.GroupByColumns.length-1;ii>=0;ii--)
        {
            var gb=this.GroupByColumns[ii];
            var colName = gb.Col;
            this.GroupByColumns.splice(ii,1);

            var targetIndex = gb.OriginalIdx!=undefined ? gb.OriginalIdx:-1;
            if(colName.StartsWith("col")) colName=colName.substr(3);
            var newIdx=this.AddColumn(ctrl, dv.dataView.Table, {"ColumnName":colName,"ColumnWidth":-1, "ColumnCaption":gb.Caption, "Enabled":false},true,targetIndex);
        }
        
        this._refreshGroupBy();
        this.ExpFilters={};

        this.Bind(Global.BindingEngine, ctrl, dv, 0);
    }
}
EpiGrid.prototype._setHeaderSortArrowDirection = function(columnCell)
{
    var orderCaps = Global.GetChildrenByName(columnCell.parentNode, 'order');
    for (var i = 0; i < orderCaps.length; i++)
        orderCaps[i].style.display = 'none';

    var name = this._getColumnName(this._getHeaderColumnIndex(columnCell));
    if (columnCell.sortOrder == 1||columnCell.sortOrder==null)
    {
        columnCell.sortOrder = 0;
        this.OrderByColumn(name, "ASC", !this.IsGroupChild);
    }
    else
    {
        columnCell.sortOrder = 1;
        this.OrderByColumn(name, "DESC", !this.IsGroupChild);
    }
}

EpiGrid.prototype._dblclick=function(e)
{
    var ctrl = e.target||e.srcElement;

    var row = Global.GetParentByTag(ctrl, "TR", false);
    if(Global.InstanceOf(ctrl,'EpiDropControl')) 
        row = Global.GetParentByTag(ctrl, "TR", false); // Go up one more level for dropdowns
    if(row)
    {
        this.get_Event("DoubleClick").fire(this,{"Row":row});        
    }
}
EpiGrid.prototype._focus=function(e)
{
    var ctrl = e.target||e.srcElement;

    var combo=Global.GetParentByType(ctrl,EpiDropControl, false);
    if(combo) ctrl=combo;

    var row = Global.GetParentByTag(ctrl, "TR", false);

    if(row)
    {
        var grd = Global.GetParentByTag(row, "DIV").parentNode;
        var hilited = false;
        if((Global.KeyboardManager.ShiftKey==true || Global.KeyboardManager.CtrlKey==true) && this.MultiRowSelect==true)
        {
            // In case DoRowChange causes a rebind on the grid which will call HiliteRow, we need to make sure the current row that is 
            // selected is in the KeySelectedRows list.
            if (!this.KeySelectedRows)
                this.KeySelectedRows = new ArrayList();
            if (this.KeySelectedRows.get_Count() == 0)
            {
                var aRow = this.get_ActiveRowObject(grd);
                if (aRow)
                    this.KeySelectedRows.Add(aRow.rowIndex);
            }
            this.HiliteRow(grd, row.rowIndex, Global.KeyboardManager.ShiftKey, Global.KeyboardManager.CtrlKey);
            hilited = true;
        }
        var rowIdx = row.rowIndex;

        var rIdx = rowIdx;
        try {rIdx = Convert.ToInt32(row.getAttribute("_idx"));} catch(err){}

        if(Global.BindingEngine.EpiDataViews[this.DataView] && Global.Form.trans) 
            Global.Form.trans.set_LastView(Global.BindingEngine.EpiDataViews[this.DataView]);
            
        if(!Global.BindingEngine.EpiDataViews[this.DataView].DoRowChange(rIdx))
        {
        }
        else
        {
            if(ctrl.tagName=="DIV") 
            {
                

                // just in case the grid reloaded during the DoRowChange, find the cell you're looking for. 
                var cell = this.FindGridControl(grd, rowIdx, ctrl.id);
                if(cell && !hilited) 
                {
                    // Clear any previous selections
                    if (this.KeySelectedRows)
                    {
                        this.KeySelectedRows.Clear();
                    }
                    this.HiliteRow(grd, rowIdx);

                    Global.BindingEngine.Controls[ctrl.id].FocusInGrid(cell);
                }
            }
        }
    }
    
    //this._click(e);
}
EpiGrid.prototype.get_ActiveRowObject=function(ctrl)
{
    if (!ctrl)
        ctrl = Global.document.getElementById(this.ID);
    Global.GridManager.Grids[ctrl.id] = this._getGridParts(ctrl);
    
    // If the grid has not yet been bound, go ahead and bind it.
    if(Global.GridManager.Grids[ctrl.id]["BodyTable"].tBodies[0].rows.length==0||
        (Global.GridManager.Grids[ctrl.id]["BodyTable"].tBodies[0].rows.length==1&&Global.GridManager.Grids[ctrl.id]["BodyTable"].tBodies[0].rows[0].cells.length==0))
    {
        var dv = Global.BindingEngine.EpiDataViews[this.DataView];
        if(dv&&dv.dataView&&dv.dataView.Rows.length>0) 
        {
            this.Bind(Global.BindingEngine, ctrl, dv, dv.Row, true);
            Global.GridManager.Grids[ctrl.id] = this._getGridParts(ctrl);
        }
    }
    
    return Global.GridManager.Grids[ctrl.id]["ActiveRow"];
}
EpiGrid.prototype.set_ActiveRowObject=function(row)
{
    var ctrl = Global.document.getElementById(this.ID);
    Global.GridManager.Grids[ctrl.id] = this._getGridParts(ctrl);
    Global.GridManager.Grids[ctrl.id]["ActiveRow"] = row;
}

EpiGrid.prototype.get_ActiveRow=function()
{
   var activeRowObj = this.get_ActiveRowObject();
   if (activeRowObj)
      return new UltraGridRow(this, activeRowObj.rowIndex); 
   else
      return null;
}
EpiGrid.prototype.set_ActiveRow=function(row)
{
    if (row instanceof UltraGridRow)
        row.Activate();
}
EpiGrid.prototype.get_Selected=function(ctrl)
{
    return new Infragistics.Win.UltraWinGrid.Selected(this);
}
EpiGrid.prototype.get_SelectedRowsIncludingDescendants=function()
{
    // For now, only used by QuickSearch so just return get_Selected.
    return this.get_Selected(this.Get()).Rows;
}
EpiGrid.prototype.AddControlToGrid=function(obj)
{
    var dc = obj.DataColumn;
    var dv = obj.DataView;
    var found = false;

    for(var col in this._columns)
    {
        var origObj = Global.BindingEngine.Controls[this._columns[col]];
        if(origObj.DataColumn==dc && origObj.DataView==dv)
        {
            this._columns[col] = obj.ID;
            found = true;
            break;
        }
    }
    if(found) 
    {    
        obj.InGrid = true;
        obj.OwnerGrid = this.ID;
        obj.Visible = true;
        
        var ctrl = Global.document.getElementById(obj.ID);
        if(ctrl) 
        {
            Global.Purge(ctrl);
            ctrl.parentNode.removeChild(ctrl);
        }
    }        
}
EpiGrid.prototype.set_DataSource=function(dataSource)
{
    if(dataSource==null) return;

    var prevDS = this.DataView;
    var dvName = "";

    if(Global.InstanceOf(dataSource,"DataView"))
    {
        // If dataSource is DataView, the table might be already be attached to an epidataview.
        if (!dataSource.Table.TableName && dataSource._EpiDataViews.length>0)
        {
            // If there is an epidataview for this DataView and table, then use its ViewName
            for(var edv in dataSource._EpiDataViews)
            {
                var eDV=dataSource._EpiDataViews[edv];
                if (eDV.dataView.Table == dataSource.Table)  // Find the EpiDataView that is for this table.
                {
                    dvName = eDV.ViewName;
                    break;
                }
            }    
        }
    }
    dataSource = FormFunctions.GetTableFromDataSource(dataSource,this.DataMember);

    this.DataSource = dataSource;
    
    if (dataSource && dvName == "") // some apps code sends in null as the datasource, should clear the binding
        dvName = dataSource.TableName;
    
    if (dvName == "Results" && Global.BindingEngine.EpiDataViews[dvName])
        dvName = dvName + "_" + this.ID;

    this.DataView = dvName;
    
    var ctrlStruct=Global.BindingEngine.Controls;
    
    for(var o2 in this._columns)
    {
        var ctrlName = this._columns[o2];
        var obj = ctrlStruct[ctrlName];
        
        if(obj)
            obj.DataView=dvName;
    }
    if (dvName != "") // ? If this is "", should we delete the previous epidataview?
    {
        var dv;
        if (Global.BindingEngine.EpiDataViews[dvName])
        {
            dv = Global.BindingEngine.EpiDataViews[dvName];
            dv.set_dataView(new DataView(dataSource));
        }
        else
        {
            dv = new EpiDataView();
            dv.set_dataView(new DataView(dataSource));
            dv.ViewName = dvName;
            Global.BindingEngine.EpiDataViews[dvName] = dv;
        }
        
        dv.Refresh(true);
        
        if(Global.InstanceOf(Global.Form, "EpiSearchBase"))
        {
            var ruleReadOnlyGrid = new RowRule("1", RuleCondition.Equals, "1");
            var disableRow = RuleAction.DisableRow(this, dataSource.TableName);
            ruleReadOnlyGrid.AddAction(disableRow);
            dv.AddRowRule(ruleReadOnlyGrid);
        }
        var ctrl = Global.document.getElementById(this.ID);
        
        // If the grid doesnt have any columns, create them now based on the datasource
        if (!this._hasColumns())
        {
            var col; var cap;
            var cols = dataSource.get_Columns().items;
            for (var c in cols)
            {
                col = cols[c];                
                cap = (col.Caption && (col.Caption.length > 0)) ? col.Caption : col.ColumnName;
                this.AddColumn(ctrl, dataSource, {"ColumnName":col.ColumnName,"ColumnWidth":-1, "ColumnCaption":col.ColumnName, "Enabled":false},true);
            }
        }
        else
        {
            // It already has columns, add any new columns found in the datasource
            var cols=dataSource.get_Columns().items;
            var _cols=this._columns;
            for(var _c in _cols)
            {
                if((!cols[_c])&&(!cols[_c.substring(3,_c.length)]))
                    this.RemoveColumn(this._getColumnIndexByName(_c));
            }
            if(!Global.InstanceOf(Global.Form,"EpiSearchBase"))
            {
                for(var c in cols)
                {
                    col=cols[c];
                    cap=(col.Caption&&(col.Caption.length>0))?col.Caption:
                      ((col.ExtendedProperties&&col.ExtendedProperties.Caption&&col.ExtendedProperties.Caption.length>0)?
                          col.ExtendedProperties.Caption:col.ColumnName);
                    if((!this._columns["col"+col.ColumnName])&&(!this._columns[col.ColumnName]))
                        this.AddColumn(ctrl,dataSource,{ "ColumnName": col.ColumnName,"ColumnWidth": -1,"ColumnCaption": cap,"Enabled": false },true);
                }
            }
        }
        
        if(!Global.BindingEngine.ShouldWait(null,dv))
        this.Bind(Global.BindingEngine,ctrl,dv,0);
    }
    else if (prevDS)
    {
        delete Global.BindingEngine.EpiDataViews[prevDS];
    }
}
EpiGrid.prototype.get_DataSource=function() {return this.DataSource};
EpiGrid.prototype.DeleteSelectedRows=function(displayPrompt)
{
    var selRowCol = this.get_Selected();
    if (selRowCol.Rows.Count > 0)
    {
        var args = {"Rows":selRowCol.Rows.items,"Cancel":false,"DisplayPromptMsg":displayPrompt};
        this.get_Event("BeforeRowsDeleted").fire(this,args);
        if (args.Cancel == true) return;
        var msg = "You have selected "+ selRowCol.Rows.Count.toString() +" row(s) for deletion. Choose Yes to delete the rows or No to exit.";
        
        if (args.DisplayPromptMsg)
        {
            var retVal = MessageBox.Show(msg, "Delete Rows", MessageBoxButtons.YesNo, new EpiOverloadedArgs("String_String_MessageBoxButtons"));
            if (retVal == DialogResult.No)
                return;
        }
        
        var ctrl = Global.document.getElementById(this.ID);
        var bdy = ctrl.getElementsByTagName("div")[2];
        var bdy_tbl = bdy.getElementsByTagName("table")[0];
        var tbody = bdy_tbl.tBodies[0];
    
        for (var r=selRowCol.Rows.Count-1; r >=0; r--)
        {
            var rowItm = selRowCol.Rows.items[r];
            if (tbody.rows[rowItm._idx]) // Delete from the ui
            {   
                Global.Purge(tbody.rows[rowItm._idx]);
                tbody.deleteRow(rowItm._idx);
                
                // delete from the datasource too
                Global.BindingEngine.EpiDataViews[this.DataView].dataView.Delete(rowItm._idx);
            }   
        }
        
        this.get_Event("AfterRowsDeleted").fire(this,{});
    }
}
EpiGrid.prototype.PerformAction=function() 
{
    var a = arguments;
    var tempArray = new Array();
    for (i=0;i<a.length;i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);
    
    switch(overload)
    {
        case "UltraGridAction_Boolean_Boolean": 
            return this.PerformAction_1(a[0],a[1],a[2]);
            break;
        case "UltraGridAction":
            return this.PerformAction_1(a[0], false, false);
            break;
    }
}
EpiGrid.prototype.PerformAction_1=function(actionCode,shift,control)
{
    // TODO
    return true;
}
EpiGrid.prototype._hasColumns=function()
{
    for(var xCol in this._columns)
    {
        return true;
    }
    return false;
}

// TODO - not sure if we need this, formats the grid columns which we already do during bind
EpiGrid.prototype.FormatColumns=function()
{
   var thisTable = FormFunctions.GetTableFromDataSource(this.DataSource,this.DataMember);
   if (!thisTable) return;
   
   var myColumn,cFormat="",dsFormat="",isNumber=false,isCurrency = false,isUOMQty = false;
   var ctrl = Global.document.getElementById(this.ID);
   var gridParts = this._getGridParts(ctrl);
   var rows = gridParts["BodyTable"].rows;
    
   for(var xColumn in this._columns)
   {
        if (thisTable.ColumnsContains(xColumn))
        {
            isNumber = false,isCurrency = false,isUOMQty = false;
            cFormat="",dsFormat="";
            
            myColumn = thisTable.get_Column(xColumn);
            
            var bizTypeVal = thisTable.GetExtendedProperty(xColumn, "BizType");
            if (bizTypeVal.toLowerCase() == "currency") { isCurrency = true; }
            if (bizTypeVal.toLowerCase() == "quantity") { isUOMQty = true; }

            // first check for formatting
            cFormat = String.Empty;
            dsFormat = thisTable.GetExtendedProperty(xColumn, "Format");
            if (dsFormat!="")
            {
                if (dsFormat.IndexOf("../index-2.html") == -1)
                {
                    //determine format type
                    dsFormat = dsFormat.toUpperCase();
                    switch (dsFormat.Substring(0, 1))
                    {
                        case "X":
                            cFormat = this.formatText(dsFormat);
                            break;
                        case "9":
                        case "#":
                        case "-":
                        case "Z":
                        case ">":
                            isNumber = true;
                            cFormat = this.formatNumber(dsFormat);
                            break;
                    } //Switch statement	
                    
                     if (cFormat.length > 0)
                     {
                            try
                            {
                                if (isNumber && !isCurrency)
                                {
                                    // Find the control for this column for each row and format it
                                    var colIndx = this._getColumnIndex(xColumn);
                
                                    for(var r=0; r<rows.length; r++)
                                    {
                                        var row = rows[r];
                                        var o=row.cells[colIndx];
                                        if(o && o.childNodes.length>0)
                                        {
                                            var itm = o.childNodes[0];
                                            if(itm.nodeName=="DIV" || (itm.nodeName=="INPUT" && itm.type=="checkbox"))
                                            {
                                                var obj = Global.BindingEngine.Controls[itm.id];
                                                if (obj)
                                                {
                                                    var val = obj.GetValue(itm,false);
                                                    obj.SetValue(itm, FormatEngine.FormatNumber(val, cFormat));
                                                }
                                            }
                                        }
                                    }
//                                    xColumn.MaskInput = cFormat;
//                                    xColumn.Format = formatNumberForFormat(dsFormat);
                                }
//                                else
//                                    xColumn.MaxLength = cFormat.Length;
                            }
                            catch (ex){DebugHelper.WriteError(null, ex);}
                     }	
                }
            }
        }
   
   }
}

// Fixes the format sent in
EpiGrid.prototype.formatText=function(xFormat)
{
    var textFormat = "", EpiLength = 0;
    if (xFormat.StartsWith("X(") && xFormat.EndsWith(")"))
    {
        var s = xFormat.Substring(0, xFormat.length - 1);
        s = s.Substring(2);
        try
        {
            EpiLength = Int32.Parse(s);
        }
        catch (ex){}
    }
    try
    {
        if (EpiLength == 0)
            EpiLength = xFormat.Length;
        textFormat = textFormat.PadLeft(EpiLength, 'C');
    }
    catch (ex){textFormat = "";}

    return textFormat;
}
// Replace the Progress number format with a .Net format string.
EpiGrid.prototype.formatNumber=function(xFormat)
{
    var builder = new StringBuilder(xFormat, new EpiOverloadedArgs("String"));
    builder.Replace('9', 'n', new EpiOverloadedArgs("String_String"));
    builder.Replace('>', 'n', new EpiOverloadedArgs("String_String"));
    builder.Replace('z', 'n', new EpiOverloadedArgs("String_String"));
    builder.Replace('Z', 'n', new EpiOverloadedArgs("String_String"));
    if (xFormat.StartsWith("-"))
    {
//        builder.Remove(0, 1, );
//        builder.Insert(0, "-n");
        builder.Replace("-","-n",0,1, new EpiOverloadedArgs("String_String_Int32_Int32"));
    }
    return builder.ToString();
}
// Replace the Progress format string with a .Net format string
EpiGrid.prototype.formatNumberForFormat=function(xFormat)
{
    var builder = new StringBuilder(xFormat, new EpiOverloadedArgs("String"));
    builder.Replace('9', '0', new EpiOverloadedArgs("String_String"));
    builder.Replace('>', '#', new EpiOverloadedArgs("String_String"));
    builder.Replace('Z', '#', new EpiOverloadedArgs("String_String"));
    if (xFormat.StartsWith("-"))
    {
//        builder.Remove(0, 1);
//        builder.Insert(0, "#");
        builder.Replace("-","#",0,1, new EpiOverloadedArgs("String_String_Int32_Int32"));
    }
    return builder.ToString();
}

EpiGrid.prototype._unsubscribeViewNotifications = function()
{
    var oDataView = Global.BindingEngine.EpiDataViews[this.DataView];
    if (oDataView)
    {
        oDataView.get_Event("EpiViewNotification").unsubscribe(this.oDataView_EpiViewNotification, this);
    }
}

EpiGrid.prototype.Dispose = function()
{
    this._unsubscribeViewNotifications();
}

EpiGrid.prototype.DisableColumns=function(){ }
EpiGrid.prototype.ToggleGroupBy=function(showGroupBy)
{
    var ctrl = document.getElementById(this.ID); 
    var gridParts = this._getGridParts(ctrl);
    if (!showGroupBy)
    {
        this.ClearGroupBy();
        gridParts["GroupBy"].style.display="none";
        
        this._hasGroupByShown = false;
    }
    else
    {
        if(!gridParts["GroupBy"])
        {
            gridParts["GroupBy"] = Global.document.createElement("DIV");
            gridParts["GroupBy"].className="EpiGrid-Grp";
            ctrl.insertBefore(gridParts["GroupBy"],gridParts["Header"]);
            
            gridParts["GroupByLbl"] = Global.document.createElement("LABEL");
            gridParts["GroupByLbl"].className="EpiGrid-Grp-Lbl";
            gridParts["GroupByLbl"].innerHTML="Drag a column header here to group by that column";
            if(Global.FormDir=="rtl")
            {
                gridParts["GroupByLbl"].style.marginLeft="0px";
                gridParts["GroupByLbl"].style.marginRight="3px";
            }
            
            gridParts["GroupBy"].appendChild(gridParts["GroupByLbl"]);
            
            EpiEventManager.addListener(gridParts["GroupBy"], "mousemove", this._grpmousemove, this, true);
            EpiEventManager.addListener(gridParts["GroupBy"], "mouseout", this._grpmouseout, this, true);
            EpiEventManager.addListener(gridParts["GroupBy"], "mousedown", this._grpmousedown, this, true);
            
        }
        else
        {
            gridParts["GroupByLbl"].style.display="";
            gridParts["GroupBy"].style.display="";
        }
        this._hasGroupByShown = true;
               
        if(!this.GroupGrid) this.GroupGrid = new EpiGroupGrid(this);
    }
    this.FixSize(ctrl);
}
EpiGrid.prototype._moveGroupByCol=function(fromIdx,toIdx)
{
    if(toIdx>fromIdx) toIdx--;

    var fromCol=this.GroupByColumns[fromIdx];
    this.GroupByColumns.splice(fromIdx,1);
    this.GroupByColumns.splice(toIdx,0,fromCol);
    this._refreshGroupBy();
}
EpiGrid.prototype._addGroupByCol=function(colIdx,targetIdx,caption)
{
    var colName=this._getColumnName(colIdx);
    var col=this._columns[colName];
    var obj = Global.BindingEngine.Controls[col];
    if(obj)
    {
        for(var ii=0;ii<=this.GroupByColumns.length-1;ii++)
        {
            if(this.GroupByColumns[ii].Col==col)
            {
                if(targetIdx>ii) targetIdx--;
                this.GroupByColumns.splice(ii,1);
                break;
            }
        }
        var gb={"Key":obj.DataColumn,"Col":col,"Order":"Ascending","Caption":caption,"OriginalIdx":colIdx};
        this.GroupByColumns.splice(targetIdx,0,gb);
        this._refreshGroupBy();
    }
}
EpiGrid.prototype._refreshGroupBy=function()
{
    var ctrl = document.getElementById(this.ID); 
    var gridParts = this._getGridParts(ctrl);

    while(Global.NextNode(gridParts["GroupByLbl"]))
    {
        var col=Global.NextNode(gridParts["GroupByLbl"]);
        EpiEventManager.removeListener(col, "click", this._grpclick);
        gridParts["GroupBy"].removeChild(col);
    }

    if(this.GroupByColumns.length>0)
    {
        gridParts["GroupByLbl"].style.display="none";
        for(var ii=0;ii<=this.GroupByColumns.length-1;ii++)
        {
            var newCol = Global.document.createElement("LABEL");
            newCol.className="EpiGrid-Grp-Col";
            
            if(Global.FormDir=="rtl")
            {
                newCol.style.marginLeft="0px";
                newCol.style.marginRight="3px";
            }
            
            var txt=this.GroupByColumns[ii].Key;
            if(this.GroupByColumns[ii].Caption) txt=this.GroupByColumns[ii].Caption;
                
            if(this.GroupByColumns[ii].Order=="Ascending")
                txt+="&nbsp;&darr;";
            else
                txt+="&nbsp;&uarr;";
            newCol.innerHTML=txt;
            newCol.unselectable="on";
            EpiEventManager.addListener(newCol, "click", this._grpclick, this, true);
            gridParts["GroupBy"].appendChild(newCol);
        }
        
        if(!this.GroupGrid) this.GroupGrid=new EpiGroupGrid(this);
        this.GroupGrid.Show();
    }
    else
    {
        gridParts["GroupByLbl"].style.display="";
        if(this.GroupGrid) this.GroupGrid.Hide();
    }
}
EpiGrid.prototype.ToggleSummaries=function(showSummaries)
{
    this._toggleSummaries(showSummaries);
    if(this._hasGroupByShown&&this.GroupGrid)
    {    
        for(var ii=0;ii<=this.GroupGrid.Grids.length-1;ii++)
        {
            var gridID=this.GroupGrid.Grids[ii];
            var obj=Global.BindingEngine.Controls[gridID];
            if(obj) obj._toggleSummaries(showSummaries);
        }
    }
}
EpiGrid.prototype._toggleSummaries=function(showSummaries)
{
    var ctrl = document.getElementById(this.ID); 
    var gridParts = this._getGridParts(ctrl);
    var headerCells = gridParts["HeaderCells"];
    if(showSummaries)
    {
        var dv=Global.BindingEngine.EpiDataViews[this.DataView];
        if(dv&&dv.dataView.Table)
        {
            var cols = dv.dataView.Table.get_Columns().items;
            var idx= 0;
            for(var c in this._columns) 
            {
                col = cols[c]; 
                if (!col) continue;

                var dt = col.DataType;
                if(dt=="System.Int16"||dt=="System.Int32"||dt=="System.Int64"||dt=="System.Double"||dt=="System.Decimal")
                {
                    var source = Global.GetChildrenByName(headerCells[idx], 'summary')[0];
                    if (source == null)
                    {
                        source = document.createElement('A');
                        source.href = '#';
                        source.name = 'summary';
                        source.id="summary";
                        source.className="EpiGrid-Hdr-Sum";
                        source.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;";
                        headerCells[idx].appendChild(source);
                    }
                    source.style.display = '';
                }
                idx++;
            }
        }
        this._hasSummariesShown = true;
    }
    else
    {
        var sums = Global.GetChildrenByName(gridParts["Header"], 'summary');
        for(var ii=0;ii<=sums.length-1;ii++)
        {
            sums[ii].style.display="none";
        }
        this.SummaryColumns={};
        this.Summaries=null;
        
        this._refreshSummaries(false);
    
        this._hasSummariesShown = false;
    }
}
EpiGrid.prototype.SumsClicked=function(sumImg)
{
    this._setGridState(Global.document.getElementById(this.ID), GridState.Default, null);

    var grdCtrl = Global.GetParentByType(sumImg, EpiGrid, true);
    var grdObj=Global.BindingEngine.Controls[grdCtrl.id];

    var name = grdObj._getColumnName(grdObj._getHeaderColumnIndex(sumImg.parentNode));
    var sumCol=this.SummaryColumns[name];
  
    var sumForm = new SummariesForm();
    if(sumCol)
    {
        if(sumCol["Average"]) sumForm.GetControl("chkAverage").set_Checked(true);
        if(sumCol["Count"]) sumForm.GetControl("chkCount").set_Checked(true);
        if(sumCol["Min"]) sumForm.GetControl("chkMinimum").set_Checked(true);
        if(sumCol["Max"]) sumForm.GetControl("chkMaximum").set_Checked(true);
        if(sumCol["Sum"]) sumForm.GetControl("chkSum").set_Checked(true);
    }
    
    var diaRes = sumForm.ShowDialog();

    if (diaRes == DialogResult.OK)
    {
        var chkAve=sumForm.GetControl("chkAverage").get_Checked();
        var chkCnt=sumForm.GetControl("chkCount").get_Checked();
        var chkMin=sumForm.GetControl("chkMinimum").get_Checked();
        var chkMax=sumForm.GetControl("chkMaximum").get_Checked();
        var chkSum=sumForm.GetControl("chkSum").get_Checked();
        
        if(!sumCol || (sumCol["Average"]!=chkAve||sumCol["Count"]!=chkCnt||sumCol["Min"]!=chkMin||
            sumCol["Max"]!=chkMax||sumCol["Sum"]!=chkSum))
        {        
            if(chkAve||chkCnt||chkMin||chkMax||chkSum)
            {
                var caption="";
                var lbls=sumImg.parentNode.getElementsByTagName("LABEL");
                if(lbls) caption=lbls[0].innerText;
                this.SummaryColumns[name]={"Caption":caption,"Average":chkAve,"Count":chkCnt,"Min":chkMin,"Max":chkMax,"Sum":chkSum};
            }
            else
                delete this.SummaryColumns[name];
                
            try
            {
                Global.GetSummaries(this);
                this._refreshSummaries(true);
                if(this._hasGroupByShown&&this.GroupGrid)
                {    
                    for(var ii=0;ii<=this.GroupGrid.Grids.length-1;ii++)
                    {
                        var gridID=this.GroupGrid.Grids[ii];
                        var obj=Global.BindingEngine.Controls[gridID];
                        Global.GetSummaries(obj);
                        if(obj) obj._refreshSummaries(true);
                    }
                }
            }
            catch(err)
            {
                return;
            }
        }
    }
}
EpiGrid.prototype._refreshSummaries=function(recalc)
{
    var ctrl = document.getElementById(this.ID); 
    var gridParts = this._getGridParts(ctrl);
    obj = gridParts["BodyTable"];
    for(var ii=obj.rows.length-1; ii>=0; ii--)
    {
        if(obj.rows[ii].getAttribute("summary")=="true")
            obj.deleteRow(ii);
        else break;
    }
    
    var hasSummaries=false;
    for(var sum in this.SummaryColumns) {hasSummaries=true;break;}
    
    if(hasSummaries)
    {
        var dv=Global.BindingEngine.EpiDataViews[this.DataView];
        var cached=(dv&&dv.dataView&&dv.dataView.Table.DataSet.CacheInfo);
    
        var summaries=this.Summaries;
        if(!summaries||(recalc&&!cached)) summaries = this._getSummaries();
        
        var colCnt=gridParts["HeaderCells"].length;
        
        var tbody = obj.getElementsByTagName("TBODY")[0];
        var row = document.createElement("TR");
        row.className="EpiGrid-Sum";
        row.setAttribute("summary","true");
        var td = document.createElement("TD")
        td.appendChild(document.createTextNode("Grand Summaries"));
        td.colSpan=colCnt;
        row.appendChild(td);
        tbody.appendChild(row);
        
        var spanCnt=0;
        row = document.createElement("TR");
        row.setAttribute("summary","true");
        row.className="EpiGrid-Sum";
        for(var col in this._columns)
        {
            var sumStr="";
            var sumCol=this.SummaryColumns[col];
            if(sumCol&&summaries[col])
            {
                var obj=Global.BindingEngine.Controls[this._columns[col]];
                var borderLeft="0px";
                if(spanCnt>0)
                {
                    td=document.createElement("TD");
                    td.colSpan=spanCnt;
                    td.style.borderWidth="0px 0px 0px 0px";
                    spanCnt=0;
                    row.appendChild(td);
                    borderLeft="1px";
                }
                if(sumCol["Average"])
                {
                    sumStr="Average: "+obj.Format(summaries[col]["Average"]);
                }
                if(sumCol["Count"])
                {
                    if(sumStr!="") sumStr+="<BR/>";
                    sumStr+="Count: "+summaries[col]["Count"];
                }
                if(sumCol["Max"])
                {
                    if(sumStr!="") sumStr+="<BR/>";
                    sumStr+="Maximum: "+obj.Format(summaries[col]["Max"]);
                }
                if(sumCol["Min"])
                {
                    if(sumStr!="") sumStr+="<BR/>";
                    sumStr+="Minimum: "+obj.Format(summaries[col]["Min"]);
                }
                if(sumCol["Sum"])
                {
                    if(sumStr!="") sumStr+="<BR/>";
                    sumStr+="Sum: "+obj.Format(summaries[col]["Sum"]);
                }
                td=document.createElement("TD");
                td.innerHTML=sumStr;
                td.style.borderLeftWidth=borderLeft;
                td.style.borderBottomWidth="0px";
                row.appendChild(td);
            }
            else
                spanCnt++;
        }
        if(spanCnt>0)
        {
            td=document.createElement("TD");
            td.colSpan=spanCnt;
            td.style.borderWidth="0px 0px 0px 0px";
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
}
EpiGrid.prototype._getSummaries=function()
{
    var sums={};

    var dv=Global.BindingEngine.EpiDataViews[this.DataView];
    if(dv && dv.dataView)
    {
        var rows=dv.dataView.Rows;
        
        for(var s in this.SummaryColumns)
        {
            var obj=Global.BindingEngine.Controls[this._columns[s]];
            sums[s]={"DC":obj.DataColumn,"Average":0,"Count":rows.length,"Max":0,"Min":0,"Sum":0};
        }
        for(var ii=0;ii<=rows.length-1;ii++)
        {
            for(var s in sums)
            {
                if(sums[s]["DC"])
                {
                    var val=rows[ii][sums[s].DC];
                    val=!val?0:Convert.ToDecimal(val);
                    
                    sums[s]["Sum"]+=val;
                    if(val>sums[s]["Max"]) sums[s]["Max"]=val;
                    if(val<sums[s]["Min"]) sums[s]["Min"]=val;
                }
            }
        }
        for(var s in sums)
        {
            if(rows.length>0) sums[s]["Average"]=sums[s]["Sum"]/sums[s]["Count"];
            var obj=Global.BindingEngine.Controls[this._columns[s]];
            if(obj)
            {
                sums[s]["Max"]=sums[s]["Max"];
                sums[s]["Min"]=sums[s]["Min"];
                sums[s]["Sum"]=sums[s]["Sum"];
                sums[s]["Average"]=sums[s]["Average"];
            }          
        }
    }
    this.Summaries=sums;
    return sums;
}
EpiGrid.prototype.MoveToPreviousCol=function(col,colCtrl)
{
    var ctrl = Global.document.getElementById(this.ID);
    var gridParts = this._getGridParts(ctrl);
    var rows = gridParts["BodyTable"].rows;
    var visibleCol = null;
    if(rows.length>0)
    {
        var oRow = Global.GetParentByTag(colCtrl, "TR", false);

        if(!oRow) oRow = rows[rows.length-1];
        for(var ii=0, o; o=oRow.cells[ii]; ii++)
        {
            var itm = o.childNodes[0];

            if(itm.id==col.ID)
            {   
                if(visibleCol) 
                {
                    Global.BindingEngine.Controls[visibleCol.id].FocusInGrid(visibleCol);
                    return true;
                }
                return false;
            }
            else if(itm.getAttribute("_disabled")!="true" && !(itm.nodeName=="INPUT" && itm.type=="checkbox" && itm.disabled==true))
            {
                visibleCol = itm;
            }
        }
    }
    return false;
}
var EpiGroupGrid=function(grd)
{
    this.Grid=grd;
    this.Control=null;
    this.Visible=false;
    this.Grids=[];
    this.GridCnt=0;
    this.Expanding=false;
    this.ExpFilters={};
}
EpiGroupGrid.prototype.MoveColumn=function(FromIndex, ToIndex)
{
    for(var ii=0;ii<=this.Grids.length-1;ii++)
    {
        var gridID=this.Grids[ii];
        var obj=Global.BindingEngine.Controls[gridID];
        if(obj) obj.MoveColumn(FromIndex, ToIndex, false);
    }
}
EpiGroupGrid.prototype.Bind=function()
{
    if(this.Expanding) return;

    var ctrl = document.getElementById(this.Grid.ID); 
    var gridParts = this.Grid._getGridParts(ctrl);
    if(gridParts["BodyGroup"])
    { 
        Global.Purge(gridParts["BodyGroup"]);
        gridParts["BodyGroup"].innerHTML="";
        for(var ii=0;ii<=this.Grids.length-1;ii++)
        {
            var gridID=this.Grids[ii];
            if(Global.BindingEngine.Controls[gridID])
            {
                Global.BindingEngine.ClearDVReg(Global.BindingEngine.EpiDataViews[gridID]);
                delete Global.GridManager.Grids[gridID];
                delete Global.BindingEngine.Controls[gridID];
                delete Global.BindingEngine.EpiDataViews[gridID];
            }
        }
        this.GridCnt=0;
        this.Grids=[];

        try
        {
            var rowCnt=this.ExpandLevel(0,"",gridParts["BodyGroup"]);
        }
        catch(err)
        {
            return;
        }
        
        if(rowCnt==0)
            gridParts["Header"].style.display="";
        else
            gridParts["Header"].style.display="none";
            
        this.Grid.FixSize(ctrl);
        
        EpiEventManager.removeListener(gridParts["BodyGroup"], "resize", this.Resize);
        EpiEventManager.removeListener(gridParts["BodyGroup"], "scroll", this.Scroll);
        EpiEventManager.addListener(gridParts["BodyGroup"], "resize", this.Resize, this, true);
        EpiEventManager.addListener(gridParts["BodyGroup"], "scroll", this.Scroll, this, true);
        
        if (Global.BindingEngine.CurrentTab)
			Global.BindingEngine.RegisterGrid(Global.BindingEngine.CurrentTab.id, this.Grid.DataView, ctrl);
		else
			Global.BindingEngine.RegisterGrid("div_TopLevelPanel", this.Grid.DataView, ctrl);
    }

    for(var itm in this.ExpFilters)
    {
        if(this.ExpFilters[itm].Clicked) delete this.ExpFilters[itm];
    }
}
EpiGroupGrid.prototype.Show=function()
{
    if(this.Visible) return;

    var ctrl = document.getElementById(this.Grid.ID); 
    var gridParts = this.Grid._getGridParts(ctrl);
    
    if(!gridParts["BodyGroup"])
    {
        var div=Global.document.createElement("DIV");
        div.className="EpiGrid-Bdy";
        ctrl.appendChild(div);
        gridParts["BodyGroup"]=div;
        EpiEventManager.addListener(div, "dblclick", this._dblclick, this, true);
        EpiEventManager.addListener(div, "click", this._click, this, true);
        
        this.Control=div;
    }

    gridParts["Header"].style.display="none";
    gridParts["Body"].style.display="none";
    gridParts["BodyGroup"].style.display="";  
    
    this.Visible=true;  
    this.Bind(gridParts);
    
}
EpiGroupGrid.prototype.Hide=function()
{
    var ctrl = document.getElementById(this.Grid.ID); 
    var gridParts = this.Grid._getGridParts(ctrl);
    
    if(gridParts["BodyGroup"]) gridParts["BodyGroup"].style.display="none";
            
    gridParts["Header"].style.display="";
    gridParts["Body"].style.display="";
    
    this.Visible=false;
    
    var dv=Global.BindingEngine.EpiDataViews[this.Grid.DataView];
    if(Global.Form instanceof EpiHostForm&&(dv instanceof BAQDataView||dv instanceof FilteredBAQDataView) && !dv.get_IsUpdatable()) 
        this.Grid.HasPaging=true;
        
    if(dv&&dv.dataView&&dv.dataView.Table.DataSet.CacheInfo) 
    {
        var ci=null;
        var ds=dv.dataView.Table.DataSet;
        if(ds&&ds.CacheInfo&&ds.CacheInfo.Views&&ds.CacheInfo.Views[dv.ViewName])
            ci=ds.CacheInfo.Views[dv.ViewName];
        else if(ds&&ds.CacheInfo)
            ci=ds.CacheInfo;
    
        this.Grid._pageSize=ci.End-ci.Start+1;
        this.Grid._page(ctrl);
    }
    else
    {            
        this.Grid.Bind(Global.BindingEngine,ctrl,Global.BindingEngine.EpiDataViews[this.Grid.DataView]);
        
        var me = this.Grid;
        setTimeout(function(){me._page(ctrl);}, 10);
    }
    
    if(gridParts["BodyGroup"])
    { 
        Global.Purge(gridParts["BodyGroup"]);
        gridParts["BodyGroup"].innerHTML="";
        for(var ii=0;ii<=this.Grids.length-1;ii++)
        {
            var gridID=this.Grids[ii];
            if(Global.BindingEngine.Controls[gridID])
            {
                Global.BindingEngine.ClearDVReg(Global.BindingEngine.EpiDataViews[gridID]);
                delete Global.GridManager.Grids[gridID];
                delete Global.BindingEngine.Controls[gridID];
                delete Global.BindingEngine.EpiDataViews[gridID];
            }
        }
        this.GridCnt=0;
        this.Grids=[];
    }
}
EpiGroupGrid.prototype._click=function(e)
{
    var ctrl = e.target||e.srcElement;
    if(ctrl.tagName=="IMG")
    {
        ctrl=ctrl.parentNode;
        var divs=ctrl.getElementsByTagName("DIV");
        if(divs.length==0||divs[0].style.display=="none")
            this.HandleExpand(ctrl,true);
        else
            this.HandleCollapse(ctrl);    
    }
}
EpiGroupGrid.prototype._dblclick=function(e)
{
    var ctrl = e.target||e.srcElement;
    if(ctrl.tagName=="SPAN") ctrl=ctrl.parentNode;
    if(ctrl.tagName=="DIV"&&ctrl.className=="EpiGrid-GrpRow")
    {
        var divs=ctrl.getElementsByTagName("DIV");
        if(divs.length==0||divs[0].style.display=="none")
            this.HandleExpand(ctrl,true);
        else
            this.HandleCollapse(ctrl);         
    }
}
EpiGroupGrid.prototype.HandleCollapse=function(ctrl)
{
    ctrl.getElementsByTagName("DIV")[0].style.display="none";
    ctrl.getElementsByTagName("IMG")[0].src="img/_plus.png";

    var idx=Convert.ToInt32(ctrl.getAttribute("_gb"));
    var val=ctrl.getAttribute("_val");
    var filter=ctrl.getAttribute("_filter");
    var srcGroup=this.Grid.GroupByColumns[idx];
    delete this.ExpFilters[filter+"|"+srcGroup.Key+"|"+val];
    
    this.Resize();
    this.Scroll();
}
EpiGroupGrid.prototype.HandleExpand=function(ctrl,clicked)
{
    this.Expanding=true;

    var idx=Convert.ToInt32(ctrl.getAttribute("_gb"));
    var val=ctrl.getAttribute("_val");
    var filter=ctrl.getAttribute("_filter");
    
    if(ctrl.getElementsByTagName("DIV").length>0)
    {
        ctrl.getElementsByTagName("DIV")[0].style.display="";
    }
    else
    {
        var srcGroup=this.Grid.GroupByColumns[idx];
        var obj=Global.BindingEngine.Controls[srcGroup.Col];
        this.ExpFilters[filter+"|"+srcGroup.Key+"|"+val]={"Clicked":clicked};
        
        var gridView=Global.BindingEngine.EpiDataViews[this.Grid.DataView];
        var ds=gridView.dataView.Table.DataSet;
        if(ds&&ds.CacheInfo)
        {
            if(filter.length>0) filter+=" AND ";
            filter+=obj.DataColumn+"='"+val+"'";
        }
        else
        {
            if(filter.length>0) filter+=" && ";
            filter+="o['" + obj.DataColumn+"']='"+val+"'";
        }
        
        try
        {
            if(this.Grid.GroupByColumns.length>idx+1)
            {
                this.ExpandLevel(++idx,filter,ctrl);
            }
            else
            {        
                this.ShowGrid(idx,filter,ctrl);
            }
        }
        catch(err)
        {
            this.Expanding=false;
            return;
        }
    }
    
    ctrl.getElementsByTagName("IMG")[0].src="img/_minus.png";
    
    this.Expanding=false;
    this.Scroll();
    this.Resize(true);

}
EpiGroupGrid.prototype.ShowGrid=function(groupByIdx,filter,parentCtrl)
{
    var gridView=Global.BindingEngine.EpiDataViews[this.Grid.DataView];
    if(gridView)
    {
        var gridName=this.Grid.ID+"_grd"+(this.GridCnt);
        
        var ds=gridView.dataView.Table.DataSet;
        if(ds&&ds.CacheInfo)
        {
            var newDS=new DataSet(this.Grid.ID+"_ds"+(this.GridCnt));
            newDS.CacheInfo={"CacheKey":ds.CacheInfo["CacheKey"]};
            var tbl=gridView.dataView.Table.Clone();
            tbl.TableName=gridView.dataView.Table.TableName;
            newDS.AddTable(tbl, new EpiOverloadedArgs("DataTable"));
            
            var dv=new DataView(tbl);
        }
        else
        {
        var dv = new DataView(gridView.dataView.Table);
        }

        dv.Sort=gridView.dataView.Sort;
        dv.OrigTable=gridView.dataView.OrigTable;
        dv.ServerFilter=gridView.dataView.ServerFilter;
        var edv=new EpiDataView(false,false,false);
        edv.ViewName=gridName;
        edv.set_dataView(dv);
        Global.BindingEngine.EpiDataViews[gridName]=edv;
        
        if(ds.CacheInfo)
        {
            var theFilter=filter;
            if(gridView.dataView.ServerFilter) 
            {
                if(theFilter!="") theFilter+=" AND ";
                theFilter+=gridView.dataView.ServerFilter;
            }
            try
            {
                Global.GetCachedDS(dv,0,25,theFilter,Global.BindingEngine.GridsByView[gridView.ViewName]);
            }
            catch(err)
            {
                throw(err);
            }
        }
        else
            dv.set_RowFilter(filter);

        this.GridCnt++;
        
        var outerDiv=this.CreateOuterDiv(groupByIdx,parentCtrl);
            
        var ctrl = document.getElementById(this.Grid.ID); 
        var gridParts = this.Grid._getGridParts(ctrl);
 
        var gridArr=[];
        gridArr.push("<div id='"+gridName+"' class='EpiGrid'>");
        gridArr.push("<div class='EpiGrid-Cpt' style='display:none'></div>");
        gridArr.push("<div class='EpiGrid-Hdr'>");
        gridArr.push(gridParts["Header"].innerHTML);
        gridArr.push("</div>");
        gridArr.push("<div class='EpiGrid-Bdy'>");
 
        tableArr=this.Grid._buildGrid(gridParts,edv);
        
        outerDiv.innerHTML = gridArr.join("")+tableArr.join("")+"</div></div>";
        
        var newGrid=Global.BindingEngine.Controls[gridName]=new EpiGrid({"ID":gridName,"DV":gridName,"AllowUpdate":false,"HasGroupByShown":false,"Columns":this.Grid._columns,"Dock":DockStyle.Fill});
        newGrid._hasSummariesShown=this.Grid._hasSummariesShown;
        newGrid.SummaryColumns=this.Grid.SummaryColumns;
        newGrid.IsGroupChild=true;
        newGrid.GroupFilter=filter;
        this.Grids.push(gridName);
        newGrid.HasPaging=this.Grid.HasPaging;

        Global.BindingEngine.GridsByView[edv.ViewName]=[newGrid];
        var cacheInfo=dv.Table.DataSet.CacheInfo;
        if(cacheInfo && cacheInfo.Views && cacheInfo.Views[edv.ViewName]) 
            newGrid.Summaries=cacheInfo.Views[edv.ViewName].Summaries;

        var grd=outerDiv.getElementsByTagName("DIV")[0];
		gridParts = newGrid._getGridParts(grd);
		if (Global.BindingEngine.CurrentTab)
			Global.BindingEngine.RegisterGrid(Global.BindingEngine.CurrentTab.id, gridName, grd);
		else
			Global.BindingEngine.RegisterGrid("div_TopLevelPanel", gridName, grd);

		// Row Rules
		var rows = gridParts["Body"].getElementsByTagName("table")[0].tBodies[0].rows;
		Global.BindingEngine.IsBindingReadOnlyGrid = true;
		for (var ii = 0, o; o = rows[ii]; ii++)
		{
			newGrid.RefreshProperties(grd, edv, ii);
		}
		Global.BindingEngine.IsBindingReadOnlyGrid = false;
		
		if(newGrid._hasSummariesShown) newGrid._refreshSummaries(true);
    }       
}
EpiGroupGrid.prototype.Resize=function(skipPaging)
{
    for(var ii=0;ii<=this.Grids.length-1;ii++)
    {
        var grd=Global.document.getElementById(this.Grids[ii]);

        var current=grd;
        var isHidden = (current.style.display=="none");
        while(!isHidden&&current!=this.Control&&current.parentNode)
        {
            current=current.parentNode;
            isHidden=(current.style.display=="none");
        }

        if(grd&&!isHidden)
        {
            this.ResizeGrid(grd.parentNode,skipPaging);
        }
    }
}
EpiGroupGrid.prototype.Scroll=function()
{
    var parentGrid=Global.document.getElementById(this.Grid.ID);
    var pGridParts = this.Grid._getGridParts(parentGrid);

    for(var ii=0;ii<=this.Grids.length-1;ii++)
    {
        var grd=Global.document.getElementById(this.Grids[ii]);
        if(grd&&grd.parentNode.style.display!="none")
        {
            var gridParts = this.Grid._getGridParts(grd);
            
            var offset=Global.GetOffset(grd,parentGrid);
            if(offset.y>pGridParts["GroupBy"].offsetHeight+pGridParts["Caption"].offsetHeight)
                gridParts["Header"].style.display="";
            else
                gridParts["Header"].style.display="none";       
                
            gridParts["Header"].style.top=offset.y+2+"px";            
        }
    }
}
EpiGroupGrid.prototype.ResizeGrid=function(outerDiv,skipPaging)
{
    var grd=outerDiv.getElementsByTagName("DIV")[0]; 
    var gridParts = this.Grid._getGridParts(grd);
    
    var scrollAdd=outerDiv.getAttribute("scrollAdd");
    var scrollbar=gridParts["BodyTable"].offsetWidth>outerDiv.offsetWidth&&scrollAdd!='true'?17:0;
    outerDiv.setAttribute("scrollAdd","true");

    var bodyHeight=gridParts["BodyTable"].offsetHeight;

    if(bodyHeight>200)
    {
        outerDiv.style.height=gridParts["BodyTable"].offsetWidth>outerDiv.offsetWidth?"218px":"200px";
    }
    else
    {
        if(gridParts["Body"].style.paddingTop=="")
            outerDiv.style.height=grd.offsetHeight+15+scrollbar+ "px";
        else
            outerDiv.style.height=grd.offsetHeight+scrollbar+ "px";
    }

    this.Grid.Resize(grd,outerDiv.offsetHeight,outerDiv.offsetWidth,{"Top":0,"Left":0,"Right":0,"Bottom":0},true);
}
EpiGroupGrid.prototype.CreateOuterDiv=function(groupByIdx,parentCtrl)
{
    var outerDiv=Global.document.createElement("DIV");
    outerDiv.className="EpiGrid-GrpHolder";
    
    if(Global.FormDir=="rtl")
        outerDiv.style.marginRight=(groupByIdx>0?"18px":"0px");
    else
        outerDiv.style.marginLeft=(groupByIdx>0?"18px":"0px");

    parentCtrl.appendChild(outerDiv);
    
    return outerDiv;
}
EpiGroupGrid.prototype.ExpandLevel=function(groupByIdx,filter,parentCtrl)
{
    var groupBy=this.Grid.GroupByColumns[groupByIdx];
    var obj=Global.BindingEngine.Controls[groupBy.Col];
    var dataCol=obj.DataColumn;
    var order=groupBy.Order;
    caption=groupBy.Caption;

    var gridView=Global.BindingEngine.EpiDataViews[this.Grid.DataView];

    try
    {
        var grpRows=this.GetGroupRows(dataCol,order,filter,gridView.dataView.ServerFilter,Global.BindingEngine.GridsByView[gridView.ViewName]);
    }
    catch(err)
    {
        throw(err);
    }
    if(grpRows.length>0)
    {
        var outerDiv=this.CreateOuterDiv(groupByIdx,parentCtrl);
        var arrow="<img src='img/_plus.png'/>";
        var ds=gridView.dataView.Table.DataSet;
        for(var ii=0;ii<=grpRows.length-1;ii++)
        {
            var sumStr="";
            
            if(grpRows[ii].Summaries)
            {
                for(var sc in this.Grid.SummaryColumns)
                {
                    var obj=Global.BindingEngine.Controls[this.Grid._columns[sc]];
                    if(obj&&grpRows[ii].Summaries[sc])
                    {
                        for(var flg in this.Grid.SummaryColumns[sc])
                        {
                            if(grpRows[ii].Summaries[sc][flg]!=null)
                            {
                                var val=grpRows[ii].Summaries[sc][flg];
                                if(flg!="Count") val=obj.Format(val);
                            
                                if(sumStr!="") sumStr+=", ";
                                else sumStr+=" ";
                                sumStr+=this.Grid.SummaryColumns[sc]["Caption"]+" " + flg + " = " + val;
                            }
                        }
                    }
                }
            }
        
            var itmStr=grpRows[ii].Count>1?" items":" item";
            
            var rtlEscape=Global.FormDir=="rtl"?"&rlm;":"";
        
            var div=Global.document.createElement("DIV");
            div.className="EpiGrid-GrpRow";
            div.innerHTML=arrow+"<SPAN class='EpiGrid-GrpRowCaption' onselectstart='return false' style='white-space:nowrap;'>" +caption+":&nbsp;" + grpRows[ii].Value + rtlEscape + "&nbsp;("+grpRows[ii].Count+itmStr+rtlEscape+")" + sumStr + "</SPAN>";
            div.setAttribute("_gb",groupByIdx);
            div.setAttribute("_val",grpRows[ii].Value);
            div.setAttribute("_filter",filter);
            div.style.whiteSpace="nowrap";
            
            if(groupByIdx==0&&ii==grpRows.length-1)
                div.style.borderBottomWidth="1px";
            
            outerDiv.appendChild(div);

            if(this.ExpFilters[filter+"|"+groupBy.Key+"|"+grpRows[ii].Value]) 
                this.HandleExpand(div,false);
        }
    }
    
    return grpRows.length;
}
EpiGroupGrid.prototype.GetGroupRows=function(grpCol,order,filter,serverFilter,grids)
{
    var dv=Global.BindingEngine.EpiDataViews[this.Grid.DataView];
    if(dv&&dv.dataView)
    {
        var tblName=dv.dataView.Table.TableName;
        if(dv.dataView.OrigTable) tblName=dv.dataView.OrigTable;
    
        var ds = dv.dataView.Table.DataSet;
        if(ds&&ds.CacheInfo)
        {
            if(serverFilter) 
            {
                if(filter=="")
                    filter=serverFilter;
                else
                    filter=filter+" AND "+serverFilter;
            }
            var summInfo={};
            if(filter&&filter!="") summInfo["filter_"+tblName]=[{"filter":filter}];
            
            var si=Global.GetSummaryInfo(grids);
            if(si) summInfo["summary_"+tblName]=si;

		    Global.LoadProxy("lib_Common");
		    try
		    {
                var lib = new lib_CommonService();
                lib.GetGroupByHeaderInfo(ds.CacheInfo.CacheKey, order=="Descending"?grpCol+" DESC":grpCol+" ASC", JSON.stringify(summInfo), null);

                var returnData = Global.ArgManager['Out1'];
                var obj=JSON.parse(returnData);
                grpRows=obj["Groups"];
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
        else
        {
            var sortSpec = grpCol + " ASC"; ;
            if (order == "Descending") sortSpec = grpCol + " DESC";
    
            var grpRows=[];
            var rows = dv.dataView.Table._Select(dv.BuildFilter(filter));
            dv.dataView.ApplySort(rows,sortSpec);
        
            var currRow=null;
            for(var ii=0;ii<=rows.length-1;ii++)
            {
                    if(!currRow||rows[ii][grpCol]!=currRow["Value"])
                {
                        currRow={"Value":rows[ii][grpCol],"Count":1};
                    grpRows.push(currRow);
                }
                else
                    currRow["Count"]++;
            }
        }
        return grpRows;
    }
    return [];
}

//------------------------------------
// EpiSearchGrid
//------------------------------------
var EpiSearchGrid = Epicor.Mfg.UI.FrameWork.EpiSearchGrid = function (settings)
{
    EpiGrid.call(this,settings);
    
}
EpiSearchGrid.prototype = new EpiGrid();


//------------------------------------
// EpiButton
//------------------------------------
var EpiButton = Epicor.Mfg.UI.FrameWork.EpiButton = function (settings)
{
    if(settings && settings.SkipProcessing==true) return;
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");
    
    if(settings) 
    {
        this.DialogResult = settings.DialogResult || "None";
        this.get_Event("Click").subscribe(this._click,this,true);
    }
}
EpiButton.prototype = new EpiControl({"SkipProcessing":true});
EpiButton.prototype.TypeName = "EpiButton";
EpiButton.prototype.hasContextMenu = false;
EpiButton.prototype.DialogResult = "None"; 
EpiButton.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
    if(this.DataView && this.DataColumn && rowNum>-1)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);
    this.RefreshProperties(ctrl, dv, rowNum);
    
    return true;
}
EpiButton.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{
    EpiControl.prototype.SetEnabled.call(this,ctrl,enabledFlg,toolsFlg);   
    
    if(ctrl.style.background!="")
    {
        if(!enabledFlg)
        {
            ctrl.style.cursor = "auto";
            if(Global.document.all)
                ctrl.style.filter = "alpha(opacity=40)";
            else
                ctrl.style.opacity = ".4";
        }
        else
        {
            ctrl.style.cursor = "pointer";
            if(Global.document.all)
                ctrl.style.filter = "";
            else
                ctrl.style.opacity = "";
        }
    }
 
    this.OnEnabledChanged(ctrl);   
}
EpiButton.prototype.set_IsEpiReadOnly=function(val) 
{
    EpiControl.prototype.set_IsEpiReadOnly.call(this,val);  
    this.SetEnabled(Global.document.getElementById(this.ID),!val);
}
EpiButton.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
    }
}
EpiButton.prototype.set_Appearance=function(app)
{
    if(app.Image!=null)
    {
        this.set_Image(app.Image);
    }
}
EpiButton.prototype._initFocus=function(ctrl)
{
    if(!this._focusinit)
    {
        EpiEventManager.addListener(ctrl, "focus", this._focusin, this, true);
        this._focusinit=true;
    }
}
EpiButton.prototype.set_DialogResult=function(val)
{
    this.DialogResult=val;
}
EpiButton.prototype._click = function(sender, e)
{
    if (Global.Form.trans && this.DataView && this.DataColumn)
    {
        var fn=function(){return Global.Form.trans.OnButtonClicked(this)};
        Global.BindingEngine.RunInThread(this,fn,[]);
        //Global.Form.trans.OnButtonClicked(this);
    }
    if (this.DialogResult != "None" && !Global.Form.isModeLess) // Modeless forms dont close automatically
    {
        // Some events can be scheduled before close
        // 'Global.Form.Close' method is returned to be run after all event listeners execution
        Global.Form.set_DialogResult(this.DialogResult, true); // will NOT close the form
        return new EpiEventDelayedCallback(Global.Form.Close);
    }
    else
        Global.Form.DialogResult = this.DialogResult;
}
EpiButton.prototype.SetText = function(ctrl, val)
{
    ctrl.innerHTML = val;
}
EpiButton.prototype.GetText = function(ctrl)
{
    return ctrl.innerHTML;
}
EpiButton.prototype.set_Image = function(img)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(img)
    {
        ctrl.style.background ="url"+"('"+img.Path+"')";
        ctrl.style.backgroundRepeat='no-repeat';
        ctrl.style.backgroundPosition='center center';
    }
    else
    {
        ctrl.style.background ="";
    }
}
EpiButton.prototype.GetHtmlForGrid=function(id,row,dt)
{
    var val = this.GetValFromRow(dt,row,this.DataColumn); 

    if(!val) val = "&nbsp";
    return "<input type='button' id='" + id + "' class='EpiButton' value='" + val + "' />";
}
EpiButton.prototype.GetEnabled=function(ctrl)
{
    return !(ctrl.disabled);
}

//------------------------------------
// EpiPictureButton
//------------------------------------
var EpiPictureButton = Epicor.Mfg.UI.FrameWork.EpiPictureButton = function (settings)
{
    EpiControl.call(this,settings);
}
EpiPictureButton.prototype = new EpiButton();
EpiPictureButton.prototype.TypeName = "EpiPictureButton";
EpiPictureButton.prototype.GetEnabled=function(ctrl)
{
    if(this.InGrid)
    {
        if(ctrl.tagName!="DIV") 
        {
            var div = ctrl.parentNode.getElementsByTagName("DIV");
            if(div) ctrl = div[0];
        }
        return !(ctrl.className == "disabled");
    }
    else
    {
         return (!ctrl.disabled);
    }
}
EpiPictureButton.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);
    
    if(this.InGrid)
    {
        this.SetEnabledInGrid(ctrl, enabledFlg);   
    }
    else
    {
        ctrl.disabled=!enabledFlg;
        
        if(!enabledFlg)
        {
            ctrl.style.cursor = "auto";
            if(Global.document.all)
                ctrl.style.filter = "alpha(opacity=40)";
            else
                ctrl.style.opacity = ".4";
        }
        else
        {
            ctrl.style.cursor = "pointer";
            if(Global.document.all)
                ctrl.style.filter = "";
            else
                ctrl.style.opacity = "";
        }
    }    
    this.OnEnabledChanged(ctrl);
}
//------------------------------------
// EpiGroupBox
//------------------------------------
var EpiGroupBox = Epicor.Mfg.UI.FrameWork.EpiGroupBox = function (settings)
{
    EpiControl.call(this,settings);    
}
EpiGroupBox.prototype = new EpiControl();
EpiGroupBox.prototype.TypeName = "EpiGroupBox";
EpiGroupBox.prototype.hasContextMenu = false;
EpiGroupBox.prototype.SetEnabled=function(ctrl, enabledFlg,toolsFlg)
{
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);
    var beCtrls = Global.BindingEngine.Controls;
    for (var c = ctrl.firstChild; c; c = c.nextSibling) 
    {
        if(c.nodeType==1 && c.id)
        {
            var obj = beCtrls[c.id];
            if (obj)
            {
                obj.SetEnabled(c,enabledFlg,toolsFlg);
                obj.isDisabled= !enabledFlg; // In the win this property is set via the DisableControls/EnableControls method.
            }
        }
    }
    
   // ctrl.disabled=!enabledFlg; // No need to disabled the Groupbox itself, causing textboxes to appear disabled but allow text input.
    this.OnEnabledChanged(ctrl);
}
EpiGroupBox.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        var spanElems = ctrl.getElementsByTagName("SPAN");   
        spanElems[0].style.width = (bounds.Width-3>0?bounds.Width-3:0) + "px"; 
        spanElems[0].style.height = (bounds.Height-8>0?bounds.Height-8:0) + "px"; 
        spanElems[1].style.width = (bounds.Width-3>0?bounds.Width-3:0) + "px"; 
        spanElems[1].style.height = (bounds.Height-8>0?bounds.Height-8:0) + "px"; 
        
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 

        this.resizeChildren(ctrl,bounds.Height,bounds.Width);
        
        var lblElems = ctrl.getElementsByTagName("LABEL");
        if(Global.FormDir=="rtl"&&lblElems[0]&&lblElems[0].className=="EpiGroupBoxLabel")
        {
            lblElems[0].style.left = (bounds.Width-3>0?bounds.Width-3:0) - lblElems[0].offsetWidth - 6 + "px";
        }
    }
}
//------------------------------------
// EpiListBox
//------------------------------------
var EpiListBox = Epicor.Mfg.UI.FrameWork.EpiListBox = function (settings)
{
    EpiControl.call(this,settings);
  
    this.SelectionMode = settings.SelectionMode;
  
    this.SelectedIndex = -1;
    this.SelectedItems = new ArrayList();
    this.Items = new ArrayList();
    
    this.Items.get_Event("ItemAdded").subscribe(this._itemAdded, this, true);
    this.Items.get_Event("ItemRemoved").subscribe(this._itemRemoved, this, true);
}
EpiListBox.prototype = new EpiControl();
EpiListBox.prototype.TypeName = "EpiListBox";
EpiListBox.prototype.SelectedIndex = -1;
EpiListBox.prototype.SelectedItem = null;
EpiListBox.prototype.get_Items=function()
{
    return this.Items;
}
EpiListBox.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height-8>0?bounds.Height-8:0) + "px"; 
        ctrl.style.width = (bounds.Width-3>0?bounds.Width-3:0) + "px"; 
    }
}
EpiListBox.prototype._mousedown=function(e)
{
    var ctrl = e.target||e.srcElement;
    var tr = ctrl.parentNode;
    var tbl = Global.GetParentByTag(tr, "TABLE", true);
    var div = tbl.parentNode;
    
    var shiftKey = Global.KeyboardManager.ShiftKey;
    var ctrlKey = Global.KeyboardManager.CtrlKey;
    
    var rowIdx = tr.rowIndex;

    if((shiftKey==true || ctrlKey==true) && this.SelectionMode=="MultiExtended")
    {
        if(ctrlKey || this.SelectedIndex==-1)
        {
            this.set_SelectedIndex(rowIdx);
        }
        else if(shiftKey)
        {
            var shiftLower, shiftUpper;
            if(this.SelectedIndex > rowIdx) 
            {
                shiftLower = rowIdx;
                shiftUpper = this.SelectedIndex;
            }
            else
            {
                shiftLower = this.SelectedIndex;
                shiftUpper = rowIdx;
            }
            this.ClearSelected(div);
            for(var ii=0; ii<=tbl.rows.length-1; ii++)
            {
                if(ii>=shiftLower && ii<=shiftUpper)
                    this.set_SelectedIndex(ii);
            }
        }
    }
    else
    {
        this.ClearSelected(div);
        this.set_SelectedIndex(tr.rowIndex);
    }
    this._focusin(tbl);
}
EpiListBox.prototype._itemAdded=function(ea)
{
    var ctrl = Global.document.getElementById(this.ID);
    var tbl = ctrl.getElementsByTagName("table")[0];
	
    var tr = tbl.insertRow(ea.Index);
    var cell = tr.insertCell(-1);
    cell.tabIndex = 0;
    var val = ea.Value;
    if (typeof (val) ==  'object')
    {
        if (ea.Value.ToString)
            val = ea.Value.ToString(); // Apps code overrides this method
    }
    cell.appendChild(Global.document.createTextNode(val));    
    
    EpiEventManager.addListener(cell, "mousedown", this._mousedown, this, true);
}
EpiListBox.prototype._change=function(e)
{
    var ctrl = e.target||e.srcElement;  
    this._selectedIndexChanged(ctrl);  
}
EpiListBox.prototype._itemRemoved=function(ea)
{
    var ctrl = Global.document.getElementById(this.ID);
    var tbl = ctrl.getElementsByTagName("table")[0];
    Global.Purge(tbl.tBodies[0].rows[ea.Index]);
    tbl.tBodies[0].deleteRow(ea.Index);
}

EpiListBox.prototype.SetSelected=function(idx,val)
{
    if (val == true) // Select the row
    {
       this.set_SelectedIndex(idx);
    }
    else
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(idx<this.Items.Count)
        {
            var tbl = ctrl.getElementsByTagName("table")[0];
            tbl.rows[idx].className = "";
            tbl.rows[idx].setAttribute("_selected", "false");
        }
        this.SelectedItems.RemoveAt(idx);        
    }
}
EpiListBox.prototype.set_SelectedIndex=function(idx)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(idx<this.Items.Count)
    {
        var tbl = ctrl.getElementsByTagName("table")[0];
        tbl.rows[idx].className = "itemselected";
        tbl.rows[idx].setAttribute("_selected", "true");
    }
    this.SelectedIndex = idx;
    this._selectedIndexChanged(ctrl);
}
EpiListBox.prototype.get_SelectedIndex=function()
{
    if(this.Items.Count==0)
        return -1;
    else
        return this.SelectedIndex;
}
EpiListBox.prototype.get_SelectedItem=function()
{
    if(this.SelectedIndex>-1)
    {
        return this.Items[this.SelectedIndex];
    }
    return null;
}
EpiListBox.prototype.get_SelectedItems=function()
{
    return this.SelectedItems;
}
EpiListBox.prototype.ClearSelected=function(ctrl)
{
    var tbl = ctrl.getElementsByTagName("table")[0];
    for(var ii=0; ii<=tbl.rows.length-1; ii++)
    { 
        tbl.rows[ii].className = "";
        tbl.rows[ii].setAttribute("_selected", "false");
    } 

    this.SelectedItems.Clear();
}
EpiListBox.prototype.SelectAll=function(ctrl)
{
    var tbl = ctrl.getElementsByTagName("table")[0];
    for(var ii=0; ii<=tbl.rows.length-1; ii++)
    { 
        tbl.rows[ii].className = "itemselected";
        tbl.rows[ii].setAttribute("_selected", "true");
    } 

    this._selectedIndexChanged(ctrl);
}
EpiListBox.prototype._selectedIndexChanged=function(ctrl)
{
    this.SelectedItems.Clear();

    var tbl = ctrl.getElementsByTagName("table")[0];
    for(var ii=0; ii<=tbl.rows.length-1; ii++)
    { 
        if(tbl.rows[ii].getAttribute("_selected")=="true")
        {
            this.SelectedItems.Add(this.Items[ii]);
        }
    } 
    
    this.SelectedItem = null;
    if(this.SelectedIndex > -1)       
        this.SelectedItem = this.Items[this.SelectedIndex];

    this.get_Event("SelectedIndexChanged").fire(Global.BindingEngine.Controls[ctrl.id], {}); 
}
//------------------------------------
// EpiListPickerPanel
//------------------------------------
var EpiListPickerPanel = Epicor.Mfg.UI.FrameWork.EpiListPickerPanel = function (settings)
{
    EpiControl.call(this,settings);
    
    this.isSortable = false;
    if(settings.Sortable==true) this.isSortable = true;
    this.source = settings.Source;
    this.target = settings.Target;
    this.selectBtn = settings.SelectBtn;
    this.selectAllBtn = settings.SelectAllBtn;
    this.deselectBtn = settings.DeSelectBtn;
    this.deselectAllBtn = settings.DeSelectAllBtn;
    
    if(this.isSortable)
    {
        this.sortUpBtn = settings.SortUpBtn;
        this.sortDownBtn = settings.SortDnBtn;
    }

    this.sourceFilterCol = "";
    this.targetFilterCol = "";
    this.preserveSourceList = false;
    this.listChanged = false;
    this.columnsValues;
    this.sourceHash = null;
    
    this.BindingMode = {"TargetRowsSourceRows":0,"TargetCodeDescSourceCodeDesc":1,"TargetCodeSourceRows":2,"TargetCodeDescSourceRows":3};
    this.bindingMode = null;  
    this._adding=false;

    if (Global.Form) Global.Form.get_Event("Load").subscribe(this.ctor, this, true);
    if (Global.Form) Global.Form.get_Event("Load").subscribe(this._load, this, true);
}
EpiListPickerPanel.prototype = new EpiControl();
EpiListPickerPanel.prototype.TypeName = "EpiListPickerPanel";
EpiListPickerPanel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 

        this.resizeChildren(ctrl,bounds.Height,bounds.Width);  
        
        var lbSourceList = Global.document.getElementById(this.source);
        var lbTargetList = Global.document.getElementById(this.target);
        var pnlButtons = Global.document.getElementById(this.selectBtn).parentNode; 

        var labels = ctrl.getElementsByTagName("LABEL");
        var lblSource, lblTarget;
        if(labels.length==2)
        {
            lblSource = labels[0];
            lblTarget = labels[1];  
        }

        if(Global.FormDir=="ltr")
        {
            pnlButtons.style.left = (ctrl.offsetWidth/2)-(pnlButtons.offsetWidth/2) + "px";
        
            lbSourceList.style.width = pnlButtons.offsetLeft - lbSourceList.offsetLeft + "px";
            lbTargetList.style.left = pnlButtons.offsetWidth + pnlButtons.offsetLeft - 5 + "px";
            lbTargetList.style.width = lbSourceList.offsetWidth + "px";

            if(lblSource) lblSource.style.left = lbSourceList.offsetLeft + "px";
            if(lblTarget) lblTarget.style.left = lbTargetList.offsetLeft + "px";
        }
        else
        {
            pnlButtons.style.left = (ctrl.offsetWidth/2)-(pnlButtons.offsetWidth/2) + "px";

            lbTargetList.style.width = pnlButtons.offsetLeft - 10 + "px";
            lbTargetList.style.left="10px";
            lbSourceList.style.left = pnlButtons.offsetWidth + pnlButtons.offsetLeft - 5 + "px";
            lbSourceList.style.width = lbTargetList.offsetWidth + "px";

            if(lblSource) lblSource.style.left = lbSourceList.offsetLeft + lbSourceList.offsetWidth - lblSource.offsetWidth + "px";
            if(lblTarget) lblTarget.style.left = lbTargetList.offsetLeft + lbTargetList.offsetWidth - lblTarget.offsetWidth + "px";
        }

        var selectBtn = Global.document.getElementById(this.selectBtn);
        var deselectBtn = Global.document.getElementById(this.deselectBtn);
        var selectAllBtn = Global.document.getElementById(this.selectAllBtn);
        var deselectAllBtn = Global.document.getElementById(this.deselectAllBtn);

        if(this.isSortable)
        {
            var sortUpBtn = Global.document.getElementById(this.sortUpBtn);
            var sortDownBtn = Global.document.getElementById(this.sortDownBtn);

            var buttonsHeight=selectBtn.offsetHeight+deselectBtn.offsetHeight+selectAllBtn.offsetHeight+
                deselectAllBtn.offsetHeight+sortUpBtn.offsetHeight+25;

            var top = 0;
            if(buttonsHeight>pnlButtons.offsetHeight) top = (pnlButtons.offsetHeight/2) - buttonsHeight/2;

            selectBtn.style.top = top+"px";
            selectAllBtn.style.top = selectBtn.offsetTop + selectBtn.offsetHeight + 5 +"px";
            sortUpBtn.style.top = selectAllBtn.offsetTop + selectAllBtn.offsetHeight + 5 +"px";
            sortDownBtn.style.top = selectAllBtn.offsetTop + selectAllBtn.offsetHeight + 5 +"px";
            deselectBtn.style.top = sortDownBtn.offsetTop + sortDownBtn.offsetHeight + 5 +"px";
            deselectAllBtn.style.top = deselectBtn.offsetTop + deselectBtn.offsetHeight + 5 +"px";
        }
        else
        {
            var buttonsHeight=selectBtn.offsetHeight+deselectBtn.offsetHeight+selectAllBtn.offsetHeight+
            deselectAllBtn.offsetHeight+20;

            var top = 0;
            if(buttonsHeight<pnlButtons.offsetHeight) top = (pnlButtons.offsetHeight/2) - buttonsHeight/2;

            selectBtn.style.top = top+"px";
            selectAllBtn.style.top = selectBtn.offsetTop + selectBtn.offsetHeight + 5 +"px";
            deselectBtn.style.top = selectAllBtn.offsetTop + selectAllBtn.offsetHeight + 5 +"px";
            deselectAllBtn.style.top = deselectBtn.offsetTop + deselectBtn.offsetHeight + 5 +"px";
        }
    }
}
EpiListPickerPanel.prototype.set_ParentEpiDataView=function(value)
{
    if (this.bindingMode == this.BindingMode.TargetRowsSourceRows)
    {
        this.oDataView = value;
    }
}
EpiListPickerPanel.prototype.ResetButtons=function()
{
    var srcList = Global.BindingEngine.Controls[this.source];
    if(srcList) srcList.ClearSelected(Global.document.getElementById(this.source));
    
    var targetList = Global.BindingEngine.Controls[this.target];
    if(targetList) targetList.ClearSelected(Global.document.getElementById(this.target));

    this.enableDisableButtons();
}
EpiListPickerPanel.prototype._load = function()
{
    var ctrls = Global.BindingEngine.Controls;

    var targetObj = ctrls[this.target];
    var srcObj = ctrls[this.source];
    var selectObj = ctrls[this.selectBtn];
    var selectAllObj = ctrls[this.selectAllBtn];
    var deselectObj = ctrls[this.deselectBtn];
    var deselectAllObj = ctrls[this.deselectAllBtn];

    if(Global.FormDir=="rtl")
    {
        var selectBtn = Global.document.getElementById(this.selectBtn);
        var deselectBtn = Global.document.getElementById(this.deselectBtn);
        var selectAllBtn = Global.document.getElementById(this.selectAllBtn);
        var deselectAllBtn = Global.document.getElementById(this.deselectAllBtn);
    
        selectBtn.className="EpiPictureButton deselectBtn";
        deselectBtn.className="EpiPictureButton selectBtn";
        selectAllBtn.className="EpiPictureButton deselectAllBtn";
        deselectAllBtn.className="EpiPictureButton selectAllBtn";
    }

    targetObj.get_Event("SelectedIndexChanged").subscribe(this.lbTargetList_SelectedIndexChanged, this, true);
    srcObj.get_Event("SelectedIndexChanged").subscribe(this.lbSourceList_SelectedIndexChanged, this, true);

    selectObj.get_Event("Click").subscribe(this.selectButton_Click, this, true);
    selectAllObj.get_Event("Click").subscribe(this.selectButton_Click, this, true);
    deselectObj.get_Event("Click").subscribe(this.deselectButton_Click, this, true);
    deselectAllObj.get_Event("Click").subscribe(this.deselectButton_Click, this, true);

    if (this.isSortable)
    {
        var sortUpObj = ctrls[this.sortUpBtn];
        var sortDnObj = ctrls[this.sortDownBtn];
        sortUpObj.get_Event("Click").subscribe(this.sortList, this, true);
        sortDnObj.get_Event("Click").subscribe(this.sortList, this, true);
    }
}
EpiListPickerPanel.prototype.lbSourceList_SelectedIndexChanged=function()
{
    var targetObj = Global.BindingEngine.Controls[this.target];
	if (targetObj.SelectedItems.Count > 0)
	{
		this.deSelectTarget();
	}
	this.enableDisableButtons();
}
EpiListPickerPanel.prototype.lbTargetList_SelectedIndexChanged=function()
{
    var sourceObj = Global.BindingEngine.Controls[this.source];
	if (sourceObj.SelectedItems.Count > 0)
	{
		this.deSelectSource();
	}
	this.enableDisableButtons();
}
EpiListPickerPanel.prototype.get_SourceList=function()
{
    if (this.sourceHash != null)
        return this.sourceHash;
    else
    {
        var srcList = Global.BindingEngine.Controls[this.source];
        return srcList.get_Items();
    }
}
EpiListPickerPanel.prototype.set_SourceList=function(ctrl, value)
{
    if (ctrl instanceof Hashtable && typeof value == "undefined")
    {
        value = ctrl;
        ctrl = Global.document.getElementById(this.ID);
    }
    
	if (value != null)
	{	
	    var srcList = Global.document.getElementById(this.source);

	    var obj = Global.BindingEngine.Controls[this.source];
	    obj.Items.Clear(srcList);

	    if(value instanceof Hashtable)
	    {
		    this.sourceHash = value;
		    var values = value.get_Values();
	
		    for (var o in values.items)
		    {
			    obj.Items.Add(values[o]);
		    }
	    }
        else
        {
		    for (var o in value)
		    {
			    obj.Items.Add(o);
		    }
	    }

        this.enableDisableButtons();
	}
}
EpiListPickerPanel.prototype.get_TargetList=function()
{
    if (this.targetHash != null)
        return this.targetHash;
    else
    {
        var srcList = Global.BindingEngine.Controls[this.target];
        return srcList.get_Items();
    }
}
EpiListPickerPanel.prototype.set_TargetList=function(ctrl, value)
{
    if (ctrl instanceof Hashtable && typeof value == "undefined")
    {
        value = ctrl;
        ctrl = Global.document.getElementById(this.ID);
    }
            
	if (value != null)
	{
	    var tList = Global.document.getElementById(this.target);
	    var sList = Global.document.getElementById(this.source);
	    var obj = Global.BindingEngine.Controls[this.target];
	    
		obj.Items.Clear(ctrl);
		if(value instanceof Hashtable)
		{
			this.targetHash = value;
			if(!this.preserveSourceList)
			{
			    var sourceModified = false;
			    var keys = value.get_Keys();
			    
			    for(var o in keys.items)
			    {
			        if(this.sourceHash.ContainsKey(keys[o]))
			        {
			            this.sourceHash.Remove(keys[o]);
			            sourceModified = true;
			        }
			    }
			    if(sourceModified) this.set_SourceList(ctrl, this.sourceHash);
			}
			var values = value.get_Values();
			
			for (var o in values.items)
			{
				obj.Items.Add(values[o]);
			}
		}
		else
		{
			for(var o in value)
			{
				obj.Items.Add(tList, o);
			}
		}
        this.enableDisableButtons();
	}
}
EpiListPickerPanel.prototype.enableDisableButtons=function(ctrl)
{
    var sBtn = Global.document.getElementById(this.selectBtn);
    var saBtn = Global.document.getElementById(this.selectAllBtn);
    var dBtn = Global.document.getElementById(this.deselectBtn);
    var daBtn = Global.document.getElementById(this.deselectAllBtn);

    if(this.isSortable)
    {
        var suBtn = Global.document.getElementById(this.sortUpBtn);
        var sdBtn = Global.document.getElementById(this.sortDownBtn);
    }

    var ctrls = Global.BindingEngine.Controls;

	if (this.get_IsEpiReadOnly())
	{
        ctrls[this.selectBtn].SetEnabled(sBtn, false, true);
        ctrls[this.selectAllBtn].SetEnabled(saBtn, false, true);
        ctrls[this.deselectBtn].SetEnabled(dBtn, false, true);
        ctrls[this.deselectAllBtn].SetEnabled(daBtn, false, true);
        
        if(this.isSortable)
        {
            ctrls[this.sortUpBtn].SetEnabled(suBtn, false, true);
            ctrls[this.sortDownBtn].SetEnabled(sdBtn, false, true);
        }
	}
	else
	{
	    var src = ctrls[this.source];
	    var targ = ctrls[this.target];
	
	    ctrls[this.selectBtn].SetEnabled(sBtn, (src.SelectedItems.Count>0), true);
        ctrls[this.selectAllBtn].SetEnabled(saBtn, (src.Items.Count>0), true);
        ctrls[this.deselectBtn].SetEnabled(dBtn, (targ.SelectedItems.Count>0), true);
        ctrls[this.deselectAllBtn].SetEnabled(daBtn, (targ.Items.Count>0), true);
        
        if(this.isSortable)
        {
            ctrls[this.sortUpBtn].SetEnabled(suBtn, (targ.SelectedItems.Count==1 && targ.SelectedIndex!=0), true);
            ctrls[this.sortDownBtn].SetEnabled(sdBtn, (targ.SelectedItems.Count==1 && targ.SelectedIndex!=targ.Items.Count-1), true);
        }
    }
}
EpiListPickerPanel.prototype.deSelectTarget=function()
{
    var obj = Global.BindingEngine.Controls[this.target];
    obj.ClearSelected(Global.document.getElementById(this.target));    
}
EpiListPickerPanel.prototype.deSelectSource=function()
{
    var obj = Global.BindingEngine.Controls[this.source];
    obj.ClearSelected(Global.document.getElementById(this.source));    
}
EpiListPickerPanel.prototype.oDataView_EpiViewNotificationDelim=function(view, args)
{
    var ctrl = Global.document.getElementById(this.ID)

	this.targetHash.Clear();
	this.sourceHash.Clear();
	var origSource = new Hashtable();
	if(this.sourceListDataView.dataView.Count > 0) { this.get_Event("BeforePickerSourceLoad").fire(this, {"FilterCol":"", "FilterVal":""}); }
	for(var i=0; i<this.sourceListDataView.dataView.Count; i++)
	{
		this.sourceHash.Add(this.sourceListDataView.dataView.Rows[i][this.sCodeFieldName], this.sourceListDataView.dataView.Rows[i][this.sDescFieldName]);
		origSource.Add(this.sourceListDataView.dataView.Rows[i][this.sCodeFieldName], this.sourceListDataView.dataView.Rows[i][this.sDescFieldName]);
	}
	
	if(this.targetListDataView.dataView.Count > 0) { this.get_Event("BeforePickerTargetLoad").fire(this, {"FilterCol":"", "FilterVal":""}); }
    var code = "";
    var row = this.targetListDataView.Row;
	if (row > -1)
	{
		var codes = this.targetListDataView.dataView.Rows[row][this.tCodeFieldName].split(this.delim);
		for(var i=0; i<codes.length; i++)
		{
			code = codes[i];
			var desc = origSource[code];
			if((code.length > 0) && (desc!=null))
			{
				this.targetHash.Add(code, desc);
				if(!this.preserveSourceList) 
					this.sourceHash.Remove(code);
			}
		}
	}			
	this.set_SourceList(ctrl, this.sourceHash);
	this.set_TargetList(ctrl, this.targetHash);
}
EpiListPickerPanel.prototype.oDataView_EpiViewNotificationNoDelim=function(view, args)
{
    if(this._adding) return;

    var ctrl = Global.document.getElementById(this.ID)

	this.targetHash.Clear();
	this.sourceHash.Clear();
    var origSource = new Hashtable();
  
    if(this.sourceListDataView.dataView.Count > 0) {this.get_Event("BeforePickerSourceLoad").fire(this, {"FilterCol":"", "FilterVal":""});}
	for(var i=0; i<this.sourceListDataView.dataView.Count; i++)
	{
		var addIt = true;
		if(this.sourceFilterCol.length != 0)
			if(this.sourceListDataView.dataView.Rows[i][this.sourceFilterCol] != this.sourceFilterVal)
				addIt = false;
		if(addIt)
			this.sourceHash.Add(this.sourceListDataView.dataView.Rows[i][this.sCodeFieldName], this.sourceListDataView.dataView.Rows[i][this.sDescFieldName]);
		origSource.Add(this.sourceListDataView.dataView.Rows[i][this.sCodeFieldName], this.sourceListDataView.dataView.Rows[i][this.sDescFieldName]);
	}

    if(this.targetListDataView.dataView.Count > 0) { this.get_Event("BeforePickerTargetLoad").fire(this, {"FilterCol":"", "FilterVal":""}); }
	for(var i=0; i<this.targetListDataView.dataView.Count; i++)
	{
		var addIt = true;
		if(this.targetFilterCol.length != 0)
			if(this.targetListDataView.dataView.Rows[i][this.targetFilterCol] != this.targetFilterVal)
				addIt = false;
		if(addIt)
		{
			var code = this.targetListDataView.dataView.Rows[i][this.tCodeFieldName];
			var desc = origSource.items[code];
			if((code.length > 0) && (desc!=null))
			{
				this.targetHash.Add(code, desc);
				if(!this.preserveSourceList) 
					this.sourceHash.Remove(code);
			}
		}
	}
		
	this.set_SourceList(ctrl, this.sourceHash);
	this.set_TargetList(ctrl, this.targetHash);
}

EpiListPickerPanel.prototype.oDataView_EpiViewNotification=function(view, args)
{
	var ctrl = Global.document.getElementById(this.ID);
	if(args.Row == -1)
	{
		this.clearHashTables();
		this.enableSelectaAlls();
		return;
	}
	var sCodeArr = this.oDataView.dataView.Rows[args.Row][this.sCodeFieldName].toString().split(this.delim);
	var sDescArr = this.oDataView.dataView.Rows[args.Row][this.sDescFieldName].toString().split(this.delim);
	var tCodeArr = this.oDataView.dataView.Rows[args.Row][this.tCodeFieldName].toString().split(this.delim);
	var tDescArr = this.oDataView.dataView.Rows[args.Row][this.tDescFieldName].toString().split(this.delim);

    this.sourceHash.Fill(sCodeArr, sDescArr);
    this.targetHash.Fill(tCodeArr, tDescArr);

	this.set_SourceList(ctrl, this.sourceHash);
	this.set_TargetList(ctrl, this.targetHash);
}
EpiListPickerPanel.prototype.oDataView_EpiViewNotificationTCodeOnly=function(view, args)
{
    var ctrl = Global.document.getElementById(this.ID);
	if(args.Row == -1)
	{
		this.clearHashTables();
		this.enableSelectaAlls();
		return;
	}

	var _selectedCodes = this.oDataView.dataView.get_Row(this.oDataView.Row).get_Item(this.tCodeFieldName).split(this.delim);
	var _selectedDesc = new Array(_selectedCodes.length);
	var _sourceCodes = new ArrayList();
	var _sourceDesc = new ArrayList();
	if(this.sourceListDataView.dataView.Table.Rows.Count == 0) { return; }

	for(var sourceRow in this.sourceListDataView.dataView.Table.Rows)
	{
	    var theRow = this.sourceListDataView.dataView.Table.Rows[sourceRow];
	
		var foundIndex = Array.IndexOf(_selectedCodes, theRow[this.sCodeFieldName]);
		if(foundIndex >= 0)
		{
			_selectedDesc[foundIndex] = theRow[this.sDescFieldName];
		}
		if((Array.IndexOf(_selectedCodes, theRow[this.sCodeFieldName]) < 0) || this.preserveSourceList)
		{	
			_sourceCodes.Add(theRow[this.sCodeFieldName]);
			_sourceDesc.Add(theRow[this.sDescFieldName]);
		}
	}

    this.sourceHash.Fill(_sourceCodes, _sourceDesc);
    this.targetHash.Fill(_selectedCodes, _selectedDesc);
	
	this.set_SourceList(ctrl, this.sourceHash);
	this.set_TargetList(ctrl, this.targetHash);
}
EpiListPickerPanel.prototype.oDataView_EpiViewNotificationTCodeTDescOnly=function(view, args)
{
    // Can't find any InitDataBind in the app that would trigger this.
    
    var ctrl = Global.document.getElementById(this.ID);
	if(args.Row == -1)
	{
		this.clearHashTables();
		this.enableSelectaAlls();
		return;
	}
	var _selectedCodes = this.oDataView.dataView.Rows[this.oDataView.Row][this.tCodeFieldName].split(this.delim);
	var _selectedDesc  = this.oDataView.dataView.Rows[this.oDataView.Row][this.tDescFieldName].split(this.delim);
	var _sourceCodes = new ArrayList();
	var _sourceDesc = new ArrayList();

	if(this.sourceListDataView.dataView.Table.Rows.Count == 0) { return; }
    for(var sourceRow in this.sourceListDataView.dataView.Table.Rows)
	{
	    var theRow = this.sourceListDataView.dataView.Table.Rows[sourceRow];
        if((Array.IndexOf(_selectedCodes, theRow[this.sCodeFieldName]) < 0) || this.preserveSourceList)
		{	
			_sourceCodes.Add(theRow[this.sCodeFieldName]);
			_sourceDesc.Add(theRow[this.sDescFieldName]);
		}
	}

    this.sourceHash.Fill(_sourceCodes, _sourceDesc);
    this.targetHash.Fill(_selectedCodes, _selectedDesc);
	
	this.set_SourceList(ctrl, this.sourceHash);
	this.set_TargetList(ctrl, this.targetHash);
}
EpiListPickerPanel.prototype.EpiListPickerPanel_GotFocus=function()
{
    // TODO 
}
EpiListPickerPanel.prototype.selectButton_Click=function(sender, e)
{
    var srcObj = Global.BindingEngine.Controls[this.source];
    var targetObj = Global.BindingEngine.Controls[this.target];

    if(sender.ID==this.selectAllBtn)
        var sels = srcObj.Items;
    else
        var sels = srcObj.SelectedItems;

	var indexToSelect = srcObj.SelectedIndex - 1;

	for (var obj in sels.items)
	{
		if (!targetObj.Items.Contains(sels.items[obj]))
		{
			targetObj.Items.Add(sels.items[obj]);
			if(this.targetHash != null) { this.moveToTargetHash(sels.items[obj]); }
		}
	}
	if(!this.preserveSourceList) 
	{ 
		this.removeItemsFromSourceList(sels); 
	}

	this.enableSelectaAlls();

	if(!this.preserveSourceList)
	{
		if(indexToSelect > -1 && (indexToSelect < srcObj.Items.Count))
		{
			srcObj.set_SelectedIndex(indexToSelect);
		}
		else
		{
			if(srcObj.Items.Count > 0)
				srcObj.set_SelectedIndex(0);
		}
	}

    this.listChanged = true;

    if(this.oDataView != null){ this.updateSourceData(); }
    this.get_Event("PickerListChanged").fire(); 
    
    this.enableDisableButtons();
}
EpiListPickerPanel.prototype.deselectButton_Click=function(sender, e)
{
    var srcObj = Global.BindingEngine.Controls[this.source];
    var targetObj = Global.BindingEngine.Controls[this.target];

    if(sender.ID==this.deselectAllBtn)
        var sels = targetObj.Items;
    else
        var sels = targetObj.SelectedItems;

	var indexToSelect = targetObj.SelectedIndex - 1;

    var arr = new ArrayList();
	for (var obj in sels.items)
	{
		arr.Add(sels.items[obj]);
	}
	for (var obj in arr.items)
	{
		targetObj.Items.Remove(arr.items[obj]);
		if(this.sourceHash != null) { this.moveToSourceHash(arr.items[obj]); }
		if(!srcObj.Items.Contains(arr.items[obj]))
		{
			srcObj.Items.Add(arr.items[obj]);
		}
	}

	targetObj.ClearSelected(Global.document.getElementById(this.target));

	this.enableSelectaAlls();

	if(indexToSelect > -1)
	{
		targetObj.set_SelectedIndex(indexToSelect);
	}
	else
	{
		if(targetObj.Items.Count > 0)
		{
			targetObj.set_SelectedIndex(0);
		}
	}

	this.listChanged = true;
	
	if(this.oDataView != null) { this.updateSourceData(); }
    this.get_Event("PickerListChanged").fire();
    
    this.enableDisableButtons();
}

EpiListPickerPanel.prototype.enableSelectaAlls=function()
{
	var src = Global.document.getElementById(this.source);
	var tgt = Global.document.getElementById(this.target);

	this.enableDisableButtons();

	Global.BindingEngine.Controls[this.source].ClearSelected(src);
	Global.BindingEngine.Controls[this.target].ClearSelected(tgt);
}
EpiListPickerPanel.prototype.removeItemsFromSourceList=function(sourceList)
{
    var source = Global.BindingEngine.Controls[this.source];

	var arr = new ArrayList();
	for (var obj in sourceList.items)
	{
		arr.Add(sourceList.items[obj]);
	}
	for(var obj in arr.items)
	{
		if(source.Items.Contains(arr.items[obj]))
		{
			source.Items.Remove(arr.items[obj]);
		}
	}
}
EpiListPickerPanel.prototype.moveToTargetHash=function(obj)
{
	if (!this.targetHash.ContainsValue(obj))
	{
		var sourceHashEnum = this.sourceHash.GetEnumerator();
		while (sourceHashEnum.MoveNext())
		{
			if(sourceHashEnum.Value == obj)
			{
				this.targetHash.Add(sourceHashEnum.Key, sourceHashEnum.Value);
				if(!this.preserveSourceList) { this.sourceHash.Remove(sourceHashEnum.Key); }
				break;
			}
		}
	}
}
EpiListPickerPanel.prototype.moveToSourceHash=function(obj)
{
	if (!this.sourceHash.ContainsValue(obj))
	{
		var targetHashEnum = this.targetHash.GetEnumerator();
		while (targetHashEnum.MoveNext())
		{
			if(targetHashEnum.Value == obj)
			{
				this.sourceHash.Add(targetHashEnum.Key, targetHashEnum.Value);
				this.targetHash.Remove(targetHashEnum.Key);
				break;
			}
		}
	}
}
EpiListPickerPanel.prototype.clearHashTables=function()
{
    var ctrl = Global.document.getElementById(this.ID)
    
	this.sourceHash.Clear();
	this.targetHash.Clear();
	this.set_SourceList(ctrl, this.sourceHash);
	this.set_TargetList(ctrl, this.targetHash);
	this.enableDisableButtons();
}
EpiListPickerPanel.prototype.sortList=function(sender, e)
{
    var sortUp = true;
    if(sender.ID==this.sortDownBtn) sortUp = false;

	var targetObj = Global.BindingEngine.Controls[this.target];
	
	if(targetObj.SelectedIndex > -1)
	{	
		var selIndex = targetObj.SelectedIndex;
		var newIndex = -1;
		var selString=targetObj.Items.items[selIndex];

		var key = this.targetHash.get_Keys()[selIndex];
		if(sortUp)
		{
			if(selIndex > 0)
			{
				newIndex = selIndex - 1;
				targetObj.Items.Insert(newIndex, selString);
				targetObj.Items.RemoveAt(selIndex+1);

			    this.targetHash.Remove(key);
			    this.targetHash.Insert(selIndex-1, key, selString);

			}
		}
		else
		{
			if(selIndex < targetObj.Items.Count - 1)
			{
				newIndex = selIndex + 2;
				targetObj.Items.Insert(newIndex, selString);
				targetObj.Items.RemoveAt(selIndex);
				newIndex--;
				
			    this.targetHash.Remove(key);
			    this.targetHash.Insert(selIndex+1, key, selString);
			}
		}

		if(newIndex >-1) targetObj.set_SelectedIndex(newIndex);

		if(this.oDataView != null) { this.updateSourceData(); }
		this.listChanged = true;
        this.get_Event("PickerListChanged").fire(); 
	}
}
EpiListPickerPanel.prototype.updateSourceData=function()
{
	switch(this.bindingMode)
	{
		case this.BindingMode.TargetCodeDescSourceCodeDesc:
			this.updateTargetCodeDescSourceCodeDesc();
			break;
		case this.BindingMode.TargetCodeDescSourceRows:
			this.updateTargetCodeDescSourceRows();
			break;
		case this.BindingMode.TargetCodeSourceRows:
			this.updateTargetCodeSourceRows();
			break;
		case this.BindingMode.TargetRowsSourceRows:
			this.updateTargetRowsSourceRows();
			break;
	}
}
EpiListPickerPanel.prototype.updateTargetCodeDescSourceCodeDesc=function()
{
	var tCodeString = "";
	var tDescString = "";
	var sCodeString = "";
	var sDescString = "";
		
    var targetEnum = this.targetHash.GetEnumerator();
	while(targetEnum.MoveNext())
	{
		tCodeString += targetEnum.Key + this.delim;
		tDescString += targetEnum.Value + this.delim;
	}
	tCodeString = tCodeString.TrimEnd(this.delim);
	tDescString = tDescString.TrimEnd(this.delim);

	var sourceEnum = this.sourceHash.GetEnumerator();
	while(sourceEnum.MoveNext())
	{
		sCodeString += sourceEnum.Key + this.delim;
		sDescString += sourceEnum.Value + this.delim;
	}
	sCodeString = sCodeString.TrimEnd(this.delim);
	sDescString = sDescString.TrimEnd(this.delim);

    this.oDataView.dataView.get_Row(this.oDataView.Row).BeginEdit();
	this.oDataView.SetValue(this.oDataView.Row, this.tCodeFieldName, tCodeString, true);
	this.oDataView.SetValue(this.oDataView.Row, this.tDescFieldName, tDescString, true);
	this.oDataView.SetValue(this.oDataView.Row, this.sCodeFieldName, sCodeString, true);
	this.oDataView.SetValue(this.oDataView.Row, this.sDescFieldName, sDescString, true);
	this.oDataView.dataView.get_Row(this.oDataView.Row).EndEdit();
}
EpiListPickerPanel.prototype.updateTargetCodeDescSourceRows=function()
{
    // Can't find any InitDataBind in the app that would trigger this.
    var tCodeString = "";
    var tDescString = "";
    var targetEnum = this.targetHash.GetEnumerator();
	while(targetEnum.MoveNext())
	{
		tCodeString += targetEnum.Key + this.delim;
		tDescString += targetEnum.Value + this.delim;
	}
	tCodeString = tCodeString.TrimEnd(this.delim);
	tDescString = tDescString.TrimEnd(this.delim);

    this.oDataView.dataView.get_Row(this.oDataView.Row).BeginEdit();
	this.oDataView.SetValue(this.oDataView.Row, this.tCodeFieldName, tCodeString, true);
	this.oDataView.SetValue(this.oDataView.Row, this.tDescFieldName, tDescString, true);
	this.oDataView.dataView.get_Row(this.oDataView.Row).EndEdit();
}
EpiListPickerPanel.prototype.updateTargetCodeSourceRows=function()
{
	var tCodeString = "";
    var targetEnum = this.targetHash.GetEnumerator();
	while(targetEnum.MoveNext())
	{
		tCodeString += targetEnum.Key + this.delim;
	}
	tCodeString = tCodeString.TrimEnd(this.delim);

    this.oDataView.dataView.get_Row(this.oDataView.Row).BeginEdit();
	this.oDataView.SetValue(this.oDataView.Row, this.tCodeFieldName, tCodeString, true);
	this.oDataView.dataView.get_Row(this.oDataView.Row).EndEdit();
}
EpiListPickerPanel.prototype.updateTargetRowsSourceRows=function()
{
    var hashKeys = this.targetHash.get_Keys();
 	for(var k in hashKeys.items)
	{
	    var code = hashKeys[k];
	    
		var existing=false;
		for(var i=0; i<this.targetListDataView.dataView.Count; i++)
		{
			if(this.targetListDataView.dataView.Rows[i][this.tCodeFieldName]==code)
			{
				existing=true;
				break;
			}
		}

		if(!existing)
		{
		    var dv = this.targetListDataView.dataView;
           
            //Fire before row insert to implementer can assign columnsValues if necessary.
		    var e = {"ColumnsValues": new Hashtable(),"InsertCodeValue":code};
		    this.get_Event("BeforeRowInsert").fire(this,e);
		    this.columnsValues = e.ColumnsValues;
		    
		    this._adding=true;
		    var idx = dv.Table.AddRow({});
            var newRow = dv.Table.get_Row(idx);
            this._adding=false;
            this.InitAddedListPickerRow(dv.Table, newRow);
			newRow[this.tCodeFieldName]=code;
			if(this.parentRelatedFieldName == null)
				newRow[this.relatedFieldName]=this.oDataView.dataView.Rows[this.oDataView.Row][this.relatedFieldName];
			else
				newRow[this.relatedFieldName]=this.oDataView.dataView.Rows[this.oDataView.Row][this.parentRelatedFieldName];
			if(dv.Table.Columns["Company"])
				newRow["Company"]=this.oDataView.dataView.Rows[this.oDataView.Row]["Company"];
			if(dv.Table.Columns["RowMod"])
				newRow["RowMod"]="A";

			if(this.columnsValues != null)
			{
				var colValEnum = this.columnsValues.GetEnumerator();
				while(colValEnum.MoveNext())
				{
					newRow[colValEnum.Key] = colValEnum.Value.toString();
				}
			}
			newRow.EndEdit();
		}
	}

    var tempHash=this.targetHash.Clone();
	var targetViewCount = this.targetListDataView.dataView.Count;
	for(var i=0; i<targetViewCount; i++)
	{
		try
		{
			if(this.targetListDataView.dataView.Count == 0) break;

			if(i >= this.targetListDataView.dataView.Count)
			{
				targetViewCount = this.targetListDataView.dataView.Count;
				i=0;
			}
            var r = this.targetListDataView.dataView.get_Row(i);

			if(!hashKeys.Contains(r[this.tCodeFieldName]))
				r.Delete();
		}
		catch(e) {ExceptionBox.Show(e);}
	}
	this.targetHash=tempHash;

	if(this.targetListDataView.dataView.Count > 0)
		this.targetListDataView.Row = this.targetListDataView.dataView.Count-1;
	else
		this.targetListDataView.Row = -1;
}
EpiListPickerPanel.prototype.InitAddedListPickerRow=function(table, Row)
{
	for(var col in table.Columns)
	{
	    column = table.Columns[col];
	    
	    if(col!="RowMod")
	    {	    
	        switch(column.DataType)
	        {
	            case "System.Boolean":
	                Row[col]="false";
	                break;
	            case "System.Int16":
	            case "System.Int32":
	            case "System.Int64":
	            case "System.Double":
	            case "System.Decimal":
	                Row[col]="0";
	                break;
	            case "System.String":
	                Row[col]="";
	                break;
	        }
	    }
	}
}
EpiListPickerPanel.prototype.InitDataBind = function()  // list picker panel
{
    var a = arguments;
    var tempArray = new Array();
    for (i = 0; i < a.length; i++) { tempArray[i] = a[i] }
    var overload = Global.GetOLSeqForArgTypes(tempArray);

    switch (overload)
    {
        case "Char_EpiDataView_String_String_EpiDataView_String_EpiTransaction":
            return this.InitDataBind_1(a[0], a[1], a[2], a[3], a[4], a[5]);
            break;
        case "EpiDataView_String_String_EpiDataView_String_String_String_EpiTransaction":
            return this.InitDataBind_2(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
            break;
        case "EpiDataView_String_String_EpiDataView_String_String_EpiTransaction":
            return this.InitDataBind_3(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
            break;
        case "Char_String_String_String_String_String_EpiTransaction":
            return this.InitDataBind_4(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
            break;
        case "Char_String_String_EpiTransaction":
            return this.InitDataBind_5(a[0], a[1], a[2], a[3]);
            break;
        case "String_String_String_Char_String_String_EpiTransaction":
            return this.InitDataBind_6(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
            break;
        case "String_String_String_Char_String_String_String_EpiTransaction":
            return this.InitDataBind_7(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
            break;
    }

    return;
}
EpiListPickerPanel.prototype.InitDataBind_1=function(Delimiter, SourceView, SourceCodeCol, SourceDescCol, TargetView, TargetCodeCol, Tran)
{
    this.sourceHash = new Hashtable();
    this.targetHash = new Hashtable();
	this.sCodeFieldName = SourceCodeCol;
	this.sDescFieldName = SourceDescCol;
	this.tCodeFieldName = TargetCodeCol;
	this.targetListDataView = TargetView;
	this.sourceListDataView = SourceView;
	this.oDataView = TargetView;
	this.delim = Delimiter;
	this.oTran = Tran;
	
	this.bindingMode = this.BindingMode.TargetCodeSourceRows;
	
	// TODO:  The next line shouldn't be here... change after changing Notify
	this.sourceListDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotificationDelim, this,true);
	this.targetListDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotificationDelim, this,true);
}
EpiListPickerPanel.prototype.InitDataBind_2=function(SourceView, SourceCodeCol, SourceDescCol, TargetView, TargetCodeCol, ParentRelatedCol, ChildRelatedCol, Tran)
{
    this.parentRelatedFieldName = ParentRelatedCol;
	this.InitDataBind_3(SourceView, SourceCodeCol, SourceDescCol, TargetView, TargetCodeCol, ChildRelatedCol, Tran);
}
EpiListPickerPanel.prototype.InitDataBind_3=function(SourceView, SourceCodeCol, SourceDescCol, TargetView, TargetCodeCol, RelatedCol, Tran)
{
	this.sourceHash = new Hashtable();
	this.targetHash = new Hashtable();
	this.sCodeFieldName = SourceCodeCol;
	this.sDescFieldName = SourceDescCol;
	this.tCodeFieldName = TargetCodeCol;
	this.relatedFieldName = RelatedCol;
	this.targetListDataView = TargetView;
	this.sourceListDataView = SourceView;
	this.oDataView = TargetView.ParentView;
	this.oTran = Tran;
	
	this.bindingMode = this.BindingMode.TargetRowsSourceRows;
	// TODO:  The next line shouldn't be here... change after changing Notify
	this.sourceListDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotificationNoDelim, this,true);
	
	this.targetListDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotificationNoDelim, this,true);
}
EpiListPickerPanel.prototype.InitDataBind_4=function(Delimiter, SourceCodeCol, SourceDescCol, TargetCodeCol, TargetDescCol, TableName, Trans)
{
	this.sourceHash = new Hashtable();
	this.targetHash = new Hashtable();
	this.sCodeFieldName = SourceCodeCol;
	this.sDescFieldName = SourceDescCol;
	this.tCodeFieldName = TargetCodeCol;
	this.tDescFieldName = TargetDescCol;
	this.delim = Delimiter;
	
    this.oDataView = Trans.Factory(TableName);
	this.bindingMode = this.BindingMode.TargetCodeDescSourceCodeDesc;
	
	if(this.oDataView)
        this.oDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotification, this,true);
}
EpiListPickerPanel.prototype.InitDataBind_5=function(Delimiter, TargetCodeCol, TableName, Trans)
{
	this.delim = Delimiter;
    this.oDataView = Trans.Factory(TableName);
	this.tCodeFieldName = TargetCodeCol;
}
EpiListPickerPanel.prototype.InitDataBind_6=function(SourceTableName, SourceCodeCol, SourceDescCol, Delimiter, TargetCodeCol, TargetTableName, Trans)
{
	this.sourceHash = new Hashtable();
	this.targetHash = new Hashtable();
	this.delim = Delimiter;
    this.oDataView = Trans.Factory(TargetTableName);
    this.sourceListDataView = Trans.Factory(SourceTableName);
	this.tCodeFieldName = TargetCodeCol;
	this.sCodeFieldName = SourceCodeCol;
	this.sDescFieldName = SourceDescCol;
	
	this.bindingMode = this.BindingMode.TargetCodeSourceRows;
	
	if(this.oDataView)
        this.oDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotificationTCodeOnly, this,true);
}
EpiListPickerPanel.prototype.InitDataBind_7=function(SourceTableName, SourceCodeCol, SourceDescCol, Delimiter, TargetCodeCol, TargetDescCol, TargetTableName, Trans)
{ // Not being used now...
    this.sourceHash = new Hashtable();
    this.targetHash = new Hashtable();
    this.delim = Delimiter;
    this.oDataView = Trans.Factory(TargetTableName);
    this.sourceListDataView = Trans.Factory(SourceTableName);
    this.tCodeFieldName = TargetCodeCol;
    this.tDescFieldName = TargetDescCol;
    this.sCodeFieldName = SourceCodeCol;
    this.sDescFieldName = SourceDescCol;
    
    this.bindingMode = this.BindingMode.TargetCodeDescSourceRows;
    
    if(this.oDataView)
        this.oDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotificationTCodeTDescOnly, this,true);
}
//------------------------------------
// EpiAddressPickerPanel
//------------------------------------
var EpiAddressPickerPanel = Epicor.Mfg.UI.FrameWork.EpiAddressPickerPanel = function (settings)
{
    EpiControl.call(this,settings);
    this.TypeName = "EpiAddressPickerPanel";
    this._enabled=true;
    
    this.targetCodes = new ArrayList();
    this.sourceCodes = new ArrayList();
    this.source = settings.Source;
    this.target = settings.Target;
    this.selectBtn = settings.SelectBtn;
    this.deselectBtn = settings.DeSelectBtn;
    
    this.codesDesc = "";
    this.rowDelim = "~";
    this.valDelim = "`";
    this.gridRows = 8;

	this.strCompany = EpiString.getString("Company");
	this.strAddress1 = EpiString.getString("Address1");
	this.strAddress2 = EpiString.getString("Address2");
	this.strAddress3 = EpiString.getString("Address3");
	this.strCity = EpiString.getString("City");
	this.strState = EpiString.getString("State");
	this.strPostaCode = EpiString.getString("PostalCode")
	this.strCountry = EpiString.getString("Country");
	
	this.set_CodesDesc("<CP>`" + this.strCompany + "~<A1>`" + this.strAddress1 + "~<A2>`" + this.strAddress2 + "~<A3>`" + this.strAddress3 + "~<CT>`" + this.strCity +  "~<ST>`" + this.strState + "~<ZP>`" + this.strPostaCode + "~<CR>`" + this.strCountry);  

	if(Global.Form) Global.Form.get_Event("Load").subscribe(this.Init, this,true);
	if(Global.Form) Global.Form.get_Event("Load").subscribe(this.ctor, this,true);
}
EpiAddressPickerPanel.prototype = new EpiControl();
EpiAddressPickerPanel.prototype.TypeName = "EpiAddressPickerPanel";
EpiAddressPickerPanel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 

        this.resizeChildren(ctrl,bounds.Height,bounds.Width);    
    }
}
EpiAddressPickerPanel.prototype.Init=function()
{
    var selectBtn = Global.document.getElementById(this.selectBtn);
    var deselectBtn = Global.document.getElementById(this.deselectBtn);

    if(Global.FormDir=="rtl")
    {
        selectBtn.className="EpiPictureButton deselectBtn";
        deselectBtn.className="EpiPictureButton selectBtn";
    }

	// Create table and dataset
	var tblName = "tbl_" + this.ID;
	var tblStruct = {};
	var columnsObj={};
	columnsObj["Address_"+this.target]={"Address":{"DataType":"System.String", "ExtendedProperties":{}}};
	
	this.dt = new DataTable(tblName, {"Columns":columnsObj});
	tblStruct[tblName] = this.dt;
	this.ds = new DataSet();
	this.ds.AddTables(tblStruct);
	
	// Create the dataview that will be bound to the grid.
    var addrView = new EpiDataView();
    addrView.set_dataView(new DataView(this.dt));
    addrView.ViewName = tblName;
    Global.BindingEngine.EpiDataViews[tblName] = addrView;
    this.GridDataView = addrView;
    
    this.oDataView = Global.BindingEngine.EpiDataViews[this.DataView];
    
	var grd = Global.BindingEngine.Controls[this.target];
	grd.DataView = tblName;
	
	var rr;
	rr = new RowRule("1",RuleCondition.Equals,"1");
	rr.AddAction(RuleAction.DisableRow(this,tblName));
	addrView.AddRowRule(rr);

	// Add the Address Format column
	var ctrl = Global.document.getElementById(this.target);
	ctrl.childNodes[1].style.display = "none";

	if(!grd._columns["Address_"+this.target])
	    grd.AddColumn(ctrl, this.dt, {"ColumnName":"Address_"+this.target,"ColumnWidth":-1, "ColumnCaption":"", "Enabled":false},true);
	
	this.InitGrid();
	this.EventSetup();
}

EpiAddressPickerPanel.prototype.GetEnabled=function(ctrl)
{
    return !(Global.BindingEngine.Controls[this.source].GetEnabled(Global.document.getElementById(this.source)));
}

EpiAddressPickerPanel.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{
    this._enabled=enabledFlg;
    var ctrls = Global.BindingEngine.Controls;
    
    ctrls[this.source].SetEnabled(Global.document.getElementById(this.source), enabledFlg, true);
    
    if(enabledFlg==false)
    {
        ctrls[this.selectBtn].SetEnabled(Global.document.getElementById(this.selectBtn), enabledFlg, true);
        ctrls[this.deselectBtn].SetEnabled(Global.document.getElementById(this.deselectBtn), enabledFlg, true);
    }
    else
    {
        this.enableDisableButtons();
    }
    this.OnEnabledChanged(ctrl);
}
EpiAddressPickerPanel.prototype.InitGrid=function()
{
    var tblName = "tbl_" + this.ID;
	
    var str = "";
	for(var i = 0; i<this.gridRows; i++)
	{
	    if(i>0) str+=",";
	    str += '{"Address_' + this.target + '":""}';
	}
	str = '{"' + tblName + '":[' + str + ']}';
	var jsonData = JSON.parse(str);
	
	this.ds.Load(jsonData, EpiBindType.Full, true);
		
	this.dt.AcceptChanges();
	this.ds.Changed=false;
}
EpiAddressPickerPanel.prototype.EventSetup=function()
{
// TODO	this.Enter += new EventHandler(this_gotFocus);
    this.oDataView.get_Event("EpiViewNotification").subscribe(this.oDataView_EpiViewNotification, this,true);
    Global.BindingEngine.Controls[this.source].get_Event("SelectedIndexChanged").subscribe(this.lpSource_SelectedIndexChanged, this,true);
    Global.BindingEngine.Controls[this.target].get_Event("ActiveRowChanged").subscribe(this.lpTarget_ActiveRowChanged, this,true);
    Global.BindingEngine.Controls[this.selectBtn].get_Event("Click").subscribe(this.btnAdd_Click, this,true);
    Global.BindingEngine.Controls[this.deselectBtn].get_Event("Click").subscribe(this.btnRemove_Click, this,true);
}
EpiAddressPickerPanel.prototype.this_gotFocus=function()
{
    // TODO
}
EpiAddressPickerPanel.prototype.oDataView_EpiViewNotification=function(view, ar)
{
	if (ar.Row < 0) 
		this.clearAll();
	else 
		this.loadLists(ar.Row);
		
    this.enableDisableButtons();
}
EpiAddressPickerPanel.prototype.clearAll=function()
{
	this.targetCodes.Clear();
	this.sourceCodes.Clear();
	
	var ctrls = Global.BindingEngine.Controls;
	ctrls[this.source].Items.Clear();
	this.InitGrid();
}
EpiAddressPickerPanel.prototype.loadLists=function(viewRow)
{
    this.targetCodes.Clear();
    
	for(var s in this.targetRowStack)
	{
		this.targetRowStack[s].Clear();
	}
	this.InitGrid();
    var rowNum = 0;  

    var rows = this.oDataView.dataView.Rows[viewRow][this.DataColumn].split(this.rowDelim);
	for(var row in rows)
	{
		var vals = rows[row].split(this.valDelim);
		this.targetRowStack[rowNum].Clear();
		for(var val in vals)
		{
			if(vals[val].length==0) { break; }
			this.targetRowStack[rowNum].Push(vals[val]);

			if(this.targetCodes.IndexOf(vals[val]) < 0)
				this.targetCodes.Add(vals[val]);
		}
		rowNum ++;
		if(rowNum == this.targetRowStack.length) { rowNum --; }
	}

    this.sourceCodes.Clear();
    var codeDescEnum = this.codeDescHash.GetEnumerator();
	while(codeDescEnum.MoveNext())
	{
		if(this.targetCodes.IndexOf(codeDescEnum.Key) < 0)
			this.sourceCodes.Add(codeDescEnum.Key);  
	}

    this.loadSourceListPicker();

	if(this.targetCodes.Count > 0)
	{
		this.InitGrid();
		var index = 0;
		for(var rowStack in this.targetRowStack)
		{
			var desc = "";
			var stackEnum = this.targetRowStack[rowStack].GetEnumerator();
			while(stackEnum.MoveNext())
			{
			    desc = this.codeDescHash[stackEnum.Current] + " " + desc;
			}
			desc = desc.TrimEnd(' ');
			this.GridDataView.SetValue(index,"Address_"+this.target, desc, true);
			index++;
		}
		this.dt.AcceptChanges();

	}
	
	this.ds.Changed = false;
}
EpiAddressPickerPanel.prototype.loadSourceListPicker=function()
{
    var srcObj = Global.BindingEngine.Controls[this.source];
    
    srcObj.Items.Clear();
	for(var code in this.sourceCodes.items)
	{
		srcObj.Items.Add(this.codeDescHash[this.sourceCodes.items[code]]);
	}
}
EpiAddressPickerPanel.prototype.TextValidate=function()
{   
    var colValue = this.buildColString();
	if (this.oDataView.dataView.Count > 0)
	{
	    var rowObj = this.oDataView.dataView.get_Row(this.oDataView.Row);
        var cVal = rowObj[this.DataColumn];
		try 
		{
			if (colValue != cVal)
			{
                rowObj.BeginEdit();
                this.oDataView.SetValue(this.oDataView.Row, this.DataColumn, colValue, true);
                rowObj.EndEdit();
			}
		} 
		catch(err) 
		{
	        // TODO Don't allow focus out until fixed.
			ExceptionBox.Show(err, ExceptionBox.ExceptionBoxIcon.Error);
		}
	}
}
EpiAddressPickerPanel.prototype.buildColString=function()
{
    var colString = "";
    var blank = true;
	for(var rowStack in this.targetRowStack)
	{
		var codes = "";
        var rowStackEnum = this.targetRowStack[rowStack].GetEnumerator();
		while(rowStackEnum.MoveNext())
		{
			codes = rowStackEnum.Current + this.valDelim + codes;
		}
		codes = codes.TrimEnd(this.valDelim);
		if(codes.length > 0)
			blank = false;
		colString += codes + this.rowDelim;
	}
	if(!blank)
	    colString = colString.substr(0, colString.length-1);
	else
		colString = "";
	return colString;
}
EpiAddressPickerPanel.prototype.SetCodesDesc=function(ctrl, value)
{
    this.codesDesc = value;
    this.parseCodesDesc(ctrl);
}
EpiAddressPickerPanel.prototype.set_CodesDesc=function(value)
{
    this.SetCodesDesc(null, value);
}
EpiAddressPickerPanel.prototype.parseCodesDesc=function(ctrl)
{
	if(this.codeDescHash == null) { this.codeDescHash = new Hashtable(); }
	
	this.codeDescHash.Clear();
	var valPairs = this.codesDesc.split(this.rowDelim);
	for(var row in valPairs)
	{
        var elem = valPairs[row].split(this.valDelim);
		if(elem.length == 2)
		{
		    this.codeDescHash.Add(elem[0], elem[1]);
		}
	}

    this.targetRowStack = new Array(this.codeDescHash.Count);
	for(var i = 0; i<this.codeDescHash.Count; i++)
	{
		this.targetRowStack[i] = new Stack();
	}
	gridRows = this.codeDescHash.Count;
}
EpiAddressPickerPanel.prototype.lpTarget_ActiveRowChanged=function(sender, e)
{
    this.enableDisableButtons();
}
EpiAddressPickerPanel.prototype.lpSource_SelectedIndexChanged=function(sender, e)
{
    this.enableDisableButtons();
}
EpiAddressPickerPanel.prototype.btnAdd_Click=function(sender, e)
{
    var srcObj = Global.BindingEngine.Controls[this.source];

	if(srcObj.SelectedItem != null)
	{
	    var indexToSelect = srcObj.SelectedIndex;
		var oItem = srcObj.SelectedItem;

		this.addToTarget(oItem);
		srcObj.Items.Remove(oItem);
		
		if(indexToSelect > -1 && (indexToSelect < srcObj.Items.Count))
		{
			srcObj.set_SelectedIndex(indexToSelect);
		}
		else
		{
			if(srcObj.Items.Count > 0)
				srcObj.set_SelectedIndex(0);
		}
	}
	
	this.enableDisableButtons();
}
EpiAddressPickerPanel.prototype.addToTarget=function(desc)
{
	var code = this.codeDescHash.KeyOf(desc);
	if(!(this.sourceCodes.IndexOf(code) < 0))
	{
		this.sourceCodes.Remove(code);
	}
	if(this.targetCodes.IndexOf(code) < 0)
	{
	    var grdObj = Global.BindingEngine.Controls[this.target];

		this.targetCodes.Add(code);
		this.targetRowStack[grdObj.ActiveRow.ListIndex].Push(code);
		var row = grdObj.ActiveRow.ListIndex;
		
		var rowObj = this.dt.get_Row(row);
		var str = rowObj["Address_"+this.target];
		
		str=str.length!=0?str+" "+desc:desc;
        rowObj.BeginEdit();
	    this.GridDataView.SetValue(row, "Address_"+this.target, str, true);
		rowObj.EndEdit();
		this.dt.AcceptChanges();
        
        this.TextValidate();
	}
}
EpiAddressPickerPanel.prototype.btnRemove_Click=function(sender, e)
{
    var grdObj = Global.BindingEngine.Controls[this.target];
    var srcObj = Global.BindingEngine.Controls[this.source];
    
    var row = grdObj.ActiveRow.ListIndex;
	if(this.targetRowStack[row].Count == 0) { return; }
    var code = this.targetRowStack[row].Pop();
    var desc = this.codeDescHash[code];
    this.targetCodes.Remove(code);
	if(this.sourceCodes.IndexOf(code) < 0)
	{
		this.sourceCodes.Add(code);
		srcObj.Items.Add(desc);
	}
	var rowObj = this.dt.get_Row(row);
    var rowDesc = rowObj["Address_"+this.target];
       
    rowObj.BeginEdit();
    rowDesc = rowDesc.Replace(desc + " ", "");
	rowDesc = rowDesc.Replace(desc, "");
    this.GridDataView.SetValue(row, "Address_"+this.target, rowDesc, true);
    rowObj.EndEdit();
	this.dt.AcceptChanges();
    this.TextValidate();
        
    this.enableDisableButtons();
}
EpiAddressPickerPanel.prototype.enableDisableButtons=function()
{
    if(this._enabled)
    {
        var grdObj = Global.BindingEngine.Controls[this.target];
        var srcObj = Global.BindingEngine.Controls[this.source];
       
        var grdRow = grdObj.ActiveRow.ListIndex;
        Global.BindingEngine.Controls[this.deselectBtn].SetEnabled(Global.document.getElementById(this.deselectBtn), (grdRow >= 0) && (this.targetRowStack[grdRow].Count > 0), true);
        Global.BindingEngine.Controls[this.selectBtn].SetEnabled(Global.document.getElementById(this.selectBtn), (srcObj.Items.Count>0 && srcObj.SelectedItem!=null), true);
    }
}
//------------------------------------
// EpiLabel
//------------------------------------
var EpiLabel = Epicor.Mfg.UI.FrameWork.EpiLabel = function (settings)
{
    EpiControl.call(this,settings);
}
EpiLabel.prototype = new EpiControl();
EpiLabel.prototype.TypeName = "EpiLabel";
EpiLabel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
    }
}
EpiLabel.prototype.SetText=function(ctrl,val)
{
    ctrl.innerHTML = val;
}
EpiLabel.prototype.GetText=function(ctrl)
{
    return ctrl.innerHTML;
}
//------------------------------------
// EpiPictureBox
//------------------------------------
var EpiPictureBox = Epicor.Mfg.UI.FrameWork.EpiPictureBox = function (settings)
{
    EpiControl.call(this,settings);
    this.Image = null;
    
    this.EpiHideControl = false;
    if(settings) this.EpiHideControl = settings.EpiHideControl || false;
}
EpiPictureBox.prototype = new EpiControl();
EpiPictureBox.prototype.TypeName = "EpiPictureBox";
EpiPictureBox.prototype.get_Image = function () { return this.Image; }

EpiPictureBox.prototype.set_Image=function(val) 
{
	var ctrl = Global.document.getElementById(this.ID);
	if(ctrl) this.SetImage(ctrl,val);
}
EpiPictureBox.prototype.SetImage=function(ctrl, image)
{
    this.Image = image;
    
    if(image)
        ctrl.style.backgroundImage = "url(" + image.Path + ")";
    else
        ctrl.style.backgroundImage = "";
}
EpiPictureBox.prototype.GetHtmlForGrid=function(id, row,dt)
{
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    var dc = this.DataColumn;
    if(!dv.dataView.Table.Columns[dc] && !dv.HasViewImageColumn(dc)) return "<div />";
    
    if(dv.HasViewImageColumn(dc))
    {
        var image = EpiUIImages.GetImage(dv.GetViewImageName(dc));
        return "<div id='" + id + "' tabIndex='-1' style='background-image:url(" + image.Path + ");background-repeat:no-repeat;background-position:center center;'>&nbsp;</div>";
    }
    
    return "<div />";
}
EpiPictureBox.prototype.RefreshProperties=function(ctrl,dv,row)
{
    if(this.SkipRefreshProperties) return;

    if(row==-1 || (Global.Form && Global.Form.allCtrlsDisabled == true))
    {
		if(!this.EpiKeyField)
		{
			if(this.EpiHideControl)
				this.SetVisible(ctrl, false, true);
			else
                this.SetReadOnly(ctrl, true, true);
		}
		else
		{
			if(this.EpiHideControl)
				this.SetVisible(ctrl, true, true);
			else
                this.SetReadOnly(ctrl, false, true);
		}
    }
    else
    {
        this.Visible = true;  // Temp 
        EpiControl.prototype.RefreshProperties.call(this,ctrl,dv,row);
    
        var dc = this.DataColumn;
        
        if(!dv.dataView.Table.Columns[dc] && !dv.HasViewImageColumn(dc)) return;
        
        if(dv.HasViewImageColumn(dc))
        {
            this.EpiHideControl = true;
            
            var img;
            var image = EpiUIImages.GetImage(dv.GetViewImageName(dc));
            var colRR = dv.RowRules[this.DataView + "." + dc];
            if(colRR && colRR["SetImage"]) 
            {
                var r = dv.dataView.Rows[row];
                img = colRR["SetImage"][0].Execute(r);
                if(img!=undefined) image = EpiUIImages.GetImage(img);
            }
            this.SetImage(ctrl, image);
        }

        if ((this.Image == null && dv.HasViewImageColumn(dc)) ||
            (!dv.HasViewImageColumn(dc) && dv.HasDroppedImageColumn(dc)))
            this.SetVisible(ctrl, false, true);
    }
}

//------------------------------------
// EpiShape
//------------------------------------
var EpiShape = Epicor.Mfg.UI.FrameWork.EpiShape = function (settings)
{
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");
    
    this.EnabledCaption = settings.EnabledCaption||"";
    this.DisabledCaption = settings.DisabledCaption||"";
    this.Status = settings.Status||"";
    this.EpiHideControl = settings.EpiHideControl || false;
}
EpiShape.prototype = new EpiControl();
EpiShape.prototype.TypeName = "EpiShape";
EpiShape.prototype.Update=function(){}
EpiShape.prototype.get_EnabledCaption=function(){return this.EnabledCaption;}
EpiShape.prototype.set_EnabledCaption=function(value)
{
    this.EnabledCaption=value;
}
EpiShape.prototype.set_DisabledCaption=function(value)
{
    this.DisabledCaption=value;
}
EpiShape.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;
    
    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);

    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
    }
}
EpiShape.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
    if(this.DataView && this.DataColumn && rowNum>-1 && bEngine.CurrentTab)
        bEngine.RegisterBinding(bEngine.CurrentTab.id, this.DataView, this.DataColumn, rowNum, ctrl, this.InGrid);
    this.RefreshProperties(ctrl, dv, rowNum);
    
    return true;
}
EpiShape.prototype.RefreshProperties=function(ctrl,dv,row)
{
    if(this.SkipRefreshProperties) return;

    if(row==-1)
    {
		if(!this.EpiKeyField)
		{
			if(this.EpiHideControl)
				this.SetVisible(ctrl, false, true);
			else
                this.SetReadOnly(ctrl, true, true);
		}
		else
		{
			if(this.EpiHideControl)
				this.SetVisible(ctrl, true, true);
			else
                this.SetReadOnly(ctrl, false, true);
		}
    }
    else
    {
        if(!this.Visible) this.Visible = true;
        if(!this.Enabled) this.Enabled = true;
        EpiControl.prototype.RefreshProperties.call(this,ctrl,dv,row);
    }
}
EpiShape.prototype.GetEnabled=function(ctrl)
{
    return !(ctrl.className == "EpiShape shape-disabled");
}
EpiShape.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);

    if(enabledFlg)
    {
        var statusVal = this.Status;
        ctrl.className = "EpiShape " + statusVal;
        ctrl.innerHTML = this.EnabledCaption;
    }
    else
    {
        ctrl.className = "EpiShape shape-disabled";
        ctrl.innerHTML = this.DisabledCaption;
    }
    this.Enabled = enabledFlg;
    this.OnEnabledChanged(ctrl);
}
EpiShape.prototype.set_Status=function(status)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl) this.SetStatus(ctrl, status);
}
EpiShape.prototype.get_Status=function()
{
    return this.Status;
}
EpiShape.prototype.SetStatus=function(ctrl, status)
{
    var enabledFlg = true;
    if(ctrl.className=="EpiShape shape-disabled") enabledFlg = false;

    switch(status)
	{
		case StatusTypes.Warning:
		    status = "Warning";
		    break;
		case StatusTypes.Global:
		    status = "Global";
		    break;
		case StatusTypes.OK:
		    status = "OK";
		    break;
		case StatusTypes.Stop:
		    status = "Stop";
		    break;
    }
				    
    this.Status = status;
    this.SetEnabled(ctrl, enabledFlg, true);
}
//------------------------------------
// EpiNavigator
//------------------------------------
var EpiNavigator = Epicor.Mfg.UI.FrameWork.EpiNavigator = function (settings)
{
    EpiControl.call(this,settings);
    this._impl.push("IEpiBoundControl");

    this.epiUltraComboID = settings.UltraCbo||"";
    this.btnBackID = settings.BtnBk||"";
    this.btnNextID = settings.BtnNxt||"";
    this.btnLastID = settings.BtnLst||"";
    this.btnFirstID = settings.BtnFst||"";
    this.isTool = settings.isTool||false;
    
    if(Global.Form) 
    {
        Global.Form.get_Event("Load").subscribe(this.ctor,this,true);  
    }
}
EpiNavigator.prototype = new EpiControl();
EpiNavigator.prototype.TypeName = "EpiNavigator";
EpiNavigator.prototype.set_EpiShortCutFields=function(){}
EpiNavigator.prototype.ctor=function()
{
    var ctrl = Global.document.getElementById(this.ID);

    if(ctrl)
    {
        EpiEventManager.removeListener(ctrl, "mousemove", this._mousemove);
        EpiEventManager.removeListener(ctrl, "mouseout", this._mouseout);
        EpiEventManager.removeListener(ctrl, "mousedown", this._mousedown);
        EpiEventManager.removeListener(ctrl, "mouseup", this._mousemove);
    
        EpiEventManager.addListener(ctrl, "mousemove", this._mousemove, this, true); 
        EpiEventManager.addListener(ctrl, "mouseout", this._mouseout, this, true); 
        EpiEventManager.addListener(ctrl, "mousedown", this._mousedown, this, true); 
        EpiEventManager.addListener(ctrl, "mouseup", this._mousemove, this, true);
    }
    
    // Do this once the double navcontrol issue is fixed.
//    Global.BindingEngine.Controls[this.btnBackID].get_Event("Click").subscribe(this.navbutton_onclick, this,true);
//    Global.BindingEngine.Controls[this.btnNextID].get_Event("Click").subscribe(this.navbutton_onclick, this,true);
//    Global.BindingEngine.Controls[this.btnLastID].get_Event("Click").subscribe(this.navbutton_onclick, this,true);
//    Global.BindingEngine.Controls[this.btnFirstID].get_Event("Click").subscribe(this.navbutton_onclick, this,true);
}
EpiNavigator.prototype.navbutton_onclick=function(sender)
{
    var ctrl = Global.document.getElementById(sender.ID);
    if(ctrl)
    {
        if(ctrl.disabled) return;
        switch(ctrl.id)
        {
            case this.btnBackID: Global.BindingEngine.OnPage(ctrl.parentNode,"back"); break;
            case this.btnNextID: Global.BindingEngine.OnPage(ctrl.parentNode,"next"); break;
            case this.btnLastID: Global.BindingEngine.OnPage(ctrl.parentNode,"last"); break;
            case this.btnFirstID: Global.BindingEngine.OnPage(ctrl.parentNode,"first"); break;
        }
    }
}
EpiNavigator.prototype._getBtnClass=function(ctrl)
{
    var classStr=null;
    switch(ctrl.id)
    {
        case this.btnBackID: classStr="navPrev";break;
        case this.btnNextID: classStr="navNext";break;
        case this.btnLastID: classStr="navLast";break;
        case this.btnFirstID: classStr="navFirst";break;
    }
    return classStr;
}
EpiNavigator.prototype._mousemove=function(e)
{
    var ctrl = e.target||e.srcElement;
    if(ctrl.tagName=="DIV")
    {
        if(ctrl.disabled) return;
        var className = this._getBtnClass(ctrl);
        if(className) ctrl.className=className + " navActive";
    }
}
EpiNavigator.prototype._mouseout=function(e)
{
    var ctrl = e.target||e.srcElement;
    if(ctrl.tagName=="DIV")
    {
        var className = this._getBtnClass(ctrl);
        if(className) ctrl.className=className;
    }
}
EpiNavigator.prototype._mousedown=function(e)
{
    var ctrl = e.target||e.srcElement;
    if(ctrl.tagName=="DIV")
    {
        var className = this._getBtnClass(ctrl);
        if(className) ctrl.className=className + " navFocus";
    }
}
EpiNavigator.prototype.GetEnabled=function(ctrl)
{
    return !(ctrl.disabled);
}
EpiNavigator.prototype.SetEnabled=function(ctrl,enabledFlg,toolsFlg)
{    
    if(!toolsFlg) this.manageQueue(PropertyType.Enabled, enabledFlg);

    ctrl.disabled=!enabledFlg;
    var cbo = Global.document.getElementById(this.epiUltraComboID)
    this.get_EpiCombo().SetEnabled(cbo, enabledFlg);
    if (this.isTool)
        this.setDisplayForCombo(cbo,enabledFlg);

    this.set_BtnBackEnabled(enabledFlg);
	this.set_BtnFirstEnabled(enabledFlg);
	this.set_BtnNextEnabled(enabledFlg);
	this.set_BtnLastEnabled(enabledFlg);
	this.OnEnabledChanged(ctrl);
}

EpiNavigator.prototype.set_EpiBinding=function(value)
{
    // set the binding on the navcontrol and its combo
    EpiControl.prototype.set_EpiBinding.call(this,value);
    this.get_EpiCombo().set_EpiBinding(value);
}

EpiNavigator.prototype.setDisplayForCombo=function(cboCtrl,enabledFlg)
{
    var styleStr = "";
    // Apply different display styles for IE and FF
   if (Global.document.all)
        cboCtrl.style.display = "inline";
   else
    {
        cboCtrl.style.display = "-moz-inline-box";
        cboCtrl.parentNode.style.marginTop = "-2px";
        cboCtrl.parentNode.style.display = "-moz-inline-box";
    }
        
    cboCtrl.style.height="20px";
    
    if(!enabledFlg)
    {
        if(Global.document.all)
            cboCtrl.style.filter = "alpha(opacity=70)";
        else
            cboCtrl.style.opacity = ".7";
    }
    else
    {
        if(Global.document.all)
            cboCtrl.style.filter = "";
        else
            cboCtrl.style.opacity = "";
    } 
}

EpiNavigator.prototype.Bind=function(bEngine, ctrl, dv, rowNum)
{
    if(!dv) return;

    var data = dv.dataView.Rows[rowNum];
    var cbo = Global.document.getElementById(this.epiUltraComboID);
    this.get_EpiCombo().Bind(bEngine, cbo, dv, rowNum, this.isTool);
    if (this.isTool)
        this.setDisplayForCombo(cbo, this.get_EpiCombo().get_Enabled());
        
    this.setNavButtonState();
    if (this.isTool == true && this.DataView && !this.hasEvents)
    {
        dv.get_Event("EpiRowChanged").unsubscribe(this.nav_EpiRowChanged, this);
        dv.get_Event("EpiRowChanged").subscribe(this.nav_EpiRowChanged, this, true);
        
	    dv.get_Event("EpiViewNotification").subscribe(this.dv_EpiViewNotification, this, true);
        this.hasEvents = true;
    }
    
    return true;
}
EpiNavigator.prototype.RefreshProperties=function(ctrl,dv,row)
{
    //EpiControl.prototype.RefreshProperties.call(this,ctrl,dv,row); // The row rules and extended properties never apply to the navigator control.
    if(row!=-1)
    {
       this.setNavButtonState();
    }
}
EpiNavigator.prototype.SetValue=function(ctrl,val,desc)
{
    var cbo = Global.document.getElementById(this.epiUltraComboID);
    this.get_EpiCombo().SetValue(cbo, val,desc);
}
EpiNavigator.prototype.OnPage=function(ctrl,to,dv)
{
    if(dv)
    {
        var retVal = false;
        if(to=="first")
            retVal = dv.DoRowChange(0);
        else if(to=="back")
            retVal = dv.DoRowChange(dv.Row-1);
        else if(to=="next")
            retVal = dv.DoRowChange(dv.Row+1); //retVal = dv.NavigateToRow(dv.Row+1, true);
        else if(to=="last")
            retVal = dv.DoRowChange(dv.dataView.Rows.length-1);
    }  
}

EpiNavigator.prototype.get_EpiCombo=function() 
{ 
    if (this.epiUltraCombo == null)
   {
    this.epiUltraCombo = Global.BindingEngine.Controls[this.epiUltraComboID];
    return this.epiUltraCombo; 
   }
   else 
    return this.epiUltraCombo;
}
EpiNavigator.prototype.set_ChangesRows=function(value)
{
    if (!this.epiUltraCombo)
        this.get_EpiCombo();
    
    this.epiUltraCombo.ChangesRows=value;
}
EpiNavigator.prototype.get_ChangesRows=function() 
{
	if (!this.epiUltraCombo)
        this.get_EpiCombo();
	return this.epiUltraCombo.ChangesRows;
}
EpiNavigator.prototype.SetColumnFilter=function()
{
    if (!this.epiUltraCombo)
        this.get_EpiCombo();
    
    this.epiUltraCombo.SetColumnFilter.apply(this.epiUltraCombo, arguments);
}

EpiNavigator.prototype.dv_EpiViewNotification=function(view, args)
{
    if (args.Row > -1 && this.get_EpiCombo().SelectedRowIndx != args.Row)
        this.nav_EpiRowChanged({"CurrentRow":args.Row});
    else if (args.Row == -1)
        this.Bind(Global.BindingEngine, Global.document.getElementById(this.ID), view, -1); // This should disable the navcontrol
}
EpiNavigator.prototype.nav_EpiRowChanged=function(args)
{
    var ctrl = Global.document.getElementById(this.epiUltraComboID);
    var dv = Global.BindingEngine.EpiDataViews[this.DataView];
    if(args.CurrentRow>-1)
    {
        var data = dv.dataView.Rows[args.CurrentRow][this.DataColumn];
        if (dv.dataView.Rows.length != this.get_EpiCombo()._getDataArray().length)
            this.get_EpiCombo().hasBeenRetrieved = false;
            
        this.get_EpiCombo().SetValue(ctrl, data);
    }
    this.setNavButtonState();
}
EpiNavigator.prototype.setNavButtonState=function()
{
    var cbo = this.get_EpiCombo();
    // force load of data
    cbo._retrieveComboData(); //no need of comboCtrl since we know _loadDataFromDataView will be called 
        
    if (cbo.SelectedRowIndx != -1) 
	{
		this.set_BtnBackEnabled(!(cbo.SelectedRowIndx == 0));
		this.set_BtnFirstEnabled(!(cbo.SelectedRowIndx == 0));
		this.set_BtnNextEnabled(!(cbo.SelectedRowIndx == (cbo.get_RowCount()-1)));
		this.set_BtnLastEnabled(!(cbo.SelectedRowIndx == (cbo.get_RowCount()-1)));
	} 
	else 
	{ 
		this.set_BtnBackEnabled(false);
		this.set_BtnFirstEnabled(false);
		this.set_BtnNextEnabled(false);
		this.set_BtnLastEnabled(false);
	}
}
EpiNavigator.prototype.set_BtnBackEnabled=function(value)
{
    this.set_EnabledTitle(this.btnBackID,"PrevRecord",value);
}
EpiNavigator.prototype.set_BtnFirstEnabled=function(value)
{
    this.set_EnabledTitle(this.btnFirstID,"FirstRecord",value);
}
EpiNavigator.prototype.set_BtnNextEnabled=function(value)
{
    this.set_EnabledTitle(this.btnNextID,"NextRecord",value);
}
EpiNavigator.prototype.set_BtnLastEnabled=function(value)
{
    this.set_EnabledTitle(this.btnLastID,"LastRecord",value);
}
EpiNavigator.prototype.set_EnabledTitle=function(btnId,resourceID,value)
{
    var btn = Global.BindingEngine.Controls[btnId];
    var ctrl = Global.document.getElementById(btnId);
    if (!ctrl.getAttribute("title")) ctrl.setAttribute("title",EpiString.GetString(resourceID));
    btn.SetEnabled(ctrl, value, true);
    if(!value)
    {
        ctrl.style.cursor = "auto";
        if(Global.document.all)
            ctrl.style.filter = "alpha(opacity=40)";
        else
            ctrl.style.opacity = ".4";
    }
    else
    {
        ctrl.style.cursor = "pointer";
        if(Global.document.all)
            ctrl.style.filter = "";
        else
            ctrl.style.opacity = "";
    }   
}

//------------------------------------
// EpiPanel
//------------------------------------
var EpiPanel = Epicor.Mfg.UI.FrameWork.EpiPanel = function (settings, type)
{
    if (!settings) settings = {};
 
    if (settings && settings.SkipProcessing == true) return;
    EpiControl.call(this,settings);
    
    if(settings.IsDockArea!=undefined) this.IsDockArea = settings.IsDockArea;
    if(settings.HasTitle!=undefined) this.HasTitle = settings.HasTitle;
    if(settings.HeightPercent!=undefined) this.HeightPercent = settings.HeightPercent;
    if(settings.WidthPercent!=undefined) this.WidthPercent = settings.WidthPercent;
    if(settings.Panes!=undefined) this.Panes=settings.Panes;
    if (settings.MyViews && settings.MyViews.length > 0) this.MyViews = settings.MyViews;
    if(settings.DockableWindows!=undefined)
    {
        for(var dw in settings.DockableWindows)
        {
            Global.Form[settings.DockableWindows[dw]] = this;
        }
    }
   
    if(Global.Form)
    {    
        Global.Form.get_Event("BeforeLoad").subscribe(this.call_ctor, this,true);
        Global.Form.get_Event("Load").subscribe(this._fireLoad,this,true);
    }    
    if (settings.IsPane) 
    {
        this.IsPane = true;
        this.Control = settings.Control;
    }
}
EpiPanel.prototype = new EpiControl();
EpiPanel.prototype.WidthPercent=null;
EpiPanel.prototype.HeightPercent=null;
EpiPanel.prototype.TypeName = "EpiPanel";
EpiPanel.prototype.DynamicCtrl = false;
EpiPanel.prototype.primaryView = null;
EpiPanel.prototype.HasTitle=false;
EpiPanel.prototype.GetString=function(id)
{ 
    return EpiString.GetString(id,"Msg.Epicor.Mfg." + this._assembly + ".xml");
}
EpiPanel.prototype.GetStringFmt=function(id,args)
{ 
    return EpiString.GetStringFmt(id,"Msg.Epicor.Mfg." + this._assembly + ".xml",args);
}
EpiPanel.prototype.get_ActiveControl=function()
{
    if(Global.Form._activeCtrl)
    {
        var pnlCtrl=Global.document.getElementById(this.ID);
        if(pnlCtrl)
        {
            if(this.Contains(pnlCtrl,Global.Form._activeCtrl))
                return Global.Form._activeCtrl;
        }
    }
    return null;
}
EpiPanel.prototype.Contains=function(parentCtrl,childCtrl)
{
    for (var c = parentCtrl.firstChild; c; c = c.nextSibling) 
    {
        if(c.nodeType==1)
        {
            if(c==childCtrl) return true;
            if(this.Contains(c,childCtrl)) return true;
        }
    }
    return false;
}
EpiPanel.prototype.set_EpiTabIndex=function(idx){}
EpiPanel.prototype.SetVisible=function(ctrl,visibleFlg,fromRR)
{
    EpiControl.prototype.SetVisible.call(this,ctrl,visibleFlg,fromRR);
    var pinPnl = Global.BindingEngine.Controls["pinPnl_" + this.ID];
    if (pinPnl && !this.IsPinning)
    {
        pinPnl.SetVisible(Global.document.getElementById("pinPnl_" + this.ID),visibleFlg,fromRR);
    }
}
EpiPanel.prototype.Resize=function(ctrl,h,w,limits)
{       
    if(ctrl.style.display=="none" || this.ID=="SonomaForm_Fill_Panel") return;
    if(ctrl.style.position=="absolute"||ctrl.style.position=="relative")
    {
        if(this.HeightPercent && (limits.Top>0||limits.Bottom>0))
        {
            var hPerc = 100 - (((limits.Top+limits.Bottom)/h)*100);
            if(hPerc<this.HeightPercent) this.HeightPercent=Math.floor(hPerc);
        }
    
        var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits,this.HeightPercent,this.WidthPercent);

        if(bounds)
        {
            ctrl.style.top = bounds.Top + "px";
            ctrl.style.left = bounds.Left + "px";
            if (ctrl.id.indexOf("pinPnl_") == 0&&Global.FormDir!="rtl")
                ctrl.style.left = bounds.Left-3 +"px";
               
            ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
            ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 
            
            var divElems = ctrl.getElementsByTagName("DIV");
            if(this.IsPane && this.HasTitle && divElems[0].className=="PaneHeading")
            {
                // VA: Dont resize the Pane Heading for the Settings tab for the chart.
                var img = divElems[0].getElementsByTagName("IMG");
                if (img.length > 0) img = img[0];
                if (!(img && (img.className == "ImgSettings" || img.className=="ImgCloseSettings")))
                  divElems[0].style.width = (bounds.Width-8>0?bounds.Width-8:0) + "px";  
                       
                this.resizeChildren(divElems[1],bounds.Height-19,bounds.Width-4);
            }
            else
            {
                this.resizeChildren(ctrl,bounds.Height,bounds.Width);
            }
        }
        else if (!Global.InstanceOf(Global.Form, "EpiSearchBase")
                && !Global.InstanceOf(Global.Form, "EpiZoneForm"))
        {
            ctrl.style.overflow="hidden";
        }
    }
    else
    {    
        this.resizeChildren(ctrl,h,w,limits);
    }
}
EpiPanel.prototype._fireLoad=function()
{
    if (this.ID.StartsWith("pinPane_"))
    {
        var ctrl=Global.document.getElementById(this.ID);
        if(ctrl)
        {
            var pinImg=ctrl.getElementsByTagName("IMG")[0];
            if (pinImg)
            {
                EpiEventManager.addListener(pinImg, "click", this._pinClick, this, true); 
                Global.BindingEngine.Controls[this.ID.replace("pinPane_","")].Pinned=true;
                pinImg.src = Global.FormDir=="rtl"?"img/_DockPinRight.png":"img/_DockPinLeft.png";
            }
        }
    }
      
    if (Global.Form.FormOptions && Global.Form.FormOptions.RequiredIndicator 
        && this.MyViews && this.MyViews.length > 0
        && Global.BindingEngine.EpiDataViews )
    {
        try
        {
           
            // Make sure at least one of this panel's Views exists in the Views which have required columns
            var process = false, vw;
            var lstVws = Global.BindingEngine.EpiDataViews;
            for (var i = 0;i<this.MyViews.length;i++)
            {
               vw = lstVws[this.MyViews[i]];
               if (vw && vw.dataView && vw.dataView.Table)
               {
                    if (!Global.ViewsWithRequiredCols[vw.dataView.Table.TableName] && !vw.dataView.Table._extPropsInit)
                        vw.dataView.Table._initProps();
                    if (Global.ViewsWithRequiredCols[vw.dataView.Table.TableName])
                    {
                        process = true;
                        break;
                    }
               }
            }

            if (process)
            {
                // the View has a column that is required but make sure the control bound to the column is on this panel.
                var ctrl =Global.document.getElementById(this.ID);
                var result = this._findRequiredCtrl(ctrl);
                if (result)
                {
                    this._updateParentTabsForReqd(ctrl);
                }
            }
        }
        catch(e){}
    }

    EpiControl.prototype._fireLoad.call(this);

}
EpiPanel.prototype.call_ctor=function()
{
    if (!this.DynamicCtrl) this.ctor();

    
}
EpiPanel.prototype._updateParentTabsForReqd=function(ctrl)
{
    var controls = Global.BindingEngine.Controls;
    
    if(ctrl) ctrl = ctrl.parentNode;
    while(ctrl && ctrl.id!="div_TopLevelPanel" && ctrl.tagName!="BODY")
    {
        if (ctrl.className == "TabPage")
        {
            var o = controls[ctrl.id];
            if (o && !o.HasRequiredControls)
            {
                var parentSpan = Global.document.getElementById("tab_" + ctrl.id);
                if (parentSpan) 
                {
                    var lbl = parentSpan.getElementsByTagName("LABEL")[0];
                    if (lbl)
                        this._setRequiredStyle(lbl);
                }
                o.HasRequiredControls = true;
            }
        }
        ctrl = ctrl.parentNode;
    }
}

EpiPanel.prototype._focusinChild=function(ctrl)
{
    if(ctrl.firstChild)
    {
        this._focusinChild(ctrl.firstChild);
    }
    else
    {
        Global.Form._setActiveControl(ctrl);
    }
}
EpiPanel.prototype._focusin=function(ctrl)
{
    if(ctrl)
    {
        if(!ctrl.tagName) ctrl=ctrl.target||ctrl.srcElement;
        this._focusinChild(ctrl);
    }
}

EpiPanel.prototype._pinClick=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var pnlID = ctrl.id.Replace("pinImg_", "");
    var pnl = Global.BindingEngine.Controls[pnlID];

    pnl.IsPinning = true;
    
    var rImg="img/_DockPinRight.png";
    var lImg="img/_DockPinLeft.png";
    if(pnl.Pinned)
    {
        ctrl.src = Global.FormDir=="rtl"?lImg:rImg;
        pnl.set_Visible(false);
        pnl.Pinned = false;
    }
    else
    {
        ctrl.src = Global.FormDir=="rtl"?rImg:lImg;
        ctrl.style.backgroundColor="";
        pnl.set_Visible(true);
        pnl.Pinned = true;
    }
    pnl.IsPinning = false;
    
    Global.Form.ResizeForm();
//    if(pnl.Pinned)
//    {
//        // Resize puts a gap betwen the search and the image panels. Merge the two
//        var newDivElem = ctrl.parentNode.parentNode.parentNode;
//        newDivElem.style.borderLeft="thin none transparent";
//    }
}

EpiPanel.prototype._doClick=function(controlName)
{
    if (controlName)
    {
        Global.ActivePane = this;
        this.Control = controlName;
//        if (!Global.Form.trans.LastUpdatePanel && Global.Form.AppControlPanel)
//        {
            var ctrl = Global.BindingEngine.Controls[controlName];
            if (ctrl && Global.InstanceOf(ctrl,"IUpdatableAppPanel"))
                AppControllerPanel.resetMenuForUpdate(Global.BindingEngine.EpiDataViews[ctrl.get_PrimaryViewName()]);
        //}
     }   

}

// The following two functions are temporary.  
EpiPanel.prototype.get_Grid=function(ctrl)
{
    var divElems = ctrl.getElementsByTagName("DIV");
    for(var ii=0; ii<=divElems.length-1; ii++)
    {
        var obj = Global.BindingEngine.Controls[divElems[ii].id];
        if(obj && obj instanceof EpiGrid)
            return obj;
    }
}
EpiPanel.prototype.get_GrdList=function(ctrl)
{
    return this.get_Grid(ctrl);
}
EpiPanel.prototype.get_ELPAttributes=function() // TEMPORARY for Customer form
{
    var ctrl = Global.document.getElementById(this.ID);

    var divElems = ctrl.getElementsByTagName("DIV");
    for(var ii=0; ii<=divElems.length-1; ii++)
    {
        var obj = Global.BindingEngine.Controls[divElems[ii].id];
        if(obj && obj instanceof EpiListPickerPanel)
            return obj;
    }
}
EpiPanel.prototype.InitDataBind=function() {}
EpiPanel.prototype.ClearPrompts=function(){}
EpiPanel.prototype.BuildWhereClause=function(){}
EpiPanel.prototype.OnReloadSearchForm=function(){}
EpiPanel.prototype.get_isListDataSetPanel=function(){return false;}
EpiPanel.prototype.get_PrimaryView=function() {return this.primaryView;}
EpiPanel.prototype.set_PrimaryView=function(value){this.primaryView = value;}
EpiPanel.prototype.get_ParentForm=function(){return Global.Form;}
EpiPanel.prototype.get_TabDockManager=function()
{
    var dockingArea = null;
    var pnl = Global.document.getElementById(this.ID);
    if(pnl)
    {
        dockingArea = Global.GetParentByType(pnl, EpiTabGroup, true);
        if(dockingArea) dockingArea = Global.BindingEngine.Controls[dockingArea.id];
    }
    return dockingArea;
}
EpiPanel.prototype.SetEnabled=function(ctrl)
{
}

//------------------------------------
// EpiStatusBar
//------------------------------------
var EpiStatusBar = Epicor.Mfg.UI.FrameWork.EpiStatusBar = function(settings)
{
    EpiControl.call(this,settings);

    if (!settings.Panels)
        this.Panels=[];
    else
        this.Panels=settings.Panels;
        
    this.OffsetTop = settings.OffsetTop;

    if(Global.Form) 
    {
        Global.Form.get_Event("Load").subscribe(this.ctor, this,true);  
    }
} 
EpiStatusBar.prototype = new EpiControl();
EpiStatusBar.prototype.TypeName = "EpiStatusBar";
EpiStatusBar.prototype.Resize=function(ctrl,h,w,limits)
{   
    if(ctrl.style.display=="none") return;
    
    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);

    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 
        
        if(this.ID=="baseStatusBar")
        {
            ctrl.style.height = (bounds.Height-1>0?bounds.Height-1:0) + "px"; 
            var span = ctrl.getElementsByTagName("SPAN");
            if(span && span.length>0) span[0].style.width=(bounds.Width>0?bounds.Width:0) + "px"; 
            
            this._resizePanels(ctrl);
        }
        else
        {
            ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
            this.resizeChildren(ctrl,bounds.Height,bounds.Width);
        }
    }
}
EpiStatusBar.prototype._resizePanels=function(ctrl)
{
    var divs = ctrl.getElementsByTagName("DIV");
    if(divs&&divs.length>0)
    {
        var l=ctrl.offsetWidth-3;
        divs[0].style.width="20px";
        for(var ii=divs.length-1;ii>=0;ii--)
        {
            divs[ii].style.top="3px";
            divs[ii].style.position="absolute";
            if(ii>0)
            {
                var txt=divs[ii].innerHTML;
                var w = txt==""?4:Global.GetTextSize(txt).Width+4;
                l = l-w;
                divs[ii].style.width=w+"px";
                divs[ii].style.left=l+"px";
                divs[ii].style.textAlign="right";
            }
            else
            {
                divs[ii].style.width=l-3+"px";
                divs[ii].style.left="3px";
            }
        }
    }
}
EpiStatusBar.prototype.ctor=function()
{
    if(this.ID=="baseStatusBar")
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl)
        {
		this.BringToFront(ctrl);
        this.UpdateTime();
        
        var me=this;
        Global.window.setInterval(function(){me.UpdateTime();}, 20000);
        this._resizePanels(ctrl);
    }
    }
}
EpiStatusBar.prototype.get_Panels=function()
{
    var panels = new Hashtable();
    for(var pnl in this.Panels)
    {
        var thePnl = Global.BindingEngine.Controls[this.Panels[pnl]];
        if(thePnl.Key) 
            panels.Add(thePnl.Key, thePnl);
    }
    return panels;
}
EpiStatusBar.prototype.UpdateTime=function()
{
    var ctrl = Global.document.getElementById(this.ID);
    var divs = ctrl.getElementsByTagName("DIV");
    if(divs && divs.length==4)
    {
        divs[2].innerHTML=FormatEngine.FormatDate(DateTime.get_Now(), FormatEngine.CultureInfo.ShortDatePattern);
        divs[3].innerHTML=FormatEngine.FormatDate(DateTime.get_Now(), FormatEngine.CultureInfo.ShortTimePattern);
    }
}
//------------------------------------
// EpiStatusPanel
//------------------------------------
var EpiStatusPanel = Epicor.Mfg.UI.FrameWork.EpiStatusPanel = function(settings)
{
    EpiControl.call(this,settings);
    
    this.SizingMode = settings.SizingMode;
    this.Style = settings.Style;
    this.Key = settings.Key;
    this.Text=null;
} 
EpiStatusPanel.prototype = new EpiControl();
EpiStatusPanel.prototype.TypeName = "EpiStatusPanel";
EpiStatusPanel.prototype.set_Text=function(val)
{
    if(this.Style==PanelStyle.Text)
    {
        var ctrl = Global.document.getElementById(this.ID);
        if(ctrl) 
        {
            ctrl.innerHTML=val;
            var bar=ctrl.parentNode;
            if(bar&&Global.BindingEngine.Controls[bar.id])
            {
                Global.BindingEngine.Controls[bar.id]._resizePanels(bar);
            }
        }
        else
        {
            this.Text=val;
            Global.Form.get_Event("Load").subscribe(this.Init, this,true);
        }
    }
}
EpiStatusPanel.prototype.Init=function()
{
    if(this.Text) this.set_Text(this.Text);
}

//------------------------------------
// EpiDockManagerPanel
//------------------------------------
var EpiDockManagerPanel = Epicor.Mfg.UI.FrameWork.EpiDockManagerPanel = function (settings)
{
    EpiPanel.call(this,settings);
    
    if(settings) this.TabGrp = settings.TabGrp;
        
    this.baseDockManager = this;
    this.DockAreas=[this]; // Created an array of 1 - TODO TEMP FIX!
    this.ContextClicked = Delegate;
}
EpiDockManagerPanel.prototype = new EpiPanel({SkipProcessing:true});
EpiDockManagerPanel.prototype.TypeName = "EpiDockManagerPanel";
EpiDockManagerPanel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        if(bounds.Dock)
        {
            ctrl.style.top = bounds.Top + "px";
            ctrl.style.left = bounds.Left + "px";
        }
        ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 

        this.resizeChildren(ctrl,bounds.Height,bounds.Width);    
    }
}
EpiDockManagerPanel.prototype.set_EpiSelectedSheet=function(sheet)
{
    // TODO
}
EpiDockManagerPanel.prototype.Close=function(){}
EpiDockManagerPanel.prototype.RemovePane=function(key)
{
    if (this.TabGrp)
    {
        var tabGrp = Global.BindingEngine.Controls[this.TabGrp];
        var page = tabGrp.get_Tab(key);
        if (page && page.Tab)
            tabGrp.RemoveTab(Global.document.getElementById(page.Tab));            
    }
}
EpiDockManagerPanel.prototype.get_ControlPane=function(idx)
{
    if (!this.TabGrp)
        return this;
    else
    {
        var tabGrp = Global.BindingEngine.Controls[this.TabGrp];
        return tabGrp.Pages[idx];            
    }
}
EpiDockManagerPanel.prototype.get_ControlPanes=function()
{
    if (!this.TabGrp)
        return {};
    else
    {
        var tabGrp = Global.BindingEngine.Controls[this.TabGrp];
        return tabGrp.Pages;            
    }
}
EpiDockManagerPanel.prototype.get_Closed=function(){}
EpiDockManagerPanel.prototype.set_Closed=function(){}
EpiDockManagerPanel.prototype.set_IsSelectedTab=function(){}
EpiDockManagerPanel.prototype.get_ActivePane=function()
{
    var k = this.get_EpiSelectedSheet();
    if(k) return this.PaneFromKey(k);
}
EpiDockManagerPanel.prototype.get_EpiSelectedSheet=function()
{
    if (!this.TabGrp)
    {
        var panes=this.Panes;
        if(this==Global.Form.baseDockManager)
            panes=Global.BindingEngine.Controls["div_topLevelPanel"].Panes;
            
        if(panes&&Global.Form._activeCtrl)
        {
            for(var itm in panes)
            {
                if(Global.GetParentById(Global.Form._activeCtrl,itm,true)) 
                {
                    return panes[itm].Key;
                }
            }
        }
        return "";
    }
    else
    {        
        var tabGrp = Global.BindingEngine.Controls[this.TabGrp];
        if (tabGrp.SelectedPane)
            return tabGrp.SelectedPane.Key || tabGrp.SelectedPane.get_Control().ID;
        else return "";
    }
}
EpiDockManagerPanel.prototype.PaneFromKey=function(key)
{
    if (!this.TabGrp)
    {
        var panes=this.Panes;

        if (this == Global.Form.baseDockManager && Global.BindingEngine.Controls["div_topLevelPanel"])
            panes = Global.BindingEngine.Controls["div_topLevelPanel"].Panes;

        if ((!panes || panes.length == 0) && (this.DockAreas && this.DockAreas.length > 0))
        {
            panes = this.DockAreas[0].Panes;
        }
        if (panes)
        {
            for(var itm in panes)
            {
                if (panes[itm].Key == key)
                {
                    if (Global.Form._panes[itm])
                        return Global.Form._panes[itm];
                    else
                        return panes[itm];
                }
            }
        }
        return null;
    }
    else
    {
        var tabGrp = Global.BindingEngine.Controls[this.TabGrp];
        var pane;
        if (tabGrp instanceof EpiTabGroup)
            pane = tabGrp.GetPaneFromKey(key);
        return pane;
    }
}
EpiDockManagerPanel.prototype.PaneFromControl=function(obj)
{
    var tp = new EpiTabPage();
    var ctrl = Global.document.getElementById(obj.ID);
    if(ctrl && ctrl.parentNode && ctrl.parentNode.id!="")
    {
        var tpID = ctrl.parentNode.id;
        
        if(ctrl.parentNode.parentNode && ctrl.parentNode.parentNode.id!="")
        {
            var tabGroup = Global.BindingEngine.Controls[ctrl.parentNode.parentNode.id];
            if(tabGroup && tabGroup instanceof EpiTabGroup)
            {
                var tpObj = tabGroup.Pages[tpID];
                if(tpObj) tp = tpObj;
            }
        }
    }
    
    return tp;
}

EpiDockManagerPanel.prototype.Activate=function(){} // TODO- Temp Fix
EpiDockManagerPanel.prototype.ActivateSheet=function(sheetKey) 
{
   var p1 = this.PaneFromControl(this);
   if (p1) p1.Activate();
   var pane = this.PaneFromKey(sheetKey);
   if (pane) pane.Activate();
}  // TODO
EpiDockManagerPanel.prototype.GetAppControlViewPanel=function()
{
    if (!Global.ActivePane)
        return null;
    else
    {
        var ctrlID = Global.ActivePane.Control;
        if (ctrlID)
           return Global.BindingEngine.Controls[ctrlID];
        else
            return null;
    }
}

//------------------------------------
// EpiDockingToolManagerPanel
//------------------------------------
var EpiDockingToolManagerPanel= Epicor.Mfg.UI.FrameWork.UIApp.EpiDockingToolManagerPanel = function(settings)
{
    EpiDockManagerPanel.call(this,settings);
    if (!settings) return;
    
    if(Global.Form)
    {    
        Global.Form.get_Event("Load").subscribe(this.OnSetEpiTransaction, this,true);
    }  
}
EpiDockingToolManagerPanel.prototype = new EpiDockManagerPanel({SkipProcessing:true});
EpiDockingToolManagerPanel.prototype.TypeName = "EpiDockingToolManagerPanel";

EpiDockingToolManagerPanel.prototype.set_PrimaryViewName=function(val){this.PrimaryViewName = val;}
EpiDockingToolManagerPanel.prototype.OnSetEpiTransaction=function(){} // Overriden by apps code

EpiDockingToolManagerPanel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        if(bounds.Dock)
        {
            ctrl.style.top = bounds.Top + "px";
            ctrl.style.left = bounds.Left + "px";
        }
        
        ctrl.style.height = (bounds.Height>0?(this.hasNav? bounds.Height - 38:bounds.Height):0)  + "px"; 
      //  ctrl.style.height = (bounds.Height>0? bounds.Height:0)  + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 
        
        this.resizeChildren(ctrl,(this.hasNav? bounds.Height-38:bounds.Height),bounds.Width);    
        //this.resizeChildren(ctrl,bounds.Height,bounds.Width);    
    }
}
EpiDockingToolManagerPanel.prototype.SetupNavControl=function(Settings)
{
  if (!this.hasNav) return; // Set from EpiToolbarsManager.Init method
  if (String.IsNullOrEmpty(this.PrimaryViewName)) return;
  
  var baqView = Global.BindingEngine.EpiDataViews[this.PrimaryViewName];
  if (!baqView) return;
  this.nav = Global.BindingEngine.Controls[this.baseToolManager.Tools["NavControl"].Control];
  // Set the label for the LabelTool
  if (!String.IsNullOrEmpty(Settings.LabelText))
  { 
    var lblTool = this.baseToolManager.Tools["NavLabel"];
    lblTool.SharedProps.set_Caption(Settings.LabelText);
  }
  
  this.navManager = new AppControlNavManager(Global.Form.trans, this.nav, Settings, baqView);
}

EpiDockingToolManagerPanel.prototype.OnBeforeToolClick=function(menuID,toolObj)
{
    if(menuID == "NavSearch" && this.navManager != null) 
        this.navManager.InvokeSearch();
    return true;
}


//------------------------------------
// AppControllerPanel
//------------------------------------
var AppControllerPanel= Epicor.Mfg.UI.FrameWork.UIApp.AppControllerPanel = function(settings)
{
    EpiDockManagerPanel.call(this,settings);
    if (!settings) return;
    //this.IsDockArea = true;
    if(Global.Form)
    {    
        Global.Form.get_Event("Load").subscribe(this.OnInitialize, this,true);
    }   
    this.IsHostedOnEpiHostForm = true;
    if (!(Global.Form instanceof EpiHostForm))
    {
        this.IsHostedOnEpiHostForm = false;
        if (settings.HasTB) 
        {
            this.HasTB = true;
            this.launchProps = settings.LaunchProps;
            this.baseToolbarManager = new EpiToolbarsManager(Global.window[this.ID+"_tools"], Global.window[this.ID+"_toolbars"],false);
        }
    }
}
AppControllerPanel.prototype = new EpiDockManagerPanel({SkipProcessing:true});
AppControllerPanel.prototype.TypeName = "AppControllerPanel";
AppControllerPanel.prototype.InitializeControlPanel=function(){}
AppControllerPanel.prototype.set_DashboardId=function(val){this.DashboardId = val;}
AppControllerPanel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);
    if(bounds)
    {
        var tb = false;
        if (this.HasTB && this.baseToolbarManager.visibleTbs > 0) tb = true;
        if(bounds.Dock)
        {
            ctrl.style.top = (tb? bounds.Top + 25:bounds.Top) + "px";
            ctrl.style.left = bounds.Left + "px";
        }
        
        ctrl.style.height = (bounds.Height>0?(tb?bounds.Height - 25:bounds.Height):0)  + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 
        
        this.resizeChildren(ctrl,tb? bounds.Height-25:bounds.Height,bounds.Width);    
    }
}

AppControllerPanel.prototype.SetProcessLink=function(ProcessId, MenuItem)
{
     if (!this.processLinks)
          this.processLinks = new Hashtable();
     this.processLinks.Add(ProcessId, MenuItem);
}
AppControllerPanel.prototype.SetMainPanel=function(panel){}
AppControllerPanel.prototype.OnInitialize=function()
{
            
    if (this.IsHostedOnEpiHostForm)
        this.AppController = Global.Form.trans;
    else // Instantiate the AppController manually
    {
       this.createAppController();
    }
    
    this.InitializeControlPanel();
    this.initializeNavBinding();
//    initializeGridBinding();
    this.initializeTreeBinding();
    this.initializeProcessLinks();
    //this.AppController.SetBaqRefreshStatus();
    
}


AppControllerPanel.prototype.createAppController=function()
{
    if (this.launchProps)
    {
        var dashboardOptions = new LaunchDashboardOptions(DashboardMode.Tracker, true);
        dashboardOptions.CurrentValue = new DashboardTrackerLaunchArgs();
        
        var propPairs = this.launchProps.split(",");
        var propVal;
        for(var pair in propPairs)
        {
            pair = pair.split("=");
            propVal = pair[1];
            switch(pair[0])
            {
                case "DefID":
                dashboardOptions.DefinitionID = propVal;
                break;
                case "HideSB":
                dashboardOptions.HideStatus = propVal;
                break;
                case "HideTB":
                dashboardOptions.HideToolbar = propVal;
                break;
                case "ManualRefresh":
                break;
            }
        }
        
        var lfo = new LaunchFormOptions();
        lfo.ValueIn = dashboardOptions;
        lfo.Sender = Global.Form.trans;
        this.AppController = new MainController(Global.Form.trans, lfo); // Hardcoded the name of the MainController class, since its generated by AppBuilder.
    }
}

AppControllerPanel.prototype.initializeProcessLinks=function()
{
    if (!this.processLinks ) return;
    
    // enum the local collection
    var key,value;
    for (var entry in this.processLinks.items)
    {
       key = entry;
       value = this.processLinks.items[entry];
        // verify the user has access to the Menu row and we have ActionsMenu popup tool
        var ds = ProcessCaller.GetMenuProcess(this.AppController,value); 
        if (ds != null && Global.Form.myTool.Tools["ActionsMenu"])
        {
            // create / config the new Process Link tool
            var actionMenu = Global.Form.myTool.Tools["ActionsMenu"];
            var cap = FormFunctions.GetMenuItemColumnValue(ds, "MenuDesc").toString();
            var tool = new Tool(key,{"Caption":cap,"Type":"ButtonTool"});
            tool.Tag = "ProcessLink";
            tool.SharedProps.AppearancesLarge.Appearance.set_Image(EpiUIImages.LargeEnabledImages.get_Image("Link"));
            Global.Form.myTool.Tools.Add(tool);
            actionMenu.Tools.AddTool(tool.Key);
            
            // enable - en-visible the Actions menu popup
            actionMenu.SharedProps.Visible = true;
            actionMenu.SharedProps.Enabled = true;
        }
    }
}
AppControllerPanel.prototype.initializeNavBinding=function()
{

    // allows for BAQ binding using instance of AppControlNavSettings
    // or use the EpiBinding on the NavControl
    try
    {
        this.navControl = Global.BindingEngine.Controls[Global.Form.myTool.Tools["NavigationTool"].Control];
        
        // set the Nav manager for BAQ bound AppController or EDV bound Nav
        if (this.NavSettings) 
            this.appControlNavManager = new AppControlNavManager(this.AppController, this.navControl, this.NavSettings);
        else
            if (!this.navControl.get_EpiBinding())
                this.navControl.get_EpiCombo().SetColumnFilter([this.navControl.DataColumn]);
    }
    catch (ex)
    {
        ExceptionBox.Show(ex);
    }
    // hide the Nav toolbar when no Nav defined
    if (!this.appControlNavManager &&
        !this.navControl.EpiBinding &&
        Global.Form.myTool.Toolbars.Exists("Navigation"))
        Global.Form.myTool.Toolbars["Navigation"].SetVisible(false);
}
AppControllerPanel.prototype.initializeTreeBinding=function()
{
    var treePanel = Global.BindingEngine.Controls["treePanel"];
    if (!treePanel) return;
    if (String.IsNullOrEmpty(this.TreeBinding)) 
    {
        treePanel.Close();
        return;
    }
    else
        treePanel.get_EpiTreeView().set_EpiTreeBindings([ new EpiTreeBinding(this.TreeBinding,new EpiOverloadedArgs("String")) ]);
}

AppControllerPanel.prototype.HandleToolClick=function(tKey,toolObj)
{
    // bail when no appcontroller
    if (!this.AppController) return false;
    // is this a process link?
    if (this.processLinks && this.processLinks.ContainsKey(tKey))
    {
        ProcessCaller.LaunchForm(this.AppController, this.processLinks[tKey], new EpiOverloadedArgs("Object_String"));
        return true;
    }
    try
    {
        var lastPanel = this.GetAppControlViewPanel();
        if (lastPanel != null)
            this.AppController.LastAppControlViewName = lastPanel.get_PrimaryViewName();
        // suspend the timers
        this.stopAllTimers(); 
        switch (tKey)
        {
            case "ClearTool":
                return this.OnClickClear();
            case "DeleteTool":
                return this.OnClickDelete();
            case "NewTool":
            case "NewMenuTool":
                return this.OnClickNew(toolObj.SharedProps.Caption);
            case "PrimarySearchTool":
                return this.OnClickSearch(new SearchOptions(SearchMode.ShowDialog));
            case "RefreshTool":
                return this.OnClickRefresh();
            case "SaveTool":
                return this.OnClickSave();
            case "UndoTool":
                return this.OnClickUndo();
            default:
                if (tKey.StartsWith("EpiAddNew"))
                {
                    // if we have auto created AddNew tool invoke it
                    var id = toolObj.SharedProps.Caption;
                    if (Global.Form.myTool.Tools[tKey].Tag != null)
                        id = Global.Form.myTool.Tools[tKey].Tag.toString();
                    return this.OnClickNew(id);
                }
                // if the ToolBase.Tag has Action string, lets try it
                if (Global.Form.myTool.Tools[tKey].Tag != null &&
                    !String.IsNullOrEmpty(Global.Form.myTool.Tools[tKey].Tag.toString()))
                    return this.OnClickCustomAction(Global.Form.myTool.Tools[tKey].Tag.toString());
                return false;
        }
    }
    catch(e){}
    finally
    {
        // reset the last active AppControl View Panel
        this.AppController.LastAppControlViewName = null;
        // and resume the timers
        this.startAllTimers();
    }
    return false;
}
AppControllerPanel.prototype.stopAllTimers=function()
{
    BAQDataView.ClearTimers(false); // Passing false will not clear the array holding the timer objs. so they can be restarted later
}
AppControllerPanel.prototype.startAllTimers=function()
{
    BAQDataView.RestartTimers(); 
}
AppControllerPanel.prototype.OnClickClear=function()
{
    if (!this.AppController) return false;
    return this.AppController.OnClear();
}
AppControllerPanel.prototype.OnClickDelete=function()
{
    if (!this.AppController) return false;
    return this.AppController.OnDelete();
}
AppControllerPanel.prototype.OnClickNew=function(NewText)
{
    if (!this.AppController) return false;
    return this.AppController.OnGetNew(NewText);
}
AppControllerPanel.prototype.OnClickRefresh=function()
{
    if (!this.AppController) return false;
    return this.AppController.OnRefresh();
}
AppControllerPanel.prototype.OnClickSave=function()
{
    if (!this.AppController) return false;
    return this.AppController.OnSave();
}
AppControllerPanel.prototype.OnClickSearch=function(opts)
{
    if (!this.AppController) return false;
    if (this.appControlNavManager)
        return this.appControlNavManager.InvokeSearch();
    return this.AppController.OnSearch(opts);
}
AppControllerPanel.prototype.OnClickUndo=function()
{
    if (!this.AppController) return false;
    return this.AppController.OnUndo();
}
AppControllerPanel.prototype.OnClickCustomAction=function(ActionID)
{
    if (!this.AppController) return false;
    return this.AppController.HandleCustomAction(ActionID);
}
AppControllerPanel.prototype.SubscribeToPublisher=function(PublisherName,Caption)
{
    var BCT = Global.BroadcastClient.BroadcastTower;
    for (var key in BCT.Publishers.items) // _publishers is keyed by EpiBinding, and value is the publisherkey
    {
        var ipub =BCT.Publishers.items[key];
        if (ipub != null && ipub.PublishName == PublisherName)
        {
            this.HasTitleBarPublisher = true;
            // register the subscriber
            var Subscriber = SubscribeAgent.RegisterSubscriber(ipub.PublishKey);
            if (Subscriber != null)
            {
                // lazy create the collections
                if (Caption == null) Caption = String.Empty;
                if (this._titleBarSubs == null) this._titleBarSubs = new ArrayList();
                if (this._titleBarCaps == null) this._titleBarCaps = new Hashtable();
                if (this._titleBarVals == null) this._titleBarVals = new Hashtable();
                
                // Subscribe to the broadcast event
                Subscriber.get_Event("BroadcastAlert").subscribe(this.Subscriber_BroadcastAlert,this,true);
                
                // update the local collections
                if (!this._titleBarSubs.Contains(Subscriber))
                {
                    this._titleBarSubs.Add(Subscriber);
                    this._titleBarCaps.Add(Subscriber.PublisherKey, Caption);
                    this._titleBarVals.Add(Subscriber.PublisherKey, String.Empty);
                }
            }
        }
    }
    
}
AppControllerPanel.prototype.Subscriber_BroadcastAlert=function(args)
{
    var Publisher = args.Publisher;
    
    // verify
    var form = Global.Form;
    if (!(form instanceof EpiHostForm)) return;
    
    var titleText = String.Empty;
    // set the published value into local collection
    if (this._titleBarVals.ContainsKey(Publisher.PublishKey))
    {
        this._titleBarVals.set_Item(Publisher.PublishKey,args.NewValue);
        var semiColon = String.Empty;
        var sub;
        // enum the collection of all titlebar subscribers
        for (var s in this._titleBarSubs.items)
        {
            sub = this._titleBarSubs.items[s];
            // build up new titlebar text
            if (this._titleBarCaps.ContainsKey(sub.PublisherKey) && 
               this. _titleBarVals.ContainsKey(sub.PublisherKey) &&
                !String.IsNullOrEmpty(this._titleBarVals.get_Item(sub.PublisherKey)))
            {
                titleText += semiColon + this._titleBarCaps.get_Item(sub.PublisherKey) + this._titleBarVals.get_Item(sub.PublisherKey);
                semiColon = "; ";
            }
        }
    }
    form.set_Text(titleText);
}
AppControllerPanel.registerAddNewSubscribers=function(updatePanel)
{
    if (updatePanel == null || updatePanel.AddNewSubs == null || 
        updatePanel.AddNewSubs.length == 0 ||
        String.IsNullOrEmpty(updatePanel.get_PrimaryViewName())) return; //||!AddNewSubscribers.Columns.Contains("QueryViewID") ||!AddNewSubscribers.Columns.Contains("SelectedPubColumn")
    
    var subView = Global.BindingEngine.EpiDataViews[updatePanel.get_PrimaryViewName()];
    if (!subView || !(subView instanceof BAQDataView)) return;
    
    // enum the AddNew Subscribers
    for (var row in updatePanel.AddNewSubs)
    {
        row = updatePanel.AddNewSubs[row];
        // parse
        var pubBinding = row["QueryViewID"]+ "." + row["SelectedPubColumn"];
        var subColumn = row["AddNewSubColumn"];
        // get the publisher
        var pub = Global.Form.trans.GetPublisher(pubBinding);
        if (pub == null)
        {
            Global.Form.trans.PublishColumnChange(pubBinding.Replace("-", "_"), "EpiAddNew Subscriber: " + subColumn);
            pub = Global.Form.trans.GetPublisher(pubBinding.Replace("-", "_"));
        }
        // register the subscriber
        if (pub != null && !subView.IsSubscribedTo(pub))
            subView.SubscribeToAddNewPublisher(pub, subColumn);
    }
}
AppControllerPanel.resetMenuForUpdate=function(baqView)
{
    // verify
    if (!Global.Form.myTool || !baqView) return;
    // toggle NewTool
    if (Global.Form.myTool.Tools["NewTool"] &&
        Global.Form.myTool.Tools["NewTool"].SharedProps.Visible)
        Global.Form.myTool.Tools["NewTool"].SharedProps.set_Enabled(baqView != null && baqView._updateOptions != null && baqView._updateOptions.AllowAddNew);
    // toggle SaveTool
    if (Global.Form.myTool.Tools["SaveTool"] && Global.Form.myTool.Tools["SaveTool"].SharedProps.Visible)
       Global.Form.myTool.Tools["SaveTool"].SharedProps.set_Enabled(baqView != null && baqView.get_IsUpdatable(false));
}
AppControllerPanel.prototype.SetActionsMenu=function(ViewButtons)
{
    // verify and init
    if (Global.Form.myTool == null || !Global.Form.myTool.Tools["ActionsMenu"]) return;
    var actionMenu = Global.Form.myTool.Tools["ActionsMenu"];

    // save off the ProcessLink tools and clear the Actions menu
    var deleteThese = [];
    for (var tool in actionMenu.Tools.items)
    {
        tool = actionMenu.Tools.items[tool];
        if (tool.Tag!="ProcessLink")
            deleteThese.push(tool);
    }
    // clear down them tools off the actions menu 
    for(var tool in deleteThese)
    {
        actionMenu.Tools.Remove(deleteThese[tool]);
        Global.Form.myTool.Tools.Remove(deleteThese[tool]);
    }
    // now lets process the ViewButtons table
    if (ViewButtons != null)
    {
        var viewBtn;
        for (var drv in ViewButtons)
        {
            viewBtn = ViewButtons[drv];
            // create the new Action menu tool
            var tool = new ButtonTool("ViewButton" + viewBtn["Seq"],{"Caption":viewBtn["Text"],"Type":"ButtonTool","Category":"Action"});
            tool.Tag = viewBtn["Action"];
            
            if (viewBtn["Image"] && !String.IsNullOrEmpty(viewBtn["Image"]))
            {
                tool.SharedProps.AppearancesLarge.Appearance.set_Image(EpiUIImages.LargeEnabledImages.get_Image(EpiUIImages.IndexOf(viewBtn["Image"])));
            }
            Global.Form.myTool.Tools.Add(tool);
            actionMenu.Tools.AddTool(tool.Key);
        }
    }
    // enable - en-visible the Actions menu popup
    var isVisible = false;
    for(var tool in actionMenu.Tools.items)
    {
        tool = actionMenu.Tools.items[tool];
        if (Global.Form.myTool.Tools[tool.Key].SharedProps.Visible)
        {
            isVisible = true;
            break;
        }
    }
    actionMenu.SharedProps.set_Visible(true);
    actionMenu.SharedProps.set_Enabled(isVisible);

}

//------------------------------------
// AppControlReportPanel
//------------------------------------
var AppControlReportPanel = Epicor.Mfg.Lib.Report.AppControlReportPanel=function(settings)
{
    if (!settings) settings = {};
    EpiPanel.call(this,settings);
    this.ReportName = settings.RptName;
    this.btnGenID = settings.btnGen;
    if(Global.Form) Global.Form.get_Event("Load").subscribe(this._load,this,true);
}

AppControlReportPanel.prototype = new EpiPanel({SkipProcessing:true});
AppControlReportPanel.prototype.TypeName = "AppControlReportPanel";
AppControlReportPanel.prototype._load=function()
{
    if (this.btnGenID)
    {
        var btn = Global.BindingEngine.Controls[this.btnGenID];
        if (btn)
            btn.get_Event("Click").subscribe(this.btnGenerate_Click, this, true);
    }
}
AppControlReportPanel.prototype.btnGenerate_Click=function()
{
    var hostForm = Global.Form;
    if (hostForm != null && hostForm.AppControlPanel != null)
         this.GenerateReport(hostForm.AppControlPanel);
}
AppControlReportPanel.prototype.GenerateReport=function(AppPanel)
{
    var ds = AppControlReportManager.GetReportData(AppPanel);
    var dsStr = ds.toString();
    // Launch the report form, passing in the report name and the report dataset.
    var idx = (LaunchEngine.Index++).toString();
    LaunchEngine.Forms[idx] = {"ReportName":this.ReportName, "ReportDataSet":dsStr}; 
    // TODO: Uncomment this line when the report form is available
    Global.window.open("epiDashBoardReport.aspx?source=opener&formidx="+idx);
}

//------------------------------------
// EpiGridPanel
//------------------------------------
var EpiGridPanel = Epicor.Mfg.UI.FrameWork.UIApp.EpiGridPanel = function(settings)
{
    if (!settings) settings = {};
    EpiPanel.call(this,settings);
    this._impl.push("IDashboardViewPanel","IUpdatableAppPanel");
    this.BaseGrid = null;
    this.myGridID = settings.myGrid;
    this.ReportTableName=(settings.ReportTble)? settings.ReportTble:"";   
    if(Global.Form) Global.Form.get_Event("Load").subscribe(this._load,this,true);
    this.ViewButtons = settings.ViewButtons;
    this.AddNewSubs = settings.AddNewSubs;
}
EpiGridPanel.prototype = new EpiPanel({SkipProcessing:true});
EpiGridPanel.prototype.TypeName = "EpiGridPanel";


EpiGridPanel.prototype._click=function()
{
    this._doClick(this.ID);
}
EpiGridPanel.prototype._load=function()
{
    if (Global.Form)
    {
        if (!Global.Form.gridPanels) Global.Form.gridPanels = [];
        Global.Form.gridPanels.push(this);
    }
    this.resetGridCombos();

    var pViewName = this.get_PrimaryViewName();
    if (pViewName)
    {
        var baqV = Global.BindingEngine.EpiDataViews[pViewName];
        if (baqV && this._updateOptions)
        {
            baqV.set_UpdateOptions(this._updateOptions);

            if(this._updateOptions.UpdatableColumns && this._updateOptions.UpdatableColumns.length>0)
            {
                var grd = this.get_BaseGrid();
                if(grd)
                {
                    for(var ii=0;ii<=this._updateOptions.UpdatableColumns.length-1;ii++)
                    {
                        var col = this._updateOptions.UpdatableColumns[ii].substring(this._updateOptions.UpdatableColumns[ii].indexOf(".") + 1);
                        if(col.length>0)
                        {
                            if(grd._columns[col])
                            {
                                var colObj = Global.BindingEngine.Controls[grd._columns[col]];
                                if(colObj) colObj.IsUpdatableColumn = true;
                            }
                        }
                    }
                }
            }

            var currentV = Global.Form.trans.getCurrentBAQView();
            if (currentV == baqV)
                AppControllerPanel.resetMenuForUpdate(baqV); // Enable/Disable the New and Save menus depending on if they are updatable.
        }
        AppControllerPanel.registerAddNewSubscribers(this);
    }
    var ctrl = Global.document.getElementById(this.ID);
    if (ctrl) EpiEventManager.addListener(ctrl, "click", this._click, this, true); 
}
EpiGridPanel.prototype.set_BaseGrid=function(value){this.BaseGrid = value;}
EpiGridPanel.prototype.get_BaseGrid=function()
{
    if (this.BaseGrid == null && this.myGridID) 
        this.BaseGrid = Global.BindingEngine.Controls[this.myGridID];
        
    return this.BaseGrid;
}
EpiGridPanel.prototype.get_PrimaryViewName=function()
{
    var bGrid = this.get_BaseGrid();
    if (bGrid)
        return bGrid.get_EpiBinding();
    else
        return null;
}
EpiGridPanel.prototype.set_PrimaryViewName=function(){}

EpiGridPanel.prototype.get_IEpiX=function()
{
    if (Global.Form)
        return Global.Form.trans;
}

EpiGridPanel.prototype.resetGridCombos = function ()
{
    // verify BAQ and the RuntimeQuery data on BAQDataView
    //if (string.IsNullOrEmpty(BAQId)) return;
    var baseGrid = this.get_BaseGrid();
    if (baseGrid == null) return;

    var primaryViewName = this.get_PrimaryViewName();
    if (primaryViewName == null) return;

    var EpiX = this.get_IEpiX();
    if (EpiX == null) return;

    var baqView = EpiX.Factory(primaryViewName);
    if (baqView == null)
    {
        var filterView = EpiX.Factory(primaryViewName);
        if (filterView != null && !string.IsNullOrEmpty(filterView.ParentBAQName))
            baqView = EpiX.Factory(filterView.ParentBAQName);
    }
    if (baqView == null || baqView.runtimeQueryData == null ||
        !baqView.runtimeQueryData.Tables["QueryCtrl"] ||
        baqView.runtimeQueryData.Tables["QueryCtrl"].Rows.length <= 0) return;


    // enum the QueryCtrl rows
    var queryRows = baqView.runtimeQueryData.Tables["QueryCtrl"].Rows;
    for (var row in queryRows)
    {
        row = queryRows[row];
        var ColumnName = row["DataSource"];
        for (var ugc in baseGrid._columns)
        {
            if (ugc == ColumnName)
            {
                switch (row["ControlType"])
                {
                    case "RadioSet":
                    case "DropDown":
                        // create the Value List Combo
                        this.addValueListCombo(baseGrid._columns[ugc], ColumnName, row["ControlID"], baqView.runtimeQueryData);
                        break;
                    case "DropDownBAQ":  
                        // create the BAQ Combo  
                        this.addBAQCombo(baseGrid._columns[ugc], ColumnName, row["ControlID"], baqView.runtimeQueryData);  
                        break;  
                    case "DropDownUserCodes":  
                        // create the BAQ Combo  
                        this.addUserCodeCombo(baseGrid._columns[ugc], ColumnName, row["ControlID"], baqView.runtimeQueryData);  
                        break;  
                }
            }
        }
    }
}

EpiGridPanel.prototype.addValueListCombo = function (ugc, ColumnName, QueryCtrlId, baqDesignData)
{
    // get the values from the QueryCtrlValues table
    var ctrlValues = baqDesignData.Tables["QueryCtrlValues"].Select("ControlID = '" + QueryCtrlId + "'", "Seq");
    var listArray = [];
    listArray[0] = "Id~Value";
    for (var i = 0; i < ctrlValues.length; i++)
        listArray[i + 1] = ctrlValues[i]["Id"] + "~" + ctrlValues[i]["Val"];
    if (ctrlValues.length <= 0) return;

    // create and config the Combo
    var combo = new EpiComboBox({ "ID": ugc, "DV": "", "DC": "Id", "DescC": "Value", "CboType": "EpiCombo", "InG": true, "ROnAct": false });
    //Global.BindingEngine.Controls[ugc] =combo;
    combo.set_DisplayMember("Value");
    combo.set_ValueMember("Id");
    combo.set_EpiStaticDataList(listArray);
    var gridCol = Global.GetGridColumn(ugc)
    gridCol.OwnerGrid = this.get_BaseGrid().ID;
    gridCol.set_ValueList(combo);
}

/// Add a BAQ combo
/// <param name="ugc">The UltraGridColumn that will get the new combo as ValueList</param>
/// <param name="ColumnName">The current ColumnName</param>
/// <param name="QueryCtrlId">The ID for the QueryCtrl row</param>
/// <param name="baqDesignData">The RuntimeQuery dataset</param>
EpiGridPanel.prototype.addBAQCombo=function(ugc, ColumnName, QueryCtrlId, baqDesignData)
{
    // get the values from the QueryCtrlValues table
    var ctrlValues = baqDesignData.Tables["QueryCtrlValues"].Select("ControlID = '" + QueryCtrlId + "'");
    var BAQId = null, DisplayMember = null, ValueMember = null;
    for (var i = 0; i < ctrlValues.length; i++)
    {
        switch (ctrlValues[i]["Id"])
        {
            case "BAQID":
                BAQId = ctrlValues[i]["Val"].toString();
                break;
            case "BAQDisplayColumn":
                DisplayMember = ctrlValues[i]["Val"].toString();
                break;
            case "BAQValueColumn":
                ValueMember = ctrlValues[i]["Val"].toString();
                break;
        }
    }
    if (!String.IsNullOrEmpty(BAQId) && !String.IsNullOrEmpty(DisplayMember) && !String.IsNullOrEmpty(ValueMember))
    {
        // create and config the Combo
        var combo = new EpiComboBox({ "ID": ugc, "DV": "", "DC": "", "DescC": "", "CboType": "BAQCombo", "InG": true, "ROnAct": false,"DynQueryID":BAQId });
        combo.set_DisplayMember(DisplayMember);
        combo.set_ValueMember(ValueMember);
        var gridCol = Global.GetGridColumn(ugc)
        gridCol.OwnerGrid = this.get_BaseGrid().ID;
        gridCol.set_ValueList(combo);
    }
}
/// Add a UserCode combo
/// <param name="ugc">The UltraGridColumn that will get the new combo as ValueList</param>
/// <param name="ColumnName">The current ColumnName</param>
/// <param name="QueryCtrlId">The ID for the QueryCtrl row</param>
/// <param name="baqDesignData">The RuntimeQuery dataset</param>
EpiGridPanel.prototype.addUserCodeCombo=function(ugc, ColumnName, QueryCtrlId, baqDesignData)
{
    // get the values from the QueryCtrlValues table
    var ctrlValues = baqDesignData.Tables["QueryCtrlValues"].Select("ControlID = '" + QueryCtrlId + "'");
    var UserCode = null;
    for (var i = 0; i < ctrlValues.length; i++)
    {
        if (ctrlValues[i]["Id"] == "UserCodeTypeID")
            UserCode = ctrlValues[i]["Val"];
    }
    if (String.IsNullOrEmpty(UserCode)) return;
    // create and config the Combo
    var combo = new EpiComboBox({ "ID": ugc, "DV": "", "DC": "", "DescC": "", "CboType": "EpiCombo", "InG": true, "ROnAct": true, "EpiBO": "UserCodes", "FCols": "CodeDesc", "SearchFltr": "CodeTypeID = '" + UserCode + "'", "EpiTbl": "UDCodes"});
    //combo.EpiFormat = UserCode; // TODO??
    combo.set_ValueMember("CodeID");
    combo.set_DisplayMember("CodeDesc");
    combo.set_EpiDataSetMode(Epicor.Mfg.UI.Searches.DataSetMode.RowsDataSet);
    var gridCol = Global.GetGridColumn(ugc)
    gridCol.OwnerGrid = this.get_BaseGrid().ID;
    gridCol.set_ValueList(combo);
}

//------------------------------------
// EpiUrlPanel
//------------------------------------
var EpiUrlPanel = Epicor.Mfg.UI.FrameWork.UIApp.EpiUrlPanel = function(settings)
{
    if (!settings) settings = {};
    
    EpiPanel.call(this,settings);
    this.baseUrl = this.url = settings.URL;
    this.browserPanel = settings.BrowserPnl; // ID of the Browserpanel child
    this.publisher = settings.PubId; // URL Publisher id
    if (settings.CanvasId) this.CanvasId = settings.CanvasId;
    if (settings.EpmType) this.EpmType = settings.EpmType;
    if (settings.GemQuery) this.GemQuery = settings.GemQuery;
    if (settings.QPSubs)this.queryPhraseSubscribers = settings.QPSubs;
    if(Global.Form) Global.Form.get_Event("Load").subscribe(this._load,this,true);
}
EpiUrlPanel.prototype = new EpiPanel({SkipProcessing:true});
EpiUrlPanel.prototype.TypeName = "EpiUrlPanel";
EpiUrlPanel.prototype.get_URL=function(){ return this.url;}
EpiUrlPanel.prototype.set_URL=function(val) 
{ 
    if (this.url == null) this.baseUrl = val;
    this.url = val; 
    this.WebNavigate();
}

EpiUrlPanel.prototype._load=function()
{
  this.registerSubscribers();
  this.WebNavigate();
}
EpiUrlPanel.prototype.WebNavigate=function()
{
    // verify the current url string
    if (this.url == null) this.url = String.Empty;
    try
    {
        // try to navigate to the URL address
        if (this.url.toLowerCase().EndsWith("xslt"))
            this.resetStyleSheet(); // TODO
        else
        {
            var browserP = Global.BindingEngine.Controls[this.browserPanel];
            browserP.NavigateToURL(this.url);
        }
    }
    catch (ex)
    {
        DebugHelper.WriteError("Error caught in EpiUrlPanel.WebNavigate: ", ex);
    }
}
EpiUrlPanel.prototype.resetStyleSheet=function(){} // TODO
EpiUrlPanel.prototype.registerSubscribers=function()
{
    // register the standard URL publisher
    if (!String.IsNullOrEmpty(this.publisher))
        this.SubscribeToPublisher(this.publisher);
        // TODO
    // clear and rebuild the Style Sheet publishers
//    if (!String.IsNullOrEmpty(ssPublishers))
//    {
//        if (_styleSheetPubValues == null)
//            _styleSheetPubValues = new Dictionary<string, string>();
//        string[] sspubs = ssPublishers.Split(new char[] { '~' });
//        for (int i = 0; i < sspubs.Length; i++)
//        {
//            SubscribeToPublisher(sspubs[i]);
//            _styleSheetPubValues.Add(sspubs[i], string.Empty);
//        }
//    }

    this.registerQueryPhraseSubscribers();
}

EpiUrlPanel.prototype.registerQueryPhraseSubscribers=function()
{
    // get the table from the embedded resources and verify
    if (this.queryPhraseSubscribers == null || this.queryPhraseSubscribers.length== 0) return;
    
    // build up the local collection
    if (this._queryPhraseSubs == null) this._queryPhraseSubs = new Hashtable();
    for (var row in this.queryPhraseSubscribers)
    {
        row = this.queryPhraseSubscribers[row];
        // register the subscriber and update our collection
        this.SubscribeToPublisher(row["PublisherID"]);
        this._queryPhraseSubs.Add(row["PublisherID"], row["Token"]);
    }
    var newUrl;
    if (this.resetQueryPhrase("", "",newUrl))
    {
        newUrl = Global.ArgManager["Out1"];
        Global.ArgManager["Out1"] = null;
        this.url = newUrl;
    }
}

EpiUrlPanel.prototype.resetQueryPhrase=function(pubKey, newValue, newUrl)
{
    newUrl = this.baseUrl;
    var didHandleSub = false;
    var iPub = null,value,pub;
    var pubs = Global.BroadcastClient.BroadcastTower.Publishers;
    var jsonQPOptions = {};
    if (this.CanvasId) 
    {
       // JSON = {"BaseUrl":<baseurl>,"CanvasID":"<canvasid>","GemQuery":"<gemQ>","EpmType":<type>,Vals:[{"LevelName":"<level>","PublishedVal":"<pubVal>"},{"LevelName":"<level>","PublishedVal":"<pubVal>"},{"LevelName":"<level>","PublishedVal":"<pubVal>"}]};
        
        jsonQPOptions["CanvasID"] = this.CanvasId;
        jsonQPOptions["GemQuery"] = (this.GemQuery)? this.GemQuery:"";
        jsonQPOptions["EpmType"] = (this.EpmType)? this.EpmType:"canvas";
        jsonQPOptions["BaseUrl"] = (this.baseUrl)? this.baseUrl:"";
        jsonQPOptions["Vals"] = [];
    }
    
    // enum the collection of QueryPhrase Subscriber rows
    for(var key in this._queryPhraseSubs.items)
    {
        value = this._queryPhraseSubs.items[key];
        // get the Publisher 
        for (var de in pubs.items)
        {
            pub = pubs.get_Item(de);
            if (pub != null && pub.PublishName == key)
            {
                iPub = pub;
                break;
            }
        }
        if (iPub != null)
        {
            // get the current value or the active published value
            var theValue = iPub.GetLastPublishedValue();
            if (key == pubKey) theValue = newValue;
            if(theValue == null) theValue = "";
            // TODO! handle the performance canvas subscribers
            if (this.CanvasId) 
            {
                jsonQPOptions["Vals"].push({"LevelName":value,"PublishedVal":theValue});
            }
            else if (this.baseUrl.indexOf(value) > 0)            // do the replace
            {
                newUrl = newUrl.replace(value, theValue);
                didHandleSub = true;
            }
        }
    }
    if (this.CanvasId)
    {
        Global.LoadProxy("lib_Common");
        var lib = new lib_CommonService();
        jsonQPOptions = JSON.stringify(jsonQPOptions);
        newUrl = lib.GetQueryParameterString(jsonQPOptions);
        if (newUrl == null) newUrl = this.baseUrl;
        didHandleSub = true;
    }
    Global.ArgManager["Out1"] = newUrl;
    // return true on success
    return didHandleSub;
}
EpiUrlPanel.prototype.SubscribeToPublisher=function(PublisherKey)
{
    // Currently only EpiTransaction is the publisher
    var BCT = Global.BroadcastClient.BroadcastTower;
    for (var key in BCT.Publishers.items) // _publishers is keyed by EpiBinding, and value is the publisherkey
    {
        var ipub =BCT.Publishers.items[key];
        if (ipub != null && ipub.PublishName== PublisherKey)
        {
            var Subscriber = SubscribeAgent.RegisterSubscriber(ipub.PublishKey);
            if (Subscriber != null) 
            {
                if (!this._subscribers)
                    this._subscribers = new Hashtable();
                
                if (this._subscribers.ContainsKey(Subscriber.SubscribeKey))
                    this._subscribers.set_Item(Subscriber.SubscribeKey,Guid.NewGuid()); 
                else
                    this._subscribers.Add(Subscriber.SubscribeKey, Guid.NewGuid());
                
                 // Subscribe to the broadcast event
                 Subscriber.get_Event("BroadcastAlert").subscribe(this.OnBroadcastEvent, this,true); 
             }
        }
    }
    
}
EpiUrlPanel.prototype.OnBroadcastEvent=function(args)
{
    // handle the Query Phrase subscribers if we got em
    if (this._queryPhraseSubs != null && this._queryPhraseSubs.Count > 0)
    {
        var newUrl;
        if (this.resetQueryPhrase(args.Publisher.PublishName, args.NewValue, newUrl))
        {
            newUrl = Global.ArgManager["Out1"];
            this.set_URL(newUrl);
        }
        return;
    }
            
        // TODO
    //    if (_styleSheetPubValues != null &&
    //        _styleSheetPubValues.ContainsKey(Publisher.PublishName))
    //    {
    //        bool doit = (_styleSheetPubValues[Publisher.PublishName] != args.NewValue);
    //        _styleSheetPubValues[Publisher.PublishName] = args.NewValue;
    //        if (doit) resetStyleSheet();
    //    }
    //    else
        {
            this.set_URL(args.NewValue);
        }
    
}
//-----------------
// BrowserPanel
//-----------------
var BrowserPanel = Epicor.Mfg.Lib.HelpViewer.BrowserPanel = function(settings)
{
    if (!settings) settings={};
    EpiControl.call(this,settings);

    this.homeUrl = "about:blank";
    this.Url = "";
    //var me = this;
    this.browserMainPanel = new HtmlControl(this); //{"HtmlControl":{"get_Url":function(){return me.Url;}}};
}
BrowserPanel.prototype = new EpiControl();
BrowserPanel.prototype.TypeName = "BrowserPanel";

BrowserPanel.prototype.get_HomeURL=function() {return this.homeUrl;}
BrowserPanel.prototype.set_HomeURL=function(val) {this.homeUrl=val;}

BrowserPanel.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;
    
    var bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits);

    if(bounds)
    {
        ctrl.style.top = bounds.Top + "px";
        ctrl.style.left = bounds.Left + "px";
        ctrl.style.height = (bounds.Height>0?bounds.Height:0) + "px"; 
        ctrl.style.width = (bounds.Width>0?bounds.Width:0) + "px"; 
    }
}

BrowserPanel.prototype.NavigateToURL = function(url)
{
    if (this.Url.toLowerCase() == url.toLowerCase())
        return;
    this.Url = url;
    var uiFrame = Global.document.getElementById(this.ID); // IFRAME
    if (uiFrame)
    {
        if(url == "")
			url = "about:blank";
        else if (!url.StartsWith("http://"))
        {
            if (url.StartsWith("file:///"))
            {
            url = url.replace("file:///","");
            url = url.Replace("../index-2.html", "\\");
            }
            
            if (url.indexOf("\\") != -1) // File path - this means the file should be in our vdir/Resources/UserFiles
            {
                var parts = url.split("\\");
                url = "Resources/UserFiles/" + parts[parts.length -1];
            }
            else
                url = "http://" + url;
        }
        uiFrame.src = url;
    }
}

//------------------------------------
// EpiTrackerPanel
//------------------------------------
var EpiTrackerPanel = Epicor.Mfg.UI.FrameWork.UIApp.EpiTrackerPanel = function(settings)
{
    EpiDockManagerPanel.call(this,settings);
    if (settings && settings.PViewN) this.PrimaryViewName = settings.PViewN;
    this._impl.push("IDashboardViewPanel","IUpdatableAppPanel");
    if(Global.Form) Global.Form.get_Event("Load").subscribe(this._load,this,true);
    this.ViewButtons = settings.ViewButtons;
    this.AddNewSubs = settings.AddNewSubs;    
}
EpiTrackerPanel.prototype = new EpiDockManagerPanel({SkipProcessing:true});
EpiTrackerPanel.prototype.TypeName = "EpiTrackerPanel";

EpiTrackerPanel.prototype.get_PrimaryViewName=function(){return this.PrimaryViewName;}
EpiTrackerPanel.prototype.set_PrimaryViewName=function(val){this.PrimaryViewName = val;}

EpiTrackerPanel.prototype.get_CurrentRow = function ()
{
   if (this.DataViewer != null) return this.DataViewer.Row;
   return -1;
}
EpiTrackerPanel.prototype.get_IEpiX=function()
{
    if (Global.Form)
        return Global.Form.trans;
}
EpiTrackerPanel.prototype._load=function()
{
    if (this.PrimaryViewName)
    {
        this.DataViewer = Global.BindingEngine.EpiDataViews[this.PrimaryViewName];
        if (this.DataViewer && this.DataViewer instanceof BAQDataView)
        {
            this.DataViewer.get_Event("Cleared").subscribe(this.baqView_Cleared, this,true);
            if (this._updateOptions) 
            {
                this.DataViewer.set_UpdateOptions(this._updateOptions);
                var currentV = Global.Form.trans.getCurrentBAQView();
                if (currentV == baqV)
                    AppControllerPanel.resetMenuForUpdate(baqV); // Enable/Disable the New and Save menus depending on if they are updatable.
            }
            AppControllerPanel.registerAddNewSubscribers(this); // made this static because Global.Form.AppControlPanel is not set up yet.
        }
    }
    var ctrl = Global.document.getElementById(this.ID);
    if (ctrl) EpiEventManager.addListener(ctrl, "click", this._click, this, true); 
}
EpiTrackerPanel.prototype._click=function()
{
    this._doClick(this.ID);
}

EpiTrackerPanel.prototype.PinClick=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    var pnlID = ctrl.id.Replace("pin_", "");
    var pnl = Global.BindingEngine.Controls[pnlID];
    //var paneHeading = Global.document.getElementById(pnlID).childNodes[0].getElementsByTagName("DIV")[0];
    
    var rImg="img/_DockPinRight.png";
    var lImg="img/_DockPinLeft.png";
    if(pnl.Pinned)
    {
        ctrl.src = Global.FormDir=="rtl"?lImg:rImg;
        pnl.set_Visible(false);
        pnl.Pinned = false;
    }
    else
    {
        ctrl.src = Global.FormDir=="rtl"?rImg:lImg;
        ctrl.style.backgroundColor="";
        pnl.set_Visible(true);
        pnl.Pinned = true;
    }
    Global.Form.ResizeForm();
    if(pnl.Pinned)
    {
    // Resize puts a gap betwen the search and the image panels. Merge the two
    var newDivElem = ctrl.parentNode.parentNode.parentNode;
    //newDivElem.style.left = (parseInt(newDivElem.style.left.replace("px","")) -5) +"px";
    newDivElem.style.borderLeft="thin none transparent";
   // paneHeading.style.borderRight="thin none transparent";
   }
}
EpiTrackerPanel.prototype.baqView_Cleared=function(sender, e)
{
    this.ClearTrackerPrompts(this);
}
EpiTrackerPanel.prototype.ClearTrackerPrompts=function(control)
{
   var ctrl = Global.document.getElementById(control.ID);
   var idc = control;
   if (idc && idc.DashboardPrompt == true)
   {
        if(idc instanceof EpiTextBox || idc instanceof EpiComboBox)
            idc.SetValue(ctrl,"");
        else if (idc instanceof EpiDateTimeEditor || idc instanceof EpiNumericEditor)
            idc.SetValue(ctrl,null);
        else if (idc instanceof EpiCheckBox)
            idc.SetValue(ctrl,false);
   }
   // enum the kid controls
    if (ctrl.childNodes.length > 0)
    {
        for (var i=0,kidControl;kidControl=ctrl.childNodes[i];i++)
        {
            kidControl = Global.BindingEngine.Controls[kidControl.id];
            if (kidControl)
            {
                this.ClearTrackerPrompts(kidControl);
            }
        }
    }
}
EpiTrackerPanel.ResetTrackerPrompts=function(control)
{
    
}
EpiTrackerPanel.prototype.GetTrackerPrompts=function(prompts, control)
{
   var ctrl = Global.document.getElementById(control.ID);
 
   var idc = control;
   if (idc && idc.DashboardPrompt == true)
   {
        if (idc.DataView && idc.DataColumn)
        {
            var theVal = idc.GetValue(ctrl);
            if (idc instanceof EpiDateTimeEditor && theVal)
             {
                //   theVal = FormatEngine.ToDate(theVal).toString() // Use the formatted value to put into the where clause
                theVal = idc.Format(theVal);// Use the formatted value to put into the where clause
             }
            
            if (theVal == null) theVal ="";
            if(!Global.IsString(theVal))
                theVal=theVal.toString();
                
            // only honor null when == or !=
            var honorNullFlg = false;
            if (idc.DashboardCondition == DashboardCondition.Equals || idc.DashboardCondition == DashboardCondition.NotEqual)
                honorNullFlg = idc.DashboardHonorNull;
            if (honorNullFlg || (theVal && theVal != ""))
            {
                // add the control value to TrackerPrompts
                prompts.Add(idc.DataColumn, theVal, this.getCondition(idc), idc.get_DataType());
              
            }
        }
    }
    // enum the kid controls
    if (ctrl.childNodes.length > 0)
    {
        for (var i=0,kidControl;kidControl=ctrl.childNodes[i];i++)
        {
            kidControl = Global.BindingEngine.Controls[kidControl.id];
            if (kidControl)
            {
                this.GetTrackerPrompts(prompts, kidControl);
            }
        }
    }
    
}

EpiTrackerPanel.prototype.getCondition=function(idc)
{
    var strCond = "=";
    switch (idc.DashboardCondition)
    {
        case DashboardCondition.Equals:
            strCond = "=";
            break;
        case DashboardCondition.NotEqual:
            strCond = "<>";
            break;
        case DashboardCondition.GreaterThan:
            strCond = ">";
            break;
        case DashboardCondition.GreaterThanOrEqualTo:
            strCond = ">=";
            break;
        case DashboardCondition.LessThan:
            strCond = "<";
            break;
        case DashboardCondition.LessThanOrEqualTo:
            strCond = "<=";
            break;
        case DashboardCondition.StartsWith:
            strCond = "BEGINS";
            break;
        case DashboardCondition.Matches:
            strCond = "MATCHES";
            break;
    }
    return strCond;
}
EpiTrackerPanel.prototype.GetCurrentPublishedValue=function(pubID)
{
     if (Global.Form && Global.Form.trans) 
        return Global.Form.trans.GetCurrentPublishedValue(pubID);
     else return null;
} 

//------------------------------------
// EpiTabGroup
//------------------------------------
var EpiTabGroup = Epicor.Mfg.UI.FrameWork.EpiTabGroup = function (settings)
{
    EpiControl.call(this,settings);
    
    this.Pages = settings.Pages;
    if(settings.Border==true) this.Border = true;
    if(settings.HeightPercent!=undefined) this.HeightPercent = settings.HeightPercent;
    if(settings.WidthPercent!=undefined) this.WidthPercent = settings.WidthPercent;

//    this.get_Event("LostFocus").subscribe(function() { this.SelectedPane = null; this.SelectedTabIndex = null; }, this);
    this.get_Event("GotFocus").subscribe(function() {
        if (this.SelectedPane)
            return;

        for(var pageId in this.Pages)
        {
            if (this.Pages[pageId].IsActive) 
            {
                this.set_SelectedTab(this.Pages[pageId]);
                return;
            }
        }
    }, this);
    
    if(Global.Form && Global.Form.Name=="JobAdjustmentForm")
    {
        var me=this;
        Global.Form.get_Event("Load").subscribe(function()
        {
            var i=me.SelectedTabIndex;
            try
            {
                me.SetSelectedTabIndex(null,i+1);
            }
            catch(e)
            {
            }
            me.SetSelectedTabIndex(null,i);
        },this);
    }
    
    for(var page in this.Pages)
    {
        this.Pages[page].TabGroup = this;
    }
}
EpiTabGroup.prototype = new EpiControl();
EpiTabGroup.prototype.TypeName = "EpiTabGroup";
EpiTabGroup.prototype.Control = null;
EpiTabGroup.prototype.SelectedPane = null;
EpiTabGroup.prototype.SelectedTabIndex = -1;
EpiTabGroup.prototype.Border = false;
EpiTabGroup.prototype.WidthPercent=null;
EpiTabGroup.prototype.HeightPercent=null;
EpiTabGroup.prototype.Activate=function(){} // TODO
EpiTabGroup.prototype.SetVisible=function(ctrl,visibleFlg,fromRR)
{
    EpiControl.prototype.SetVisible.call(this,ctrl,visibleFlg,fromRR);
    var pinPnl = Global.BindingEngine.Controls["pinPnl_" + this.ID];
    if (pinPnl && !this.IsPinning)
    {
        pinPnl.SetVisible(Global.document.getElementById("pinPnl_" + this.ID),visibleFlg,fromRR);
    }
}
EpiTabGroup.prototype.get_Tabs=function()
{
    var al = new ArrayList();
    for(var p in this.Pages)
    {
        al.Add(this.Pages[p]);
    }
    return al;
}
EpiTabGroup.prototype.Resize=function(ctrl,h,w,limits)
{
    if(ctrl.style.display=="none") return;

    var divs = ctrl.getElementsByTagName("DIV");
    if(divs.length > 0)
    {
        var stripDiv = divs[0];
        
        if (w >= 0)
            stripDiv.style.width = w + "px";
    }
    
    if(this.Border)
    {
        var spanElems = ctrl.getElementsByTagName("SPAN");   
        var found = false;
        for(var ii=0;ii<=spanElems.length-1;ii++)
        {
            e = spanElems[ii];
            if(e.className.StartsWith("TabGroupBorder"))
            {
                hOffset = found?26:25;
                e.style.width = (w-2>0?w-2:0) + "px"; 
                e.style.height = (h-hOffset>0?h-hOffset:0) + "px"; 
                    
                if(found) break;
                found = true;
            }
        }
    }
    
    var paneH = h-26;
    var paneW = w;
    if(ctrl.offsetWidth>0 && ctrl.offsetHeight>0)
    { 
        bounds = this.getBounds(ctrl.offsetHeight,ctrl.offsetWidth,ctrl.offsetTop,ctrl.offsetLeft,h,w,limits,this.HeightPercent,this.WidthPercent);
        if(bounds)
        {
            paneH = bounds.Height-26;
            paneW = bounds.Width;
            
            ctrl.style.top = bounds.Top + "px";
            ctrl.style.left = bounds.Left + "px";
        }
        else
        {
            paneH = ctrl.offsetHeight-26;
            paneW = ctrl.offsetWidth;
            
        }
    }

    if(this.SelectedPane) 
    {
        var tabPane = Global.document.getElementById(this.SelectedPane.ID);
        if(tabPane) 
        {
            this.resizeChildren(tabPane,paneH,paneW);
        }
    }


    if(ctrl.parentNode.className!="PaneBody" && ctrl.parentNode.className!="TabGroup" && ctrl.parentNode.className!="TabPage")
	    ctrl.parentNode.style.overflow="hidden";
}
EpiTabGroup.prototype.get_SelectedIndex=function() { return this.SelectedTabIndex; }
EpiTabGroup.prototype.set_SelectedIndex=function(val) 
{ 
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
        this.SetSelectedTabIndex(ctrl, val);
}
EpiTabGroup.prototype.get_TabCount=function(ctrl)
{
    if(!ctrl) ctrl = Global.document.getElementById(this.ID);

    var divs = ctrl.getElementsByTagName("DIV");
    if(divs.length > 0)
    {
        var stripDiv = divs[0];
        return stripDiv.childNodes.length;
    }
}
EpiTabGroup.prototype.get_Tab=function(idx)
{
    if(Global.IsNumber(idx))
    {
        var ctr = 0;
        for(var p in this.Pages)
        {
            if(ctr==idx) return this.Pages[p];
            ctr++;
        }
    }
    else
    {
        return this.GetPaneFromKey(idx);
    }
}
EpiTabGroup.prototype.Bind = function(bEngine, ctrl, dv, rowNum, boundGrids)
{
    if(!this.SelectedPane) return false;

    var tabPane = Global.document.getElementById(this.SelectedPane.ID);
    if (tabPane) bEngine.BindTab(tabPane, boundGrids);
    return true;
    
    //Global.BindingEngine.Controls[ctrl.SelectedPane.Key].Bind(bEngine, tabPane, dv, rowNum);
}
EpiTabGroup.prototype.Init=function(ctrl,width,pageCount)
{
    this.Control = ctrl;
    Global.TabManager.TabGroups.push(this);
    
    if(Global.TabManager.PaneStyle=="tab")
    {
        var tabArr = [];
        
        var divHdr = "<div class='TabStrip' style='position:absolute;'>";
        
        if(width && width.toString().EndsWith("%")) 
            divHdr = "<div class='TabStrip' style='position:absolute;width:" + width + "'>";
        else
            divHdr = "<div class='TabStrip' style='position:absolute;width:" + width + "px;'>";
        
        tabArr.push(divHdr);
        var abbrevLabel = (pageCount > 10)? true: false;
        var caption;
        for(pane in this.Pages)
        {
            var thePane = this.Pages[pane];
            try
            {
                if(Global.InstanceOf(Global.Form,"EpiSearchBase"))
                    thePane.IsVisible = true;   
            }
            catch(err){}
            
            var className = "Tab";
            if(!thePane.IsVisible) className = className + " hidden";
            
            var tabLeft=Global.FormDir=="rtl"?"tab-right":"tab-left";
            var tabRight=Global.FormDir=="rtl"?"tab-left":"tab-right";
            caption = thePane.Caption;
            if (abbrevLabel)
            {
                caption = thePane.Caption.substring(0,4);
                caption = caption + "...";
            }
            if(thePane.IsVisible && !this.SelectedPane)
            {
                tabArr.push("<span title='"+ thePane.Caption+"' class='Tab tab-selected highlight' id='" + thePane.Tab + "' _key='" + thePane.ID + "'><span class='" + tabLeft + "'> </span><span class='tab-label'><label>" + caption + "</label></span><span class='" + tabRight + "'> </span></span>");
                this.SelectedPane = thePane;
                this.SelectedTabIndex = thePane.Index;
                thePane.IsActive = true;
                thePane.IsSelectedTab = true;

                var me = this;
                Global.Form.get_Event("Load").subscribe(function(){me.OnPaneActivate(thePane);}, this);
            }
            else
            {
                tabArr.push("<span title='"+ thePane.Caption +"' class='" + className + "' id='" + thePane.Tab + "' _key='" + thePane.ID + "'><span class='" + tabLeft + "'> </span><span class='tab-label'><label>" + caption + "</label></span><span class='" + tabRight + "'> </span></span>");
            }
        }
        tabArr.push("</div>");

        Global.document.write(tabArr.join(""));
    }
    else
    {
        ctrl.className = "TabGroup Bands";
    }
    
    var tabStrip = ctrl.getElementsByTagName("DIV");
    if(tabStrip.length > 0)
    {    
        EpiEventManager.addListener(tabStrip[0], "mousemove", this._mousemove, this, true); 
        EpiEventManager.addListener(tabStrip[0], "mouseout", this._mouseout, this, true); 
        EpiEventManager.addListener(tabStrip[0], "click", this._click, this, true); 
    }
}
EpiTabGroup.prototype.AddEpiTabPage=function(key,tabText)
{
    var ctrl = Global.document.getElementById(this.ID);
    if(ctrl)
    {
        this.AddTab(ctrl, key,tabText,false);
        return this.Pages[key];
    }
}
EpiTabGroup.prototype.AddTab=function(ctrl,key,tabText, isDeleteImg)
{ 
    var divs = ctrl.getElementsByTagName("DIV");
    if(divs)
    {
        var tabLeftClass=Global.FormDir=="rtl"?"tab-right":"tab-left";
        var tabRightClass=Global.FormDir=="rtl"?"tab-left":"tab-right";
    
        var tabstrip = divs[0];
        var tab = Global.document.createElement("SPAN");
        tab.className = "Tab";
        tab.setAttribute("id", "tab_" + key);
        tab.setAttribute("_key",key);
        
        var tabStr = "<span class='" + tabLeftClass + "'> </span><span class='tab-label'><label>" + tabText + "</label>";
        if (isDeleteImg)
            tabStr += "<img id=tabImg_" + key + " src='img/deletetab.png' ></img>";
        
        tabStr += "</span><span class='" + tabRightClass + "'> </span>";
        tab.innerHTML = tabStr;
        //alert(tabStr);
        tabstrip.appendChild(tab);        
        
        //var image = document.getElementById("tabImg_" + key);
        //alert(image.outerHTML);
        
        if (isDeleteImg)
        {
            var img = document.getElementById("tabImg_" + key);
            if (img)
            {
                EpiEventManager.addListener(img, "mousemove", this._imgMousemove, this, true); 
                EpiEventManager.addListener(img, "mouseout", this._imgMouseout, this, true); 
                EpiEventManager.addListener(img, "click", this._imgClick, this, true); 
            }
        }
        
        var divCtrl = Global.document.createElement("DIV");
        divCtrl.className = "TabPage";
        divCtrl.setAttribute("id", key);
        ctrl.appendChild(divCtrl);
        
        this.Pages[key] = new EpiTabPage({"ID":key,"Key":key,"Index":this.get_TabCount(ctrl)-1,
            "Tab":"tab_" + key, "Caption":tabText});
        this.Pages[key].TabGroup = this;
    }
}
EpiTabGroup.prototype.GetPaneFromKey=function(key)
{
    var thePane=null;
    for(pane in this.Pages)
    {
        var aPane = this.Pages[pane];
        var ctrl = aPane.get_Control();
        if (aPane.Key == key || (ctrl && ctrl.ID == key))
        {
            thePane = aPane;
            break;
        }
    }
    
    return thePane;
}
EpiTabGroup.prototype.set_SelectedTab=function(tab)
{
    var ii=0;
    for(pane in this.Pages)
    {
        if(tab==this.Pages[pane])
        {
            this.SetSelectedTabIndex(null,ii);
            break;
        }
        ii++;
    }
}
EpiTabGroup.prototype.SetSelectedTabIndex=function(ctrl, idx, clickEventArgs)
{
    if(this.SelectedTabIndex==idx) return;

    var ii=0;
    for(pane in this.Pages)
    {
        if(ii==idx)
        {
            var newPane = this.Pages[pane];
            if(newPane.IsVisible)
            {
                if(Global.TabManager.PaneStyle=="tab" && this.SelectedPane!=null)
                {
                    var tabCtrl = Global.document.getElementById(this.SelectedPane.Tab);
                    if(tabCtrl) 
                    {
                        tabCtrl.className = "Tab";
                        var tabImg = Global.document.getElementById("tabImg_" + this.SelectedPane.ID)
                        if (tabImg) 
                        {
                            tabImg.src = "img/disableddeletetab.png";  
                        }                   
                    }
                    
                    var paneCtrl = Global.document.getElementById(this.SelectedPane.ID);
                    if(paneCtrl) paneCtrl.style.display = "none";
                    
                    this.SelectedPane.IsActive = false;
                    this.SelectedPane.IsSelectedTab = false;
                    
                    Global.BindingEngine.CloseTab(paneCtrl);
                }
                
                var paneCtrl = null;
                if(Global.TabManager.PaneStyle=="tab")
                {   
                    var tabCtrl = Global.document.getElementById(newPane.Tab);
                    if(tabCtrl) 
                    {
                        tabCtrl.className = "Tab tab-selected highlight";
                        var tabImg = Global.document.getElementById("tabImg_" + newPane.ID)
                        if (tabImg) 
                        {
                            tabImg.src = "img/deletetab.png";
                         }
                    }

                    paneCtrl = Global.document.getElementById(newPane.ID);
                    if(paneCtrl) 
                    {
                        paneCtrl.style.display = "block";
                    }
//                    Global.BindingEngine.UserChgTab = true;
//                    Global.BindingEngine.BindTab(paneCtrl, null);
//                    Global.BindingEngine.UserChgTab = false;
                }
                else
                {
                    var bandCtrl = Global.document.getElementById(newPane.Tab);
                    if(bandCtrl) bandCtrl.className = "Band expanded";
                }
                
                var paneCtrl = Global.document.getElementById(newPane.ID);
                if(paneCtrl) paneCtrl.style.display = "block";
                
                this.SelectedPane = newPane;
                this.SelectedTabIndex = idx;
                this.SelectedPane.IsActive = true;
                this.SelectedPane.IsSelectedTab = true;
                
                var tabpaneCtrl = this.SelectedPane.get_Control();
                if(tabpaneCtrl && Global.InstanceOf(tabpaneCtrl, "EpiPanel"))
                {
		            var ebf = Global.Form;
		            if (ebf != null && ebf.trans != null && ebf.baseToolbarsManager != null && ebf.FormLoaded)
		            {
			            ebf.trans.disableAddDelete();
		            }
                }
			    if (tabpaneCtrl && !clickEventArgs)  
                {
                    var c = Global.document.getElementById(tabpaneCtrl.ID);
                    if(c) tabpaneCtrl._focusin(c);
                }
                
                this.OnPaneActivate(newPane);
                this.TriggerGridRowChanged(newPane); // Appbuilt forms only
                Global.Form.ResizeForm();
                
                if(Global.TabManager.PaneStyle=="tab")
                {   
                    Global.BindingEngine.UserChgTab = true;
                    Global.BindingEngine.BindTab(paneCtrl, null);
                    Global.BindingEngine.UserChgTab = false;
                }
            }

            break;
        }
        ii++
    }
    
}

EpiTabGroup.prototype.RemoveTab=function(tabCtrl)
{
    var eventArgs={"Cancel":false,"Key":tabCtrl.getAttribute("_key")};
    this.get_Event("Removing").fire(this,eventArgs);    
    
    if(eventArgs.Cancel==false)
    {
    var tabPage = this.Pages[tabCtrl.getAttribute("_key")];  
    
    var tabIndex = tabPage.Index;
      
    var paneCtrl = Global.document.getElementById(tabPage.Key);
    
    if (paneCtrl)
    {
        //Delete the panel from HTML
        paneCtrl.parentNode.removeChild(paneCtrl);
    }
    //delete Page from Pages array
    delete this.Pages[tabCtrl.getAttribute("_key")];
    /*
    var index = parseInt(tabPage.Index);
    
    this.Pages.splice(tabPage.Index, 0);
    */
   
    //Remove Tab Strips    
    tabCtrl.parentNode.removeChild(tabCtrl);
     
    this.ReIndexTabPages(tabIndex);
    if (this.get_TabCount() >= 1)
    {    
        if(tabIndex == this.get_SelectedIndex())
        {
            this.SelectedPane = null;
            this.SelectedTabIndex = null;
            if (tabIndex >= this.get_TabCount() )
                this.SetSelectedTabIndex(this.Control, 0);
            else                
                this.SetSelectedTabIndex(this.Control, tabIndex);               
        }
        else
        {
            if (this.SelectedTabIndex > tabIndex)
                this.SelectedTabIndex = this.SelectedTabIndex - 1;
        }
    }
    else
    {    
        this.SelectedPane = null;
        this.SelectedTabIndex = null;
    }
    }
}


EpiTabGroup.prototype.ReIndexTabPages=function(startedIndex)
{
    for(var page in this.Pages)
    {
        //check for the last page
        if (this.Pages[page].Index > startedIndex)
            this.Pages[page].Index--;
    }       
}
EpiTabGroup.prototype.GetNextPage=function(currentPage)
{
    var isReturnNextPage = false;
    for(var page in this.Pages)
    {
        if (isReturnNextPage)
        {
            return this.Pages[page];
        }        
        else if (this.Pages[page] == currentPage && !isReturnNextPage)
        {
            isReturnNextPage = true;
        }        
    } 
    return null;    
}

EpiTabGroup.prototype._imgClick=function(e)
{
    var ctrl = e.target||e.srcElement;
    
    //ctrl.parentElement.removeChild(ctrl);
    
    var tabCtrl = ctrl.parentNode.parentNode;
    
    this.RemoveTab(tabCtrl);
}

EpiTabGroup.prototype._imgMousemove=function(e)
{  
    var ctrl = e.target||e.srcElement;
    ctrl.src = "img/deletetab.png"; 
}

EpiTabGroup.prototype._imgMouseout=function(e)
{
    var ctrl = e.target||e.srcElement;

    var tabCtrl = ctrl.parentNode.parentNode;
        
    if(this.Pages[tabCtrl.getAttribute("_key")] != this.SelectedPane )
    {
        ctrl.src = "img/disableddeletetab.png"; 
    }
}

EpiTabGroup.prototype._mousemove=function(e)
{
    var ctrl = e.target||e.srcElement;

    var tabCtrl = this._searchForTabCtrl(ctrl);
        
    if(tabCtrl)
    {
        var tab = this.Pages[tabCtrl.getAttribute("_key")];
        if(tab!=this.SelectedPane && tabCtrl.className!="Tab highlight") tabCtrl.className = "Tab highlight"; 
    }
}
EpiTabGroup.prototype._mouseout=function(e)
{
    var ctrl = e.target||e.srcElement;

    var tabCtrl = this._searchForTabCtrl(ctrl);
        
    if(tabCtrl)
    {
        var tab = this.Pages[tabCtrl.getAttribute("_key")];
        if(tab!=this.SelectedPane) tabCtrl.className = "Tab";
    }
}
EpiTabGroup.prototype._click=function(e)
{
    var ctrl = e.target||e.srcElement;

    var tabCtrl = this._searchForTabCtrl(ctrl);
        
    if(tabCtrl)
    {
        var tab = this.Pages[tabCtrl.getAttribute("_key")];
        if(tab!=this.SelectedPane) this.SetSelectedTabIndex(this.Control, tab.Index, e);
    }
}
EpiTabGroup.prototype._searchForTabCtrl=function(currentCtrl)
{
    var tabCtrl;
    	
    while(currentCtrl && !currentCtrl.className.StartsWith("TabGroup") && !tabCtrl)
    {
        var keyStr = currentCtrl.getAttribute("_key");
        if(keyStr) 
        {
            if(this.Pages[keyStr]) tabCtrl = currentCtrl;
        }
    
	    currentCtrl = currentCtrl.parentNode;
    }
        	
    return tabCtrl;
}
EpiTabGroup.prototype.OnPaneActivate=function(pane){return this.get_Event("PaneActivate").fire(this, {Pane:pane});}
EpiTabGroup.prototype.TriggerGridRowChanged=function(pane)
{
    var grid = pane.get_Control();
    if (grid && grid instanceof EpiGridPanel)
    {
        if(Global.Form.trans)
           Global.Form.trans.LastUpdatePanel = grid;
       var dv = grid.get_PrimaryViewName() ;
       dv= Global.BindingEngine.EpiDataViews[dv];
       if (dv && dv.dataView.Count > 0) // There is only row, trigger the row changed
       {
          dv._isNotifying = true;   
		  var args =  new EpiNotifyArgs(dv, dv.Row, -1, true, new EpiOverloadedArgs("Object_Int32_Int32_Boolean"));
		  args.ChangeGridPropsCurrentRowOnly = true;
          dv.OnEpiViewNotification(args); 
          dv._isNotifying = false;
       }
    }
    else if (grid && grid instanceof EpiTrackerPanel && Global.Form.trans)
    {
        Global.Form.trans.LastUpdatePanel = grid;
    }
     if (Global.Form.trans && Global.Form.trans.LastUpdatePanel)
            AppControllerPanel.resetMenuForUpdate(Global.BindingEngine.EpiDataViews[Global.Form.trans.LastUpdatePanel.get_PrimaryViewName()]);
}
//------------------------------------
// EpiTabPage
//------------------------------------
var EpiTabPage = Epicor.Mfg.UI.FrameWork.EpiTabPage = function (settings)
{
    if(settings && settings.SkipProcessing==true) return;

    EpiControl.call(this,settings);
   
    if(settings)
    {
        this.Key = settings.Key;
        this.Caption = settings.Caption; 
        this.Tab = settings.Tab;
        this.Index = settings.Index;
        if(settings.IsVisible==false) this.IsVisible = false;
        Global.Form._panes[settings.ID]=this;
    }
    this.TabPage=this;
}
EpiTabPage.prototype = new EpiControl({"SkipProcessing":true});
EpiTabPage.prototype.TypeName = "EpiTabPage";
EpiTabPage.prototype.TabGroup = null;
EpiTabPage.prototype.IsActive = false;
EpiTabPage.prototype.IsSelectedTab = false;
EpiTabPage.prototype.IsVisible = true;
EpiTabPage.prototype.get_Tab=function(){return this};
EpiTabPage.prototype.set_Closed=function(value)
{
    if(value==true && this.get_IsSelectedTab())
    {
        var tabCnt = this.TabGroup.get_TabCount();
        
        var found = false;
        var idx = this.Index + 1;
        while(idx<tabCnt)
        {
            if(this.TabGroup.get_Tab(idx).get_Visible())
            {
                this.TabGroup.set_SelectedIndex(idx);
                found = true;
                break;
            }
            idx++;
        }
        
        if(!found)
        {
            idx = this.Index-1;
            while(idx>=0)
            {
                if(this.TabGroup.get_Tab(idx).getVisible())
                {
                    this.TabGroup.set_SelectedIndex(idx);
                    break;
                }
                idx--;
            }
        }
    }
    this.set_Visible(!value);
    

}
EpiTabPage.prototype.get_Closed=function()
{
    return !this.get_Visible();
}
EpiTabPage.prototype.get_IsSelectedTab=function()
{
    return (this.TabGroup && this.Index==this.TabGroup.get_SelectedIndex());
}
EpiTabPage.prototype.set_IsSelectedTab=function(value)
{
    if(value) this.Activate();
}
EpiTabPage.prototype.get_Text=function()
{
    return this.Caption;
}
EpiTabPage.prototype.set_Text=function(val)
{
    var tabCtrl = Global.document.getElementById("tab_" + this.ID);
    if(tabCtrl)
    {
        var labels = tabCtrl.getElementsByTagName("LABEL");
        if(labels)
        {
            labels[0].innerText = val;
            this.Caption = val;
        }
    }
}
EpiTabPage.prototype.set_Visible=function(val)
{
    var tabCtrl = Global.document.getElementById("tab_" + this.ID);
    if(tabCtrl)
    {
        if(val==true)
        {
            tabCtrl.style.display = "";
        }
        else
        {
            tabCtrl.style.display = "none";
        }
    } 
}
EpiTabPage.prototype.get_Control=function()
{
    var thisCtrl = Global.document.getElementById(this.ID);
    var divs = thisCtrl.getElementsByTagName("DIV");
    if(divs.length>0)
    {
        return Global.BindingEngine.Controls[divs[0].id];
    }
}
EpiTabPage.prototype.get_Controls=function()
{
    return this.get_Control();
}
EpiTabPage.prototype.Activate=function()
{
    this.IsActive=true;
    
    if(this.TabGroup)
    {
        this.TabGroup.set_SelectedIndex(this.Index);
        this.TabGroup.Focus(); 
    }
}
EpiTabPage.prototype.Close=function()
{
    this.set_Visible(false);
}

//------------------------------------
// EpiZone
//------------------------------------
var EpiZone = Epicor.Mfg.UI.FrameWork.EpiZone = function (parent, hideZone, zoneColor)
{
    EpiControl.call(this,{"ID":parent.ID + "_epizone"});
    this.HideZone = hideZone;
    this.ZoneColor = zoneColor;
    this.Control = parent;
    this._origParentWidth = -1;
    this.searchOnEmpty = false;
}
EpiZone.prototype = new EpiControl();
EpiZone.prototype.TypeName = "EpiZone";

EpiZone.AddZoneIndicator=function(parent,parentCtrl, ZoneColor, hideZone)
{
    if (hideZone == undefined) hideZone = false;
    // create the Zone and auto Add it to the Parent
    var epiZone = new EpiZone(parent, hideZone, ZoneColor);
    epiZone.parentCtrl = parentCtrl;
    parent.EpiZone = epiZone;
    epiZone.initZone();
    
    if (!parent.InGrid && !hideZone) // Add the icon if we are not in a grid
    {
        var imgCtrl = parent.AddZoneIndicator(epiZone, parentCtrl);
        if (imgCtrl) EpiEventManager.addListener(imgCtrl, "mouseover",epiZone._domouseover, epiZone, true);
	}
	
	
	return epiZone;
}
EpiZone.prototype.initZone=function()
{
    if (this.Control) 
    {
        this.EpiBinding = this.Control.get_EpiBinding();
        if (this.parentCtrl)
            this.CurrentValue= this.Control.GetDataVal(this.parentCtrl); // value from the epidataview
        this.EpiX = Global.Form.trans;
    }
}
EpiZone.prototype.get_ZoneSearchOnEmptyControl=function(){return this.searchOnEmpty;}
EpiZone.prototype._domouseover=function(e)
{
     var ctrl = e.target||e.srcElement; 
     if (ctrl.className=="Infozone")
     {
        // Make sure mouse is within the infozone image
        var mouse_X = e.clientX + document.body.scrollLeft;
        var mouse_Y = e.clientY + document.body.scrollTop;
        var ctrlPos = Global.GetPosition(ctrl);     
        var rightLimit = ctrlPos.x + ctrlPos.width;
        var leftLimit = rightLimit - 8;
        if (mouse_X < leftLimit ||  mouse_X > rightLimit)
            return;
     }
     if (ctrl && (ctrl.className=='EpiZoneIndicator' || ctrl.className=="Infozone"))
     {
        if (EpiZone.popupMgr && EpiZone.popupMgr.get_HasActiveZonePopup())
            EpiZone.popupMgr.closePopup();
            
        if (!EpiZone.popupMgr)
            EpiZone.popupMgr = new ZonePopupManager();
        if (ctrl.className == "Infozone") // This is the TD element
        {
            var fields = ctrl.getElementsByTagName("input");
            if(fields.length > 0)
                ctrl = fields[0];
            else
                ctrl = ctrl.getElementsByTagName("div")[0];
        }
        else if (ctrl.className == "EpiZoneIndicator")
            ctrl = this.parentCtrl;
            
        EpiZone.popupMgr.ShowZonePopup(this, ctrl);
     }
}

EpiZone.prototype._showContextPopup=function()
{
    if (EpiZone.popupMgr && EpiZone.popupMgr.get_HasActiveZonePopup())
        EpiZone.popupMgr.closePopup();
            
    if (!EpiZone.popupMgr)
        EpiZone.popupMgr = new ZonePopupManager();
    EpiZone.popupMgr.ShowZonePopup(this, this.parentCtrl);
}
EpiZone.prototype.SetEnabled=function(enabledFlg, zoneCtrl)
{
    if (enabledFlg)
    {
        zoneCtrl.style.backgroundColor="lightGreen"; // this.ZoneColor
        zoneCtrl.className = 'EpiZoneIndicator';
    }
    else
    {
        zoneCtrl.style.backgroundColor=""; // this.ZoneColor
        zoneCtrl.className = 'EpiZoneIndicator-disabled';
    }
}

EpiZone.prototype.adjustInfozoneAndParent=function(zoneCtrl)
{
    if (this.parentCtrl)
    {
        var currentParentWidth = parseInt(this.parentCtrl.style.width.replace("px",""));
        if (this._origParentWidth == -1 || this._origParentWidth > currentParentWidth)
        {
            this._origParentWidth = currentParentWidth;
            if (this.parentCtrl.className == "DropControl")
               this.parentCtrl.style.width = (currentParentWidth - 8) + "px";
            else
               this.parentCtrl.style.width = (currentParentWidth - 4) + "px";
        } 
        
        var parentWidth = parseInt(this.parentCtrl.style.width.replace("px",""));
        var left = parseInt(this.parentCtrl.style.left.replace("px","")) + parentWidth;
        zoneCtrl.style.left = left + "px";
    }
}
EpiZone.prototype.GetZoneIndicatorImage=function(parent, parentCtrl)
{
    // build a rectangle of the specified height (width=8) and color
    if (!parentCtrl) return null;
    
    var divCtrl = Global.document.createElement("span");
    divCtrl.style.height = (this.parentCtrl.offsetHeight-2) + "px";
    divCtrl.style.top = this.parentCtrl.style.top;
    divCtrl.id=this.ID;
    this.adjustInfozoneAndParent(divCtrl);
    //this.SetEnabled(true, divCtrl); // Enabled by default
    return divCtrl;
}

function navbutton_onclick(ctrl,to)
{
    Global.BindingEngine.OnPage(ctrl,to);
}

// TEMPORARY CODE END
