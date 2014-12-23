"use strict";

var express = require('express');
var router  = express.Router();
var pg      = require('pg');
var YouTube = require('youtube-node');

var TABLE = 'test_table';

var getClips = function (req, res) {
    
    var sql = "SELECT * FROM " + TABLE;
    var id = req.params.id;
    var resultData;
    if (id && id.length) {
        sql += ' WHERE uid = ' + id;
    }
    
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(sql, function (err, result) {
            done();
            if (err) {
                res.render('error', {
                    message: err.message || 'Database Error',
                    error: err
                });
            } else {
                resultData = result.rows.length > 1 ? result.rows : result.rows[0];
                res.send(resultData);
            }
        });
    });
};

var saveClip = function (req, res) {
    
    var ytid = req.body.ytid;
    var int_start = Math.floor(req.body.int_start);
    var int_end = Math.floor(req.body.int_end);
    var errorMsg;
    var sql;
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
    sql = "INSERT INTO " + TABLE + " values('" +
        ytid + "', " + 
        int_start + ", " +
        int_end +
    ") RETURNING *;";
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(sql, function (err, result) {
            done();
            if (err) {
                res.send({
                    error:{
                        message: err.message || 'Database Error',
                        error: err,
                        sql: sql
                    }
                });
            } else {
                res.send(result.rows);
            }
        });
    });
};

router.get('/clip', getClips);
router.get('/clip/:id', getClips);

router.post('/clip', saveClip);

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

module.exports = router;
