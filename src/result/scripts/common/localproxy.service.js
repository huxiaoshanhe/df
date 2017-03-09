'use strict';
// 本地参数代理服务
window.define(
[],
function () {

  function localProxyService ($cookieStore) {
    var service = {};
    var dataKey = 'df_data_transit'; // 根数据的键(session不用担心...)
    service.get = get;
    service.save = save;
    service.getLocal = getLocal;
    service.saveLocal = saveLocal;
    service.getRoot = getRoot;
    service.getByCookie = getByCookie;

    // 在本地获取指定键的数据,统一在dataKey的键下
    function get (key) {
      var sessionData = window.sessionStorage.getItem(key) || '{}';
      sessionData = window.JSON.parse(sessionData);
      return sessionData[key];
    }

    // Cookie
    function getByCookie (key) {
      return $cookieStore.get(key);
    }

    // 设置数据
    // 自动序列化
    function setByCookie (key, data) {
      $cookieStore.put(key, data);
    }
    
    function getRoot (key) {
      var sessionData = window.sessionStorage.getItem(key) || 'null';
      sessionData = window.JSON.parse(sessionData);
      return sessionData;
    }

    function getLocal (key) {
      // var sessionData = window.localStorage.getItem(dataKey) || '{}';
      // sessionData = window.JSON.parse(sessionData);
      // return sessionData[key];
    }

    // 保存数据到本地,dataKey下
    function save (key, data, win) {
      if (!win) {win = window;}
      var sessionData = win.sessionStorage.getItem(key) || '{}';
      sessionData = win.JSON.parse(sessionData); // 是不是太麻烦:(
      sessionData[key] = data;
      var string = win.JSON.stringify(sessionData);
      win.sessionStorage.setItem(key, string);
    }

    function saveLocal (key, data) {
      // var sessionData = window.localStorage.getItem(dataKey) || '{}';
      // sessionData = window.JSON.parse(sessionData); // 是不是太麻烦:(
      // sessionData[key] = data;
      // var string = window.JSON.stringify(sessionData);
      // window.sessionStorage.setItem(dataKey, string);
    }
    return service;
  }
  localProxyService.$inject = ['$cookieStore'];

  return localProxyService;
});