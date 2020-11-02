import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  sideMenu: service(),

  classNameBindings: ['side'],
  classNames: ['side-menu-toggle'],

  side: 'left',
  menuId: 'default',

  click() {
    get(this, 'sideMenu').toggle(get(this, 'menuId'));
  }
});
