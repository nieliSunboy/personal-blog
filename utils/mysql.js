var mysql = require('mysql2');
var { mysqlConfig } = require('../node_config');
var pageKeys = ['pageSize', 'current', 'offSet', 'order', 'sort'];

var clientDB = mysql.createPool(mysqlConfig);

const paging = (sql, params) => {

  if (params.hasOwnProperty('pageSize')) {
    params.pageSize = parseInt(params.pageSize);
    params.offSet = (parseInt(params.current) - 1) * params.pageSize;
  }
  let sqlString = 'WHERE 1=1';
  for(let key in params) {
    if (pageKeys.includes(key)) continue;
    sqlString += ` AND ${key} like '%${params[key]}%'`;
  }

  sql[0] = sqlString + ` ORDER BY ${params?.order || 'updateTime'} ${params?.sort || 'DESC'} LIMIT ${params.offSet},${params.pageSize};`
  sql[1] = sqlString +  ` ORDER BY ${params?.order || 'updateTime'} ${params?.sort || 'DESC'};`

  return { sql: sql.join(''), params: params }
}

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
    paging,
    queryPromise
  }