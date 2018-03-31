import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("content-backdrop", "Integration | Component | content backdrop", {
    integration: true,

    beforeEach() {
        this.inject.service("side-menu", { as: "sideMenu" });
    }
});

test("it renders", function (assert) {
    this.render(hbs`{{content-backdrop}}`);

    assert.equal(this.$().text().trim(), "");
});

test("should not be visible if menu is closed", function (assert) {
    assert.expect(1);

    this.render(hbs`{{content-backdrop}}`);

    assert.ok(this.$(".content-backdrop").attr("style").indexOf("visibility: hidden") > -1);
});

test("should be visible if menu is open", function (assert) {
    assert.expect(1);

    this.set("sideMenu.progress", 100);
    this.render(hbs`{{content-backdrop}}`);

    assert.ok(this.$(".content-backdrop").attr("style").indexOf("visibility: visible") > -1);
});

test("should have opacity depended on menu opening progress", function (assert) {
    assert.expect(2);

    this.set("sideMenu.progress", 40);
    this.render(hbs`{{content-backdrop}}`);

    assert.ok(
        this.$(".content-backdrop").attr("style").indexOf("opacity: 0.4") > -1, "opacity 0.4"
    );

    this.set("sideMenu.progress", 70);
    assert.ok(
        this.$(".content-backdrop").attr("style").indexOf("opacity: 0.7") > -1, "opacity 0.7"
    );
});
