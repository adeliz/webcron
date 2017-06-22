/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
qx.Class.define("webcron.view.SearchAsYouTypeFilter",
{
  extend : qx.core.Object,


  construct : function(controller)
  {
    this.base(arguments);
    // store the controller
    this.__controller = controller;

    // apply the filter funtion on creation time because the 'this' context
    // needs to be bound to the function
    this.filter = qx.lang.Function.bind(function(data) {
      return data.getName().toUpperCase().search(this.getSearchString().toUpperCase()) != -1;
    }, this);

    // storage for the timer id
    this.__timerId = null;
  },


  properties : {

    searchString : {
      check : "String",
      apply: "_applySearchString",
      init: ""
    }
  },


  members :
  {
    __timerId: null,
    __controller: null,

    _applySearchString : function(value, old) {
      // get the timer instance
      var timer = qx.util.TimerManager.getInstance();
      // check for the old listener
      if (this.__timerId != null) {
        // stop the old one
        timer.stop(this.__timerId);
        this.__timerId = null;
      }
      // start a new listener to update the controller
      this.__timerId = timer.start(function() {
        this.__controller.update();
        this.__timerId = null;
      }, 0, this, null, 200);
    },

    filter: null,
    
    createItem : function() {
        return new webcron.view.JobWidget();
    },

    bindItem : function(controller, item, id) {
        controller.bindProperty("", "model", null, item, id);
        //controller.bindPropertyReverse("", "model", null, item, id);
        controller.bindProperty("name", "name", null, item, id);
        //controller.bindPropertyReverse("name", "name", null, item, id);
        controller.bindProperty("status", "status", null, item, id);
        controller.bindProperty("nextexecution", "nextexecution", null, item, id);
        controller.bindProperty("lastexecution", "lastexecution", null, item, id);
        
        controller.bindProperty("active", "active", null, item, id);
        controller.bindPropertyReverse("active", "active", null, item, id);
        //controller.bindPropertyReverse("visibility", "visible", null, item, id);
        /*controller.bindProperty("opacity", "opacity2", {converter: function(value) {
            if(typeof value == 'undefined'){
                value=1;
            }
            return value*100;
        }}, item, id);*/
        /*controller.bindProperty("geometryType", "icon", {
            converter: function(data) {
                switch (data) {
                    case "Point":
                        return "map/icons/points.png";

                    case "Path":
                        return "map/icons/line.png";

                    case "Polygon":
                        return "map/icons/polygon.png";

                    case "Geometry":
                        return "map/icons/mix.png";
                        
                    case "Mix":
                        return "map/icons/mix.png";

                    default:
                        return "map/icons/raster.png";;
                }
            }
        }, item, id);*/
    },

    configureItem : function(item) {
        //item.getChildControl("icon").setWidth(48);
        //item.getChildControl("icon").setHeight(48);
        //item.getChildControl("icon").setScale(true);
        //item.setMinHeight(52);
        //item.setAppearance("my.Appearance");
    }
  },

  /*
   *****************************************************************************
      DESTRUCT
   *****************************************************************************
   */

  destruct : function() {
    this.__controller = null;
  }
});