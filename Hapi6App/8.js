var Hapi = require("hapi");
var Joi = require("joi");
var server = new Hapi.Server(8080, "0.0.0.0", {
    cache: {
        engine: require("catbox-redis"),
        options: {
            host: "localhost",
            partition: "MyApp",
            password: "mypassword"
        }
    },
    views: {
        engines: {
            jade: require("jade")
        },
        path: "./views"
    }
});

server.method("getColour", function(name, next) {
    var colours = ["red", "blue", "indigo", "violet", "green"];
    var colour = colours[Math.floor(Math.random() * colours.length)];
    next(null, colour);
}, {
    cache: {
        expiresIn: 30000,
    }
});

var helloConfig = {
    handler: function(request, reply) {
	    var names = request.params.name.split("/");
	    server.methods.getColour(request.params.name, function(err, colour) {
	        reply.view("hello8", {
	            first: names[0],
	            last: names[1],
	            mood: request.query.mood,
	            age: request.query.age,
	            colour: colour
	        });
	    });
	},
    validate: {
        params: {
            name: Joi.string().min(8).max(100)
        },
        query: {
            mood: Joi.string().valid(["neutral","happy","sad"]).default("neutral"),
            age: Joi.number().integer().min(13).max(100)
        }
    }
};

server.route({
    path: "/",
    method: "GET",
    handler: function(request, reply) {
        reply("Hello, world!");
    }
});

server.route({
    path: "/hello/{name*2}",
    method: "GET",
    config: helloConfig
});

server.route({
    path: "/static/{path*}",
    method: "GET",
    handler: {
        directory: {
            path: "./public",
            listing: false,
            index: false
        }
    }
});

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});