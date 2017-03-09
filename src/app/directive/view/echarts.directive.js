(function() {
  'use strict';
  // 图表指令

  angular
    .module('pf.directive')
    .directive('echarts', echartsDirective);

  echartsDirective.$inject = ['coreCF'];
  function echartsDirective(config) {
    return {
      replace: true,
      scope: {'chart': '=' },
      template: '<div style="height:100%; position:relative"></div>',
      link: function(scope, element, attrs) {
        var _spk = config.spreadKey;
        var _fileMap = {
          'pie': ['pie', 'ring'],
          'radar': ['radar', 'fillradar'],
          'line': ['line', 'stackline', 'area', 'stackarea'],
          'bar': ['bar', 'stackbar', 'rotatebar', 'stackrotatebar'],
          'scatter':['scatter'],
          'map':['map','hmap']
        };
        var _myChart = null;

        require.config({
          paths: { echarts: 'http://echarts.baidu.com/build/dist' }
        });

        scope.$watch('chart', function(chart) {
          if (!chart) { return; }
          chart.data.tooltip.trigger = 'item';

          var menuKey = chart.type.toLowerCase();

          var rtype = 'echarts/chart/' + getFileName(menuKey);
          require(['echarts', rtype], function(ec) {
            _myChart = ec.init(element[0]);
            var indicatorLetters = '';
            angular.forEach(chart.data.legend.data,function(v,k) {
              indicatorLetters+=v;
            });
            if(indicatorLetters.length>100) {              
              if(chart.data.grid!==undefined) {
                chart.data.grid = {};
                chart.data.grid.x = 300;
              }            
              chart.data.legend.show = false;
            }
            _myChart.setOption(chart.data);
            if(indicatorLetters.length>100) {
              var divLegends = $('<div class="chart"></div>').appendTo(element[0]);
              switch(menuKey) {
                case 'bar':
                case 'rotatebar':
                case 'stackbar':
                case 'stackrotatebar':
                var legend = _myChart.chart['bar'].component.legend;
                break;
                case 'line':
                case 'stackline':
                case 'area':
                case 'stackarea':
                var legend = _myChart.chart['line'].component.legend;
                break;
                case 'pie':
                case 'ring':
                var legend = _myChart.chart['pie'].component.legend;
                break;
                case 'radar':
                case 'fillradar':
                var legend = _myChart.chart['radar'].component.legend;
                break;
                case 'scatter':
                var legend = _myChart.chart['scatter'].component.legend;
                break;
              }
              $(chart.data.legend.data).each(function(i, l){
                  var color = legend.getColor(l);
                  var labelLegend = $('<label class="legend">' +
                          '<span class="label" style="background-color:'+color+'"></span>'+l+'</label>');
                  labelLegend.mouseover(function(){
                      labelLegend.css('color', color).css('font-weight', 'bold');
                  }).mouseout(function(){
                      labelLegend.css('color', '#333').css('font-weight', 'normal');
                  }).click(function(){
                      labelLegend.toggleClass('disabled');
                      legend.setSelected(l, !labelLegend.hasClass('disabled'));
                  });
                  divLegends.append(labelLegend);
              });
              _myChart.on('restore', function(param){
                  divLegends.children('.legend').each(function(i, labelLegend){
                      $(labelLegend).removeClass('disabled');
                  });
              });
            }
            window.onresize = _myChart.resize;
          });
        });

        scope.$on(_spk.containerSizeChange, function(e, timeout){
          window.setTimeout(function(){
            if(_myChart) { _myChart.resize(); }
          }, timeout || 1);
        });

        // 根据映射获取文件名
        function getFileName(menuKey) {
          for (var key in _fileMap) {
            if (_fileMap.hasOwnProperty(key)) {
              var fileAry = _fileMap[key];
              if (fileAry.indexOf(menuKey) !== -1) {
                return key;
              }
            }
          }
          return menuKey;
        }
      }
    };
  }

})();