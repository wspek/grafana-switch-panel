import {PanelCtrl} from 'app/plugins/sdk';
import $ from 'jquery';

import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';
import './css/panel.css!';


export class SwitchCtrl extends PanelCtrl {

  constructor($scope, $injector, alertSrv) {
    super($scope, $injector);
    
    this.switchDivId = 'switch_' + this.panel.id;

    var panelDefaults = {
      test: 'testing',
    };
    _.defaults(this.panel, panelDefaults);

    this.events.on('panel-initialized', this.render.bind(this));
  }

  renderSwitch() {
      $('#'+this.switchDivId).btnSwitch({
        Theme: 'Android'
      });
  }

  link(scope, elem, attrs, ctrl) { 
    var switchByClass = elem.find('.switchbox');
    switchByClass.append('<div id="'+this.switchDivId+'"></div>');

    function render() {     
      ctrl.renderSwitch();
    }

    this.events.on('render', function() { 
      render();
      ctrl.renderingCompleted();
    });
  }
}

SwitchCtrl.templateUrl = 'partials/template.html';
