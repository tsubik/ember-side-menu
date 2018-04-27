import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

module("Unit | Service | side menu", function(hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
      const service = this.owner.lookup("service:side-menu");

      assert.ok(service);
  });

  test("close should close menu", function (assert) {
      assert.expect(2);

      const service = this.owner.lookup("service:side-menu");
      service.set("progress", 100);

      assert.ok(service.get("isOpen"));

      service.close();

      assert.ok(service.get("isClosed"));
  });

  test("open should open menu", function (assert) {
      assert.expect(2);

      const service = this.owner.lookup("service:side-menu");

      assert.ok(service.get("isClosed"));

      service.open();

      assert.ok(service.get("isOpen"));
  });

  test("toggle should toggle menu", function (assert) {
      assert.expect(3);

      const service = this.owner.lookup("service:side-menu");

      assert.ok(service.get("isClosed"));

      service.toggle();

      assert.ok(service.get("isOpen"));

      service.toggle();

      assert.ok(service.get("isClosed"));
  });
});
