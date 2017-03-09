// 双变量控制器
window.define(
[],
function () {
var partsMap = [
  {name: '变量解释', keys: ['varsProduce']},
  {name: '描述性统计', keys: ['descStats']},
  {name: '相关性（Pearson系数）', keys: ['pearsonBO']},
  {name: '相关性（Kendall系数）', keys: ['kendallBO']},
  {name: '相关性（Sperman系数）', keys: ['spermanBO']}
];

var tHeadMap = {
  'descStats': [
    {'key': 'varName', 'name': '变量名'},
    {'key': 'xmean', 'name': '均值'},
    {'key': 'xstd', 'name': '标准差'},
    {'key': 'xrealNum', 'name': '样本个数'}
  ]
};

var tColMap = {
  'pearsonYKeys':
    ['correlations', 'sigCorrelations', 'covariance', 'sampleNum'],
  'pearsonY2Keys':
    [['correlations'], ['sigCorrelations'], ['covariance'], ['sampleNum']],
  'pearson': [
    {'key': 'correlations', 'name': '相关系数'},
    {'key': 'sigCorrelations', 'name': 'Sig.'},
    {'key': 'covariance', 'name': '协方差'},
    {'key': 'sampleNum', 'name': '样本个数'}
  ],
  'kendallYKeys':
    ['correlations', 'sigCorrelations', 'sampleNum'],
  'kendallY2Keys':
    [['correlations'], ['sigCorrelations'], ['sampleNum']],
  'kendall': [
    {'key': 'correlations', 'name': '相关系数'},
    {'key': 'sigCorrelations', 'name': 'Sig.'},
    {'key': 'sampleNum', 'name': '样本个数'}
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
      'varsProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          var after = '';
          html += '<p style="margin: 0 0 5px 0">'+ after + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      },
      'descStats': function (tdata) {
        var headMap = tHeadMap.descStats;
        var cellKeys = resultService.getCellKeys(headMap);
        var table = resultService.createTable(cellKeys, headMap, tdata);
        return $('<div>').append(table).html();
      },
      'pearsonBO': function (twotwo) {
        var mxSize = twotwo.items.length;
        var axYKeys = tColMap.pearsonYKeys;

        var groupY = [], groupYMap = []; // 组名映射
        var groupY2 = [], groupY2Map = []; // 组名2映射

        var cellKeys = [];
        var headMap = resultService.fsHeadMapByArray(twotwo.varList);

        for (var i = 0; i < mxSize; i++) {
          cellKeys.push(i);
          groupY.push(axYKeys);
          groupYMap.push({'key': i, 'name': twotwo.varList[i]});
          groupY2 = groupY2.concat(tColMap.pearsonY2Keys);
          groupY2Map = groupY2Map.concat(tColMap.pearson);
        }

        var rows = resultService.parseMatrix2(axYKeys, twotwo.items);
        var table = resultService.createTable(cellKeys, headMap, rows);
        resultService.appendMaxtrixY(table, groupY2, groupY2Map);
        resultService.appendMaxtrixY(table, groupY, groupYMap);
        return $('<div>').append(table).html();
      },
      'kendallBO': function (twotwo) {
        var mxSize = twotwo.items.length;
        var axYKeys = tColMap.kendallYKeys;

        var groupY = [], groupYMap = []; // 组名映射
        var groupY2 = [], groupY2Map = []; // 组名2映射

        var cellKeys = [];
        var headMap = resultService.fsHeadMapByArray(twotwo.varList);

        for (var i = 0; i < mxSize; i++) {
          cellKeys.push(i);
          groupY.push(axYKeys);
          groupYMap.push({'key': i, 'name': twotwo.varList[i]});
          groupY2 = groupY2.concat(tColMap.kendallY2Keys);
          groupY2Map = groupY2Map.concat(tColMap.kendall);
        }

        var rows = resultService.parseMatrix2(axYKeys, twotwo.items);
        var table = resultService.createTable(cellKeys, headMap, rows);
        resultService.appendMaxtrixY(table, groupY2, groupY2Map);
        resultService.appendMaxtrixY(table, groupY, groupYMap);
        return $('<div>').append(table).html();
      },
      'spermanBO': function (twotwo) {
        var mxSize = twotwo.items.length;
        var axYKeys = tColMap.kendallYKeys;

        var groupY = [], groupYMap = []; // 组名映射
        var groupY2 = [], groupY2Map = []; // 组名2映射

        var cellKeys = [];
        var headMap = resultService.fsHeadMapByArray(twotwo.varList);

        for (var i = 0; i < mxSize; i++) {
          cellKeys.push(i);
          groupY.push(axYKeys);
          groupYMap.push({'key': i, 'name': twotwo.varList[i]});
          groupY2 = groupY2.concat(tColMap.kendallY2Keys);
          groupY2Map = groupY2Map.concat(tColMap.kendall);
        }

        var rows = resultService.parseMatrix2(axYKeys, twotwo.items);
        var table = resultService.createTable(cellKeys, headMap, rows);
        resultService.appendMaxtrixY(table, groupY2, groupY2Map);
        resultService.appendMaxtrixY(table, groupY, groupYMap);
        return $('<div>').append(table).html();
      }
    };
    

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        var data = source.bivariateBO;
        that.textResult = resultService.parse(partsMap, parseMap, data);
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_bivar');

      that.shareId = source.shareId;
      var data = source.bivariateBO;
      tColMap.pearson[1].name += '(' + data.testName + ')';
      tColMap.kendall[1].name += '(' + data.testName + ')';
      that.textResult = resultService.parse(partsMap, parseMap, data);
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '双变量分析结果...', null, null, that.shareId);

    }

    // gaomao
    //resultService.directory();
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  return lrResultsCtrl;
});