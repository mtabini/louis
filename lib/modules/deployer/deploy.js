var colors = require('colors');
var update = require('../../commands/update');

function setupDeploy(Deployer) {
    
    Deployer.prototype.deploy = function deploySite(callback) {
        update.execute(function() {
            console.log();
            console.log('    Deploying website...'.green);
            console.log();
            this.walk(function(err, actions) {
                if (err) return callback(err);
            
                this.transfer(actions, callback);
            }.bind(this));
        }.bind(this));
    }
    
}

module.exports = setupDeploy;