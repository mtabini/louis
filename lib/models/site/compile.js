var async = require('async');

function setupCompile(Site) {
    
    Site.prototype.renderPages = function renderSitePages(callback) {
        this.pageArchive.deploy(callback);
    };
    
    Site.prototype.renderPosts = function renderSitePosts(callback) {
        this.postArchive.deploy(callback);
    }
    
    Site.prototype.compile = function compileSite(callback) {
        async.parallel(
            [
                this.renderPages.bind(this),
                this.renderPosts.bind(this),
            ],
        
            callback
        );
    }
    
}

module.exports = setupCompile;