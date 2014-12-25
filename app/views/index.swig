<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Clipr!</title>
        <meta name="description" content="Proof of concept for saving clips of youtube videos. Powered by nodejs, express and heroku.">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="/public/styles/vendor/bootstrap.min.css">
        <link rel="stylesheet" href="/public/styles/dist/main.css">
        <script src="/public/scripts/vendor/modernizr-latest.js"></script>

    </head>
    <body>

        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
       
        {% block content %}
        <div id="main" role="main" class="container align-center">
            <h1>{{title}}</h1>
        </div>
        {% endblock %}
        
        {% if serverVars %}
        <script>
            window.__SERVER_VARS__ = {%autoescape false%}'{{serverVars|json_encode}}'{%endautoescape%};
        </script>
        {% endif %}

        <script type="text/template" class="template" id="trimmer_template">
            <p>Click an endpoint to select it. Click the track to adjust the position of the selected endpoint.</p>
            <div class="progress" id="trimmer">
                <div class="progress-bar progress-bar-danger track" id="trim_start"><span class="sr-only"></span></div>
                <div class="progress-bar" id="start_handle"><span class="sr-only"></span></div>
                <div class="progress-bar progress-bar-striped track" id="clip_region"><span class="sr-only"></span></div>
                <div class="progress-bar" id="end_handle"><span class="sr-only"></span></div>
                <div class="progress-bar progress-bar-danger track" id="trim_end"><span class="sr-only"></span></div>
            </div>
        </script>

        <script type="text/template" class="template" id="clip_template">
            <div class="jumbotron">
                <div id="youtube"></div>
                <div class="playback-controls row" id="playback_controls">
                    <div class="progress" id="scrubber">
                        <div class="progress-bar progress-bar-danger track" style="width: 0%"><span class="sr-only"></span></div>
                    </div>
                    <button type="button" id="play" class="btn btn-md btn-success">Play</button>
                    <button type="button" id="pause" class="btn btn-md btn-danger">Pause</button>
                </div>
                
            </div>
            <% if (allowSave) { %>
            <div class="form-group">
                <button type="button" id="save" class="btn btn-md btn-primary">Save</button>
            </div>
            <% } else { %>
            <p><a href="<%= createLink %>">Create your own Clipr!</a></p>
            <% } %>

        </script>
        <script type="text/template" class="template" id="search_template">    
            <p>Paste the url of the youtube video you would like to edit</p>
            <div class="form-group">
                <label for="yt_link">Youtube Link:</label>
                <input type="text" class="form-control" id="yt_link">
                <button type="button" class="btn btn-md btn-primary">Go!</button>
            </div>
        </script>

        <script type="text/javascript" src="/public/scripts/vendor/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="/public/scripts/vendor/popcorn-custom.min.js"></script>
        <script type="text/javascript" src="/public/scripts/vendor/underscore-min.js"></script>
        <script type="text/javascript" src="/public/scripts/vendor/backbone-min.js"></script>
        <script src="/public/scripts/vendor/bootstrap.min.js"></script>
        <script src="/public/scripts/dist/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>
    </body>
</html>