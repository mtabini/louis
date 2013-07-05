var Site = require('../models/site');
var Archive = require('../models/archive');

var analyze = {
    
    description : 'Analyzes your blog and prints out its status',
    
    execute : function executeAnalyzeCommand() {
        var site = new Site(process.cwd());

        site.load();
        
        console.log();
        
        site.loadArchives(function(err) {
            if (err) throw err;
            
            site.pageArchive.printAnalysis();
            site.postArchive.printAnalysis();
            
            console.log();
        });
        
    }
    
};

module.exports = analyze;