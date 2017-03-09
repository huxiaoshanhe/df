(function() {
  'use strict';

  angular
    .module('pf.search')
    .controller('LeftTreeSearchCtrl', LeftTreeSearchCtrl);

  // 右侧树搜索控制器, 上下文依赖, 获取搜索类型
  LeftTreeSearchCtrl.$inject = ['$scope', 'searchService', 'coreCF'];
  function LeftTreeSearchCtrl($scope, searchService, config) {
    var _spk = config.spreadKey;
    var root = $scope.dim.tree; // 耦合根
    var type = $scope.dim.feature.action; // 耦合搜索类型
    var that = this;
    that.show = false;
    that.data = []; // 最终数据

    // 关键字搜索
    that.query = function(keyword) {
      if (!keyword) { that.data = []; that.show = false; }
      else {
        searchService.search(type, keyword).then(function(list) {
          that.show = !!list.length;
          if (that.show === true) {
            // 要同步当前已经选中节点
            var selected = root.getSelectedIds();
          }
          that.data = list;
        });
      }
    };

    // 配套选择吧
    that.selected = function(node) {
      // 搜索数据选中
      node.isSelected = !node.isSelected;
      // 实际数据选中
      root.checkNode(node.code, node.isSelected);
      // 通知指令树选中
      $scope.$emit(_spk.bridgeNow, ['searchSelectNodeChange', node.code]);
    };
  }

})();
