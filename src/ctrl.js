import { PanelCtrl } from 'app/plugins/sdk';

import { Database } from './database';
import './gs-switch';
import './pollservice';
import './css/panel.css!';

const panelDefaults = {
  deviceName: 'frigorifico-1',
  stateControlVariable: 'greenLedState',
  switchModel: 'Android',
  switchModelOptions: ['Android', 'iOS', 'Button', 'Light', 'Swipe'],
  pollingInterval: 10,
  offStateColour: '#800000',
  offStateBackgroundColour: '#B22222',
  onStateColour: '#3E8E41',
  onStateBackgroundColour: '#4CAF50',
};

export class jQuerySwitchCtrl extends PanelCtrl {
  constructor($scope, $injector, $compile, $http, $interval) {
    super($scope, $injector);
    _.defaults(this.panel, panelDefaults);

    this.$http = $http;
    this.$compile = $compile;
    this.scoperef = $scope;
    this.$interval = $interval;
    this.intervalPromise = null;
    

    $scope.switch = {
      initialized: false,
      switchElement: null,
      style: {
        model: this.panel.switchModel,
        offStateColour: this.panel.offStateColour,
        offStateBackgroundColour: this.panel.offStateBackgroundColour,
        onStateColour: this.panel.onStateColour,
        onStateBackgroundColour: this.panel.onStateBackgroundColour,
      },
      state: false,
      setState: null,
      // Changes in the below defined variables will be watched in the scope.$watchGroup, defined in
      // gs-switch.js directive. If something changes, the change will be rendered in this way. 
      watchGroup: ['switch.style.model', 'switch.style.offStateColour', 'switch.style.offStateBackgroundColour', 
                                         'switch.style.onStateColour', 'switch.style.onStateBackgroundColour'],
    };
      
    // This function is called when the switch state is changed
    $scope.toggle = function() {
      // Add the new state of the switch to the back end DB
      this.db.updateData(this.panel.deviceName, { 
        [this.panel.stateControlVariable]: $scope.switch.state ? 1 : 0,
      })
      // If something went wrong and the backend DB was not updated, the 
      // switch needs to move (back) to the last state in the DB
      .catch(function(error) {
        console.log('Could not write to device ' + this.panel.deviceName + '. Are you sure it exists?');

        this.db.getData(this.panel.deviceName, function(data) {
          setTimeout(function() {
            $scope.switch.setState(!!data[this.panel.stateControlVariable]);
          }.bind(this), 500);
        });
      }.bind(this));
    }.bind(this);

    this.events.on('render', this.onRender.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-initialized', this.onPanelInitialized.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));

    // Start polling
    this.poll();
  }

  poll() {
    if (this.panel.pollingInterval === null) {
      this.panel.pollingInterval = 10;
    }
    if (this.panel.pollingInterval <= 0) {
      this.panel.pollingInterval = 1;
    }
    if (this.panel.pollingInterval > 86400) {
      this.panel.pollingInterval = 86400;
    }

    if (this.intervalPromise) {
      this.$interval.cancel(this.intervalPromise);
    }

    // Start polling the database
    this.intervalPromise = this.$interval(function() {
      this.db.getData(this.panel.deviceName, function(data) {
        this.scoperef.switch.setState(!!data[this.panel.stateControlVariable]);
      }.bind(this));
    }.bind(this), this.panel.pollingInterval * 1000);

    //Always clear the interval when the view is destroyed, otherwise it will keep polling and leak memory
    this.scoperef.$on('$destroy', function() {
      this.$interval.cancel(this.intervalPromise);
    }.bind(this));
  }

  onInitEditMode() {
    // determine the path to this plugin
    var panels = grafanaBootData.settings.panels;
    var thisPanel = panels[this.pluginId];
    var thisPanelPath = thisPanel.baseUrl + '/';

    // add the relative path to the partial
    var optionsPath = thisPanelPath + 'partials/editor.options.html';
    this.addEditorTab('Options', optionsPath, 2);
  }

  onPanelInitialized() {
    this.db = new Database('device-configs', this.panel.deviceName);
    this.db.setOnUpdateCallback(function (config) {
      this.scoperef.switch.setState(!!config[this.panel.stateControlVariable]);
    }.bind(this));
    this.db.init();
  }

  onChangeStyle() {
    this.scoperef.switch.style.model = this.panel.switchModel;
    this.scoperef.switch.style.offStateColour = this.panel.offStateColour;
    this.scoperef.switch.style.offStateBackgroundColour = this.panel.offStateBackgroundColour;
    this.scoperef.switch.style.onStateColour = this.panel.onStateColour;
    this.scoperef.switch.style.onStateBackgroundColour = this.panel.onStateBackgroundColour;
  }

  onRender() {
    // FUTURE USE
  }

  link(scope, elem, attrs, ctrl) {
    // FUTURE USE
  }
}

jQuerySwitchCtrl.templateUrl = 'partials/template.html';

