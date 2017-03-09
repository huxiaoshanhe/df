(function() {
	'use strict';
	angular
		.module('pf.indicator')
		.controller('calculatorCtrl',calculatorCtrl)
		.directive('calculators',calculators);

	calculators.$inject = [];
	function calculators() {
		return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/calculator.html',
			scope:{data:'='},
			controller:function($scope, sheetService) {
				var that = this;
				that.calculatorGo = function(str,params) {
					sheetService.calculator(str,params);
					that.close();
				}

				that.clear = function(action,sheetId,type) {					
		    		sheetService.clear(action,sheetId,type);
		    		that.close();
				}

				that.close = function() {
					$scope.$emit('closeCalculator',true);
				}
			},
			controllerAs:'calc',
			link:function(scope,element,attr,calc) {
				var left = ($(window).width()-518)/2;
				element.css('left',left+'px');
				$(window).resize(function() {
					var _left = ($(window).width()-518)/2;
					element.css('left',_left+'px');
				});
				//可移动
				element.draggable();
				//可调整大小
				element.resizable({
			      minWidth: 518,
			      minHeight:525
			    });

			    scope.cobol = '';
				scope.cursorPosition = 0;
				scope.latestnum = '';
				scope.selectRecord = {
						'dept':0
				}
				scope.target_dept = '';

			    scope.$watch('data',function(data) {
			    	if(data===undefined||data===null) {
			    		return false;
			    	}
			    	scope.dept = data.dept;
			    });

			    scope.getCursor = function() {
					scope.cursorPosition = $('#cobol').getCursorPosition();
					scope.latestnum = '';
				}				

				/**
				 * 插入数字(包括小数点)
				 */
				scope.insertNum = function(str) {
					scope.cobol=handleStr(scope.cursorPosition,scope.cobol,str);
					scope.cursorPosition = scope.cursorPosition+str.length;//光标位置向后移动一个字符串的长度
					scope.latestnum+=str;
				}
				
				/**
				 * 插入运算符
				 */
				scope.insertStr = function(str) {
					scope.cobol=handleStr(scope.cursorPosition,scope.cobol,str);
					scope.cursorPosition = scope.cursorPosition+str.length;//光标位置向后移动一个字符串的长度
					scope.latestnum = '';
				}
				
				/**
				 * 插入方法
				 */
				scope.insertFn = function(fn) {
					scope.cobol=handleStr(scope.cursorPosition,scope.cobol,fn);
					scope.cursorPosition = scope.cursorPosition+fn.length-1;//光标位置向后移动一个字符串的长度
					scope.latestnum = '';
				}
				
				/**
				 * 选择变量
				 */
				scope.selectDept = function(str) {
					if(str==0) {
						return false;
					}
					var dept_value = '[s'+str+']';
					scope.cobol = handleStr(scope.cursorPosition,scope.cobol,dept_value);
					scope.cursorPosition = scope.cursorPosition+dept_value.length;//光标位置向后移动一个字符串的长度
					if(scope.selectRecord.dept!==0) {
						scope.selectRecord.dept = 0;
					}
				}
				scope.selectDept2 = function(num) {
					scope.selectRecord.dept = num;
				}
				
				/***
				 * 从指定位置删除字符
				 */
				scope.delStr = function() {
					var ystr = scope.cobol; 
					var num = scope.cursorPosition;
					var ylength = ystr.length;
					var str1 = ystr.substr(0,num-1);
					var str2 = ystr.substr(num,ylength);
					var lastStr = str1+str2;
					if(scope.cursorPosition>0) {
						scope.cursorPosition = scope.cursorPosition-1;
					}
					scope.cobol = lastStr;
				}
				
				/**
				 * 复位
				 */
				scope.reset = function() {
					scope.cobol = '';
					scope.latestnum = '';
					scope.cursorPosition = 0;
				}
				
				/**
				 * 删除最近一次的数字，并重新指定光标位置
				 */
				scope.delLatestnum = function() {
					if(scope.latestnum !== '') {
						var a = scope.cobol.substring(scope.cobol.lastIndexOf(scope.latestnum));
						var b = scope.cobol.substring(0,scope.cobol.lastIndexOf(scope.latestnum));
						var arr = a.split(scope.latestnum);
						scope.cobol = b+arr[1];
						scope.cursorPosition = b.length;
						scope.latestnum = '';
					}			
				}
				
				
				/**
				 * 启动等号
				 */
				scope.startButton = function() {
					if(scope.target_dept==='') {
						return false;
					}
					
					if(scope.cobol ==='') {
						return false;
					} else {
						var pattern = /\[s\d{1,}\]/;
						var str = scope.cobol;			
						var pattern2 = /[\u4E00-\u9FA5]/g;
						if(pattern.test(str)===false||pattern2.test(str)!==false) {
							return false;
						}
					}		
				}
				
				/**
				 * 计算
				 */
				scope.calculatorGo = function() {
					if(scope.startButton() === false) {
						return false;
					}
					var vars='';
					for(var i=0;i<scope.dept.length;i++) {
						if(i==(scope.dept.length-1)) {
							vars += '[s'+scope.dept[i].index+']';
						} else {
							vars += '[s'+scope.dept[i].index+'],';
						}
					}
					var params = {
							'formula':scope.cobol,
							'vars':vars,
							'outName':scope.target_dept,
							'sheetId':scope.data.sheetId
					}
					calc.calculatorGo('highComputor',params);

				}

				scope.clear = function() {
		    		var action='clear',type='computer';
		    		calc.clear(action,scope.data.sheetId,type);
				}

				scope.close = function() {
					calc.close();
				}
				
				
				/**
				 * 获取光标位置
				 */
				$.fn.getCursorPosition = function() {
		            var el = $(this).get(0);
		            var pos = 0;
		            if ('selectionStart' in el) {
		                pos = el.selectionStart;
		            } else if ('selection' in document) {
		                el.focus();
		                var Sel = document.selection.createRange();
		                var SelLength = document.selection.createRange().text.length;
		                Sel.moveStart('character', -el.value.length);
		                pos = Sel.text.length - SelLength;
		            }
		            return pos;
		        }
				
				
				/**
				 * 从光标位置拆分字符串，并与新的字符串连接起来
				 * @param num[num]光标位置
				 * @param ystr[string]原字符串
				 * @param nstr[string]需要插入的字符串
				 * @returns lastStr[string]返回新的字符串
				 */
				function handleStr(num,ystr,nstr) {
					var ylength = ystr.length;
					var str1 = ystr.substr(0,num);
					var str2 = ystr.substr(num,ylength);
					var lastStr = str1+nstr+str2;
					return lastStr;
				}
				
				scope.keyClick = function($event) {
					if(64<$event.keyCode&&$event.keyCode<91) {
						scope.delStr();
					}
				}
			}
		}
	}
	
	calculatorCtrl.$inject = ['$scope', 'sheetService', 'dataService'];
	function calculatorCtrl($scope, sheetService, dataService) {
		
				
		var that = this;
		that.isShow = false;

		$scope.$on('isShowCalculator',function() {
			that.isShow = true;
			var params = {'action':'regression','sheetId':sheetService.getSheetId()};
			dataService.get('variable',params).then(function(source){
				that.datas = {
					dept:source.deptVars,
					sheetId:params.sheetId
				}
			});
			$scope.$apply();
		});
		
		
		$scope.$on('closeCalculator',function(data) {
			that.datas = null;
			that.isShow = false;
		});
		
	}
})();