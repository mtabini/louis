var async = require('async');
var colors = require('colors');

var IndexPage = require('../indexPage');

function setupCompile(Site) {
    
    Site.prototype.renderPages = function renderSitePages(callback) {
        this.pageArchive.deploy(callback);
    };
    
    Site.prototype.renderPosts = function renderSitePosts(callback) {
        this.postArchive.deploy(callback);
    };
    
    Site.prototype.renderSpecials = function renderSpecials(callback) {
        this.indexPage.deploy(callback);
    };
    
    Site.prototype.compile = function compileSite(callback) {
        var _this = this;
        
        this.emit('willCompile', this);
        
        async.parallel(
            [
                this.renderPages.bind(this),
                this.renderPosts.bind(this),
                this.renderSpecials.bind(this),
            ],
        
            function(err) {
                if (!err) {
                    _this.pageArchive.saveCache();
                    _this.postArchive.saveCache();
                }

                _this.emit('didCompile', this);
        
                callback(err);
            }
        );
    }
    
}

module.exports = setupCompile;