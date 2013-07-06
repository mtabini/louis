var fs = require('fs');

function setupDeploy(Feed) {
    
    Feed.prototype.deploy = function deployFeed(callback) {
        fs.writeFile(this.site.path('/site/feed.xml'), this.feed.xml(), callback);
    }
    
}

module.exports = setupDeploy;