app.controller('controlHistoryCtrl',controlHistoryCtrl);
controlHistoryCtrl.$inject = ['$scope', '$rootScope', '$http', 'dataService', 'coreCF'];
function controlHistoryCtrl($scope, $rootScope, $http, dataService, config) {
	var that = this;
	function getControlHistory() {
		var latest=[];
	  	var latestSheet =dataService.getItem('nearestCheck');
	  	if(latestSheet.length!==undefined) {
	  		latestSheet=latestSheet.reverse();
	  	}
	  	for(var i=0;i<latestSheet.length;i++) {
	  		var item={name:latestSheet[i].name,time:latestSheet[i].time,codes:latestSheet[i].indicators,cubeId:latestSheet[i].cubeId};
	  		latest.push(item);
	  	}
	  	return latest;
	}
	that.latest = getControlHistory();

	that.delete = function(num) {
		var list = getControlHistory();
		list.splice(num,1);
		dataService.setItem('nearestCheck',list.reverse());
		that.latest = list.reverse();
	}

	that.open = function(num) {
		var arr = dataService.getItem('nearestCheck');
		var _num = that.latest.length-num-1;
		var obj = arr[_num];
		var userData = {dims:{dim:[{codeName:'indicatorCode',codes:obj.indicators}]},productID:'1'};
	  	userData = JSON.stringify(userData);
		setcookie('userData',userData,config.domainUrl);
		location.href=config.baseUrl;
	}

	function setcookie(name,value,domain){
       document.cookie = name + "="+ escape (value) + ";domain=" + domain;;  
    }
}