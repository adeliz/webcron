qx.Class.define("webcron.editor.Request",
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
        		
        		var requestForm = new qx.ui.form.Form();

        		
        		var method = new qx.ui.form.SelectBox();
    	        var methods = [
    	          	{label: this.tr("GET"), data: "GET"},
    	          	{label: this.tr("POST"), data: "POST"},
    	          	{label: this.tr("PUT"), data: "PUT"},
    	          	{label: this.tr("DELETE"), data: "DELETE"}
    	        ];
    	        var mModel = qx.data.marshal.Json.createModel(methods);
    	        var mController = new qx.data.controller.List(null, method);
    		    mController.setDelegate({bindItem: function(controller, item, index) {
    		        controller.bindProperty("label", "label", null, item, index);
    		        controller.bindProperty("data", "model", null, item, index);
    		    }});
    		 	mController.setModel(mModel);
        		var url = new qx.ui.form.TextField();
        		
        		var body = new qx.ui.form.TextArea();

        		var bodytype = new qx.ui.form.SelectBox();
    	        var bodytypes = [
                 	{label: this.tr("raw"), data: "raw"},
    	          	{label: this.tr("form-data"), data: "form-data"},
    	          	{label: this.tr("x-www-formurlencoded"), data: "x-www-formurlencoded"}
    	        ];
    	        var bModel = qx.data.marshal.Json.createModel(bodytypes);
    	        var bController = new qx.data.controller.List(null, bodytype);
    	        bController.setDelegate({bindItem: function(controller, item, index) {
    		        controller.bindProperty("label", "label", null, item, index);
    		        controller.bindProperty("data", "model", null, item, index);
    		    }});
    	        bController.setModel(bModel);
    		 	
                
        		requestForm.add(method,"Method");
        		requestForm.add(url,"Url");
        		requestForm.add(bodytype,"Type");
        		requestForm.add(body,"Body");
        		
        		var requestRenderedForm = new qx.ui.form.renderer.Single(requestForm).set({
        			paddingTop:10
        		});
        		requestRenderedForm.getLayout().setColumnFlex(0,0);
        		requestRenderedForm.getLayout().setColumnMinWidth(0,90);
        		requestRenderedForm.getLayout().setColumnFlex(1,1);
        		//requestRenderedForm.getLayout().setRowFlex(2,1);
        		requestRenderedForm.getLayout().setRowFlex(3,1);
        		
        		this.requestFormController = new qx.data.controller.Form(null, requestForm);        		
        		
        		
        		var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        			paddingTop:10
        		});
        		pane.add(requestRenderedForm,{flex:1});
        		//pane.add(composite);
                this.add(pane,{flex:1});
        	}
        	
        }
    })
        