var colors = require('colors');
var async = require('async');
var path = require('path');
var mime = require('mime');
var http = require('http');

var Error = require('../../models/error');

function setupTransfer(Deployer) {
    
    Deployer.prototype.transfer = function transferSite(actions, callback) {
        var _this = this;
        
        async.series(
            [
                function enableSite(callback) {
                    console.log('    - Enabling website...'.green);
                    
                    _this.fortknox.createWebSite(function(err, res) {
                        if (err) return callback(err);
                        
                        if (res.statusCode > 399) {
                            return callback(new Error('File `' + file + '` AWS Error: ' + res.statusCode + ' (' + http.STATUS_CODES[res.statusCode] + ')'));
                        }
                        
                        callback();
                    });
                },
                
                function activateReadPolicy(callback) {
                    console.log('    - Making website accessible...'.green);
                    
                    _this.fortknox.activatePolicy(function(err, res) {
                        if (err) return callback(err);
                        
                        if (res.statusCode > 399) {
                            return callback(new Error('File `' + file + '` AWS Error: ' + res.statusCode + ' (' + http.STATUS_CODES[res.statusCode] + ')'));
                        }
                        
                        callback();
                    });
                },
                
                function deleteFiles(callback) {
                    console.log('    - Deleting stale files...'.green);
                    
                    _this.S3.deleteMultiple(actions.del, callback);
                },
                
                function copyFiles(callback) {
                    var baseDir = _this.site.path('site');
                    
                    console.log('    - Syncing files...'.green);
                    
                    async.each(
                        actions.copy,
                        
                        function iterator(file, callback) {
                            if (file.substr(-1) == '/') {
                                // Skip directories
                                return callback();
                            }
                            
                            var sourcePath = path.join(baseDir, file);
                            
                            console.log(('      - Transferring ' + file).green);
                            
                            _this.S3.putFile(
                                sourcePath,
                                file,
                                function (err, res) {
                                    if (err) return callback(err);
                                    
                                    if (res.statusCode > 399) {
                                        return callback(new Error('File `' + file + '` AWS Error: ' + res.statusCode + ' (' + http.STATUS_CODES[res.statusCode] + ')'));
                                    }
                                    
                                    callback();
                                }
                            );
                        },
                        
                        callback
                    );
                }
            ],
                
            callback
        );
        
    };
    
}

module.exports = setupTransfer;