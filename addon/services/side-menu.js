import Ember from "ember";

export default Ember.Service.extend({
    // progress 0-100 %
    progress: 0,
    isOpen: Ember.computed.equal("progress", 100),
    isClosed: Ember.computed.equal("progress", 0),
    isSlightlyOpen: false,

    close() {
        this.set("progress", 0);
        this.set("isSlightlyOpen", false);
    },

    open() {
        this.set("progress", 100);
        this.set("isSlightlyOpen", false);
    },

    toggle() {
        if (this.get("isOpen")) {
            this.close();
        } else {
            this.open();
        }
    },
});
