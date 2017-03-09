(function() {
  'use strict';

  angular
    .module('pf.information')
    .factory('informationService', informationService)

  informationService.$inject = ['$rootScope', 'dataService', 'coreCF'];
  function informationService($rootScope, dataService, config) {
    var _spk = config.spreadKey;
    var _isOpen = false; // 是否打开状态
    var _indicatorId = null; // 指标id
    var service = {
      'toggle': toggle,
      'toggleId': toggleId,
      'getNowId': function(){ return _isOpen === true ? _indicatorId : null; }
    };
    return service;

    // 切换显示状态
    function toggle(bl) {
      _isOpen = bl || !_isOpen;
      $rootScope.$broadcast(_spk.InfoIsOpenChange, _isOpen);
      return _isOpen;
    }

    /**
    * 切换infomation, 并广播通知
    * @param  {String} id 指标id
    */
    function toggleId(id) {
      if (_indicatorId === id) { toggle(); }
        else { toggle(true); }

      _indicatorId = id;

      // 打开时才重新请求加载
      if (_isOpen === true) {
        getInformation(id).then(function(information) {
          $rootScope.$broadcast(_spk.infomationChange, information);
        });
      }
    }

    /**
     * 获取指标详细信息
     * @param  {String} id 标识符
     * @return {} 承诺
     */
    function getInformation(id) {
      var params = {'indicatorCode': id};

      $rootScope.$broadcast(_spk.loading, true);
      return dataService.get('information', params)
        .then(function(informationSouce) {
          $rootScope.$broadcast(_spk.loading, false);
          return informationSouce;
        });
    }
  }

})();