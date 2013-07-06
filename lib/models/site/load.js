require('js-yaml');

var fs = require('fs');
var path = require('path');
var async = require('async');

var Archive = require('../archive');
var Error = require('../error');

function setupLoad(Site) {
    
    Site.prototype.load = function loadSite() {
        
        var pathPieces = this.baseDir.split(path.sep);
        var currentPath;
        
        while(pathPieces.length) {
            currentPath = path.join(pathPieces.join(path.sep), 'config.yaml');
            
            if (fs.existsSync(currentPath)) {
                this.baseDir = path.dirname(currentPath);
                break;
            }
            
            pathPieces.pop();
        }
        
        var configFile = this.path('config.yaml');
        
        if (!fs.existsSync(configFile)) {
            throw new Error('Unable to locate `config.yaml` file anywhere in the current path hierarchy. Are you sure you\'re in the right place?');
        }
        
        try {
            this.config = require(configFile);
        } catch (e) {
            throw new Error('Error in `' + configFile + '` file: ' + e.message);
        }
        
    };
    
    Site.prototype.loadArchives = function loadArchives(force, callback) {
        var _this = this;
        
        async.parallel(
            [
                function(callback) {
                    _this.pageArchive = new Archive(
                        _this, 
                        
                        'pages', 
                        
                        {
                            singular: 'page',
                            plural: 'pages'
                        }
                    );

                    _this.pageArchive.on('willCompilePage', _this.emitWillCompile.bind(_this));
                    _this.pageArchive.on('didCompilePage', _this.emitDidCompile.bind(_this));
                    _this.pageArchive.on('willDeployPage', _this.emitWillDeploy.bind(_this));
                    _this.pageArchive.on('didDeployPage', _this.emitDidDeploy.bind(_this));
                    
                    _this.pageArchive.analyze(force, callback);
                },
                
                function(callback) {
                    _this.postArchive = new Archive(
                        _this, 
                        
                        'posts', 
                        
                        {
                            singular: 'post',
                            plural: 'posts'
                        }
                    );
                    
                    _this.postArchive.on('willCompilePage', _this.emitWillCompile.bind(_this));
                    _this.postArchive.on('didCompilePage', _this.emitDidCompile.bind(_this));
                    _this.postArchive.on('willDeployPage', _this.emitWillDeploy.bind(_this));
                    _this.postArchive.on('didDeployPage', _this.emitDidDeploy.bind(_this));
                    
                    _this.postArchive.on('willCompile', _this.emitWillCompileArchive.bind(_this));
                    _this.postArchive.on('didCompile', _this.emitDidCompileArchive.bind(_this));
                    _this.postArchive.on('willDeploy', _this.emitWillDeployArchive.bind(_this));
                    _this.postArchive.on('didDeploy', _this.emitDidDeployArchive.bind(_this));
                    
                    _this.postArchive.analyze(force, callback);
                }
            ],
            
            function(err) {
                callback(err);
            }
        )
    };
    
}

module.exports = setupLoad;