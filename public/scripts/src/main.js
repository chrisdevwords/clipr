"use strict";

(function () {

    var root     = window || root;
    var $        = root.$;
    var _        = root._;
    var Backbone = root.Backbone;
    var Popcorn  = root.Popcorn;
    var Models   = require('./Models');
    var Views    = require('./Views');

    var serverVars = root.__SERVER_VARS__ ? JSON.parse(root.__SERVER_VARS__) : {};

    $(function () {
        
        var main = new Views.MainView();

        if (serverVars.clip) {
            main.subView = new Views.ClipView({
                model : serverVars.clip, 
                autoPlay : true
            });
        } else {
            main.subView = new Views.SearchView();
        }

        main.render();
        main.load();

        window.main = main;
     
    });
})()
