require('js-yaml');

var fs = require('fs');
var async = require('async');

function setupLoad(Page) {
    
    Page.prototype.load = function loadPage(callback) {
        try {
            this.config = require(this.path('meta.yaml'));
        } catch (e) {
            return callback(e);
        }
        
        var _this = this;
        
        fs.readdir(this.baseDir, function(err, pathNames) {
            async.reduce(
                pathNames,
                
                new Date(-1),
                
                function iterator(memo, pathName, callback) {
                    fs.stat(pathName, function(err, stat) {
                        if (err) return callback(err);

                        callback(null, (stat.mtime > memo) ? stat.mtime : memo);
                    });
                },
                
                function finalCallback(err, result) {
                    _this.lastModifiedDate = result;
                    
                    callback(err);
                }
            );
        });
    }
    
}

module.exports = setupLoad;