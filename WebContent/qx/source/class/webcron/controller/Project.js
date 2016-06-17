qx.Class.define("webcron.controller.Project",{

    extend : qx.core.Object,
    include : [qx.locale.MTranslation],

    construct: function(){
        this._initializeCommands();

    },

    members:{

        __commands : null,


        /**
         * Initialize commands (shortcuts, ...)
         */
        _initializeCommands : function()
        {
            var commands = {};

            commands.create = new qx.ui.command.Command("Control+N").set({
            	icon : "webcron/icons/plus.png"
            });
            commands.create.addListener("execute", function(){
                this.create();
            }, this);
            
            commands.test = new qx.ui.command.Command().set({
            	icon:"webcron/icons/play.png",
            	enabled:false
            });
            commands.test.addListener("execute", function(){
                this.test();
            }, this);

            commands.active = new qx.ui.command.Command().set({
            	icon:"webcron/icons/repeat.png",
            	enabled:false
            });
            commands.active.addListener("execute",function(e){
            	var model = qx.core.Init.getApplication().getJobsList()._controller.getSelection().getItem(0);
            	
            	if(!e.getData().getValue()){
            		//activate
            		model.setActive(true);
                }else{
                	//deactivate
                	model.setActive(false);
                }
            	
            	var job = qx.util.Serializer.toNativeObject(model);
            	qx.core.Init.getApplication().getJobStore().getJobResource().put({id:model.getId()}, job);
            	
            },this);
            
            commands.update = new qx.ui.command.Command().set({
            	icon:"webcron/icons/edit.png",
            	enabled:false
            });
            commands.update.addListener("execute", function(){
                this.update();
            }, this);

            commands.remove = new qx.ui.command.Command().set({
            	icon:"webcron/icons/minus.png",
            	enabled:false
            });
            commands.remove.addListener("execute", function(){
                this.remove();
            }, this);

            commands.duplicate = new qx.ui.command.Command().set({
            	icon:"webcron/icons/copy.png",
            	enabled:false
            });
            commands.duplicate.addListener("execute", function(){

            	var model = qx.core.Init.getApplication().getJobsList()._controller.getSelection().getItem(0);
                
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
            				form:model.getRequest().getForm()
            			},
            			notification:{
            				notify:model.getNotification().getNotify(),
            				internetAddresses:model.getNotification().getInternetAddresses(),
            				subject:model.getNotification().getSubject(),
            				text:model.getNotification().getText(),
            				script:model.getNotification().getScript()
            			}
            	}
                
                var req = new qx.io.request.Xhr(qx.core.Environment.baseUrl+"job/","POST");
            	req.setRequestData(job);
            	req.setRequestHeader("Content-Type","application/json; charset=UTF-8");
        		req.addListener("success", function(e) {
        			
        			model.setId(e.getTarget().getResponse().id)
        			qx.core.Init.getApplication().getProject().addJob(model);
        			qx.core.Init.getApplication().getProject().refresh();

        		});
        		req.send();
            }, this);
            
            commands.autorefresh = new qx.ui.command.Command();

            
            commands.refresh = new qx.ui.command.Command();
            commands.refresh.addListener("execute", function(){
                this.refresh();
            }, this);
            
            commands.help = new qx.ui.command.Command("F1");
            commands.help.addListener("execute", function(){window.open(config.help)}, this);

            commands.bug = new qx.ui.command.Command();
            commands.bug.addListener("execute", function(){window.open(config.issues)}, this);

            commands.about = new qx.ui.command.Command();
            commands.about.addListener("execute", this.about, this);

            this.__commands = commands;
        },

        /**
         * Get the command with the given command id
         *
         * @param commandId {String} the command's command id
         * @return {qx.ui.core.Command} The command
         */
        getCommand : function(commandId) {
            return this.__commands[commandId];
        },

        create : function(){   		
        	
        	var editor = new webcron.editor.Editor("Add");
            qx.core.Init.getApplication().getRoot().add(editor);
            qx.core.Init.getApplication().getRoot().setBlockerColor("#aaa");
            qx.core.Init.getApplication().getRoot().setBlockerOpacity(0.5);
            editor.open();
    		
        },
        
        test : function(){
        	var model = qx.core.Init.getApplication().getJobsList()._controller.getSelection().getItem(0);
        	qx.core.Init.getApplication().getJobStore().getJobResource().run({id:model.getId()});    		
        },
        
        update : function(){
    		
        	var editor = new webcron.editor.Editor("Update");
            qx.core.Init.getApplication().getRoot().add(editor);
            qx.core.Init.getApplication().getRoot().setBlockerColor("#aaa");
            qx.core.Init.getApplication().getRoot().setBlockerOpacity(0.5);
            editor.open();
    		
        },
        
        remove : function(){
        	var model = qx.core.Init.getApplication().getJobsList()._controller.getSelection().getItem(0);
        	var req = new qx.io.request.Xhr(qx.core.Environment.baseUrl+"job/"+model.getId(),"DELETE");
    		req.addListener("success", function(e) {
		
    		}, this);
    		
    		req.send();
    		qx.core.Init.getApplication().getProject().removeJob(model);
        },
        
        refresh : function(){
    		qx.core.Init.getApplication().getProject().refresh();
        },

        about : function(){
            var win = this.win = new qx.ui.window.Window(this.tr("About")).set({
                width:320,
                height:120,
                showMaximize : false,
                showMinimize : false,
                showClose : true,
                modal : true,
                contentPadding: 10,
                margin : 15
            });
            this.win.setLayout(new qx.ui.layout.VBox());

            win.addListener("resize", function(){
                this.center();
            }, win);

            /*var layout = new qx.ui.layout.VBox();
            layout.setSpacing(5);
            var container  = new qx.ui.container.Composite(layout).set({
                margin:5
            }); */
            var html = this.html = new qx.ui.embed.Html("<b>"+config.name+"</b><br>Automates HTTP requests and sends notifications<br>Version ");
            //container.add(html);
            var req = new qx.io.request.Xhr(qx.core.Environment.baseUrl+"version/","GET");

        	//req.setRequestHeader("Content-Type","application/json");
    		req.addListener("success", function(e) {
    			
    			this.html.setHtml("<b>"+config.name+"</b><br>Automates HTTP requests and sends notifications<br>"+e.getTarget().getResponse());

    		}, this);
    		
    		req.send();
    		
            this.win.add(html,{flex:1});
            this.win.show();
        },
        
        setEnabled : function(enabled){
        	if(enabled){
        		this.getCommand("test").set({enabled:true});
        		this.getCommand("update").set({enabled:true});
        		this.getCommand("remove").set({enabled:true});
        		this.getCommand("duplicate").set({enabled:true});
        		this.getCommand("active").set({enabled:true});

        		if(qx.core.Init.getApplication().getJobsList()._controller.getSelection().getItem(0).getActive()){
        			this.getCommand("active").setValue(true);
        		}else{
        			this.getCommand("active").setValue(false);
        		}
        	}else{
        		this.getCommand("test").set({enabled:false});
        		this.getCommand("update").set({enabled:false});
        		this.getCommand("remove").set({enabled:false});
        		this.getCommand("duplicate").set({enabled:false});
        		this.getCommand("active").set({enabled:false});
        	}
        }
    }
});
