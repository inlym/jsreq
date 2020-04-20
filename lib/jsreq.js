'use strict'

const Request = require('./core/request')
const promisify = require('util').promisify
const whatis = require('./utils/whatis')

function jsreq_callback(url, options, callback) {
    return new Request().init(url, options, callback)
}

const jsreq_promise = promisify(jsreq_callback)


module.exports = jsreq_promise