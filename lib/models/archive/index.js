var util = require('util');

var EventEmitter = require('events').EventEmitter;

var Archive = function Archive(site, baseDir, type, force, callback) {
    this.emit('willConstruct', this);
    
    this.site = site;
    this.baseDir = site.path(baseDir);
    this.type = type;
    
    this.pages = {
        all: [],
        outdated: [],
        error: []
    };
    
    var _this = this;
    
    this.analyze(force, function(force, err) {
        _this.emit('didConstruct', _this, err);
        
        callback(err, _this);
    });
};

util.inherits(Archive, EventEmitter);

require('./util')(Archive);
require('./cache')(Archive);
require('./analyze')(Archive);
require('./deploy')(Archive);

module.exports = Archive;