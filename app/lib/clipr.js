var _   = require('underscore');
var pg  = require('pg');

var TABLE = 'test_table';


module.exports = {

    get : function (id, callBack) {
    
        var sql = "SELECT * FROM " + TABLE;
        var resultData;
        
        if (id && id.length) {
            sql += ' WHERE uid = ' + id;
        }
        
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query(sql, function (err, result) {
                done();
                callBack(err, result ? result.rows : null);
            });
        });
    },

    create : function (data, callBack) {
    
        var sql = "INSERT INTO " + TABLE + " values('" +
            data.ytid + "', " + 
            data.int_start + ", " +
            data.int_end +
        ") RETURNING *;";
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(sql, function (err, result) {
                done();
                callBack(err, result ? result.rows : null);
            });
        });
    }
};