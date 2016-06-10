import { moduleFor, test } from "ember-qunit";

moduleFor("service:side-menu", "Unit | Service | side menu", {
});

test("it exists", function (assert) {
    const service = this.subject();

    assert.ok(service);
});

test("close should close menu", function (assert) {
    assert.expect(2);

    const service = this.subject();
    service.set("progress", 100);

    assert.ok(service.get("isOpen"));

    service.close();

    assert.ok(service.get("isClosed"));
});

test("open should open menu", function (assert) {
    assert.expect(2);

    const service = this.subject();

    assert.ok(service.get("isClosed"));

    service.open();

    assert.ok(service.get("isOpen"));
});

test("toggle should toggle menu", function (assert) {
    assert.expect(3);

    const service = this.subject();

    assert.ok(service.get("isClosed"));

    service.toggle();

    assert.ok(service.get("isOpen"));

    service.toggle();

    assert.ok(service.get("isClosed"));
});
