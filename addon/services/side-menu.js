import Ember from "ember";

const {
    computed: { equal, reads, not },
    computed,
    get,
    set,
    Service,
} = Ember;

export default Service.extend({
    // progress 0-100 %
    progress: 0,
    isOpen: equal("progress", 100),
    isClosed: equal("progress", 0),
    isDisabled: reads("disabled"),
    isEnabled: not("disabled"),
    isSlightlyOpen: false,
    disabled: computed({
        get() {
            return false;
        },
        set(_key, value) {
            if (value) { this.close(); }
            return value;
        },
    }),

    close() {
        set(this, "progress", 0);
        set(this, "isSlightlyOpen", false);
    },

    open() {
        if (get(this, "disabled")) { return; }
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

    disable() {
        set(this, "disabled", true);
    },

    enable() {
        set(this, "disabled", false);
    },
});
