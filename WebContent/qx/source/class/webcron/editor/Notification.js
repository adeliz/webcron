qx.Class.define("webcron.editor.Notification",
    {
        extend : qx.ui.container.Composite,


        construct : function()
        {
        	this.base(arguments);
        	
        	var layout = new qx.ui.layout.VBox;
    		this.setLayout(layout);
    		layout.setSeparator("separator-vertical");
    		//this.setDecorator("main");
    		
    		/*var caption = new qx.ui.basic.Label(this.tr("Job Editor")).set({
                font       : "bold",
                padding    : 5,
                allowGrowX : true,
                allowGrowY : true,
                backgroundColor:"#3d72c9",
                textColor: "#fff"
            });
            this.add(caption);*/
            
    		this.__initForm();
    		
    		
        },
        
        members : {
        	__initForm : function(){
        		
        		var notificationForm = new qx.ui.form.Form();
        		
        		var notify = new qx.ui.form.SelectBox();
    	        var notifys = [
    	          	{label: this.tr("Never"), data: 0},
    	          	{label: this.tr("If request fails"), data: 1},
    	          	{label: this.tr("If script returns true"), data: 2},
    	          	{label: this.tr("Always"), data: 3}
    	        ];
    	        var nModel = qx.data.marshal.Json.createModel(notifys);
    	        var nController = new qx.data.controller.List(null, notify);
    		    nController.setDelegate({bindItem: function(controller, item, index) {
    		        controller.bindProperty("label", "label", null, item, index);
    		        controller.bindProperty("data", "model", null, item, index);
    		    }});
    		 	nController.setModel(nModel);
        		var internetAddresses = new qx.ui.form.TextField();
        		var subject = new qx.ui.form.TextField();
        		var text = new qx.ui.form.TextArea();
        		var script = new qx.ui.form.TextArea();
        		var filename = new qx.ui.form.TextField();
        		
        		notificationForm.add(notify,"Notify");
        		notificationForm.add(internetAddresses,"InternetAddresses");
        		notificationForm.add(subject,"Subject");
        		notificationForm.add(text,"Text");
        		notificationForm.add(filename,"Filename");
        		//notificationForm.add(script,"Script");
        		
        		var notificationRenderedForm = new qx.ui.form.renderer.Single(notificationForm).set({
        			paddingTop:10
        		});
        		notificationRenderedForm.getLayout().setColumnFlex(0,0);
        		notificationRenderedForm.getLayout().setColumnMinWidth(0,90);
        		notificationRenderedForm.getLayout().setColumnFlex(1,1);
        		notificationRenderedForm.getLayout().setRowFlex(3,1);
        		//notificationRenderedForm.getLayout().setRowFlex(4,1);

        		this.notificationFormController = new qx.data.controller.Form(null, notificationForm);        		
        		
        		var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        			paddingTop:10
        		});

        		pane.add(notificationRenderedForm,{flex:1});

                this.add(pane,{flex:1});
        	}        	
        }
    })
        