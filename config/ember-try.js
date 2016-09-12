/*jshint node:true*/
module.exports = {
    scenarios: [
        {
            name: "default",
            dependencies: { }
        },
        {
            name: "ember-2-4-lts",
            bower: {
                dependencies: {
                    "ember": "~2.4.0"
                },
                resolutions: {
                    "ember": "~2.4.0"
                }
            }
        },
        {
            name: "ember-release",
            dependencies: {
                "ember": "components/ember#release"
            },
            resolutions: {
                "ember": "release"
            }
        },
        {
            name: "ember-beta",
            dependencies: {
                "ember": "components/ember#beta"
            },
            resolutions: {
                "ember": "beta"
            }
        },
        {
            name: "ember-canary",
            dependencies: {
                "ember": "components/ember#canary"
            },
            resolutions: {
                "ember": "canary"
            }
        }
    ]
};
