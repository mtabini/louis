var fs = require('fs');
var path = require('path');
var async = require('async');

var colors = require('colors');
var moment = require('moment');
var humanize = require('humanize');

var Page = require('../page');

function setupAnalyze(Archive) {
    
    Archive.prototype.analyze = function analyzeArchive(callback) {
        var _this = this;
        
        async.waterfall(
            [
                function readAllPaths(callback) {
                    fs.readdir(_this.baseDir, callback)
                },
                
                function filterAndDiscoverPages(paths, callback) {
                    async.reduce(
                        paths,
                        
                        [],
                        
                        function iterator(result, pathName, callback) {
                            var fullPath = _this.path(pathName);

                            async.waterfall(
                                [
                                    function createPage(callback) {
                                        Page.isPage(fullPath, function (isPage) {
                                            if (!isPage) return callback(null, false);
                                
                                            _this.site.getDocument(fullPath, _this.baseDir, _this.type, callback);
                                        });
                                    },
                                    
                                    function loadPage(page, callback) {
                                        if (!page) return callback(null, false);
                                        
                                        page.load(function(err) {
                                            callback(err, page);
                                        });
                                    },
                                
                                    function commitPage(page, callback) {
                                        if (page) {
                                            result.push(page);
                                        }
                                        
                                        callback();
                                    }
                                ],
                                
                                function finalCallback(err) {
                                    callback(err, result);
                                }                                
                            );
                        },
                        
                        callback
                    );
                }
            
            ],
            
            function finalCallback(err, result) {
                result.sort(function(left, right) { return right.lastModifiedDate.getTime() - left.lastModifiedDate.getTime() });
                
                _this.pages.all = result;
                
                _this.loadCache();

                _this.pages.outdated = _this.pages.all.filter(function(page) {
                    return (!_this.cache[page.baseDir] || _this.cache[page.baseDir] < page.lastModifiedDate);
                });
                
                callback(err);
            }
        );
    };
    
    Archive.prototype.printAnalysis = function describeArchiveAnalysis() {
        var msg;
        
        switch(this.pages.all.length) {
            case 0:
                msg = '    - Your site does not have any ' + this.type.plural + '.';
                
                break;
                
            case 1:
                msg = '    - Your site has one ' + this.type.singular;
                
                if (this.pages.outdated.count) {
                    msg += ', and it needs to be compiled.';
                } else {
                    msg += '.';
                }
                
                break;
                
            default:
                msg = '    - Your site has ' + humanize.numberFormat(this.pages.all.length, 0) + ' ' + this.type.plural;
                
                switch(this.pages.outdated.length) {
                    case 0:
                        msg += '.';
                        
                        break;
                        
                    case 1:
                        msg += '; one needs to be compiled.';
                        
                        break;
                        
                    default:
                        msg += '; ' + humanize.numberFormat(this.pages.outdated.length, 0) + ' need to be compiled.';
                        
                        break;
                }
        }

        console.log(msg.green);
    }
    
}

module.exports = setupAnalyze;