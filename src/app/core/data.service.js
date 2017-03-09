(function() {
  'use strict';
  // 数据服务, 提供本地后台数据交互

  angular
    .module('pf.core')
    .factory('dataService', dataService);

  dataService.$inject = ['$http', '$q', '$templateCache', 'errorService', 'coreCF'];
  function dataService($http, $q, $templateCache, errorService, config) {
    var _urlMap = config.urlMap; // 请求地址映射
    var _logUrl = config.logUrl;
    var service = {
      'get': get,
      'post': post,
      'getHtml': getHtml,
      'getItem': getItem,
      'setItem': setItem,
      'removeCookie': removeCookie,
      'getCookieObj': getCookieObj,
      'putCookieObj': putCookieObj,
      'getLog':getLog
    };
    return service;

    /**
     * 指定action名获取数据
     * @param  {String} name action映射名称
     * @param  {Object} params 对应参数
     * @return {Promise} 承诺
     */
    function get(name, params) {
      var url = createRepeatUrl(name);
      var options = {'params': params};

      return $http.get(url, options)
        .then(completeCallBack)
        .catch(failedCallBack);
    }
    
    /**
     * 获取操作日志
     */
    function getLog(name, params) {
        var url = createRepeatLogUrl(name);
        var options = {'params': params};

        return $http.get(url, options)
          .then(completeCallBack)
          .catch(failedCallBack);
      }

    /**
     * 同get, 对angular的post封装
     * @param  {String} name   action映射名称
     * @param  {Object} params 对应参数
     * @return {Promise}       承诺
     */
    function post(name, params) {
      var url = createRepeatUrl(name);
        
      return $http.post(url, params)
        .then(completeCallBack)
        .catch(failedCallBack);
    }

    /**
     * 获取html
     * @param  {Stirng} url 地址
     * @return {Promise}
     */
    function getHtml(url) {
      var deferred = $q.defer(), html = $templateCache.get(url);
      if (html) { deferred.resolve(html); }
      else {
        $http.get(url).then(function(res) {
          deferred.resolve(res.data);
          $templateCache.put(url, res.data); // 可以加判断限制是否缓存
        });
      }
      return deferred.promise;
    }

    //jquery-cookie封装
    function getCookieObj(key, options) {
      return $.cookie(key);
    }

    function putCookieObj(key, value, options) {
      return $.cookie(key, value, options);
    }

    function removeCookie(key, options) {
      return $.removeCookie(key, options);
    }
    //jquery-cookie封装
    
    // html5本地储存封装
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
    // html5本地储存封装
    
    // 正确完成后回调
    function completeCallBack(response) {
      var data = response.data;
//console.warn('DaTa', new Date().getTime(), data);
      // 错误信息拦截
      return errorService.interception(data); // 注意返回
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
    
    function createRepeatLogUrl(name) {
        var mapObject = _logUrl[name];
        if (angular.isString(mapObject)) { // 拼接规则
          return config.recordLogUrl + mapObject;
        } else {
          return mapObject.base + mapObject.action;
        }
      }
  }

})();