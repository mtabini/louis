var util = require('util');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var Error = require('../error');

function Site(baseDir) {
    this.emit('willConstruct', this);
    
    this.baseDir = path.resolve(baseDir);
    this.config = {};
    
    if (!fs.existsSync(this.baseDir)) {
        throw new Error('The path `' + baseDir + '` does not exist.');
    }
    
    if (!fs.statSync(this.baseDir).isDirectory()) {
        throw new Error('The path `' + baseDir + '` does not point to a directory');
    }
    
    this.emit('didConstruct', this);
};

util.inherits(Site, EventEmitter);

require('./init')(Site);
require('./util')(Site);
require('./load')(Site);
require('./page')(Site);

module.exports = Site;