var colors = require('colors');
var update = require('../../commands/update');
var xml = require('xml2js');

function setupDeploy(Deployer) {
    
    Deployer.prototype.determineURL = function determineSiteURL(callback) {
        var _this = this;
        
        this.S3.getFile('/?location', function(err, result) {
            var data = '';
            
            result.on('data', function(chunk) {
                data += chunk;
            });
            
            result.on('end', function() {
                xml.parseString(data, function(err, result) {
                    var region;
                    
                    if (result['_']) {
                        restion = result['_'];
                    } else {
                        region = 'us-east-1';
                    }
                    
                    callback(null, _this.site.config.deploy.bucket + '.s3-website-' + region + '.amazonaws.com');
                });
            });
        });
    };
    
    Deployer.prototype.deploy = function deploySite(callback) {
        update.execute(function() {
            console.log();
            console.log('    Deploying website...'.green);
            console.log();
            
            this.walk(function(err, actions) {
                if (err) return callback(err);
            
                this.transfer(actions, function(err) {
                    if (err) callback(err);

                    this.determineURL(function(err, url) {
                        if (err) callback(err);

                        console.log();
                        console.log(('    *** -> Your site should now be accessible at http://' + url).green);
                        
                        callback();
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }
    
}

module.exports = setupDeploy;