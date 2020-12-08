/**
 * @description service user
 * @author zhang
 */

const User = require('../db/model/user')
const { formatUser } = require('./_format')

/**
 * 获取用户信息
 * @param {string} userName 用户名
 * @param {string} password 用户密码
 */
async function getUserInfo(userName, password) {

    let whereOpt = {
        userName
    }

    if (password) {
        Object.assign(whereOpt, { password })
    }

    const result = await User.findOne({
        where: whereOpt
    })

    if (result == null) {
        return result
    }

    return formatUser(result.dataValues)

}

module.exports = {
    getUserInfo
}