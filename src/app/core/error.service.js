(function() {
  'use strict';
  // 错误服务, 负责处理业务错误

  angular
    .module('pf.core')
    .factory('errorService', errorService);

  errorService.$inject = ['$q', 'ngDialog'];
  function errorService($q, ngDialog) {
    var service = {
      'swallow': swallow,
      'interception': interception,
      'NotLoggedIn': 100,
      'NoPermission': 101,
      'showError':showError
    };
    return service;

    /**
     * 简易数据拦截, 负责拦截服务器错误信息
     * @param  {Object} source 数据源
     * @return {Object} 拒绝或数据
     */
    function interception(source) {
      if (source && source.errorType) {
//console.error(source);
        return $q.reject('服务器错误消息处理!!');
      } else {
        return source;
      }
    }

    /**
     * 根据错误码做出相应的处理
     * @param  {Number} status 内部封装的错误码
     */
    function swallow(status) {
      switch(status) {
        case 100: // 未登录
          //console.warn('未登录!');
          ngDialog.open({
            className:'ngDialog-login-theme',
            template: 'app/user/login.html',
            closeByEscape: true,
            showClose:false,
            closeByDocument: false,
            preCloseCallback: function(value) {
            	var user = localStorage.getItem('_user');
            	if(user.id!=='') {
            		return true; // 可以关闭
            	} else {
            		return false; // 不可以关闭
            	}              
            }
          });
          break;
        /*case 101: // 无权限
        	console.warn('无权限!');
        default:
          console.error('errorService', '不识别的错误状态' + status);
        break;*/
      }
    }
    
    
    function showError(msg) {
    	ngDialog.open({
            template: '<p>'+msg+'</p>',
            plain: true,
            className: 'ngdialog-theme-error',
            closeByDocument: true,
            overlay:false,
            closeByEscape:false,
            controller: 'errorCtrl'
          });
    }
  }

})();