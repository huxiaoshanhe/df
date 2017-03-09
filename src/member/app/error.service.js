(function(){
	'use strict';
	app.factory('errorService',errorService);
	 errorService.$inject = ['$q'];
	  function errorService($q) {
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
	          
	        break;
	        /*case 101: // 无权限
	        	console.warn('无权限!');
	        default:
	          console.error('errorService', '不识别的错误状态' + status);
	        break;*/
	      }
	    }
	    
	    
	    function showError(msg) {
	    	//alert(msg);
	    }
	  }
})();