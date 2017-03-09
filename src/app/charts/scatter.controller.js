(function() {
	'use strict';
	angular
    .module('pf.indicator')
    .controller('scatterCtrl', scatterCtrl);
	
	scatterCtrl.$inject = ['$rootScope', 'dataService', 'coreCF', 'sheetService', '$http'];
	function scatterCtrl($rootScope, dataService, config, sheetService, $http) {
		var _spk = config.spreadKey;
		var _chartCache = {}; // 图表缓存
		var that = this;
		var params = {
				'sheetId':$rootScope.charts.sheetId,
				'action' :'regression'
		}
		dataService.get('variable',params).then(function(response) {
			that.indicator = response.deptVars;
		});
		
		that.dept=null;
		that.selectDept = function(num,name) {
			that.dept=num;
			var arr = name.split(':');
			that.deptName=arr[1];
		}
		that.indept = [];
		that.indeptName=[];
		that.selectIndept = function(num,name) {
			/*var isset=that.indept.indexOf(num);
			if(isset===-1) {
				that.indept.push(num);
			} else {
				that.indept.splice(isset,1);
			}*/
			that.indept = [num];
			that.indeptName=[name];
			

			/*var isset2=that.indeptName.indexOf(name);
			if(isset2===-1) {
				that.indeptName.push(name);
			} else {
				that.indeptName.splice(isset2,1);
			}*/
		}
		
		that.startButton = function() {
			if(that.dept===null) {
				return false;
			}
			if(that.indept.length===0) {
				return false;
			}
			if(that.indept.indexOf(that.dept)!==-1) {
				return false;
			}
			if(that.indept.indexOf(0)!==-1) {
				return false;
			}
		}

		/*function repeatDeal(arr) {
			for(var i=0;i<arr.length;i++) {
				var a = 0;
				for(var j=i+1;j<arr.length;j++) {
					if(arr[i]===arr[j]) {
						a=a+1;
						arr[j]=arr[j]+'('+a+')';
					}
				}
			}
			return arr;
		}*/
		
		that.scatterGo = function() {
			if(that.startButton()==false) {
				return false;
			}
			if(that.indept.length>0) {
				var yStr='';
				for(var i=0;i<that.indept.length;i++) {
					yStr=yStr+that.indept[i]+',';
				}
				yStr=yStr.substring(0,yStr.length-1); 
			} else if(that.indept.length=0) {
				var yStr=that.indept[0];
			}
			var params = {
					'sheetId':$rootScope.charts.sheetId,
					'xStr':that.dept,
					'yStr':yStr
			}
			
			that.selectIndicatorTitle=[];
			for(var i=0;i<that.indeptName.length;i++) {
				var arr=that.indeptName[i].split(':');
				that.selectIndicatorTitle.push(arr[1]);
			}
			
			

			dataService.get('pointCharts', params).then(function(source) {
				//that.selectIndicatorTitle = repeatDeal(that.selectIndicatorTitle);//指标名称重复处理
	    		angular.forEach(source.series,function(val,key) {
	    			val.name = that.selectIndicatorTitle[key];
	    		});	
				
				var option = {
					    title : {
					        text: that.deptName,
					        x:'center',
				        	y:'bottom',
				        	textStyle:{
				        		fontSize: 14,
							    fontWeight: 'bold',
							    color: '#333'
				        	}
					    },
					    tooltip : {
					        trigger: 'axis',
					        showDelay : 0,
					        formatter : function (params) {
					            if (params.value.length > 1) {
					                return params.seriesName + ' :<br/>'
					                   + params.value[0]+','
					                   + params.value[1];
					            }
					            else {
					                return params.seriesName + ' :<br/>'
					                   + params.name + ' : '
					                   + params.value ;
					            }
					        },  
					        axisPointer:{
					            show: true,
					            type : 'cross',
					            lineStyle: {
					                type : 'dashed',
					                width : 1
					            }
					        }
					    },
					    legend: {
					        data:that.selectIndicatorTitle,
					        x:'left',
					        y:'15%',
					        itemWidth:0,
					        itemHeight:0,
					        textStyle:{
				        		fontSize: 14,
							    fontWeight: 'bold',
							    color: '#333'
				        	}
					    },
					    toolbox: {
					        show : true,
					        orient : 'vertical',
				        	x: 'right',
				        	y: 'center',
					        feature : {
					            mark : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    grid:{
					    	x2: '5%',
						    y2: '15%',
						    x: '10%',
						    y: '20%'
					    },
					    xAxis : [
					        {
					            type : 'value',
					            scale:true,
					            axisLabel : {
					                formatter: '{value}'
					            }
					        }
					    ],
					    yAxis : [
					        {
					            type : 'value',
					            scale:true,
					            axisLabel : {
					                formatter: '{value}'
					            },

					        }
					    ],
					    series:source.series
					};
				
				
				
		        var chart = {'type': 'scatter', 'data': option};
		        var sheetId = sheetService.getSheetId();
		        _chartCache[sheetId] = chart; // 缓存上

		        $rootScope.$broadcast(_spk.chartsChange, chart);
		        return option;
		    });
			$('.ngdialog-content').hide();
			$('.ngdialog-overlay').hide();
			$('.ngdialog').hide();
		}
	}
})();