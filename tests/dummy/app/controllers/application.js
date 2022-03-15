import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service sideMenu;

  @tracked side = 'left';
  @tracked mode = 'single';

  get isLeft() {
    return this.side === 'left';
  }
  get isRight() {
    return this.side === 'right';
  }

  get isSingle() {
    return this.mode === 'single';
  }
  get isMulti() {
    return this.mode === 'multi';
  }

  @action
  changeSide(side) {
    this.side = side;
  }

  @action
  changeMode(mode) {
    this.mode = mode;
  }

  @action
  close(menuId) {
    this.sideMenu.close(menuId);
  }
}
