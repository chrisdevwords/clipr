"use strict";

var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');

$(function() {
    var AppView = Backbone.View.extend({
        el: 'body',
        initialize: function() {
            console.log('this is working');
        }
    });
    var a = new AppView();
    a.render();
});