(function() {
	angular
	  .module('pf.search')
	  .directive('search', searchDirective);

	function searchDirective() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/template/search.html',
			link:function(scope,element,attr) {
				var left = ($(window).width()-814)/2;
				element.css('top','100px').css('left',left+'px');
				element.draggable();

				close('#search');
				/**窗口关闭方法**/
	  			function close(id) {
	  				element.find(id+' .close').click(function() {
	  					element.find(id).hide();
	  					if(element.find('.shade')) {
							element.find('.shade').hide();
						}
	  				});
	  				element.find(id+' .cancel').click(function() {
	  					element.find(id).hide();
	  					if(element.find('.shade')) {
							element.find('.shade').hide();
						}
	  				});
	  			}	  	
			}
		};
	}		
})();