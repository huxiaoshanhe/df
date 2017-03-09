(function() {
  'use strict';
  // 树结构显示控制器

  angular
    .module('pf.tree')
    .controller('LeftTreeCtrl', LeftTreeCtrl);

  LeftTreeCtrl.$inject = ['$scope'];
  function LeftTreeCtrl($scope) {
    var that = this;
    that.id = $scope.dim.code;   
    that.root = $scope.dim.tree; // 上下文耦合
    
    that.checkNode = function(node) {
      var id = node.id, checked = node.checked;
      that.root.checkNode(id, checked);
    };
  }

})();