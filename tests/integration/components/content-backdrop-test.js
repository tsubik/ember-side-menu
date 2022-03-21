import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | content backdrop', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.sideMenu = this.owner.lookup('service:side-menu');
  });

  test('it renders', async function (assert) {
    await render(hbs`<ContentBackdrop />`);

    assert.equal(find('*').textContent.trim(), '');
  });

  test('should not be visible if menu is closed', async function (assert) {
    assert.expect(1);

    await render(hbs`<ContentBackdrop />`);

    assert.ok(find('.content-backdrop').getAttribute('style').indexOf('visibility: hidden') > -1);
  });

  test('should be visible if menu is open', async function (assert) {
    assert.expect(1);

    this.set('sideMenu.defaultMenu.progress', 100);
    await render(hbs`<ContentBackdrop />`);

    assert.ok(find('.content-backdrop').getAttribute('style').indexOf('visibility: visible') > -1);
  });

  test('should have opacity depended on menu opening progress', async function (assert) {
    assert.expect(2);

    this.set('sideMenu.defaultMenu.progress', 40);
    await render(hbs`<ContentBackdrop />`);

    assert.ok(find('.content-backdrop').getAttribute('style').indexOf('opacity: 0.4') > -1, 'opacity 0.4');

    this.set('sideMenu.defaultMenu.progress', 70);
    assert.ok(find('.content-backdrop').getAttribute('style').indexOf('opacity: 0.7') > -1, 'opacity 0.7');
  });

  test('should work for multiple menus', async function (assert) {
    assert.expect(4);

    await render(hbs`
      <SideMenu @id="menu1" @side="right">
        Menu 1
      </SideMenu>
      <SideMenu @id="menu2" @side="right">
        Menu 2
      </SideMenu>
      <ContentBackdrop class="backdrop1" @menuId="menu1" />
      <ContentBackdrop class="backdrop2" @menuId="menu2" />
    `);

    const backdrop1 = find('.content-backdrop.backdrop1');
    const backdrop2 = find('.content-backdrop.backdrop2');

    assert.ok(backdrop1.getAttribute('style').indexOf('visibility: hidden') > -1);
    assert.ok(backdrop2.getAttribute('style').indexOf('visibility: hidden') > -1);

    this.set('sideMenu.menus.menu1.progress', 20);
    this.set('sideMenu.menus.menu2.progress', 100);

    assert.ok(backdrop1.getAttribute('style').indexOf('opacity: 0.2') > -1, 'menu1 opacity 0.2');
    assert.ok(backdrop2.getAttribute('style').indexOf('visibility: visible') > -1);
  });
});
