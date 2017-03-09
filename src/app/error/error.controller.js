(function() {
	'use strict';
	angular
	    .module('pf.indicator')
	    .controller('errorCtrl', errorCtrl);
	
	errorCtrl.$inject = [];
	function errorCtrl() {
		var that = this;
		function closes() {
			$('.ngdialog-overlay').click();
		}
		setTimeout("$('.ngdialog-close').click()",2000);
	}
})();