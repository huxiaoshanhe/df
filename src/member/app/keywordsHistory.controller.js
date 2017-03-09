app.controller('keywordsHistoryCtrl',keywordsHistoryCtrl);
keywordsHistoryCtrl.$inject = ['$scope', 'dataService', 'coreCF'];
function keywordsHistoryCtrl($scope, dataService, config) {
	var that = this;
    that.getHistory = function() {
		that.lists = dataService.getItem('searchHistory');
	  	if(that.lists.length!==undefined) {
	  		that.lists=that.lists.reverse();
	  	}
	}
    that.getHistory();
    that.delete = function(num) {
    	var total_length = that.lists.length;
    	var _num = total_length - num;
    	that.lists.splice(num,1);
    	var newList = that.lists.reverse();
    	dataService.setItem('searchHistory',newList);
    }

    that.goSearch = function(str) {
        location.href=config.mainUrl+'fact?keyword='+str+'&urlstream=u'
    }
}