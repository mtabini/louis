var mustache = require('mu2');

function setupCompile(IndexPage) {
    
    IndexPage.prototype.compile = function compileIndexPage(callback) {
        this.emit('willCompile', this);
        
        var view = {
            site: this.site,
            page: this,
            posts: this.site.postArchive.pages.all.slice(0, this.site.config.index.postCount),
            archive: this.site.postArchive.sectionPointers
        };

        mustache.root = this.site.path('/theme/templates');
        var stream = mustache.compileAndRender(this.site.config.templates.index, view);
    
        this.compiled = '';
    
        var _this = this;
        var hadError = false;

        stream.on('data', function(data) {
            _this.compiled += data.toString();
        });
        
        stream.on('error', function(err) {
            hadError = true;
            callback(err);
        });

        stream.on('end', function() {
            _this.emit('didCompile', _this);
        
            if (!hadError) {
                callback();
            }
        });
    };
    
}

module.exports = setupCompile;