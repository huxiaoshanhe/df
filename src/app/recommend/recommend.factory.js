(function() {
  'use strict';
  // 推荐工厂类

  angular
    .module('pf.recommend')
    .factory('recommendFactory', recommendFactory);

  recommendFactory.$inject = ['dataService'];
  function recommendFactory(dataService) {
    var service = {
      'rqRecommend': rqRecommend
    };
    return service;

    /**
     * 推荐对象
     * @param  {String} code 代码
     * @param  {String} name 名称
     */
    function Recommend(code, name) {
      this.code = code;
      this.name = name;
    }

    /**
     * 获取一群推荐, 并根据类型解析成推荐对象
     * @param  {String} sheetId 根据表id获取推荐
     * @return {Promise} 请求承诺
     */
    function rqRecommend(sheetId) {
      var params = {'sheetId': sheetId};
      return dataService.get('recommend', params).then(function(sources) {
        var array = [];
        angular.forEach(sources, function(item, index) {
          var recommend = parseByIndicator(item);
          array.push(recommend);
        });
        return array;
      });
    }

    /**
     * 源推荐指标解析成标准指标类
     * @param  {Object} source 源指标推荐
     * @return {Recommend} 推荐对象
     */
    function parseByIndicator(source) {
      var code = source.indicatorCode;
      var name = source.indicatorName;

      return new Recommend(code, name);
    }
  }

})();