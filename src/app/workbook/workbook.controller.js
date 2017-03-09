(function() {
  'use strict';
  // 工作簿数据展现

  angular
    .module('pf.workbook')
    .controller('WorkBookCtrl', workbookCtrl);

  workbookCtrl.$inject = [
    '$rootScope',
    '$scope',
    'workbookService',
    'conditionService',
    'recommendService',
    'indicatorService',
    'dispatchService', // 调度服务, 服务于菜单
    'coreCF',
    'dataService',
    'errorService',
    'ngDialog'];

  function workbookCtrl($rootScope, $scope, workbookService, conditionService, recommendService, indicatorService, dispatchService, config, dataService, errorService, ngDialog) {
    var _spk = config.spreadKey;
    var that = this;
    //that.isSync = true;
    that.workbook = null;

    that.menudata = dispatchService.getCoolMenu(); // 获取菜单数据
    that.menuCallback = function(key, keys) {
      dispatchService.execution(key, keys);
    };

    that.sync = sync;
    that.toggle = toggle;
    that.remove = remove;
    that.openAddSheetDialog = openAddSheetDialog;

    $scope.loading = false; // 加载中标示
    
    $scope.$on(_spk.userInfoChange,function(e,data) {
    	that.userInfo = data;
    });

    // 变更监听
    $scope.$on(_spk.workbookChange, function(e, workbook) {
//console.warn('C工作簿更新!', workbook);
      that.workbook = workbook;
    });

    // 数据同步状态监听
    $scope.$on(_spk.syncStatusChange, function(e, isSync) {
      //that.isSync = isSync;
    });

    // 控制加载状态显示
    $scope.$on(_spk.loading, function(e, loading) {
      $scope.loading = loading;
    });

    //监听过滤空行空列
    $rootScope.$on('goFilter',function(data) {
      that.sync();
    });

    // 切换表接口
    function toggle(index) {
      workbookService.toggle(index);
    }

    // 移除表接口
    function remove(e, index) {
      var r = window.confirm('你确认关闭该表吗?');
      if (r === false) { return; }
      workbookService.remove(index);
      e.stopPropagation();
    }

    // 同步工作簿
    function sync() {
      //if (that.isSync === true) { return; }

      // 可以封装起来
      var gundam = conditionService.getGundam();
      var indicRecommendSelected = recommendService.getSelected();
      gundam.addSlectedCode('indicatorCode', indicRecommendSelected);
      // 可以封装起来
      var codes = gundam.dims[0].codes;
      recommendService.clearRecord(); // 清除指标推荐选中记录

      $scope.loading = true;
      workbookService.syncWorkBook(gundam).then(function() {
        $scope.loading = false;
      });     
    }

    // 添加表窗口
    function openAddSheetDialog() {
    	config.isAddSheet=true;
    	indicatorService.showSearchWin();
    	//indicatorService.openModel('addSheet');
    }
    
    
    that.goMember = function() {
        /*if(that.userInfo.type!=='PERSONAL') {
          alert('对不起，您不是个人用户，请登录个人用户');
          errorService.swallow(errorService.NotLoggedIn);
          return false;
        } else {
          window.open('/member.html');
        }*/
    }

    that.leftSwitchStatus = true;
    that.leftSwitch = function() {
      if(that.leftSwitchStatus === true) {
          $('#plat-side').css('left','-230px');
          $('#left-switch').css('left','5px')
          .css('transform','rotate(180deg)')
          .css('-ms-transform','rotate(180deg)')
          .css('-moz-transform','rotate(180deg)')
          .css('-webkit-transform','rotate(180deg)')
          .css('-o-transform','rotate(180deg)');
          $('.down-btn').show();
          var p_b_w = $('#plat-body').width()+230;
          $('#plat-body').css('width',p_b_w+'px').css('margin-left','-230px');
          $('#plat-body-container .handsontable').css('width',p_b_w+'px');
          $('#plat-body-container .handsontable .wtHolder').css('width',p_b_w+'px');
        } else {
          $('#plat-side').css('left','0');
          $('#left-switch').css('left','210px')
          .css('transform','rotate(0deg)')
          .css('-ms-transform','rotate(0deg)')
          .css('-moz-transform','rotate(0deg)')
          .css('-webkit-transform','rotate(0deg)')
          .css('-o-transform','rotate(0deg)');;
          $('.down-btn').hide();
          var p_b_w = $('#plat-body').width()-230;
          $('#plat-body').css('width',p_b_w+'px').css('margin-left','0');
          $('#plat-body-container .handsontable').css('width',p_b_w+'px');
          $('#plat-body-container .handsontable .wtHolder').css('width',p_b_w+'px');
        } 
        that.leftSwitchStatus = !that.leftSwitchStatus;
    }

    that.logout = function() {
        dataService.removeCookie('loginName',  config.domain);
        dataService.removeCookie('loginStatus', config.domain);
        localStorage.removeItem('_user');//清除本地用户登录信息
        localStorage.removeItem('record'+that.userInfo.id);
        $.ajax({
          dataType: 'jsonp',
          jsonp: 'jsonp_callback',
          url: config.baseUrl+'logout.do',
          complete: function () {
            location.href = config.mainUrl;
          }
        });

    }
  }

})();