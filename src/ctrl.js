import {PanelCtrl} from 'app/plugins/sdk';
import $ from 'jquery';

import { renderSwitch } from './gs-switch';
import './css/panel.css!';


export class jQuerySwitchCtrl extends PanelCtrl {
  constructor($scope, $injector, $compile) {
    super($scope, $injector);
    this.$compile = $compile;
    this.switchDivId = 'switch_' + this.panel.id;

    var panelDefaults = {
      test: 'testing',
    };
    _.defaults(this.panel, panelDefaults);

    this.events.on('panel-initialized', this.render.bind(this));

    $scope.toggle = function() {
      console.log("Change!");
    };
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

