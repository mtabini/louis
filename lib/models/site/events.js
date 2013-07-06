function setupEvents(Site) {
    
    Site.prototype.emitWillCompile = function emitSiteWillCompileEvent(page) {
        this.emit('willCompilePage', page);
    };
    
    Site.prototype.emitDidCompile = function emitSiteDidCompileEvent(page) {
        this.emit('didCompilePage', page);
    };
    
    Site.prototype.emitWillDeploy = function emitSiteWillDeployEvent(page) {
        this.emit('willDeployPage', page);
    };
    
    Site.prototype.emitDidDeploy = function emitSiteDidDeployEvent(page) {
        this.emit('didDeployPage', page);
    };
    
}

module.exports = setupEvents;