qx.Class.define("webcron.model.Notification", {
	extend : qx.core.Object,

	construct : function (){
		this.base(arguments);
	},
	
	properties : {
		/**
		 * Notify
		 */
		notify : {
			check : "Integer",
			event : "changeNotify",
			init : 0
		},
		
		/**
		 * Internet addresses (comma separated)
		 */
		internetAddresses : {
			check : "String",
			event : "changeInternetAddresses",
			init : "test@test.com"
		},

		/**
		 * Subject
		 */
        subject : {
            check : "String",
            event : "changeSubject",
            nullable:true
        },
		
        /**
		 * Text
		 */
        text : {
            check : "String",
            event : "changeText",
            nullable:true
        },
		
        /**
		 * Script
		 */
        script : {
            check : "String",
            event : "changeScript",
            init:""
        }
	},

	
	members :
	{

	}
})