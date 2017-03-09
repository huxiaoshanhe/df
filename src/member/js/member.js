var app = angular.module("member", ['ui.router']);

app.constant('coreCF', {
	domainUrl: '.epsnet.com.cn',
	domain: 'dps.epsnet.com.cn',
    baseUrl: 'http://dps.epsnet.com.cn/',
    mainUrl: 'http://kdd.epsnet.com.cn/',
	urlMap : {
		'initial': 'jump.do',
		'userInfo': 'userInfo.do',
		'read':'read.do',
		'baseOp':'baseOp.do',
		'logSearch':'user/logSearch',
		'logData':'user/logData',
		'queryFileList':'queryFileList.do',
		'createMyFile':'createMyFile.do',
		'renameMyFile':'renameMyFile.do',
		'delMyFile':'delMyFile.do',
		'loginOut':'logout.do',
		'updatePwd':'updatePwd.do',
		'addUser':'group/addUser.do',
		'userList':'group/userList.do',
		'updateUser':'group/updateUser.do',
		'deleteUser':'group/deleteUser.do'
	}
});
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		$stateProvider.state('temp',{
			url:'/temp',
			templateUrl:'member/template/temp.html'
		})
		.state('temp.mydatas',{
			url:'/mydatas',
			templateUrl:'member/template/mydatas.html',
			controller:'mydatasCtrl',
			controllerAs:'mdc'
		})
		.state('temp.keywordsHistory',{
			url:'/keywordsHistory',
			templateUrl:'member/template/keywordsHistory.html',
			controller:'keywordsHistoryCtrl',
			controllerAs:'khc'
		})
		.state('temp.indicatorHistory',{
			url:'/indicatorHistory',
			templateUrl:'member/template/indicatorHistory.html',
			controller:'indicatorHistoryCtrl',
			controllerAs:'ihc'
		})
		.state('temp.controlHistory',{
			url:'/controlHistory',
			templateUrl:'member/template/controlHistory.html',
			controller:'controlHistoryCtrl',
			controllerAs:'chc'
		})
		.state('temp.updatePass',{
			url:'/updatePass',
			templateUrl:'member/template/updatePass.html',
			controller:'updatePassCtrl',
			controllerAs:'upc'
		})
		.state('temp.userManage',{
			url:'/userManage',
			templateUrl:'member/template/userManage.html',
			controller:'userManageCtrl',
			controllerAs:'umc'
		})
		.state('temp.addUser',{
			url:'/addUser',
			templateUrl:'member/template/addUser.html',
			controller:'addUserCtrl',
			controllerAs:'auc'
		})
		.state('temp.editUser',{
			url:'/editUser',
			templateUrl:'member/template/editUser.html',
			controller:'editUserCtrl',
			controllerAs:'euc'
		});
		$urlRouterProvider.otherwise('/temp/mydatas');
}]);
app.run(startLogic);
startLogic.$inject = ['$rootScope', 'dataService', 'coreCF'];
function startLogic($rootScope, dataService, config) {
		dataService.get('userInfo').then(function(data){
			if(data.userName!==undefined) {
				$rootScope.userInfo = data;
				var obj = {
					id:data.userID,
					type:data.userType,
					name:data.userName,
					record:{}
				};
				var proObj = dataService.getItem('_user');
				if(proObj===undefined||obj.id!==proObj.id) {
					dataService.setItem('_user',obj);
				}				
			} else {
				alert('请先登录');
				location.href=config.mainUrl;
			}			
		});		
}
app.controller('userCtrl',userCtrl);
userCtrl.$inject = ['dataService', 'coreCF'];
function userCtrl(dataService, config) {
	var that  = this;
	that.logOut = function() {
		var user = dataService.getItem('_user');
		dataService.get('loginOut').then(function(data) {
			if(data==='true') {
				dataService.removeCookie('loginName', config.domainUrl);
		        dataService.removeCookie('loginStatus', config.domainUrl);
		        dataService.removeCookie('dfip', config.domainUrl);
		        dataService.removeCookie('groupCode', config.domainUrl);
		        dataService.removeCookie('userId', config.domainUrl);
		        dataService.removeCookie('userType', config.domainUrl);
		        dataService.setItem('_user', {"name":""});
		        localStorage.removeItem('_user');//清除本地用户登录信息
		        localStorage.removeItem('record'+user.id);
				location.href = config.mainUrl;
			}
		});
	}
}

app.controller('searchCtrl',searchCtrl);
searchCtrl.$inject = ['coreCF'];
function searchCtrl(config) {
	var that  = this;
	that.keywords = '';
	that.go = function(){
		if(that.keywords!=='') {
			location.href=config.mainUrl+'fact?kw='+that.keywords+'&urlstream=u'
		}
	}
}