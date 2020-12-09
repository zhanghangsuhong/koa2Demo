/**
 * @description user API 路由
 * @author zhang
 */

const router = require('koa-router')()
const { 
    isExist, 
    register, 
    login, 
    changeInfo, 
    changePassword,
    logout

} = require('../../controller/user')
const { getValidator } = require('../../middlewares/validator')
const { loginRedirect, loginCheck } = require('../../middlewares/loginCheck')
const { doCrypTo } = require('../../utils/cryp')
const { userValidate } = require('../../validator/user')
router.prefix('/api/user')

//注册
router.post('/register', getValidator(userValidate), async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({
        userName,
        password,
        gender
    })
})

//登录
router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    ctx.body = await login(ctx, userName, doCrypTo(password))
})

//用户名是否存在
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body
    ctx.body = await isExist(userName)
})

//修改用户信息
router.patch('/changeInfo', loginCheck, getValidator(userValidate), async (ctx, next) => {
    const { nickName, city, picture } = ctx.request.body
    ctx.body = await changeInfo(ctx, { nickName, city, picture })
})

//修改密码
router.patch('/changePassword', loginCheck, getValidator(userValidate), async (ctx, next) => {
    const { password, newPassword } = ctx.request.body
    const { userName } = ctx.session.userInfo
    ctx.body = await changePassword({ userName, password, newPassword })
})

//退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
    console.log('logout')
    ctx.body = await logout(ctx)
})

module.exports = router