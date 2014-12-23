
var express = require('express');
var router  = express.Router();
var clipr   = require('../lib/clipr');

router.get('/create/:ytid', function(req, res) {
    
    var ytid = req.params.ytid || '';

    res.render('index', {
        title : 'Edit Your Clipr!',
        serverVars  : {
            clip: {
                ytid : ytid
            }
        }
    }); 

});

router.get('/clip/:id', function(req, res, next) {
    
    var id = req.params.id; 

    clipr.get(id, function (err, clipData) {
        if (err) {
            next(err);
            return;
        }
        res.render('index', {
            title : 'Clipr!',
            serverVars  : {
                clip : clipData
            }
        });             
    });
});

/* GET home page */
router.get('/', function (req, res){

    res.render('index', {
        title : 'Clipr!'
    }); 

});

module.exports = router;