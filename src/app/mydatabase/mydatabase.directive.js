(function() {
	'use strict';
	angular
	  .module('pf.directive')
	  .directive('mydatabase', myDatabaseDirective);
	  myDatabaseDirective.$inject = ['dataService', 'coreCF'];
	  function myDatabaseDirective(dataService, config) {
	  	return {
	  		replace: true,
	  		templateUrl: 'app/template/mydatabase.html',
	  		controller:function($scope) {
	  			var that  = this;
	  			$scope.data = null;
	  			that.userInfo = dataService.getItem('_user');
	  			that.getmyFolders = function() {
		  			dataService.get('queryFolderList',{'parentFileCode':'','userCode':that.userInfo.id}).then(function(data){
		  				that.folders = data;
		  				$scope.data = data;
		  				recursion(data);		  				
		  			});

		  			function recursion(data) {
	  				angular.forEach(data,function(v,k) {
	  					if(v.children) {
	  						if(v.children.length>0) {
	  							v.isParent = true;
	  							recursion(v.children);
	  						}	  						
	  					}
	  				});
	  				return data;
	  			} 
			  	}
	  		},
	  		controllerAs:'mdbCtrl',
	  		link:function(scope, element, attr, mdbCtrl) {
	  			/**调用关闭窗口**/
	  			close('#mydata-operate');
	  			close('#upload-win');
	  			close('#select-file-type');
	  			close('#analysis-failed');
	  			close('#save-data');
	  			close('#xls-tab-jm');
	  			close('#xls-tab-sj');
	  			scope.data = mdbCtrl.folders;
	  			scope.$on('showUpLoad',function(data) { 
			  		element.find('#upload-win').show();
			  		mdbCtrl.getmyFolders();
			  	});
			  	scope.$watch('data',function(msg) {
			  		if(scope.data!==undefined) {			  			
		  				var selectedCubes = [];
				        var setting = {
				        	view: {showIcon:false, showTitle: false, showLine:false},
				          	data: {key: {'name': 'file_name','id':'cude_id','isParent':'isParent'}}
				        };
			        	setting.callback = {};
				        setting.callback.onClick = function(e, treeId, node) {
				          scope.$broadcast('dirName',node);
				        };
				        setting.callback.onCheck = function(e, treeId, node) {
				          var num = selectedCubes.indexOf(node);
				          if(num===-1) {
				          	selectedCubes.push(node);
				          } else {
				          	selectedCubes.splice(num,1);
				          }
				          scope.$emit('sear',selectedCubes);
				        };
			        	var ztree = $.fn.zTree.init($('#myFolders'), setting, scope.data);
			  		}
			  	});

	  			/**触发选择文件类型窗口（时间序列 or 截面数据）**/
	  			element.find('.btn-area').click(function() {
	  				element.find('#upload-win').hide();
			  		element.find('#select-file-type').show();
			  		element.find('.shade').show();
	  			});







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