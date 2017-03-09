(function() {
  'use strict';

  angular
    .module('pf.search')
    .factory('searchService', searchService);

  searchService.$inject = ['dataService', 'sheetService'];
  function searchService(dataService, sheetService) {
    var service = {
      'search': getSearchData
    };
    return service;

    /**
     * 简单表内节点搜索, 带个类型
     * @param  {String} type 搜索区分
     * @param  {String} keywords 搜索关键字
     * @return {promise}
     */
    function getSearchData(type, keywords) {
      var sheetId = sheetService.getSheetId();
      var params = {
        'action': type,
        'sheetId': sheetId,
        'keywords': keywords
      };

      return dataService.get('search', params)
        .then(function(source) {
          return source;
        });
    }
  }

})();