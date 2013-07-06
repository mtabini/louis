var Page = require('../page');

function setupPage(Site) {
    
    Site.prototype.getDocument = function getSiteDocument(path, pageDir, type, callback) {
        new Page(this, path, pageDir, type, callback);
    };
    
    Site.prototype.getPage = function getSitePage(path, callback) {
        this.getDocument(
            path, 
            this.pagePath, 
            { 
                singular : 'page',
                plural : 'pages'
            },
            callback);
    };
    
    Site.prototype.getPost = function getSitePost(path, callback) {
        this.getDocument(
            path,
            this.postPath,
            {
                singular : 'post',
                plural : 'posts'
            },
            callback);
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