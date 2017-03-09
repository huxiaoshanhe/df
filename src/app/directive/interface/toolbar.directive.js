(function() {
  'use strict';

  angular
    .module('pf.directive')
    .directive('toolbar', toolbarDirective);

  toolbarDirective.$inject = ['toolbarService', 'handsontableService', 'coreCF'];
  function toolbarDirective(toolbarService, handsontableService, config) {
    return {
      replace: true,
      templateUrl: 'app/template/toolbar.html',
      link: function(scope, element, attrs, ctrl) {
        var _spk = config.spreadKey;
        var _data = toolbarService.getData();
        var _hasStatusAry = [], _mapKey = []; // 存在状态判断的项

        angular.forEach(_data, function(item, key) {
          if (item.type === 'line') { item.jq = createLine(); }
          else if (item.childs) { createGroup(item, key); }// 组
          else { createButton(item, key); } // 单个按钮
          if(item.status) {
            _hasStatusAry.push(item);
            _mapKey.push(key);
          } else if (item.childs && item.childs['deal']) {
            _hasStatusAry.push(item.childs['deal']); // 子项操作按钮
            _mapKey.push(key); // 父key
          }

          element.append(item.jq);
          element.append('&nbsp;');
        });
//console.info(_hasStatusAry);

        // 监听表格选中(在这里注册耦合高)
        handsontableService.addAfterSelectionEnd(function(r, c, r2, c2) {
          var _table = handsontableService.trtb();
          var kary = _mapKey.concat();
          var stary = _hasStatusAry.concat(); // 不破坏源数据

          // 匹配单元格状态
          handsontableService.getAreaCood(r, c, r2, c2, function(r, c) {
            if (_table.special[r] && _table.special[r][c]) { // 是一个特殊的单元格
              for (var i = 0, ilen = stary.length; i < ilen; i++) {
                var bitem = stary[i], special = _table.special[r][c];
                angular.forEach(special, function(cp, type) {
                  // 找激活状态下的值
                  if (bitem.smap && cp[bitem.attr] === bitem.smap['none']) { // 单项键
                    toolbarService.updateStatusByVal(kary[i], cp[bitem.attr]);
                    stary.splice(i, 1); kary.splice(i, 1);
                    i = -1, ilen = stary.length; // 重来
                  } else if (cp[bitem.attr] && bitem.upval) { // 按钮组
                    bitem.val = cp[bitem.attr];
                    bitem.upval(bitem.jq, cp[bitem.attr]);
                    stary.splice(i, 1); kary.splice(i, 1);
                    i = -1, ilen = stary.length; // 重来
                  }
                });
              }
            }
          });

          // 未命中的图标
          angular.forEach(kary, function(key) {
            toolbarService.toggleStatus(key, 'hover');
          });
        });

        // 切换重置
        scope.$on(_spk.sheetChange, function() {
         angular.forEach(_hasStatusAry, function(item, index) {
            if (item.upval) {
              // 不方便?
              //item.val = item.dfval;
              //item.upval(item.jq, item.dfval);
            } else { toolbarService.toggleStatus(_mapKey[index], 'hover'); }
          });
        });

        /***************************创建方法**********************************/

        // 创建图标
        function createIcon(name) {
          var icon = $('<i>');
          icon.addClass('icon').addClass('icon-' + name);
          return icon;
        }

        // 创建分割线
        function createLine() {
          var line = $('<span class="tool-cut">&nbsp;</span>');
          return line;
        }

        // 创建容器
        function createContainer(item,info) {
        	if(typeof info==='string') {
        		var container = $('<span title="'+info+'">'), cName = 'icon-container';
        	} else {
        		var container = $('<span title="背景颜色">'), cName = 'icon-container';
        	}
          
          if (item.icon || item.icons) {
            var icons = item.icon || item.icons;
            if (typeof icons === 'string') { icons = [icons]; }
            angular.forEach(icons, function(fill, index) {
              container.append((typeof fill === 'object' ? fill : createIcon(fill)));
            });
          } else {
            cName = 'font-container';
            container.append(item.val);
          }
          container.addClass(cName);
          if (item.style) { container.css(item.style); }
          return container;
        }

        // 创建按钮
        function createButton(item, key) {
          if(key==='filter'&&config.filter===true) {
            var btn = $('<span class="tool-btn hover">');
          } else {
            var btn = $('<span class="tool-btn">');
          }
          var container = createContainer(item,item.info);
          btn.append(container).click(function(e) {
            var key = $(this).attr('data-key'), fkey = '';
            var fsp = $(this).parent('.tool-group');
            if (fsp.length) { fkey = fsp.attr('data-key'); }
            if(key==='filter') {
              config.filter=!config.filter;
              if(config.filter===true) {
                btn.addClass('hover');
              } else {
                btn.removeClass('hover');
              }             
            }
            toolbarService.ex(key, fkey);
            e.stopPropagation();
          });
          item.jq = btn.attr('data-key', key);
          return btn;
        }

        // 创建菜单组
        function createGroup(item, key) {
          var group = $('<div class="tool-group">');
          angular.forEach(item.childs, function(child, ckey) {
            var btn = createButton(child, ckey);
            if (ckey === 'more') { btn.addClass('tool-more'); }
            group.append(btn);
          });
          item.jq = group.attr('data-key', key);
          return group;
        }
      }
    };
  }

})();
