qx.Class.define("webcron.editor.Script",
    {
        extend : qx.ui.container.Composite,


        construct : function(editor)
        {
        	this.base(arguments);
        	
        	var layout = new qx.ui.layout.VBox;
    		this.setLayout(layout);
    		//layout.setSeparator("separator-vertical");
            this._editor = editor;
    		this.__initForm();
    		
    		
        },
        
        members : {
        	__initForm : function(){
      		
        		
        		var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
        			//paddingTop:10,
        			decorator:"main"
        		});

        		pane.addListenerOnce("appear",function(){
	        		var editor = this._ace = window.ace.edit(pane.getContentElement().getDomElement());
	            	editor.getSession().setMode("ace/mode/javascript");
	            	var ed = this._editor;
	            	if(qx.core.Init.getApplication().getJobsList()._controller.getSelection().length>0){
	            		editor.on('change',function(){
		            		ed.getModel().getNotification().setScript(editor.getSession().getValue());
		            	});
		            	editor.getSession().setValue(this._editor.getModel().getNotification().getScript());
		            	
	            	}
	            	
        		},this);

        		pane.addListener("appear",function(){
	        		this._ace.resize();
        		},this);

        		var html = new qx.ui.embed.Html("This part allows you to create a javascript function, named <b>fx</b> that returns a boolean (true/false). True will send a notification. The only parameter is the response of the request (body). Leave empty to not use it.");
        		html.setHeight(70);
        		var html2 = new qx.ui.embed.Html("<a href='#'>Paste example</a>");
        		html2.setHeight(30);
        		html2.addListener("click",function(){
        			this._ace.setValue("function fx(response){\r\n" + 
				    "    var resp = JSON.parse(response);\r\n" + 
				    "    var value = resp.queries[0].results[0].values[0][1];\r\n" + 
				    "    if(value>5.5){\r\n" + 
				    "        return true;\r\n" + 
				    "    }else{\r\n" + 
				    "        return false;\r\n" + 
				    "    }\r\n" + 
				    "}");
        		},this);
        		//html.setHeight(150);
        		this.add(html);
        		this.add(html2);
        		this.add(pane,{flex:1});
        	}        	
        }
    })
        