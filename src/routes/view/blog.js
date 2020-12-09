/**
 * @description blog view路由
 * @author zhang
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginCheck')


router.get('/',loginRedirect,async (ctx,next)=>{
    await ctx.render('index',{})
})


module.exports = router