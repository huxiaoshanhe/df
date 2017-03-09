app.controller('updatePassCtrl',updatePassCtrl);
updatePassCtrl.$inject = ['$rootScope', 'dataService', '$timeout', 'coreCF'];
function updatePassCtrl($rootScope, dataService, $timeout, config) {
	var that = this;	
	that.oldPassword = '';
	that.newPassword = '';
	that.rePassword = '';
	that.isDisabled = true;

	that.isNull =function() {
		if(that.oldPassword===''||that.newPassword===''||that.rePassword==='') {
			that.isDisabled = true;
		} else {
			that.isDisabled = false;
		}
	}

	that.goSubmit = function() {
		if(that.newPassword!==that.rePassword) {
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
		var user = dataService.getItem('_user');
		var params = {
			userId:user.id,
			oldPassword:that.oldPassword,
			newPassword:that.newPassword
		}
		dataService.get('updatePwd',params).then(function(data) {
			if(data==0) {
				that.tipsMessage = '修改成功';
				that.tipsShowStyle = {
					color:'#5fa1d3',
					display:'block'
				}
				var user = dataService.getItem('_user');				
				dataService.removeCookie('loginName', config.domainUrl);
		        dataService.removeCookie('loginStatus', config.domainUrl);
		        dataService.setItem('_user', {"name":""});
		        localStorage.removeItem('_user');//清除本地用户登录信息
		        localStorage.removeItem('record'+user.id);
				location.href = config.mainUrl;
					
			} else if(data==1) {
				that.tipsMessage = '用户未登录';
				that.tipsShowStyle = {
					color:'#ff0000',
					display:'block'
				}
			} else if(data==2) {
				that.tipsMessage = '原密码为空';
				that.tipsShowStyle = {
					color:'#ff0000',
					display:'block'
				}
			} else if(data==3) {
				that.tipsMessage = '新密码为空';
				that.tipsShowStyle = {
					color:'#ff0000',
					display:'block'
				}
			} else if(data==4) {
				that.tipsMessage = '该原密码无对应用户';
				that.tipsShowStyle = {
					color:'#ff0000',
					display:'block'
				}
			}
		});
	}
}
