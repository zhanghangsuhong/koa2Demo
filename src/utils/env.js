
const env = process.env.NODE_ENV


module.exports = {
  isDev: env === 'dev',
  isProd: env === 'production'
}