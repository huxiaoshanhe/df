(function() {
	'use strict';
	angular
    .module('pf.indicator')
    .controller('aggregationCtrl', aggregationCtrl)
    .directive('aggregation',aggregation);

    aggregation.$inject = [];
    function aggregation() {
    	return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/aggregation.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.aggregationGo = function(method, sheetId, area, frequent) {
					sheetService.aggregationGo(method, sheetId, area, frequent);
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseAggregation');
				}
			},
			controllerAs:'aggr',
			scope:{data:'='},
			link:function(scope,element,attr,aggr) {
				var left = ($(window).width()-510)/2;
				element.css('left',left+'px').css('height','160px');
				$(window).resize(function() {
					var _left = ($(window).width()-510)/2;
					element.css('left',_left+'px');
				});
				//可移动
				element.draggable();
				//可调整大小
				element.resizable({
			      minHeight: 160,
			      minWidth: 510
			    });

			    scope.$watch('data',function(data) {
			    	if(data===undefined||data===null) {
			    		return false;
			    	}
			    	scope.frequentList = data.frequentList;
			    	scope.frequentName = '请选择';
			    });

			    scope.show_frequent = function() {
					$(".aggregation-input ul").toggle();
				}
				scope.frequent='';//为空则禁用提交按钮
				scope.select_frequent = function(value,name) {
					scope.frequentName = name,
					scope.frequent = value;
					$(".aggregation-input ul").hide();
				}
				scope.aggregationGo=function() {
					if(scope.frequent=='') {
						return false;
					}
					aggr.aggregationGo(scope.data.method, scope.data.sheetId, scope.data.area, scope.frequent);					
				}
				scope.close = function() {
					aggr.close();
				}
			}
		}
    }
	
	aggregationCtrl.$inject = ['$scope'];
	function aggregationCtrl($scope) {
		var that = this;
		that.isShow = false;
		$scope.$on('isAggregation',function(event,params) {
			that.isShow = true;
			that.datas = {frequentList:[
                {'name':'年度','value':'1'},
                {'name':'半年度','value':'2'},
                {'name':'季度','value':'3'},
                ],
                sheetId : params.sheetId,
                method :params.method,
                area:params.area
            }
            $scope.$apply();
		});


		$scope.$on('colseAggregation',function(data) {
			that.isShow = false;
			that.datas = null;
		});
		
	}
})();