/**
 * Layer widget (widget representing a layer in the layer view)
 */
qx.Class.define("webcron.view.JobWidget",
    {
        extend: qx.ui.core.Widget,
        include: [qx.ui.form.MModelProperty],

        /**
         * Create a new instance of layer widget
         */
        construct: function () {
            this.base(arguments);

            // initialize the layout and allow wrap for "post"
            var layout = new qx.ui.layout.Grid(4, 6);
            layout.setColumnFlex(2, 1);
            this._setLayout(layout);
            /*this.setDecorator("main");
            this.setMargin(10);
            this.addListener("mouseover",function(e){
            	this.setBackgroundColor("#f8f8f8");
            },this);
            this.addListener("mouseout",function(e){
            	this.setBackgroundColor("#ffffff");
            },this);*/
            // create the widgets
            this._createChildControl("icon");
            this._createChildControl("name");
            this._createChildControl("status");
            this._createChildControl("lastexecution");
            this._createChildControl("nextexecution");
            this._createChildControl("active");
            //this._createChildControl("opacity2");
        },

        properties: {
            /**
             * The space between the icon and the label
             */
            gap :
            {
                themeable : true
            },

            /**
             * The appearance ID.
             */
            appearance: {
                refine: true,
                init: "listitem"
            },

            /**
             * Any URI String supported by qx.ui.basic.Image to display an icon
             */
            icon: {
                check: "String",
                apply: "_applyIcon",
                nullable: true
            },

            /**
             * Visible name of the layer
             */
            name: {
                check: "String",
                apply: "_applyName",
                nullable: true
            },

            /**
             * status of the job
             */
            status: {
                check: "String",
                apply: "_applyStatus",
                nullable: true
            },
            
            /**
             * Visibility of the layer
             */
            active: {
                check: "Boolean",
                apply: "_applyActive",
                event : "changeActive",
                nullable: true
            },

            /**
             * Last execution date
             */
            lastexecution: {
                check: "Number",
                apply: "_applyLastexecution",
                event : "changeLastexecution",
                nullable: true
            },
            
            /**
             * Next execution date
             */
            nextexecution: {
                check: "Number",
                apply: "_applyNextexecution",
                event : "changeNextexecution",
                nullable: true
            }
        },

        members: {
            /**
             * Internal method to create child controls. This method is overwritten support new child control types.
             * @param id {String} ID of the child control. If a # is used, the id is the part infront of the #.
             * @return {qx.ui.core.Widget} The created control or null
             */
            _createChildControlImpl: function (id) {
                var control;

                switch (id) {
                    case "icon":
                        control = new qx.ui.basic.Image(this.getIcon());
                        control.set({
                            marginLeft:5
                        });
                        control.setAnonymous(true);
                        this._add(control, {row: 0, column: 0});
                        break;

                    case "name":
                        control = new qx.ui.basic.Label(this.getName());
                        control.set({
                            marginLeft:5
                        });
                        control.setAnonymous(true);
                        //control.setRich(true);
                        this._add(control, {row: 0, column: 1});
                        break;
                    case "status":
                        control = new qx.ui.basic.Label(this.getStatus());
                        control.set({
                            marginLeft:5
                        });
                        control.setAnonymous(true);
                        control.setRich(true);
                        this._add(control, {row: 0, column: 2});
                        break;
                    case "active":
                        //control = new qx.ui.form.CheckBox(this.getVisible2());
                        control = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                            marginRight:10,
                            marginLeft:10
                        });
                        control.setAnonymous(true);
                        var cbox = new qx.ui.form.CheckBox();

                        cbox.addListener("changeValue",function(e){
                            this.setActive(e.getData());
                        },this);
                        control.add(cbox);

                        this._add(control, {row: 0, column: 5});

                        break;

                    case "nextexecution":
                    	control = new qx.ui.basic.Label(this.getNextexecution());
                        control.set({
                            marginLeft:5
                        });
                        control.setAnonymous(true);

                        this._add(control, {row: 0, column: 4});
                        break;
                        
                    case "lastexecution":
                    	control = new qx.ui.basic.Label(this.getLastexecution());
                        control.set({
                            marginLeft:5
                        });
                        control.setAnonymous(true);

                        this._add(control, {row: 0, column: 3});
                        break;
                }

                return control || this.base(arguments, id);
            },

            /**
             * Applies changes of the property value of the property icon.
             * @param value {String} new value of the property
             * @param old {String} previous value of the property (null if it was not yet set).
             */
            _applyIcon: function (value, old) {
                var icon = this.getChildControl("icon");
                icon.setSource(value);
            },

            /**
             * Applies changes of the property value of the property name.
             * @param value {String} new value of the property
             * @param old {String} previous value of the property (null if it was not yet set).
             */
            _applyName : function(value, old)
            {
                var name = this.getChildControl("name");
                //name.setValue("<b>"+value+"</b>");
                name.setValue(value);
            },
            
            /**
             * Applies changes of the property value of the property name.
             * @param value {String} new value of the property
             * @param old {String} previous value of the property (null if it was not yet set).
             */
            _applyStatus : function(value, old)
            {
            	var status = this.getChildControl("status");
                //name.setValue("<b>"+value+"</b>");
            	switch(value){
            		case "Inactive":
            			status.setValue("<font color='#cccccc'>"+value+"</font");
            			break;
            		case "Script success":
            		case "OK":
            			status.setValue("<font color='#0066cc'>"+value+"</font");
            			break;
            		default:
            			status.setValue("<font color='#FF0000'>"+value+"</font");
            			break;
            	}
                
            },

            /**
             * Applies changes of the property value of the property visible.
             * @param value {String} new value of the property
             * @param old {String} previous value of the property (null if it was not yet set).
             */
            _applyActive: function (value, old) {
                var active = this.getChildControl("active");
                active.getChildren()[0].setValue(value);

                //var visible2 = this.getChildControl("visible2");
                //visible2.setValue(value);
            },

            /**
             * Applies changes of the property value of the property nextexecution.
             * @param value {String} new value of the property
             * @param old {String} previous value of the property (null if it was not yet set).
             */
            _applyNextexecution: function (value, old) {
                var nextexecution = this.getChildControl("nextexecution");
                if(value!=null){
                	nextexecution.setValue(this.tr("Next execution")+" : "+moment(value).format("YYYY-MM-DD HH:mm:ss"));
                }
                
            },
            
            /**
             * Applies changes of the property value of the property lastexecution.
             * @param value {String} new value of the property
             * @param old {String} previous value of the property (null if it was not yet set).
             */
            _applyLastexecution: function (value, old) {
                var lastexecution = this.getChildControl("lastexecution");
                if(value!=null){
                	lastexecution.setValue(this.tr("Last execution")+" : "+moment(value).format("YYYY-MM-DD HH:mm:ss"));
                }
                
            }
        }
    });