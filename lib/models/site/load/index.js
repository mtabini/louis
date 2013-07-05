require('js-yaml');

var fs = require('fs');
var path = require('path');

var Error = require('../../error');

function setupLoad(Site) {
    
    function locateConfig() {
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
    }
    
    
    Site.prototype.load = function loadSite() {
        
        locateConfig.call(this);
        
    }
    
}

module.exports = setupLoad;