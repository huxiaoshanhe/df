(function() {
  'use strict';

  angular
    .module('pf.charts')
    .factory('chartService', chartService);

  chartService.$inject = ['$rootScope', 'dataService', 'sheetService', 'coreCF', 'ngDialog', 'errorService'];
  function chartService($rootScope, dataService, sheetService, config, ngDialog, errorService) {
    var _spk = config.spreadKey;
    var _chartCache = {}; // 图表缓存
    var service = {
      'getCharts': getCharts,
      'getAreaCharts': getChartsData,
      'getChartById': function(id){ return _chartCache[id]; },
      'getMaps':getMaps,
      'scatter':scatter
    };
    return service;

    /**
     * 获取所有数据的图表
     * @param  {String} type 图表类型
     * @return {Promise}      [description]
     */
    function getCharts(type) {
      return getChartsData(null, null, type);
    }
    
    /**
     * 获取地图数据
     */
    function getMaps(type) {
        $rootScope.$broadcast('showMap',true);
    }
    
    
    /**
     * 散点图窗口
     */
    function scatter() {
    	ngDialog.open({
	        template: 'app/template/charts/scatter.html',
	        className: 'ngdialog-theme-charts',
	        controller: 'scatterCtrl',
	        closeByDocument: true,
	        controllerAs: 'scc'
	    });
    }
    

    /**
     * 获取图表数据, 根据一个区域和图表类型
     * @param  {Array} p1 [r, c]
     * @param  {Array} p2 [r, c]
     * @param  {String} type 图表类型
     * @return {Promise} 
     */
    function getChartsData(p1, p2, type) {
      if(type==='scatter') {
    	  return false;
      }
      var sheetId = sheetService.getSheetId();
	  var params = {
			  'chartsType': type,
			  'sheetId': sheetId
      };
      if (p1 && p2) {
        params.p1 = p1[0] + ',' + p1[1];
        params.p2 = p2[0] + ',' + p2[1];
      }
	  return dataService.get('charts', params).then(function(source) {
        var chart = {'type': type, 'data': source};
        var sheetId = sheetService.getSheetId();
        _chartCache[sheetId] = chart; // 缓存上
        switch(type) {
	        case 'Line':
	        case 'StackLine':
	        case 'Area':
	        case 'StackArea':
	        case 'Bar':
	        case 'StackBar':
	        case 'RotateBar':
	        case 'StackRotateBar':
	        source.legend.data = repeatDeal(source.legend.data);//指标名称重复处理
	    		angular.forEach(source.series,function(val,key) {
	    			val.name = source.legend.data[key];
	    		});
	    	break;
	        case 'Pie':
	        case 'Ring':
	        case 'Radar':
	        case 'FillRadar':
          if(source.title!==undefined) {
            source.title.x = 'center';
          };
	        source.legend.data = repeatDeal(source.legend.data);//指标名称重复处理
	    		angular.forEach(source.series[0].data,function(val,key) {
	    			val.name = source.legend.data[key];
	    		});	
	        break;
        }
        $rootScope.$broadcast(_spk.chartsChange, chart);
        return source;
      }).catch(function(error) {
    	  errorService.showError(error);
      });
    }
    
    
    function repeatDeal(arr) {
		for(var i=0;i<arr.length;i++) {
			var a = 0;
			for(var j=i+1;j<arr.length;j++) {
				if(arr[i]===arr[j]) {
					a=a+1;
					arr[j]=arr[j]+'('+a+')';
				}
			}
		}
		return arr;
	}
  }

})();