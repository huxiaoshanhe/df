// 分析结果解析
window.define(
[],
function () {



  function resultServer ($rootScope, $location, backstageService, localProxyService, $timeout, $anchorScroll) {
    var priv = {}, service = {};
    //service.share = share;
    service.parse = parse;
    service.parseGroup = parseGroup;
    service.get = getLocalData;
    service.getBackstage = getBackstage;

    service.createTable = createTable;
    service.getCellKeys = getCellKeys;
    service.parseMatrix = parseMatrix;

    service.parseMatrix2 = parseMatrix2;
    service.appendMaxtrixY = appendMaxtrixY;
    service.fsHeadMapByArray = fsHeadMapByArray;
    service.parseVerticalData = parseVerticalData;

    // 获取本地数据
    function getLocalData (dKey) {
      var data = localProxyService.get(dKey);
      return data;
    }

    // 分享数据
    function getBackstage (shareId) {
      var params = {};
      params.action = 'get';
      params.shareId = shareId;
      return backstageService.query('share', params);
    }

    // 分享
    function shareData (type, shareId) {
      var params = {};
      params.action = 'share';
      params.shareId = shareId;
      var url = location.href + '/share/' + shareId;
// window.prompt('分享链接为:(Ctrl + C 复制)', url);
      return backstageService.query('share', params);
    }

    // 按部分解析
    function parse (partsMap, parseMap, source) {
      if (!source) { /*console.error('啥也没有!');*/ return null; }
      var textResults = [];
      for (var i = 0, ilen = partsMap.length; i < ilen; i++) {
        var partMap = partsMap[i]; // 映射关系
        var part = parsePart(partMap, parseMap, source);
        textResults.push(part);
      }
      return textResults;
    }

    // 按组解析
    // 每个项是一组部分
    function parseGroup (parseMap, source) {
      if (!source) { /*console.error('啥也没有!');*/ return null; }
      var textResults = [];
      angular.forEach(source, function (group, i) {
        var partMap = getPartMap(group);
        var part = parsePart(partMap, parseMap, group);
        textResults.push(part);
      });
      return textResults;
    }

    // 解析一部分
    function parsePart (partMap, parseMap, source) {
      var part = {}; // 返回部分
      part.keys = []; // 输出顺序
      for (var j = 0, jlen = partMap.keys.length; j < jlen; j++) {
        var sourceKey = partMap.keys[j];
        var partSource = source[sourceKey]; // 子项对应元数据
        if (partSource) {
          part[sourceKey] = partSource; // 默认处理方法
          var parseFn = parseMap[sourceKey]; // 处理对象(怎样处理)
          if (angular.isFunction(parseFn)) {
            part[sourceKey] = parseFn(partSource);
          }
          part.keys.push(sourceKey);
          part.name = partMap.name;
        }
      }
      return part;
    }

    // 根据头映射获取到key数组
    function getCellKeys (headMap) {
      var array = [];
      angular.forEach(headMap, function (map) {
        array.push(map.key);
      });
      return array;
    }

    // 获取部分映射
    function getPartMap (group) {
      var partMap = {};
      partMap.name = group.modelName;
      partMap.keys = [];
      angular.forEach(group, function (attr, key) {
        if (key !== 'modelName') {
          partMap.keys.push(key);
        }
      });
      return partMap;
    }

    // 过滤
    function numFilter (value, accu) {
      var str = 'null';
      if (angular.isNumber(value)) {
    	if (value > 9999) { // 整数四位
    		value = value.toExponential(2);
    	} else if (value > 1) {
    		value = value.toFixed(4);
    	}else if (value < 0.0001) {
    		if (value < 0) {
    			value = -numFilter(-value);
    		} else {
    			value = 0;
    		}
    	} else if (value < 1) {
    		value = value.toFixed(4);
    		//value = value.toExponential(2);
    	} else {
    		value = value;
    	}

      } else if (angular.isString(value)) {
    	  str = value;
      } else {
    	  value = '';
      }

      str = value;
      return str;
    }

    // 指定键数组,表头key映射,和元数据
    function createTable (cellKeys, headMap, source) {
      var table = document.createElement('table');
      var thead = createTableHead(headMap);
      var tbody = createTableBody(cellKeys, source, numFilter);
      table.appendChild(thead);
      table.appendChild(tbody);
      table.className = 'rtable';
      return table;
    }

    // 创建表头
    // 应按照cellKeys创建???
    // 没有数据的应该删除相应的头???
    function createTableHead (titleMap) {
      var thead = document.createElement('thead');
      createTreeRow(titleMap, {}, function (row) {
        thead.appendChild(row);
      });
      return thead;
    }

    // 一层一层创建树结构行
    function createTreeRow (tree, bachelors, rtCallBack) {
      var isCreateNext = false; // 是否创建下一层
      var row = document.createElement('tr');
      var nextNodes = []; // 下一层节点
      // 一层一层
      angular.forEach(tree, function (node, i) {
        node.dom = document.createElement('th');
        node.dom.innerHTML = node.name;
// 添加key方便添加icon
if (node.key && node.key !== '_') {
  $(node.dom).attr('id', 'gentle_' + node.key).addClass('min-icon-cn');
}
        row.appendChild(node.dom);
        if (node.child) {
          var length = node.child.length;
          node.dom.colSpan = length;
          nextNodes = nextNodes.concat(node.child); // XXX
          isCreateNext = true;
          // 合并计数传递
          addSupCountFn(node, node.child);
        } else {
          bachelors[i] = node; // 无子项向下合并
        }
      });
      rtCallBack(row);
      if (isCreateNext) {
        angular.forEach(bachelors, function (node) {
          node.dom.rowSpan += 1;
        });
        createTreeRow(nextNodes, bachelors, rtCallBack);
      }
    }
    // 添加向上合并方法,为子项
    function addSupCountFn (parent, child) {
      for (var i = 0, ilen = length; i < ilen; i++) {
        var childNode = child[i];
        // 添加父级增加合并方法
        childNode.supCount = function (num) {
          parent.dom.colSpan += num;
          // 向上传递
          if (parent.supCount) { parent.supCount(num) ;}
        };
      }
    }

    // 遍历二维数据创建表格
    function createTableBody (cellKeys, twoDimData, filter) {
      var tbody = document.createElement('tbody');
      angular.forEach(twoDimData, function (rowD) {
        var row = tbody.insertRow();
        angular.forEach(cellKeys, function (key) {
          var cell = row.insertCell();
          cell.title = rowD[key];
          if(key==='lagOrders') {
            cell.innerHTML = rowD[key];
          } else {
            cell.innerHTML = filter ? filter(rowD[key]) : rowD[key];
          }          
        });
      });
      return tbody;
    }

    // 解析列数据
    function parseVerticalData (vdata) {
      var result = {};
      result.keys = [];
      result.data = [];
      dropDrop(vdata, function (key, cells) {
        result.keys.push(key);
        // 一列数据
        for (var i = 0, ilen = cells.length; i < ilen; i++) {
          var row = result.data[i];
          if (!row) { row = {}; result.data.push(row); }
          row[key] = cells[i];
        }
      });
      return result;
    }
    function dropDrop (object, callback) {
      angular.forEach(object, function (child, key) {
        if (angular.isArray(child)) {
          callback(key, child);
        } else if (angular.isObject(child)) {
          dropDrop(child, callback);
        }
      });
    }

    // 解析矩阵2
    function parseMatrix2 (axKeys, source) {
      var rows = [];
      angular.forEach(source, function (a, i) { //一行块
        var rowGroup = [];
        angular.forEach(a, function (b, j) {
          angular.forEach(axKeys, function (key, i) {
            var row = rowGroup[i]?rowGroup[i]:{};
            row[j] = b[key] !== 0 ? b[key] || '-':0;
            rowGroup[i] = row;
            i++;
          });
        });
        rows = rows.concat(rowGroup);
      });
      return rows;
    }

    // 组合矩阵
    function parseMatrix (axis, source) {
      var KV = {'keys': [], 'matrix': []};
      // KV.matrix[0] = [''].concat(axis);
      angular.forEach(source, function (twoDimData) {
        for (var x = 0, xlen = twoDimData.length; x < xlen; x++) {
          var rowData = [axis[x]].concat(twoDimData[x]);
          KV.matrix.push(rowData);
        }
      });
      for (var i = 0, ilen = axis.length; i <= ilen; i++) {
        KV.keys.push(i);
      }
      return KV;
    }
    // 数组转表头映射
    function fsHeadMapByArray (array) {
      var headMap = [];
      for (var i = 0, ilen = array.length; i < ilen; i++) {
        headMap.push({'key': i, 'name': array[i]});
      }
      return headMap;
    }
    // 为矩阵添加表头竖
    function appendMaxtrixY (table, tmap, headMap, cNum) {
      var rowIndex = 0;
      var rows = table.rows;

      cNum = cNum ? cNum : 0;
      var th = document.createElement('th');
      th.innerHTML = '';
      $(rows[rowIndex]).prepend(th);

      rowIndex++;
      angular.forEach(tmap, function (group, i) {
        var cell = rows[rowIndex].insertCell(cNum);
        cell.rowSpan = group.length;
        rowIndex += cell.rowSpan;
        cell.innerHTML = headMap[i].name;
// 添加key方便添加icon
if (headMap[i].key && headMap[i].key !== '_') {
  $(cell).attr('id', 'gentle_' + headMap[i].key);
}
      });
    }

    var format = function (number, form) { 
        var forms = form.split('.');
        number = '' + number;
        var numbers = number.split('.');
        var leftnumber = numbers[0].split('');
        var exec = function (lastMatch) { 
          if (lastMatch === '0' || lastMatch === '#') { 
            if (leftnumber.length) { 
                return leftnumber.pop(); 
            } else if (lastMatch === '0') { 
                return lastMatch; 
            } else { 
                return ''; 
            } 
          } else { 
            return lastMatch; 
          } 
        };

        var string = forms[0].split('').reverse().join('').replace(/./g, exec).split('').reverse().join(''); 
        string = leftnumber.join('') + string; 

        if (forms[1] && forms[1].length) { 
            leftnumber = (numbers[1] && numbers[1].length) ? numbers[1].split('').reverse() : []; 
            string += '.' + forms[1].replace(/./g, exec); 
        } 
        return string.replace(/.$/, ''); 
    };
    
    service.share = function (u, t, i, s, id) {
    	$timeout(function () {
    	// 分享
    	var shareBtn = $('.icon-r-share');
    	var shareList = $('#share-list');
    	var shareContainer = $('<div>').attr({'id': 'shareContainer'}).addClass('share-container');

    	shareBtn.wrap(shareContainer);
    	shareContainer = $('#shareContainer');
    	shareContainer.append(shareList);

    	var spac = 59;
    	shareContainer.hover(function() {
    		shareList.css({'margin-top': '10px'});
    		shareList.find('.share-icon').each(function (i, e) {
    			var icon = $(this);
    			window.setTimeout(function () {icon.animate({'height': 'show'}, spac);}, i * spac);
    		});
    	}, function () {
    		shareList.css({'margin-top': '0'});
    		shareList.find('.share-icon').each(function (i, e) {
    			var icon = $(this);
    			window.setTimeout(function () {icon.animate({'height': 'hide'}, spac);}, i * spac);
    		});
    	});

    	
    	var url = encodeURIComponent(u);
		var title = encodeURIComponent(t);
		var summuy = encodeURIComponent(s);
		var pic = encodeURIComponent('../images/logo-home.png');

shareList.find('.weibo').click(function () {
window.open('http://service.weibo.com/share/share.php?url='+url+'&title='+title+'&pic='+pic);
shareData(null, id);
});
shareList.find('.tencent').click(function () {
window.open('http://share.v.t.qq.com/index.php?c=share&a=index&'+'title='+title+'&url='+url+'&site='+'www.dfinder.com'+'&pic=');
shareData(null, id);
});
shareList.find('.douban').click(function () {
window.open('http://www.douban.com/share/service?href='+url+'&name='+title+'&text=');
shareData(null, id);
});
shareList.find('.qzone').click(function () {
window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&title='+title+'&summary=');
shareData(null, id);
});
shareList.find('.wechat').click(function () {
	//new QRCode(document.getElementById("qrcode"), );
	$('#qrcode').empty();
	new QRCode("qrcode", {text: u,width: 210,height: 210});
	shareData(null, id);
	$('#jiathis_weixin_modal').show();
});

    	});
    };

    // 是他是他就是他,他就是小哪吒.....
    service.directory = function (itemInfos) {

      $timeout(function () {

    	  
        var aary = $('.mamam'), directory = $('.directory');

        aary.each(function () {
          var b = $(this);
          var ahtml = $('<a href="javascript:;">'+$(this).attr('data-text')+'</a>');
          ahtml.click(function () {
            directory.children('a').removeClass('active');
            $(this).addClass('active');
            $location.hash(b.attr('id'));
            $anchorScroll();
          });
          directory.append(ahtml);
        });
        $(directory.children('a')[0]).addClass('active');

        var result = $('.result');
        var left = (result.offset().left+result.innerWidth()+2);
        directory.css({'left': left, 'position': 'fixed'});

        $(window).resize(function () {
          var result = $('.result');
          var left = (result.offset().left+result.innerWidth()+2);
          directory.css({'left': left, 'position': 'fixed'});
        });

        $(window).scroll(function() {
          // var top = $(window).scrollTop() + 16; 
          // directory.css({top: top + 'px'});

          var aary = $('.mamam');
          aary.each(function (i) {
            var h = $(window).height() / 2;
            if ($(this).position().top - $(window).scrollTop() <= 0) {
              var da = directory.children('a');
              da.removeClass('active');
              $(da[i]).addClass('active');
            }
          });
        }); 

        // 添加icon
        var before = 'gentle_';
        var domAry = [];
        angular.forEach(itemInfos, function (item, key) {
          var itemDom = $('#'+before+key);
          if (itemDom.length) {
            var micon = $('<i>').addClass('min-icon');
            itemDom.append(micon);
            micon.mouseover(function () {
              var mc = $('#mocamoca');
              if (!mc.length) {
                mc = $('<div id="mocamoca">').addClass('ay-float-container');
                $('body').append(mc);
              }
              mc.empty();
              angular.forEach(item, function (info, key) {
                var title = key==='describe'?'描述':key==='judge'?'判断':'这是啥';
                var p = $('<p>').text(info).prepend('<span>'+title+'：</span>');
                mc.append(p);
              });

              var offset = $(this).offset();
              mc.css({'top':offset.top-13+'px', 'left':offset.left+28+'px'}).show();
            }).mouseout(function () {
              $('#mocamoca').hide();
            });
          }

          // domAry.push(itemDom); // 验证
        });
        //console.info(domAry.length);
      });
    };

    return service;
  }

  resultServer.$inject = ['$rootScope', '$location', 'backstageService', 'localProxyService', '$timeout', '$anchorScroll'];

  return resultServer;
});