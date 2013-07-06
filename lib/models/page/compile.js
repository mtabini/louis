var fs = require('fs');
var path = require('path');
var mustache = require('mu2');
var humanize = require('humanize');
var moment = require('moment');

function setupCompile(Page) {
    
    Page.prototype.compile = function compilePage(previous, next, callback) {
        var templatePath;
        
        if (this.config.template === '<default>') {
            templatePath = this.site.config.templates[this.type.singular] || (this.type.singular + 'html');
        } else {
            templatePath = this.config.template;
        }
        
        var _this = this;

        fs.readFile(this.site.path(path.join('theme', 'templates', templatePath)), function(err, template) {
            if (err) return callback(err);
            
            var view = {
                page: _this,
                previous: previous,
                next: next
            };
            
            mustache.root = _this.site.path('/theme/templates');
            var stream = mustache.compileAndRender(templatePath, view);
            
            _this.compiled = '';
            
            stream.on('data', function(data) {
                _this.compiled += data.toString();
            });
            
            stream.on('error', function(err) {
                callback(err);
            });
            
            stream.on('end', callback);
            
        });

    };
    
}

module.exports = setupCompile;