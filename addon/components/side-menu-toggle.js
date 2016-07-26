import Ember from "ember";

const {
    Component,
    get,
    inject: { service },
} = Ember;

export default Component.extend({
    sideMenu: service(),

    classNameBindings: ["side"],
    classNames: ["side-menu-toggle"],

    side: "left",

    click() {
        get(this, "sideMenu").toggle();
    },
});
