'use strict';
// 结果模块(分析预测)
window.define(
[
 'angular',
 'results/lrresults.controller',
 'results/curvefit.controller',
 'results/bivar.controller',
 'results/partial.controller',
 'results/hpfilter.controller',
 'results/leastsquares.controller',
 'results/preanalysis.controller',
 'results/fanalysis.controller',
 'results/pcanalysis.controller',
 'results/autocorre.controller',
 'results/expsmooth.controller',
 'results/arima.controller',
 'results/map.controller',
 'results/results.controller',
 'results/results.service',
 'common/common.module',
 'directives/charts.module',
 'ngcookie',
  'qrcode'
],
function (angular, lrResultsCtrl, cuResultsCtrl, brResultsCtrl, paResultsCtrl, HPfilterResultsCtrl, LeastsquaresCtrl, PreanalysisCtrl, FanalysisCtrl, PcanalysisCtrl, AutocorreCtrl, ExpsmoothCtrl, ArimaCtrl, MapCtrl, resultCtrl, resultService) {

  return angular
    .module('results', ['ngRoute', 'platform.common', 'directive.charts', 'ngCookies'])
    // .controller('resultCtrl', resultCtrl)
    .controller('lrResultsCtrl', lrResultsCtrl)
    .controller('cuResultsCtrl', cuResultsCtrl)
    .controller('brResultsCtrl', brResultsCtrl)
    .controller('paResultsCtrl', paResultsCtrl)
    .controller('HPfilterResultsCtrl', HPfilterResultsCtrl)
    .controller('LeastsquaresCtrl', LeastsquaresCtrl)
    .controller('PreanalysisCtrl', PreanalysisCtrl)
    .controller('FanalysisCtrl', FanalysisCtrl)
    .controller('PcanalysisCtrl', PcanalysisCtrl)
    .controller('AutocorreCtrl', AutocorreCtrl)
    .controller('ExpsmoothCtrl', ExpsmoothCtrl)
    .controller('ArimaCtrl', ArimaCtrl)
    .controller('MapCtrl', MapCtrl)
    .factory('resultService', resultService)
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
       .when('/analysis_lr', {
          templateUrl : 'result/template/analysis/linearRegressionResult.html',
          controller: 'lrResultsCtrl as lrc'
       }).when('/analysis_lr/:action/:id', {
          templateUrl : 'result/template/analysis/linearRegressionResult.html',
          controller: 'lrResultsCtrl as lrc'
        })
       .when('/analysis_curvefit', {
         templateUrl : 'result/template/analysis/curvefitResult.html',
         controller: 'cuResultsCtrl as crc'
       }).when('/analysis_curvefit/:action/:id', {
         templateUrl : 'result/template/analysis/curvefitResult.html',
         controller: 'cuResultsCtrl as crc'
       })
       .when('/analysis_bivar', {
         templateUrl : 'result/template/analysis/bivarResult.html',
         controller: 'brResultsCtrl as brc'
       }).when('/analysis_bivar/:action/:id', {
         templateUrl : 'result/template/analysis/bivarResult.html',
         controller: 'brResultsCtrl as brc'
       })
       .when('/analysis_partial2', {
         templateUrl : 'result/template/analysis/partialResult.html',
         controller: 'paResultsCtrl as pac'
       }).when('/analysis_partial2/:action/:id', {
         templateUrl : 'result/template/analysis/partialResult.html',
         controller: 'paResultsCtrl as pac'
       })
       .when('/analysis_hp', {
         templateUrl : 'result/template/analysis/hpfilterResult.html',
         controller: 'HPfilterResultsCtrl as hfrc'
       }).when('/analysis_hp/:action/:id', {
         templateUrl : 'result/template/analysis/hpfilterResult.html',
         controller: 'HPfilterResultsCtrl as hfrc'
       })
       .when('/analysis_leastSquares', {
         templateUrl : 'result/template/analysis/leastSquaresResult.html',
         controller: 'LeastsquaresCtrl as ltc'
       }).when('/analysis_leastSquares/:action/:id', {
         templateUrl : 'result/template/analysis/leastSquaresResult.html',
         controller: 'LeastsquaresCtrl as ltc'
       })
       .when('/analysis_preanalysis', {
          templateUrl : 'result/template/analysis/preanalysisResult.html',
          controller: 'PreanalysisCtrl as plc'
       }).when('/analysis_preanalysis/:action/:id', {
          templateUrl : 'result/template/analysis/preanalysisResult.html',
          controller: 'PreanalysisCtrl as plc'
       })
       .when('/analysis_fanalysis', {
         templateUrl : 'result/template/analysis/fanalysisResult.html',
         controller: 'FanalysisCtrl as flc'
       }).when('/analysis_fanalysis/:action/:id', {
         templateUrl : 'result/template/analysis/fanalysisResult.html',
         controller: 'FanalysisCtrl as flc'
       })
       .when('/analysis_pcanalysis', {
          templateUrl : 'result/template/analysis/pcanalysisResult.html',
          controller: 'PcanalysisCtrl as pcc'
       }).when('/analysis_pcanalysis/:action/:id', {
          templateUrl : 'result/template/analysis/pcanalysisResult.html',
          controller: 'PcanalysisCtrl as pcc'
       })
       .when('/analysis_autocorre', {
          templateUrl : 'result/template/analysis/autocorreResult.html',
          controller: 'AutocorreCtrl as atc'
       }).when('/analysis_autocorre/:action/:id', {
          templateUrl : 'result/template/analysis/autocorreResult.html',
          controller: 'AutocorreCtrl as atc'
       })
       .when('/analysis_expsmooth', {
          templateUrl : 'result/template/analysis/expsmoothResult.html',
          controller: 'ExpsmoothCtrl as epc'
       }).when('/analysis_expsmooth/:action/:id', {
          templateUrl : 'result/template/analysis/expsmoothResult.html',
          controller: 'ExpsmoothCtrl as epc'
       })
       .when('/analysis_arima', {
          templateUrl : 'result/template/analysis/arimaResult.html',
          controller: 'ArimaCtrl as arc'
       }).when('/analysis_arima/:action/:id', {
          templateUrl : 'result/template/analysis/arimaResult.html',
          controller: 'ArimaCtrl as arc'
       })
       .when('/analysis_map', {
          templateUrl : 'result/template/analysis/map.html',
          controller: 'MapCtrl as mpc'
       }).when('/analysis_arima/:action/:id', {
          templateUrl : 'result/template/analysis/map.html',
          controller: 'MapCtrl as mpc'
       });
    }]);
});