var path = require('path');

function setupUtils(Archive) {

    Archive.prototype.path = function archivePath(destination) {
        return path.resolve(path.join(this.baseDir, destination));
    };
    
    Archive.prototype.destinationPath = function archiveDestinationPath(destination) {
        return path.join(this.site.path('site'), 'archive', destination);
    };
    
}

module.exports = setupUtils;