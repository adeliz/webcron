qx.Class.define("webcron.model.Log", {
	extend : qx.core.Object,

	construct : function (status,statustext, headers,body, duration){
		this.base(arguments);
		this.setStatus(status);
		this.setStatusText(statustext);
		this.setHeaders(headers);
		this.setBody(body);
		this.setDuration(duration);
		
		/*if (value !== undefined) {
		      this.setValue(value);
		    } else {
		      this.initValue();
		    }*/
		
		
		//this.initFilters(new qx.data.Array());
		//this.addListener("")
	},
	
	properties : {
		/**
		 * Status
		 */
		status : {
			check : "Number",
			event : "changeStatus"
		},
		
		/**
		 * statusText
		 */
		statusText : {
			check : "String",
			event : "changestatusText",
			nullable:true
		},

		/**
		 * Headers
		 */
        headers : {
            check : "String",
            event : "changeHeaders",
            nullable:true
        },
		
        /**
		 * Body
		 */
        body : {
            check : "String",
            event : "changeBody",
            init:""
        },
		
        /**
		 * Duration
		 */
        duration : {
            check : "Number",
            event : "changeDuration"
        },
		
        /**
		 * Script result
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