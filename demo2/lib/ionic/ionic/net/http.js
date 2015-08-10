'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ionicUtil = require('ionic/util');

var util = _interopRequireWildcard(_ionicUtil);

//TODO(mlynch): surely, there must be another way, sir?
window._jsonpcallbacks = {
    counter: 0
};
/**
 * The Http class makes it easy to send GET/POST/PUT/DELETE/PATCH requests
 * and send/receive JSON (or anything else) through a simple API.
 *
 * Http uses the `fetch()` API underneath, or a polyfill if it's not natively supported.
 */

var Http = (function () {
    function Http() {
        _classCallCheck(this, Http);
    }

    _createClass(Http, null, [{
        key: 'fetch',

        /**
         * The raw fetch() operation.
         *
         * Generally, you want to use one of get()/post()/put()/delete() but
         * this is useful if you want to do something crazy.
         *
         * @param url the URL to pass to fetch
         * @param options the options to configure the fetch
         * @return es6 promise from the fetch.
         */
        value: function fetch(url, options) {
            return window.fetch(url, options).then(function (response) {
                // status "0" to handle local files fetching (e.g. Cordova/Phonegap etc.)
                if (response.status === 200 || response.status === 0) {
                    // We have a good response, let's check the response headers and return
                    // deserialized JSON or return the text from the response.
                    if (response.headers.get('Content-Type') === 'application/json') {
                        return response.json();
                    }
                    return response.text();
                } else {
                    return Promise.reject(response, new Error(response.statusText));
                }
            })['catch'](function (err) {
                return Promise.reject(err);
            });
        }
    }, {
        key: 'jsonp',
        value: function jsonp(url, callbackId, options) {
            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.type = 'text/javascript';
                var callback = function callback(event) {
                    script.removeEventListener('load', callback);
                    script.removeEventListener('error', callback);
                    document.body.removeChild(script);
                    var text = undefined,
                        status = undefined;
                    if (event) {
                        if (event.type === 'load' && !window._jsonpcallbacks[callbackId].called) {
                            event = { type: 'error' };
                        }
                        text = event.type;
                        status = event.type === 'error' ? 404 : 200;
                        resolve(window._jsonpcallbacks[callbackId].data, status, text);
                    } else {
                        reject();
                    }
                    /*
                    var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
                        callbackId, function(status, text) {
                      completeRequest(callback, status, callbacks[callbackId].data, "", text);
                      callbacks[callbackId] = noop;
                    });
                    */
                };
                script.addEventListener('load', callback);
                script.addEventListener('error', callback);
                document.body.appendChild(script);
                return callback;
            });
        }
    }, {
        key: '_method',
        value: function _method(method, url, data, options, sendsJson) {
            options = util.defaults(options, {
                method: method,
                headers: {
                    'Accept': 'application/json,text/plain,*/*'
                }
            });
            if (options.body) {
                options.body = typeof data === 'string' ? data : JSON.stringify(data);
            }
            if (sendsJson) {
                options.headers['Content-Type'] = 'application/json';
            }
            if (options.method == 'jsonp') {
                var callbackId;

                var _ret = (function () {
                    // Adopted from Angular 1
                    var callbacks = window._jsonpcallbacks;
                    callbackId = '_' + (callbacks.counter++).toString(36);

                    callbacks[callbackId] = function (data) {
                        callbacks[callbackId].data = data;
                        callbacks[callbackId].called = true;
                    };
                    /*
                    var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
                        callbackId, function(status, text) {
                      completeRequest(callback, status, callbacks[callbackId].data, "", text);
                      callbacks[callbackId] = noop;
                    });
                    */
                    url = url.replace('JSON_CALLBACK', '_jsonpcallbacks.' + callbackId);
                    return {
                        v: Http.jsonp(url, callbackId, options)
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            } else {
                return Http.fetch(url, options);
            }
        }
    }, {
        key: 'get',

        /**
         * Send a GET request to the given URL.
         *
         * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
         *
         * @param url the URL to POST to
         * @param options the options to configure the post with.
         * @return promise
         */
        value: function get(url) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            return Http._method('get', url, {}, options);
        }
    }, {
        key: 'post',

        /**
         * Send a POST request to the given URL.
         *
         * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
         * and the `Content-Type` header as `application/json`
         *
         * @param url the URL to POST to
         * @param options the options to configure the post with.
         * @return promise
         */
        value: function post(url) {
            var data = arguments[1] === undefined ? {} : arguments[1];
            var options = arguments[2] === undefined ? {} : arguments[2];

            return Http._method('post', url, data, options, true);
        }
    }, {
        key: 'put',

        /**
         * Send a PUT request to the given URL.
         *
         * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
         * and the `Content-Type` header as `application/json`
         *
         * @param url the URL to PUT to
         * @param data the JSON data to send
         * @param options the options to configure the post with.
         * @return promise
         */
        value: function put(url) {
            var data = arguments[1] === undefined ? {} : arguments[1];
            var options = arguments[2] === undefined ? {} : arguments[2];

            return Http._method('put', url, data, options, true);
        }
    }, {
        key: 'delete',

        /**
         * Send a DELETE request to the given URL.
         *
         * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
         * and the `Content-Type` header as `application/json`
         *
         * @param url the URL to DELETE to
         * @param data the JSON data to send
         * @param options the options to configure the post with.
         * @return promise
         */
        value: function _delete(url) {
            var data = arguments[1] === undefined ? {} : arguments[1];
            var options = arguments[2] === undefined ? {} : arguments[2];

            return Http._method('delete', url, data, options, true);
        }
    }, {
        key: 'patch',

        /**
         * Send a PATH request to the given URL.
         *
         * By default, options sends the `Accept` header as `application/json,text/plain,* / *`,
         * and the `Content-Type` header as `application/json`
         *
         * @param url the URL to PATH to
         * @param options the options to configure the post with.
         * @return promise
         */
        value: function patch(url) {
            var data = arguments[1] === undefined ? {} : arguments[1];
            var options = arguments[2] === undefined ? {} : arguments[2];

            return Http._method('patch', url, data, options, true);
        }
    }]);

    return Http;
})();

exports.Http = Http;