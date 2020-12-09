/**
 * @description 格式校验中间件
 * @author zhang
 */

const { jsonSchemaFileInfo } = require('../model/ErrorInfo')
const { ErrorModel } = require('../model/ResModel')

/**
 * json 校验中间件
 * @param {function} validateFn 校验函数
 */
function getValidator(validateFn) {
    async function validator(ctx, next) {
        const error = validateFn(ctx.request.body)
        if(error){
            ctx.body = new ErrorModel(jsonSchemaFileInfo)
            return
        }
        await next()
    }
    return validator
}

module.exports = {
    getValidator
}