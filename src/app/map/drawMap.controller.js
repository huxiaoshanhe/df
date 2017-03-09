(function () {
	'use strict';
	angular
	    .module('pf.directive')
	    .controller('drawMapCtrl', drawMapCtrl);

	drawMapCtrl.$inject = ['$scope', 'sheetService', 'dataService', '$interval', 'errorService', 'coreCF'];
	function drawMapCtrl($scope, sheetService, dataService, $interval, errorService, config) {
		var that = this;
		that.show = false;	
		that.switch = false;
		that.allAreaData = [];
		that.minVal = 0;
        that.maxVal = 0;
		that.selectRecord = {};
		that.currentColor='#fe0100';
		var _spk = config.spreadKey;

		
		/**监听是否开启地图功能，是则初始化地图**/
		$scope.$on('showMap',function(data){
			that.show = true;
			mapInit();	
			$scope.$apply();
		});

		/**监听是否有数据维度变化**/
		$scope.$on(_spk.sheetChange, function(e, sheet) {
	      if(that.show===true) {
	      	mapInit()
	      }
	    });

		/**初始化地图数据**/
		function mapInit() {
			$interval.cancel(that.timePlay);
			that.switch = false;
			var sheetId = sheetService.getSheetId();
			dataService.get('newMapInit',{'sheetId':sheetId}).then(function(source){
				that.dept = source[0].indicator;
				that.times = source[0].time;
				that.selectRecord.indicator = that.dept[0].code;
				that.selectRecord.indicatorName = that.dept[0].name;
				that.selectRecord.indicatorFullName = that.dept[0].mgName;
				that.selectRecord.time=that.times[0].code;
				that.selectRecord.timeName=that.times[0].name;
				timeLine(that.times);
				getData(sheetId,that.selectRecord.indicator,that.selectRecord.time);
				return source;
			 });
		}

		/**获取地图数据
		 *@param sheetId[string] 当前表的sheetId
		 *@param indicator[string] 当前选中的指标code
		 *@param time[string] 当前选中的时间code
		 */
		function getData(sheetId,indicator,time) {
			var params = {
					'sheetId':sheetId,
					'indicatorId':indicator,
					'timeCode':time
			}
			dataService.get('newMap', params).then(function(source) {
	 	        	/*if(source.mapBOList.length===0){
	 	        		errorService.showError('请选择地区维度！');
	 	        		that.close();
	 	        		return false;
	 	        	}*/
	 	        	that.mapData = {
	 	        		allAreaData : source.mapBOList,
	 	        		minVal:source.allMinVal,
	 	        		maxVal:source.allMaxVal,
	 	        		color:that.currentColor,
	 	        		indicatorName:that.selectRecord.indicatorName,
	 	        		timeName:that.selectRecord.timeName
	 	        	};
	 	        	if(that.mapData.allAreaData.length===0) {
	 	        		that.mapData.allAreaData[0] = {datas:[],date:that.time};
	 	        	}
	 	        	return source;
	 	     }).catch(function(error) {
	 	    	 errorService.showError(error);
	 	    	 return false;
	 	     });
		}

		/**
		 *时间轴开关
		 *@param flag[boolean] true则是已开启，通知关闭；false则是已关闭，通知开启
		 */
		that.timeSwitch = function(flag) {
			that.switch = !flag;
			if(flag===false) {
				var num = null;
				angular.forEach(that.times,function(v,k){
					if(v.code===that.selectRecord.time) {
						num = k;
					}
				});
			} else {
				that.cancelPlay = $interval.cancel(that.timePlay);
				return false;
			}

			that.timePlay = $interval(function(){
				that.selectRecord.time = that.times[num].code;
				that.selectRecord.timeName = that.times[num].name
				if(num>=7&&num<that.times.length-1) {
					that.timeListInnerStyle.marginLeft=-80*(num-6)+'px';
				}else if(num>=7&&num===that.times.length-1) {
					that.timeListInnerStyle.marginLeft=-80*(num-7)+'px';
				} else {
					that.timeListInnerStyle.marginLeft='0px';
				}

				var sheetId = sheetService.getSheetId();
				getData(sheetId,that.selectRecord.indicator,that.selectRecord.time);
				num+=1;				
				if(num===that.times.length) {
					num=0;
				}
			},2000);
		}

		/**上一个时间，并停止时间轴播放**/
		that.timePrev = function() {
			var num = null;
			$interval.cancel(that.timePlay);
			angular.forEach(that.times,function(v,k){
				if(v.code===that.selectRecord.time) {
					num = k;
				}
			});
			num=num-1;
			if(num<0) {
				num=0;
			}
			that.reDrawMap(that.times[num].code,'timeChange');
			
		}

		/**下一个时间，并停止时间轴播放**/
		that.timeNext = function() {
			var num = null;
			$interval.cancel(that.timePlay);
			angular.forEach(that.times,function(v,k){
				if(v.code===that.selectRecord.time) {
					num = k;
				}
			});
			num=num+1;
			if(num>that.times.length-1) {
				num=that.times.length-1;
			}
			that.reDrawMap(that.times[num].code,'timeChange');	
		}

		/**
		 *当时间或指标改变时，重新绘制地图
		 *@param code[string] 时间或指标code
		 *@param type[string] 判断是时间改变还是指标改变
		 **/
		that.reDrawMap = function(code,type) {			
			that.switch = false;
			$interval.cancel(that.timePlay);
			if(type==='deptChange') {
				that.selectRecord.indicator = code;
				angular.forEach(that.dept,function(v,k) {
					if(v.code===code) {
						that.selectRecord.indicatorName=v.name;
						that.selectRecord.indicatorFullName = v.mgName;
					}
				});
				var sheetId = sheetService.getSheetId();
				getData(sheetId,that.selectRecord.indicator,that.selectRecord.time);
			} else if(type='timeChange') {
				that.selectRecord.time=code;
				var sheetId = sheetService.getSheetId();
				getData(sheetId,that.selectRecord.indicator,that.selectRecord.time);
				angular.forEach(that.times,function(v,k) {
					if(v.code===code) {
						if(k>=7&&k<that.times.length-1) {
							that.timeListInnerStyle.marginLeft=-80*(k-6)+'px';
						}else if(k>=7&&k===that.times.length-1) {
							that.timeListInnerStyle.marginLeft=-80*(k-7)+'px';
						} else {
							that.timeListInnerStyle.marginLeft='0px';
						}
						that.selectRecord.timeName = v.name;
					}
				});
			}			
		}

		/**关闭地图**/
		that.close = function() {
			that.switch = false;
			that.show = false;
			$interval.cancel(that.timePlay);
		}

		/**改变颜色并重新绘制地图**/
		that.selectColor = function(color) {
			that.currentColor = color;
			that.colorOpen=false;
			var sheetId = sheetService.getSheetId();
			getData(sheetId,that.selectRecord.indicator,that.selectRecord.time);
		}
		
		/**初始化时，时间轴样式**/
		function timeLine(times) {
			if(times.length<=8) {
				that.timeLineStyle = {
					width:(times.length-1)*80+'px'
				}
				that.timeListStyle= {
					width:times.length*80+'px'
				}
			} else {
				that.timeLineStyle = {
					width:'560px'
				}
				that.timeListStyle= {
					width:'640px'
				}
			}
			that.timeListInnerStyle= {
				width:times.length*80+'px'
			}
		}
	}
})();