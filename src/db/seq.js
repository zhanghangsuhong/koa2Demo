
const Sequelize = require('sequelize')

const conf = {
	host:'127.0.0.1',
	dialect:'mysql',
	//解决中文输入问题
	define: {
		charset: 'utf8',
		dialectOptions: {
				collate: 'utf8_general_ci'
		}
	}	
}

conf.pool = {
	max:5,
	min:0,
	idle:10000
}

const seq = new Sequelize('test','root','zhanghang',conf)

module.exports = seq


