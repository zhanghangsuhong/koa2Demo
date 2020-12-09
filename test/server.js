/**
 * @description jest server
 * @author zhang
 */


 const request = require('supertest')
 const server = require('../src/app').callback()

 module.exports = request(server)

