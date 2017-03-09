(function() {
	'use strict';
	angular
	    .module('pf.indicator')
	    .controller('expsmoothCtrl', expsmoothCtrl)
	    .directive('expsmooth',expsmooth);
    expsmooth.$inject = [];
    function expsmooth() {
    	return {
			restrict:'E',
			replace:true,
			templateUrl:'app/template/analysis/expsmooth.html',
			controller:function($scope,dataService,sheetService) {
				var that = this;
				that.expsmoothGo = function(params) {
					dataService.get('expsmooth',params).then(function(response) {
						sheetService.clear('refresh', params.sheetId, 'expsmooth');	
						var result = {'analysis_expsmooth':response}
						sessionStorage.setItem('analysis_expsmooth',JSON.stringify(result));
						var url = window.location.href;
						var arr = url.split('#');
						var target_url = arr[0]+'result.html?#analysis_expsmooth';
						window.open(target_url);
					});			
					that.close();
				}
				that.close = function() {
					$scope.$emit('colseExpsmooth');
				}
			},
			controllerAs:'expsmooth',
			scope:{data:'='},
			link:function(scope,element,attr,expsmooth) {
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
						'indeptIndex'        : 0,
						'indeptName'         : '',
						'method'             : 0,
						'methodName'         : '',
						'startSection'       : '',
						'startSectionName'   : '',
						'endSection'         : '',
						'endSectionName'     : '',
						'forecastSection'    : '',
						'forecastSectionName': '',
						'hasAlpha'           : false,
						'hasBeta'            : false,
						'hasGamma'           : false,
						'alpha'              : '',
						'beta'               : '',
						'gamma'              : '',
						'fmcl'               : 0.9,
						'fmclx'              : '90%',
						'deptTrans'          : 'NONE',
						'endtime'            : [],
						'pretime'            : []
				}
				
				scope.selectIndept = function(index,name) {
					scope.selectRecord.indeptIndex=index;
					scope.selectRecord.indeptName=name;
					$('.ybl ul').hide();
				}
				scope.selectMethod = function(index,name) {
					scope.selectRecord.method=index;
					scope.selectRecord.methodName=name;
					$('.xff ul').hide();
				}
				scope.selectBeginTime = function(index,name) {
					var dataLength = scope.data.sampleSections.length-1;
					if(parseInt(index)===parseInt(scope.data.sampleSections[dataLength].timeCode)) {
						index=scope.data.sampleSections[dataLength-1].timeCode;
						name=scope.data.sampleSections[dataLength-1].name;
					}
					scope.selectRecord.startSection=index;
					scope.selectRecord.startSectionName=name;
					$('.fanweis ul').hide();
					scope.selectRecord.endtime=[];
					scope.selectRecord.pretime=[];
					angular.forEach(scope.data.sampleSections,function(e,k){
						if(parseInt(e.timeCode)>parseInt(index)) {
							scope.selectRecord.endtime.push(e);
						}
						if(parseInt(e.timeCode)>(parseInt(index)+1000000)) {
							scope.selectRecord.pretime.push(e);
						}
					});
					if(scope.data.freqId===1) {
						var timeLength = scope.selectRecord.pretime.length-1;
						if(timeLength>=0) {
							for(var i=1;i<6;i++) {
								var obj = {};
								obj.timeCode = parseInt(scope.selectRecord.pretime[timeLength].timeCode)+1000000*i;
								obj.name = parseInt(scope.selectRecord.pretime[timeLength].name.substr(0,4))+i+'年';
								scope.selectRecord.pretime.push(obj);
							}
						} else {
							for(var i=1;i<6;i++) {
								var obj = {};
								obj.timeCode = parseInt(index)+1000000*i;
								obj.name = parseInt(name.substr(0,4))+i+'年';
								scope.selectRecord.pretime.push(obj);
							}
						}
					} else if(scope.data.freqId===3) {
						var timeLength = scope.selectRecord.pretime.length-1;
						if(timeLength>=0) {
							var str = scope.selectRecord.pretime[timeLength].timeCode;
						} else {
							var str = index;
						}
						var year = parseInt(str.substr(0,4));
						var quarter = str.substr(4,2);
						scope.selectRecord.pretime[timeLength+1]={};
						scope.selectRecord.pretime[timeLength+2]={};
						scope.selectRecord.pretime[timeLength+3]={};
						scope.selectRecord.pretime[timeLength+4]={};
						switch(quarter){
							case '01':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'040103';
								scope.selectRecord.pretime[timeLength+1].name=year+'年2季度';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'070103';
								scope.selectRecord.pretime[timeLength+2].name=year+'年3季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'100103';
								scope.selectRecord.pretime[timeLength+3].name=year+'年4季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年1季度';
							break;
							case '04':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'070103';
								scope.selectRecord.pretime[timeLength+1].name=year+'年3季度';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'100103';
								scope.selectRecord.pretime[timeLength+2].name=year+'年4季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年1季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'040103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年2季度';
								break;
							case '07':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'100103';
								scope.selectRecord.pretime[timeLength+1].name=year+'年4季度';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+2].name=year+1+'年1季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'040103';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年2季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'070103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年3季度';
								break;
							case '10':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+1].name=year+1+'年1季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'040103';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年2季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'070103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年3季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'100103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年4季度';
								break;
						}		
					} else if(scope.data.freqId===4) {
						var timeLength = scope.selectRecord.pretime.length-1;
						if(timeLength>=0) {
							var str = scope.selectRecord.pretime[timeLength].timeCode;							
						} else {
							var str = index;
						}
						var year = parseInt(str.substr(0,4));
						var month = str.substr(4,2);
						scope.selectRecord.pretime[timeLength+1] = {};
						scope.selectRecord.pretime[timeLength+2] = {};
						scope.selectRecord.pretime[timeLength+3] = {};
						scope.selectRecord.pretime[timeLength+4] = {};
						scope.selectRecord.pretime[timeLength+5] = {};
						scope.selectRecord.pretime[timeLength+6] = {};
						scope.selectRecord.pretime[timeLength+7] = {};
						scope.selectRecord.pretime[timeLength+8] = {};
						scope.selectRecord.pretime[timeLength+9] = {};
						scope.selectRecord.pretime[timeLength+10] = {};
						scope.selectRecord.pretime[timeLength+11] = {};
						scope.selectRecord.pretime[timeLength+12] = {};
						switch(month){
							case '01':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'020104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年2月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'030104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年3月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'040104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年5月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+9].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+10].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+11].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年1月';
							break;
							case '02':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'030104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年3月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'040104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年5月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+9].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+10].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年1月';
								break;
							case '03':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'040104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年5月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+9].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+10].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+11].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+12].name=year+'年4月';
								break;
							case '04':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年5月';							
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年4月';
								break;
							case '05':
															
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年5月';
								break;
							case '06':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年6月';
								break;
							case '07':
								
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年7月';
								break;
							case '08':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年8月';
								break;
							case '09':
								
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年9月';
								break;
							case '10':							
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年9月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'100104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年10月';
								break;
							case '11':							
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+2].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年9月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'100104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年10月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'110104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年11月';
								break;
							case '12':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+1].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+2].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年9月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'100104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年10月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'110104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年11月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'120104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年12月';
								break;
							}
					}
					scope.selectRecord.endSection = scope.selectRecord.endtime[0].timeCode;
					scope.selectRecord.endSectionName =scope.selectRecord.endtime[0].name;
					scope.selectRecord.forecastSection = scope.selectRecord.pretime[0].timeCode;
					scope.selectRecord.forecastSectionName =scope.selectRecord.pretime[0].name;
				}
				scope.selectEndTime = function(index,name) {
					scope.selectRecord.endSection=index;
					scope.selectRecord.endSectionName=name;
					$('.fanweie ul').hide();
					scope.selectRecord.pretime=[];
					angular.forEach(scope.data.sampleSections,function(e,k){
						if(parseInt(e.timeCode)>parseInt(index)) {
							scope.selectRecord.pretime.push(e);
						}
					});
					if(scope.data.freqId===1) {
						var timeLength = scope.selectRecord.pretime.length-1;
						if(timeLength>=0) {
							for(var i=1;i<6;i++) {
								var obj = {};
								obj.timeCode = parseInt(scope.selectRecord.pretime[timeLength].timeCode)+1000000*i;
								obj.name = parseInt(scope.selectRecord.pretime[timeLength].name.substr(0,4))+i+'年';
								scope.selectRecord.pretime.push(obj);
							}
						} else {
							for(var i=1;i<6;i++) {
								var obj = {};
								obj.timeCode = parseInt(index)+1000000*i;
								obj.name = parseInt(name.substr(0,4))+i+'年';
								scope.selectRecord.pretime.push(obj);
							}
						}
					} else if(scope.data.freqId===3) {
						var timeLength = scope.selectRecord.pretime.length-1;
						if(timeLength>=0) {
							var str = scope.selectRecord.pretime[timeLength].timeCode;
						} else {
							var str = index;
						}
						var year = parseInt(str.substr(0,4));
						var quarter = str.substr(4,2);
						scope.selectRecord.pretime[timeLength+1]={};
						scope.selectRecord.pretime[timeLength+2]={};
						scope.selectRecord.pretime[timeLength+3]={};
						scope.selectRecord.pretime[timeLength+4]={};
						switch(quarter){
							case '01':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'040103';
								scope.selectRecord.pretime[timeLength+1].name=year+'年2季度';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'070103';
								scope.selectRecord.pretime[timeLength+2].name=year+'年3季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'100103';
								scope.selectRecord.pretime[timeLength+3].name=year+'年4季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年4季度';
							break;
							case '04':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'070103';
								scope.selectRecord.pretime[timeLength+1].name=year+'年3季度';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'100103';
								scope.selectRecord.pretime[timeLength+2].name=year+'年4季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年4季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'040103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年4季度';
								break;
							case '07':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'100103';
								scope.selectRecord.pretime[timeLength+1].name=year+'年4季度';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+2].name=year+1+'年1季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'040103';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年2季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'070103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年3季度';
								break;
							case '10':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+1+'010103';
								scope.selectRecord.pretime[timeLength+1].name=year+1+'年1季度';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'040103';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年2季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'070103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年3季度';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'100103';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年4季度';
								break;
						}		
					} else if(scope.data.freqId===4) {
						var timeLength = scope.selectRecord.pretime.length-1;
						if(timeLength>=0) {
							var str = scope.selectRecord.pretime[timeLength].timeCode;							
						} else {
							var str = index;
						}
						var year = parseInt(str.substr(0,4));
						var month = str.substr(4,2);
						scope.selectRecord.pretime[timeLength+1] = {};
						scope.selectRecord.pretime[timeLength+2] = {};
						scope.selectRecord.pretime[timeLength+3] = {};
						scope.selectRecord.pretime[timeLength+4] = {};
						scope.selectRecord.pretime[timeLength+5] = {};
						scope.selectRecord.pretime[timeLength+6] = {};
						scope.selectRecord.pretime[timeLength+7] = {};
						scope.selectRecord.pretime[timeLength+8] = {};
						scope.selectRecord.pretime[timeLength+9] = {};
						scope.selectRecord.pretime[timeLength+10] = {};
						scope.selectRecord.pretime[timeLength+11] = {};
						scope.selectRecord.pretime[timeLength+12] = {};
						switch(month){
							case '01':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'020104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年2月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'030104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年3月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'040104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年5月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+9].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+10].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+11].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年1月';
							break;
							case '02':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'030104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年3月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'040104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年5月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+9].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+10].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年1月';
								break;
							case '03':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'040104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年5月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+9].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+10].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+11].name=year+'年4月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+12].name=year+'年4月';
								break;
							case '04':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'050104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年5月';							
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+8].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年4月';
								break;
							case '05':
															
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'060104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年6月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+7].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年5月';
								break;
							case '06':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'070104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年7月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+6].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年6月';
								break;
							case '07':
								
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'080104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年8月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+5].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年7月';
								break;
							case '08':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'090104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年9月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+4].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年8月';
								break;
							case '09':
								
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'100104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年10月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+3].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年9月';
								break;
							case '10':							
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'110104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年11月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+2].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年9月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'100104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年10月';
								break;
							case '11':							
								scope.selectRecord.pretime[timeLength+1].timeCode=year+'120104';
								scope.selectRecord.pretime[timeLength+1].name=year+'年12月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+2].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年9月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'100104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年10月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'110104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年11月';
								break;
							case '12':
								scope.selectRecord.pretime[timeLength+1].timeCode=year+1+'010104';
								scope.selectRecord.pretime[timeLength+1].name=year+1+'年1月';
								scope.selectRecord.pretime[timeLength+2].timeCode=year+1+'020104';
								scope.selectRecord.pretime[timeLength+2].name=year+1+'年2月';
								scope.selectRecord.pretime[timeLength+3].timeCode=year+1+'030104';
								scope.selectRecord.pretime[timeLength+3].name=year+1+'年3月';
								scope.selectRecord.pretime[timeLength+4].timeCode=year+1+'040104';
								scope.selectRecord.pretime[timeLength+4].name=year+1+'年4月';
								scope.selectRecord.pretime[timeLength+5].timeCode=year+1+'050104';
								scope.selectRecord.pretime[timeLength+5].name=year+1+'年5月';
								scope.selectRecord.pretime[timeLength+6].timeCode=year+1+'060104';
								scope.selectRecord.pretime[timeLength+6].name=year+1+'年6月';
								scope.selectRecord.pretime[timeLength+7].timeCode=year+1+'070104';
								scope.selectRecord.pretime[timeLength+7].name=year+1+'年7月';
								scope.selectRecord.pretime[timeLength+8].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+8].name=year+1+'年8月';
								scope.selectRecord.pretime[timeLength+9].timeCode=year+1+'080104';
								scope.selectRecord.pretime[timeLength+9].name=year+1+'年9月';
								scope.selectRecord.pretime[timeLength+10].timeCode=year+1+'100104';
								scope.selectRecord.pretime[timeLength+10].name=year+1+'年10月';
								scope.selectRecord.pretime[timeLength+11].timeCode=year+1+'110104';
								scope.selectRecord.pretime[timeLength+11].name=year+1+'年11月';
								scope.selectRecord.pretime[timeLength+12].timeCode=year+1+'120104';
								scope.selectRecord.pretime[timeLength+12].name=year+1+'年12月';
								break;
							}
					}
					scope.selectRecord.forecastSection = scope.selectRecord.pretime[0].timeCode;
					scope.selectRecord.forecastSectionName =scope.selectRecord.pretime[0].name;
				}
				scope.selectPreTime = function(index,name) {
					scope.selectRecord.forecastSection=index;
					scope.selectRecord.forecastSectionName=name;
					$('.forecaste ul').hide();
				}
				scope.selectFmcl = function(index,name) {
					scope.selectRecord.fmcl=index;
					scope.selectRecord.fmclx=name;
					$('.zxsp ul').hide();
				}
				scope.startButton = function() {
					if(scope.selectRecord.indeptIndex==0) {
						return false;
					}
					if(scope.selectRecord.method=='') {
						return false;
					}
					if(scope.selectRecord.startSection=='') {
						return false;
					}
				}
				scope.expsmoothGo = function() {
					if(scope.startButton()==false) {
						return false;
					}
					var params = {
							'indeptIndex'    :  scope.selectRecord.indeptIndex,
							'method'         :  scope.selectRecord.method,
							'sheetId'        :  scope.data.sheetId,
							'startSection'   :  scope.selectRecord.startSection,
							'endSection'     :  scope.selectRecord.endSection,
							'forecastSection':  scope.selectRecord.forecastSection,
							'fmcl'           :  scope.selectRecord.fmcl,
							'deptTrans'      :  scope.selectRecord.deptTrans
					}
					if(scope.selectRecord.hasAlpha==true) {
						params.hasAlpha=scope.selectRecord.hasAlpha;
						params.alpha=scope.selectRecord.alpha
					}
					if(scope.selectRecord.hasBeta==true) {
						params.hasBeta=scope.selectRecord.hasBeta;
						params.beta=scope.selectRecord.beta
					}
					if(scope.selectRecord.hasGamma==true) {
						params.hasGamma=scope.selectRecord.hasGamma;
						params.gamma=scope.selectRecord.gamma
					}
					
					expsmooth.expsmoothGo(params);
				}

				scope.close = function(){
					expsmooth.close();
				}
			}
		}
    }

	expsmoothCtrl.$inject = ['$scope', 'dataService'];
	function expsmoothCtrl($scope, dataService) {
		var that = this;
		that.isShow = false;

		$scope.$on('isExpsmooth',function(event,params) {
			that.isShow = true;
			dataService.get('variable',params).then(function(response) {
				that.datas = response;
				that.datas.sheetId = params.sheetId;
			});
			$scope.$apply();
		});
		
		$scope.$on('colseExpsmooth',function(data) {
			that.isShow = false;
			that.datas=null;
		});
		
		
		
	}
})();