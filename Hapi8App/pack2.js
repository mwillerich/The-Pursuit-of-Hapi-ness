var Hapi = require("hapi");
var lout = require("lout");

var manifest = {
    servers: [
        { port: 8080 },
        { port: 8081 }
    ],
    plugins: {
        "lout": {},
        /*"./plugins/example": {
            route: "/my/custom/route"
        }*/
    }
}
Hapi.Pack.compose(manifest, function(err, pack) {
    pack.start(function() {
        console.log("Servers started");
    });
});