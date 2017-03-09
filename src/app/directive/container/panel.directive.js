(function() {
  'use strict';

  angular
    .module('pf.directive')
    .controller('panelCtrl', panelCtrl)
    .directive('panel', panelDirective)
    .service('panelService', panelService);

  panelService.$inject = ['coreCF'];
  function panelService(config) {
    var _spk = config.spreadKey, _scopes = [];
    var service = {
      'open': open,
      'close': close,
      'push': function(scope){ _scopes.push(scope); },
    };
    return service;

    function open(pg) {
      pg.show = true;
      angular.forEach(_scopes, function(scope) {
        scope.$broadcast(_spk.panelConfigChange, pg);
      });
    }

    function close() {
      angular.forEach(_scopes, function(scope) {
        scope.$broadcast(_spk.panelConfigChange, {'show':false});
      });
    }
  }

  panelCtrl.$inject = ['$scope', 'panelService', 'coreCF'];
  function panelCtrl($scope, panelService, config) {
    var _spk = config.spreadKey;
    panelService.push($scope);

    $scope.config = null;

    // 转接
    $scope.$on(_spk.panelConfigChange, function(e, config) {
      $scope.config = config;
    });
  }

  panelDirective.$inject = ['$compile', 'dataService'];
  function panelDirective($compile, dataService) {
    return {
      replace: true,
      controller: panelCtrl,
      template: '<div class="panel" style="z-index:990"></div>',
      link: function(scope, element, attrs, ctrl) {
        scope.$watch('config', function(config) {
          if (!config) { return; }
          if(config.show === true) { element.show(); }
            else { element.hide(); return; }

          dataService.getHtml(config.template).then(function(html) {
            var link = $compile(html);
            element.empty().append(link(scope));
          });

          element.removeClass().addClass('panel '+config.cName).css(config.style);
        })
      }
    }
  }

})();