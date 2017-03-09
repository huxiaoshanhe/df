// 二阶段最小二乘
window.define(
[],
function () {
var partsMap = [
  {name: '变量解释', keys: ['varsProduce']},
  {name: '模型汇总', keys: ['modelSummary']},
  {name: '方差分析表', keys: ['varianceAnalysis']},
  {name: '系数', keys: ['coefficients']}
];

var tHeadMap = {
  'modelSummary': [
    {'key': 'r', 'name': 'R'}, {'key': 'r2', 'name': 'R<sup>2</sup>'},
    {'key': 'adjR2', 'name': '调整R<sup>2</sup>'},
    {'key': 'stdErrorOfEst', 'name': '标准估计误差'}
  ],
  'varianceAnalysis': [
    {'key': 'squaresAnd', 'name': '平方和'},
    {'key': 'df', 'name': 'df'},
    {'key': 'meanSquare', 'name': '均方'},
    {'key': 'f', 'name': 'F'},
    {'key': 'sig', 'name': 'Sig.'},
  ],
  'coefficients': [
    {'key': 'coefficentName', 'name': '&nbsp;'},
    {'key': '_',
      'name': '未标准化系数',
      'child': [
        {'key': 'coefficients', 'name': '系数'},
        {'key': 'stdDeviaModelCoe', 'name': '标准误差'}
    ]},
    {'key': '_', 'name': '标准化系数'},
    {'key': 'tstatistics', 'name': 't'},
    {'key': 'sigt', 'name': 'Sig.'}
  ]
};


  function lrResultsCtrl ($sce, $location, $routeParams, resultService) {
    var that = this;
    that.isShare = true;
    that.textResult = null;
    that.share = function (id) { resultService.share('analysis_lr', id); };
    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    var parseMap = {
      'varsProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          if(i===0) {
        	  after='<b>【因变量】</b>';
          } else if(i===1) {
        	  after='<b>【解释变量】</b>';
          } else if(i===2) {
        	  after='<b>【工具变量】</b>';
          }
          html += '<p style="margin: 0 0 5px 0">' + after + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      },
      'modelSummary': function (oneRow) { // 普通单行
        var headMap = tHeadMap.modelSummary;
        var cellKeys = resultService.getCellKeys(headMap);
        var table = resultService.createTable(cellKeys, headMap, [oneRow]);
        return $('<div>').append(table).html();
      },
      'varianceAnalysis': function (vsour) {
        var headMap = tHeadMap.varianceAnalysis;
        var keys = ['squaresAnd', 'df', 'meanSquare', 'f', 'sig'];
        var data = [{
          'squaresAnd': vsour.rss, 'df': vsour.rssDF,
          'meanSquare': vsour.rssMeanSq, 'f': vsour.fstats,
          'sig': vsour.sigFStats
        }, {
          'squaresAnd': vsour.ess, 'df': vsour.essDF,
          'meanSquare': vsour.essMeanSq
        }, { 'squaresAnd': vsour.tss, 'df': vsour.tssDF }];
        var table = resultService.createTable(keys, headMap, data);
        resultService.appendMaxtrixY(table, [['hg'], ['cc'], ['zj']], [
          {'key': 'hg', 'name': '回归'}, {'key': 'cc', 'name': '残差'}, {'key': 'zj', 'name': '总计'}]);
        return $('<div>').append(table).html();
      },
      'coefficients': function (vdata) { // 矩阵
        var KV = resultService.parseVerticalData(vdata);
        var headMap = angular.copy(tHeadMap.coefficients);
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        return $('<div>').append(table).html();
      },
    };

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
      var source = resultService.get('analysis_leastSquares');
      that.shareId = source.shareId;
      that.textResult = resultService.parse(partsMap, parseMap, source.tables);
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '二阶段最小二乘分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  return lrResultsCtrl;
});