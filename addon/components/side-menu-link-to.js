import { inject as service } from '@ember/service';
import LinkComponent from '@ember/routing/link-component';
import { action } from '@ember/object';

export default class SideMenuLinkToComponent extends LinkComponent {
  @service sideMenu;

  get menuId() {
    return this.args.menuId ?? 'default';
  }

  @action
  click() {
    super.click(...arguments);
    this.sideMenu.close(this.menuId);
  }
}
