var Hapi = require("hapi");
var lout = require("lout");

var pack = new Hapi.Pack();

var s1 = pack.server(8080, "0.0.0.0");
s1.route({
    path: "/server/{id}",
    method: "GET",
    handler: function(request, reply) {
        reply(request.params.id);
    }
});

var s2 = pack.server(8081, "0.0.0.0");

pack.register([
    { plugin: require("lout") },
    { plugin: require("./plugins/example12") }
], function(err) {
    if (err) throw err;
    pack.start(function(server) {
        console.log("Hapi pack started.");
    });
});