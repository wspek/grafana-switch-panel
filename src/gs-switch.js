import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';

angular.module('grafana.directives').directive("gsSwitch", function() {
  return {
    restrict: 'C',
    template: '<div></div>',
    link: function (scope, elem, attrs, ctrl) {
      // By using the scope id and the switch number, we can calculate a unique id.
      var switchNum = elem[0].parentElement.querySelectorAll('.in-switch').length;
      var id = 'switch_' + scope.$id + '_' + switchNum;

      // Add the id to the <div></div> of the template. Later, when the $watch triggers,
      // jQuery can use this ID to find the right element.
      var switchDivElement = angular.element(elem[0].childNodes[0]);
      switchDivElement.attr('id', id);

      // This class needs to be added to keep count of the number of switches, so we can
      // calculate the id (see code above).
      switchDivElement.addClass('in-switch');

      // After the <div></div> template has been loaded, this will be detected by $watch, due to
      // switchDivElement.children.length changing from 0 to 2.
      scope.$watch(switchDivElement.children.length, function() {
        // Create the 3rd party jQuery switch.
        var switchElement = $('#' + id).btnSwitch({ Theme: 'Android' });

        // Create a closure and call it. It's argument will be the switchElement we just created.
        // The closure will return the callback function which we hook up to the scope.
        // This callback function can be called to "physically" set the state of the switch.
        scope.switch.setState = (function (e) {
          function setState(state) {
            var inputElement = angular.element(e.childNodes[0].childNodes[0]);

            if (inputElement.hasClass('tgl-sw-android-checked') != state) {
              var labelElement = angular.element(e.childNodes[0].childNodes[1]);
              labelElement.trigger('click');
            }
          }
          return setState;
        })(switchElement[0]);
        
        // Add the directives necessary for click actions to the jQuery switch.
        var inputElement = switchElement.find('input');
        inputElement.attr('ng-change', 'toggle()');
        inputElement.attr('ng-model', 'switch.state');
        inputElement.attr('ng-checked', 'switch.state');
        inputElement.attr('ng-true-value', '1');
        inputElement.attr('ng-false-value', '0');

        // Without compiling again, the added attributes will not be picked up by AngularJS.
        scope.$parent.ctrl.$compile(switchElement)(scope);
      });
    }
  };
});