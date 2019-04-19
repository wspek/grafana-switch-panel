import { PanelCtrl } from 'app/plugins/sdk';
import { Database } from './database';

import './gs-switch';
import './css/panel.css!';

export class jQuerySwitchCtrl extends PanelCtrl {
  constructor($scope, $injector, $compile, $http) {
    super($scope, $injector);
    this.$http = $http;
    this.$compile = $compile;

    this.db = new Database();
    this.db.setOnUpdateCallback(function (newRecord) {
      $scope.switch.setState(newRecord.greenLedState ? true : false);
    });
    this.db.init();

    $scope.switch = {
      state: false,
      setState: null,
    };

    // This function is called when the switch state is changed
    $scope.toggle = function() {
      // Add the new state of the switch to the back end DB
      try {
        this.db.addData('devices', { 
          greenLedState: $scope.switch.state ? 1 : 0,
        });
      // If something went wrong and the backend DB was not updated, the 
      // switch needs to move (back) to the last state in the DB
      } catch (error) {
        console.log('Caught error while attempting to add data to database. Error: ' + error);

        this.db.getLastEntry('devices', function(data) {
          setTimeout(function() {
            $scope.switch.setState(data.greenLedState ? true : false);
          }, 500);
        });
      }
    }.bind(this);

    var panelDefaults = {
      test: 'testing',
    };
    _.defaults(this.panel, panelDefaults);

    this.events.on('panel-initialized', this.render.bind(this));
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

