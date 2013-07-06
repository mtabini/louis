var fs = require('fs');
var path = require('path');
var mustache = require('mu2');
var humanize = require('humanize');
var moment = require('moment');
var async = require('async');
var markdown = require("multimarkdown");

function setupCompile(Page) {
    
    Page.prototype.compile = function compilePage(previous, next, callback) {
        var templatePath;
        
        if (this.config.template === '<default>') {
            templatePath = this.site.config.templates[this.type.singular] || (this.type.singular + 'html');
        } else {
            templatePath = this.config.template;
        }
        
        var _this = this;
        
        this.emit('willCompile', this);
        
        async.waterfall(
            [
                function compileMarkdown(callback) {
                    fs.readFile(_this.path(_this.type.singular + '.md'), function(err, source) {
                        if (err) return callback(err);
                        
                        callback(null, markdown.convert(source.toString()));
                    });
                },
                
                function compileTemplate(content, callback) {
                    var view = {
                        page: _this,
                        content: content,
                        previous: previous,
                        next: next
                    };
        
                    mustache.root = _this.site.path('/theme/templates');
                    var stream = mustache.compileAndRender(templatePath, view);
        
                    _this.compiled = '';
        
                    stream.on('data', function(data) {
                        _this.compiled += data.toString();
                    });
                
                    stream.on('end', callback);
                }
            
            ],
            
            function(err) {
                _this.emit('didCompile', this);
                
                callback(err);
            }
        )



    };
    
}

module.exports = setupCompile;