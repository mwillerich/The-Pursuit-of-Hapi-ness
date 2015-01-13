var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 8080 });

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});