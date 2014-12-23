"use strict";

var express = require('express');
var router  = express.Router();
var pg      = require('pg');
var YouTube = require('youtube-node');


router.get('/youtube', function(req, res) {
    var q = req.param('q') || '';
    var count = Number(req.param('count'));
    var youTube = new YouTube();
    count = !isNaN(count) && (count > 0) ? count : 5;
    youTube.setKey(process.env.YOUTUBE_KEY || req.param('youtube_key') || '');
    youTube.search(q, count, function(resultData) {
        res.send(resultData);
    });
});

router.get('/db', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM test_table', function (err, result) {
            done();
            if (err) {
                res.render('error', {
                    message: err.message || 'Database Error',
                    error: err
                });
            } else {
                res.render('index', {
                    title: 'Data!',
                    data: JSON.stringify(result.rows)
                })
            }
        });
    });
});

module.exports = router;
