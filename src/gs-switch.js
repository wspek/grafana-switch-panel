import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';

angular.module('grafana.directives').directive("gsSwitch", function($timeout) {
  return {
    restrict: 'C',
    template: '<div></div>',
    link: function (scope, elem, attrs, ctrl) {
      // id = 'switch_{number}' where {number} is the panel ID 
      // This id is set on the controller.
      var id = scope.$parent.ctrl.switchDivId;  

      // Add the id to the <div></div> of the template. Later, when the $watch triggers, 
      // jQuery can use this ID to find the right element.
      var switchDivElement = angular.element(elem[0].childNodes[0]);
      switchDivElement.attr('id', id);

      // After the <div></div> template has been loaded, this will be detected by $watch, due to 
      // switchDivElement.children.length changing from 0 to 2. 
      scope.$watch(switchDivElement.children.length, function() {
        // Render the 3rd party jQuery switch.
        var switchElement = $('#' + id).btnSwitch({ Theme: 'Android' });
      
        // Add the directives necessary for click actions to the jQuery switch.
        var inputElement = switchElement.find('input');
        inputElement.attr('ng-change', 'toggle()');
        inputElement.attr('ng-model', 'bla');
      
        // Without compiling again, the added attributes will be picked up by AngularJS.
        scope.$parent.ctrl.$compile(switchElement)(scope);
      });
    }
  };
});