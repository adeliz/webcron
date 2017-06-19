qx.Class.define("webcron.view.JobDetail",
    {
        extend : qx.ui.container.Scroll,


        construct : function()
        {
        	this.base(arguments);
        	
        	var comp = new qx.ui.container.Composite();
        	var layout = new qx.ui.layout.Grid(2, 7);
            layout.setColumnFlex(1, 1);
        	comp.setLayout(layout);
    		//layout.setSeparator("separator-vertical");

        	/*var font = new qx.bom.Font().set({
        		bold:true
        	});*/
    		this.name = new qx.ui.basic.Label("").set({rich:true});
    		this.description = new qx.ui.basic.Label("").set({rich:true});
    		
    		this.crontitle = new qx.ui.basic.Label("<b>"+this.tr("Cron")+"</b> :").set({rich:true,paddingTop:20});
    		this.cron = new qx.ui.basic.Label("").set({rich:true,paddingTop:20});
    		
    		this.methodtitle = new qx.ui.basic.Label("<b>"+this.tr("Method")+"</b> :").set({rich:true,paddingTop:20});
    		this.method = new qx.ui.basic.Label("").set({rich:true,paddingTop:20});
    		this.urltitle = new qx.ui.basic.Label("<b>"+this.tr("Url")+"</b> :").set({rich:true});
    		this.url = new qx.ui.basic.Label("").set({rich:true});
    		
    		this.notificationtitle = new qx.ui.basic.Label("<b>"+this.tr("Notification")+"</b> :").set({rich:true,paddingTop:20});
    		this.notification = new qx.ui.basic.Label("").set({rich:true,paddingTop:20});
    		this.emailstitle = new qx.ui.basic.Label("<b>"+this.tr("Emails")+"</b> :").set({rich:true});
    		this.emails = new qx.ui.basic.Label("").set({rich:true});
    		//this.emails.hide();
    		
    		comp.add(this.name,{row: 0, column: 0,colSpan:2});
    		comp.add(this.description,{row: 1, column: 0,colSpan:2,rowSpan:1});
    		comp.add(this.crontitle,{row: 2, column: 0});
    		comp.add(this.cron,{row: 2, column: 1});
    		comp.add(this.methodtitle,{row: 3, column: 0});
    		comp.add(this.method,{row: 3, column: 1});
    		comp.add(this.urltitle,{row: 4, column: 0});
    		comp.add(this.url,{row: 4, column: 1});
    		comp.add(this.notificationtitle,{row: 5, column: 0});
    		comp.add(this.notification,{row: 5, column: 1});
    		comp.add(this.emailstitle,{row: 6, column: 0});
    		comp.add(this.emails,{row: 6, column: 1});
    		
    		this.set({
				allowGrowY : true
			});
			
			this.add(comp);
			
			//binding
	    	this.controller = qx.core.Init.getApplication().getJobsList()._controller;
	    	this.controller.bind("selection[0].name", this.name, "value",{converter: function(value) {
	    		if(!value){
	    			value="";
	    		}
	    		return "<b>"+value+"</b>";
            }});
	    	this.controller.bind("selection[0].description", this.description, "value",{converter: function(value) {
	    		if(value){
	    			value = value.replace(/\n/g,'<br>');
	    		}else{
	    			value = null;
	    		}
	    		return value;
            }});
	    	this.controller.bind("selection[0].cron", this.cron, "value");
	    	this.controller.bind("selection[0].request.method", this.method, "value");
	    	this.controller.bind("selection[0].request.url", this.url, "value");
	    	var obj = this;
	    	this.controller.bind("selection[0].notification.notify", this.notification, "value",{converter: function(value) {
	    		var not = "";
	    		switch (value){
    			case 0:
    				not= obj.tr("Never");
    				break;
    			case 1:
    				not= obj.tr("If request fails");
    				break;
    			case 2:
    				not= obj.tr("If script returns true");
    				break;
    			case 3:
    				not= obj.tr("Always");
    				break;
    			}
	    		return not;
            }},this);
	    	this.controller.bind("selection[0].notification.internetAddresses", this.emails, "value",{converter: function(value) {
	    		var emails = "";
	    		if (value){
	    			emails=value;
    			}
	    		return emails;
            }});
	    	
        },
        
        members : {
    		/*setModel : function(model){
    			this.name.setValue("<b>"+model.getName()+"</b>");
    			this.description.setValue(model.getDescription().replace(/\n/g,'<br>'));
    			this.cron.setValue("<b>Cron</b> : "+model.getCron());
    			this.method.setValue("<b>Method</b> : "+model.getRequest().getMethod());
    			this.url.setValue("<b>Url</b> : "+model.getRequest().getUrl());
    			switch (model.getNotification().getNotify()){
    			case 0:
    				this.notification.setValue("<b>Notification</b> : Never");
    				break;
    			case 1:
    				this.notification.setValue("<b>Notification</b> : If execution fails");
    				break;
    			case 2:
    				this.notification.setValue("<b>Notification</b> : After execution");
    				break;
    			}
    			
    			if(model.getNotification().getNotify()!=0){
    				this.emails.setValue("<b>Emails</b> : "+model.getNotification().getInternetAddresses());
    				this.emails.show();
    			}else{
    				this.emails.hide();
    			}
    		},
    		
    		reset : function(){
    			this.name.setValue("");
        		this.description.setValue("");
        		this.cron.setValue("");
        		this.method.setValue("");
        		this.url.setValue("");
        		this.notification.setValue("");
        		this.emails.setValue("");
    		}*/
        }
})