(function() {
  'use strict';
  // 搜索建议指令, 小小的关联

  angular
    .module('pf.directive')
    .directive('proposal', proposalDirective);

  function proposalDirective() {
    return {
      replace: true,
      transclude: true,
      scope: {'query': '&', 'show': '='},
      templateUrl: 'app/template/proposal.html',
      link: function(scope, element, attr) {
        var query = scope.query();
        var input = $(element.children('input')[0]);
        scope.closeShow = false;
        scope.clearValue = function() { input.val(''); input.keyup(); };

        input.addClass(attr.inputClass)
          .attr('style', attr.inputStyle)
          .attr('placeholder', attr.placeholder);

        input.keyup(function() {
          var value = input.val();
          scope.closeShow = (value ? true : false);
          query(value);
        });
      }
    };
  }

})();