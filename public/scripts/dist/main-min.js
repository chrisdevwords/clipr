!function t(e,i,n){function s(a,o){if(!i[a]){if(!e[a]){var d="function"==typeof require&&require;if(!o&&d)return d(a,!0);if(r)return r(a,!0);throw new Error("Cannot find module '"+a+"'")}var l=i[a]={exports:{}};e[a][0].call(l.exports,function(t){var i=e[a][1][t];return s(i?i:t)},l,l.exports,t,e,i,n)}return i[a].exports}for(var r="function"==typeof require&&require,a=0;a<n.length;a++)s(n[a]);return s}({1:[function(t,e){"use strict";var i=e.exports={};!function(){var t=window||t,e=t.$,n=t._,s=t.Backbone;e(function(){n.extend(i,{ClipModel:s.Model.extend({idAttribute:"uid",urlRoute:"/api/clip",url:function(){return this.get("uid")?this.urlRoute+"/"+this.get("uid"):this.urlRoute},parse:function(t){return n.isArray(t)&&!n.isEmpty(t)&&(t=t[0]),t},defaults:{int_start:0,int_end:0},updatePoints:function(t,e,i){t/=100,e/=100,this.set({int_start:Math.round(t*i),int_end:Math.round(e*i)})},getCreateLink:function(){return"/create/"+this.get("ytid")}}),YouTubeModel:s.Model.extend({url:function(){return"/api/youtube/"+this.get("id")},parse:function(t){return n.isArray(t.items)&&!n.isEmpty(t.items[0])&&(t=t.items[0]),t},initialize:function(){this.on("change:contentDetails",function(){this.set("duration",this.parseDuration(this.get("contentDetails").duration))})},parseDuration:function(t){var e,i;return t=t.split("T").pop(),i=Number(t.split("M").pop().split("S").shift()),e=Number(t.split("M").shift()),60*e+i}}),TrimModel:s.Model.extend({defaults:{start:0,end:100}})})})}()},{}],2:[function(t,e){"use strict";var i=e.exports={};!function(){var e=window||e,n=e.$,s=e._,r=e.Backbone,a=e.Popcorn,o=t("./Models");n(function(){s.extend(i,{TrimmerView:r.View.extend({selectedClass:"progress-bar-success",handleWidth:2,events:{"click #end_handle":"endClicked","click #start_handle":"startClicked","click .track":"trackClicked"},initialize:function(t){var e=this;this.model=new o.TrimModel(t.model),this.model.on("change",function(){e.update()})},endClicked:function(){this.$endHandle.addClass(this.selectedClass),this.$startHandle.removeClass(this.selectedClass)},startClicked:function(){this.$startHandle.addClass(this.selectedClass),this.$endHandle.removeClass(this.selectedClass)},trackClicked:function(t){var e=this.$el.offset().left,i=t.clientX,n=this.$el.width(),s=Math.round(100*(i-e)/n),r=this.model.get("start"),a=this.model.get("end");this.$startHandle.hasClass(this.selectedClass)?(r=s,r>a&&(a=r,r=a-this.handleWidth),this.model.set("start",s)):(a=s,r>a&&(r=a,a+=this.handleWidth),this.model.set("end",s)),this.model.set({start:r,end:a})},render:function(){var t=s.template(n("#trimmer_template").html(),{});return this.$el,this.$el.html(t),this.mapParts(),this.update(),this.$endHandle.width(this.handleWidth+"%"),this.$startHandle.width(this.handleWidth+"%"),this.$startHandle.addClass(this.selectedClass),this},update:function(){var t=this.model.get("start"),e=100-this.model.get("end"),i=this.model.get("end")-this.model.get("start");i>2*this.handleWidth?i-=2*this.handleWidth:e>t?e-=2*this.handleWidth:t-=2*this.handleWidth,this.$startTrimmed.width(t+"%"),this.$clipRegion.width(i+"%"),this.$endTrimmed.width(e+"%")},mapParts:function(){this.$startTrimmed=this.$("#trim_start"),this.$startHandle=this.$("#start_handle"),this.$clipRegion=this.$("#clip_region"),this.$endHandle=this.$("#end_handle"),this.$endTrimmed=this.$("#trim_end")}}),ClipView:r.View.extend({events:{"click #play":function(){this.popCorn.play()},"click #pause":function(){this.popCorn.pause()},"click #save":"saveClip","click #scrubber ":"scrubClip"},initialize:function(t){var e=this,n=t.model;if(s.isArray(n)&&n.length)n=n[0];else if(s.isEmpty(n))return;this.model=new o.ClipModel(n),this.tubeData=new o.YouTubeModel({id:this.model.get("ytid")}),this.tubeData.on("change:duration",function(){e.model.get("int_end")||e.model.set("int_end",e.tubeData.get("duration"))}),this.model.get("uid")||(this.trimmer=new i.TrimmerView({model:{}}),this.trimmer.model.on("change",function(){e.model.updatePoints(this.get("start"),this.get("end"),e.tubeData.get("duration"))})),this.on("ready",function(){t.autoPlay&&e.popCorn.play(this.model.get("int_start"))})},render:function(){var t=s.template(n("#clip_template").html(),s.extend({allowSave:s.isEmpty(this.model.get("uid")),createLink:this.model.getCreateLink()},this.model.toJSON()));return this.$el.html(t),this.trimmer&&this.$el.append(this.trimmer.render().$el),this.$progressBar=this.$("#scrubber").find(".progress-bar"),this},saveClip:function(){var t=this;this.model.save().success(function(){window.location="/clip/"+t.model.get("uid")}).fail(function(){alert("there was an error saving your clip")})},loadPlayer:function(){var t=this;return this.videoWrapper=a.HTMLYouTubeVideoElement("#youtube"),this.popCorn=a(this.videoWrapper),this.popCorn.on("canplay",function(){t.trigger("ready")}),this.popCorn.on("timeupdate",function(e){t.onProgress(e)}),this.videoWrapper.src="https://www.youtube.com/watch?v="+this.model.get("ytid"),this},scrubClip:function(t){return},onProgress:function(){var t=this.popCorn.currentTime();t<this.model.get("int_start")?this.popCorn.currentTime(this.model.get("int_start")):t>this.model.get("int_end")&&this.popCorn.currentTime(this.model.get("int_start")),this.updateProgressBar()},updateProgressBar:function(){var t=this.popCorn.currentTime(),e=this.model.get("int_start"),i=this.model.get("int_end")-e,n=Math.round(100*(t-e)/i);this.$progressBar.width(n+"%")}}),SearchView:r.View.extend({events:{"click button":"getTube"},getTube:function(){console.log("get tube");var t=this.parseYtId(n("#yt_link").val().trim());return t?void(e.location="/create/"+t):void e.alert("please enter a valid youtube link")},parseYtId:function(t){var e,i,n=t.split("v=");return n.length<=1?null:(e=n[1],i=e.indexOf("&"),-1!=i?e.substring(0,i):e)},render:function(){var t=s.template(n("#search_template").html(),{});return this.$el.html(t),this}}),MainView:r.View.extend({el:n("#main"),render:function(){return this.$el.append(this.subView.render().$el),this},load:function(){var t=this;this.subView.tubeData&&this.subView.tubeData.fetch().done(function(){t.subView.loadPlayer()}).fail(function(){alert("youtube clip is invalid")})}})})})}()},{"./Models":1}],3:[function(t){"use strict";!function(){var e=window||e,i=e.$,n=(e._,e.Backbone,e.Popcorn,t("./Models"),t("./Views")),s=e.__SERVER_VARS__?JSON.parse(e.__SERVER_VARS__):{};i(function(){var t=new n.MainView;t.subView=s.clip?new n.ClipView({model:s.clip,autoPlay:!0}):new n.SearchView,t.render(),t.load(),window.main=t})}()},{"./Models":1,"./Views":2}]},{},[3]);