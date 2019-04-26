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

      // After the <div></div> template has been loaded, this will be detected by $watchGroup, due to
      // switchDivElement.children.length changing from 0 to 2.
      // Also, when the switch style changes $watchGroup will detect it.
      scope.$watchGroup([switchDivElement.children.length].concat(scope.switch.watchGroup), function(newVals, oldVals) {
        // If the switch has not yet been initialized, we should.
        // But if the switch model value (array elem #1 in the watchGroup) changes we should reinitialize the switch too,
        // since the switch model (Android, iOS, ...) can only be defined on switch creation.
        if (!scope.switch.initialized || oldVals[1] !== newVals[1]) {
          init();
        }

        // High chance the watch group was triggered because the style was changed. 
        // Let's accept the overhead and reset it anyway.
        changeStyle(scope.switch.switchElement, scope.switch.style);
      });

      function init() {
        // Create the 3rd party jQuery switch.
        scope.switch.switchElement = $('#' + id).btnSwitch({ 
          Theme: scope.switch.style.model, 
          ToggleState: scope.switch.state 
        });

        // Add the directives necessary for click actions to the jQuery switch.
        var inputElement = scope.switch.switchElement.find('input');
        inputElement.attr('ng-model', 'switch.state');
        inputElement.attr('ng-change', 'toggle()');

        // Create a closure and call it. It's argument will be the switchElement we just created.
        // The closure will return the callback function which we hook up to the scope.
        // This callback function can be called to "physically" set the state of the switch.
        scope.switch.setState = (function (e) {
          function setState(state) {
            var inputElement = angular.element(e[0].childNodes[0].childNodes[0]);

            // If the switch is currently not corresponding to the state in the backend,
            // programmatically trigger a click on it.
            if (inputElement.hasClass('tgl-sw-android-checked') != state) {
              var labelElement = angular.element(e[0].childNodes[0].childNodes[1]);
              labelElement.trigger('click');

              // We need to change the model, otherwise ng-change will not trigger the first time
              scope.switch.state = state;
              scope.$apply();
            }
          }
          return setState;
        })(scope.switch.switchElement);

        scope.switch.initialized = true;

        // Without compiling again, the added attributes will not be picked up by AngularJS.
        scope.$parent.ctrl.$compile(scope.switch.switchElement)(scope);
      }

      function changeStyle(elem, switchStyle) {
        var switchStyleElement = document.getElementById('switch');

        if (!switchStyleElement) {
          switchStyleElement = document.createElement('style');
          switchStyleElement.id = 'switch';
          switchStyleElement.type = 'text/css';
          document.getElementsByTagName('head')[0].appendChild(switchStyleElement);
        }

        var labelElement = angular.element(elem.find('label'));
        labelElement.addClass('switch-colours');

        switchStyleElement.innerHTML = '.tgl-sw-android + .switch-colours { background: ' + switchStyle.offStateBackgroundColour + ' !important; }\n' +
                                       '.tgl-sw-android + .switch-colours:after { background: ' + switchStyle.offStateColour + ' !important; }\n' +
                                       '.tgl-sw-android-checked + .switch-colours { background: ' + switchStyle.onStateBackgroundColour + ' !important; }\n' +
                                       '.tgl-sw-android-checked + .switch-colours:after { background: ' + switchStyle.onStateColour + ' !important; }\n';
      }
    }
  };
});