// 偏相关
window.define(
[],
function () {
var partsMap = [
  {name: '变量说明', keys: ['variableProduce']}
];


  function lrResultsCtrl ($sce, $location, $routeParams, resultService) {
    var that = this;
    that.isShare = true;
    that.textResult = null;
    that.share = function (id) {
      resultService.share('analysis_hp', id);
    };
    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    var parseMap = {
      'variableProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          html += '<p style="margin: 0 0 5px 0">' + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      }
    };
    

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        that.lineChart = source.lineChart;
        that.lumda = source.hp.lumda;
        var data = source.hp;
        that.textResult = resultService.parse(partsMap, parseMap, data);
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_hp');
      that.shareId = source.shareId;
      that.lineChart = source.lineChart;
      that.lumda = source.hp.lumda;
      var data = source.hp;
      that.textResult = resultService.parse(partsMap, parseMap, data);
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, '偏相关分析分析结果...', null, null, that.shareId);
    }
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];

  return lrResultsCtrl;
});