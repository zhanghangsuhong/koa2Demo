/**
 * @description user API 路由
 * @author zhang
 */

const router = require('koa-router')()
const { isExist, register, login } = require('../../controller/user')
const { getValidator } = require('../../middlewares/validator')
const { loginRedirect } = require('../../middlewares/loginCheck')
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

module.exports = router