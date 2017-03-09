(function() {
  'use strict';
  // 中转通信

  angular
    .module('pf.core')
    .controller('BridgeCtrl', BridgeCtrl);

  BridgeCtrl.$inject = ['$scope', 'coreCF'];
  function BridgeCtrl($scope, config) {
    var _spk = config.spreadKey;
    var that = this;

    $scope.$on(_spk.bridgeNow, function(e, nn) {
      $scope.$broadcast(_spk[nn[0]], nn[1]);
    });
  }

})();