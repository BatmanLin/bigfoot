var sqlMap = {
  // 用户
  user: {
      add: 'insert into devinfor(devID, displayType, devName, devAdmin, devPassword, devIP, devPort, devSerial, validateCode, cameraNum) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      select_devinfor: 'select * from devinfor',
      select_devID: 'select devID from devinfor',
      update: 'update devinfor set devName=?, displayType=?, devAdmin=?, devPassword=?, devIP=?, devPort=?, devSerial=?, validateCode=? where devID=?',
      update_camera_num: 'update devinfor set cameraNum=? where devID=?',
      delete: 'delete from devinfor where devName=?',
      select_target_devinfor: 'select * from devinfor where devName=?',
      addChannel: 'insert into channels(devID, displayType, devName, channelName, ysRealplayChannel, devSerial) value (?,?,?,?,?,?)',
      select_channel: 'select * from channels where devName=?',
      select_target_channel: 'select * from channels where devID=?',
      select_all_channels: 'select * from channels',
      select_all_channelsID: 'select devID, channelName from channels',
      update_channel: 'update channels set channelName=?, areas=? where devID=?',
      update_channel_camera: 'update channels set cameraExist=? where devID=?',
      update_channelname: 'update channels set devName=? where devID=?',
      delete_channel: 'delete from channels where devName=?',
      delete_all_channel: 'delete from channels',
      select_devname: 'select devName from devinfor'
  }
}

module.exports = sqlMap;