(function() {
	'use strict';
	angular
	.module('pf.indicator')
	.controller('preanalysisCtrl',preanalysisCtrl)
	.directive('preAnalysis',preAnalysis);

	preAnalysis.$inject = [];
	function preAnalysis() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/preanalysis.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.preAnalysisGo = function(params) {
					dataService.get('preanalysis',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'preanalysis');
						var result = {'analysis_preanalysis':response}
						sessionStorage.setItem('analysis_preanalysis',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_preanalysis';
						window.open(target_url);
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colsePreAnalysis');
				}
			},
			controllerAs:'preAnalysis',
			scope:{data:'='},
			link:function(scope,element,attr,preAnalysis) {
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

			    scope.showList = function(params) {
					if($(params).find('ul').css('display')=='none') {
						$(params).find('ul').show();
					} else {
						$(params).find('ul').hide();
					}
				}
				
				scope.selectRecord = {
						'indept'     :   [],
						'method'     :   '',
						'methodName' :   '',
						'iteNum'     :   20,
						'CorreMatrix':   [],
		 		}
				scope.selectIndept = function(index) {
					var isset=scope.selectRecord.indept.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.indept.push(index);
					} else {
						scope.selectRecord.indept.splice(isset,1);
					}
				}
				scope.selectMethod = function(index,name) {
					scope.selectRecord.method = index;
					scope.selectRecord.methodName = name;
					$('.select-method ul').hide();
				}
				scope.selectTimes = function(index) {
					scope.selectRecord.iteNum = index;
					$('.select-times ul').hide();
				}
				scope.selectCorreMatrix = function(name) {
					var isset=scope.selectRecord.CorreMatrix.indexOf(name);
					if(isset===-1) {
						scope.selectRecord.CorreMatrix.push(name);
					} else {
						scope.selectRecord.CorreMatrix.splice(isset,1);
					}
				}
				
				scope.startButton = function() {
					if(scope.selectRecord.indept.length==0) {
						return false;
					}
					if(scope.selectRecord.method == '') {
						return false;
					}
				}
				
				scope.preanalysisGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					
					var params = {
							'varIndexs'   : scope.selectRecord.indept,
							'method'      : scope.selectRecord.method,
							'sheetId'     : scope.data.sheetId,
							'iteNum'      : scope.selectRecord.iteNum,
							'correMatrix' : scope.selectRecord.CorreMatrix
					}	
					preAnalysis.preAnalysisGo(params);				
				}
				scope.close=function() {
					preAnalysis.close();
				}
			}
		}
	}

	preanalysisCtrl.$inject = ['$scope', 'dataService']
	function preanalysisCtrl($scope, dataService) {
		var that = this;		
		that.isShow = false;

		$scope.$on('isPreAnalysis',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});
		
		$scope.$on('colsePreAnalysis',function(data) {
			that.isShow = false;
			that.datas = null;
		});
		
	}
})();