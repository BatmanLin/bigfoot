var sqlMap = {
  // user
  user: {
 
      add_location: 'insert into location(id, lat, lng) value (?, ?, ?)',
      select_location: 'select * from location',
      delete_location: 'delete from location where id=?',
  }
}

module.exports = sqlMap;