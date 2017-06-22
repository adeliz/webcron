qx.Class.define("webcron.view.Logs",
    {
        extend : qx.ui.container.Composite,


        construct : function()
        {
        	this.base(arguments);
        	
        	var layout = new qx.ui.layout.VBox;
    		this.setLayout(layout);
    		
			var spane = new qx.ui.splitpane.Pane("vertical").set({
		          margin:5
		      });
			spane.getChildControl("splitter").setBackgroundColor("white");    		
    		
    		var store = new qx.data.store.Rest(qx.core.Init.getApplication().getLogStore().getLogsResource(), "get");
    		var list = new qx.ui.form.List();
    		//list.setDecorator(null);
    		var controller = this._controller = new qx.data.controller.List(new qx.data.Array(), list, "statusText");
    		//store.bind("model", controller, "model");
    		
    		controller.setDelegate({
                bindItem : function(controller, item, id) {
                    controller.bindProperty("", "model", null, item, id);

                    controller.bindProperty("", "label", {converter: function(value) {
                        return moment(value.getStartTime()).format("YYYY-MM-DD HH:mm:ss")+" "+value.getStatusText()+ " ("+value.getStatus()+")";
                    }}, item, id);

                }
            });
    		
    		//this.controller = qx.core.Init.getApplication().getJobsList()._controller;
	    	//this.controller.bind("selection[0].logs", list, "model");
    		//var controller = this._controller = new qx.data.controller.List(qx.core.Init.getApplication().getProject().getJobs(), list,"name");

			var comp = new qx.ui.container.Composite();
			var layout = new qx.ui.layout.Grid(2, 7);
            layout.setColumnFlex(1, 1);
            layout.setRowFlex(6, 1);
        	comp.setLayout(layout);

        	this.starttimetitle = new qx.ui.basic.Label("<b>"+this.tr("Start Time")+"</b> :").set({rich:true});
        	this.starttime = new qx.ui.basic.Label("").set({rich:true});
    		this.httpcodetitle = new qx.ui.basic.Label("<b>"+this.tr("HTTP Status Code")+"</b> :").set({rich:true});
    		this.httpcode = new qx.ui.basic.Label("").set({rich:true});
    		this.statustext = new qx.ui.basic.Label("").set({rich:true});
    		this.durationtitle = new qx.ui.basic.Label("<b>"+this.tr("Duration")+"</b> :").set({rich:true});
    		this.duration = new qx.ui.basic.Label("").set({rich:true});
    		this.bodytitle = new qx.ui.basic.Label("<b>"+this.tr("Body")+"</b> :").set({rich:true});
    		this.body = new qx.ui.form.TextArea();
    		this.scripttitle = new qx.ui.basic.Label("<b>"+this.tr("Script result")+"</b> :").set({rich:true});
    		this.script = new qx.ui.basic.Label("").set({rich:true});
    		
    		comp.add(this.starttimetitle,{row: 0, column: 0});
    		comp.add(this.starttime,{row: 0, column: 1});
    		comp.add(this.httpcodetitle,{row: 1, column: 0});
    		comp.add(this.httpcode,{row: 1, column: 1});
    		comp.add(this.statustext,{row: 2, column: 1});
    		comp.add(this.durationtitle,{row: 3, column: 0});
    		comp.add(this.duration,{row: 3, column: 1});
    		comp.add(this.scripttitle,{row: 4, column: 0});
    		comp.add(this.script,{row: 4, column: 1});
    		comp.add(this.bodytitle,{row: 5, column: 0});
    		comp.add(this.body,{row: 6, column: 0, colSpan:2});
			
			spane.add(list,1);
			spane.add(comp,1);
			
			this.add(spane, {
				flex : 1
			});
			//binding
	    	controller.bind("selection[0].startTime", this.starttime, "value",{
	    		converter: function(value) {
	    			if(value){
	    				return moment(value).format("YYYY-MM-DD HH:mm:ss");
	    			}else{
	    				return null;
	    			}
	            }
	    	});
	    	controller.bind("selection[0].status", this.httpcode, "value");
	    	controller.bind("selection[0].statusText", this.statustext, "value");
	    	controller.bind("selection[0].duration", this.duration, "value");
	    	controller.bind("selection[0].body", this.body, "value");
	    	controller.bind("selection[0].scriptResult", this.script, "value");

        }
})