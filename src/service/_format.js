/**
 * @description 数据格式化
 * @author zhang
 */

const { DEFAULT_PICTURT } = require('../conf/constant')


/**
 * 用户默认头像
 * @param {Object} obj 用户对象
 */
function _formatUserPicture(obj) {
    if (obj.picture == null) {
        obj.picture = DEFAULT_PICTURT
    }
    return obj
}


/**
 * 格式化用户信息
 * @param {Array|List} list 用户列表或者单个用户对象
 */
function formatUser(list) {
    if (list == null) {
        return list
    }

    if (list instanceof Array) {
        return list.map(_formatUserPicture)
    }

    return _formatUserPicture(list)

}

module.exports = {
    formatUser
}