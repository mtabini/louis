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
        var _this = this;
        
        async.parallel(
            [
                function(callback) {
                    _this.indexPage.deploy(callback);
                },
                function(callback) {
                    _this.emit('willDeployFeed');
                    
                    _this.feed.deploy(function(err) {
                        _this.emit('didDeployFeed');
                        
                        callback(err);
                    });
                }
            ],
        
            callback
        );
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