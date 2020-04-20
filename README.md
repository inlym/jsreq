
# jsreq
一个简单易用的Node.js HTTP请求客户端，支持Promise。


## 安装
使用NPM安装
```shell
$ npm install jsreq
```

使用CNPM安装
```shell
$ cnpm install jsreq
```


## 使用
首先引用
```js
const jsreq = require('jsreq');
```

支持多种调用方式，返回一个Promise。


```js
let url = 'http://www.example.com'
let options = {
    baseURL:'http://www.example.com',
    url:'/abc',
    path:'/path/to?name=inlym'
    method:'POST',
    data:'I am data',
    headers:{
        aaa:'aaa',
        bbb:'bbb'
    },
    responseType:'text'
}
jsreq(url,options).then(console.log).catch(console.log)  // 方式一

jsreq(url).then(console.log).catch(console.log)  // 方式二

jsreq(options).then(console.log).catch(console.log)  // 方式三
```

## 请求参数
对于url，你可以单独拿出来放在参数的第1项，也可以放在 options 参数中。

其中 options 支持以下参数
```js
let options = {
    baseURL:'http://www.example.com',
    url:'https://www.example.com',
    uri:'https://www.example.com',  // url的别名
    path:'/path/to?name=inlym',
    query:{                         // query对象
        age:19,
        isGood:true
    },
    method:'POST',
    data:'I am data',
    headers:{
        aaa:'aaa',
        bbb:'bbb'
    },
    responseType:'text'
}
```

## 响应
响应是一个对象，包含以下属性：

1. statusCode
2. statusMessage
3. headers
4. data

例如
```js
{
    statusCode:200,
    statusMessage:'OK',
    headers:{
        'date': 'Mon, 30 Mar 2020 14:13:26 GMT',
        'content-type': 'application/json; charset=utf-8',
        'content-length': '1179',
    },
    data:'I am response data'
}
```