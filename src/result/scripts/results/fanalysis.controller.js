// 因子分析
window.define(
[],
function () {
var partsMap = [
  {name: '变量解释', keys: ['variableProduces']},
  {name: '模拟拟合度', keys: ['modelFit']},
  {name: '共因子方差', keys: ['commonFactorVariance']},
  {name: '残差', keys: ['residual']},
  {name: '因子信息', keys: ['factorInfo']},
  {name: '因子信息【旋转前】', keys: ['beforeRotateMatrix']},
  {name: '拟合度检验', keys: ['fitTest']},
  {name: '因子信息【旋转后】', keys: ['afterRotateMatrix']},
  {name: '因子得分系数', keys: ['scoreCoefficientMatrix']},
  {name: '因子得分协方差矩阵', keys: ['scoreCovarianceMatrix']}
];

var tHeadMap = {
	'factorInfo': [
     {'key': 'variableCodes', 'name': '成分'},
     {'key': '', 'name': '初始特征值', 'child': [
       {'key': 'initEigenTotal', 'name': '特征值'},
       {'key': 'initEigenVariancePercent', 'name': '方差%'},
       {'key': 'initEigenCumuPercent', 'name': '累积方差%'},
     ]},
     {'key': '', 'name': '提取特征值', 'child': [
       {'key': 'extractSquaresTotal', 'name': '特征值'},
       {'key': 'extractSquaresVariancePercent', 'name': '方差%'},
       {'key': 'extractSquaresCumuPercent', 'name': '累积方差%'}
     ]}
   ]
};



 function lrResultsCtrl ($sce, $location, $routeParams, resultService) {
    var that = this;
    that.isShare = true;
    that.textResult = null;
    that.share = function (id) {
      resultService.share('analysis_correlation', id);
    };
    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    var parseMap = {
      'variableProduces': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          var after = '';
          html += '<p style="margin: 0 0 5px 0">'+ after + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      },
      'modelFit': function (md) {
        var headMap = [{'key': 'fitOff', 'name': 'fit'}, {'key': 'fitValue', 'name': 'fitoff'}];
        var oneRow = [{'fitOff': md.fitOff, 'fitValue': md.fitValue}];
        var cellKeys = resultService.getCellKeys(headMap);
        var table = resultService.createTable(cellKeys, headMap, oneRow);
        return $('<div>').append(table).html();
      },
      'commonFactorVariance': function (c) {
        var KV = resultService.parseVerticalData(c);
        var headMap = [];
        var abc = 0;
        angular.forEach(c, function (item, i) {
          if (i === 'communalityExtract') {
            headMap.push({'key':'communalityExtract', 'name': '提取'});
          } else if (i === 'communalityInit') {
            headMap.push({'key':'communalityInit', 'name': '初始'});
          }else{
            headMap.push({'key':i, 'name': ''});
          }
          abc++;
        });
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        return $('<div>').append(table).html();
      },
      'residual': function (res) {
        var axis = [''].concat(res.variableCodes);
        var headMap = resultService.fsHeadMapByArray(axis);
        var KV = resultService.parseMatrix(res.variableCodes, [res.residual]);
        var table = resultService.createTable(KV.keys, headMap, KV.matrix);
        return $('<div>').append(table).html();
      },
      'factorInfo': function (fnm) {
        var headMap = angular.copy(tHeadMap.factorInfo);
        var KV = resultService.parseVerticalData(fnm);
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        return $('<div>').append(table).html();
      },
      'beforeRotateMatrix': function (bdata) {
var KV = resultService.parseMatrix(bdata.variableCodes, [bdata.loadingsBeforeRotate]);
        var headMap = [
          {'key': '', 'name': '&nbsp;'},
          {'key': '', 'name': '成分', 'child': []}
        ];
        for (var i = 0, ilen = bdata.components.length; i < ilen; i++) {
           headMap[1].child.push({'key':i, 'name':bdata.components[i]});
        }
        var keys = [0].concat(bdata.components);
        var table = resultService.createTable(keys, headMap, KV.matrix);
        return $('<div>').append(table).html();
      },
      'fitTest': function (md) {
        var headMap = [{'key': 'chiSquare', 'name': '卡方'}, {'key': 'df', 'name': 'df'}, {'key': 'sigValue', 'name': 'Sig.'}];
        var oneRow = [{'chiSquare': md.chiSquare, 'df': md.df, 'sigValue': md.sigValue}];
        var cellKeys = resultService.getCellKeys(headMap);
        var table = resultService.createTable(cellKeys, headMap, oneRow);
        return $('<div>').append(table).html();
      },
      'afterRotateMatrix': function (bdata) {
var KV = resultService.parseMatrix(bdata.variableCodes, [bdata.loadingsAfterRotate]);
var headMap = [
  {'key': '', 'name': '&nbsp;'},
  {'key': '', 'name': '成分', 'child': []}
];
for (var i = 0, ilen = bdata.components.length; i < ilen; i++) {
   headMap[1].child.push({'key':i, 'name':bdata.components[i]});
}
var keys = [0].concat(bdata.components);
var table = resultService.createTable(keys, headMap, KV.matrix);
return $('<div>').append(table).html();
      },
      'scoreCoefficientMatrix': function (data) {
var KV = resultService.parseMatrix(data.variableCodes, [data.factorScoreCoeffiMatrix]);
var headMap = [
  {'key': '', 'name': '&nbsp;'},
  {'key': '', 'name': '成分', 'child': []}
];
for (var i = 0, ilen = data.components.length; i < ilen; i++) {
   headMap[1].child.push({'key':i, 'name':data.components[i]});
}
var keys = [0].concat(data.components);
var table = resultService.createTable(keys, headMap, KV.matrix);
return $('<div>').append(table).html();
      },
      'scoreCovarianceMatrix': function (data) {
    	  var s = [];
    	  angular.forEach(data.components, function (val, i) {
    	    s.push(val);
    	  });
    	  var KV = resultService.parseMatrix(s, [data.factorScoreCovariance]);
    	  var headMap = [
    	    {'key': '', 'name': '成分'}
    	  ];
    	  for (var i = 0, ilen = data.components.length; i < ilen; i++) {
    	     headMap.push({'key': '', 'name': data.components[i]});
    	  }
    	          var table = resultService.createTable(KV.keys, headMap, KV.matrix);
    	          return $('<div>').append(table).html();
      }
    };
    

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        that.shareId = source.shareId;
        that.lineChart = source.lineChart;
        var textResult = resultService.parse(partsMap, parseMap, source.factorAnalysisBO);
        that.textResult = [];
        that.textResult[0] = textResult.splice(0, 5);
        that.textResult[1] = textResult;
        // gaomao
        resultService.directory();
      });
    } else {
      var source = resultService.get('analysis_fanalysis');
      that.shareId = source.shareId;
      that.lineChart = source.lineChart;
      var textResult = resultService.parse(partsMap, parseMap, source.factorAnalysisBO);
      that.textResult = [];
      that.textResult[0] = textResult.splice(0, 5);
      that.textResult[1] = textResult;
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '因子分析分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];


  return lrResultsCtrl;
});