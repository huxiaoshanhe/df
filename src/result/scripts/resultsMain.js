'use strict';

/*分析结果启动配置*/
require.config({
  paths: {
    'angular': '../bower_components/angular/angular.min',
    'ngRoute': '../bower_components/angular-route/angular-route.min',
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'ngcookie': '../bower_components/angular-cookies/angular-cookies.min',
    'qrcode': '../bower_components/qrcode/lib/qrcode.min',
    'echarts': 'echarts-all'
  },
  shim: {
    'angular': { exports: 'angular', deps: ['jquery'] },
    'ngRoute': { deps: ['angular'] },
    'ngcookie': { deps: ['angular'] },
    'qrcode': { deps: ['jquery'] },
  }
});

/*入口启动*/
require(
['angular', 'results/results.module', 'ngRoute'],
function (angular, startApp) {
  angular.element().ready(function() {
    angular.bootstrap(document, [startApp.name]); // 平台模块为启动模块
  });
});