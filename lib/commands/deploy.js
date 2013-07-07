var fs = require('fs');
var colors = require('colors');

var Site = require('../models/site');
var Deployer = require('../modules/deployer');

var deploy = {
    
    description : 'Deploys a site to Amazon\'s S3',
    
    execute : function executeDeploy() {
        var site = new Site(process.cwd());
        
        site.load();
        
        var deployer = new Deployer(site);
        
        deployer.deploy(function(err) {
            if (err) throw err;
            
            console.log();
            console.log('    Deployment complete.'.green);
            console.log();
        });
    }
    
};

module.exports = deploy;