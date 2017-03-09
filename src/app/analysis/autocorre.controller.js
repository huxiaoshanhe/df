(function() {
	'use strict';
	angular
	    .module('pf.indicator')
	    .controller('autocorreCtrl', autocorreCtrl)
	    .directive('autocorre',autocorre);

	autocorre.$inject = [];
	function autocorre() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/autocorre.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.autocorreGo = function(params) {
					dataService.get('autocorre',params).then(function(response) {
						var result = {'analysis_autocorre':response}
						sessionStorage.setItem('analysis_autocorre',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_autocorre';
						window.open(target_url);
					});
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseAutocorre');
				}
			},
			controllerAs:'autocorre',
			scope:{data:'='},
			link:function(scope,element,attr,autocorre) {
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
					'variableIndex':0,
					'variableIndexname':'',
					'seasonal':1,
					'diff':1,
					'output':[],
					'logTrans':false,
					'hasseasonal':0,
					'hasdiff':0,
					'maxlag':5				
				}
				scope.showList = function(params) {
					if($(params).find('ul').css('display')=='none') {
						$(params).find('ul').show();
					} else {
						$(params).find('ul').hide();
					}
				}
				scope.selectIndept = function(index,name) {
					scope.selectRecord.variableIndex = index;
					scope.selectRecord.variableIndexname = name;
					$('.ybl ul').hide();
				}
				scope.onCheckOutput = function(str) {
					var isset=scope.selectRecord.output.indexOf(str);
					if(isset===-1) {
						scope.selectRecord.output.push(str);
					} else {
						scope.selectRecord.output.splice(isset,1);
					}
				}
				scope.selectMaxlag = function(num) {
					scope.selectRecord.maxlag = num;
					$('.zhjs ul').hide();
				}
				scope.startButton = function() {
					if(scope.selectRecord.variableIndex==0) {
						return false;
					}
					if(scope.selectRecord.output.length==0) {
						return false;
					}
				}
				scope.autocorreGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params = {
						'variableIndex' :	scope.selectRecord.variableIndex,
						'output'        :   scope.selectRecord.output,
						'maxlag'        :   scope.selectRecord.maxlag,
						'seasonal'      :   scope.selectRecord.seasonal,
						'diff'          :   scope.selectRecord.diff,
						'logTrans'      :   scope.selectRecord.logTrans,
						'sheetId'       :   scope.data.sheetId
					}
					if(scope.selectRecord.hasseasonal!==0) {
						params.hasseasonal = scope.selectRecord.hasseasonal;
					}
					if(scope.selectRecord.hasdiff!==0) {
						params.hasdiff = scope.selectRecord.hasdiff;
					}
					
					autocorre.autocorreGo(params);
				}

				scope.close = function() {
					autocorre.close();
				}
			}
		}
	}
	
	autocorreCtrl.$inject = ['$scope', 'dataService'];
	function autocorreCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;
		$scope.$on('isAutocorre',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});
		
		$scope.$on('colseAutocorre',function(data) {
			that.isShow = false;
			that.datas = null;
		});
	}
})();