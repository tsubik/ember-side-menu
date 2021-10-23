import { equal, oneWay, alias } from '@ember/object/computed';
import EmberObject, { set, get } from '@ember/object';
import Service from '@ember/service';

const MenuObject = EmberObject.extend({
  id: undefined,
  progress: 0,
  isOpen: equal('progress', 100),
  isClosed: equal('progress', 0),
  isSlightlyOpen: false
});

export default Service.extend({
  // backwards compability with having default menu without using menu ids
  progress: alias('defaultMenu.progress'),
  isSlightlyOpen: oneWay('defaultMenu.isSlightlyOpen'),
  isOpen: oneWay('defaultMenu.isOpen'),
  isClosed: oneWay('defaultMenu.isClosed'),

  defaultMenu: oneWay('menus.default'),

  init() {
    this._super(...arguments);
    set(this, 'menus', { default: MenuObject.create({ id: 'default' }) });
  },

  create(menuId = 'default') {
    const menus = get(this, 'menus');
    const newMenu = MenuObject.create({ id: menuId });
    set(menus, menuId, newMenu);
    set(this, 'menus', Object.assign({}, menus));

    return newMenu;
  },

  destroy(id = 'default') {
    const menus = get(this, 'menus');

    delete menus[id];
    set(this, 'menus', Object.assign({}, menus));
  },

  close(id = 'default') {
    const menu = get(this, 'menus')[id];
    set(menu, 'progress', 0);
    set(menu, 'isSlightlyOpen', false);
  },

  open(id = 'default') {
    const menu = get(this, 'menus')[id];
    set(menu, 'progress', 100);
    set(menu, 'isSlightlyOpen', false);
  },

  toggle(id = 'default') {
    const menu = get(this, 'menus')[id];
    if (get(menu, 'isOpen')) {
      this.close(id);
    } else {
      this.open(id);
    }
  }
});
