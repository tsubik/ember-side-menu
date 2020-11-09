import Controller from '@ember/controller';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  sideMenu: service(),

  side: 'left',
  mode: 'single',

  isLeft: equal('side', 'left'),
  isRight: equal('side', 'right'),

  isSingle: equal('mode', 'single'),
  isMulti: equal('mode', 'multi'),

  actions: {
    changeSide(side) {
      this.set('side', side);
    },

    changeMode(mode) {
      this.set('mode', mode);
    },

    close(menuId) {
      this.get('sideMenu').close(menuId);
    }
  }
});
