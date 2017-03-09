(function(){
	'use strict';
	angular
		.module('pf.indicator')
		.controller('leastsquaresCtrl',leastsquaresCtrl)
		.directive('leastsquares',leastsquares);

	leastsquares.$inject = [];
	function leastsquares() {
		return{
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/leastsquares.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.leastsquaresGo = function(params) {
					dataService.get('leastSquares',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'leastSquares');
						var result = {'analysis_leastSquares':response}
						sessionStorage.setItem('analysis_leastSquares',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_leastSquares';
						window.open(target_url);
					});	
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseLeastsquares');
				}
			},
			controllerAs:'leastsquares',
			scope:{data:'='},
			link:function(scope,element,attr,leastsquares) {
				var left = ($(window).width()-510)/2;
				var height = element.height()+50;
				element.css('left',left+'px');
				$(window).resize(function() {
					var _left = ($(window).width()-420)/2;
					element.css('left',_left+'px');
				});
				//可移动
				element.draggable();
				//可调整大小
				element.resizable({
			      minHeight: height,
			      minWidth: 510
			    });

			    scope.selectRecord = {
					'dept'      : 0,
					'deptname'  : '',
					'expIndexs' : [],
					'ctrlIndexs': [],
					'consts'    : 0
				}

			    scope.$watch('data',function(data) {

			    });


			    //选择因变量
				scope.selectDept = function(index,name) {
					scope.selectRecord.dept=index;
					scope.selectRecord.deptname=name;
					$('.ybl ul').hide();
				}
				//选择解释变量
				scope.selectexpIndexs = function(index) {
					var isset=scope.selectRecord.expIndexs.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.expIndexs.push(index);
					} else {
						scope.selectRecord.expIndexs.splice(isset,1);
					}
				}
				//选择工具变量
				scope.selectctrlIndexs = function(index) {
					var isset=scope.selectRecord.ctrlIndexs.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.ctrlIndexs.push(index);
					} else {
						scope.selectRecord.ctrlIndexs.splice(isset,1);
					}
				}
				//选择常量
				scope.selectedConst = function() {
					if(scope.selectRecord.consts==0) {
						scope.selectRecord.consts=1;
					} else {
						scope.selectRecord.consts=0;
					}
				}
				//启用提交按钮
				scope.startButton = function() {
					if(scope.selectRecord.dept==0) {
						return false;
					}
					if(scope.selectRecord.expIndexs.indexOf(scope.selectRecord.dept)!==-1) {
						return false;
					}
					if(scope.selectRecord.ctrlIndexs.indexOf(scope.selectRecord.dept)!==-1) {
						return false;
					}
					if(scope.selectRecord.expIndexs.length==0) {
						return false;
					}
					if(scope.selectRecord.ctrlIndexs.length==0) {
						return false;
					}
				}
				scope.leastsquaresGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params= {
							'dept'       :  scope.selectRecord.dept,
							'expIndexs'  :  scope.selectRecord.expIndexs,
							'ctrlIndexs' :  scope.selectRecord.ctrlIndexs,
							'const'      :  scope.selectRecord.consts,
							'sheetId'    :  scope.data.sheetId,
					}
					leastsquares.leastsquaresGo(params);					
				}



			    scope.showList = function(params) {
					if($(params).find('ul').css('display')=='none') {
						$(params).find('ul').show();
					} else {
						$(params).find('ul').hide();
					}					
				}

				scope.close = function() {
					leastsquares.close();
				}
			}
		}
	}
	
	leastsquaresCtrl.$inject = ['$scope', 'dataService'];
	function leastsquaresCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;
		$scope.$on('isLeastsquares',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId=params.sheetId;	
			});
			$scope.$apply();
		});

		$scope.$on('colseLeastsquares',function(data) {
			that.isShow = false;
			that.datas=null;
		});
	}
})();