(function() {
  'use strict';
  // 核心模块, 提供基础功能

  angular
    .module('pf.core', ['ngDialog'])
    .constant('coreCF', {
      debug: true,//false  online
      openDimCode: 'indicatorCode',
      // 本地存储KEY
      record: 'record', // 用户Local存储拼接
      dimeKey: 'userData', // 维度
      isMyUploadFile:'0',//用于判断是不是打开的我上传的文件
      myFileSheet:'',//用于判断是不是打开的我上传的文件
      isAddSheet:false,//用于区别添加工作表还是添加指标
      // 基础链接
      domain: 'epsnet.com.cn',
      baseUrl: 'http://127.0.0.1:5323/platform/',//平台主路径
      loginUrl: 'http://dps.epsnet.com.cn/',//登录路径，好像没用到，但不敢删除
      mainUrl:'http://kdd.epsnet.com.cn/',//首页地址，退出时调用
      // 请求地址映射
      urlMap: {
        'sync': 'dim.do',
        'init': 'jump.do',
        'login': 'login.do',
        'sheet': 'sheet.do',
        'initial': 'jump.do',
        'charts': 'charts.do',
        'search': 'search.do',
        'searchPage': 'searchPage.do',
        'tableSort': 'sort.do',
        'tableTotal': 'calc.do',
        'recommend': 'recmd.do',
        'information': 'info.do',
        'userInfo': 'userInfo.do',
        'map': 'map.do',
        'read':'read.do',
        'download':'download.do',
        'baseOp':'baseOp.do',
        'timeseries':'timeseries.do',
        'refresh':'refresh.do',
        'missvalue': 'missvalue.do',
        'descstats': 'descstats.do',
        'aggregation': 'aggregation.do',
        'variable': 'variable.do',
        'lr': 'lr.do',
        'curvefit':'curvefit.do',
        'leastSquares': 'leastSquares.do',
        'correlation' : 'correlation.do',
        'autocorre'   :'autocorre.do',
        'hp':'hp.do',
        'expsmooth':'expsmooth.do',
        'arima':'arima.do',
        'preanalysis':'preanalysis.do',
        'pcanalysis':'pcanalysis.do',
        'fanalysis':'fanalysis.do',
		    'uploadFile':'uploadFile.do',
        'regionSelect':'regionSelect.do',
        'queryFileList':'queryFileList.do',
        'createMyFile':'createMyFile.do',
        'delMyFile':'delMyFile.do',
        'renameMyFile':'renameMyFile.do',
        'classifySelect':'classifySelect.do',
        'parseTable':'parseTable.do',
        'saveUpload':'saveUpload.do',
        'save':'save.do',
        'searchTags':'searchTags.do',
        'yearSelect':'yearSelect.do',
        'logout'    :'logout.do',
        'highComputor':'highComputor.do',
        'queryScjAllDir':'queryScjAllDir.do',
        'pointCharts':'pointCharts.do',
        'newMapInit':'newMapInit.do',
        'newMap':'newMap.do',
        'showUploadData':'showUploadData.do',
        'saveSession':'saveSession.do',
        'userIp':'user.ips',
        'queryFolderList':'queryFolderList.do'
      },
      logUrl:{//操作日志映射
    	  'clientLog':'client.log'
      },
      // 监听事件的关键字
      spreadKey: {
        // 动作告知
        'loading': 'load',
        'syncWorkBook': 'swb',
        'refreshRecommend': 'rr',
        'InfoIsOpenChange': 'iic',
        'getRecommendChange': 'grc',
        'containerSizeChange': 'csc',
        'closeContainerRow': 'ccr',
        'panelConfigChange': 'pcc',

        'createRightMenu': 'crm',
        'toggleRightMenu': 'trm', // 切换显示隐藏状态
        'switchContainerRow': 'swr', // 开关容器行
        'bridgeNow': 'bn', // 桥梁
        // 变更通知
        'sheetChange': 'sc',
        'chartsChange': 'cc1',
        'workbookChange': 'wc',
        'conditionChange': 'cc',
        // 状态通知
        'syncStatusChange': 'ssc', // 同步状态
        'dimSelectedChange': 'dsc', // 维度选中
        'searchSelectNodeChange': 'ssnc',
        'userInfoChange':'uic'//监听用户信息变化
      },
      dime:{
        'dims': [
          {
            'codeName':'indicatorCode',
            'codes': ['00010000000058','00010000000066','00010000001732','00010000001735','00010000001737']
          }
        ],
        'productID': '00010000000000000000000000000001'
      },
      currentSheet:'',//当前的sheetId
      hasCalculatorSheets:[],//参与表格计算的sheetId;
      filter:true //是否过滤空行或空列数据
    });

})();