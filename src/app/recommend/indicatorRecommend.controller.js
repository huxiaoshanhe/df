(function() {
  'use strict';
  // 指标推荐控制器

  angular
    .module('pf.recommend')
    .controller('indicatorRecommendCtrl', indicatorRecommendCtrl);

  indicatorRecommendCtrl.$inject = ['$scope', 'recommendService', 'coreCF'];
  function indicatorRecommendCtrl($scope, recommendService, config) {
    var _spk = config.spreadKey;
    var that = this;
    that.title = "指标推荐";
    that.recommends = []; // 推荐指标
    that.selectRecord = {}; // 选中的记录

    that.selected = selected; // 选中推荐的方法

    that.selectRecord = recommendService.getSelected();

    // 监听选中变更, 通知选中变更重新判断同步, 主意监听key的变更
    $scope.$watch('ircvm.selectRecord', function(nsel) {
      for (var key in nsel) {
        $scope.$emit(_spk.dimSelectedChange, nsel);
        return true;
      }
    });

    /**
     * 选中一项推荐, 记录在表记录上
     * @param  {String} code 指标代码
     */
    function selected(code) {
      var record = recommendService.addSelected(code);
      that.selectRecord = record;
    }

    // 监听刷新推荐方法
    $scope.$on(_spk.refreshRecommend, function(e, type) {
      recommendService.getRecommend(true).then(function(reList) {
        that.recommends = reList;
      });
    });

    // 锦亭获取缓存推荐的方法
    $scope.$on(_spk.getRecommendChange, function(e, type) {
      that.recommends = recommendService.getRecommend(false);
    })

    // 控制器加载时询问是否请求推荐信息(注意注册顺序问题)
    $scope.$emit(_spk.askRecommendRefresh, 'indicator');
  }

})();
