var util = require('util');
var fs = require('fs');
var path = require('path');

var EventEmitter = require('events').EventEmitter;
var Error = require('../error');
var IndexPage = require('../indexPage');

function Site(baseDir) {
    this.emit('willConstruct', this);
    
    this.baseDir = path.resolve(baseDir);
    this.config = {};
    
    this.pageArchive = null;
    this.postArchive = null;
    
    this.indexPage = new IndexPage(this);
    
    this.indexPage.on('willCompile', this.emitWillCompile.bind(this));
    this.indexPage.on('didCompile', this.emitDidCompile.bind(this));
    this.indexPage.on('willDeploy', this.emitWillDeploy.bind(this));
    this.indexPage.on('didDeploy', this.emitDidDeploy.bind(this));
    
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
require('./analyze')(Site);
require('./compile')(Site);
require('./events')(Site);

module.exports = Site;