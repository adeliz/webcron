qx.Class.define("webcron.view.Menu",
    {
        extend: qx.ui.menubar.MenuBar,

        construct: function () {
            this.base(arguments);

            this.setPadding(0);
            this.setBackgroundColor("white");

            var menujob = new qx.ui.menu.Menu();
            var newjobButton = new qx.ui.menu.Button(this.tr("New..."), null, qx.core.Init.getApplication().projectController.getCommand("create"));
            var editjobButton = new qx.ui.menu.Button(this.tr("Edit..."), null, qx.core.Init.getApplication().projectController.getCommand("update"));
            var deljobButton = new qx.ui.menu.Button(this.tr("Delete"), null, qx.core.Init.getApplication().projectController.getCommand("remove"));
            var testjobButton = new qx.ui.menu.Button(this.tr("Test"), null, qx.core.Init.getApplication().projectController.getCommand("test"));
            var activejobButton = new qx.ui.menu.CheckBox(this.tr("Active"), null);
            activejobButton.setCommand(qx.core.Init.getApplication().projectController.getCommand("active"));
            var dupljobButton = new qx.ui.menu.Button(this.tr("Duplicate"), null, qx.core.Init.getApplication().projectController.getCommand("duplicate"));
            menujob.add(newjobButton);
            menujob.add(editjobButton);
            menujob.add(deljobButton);
            menujob.addSeparator();
            menujob.add(dupljobButton);
            menujob.addSeparator();
            menujob.add(activejobButton);
            menujob.add(testjobButton);
            
            var jobMenu = new qx.ui.menubar.Button(this.tr("Job"), null, menujob);
            
            
            var menuhelp = new qx.ui.menu.Menu();
            var helpButton = new qx.ui.menu.Button(this.tr("Help contents"), null, qx.core.Init.getApplication().projectController.getCommand("help"));
            var bugButton = new qx.ui.menu.Button(this.tr("Report an issue"), null, qx.core.Init.getApplication().projectController.getCommand("bug"));
            var aboutButton = new qx.ui.menu.Button(this.tr("About"), null, qx.core.Init.getApplication().projectController.getCommand("about"));
            menuhelp.add(helpButton);
            menuhelp.add(bugButton);
            menuhelp.add(aboutButton);
            
            var helpMenu = new qx.ui.menubar.Button(this.tr("Help"), null, menuhelp);


            var menusettings = new qx.ui.menu.Menu();
            var autoButton = new qx.ui.menu.CheckBox(this.tr("Auto-refresh"), null, qx.core.Init.getApplication().projectController.getCommand("autorefresh")).set({
                value:true
            });
            autoButton.addListener("changeValue",function(e){
                if(e.getData()){
                    qx.core.Init.getApplication().timer.startWith(10000);
                    //this.refreshButton.setEnabled(false);
                }else{
                	qx.core.Init.getApplication().timer.stop();
                	//this.refreshButton.setEnabled(true);
                }
            },this);
            var refreshButton =this.refreshButton = new qx.ui.menu.Button(this.tr("Refresh"), "webcron/icons/refresh.png", qx.core.Init.getApplication().projectController.getCommand("refresh"));
            menusettings.add(autoButton);
            menusettings.add(refreshButton);

            var settingsMenu = new qx.ui.menubar.Button(this.tr("Settings"), null, menusettings);
            
            this.add(jobMenu);
            this.add(settingsMenu);
            this.add(helpMenu);
        }
    });