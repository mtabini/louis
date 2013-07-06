var mustache = require('mu2');

function setupCompile(IndexPage) {
    
    IndexPage.prototype.compile = function compileIndexPage(callback) {
        this.emit('willCompile', this);
    
        var view = {
            page: this,
            archive: this.site.postArchive.pages.all.slice(0, this.site.config.index.postCount),
        };

        mustache.root = this.site.path('/theme/templates');
        var stream = mustache.compileAndRender(this.site.config.templates.index, view);
    
        this.compiled = '';
    
        var _this = this;

        stream.on('data', function(data) {
            _this.compiled += data.toString();
        });

        stream.on('end', function() {
            _this.emit('didCompile', _this);
        
            callback();
        });
    };
    
}

module.exports = setupCompile;