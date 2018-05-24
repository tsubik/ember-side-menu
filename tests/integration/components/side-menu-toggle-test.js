import { click, find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | side menu toggle", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
      this.sideMenu = this.owner.lookup('service:side-menu');
  });

  test("it renders", async function(assert) {
      await render(hbs`{{side-menu-toggle}}`);

      assert.equal(find('*').textContent.trim(), "");
  });

  test("should change side", async function(assert) {
      assert.expect(2);

      this.set("side", "left");
      await render(hbs`{{side-menu-toggle side=side}}`);

      assert.ok(find(".side-menu-toggle").classList.contains("left"), "left side");

      this.set("side", "right");

      assert.ok(find(".side-menu-toggle").classList.contains("right"), "right side");
  });

  test("click should toggle menu", async function(assert) {
      assert.expect(3);

      await render(hbs`{{side-menu-toggle}}`);

      assert.ok(this.get("sideMenu.isClosed"), "initially closed");

      await click(".side-menu-toggle");

      assert.ok(this.get("sideMenu.isOpen"), "after click is open");

      await click(".side-menu-toggle");

      assert.ok(this.get("sideMenu.isClosed"), "another click closing");
  });
});
