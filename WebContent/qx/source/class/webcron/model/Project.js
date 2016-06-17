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
	    "removeJob" : "qx.event.type.Data"
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
		
		refresh : function(){
			
			qx.core.Init.getApplication().getJobStore().getJobsResource().get();
			
		}
	}
})