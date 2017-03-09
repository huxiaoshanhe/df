'use strict';
// 与后台交互的服务
window.define(
[],
function () {
  var requestCount = 0; // 请求次数
  var actionMap = {};
  var rootBase = '';
  
  actionMap.sheets = {'url': 'jump.do'};
  actionMap.search = {'url': 'search.do'};
  actionMap.partial = {'url': 'dim.do'};
  actionMap.aggregation = {'url': 'aggregation.do'};
  actionMap.missValue = {'url': 'missvalue.do'};
  actionMap.descstats = {'url': 'descstats.do'};
  actionMap.timeSeries = {'url': 'timeseries.do'};
  actionMap.tableTotal = {'url': 'calc.do'};
  actionMap.indicRecmd = {'url': 'recmd.do'};
  actionMap.information = {'url': 'info.do'};
  // variable.do?action=aggregation&sheetId=7314ACAB8AB24F6F9FEC45868B391DFB
  // 
  actionMap.sheet = {'url': 'sheet.do'};

  actionMap.share = {'url': 'share.do'}; // 分享
  actionMap.refresh = {'url': 'refresh.do'}; // 刷新
  
  actionMap.variable = {'url': 'variable.do'}; // 参数
  actionMap.lr = {'url': 'lr.do'}; // 线性回归
  actionMap.curvefit = {'url': 'curvefit.do'}; // 曲线估计
  actionMap.bivar = {'url': 'correlation.do'}; // 相关分析-双变量
  actionMap.partial2 = {'url': 'correlation.do'}; // 相关分析-双变量
  actionMap.hp = {'url': 'hp.do'}; // HP滤波参数
  actionMap.leastSquares = {'url': 'leastSquares.do'}; // 二阶段最小二乘
  actionMap.preanalysis = {'url': 'preanalysis.do'}; // 预分析
  actionMap.fanalysis = {'url': 'fanalysis.do'}; // 因子分析
  actionMap.pcanalysis = {'url': 'pcanalysis.do'}; // 主成分分析
  actionMap.autocorre = {'url': 'autocorre.do'}; // 自相关分析结果
  actionMap.expsmooth = {'url': 'expsmooth.do'}; // 指数平滑
  actionMap.arima = {'url': 'arima.do'}; // Arima
  actionMap.charts = {'url': 'charts.do'}; // 图表
  actionMap.map = {'url': 'map.do'}; // 图表
  actionMap.init = {'url': 'init.do'};

  actionMap.userInfo = {'url': 'userInfo.do'}; // 获取用户信息

  function backstageService ($http, $q) {
    var service = {};
    service.map = actionMap; // 外部引用

//    var systemBase = '/DFinderPlatformSystem/' || 'http://localhost:3000/local/' ;
    var systemBase = '/';
//    var systemBase = 'http://localhost:3000/platform/' || '/DFinderPlatformSystem/' ;
    service.query = query;

    function query (actionName, params) {
      var action = actionMap[actionName];
      var url = systemBase + action.url;
      var options = {'params': params};
      
      // 输出请求信息的方法
      var infoFn = getInfoFn(actionName, params, url, action, function (response) {
    	
    	  switch (response.status) {
    	  	case 650:
    	  	case 700: // 错误
                $('#amen').html(response.data.errorMessage+'<i></i>');
                $('#amen').show().find('i').click(function() {$('#amen').hide();});
                $(window).click(function () {$('#amen').hide();});
    	  		return false; // 不继续
    	  	case 600: // 未登陆
    	  		$('#login-mask').show(); // userinfo
    	  		break;
    	  		break;
    	  	default: break;
    	  }
        // 错误信息处理
      });
// var deferred = $q.defer();
// $http.get(url, options).success(function (data, status, headers, config) {
//   deferred.resolve(data);
//   infoFn(data);
//   // console.info('data');
// }).error(function (data, status, headers, config) {
//   console.info(status);
//   // console.info('error');
// });
// return deferred.promise;
      return $http.get(url, options).then(infoFn, infoFn);
    }
    return service;
  }
  backstageService.$inject = ['$http', '$q'];

  // 获取输出请求后台信息的方法
  function getInfoFn (name, params, url, action, bbq) {
//console.log('|' + requestCount + '__' + url + '__请求!' + ':)');
    var st = new Date().getTime();
    return function(response) {
      requestCount++;
      // console.info(arguments);
      var et = new Date().getTime();
      var info = 
        '|方法: ' + name +
        '__状态:' + response.status +
        '__耗时:' + (et - st) + 'ms' +
        '__链接:' + url;
//console.log('|参数:', params, '\n |结果:', response.data);
      if (action.then) { // 过滤方法
        response.data = action.then(response.data);
      }
      if (bbq) { if (bbq(response) === false) { return null; }; }
      return response.data;
    };
  }

  return backstageService;
});