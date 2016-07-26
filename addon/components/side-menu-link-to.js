import Ember from "ember";

const {
    get,
    inject: { service },
    LinkComponent,
} = Ember;

export default LinkComponent.extend({
    sideMenu: service(),

    click() {
        get(this, "sideMenu").close();
    },
});
