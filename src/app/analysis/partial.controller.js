(function() {
	'use strict';
	angular
	.module('pf.indicator')
	.controller('partialCtrl',partialCtrl)
	.directive('partial',partial);

	partial.$inject = [];
	function partial() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/partial.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.partialGo = function(params) {
					dataService.get('correlation',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'partial2');
						var result = {'analysis_partial2':response}
						sessionStorage.setItem('analysis_partial2',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_partial2';
						window.open(target_url);
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colsePartial');
				}
			},
			controllerAs:'partial',
			scope:{data:'='},
			link:function(scope,element,attr,partial) {
				var left = ($(window).width()-510)/2;
				var height = element.height()+50;
				element.css('left',left+'px');
				$(window).resize(function() {
					var _left = ($(window).width()-510)/2;
					element.css('left',_left+'px');
				});
				//可移动
				element.draggable();
				//可调整大小
				element.resizable({
			      minHeight: height,
			      minWidth: 510
			    });

				scope.$watch('data',function(data) {

				});

				scope.selectRecord = {
					'normalvars1'		:	0,
					'normalvarsName1'	:	'',
					'normalvars2'		:	0,
					'normalvarsName2'	:	'',
					'sign'				:	2,
					'ctrlvars'			:	[]
				}
				
				scope.selectNormalvars = function(index,name) {
					scope.selectRecord.normalvars1 = index;
					scope.selectRecord.normalvarsName1 = name;
					$('.bl1 ul').hide();
				}
				scope.selectNormalvars2 = function(index,name) {
					scope.selectRecord.normalvars2 = index;
					scope.selectRecord.normalvarsName2 = name;
					$('.bl2 ul').hide();
				}
				scope.selectCtrlvars = function(index) {
					var isset=scope.selectRecord.ctrlvars.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.ctrlvars.push(index);
					} else {
						scope.selectRecord.ctrlvars.splice(isset,1);
					}
				}
				scope.startButton = function() {
					if(scope.selectRecord.normalvars1 == 0) {
						return false;
					}
					if(scope.selectRecord.normalvars2 == 0) {
						return false;
					}
					if(scope.selectRecord.normalvars1 == scope.selectRecord.normalvars2) {
						return false;
					}
					if(scope.selectRecord.ctrlvars.length == 0) {
						return false;
					}
					if(scope.selectRecord.ctrlvars.indexOf(scope.selectRecord.normalvars1)!==-1) {
						return false;
					}
					if(scope.selectRecord.ctrlvars.indexOf(scope.selectRecord.normalvars2)!==-1) {
						return false;
					}			
				}
				scope.partialGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params= {
							'ctrlvars' 	  :  scope.selectRecord.ctrlvars,
							'sign'        :  scope.selectRecord.sign,
							'sheetId'     :  scope.data.sheetId,
							'action'      :  'partial',
							'rccl'		  :  0.99,
							'normalvars'  :  [scope.selectRecord.normalvars1,scope.selectRecord.normalvars2]
					}
					partial.partialGo(params);					
				}

				scope.close = function() {
			    	partial.close();
			    }

				scope.showList = function(params) {
					if($(params).find('ul').css('display')=='none') {
						$(params).find('ul').show();
					} else {
						$(params).find('ul').hide();
					}			
				}
			}
		}
	}

	partialCtrl.$inject = ['$scope', 'dataService']
	function partialCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;
		
		
		$scope.$on('isPartial',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});

		$scope.$on('colsePartial',function(data) {
			that.isShow = false;
			that.datas=null;
		});
	}
})();