import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  sideMenu: service(),

  menuId: 'default',

  click() {
    get(this, 'sideMenu').close(get(this, 'menuId'));
  }
});
