var moment = require('moment');
var async = require('async');
var mustache = require('mu2');

function setupCompile(Archive) {
    
    Archive.prototype.compilePages = function compileArchivePages(callback) {
        mustache.root = this.site.path('theme/templates');
        
        var _this = this;
        
        async.map(
            this.sectionPointers,
            
            function mapper(section, callback) {
                var index = _this.sectionPointers.indexOf(section);
                var prev, next;
                
                if (index > 0) {
                    prev = _this.sectionPointers[index - 1];
                }
                
                if (index < _this.sectionPointers.length - 1) {
                    next = _this.sectionPointers[index + 1];
                }
                
                var stream = mustache.compileAndRender(
                    _this.site.config.templates.archive,
                    {
                        site: _this.site,
                        archive: section,
                        prev: prev,
                        next: next
                    }
                );
                
                var result = '';
                var hadError = false;
                
                stream.on('data', function(data) {
                    result += data.toString();
                });
                
                stream.on('error', function(err) {
                    hadError = true;
                    callback(err);
                });
                
                stream.on('end', function() {
                    if (!hadError) {
                        callback(
                            null,
                            {
                                link: section.link,
                                compiled: result
                            }
                        );
                    }
                });
            },
            
            function finalCallback(err, result) {
                _this.compiled = result;
                
                callback(err);
            }
        );
    };
    
    Archive.prototype.compile = function compileArchive(callback) {
        this.emit('willCompile', this);
        
        this.sections = this.pages.all.reduce(function(result, page) {
            var year = page.lastModifiedDate.getFullYear();
            var month = page.lastModifiedDate.getMonth();
        
            if (!result[year]) {
                result[year] = {};
            }
            
            if (!result[year][month]) {
                result[year][month] = [];
            }
        
            result[year][month].push(page);
            
            return result;
        }, {});
        
        this.sectionPointers = [];
        
        Object.keys(this.sections).forEach(function(year) {
            Object.keys(this.sections[year]).forEach(function(month) {
                var date = moment(new Date(year, month, 1));
                
                this.sectionPointers.push({
                    title: date.format('MMM YYYY'),
                    longTitle: date.format('MMMM YYYY'),
                    link: '/archive/' + year + '-' + month + '.html',
                    pages: this.sections[year][month]
                });
            }, this);
        }, this);

        this.compilePages(function(err) {
            this.emit('didCompile', this);
            
            callback(err);
        }.bind(this));
        
        
    }
    
}

module.exports = setupCompile;