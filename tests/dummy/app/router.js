/* eslint array-callback-return:0 */

import Ember from "ember";
import config from "./config/environment";

const Router = Ember.Router.extend({
    location: config.locationType,
});

Router.map(function () {

});

export default Router;
