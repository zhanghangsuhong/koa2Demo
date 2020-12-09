/**
 * @description user controller
 * @author zhang
 */

const { getUserInfo, createUser, updateUser } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo,
    changeInfoFailInfo,
    changePasswordFailInfo

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
    const userInfo = await getUserInfo(userName, password)
    if (!userInfo) {
        return new ErrorModel(loginFailInfo)
    }

    if (ctx.session.userInfo == null) {
        ctx.session.userInfo = userInfo
    }
    return new SuccessModel()
}

/**
 * 修改个人信息
 * @param {Object} ctx ctx
 * @param {string} nickName  用户昵称
 * @param {string} nickName  用户城市
 * @param {string} nickName  用户头像
 */
async function changeInfo(ctx, { nickName, city, picture }) {
    const { userName } = ctx.session.userInfo
    !nickName && (nickName = userName)

    const result = await updateUser(
        {
            newNickName: nickName,
            newPicture: picture,
            newCity: city
        },
        { userName }
    )

    if (result) {
        Object.assign(ctx.session.userInfo, {
            nickName,
            picture,
            city
        })
        return new SuccessModel()
    }

    return new ErrorModel(changePasswordFailInfo)
}


/**
 * 修改密码
 * @param {string} userName  用户名
 * @param {string} password   密码
 * @param {string} newPassword  新密码
 */
async function changePassword({ userName, password, newPassword }) {
    const result = await updateUser(
        {
            newPassWord: doCrypTo(newPassword),
        },
        {
            userName,
            password: doCrypTo(password),
        }
    )

    if (result) {
        return new SuccessModel()
    }

    return new ErrorModel(changeInfoFailInfo)
}

/**
 * 退出登录
 * @param {Object} ctx  ctx
 */
async function logout(ctx){
    delete ctx.session.userInfo
    return new SuccessModel()
}


module.exports = {
    isExist,
    register,
    login,
    changeInfo,
    changePassword,
    logout
}