var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

// 增加用户接口
router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.devID, params.displayType, params.devName, params.devAdmin, params.devPassword, params.devIP, params.devPort, params.devSerial, params.validateCode, params.cameraNum], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

// 查询简要的用户信息
router.post('/selectDevInfor', (req, res) => {
    const simpleUserInfor = $sql.user.select_devinfor;
    conn.query(simpleUserInfor, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/select_devID', (req, res) => {
    const simpleUserInfor = $sql.user.select_devID;
    conn.query(simpleUserInfor, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/select_devname', (req, res) => {
    const simpleUserInfor = $sql.user.select_devname;
    conn.query(simpleUserInfor, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

// 查询用户的信息
router.post('/selectTargetDev',(req, res) => {
    const targetDevInfor = $sql.user.select_target_devinfor;
    const params = req.body;
    conn.query(targetDevInfor, [params.devName], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})

// 修改用户信息
router.post('/update', (req, res) => {
    const updateDeviceData = $sql.user.update;
    const params = req.body;
    conn.query(updateDeviceData, [params.devName, params.displayType, params.devAdmin, params.devPassword, params.devIP, params.devPort, params.devSerial, params.validateCode, params.devID], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

// 更新某个通道的位置信息
router.post('/update_camera_num', (req, res) => {
    const updateChannelData = $sql.user.update_camera_num;
    const params = req.body;
    conn.query(updateChannelData, [params.cameraNum, params.devID], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

// 删除用户信息
router.post('/delete', (req, res) => {
    const deleteDeviceData = $sql.user.delete;
    const params = req.body;
    conn.query(deleteDeviceData, [params.devName], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})

// 增加通道信息
router.post('/addChannel', (req, res)=> {
    const addChannelsData = $sql.user.addChannel;
    const params = req.body;
    conn.query(addChannelsData, [params.devID, params.displayType, params.devName, params.channelName, params.ysRealplayChannel, params.devSerial], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
})

// 查询某个特定通道的信息
router.post('/select_target_channel',(req, res) => {
    const targetDevInfor = $sql.user.select_target_channel;
    const params = req.body;
    conn.query(targetDevInfor, [params.devID], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})


// 查询某个设备所有通道的信息
router.post('/selectChannel',(req, res) => {
    const targetDevInfor = $sql.user.select_channel;
    const params = req.body;
    conn.query(targetDevInfor, [params.devName], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})

// 查询所有通道的id
router.post('/select_all_channelsID',(req, res) => {
    const targetDevInfor = $sql.user.select_all_channelsID;
    const params = req.body;
    conn.query(targetDevInfor, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})



// 查询所有通道的信息
router.post('/selectAllChannels',(req, res) => {
    const targetDevInfor = $sql.user.select_all_channels;
    conn.query(targetDevInfor, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
})

// 更新某个通道的位置信息
router.post('/update_channel', (req, res) => {
    const updateChannelData = $sql.user.update_channel;
    const params = req.body;
    conn.query(updateChannelData, [params.channelName, params.areas, params.devID], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

// 更新某个通道的ID信息
router.post('/update_channelname', (req, res) => {
    const updateChannelData = $sql.user.update_channelname;
    const params = req.body;
    conn.query(updateChannelData, [params.devName, params.devID], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});
// 更新某个通道的ID信息
router.post('/update_channel_camera', (req, res) => {
    const updateChannelData = $sql.user.update_channel_camera;
    const params = req.body;
    conn.query(updateChannelData, [params.cameraExist, params.devID], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

// 删除设备的所有通道
router.post('/delete_channel', (req, res) => {
    const deleteChannelData = $sql.user.delete_channel;
    const params = req.body;
    conn.query(deleteChannelData, [params.devName], function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/delete_all_channel', (req, res) => {
    const deleteChannelData = $sql.user.delete_all_channel;
    const params = req.body;
    conn.query(deleteChannelData, function(err, result) {
        if (err) {
            console.log(err)
        }
        if(result) {
            jsonWrite(res, result);
        }
    })
});

module.exports = router;