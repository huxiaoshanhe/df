(function() {
  'use strict';
  // 指标服务, 这这那那

  angular
    .module('pf.indicator')
    .factory('indicatorService', indicatorService);

  indicatorService.$inject = [
    '$rootScope',
    'ngDialog',
    'workbookService',
    'conditionService',
    'coreCF'];

  function indicatorService($rootScope, ngDialog, workbookService, conditionService, config) {
    var _spk = config.spreadKey;
    var _syncType = 'syncWorkBook'; // 同步的类型(同步表||添加表)
    var _indicatorId = null; // 切换至的当前指标id
    var service = {
      'sync': sync,
      'remove': remove,
      'openModel': openModel,
      'getCodesSize': function(){
        var gundam = conditionService.getGundam();
        return gundam.getDimeCodes('indicatorCode').length;
      },
      'showSearchWin':function() {
    	  config.isAddSheet=true;
    	  $('#search').show();
      },
      'addIndicator':function() {
    	  config.isAddSheet=false;
    	  $('#search').show();
      },
      'addSheetSync':addSheetSync
    };
    return service;

    /**
     * 同步
     * @param {Object} selected 选中记录
     */
    function sync(selected) {
      var gundam = conditionService.getGundam();
      gundam.addSlectedCode('indicatorCode', selected);
      if (_syncType === 'addSheet') { // 添加表才设置唯一条件
        gundam.setSnlyDime('indicatorCode', selected);
      }
      gundam.setSnlyDime('indicatorCode', selected);
      workbookService[_syncType](gundam);
    }
    

    //通过搜索添加指标
    function addSheetSync(selectedIndicator) {
    	var gundam = conditionService.getGundam();
        gundam.addSlectedCode('indicatorCode', selectedIndicator);        
        workbookService.syncWorkBook(gundam);
    }

    /**
     * 打开添加指标的窗口
     * @param {String} oper 操作 addSheet|syncWorkBook
     */
    function openModel(oper) {
      ngDialog.open({
        template: 'app/template/model/addIndicator.html',
        controller: 'AddIndicatorCtrl',
        controllerAs: 'aivm'
      });
      _syncType = (oper==='addSheet'?'addSheet':'syncWorkBook');
    }

    /**
     * 删除指标并提交
     * @param  {Array} codes 指标代码
     */
    function remove(codes) {
      var gundam = conditionService.getGundam();
      gundam.removeCodes('indicatorCode', codes);
      workbookService.syncWorkBook(gundam);
    }
  }

})();