(function() {
	'use strict';
	angular
	.module('pf.indicator')
	.controller('factoranalysisCtrl',factoranalysisCtrl)
	.directive('factorAnalysis',factorAnalysis);

	factorAnalysis.$inject = [];
	function factorAnalysis() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/factoranalysis.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.factorAnalysisGo = function(params) {
					dataService.get('fanalysis',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'fanalysis');
						var arr = response.factorAnalysisBO.factorInfo.variableCodes;
						var arr2 = [];
						for(var i=1;i<=arr.length;i++) {
							arr2.push(i.toString());
						}
						response.factorAnalysisBO.factorInfo.variableCodes = arr2;
						for(var i=0;i<arr.length;i++){
							if(response.factorAnalysisBO.factorInfo.extractSquaresCumuPercent[i]===0) {
								response.factorAnalysisBO.factorInfo.extractSquaresCumuPercent[i]=null;
							}
							if(response.factorAnalysisBO.factorInfo.extractSquaresTotal[i]===0) {
								response.factorAnalysisBO.factorInfo.extractSquaresTotal[i]=null;
							}
							if(response.factorAnalysisBO.factorInfo.extractSquaresVariancePercent[i]===0) {
								response.factorAnalysisBO.factorInfo.extractSquaresVariancePercent[i]=null;
							}
						};
						var result = {'analysis_fanalysis':response}
						sessionStorage.setItem('analysis_fanalysis',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_fanalysis';
						window.open(target_url);
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseFactoryAnalysis');
				}
			},
			controllerAs:'factoranalysis',
			scope:{data:'='},
			link:function(scope,element,attr,factoranalysis) {
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
						'varIndexs'             :  [],
						'convergenceIteNum'     :  20,
						'resampleIteNum'        :  1,
						'analysis'              :  'RELATIVE_MATRIX',
						'factorNum'             :  null,
						'factorExtractions'     :  '',
						'factorExtractionsName' :  '',
						'facaRotates'           :  '',
						'facaRotatesName'       :  '',
						'facaScores'            :  '',
						'facaScoresName'        :  ''
				}
				
				scope.selectIndept = function(index) {
					var isset=scope.selectRecord.varIndexs.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.varIndexs.push(index);
					} else {
						scope.selectRecord.varIndexs.splice(isset,1);
					}
				}
				scope.selectExtractions = function(index,name) {
					scope.selectRecord.factorExtractions = index;
					scope.selectRecord.factorExtractionsName = name;
					$('.chouqu ul').hide();
				}
				scope.selectRotates = function(index,name) {
					scope.selectRecord.facaRotates = index;
					scope.selectRecord.facaRotatesName = name;
					$('.xuanzhuan ul').hide();
				}
				scope.selectScores = function(index,name) {
					scope.selectRecord.facaScores = index;
					scope.selectRecord.facaScoresName = name;
					$('.scores ul').hide();
				}
				scope.selectResampleIteNum = function(index) {
					scope.selectRecord.resampleIteNum = index;
					$('.ccyddcs ul').hide();
				}
				scope.selectConvergenceIteNum = function(index) {
					scope.selectRecord.convergenceIteNum = index;
					$('.slddcs ul').hide();
				}
				
				scope.startButton = function() {
					if(scope.selectRecord.varIndexs.length==0) {
						return false;
					}
					if(scope.selectRecord.factorNum==null) {
						return false;
					}
					if(scope.selectRecord.factorExtractions=='') {
						return false;
					}
					if(scope.selectRecord.facaRotates=='') {
						return false;
					}
					if(scope.selectRecord.facaScores=='') {
						return false;
					}
				}
				
				scope.factoryAnalysisGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params = {
							'analysis'          :  scope.selectRecord.analysis,
							'convergenceIteNum' :  scope.selectRecord.convergenceIteNum,
							'factorExtractions' :  scope.selectRecord.factorExtractions,
							'factorNum'         :  scope.selectRecord.factorNum,
							'factorRotates'     :  scope.selectRecord.facaRotates,
							'factorScores'      :  scope.selectRecord.facaScores,
							'resampleIteNum'    :  scope.selectRecord.resampleIteNum,
							'sheetId'           :  scope.data.sheetId,
							'varIndexs'         :  scope.selectRecord.varIndexs
					}
					factoranalysis.factorAnalysisGo(params);
				}

				scope.close = function() {
					factoranalysis.close();
				}
			}
		}
	}

	factoranalysisCtrl.$inject = ['$scope', 'dataService'];
	function factoranalysisCtrl($scope, dataService) {
		var that = this;	
		that.isShow = false;

		$scope.$on('isFactorAnalysis',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});

		$scope.$on('colseFactoryAnalysis',function(data) {
			that.isShow = false;
			that.datas = null;
		});
	}
})();