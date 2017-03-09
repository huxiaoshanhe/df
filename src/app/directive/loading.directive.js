(function() {
  'use strict';
  // 加载中遮盖

  angular
    .module('pf.directive')
    .directive('loading', loadingDirective);

  function loadingDirective() {
    return {
      link: function(scope, element, attrs) {
        var LDELE = $('#loading');
        if (!LDELE.length) {
          LDELE = $('<div id="loading" class="loading"></div>').appendTo($('body'));
        }
        LDELE.hide();

        scope.$watch(attrs.loading, function(status) {
          var w = element.innerWidth(), h = element.innerHeight();
          var offset = element.offset();

          if (status === true) {
            LDELE.css({'width': w, 'height': h, 'top': offset.top, 'left': offset.left});
            LDELE.show();
          } else { LDELE.hide(); }
        });

        // 不会有这么长时间
        // $(window).resize(function() {
        //   if(scope[attrs.loading] === true) {
        //     var h = element.innerHeight();
        //     LDELE.css('height', h);
        //   }
        // });
      }
    };
  }

})();