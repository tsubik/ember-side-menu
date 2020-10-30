import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';

export default Component.extend({
  sideMenu: service(),

  attributeBindings: ['style'],
  classNames: ['content-backdrop'],

  menu: computed('sideMenu.menus', 'menuId', function() {
    const menuId = get(this, 'menuId');
    return get(this, `sideMenu.menus.${menuId}`);
  }),
  progress: oneWay('menu.progress'),

  style: computed('progress', function() {
    const progress = get(this, 'progress');
    const opacity = progress / 100;
    const visibility = progress === 0 ? 'hidden' : 'visible';
    let transition = 'none';

    if (progress === 100) {
      transition = 'opacity 0.2s ease-out';
    } else if (progress === 0) {
      transition = 'visibility 0s linear 0.2s, opacity 0.2s ease-out';
    }

    return htmlSafe(`opacity: ${opacity}; visibility: ${visibility}; transition: ${transition}`);
  }),

  click() {
    get(this, 'sideMenu').close(get(this, 'menuId'));
  },

  touchEnd() {
    get(this, 'sideMenu').close(get(this, 'menuId'));
  }
});
