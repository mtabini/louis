var fs = require('fs');

var init = {
    
    description : 'Initializes a blog in the current directory',
    
    execute : function executeInit() {
        console.log(process.cwd());
    }
    
};

module.exports = init;