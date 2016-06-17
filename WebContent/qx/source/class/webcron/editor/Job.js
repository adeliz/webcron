qx.Class.define("webcron.editor.Job",
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
        		
        		var jobForm = new qx.ui.form.Form();
        		
        		var name = new qx.ui.form.TextField();
        		var description = new qx.ui.form.TextArea();
        		var active = new qx.ui.form.CheckBox();
        		var cron = new qx.ui.form.TextField();
        		
        		jobForm.add(name,"Name");
        		jobForm.add(description,"Description");
        		jobForm.add(active,"Active");
        		jobForm.add(cron,"Cron");
                
                var jobRenderedForm = new qx.ui.form.renderer.Single(jobForm);
                jobRenderedForm.getLayout().setColumnFlex(0,0);
                jobRenderedForm.getLayout().setColumnMinWidth(0,90);
                jobRenderedForm.getLayout().setColumnFlex(1,1);
        		
        		this.jobFormController = new qx.data.controller.Form(null, jobForm);
        		
        		var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        			paddingTop:10
        		});
        		pane.add(jobRenderedForm);
        		//pane.add(composite);
                this.add(pane,{flex:1});
        	}/*,
        	
        	setModel: function(model){
        		this.jobFormController.setModel(model);
        		qx.core.Init.getApplication().getRequestEditor().requestFormController.setModel(model.getRequest());
        		qx.core.Init.getApplication().getNotificationView().notificationFormController.setModel(model.getNotification());
        	},
        	
        	getModel: function(){
        		var job = this.jobFormController.getModel();
        		return job;
        		//this.requestFormController.setModel(model.getRequest());
        	}*/
        	
        }
    })
        