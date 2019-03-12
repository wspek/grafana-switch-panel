import {MetricsPanelCtrl} from 'app/plugins/sdk';
import $ from 'jquery';

import './external/jquery.btnswitch';
import './external/jquery.btnswitch.css!';
import './css/panel.css!';


export class D3GaugePanelCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector, alertSrv) {
    super($scope, $injector);

    this.events.on('data-received', this.onDataReceived.bind(this));
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

  onDataReceived(dataList) {
    this.render();
  }
}

D3GaugePanelCtrl.templateUrl = 'partials/template.html';
