import Ember from "ember";

const {
    computed,
    computed: { alias },
    inject: { service },
    get,
    set,
} = Ember;

export default Ember.Component.extend({
    sideMenu: service(),

    progress: alias("sideMenu.progress"),

    attributeBindings: ["style"],
    classNames: ["content-backdrop"],

    style: computed("progress", function () {
        const progress = this.get("progress");
        const opacity = progress / 100;
        const visibility = progress === 0 ? "hidden" : "visible";
        let transition = "none";

        if (progress === 100) {
            transition = "opacity 0.2s ease-out";
        } else if (progress === 0) {
            transition = "visibility 0s linear 0.2s, opacity 0.2s ease-out";
        }

        return new Ember.Handlebars.SafeString(
            `opacity: ${opacity}; visibility: ${visibility}; transition: ${transition}`
        );
    }),

    click() {
        this.get("sideMenu").close();
    },
});
