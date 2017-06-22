qx.Class.define("webcron.view.JobsList",
    {
        extend : qx.ui.container.Composite,


        construct : function()
        {
        	this.base(arguments);
        	
        	var layout = new qx.ui.layout.VBox;
    		this.setLayout(layout);
    		layout.setSeparator("separator-vertical");
    		this.setDecorator("main");

    		var cont = new qx.ui.container.Composite(new qx.ui.layout.HBox);
    		var img = new qx.ui.basic.Image("webcron/icons/list.png").set({
    			marginTop : 10,
    			marginLeft:10,
    			marginRight:5
    		});
    		
    		var caption = new qx.ui.basic.Label(this.tr("Jobs List")).set({
                font       : "bold",
                padding    : 5,
                allowGrowX : true,
                allowGrowY : true/*,
                backgroundColor:"#3d72c9",
                textColor: "#fff"*/
            });
    		cont.add(img);
    		cont.add(caption);
    		this.add(cont);
            
    		var list = this._list = new qx.ui.form.List();
    		list.setDecorator(null);

    		
            
    		var controller = this._controller = new qx.data.controller.List(qx.core.Init.getApplication().getProject().getJobs(), list,"name");
        	
    		//Listener
            controller.addListener("changeSelection",function(e){
                if(list.getSelection().length>0){
                	qx.core.Init.getApplication().projectController.setEnabled(true);
                	
                	
                	
                	/*var selection = qx.core.Init.getApplication().getLogsView()._controller.getSelection();
        			var ind=null;
        			if(selection.length>0){
        				ind=selection.getItem(0).getStartTime();
        			}
        			
                	qx.core.Init.getApplication().index = ind;*/
                	
                	
                	qx.core.Init.getApplication().getLogsView()._controller.setModel(new qx.data.Array());
                	
                	qx.core.Init.getApplication().getLogStore().getLogsResource().get({id:e.getData().getItem(0).getId()});
                }else{
                	if(qx.core.Init.getApplication().getLogsView()){
                		qx.core.Init.getApplication().getLogsView()._controller.setModel(new qx.data.Array());
                	}
                	
                	qx.core.Init.getApplication().projectController.setEnabled(false);
                }
            });
            
            list.addListener("dbltap", function(e) {
    			
    			qx.core.Init.getApplication().projectController.getCommand("update").execute();

    		});
            
         // create the filter
            var filterObj = new webcron.view.SearchAsYouTypeFilter(this._controller);

            // set the filter
            controller.setDelegate(filterObj);

            
    		/*controller.setDelegate({

                createItem : function() {
                    return new webcron.view.JobWidget();
                },

                bindItem : function(controller, item, id) {
                    controller.bindProperty("", "model", null, item, id);
                    //controller.bindPropertyReverse("", "model", null, item, id);
                    controller.bindProperty("name", "name", null, item, id);
                    //controller.bindPropertyReverse("name", "name", null, item, id);
                    controller.bindProperty("status", "status", null, item, id);
                    controller.bindProperty("nextexecution", "nextexecution", null, item, id);
                    controller.bindProperty("lastexecution", "lastexecution", null, item, id);
                    
                    controller.bindProperty("active", "active", null, item, id);
                    controller.bindPropertyReverse("active", "active", null, item, id);

                },

                configureItem : function(item) {

                }
            });*/
    		
    		// make every input in the textfield update the controller
            qx.core.Init.getApplication().getToolBar().textfield.bind("changeValue", filterObj, "searchString");
            
            
			this.add(this._list, {
				flex : 1
			});
			
        }
})