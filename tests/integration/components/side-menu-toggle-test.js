import { click, find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | side menu toggle', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.sideMenu = this.owner.lookup('service:side-menu');
  });

  test('it renders', async function (assert) {
    await render(hbs`<SideMenuToggle />`);

    assert.equal(find('*').textContent.trim(), '');
  });

  test('default menu - should change side', async function (assert) {
    assert.expect(2);

    this.set('side', 'left');
    await render(hbs`<SideMenuToggle @side={{this.side}} />`);

    assert.ok(find('.side-menu-toggle').classList.contains('left'), 'left side');

    this.set('side', 'right');

    assert.ok(find('.side-menu-toggle').classList.contains('right'), 'right side');
  });

  test('default menu click should toggle menu', async function (assert) {
    assert.expect(3);

    await render(hbs`<SideMenuToggle />`);

    assert.ok(this.sideMenu.isClosed, 'initially closed');

    await click('.side-menu-toggle');

    assert.ok(this.sideMenu.isOpen, 'after click is open');

    await click('.side-menu-toggle');

    assert.ok(this.sideMenu.isClosed, 'another click closing');
  });

  test('named menu - click should toggle menu', async function (assert) {
    assert.expect(6);

    this.set('side', 'left');
    await render(hbs`
      <SideMenu @id="menu1">
        Menu 1
      </SideMenu>
      <SideMenu @id="menu2">
        Menu 2
      </SideMenu>
      <SideMenuToggle @side={{this.side}} @menuId="menu1" class="menu1" />
      <SideMenuToggle @side="left" @menuId="menu2" class="menu2" />
    `);

    assert.ok(this.sideMenu.menus.menu1.isClosed, 'menu1 initially closed');
    assert.ok(this.sideMenu.menus.menu2.isClosed, 'menu2 initially closed');

    await click('.side-menu-toggle.menu1');

    assert.ok(this.sideMenu.menus.menu1.isOpen, 'menu1 after click is open');
    assert.ok(this.sideMenu.menus.menu2.isClosed, 'menu2 is still closed');

    await click('.side-menu-toggle.menu1');

    assert.ok(this.sideMenu.menus.menu1.isClosed, 'menu1 after second click is closed');
    assert.ok(this.sideMenu.menus.menu2.isClosed, 'menu2 is still closed');
  });
});
