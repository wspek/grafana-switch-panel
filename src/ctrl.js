import { PanelCtrl } from 'app/plugins/sdk';
import { Database } from './database';

import './gs-switch';
import './css/panel.css!';

const panelDefaults = {
  stateControlVariable: '',
  switchModel: 'Android',
  switchModelOptions: ['Android', 'iOS', 'Button', 'Light', 'Swipe'],
  pollingInterval: 10,
  offStateColour: '#800000',
  offStateBackgroundColour: '#B22222',
  onStateColour: '#3E8E41',
  onStateBackgroundColour: '#4CAF50',
};

export class jQuerySwitchCtrl extends PanelCtrl {
  constructor($scope, $injector, $compile, $http) {
    super($scope, $injector);
    _.defaults(this.panel, panelDefaults);

    this.$http = $http;
    this.$compile = $compile;
    this.scoperef = $scope;

    this.db = new Database();
    this.db.setOnUpdateCallback(function (newRecord) {
      $scope.switch.setState(newRecord.greenLedState ? true : false);
    });
    this.db.init();

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

    this.events.on('render', this.onRender.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));
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

