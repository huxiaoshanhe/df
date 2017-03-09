(function() {
  'use strict';
  // 条件容器模块

  angular
    .module('pf.condition')
    .factory('conditionService', conditionService);

  conditionService.$inject = ['$rootScope', 'coreCF'];
  function conditionService($rootScope, config) {
    var _spk = config.spreadKey;
    var _condition = null; // 维护的条件容器
    var service = {
      'update': conditionChange,
      'toggleDirection': toggleDirection,
      'getGundam': function() { return _condition.press(); }
    };
    return service;

    /**
     * 条件容器变更方法, 通过该方法改变内部维护容器, 并广播
     * @param  {Condition} condition 预更改容器
     * @return {Condition} 当前条件容器
     */
    function conditionChange(condition) {
      _condition = condition;
      $rootScope.$broadcast(_spk.conditionChange, _condition);
      return condition;
    }

    /**
     * 切换条件方向
     * @param {String} code 维度Code
     * @return {String} 'col'|'row'
     */
    function toggleDirection(code) {
      return _condition.toggleDire(code);
    }
  }

})();