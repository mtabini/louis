var Site = require('../models/site');
var Server = require('../modules/server');

var serve = {
    
    description : 'Runs your site locally, allowing you to access it live from a web browser.',
    
    execute : function executeServeCommand() {
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

        site.load();
        
        var server = new Server(site);
        
        server.start();
    }
    
};

module.exports = serve;