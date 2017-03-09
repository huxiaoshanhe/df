// 预分析
window.define(
[],
function () {
var partsMap = [
  {name: '变量解释', keys: ['variableProduces']},
  {name: '描述性统计', keys: ['preAnaDescStats']},
  {name: '相关矩阵', keys: ['preAnaCorrelationMatrix']},
  {name: 'KMO 及 Bartllet 球形检验', keys: ['kmoBartllet']},
  {name: '反映像相关矩阵检验', keys: ['antiImageCorreMatrix']}
];

var tHeadMap = {
  'preAnaDescStats': [
    {'key': 'variableCode', 'name': '变量名'},
    {'key': 'sampleNum', 'name': '样本个数'},
    {'key': 'mean', 'name': '均值'},
    {'key': 'stdDev', 'name': '标准差'}
  ],
  'preAnaCorrelationMatrix': [
    {'key': 'correlationCoefficient', 'name': '相关系数'},
    {'key': 'significantLevel', 'name': 'Sig.(单侧)'}
  ],
  'kmoBartllet': [
    {'key': 'chiSquare', 'name': '卡方'},
    {'key': 'dof', 'name': '自由度'},
    {'key': 'sigChiSquare', 'name': 'Sig.'}
  ],
  'antiImageCorreMatrix': [
    {'key': 'antiImaCor', 'name': '反映像相关'},
    {'key': 'antiImaCov', 'name': '反映像协方差'}
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
      'preAnaDescStats': function (tdata) {
        var headMap = tHeadMap.preAnaDescStats;
        var cellKeys = resultService.getCellKeys(headMap);
        var table = resultService.createTable(cellKeys, headMap, tdata);
        return $('<div>').append(table).html();
      },
      'preAnaCorrelationMatrix': function (matrixMS) {
        var t = [matrixMS.correlationCoefficient, matrixMS.significantLevel];
// console.info(matrixMS.variableCodes, t);
        var KV = resultService.parseMatrix(matrixMS.variableCodes, t);
        var axis = [''].concat(matrixMS.variableCodes);
        var headMap = resultService.fsHeadMapByArray(axis);
        var newHeadMap = tHeadMap.preAnaCorrelationMatrix; // 真.
        var table = resultService.createTable(KV.keys, headMap, KV.matrix);
        resultService.appendMaxtrixY(table, t, newHeadMap);
        return $('<div>').append(table).html();
      },
      'kmoBartllet': function (da) {
        var headMap = tHeadMap.kmoBartllet;
        var cellKeys = resultService.getCellKeys(headMap);
        var oneRow = [da.preAnaBartllet];
        var table = resultService.createTable(cellKeys, headMap, oneRow);
var thead = $(table).children('thead');
var tbody = $(table).children('tbody');

var tone = $('<tr>');
tbody.prepend(tone);
tone.prepend('<td rowspan="2">'+(da.kmo.value).toFixed(3)+'</td>');
thead.children('tr').children('th').each(function(index, th) {
  tone.append('<td>'+ th.innerHTML +'</td>');
});
thead.children('tr').remove();
var ttone = tbody.children('tr')[0];
thead.html('<tr><th>KMO</th><th colspan="3">Bartlett球形检验</th></tr>');

        return $('<div>').append(table).html();
      },
      'antiImageCorreMatrix': function (matrixMS) {
         var t = [matrixMS.antiImaCor, matrixMS.antiImaCov];

        var KV = resultService.parseMatrix(matrixMS.variableCodes, t);
        var axis = [''].concat(matrixMS.variableCodes);
        var headMap = resultService.fsHeadMapByArray(axis);
        var newHeadMap = tHeadMap.antiImageCorreMatrix; // 真.
        var table = resultService.createTable(KV.keys, headMap, KV.matrix);
        resultService.appendMaxtrixY(table, t, newHeadMap);
        return $('<div>').append(table).html();
      }
    };
    

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        var data = source.preAnalysisBO;
        that.lineChart = source.lineChart;
        that.textResult = [];

        var textResult = resultService.parse(partsMap, parseMap, data);
        that.textResult[0] = textResult.splice(0, 2); // 截取前两个
        that.textResult[1] = textResult;
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_preanalysis');
      that.shareId = source.shareId;
      var data = source.preAnalysisBO;
      that.lineChart = source.lineChart;
      that.textResult = [];

      var textResult = resultService.parse(partsMap, parseMap, data);
      that.textResult[0] = textResult.splice(0, 2); // 截取前两个
      that.textResult[1] = textResult;
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '预分析分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  return lrResultsCtrl;
});