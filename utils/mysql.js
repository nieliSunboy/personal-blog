var mysql = require('mysql2');
var { mysqlConfig } = require('../node_config');

var clientDB = mysql.createPool(mysqlConfig);

const query = (sql, callback) => {
    clientDB.query(sql, (error, result) => {
        if(error) {
            throw error
        } else {
            callback && callback(result);
        }
    })
}

//使用promise封装sql查询
const queryPromise = (sql) => {
    return new Promise((resolve, reject) => {
        clientDB.query(sql, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

  module.exports = {
    query,
    queryPromise
  }