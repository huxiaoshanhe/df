(function() {
  'use strict';
  // 表服务, 维护选中表操作.

  angular
    .module('pf.sheet')
    .factory('sheetService', sheetService);

  sheetService.$inject = [
    '$rootScope',
    'sheetFactory',
    'tableFactory',
    'conditionService',
    'userService',
    'dataService',
    'coreCF',
    'ngDialog',
    'errorService'];

  function sheetService($rootScope, sheetFactory, tableFactory, conditionService, userService, dataService, config, ngDialog, errorService) {
    var _spk = config.spreadKey;
    var _sheet = null; // 维护的表
    var service = {
      'update': sheetChange,
      'setRecord': setRecord,
      'getRecord': function(key){ return getRecord(_sheet.id)[key]; },
      'getSheetId': function() { return _sheet.id; },
      'tableSort': tableSort,
      'tableTotal': tableTotal,
      'clearTable':clearTable,
      'closeSheet': closeSheet,
      'timeTotal': timeTotal,
      'missvalue': missvalue,
      'clear': clear,
      'aggregation': aggregation,
      'aggregationGo': aggregationGo,
      'regression': regression,
      'curvefit': curvefit,
      'leastSquares': leastSquares,
      'bivar': bivar,
      'partial':partial,
      'autocorre':autocorre,
      'hpfilter': hpfilter,
      'expsmooth':expsmooth,
      'arima':arima,
      'preAnalysis':preAnalysis,
      'pcanalysis':pcanalysis,
      'factorAnalysis':factorAnalysis,
      'calculator':calculator
    };
    return service;

    /**
     * 表变更方法, 通过此方法改变内部维护表
     * @param  {Sheet} sheet 传入的表
     * @return {Sheet} 内部维护的表
     */
    function sheetChange(sheet) {
      _sheet = sheet;
      $rootScope.$broadcast(_spk.sheetChange, _sheet);
      // 联动更新条件容器
      conditionService.update(_sheet.condition);
      return _sheet;
    }

    /**
     * 对表类关闭表的接口
     * @param  {String} id 预删除表的id
     * @return {Promise}
     */
    function closeSheet(id) {
      return sheetFactory.rqClose(id);
    }

    /**
     * 以表为单位记录数据.
     * @param {String} key 哪
     * @param {Object} value 吒
     */
    function setRecord(key, value) {
      var sRecord = getRecord(_sheet.id);
      sRecord[key] = value;
      userService.setRecord(_sheet.id, sRecord);
      return getRecord(_sheet.id)[key];
    }

    /**
     * 返回表记录根据id, 实际存在用户上
     * @param  {String} sheetId 表id
     * @return {Object} 表记录|空对象
     */
    function getRecord(sheetId) {
      var sRecord = userService.getRecord(sheetId);
      return sRecord || {};
    }

    /**
     * 表格数值合计
     * @param  {Stirng} type 方向
     * @param  {Stirng} method 方法
     * @return {Promise}
     */
    function tableTotal(type, method) {
    	var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
    	var sheetId = _sheet.id;
	      return tableFactory.total(sheetId, type, method).then(function(table) {
	    	  table.fixedRowsTop=fixedRowsTop;
	    	  table.fixedColumnsLeft=fixedColumnsLeft;
	    	  _sheet.setTable(table); // 更新表, 关于新增值的变更
	      });     
    }
    
    function clearTable(type,method) {
		var action='clear',sheetId=_sheet.id;
		if(method=='columns') {
			var leixing = 'calcCols';
		} else if(method=='rows') {
			var leixing = 'calcRows';
		}
		var params = {
	  			  'action' : action,
	  			  'sheetId' :sheetId,
	  			  'type' : leixing,
	  			  'method':type
	  		}
		
		var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
		
  		return dataService.get('refresh',params).then(function(source) {
  			var result = tableFactory.parse(source);	 
  			return result;
   	    }).catch(function(error) {
 	    	alert(error);
 	    }).then(function(table) {
 	    	table.fixedRowsTop=fixedRowsTop;
	    	table.fixedColumnsLeft=fixedColumnsLeft;
   	    	 _sheet.setTable(table);
   	    });
    }
    
    /**
     * 分析预测 变量处理
     * @param action
     * @param method
     * @param area 区域坐标
     * @param sheetId
     * @param other
     * @returns
     */
    function timeTotal(action,method,area,sheetId,other) {
		var p1 = area[0]+','+area[1];
		var p2 = area[2]+','+area[3];
		var params = {
			  'action' : action,
			  'method' : method,
			  'sheetId' :sheetId,
			  'p1' : p1,
			  'p2' : p2
		}
		if(other!=null) {
			if(params.action=='diff') {
				params.difforder=other;
			} else if(params.action=='lead') {
				params.lead=other;
			} else if(params.action=='lag') {
				params.lag=other;
			}			
		}
		
		var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
    	
		return dataService.get('timeseries',params).then(function(source) {
			var result = tableFactory.parse(source);
			return result;
 	    }).then(function(table) {
 	    	table.fixedRowsTop=fixedRowsTop;
	    	table.fixedColumnsLeft=fixedColumnsLeft;
 	    	 _sheet.setTable(table);
 	    });
	}
    
    /**
     * 分析预测 缺省值处理
     * @param action
     * @param sheetId
     * @returns
     */
    function missvalue(action,sheetId,area,n) {
    	var p1 = area[0]+','+area[1];
		var p2 = area[2]+','+area[3];
		var params = {
			  'action' : action,
			  'sheetId' :sheetId,
			  'p1' : p1,
			  'p2' : p2
		}
		if(n!==null) {
			params.n=n;
		}
		
		var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
		
		return dataService.get('missvalue',params).then(function(source) {
			var result = tableFactory.parse(source);	 
			return result;
 	    }).then(function(table) {
 	    	table.fixedRowsTop=fixedRowsTop;
	    	table.fixedColumnsLeft=fixedColumnsLeft;
 	    	_sheet.setTable(table);
 	    });
	}
    
    /**
     * 弹出频度选择框
     */
    function aggregation(params) {
    	 $rootScope.$broadcast('isAggregation',params);
    }
    /**
     * 执行时间聚合
     * @param method
     * @param sheetId
     * @param area 坐标
     * @param freq 频度
     * @returns
     */
    function aggregationGo(method, sheetId, area, freq) {
    	var params = {
  			  'method' : method,
  			  'sheetId': sheetId,
  			  'p1'     : area[0]+','+area[1],
  			  'p2'     : area[2]+','+area[3],
  			  'freq'    : freq
  		}
    	
    	var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
    	
  		return dataService.get('aggregation',params).then(function(source) {
  			var result = tableFactory.parse(source);	 
  			return result;
   	    }).catch(function(error) {
 	    	//alert(error);
 	    }).then(function(table) {
 	    	table.fixedRowsTop=fixedRowsTop;
	    	table.fixedColumnsLeft=fixedColumnsLeft;
   	    	 _sheet.setTable(table);
   	    });
    }
    
    /**
     * 线性回归分析
     */
    function regression(params) {
      $rootScope.$broadcast('isShowRegression',params);
    }
    
    /**
     * 曲线估计
     */
    function curvefit(params) {
      $rootScope.$broadcast('isCurvefit',params);
    }
    
    /**
     * 二阶段最小二乘法
     */
    function leastSquares(params) {
      $rootScope.$broadcast('isLeastsquares',params);
    }
    
    /**
     * 双变量
     */
    function bivar(params) {
    	$rootScope.$broadcast('isBivar',params);
    }
    
    /**
     * 偏相关
     */
    function partial(params) {
      $rootScope.$broadcast('isPartial',params);
    }
    
    /**
     * 自相关分析
     */
    function autocorre(params) {
    	$rootScope.$broadcast('isAutocorre',params);
    }
    
    /**
     * HP滤波
     */
    function hpfilter(params) {
      $rootScope.$broadcast('isHpfilter',params);
    }
    
    /**
     * 指数平滑
     */
    function expsmooth(params) {
      $rootScope.$broadcast('isExpsmooth',params);
    }
    
    /**
     * ARIMA
     */
    function arima(params) {
      $rootScope.$broadcast('isArima',params);
    }     
    
    /**
     * 预分析
     */
    function preAnalysis(params) {
    	$rootScope.$broadcast('isPreAnalysis',params);
    }     
    
    /**
     * 主成分分析
     */
    function pcanalysis(params) {
      $rootScope.$broadcast('isPcanalysis',params);
    }     
    
    /**
     * 因子分析
     */
    function factorAnalysis(params) {
    	$rootScope.$broadcast('isFactorAnalysis',params);
    }     
    
    /**
     * 清楚数据分析变量处理结果
     * @param action
     * @param sheetId
     * @param type
     * @returns
     */
    function clear(action,sheetId,type) {
    	var params = {
  			  'action' : action,
  			  'sheetId' :sheetId,
  			  'type' : type
  		}
      if(type==='computer') {
        params.method='computer';
      }
    	
    	var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
	    	
  		return dataService.get('refresh',params).then(function(source) {
  			var result = tableFactory.parse(source);	 
  			return result;
   	    }).catch(function(error) {
 	    	alert(error);
 	    }).then(function(table) {
 	    	table.fixedRowsTop=fixedRowsTop;
	    	table.fixedColumnsLeft=fixedColumnsLeft;
   	    	 _sheet.setTable(table);
   	    });
    }
    
    
    /**
     * 高级计算器计算
     * @param action 请求方法
     * @param params 参数
     */
    function calculator(action,params) {
    	var gundam = conditionService.getGundam();
    	var fixedRowsTop = gundam.metaRow.length;
    	var fixedColumnsLeft = gundam.metaColumn.length;
    	return dataService.get(action,params).then(function(source) {
  			var result = tableFactory.parse(source);	 
  			return result;
   	    }).catch(function(error) {
 	    	alert(error);
 	    }).then(function(table) {
 	    	table.fixedRowsTop=fixedRowsTop;
	    	table.fixedColumnsLeft=fixedColumnsLeft;
   	    	 _sheet.setTable(table);
   	    });
    }    
    
    

    /**
     * 表格数值排序
     * @param  {[type]} type  [description]
     * @param  {[type]} order [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    function tableSort(type, order, index) {
      var sheetId = _sheet.id;
      return tableFactory.sort(sheetId, type, order, index).then(function(table) {
        // 后台只提供了数据, 所以这块的更新要注意
        _sheet.setTable(table);
      });
    }
  }

})();