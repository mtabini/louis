var async = require('async');

function setupDeploy(Archive) {
    
    Archive.prototype.deploy = function deployArchive(callback) {
        async.each(
            this.pages.outdated,
            
            function iterator(page, callback) {
                page.deploy(callback);
            },
        
            callback
        );
    };
    
}

module.exports = setupDeploy;