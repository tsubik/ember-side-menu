import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/menu-style-option';

export default Component.extend({
  layout,
  tagName: 'a',
  classNameBindings: ['isActive:current-demo'],

  isActive: computed('option', 'activeOption', function() {
    const option = this.get('option');
    const activeOption = this.get('activeOption');

    return option.id === activeOption.id;
  }),

  click() {
    const option = this.get('option');
    this.sendAction('action', option); //eslint-disable-line
  }
});
