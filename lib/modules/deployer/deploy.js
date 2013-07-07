var colors = require('colors');

function setupDeploy(Deployer) {
    
    Deployer.prototype.deploy = function deploySite(callback) {
        console.log();
        console.log('Deploying website...'.green);
        console.log();
        this.walk(function(err, actions) {
            if (err) return callback(err);
            
            this.transfer(actions, callback);
        }.bind(this));
    }
    
}

module.exports = setupDeploy;