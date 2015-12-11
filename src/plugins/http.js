// install  :     cordova plugin add https://github.com/Telerik-Verified-Plugins/SecureHTTP.git
// link     :     https://github.com/Telerik-Verified-Plugins/SecureHTTP
angular.module('ngCordova.plugins.http', [])

    .factory('$cordovaHttp', ['$q', function ($q) {

        return {

            get: function (url, params, headers) {
                var q = $q.defer();
                params = params || {};
                headers = headers || {};

                window.plugins.CordovaHttpPlugin.get(url, params, headers,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            post: function(url, params, headers) {
                var q = $q.defer();
                params = params || {};
                headers = headers || {};

                window.plugins.CordovaHttpPlugin.post(url, params, headers,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            enableSSLPinning: function(allow) {
                var q = $q.defer();
                allow = allow || true;

                window.plugins.CordovaHttpPlugin.enableSSLPinning(allow,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            acceptAllCerts: function(allow) {
                var q = $q.defer();
                allow = allow || true;

                window.plugins.CordovaHttpPlugin.acceptAllCerts(allow,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            useBasicAuth: function(username, password) {
                var q = $q.defer();

                window.plugins.CordovaHttpPlugin.useBasicAuth(username, password,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            setHeader: function(header, value) {
                var q = $q.defer();

                window.plugins.CordovaHttpPlugin.setHeader(header, value,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            uploadFile: function(url, params, headers, filePath, name) {
                var q = $q.defer();
                params = params || {};
                headers = headers || {};

                window.plugins.CordovaHttpPlugin.uploadFile(url, params, headers, filePath, name,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            },
            downloadFile: function(url, params, headers, filePath) {
                var q = $q.defer();
                params = params || {};
                headers = headers || {};

                window.plugins.CordovaHttpPlugin.downloadFile(url, params, headers, filePath,
                    function (data) {
                        q.resolve(data);
                    }, function (err) {
                        q.reject(err);
                    }
                );

                return q.promise;
            }

        };
    }]);