(function() {
	'use strict';
	angular
	.module('pf.indicator')
	.controller('pcanalysisCtrl',pcanalysisCtrl)
	.directive('pcAnalysis',pcAnalysis);

	pcAnalysis.$inject = [];
	function pcAnalysis() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/pcanalysis.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.pcAnalysisGo = function(params) {
					dataService.get('pcanalysis',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'pcanalysis');
						var arr = response.pcAnalysisBO.pcInfo.variableCodes;
						var arr2 = [];
						for(var i=1;i<=arr.length;i++) {
							arr2.push(i.toString());
						}
						response.pcAnalysisBO.pcInfo.variableCodes = arr2;
						for(var i=0;i<arr.length;i++){
							if(response.pcAnalysisBO.pcInfo.extractSquaresCumuPercent[i]===0) {
								response.pcAnalysisBO.pcInfo.extractSquaresCumuPercent[i]=null;
							}
							if(response.pcAnalysisBO.pcInfo.extractSquaresTotal[i]===0) {
								response.pcAnalysisBO.pcInfo.extractSquaresTotal[i]=null;
							}
							if(response.pcAnalysisBO.pcInfo.extractSquaresVariancePercent[i]===0) {
								response.pcAnalysisBO.pcInfo.extractSquaresVariancePercent[i]=null;
							}
						};

						var result = {'analysis_pcanalysis':response}
						console.log(result);
						sessionStorage.setItem('analysis_pcanalysis',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_pcanalysis';
						window.open(target_url);
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colsepcAnalysis');
				}
			},
			controllerAs:'pcanalysis',
			scope:{data:'='},
			link:function(scope,element,attr,pcanalysis) {
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
						'analysis'      :    'RELATIVE_MATRIX',
						'pcNum'         :    null,
						'pcaRotates'    :    '',
						'pcaRotatesName':    '',
						'pcaScores'     :    '',
						'pcaScoresName' :    '',
						'varIndexs'     :    []
				}
				scope.selectIndept = function(index) {
					var isset=scope.selectRecord.varIndexs.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.varIndexs.push(index);
					} else {
						scope.selectRecord.varIndexs.splice(isset,1);
					}
				}
				scope.selectRotates = function(index,name) {
					scope.selectRecord.pcaRotates = index;
					scope.selectRecord.pcaRotatesName = name;
					$('.xuanzhuan ul').hide();
				}
				scope.selectScores = function(index,name) {
					scope.selectRecord.pcaScores = index;
					scope.selectRecord.pcaScoresName = name;
					$('.scores ul').hide();
				}
				scope.startButton = function() {
					if(scope.selectRecord.varIndexs.length==0) {
						return false;
					}
					if(scope.selectRecord.pcNum==null) {
						return false;
					}
					if(scope.selectRecord.pcaRotates=='') {
						return false;
					}
					if(scope.selectRecord.pcaScores=='') {
						return false;
					}
				}
				scope.pcanalysisGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params = {
							'analysis'   :  scope.selectRecord.analysis,
							'pcNum'      :  scope.selectRecord.pcNum,
							'pcaRotates' :  scope.selectRecord.pcaRotates,
							'pcaScores'  :  scope.selectRecord.pcaScores,
							'sheetId'    :  scope.data.sheetId,
							'varIndexs'  :  scope.selectRecord.varIndexs
					}
					pcanalysis.pcAnalysisGo(params);
				}				
				scope.close = function() {
					pcanalysis.close();
				}
			}
		}
	}

	pcanalysisCtrl.$inject = ['$scope', 'dataService']
	function pcanalysisCtrl($scope, dataService) {
		var that = this;	
		that.isShow = false;

		$scope.$on('isPcanalysis',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});	


		$scope.$on('colsepcAnalysis',function(data) {
			that.isShow = false;
			that.datas=null;
		});
	}
})();