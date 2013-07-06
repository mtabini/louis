var path = require('path');

function setupUtils(Site) {

    Site.prototype.path = function sitePath(destination) {
        return path.resolve(path.join(this.baseDir, destination));
    };
    
    Object.defineProperty(
        
        Site.prototype,
        
        'pagePath',
        
        {
            enumerable: true,
            configurable: true,
            
            get: function getSitePagePath() {
                return this.path('pages');
            }
        }
        
    );
    
    Object.defineProperty(
        
        Site.prototype,
        
        'postPath',
        
        {
            enumerable: true,
            configurable: true,
            
            get: function getSitePagePath() {
                return this.path('posts');
            }
        }
        
    );
    
    Site.prototype.documentTypeFromPath = function siteDocumentTypeFromPath(pathName) {
        if (path.relative(pathName, this.pagePath) == '..') {
            return 'page';
        }
        
        if (path.relative(pathName, this.postPath) == '..') {
            return 'post';
        }
    }
    
}

module.exports = setupUtils;