(function() {
  'use strict';
  // 信息控制器

  angular
    .module('pf.information')
    .controller('InformationCtrl', InformationCtrl)

  InformationCtrl.$inject = ['$scope', '$rootScope', 'informationService', 'coreCF'];
  function InformationCtrl($scope, $rootScope, informationService, config) {
    var _spk = config.spreadKey;
    var that = this;

    that.style = null;
    that.toggle = toggle;
    that.infomation = null;

    // 数据更新
    $scope.$on(_spk.infomationChange, function(e, infomation) {
      that.infomation = infomation;
      var start=infomation.startDate.split(',');
      var end = infomation.endDate.split(',');
      if(infomation.freqId==1) {
    	  that.startDate=start[1]+'年';
    	  that.endDate=end[1]+'年';
      } else if(infomation.freqId==3) {
    	  var arr1=start[0].split(' ');
    	  var startMonth='';
    	  switch(arr1[0]) {
    	  	case '一月':startMonth='1季度';break;
        	case '二月':startMonth='1季度';break;
        	case '三月':startMonth='1季度';break;
        	case '四月':startMonth='2季度';break;
        	case '五月':startMonth='2季度';break;
        	case '六月':startMonth='2季度';break;
        	case '七月':startMonth='3季度';break;
        	case '八月':startMonth='3季度';break;
        	case '九月':startMonth='3季度';break;
        	case '十月':startMonth='4季度';break;
        	case '十一月':startMonth='4季度';break;
        	case '十二月':startMonth='4季度';break;
        	case 'Jan':startMonth='1季度';break;
        	case 'Feb':startMonth='1季度';break;
        	case 'Mar':startMonth='1季度';break;
        	case 'Apr':startMonth='2季度';break;
        	case 'May':startMonth='2季度';break;
        	case 'Jun':startMonth='2季度';break;
        	case 'Jul':startMonth='3季度';break;
        	case 'Aug':startMonth='3季度';break;
        	case 'Sep':startMonth='3季度';break;
        	case 'Oct':startMonth='4季度';break;
        	case 'Nov':startMonth='4季度';break;
        	case 'Dec':startMonth='4季度';break;
    	  }
    	  
    	  var endMonth='';
    	  var arr2=end[0].split(' ');
    	  switch(arr2[0]) {
    	  	case 'Jan':endMonth='1季度';break;
        	case 'Feb':endMonth='1季度';break;
        	case 'Mar':endMonth='1季度';break;
        	case 'Apr':endMonth='2季度';break;
        	case 'May':endMonth='2季度';break;
        	case 'Jun':endMonth='2季度';break;
        	case 'Jul':endMonth='3季度';break;
        	case 'Aug':endMonth='3季度';break;
        	case 'Sep':endMonth='3季度';break;
        	case 'Oct':endMonth='4季度';break;
        	case 'Nov':endMonth='4季度';break;
        	case 'Dec':endMonth='4季度';break;
        	case '一月':startMonth='1季度';break;
        	case '二月':startMonth='1季度';break;
        	case '三月':startMonth='1季度';break;
        	case '四月':startMonth='2季度';break;
        	case '五月':startMonth='2季度';break;
        	case '六月':startMonth='2季度';break;
        	case '七月':startMonth='3季度';break;
        	case '八月':startMonth='3季度';break;
        	case '九月':startMonth='3季度';break;
        	case '十月':startMonth='4季度';break;
        	case '十一月':startMonth='4季度';break;
        	case '十二月':startMonth='4季度';break;
    	  }
    	  
    	  that.startDate=start[1]+'年'+startMonth;
    	  that.endDate=end[1]+'年'+endMonth;
      } else if(infomation.freqId==4) {
    	  var arr1=start[0].split(' ');
    	  var startMonth='';
    	  switch(arr1[0]) {
    	  	case 'Jan':startMonth='01月';break;
        	case 'Feb':startMonth='02月';break;
        	case 'Mar':startMonth='03月';break;
        	case 'Api':startMonth='04月';break;
        	case 'May':startMonth='05月';break;
        	case 'Jun':startMonth='06月';break;
        	case 'Jul':startMonth='07月';break;
        	case 'Aug':startMonth='08月';break;
        	case 'Sep':startMonth='09月';break;
        	case 'Oct':startMonth='10月';break;
        	case 'Nov':startMonth='11月';break;
        	case 'Dec':startMonth='12月';break;
        	case '一月':startMonth='01月';break;
        	case '二月':startMonth='02月';break;
        	case '三月':startMonth='03月';break;
        	case '四月':startMonth='04月';break;
        	case '五月':startMonth='05月';break;
        	case '六月':startMonth='06月';break;
        	case '七月':startMonth='07月';break;
        	case '八月':startMonth='08月';break;
        	case '九月':startMonth='09月';break;
        	case '十月':startMonth='10月';break;
        	case '十一月':startMonth='11月';break;
        	case '十二月':startMonth='12月';break;
    	  }
    	  
    	  var endMonth='';
    	  var arr2=end[0].split(' ');
    	  switch(arr2[0]) {
    	  case 'Jan':endMonth='01月';break;
        	case 'Feb':endMonth='02月';break;
        	case 'Mar':endMonth='03月';break;
        	case 'Api':endMonth='04月';break;
        	case 'May':endMonth='05月';break;
        	case 'Jun':endMonth='06月';break;
        	case 'Jul':endMonth='07月';break;
        	case 'Aug':endMonth='08月';break;
        	case 'Sep':endMonth='09月';break;
        	case 'Oct':endMonth='10月';break;
        	case 'Nov':endMonth='11月';break;
        	case 'Dec':endMonth='12月';break;
        	case '一月':startMonth='01月';break;
        	case '二月':startMonth='02月';break;
        	case '三月':startMonth='03月';break;
        	case '四月':startMonth='04月';break;
        	case '五月':startMonth='05月';break;
        	case '六月':startMonth='06月';break;
        	case '七月':startMonth='07月';break;
        	case '八月':startMonth='08月';break;
        	case '九月':startMonth='09月';break;
        	case '十月':startMonth='10月';break;
        	case '十一月':startMonth='11月';break;
        	case '十二月':startMonth='12月';break;
    	  }
    	  
    	  that.startDate=start[1]+'年'+startMonth;
    	  that.endDate=end[1]+'年'+endMonth;
      }
      
    });

    // 开关变更监听
    $scope.$on(_spk.InfoIsOpenChange, function(e, isOpen) {
      $scope.isOpen = isOpen;
    });

    // 饿
    $scope.$watch('isOpen', function(isOpen) {
      if (isOpen === undefined) { return; }
      if (isOpen === true) {
        that.style = {'display':'block'};
        var p_b_w = $('#plat-body').width()-310;
        $('#plat-body-container .handsontable').css('width',p_b_w+'px');
        $('#plat-body-container .handsontable .wtHolder').css('width',p_b_w+'px');
      } else {
        that.style = {'width':0, 'padding':0, 'display':'block'};
        var p_b_w = $('#plat-body').width()-21;
        $('#plat-body-container .handsontable').css('width',p_b_w+'px');
        $('#plat-body-container .handsontable .wtHolder').css('width',p_b_w+'px');
      }
      $rootScope.$broadcast(_spk.containerSizeChange, 400);
    });

    // 切换开关, 用Service控制
    function toggle() {
      informationService.toggle();
    }
  }

})();
