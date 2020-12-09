/**
 * @description utils api 路由
 * @author zhang
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginCheck')
const koaForm = require('formidable-upload-koa')
const { saveFile } = require('../../controller/utils')

router.prefix('/api/utils')

router.post('/upload', loginCheck, koaForm(), async (ctx, next) => {
    console.log('/upload')
    const file = ctx.req.files['file']
    const { name, type, size, path } = file
    ctx.body = await saveFile({
        name,
        type,
        size,
        filePath: path
    })
})

module.exports = router