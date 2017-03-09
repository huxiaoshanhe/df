(function() {
  'use strict';
  // 树类工厂, 解析, 处理, 选中, 遍历

  angular
    .module('pf.tree')
    .factory('treeFactory', treeFactory);

  function treeFactory() {
    var service = {
      'parse': parse
    };
    Node.prototype.checkNode = checkNode;
    Node.prototype.getSelectedIds = getSelectedIds;
    Node.prototype.getSelectedNodes = getSelectedNodes;
    return service;

    /**
     * 对zTree的封装
     * @param {String} id
     * @param {String} name
     * @param {Array} childs
     * @param {Boolean} checked
     * @param {Boolean} disabled
     */
    function Node(id, name, childs, checked, disabled) {
      this.id = id;
      this.name = name;
      this.childs = childs;
      this.checked = checked || false;
      this.disabled = disabled || false;
    }

    /**
     * 将数据解析成根节点
     * @param  {Object} treeSource 后台源数据
     * @return {Object} 解析后的实体
     */
    function parse(treeSource) {
      var root = new Node(null, 'ROOT', [], false, false);
      var list = treeSource.objLst, chkey = 'childTree';
      recursiveTree(list, chkey, root, function(nodeSource, fater) {
        var node = parseNode(nodeSource);
        var childs = node.childs;
        fater.childs.push(node);
        return node; // 注意:返回的是当前节点的引用
      });
      return root;
    }


    /**
     * 节点简单信息转换
     * @param  {Object} nodeSource 后台源数据
     * @return {Object} 解析后的实体
     */
    function parseNode(nodeSource) {
      var id = nodeSource.entity.code;
      var name = nodeSource.entity.name;
      var checked = nodeSource.entity.isSelected;
      var disabled = nodeSource.entity.disabled;
      return new Node(id, name, [], checked, disabled);
    }

    /**
     * 为指定节点设置选中属性
     * @param  {String} id id
     * @param  {Boolean} checked 是否
     * @return {Node} 得到的节点
     */
    function checkNode(id, checked) {
       /*jshint validthis:true */
      var node = getNodeById(this.childs, id);
      if (node) { 
    	  if(node.disabled===false) {
    		  node.checked = checked === undefined ? !node.checked : checked; 
    	  } else {
    		  node.checked = false;
    	  }
      }
      return node;
    }

    /**
     * 得到选中节点的id数组
     * @return {Array} 选中节点数组
     */
    function getSelectedIds(checked) {
      /*jshint validthis:true */
      var ids = [];
      var selectedNodes = this.getSelectedNodes(checked);
      angular.forEach(selectedNodes, function(node, index) {
        ids.push(node.id);
      });
      return ids;
    }

    /**
     * 获取所有的选中节点
     * @return {Array} 选中的节点
     */
    function getSelectedNodes(checked) {
      /*jshint validthis:true */
      var tree = this;
      return getNodesByAttr(tree.childs, 'checked', true);
    }

    /**
     * 根据id获取一个节点
     * @param  {Array} array 节点数组
     * @param  {String} id 节点代码
     * @return {Object} node 节点
     */
    function getNodeById(array, id) {
      if (!array.length) { return null; }
      var notFindAry = [];
      for (var i = 0, ilen = array.length; i < ilen; i++) {
        var node = array[i];
        if (node.id === id) {
          return node;
        } else if (node.childs.length) {
          notFindAry = notFindAry.concat(node.childs);
        }
      }
      return getNodeById(notFindAry, id);
    }

    /**
     * 查找指定的属性指定值的所有节点
     * !该方法用户获取选中的节点, 效率好低, 可不可以直接在checkNode中写入节点选中的监听
     * @param  {String} attrName 属性名
     * @param  {Object} attrValue 属性值
     * @return {Array} 符号条件的所有节点
     */
    function getNodesByAttr(array, attrName, attrValue) {
      var result = [];
      recursiveTree(array, 'childs', null, function(node) {
        if (node[attrName] === attrValue) {
          result.push(node);
        }
      });
      return result;
    }

    /**
     * 对树结构数据遍历
     * @param  {Array} array 数结构数据
     * @param  {String} chKey 子项判断key(单层)
     * @param  {Object} fater 处理结果的引用
     * @param  {Function} process 处理方法
     * @return {Object}
     */
    function recursiveTree(array, chKey, fater, process) {
      for (var i = 0, ilen = array.length; i < ilen; i++) {
        var node = array[i];
        var quote = process(node, fater); // 回调处理
        if (node[chKey].length) {
          // 下一层
          recursiveTree(node[chKey], chKey, quote, process);
        }
      }
      return fater;
    }
  }

})();