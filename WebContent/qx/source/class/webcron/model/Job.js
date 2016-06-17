qx.Class.define("webcron.model.Job", {
	extend : qx.core.Object,

	construct : function (name,cron, active,description,request){
		this.base(arguments);
		this.setName(name);
		this.setCron(cron);
		this.setActive(active);
		this.setDescription(description);
		this.setRequest(request);
		
		//this.initFilters(new qx.data.Array());
		//this.addListener("")
	},
	
	properties : {
		/**
		 * Id
		 */
		id : {
			check : "Number",
			event : "changeId"
		},
		
		/**
		 * Name
		 */
		name : {
			check : "String",
			event : "changeName",
			init : ""
		},

		/**
		 * Description
		 */
        description : {
            check : "String",
            event : "changeDescription",
            nullable:true
        },
		
        /**
		 * Cron
		 */
        cron : {
            check : "String",
            event : "changeCron",
            init:""
        },
        
        /**
         * Active
         */
		active : {
			check : "Boolean",
			event : "changeActive",
            init : true
		},
		
		/**
         * Last execution
         */
		lastexecution : {
			check : "Number",
			event : "changeLastexecution",
            nullable : true
		},
		
		/**
         * Next execution
         */
		nextexecution : {
			check : "Number",
			event : "changeNextexecution",
            nullable : true
		},
		
		/**
		 * Request
		 */
		request : {
			check : "webcron.model.Request",
			event : "changeRequest",
			nullable:true,
			init : null
		},
		
		/**
		 * Notification
		 */
		notification : {
			check : "webcron.model.Notification",
			event : "changeNotification",
			nullable:true,
			init : null
		},
		
		/**
		 * Last log
		 */
		lastLog : {
			check : "webcron.model.Log",
			event : "changeLastLog",
			nullable:true,
			init : null
		}
	},

	
	members :
	{

	}
})