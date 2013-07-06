var Site = require('../models/site');
var Error = require('../models/error');

var page = {
    
    description : 'Initializes a new page in the current directory',
    
    execute : function executePageCommand() {
        var site = new Site(process.cwd());
        var path = process.cwd();
        var creator;

        site.load();
        
        switch(site.documentTypeFromPath(path)) {
            case 'page':
                creator = site.getPage;
                break;
                
            case 'post':
                creator = site.getPost;
                break;
                
            default:
                throw new Error('No documents can be initialized here. Are you sure you\'re in the right directory?');
        }
        
        creator.call(site, path, function(err, page) {
            if (err) throw err;
            
            page.init();
        });
    }
    
};

module.exports = page;