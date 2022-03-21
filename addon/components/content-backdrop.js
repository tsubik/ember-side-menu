import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContentBackdropComponent extends Component {
  @service sideMenu;

  get menuId() {
    return this.args.menuId ?? 'default';
  }

  get menu() {
    return this.sideMenu.menus[this.menuId];
  }

  get progress() {
    return this.menu.progress;
  }

  get style() {
    const progress = this.progress;
    const opacity = progress / 100;
    const visibility = progress === 0 ? 'hidden' : 'visible';
    let transition = 'none';

    if (progress === 100) {
      transition = 'opacity 0.2s ease-out';
    } else if (progress === 0) {
      transition = 'visibility 0s linear 0.2s, opacity 0.2s ease-out';
    }

    return htmlSafe(`opacity: ${opacity}; visibility: ${visibility}; transition: ${transition}`);
  }

  @action
  close() {
    this.sideMenu.close(this.menuId);
  }
}
