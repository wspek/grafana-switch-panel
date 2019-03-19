import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';

angular.module('grafana.directives').directive("gsSwitch", function() {
  return {
    restrict: 'C',
    template: '<div></div>',
    link: function (scope, elem, attrs, ctrl) {
      var switchElement = angular.element(elem[0].childNodes[0]);
      switchElement.attr('id', scope.$parent.ctrl.switchDivId);
    }
  };
});

export function renderSwitch(scope, ctrl) {
  var switchElement = $('#'+ctrl.switchDivId).btnSwitch({ Theme: 'Android' });

  var inputElement = switchElement.find('input');
  inputElement.attr('ng-change', 'toggle()');
  inputElement.attr('ng-model', 'bla');

  ctrl.$compile(inputElement)(scope)
}