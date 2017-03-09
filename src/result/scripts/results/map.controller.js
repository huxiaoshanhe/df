// 自相关
window.define(
[],
function () {

  function lrResultsCtrl ($sce, $location, $routeParams, resultService) {
    var that = this;
    that.isShare = true;
    that.textResult = null;
    that.share = function (id) {
      resultService.share('analysis_arima', id);
    };
    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        
      });
    } else {
      var source = resultService.get('analysis_map');
      /*console.info(source);*/
      that.mapChart = source;
      // that.shareId = source.shareId;
      // that.lineChart = source.lineChart;
      // that.raBarChart = source.raBarChart;
      // that.rpaBarChart = source.rpaBarChart;
      // var data = source.arimaBO;
      // var textResult = resultService.parse(partsMap, parseMap, data);
      // that.raBar = textResult.splice(4, 1);
      // that.rpaBar = textResult.splice(4, 1);
      // that.textResult = textResult;
      // // gaomao
      // resultService.directory(source.itemInfos);
    }
    
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];
  return lrResultsCtrl;
});