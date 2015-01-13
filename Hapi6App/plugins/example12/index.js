var Hoek = require("hoek");
var defaults = {
    route: "/my/plugin"
};

exports.register = function(plugin, options, next) {
    options = Hoek.applyToDefaults(defaults, options);

    plugin.route({
        path: options.route,
        method: "GET",
        handler: function(request, reply) {
            reply("This is a reply from a route defined in my plugin!");
        }
    });
    next();
};

exports.register.attributes = {
    pkg: require("./package.json")
};