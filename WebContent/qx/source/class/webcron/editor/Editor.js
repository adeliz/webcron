qx.Class.define("webcron.editor.Editor",
    {
        extend : qx.ui.window.Window,

        properties :
	        {
	        /**
	         * Job editor
	         */
	        jobEditor : {
	            init : null
	        },
	        
	        /**
	         * Request editor
	         */
	        requestEditor : {
	            init : null
	        },
	        
	        /**
	         * Notification editor
	         */
	        notificationEditor : {
	            init : null
	        },
	        
	        /**
	         * Script editor
	         */
	        scriptEditor : {
	            init : null
	        }
	    },

        construct : function(method)
        {
        	this.base(arguments);
        	
        	
        	this.set({
				width : 450,
				//height:80,
				showMaximize : false,
				showMinimize : false,
				showClose : true,
				modal : true,
				contentPadding : 10,
				margin : 15
			});
        	this.setLayout(new qx.ui.layout.VBox());

			this.addListener("resize", function() {
				this.center();
			}, this);
			
    		this.__initForm();
    		
    		if(method=="Add"){
        		this.setCaption(this.tr("Add job"));
        	}else{
        		this.setCaption(this.tr("Edit job"));
        		
        		if(qx.core.Init.getApplication().getJobsList()._controller.getSelection().length>0){
        			this.setModel(qx.core.Init.getApplication().getJobsList()._controller.getSelection().getItem(0));
        		}
        	}
        	
    		
			var composite = new qx.ui.container.Composite().set({
                marginTop: 8
            });
            composite.setLayout(new qx.ui.layout.HBox().set({
                spacing: 4,
                alignX: "right"
            }));
            var cancelButton = new qx.ui.form.Button("Cancel");
            cancelButton.addListener("click", function (e) {
                this.close();
            }, this);
            var addButton = new qx.ui.form.Button("Add");
            if(method=="Add"){
            	addButton.setLabel(this.tr("Add"));
        	}else{
        		addButton.setLabel(this.tr("Update"));
        	}
            addButton.addListener("click", function (e) {
            	var model = this.getModel();

            	if(method=="Add"){

            		var job = {
                			name: model.getName(),
                			description: model.getDescription(),
                			cron:model.getCron(),
                			active:model.getActive(),
                			alarm:false,
                			request:{
                				method:model.getRequest().getMethod(),
                				url:model.getRequest().getUrl(),
                				body:model.getRequest().getBody(),
                				type:model.getRequest().getType()
                			},
                			notification:{
                				notify:model.getNotification().getNotify(),
                				internetAddresses:model.getNotification().getInternetAddresses(),
                				subject:model.getNotification().getSubject(),
                				text:model.getNotification().getText(),
                				script:model.getNotification().getScript(),
                				filename:model.getNotification().getFilename()
                				//script:this.getScriptEditor()._ace.getSession().getValue()
                			}
            		}
                			
            		qx.core.Init.getApplication().getJobStore().getJobResource().post(null, job);
            		
            	}else{
            		
            		var job = qx.util.Serializer.toNativeObject(model);
            		
            		qx.core.Init.getApplication().getJobStore().getJobResource().put({id:model.getId()}, job);
            		
            	}
            	
        		
        		//req.send();
        		this.close();
        		
            }, this);
            composite.add(addButton);
            composite.add(cancelButton);
            this.add(composite);
    		
    		
        },
        
        members : {
        	__initForm : function(){
        		
        		var tabView = this.tabView = new qx.ui.tabview.TabView();
        	      
        	    this.setNotificationEditor(new webcron.editor.Notification());
        	    this.setScriptEditor(new webcron.editor.Script(this)); 
        	    this.setRequestEditor(new webcron.editor.Request());
        	      
        	    var page1 = new qx.ui.tabview.Page("Job","webcron/icons/job.png");
        	    page1.setLayout(new qx.ui.layout.VBox());
        	    this.setJobEditor(new webcron.editor.Job());   
        	    page1.add(this.getJobEditor(),{flex:1});
        	    tabView.add(page1);

        	    var page5 = new qx.ui.tabview.Page("Request","webcron/icons/request.png");
        	    page5.setLayout(new qx.ui.layout.VBox());
        	    page5.add(this.getRequestEditor(),{flex:1});
        	    tabView.add(page5);
        	      
        	    var page3 = new qx.ui.tabview.Page("Notification","webcron/icons/email.png");
        	    page3.setLayout(new qx.ui.layout.VBox());
        	    page3.add(this.getNotificationEditor(),{flex:1});
        	    tabView.add(page3);
        	      
        	    var page4 = new qx.ui.tabview.Page("Script","webcron/icons/code.png");
        	    page4.setLayout(new qx.ui.layout.VBox());
        	    page4.add(this.getScriptEditor(),{flex:1});
        	    tabView.add(page4);
        	      
        	    var req = new webcron.model.Request("GET","http://www.example.com","");
          		var job = new webcron.model.Job("New Job","0/60 * * * * ?",false,"",req);
          		var not = new webcron.model.Notification();
          		job.setNotification(not);
          		this.setModel(job);
        		//pane.add(composite);
                this.add(tabView,{flex:1});
        	},
        	
        	setModel: function(model){
        		this.getJobEditor().jobFormController.setModel(model);
        		this.getRequestEditor().requestFormController.setModel(model.getRequest());
        		this.getNotificationEditor().notificationFormController.setModel(model.getNotification());
        	},
        	
        	getModel: function(){
        		var job = this.getJobEditor().jobFormController.getModel();
        		return job;
        		//this.requestFormController.setModel(model.getRequest());
        	}
        	
        }
    })
        