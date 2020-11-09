import Component from '@ember/component';
import layout from '../templates/components/tab-button';

export default Component.extend({
  layout,

  tagName: 'a',

  classNames: ['tab-button'],
  classNameBindings: ['active', 'side']
});
