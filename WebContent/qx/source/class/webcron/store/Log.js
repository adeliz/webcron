qx.Class.define("webcron.store.Log", {
	extend : qx.core.Object,
	
	properties : {

		/**
		 * logs rest resource (plural)
		 */
		logsResource : {
			event : "changeLogsResource"
		},

		/**
		 * Logs store
		 */
		logStore : {
			event : "changeLogStore"
		}
	},

	construct : function() {
		this.base(arguments);

		var logs = new qx.io.rest.Resource({
			get : {
				method : "GET",
				url : qx.core.Environment.baseUrl + "job/{id}/logs"
			}
		});
		this.setLogsResource(logs);


		logs.addListener("success", function(e) {
			
			var model = qx.core.Init.getApplication().getLogsView()._controller.getModel();

			var logs = e.getData();
			
			if(model.length>0){
				var last = model.getItem(0).getStartTime();
				
				
				for(i=0;i<logs.length;i++){
					
					if(logs[i].startTime>last){
						qx.core.Init.getApplication().getLogsView()._controller.getModel().unshift(qx.data.marshal.Json.createModel(logs[i]));
					}
					
				}
			}else{
				qx.core.Init.getApplication().getLogsView()._controller.setModel(qx.data.marshal.Json.createModel(logs));
			}
			
			
			//Select automatically the last log
			if(qx.core.Init.getApplication().getLogsView()._controller.getModel().length>0){
				if(qx.core.Init.getApplication().getLogsView()._controller.getSelection().length==0){
					var ar = new qx.data.Array();
					ar.push(qx.core.Init.getApplication().getLogsView()._controller.getModel().getItem(0));
					qx.core.Init.getApplication().getLogsView()._controller.setSelection(ar);
				}
			}
			
				
			
			/*var selection=null;
			if(model){
				for(var i=0;i<model.length;i++){
    				if(model.getItem(i).getStartTime()==qx.core.Init.getApplication().index) {
    					selection=model.getItem(i);
    				}
    			}
			}
			
			var ar = new qx.data.Array();
			ar.push(selection);
			qx.core.Init.getApplication().getLogsView()._controller.setSelection(ar);*/

		},this);

		var logsStore = new qx.data.store.Rest(logs, "get");
		this.setLogStore(logsStore);
	},

	members : {

	}
})