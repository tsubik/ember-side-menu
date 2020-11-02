import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | side menu', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.sideMenu = this.owner.lookup('service:side-menu');
  });

  test('it renders', async function(assert) {
    assert.expect(2);

    await render(hbs`{{side-menu}}`);

    assert.equal(find('*').textContent.trim(), '');

    await render(hbs`
      {{#side-menu}}
        template block text
      {{/side-menu}}
    `);

    assert.equal(find('*').textContent.trim(), 'template block text');
  });

  test('default side should be left and width 70%', async function(assert) {
    assert.expect(2);

    await render(hbs`{{side-menu}}`);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('width: 70%') > -1
    );
    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('right: initial; left: -70%') > -1
    );
  });

  test('should impose no box shadows if progress 0', async function(assert) {
    assert.expect(1);

    await render(hbs`{{side-menu}}`);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('box-shadow: none') > -1
    );
  });

  test('should not have box-shadow style none if progress > 0', async function(assert) {
    assert.expect(1);

    await render(hbs`{{side-menu}}`);

    this.set('sideMenu.progress', 50);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('box-shadow: none') === -1
    );
  });

  test('should change side', async function(assert) {
    assert.expect(1);

    await render(hbs`{{side-menu side="right"}}`);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('left: initial; right: -70%') > -1
    );
  });

  test('should change width', async function(assert) {
    assert.expect(2);

    await render(hbs`{{side-menu width="300px"}}`);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('width: 300px;') > -1
    );
    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('left: -300px;') > -1
    );
  });

  test('should change X position when progress changes (left menu)', async function(assert) {
    assert.expect(2);

    await render(hbs`{{side-menu}}`);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('transform: translateX(0%)') > -1,
      '0%'
    );

    this.set('sideMenu.progress', 50);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('transform: translateX(50%)') > -1,
      '50%'
    );
  });

  test('should change X position when progress changes (right menu)', async function(assert) {
    assert.expect(2);

    await render(hbs`{{side-menu side="right"}}`);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('transform: translateX(-0%)') > -1,
      '0%'
    );

    this.set('sideMenu.progress', 50);

    assert.ok(
      find('.side-menu')
        .getAttribute('style')
        .indexOf('transform: translateX(-50%)') > -1,
      '50%'
    );
  });

  test('rootNode should have class disable-scroll when menu is not closed', async function(assert) {
    assert.expect(2);

    await render(hbs`{{side-menu}}`);

    assert.notOk(document.body.classList.contains('disable-scroll'), 'no disable-scroll class when closed');

    this.set('sideMenu.progress', 50);

    assert.ok(document.body.classList.contains('disable-scroll'), 'disable-scroll class when not closed');
  });
});
