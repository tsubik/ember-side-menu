import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("side-menu", "Integration | Component | side menu", {
    integration: true,

    beforeEach() {
        this.inject.service("side-menu", { as: "sideMenu" });
    },
});

test("it renders", function (assert) {
    assert.expect(2);

    this.render(hbs`{{side-menu}}`);

    assert.equal(this.$().text().trim(), "");

    this.render(hbs`
    {{#side-menu}}
      template block text
    {{/side-menu}}
  `);

    assert.equal(this.$().text().trim(), "template block text");
});

test("default side should be left and width 70%", function (assert) {
    assert.expect(2);

    this.render(hbs`{{side-menu}}`);

    assert.ok(this.$(".side-menu").attr("style").indexOf("width: 70%") > -1);
    assert.ok(this.$(".side-menu").attr("style").indexOf("right: initial; left: -70%") > -1);
});

test("should change side", function (assert) {
    assert.expect(1);

    this.render(hbs`{{side-menu side="right"}}`);

    assert.ok(this.$(".side-menu").attr("style").indexOf("left: initial; right: -70%") > -1);
});

test("should change width", function (assert) {
    assert.expect(2);

    this.render(hbs`{{side-menu width="300px"}}`);

    assert.ok(this.$(".side-menu").attr("style").indexOf("width: 300px;") > -1);
    assert.ok(this.$(".side-menu").attr("style").indexOf("left: -300px;") > -1);
});

test("should change X position when progress changes (left menu)", function (assert) {
    assert.expect(2);

    this.render(hbs`{{side-menu}}`);

    assert.ok(this.$(".side-menu").attr("style").indexOf("transform: translateX(0%)") > -1);

    this.set("sideMenu.progress", 50);

    assert.ok(this.$(".side-menu").attr("style").indexOf("transform: translateX(50%)") > -1);
});

test("should change X position when progress changes (right menu)", function (assert) {
    assert.expect(2);

    this.render(hbs`{{side-menu side="right"}}`);

    assert.ok(this.$(".side-menu").attr("style").indexOf("transform: translateX(0%)") > -1);

    this.set("sideMenu.progress", 50);

    assert.ok(this.$(".side-menu").attr("style").indexOf("transform: translateX(-50%)") > -1);
});
