import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/side-button';

export default Component.extend({
  layout,

  tagName: 'a',

  classNames: ['side-button'],
  classNameBindings: ['isActive:active', 'side'],

  isActive: computed('side', 'actualSide', function() {
    return this.get('side') === this.get('actualSide');
  }),

  click() {
    this.set('actualSide', this.get('side'));
  }
});
