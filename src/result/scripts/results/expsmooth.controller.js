// 指数平滑
window.define(
[],
function () {
var partsMap = [
  {name: '变量解释', keys: ['varsProduce']},
  {name: '模型解释', keys: ['modelDesc']},
  {name: '模型统计量表', keys: ['modelStats']},
  {name: '指数平滑模型参数估计', keys: ['modelParaEst']}
];

var tHeadMap = {
  'modelStats': [
    {'key': 'indeptKey', 'name': '模型'},
    {'key': 'stationaryR2', 'name': '平稳的R^2'},
    {'key': 'r2', 'name': 'R^2'},
    {'key': 'rmse', 'name': '均方根误差'},
    {'key': 'sse', 'name': '残差平方和'},
    {'key': 'Ljung-BoxQ', 'name': 'Ljung-BoxQ', child: [
      {'key': 'ljungBoxQStata', 'name': '统计量'},
      {'key': 'ljungBoxQDf', 'name': 'df'},
      {'key': 'ljungBoxQSig', 'name': 'Sig.'}
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
      'varsProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          var after = '';
          html += '<p style="margin: 0 0 5px 0">'+ after + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      },
      'modelDesc': function (desc) {
        var table = resultService.createTable(
          [0, 1],
          [{'key':0, 'name':''}, {'key':1,'name':'单指数平滑'}],
          [{0:desc.indeptKey, 1:desc.modelType}]);
        var html = $('<div>').append(table).html();
        return html;
      },
      'modelStats': function (stats) {
        var headMap = tHeadMap.modelStats;
        var table = resultService.createTable(['indeptKey','stationaryR2','r2','rmse','sse','ljungBoxQStata','ljungBoxQDf','ljungBoxQSig'],
          headMap, [stats]);
        var html = $('<div>').append(table).html();
        return html;
      },
      'modelParaEst': function (est) {
        /*console.info(est);*/
        //indeptKey: "S2", deptTrans: "无", alpha: 0.9999253160228725, endOfPeriodLevelsMean: 3.00000000557728
        var table = resultService.createTable(
         [0, 1, 2, 3],
         [{'key':0, 'name':'模型'}, {'key':1,'name':'转换类型'},
          {'key':2, 'name':'参数'}, {'key':3,'name':'估计'}],
         [{0:est.indeptKey, 1:est.deptTrans, 2:'Alpha', 3:est.alpha},
          {0:'', 1:'', 2:'趋势', 3:est.trend},
          {0:'', 1:'', 2:'均值', 3:est.endOfPeriodLevelsMean}]);
       var trs = $(table).find('tr');
       var tds = trs[2].cells;
       tds[0].colSpan = 2;
       tds[0].rowSpan = 2;
       tds[0].innerHTML = '最后一个经济周期：';
       trs[2].deleteCell(1);
       trs[3].deleteCell(0);
       trs[3].deleteCell(0);
       var html = $('<div>').append(table).html();
       return html;
      }
    };


    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        that.lineChart = source.lineChart;
        var data = source.smoothBO;
        that.textResult = resultService.parse(partsMap, parseMap, data);
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_expsmooth');
      that.shareId = source.shareId;
      that.lineChart = source.lineChart;
      var data = source.smoothBO;
      that.textResult = resultService.parse(partsMap, parseMap, data);
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '指数平滑分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  

  return lrResultsCtrl;
});