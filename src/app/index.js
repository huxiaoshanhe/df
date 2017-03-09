(function() {
  'use strict';

  angular
    .module('pf', [
      'ngDialog',
      'ui.router',
      'ngResource',
      'ngSanitize',
      'ui.sortable',
      'pf.user',
      'pf.workbook',
      'pf.database',
      'pf.directive'
    ])
    .config(appConfig)
    .run(startLogic);

    // 路由启动配置
    appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function appConfig($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/core/layout.html',
          controller: 'SheetCtrl as sc'
        });

      $urlRouterProvider.otherwise('/');

    }

    // 启动逻辑
    startLogic.$inject = ['$rootScope', 'userService', 'workbookService', 'coreCF', 'dataService', 'containerService', 'chartService'];
    function startLogic($rootScope, userService, workbookService, config, dataService, containerService, chartService) {
      // 控制器加载完成, 可以初始化
      $rootScope.$on('$stateChangeSuccess', function(e) {
        // 用户初始化
        
        var loginStatus = dataService.getCookieObj('loginStatus');
        if(loginStatus==true) {
          var user = {
            id:dataService.getCookieObj('userId'),
            name:dataService.getCookieObj('loginName'),
            type:dataService.getCookieObj('userType'),
            record:{dime:undefined}
          }
          userService.initialize(user);
          $rootScope.$broadcast(config.spreadKey.userInfoChange,user);
          var dime = user.record.dime; // 维度记录
            if (config.debug === true) { 
              dime =config.dime;
              if(user.record.dime!=null&&user.record.dime!=undefined){
                dime = user.record.dime;
              }        
          }



          if(user!=null&&user.id!=null&&user.id!='undefined'){
              var userCookie=userService.getDimeByCookie();
              if(userCookie===undefined||userCookie===''||userCookie===null) {
                var nearestCheck=dataService.getItem('nearestCheck');
                if(nearestCheck.length!==0&&nearestCheck.length!=undefined) {
                  var num_n = nearestCheck.length-1;
                  var indicators = nearestCheck[num_n].indicators;
                  dime.dims[0].codes = indicators;
                  dime.productID='00010000000000000000000000000001';
                } 
              } else {
                dataService.removeCookie('userData', {'domain': config.domain});
              }     
              workbookService.initialize(dime).then(function(workbook) {
                  workbookService.toggle(0, true);
                  if(user.id==='1407') {
                    containerService.switchRow('r1', true);
                    chartService.getCharts('Line'); 
                  }
              });
            }
        } else {
          userService.initialize().then(function(user) {
            $rootScope.$broadcast(config.spreadKey.userInfoChange,user);
            var dime = user.record.dime; // 维度记录
            if (config.debug === true) { 
                dime =config.dime;
                if(user.record.dime!=null&&user.record.dime!=undefined){
                  dime = user.record.dime;
                }          
            }
             
            if(user!=null&&user.id!=null&&user.id!='undefined'){
              var userCookie=userService.getDimeByCookie();
              if(userCookie===undefined||userCookie===''||userCookie===null) {
                var nearestCheck=dataService.getItem('nearestCheck');
                if(nearestCheck.length!==0&&nearestCheck.length!=undefined) {
                  var num_n = nearestCheck.length-1;
                  var indicators = nearestCheck[num_n].indicators;
                  dime.dims[0].codes = indicators;
                  dime.productID='00010000000000000000000000000001';
                } 
              } else {
                dataService.removeCookie('userData', {'domain': config.domain});
              }     
              workbookService.initialize(dime).then(function(workbook) {
                  workbookService.toggle(0, true);
                  if(user.id==='1407') {
                    containerService.switchRow('r1', true);
                    chartService.getCharts('Line'); 
                  }
              });
            }

          });
        }
        
      });
    }

})();