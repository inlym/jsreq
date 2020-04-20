'use strict'

const http = require('http')
const https = require('https')
const EventEmitter = require('events')
const whatis = require('./../utils/whatis')
const trimHeaders = require('./headers')
const serializeUrl = require('./url')
const Response = require('./response')
const isEmptyObject = require('./../utils/isEmptyObject')


function Request() {
    this.baseURL = undefined
    this.url = undefined
    this.path = undefined
    this.query = {}
    this.method = undefined
    this.headers = {}
    this.requestBody = undefined

    this.requestOptions = {}
    this.httpModule = undefined
    this.req = undefined
}


Request.prototype = Object.create(EventEmitter.prototype)


Request.prototype.init = function (url, options, callback) {
    const self = this
    const mergedParams = self.mergeParams(url, options, callback)

    // 初始化
    if (mergedParams.baseURL) {
        self.baseURL = mergedParams.baseURL
    }

    if (mergedParams.url || mergedParams.uri) {
        self.url = mergedParams.url || mergedParams.uri
    }

    if (mergedParams.path) {
        self.path = mergedParams.path
    }

    if (mergedParams.query || mergedParams.params) {
        self.query = mergedParams.query || mergedParams.params
    }

    if (mergedParams.method) {
        self.method = mergedParams.method.toUpperCase()
    } else {
        self.method = 'GET'
    }

    if (whatis(mergedParams.headers) === 'object' && !isEmptyObject(mergedParams.headers)) {
        self.headers = mergedParams.headers
    }

    if (mergedParams.data || mergedParams.body) {
        self.requestBody = mergedParams.data || mergedParams.body
    }

    if (mergedParams.responseType && whatis(mergedParams.responseType) === 'string') {
        self.responseType = mergedParams.responseType
    } else {
        self.responseType = 'text'
    }

    if (mergedParams.callback) {
        self.callback = mergedParams.callback
    }

    // 定义接收错误
    self.on('error', function (errMsg) {
        if (self.callback) {
            self.callback(errMsg)
        }
    })

    // 外部处理，接收
    if (serializeUrl(self)) {
        Object.assign(self.requestOptions, serializeUrl(self))
    }
    self.headers = trimHeaders(self)
    self._Response = new Response(self)

    self.requestOptions.headers = self.headers
    self.requestOptions.method = self.method


    // 指定协议
    self.specifyProtocol()

    // 发送请求
    return self.dispatchRequest()
}


Request.prototype.mergeParams = function (url, options, callback) {
    const self = this
    let mergedParams = {}

    // 参数完整情况
    if (whatis(url) === 'string' && whatis(options) === 'object' && whatis(callback) === 'function') {
        Object.assign(mergedParams, options, { url: url }, { callback: callback })
    } else if (whatis(url) === 'object' && whatis(options) === 'function') {
        // 缺url情况
        Object.assign(mergedParams, url, { callback: options })
    } else if (whatis(url) === 'string' && whatis(options) === 'function') {
        // 缺options情况
        Object.assign(mergedParams, { url: url }, { callback: options })
    } else if (whatis(url) === 'string' && whatis(options) === 'undefined') {
        // 只有url,无callback
        Object.assign(mergedParams, { url: url })
    } else if (whatis(url) === 'object' && whatis(options) === 'undefined') {
        Object.assign(mergedParams, url)
    } else if (whatis(url) === 'string' && whatis(options) === 'object' && whatis(callback) === 'undefined') {
        Object.assign(mergedParams, options, { url: url })
    } else {
        self.emit('error', '参数错误:未包含有效参数')
    }

    return mergedParams
}


Request.prototype.specifyProtocol = function () {
    const self = this
    if (self.requestOptions.protocol === 'https:') {
        self.httpModule = https
    } else {
        self.httpModule = http
    }
}


Request.prototype.dispatchRequest = function () {
    const self = this

    self.req = self.httpModule.request(self.requestOptions, function (res) {
        self._res = res

        res.on('data', function (chunk) {
            self._Response.bufferChunkDataList.push(chunk)
        })

        res.on('end', function () {
            self._Response.onEnd()
            if (self.callback) {
                self.callback(null, self._Response.toJSON())
            }
        })
    })

    self.req.on('error', function (error) {
        self.emit('error', error)
    })

    if (self.requestBody) {
        self.req.write(self.requestBody)
    }

    self.req.end()
}


module.exports = Request