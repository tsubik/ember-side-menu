import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | side menu', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.sideMenu = this.owner.lookup('service:side-menu');
    this.sideMenu.create();
    this.sideMenu.create('menu');
  });

  test('it exists', function(assert) {
    const service = this.get('sideMenu');

    assert.ok(service);
  });

  test('default menu - close should close menu', function(assert) {
    assert.expect(2);

    const service = this.get('sideMenu');
    service.set('progress', 100);

    assert.ok(service.get('isOpen'));

    service.close();

    assert.ok(service.get('isClosed'));
  });

  test('menu - close should close menu', function(assert) {
    assert.expect(2);

    const service = this.get('sideMenu');
    service.set('menus.menu.progress', 100);

    assert.ok(service.get('menus.menu.isOpen'));

    service.close('menu');

    assert.ok(service.get('menus.menu.isClosed'));
  });

  test('default menu - open should open menu', function(assert) {
    assert.expect(2);

    const service = this.get('sideMenu');

    assert.ok(service.get('isClosed'));

    service.open();

    assert.ok(service.get('isOpen'));
  });

  test('menu - open should open menu', function(assert) {
    assert.expect(2);

    const service = this.get('sideMenu');

    assert.ok(service.get('menus.menu.isClosed'));

    service.open('menu');

    assert.ok(service.get('menus.menu.isOpen'));
  });

  test('default menu - toggle should toggle menu', function(assert) {
    assert.expect(3);

    const service = this.get('sideMenu');

    assert.ok(service.get('isClosed'));

    service.toggle();

    assert.ok(service.get('isOpen'));

    service.toggle();

    assert.ok(service.get('isClosed'));
  });

  test('menu - toggle should toggle menu', function(assert) {
    assert.expect(3);

    const service = this.get('sideMenu');

    assert.ok(service.get('menus.menu.isClosed'));

    service.toggle('menu');

    assert.ok(service.get('menus.menu.isOpen'));

    service.toggle('menu');

    assert.ok(service.get('menus.menu.isClosed'));
  });
});
