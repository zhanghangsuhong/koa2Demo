
/**
 * @description sequelize实例
 * @author zhang
 */
const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { isProd } = require('../utils/env')

const { host, database, user, password } = MYSQL_CONF

const conf = {
  host,
  dialect: 'mysql',
  //解决中文输入问题
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    }
  }
}

if (isProd) {
  conf.pool = {
    max: 5,
    min: 0,
    idle: 10000
  }
}


const seq = new Sequelize(database, user, password, conf)

module.exports = seq


