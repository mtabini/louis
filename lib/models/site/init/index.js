var fs = require('fs');
var Error = require('../../error');
var colors = require('colors');
var ncp = require('ncp').ncp;
var path = require('path');

function setupInit(Site) {
    
    Site.prototype.init = function initSite() {
        var configPath = this.path('config.yaml');
        
        if (fs.existsSync(configPath)) {
            throw new Error('This directory already contains a config.yaml. Refusing to overwrite it (you\'ll thank me one day).');
        }

        console.log();
        console.log('Initializing directory...'.yellow);
        
        ncp(
            path.join(__dirname, 'template'),
            
            this.baseDir,
            
            {
                clobber: false
            },
            
            function(err) {
                if (err) throw err;
                
                console.log('Directory initialized. It\'s all yours.'.green);
                console.log();
            }  
        );
        
    };
    
}

module.exports = setupInit;