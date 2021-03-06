var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');

var EventEmitter = require('events').EventEmitter;
var Error = require('../error');

var Page = function Page(site, baseDir, pageDir, type, callback) {
    this.emit('willConstruct', this);
    
    this.site = site;
    this.baseDir = path.resolve(baseDir);
    
    this.config = {};
    this.dirty = false;
    this.lastModifiedDate = null;
    this.type = type;
    
    async.parallel(
        [
            function checkForDirectory(callback) {
                fs.stat(this.baseDir, function(err, stat) {
                    if (err) return callback(err);
                    
                    if (!stat.isDirectory()) {
                        console.log(new Error().stack);
                        return callback(new Error('A ' + type.singular + ' can only be initialized in a directory.'));
                    }
                    
                    callback();
                });
            }.bind(this),
            
            function checkForPath(callback) {
                if (path.relative(this.baseDir, pageDir) != '..') {
                    return callback(new Error('You can only initialize a ' + type.singular + ' in the `' + pageDir + '` directory.'));
                }
                
                callback();
            }.bind(this)
        ],
        
        function finalCallback(err) {
            this.emit('didConstruct', this, err);
            
            callback(err, this);
        }.bind(this)
    );
};

util.inherits(Page, EventEmitter);

require('./util')(Page);
require('./init')(Page);
require('./load')(Page);
require('./template')(Page);
require('./compile')(Page);
require('./deploy')(Page);

module.exports = Page;