(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

var Views = module.exports = {};

(function () {


    var root     = window || root;
    var $        = root.$;
    var _        = root._;
    var Backbone = root.Backbone;
    var Popcorn  = root.Popcorn;
    var Models   = require('./Models');

    $(function () { 
        
        _.extend(Views, {
            
            TrimmerView : Backbone.View.extend({
            
                selectedClass: 'progress-bar-success',
                handleWidth: 2, //percentage

                events : {
                    'click #end_handle'    : 'endClicked',
                    'click #start_handle'  : 'startClicked',
                    'click .track'         : 'trackClicked'
                },

                initialize : function (options) {
                
                    var self = this;
                    this.model = new Models.TrimModel(options.model);
                    this.model.on('change', function(){
                        self.update();
                    });
                
                },
                endClicked : function (event) {
                
                    this.$endHandle.addClass(this.selectedClass);
                    this.$startHandle.removeClass(this.selectedClass);
                
                },
                
                startClicked : function (event) {
                
                    this.$startHandle.addClass(this.selectedClass);
                    this.$endHandle.removeClass(this.selectedClass);
                
                },
                trackClicked : function (event) {
                    
                    var left = this.$el.offset().left;
                    var clientX = event.clientX;
                    var trackWidth = this.$el.width();
                    var percentage = Math.round(100*(clientX - left)/trackWidth);
                    var start = this.model.get('start');
                    var end = this.model.get('end');
                    
                    if (this.$startHandle.hasClass(this.selectedClass)) {
                        start = percentage;
                        if (start > end) {
                            end = start;
                            start = end - this.handleWidth;
                        }
                        this.model.set('start', percentage);
                    } else {
                        end = percentage;
                        if(end < start) {
                            start = end;
                            end = end + this.handleWidth;
                        }
                        this.model.set('end', percentage);
                    }
                    this.model.set({start:start, end: end});

                },

                render : function () {
                    
                    var template = _.template( $("#trimmer_template").html(), {});
                    this.$el;
                    this.$el.html( template );
                    this.mapParts();
                    this.update();
                    this.$endHandle.width(this.handleWidth + '%');
                    this.$startHandle.width(this.handleWidth + '%');
                    this.$startHandle.addClass(this.selectedClass);
                    
                    return this;
                
                },

                update : function () {
                    
                    var startWidth = this.model.get('start');
                    var endWidth = 100 - this.model.get('end');
                    var clipWidth = this.model.get('end') - this.model.get('start');
                    
                    if (clipWidth > 2 * this.handleWidth) {
                        clipWidth -= 2 * this.handleWidth
                    } else if (endWidth > startWidth){
                        endWidth -= 2 * this.handleWidth;
                    } else {
                        startWidth -= 2 * this.handleWidth;
                    }
                    
                    this.$startTrimmed.width((startWidth) + '%');
                    this.$clipRegion.width((clipWidth) + '%');
                    this.$endTrimmed.width((endWidth) + '%');
                },

                mapParts : function () {
                
                    this.$startTrimmed = this.$('#trim_start');
                    this.$startHandle  = this.$('#start_handle');
                    this.$clipRegion   = this.$('#clip_region');
                    this.$endHandle    = this.$('#end_handle');
                    this.$endTrimmed   = this.$('#trim_end');
                
                },

            }),
            
            ClipView : Backbone.View.extend({

                events : {
                    'click #play' : function () {
                        this.popCorn.play();
                    },
                    'click #pause' : function () {
                        this.popCorn.pause();
                    },
                    'click #save' : 'saveClip',
                    'click #scrubber ' : 'scrubClip'
                },

                initialize : function (options) {            
                    
                    var self  = this;
                    var model = options.model;
                    
                    if (_.isArray(model) && model.length) {
                        model = model[0]
                    } else if (_.isEmpty(model)) {
                        return;
                    }

                    this.model = new Models.ClipModel(model);
                    this.tubeData = new Models.YouTubeModel({id:this.model.get('ytid')});
                    
                    this.tubeData.on('change:duration', function (){
                        if (!self.model.get('int_end')) {
                            self.model.set('int_end', self.tubeData.get('duration'));
                        }
                    });
                    
                    if (!this.model.get('uid')) {
                        //build a trimmer and save/preview view
                        this.trimmer = new Views.TrimmerView({model:{}});
                        this.trimmer.model.on('change', function() {
                            self.model.updatePoints(this.get('start'), this.get('end'), self.tubeData.get('duration'));                          
                        });
                    }
                    this.on('ready', function (){
                        if (options.autoPlay) {
                            self.popCorn.play(this.model.get('int_start'));
                        }
                    });

                },

                render : function () {
                    
                    var template = _.template( $("#clip_template").html(), _.extend({
                        allowSave : _.isEmpty(this.model.get('uid')),
                        createLink : this.model.getCreateLink()
                    }, this.model.toJSON()));
                    
                    this.$el.html( template );
                    if (this.trimmer) {
                        this.$el.append(this.trimmer.render().$el);   
                    }

                    this.$progressBar = this.$('#scrubber').find('.progress-bar');

                    return this;
                },

                saveClip : function () {
                    var self = this;
                    this.model.save().success(function(data){
                        window.location = '/clip/' + self.model.get('uid');
                    }).fail(function(){
                        alert('there was an error saving your clip');
                    });
                },

                loadPlayer : function () {
                    var self = this;
                    this.videoWrapper = Popcorn.HTMLYouTubeVideoElement( "#youtube" );
                    this.popCorn = Popcorn(this.videoWrapper);
                    this.popCorn.on('canplay', function (){
                        self.trigger('ready');
                    });
                    this.popCorn.on('timeupdate', function (event){
                        self.onProgress(event);
                    });
                    this.videoWrapper.src = 'https://www.youtube.com/watch?v=' + this.model.get('ytid');
                    return this;
                },

                scrubClip : function (event) {
                    return; /// close on this but it's not working :(
                    var left = this.$el.offset().left;
                    var clientX = event.clientX;
                    var trackWidth = this.$el.width();
                    var percentage = (clientX - left)/trackWidth;
                    var start = this.model.get('int_start');
                    var end = this.model.get('int_end');
                    var time = Math.round((start + percentage * (end - start)));
                    this.popCorn.currentTime(time);
                },

                onProgress : function (event) {
                    var time = this.popCorn.currentTime();  
                    if (time < this.model.get('int_start')) {
                        this.popCorn.currentTime(this.model.get('int_start'));
                    } else if (time > this.model.get('int_end')) {
                        this.popCorn.currentTime(this.model.get('int_start'));
                    }
                    this.updateProgressBar();
                },

                updateProgressBar : function () {
                    var time = this.popCorn.currentTime();
                    var start = this.model.get('int_start');
                    var length = this.model.get('int_end') - start;
                    var percentPlayed = Math.round(100*(time-start)/length);
                    this.$progressBar.width(percentPlayed + '%');
                }

            }),
            
            SearchView : Backbone.View.extend({

                events: {
                    "click button": "getTube"  
                },

                getTube : function () {
                    console.log('get tube');
                    var ytid = this.parseYtId($('#yt_link').val().trim());
                    if (!ytid) {
                        root.alert('please enter a valid youtube link')
                        return;
                    }
                    root.location = '/create/' + ytid;
                },

                parseYtId : function (link) {
                    var segs = link.split('v=');
                    var video_id;
                    var ampersandPosition;
                    if (segs.length <= 1) {
                        return null;
                    }
                    video_id = segs[1];
                    ampersandPosition = video_id.indexOf('&');
                    if(ampersandPosition != -1) {
                        return video_id.substring(0, ampersandPosition);
                    }
                    return video_id;
                },

                render : function () {
                    var template = _.template( $("#search_template").html(), {});
                    // Load the compiled HTML into the Backbone "el"
                    this.$el.html( template );
                    return this;
                }
            }),

            MainView : Backbone.View.extend({
            
                el: $('#main'),
                
                render : function () {
                    this.$el.append(this.subView.render().$el);
                    return this;
                }, 
                load : function () {
                    var self = this;
                    if(this.subView.tubeData) {
                        this.subView.tubeData.fetch().done(function(){
                            self.subView.loadPlayer();
                        }).fail(function () {
                            alert('youtube clip is invalid');
                        });
                    }
                }
            })
   
        });
    });

})();

},{"./Models":1}],3:[function(require,module,exports){
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

},{"./Models":1,"./Views":2}]},{},[3])