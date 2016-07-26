import Ember from "ember";

const {
    computed: { equal },
    get,
    set,
    Service,
} = Ember;

export default Service.extend({
    // progress 0-100 %
    progress: 0,
    isOpen: equal("progress", 100),
    isClosed: equal("progress", 0),
    isSlightlyOpen: false,

    close() {
        set(this, "progress", 0);
        set(this, "isSlightlyOpen", false);
    },

    open() {
        set(this, "progress", 100);
        set(this, "isSlightlyOpen", false);
    },

    toggle() {
        if (get(this, "isOpen")) {
            this.close();
        } else {
            this.open();
        }
    },
});
