(function() {
	'use strict';
	angular
	.module('pf.indicator')
	.controller('bivarCtrl',bivarCtrl)
	.directive('bivar',bivar);

	bivar.$inject=[];
	function bivar() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/bivar.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.bivarGo = function(params) {
					dataService.get('correlation',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'bivar');
						var result = {'analysis_bivar':response}
						sessionStorage.setItem('analysis_bivar',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_bivar';
						window.open(target_url);
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseBivar');
				}
			},
			controllerAs:'bivar',
			scope:{data:'='},
			link:function(scope,element,attr,bivar) {
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
					'indept' : [],
					'correlations' : [],
					'sign' : 2
				}


				scope.selectIndept = function(index) {
					var isset=scope.selectRecord.indept.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.indept.push(index);
					} else {
						scope.selectRecord.indept.splice(isset,1);
					}
				}
				
				scope.selectCorrelations = function(str) {
					var isset=scope.selectRecord.correlations.indexOf(str);
					if(isset===-1) {
						scope.selectRecord.correlations.push(str);
					} else {
						scope.selectRecord.correlations.splice(isset,1);
					}
				}
				scope.startButton = function(){
					if(scope.selectRecord.indept.length==0) {
						return false;
					}
					if(scope.selectRecord.correlations.length==0) {
						return false;
					}
				}
				
				scope.bivarGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params= {
							'variables'   :  scope.selectRecord.indept,
							'fmcl'        :  0.95,
							'sign'        :  scope.selectRecord.sign,
							'correlations':  scope.selectRecord.correlations,
							'sheetId'     :  scope.data.sheetId,
							'action'      :  'bivar'
					}					
					
					bivar.bivarGo(params);
				}

				scope.close = function() {
					bivar.close();
				}
			}

		}
	}

	bivarCtrl.$inject = ['$scope', 'dataService']
	function bivarCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;
		$scope.$on('isBivar',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId=params.sheetId;		
			});
			$scope.$apply();
		});
		
		
		$scope.$on('colseBivar',function(data) {
			that.isShow = false;
			that.datas=null;
		});
		
		
	}
})();