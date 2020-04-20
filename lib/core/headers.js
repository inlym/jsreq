'use strict'

const whatis = require('./../utils/whatis')
const isEmptyObject = require('./../utils/isEmptyObject')


/**
 * 整理请求的header头
 * @param {Object} request 
 */
function trimHeaders(request) {
    let validHeaders = {}
    if (whatis(request.headers) === 'object' && !isEmptyObject(request.headers)) {
        Object.keys(request.headers).forEach(function (key) {
            // 去掉没有值的header
            if (request['headers'][key]) {
                // 适配HTTP/2，将所有的header头转换为小写
                validHeaders[key.toLowerCase()] = request['headers'][key]
            }
        })

    }

    // 添加content-length，避免分块
    if (request.requestBody) {
        validHeaders['content-length'] = Buffer.byteLength(request.requestBody)
    }

    return validHeaders
}


module.exports = trimHeaders