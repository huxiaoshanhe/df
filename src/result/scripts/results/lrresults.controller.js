// 线性回归控制器
window.define(
[],
function () {
var partsMap = [
  {name: '变量说明', keys: ['varsProduce']},
  {name: '方程', keys: ['formula']},
  {name: '逐步回归分析', keys: ['lRStep']},
  {name: '模型汇总', keys: ['modelSummary']},
  {name: '模型系数', keys: ['lRModelCoefficient']},
  {name: '系数相关性',  keys: ['correlationCoefficients']}
];

var tHeadMap = {
  'modelSummary': [
    {'key': 'r', 'name': 'R'}, {'key': 'r2', 'name': 'R<sup>2</sup>'},
    {'key': 'adjR2', 'name': '调整R<sup>2</sup>'},
    {'key': 'stdErrorOfEst', 'name': '标准估计误差'},
    {'key': 'dwStats', 'name': 'D-W统计量'},
    {'key': 'rss', 'name': '回归平方和'},
    {'key': 'ess', 'name': '残差平方和'},
    {'key': 'fstatistics', 'name': 'F'}, {'key': 'sigFSta', 'name': 'Sig'}
  ],
  'lRModelCoefficient': [
    {'key': 'coefficentName', 'name': '&nbsp;'},
    {'key': '_',
      'name': '未标准化系数',
      'child': [
        {'key': 'coefficients', 'name': '系数'},
        {'key': 'stdDeviaModelCoe', 'name': '标准误差'}
    ]},
    {'key': '_', 'name': '标准化系数'},
    {'key': 'tstatistics', 'name': 't'},
    {'key': 'sigt', 'name': 'Sig.'},
    {'key': '_', 'name': '系数置信区间', 'child': [
      {'key': 'upperCoeff', 'name': '上限'},
      {'key': 'lowerCoeff', 'name': '下限'}
    ]},
    {'key': '_', 'name': '共线性统计量', 'child': [
      {'key': 'tolerance', 'name': '容差'},
      {'key': 'vif', 'name': 'VIF'}
    ]}
  ],
  'correlationCoefficients': [
    {'key': 'correlation', 'name': '相关性'},
    {'key': 'covariance', 'name': '协方差'}
  ]
};


  function lrResultsCtrl ($sce, $location, $routeParams, resultService, $timeout, $anchorScroll) {
    var that = this;
    that.isShare = true;
    that.textResult = null;
    that.share = function (id) { resultService.share('analysis_lr', id); };
    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    var parseMap = {
      'formula': 'string',
      'lRStep': function (obj) {

    	var table = document.createElement('table');
    	var tbody = document.createElement('tbody');
    	table.className = 'rtable';
    	
    	var aicTr = tbody.insertRow();
    	var array = obj.aic;
    	var cell = aicTr.insertCell();
		cell.innerHTML = 'AIC';

    	for (var i = 0, ilen = array.length; i < ilen; i++) {
    		cell = aicTr.insertCell();
    		cell.title = (array[i]);
    		cell.innerHTML = (array[i]).toFixed(3);
    	}

    	var varStepTr = tbody.insertRow();
    	array = obj.varStep;
    	cell = varStepTr.insertCell();
		cell.innerHTML = '逐步';
		
    	for (var i = 0, ilen = array.length; i < ilen; i++) {
    		cell = varStepTr.insertCell();
    		cell.title = (array[i]);
    		cell.innerHTML = (array[i]);
    	}
    	
    	table.appendChild(tbody);
    	
    	return $('<div>').append(table).html();
      },
      'varsProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          var after = i === 0?'<b>【因变量】</b>':'<b>【自变量】</b>';
          html += '<p style="margin: 0 0 5px 0">'+ after + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      },
      'modelSummary': function (oneRow) { // 普通单行
        var headMap = tHeadMap.modelSummary;
        var cellKeys = resultService.getCellKeys(headMap);

        var table = resultService.createTable(cellKeys, headMap, [oneRow]);
        
        var ts = table.rows[0].cells[1];
        return $('<div>').append(table).html();
      },
      'lRModelCoefficient': function (vdata) { // 向上合并表头
        var KV = resultService.parseVerticalData(vdata);
        var headMap = angular.copy(tHeadMap.lRModelCoefficient);
        if (KV.keys.indexOf('vif') === -1) {
          headMap.splice(6, 1); // ?X
        }
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        return $('<div>').append(table).html();
      },
      'correlationCoefficients': function (matrixMS) { // 矩阵表格
        var t = [matrixMS.correlation, matrixMS.covariance];
// console.info(matrixMS.indeptVarNames, t);
        var KV = resultService.parseMatrix(matrixMS.indeptVarNames, t);
        var axis = [''].concat(matrixMS.indeptVarNames);
        var headMap = resultService.fsHeadMapByArray(axis);
        var newHeadMap = tHeadMap.correlationCoefficients; // 真.
        var table = resultService.createTable(KV.keys, headMap, KV.matrix);
        resultService.appendMaxtrixY(table, t, newHeadMap);
        return $('<div>').append(table).html();
      }
    };

// window.jiathis_config = {url: location.href + '/share/' + $routeParams.id};
    // location.href + '/share/' + shareId
    if ($routeParams.action === 'share') {
      that.isShare = false;
      resultService.getBackstage($routeParams.id).then(function (source) {
        that.barChart = source.barChart; // ??
        that.lineChart = source.lineChart; // ??
that.textResult = resultService.parse(partsMap, parseMap, source.tables);
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_lr');
      that.shareId = source.shareId;
//console.info(source, that);
      that.barChart = source.barChart; // ??
      that.lineChart = source.lineChart; // ??
      that.textResult = resultService.parse(partsMap, parseMap, source.tables);
      // gaomao
      resultService.directory(source.itemInfos, source.shareId);
      resultService.share(location.href+'/share/'+that.shareId, '线性回归分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService', '$timeout', '$anchorScroll'];

  return lrResultsCtrl;
});