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


/**
 * 创建用户
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender 性别
 * @param {string} nickName 昵称
 */
async function createUser({ userName, password, gender = 3, nickName }) {
    const createRes = await User.create({
        userName,
        password,
        gender,
        nickName: nickName ? nickName : userName
    })

    return createRes.dataValues
}

/**
 * 
 * @param {Object} param0  要修改的内容 { newPassWord,newNickName,newPicture,newCity }
 * @param {Object} param1  查询条件 { userName,password }
 */
async function updateUser(
    { newPassWord, newNickName, newPicture, newCity },
    { userName, password }
) {
    let updateData = {}
    newPassWord && (updateData.password = newPassWord)
    newNickName && (updateData.nickName = newNickName)
    newPicture && (updateData.picture = newPicture)
    newCity && (updateData.city = newCity)

    let whereOpt = {
        userName
    }
    password && (whereOpt.password = password)

    const result = await User.update(updateData, {
        where: whereOpt
    })

    return result[0] > 0

}


module.exports = {
    getUserInfo,
    createUser,
    updateUser
}