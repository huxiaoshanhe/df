(function() {
  'use strict';
  // handsontable指令服务, 我觉得渲染可能要一个中间的协调者

  angular
    .module('pf.directive')
    .factory('handsontableService', handsontableService);

  handsontableService.$inject = ['$rootScope', 'indicatorService', 'tableService', 'informationService', 'sheetService', 'descService', 'coreCF', 'conditionService', 'workbookService'];
  function handsontableService($rootScope, indicatorService, tableService, informationService, sheetService, descService, config, conditionService, workbookService) {
    var _hd = null; // 没有人说抱歉
    var _table = null;
    var _hoverIcon = []; // 唯一激活判断
    var _pive = { // 中转私有
      rmcodes: [],
      afterSelectionEndCallback: [] // 选中结束鼠标抬起回调数组
    };
    var _settings = { // 默认参数
      rowHeaders: true,
      colHeaders: true,
      manualRowResize: true, // 调整大小
      manualColumnResize: true, // 调整大小
      outsideClickDeselects: false // 点击不去掉选中
    };
    var service = {
      'trtb': function() { return _table; },
      'settings': createSettings,
      'getAreaCood': getAreaCood,
      'adjustFloatSize': adjustFloatSize,
      'addSelectedAreaCalc': addSelectedAreaCalc,
      'addSelectedAreaStyle': addSelectedAreaStyle,
      'addAfterSelectionEnd': addAfterSelectionEndCallback,
      'setHandsontable': function(handsontable){ _hd = handsontable; },
      'getSelected': getSelected,
    };
    return service;

    /**
     * 根据表格类创建handsontable配置对象
     * @param  {Table} table 表格类
     * @return {Object} handsontable配置
     */
    function createSettings(table) {
      _table = table;
      pushCellStyleSpecial(); // 有些操作是要分离到表格服务中的
      var settings = {
        data: table.data,
        mergeCells: table.mergeCells,
        fixedRowsTop: table.fixedRowsTop,
        fixedColumnsLeft: table.fixedColumnsLeft,
        cells: function(row, col, prop) {
          var cellProperties = {};
          cellProperties.readOnly = true; // 只读
          cellProperties.renderer = PolicemenRenderer;
          cellProperties.format = '0,0.00'; // 默认, 实际由渲染来控制
          return cellProperties;
        },
        afterSelectionEnd: function(r, c, r2, c2) {
          var cbary = _pive.afterSelectionEndCallback;
          for (var i = 0, ilen = cbary.length; i < ilen; i++) { cbary[i](r, c, r2, c2); }
        },
        contextMenu: {
          items: {
            'rmIndicator': {
              name: '删除指标',
              disabled: rmIndicatorDisableCheck
            },
            'descStatistics': {
                name: '描述性统计'
            }
          },
          callback: function(key, opts) {
            switch(key) {
              case 'rmIndicator':
                if (_pive.rmcodes.length) { indicatorService.remove(_pive.rmcodes); }
                break;
              case 'descStatistics':
            	  var sheetId = sheetService.getSheetId();
            	  var area = getSelected();
            	  descService.setDesc(sheetId,area);
            	  $('.descarea').show();
            	  break;
              case 'clearBlankIndicator':
                var params = conditionService.getGundam();
                params.dealStr = 'removeEmpty';
                workbookService.syncWorkBook(params);
                break;
              default: break;
            }
          }
        }
      };
      return angular.extend(_settings, settings);
    }

    /**
     * 添加选中事件回调函数
     * @param {Function} callback 回调方法
     */
    function addAfterSelectionEndCallback(callback) {
      if (angular.isFunction(callback)) {
        _pive.afterSelectionEndCallback.push(callback);
      }
    }

    /**
     * 对选中的区域添加样式
     * @param {Object} style
     */
    function addSelectedAreaStyle(style) {
      var area = _hd.getSelected();
      if (!area) { return; }

      var syList = tableService.getTempRecord('syList') || {};
      getAreaCood(area[0], area[1], area[2], area[3], function(r, c){
        var cellId = _table.getCellId(r, c);
        syList[cellId] = angular.extend(syList[cellId] || {}, style);
      });

      tableService.setTempRecord('syList', syList);
      pushCellStyleSpecial();
      _hd.render();
    }
    
    /**
     * 获取搜选中的单元格坐标
     * @returns []
     */
    function getSelected() {
    	var area = _hd.getSelected();
    	return area;
    }

    /**
     * 填入单元格样式特殊定义
     * @return {[type]} [description]
     */
    function pushCellStyleSpecial() {
      var syList = tableService.getTempRecord('syList');
      angular.forEach(syList, function(style, id) {
        // 后台id无法定位问题, 日, 只有在计算时才能保存已定义样式.
        var coor = _table.getCellCoor(id);
        if (coor) {
          coor = coor.split(',');
          _table.addCellSpecial(coor[0], coor[1], {'style': style});
        }
      });
    }

    /**
     * 为选中的区域添加计算的数据
     * @param {Object} calc 计算方法标示
     */
    function addSelectedAreaCalc(calc) {
      var area = _hd.getSelected();
      if (!area) { return; }

      getAreaCood(area[0], area[1], area[2], area[3], function(r, c){
        if (_table.special[r] && _table.special[r][c] && _table.special[r][c].calc) {
          // {} 防止引用问题
          calc = angular.extend({}, _table.special[r][c].calc, calc);
        }
        _table.addCellSpecial(r, c, {'calc': calc});
      });
      _hd.render();
    }

    /**
     * 调节小数点的位数
     * @param  {Number} direction -1 左 1 右
     */
    function adjustFloatSize(direction) {
      var value = _table.floatNum + direction;
      if (value >= 0 && value < 5) { 
        _table.floatNum = value;
      }
      _hd.render();
    }

    // 菜单禁用验证
    function rmIndicatorDisableCheck() {
      _pive.rmcodes = [];
      var size = indicatorService.getCodesSize(), area = _hd.getSelected();
      getAreaCood(area[0], area[1], area[2], area[3],
        function(row, col){
          var meta = _hd.getCellMeta(row, col), special = meta.mydata;
          if (special && special.type === 'indicator') {
            _pive.rmcodes.push(special.code);
          }
      });
      var indicSize = _pive.rmcodes.length;
      // 指标数不能为0, 不能删除所有指标
      return indicSize === 0 || size - indicSize < 1;
    }

    /**-------------------------渲染器定义-------------------------**/

    // 统一渲染
    function PolicemenRenderer(instance, td, row, col, prop, value, properties) {
      var that = this;
      RowRenderer.apply(this, arguments); // 行渲染

var fs = (new Array(_table.floatNum + 1)+'').replace(/,/g, '0');
if (fs) { fs = '.' + fs; }
properties.format = '0,0' + fs;

      window.Handsontable.renderers.NumericRenderer.apply(this, arguments); // 数字格式化

      // 特殊单元格判断
      if (_table.special[row] && _table.special[row][col]) {
        var colSpecial = _table.special[row][col];
        properties['mydata'] = colSpecial;

        switch(colSpecial.type) {
          case 'indicator': IndicatorRenderer.apply(that, arguments); break;
          //case 'total': TotalRenderer.apply(that, arguments); break; // 计算对比好难!!!
          default: break;
        }

        // 存在自定义样式
        if (colSpecial.style) { StyleRenderer.apply(that, arguments); }
        // 存在计算的方法
        if (colSpecial.calc) { CalcRenderer.apply(that, arguments); }
      }
    }

    // 行渲染器
    function RowRenderer(instance, td, row) {
      if (row % 2 !== 0) { td.style.backgroundColor = '#F9F9F9'; }
    }

    // 指标渲染器
    function IndicatorRenderer(instance, td) {
      window.Handsontable.renderers.HtmlRenderer.apply(this, arguments);

      // 保证唯一?
      if ($(td).children('.icon-btn').length) { return td; }
      var code = arguments[6]['mydata'].code;
      var currentSheetId=sheetService.getSheetId();
      if(config.isMyUploadFile===1) {
    	  var icon = $('');
      } else {    	  
    	  var icon = $('<i class="icon-btn icon-info"></i>'); 
      }
      
      var indicatorId = informationService.getNowId();

      if (code === indicatorId) { icon.addClass('hover'); _hoverIcon.push(icon);}
        else { icon.removeClass('hover'); }

      // 小icon点击和阻止选中单元格
      icon.appendTo($(td)).click(function(e) {
        informationService.toggleId(code);
        indicatorId = informationService.getNowId(); // 做个样子获取一下
        $rootScope.$apply(); // 效率?

        if (indicatorId === code) {
          if (_hoverIcon) {
            angular.forEach(_hoverIcon,function(v,k) {
              v.removeClass('hover');
            });            
            _hoverIcon = [];
          }
          icon.addClass('hover');
          _hoverIcon.push(icon);
        }
      }).mousedown(function(e) {
        e.stopPropagation();
      }); // 阻止选中单元格
    }

    // 样式渲染器
    function StyleRenderer(instance, td) {
      var style = arguments[6]['mydata'].style;
      angular.forEach(style, function(val, key) {
        if (key === 'font-size' && val .indexOf('px') === -1) { val += 'px'; }
        td.style[key] = val;
      });
    }

    // 计算渲染器
    function CalcRenderer(instance, td, row, col, prop, value) {
      var calc = arguments[6]['mydata'].calc;
      if (!value || isNaN(value)) { return; }
      if (calc.e === true) { value = Math.log(value); }
      if (calc.percent === true) {
        //value = value * 100;
        arguments[6].format = '0,0%';
      }

      arguments[5] = value;
      window.Handsontable.renderers.NumericRenderer.apply(this, arguments); // 数字格式化
    }

    /**
     * 获取一个区域的坐标, 提供每个点的回调, 不分开始结束
     * @param  {Object}   start 起点
     * @param  {Object}   end 终点
     * @param  {Function} callback 回调
     */
    function getAreaCood(r1, c1, r2, c2, callback) {
      var start = {row:r1, col:c1}, end = {row:r2, col:c2};
      for(var r = (start.row < end.row ? start.row : end.row),
           rlen = r + Math.abs(start.row - end.row); r <= rlen; r++) {
        for(var c = (start.col < end.col ? start.col : end.col),
             clen = c + Math.abs(start.col - end.col); c<=clen; c++) {
          var pop = callback(r, c);
          if (pop === false) { return; } // 出口, 查找不希望都找一遍
        }
      }
    }
  }

})();