var colors = require('colors');

var Site = require('../models/site');
var Error = require('../models/error');

var update = {
    
    description : 'Updates a site, generating all out-of-date documents and saving them to the /site directory',
    
    execute : function executeUpdate(callback) {
        console.log();
        console.log('    Analyzing...'.green);
        
        if (typeof callback !== 'function') {
            callback = null;
        }
                
        var site = new Site(process.cwd());

        site.on('willCompilePage', function(page) {
            console.log(('      - Analyzing ' + page + '...').green);
        });

        site.on('willDeployPage', function(page) {
            console.log(('      - Rendering ' + page + '...').green);
        });

        site.on('willCompileArchive', function(archive) {
            console.log(('      - Analyzing ' + archive.type.singular + ' archive...').green);
        });

        site.on('willDeployArchive', function(archive) {
            console.log(('      - Rendering ' + archive.type.singular + ' archive...').green);
        });
        
        site.on('willCompileFeed', function(site) {
            console.log('      - Analyzing RSS feed...'.green);
        });
        
        site.on('willDeployFeed', function(site) {
            console.log('      - Rendering RSS feed...'.green);
        });
        
        site.on('willCompileStatics', function(site) {
            console.log('      - Copying static assets...'.green);
        });

        site.load();
        site.analyze(false, function(err) {
            if (err) throw err;
            
            if (site.hasErrors) {
                console.log();
                
                site.printAnalysis();
                
                throw new Error('Correct the errors above before compiling again.');
            }
            
            if (site.documentsToUpdate === 0) {
                console.log();
                console.log('    All documents are up to date.'.green);
                console.log();
                
                if (callback) {
                    callback();
                }
            } else {
                console.log();
                console.log('    Compiling...'.green);

                site.compile(false, function(err) {
                    if (err) throw err;
                
                    console.log();
                    console.log('    Compilation complete.'.green);
                    console.log();
                    
                    if (callback) {
                        callback();
                    }
                });
            }
        });      
        
    }
    
};

module.exports = update;