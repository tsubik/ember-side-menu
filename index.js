'use strict';

module.exports = {
  name: require('./package').name,

  included: function (app) {
    this._super.included.apply(this, arguments);

    const hasSass = !!app.registry.availablePlugins['ember-cli-sass'];
    const hasLess = !!app.registry.availablePlugins['ember-cli-less'];

    if (!hasSass && !hasLess) {
      app.import('vendor/ember-side-menu.css');
    }
  },
};
