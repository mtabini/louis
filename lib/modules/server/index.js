var colors = require('colors');
var express = require('express');

var Server = function(site) {
    this.app = express();
    this.site = site;
    
    this.lockedResources = [];
    this.watchQueue = {};

    this.app.use(express.static(this.site.path('site')));
};

Server.prototype.start = function startServer() {
    var port;
    
    if (this.site.config.server) {
        port = this.site.config.server.port || 8000;
    } else {
        port = 8000;
    }
    
    this.app.listen(port, function() {
        console.log(('Listening on port ' + port).green);
        console.log('Hit Control+C to exit.'.yellow);
    });
    
    this.watch();
}

require('./watch')(Server);

module.exports = Server;