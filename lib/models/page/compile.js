var fs = require('fs');
var path = require('path');
var mustache = require('mu2');
var humanize = require('humanize');
var moment = require('moment');
var async = require('async');
var markdown = require("multimarkdown");

function setupCompile(Page) {
    
    Page.prototype.compile = function compilePage(callback) {
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
                    fs.readFile(_this.path('document.md'), function(err, source) {
                        if (err) return callback(err);
                        
                        _this.content = markdown.convert(source.toString());
                        
                        callback(null, _this.content);
                    });
                },
                
                function compileTemplate(content, callback) {
                    var view = {
                        site: _this.site,
                        page: _this,
                        content: content
                    };
        
                    mustache.root = _this.site.path('/theme/templates');
                    var stream = mustache.compileAndRender(templatePath, view);
        
                    _this.compiled = '';
                    
                    var hadError = false;
        
                    stream.on('data', function(data) {
                        _this.compiled += data.toString();
                    });
                    
                    stream.on('error', function(err) {
                        hadError = true;
                        callback(err);
                    });
                
                    stream.on('end', function() {
                        if (!hadError) {
                            callback();
                        }
                    });
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