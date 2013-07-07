var knox = require('knox');
var fortknox = require('fortknox');

var Error = require('../../models/error');

var Deployer = function Deployer(site) {
    this.site = site;
    
    this.S3 = knox.createClient({
        key: site.config.deploy.accessKey,
        secret: site.config.deploy.secretKey,
        bucket: site.config.deploy.bucket
    });
    
    this.fortknox = fortknox.createClient({
        key: site.config.deploy.accessKey,
        secret: site.config.deploy.secretKey,
        bucket: site.config.deploy.bucket
    });
}

require('./walk')(Deployer);
require('./analyze')(Deployer);
require('./deploy')(Deployer);
require('./transfer')(Deployer);

module.exports = Deployer;
