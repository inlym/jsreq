'use strict'

function Response(request) {
    this._request = request
    this.responseType = request.responseType
    this.headers = {}
    this.bufferChunkDataList = []
    this.bufferData = undefined
    this.textData = undefined
    this.data = undefined
    this.statusCode = undefined
    this.statusMessage = undefined
}

Response.prototype.onEnd = function () {
    const self = this
    self.bufferData = Buffer.concat(self.bufferChunkDataList)
    self.textData = self.bufferData.toString()

    if (self.responseType === 'buffer' || self.responseType === 'buf' || self.responseType === 'binary' || self.responseType === 'bin') {
        self.data = self.bufferData
    } else {
        self.data = self.textData
    }

    self.headers = self._request._res.headers
    self.statusCode = self._request._res.statusCode
    self.statusMessage = self._request._res.statusMessage
}

Response.prototype.toJSON = function () {
    const self = this
    return {
        statusCode: self.statusCode,
        statusMessage: self.statusMessage,
        headers: self.headers,
        data: self.data
    }
}

module.exports = Response