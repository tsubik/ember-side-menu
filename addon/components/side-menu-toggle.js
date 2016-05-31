import Ember from "ember";

export default Ember.Component.extend({
    sideMenu: Ember.inject.service(),

    classNameBindings: ["side"],
    classNames: ["side-menu-toggle"],

    side: "left",

    click() {
        this.get("sideMenu").toggle();
    },
});
