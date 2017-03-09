(function() {
	'use strict';
	angular
    .module('pf.indicator')
    .controller('hpfilterCtrl', hpfilterCtrl)
    .directive('hpfilter',hpfilter);

    hpfilter.$inject = [];
    function hpfilter() {
    	return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/hpfilter.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.hpfilterGo = function(params) {
					dataService.get('hp',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'hp');	
						var result = {'analysis_hp':response}
						sessionStorage.setItem('analysis_hp',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_hp';
						window.open(target_url);		
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseHpfilter');
				}
			},
			controllerAs:'hpfilter',
			scope:{data:'='},
			link:function(scope,element,attr,hpfilter) {
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

				scope.$watch('data',function() {

				});

			    scope.showList = function(params) {
					if($(params).find('ul').css('display')=='none') {
						$(params).find('ul').show();
					} else {
						$(params).find('ul').hide();
					}
					
				}
				
				scope.selectRecord = {
						'dept' : 0,
						'deptName' : ''
				}
				scope.startButton = function() {
					if(scope.selectRecord.dept==0) {
						return false;
					}
				}
				
				scope.selectDept = function(index,name) {
					scope.selectRecord.dept=index;
					scope.selectRecord.deptName=name;
					$('.aggregation-input ul').hide();
				}
				scope.hpfilterGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params= {					
							'sheetId'    :  scope.data.sheetId,
							'dept'       :  {
								index:scope.selectRecord.dept,
								name:scope.selectRecord.deptName
							},
							'varIndex'   :  scope.selectRecord.dept
					}
					
					hpfilter.hpfilterGo(params);
				}
				scope.close = function() {
					hpfilter.close();
				}
			}
		}
    }
	
	hpfilterCtrl.$inject = ['$scope', 'dataService'];
	function hpfilterCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;
		$scope.$on('isHpfilter',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId=params.sheetId;	
			});
			$scope.$apply();
		});

		$scope.$on('colseHpfilter',function(data) {
			that.isShow = false;
			that.datas=null;
		});
	}
})();