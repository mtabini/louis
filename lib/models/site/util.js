var path = require('path');

function setupUtils(Site) {

    Site.prototype.path = function sitePath(destination) {
        return path.resolve(path.join(this.baseDir, destination));
    };
    
}

module.exports = setupUtils;