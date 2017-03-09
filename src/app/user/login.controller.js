(function() {
  'use strict';
  // 登陆控制器

  angular
    .module('pf.user')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$scope', 'userService', 'dataService', 'coreCF'];
  function LoginCtrl($scope, userService, dataService, config) {
    var that = this;
    that.login = login;
    that.upTamp = upTamp;
    that.logIp = '';
    that.msg = ''; // 提示信息
    that.tamp = ''; // 验证码时间戳
    $scope.user = {'name': '', 'password': ''}; // 登陆提交参数

    $scope.$watch('user', function() {
      that.msg = ''; // 防止用户错误认识
    }, true);
    var pramas={'action':'userIp'};
    dataService.get('userIp',pramas).then(function(data) {
    	that.logIp=data.ip;//当前登录ip
    });
    
    

    // 登录
    function login(isSubmit) {
      if (!isSubmit) { return; }

      var name = $scope.user.name;
      var password = $scope.user.password;
      var vercode = $scope.user.vercode;
  
      userService.login(name, password, vercode)
        .then(function(rp) {
          window.location.reload();
        }, function(rp) {
          that.msg = rp.message;
          upTamp();
        });
    }   
     

    

    // 変更验证码时间戳
    function upTamp() {
      that.tamp = new Date().getTime();
    }
    
    that.IpLogin = function(){	   
	    $.ajax({
	    	'type':'POST',
	    	'url':config.baseUrl+'login.do',
	    	'data':{'type':'ip'},
	    	'success':function(result) {
	    		if(result.success==true){
		    		 location.reload();
		    	}else{
		    		if(result.message==='登陆失败') {
		    			result.message='登录失败';
		    		}
		    		that.msg=result.message;		    		
		    	}
	    	}
	    });
	  
    }

  }

})();