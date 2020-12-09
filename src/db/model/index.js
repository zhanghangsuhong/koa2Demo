/**
 * @description 数据模型文件入口
 * @author zhang
 */

const User = require('./user')
const Blog = require('./blog')

//Blog创建外键
Blog.belongsTo(User, {
    foreignKey: 'userId'
})



module.exports = {
    User,
    Blog
}