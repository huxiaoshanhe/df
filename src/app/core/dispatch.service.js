(function() {
  'use strict';
  // 调度服务

  angular
    .module('pf.core')
    .factory('dispatchService', dispatchService);

  dispatchService.$inject = [
    '$rootScope',
    'workbookService',
    'sheetService',
    'indicatorService',
    'containerService',
    'handsontableService',
    'databaseService',
    'chartService',
    'errorService'];

  function dispatchService($rootScope, workbookService, sheetService, indicatorService, containerService, handsontableService, databaseService, chartService, errorService) {
    var service = {
      'execution': execution,
      'getCoolMenu': function(){ return menuData; },
    };
    return service;

    /**
     * 具体调度的执行方法
     * @param  {Stirng} key 最深方法名
     * @param  {Stirng} keys 一次向上的方法名
     */
    function execution(key, keys) {
      if (!keys.length) { return; } // 根

      var fstr = keys.join('-');
      //console.info(key, keys);
      // 点击判断
      switch(key) {
      	case 'openDB': databaseService.mycollection(); break;
        case 'mydb': databaseService.open(); break;
        case 'save': databaseService.save(); break;
        case 'close': workbookService.remoceNowSheet(); break;
        case 'newSheet': indicatorService.showSearchWin(); break;
        case 'download': databaseService.download(); break;
        case 'addIndicator':indicatorService.addIndicator();break;
        case 'addIn': indicatorService.openModel('syncWorkBook'); break;
        default: break;
      }

      // 父判断
      switch(fstr) {
        case 'rows-table':
        case 'columns-table':
          sheetService.tableTotal(keys[0], key);
          break;
        case 'chart':
        	if(key==='Scatter') {
        		var sheetId = sheetService.getSheetId();
            	$rootScope.charts = {'sheetId':sheetId};
            	chartService.scatter();
            	containerService.switchRow('r1', true);
        	} else {
        		containerService.switchRow('r1', true);
                sheetService.setRecord('chartRow', true);
                chartService.getCharts(key);
        	}          
          break;
        case 'map':
            chartService.getMaps();
            break;
        case 'hd-styles':
          var srtr = key.split(':'), style = {}
          style[srtr[0]] = srtr[1];
          handsontableService.addSelectedAreaStyle(style);
          break;
        case 'hd-move': handsontableService.adjustFloatSize(key); break;
        case 'hd-calc':
          var srtr = key.split(':'), calc = {}
          calc[srtr[0]] = (srtr[1] === 'true');
          handsontableService.addSelectedAreaCalc(calc);
          break;
        case 'gr-timeseries-xxx'://增长率          
          var srtr = key.split(':'),action='gr';
          var sheetId = sheetService.getSheetId();
          var area = handsontableService.getSelected();
          if(area==undefined) {
        	  errorService.showError('请选择一片区域');
        	  return false;
          }
          sheetService.timeTotal(action,srtr,area,sheetId,null);
          break;
        case 'diff-timeseries-xxx'://差分        	
            var srtr = key.split(':'),action='diff';
            var sheetId = sheetService.getSheetId();
            var area = handsontableService.getSelected();
            if(area==undefined) {
            	errorService.showError('请选择一片区域');
          	  return false;
            }
            if(srtr=='difforder') {
            	var difforder=prompt('请输入差分步数','请输入');
            	sheetService.timeTotal(action,action,area,sheetId,difforder);
            }else {
            	sheetService.timeTotal(action,srtr,area,sheetId,null);
            }
            break;
        case 'dlog-timeseries-xxx'://对数
        	var action='logarithm';
            var sheetId = sheetService.getSheetId();
            var area = handsontableService.getSelected();
            if(area==undefined) {
            	errorService.showError('请选择一片区域');
          	  return false;
            }
            if(key=='log') {
            	var srtr = 'log_10_';
            } else if(key=='ln') {
            	var srtr = 'ln_';
            }
            sheetService.timeTotal(action,srtr,area,sheetId,null);
        	break;
        case 'sstd-timeseries-xxx'://标准化
        	if(key=='std') {
        		var action=key,method=key;
                var sheetId = sheetService.getSheetId();
                var area = handsontableService.getSelected();
                if(area==undefined) {
                	errorService.showError('请选择一片区域');
              	  return false;
                }
            	sheetService.timeTotal(action,method,area,sheetId,null);
        	}else if(key=='0_1_std') {
        		var action='std',method='0_1_std';
                var sheetId = sheetService.getSheetId();
                var area = handsontableService.getSelected();
                if(area==undefined) {
                	errorService.showError('请选择一片区域');
              	  return false;
                }
            	sheetService.timeTotal(action,method,area,sheetId,null);
        	}
        case 'timeseries-xxx':
        	if(key=='lead') {//先行函数
        		var action=key,method=key;
                var sheetId = sheetService.getSheetId();
                var area = handsontableService.getSelected();
                if(area==undefined) {
                	errorService.showError('请选择一片区域');
              	  return false;
                }
                var leadorder=prompt('请输入先行阶数','请输入');
            	sheetService.timeTotal(action,method,area,sheetId,leadorder);
        	}else if(key=='lag') {//滞后函数
        		var action=key,method=key;
                var sheetId = sheetService.getSheetId();
                var area = handsontableService.getSelected();
                if(area==undefined) {
                	errorService.showError('请选择一片区域');
              	  return false;
                }
                var leadorder=prompt('请输入滞后阶数','请输入');
            	sheetService.timeTotal(action,method,area,sheetId,leadorder);
        	}else if(key=='exp') {//指数计算
        		var action='exponential',method=key;
                var sheetId = sheetService.getSheetId();
                var area = handsontableService.getSelected();
                if(area==undefined) {
                	errorService.showError('请选择一片区域');
              	  return false;
                }
            	sheetService.timeTotal(action,method,area,sheetId,null);
        	} else if(key=='clear') {
        		var sheetId = sheetService.getSheetId();
        		var action=key,type='trans';
        		sheetService.clear(action,sheetId,type);
        	}
            break;
        case 'dlog-timeseries-xxx'://自然对数差分
        	var method = key.split(':'),action='dlog';
        	var sheetId = sheetService.getSheetId();
            var area = handsontableService.getSelected();
            if(area==undefined) {
            	errorService.showError('请选择一片区域');
          	  return false;
            }
            sheetService.timeTotal(action,method,area,sheetId,null);
            break;
        case 'ratio-timeseries-xxx'://发展速度
        	var method = key.split(':'),action='ratio';
        	var sheetId = sheetService.getSheetId();
            var area = handsontableService.getSelected();
            if(area==undefined) {
            	errorService.showError('请选择一片区域');
          	  return false;
            }
            sheetService.timeTotal(action,method,area,sheetId,null);
        case 'cumu-timeseries-xxx'://累计分析
            var srtr = key.split(':'),action='cumu';
            var sheetId = sheetService.getSheetId();
            var area = handsontableService.getSelected();
            if(area==undefined) {
            	errorService.showError('请选择一片区域');
          	  return false;
            }
            sheetService.timeTotal(action,srtr,area,sheetId);
            break;
        case 'missvalue-xxx'://缺省值处理
          if(key==='delete'){
            var sheetId = sheetService.getSheetId();
            var action='clear',type='trans';
            sheetService.clear(action,sheetId,type);
          }else if(key==='nmean'||key==='nmedian') {
              var action = key.split(':');
              var sheetId = sheetService.getSheetId();
              var area = handsontableService.getSelected();
              if(area==undefined) {
                  errorService.showError('请选择一片区域');
                  return false;
              }
        		  var n=prompt('请输入相邻数N','请输入');
        		  sheetService.missvalue(action,sheetId,area,n);
        	} else {
              var action = key.split(':');
              var sheetId = sheetService.getSheetId();
              var area = handsontableService.getSelected();
              if(area==undefined) {
                  errorService.showError('请选择一片区域');
                  return false;
              }       		
            	sheetService.missvalue(action,sheetId,area,null);
        	}        	
        	break;
        case 'aggregation-xxx':
          var sheetId = sheetService.getSheetId();
          var area = handsontableService.getSelected();
          if(area==undefined) {
              errorService.showError('请选择一片区域');
              return false;
          }  
        	if(key!=='clear') {
            	sheetService.aggregation({'method':key,'sheetId':sheetId,'area':area});
        	} else {
        		var action=key,type='aggregation';
        		sheetService.clear(action,sheetId,type);
        	}        	
        	break;
        case 'lr-return-xxx':
          var action='regression',sheetId = sheetService.getSheetId();
        	if(key==='lr') {//回归分析
        		sheetService.regression({action:action,sheetId:sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,'lr');
          }
          break;
        case 'curvefit-return-xxx':
          var action='curvefit',sheetId = sheetService.getSheetId();
          if(key==='curvefit') {//曲线估计
        		sheetService.curvefit({action:action,sheetId:sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,'curvefit');
          }
          break;
          case 'leastSquares-return-xxx':
          var action='leastSquares',sheetId = sheetService.getSheetId();
          if(key==='leastSquares') {//二阶段最小二乘法
        		sheetService.leastSquares({action:action,sheetId:sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,'ls');
          }
        	break;
        case 'correlation-xxx':
        	if(key==='bivar') {//双变量
        		var action='correlation',sheetId = sheetService.getSheetId();
        		sheetService.bivar({'action' : action,'sheetId': sheetId});
        	} else if(key==='partial') {//偏相关
        		var action='correlation',sheetId = sheetService.getSheetId();
        		sheetService.partial({'action' : action,'sheetId': sheetId});
        	}
        	break;
        case 'timeanalysis-xxx':
          if(key==='autocorre') {//自相关分析
        		var action='expsmooth',sheetId = sheetService.getSheetId();
        		sheetService.autocorre({'action' : action,'sheetId': sheetId});
        	}
          break;
        case 'hpfilter-timeanalysis-xxx':
          var action='hpfilter',sheetId = sheetService.getSheetId(); 
          if(key==='hpfilter') {//hp滤波分析
        		sheetService.hpfilter({'action' : action,'sheetId': sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,action);
          }
          break;
        case 'expsmooth-timeanalysis-xxx':
          var action='expsmooth',sheetId = sheetService.getSheetId();
          if(key==='expsmooth') {//平滑指数
        		sheetService.expsmooth({'action' : action,'sheetId': sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,action);
          }
          break;
        case 'arima-timeanalysis-xxx':
          var action='arima',sheetId = sheetService.getSheetId();
          if(key==='arima') {//arima
        		sheetService.arima({'action' : action,'sheetId': sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,action);
          }
        	break;
        case 'pcfAnalysis-xxx':
        	if(key==='preAnalysis') {//预分析
        		var action='preAnalysis',sheetId = sheetService.getSheetId();
        		sheetService.preAnalysis({'action' : action,'sheetId': sheetId});
        	}
          break;
        case 'pcanalysis-pcfAnalysis-xxx':
          var action='pca',sheetId = sheetService.getSheetId();
          if(key==='pcanalysis') {//主成分分析
        		sheetService.pcanalysis({'action' : action,'sheetId': sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,action);
          }
          break;
        case 'factorAnalysis-pcfAnalysis-xxx':
          var action='factorAnalysis',sheetId = sheetService.getSheetId();
          if(key==='factorAnalysis') {//因子分析
        		sheetService.factorAnalysis({'action' : action,'sheetId': sheetId});
        	} else if(key==='delete') {
            sheetService.clear('clear',sheetId,'fa');
          }
        	break;
        default: break;
      }
    }
  }

  // 菜单数据
  var menuData = [
    {'key': 'file', 'text': '文件', 'childs': [
      {'key':'newSheet', 'text': '添加工作表'},
      {'type': 'line'},
      {'key':'openDB', 'text': '打开数据'},
      {'key':'addIndicator', 'text': '添加指标'},
      {'type': 'line'},
      {'key':'save', 'text': '保存'},
      {'key':'download', 'text': '下载'},
      {'type': 'line'},
      {'key':'close', 'text': '关闭'}
    ]},
    {'key':'table', 'text': '表格', 'childs': [
      {'key':'rows', 'text': '行合计', 'childs': [
        {'key':'sum', 'text': '总和', 'clear':true},
        {'key':'mean', 'text': '均值', 'clear':true},
        {'key':'max', 'text': '最大值', 'clear':true},
        {'key':'min', 'text': '最小值', 'clear':true},
        {'type': 'line'},
        {'key':'nonempty', 'text': '非空数目', 'clear':true},
        {'key':'empty', 'text': '空数目', 'clear':true},
        {'key':'mode', 'text': '众数', 'clear':true},
        {'key':'median', 'text': '中位数', 'clear':true},
        {'key':'variance', 'text': '方差', 'clear':true},
        {'key':'cv', 'text': '变异系数', 'clear':true},
        {'key':'sd', 'text': '标准差', 'clear':true},
        {'key':'skewness', 'text': '偏度', 'clear':true},
        {'key':'kurtosis', 'text': '峰度', 'clear':true},
        {'key':'range', 'text': '极差', 'clear':true},
        {'key':'squares', 'text': '平方和', 'clear':true},
        {'type': 'line'},
        {'key':'upperdecile', 'text': '上十分位', 'clear':true},
        {'key':'lowerdecile', 'text': '下十分位', 'clear':true},
        {'key':'upperquartile', 'text': '上四分位', 'clear':true},
        {'key':'lowerquartile', 'text': '下四分位', 'clear':true}
      ]},
      {'key':'columns', 'text': '列合计', 'childs': [
        {'key':'sum', 'text': '总和', 'clear':true},
        {'key':'mean', 'text': '均值', 'clear':true},
        {'key':'max', 'text': '最大值', 'clear':true},
        {'key':'min', 'text': '最小值', 'clear':true},
        {'type': 'line'},
        {'key':'nonempty', 'text': '非空数目', 'clear':true},
        {'key':'empty', 'text': '空数目', 'clear':true},
        {'key':'mode', 'text': '众数', 'clear':true},
        {'key':'median', 'text': '中位数', 'clear':true},
        {'key':'variance', 'text': '方差', 'clear':true},
        {'key':'cv', 'text': '变异系数', 'clear':true},
        {'key':'sd', 'text': '标准差', 'clear':true},
        {'key':'skewness', 'text': '偏度', 'clear':true},
        {'key':'kurtosis', 'text': '峰度', 'clear':true},
        {'key':'range', 'text': '极差', 'clear':true},
        {'key':'squares', 'text': '平方和', 'clear':true},
        {'type': 'line'},
        {'key':'upperdecile', 'text': '上十分位', 'clear':true},
        {'key':'lowerdecile', 'text': '下十分位', 'clear':true},
        {'key':'upperquartile', 'text': '上四分位', 'clear':true},
        {'key':'lowerquartile', 'text': '下四分位', 'clear':true}
      ]}
    ]},
    {'key': 'chart', 'text': '图表', 'childs': [
      {'key': 'Line', 'text': '折线图'},
      {'key': 'StackLine', 'text': '堆积折线图'},
      {'key': 'Area', 'text': '面积图'},
      {'key': 'StackArea', 'text': '堆积面积图'},
      {'type': 'line'},
      {'key': 'Bar', 'text': '柱形图'},
      {'key': 'StackBar', 'text': '堆积柱形图'},
      {'key': 'RotateBar', 'text': '条形图'},
      {'key': 'StackRotateBar', 'text': '堆积条形图'},
      {'type': 'line'},
      {'key': 'Pie', 'text': '饼图'},
      {'key': 'Ring', 'text': '环形图'},
      {'type': 'line'},
      {'key': 'Radar', 'text': '雷达图'},
      {'key': 'FillRadar', 'text': '填充雷达图'},
      {'type': 'line'},
      {'key': 'Scatter', 'text': '散点图'}
    ]},
    {'key': 'map', 'text': '地图', 'childs': [
      {'key': 'hmap', 'text': '绘制地图'}
    ]},
    {'key': 'xxx', 'text': '分析预测', 'childs': [
      {'key':'timeseries', 'text': '变量处理', 'childs': [
        {'key': 'clear', 'text': '清除结果'},
        {'key': 'lead', 'text': '先行函数'},
        {'key': 'lag', 'text': '滞后函数'},
        {'key': 'exp', 'text': '指数函数'},
        {'key': 'gr', 'text': '增长率', 'childs': [
          {'key': 'grytd', 'text': '年比增长'},
          {'key': 'grpop', 'text': '环比增长'},
          {'key': 'gryoy', 'text': '同比增长'}
        ]},
        {'key': 'diff', 'text': '差分', 'childs': [
          {'key': 'difforder', 'text': '差分'},
          {'key': 'diffytd', 'text': '年比差分'},
          {'key': 'diffpop', 'text': '环比差分'},
          {'key': 'diffyoy', 'text': '同比差分'}
        ]},
        {'key': 'dlog', 'text': '对数计算', 'childs': [
         {'key': 'log', 'text': '以10为底计算'},
         {'key': 'ln', 'text': '以e为底计算'}
       ]},
        {'key': 'ratio', 'text': '发展速度', 'childs': [
          {'key': 'ratiopop', 'text': '环比发展速度'},
          {'key': 'ratioyoy', 'text': '同比发展速度'},
          {'key': 'ratioytd', 'text': '年比发展速度'}
        ]},
        {'key':'cumu', 'text': '累积方法', 'childs': [
            {'key': 'cumumin', 'text': '累积最小值'},
          {'key': 'cumumax', 'text': '累积最大值'},
          {'key': 'cumuavg', 'text': '累积平均值'},
          {'key': 'cumustd', 'text': '累积标准差'},
          {'key': 'cumusum', 'text': '累积求和'},
          {'key': 'cumumult', 'text': '累积乘积'},
        ]},
        {'key': 'sstd', 'text': '标准化','childs':[
          {'key':'std','text':'标准化'},
          {'key':'0_1_std','text':'离差标准化'}
        ]},
      ]},
      {'key': 'missvalue', 'text': '缺省值处理', 'childs': [
        {'key': 'delete', 'text': '清除结果'},
        {'key': 'avg', 'text': '序列均值'},
        {'key': 'cis', 'text': '三次样条内差'},
        {'key': 'geo', 'text': '几何插补'},
        {'key': 'li', 'text': '线性插值'},
        {'key': 'lt', 'text': '线性趋势'},
        {'key': 'lv', 'text': '前一个值'},
        {'key': 'nv', 'text': '后一个值'},
        //{'key': 'lgr', 'text': '前N个增长率'},
        //{'key': 'ngr', 'text': '后N个增长率'},
        {'key': 'nmean', 'text': '相邻N点均值'},
        {'key': 'nmedian', 'text': '相邻N点中位数'},
        {'key': 'random', 'text': '随机值'}
      ]},
      {'key': 'aggregation', 'text': '时间聚合', 'childs': [
        {'key': 'clear', 'text': '清除结果'},
        {'key': 'MAX_AGGRE', 'text': '最大值聚合'},
        {'key': 'MIN_AGGRE', 'text': '最小值聚合'},
        {'key': 'FIR_AGGRE', 'text': '首元素聚合'},
        {'key': 'LAST_AGGRE', 'text': '末元素聚合'},
        {'key': 'MEAN_AGGRE', 'text': '平均值聚合'},
        {'key': 'STD_AGGRE', 'text': '标准差'},
        {'key': 'SUM_AGGRE', 'text': '求和'}
      ]},
      {'key': 'return', 'text': '回归', 'childs': [
        {'key': 'lr', 'text': '线性回归','childs':[
          {'key':'lr','text':'分析'},
          {'key':'delete','text':'清除结果'}
        ]},
        {'key': 'curvefit', 'text': '曲线估计','childs':[
          {'key':'curvefit','text':'分析'},
          {'key':'delete','text':'清除结果'}
        ]},
        {'key': 'leastSquares', 'text': '二阶段最小二乘','childs':[
          {'key':'leastSquares','text':'分析'},
          {'key':'delete','text':'清除结果'}
        ]}
      ]},
      {'key': 'correlation', 'text': '相关性分析', 'childs': [
        {'key': 'bivar', 'text': '双变量'},
        {'key': 'partial', 'text': '偏相关'}
      ]},
      {'key': 'timeanalysis', 'text': '时间序列分析', 'childs': [
        {'key': 'autocorre', 'text': '自相关分析'},
        {'key': 'hpfilter', 'text': 'H-P滤波','childs':[
          {'key': 'hpfilter', 'text': '分析'},
          {'key': 'delete', 'text': '清除结果'}
        ]},
        {'key': 'expsmooth', 'text': '指数平滑','childs':[
          {'key': 'expsmooth', 'text': '分析'},
          {'key': 'delete', 'text': '清除结果'}
        ]},
        {'key': 'arima', 'text': 'ARIMA','childs':[
          {'key': 'arima', 'text': '分析'},
          {'key': 'delete', 'text': '清除结果'}
        ]},
      ]},
      {'key': 'pcfAnalysis', 'text': '主成分/因子分析', 'childs': [
        {'key': 'preAnalysis', 'text': '预分析'},
        {'key': 'pcanalysis', 'text': '主成分分析','childs':[
          {'key': 'pcanalysis', 'text': '分析'},
          {'key': 'delete', 'text': '清除结果'}
        ]},
        {'key': 'factorAnalysis', 'text': '因子分析','childs':[
          {'key': 'factorAnalysis', 'text': '分析'},
          {'key': 'delete', 'text': '清除结果'}
        ]}
      ]}
    ]}
  ];

})();