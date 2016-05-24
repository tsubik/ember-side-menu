import Ember from "ember";
import layout from "../templates/components/side-button";

export default Ember.Component.extend({
    layout,

    tagName: "a",

    classNames: ["side-button"],
    classNameBindings: ["isActive:active", "side"],

    isActive: Ember.computed("side", "actualSide", function () {
        return this.get("side") === this.get("actualSide");
    }),

    click() {
        this.set("actualSide", this.get("side"));
    }
});
