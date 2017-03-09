'use strict';
// 图标指令
window.define(
[
 'angular',
 'echarts'
],
function (angular, ec) {

  angular
    .module('directive.charts', [])
    .directive('chart', chartDirective)
    .directive('mapchart', chartDirective2);

    function chartDirective () {
      return {
        restrict: 'EA',
        scope: {'chartData': '='},
        template: '<div><div>',
        link: function (scope, element, attrs) {
          var ct = element.children('div')[0];
          var p = element.parent();
          $(ct).width(p.width()-30).height((p.height() <= 300?300:p.height ()));
          if (attrs.width) {
        	  $(ct).width(attrs.width-0);
          }
          if (attrs.height) {
        	  $(ct).height(attrs.height-0);
          }

          var myChart = window.echarts.init(ct);
          scope.$watch('chartData', function (option) {
            if (option) {
              // option.grid = {x:70, y:80, x2:70, y2:70};

if (option.yAxis && option.yAxis[0] && option.yAxis[0].axisLabel) {
	option.yAxis[0].axisLabel.formatter = formatter;
}
if (option.yAxis && option.yAxis[0] && option.xAxis[0].axisLabel) {
	option.xAxis[0].axisLabel.formatter = formatter;
}
              myChart.setOption(option);
              window.qsrChart = [ct, myChart];
            }
          });
        }
      };
    }
    
    // 格式化
    function formatter (value) {
    	return value;
    }

    function chartDirective2 () {
      return {
        restrict: 'EA',
        scope: {'chartData': '='},
        template: '<div><div>',
        link: function (scope, element, attrs) {
          var ct = element.children('div')[0];
          var p = element.parent();
          $(ct).width(p.width()-30);
          $(ct).height(450);
var myChart = window.echarts.init(ct);
//console.info(window.echarts);

scope.$watch('chartData', function (option) {
  if (option) {
    // option.grid = {x:70, y:80, x2:70, y2:70};
    var ecConfig = window.echarts.config;
    var zrEvent = window.zrender.tool.event; // require('zrender/tool/event');
    var curIndx = 0;
    var mapType = [
        'china',
        // 23个省
        '广东', '青海', '四川', '海南', '陕西', 
        '甘肃', '云南', '湖南', '湖北', '黑龙江',
        '贵州', '山东', '江西', '河南', '河北',
        '山西', '安徽', '福建', '浙江', '江苏', 
        '吉林', '辽宁', '台湾',
        // 5个自治区
        '新疆', '广西', '宁夏', '内蒙古', '西藏', 
        // 4个直辖市
        '北京', '天津', '上海', '重庆',
        // 2个特别行政区
        '香港', '澳门'
    ];
    // document.getElementById('main').onmousewheel = function (e){
    //     var event = e || window.event;
    //     curIndx += zrEvent.getDelta(event) > 0 ? (-1) : 1;
    //     if (curIndx < 0) {
    //         curIndx = mapType.length - 1;
    //     }
    //     var mt = mapType[curIndx % mapType.length];
    //     if (mt === 'china') {
    //         option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}';
    //     }
    //     else{
    //         option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}';
    //     }
    //     option.series[0].mapType = mt;
    //     option.title.subtext = mt + ' （滚轮或点击切换）';
    //     myChart.setOption(option, true);
        
    //     zrEvent.stop(event);
    // };
    myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
      //console.info('param');
        var len = mapType.length;
        var mt = mapType[curIndx % len];
        if (mt === 'china') {
            // 全国选择时指定到选中的省份
            var selected = param.selected;
            for (var i in selected) {
                if (selected[i]) {
                    mt = i;
                    while (len--) {
                        if (mapType[len] === mt) {
                            curIndx = len;
                        }
                    }
                    break;
                }
            }
            option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}';
        }
        else {
            curIndx = 0;
            mt = 'china';
            option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}';
        }
        option.series[0].mapType = mt;
        option.title.subtext = mt + ' （滚轮或点击切换）';
        myChart.setOption(option, true);
    });
    myChart.setOption(option);
    window.qsrChart = [ct, myChart];
  }
});
        }
      };
    }
});