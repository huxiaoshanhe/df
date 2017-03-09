(function() {
  'use strict';
  // 添加指标控制器

  angular
    .module('pf.indicator')
    .controller('AddIndicatorCtrl', AddIndicatorCtrl)
    .filter('kwf', keyworkFilter);

  AddIndicatorCtrl.$inject = ['$scope', 'indicatorService', 'searchService'];
  function AddIndicatorCtrl($scope, indicatorService, searchService) {
    var that = this;

    that.selected = {}; // 选中记录
    that.disabled = true; // 可提交不
    that.searchList = null;

    that.addIndicator = sync;

    // 监听关键字
    $scope.$watch('keyword', function(keyword) {
      if (keyword) {
        searchService.search('indicator', keyword).then(function(list) {
          that.searchList = list;
        });
      } else { that.searchList = null; }
    });

    // 监听选中, 验证是否可以提交
    $scope.$watch('aivm.selected', function(selected) {
      var fCount = 0;
      for (var key in selected) {
        if (selected[key] === true) {
          that.disabled = false;
          return;
        }
      }
      that.disabled = true;
    }, true);

    // 同步数据
    function sync() {
      if (that.disabled === true) { return; }
      indicatorService.sync(that.selected);
      //console.log(that.selected);
      // 清空选中
      that.selected = {};
      $scope.closeThisDialog();
    }
  }

  keyworkFilter.$inject = ['$sce'];
  function keyworkFilter($sce) {
    return function (text, keyword) {
      var re = new RegExp(keyword, 'g');
      text = text.replace(re, function(kw) { return '<em>'+kw+'</em>'; });
      return $sce.trustAsHtml(text);
    }
  }

})();
