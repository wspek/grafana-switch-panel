import {PanelCtrl} from 'app/plugins/sdk';
import $ from 'jquery';

import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';
import './css/panel.css!';


export class SwitchCtrl extends PanelCtrl {

  constructor($scope, $injector, alertSrv) {
    super($scope, $injector);

    this.events.on('panel-initialized', this.render.bind(this));
  }

  link(scope, elem, attrs, ctrl) {    
    function render() {     
      $('#demo4').btnSwitch({
        Theme: 'Android'
      });
    }

    this.events.on('render', function() { 
      render();
      ctrl.renderingCompleted();
    });
  }
}

SwitchCtrl.templateUrl = 'partials/template.html';
