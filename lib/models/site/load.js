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
    
    Site.prototype.loadArchives = function loadArchives(callback) {
        var _this = this;
        
        async.parallel(
            [
                function(callback) {
                    new Archive(
                        _this, 
                        
                        'pages', 
                        
                        {
                            singular: 'page',
                            plural: 'pages'
                        },
                        
                        function(err, archive) {
                            _this.pageArchive = archive;

                            callback(err);
                        }
                    );
                },
                
                function(callback) {
                    new Archive(
                        _this, 
                        
                        'posts', 
                        
                        {
                            singular: 'post',
                            plural: 'posts'
                        },
                        
                        function(err, archive) {
                            _this.postArchive = archive;
                            
                            callback(err);
                        }
                    );
                }
            ],
            
            callback
        )
    };
    
}

module.exports = setupLoad;