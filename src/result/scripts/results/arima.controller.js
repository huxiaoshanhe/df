// 自相关
window.define(
[],
function () {
var partsMap = [
  {name: '变量解释', keys: ['varsProduce']},
  {name: '模型解释', keys: ['modelDesc']},
  {name: '模型统计量表', keys: ['modelStats']},
  {name: '模型参数估计', keys: ['modelParameterEstimation']},
  {name: '残差自相关', keys: ['residualAutocorrelation']},
  {name: '残差偏自相关', keys: ['residualPartialAutocorrelation']}
];

var tHeadMap = {
    'modelStats': [
    {'key': 'indeptKey', 'name': '模型'},
    {'key': 'stationaryR2', 'name': '平稳的R^2'},
    {'key': 'r2', 'name': 'R^2'},
    {'key': 'Ljung-BoxQ', 'name': 'Ljung-BoxQ', child: [
      {'key': 'ljungBoxQStata', 'name': '统计量'},
      {'key': 'ljungBoxQDf', 'name': 'df'},
      {'key': 'ljungBoxQSig', 'name': 'Sig.'}
    ]},
    {'key': 'aic', 'name': 'AIC'},
    {'key': 'aicc', 'name': 'AICc'},
    {'key': 'bic', 'name': 'BIC'},
  ]
};

  function lrResultsCtrl ($sce, $location, $routeParams, resultService) {
    var that = this;
    that.isShare = true;
    that.textResult = null;
    that.share = function (id) {
      resultService.share('analysis_arima', id);
    };
    that.trustAsHtml = function trustAsHtml (text) {
      return $sce.trustAsHtml(text);
    };

    var parseMap = {
      'varsProduce': function (array) {
        var html = '';
        angular.forEach(array, function(indic, i) {
          var after = '';
          html += '<p style="margin: 0 0 5px 0">'+ after + indic.key + '：' + indic.value + '</p>';
        });
        return html;
      },
      'modelDesc': function (desc) {
        var table = resultService.createTable(
          [0, 1],
          [{'key':0, 'name':''}, {'key':1,'name':'模型类型'}],
          [{0:desc.indeptKey, 1:desc.modelType}]);
        var html = $('<div>').append(table).html();
        return html;
      },
      'modelStats': function (stats) {
        var headMap = tHeadMap.modelStats;
        var table = resultService.createTable(['modelCode','stationaryR2','r2','ljungBoxQStata','ljungBoxQDf','ljungBoxQSig', 'aic', 'aicc', 'bic'],
          headMap, [{
            'modelCode': stats.modelCode,
            'stationaryR2': stats.stationaryR2,
            'r2': stats.r2,
            'ljungBoxQStata': stats.ljungBoxQ.qstatistics,
            'ljungBoxQDf': stats.ljungBoxQ.df,
            'ljungBoxQSig':  stats.ljungBoxQ.sig,
            'aic': stats.aic,
            'aicc': stats.aicc,
            'bic': stats.bic
          }]);
        var html = $('<div>').append(table).html();
        return html;
      },
      'modelParameterEstimation': function (data) {
        var td = [], rowspan = 1;

        if (data.constantItem) {
          td.push({
            'sjr': '常数',
            'est': data.constantItem.constEst,
            'stderr': data.constantItem.constStdErr,
            't': data.constantItem.constTStata,
            'sig': data.constantItem.constSig
          });
          rowspan++;
        }
        if (data.d || data.d === 0) {
          td.push({'sjr': 'd', 'est': data.d});
          rowspan++;
        }
        if (data.p) {
          angular.forEach(data.p.est, function (val, i) {
            td.push({
              'sjr': 'AR(p)',
              'est': data.p.est[i],
              'stderr': data.p.stdError[i],
              't': data.p.tstat[i],
              'sig': data.p.sig[i],
            });
            rowspan++;
          });
        }
        if (data.sp) {
          angular.forEach(data.sp.est, function (val, i) {
            td.push({
              'sjr': 'SAR(sp)',
              'est': data.sp.est[i],
              'stderr': data.sp.stdError[i],
              't': data.sp.tstat[i],
              'sig': data.sp.sig[i],
            });
            rowspan++;
          });
        }
        if (data.sd || data.sd === 0) {
          td.push({'sjr': 'sd', 'est': data.sd});
          rowspan++;
        }
        if (data.q) {
          angular.forEach(data.q.est, function (val, i) {
            td.push({
              'sjr': 'MA(q)',
              'est': data.q.est[i],
              'stderr': data.q.stdError[i],
              't': data.q.tstat[i],
              'sig': data.q.sig[i],
            });
            rowspan++;
          });
        }
        if (data.sq) {
          angular.forEach(data.sq.est, function (val, i) {
            td.push({
              'sjr': 'SMA(sq)',
              'est': data.sq.est[i],
              'stderr': data.sq.stdError[i],
              't': data.sq.tstat[i],
              'sig': data.sq.sig[i],
            });
            rowspan++;
          });
        }
        var table = resultService.createTable(
          ['sjr', 'est', 'stderr', 't', 'sig'],
          [
            {'key':'sjr', 'name':'&nbsp;'},
            {'key':'est', 'name':'估计'},
            {'key':'stderr','name':'标准差'},
            {'key':'t','name':'t'},
            {'key':'sig','name':'Sig.'}
          ],
          td);
        $(table)[0].rows[0].insertCell(0);
        var dian = $(table)[0].rows[1].insertCell(0);
        dian.rowSpan = rowspan;
        dian.innerHTML = data.varCode + '&nbsp' + data.transformName;
        var html = $('<div>').append(table).html();
        return html;
      },
      'residualAutocorrelation': function (d) {
    	  var KV = resultService.parseVerticalData(d);
    	  var table = resultService.createTable(KV.keys, [{'key':'acf', 'name':'ACF'},{'key':'se','name':'SE'}], KV.data); 
    	  
    	  angular.forEach(d.acf, function (s, i) {
      		var row = $(table)[0].rows[i+1];
      		var cell = row.insertCell(0);
      		cell.innerHTML = i+1;
    	  });
    	  var t = $(table)[0].rows[0].insertCell(0);
    	  t.innerHTML = '&nbsp;';
    	  var r = $(table)[0].insertRow(0);
    	  var cell = r.insertCell(0);
    	  cell.innerHTML = d.modelName;
    	  cell.colSpan = 2;
    	  cell = r.insertCell(0);
    	  cell.innerHTML = '&nbsp;'
    	  var html = $('<div>').append(table).html();
          return html;
      },
      'residualPartialAutocorrelation': function (d) {
    	  var KV = resultService.parseVerticalData(d);
    	  var table = resultService.createTable(KV.keys, [{'key':'pacf', 'name':'PACF'},{'key':'se','name':'SE'}], KV.data); 
    	  
    	  angular.forEach(d.pacf, function (s, i) {
      		var row = $(table)[0].rows[i+1];
      		var cell = row.insertCell(0);
      		cell.innerHTML = i+1;
    	  });
    	  var t = $(table)[0].rows[0].insertCell(0);
    	  t.innerHTML = '&nbsp;';
    	  var r = $(table)[0].insertRow(0);
    	  var cell = r.insertCell(0);
    	  cell.innerHTML = d.modelName;
    	  cell.colSpan = 2;
    	  cell = r.insertCell(0);
    	  cell.innerHTML = '&nbsp;'
    	  var html = $('<div>').append(table).html();
          return html;
      }
    };

    if ($routeParams.action === 'share') {
      that.isShare = false;
      // 问题?
      resultService.getBackstage($routeParams.id).then(function (source) {
        that.lineChart = source.lineChart;
        that.raBarChart = source.raBarChart;
        that.rpaBarChart = source.rpaBarChart;
        var data = source.arimaBO;
        that.textResult = resultService.parse(partsMap, parseMap, data);
        // gaomao
        resultService.directory(source.itemInfos);
      });
    } else {
      var source = resultService.get('analysis_arima');
      that.shareId = source.shareId;
      that.lineChart = source.lineChart;
      that.raBarChart = source.raBarChart;
      that.rpaBarChart = source.rpaBarChart;
      var data = source.arimaBO;
      var textResult = resultService.parse(partsMap, parseMap, data);
      that.raBar = textResult.splice(4, 1);
      that.rpaBar = textResult.splice(4, 1);
      that.textResult = textResult;
      // gaomao
      resultService.directory(source.itemInfos);
      resultService.share(location.href+'/share/'+that.shareId, 'ARIMA分析结果...', null, null, that.shareId);
    }
    
  }
  lrResultsCtrl.$inject = ['$sce', '$location', '$routeParams', 'resultService'];
  return lrResultsCtrl;
});