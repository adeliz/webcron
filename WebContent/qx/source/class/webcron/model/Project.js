qx.Class.define("webcron.model.Project", {
	extend : qx.core.Object,

	construct : function (){
		this.base(arguments);
	},
	
	properties : {
		/**
		 * Jobs
		 */
		jobs : {
			check : "qx.data.Array",
			init : new qx.data.Array()
		}
	},

	events : {
		/**
		 * Fired when a job is added
		 */
	    "addJob" : "qx.event.type.Data",
	    /**
	     * Fired when a job is removed
	     */
	    "removeJob" : "qx.event.type.Data",
	    /**
	     * Fired when a job is updated
	     */
	    "updateJob" : "qx.event.type.Data"
	},
	
	members :
	{
		/**
		 * Add a job
		 * @param job {webcron.model.Job} Job
		 */
		addJob : function(job){
			this.getJobs().push(job);
			this.fireDataEvent("addJob",job);
		},
		
		/**
		 * Remove a job
		 * @param job {webcron.model.Job} Job
		 */
		removeJob : function(job){
			this.getJobs().remove(job);
			this.fireDataEvent("removeJob",job);
		},
		
		/**
		 * Update a job
		 * @param job {webcron.model.Job} Job
		 */
		updateJob : function(job){
			
			var oldJob = this.getJobs().filter(function(item){
				return job.getId()==item.getId();
			}).getItem(0);
			var index = this.getJobs().indexOf(oldJob);

			if(oldJob){
				//var oldJob = this.getJobs().getItem(index);
				if(job.getNextexecution()!=oldJob.getNextexecution()){
					//oldJob.setNextexecution(job.getNextexecution());
					//this.getJobs().setItem(index,job);
					

					var clazz = qx.Class.getByName(job.classname); 
					var props = qx.Class.getProperties(clazz); 

					for (var i in props) { 
						if (props.hasOwnProperty(i)) { 
							var prop = job["get"+qx.lang.String.firstUp(props[i])](); 
							oldJob["set"+qx.lang.String.firstUp(props[i])](prop);

						}
					}
				}
				this.fireDataEvent("updateJob",job);
			}
			
		},
		
		refresh : function(){
			
			qx.core.Init.getApplication().getJobStore().getJobsResource().get();
			if(qx.core.Init.getApplication().getJobsList()){
				var selection = qx.core.Init.getApplication().getJobsList()._controller.getSelection();
				if(selection.length>0){
					qx.core.Init.getApplication().getLogStore().getLogsResource().get({id:selection.getItem(0).getId()});
				}
			}
			
			
			
		}
	}
})