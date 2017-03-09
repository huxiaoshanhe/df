app.controller('userManageCtrl',userManageCtrl);
userManageCtrl.$inject = ['$rootScope', 'dataService', '$timeout', 'coreCF'];
function userManageCtrl($rootScope, dataService, $timeout, config) {
	var that = this;
	that.userList = [];
	that.selects = [];

	getUserList();
	function getUserList() {
		var params = {
			groupId:$rootScope.userInfo.userName
		};
		dataService.get('userList',params).then(function(data){
			that.userList = data.obj;
			angular.forEach(that.userList,function(value,key) {
				var arr1=value.createTime.split(',');
				var dataYear = arr1[1];
				var arr2=arr1[0].split(' ');
				var dateDay = arr2[1];
				var dateMonth = '';
				switch(arr2[0]) {
					case 'Jan':case '一月':dateMonth = 1;break;
					case 'Feb':case '二月':dateMonth = 2;break;
					case 'Mar':case '三月':dateMonth = 3;break;
					case 'Apr':case '四月':dateMonth = 4;break;
					case 'May':case '五月':dateMonth = 5;break;
					case 'Jun':case '六月':dateMonth = 6;break;
					case 'Jul':case '七月':dateMonth = 7;break;
					case 'Aug':case '八月':dateMonth = 8;break;
					case 'Sep':case '九月':dateMonth = 9;break;
					case 'Oct':case '十月':dateMonth = 10;break;
					case 'Nov':case '十一月':dateMonth = 11;break;
					case 'Dec':case '十二月':dateMonth = 12;break;
				}
				value.createTime=dataYear+'-'+dateMonth+'-'+dateDay;
			});
		});
	}
	

	//单选
	that.select = function(userId) {
		var num = that.selects.indexOf(userId);
		if(num===-1) {
			that.selects.push(userId);
		} else {
			that.selects.splice(num,1);
		}
	}

	//全选
	that.selectAll = function() {
		if(that.userList.length!==that.selects.length) {
			angular.forEach(that.userList,function(value,key) {
				if(that.selects.indexOf(value.userID)===-1) {
					that.selects.push(value.userID);
				}
			});
		}else {
			that.selects = [];
		}		
	}

	//单删除
	that.del = function(id) {
		dataService.get('deleteUser',{userId:id}).then(function(data) {
			getUserList();
		});
	}

	//多删除
	that.delete = function() {
		angular.forEach(that.selects,function(v,k) {
			dataService.get('deleteUser',{userId:v});
		});
		getUserList();
	}

	that.edit = function(id) {
		angular.forEach(that.userList,function(value,key) {
			if(value.userID===id) {
				var str = angular.toJson(value);
				dataService.setCookie('be_edit_user',str);
				location.href="/member.html#/temp/editUser";
				return true;
			}
		});
	}
}