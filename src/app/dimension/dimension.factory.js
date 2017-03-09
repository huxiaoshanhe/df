(function() {
  'use strict';
  // 维度类工厂

  angular
    .module('pf.dimension')
    .factory('dimensionFactory', dimensionFactory);

  dimensionFactory.$inject = ['treeFactory'];
  function dimensionFactory(treeFactory) {
    var service = {
      'parse': parse
    };
    Dimension.prototype.press = press;
    return service;

    /**
     * 维度对象
     * @param {String} code 维度码
     * @param {String} name 维度名
     * @param {Tree} tree 树结构的数据
     * @param {Object} feature 描述该维度
     */
    function Dimension(code, name, tree, feature) {
      this.code = code;
      this.name = name;
      this.tree = tree;
      this.feature = feature; // 描述维度特征
    }

    /**
     * 解析维度数据
     * @param  {Object} dimensionSource 后台源数据
     * @return {Object} 解析后的实体
     */
    function parse(dimensionSource) {
      var code = dimensionSource.codeName;
      var name = dimensionSource.showName;
      var tree = treeFactory.parse(dimensionSource);
      var feature = extractFeature(dimensionSource);

      // 由于指标传过来都不是选中的, 要做一下特殊处理, 囧rz.
      if (code === 'indicatorCode') {
        // 指标只有一层
        angular.forEach(tree.childs, function(node) { node.checked = true; });
      }
      return new Dimension(code, name, tree, feature);
    }

    /**
     * 提取转化后台维度源特征
     * @param  {Object} source 麻烦死
     * @return {Object} 结果
     */
    function extractFeature(source) {
      var feature = {};
      if (source.hierarchical) { feature.tree = true; } // 树结构
      if (source.needBeSearch) { feature.search = true; } // 带搜索
      if (source.isIndicator) { feature.indicator = true; } // 指标形式显示

      // 变量处理, 真的有这么搞的嘛, 传这个
      if (source.searchUrl) {
        var wh = source.searchUrl.indexOf('?');
        var paramStr = source.searchUrl.substring(wh + 1, source.searchUrl.length);
        var pairAry = paramStr.split('&');
        for (var i = 0, ilen = pairAry.length; i < ilen; i++) {
          var none = pairAry[i].split('='); //0,1
          feature[none[0]] = none[1];
        }
      }
      return feature;
    }

    /**
     * 提取选中
     * @return {Object} [description]
     */
    function press() {
      var selCodes = this.tree.getSelectedIds();
      return {'codeName': this.code, 'codes': selCodes};
    }
  }

})();
