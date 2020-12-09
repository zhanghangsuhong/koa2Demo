/**
 * @description json schema 校验
 * @author zhang
 */

const Ajv = require('ajv')
const ajv = new Ajv({
    // allErrors: true
})


/**
 * 数据校验方法
 * @param {Object} schema 校验格式
 * @param {Object} data 校验数据
 */
function validate(schema, data = {}) {

    const valid = ajv.validate(schema, data)
    if (!valid) {
        return ajv.errors[0]
    }

}

module.exports = validate
