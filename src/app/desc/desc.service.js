(function() {
	'use strict';
	angular
		.module('pf.directive')
		.controller('descCtrl',descCtrl)
		.directive('descstatistics',descstatistics)
		.factory('descService',descService);
	
	function descCtrl() {
		var that = this;
		that.close=function() {
			$('.descarea .close').click(function() {
				$('.descarea').hide();
			});
		}
	}
	
	function descstatistics() {
	  	return {
	  		replace: true,
	  		restrict: 'E',
	  		templateUrl: 'app/template/descstatistics.html'
	  	};
	}
	
	descService.$inject=['dataService', '$http', 'coreCF', '$rootScope'];
	function descService(dataService, $http, config, $rootScope) {
		var service={
				'setDesc' : setDesc
		}
		return service;
		
		function setDesc(sheetId,area) {
			var params= {
				'sheetId' :sheetId,
				  'p1' : area[0]+','+area[1],
				  'p2' : area[2]+','+area[3],
			}
			return dataService.get('descstats',params).then(function(response) {
				$rootScope.desc = response;
				return response;
			});
		}		
	}
})();