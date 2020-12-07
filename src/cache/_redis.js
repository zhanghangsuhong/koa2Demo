/**
 * @description 连接redis的get 和set方法
 * @author zhang
 */

 const redis = require('redis')
 const { REDIS_CONF } = require('../conf/db')


 const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host)
 redisClient.on('error',err=>{
	 console.log('redis error')
 })
	 
  /**
	 * 
	 * @param {string} key 
	 * @param {string} val 
	 * @param {number} timeout 过期时间
	 */
  function set(key,val,timeout = 60 * 60){
		if(typeof val === 'object'){
			val = JSON.stringify(val)
		}

		redisClient.set(key,val)
		redisClient.expire(key,timeout)
	}

	module.exports = {
		set
	}



 //get