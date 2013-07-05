var Page = require('../../page');

function setupPage(Site) {
    
    Site.prototype.getPage = function getSitePage(path, callback) {
        new Page(this, path, callback);
    };
    
    Object.defineProperty(
        
        Site.prototype,
        
        'pageDir',
        
        {
            enumerable: true,
            configurable: true,
            
            get: function getPageDir() {
                return this.path('pages');
            }
        }
        
    );
    
}

module.exports = setupPage;