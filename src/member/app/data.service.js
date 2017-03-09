(function() {
	'use strict';
	app.factory('dataService',dataService);
	dataService.$inject = ['$http', 'coreCF', 'errorService', '$q'];
	function dataService($http, config, errorService, $q) {
		var _urlMap =  config.urlMap;
		var service = {
			'get':get,
			'post':post,
			'getItem': getItem,
			'setItem': setItem,
			'setCookie':setCookie,
			'getCookie':getCookie,
			'removeCookie':removeCookie
		};
		return service;

		function get(name, params) {
	      var url = createRepeatUrl(name);
	      var options = {'params': params};

	      return $http.get(url, options)
	        .then(completeCallBack)
	        .catch(failedCallBack);
	    }

		function post() {

		}

		function setItem(key, value) {
	      if (!angular.isString(value)) {
	        value = angular.toJson(value);
	      }
	      return window.localStorage.setItem(key, value);
	    }
		
		function getItem(key) {
	      var value = {};
	      var string = window.localStorage.getItem(key);
	      if (string) { value = angular.fromJson(string); }
	      return value;
	    }

	    function setCookie(name, value, day, domain) {
		    if (day == null && domain != null) {
		        document.cookie = name + "=" + escape(value) + ";domain=" + domain;
		    }
		    if (domain == null && day != null) {
		        var exp = new Date();
		        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
		        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
		    }
		    if (day == null && domain == null) {
		        var exp = new Date();
		        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
		        document.cookie = name + "=" + escape(value);
		    }
		    if (day != null && domain !== null) {
		        var exp = new Date();
		        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
		        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";domain=" + domain;
		    }
		}

	    function removeCookie(name,str) {
	    	var exp = new Date();
    		exp.setTime(exp.getTime() - 1);
    		var cval = getCookie(name);
    		if (cval != null)
        	document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=" + str + ";path=/";
	    }

	    function getCookie(name) {
		    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		    if (arr = document.cookie.match(reg))
		        return unescape(arr[2]);
		    else
		        return null;
		}

		function completeCallBack(response) {
	      var data = response.data;
	      // 错误信息拦截
	      return data; // 注意返回
	    }

	    // 失败后的回调
	    function failedCallBack(error) {
		    switch (error.status) {
		        case 600: // 未登录
		          errorService.swallow(errorService.NotLoggedIn);
		        break;
		        case 650: // 无权限
		          errorService.swallow(errorService.NoPermission);
		        break;
		        default:
		          errorService.showError(error.data.errorMessage);
		        break;
		    }
		    return $q.reject(error.data.errorMessage); // 返回前台错误对象?
	    }

	    /**
	     * 根据配置创建请求地址
	     * @param  {String} name key
	     * @return {String} 返回实际请求地址
	     */
	    function createRepeatUrl(name) {
	      var mapObject = _urlMap[name];
	      if (angular.isString(mapObject)) { // 拼接规则
	        return config.baseUrl + mapObject;
	      } else {
	        return mapObject.base + mapObject.action;
	      }
	    }
	}

})();