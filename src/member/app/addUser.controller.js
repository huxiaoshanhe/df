app.controller('addUserCtrl',addUserCtrl);
addUserCtrl.$inject = ['$rootScope', 'dataService', '$timeout', 'coreCF'];
function addUserCtrl($rootScope, dataService, $timeout, config) {
	var that = this;
	that.userName = '';
	that.email = '';
	that.password = '';
	that.rePassword = '';
	that.isDisabled = true;
	that.truename = '';
	that.phone = '';
	that.description = '';

	that.isNull =function() {
		if(that.userName===''||that.email===''||that.password===''||that.rePassword==='') {
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
		if(that.phone!=='') {
			if(isPhone(that.phone)===false) {
				that.tipsMessage = '手机格式不正确！';
				that.tipsShowStyle = {
					color:'#ff0000',
					display:'block'
				}
				$timeout(function() {
					that.tipsShowStyle.display = 'none';
				}, 3000);
			}
		}

		var params = {
			userName:that.userName,
			email:that.email,
			pwd:that.password,
			name:that.truename,
			mobile:that.phone,
			desc:that.description
		}
		dataService.get('addUser',params).then(function(data) {
			that.tipsMessage = data.message;
			that.tipsShowStyle = {
				color:'#ff0000',
				display:'block'
			}

			if(data.message==='添加成功!') {
				$timeout(function() {
					location.href="/member.html#/temp/userManage";
				}, 1000);				
			} else {
				$timeout(function() {
					that.tipsShowStyle.display = 'none';
				}, 3000);
			}
		});
	}

	function isEmail(str) {
		var emailModel= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-.])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    if(emailModel.test(str)===false){
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
