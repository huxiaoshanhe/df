(function() {
  'use strict';

  angular
    .module('pf.user')
    .factory('userFactory', userFactory);

  userFactory.$inject = ['dataService','coreCF'];
  function userFactory(dataService,config) {
    var service = {
      'rqUserInfo': rqUserInfo
    };
    User.prototype.addRecordItem = function(key, val){ this.record[key] = val; };
    return service;

    /**
     * 用户类
     * @param {String} id     后台ID
     * @param {String} type   类型决定展现等
     * @param {String} name   用户名
     * @param {Object} record 记录用户配置操作等
     */
    function User(id, type, name, record) {
      this.id = id;
      this.type = type;
      this.name = name;
      this.record = record;
    }

    /**
     * 请求会话用户信息
     * @return {User} 解析后的用户对象
     */
    function rqUserInfo() {
        return dataService.get('userInfo').then(function(userInfoSource) {
          if (userInfoSource) {
            return parse(userInfoSource);
          } else {
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
        });
      //}      
    }

    /**
     * 解析为用户对象
     * @param  {Object} source 后台源数据
     * @return {User}
     */
    function parse(source) {
      var id = source.userID;
      var name = source.userName;
      var type = source.userType;
      var record = {};

      return new User(id, type, name, record);
    }
  }

})();