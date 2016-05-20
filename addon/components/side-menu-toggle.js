import Ember from "ember";

export default Ember.Component.extend({
    sideMenu: Ember.inject.service(),

    classNames: ["side-menu-toggle"],

    click() {
        this.get("sideMenu").toggle();
    },
});
