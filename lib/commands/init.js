var fs = require('fs');

var Site = require('../models/site');

var init = {
    
    description : 'Initializes a blog in the current directory',
    
    execute : function executeInit() {
        var site = new Site(process.cwd());
        
        site.init();
    }
    
};

module.exports = init;