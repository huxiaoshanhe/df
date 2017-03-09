(function() {
  'use strict';

  angular
    .module('pf.directive')
    .controller('TBBGCtrl', TBBGCtrl)
    .controller('TBFontCtrl', TBFontCtrl)
    .controller('TBSizeCtrl', TBSizeCtrl)
    .controller('TBColorCtrl', TBColorCtrl)
    .controller('TBAlignCtrl', TBAlignCtrl);

  TBFontCtrl.$inject = ['toolbarService', 'panelService'];
  function TBFontCtrl(toolbarService, panelService) {
    var that = this;
    that.ary = ['宋体', '微软雅黑', '楷体', '隶书'];
    that.upfont = function(font) {
      toolbarService.updateValue('font', 'deal', font);
      toolbarService.toggleGroupChild('font', 'more', false);
      panelService.close();
    };
  }

  TBSizeCtrl.$inject = ['toolbarService', 'panelService'];
  function TBSizeCtrl(toolbarService, panelService) {
    var that = this;
    that.ary = ['12', '14', '16', '18', '20', '22', '24'];
    that.upsize = function(size) {
      toolbarService.updateValue('size', 'deal', size);
      toolbarService.toggleGroupChild('size', 'more', false);
      panelService.close();
    };
  }

  TBColorCtrl.$inject = ['toolbarService', 'panelService'];
  function TBColorCtrl(toolbarService, panelService) {
    var that = this;
    that.ary2 = [
      ['#FF0300', '#FF6765', '#FF9A9B', '#FFCCCB', '#000000'],
      ['#FE6E00', '#FFAA65', '#FFC698', '#FEE3CB', '#666666'],
      ['#30E845', '#83F28F', '#ADF7B5', '#D5FCDA', '#999999'],
      ['#00A0FE', '#65C7FF', '#98D9FF', '#CBEDFF', '#CCCCCC'],
      ['#9832E8', '#C185F0', '#D7AEF7', '#EAD8FB', '#FFFFFF']
    ];
    that.upcolor = function(color) {
      toolbarService.updateValue('color', 'deal', color);
      toolbarService.toggleGroupChild('color', 'more', false);
      panelService.close();
    };
  }

  TBAlignCtrl.$inject = ['toolbarService', 'panelService'];
  function TBAlignCtrl(toolbarService, panelService) {
    var that = this;
    that.ary = ['left', 'center', 'right'];
    that.upalign = function(align) {
      //console.info(align);
      toolbarService.updateValue('align', 'deal', align);
      toolbarService.toggleGroupChild('align', 'more', false);
      panelService.close();
    }
  }

  TBBGCtrl.$inject = ['toolbarService', 'panelService'];
  function TBBGCtrl(toolbarService, panelService) {
    var that = this;
    that.ary2 = [
      ['#FF0300', '#FF6765', '#FF9A9B', '#FFCCCB', '#000000'],
      ['#FE6E00', '#FFAA65', '#FFC698', '#FEE3CB', '#666666'],
      ['#30E845', '#83F28F', '#ADF7B5', '#D5FCDA', '#999999'],
      ['#00A0FE', '#65C7FF', '#98D9FF', '#CBEDFF', '#CCCCCC'],
      ['#9832E8', '#C185F0', '#D7AEF7', '#EAD8FB', '#FFFFFF']
    ];
    that.upbg = function(bg) {
      toolbarService.updateValue('bg', 'deal', bg);
      toolbarService.toggleGroupChild('bg', 'more', false);
      panelService.close();
    };
  }

})();
