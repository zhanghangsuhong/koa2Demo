/**
 * @description 连接redis的get 和set方法
 * @author zhang
 */

const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')


const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.log('redis error')
})

/**
 * redis set
 * @param {string} key 
 * @param {string} val 
 * @param {number} timeout 过期时间
 */
function set(key, val, timeout = 60 * 60) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }

    redisClient.set(key, val)
    redisClient.expire(key, timeout)
}
// "lint": "eslint --ext .js ./src"
/**
 * redis get
 * @param {string} key 
 */
function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }

            if (val == null) {
                resolve(null)
                return
            }

            try {
                resolve(JSON.parse(val))
            } catch (ex) {
                resolve(val)
            }

        })
    })
    return promise

}

module.exports = {
    set,
    get
}



//get