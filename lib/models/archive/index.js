var util = require('util');

var EventEmitter = require('events').EventEmitter;

var Archive = function Archive(site, baseDir, type) {
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
    
    this.emit('didConstruct', this);
};

util.inherits(Archive, EventEmitter);

require('./util')(Archive);
require('./cache')(Archive);
require('./analyze')(Archive);
require('./deploy')(Archive);
require('./events')(Archive);

module.exports = Archive;