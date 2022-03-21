import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

class MenuObject {
  @tracked id;
  @tracked progress = 0;
  @tracked isSlightlyOpen = false;
  get isOpen() {
    return this.progress === 100;
  }
  get isClosed() {
    return this.progress === 0;
  }

  constructor(id) {
    this.id = id;
  }
}

export default class SideMenuService extends Service {
  // backwards compability with having default menu without using menu ids
  get progress() {
    return this.defaultMenu.progress;
  }
  get isSlightlyOpen() {
    return this.defaultMenu.isSlightlyOpen;
  }
  get isOpen() {
    return this.defaultMenu.isOpen;
  }
  get isClosed() {
    return this.defaultMenu.isClosed;
  }

  get defaultMenu() {
    return this.menus.default;
  }

  constructor() {
    super(...arguments);
    this.menus = { default: new MenuObject('default') };
  }

  create(menuId = 'default') {
    const menus = this.menus;
    const newMenu = new MenuObject(menuId);
    menus[menuId] = newMenu;
    this.menus = Object.assign({}, menus);

    return newMenu;
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  destroy(id = 'default') {
    const menus = this.menus;

    delete menus[id];
    this.menus = Object.assign({}, menus);
  }

  close(id = 'default') {
    const menu = this.menus[id];
    menu.progress = 0;
    menu.isSlightlyOpen = false;
  }

  open(id = 'default') {
    const menu = this.menus[id];
    menu.progress = 100;
    menu.isSlightlyOpen = false;
  }

  toggle(id = 'default') {
    const menu = this.menus[id];
    if (menu.isOpen) {
      this.close(id);
    } else {
      this.open(id);
    }
  }
}
