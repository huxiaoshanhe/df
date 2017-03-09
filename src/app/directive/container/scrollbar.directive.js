(function() {
  'use strict';

  angular
    .module('pf.directive')
    .directive('scrollbar', scrollbarDirective);

  function scrollbarDirective() {
    return {
      replace: true,
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function(scope, element, attr) {
        window.setTimeout(function() {
          $(element).css({'position': 'relative', 'height': '100%'});
          $(element).perfectScrollbar();
        }, 1);
        

        $(element).bind('mouseenter click', function(e){
          window.setTimeout(function() {
            $(element).perfectScrollbar('update');
          }, 1);
        });
      }
    };
  }

})();