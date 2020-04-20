'use strict'

const VALID_REQUEST_PARAMS = [
    'baseURL',              // string
    'url', 'uri',           // string
    'path',                 // string
    'query', 'params',      // object
    'method',               // string
    'headers',              // object
    'data', 'body',         // any
    'responseType'          // 'buffer','text'(default)
]

const METHODS = [
    'ACL',
    'BIND',
    'CHECKOUT',
    'CONNECT',
    'COPY',
    'DELETE',
    'GET',
    'HEAD',
    'LINK',
    'LOCK',
    'M-SEARCH',
    'MERGE',
    'MKACTIVITY',
    'MKCALENDAR',
    'MKCOL',
    'MOVE',
    'NOTIFY',
    'OPTIONS',
    'PATCH',
    'POST',
    'PROPFIND',
    'PROPPATCH',
    'PURGE',
    'PUT',
    'REBIND',
    'REPORT',
    'SEARCH',
    'SOURCE',
    'SUBSCRIBE',
    'TRACE',
    'UNBIND',
    'UNLINK',
    'UNLOCK',
    'UNSUBSCRIBE'
],