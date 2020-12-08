/**
 * @description user controller
 * @author zhang
 */

const { getUserInfo } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUserNameNotExist } = require('../model/ErrorInfo')
/**
 * 用户名是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
    let userInfo = await getUserInfo(userName)
    if (userInfo) {
        return new SuccessModel(userInfo)
    } else {
        return new ErrorModel(registerUserNameNotExist)
    }
}

module.exports = {
    isExist
}