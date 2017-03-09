(function() {
  'use strict';

  angular
    .module('pf.workbook')
    .factory('workbookFactory', workbookFactory);

  workbookFactory.$inject = ['dataService', 'gundamFactory', 'sheetFactory', 'coreCF'];
  function workbookFactory(dataService, gundamFactory, sheetFactory, config) {
    var service = {
      'rqWorkBook': rqWorkBook,
      'parse':parse
    };
    WorkBook.prototype.merger = merger;
    WorkBook.prototype.remove = remove;
    WorkBook.prototype.selected = selected;
    WorkBook.prototype.addSheet = addSheet;
    WorkBook.prototype.getSheetIndex = getSheetIndex;
    return service;

    /**
     * 工作簿类
     * @param {Number} index 选中的下标
     * @param {Array} sheets 工作表数组
     */
    function WorkBook(index, sheets) {
      this.index = index;
      this.sheets = sheets;
    }

    /**
     * 请求一个工作簿, 回打包整理稿返回
     * @param {Gundam|Object} gundom 会根据属性判断使用的序列方法, 得到条件参数
     * @param {Boolean} init 初始化
     * @return {Promise} 
     */
    function rqWorkBook(gundom, init) {
      //删除cookie:userData——这些都是为了刷新时展示最近的访问指标
      dataService.removeCookie('userData',{domain:config.domain});

      var params = gundom.sequence ? gundom.sequence() : gundamFactory.sequenceOXC(gundom);
        if(gundom.dealStr!==undefined){
          params.dealStr = gundom.dealStr;
        }
        if(config.filter===true) {
          params.dealStr = 'removeEmpty';
        }
        if(params.productID !== 'out') {
          config.isMyUploadFile = 0;
          return dataService.get(init===true?'init':'sync', params).then(function(workbookSource) {
            /**记录访问历史开始**/
            var _indicators = [];
            angular.forEach(gundom.dims,function(v,k) {
                if(v.codeName==='indicatorCode') {
                  _indicators = v.codes;
                }

            });
            /**累加指标浏览次数**/
            angular.forEach(_indicators,function(va,ke) {
              updateLookNum(va,'looknum');
            });
            /**累加指标浏览次数**/

            var nearestCheck = dataService.getItem('nearestCheck');
            var now = new Date();
            var yy = now.getFullYear();      //年
            var mm = now.getMonth() + 1;     //月
            var dd = now.getDate();          //日
            var hh = now.getHours();         //时
            var ii = now.getMinutes();       //分
            var ss = now.getSeconds();
            var recordData={
              'name':workbookSource[0].sheetInfo.sheetName,
              'indicators':_indicators,
              'time':yy+'-'+mm+'-'+dd+' '+hh+':'+ii+':'+ss
              }
            if(nearestCheck[0]==undefined) {
              dataService.setItem('nearestCheck',JSON.stringify([recordData]));
            } else {
              if(nearestCheck.length>=10) {
                nearestCheck.splice(0,(nearestCheck.length-10));
              }
              for(var i=0;i<nearestCheck.length;i++) {
                if(nearestCheck[i].name==workbookSource[0].sheetInfo.sheetName) {
                  nearestCheck.splice(i,1);           
                }
              }
              nearestCheck.push(recordData);
              dataService.setItem('nearestCheck',JSON.stringify(nearestCheck));
          }
          /**记录访问历史结束**/
          return parse(workbookSource);
        });
      } else {
        config.isMyUploadFile=1;
        return dataService.get('sync', params).then(function(workbookSource) {
          return parse(workbookSource);
        });
      }
      
      
    }

    function updateLookNum(code,field){
        $.ajax({
            url:config.mainUrl+'update/upindic',
            data:{"code":code,"upField":field},
            dataType:'json',
            type:'post',
            success:function(result){
            }
        });
    }

    /**
     * 添加一个表, 并返回最后一个表的下标
     * @param {Sheet} sheet 工作表, 会做类型判断
     */
    function addSheet(sheet) {
      /*jshint validthis:true */
      // sheet instanceof Sheet
      if (sheet.id) { 
    	  this.sheets.push(sheet); 
	  } else { 
	   //console.error('不是一个工作表!', sheet); 
	  }
      return this.sheets.length - 1;
    }

    /**
     * 根据下标选中一个表, 更新选中下标
     * @param  {Number} index 预选中的下标
     * @return {Sheet} 选中的表|undefined
     */
    function selected(index) {
      var sheet = this.sheets[index];
      if (sheet) { this.index = index; }
      return sheet;
    }

    /**
     * 删除指定下标的表
     * @param  {Number} index 下标
     * @return {Array} 删除后的表数组
     */
    function remove(index) {
      var sheets = this.sheets.splice(index, 1);
      return sheets;
    }

    /**
     * 根据id返回一个表下标
     * @param {String} id
     * @return {Number} 下标
     */
    function getSheetIndex(id) {
      var sheets = this.sheets;
      for (var i = 0, ilen = sheets.length; i < ilen; i++) {
        var sheet = sheets[i];
        if (sheet.id === id) { return i; }
      }
      return false;
    }

    /**
     * 合并两个工作簿, 根据sheetId判断表的唯一
     * @param  {WorkBook} workbook 工作簿
     * @return {Number} 选中的下标
     */
    function merger(workbook) {
      var twb = this, index = this.index;
      var sheets = workbook.sheets;

      angular.forEach(sheets, function(sheet, i) {
        var tIndex = twb.getSheetIndex(sheet.id);
        if (tIndex !== false) { // 存在替换
          twb.sheets[tIndex] = sheet;
        } else {
          index = twb.addSheet(sheet);
        }
      });
      return index;
    }

    /**
     * 解析成工作簿对象
     * @param {Array} source 源数据
     * @return {WorkBook}
     */
    function parse(source) {
      var index = null;
      var sheets = [];

      angular.forEach(source, function(sheetSource, index) {
        var sheet = sheetFactory.parse(sheetSource);
        sheets.push(sheet);
        // 
        // 默认选中
        // if (selectedIndex === null) { selectedIndex = 0; }
      });
      return new WorkBook(index, sheets);
    }
  }

})();