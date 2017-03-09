(function() {
  'use strict';

  angular
    .module('pf.sheet')
    .controller('SheetCtrl', SheetCtrl);

  SheetCtrl.$inject = ['$rootScope', '$scope', 'indicatorService', 'coreCF'];
  function SheetCtrl($rootScope, $scope, indicatorService, config) {
    var _spk = config.spreadKey;
    var that = this;
    that.sheet = null;

    that.openAddIndicator = function() { 
	    indicatorService.addIndicator(); 
    };

    $scope.$on(_spk.sheetChange, function(e, sheet) {
      that.sheet = sheet;
      config.currentSheet=sheet.id;//记录当前sheetId;
    });
  }

})();