const path = require('path')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaStatic = require('koa-static')

const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const errorViewRouter = require('./routes/view/error')
const userViewRouter = require('./routes/view/user')
const blogViewRouter = require('./routes/view/blog')
const userAPIRouter = require('./routes/api/user')
const utilsAPIRouter = require('./routes/api/utils')

const { createProxyMiddleware } = require('http-proxy-middleware')
const koaConnect = require('koa2-connect')

const { SESSION_SECRET_KEY } = require('./conf/secertKeys')


// 代理兼容封装
const proxy = function (context, options) {
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    return async function (ctx, next) {
        await koaConnect(createProxyMiddleware(context, options))(ctx, next)
    }
}

const proxyTable = {
    '/cesium/3DModel': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // pathRewrite: {
        //     '^/Augurit/framework-ui/src/main/resources/static': '/agcloud'
        // },
    },
    '/geowebcache': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // pathRewrite: {
        //     '^/Augurit/framework-ui/src/main/resources/static': '/agcloud'
        // },
    },


}


Object.keys(proxyTable).map(context => {
    const options = proxyTable[context]
    // 使用代理
    app.use(proxy(context, options))
})

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(__dirname + '/public'))
// app.use(koaStatic(path.join(__dirname,'..','/uploadFiles')))
app.use(koaStatic(path.resolve(__dirname, '../uploadFiles')))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

app.keys = [SESSION_SECRET_KEY]
app.use(session({
    key: 'weibo.sid',
    prefix: 'weibo:sess:',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    ttl: 24 * 60 * 60 * 1000,
    store: redisStore({
        all: '127.0.0.1:6379'
    })
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
// app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
// app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
// app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
// app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
// app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

module.exports = app
