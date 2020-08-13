'use strict'


function getDispatcher() {
	let dispatcher

	if (typeof XMLHttpRequest === 'function') {
		// 当前在浏览器环境中
		dispatcher = require('../dispatcher/browser')
	} else if (typeof XMLHttpRequest === 'undefined' && typeof process === 'object') {
		// 当前运行在 node.js 环境中
		dispatcher = require('../dispatcher/node')
	} else if (typeof XMLHttpRequest === 'undefined' && typeof wx === 'object') {
		// 当前运行在微信小程序环境中
		dispatcher = require('../dispatcher/wx-miniprogram')
	} else {
		// 其他环境后续陆续支持, 只需要挂载到 ../dispatcher 文件夹，然后再在这个方法中引用即可
		throw new Error('当前运行在未识别的环境中, 如需支持, 请联系作者!')
	}

	return dispatcher
}



module.exports = {
	getDispatcher,
}