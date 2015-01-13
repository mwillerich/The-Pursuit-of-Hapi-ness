var Hapi = require("hapi");
var Joi = require("joi");

var server = new Hapi.Server({
    cache: {
        engine: require("catbox-redis"),
        options: {
            host: "localhost",
            partition: "MyApp",
            password: "mypassword"
        }
    },
    debug: {
        request: ["received"]
    }
});
server.connection({
    port: 8080
});
server.views({
    engines: {
        jade: require("jade")
    },
    path: "./views"
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

server.route({
    path: "/log/{data}",
    method: "GET",
    handler: function(request, reply) {
        request.log(["pathData"]);
        reply("Logged " + request.params.data);
    }
});

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});

server.on("request", function(request, event, tags) {
    if (tags.pathData) {
        console.log("Logging pathData: " + request.params.data);
    }
});

server.on("log", function(event, tags) {
    var tagsJoined = Object.keys(tags).join();
    var message = event.data;
    console.log("Log entry [" + tagsJoined + "] (" + (message || "") + ")");
});