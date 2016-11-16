import bus from 'bus';

import equals from 'mout/object/equals';
import view from '../view/mixin';
import template from './footer.jade';
import merge from 'merge';
import config from '../config/config'
import t from 't-component';


class Footer extends view('appendable') {
  constructor (options = {}) {
    options.template = template;
    super(options);


    this.refresh = this.refresh.bind(this);
    this.forums = [] ;

    this.refresh();
    this.switchOn();
  }

  switchOn () {
    bus.on('app-state:update', this.refresh);
  }

  switchOff () {
    bus.off('app-state:update', this.refresh);
  }

  refresh () {}

}

const footer = new Footer({
  container: document.querySelector('.app-footer')
});

export default footer;
