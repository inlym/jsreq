'use strict'

const whatis = require('./../utils/whatis')
const isEmptyObject = require('./../utils/isEmptyObject')

/**
 * 检测是否是一个HTTP绝对路径的URL（以http:或https:开头）
 * @param {String} url 
 */
function isHttpUrl(url) {
    if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0) {
        return true
    } else {
        return false
    }
}

/**
 * 序列化request中的url相关参数
 * 
 * @param {Object} request 
 * @returns {Object} serializedUrl
 */
function serializeUrl(request) {
    let serializedUrl = {}
    if (request.baseURL) {
        // baseURL不为空情况
        if (!isHttpUrl(request.baseURL)) {
            // baseURL不为空且非绝对路径情况
            return request.emit('error', '参数错误：baseURL请以http:或者https:开头')
        } else {
            if (request.url) {
                if (isHttpUrl(request.url)) {
                    // baseURL和url同时为绝对路径
                    return request.emit('error', '参数错误：baseURL和url都是绝对路径')
                } else {
                    serializedUrl = new URL(request.url, request.baseURL)
                }
            } else {
                serializedUrl = new URL(request.baseURL)
            }
        }
    } else {
        // baseURL为空情况
        if (!request.url) {
            // baseURL和url同时为空
            return request.emit('error', '参数错误：baseURL和url都为空')
        } else {
            if (!isHttpUrl(request.url)) {
                // baseURL为空，url非绝对路径
                return request.emit('error', '参数错误：url请以http:或者https:开头')
            } else {
                serializedUrl = new URL(request.url)
            }
        }
    }

    // 以上部分完成处理baseURL和url，建立URL实例，对于path,query部分只需往里加参数即可

    // 处理参数中的path
    if (request.path) {
        if (serializedUrl.search) {
            // baseURL或url中已经包含query部分
            return request.emit('error', '参数错误：url已带参数，path参数无效')
        } else {
            serializedUrl.href = serializedUrl.href.replace(/\/+$/, '') + '/' + request.path.replace(/^\/+/, '')
        }
    }

    // 处理参数中的query
    if (request.query && whatis(request.query === 'object') && !isEmptyObject(request.query)) {
        Object.keys(request.query).forEach(function (key) {
            // 注意：query部分参数会覆盖url中的同名参数
            serializedUrl.searchParams.set(key, request['query'][key])
        })
    }

    // validUrl对象为http(s).request所需格式(不包含auth)
    const validUrl = {
        hostname: serializedUrl.hostname,
        path: serializedUrl.pathname + serializedUrl.search,
        port: serializedUrl.port,
        protocol: serializedUrl.protocol
    }
    return validUrl
}


module.exports = serializeUrl