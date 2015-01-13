var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 8080 });

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
    handler: function(request, reply) {
        var names = request.params.name.split("/");
        reply({
            first: names[0],
            last: names[1],
            mood: request.query.mood || "neutral"
        });
    }
});

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});