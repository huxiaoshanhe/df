(function() {
  'use strict';
  // 手风琴指令

  angular
    .module('pf.directive')
    .controller('AccordionController', AccordionController)
    .directive('accordion', accordionDirectve)
    .directive('accordionGroup', accordionGroupDirective)
    .directive('accordionHeading', accordionHeadingDirective)
    .directive('accordionTransclude', accordionTranscludeDirective);

  // 维护手风琴作用域
  AccordionController.$inject = ['$scope'];
  function AccordionController ($scope) {
    var that = this,
      nowOpenGroup = null,
      totalHeight = 0,// 总高度
      groupsHeight = 0; // 组总高度(标题)

    that.groups = []; // 所有的组作用域
    that.addGroup = addGroup;
    that.closeOthers = closeOthers;
    that.removeGroup = removeGroup;
    that.setTotalHeight = updateTotalHeight;
    that.addGroupHeight = function(height) { groupsHeight += height; };

    // 监听切换重置参数
    $scope.$watch('data', function(t) {
//console.info('-----------', '重置!');
      that.groups = [];
      nowOpenGroup = null;
      groupsHeight = 0;
    });

    // 关闭其他组
    function closeOthers(openGroup) {
      if (openGroup) {
        angular.forEach(that.groups, function(group) {
          if (group !== openGroup) {
            group.height = 1;
            group.isOpen = false;
          }
        });
        openGroup.height = totalHeight - groupsHeight;
        nowOpenGroup = openGroup;
      }
    }

    // 添加组的作用域
    function addGroup(groupScope) {
      that.groups.push(groupScope);
    }

    // 删除一个组的作用域
    function removeGroup(group) {
      var index = that.groups.indexOf(group);
      if (index !== -1) {
        that.groups.splice(index, 1);
      }
    }

    // 更新总高度及当前选中组的高度
    function updateTotalHeight(height) {
      totalHeight = height;
      angular.forEach(that.groups, function(group) {
        if (group ===  nowOpenGroup && group.isOpen === true) {
          group.height = totalHeight - groupsHeight;
        }
      });
    }
  }

  // 手风琴指令控制器
  function accordionDirectve () {
    return {
      controller:'AccordionController',
      transclude: true,
      replace: true,
      scope: {'data': '=?'},
      templateUrl: 'app/template/accordion/accordion.html',
      link: function(scope, element, attrs, accordionCtrl) {
        accordionCtrl.setTotalHeight(element.height());

        // 调整注册
        $(window).resize(function(e) {
          accordionCtrl.setTotalHeight(element.height());
          scope.$apply();
        });
      }
    };
  }

  // 组指令
  function accordionGroupDirective() {
    return {
      require: '^accordion', // 依赖
      transclude: true,
      replace: true,
      templateUrl: 'app/template/accordion/accordion-group.html',
      scope: {heading: '@', isOpen: '=?', selected: '&'},
      controller: function() {
        this.setHeading = function(element) {
          this.heading = element;
        };
      },
      link: function(scope, element, attrs, accordionCtrl) {

        // 一次性上层不知道
        scope.isOpen = attrs.attrOpen === 'false' ? false : true;

        var selectedEvent = scope.selected();
        accordionCtrl.addGroup(scope);
        accordionCtrl.addGroupHeight(element.height());

        scope.$watch('isOpen', function(value) {
          if (value) { accordionCtrl.closeOthers(scope); }
          else { scope.height = 1; }
        });

        scope.toggleOpen = function () {
          scope.isOpen = !scope.isOpen;
          if (scope.isOpen && selectedEvent) { selectedEvent(); }
        };
      }
    };
  }

  // 头指令配置
  function accordionHeadingDirective() {
    return {
      transclude: true,
      template: '',
      replace: true,
      require: '^accordionGroup',
      link: function(scope, element, attr, accordionGroupCtrl, transclude) {
        // 拿到引入的内容, 作用域设定
        accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
      }
    };
  }

  // 编译引入块添加到元素上
  function accordionTranscludeDirective() {
    return {
      require: '^accordionGroup',
      link: function(scope, element, attr, controller) {
        scope.$watch(function(){ return controller[attr.accordionTransclude]; },
          function(heading) {
            if (heading) {
              element.html('');
              element.append(heading);
            }
        });
      }
    };
  }
})();
