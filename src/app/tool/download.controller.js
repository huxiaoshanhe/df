(function() {
	'use strict';
	angular
		.module('pf.indicator')
		.controller('downloadCtrl',downloadCtrl);
	
	downloadCtrl.$inject = ['dataService', 'sheetService', 'coreCF', 'errorService'];
	function downloadCtrl(dataService, sheetService, config, errorService) {
		var that = this;
		var user = dataService.getItem('_user');
		var params = {
				'userId' : user.id
		}
		that.selectRecord = {
				type : ''
		}
		that.getparentId = function(index) {
			that.selectRecord.parentId = index;
		}
		that.startButton = function() {
			if(that.selectRecord.typeid == '') {
				return false;
			}
		}
		that.downloadGo = function() {
			if(that.startButton==false) {
				return false;
			}			
			
			var sheetId = sheetService.getSheetId();
			//dataService.get('download',{'action':'table','sheetId':sheetId,'type':that.selectRecord.type,'exportType':that.selectRecord.type}).then(function(data){
				//下载成功后记录指标下载次数
				dataService.get('newMapInit',{'sheetId':sheetId}).then(function(source) {
					that.indicators = source[0].indicator;
					var codes='';
					
					for(var i=0;i<that.indicators.length;i++) {
						var params2={code:that.indicators[i].code,upField:'download'};
						$.ajax({
							type:'GET',
							url:config.mainUrl+'update/upindic',
							data:params2,
							success:function(data){return data;}
						});
						if(i==that.indicators.length-1) {
							codes+=that.indicators[i].code;
						} else {
							codes+=that.indicators[i].code+',';
						}
					}
					return source;
				});
				location.href=config.baseUrl+config.urlMap.download+'?action=table&sheetId='+sheetId+'&type='+that.selectRecord.type+'&exportType='+that.selectRecord.type;
			/*	return data;
			}).catch(function(error) {
		    	errorService.showError(error);
		    });*/
			
			$('.ngdialog-content').hide();
			$('.ngdialog-overlay').hide();
			$('.ngdialog').hide();
		}
	}
})();