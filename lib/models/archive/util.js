var path = require('path');

function setupUtils(Archive) {

    Archive.prototype.path = function sitePath(destination) {
        return path.resolve(path.join(this.baseDir, destination));
    }
    
}

module.exports = setupUtils;