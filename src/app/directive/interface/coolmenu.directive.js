(function() {
  'user strict';
  angular
    .module('pf.directive')
    .directive('coolmenu', coolMenuDirective);

  coolMenuDirective.$inject=['sheetService', 'conditionService', 'coreCF'];
  function coolMenuDirective (sheetService, conditionService, config) {
    return {
      scope: {'data': '=', callback: '&'},
      templateUrl: 'app/template/coolmenu.html',
      link: function(scope, element, attrs) {
        var _power = false; // 悬浮开关
        var root = element.children('.menu').empty();
        var _callback = scope.callback();

        // 监听从新创建绑定
        scope.$watch('data', function(data) {
          if (!data) { return; };
          root = element.children('.menu').empty();
          _power = false; // 悬浮开关

          // 迭代添加元素
          traversal(data, root, function(item, quote) {
            var li = createItem(item.key, item.text, item.clear);
            if (item.type === 'line') {
              quote.append('<li class="group-line"></li>');
            } else { quote.append(li); }
            if (item.childs) { return $('<ul>').appendTo(li.addClass('child')); }
              else { return li; }
          });

          // 清空
          root.children('li').removeClass('child').click(function(e) {
            /*if($(this).attr('data-key')==='xxx') {
              var gundam = conditionService.getGundam();
              if(gundam.metaRow.length!==1||gundam.metaRow[0]!=='timeCode'){
                alert('当且仅当时间维度在行上的时候才能进行分析预测！');
                return false;
              }
            }*/
            //点击主菜单时，判断哪些操作可显示清除结果的“X”
            showCanClear();
            _power = true; $(this).mouseover();            
          });
        });

        $(window).click(function(){
          _power = false;
          root.find('.hover').removeClass('hover');
        });

        // 遍历
        function traversal(array, father, callback) {
          for (var i = 0, ilen = array.length; i < ilen; i++) {
            var item = array[i];
            var quote = callback(item, father);
            if (item.childs) { traversal(item.childs, quote, callback); }
          }
        }

        // 创建基本项
        function createItem(key, text, clear) {
          var li = $('<li>').attr('data-key', key).addClass('menu-'+key);
          if(clear!==undefined) {
        	  li.append('<a href="javascript:;">'+ text +'</a><i>X</i>');
          } else {
        	  li.append('<a href="javascript:;">'+ text +'</a>');
          }
          li.click(clickFn);
          li.mouseover(hoverFn);
          var i = li.find('i');
          i.click(clearClick);
          return li;
        }
        
        function clearClick(e) {
        	var li=$(this).parent(li);
        	var key = li.attr('data-key');
        	//li.removeClass('canClear');

          //从当前表的表格操作记录中移除操作记录开始
          var p_key = li.parents('li').attr('data-key');
          var obj={};
          var sheetId = sheetService.getSheetId();
          obj.sheetId = sheetId;
          obj.control = key+'-'+p_key;
          angular.forEach(config.hasCalculatorSheets,function(v,k){
            if(v.sheetId===obj.sheetId&&v.control===obj.control) {
              config.hasCalculatorSheets.splice(k,1);
            }
          });
          showCanClear();
          //从当前表的表格操作记录中移除操作记录结束

        	var prekey = li.parent('ul').parent('li').attr('data-key');
        	sheetService.clearTable(key,prekey);
        	li.parents('.hover').each(function(){
                $(this).removeClass('hover').attr('data-key');
          });
        	e.stopPropagation();
        }

        // 激活方法
        function hoverFn() {
          /*if (_power === false) { 
            return; 
          } else {
            if($(this).attr('data-key')==='xxx') {
              var gundam = conditionService.getGundam();
              if(gundam.metaRow.length!==1||gundam.metaRow[0]!=='timeCode'){
                _power = false;
                $(this).siblings().removeClass('hover');
                return false;
              }
            }
            $(this).addClass('hover').siblings().removeClass('hover');
          }*/  
          if (_power === false) { return; }
          $(this).addClass('hover').siblings().removeClass('hover');        
        }

        // 点击方法
        function clickFn(e) {
          _power = false; var li = $(this);          
          var p_key = li.parents('li').attr('data-key');
          var key = li.attr('data-key'), keys = [];
          
          //记录当前表的表格操作开始
          if(p_key==='rows'||p_key==='columns') {
            var obj={};
            var sheetId = sheetService.getSheetId();
            obj.sheetId = sheetId;
            obj.control = key+'-'+p_key;
            if(config.hasCalculatorSheets.indexOf(obj)===-1) {
              config.hasCalculatorSheets.push(obj);
            }
          }
          //记录当前表的表格操作结束

          li.parents('.hover').each(function(){
            keys.push($(this).removeClass('hover').attr('data-key'));
          });
          _callback(key, keys);
          e.stopPropagation();
          showCanClear();
        }

        /**
         *根据当前sheetId判断与config.hasCalculatorSheets中所记录的当前表的操作来判断是否显示清除结果的“X”
         */
        function showCanClear() {
          $('.menu i').css('display','none');
           angular.forEach(config.hasCalculatorSheets,function(v,k) {
              var arr = v.control.split('-');
              if(v.sheetId===config.currentSheet) {
                $('.menu-'+arr[1]+' .menu-'+arr[0]+' i').css('display','inline-block');
              }        
            });
        }
      }
    };
  }

})();