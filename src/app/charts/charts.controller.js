(function() {
  'use strict';

  angular
    .module('pf.charts')
    .controller('chartCtrl', chartCtrl);


  chartCtrl.$inject = [
    '$scope',
    'handsontableService',
    'containerService',
    'sheetService',
    'chartService',
    'coreCF'];
  function chartCtrl($scope, handsontableService, containerService, sheetService, chartService, config) {
    var _spk = config.spreadKey;
    var _nowSheetId = null;
    var that = this;
    that.charts = null;

    // 图表数据变更监听
    $scope.$on(_spk.chartsChange, function(e, charts) {
      that.charts = charts;
    });

    // 监听表变更时切换图表缓存
    $scope.$on(_spk.sheetChange, function(e, sheet) {
      var sheetId = sheet.id;
      var show = sheetService.getRecord('chartRow');
      containerService.switchRow('r1', !!show);
      if (!!show) {
        var cache = chartService.getChartById(sheet.id);
        if (sheetId === _nowSheetId) { chartService.getCharts(cache.type); }
          else { that.charts = cache; }
      } else { that.charts = null; } // echarts高度问题
      _nowSheetId = sheetId;
    });

    // 容器行关闭监听
    $scope.$on(_spk.closeContainerRow, function(e, name) {
      if (name === 'r1') {
        sheetService.setRecord('chartRow', false);
      }
    });

    // handsontable 选中监听
    handsontableService.addAfterSelectionEnd(function(r, c, r1, c1) {
      var show = sheetService.getRecord('chartRow');
      if (!!show) {
        var type = that.charts.type;
        chartService.getAreaCharts([r, c], [r1, c1], type);
      }
    });
  }

})();
