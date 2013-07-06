var fs = require('fs');
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');
var ncp = require('ncp').ncp;
var colors = require('colors');

function setupDeploy(Page) {
    
    Page.prototype.deploymentPath = function pageDeploymentPath(pathName) {
        return path.join(this.site.path('site'), this.config.slug, pathName);
    };
    
    Page.prototype.deploy = function deployPage(callback) {
        var destinationDir = this.deploymentPath('');
        var _this = this;

        this.emit('willDeploy', this);
        
        async.series(
            [
                function emptyAndCreateDestinationDir(callback) {
                    
                    fs.exists(destinationDir, function(exists) {
                        if (exists) {
                            return rimraf(destinationDir, callback);
                        }
                        
                        callback();
                    });
                },
                
                function createDestinationDir(callback) {
                    fs.mkdir(destinationDir, callback);
                },
                
                function copyStaticFiles(callback) {
                    ncp(
                        _this.baseDir,
                        destinationDir,
                        
                        {
                            clobber: true,
                            filter: function(name) {
                                name = path.basename(name);
                                return (!name.match('^meta.yaml|' + _this.type.singular + '.md'));
                            }
                        },
                        
                        callback
                    );
                },
                
                function writeIndexFile(callback) {
                    fs.writeFile(_this.deploymentPath('index.html'), _this.compiled, callback);
                }
            ],
            
            function finalCallback(err) {
                _this.emit('didDeploy', this);
                
                callback(err);
            }
        );
    };
    
}

module.exports = setupDeploy;