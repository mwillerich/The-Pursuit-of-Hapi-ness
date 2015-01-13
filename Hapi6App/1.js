var Hapi = require("hapi");
var server = new Hapi.Server(8080, "0.0.0.0");
server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});