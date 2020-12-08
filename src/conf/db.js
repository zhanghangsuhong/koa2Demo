/**
 * @description 存储配置
 * @author zhang
 */

const { isProd } = require('../utils/env')

let REDIS_CONF = {
	 port:6379,
	 host:'127.0.0.1'
}

let MYSQL_CONF = {
  host: '127.0.0.1',
  user: 'root',
  password: 'zhanghang',
  database: 'koa2'
}

if(isProd){
  REDIS_CONF = {
    port:6379,
    host:'127.0.0.1'
  }
    
  MYSQL_CONF = {
    host: '127.0.0.1',
    user: 'root',
    password: 'zhanghang',
    database: 'test'
  }
}

module.exports = {
  REDIS_CONF,
  MYSQL_CONF
}