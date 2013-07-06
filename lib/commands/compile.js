var colors = require('colors');

var Site = require('../models/site');
var Error = require('../models/error');

var compile = {
    
    description : 'Compiles a site, generating all out-of-date pages and saving them to the /site directory',
    
    execute : function executeCompile() {
        console.log();
        console.log('    Compiling...'.green);
        console.log();
                
        var site = new Site(process.cwd());

        site.load();
        site.analyze(function(err) {
            
            if (err) throw err;
            
            if (site.hasErrors) {
                site.printAnalysis();
                
                throw new Error('Correct the errors above before compiling again.');
            }

            site.compile(function(err) {
                if (err) throw err;
                
                console.log();
                console.log('    Compilation complete.'.green);
                console.log();
            });
            
        });      
        
    }
    
};

module.exports = compile;