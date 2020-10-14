var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');

// Connect Database
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: 'Fail'
        });
    } else {
        res.json(ret);
    }
};

// add location
router.post('/add_location', (req, res) => {
    var sql = $sql.user.add_location;
    var params = req.body;
    conn.query(sql, [params.id, params.lat, params.lng], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

// select location
router.post('/select_location', (req, res) => {
    const simpleUserInfor = $sql.user.select_location;
    conn.query(simpleUserInfor, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

// delete location
router.post('/delete_location', (req, res) => {
    const deleteDeviceData = $sql.user.delete_location;
    const params = req.body;
    conn.query(deleteDeviceData, [params.id], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})

module.exports = router;