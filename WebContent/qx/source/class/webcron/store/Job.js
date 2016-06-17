qx.Class.define("webcron.store.Job", {
	extend : qx.core.Object,

	construct : function() {
		this.base(arguments);

		// Singular resource
		var job = new qx.io.rest.Resource({
			get : {
				method : "GET",
				url : qx.core.Environment.baseUrl + "job/{id}"
			},

			put : {
				method : "PUT",
				url : qx.core.Environment.baseUrl + "job/{id}"
			},

			post : {
				method : "POST",
				url : qx.core.Environment.baseUrl + "job/"
			},

			del : {
				method : "DELETE",
				url : qx.core.Environment.baseUrl + "job/{id}"
			},

			run : {
				method : "GET",
				url : qx.core.Environment.baseUrl + "job/{id}/test"
			}
		});
		job.configureRequest(function(req, action, params, data) {
			if (action === "put" || action === "post") {
				//console.log(data);
				req.setRequestHeader("Content-Type","application/json; charset=UTF-8");
				//req.setRequestData(data);
			}
		});
		this.setJobResource(job);

		// Plural resource
		var jobs = new qx.io.rest.Resource({
			// Retrieve list of jobs
			get : {
				method : "GET",
				url : qx.core.Environment.baseUrl + "job/list"
			}
		});
		this.setJobsResource(jobs);

		job.addListener("success", function(e) {
			switch (e.getAction()) {
			case "get":
				break;
			case "post":
				//model.setId(e.getTarget().getResponse().id)
				console.log("success");
    			//qx.core.Init.getApplication().getProject().addJob(e.getData());
    			qx.core.Init.getApplication().getProject().refresh();
				break;
			case "put":
				qx.core.Init.getApplication().getProject().refresh();
				break;
			case "del":
				qx.core.Init.getApplication().getProject().refresh();
				break;
			case "run":
				qx.core.Init.getApplication().getProject().refresh();
				break;
			}

			//should only refresh the list???

		});

		jobs.addListener("success", function(e) {
			
			var selection = qx.core.Init.getApplication().getJobsList()._controller.getSelection();
			var ind=null;
			if(selection.length>0){
				ind=selection.getItem(0).getId();
			}
			
			qx.core.Init.getApplication().getProject().getJobs().removeAll();
			var jobs = e.getData();
			
			for(i=0;i<jobs.length;i++){
				
				
				/**
				 * http://qooxdoo.678.n2.nabble.com/Re-JSON-getItem-td7584246.html
				 * 1. use duck-typing to check if any accessor is available 
				 * 2. use a custom model class for every item which will hold null values for you 
				 * 3. change the data to contain the fields with null values 
				 * 
				 * I chose solution 3 because I don't understand solution 1 and didn't succeed with solution 2 
				 */
				
				if(!jobs[i].nextexecution){
					jobs[i].nextexecution=null;
				}
				if(!jobs[i].lastexecution){
					jobs[i].lastexecution=null;
				}
				if(!jobs[i].request.form){
					jobs[i].request.form=null;
				}
				if(!jobs[i].notification.subject){
					jobs[i].notification.subject=null;
				}
				if(!jobs[i].notification.text){
					jobs[i].notification.text=null;
				}
				
				var status = "";
				if(!jobs[i].active){
					status="Inactive";
				}
				if(jobs[i].lastlog){
					status = "OK";
					if(!(typeof jobs[i].lastlog.scriptResult === "undefined")){
						if(jobs[i].lastlog.scriptResult){
							status= "Script success";
						}else{
							status= "Script error";
						}
					}
					if(jobs[i].lastlog.status!=200){
						status = jobs[i].lastlog.statusText+" ("+jobs[i].lastlog.status+")";
					}
				}
				jobs[i].status = status;

				
				/*var delegate = {
					getModelClass : function(properties) {
				        switch(properties){
					        case 'active"alarm"cron"description"id"name"notification"request':
					        	return webcron.model.Job;
					        	break;
					        case 'internetAddresses"notify"script':
					        	return webcron.model.Notification;
					        	break;
					        case 'body"method"url':
					        	return webcron.model.Request;
					        	break;
				        }
				        return webcron.model.Job;
				      }	
				};
				
				var marshaler = new qx.data.marshal.Json(delegate);
				marshaler.toClass(jobs[i]);
				var model = marshaler.toModel(jobs[i]);*/
				
				qx.core.Init.getApplication().getProject().addJob(qx.data.marshal.Json.createModel(jobs[i]));
			}
			
			var model = qx.core.Init.getApplication().getJobsList()._controller.getModel();
			var selection=null;
			for(var i=0;i<model.length;i++){
				if(model.getItem(i).getId()==ind) {
					selection=model.getItem(i);
				}
			}
			var ar = new qx.data.Array();
			ar.push(selection);
			qx.core.Init.getApplication().getJobsList()._controller.setSelection(ar);

		});
		var jobStore = new qx.data.store.Rest(jobs, "get");
		this.setJobStore(jobStore);
	},

	properties : {
		/**
		 * job's rest resource (single)
		 */
		jobResource : {
			event : "changeJobResource"
		},

		/**
		 * jobs rest resource (plural)
		 */
		jobsResource : {
			event : "changeJobsResource"
		},

		/**
		 * Jobs store
		 */
		jobStore : {
			event : "changeJobStore"
		}
	},

	members : {

	}
})