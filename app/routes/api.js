"use strict";

var express = require('express');
var router  = express.Router();
var clipr   = require('../lib/clipr');
var YouTube = require('youtube-node');

router.get('/clip', function (req, res) { 
   clipr.get(null, function (err, resultData) {
        if (err) {
            res.send({
                error: {
                    message: err.message || 'Database Error',
                    error: err
                }
            });
        } else {
            res.send(resultData);
        }
    });

});

router.get('/clip/:id', function(req, res){
    var id = req.params.id; 
    clipr.get(id, function (err, resultData) {
        if (err) {
            res.send({
                error: {
                    message: err.message || 'Database Error',
                    error: err
                }
            });
        } else {
            res.send(resultData);
        }
    });
});

router.post('/clip', function (req, res){
        
    var ytid = req.body.ytid;
    var int_start = Math.floor(req.body.int_start);
    var int_end = Math.floor(req.body.int_end);
    var errorMsg;
    
    if (!ytid || !ytid.length) {
        errorMsg = 'Malformed or missing ytid';
    }
    if (isNaN(int_start) || isNaN(int_start)) {
        errorMsg = 'Malformed or missing start and endpoints.';
    }
    if (errorMsg) {
        res.send({
            error : {message : errorMsg}
        });
        return;
    }

    clipr.create(req.body, function (err, resultData) {
        if (err) {
            res.send({
                error: {
                    message: err.message || 'Database Error',
                    error: err,
                    sql: sql
                }
            });
        } else {
            res.send(resultData);
        }
    });

});


router.get('/youtube/search', function(req, res) {
    var q = req.param('q') || '';
    var count = Number(req.param('count'));
    var youTube = new YouTube();
    count = !isNaN(count) && (count > 0) ? count : 5;
    youTube.setKey(process.env.YOUTUBE_KEY || req.param('youtube_key') || '');
    youTube.search(q, count, function(resultData) {
        res.send(resultData);
    });
});

router.get('/youtube/:id', function(req, res) {
    var id = req.param('id') || '';
    var youTube = new YouTube();
    youTube.setKey(process.env.YOUTUBE_KEY || req.param('youtube_key') || '');
    youTube.getById(id, function(resultData) {
        res.send(resultData);
    });
});

module.exports = router;
