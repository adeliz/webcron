/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qx"
 *
 * @asset(editor/*)
 * @asset(webcron/*)
 * @asset(config.js)
 */
qx.Class.define("webcron.Application",
{
  extend : qx.application.Standalone,

  properties :
  {
      /**
       * Jobs view
       */
      jobsView : {
          init : null
      },     
     
      /**
       * Jobs list
       */
      jobsList : {
          init : null
      },   
      
      /**
       * Editor
       */
      editor : {
          init : null
      },
      
      /**
       * Logs view
       */
      logsView : {
          init : null
      },
      
      /**
       * JobDetail view
       */
      jobDetailView : {
          init : null
      },
      
      /**
       * Project
       */
      project : {
          init : null
      },
      
      /**
       * jobstore
       */
      jobStore : {
          init : null
      },
      
      /**
       * logstore
       */
      logStore : {
          init : null
      },
      
      /**
       * ToolBar
       */
      toolBar : {
          init : null
      },
      /**
       * Menu
       */
      menu : {
          init : null
      }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {

    	qx.core.Environment.baseUrl="http://cmhm-sig/webcron/api/v1/";
    	if(window.location.search.split("=")[1]=="test"){
    		qx.core.Environment.baseUrl="http://localhost:8080/webcron/api/v1/";
    	}
    	
    	var jobstore = new webcron.store.Job();
    	this.setJobStore(jobstore);
    	
    	var logstore = new webcron.store.Log();
    	this.setLogStore(logstore);
    	
      //qx.core.Environment.host="../../";
      //qx.core.Environment.host="http://localhost:8080/webcron/";
      //qx.core.Environment.host="http://cmhm-sig/webcron/";
      // Call super class
      this.base(arguments);
      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug")) {
          // support native logging capabilities, e.g. Firebug for Firefox
          qx.log.appender.Native;
          // support additional cross-browser console. Press F7 to toggle visibility
          qx.log.appender.Console;
      }
      qx.log.appender.Native;
      // support additional cross-browser console. Press F7 to toggle visibility
      qx.log.appender.Console;

      //set theme
      qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
      //qx.theme.manager.Meta.getInstance().setTheme(ae.theme.Material);

      //the application root
      var root = this._root = this.getRoot();


      //---------------------------Model-----------------------------------
      var projectController = this.projectController = new webcron.controller.Project();
      var project = new webcron.model.Project();
      
      project.refresh();
		
		//var store = qx.data.store.Json("http://localhost:8080/webcron/api/v1/job/list");
		
      //project.addJob(job);
      //project.addJob(job2);
      this.setProject(project);

      //--------------------------Header----------------------------------------------------
      var workbench = new qx.ui.container.Composite();

      var layout = new qx.ui.layout.VBox;
      workbench.setLayout(layout);

      var header = new qx.ui.container.Composite(
          new qx.ui.layout.HBox()).set({
              decorator: null
          });
      //header.setAppearance("app-header");
      var img = new qx.ui.basic.Image("webcron/app_header.png").set({
          marginRight: 15
      });
      var title = this.title = new qx.ui.basic.Label(config.name).set({
          marginTop: 10,
          marginLeft: 6,
          rich: true,
          textColor: "#333"
      });
      var myFont = new qx.bom.Font(18, ["Arial", "Segoe UI"]).set({
          bold: true
      });
      title.setFont(myFont);

      header.add(img);

      var midHeader = new qx.ui.container.Composite(new qx.ui.layout.VBox());
      midHeader.add(title);

      this.setMenu(new webcron.view.Menu());
      midHeader.add(this.getMenu());

      header.add(midHeader);
      header.add(new qx.ui.core.Widget(),{flex:1});

      workbench.add(header);
      //----------------------------ToolBar-------------------------------------------------
      this.setToolBar(new webcron.view.ToolBar());
      workbench.add(this.getToolBar());
      //----------------------------Body----------------------------------------------------

      var pane = new qx.ui.splitpane.Pane("horizontal").set({
          margin:5
      });
      pane.getChildControl("splitter").setBackgroundColor("white");
      
      var pane2 = new qx.ui.splitpane.Pane("vertical").set({
          margin:5
      });
      pane2.getChildControl("splitter").setBackgroundColor("white");
      
      this.setJobsList(new webcron.view.JobsList());
      pane.add(this.getJobsList(),3);
      
      
      this.setEditor(new webcron.editor.Editor());
      
      var tabView = this.tabView = new qx.ui.tabview.TabView();
      pane.add(tabView,2);
      
      var page1 = new qx.ui.tabview.Page("Details","webcron/icons/details.png");
		page1.setLayout(new qx.ui.layout.VBox());
		this.setJobDetailView(new webcron.view.JobDetail());  
		page1.add(this.getJobDetailView(),{flex:1});
		
      var page2 = new qx.ui.tabview.Page("Logs","webcron/icons/logs.png");
		page2.setLayout(new qx.ui.layout.VBox());
		this.setLogsView(new webcron.view.Logs());  
		page2.add(this.getLogsView(),{flex:1});
	
		tabView.add(page1);
		tabView.add(page2);
		//this.getEditor().tabView.add(page2);
      //pane2.add(this.getLogsView(),2);
      
      //pane.add(pane2,2);
      
      workbench.add(pane, {flex : 1});

      //Autorefresh
      var timer = this.timer = new qx.event.Timer();
      timer.addListener("interval",function(e){
    	  qx.core.Init.getApplication().getProject().refresh();   	  
      });
      timer.startWith(10000);
      root.add(workbench, {
          edge : 0
      });
    }
  }
});
