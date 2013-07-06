var util = require('util');

var EventEmitter = require('events').EventEmitter;
var Error = require('../error');

var mustache = require('mu2');


var IndexPage = function IndexPage(site) {
    this.emit('willConstruct', this);
    
    this.site = site;
    
    this.emit('didConstruct', this);
};

util.inherits(IndexPage, EventEmitter);

require('./util')(IndexPage);
require('./compile')(IndexPage);
require('./deploy')(IndexPage);

module.exports = IndexPage;
