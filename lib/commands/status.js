var Site = require('../models/site');
var Archive = require('../models/archive');

var analyze = {
    
    description : 'Analyzes your blog and prints out its status',
    
    execute : function executeAnalyzeCommand() {
        var site = new Site(process.cwd());

        site.load();
        site.analyze(false, function(err) {
           
            if (err) throw err;
            
            site.printAnalysis();
            
        });      
    }
    
};

module.exports = analyze;