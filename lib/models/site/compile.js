var async = require('async');

function setupCompile(Site) {
    
    Site.prototype.renderPages = function renderSitePages(callback) {
        this.pageArchive.deploy(callback);
    };
    
    Site.prototype.renderPosts = function renderSitePosts(callback) {
        this.postArchive.deploy(callback);
    }
    
    Site.prototype.compile = function compileSite(callback) {
        var _this = this;
        
        async.parallel(
            [
                this.renderPages.bind(this),
                this.renderPosts.bind(this),
            ],
        
            function(err) {
                if (!err) {
                    _this.pageArchive.saveCache();
                    _this.postArchive.saveCache();
                }

                callback(err);
            }
        );
    }
    
}

module.exports = setupCompile;