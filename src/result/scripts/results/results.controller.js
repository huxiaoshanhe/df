// 分析结果控制
window.define(
[],
function () {

  function resultsController ($scope, $sce, resultService) {
    var that = this;

    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    $scope.$on('updateParagraphs', function (e, paragraphs) {
/*console.info(paragraphs);*/
      that.paragraphs = paragraphs;
    });

    resultService.parse();

  }
  resultsController.$inject = ['$scope', '$sce', 'resultService'];

  return resultsController;
});