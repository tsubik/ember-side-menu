import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Controller.extend({
  side: 'left',
  mode: 'single',

  isLeft: equal('side', 'left'),
  isRight: equal('side', 'right'),

  isSingle: equal('mode', 'single'),
  isMulti: equal('mode', 'multi'),

  menu: computed('side', function() {
    const side = get(this, 'side');

    return side === 'left' ? 'menuLeft' : 'menuRight';
  }),

  actions: {
    changeSide(side) {
      this.set('side', side);
    },

    changeMode(mode) {
      this.set('mode', mode);
    }
  }
});
