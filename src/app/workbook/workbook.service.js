(function() {
  'use strict';

  angular
    .module('pf.workbook')
    .factory('workbookService', workbookService);

  workbookService.$inject = ['$rootScope', 'workbookFactory', 'sheetService', 'coreCF'];
  function workbookService($rootScope, workbookFactory, sheetService, config) {
    var _spk = config.spreadKey;
    var _workbook = null;
    var service = {
      'addSheet': addSheet,
      'initialize': initialize,
      'getWorkBook': getWorkBook,
      'syncWorkBook': syncWorkBook,
      'remoceNowSheet': removeNowSheet,
      'remove': removeSheetByIndex,
      'toggle': toggleSheetByIndex,
      'workbookChange':workbookChange,
      'addMySheet':addMySheet
    };
    return service;

    function initialize(gundam) {
      return getWorkBook(gundam, true).then(function(workbook) {
        return workbookChange(workbook);
      });
    }

    /**
     * 获取工作簿根据钢弹
     * @param {Gundam|Object} gundam 选中维度对象钢弹
     * @param {Boolean} init 后台一样的功能不懂为什么要搞两个链接
     * @return {Promise}
     */
    function getWorkBook(gundam, init) {     
      return workbookFactory.rqWorkBook(gundam, init).then(function(workbook) {
        return workbook;
      });
    }

    /**
     * 同步工作簿, 合并得到的表数据
     * @param  {Gundam|Object} gundam 选中维度对象钢弹
     * @return {Promise} 返回需要选中的index
     */
    function syncWorkBook(gundam) {
      var sheetId = sheetService.getSheetId();
      gundam.sheetId = sheetId; // 根据sheetId判断是否新增表
      return addSheet(gundam);
    }

    /**
     * 添加一个工作簿, 即不传sheetId
     * @return {Promise} 返回需要选中的index
     */
    function addSheet(gundam) {
      return getWorkBook(gundam).then(function(workbook) {
        var selIndex = _workbook.merger(workbook);
        toggleSheetByIndex(selIndex, true);
        return selIndex;
      });
    }
    
    function addMySheet(data) {
    	var selIndex = _workbook.merger(data);
        toggleSheetByIndex(selIndex, true);
        return selIndex;
    }

    /**
     * 切换一个表的, 并通知表服务更新维护表
     * @param  {Number}  index 预选中下标
     * @param  {Boolean} isUpdate 强制通知更新表
     * @return {Sheet} 当前选中的表
     */
    function toggleSheetByIndex(index, isUpdate) {
      var nowIndex = _workbook.index;
      if (nowIndex !== index || isUpdate === true) {
        var sheet = _workbook.selected(index);
        sheetService.update(sheet);
        return sheet;
      } else {
        return _workbook.sheets[nowIndex];
      }
    }

    /**
     * 删除一个表, 成功后做重新选中表处理
     * @param  {Number} index 删除的下标
     * @return {Sheet} 删除掉的表
     */ 
    function removeSheetByIndex(index) {
      var sheets = _workbook.remove(index);
      if (sheets.length === 1) { // 删除成功
        sheetService.closeSheet(sheets[0].id);
        // 删除选中项后重新选中, 更新数据
        if (index === _workbook.index) {
          if (index === _workbook.sheets.length) { index--; }
          toggleSheetByIndex(index, true);
        }
        return sheets;
      } else {
        //console.error('错误的下标', index);
      }
    }

    /**
     * 删除当前选中的表
     * @return {Number} 剩余表长度
     */
    function removeNowSheet() {
      var length = _workbook.sheets.length;
      if (length > 1) { removeSheetByIndex(_workbook.index); }
      return _workbook.sheets.length;
    }

    /**
     * 工作簿变更方法
     * @param  {WorkBook} workbook 变更了的工作簿
     * @return {WorkBook} 当期工作簿
     */
    function workbookChange(workbook) {
      _workbook = workbook;
      $rootScope.$broadcast(_spk.workbookChange, _workbook);
      return _workbook;
    }
  }

})();