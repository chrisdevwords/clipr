"use strict";
var root     = window || root;
var $        = root.$;
var _        = root._;
var Backbone = root.Backbone;

 $(function () {
    

    var ClipModel = Backbone.Model.extend({
        urlRoute : '/api/clip' 
    });

    var BodyView = Backbone.View.extend({
        el:$('body'),
        initialize : function() {
            console.log("view init");
        }
    });

    var body = new BodyView();

 });

