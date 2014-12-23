(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}]},{},[1])