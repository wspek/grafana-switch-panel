import {PanelCtrl} from 'app/plugins/sdk';
import $ from 'jquery';

import './gs-switch';
import './css/panel.css!';

export class jQuerySwitchCtrl extends PanelCtrl {
  constructor($scope, $injector, $compile, $http) {
    super($scope, $injector);
    this.$http = $http;
    this.$compile = $compile;
    this.switchDivId = 'switch_' + this.panel.id;
    $scope.switchValues = {greenLedState: false};

    var panelDefaults = {
      test: 'testing',
    };
    _.defaults(this.panel, panelDefaults);

    this.events.on('panel-initialized', this.render.bind(this));

    $scope.toggle = function() {
      this.ctrl.sendNewConfig(this.switchValues);
    };
  }

  sendNewConfig(newConfig) {
    var url = 'https://e-charger-218218.appspot.com/api/lastState/nodemcu1';
    var data = jQuerySwitchCtrl.normalizeConfig(newConfig);
    var config = {
      headers : {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    this.$http.post(url, data, config)
      .then(
          function(response) {
            console.log('SUCCESS');
            console.log(response);
          },
          function(response) {
            console.log('FAILURE');
            console.log(response);
          }
      );
  }

  static normalizeConfig(config) {
    var normalizedConfig = {};

    for (var key in config) {
      var intValue = config[key] ? 1 : 0;
      normalizedConfig[key] = intValue;
    }

    return normalizedConfig;
  }

  link(scope, elem, attrs, ctrl) {
    function render() {
      // TODO
    }

    this.events.on('render', function() {
      render();
      ctrl.renderingCompleted();
    });
  }
}

jQuerySwitchCtrl.templateUrl = 'partials/template.html';

