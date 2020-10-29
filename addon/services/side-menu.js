import { assert } from '@ember/debug';
import { deprecate } from '@ember/application/deprecations';
import { equal } from '@ember/object/computed';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import Service from '@ember/service';

const TAG = 'ember-side-menu/services/side-menu';
const menuIdDeprecation = {
  id: `${TAG}.menuId`,
  until: '1.0.0',
  url: ''
};

export default Service.extend({
  init() {
    this._super(...arguments);
    set(this, 'menus', {});
  },

  create(menuId) {
    assert(`${TAG} - create function - id must be defined`, isPresent(menuId));
    const menus = get(this, 'menus');
    const newMenu = {
      progress: 0,
      isOpen: equal('progress', 100),
      isClosed: equal('progress', 0),
      isSlightlyOpen: false
    };

    menus[menuId] = newMenu;

    return newMenu;
  },

  destroy(menuId) {
    assert(`${TAG} - destroy function - id must be defined`, isPresent(menuId));
    const menus = get(this, 'menus');

    delete menus[menuId];
  },

  close(id) {
    deprecate(
      `${TAG} - using close method without menuId argument is deprecated, please provide menu id`,
      isPresent(id),
      menuIdDeprecation
    );
    const menuId = id || this._getFirstMenuId();
    const menu = get(this, 'menus')[menuId];
    set(menu, 'progress', 0);
    set(menu, 'isSlightlyOpen', false);
  },

  open(id) {
    deprecate(
      `${TAG} - using open method without menuId argument is deprecated, please provide menu id`,
      isPresent(id),
      menuIdDeprecation
    );
    const menuId = id || this._getFirstMenuId();
    const menu = get(this, 'menus')[menuId];
    set(menu, 'progress', 100);
    set(menu, 'isSlightlyOpen', false);
  },

  toggle(id) {
    deprecate(
      `${TAG} - using toggle method without menuId argument is deprecated, please provide menu id`,
      isPresent(id),
      menuIdDeprecation
    );
    const menuId = id || this._getFirstMenuId();
    const menu = get(this, 'menus')[menuId];
    if (get(menu, 'isOpen')) {
      this.close(menuId);
    } else {
      this.open(menuId);
    }
  },

  _getFirstMenuId() {
    return Object.keys(get(this, 'menus'))[0];
  }
});
