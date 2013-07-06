var fs = require('fs');
var async = require('async');
var ncp = require('ncp').ncp;
var path = require('path');
var exec = require('child_process').exec;
var yaml = require('js-yaml');
var mustache = require('mu2');

var Error = require('../../error');

function setupInit(Page) {
    
    Page.prototype.init = function initPage() {
        var metaPath = this.path('meta.yaml');

        if (fs.existsSync(metaPath)) {
            throw new Error('This directory already contains a `meta.yaml` file. Refusing to overwrite it (you\'ll thank me one day).');
        }
        
        console.log();
        console.log('Initializing directory...'.yellow);
        
        async.waterfall(
            [
                function initDirectory(callback) {
                    ncp(
                        path.join(__dirname, 'template'),
            
                        this.baseDir,
            
                        {
                            clobber: false
                        },
            
                        callback
                    );
                }.bind(this),
            
                function guessMeta(callback) {
                    var baseName = path.basename(this.baseDir);
                    
                    var title = baseName
                            .replace(/\-_/, ' ')    // Replace underbars and dashes with spaces
                            .replace(/\s+/, ' ')    // Remove multiple spaces
                            .replace(/^./, function capitalize(s) { return s.toUpperCase(); }); // Capitalize first letter

                    exec("finger `whoami` | sed -e '/Name/!d' -e 's/.*Name: //'", function(err, author) {
                        if (err) {
                            author = '';
                        }
                        
                        callback(null, title, author.trim(), Page.slug(baseName));
                    });
                        
                }.bind(this),
                
                function applyMeta(title, author, slug, callback) {
                    var metaPath = this.path('meta.yaml');
                    
                    var template = fs.readFileSync(metaPath).toString();
                    var output = '';
                    
                    stream = mustache.renderText(
                        template,
                        {
                            title: title,
                            author: author,
                            slug: slug
                        }
                    );
                    
                    stream.on('data', function(data) {
                        output += data.toString();
                    });
                    
                    stream.on('end', function() {
                        fs.writeFileSync(metaPath, output);
                        
                        callback();
                    });
                }.bind(this)
            
            ],
            
            function(err) {
                if (err) throw err;
    
                console.log('Directory initialized. It\'s all yours.'.green);
                console.log();
            }  
        )
        
        
    };
    
};

module.exports = setupInit;