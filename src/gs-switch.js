import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';

angular.module('grafana.directives').directive("gsSwitch", function($timeout) {
  return {
    restrict: 'C',
    template: '<div></div>',
    link: function (scope, elem, attrs, ctrl) {
      var switchDivElement = angular.element(elem[0].childNodes[0]);
      switchDivElement.attr('id', scope.$parent.ctrl.switchDivId);

      $timeout(function(){
        var switchElement = $('#'+scope.$parent.ctrl.switchDivId).btnSwitch({ Theme: 'Android' });

        var inputElement = switchElement.find('input');
        inputElement.attr('ng-change', 'toggle()');
        inputElement.attr('ng-model', 'bla');
      
        scope.$parent.ctrl.$compile(switchElement)(scope);
      }, 100);
    }
  };
});