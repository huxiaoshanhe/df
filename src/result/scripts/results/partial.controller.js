// 偏相关
window.define(
[],
function () {
var partsMap = [
  {name: '变量说明', keys: ['varsProduce']},
  {name: '描述性统计', keys: ['descStats']},
  {name: '偏相关系数', keys: ['pcCoefficient']},
  {name: '零阶相关系数', keys: ['zeroOrderCoefficient']}
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
  'pcCoefficientYKeys':
    ['correlations', 'sigCorrelations', 'df'],
  'pcCoefficientY2Keys':
    [['correlations'], ['sigCorrelations'], ['df']],
  'pcCoefficient': [
    {'key': 'correlations', 'name': '相关系数'},
    {'key': 'sigCorrelations', 'name': 'Sig.'},
    {'key': 'df', 'name': '自由度'}
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
          var after = i === 0 || i === 1?'<b>【变量】</b>':'<b>【控制变量】</b>';
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
      'pcCoefficient': function (twotwo) {
        if (!twotwo.items) { /*console.error('没有items!');*/ }
        var mxSize = twotwo.items.length;
        var axYKeys = tColMap.pcCoefficientYKeys;
        var groupY = [], groupYMap = []; // 组名映射
        var groupY2 = [], groupY2Map = []; // 组名2映射

        var cellKeys = [];
        var headMap = resultService.fsHeadMapByArray(twotwo.varLst);

        for (var i = 0; i < mxSize; i++) {
          cellKeys.push(i);
          groupY.push(axYKeys);
          groupYMap.push({'key': i, 'name': twotwo.varLst[i]});
          groupY2 = groupY2.concat(tColMap.pcCoefficientY2Keys);
          groupY2Map = groupY2Map.concat(tColMap.pcCoefficient);
        }

        var rows = resultService.parseMatrix2(axYKeys, twotwo.items);
        var table = resultService.createTable(cellKeys, headMap, rows);
        resultService.appendMaxtrixY(table, groupY2, groupY2Map);
        resultService.appendMaxtrixY(table, groupY, groupYMap);

        var html = $('<div>').append(table).html();
        return html + '<div style="margin-top: 10px;"><b style="color:#9194B6;">控制变量：</b>' + twotwo.controlVarLst.join('&nbsp;&nbsp;') + '</div>';
      },
      'zeroOrderCoefficient': function (twotwo) {
        var mxSize = twotwo.items.length;
        var axYKeys = tColMap.pcCoefficientYKeys;
        var groupY = [], groupYMap = []; // 组名映射
        var groupY2 = [], groupY2Map = []; // 组名2映射

        var cellKeys = [];
        var axisList = twotwo.varLst.concat(twotwo.controlVarLst);
        var headMap = resultService.fsHeadMapByArray(axisList);

        for (var i = 0; i < mxSize; i++) {
          cellKeys.push(i);
          groupY.push(axYKeys);
          groupYMap.push({'key': i, 'name': axisList[i]});
          groupY2 = groupY2.concat(tColMap.pcCoefficientY2Keys);
          groupY2Map = groupY2Map.concat(tColMap.pcCoefficient);
        }

        var rows = resultService.parseMatrix2(axYKeys, twotwo.items);
        var table = resultService.createTable(cellKeys, headMap, rows);
        resultService.appendMaxtrixY(table, groupY2, groupY2Map);
        resultService.appendMaxtrixY(table, groupY, groupYMap);

        var html = $('<div>').append(table).html();
        return html;
      }
    };
    

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        var data = source.partialBO;
        tColMap.pcCoefficient[1].name += '(' + (data.testName || '') + ')';
        that.textResult = resultService.parse(partsMap, parseMap, data);
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_partial2');
      that.shareId = source.shareId;
      var data = source.partialBO;
//console.info(data);
      tColMap.pcCoefficient[1].name += '(' + (data.testName || '') + ')';
      that.textResult = resultService.parse(partsMap, parseMap, data);
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '偏相关分析结果...', null, null, that.shareId);
    }
  }

  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  return lrResultsCtrl;
});