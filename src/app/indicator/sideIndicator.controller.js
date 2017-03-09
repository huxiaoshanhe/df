(function() {
  'use strict';
  // 侧边栏指标控制器

  angular
    .module('pf.indicator')
    .controller('SideIndicatorCtrl', SideIndicatorCtrl);

  SideIndicatorCtrl.$inject = ['$scope'];
  function SideIndicatorCtrl($scope) {
    var that = this;
    that.tree = $scope.dim.tree; // 耦合上下文

    // 删除一项指标, 指定code
    that.remove = function(id) {
      for (var i = 0, ilen = that.tree.childs.length; i < ilen; i++) {
        var node = that.tree.childs[i];
        if (node.id === id) {
          return that.tree.childs.splice(i, 1);
        }
      }
    };
  }

})();