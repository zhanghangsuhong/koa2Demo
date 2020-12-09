/**
 * @description user controller
 * @author zhang
 */

const { getUserInfo, createUser } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo

} = require('../model/ErrorInfo')
const { doCrypTo } = require('../utils/cryp')


/**
 * 用户名是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
    let userInfo = await getUserInfo(userName)
    if (userInfo) {
        return new SuccessModel(userInfo)
    } else {
        return new ErrorModel(registerUserNameNotExistInfo)
    }
}

/**
 * 注册
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender 性别
 */
async function register({ userName, password, gender }) {
    let userInfo = await getUserInfo(userName, password)
    if (userInfo) {
        return new ErrorModel(registerUserNameExistInfo)
    }

    try {
        await createUser({
            userName,
            password: doCrypTo(password),
            gender
        })
        return new SuccessModel()
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(registerFailInfo)
    }
}

/**
 * 
 * @param {Object} ctx 
 * @param {string} userName 用户名
 * @param {string} password 用户密码
 */
async function login(ctx, userName, password) {
    const userInfo = await getUserInfo(userName,password)
    if(!userInfo){
        return new ErrorModel(loginFailInfo)
    }
    
    if(ctx.session.userInfo == null){
        ctx.session.userInfo = userInfo
    }
    return new SuccessModel()
}


module.exports = {
    isExist,
    register,
    login
}