var walk = require('walk').walk;
var path = require('path');
var async = require('async');
var fs = require('fs');
var colors = require('colors');

function setupWalk(Deployer) {
    
    Deployer.prototype.walkFs = function walkSite(callback) {
        
        var baseDir = this.site.path('site');
        var walker = walk(baseDir);
        
        var files = [];
        
        walker.on('name', function(dir, name) {
            files.push(path.join(dir, name));
        });
        
        walker.on('end', function() {
            async.reduce(
                files,
                
                {},
                
                function mapper(memo, file, callback) {
                    fs.stat(file, function (err, stat) {
                        if (err) callback(err);
                        
                        var finalPath = path.relative(baseDir, file);
                    
                        if (stat.isDirectory()) {
                            finalPath += '/';
                        }
                        
                        memo[finalPath] = stat.mtime;
                        
                        callback(err, memo);
                    });
                },

                callback
            );
        });
        
    };
    
    Deployer.prototype.walkS3 = function walkS3(callback) {
        this.S3.list(
            {
                'max-keys': 100000
            },

            function s3Callback(err, result) {
                if (err) return callback(err);
                
                callback(null, result.Contents.reduce(function reductor(memo, file) {
                    memo[file.Key] = file.LastModified;
                    
                    return memo;
                }, {}));
            }
        );
    };
    
    Deployer.prototype.walk = function walkAll(callback) {
        console.log('    - Analyzing directory structures...'.green);
        
        async.parallel(
            {
                fs: this.walkFs.bind(this),
                s3: this.walkS3.bind(this)
            },
            
            function finalCallback(err, result) {
                if (err) return callback(err);
                
                this.analyze(result, callback);
            }.bind(this)
        )
    }
    
}

module.exports = setupWalk;