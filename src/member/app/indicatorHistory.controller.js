app.controller('indicatorHistoryCtrl', indicatorHistoryCtrl);
indicatorHistoryCtrl.$inject = [ '$scope', 'dataService' ];
function indicatorHistoryCtrl($scope, dataService) {
	var that = this;
	that.lists = [];
	var latestSheet = dataService.getItem('logData');
	if (latestSheet.length !== undefined) {
		latestSheet = latestSheet.reverse();
	}
	for (var i = 0; i < latestSheet.length; i++) {
		var item = {
			name : latestSheet[i].name,
			time : latestSheet[i].checkTime
		};
		that.lists.push(item);
	}
	that.delete = function(num) {
		var params = {type:'delete',eventCode:num};
		dataService.get('logData',params).then(function(data) {
			that.getIndicatorHistory(null);
		});
	}

	that.getIndicatorHistory = function(collectionCode) {
		var params = {
			type : 'list',
			eventCode : '4'
		}
		dataService.get('logData', params).then(function(data) {
			that.lists = data.entity;
		});
	}
	that.getIndicatorHistory(null);
}