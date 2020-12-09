/**
 * @description 登录校验中间件
 * @author zhang
 */

const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { loginFailInfo } = require('../model/ErrorInfo')

async function loginCheck(ctx,next){
    if(ctx.session && ctx.session.userInfo){
		
        await next()
        return
    }
		
    ctx.body = new ErrorModel(loginFailInfo)
	 
}


async function loginRedirect(ctx,next){
    if(ctx.session && ctx.session.userInfo){
	
        await next()
        return
    }
    const url = ctx.url
    ctx.redirect(`/login?url=${encodeURIComponent(url)}`)
 
}

module.exports = {
    loginCheck,
    loginRedirect
}