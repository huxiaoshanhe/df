// 自相关
window.define(
[],
function () {
var partsMap = [
  {name: '自相关', keys: ['autocorrelationPart']},
  {name: '偏自相关', keys: ['partialAutocorrelationPart']}
];

var tHeadMap = {
  'autocorrelationPart': [
    {'key':'', 'name':'滞后阶数'},
    {'key':'', 'name':'自相关系数'},
    {'key':'', 'name':'标准误差'},
    {'key':'', 'name':'Ljung-Box Q'},
    {'key':'', 'name':'Sig'}
  ],
  'partialAutocorrelationPart': [
    {'key':'', 'name':'滞后阶数'},
    {'key':'', 'name':'偏自相关系数'},
    {'key':'', 'name':'标准误差'},
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
      'autocorrelationPart': function (data) {
        var KV = resultService.parseVerticalData(data);
        var headMap = [];
        for (var i = 0, ilen = KV.keys.length; i < ilen; i++) {
          headMap.push({'key': i, 'name': KV.keys[i]});
        }
        headMap = tHeadMap.autocorrelationPart;
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        return $('<div>').append(table).html();
      },
      'partialAutocorrelationPart': function (data) {
        var KV = resultService.parseVerticalData(data);
        var headMap = tHeadMap.partialAutocorrelationPart;
        var table = resultService.createTable(KV.keys, headMap, KV.data);
        return $('<div>').append(table).html();
      }
    };
    

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        that.shareId = source.shareId;
        var data = source.autocorrelationBO;
        var textResult = resultService.parse(partsMap, parseMap, data);
        that.textResult = [];
        that.textResult[0] = textResult.splice(0, 1);
        that.acMixChart = source.acMixChart;
        that.textResult[1] = textResult;
        that.pacMixChart = source.pacMixChart;
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_autocorre');
/*console.info(source);*/
      that.shareId = source.shareId;
      var data = source.autocorrelationBO;
      var textResult = resultService.parse(partsMap, parseMap, data);
      that.textResult = [];
      that.textResult[0] = textResult.splice(0, 1);
      that.acMixChart = source.acMixChart;
      that.textResult[1] = textResult;
      that.pacMixChart = source.pacMixChart;
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '自相关分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  

  return lrResultsCtrl;
});