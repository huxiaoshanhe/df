(function() {
  'use strict';
  // 用户控制器

  angular
    .module('pf.user')
    .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['toolbarService'];
  function UserCtrl(toolbarService) {
    var that = this;
    that.toolBarClick = toolBarClick;

    // 工具条点击接口
    function toolBarClick(key, fkey, ele) {
      var status = {};
      status.active = ele.hasClass('hover');
      toolbarService.inform(key, fkey, status);
    }
  }
})();