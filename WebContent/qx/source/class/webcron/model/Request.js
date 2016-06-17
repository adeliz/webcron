qx.Class.define("webcron.model.Request", {
	extend : qx.core.Object,

	construct : function (method,url,body){
		this.base(arguments);
		this.setMethod(method);
		this.setUrl(url);
		this.setBody(body);
	},
	
	properties : {
		/**
		 * Method - GET, POSt, PUT, DELETE
		 */
		method : {
			check : "String",
			event : "changeMethod",
			init : "GET"
		},

		/**
		 * Url
		 */
        url : {
            check : "String",
            event : "changeUrl",
            init:"http://example.com/"
        },
		
        /**
		 * Body
		 */
        body : {
            check : "String",
            event : "changeBody",
            nullable:true
        },
		
        /**
		 * Form
		 */
        form : {
            check : "String",
            event : "changeForm",
            nullable:true
        }
	},

	
	members :
	{

	}
})