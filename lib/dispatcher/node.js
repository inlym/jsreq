'use strict'


const http = require('http')
const https = require('https')


module.exports = function dispatch(request) {
	const protocol = request.urlWrapper.protocol

	// 根据http协议，指定使用的http模块
	let httpModule
	if (protocol === 'http:') {
		httpModule = http
	} else if (protocol === 'https:') {
		httpModule = https
	} else {
		throw new Error('内部未知错误，可能是获取protocol异常!')
	}

	// 从request对象中抽取发起请求需要的参数
	// to do ...

	return new Promise(function (resolve, reject) {

	})
}