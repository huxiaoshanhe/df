(function() {
  'use strict';

  angular
    .module('pf.sheet')
    .factory('sheetFactory', sheetFactory);

  sheetFactory.$inject = ['dataService', 'conditionFactory', 'tableFactory'];
  function sheetFactory(dataService, conditionFactory, tableFactory) {
    var service = {
      'parse': parse,
      'rqClose': rqClose
    };
    Sheet.prototype.setTable = function(table){ this.table = table; };
    return service;

    /**
     * 工作表类
     * @param {String} id        后台id
     * @param {String} name      表名, 后台定义
     * @param {Table} table      表格对象, handsontable封装
     * @param {Condition} condition 维度容器对象
     */
    function Sheet(id, name, table, condition) {
      this.id = id;
      this.name = name;
      this.table = table;
      this.condition = condition;
    }

    /**
     * 解析源数据, 创建表对象
     * @param  {Object} source 后台源
     * @return {Sheet} 工作表
     */
    function parse(source) {
      var sheetInfo = source.sheetInfo;
      var id = sheetInfo.sheetId;
      var name = sheetInfo.sheetName;
      //var freqId = sheetInfo.freqId;
      //var cubeId = sheetInfo.cubeId;

      var table = tableFactory.parse(source.tableVO);
      var condition = conditionFactory.parse(source.accordionVO);
      return new Sheet(id, name, table, condition);
    }

    /**
     * 通知后台关闭一个表
     * @param  {String} id 删除表的id
     * @return {Promise} 承诺
     */
    function rqClose(id) {
      var params = {'action': 'closeSheet', 'sheetId': id};
      return dataService.get('sheet', params).then(function(message) {
        return message;
      });
    }

  }

})();