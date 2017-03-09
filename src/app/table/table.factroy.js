(function() {
  'use strict';
  // 表格类工厂, 主要提供解析创建表格对象, handsontable映射.

  angular
    .module('pf.table')
    .factory('tableFactory', tableFactory);

  tableFactory.$inject = ['dataService'];
  function tableFactory(dataService) {
    var service = {
      'sort': sort,
      'total': total,
      'parse': parse
    };
    Table.prototype.getCellId = function(r, c) { return this.idmap['id'][r][c]; };
    Table.prototype.getCellCoor = function(id) { return this.idmap['coor'][id]; };
    Table.prototype.addCellSpecial = addCellSpecial;
    return service;

    /**
     * 表格类, handsontable配置映射
     * @param {Array} data 二维数组
     * @param {Object} idmap id与坐标映射
     * @param {Array} special 特殊坐标的配置
     * @param {Number} floatNum 控制小数位
     * @param {Array} mergeCells 合并单元格描述
     * @param {Number} fixedRowsTop 冻结行
     * @param {Number} fixedColumnsLeft 冻结列
     */
    function Table(data, idmap, special, floatNum, mergeCells, fixedRowsTop, fixedColumnsLeft) {
      this.data = data;
      this.idmap = idmap; //
      this.special = special;
      this.floatNum = floatNum; //
      this.mergeCells = mergeCells;
      this.fixedRowsTop = fixedRowsTop;
      this.fixedColumnsLeft = fixedColumnsLeft;
    }

    /**
     * 解析成表格对象
     * @param  {Object} tableSouce 源数据
     * @return {Table}
     */
    function parse(tableSouce) {    	
      var data = [], merges = [], idmap = {};
      var values = tableSouce.values;
      var special = tableSouce.infoIconPosLst;
      var fixedRowsTop = tableSouce.fixedRowsTop;
      var fixedColumnsLeft = tableSouce.fixedColumnsLeft;
      var kbo = extract(values);
      data = kbo.data;
      idmap = kbo.idmap;
      merges = kbo.merges;
      special = extractSpecial(special);
      return new Table(data, idmap, special, 2, merges, fixedRowsTop, fixedColumnsLeft);
    }

    /**
     * 表格合计方法
     * @param  {String} sheetId 表id
     * @param  {String} type 行列
     * @param  {String} method 方法名
     * @return {Promise} 
     */
    function total(sheetId, type, method) {
      var params = {'sheetId': sheetId, 'type': type, 'method': method};
      return dataService.get('tableTotal', params).then(function(source) {
        return parse(source);
      });
    }
    

    /**
     * 表格后台排序, 后台有问题(column, desc, 3)
     * @param  {Stirng} sheetId 工作表id
     * @param  {Stirng} type 行|列
     * @param  {Stirng} order asc|desc
     * @param  {Number} index 行号|列号
     * @return {Promise}
     */
    function sort(sheetId, type, order, index) {
      var params = {'sheetId': sheetId, 'sortType': type,
                    'order': order, 'index': index};
      return dataService.get('tableSort', params).then(function(response) {
        return parse(response.tableVO);
      });
    }

    // 表格值格式化
    function cellFormat(cell) {
      return cell.value;
    }
    // 提取生成合并值
    function cellMerge(r, c, cell) {
      if (cell.colspan || cell.rowspan) {
        return {
          row: r, col: c,
          colspan: cell.colspan + 1,
          rowspan: cell.rowspan + 1
        };
      }
    }

    /**
     * 从表格值中提取所需要的数据
     * @param  {Array} values 源表格值
     * @return {Object} ()
     */
    function extract(values) {
      var result = {
    		  'data': [], 
    		  'merges': [],
              'idmap': {'id':{}, 'coor':{}}
      };
      var row = [];
      traverseTwoDimeArray(
        values,
        function(r, rdata) { row = []; },
        function(r, c, cell) {
          if (cell === null) { cell = {}; } // 啊啊啊啊啊啊啊啊啊
//console.info(r, c, cell.cellId);
          var value = cellFormat(cell);
          var merge = cellMerge(r, c, cell);
          // 映射
          var id = cell.cellId || r+','+c;
          if (!result.idmap.id[r]) { result.idmap.id[r] = {}; }
          result.idmap.id[r][c] = id;
          result.idmap.coor[id] = r+','+c;

          row.push(value);
          if(merge) { result.merges.push(merge); }
        },
        function(r, rdata) { result.data.push(row);}
        );
      return result;
    }

    /**
     * 提取特殊的单元格属性
     * @param  {xia} source 
     * @return {rnum:{cnum:{}}}
     */
    function extractSpecial(source) {
      var special = {};
      angular.forEach(source, function(sok, index) {
        if (!special[sok.x]) { special[sok.x] = {} };
        if (!special[sok.x][sok.y]) { special[sok.x][sok.y] = {}; }
        var cols = special[sok.x][sok.y];

        cols.code = sok.code;
        cols.type = sok.type;
      });
      return special;
    }

    /**
     * 指定坐标添加单元格属性
     * @param {String} r    [description]
     * @param {String} c    [description]
     * @param {Object} data [description]
     */
    function addCellSpecial(r, c, data) {
      var special = this.special;
      if (!special[r]) { special[r] = {}; }
      if (!special[r][c]) { special[r][c] = {}; }
      special[r][c] = angular.extend(special[r][c], data);
      return special[r][c];
    }

    /**
     * 遍历二维数组, 读每行及每列时执行回调
     * @param  {Array} twoArray 二维数组
     * @param  {Function} rowProcess 读行的回调(行号, 行数据)
     * @param  {Function} colProcess 读列的回调(列号, 列数据)
     * @param  {Function} rowAfterProcess 改行读完后(列号, 列数据)
     */
    function traverseTwoDimeArray(twoArray, rowProcess, colProcess, rowAfterProcess) {
      for (var r = 0, rlen = twoArray.length; r < rlen; r++) {
        var rowData = twoArray[r];
        if (rowProcess) { rowProcess(r, rowData); }
        for (var c = 0, clen = rowData.length; c < clen; c++) {
          var cellData = rowData[c];
          if (colProcess) { colProcess(r, c, cellData); }
        }
        if (rowAfterProcess) { rowAfterProcess(r, rowData); }
      }
    }
  }

})();