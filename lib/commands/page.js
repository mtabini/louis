var Site = require('../models/site');

var page = {
    
    description : 'Initializes a new page in the current directory',
    
    execute : function executePageCommand() {
        var site = new Site(process.cwd());

        site.load();
        
        site.getPage(process.cwd(), function(err, page) {
            if (err) throw err;
            
            page.init();
        });
    }
    
};

module.exports = page;