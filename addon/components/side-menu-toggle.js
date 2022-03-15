import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SideMenuComponent extends Component {
  @service sideMenu;

  get side() {
    return this.args.side ?? 'left';
  }
  get menuId() {
    return this.args.menuId ?? 'default';
  }

  @action
  toggle() {
    this.sideMenu.toggle(this.menuId);
  }
}
