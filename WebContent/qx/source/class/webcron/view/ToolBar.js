qx.Class.define("webcron.view.ToolBar",{
    extend : qx.ui.toolbar.ToolBar,

    construct : function(){
        this.base(arguments);

        this.setDecorator("main");
        //var controller = this.controller = qx.core.Init.getApplication().mapController;
        var projectController = qx.core.Init.getApplication().projectController;
        
        /*this._chartButton = new qx.ui.toolbar.Button("Refresh","chart/icons/refresh.png");
        this._chartButton.addListener("execute",function(e){

        },this);*/

        var actionPart = new qx.ui.toolbar.Part();
        
        var duplPart = new qx.ui.toolbar.Part();
        
        var runPart = new qx.ui.toolbar.Part();
        
        //var refreshPart = new qx.ui.toolbar.Part();
        //actionPart.add(this._chartButton);
        //actionPart.add(new qx.ui.toolbar.Button("Add",null,projectController.getCommand("link")));
        //actionPart.add(new qx.ui.toolbar.Button("Remove",null,projectController.getCommand("remove")));
        
        actionPart.add(new qx.ui.toolbar.Button(this.tr("New..."), null, projectController.getCommand("create")).set({
        	show:"icon",
        	height:29,
            toolTipText:"Create a new job..."
        }));
        
        actionPart.add(new qx.ui.toolbar.Button(this.tr("Edit..."), null, projectController.getCommand("update")).set({
        	show:"icon",
            toolTipText:"Modify the selected job..."
        }));
        actionPart.add(new qx.ui.toolbar.Button(this.tr("Delete"), null, projectController.getCommand("remove")).set({
        	show:"icon",
            toolTipText:"Delete the selected job"
        }));
        //actionPart.addSeparator();
        //actionPart.add(new qx.ui.toolbar.Button(this.tr("Duplicate"), null, projectController.getCommand("duplicate")));
        //actionPart.addSeparator();
        duplPart.add(new qx.ui.toolbar.Button(this.tr("Duplicate"), null, projectController.getCommand("duplicate")).set({
        	show:"icon",
            toolTipText:"Duplicate the selected job"
        }));
        
        
        runPart.add(new qx.ui.toolbar.Button(this.tr("Test"), null, projectController.getCommand("test")).set({
        	show:"icon",
            toolTipText:"Execute the selected job once"
        }));
        var activeButton = new qx.ui.toolbar.CheckBox(this.tr("Repeat"), "webcron/icons/repeat.png").set({
        	show:"icon",
            toolTipText:"Activate the selected job"
        });
        activeButton.setCommand(projectController.getCommand("active"));
        runPart.add(activeButton);
        
        //refreshPart.add(new qx.ui.toolbar.Button(this.tr("Refresh"),"webcron/icons/refresh.png",projectController.getCommand("refresh")));
        
        
        //this.add(refreshPart);
        //this.addSpacer();

        this.add(actionPart);
        this.add(duplPart);
        this.add(runPart);
        
        this.textfield = new qx.ui.form.TextField().set({
        	marginLeft:4,
        	marginRight:20,
        	width:150,
        	placeholder:'Search...'
        });
        this.textfield.setAlignY("middle");
        this.textfield.setLiveUpdate(true);
        this.addSpacer();
        this.add(this.textfield);
        //this.addSpacer();
        
        
    },
    
    members : {
    	
    }
    
    
});
