var fs = require('fs');
var path = require('path');

function setupDeploy(IndexPage) {
    
    IndexPage.prototype.deploy = function deployIndexPage(callback) {
        this.emit('willDeploy', this);
        
        var _this = this;
        
        fs.writeFile(
            path.join(this.site.path('site'), 'index.html'), 
            
            this.compiled, 
            
            function(err) {
                _this.emit('didDeploy', _this);
                callback(err);
            });
    }
    
}

module.exports = setupDeploy;