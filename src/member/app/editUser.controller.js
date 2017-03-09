app.controller('editUserCtrl',editUserCtrl);
editUserCtrl.$inject = ['$rootScope', 'dataService', '$timeout', 'coreCF'];
function editUserCtrl($rootScope, dataService, $timeout, config) {
	var that = this;
	var userInfo = dataService.getCookie('be_edit_user');
	userInfo = angular.fromJson(userInfo);
	if(userInfo===null) {
		alert('请选择用户');
		history.go(-1);
		return;
	}
	that.userId = userInfo.userID;
	that.userName = userInfo.userName;
	that.email = userInfo.email;
	that.truename = userInfo.name;
	that.phone = userInfo.mobile;
	that.description = userInfo.desc;

	that.isNull =function() {
		if(that.userName===''||that.email==='') {
			that.isDisabled = true;
		} else {
			that.isDisabled = false;
		}
	}

	that.goSubmit = function() {
		if(isEmail(that.email)===false) {
			that.tipsMessage = '邮箱格式不正确！';
			that.tipsShowStyle = {
				color:'#ff0000',
				display:'block'
			}
			$timeout(function() {
				that.tipsShowStyle.display = 'none';
			}, 3000);
			return;
		}
		if(that.password!==that.rePassword) {
			that.tipsMessage = '两次密码不一致！';
			that.tipsShowStyle = {
				color:'#ff0000',
				display:'block'
			}
			$timeout(function() {
				that.tipsShowStyle.display = 'none';
			}, 3000);
			return;
		}

		var params = {
			userId:that.userId,
			userName:that.userName,
			email:that.email,
			pwd:that.password,
			name:that.truename,
			mobile:that.phone,
			desc:that.description
		}

		dataService.get('updateUser',params).then(function(data) {
			that.tipsMessage = data.message;
			that.tipsShowStyle = {
				color:'#ff0000',
				display:'block'
			}
			if(data.message==='修改成功') {
				dataService.removeCookie('be_edit_user');
				$timeout(function() {
					location.href="/member.html#/temp/userManage";
				}, 3000);
			}			
		});
	}

	function isEmail(str) {
		var emailModel= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-.])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    if(emailModel.test(str)==false){
	    	return false;
	    } else {
	    	return true;
	    }
	}

	function isPhone(str) {
		var phoneModel = /^1[34578]\d{9}$/;
		if(phoneModel.test(str)===false){  
       		return false; 
    	} else {
    		return true;
    	}
	}		
}
