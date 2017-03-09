(function() {
	'use strict';
	angular
		.module('pf.indicator')
		.controller('regressionCtrl',regressionCtrl)
		.directive('regression',regression);

	regression.$inject = [];
	function regression() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/regression.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.regressionGo = function(params) {
					dataService.get('lr',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'lr');
						var result = {'analysis_lr':response}
						sessionStorage.setItem('analysis_lr',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_lr';
						window.open(target_url);
						that.close();
					});
				}
				that.close = function() {
					$scope.$emit('colseRegression');
				}
			},
			controllerAs:'regression',
			scope:{data:'='},
			link:function(scope,element,attr,regression) {
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
						'dept' : 0,
						'deptname':'',
						'indept':[],
						'methodName':'',
						'methodId':'',
						'consts':1,
						'fmclx':'90%',
						'rcclx':'90%',
						'fmcl':0.9,
						'rccl':0.9,
						'savingitems':[],
						'coefitems':[]
				};
			    scope.$watch('data',function(data) {
			    	if(data===undefined||data===null) {
			    		return false;
			    	}
			    	scope.selectRecord.deptname='请选择';
			    	scope.selectRecord.methodId=data.methods[0].methodId;
			    	scope.selectRecord.methodName=data.methods[0].methodName;
			    });

			    //选择因变量
				scope.selectDept = function(index,name) {
					scope.selectRecord.dept = index;
					scope.selectRecord.deptname = name;
					$('.ybl ul').hide();
				}

			    scope.selectIndept =function(index) {
			    	var isset=scope.selectRecord.indept.indexOf(index);
					if(isset===-1) {
						scope.selectRecord.indept.push(index);
					} else {
						scope.selectRecord.indept.splice(isset,1);
					}
			    }

			    //选择方法
				scope.selectMethod = function(id,name) {
					scope.selectRecord.methodId = id;
					scope.selectRecord.methodName = name;
					$('.select-ways ul').hide();
				}

				//展开参数设置
				scope.showParams = function() {
					if($('.params-set-contents').css('display')=='none') {
						$('.params-set-contents').show();
						$('.zbl').css('height','100px');
					} else {
						$('.params-set-contents').hide();
						$('.zbl').css('height','200px');
					}
				}
				scope.selectFmcl = function(num1,num2,type) {
					if(type=='fmcl') {
						scope.selectRecord.fmcl=num1;
						scope.selectRecord.fmclx=num2;
					} else if(type=='rccl') {
						scope.selectRecord.rccl=num1;
						scope.selectRecord.rcclx=num2;
					}
					$('.zxsp ul').hide();
				}
				scope.savingItems = function(str) {
					var isset=scope.selectRecord.savingitems.indexOf(str);
					if(isset===-1) {
						scope.selectRecord.savingitems.push(str);
					} else {
						scope.selectRecord.savingitems.splice(isset,1);
					}
				}
				scope.coefItems = function(str) {
					var isset=scope.selectRecord.coefitems.indexOf(str);
					if(isset===-1) {
						scope.selectRecord.coefitems.push(str);
					} else {
						scope.selectRecord.coefitems.splice(isset,1);
					}
				}


				//满足条件启用确定按钮
				scope.startButton = function() {
					if(scope.selectRecord.dept==0) {
						return false;
					}
					if(scope.selectRecord.indept.length==0) {
						return false;
					}
					if(scope.selectRecord.indept.indexOf(scope.selectRecord.dept)!==-1) {
						return false;
					}
					if(scope.selectRecord.methodId=='') {
						return false;
					}
				}
				
				
				
				scope.regressionGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params= {
							'coefitems'  :  scope.selectRecord.coefitems,
							'const'      :  scope.selectRecord.consts,
							'dept'       :  scope.selectRecord.dept,
							'fmcl'       :  scope.selectRecord.fmcl,
							'indepts'    :  scope.selectRecord.indept,
							'method'     :  scope.selectRecord.methodId,
							'rccl'       :  scope.selectRecord.rccl,
							'savingitems':  scope.selectRecord.savingitems,
							'sheetId'    :  scope.data.sheetId
					};
					regression.regressionGo(params);			
				}


			    scope.showList = function(str,e) {
			    	if($(str).find('ul').css('display')=='none') {
						$(str).find('ul').show();
					} else {
						$(str).find('ul').hide();
					}
			    }

			    scope.close = function() {
			    	regression.close();
			    }
			}
		};
	}
	
	regressionCtrl.$inject = ['$scope', 'dataService']
	function regressionCtrl($scope, dataService) {
		var that = this;
		that.isShow =false;

		$scope.$on('isShowRegression',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;	
				that.datas.sheetId=params.sheetId;			
			});

			$scope.$apply();
		});
		
		$scope.$on('colseRegression',function(data) {
			that.isShow = false;
			that.datas=null;
		});
	}
})();