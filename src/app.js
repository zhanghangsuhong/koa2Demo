
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const errorViewRouter = require('./routes/view/error')
const userViewRouter = require('./routes/view/user')
const userAPIRouter = require('./routes/api/user')
const index = require('./routes/index')

const { SESSION_SECRET_KEY } = require('./conf/secertKeys')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

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
app.use(index.routes(), index.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

module.exports = app
