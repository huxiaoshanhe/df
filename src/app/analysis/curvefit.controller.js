(function() {
	'use strict';
	angular
		.module('pf.indicator')
		.controller('curvefitCtrl',curvefitCtrl)
		.directive('curvefit',curvefit);
	
	curvefit.$inject = [];
	function curvefit() {
		return{
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/curvefit.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.curvefitGo = function(params) {
					dataService.get('curvefit',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'curvefit');	
						var result = {'analysis_curvefit':response}
						sessionStorage.setItem('analysis_curvefit',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_curvefit';
						window.open(target_url);
						that.close();		
					});
				}
				that.close = function() {
					$scope.$emit('colseCurvefit');
				}
			},
			controllerAs:'curvefit',
			scope:{data:'='},
			link:function(scope,element,attr,curvefit) {
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

				scope.selectRecord = {
					'models'   : [],
					'dept'      : 0,
					'deptname'  : '',
					'indept'    : 0,
					'indeptname': '',
					'savingitems':'',
					'fmcl'      : 0.9,
					'fmclx'     : '90%'
				}
			    scope.$watch('data',function(data){
			    	
			    });


			    scope.selectMethod = function(str) {
					var isset=scope.selectRecord.models.indexOf(str);
					if(isset===-1) {
						scope.selectRecord.models.push(str);
					} else {
						scope.selectRecord.models.splice(isset,1);
					}
				}
				
				scope.selectDept = function(index,name) {
					scope.selectRecord.dept=index;
					scope.selectRecord.deptname=name;
					$('.ybl ul').hide();
				}
				scope.selectIndept = function(index,name) {
					scope.selectRecord.indept=index;
					scope.selectRecord.indeptname=name;
					$('.zbl ul').hide();
				}
				scope.selectSaving = function() {
					if(scope.selectRecord.savingitems=='fci') {
						scope.selectRecord.savingitems='';
					} else {
						scope.selectRecord.savingitems='fci';
					}
				}
				scope.selectFmcl = function(index,name) {
					scope.selectRecord.fmcl=index;
					scope.selectRecord.fmclx=name;
					$('.fmcl ul').hide();
				}
				scope.startButton = function() {
					if(scope.selectRecord.dept==0) {
						return false;
					}
					if(scope.selectRecord.indept==scope.selectRecord.dept) {
						return false;
					}
					if(scope.selectRecord.models.length==0) {
						return false;
					}
				}

				scope.curvefitGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params= {
							'dept'       :  scope.selectRecord.dept,
							'fmcl'       :  scope.selectRecord.fmcl,
							'indept'    :  scope.selectRecord.indept,
							'models'      :  scope.selectRecord.models,
							'savingitems':  scope.selectRecord.savingitems,
							'sheetId'    :  scope.data.sheetId
					}

					curvefit.curvefitGo(params);
				}

				scope.close = function() {
			    	curvefit.close();
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


	curvefitCtrl.$inject = ['$scope', 'dataService'];
	function curvefitCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;
		$scope.$on('isCurvefit',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});

		$scope.$on('colseCurvefit',function(data) {
			that.isShow = false;
			that.datas = null;
		});
	}
})();