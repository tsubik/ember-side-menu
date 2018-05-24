import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | content backdrop', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.sideMenu = this.owner.lookup('service:side-menu');
  });

  test('it renders', async function(assert) {
    await render(hbs`{{content-backdrop}}`);

    assert.equal(find('*').textContent.trim(), '');
  });

  test('should not be visible if menu is closed', async function(assert) {
    assert.expect(1);

    await render(hbs`{{content-backdrop}}`);

    assert.ok(
      find('.content-backdrop')
        .getAttribute('style')
        .indexOf('visibility: hidden') > -1
    );
  });

  test('should be visible if menu is open', async function(assert) {
    assert.expect(1);

    this.set('sideMenu.progress', 100);
    await render(hbs`{{content-backdrop}}`);

    assert.ok(
      find('.content-backdrop')
        .getAttribute('style')
        .indexOf('visibility: visible') > -1
    );
  });

  test('should have opacity depended on menu opening progress', async function(assert) {
    assert.expect(2);

    this.set('sideMenu.progress', 40);
    await render(hbs`{{content-backdrop}}`);

    assert.ok(
      find('.content-backdrop')
        .getAttribute('style')
        .indexOf('opacity: 0.4') > -1,
      'opacity 0.4'
    );

    this.set('sideMenu.progress', 70);
    assert.ok(
      find('.content-backdrop')
        .getAttribute('style')
        .indexOf('opacity: 0.7') > -1,
      'opacity 0.7'
    );
  });
});
