var async = require('async');
var rimraf = require('rimraf');
var async = require('async');
var fs = require('fs');
var path = require('path');

function setupDeploy(Archive) {
    
    Archive.prototype.deployPages = function deployArchivePages(callback) {
        var _this = this;
        var destinationDir = this.destinationPath('');
        
        if (!this.compiled) {
            return callback();
        }
        
        this.emit('willDeploy', this);
        
        async.series(
            [
                function wipeOldDirectory(callback) {
                    fs.exists(destinationDir, function(exists) {
                        if (exists) {
                            return rimraf(destinationDir, callback);
                        }
                        
                        callback();
                    });
                },
                
                function createDirectory(callback) {
                    fs.mkdir(destinationDir, callback);
                },
                
                function renderIndexPage(callback) {
                    if (_this.compiled.length > 0) {
                        fs.writeFile(_this.destinationPath('index.html'), _this.compiled[0].compiled, callback);
                    } else {
                        callback();
                    }
                },
                
                function renderAllPages(callback) {
                    async.each(
                        _this.compiled,
                        
                        function iterator(compiled, callback) {
                            fs.writeFile(_this.destinationPath(path.basename(compiled.link)), compiled.compiled, callback);
                        },
                        
                        callback
                    );
                }
            ],
            
            function(err) {
                _this.emit('didDeploy', this);
                
                callback(err);
            }
        );
    },
    
    Archive.prototype.deploy = function deployArchive(callback) {
        async.series(
            [
                function renderOutdatedPages(callback) {
                    async.each(
                        this.pages.outdated,
            
                        function iterator(page, callback) {
                            page.deploy(callback);
                        },
        
                        callback
                    );
                }.bind(this),
                
                this.deployPages.bind(this)
            ],
            
            callback
        );
    };
    
}

module.exports = setupDeploy;