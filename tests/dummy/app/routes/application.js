import Ember from "ember";

export default Ember.Route.extend({
    model() {
        return {
            options: [
                { id: "slide", text: "Slide" },
            ],
        };
    },

    setupController(controller, model) {
        this._super(...arguments);
        this.controller.set("activeOption", model.options[0]);
    },

    actions: {
        changeMenu(option) {
            const controller = this.controllerFor("application");
            controller.set("activeOption", option);
        },
    },
});
