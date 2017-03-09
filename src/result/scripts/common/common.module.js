'use strict';
// 公共模块定义
window.define(
[
  'angular',
  'common/localproxy.service', // 本地代理,存取参数
  'common/backstage.service' // 后台服务,根据action名进行处理,通过注册that获取数据
],
function (angular, localProxyService, backstageService) {
  angular
    .module('platform.common', [])
    .factory('localProxyService', localProxyService)
    .factory('backstageService', backstageService);
});