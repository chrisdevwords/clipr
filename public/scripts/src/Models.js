"use strict";

var Models = module.exports = {};

(function () {


    var root     = window || root;
    var $        = root.$;
    var _        = root._;
    var Backbone = root.Backbone;

    $(function () {
        
        _.extend(Models,{

       
            ClipModel : Backbone.Model.extend({
                idAttribute : 'uid',
                urlRoute : '/api/clip',
                url : function () {
                    if (this.get('uid')) {
                        return this.urlRoute + '/' + this.get('uid');
                    }
                    return this.urlRoute;
                },
                parse : function (data) {
                    if(_.isArray(data) && !_.isEmpty(data)) {
                        data = data[0];
                    }
                    return data;
                },
                defaults : {
                    int_start : 0,
                    int_end   : 0
                },
                updatePoints : function (startPercent, endPercent, totalDuration) {
                    startPercent /= 100;
                    endPercent /= 100;
                    this.set({
                        int_start : Math.round(startPercent * totalDuration),
                        int_end   : Math.round(endPercent * totalDuration)
                    })
                },
                getCreateLink : function () {
                    return '/create/' + this.get('ytid');
                }
            }),
            
            YouTubeModel : Backbone.Model.extend({
                
                url : function (){
                    return "/api/youtube/" + this.get('id')
                },
            
                parse : function (data) {
                    if (_.isArray(data.items) && !_.isEmpty(data.items[0])) {
                        data = data.items[0];
                    }
                    return data;
                },

                initialize : function(attrs, options) {
                    this.on('change:contentDetails', function(){
                        this.set('duration', this.parseDuration(this.get('contentDetails').duration));
                    });
                },

                /**
                 * converts ISOString to seconds
                 * @param  {string} str duration string from youtube
                 * @return {number} seconds of duration for YouTube video
                 */
                parseDuration : function (str) {
                    var minutes;
                    var seconds;
                    str = str.split('T').pop();
                    seconds = Number(str.split('M').pop().split('S').shift());
                    minutes = Number(str.split('M').shift());
                    return minutes * 60 + seconds;
                }
            }),

            TrimModel : Backbone.Model.extend({
                defaults : {
                    start : 0,
                    end : 100
                }
            })

        });
            
    });
})()
