// 曲线估计控制器
window.define(
[],
function () {
var partsMap = [

];

var tHeadMap = {
  'modelSummary': [
    {'key': 'r', 'name': 'R'}, {'key': 'r2', 'name': 'R<sup>2</sup>'},
    {'key': 'adjR2', 'name': '调整R<sup>2</sup>'},
    {'key': 'stdErrorOfEst', 'name': '标准估计误差'}
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
  ],
  'varianceAnalysis': [
    {'key': 'squaresAnd', 'name': '平方和'},
    {'key': 'df', 'name': 'df'},
    {'key': 'meanSquare', 'name': '均方'},
    {'key': 'f', 'name': 'F'},
    {'key': 'sig', 'name': 'Sig.'},
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
      'formula': function (c) {
        return '<div style="margin-bottom: 5px;">方程:</div>' + c;
      },
      'varsProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          var after = i === 0?'<b>【因变量】</b>':'<b>【自变量】</b>';
          html += '<p style="margin: 0 0 5px 0">'+ after + indic.key + '：' + indic.value + '</p>';
        });
        return '<div style="margin-bottom: 5px;">变量说明:</div>' + html;
      },
      'modelSummary': function (oneRow) { // 普通单行
        var headMap = tHeadMap.modelSummary;
        var cellKeys = resultService.getCellKeys(headMap);
        var table = resultService.createTable(cellKeys, headMap, [oneRow]);
        var html = $('<div>').append(table).html();
        return '<div style="margin-bottom: 5px;">模型汇总:</div>' + html;
      },
      'coefficients': function (vdata) { // 矩阵
        var KV = resultService.parseVerticalData(vdata);
        var headMap = angular.copy(tHeadMap.coefficients);
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        var html = $('<div>').append(table).html();
        return '<div style="margin-bottom: 5px;">系数:</div>' + html;
      },
      'varianceAnalysis': function (vsour) {
        var headMap = tHeadMap.varianceAnalysis;
        var keys = ['squaresAnd', 'df', 'meanSquare', 'f', 'sig'];
        var data = [{
          'squaresAnd': vsour.ess, 'df': vsour.essDF,
          'meanSquare': vsour.essMeanSq, 'f': vsour.fstats,
          'sig': vsour.sigFStats
        }, {
          'squaresAnd': vsour.rss, 'df': vsour.rssDF,
          'meanSquare': vsour.rssMeanSq
        }, { 'squaresAnd': vsour.tss, 'df': vsour.tssDF }];
        var table = resultService.createTable(keys, headMap, data);
        resultService.appendMaxtrixY(table, [['hg'], ['cc'], ['zj']], [
          {'key': 'hg', 'name': '回归'}, {'key': 'cc', 'name': '残差'}, {'key': 'zj', 'name': '总计'}]);
        var html = $('<div>').append(table).html();
        return '<div style="margin-bottom: 5px;">方差分析表:</div>' + html;
      }
    };


    if ($routeParams.action === 'share') {
      that.isShare = false;
      resultService.getBackstage($routeParams.id).then(function (source) {
        var groups = source.curvefitBOLst;

        that.lineChart = source.lineChart; // ??
        that.textResult = resultService.parseGroup(parseMap, groups);
        // gm
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_curvefit');
      var groups = source.curvefitBOLst;
/*console.info(source);*/
      that.shareId = source.shareId;
      that.lineChart = source.lineChart; // ??
      that.textResult = resultService.parseGroup(parseMap, groups);
      // gm
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '曲线估计分析结果...', null, null, that.shareId);
    }

  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  return lrResultsCtrl;
});