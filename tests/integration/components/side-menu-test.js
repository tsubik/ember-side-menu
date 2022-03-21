import { find, render, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | side menu', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.sideMenu = this.owner.lookup('service:side-menu');
  });

  test('it renders', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <SideMenu>
        template block text
      </SideMenu>
    `);

    assert.equal(find('*').textContent.trim(), 'template block text');
  });

  test('default side should be left and width 70%', async function (assert) {
    assert.expect(2);

    await render(hbs`<SideMenu />`);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('width: 70%') > -1);
    assert.ok(find('.side-menu').getAttribute('style').indexOf('right: initial; left: -70%') > -1);
  });

  test('should impose no box shadows if progress 0', async function (assert) {
    assert.expect(1);

    await render(hbs`<SideMenu />`);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('box-shadow: none') > -1);
  });

  test('should not have box-shadow style none if progress > 0', async function (assert) {
    assert.expect(1);

    await render(hbs`<SideMenu />`);

    this.set('sideMenu.defaultMenu.progress', 50);

    assert.strictEqual(find('.side-menu').getAttribute('style').indexOf('box-shadow: none'), -1);
  });

  test('should change side', async function (assert) {
    assert.expect(1);

    await render(hbs`<SideMenu @side="right" />`);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('left: initial; right: -70%') > -1);
  });

  test('should change width', async function (assert) {
    assert.expect(2);

    await render(hbs`<SideMenu @width="300px" />`);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('width: 300px;') > -1);
    assert.ok(find('.side-menu').getAttribute('style').indexOf('left: -300px;') > -1);
  });

  test('should change X position when progress changes (left menu)', async function (assert) {
    assert.expect(2);

    await render(hbs`<SideMenu />`);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('transform: translateX(0%)') > -1, '0%');

    this.set('sideMenu.defaultMenu.progress', 50);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('transform: translateX(50%)') > -1, '50%');
  });

  test('should change X position when progress changes (right menu)', async function (assert) {
    assert.expect(2);

    await render(hbs`<SideMenu @side="right" />`);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('transform: translateX(-0%)') > -1, '0%');

    this.set('sideMenu.defaultMenu.progress', 50);

    assert.ok(find('.side-menu').getAttribute('style').indexOf('transform: translateX(-50%)') > -1, '50%');
  });

  test('should initialize multiple menus, be able to change progress', async function (assert) {
    assert.expect(6);

    await render(hbs`
      <SideMenu @id="menu1" class="menu1" @side="right" @width="300px">
        Menu 1
      </SideMenu>
      <SideMenu @id="menu2" class="menu2" @side="left" @width="200px">
        Menu 2
      </SideMenu>
    `);

    const menu1 = find('.side-menu.menu1');
    const menu2 = find('.side-menu.menu2');

    assert.ok(menu1.getAttribute('style').indexOf('width: 300px;') > -1);
    assert.ok(menu1.getAttribute('style').indexOf('left: initial;') > -1);
    assert.ok(menu2.getAttribute('style').indexOf('width: 200px;') > -1);
    assert.ok(menu2.getAttribute('style').indexOf('right: initial;') > -1);

    this.set('sideMenu.menus.menu1.progress', 50);
    this.set('sideMenu.menus.menu2.progress', 20);

    assert.ok(menu1.getAttribute('style').indexOf('transform: translateX(-50%)') > -1, 'menu1 50%');
    assert.ok(menu2.getAttribute('style').indexOf('transform: translateX(20%)') > -1, 'menu2 20%');
  });

  test('rootNode should have class disable-scroll when menu is not closed', async function (assert) {
    assert.expect(2);

    await render(hbs`<SideMenu />`);

    assert.notOk(document.body.classList.contains('disable-scroll'), 'no disable-scroll class when closed');

    this.set('sideMenu.defaultMenu.progress', 50);

    await waitUntil(
      function () {
        return document.body.classList.contains('disable-scroll');
      },
      { timeout: 2000 }
    );
    assert.ok(document.body.classList.contains('disable-scroll'), 'disable-scroll class when not closed');
  });
});
