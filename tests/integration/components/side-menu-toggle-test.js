import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("side-menu-toggle", "Integration | Component | side menu toggle", {
    integration: true,

    beforeEach() {
        this.inject.service("side-menu", { as: "sideMenu" });
    },
});

test("it renders", function (assert) {
    this.render(hbs`{{side-menu-toggle}}`);

    assert.equal(this.$().text().trim(), "");
});

test("should change side", function (assert) {
    assert.expect(2);

    this.set("side", "left");
    this.render(hbs`{{side-menu-toggle side=side}}`);

    assert.ok(this.$(".side-menu-toggle").hasClass("left"), "left side");

    this.set("side", "right");

    assert.ok(this.$(".side-menu-toggle").hasClass("right"), "right side");
});

test("click should toggle menu", function (assert) {
    assert.expect(3);

    this.render(hbs`{{side-menu-toggle}}`);

    assert.ok(this.get("sideMenu.isClosed"), "initially closed");

    this.$(".side-menu-toggle").click();

    assert.ok(this.get("sideMenu.isOpen"), "after click is open");

    this.$(".side-menu-toggle").click();

    assert.ok(this.get("sideMenu.isClosed"), "another click closing");
});

test("click should not toggle menu open when disabled", function (assert) {
    assert.expect(3);

    this.render(hbs`{{side-menu-toggle}}`);

    assert.ok(this.get("sideMenu.isClosed"), "initially closed");

    this.set("sideMenu.disabled", true);
    this.$(".side-menu-toggle").click();

    assert.ok(this.get("sideMenu.isClosed"), "after click is still closed");

    this.set("sideMenu.disabled", false);
    this.$(".side-menu-toggle").click();

    assert.ok(this.get("sideMenu.isOpen"), "opens after enabling");
});
