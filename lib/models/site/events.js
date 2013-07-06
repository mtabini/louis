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
    
    Site.prototype.emitWillCompileArchive = function emitSiteWillAnalyzeArchiveEvent(archive) {
        this.emit('willCompileArchive', archive);
    };
    
    Site.prototype.emitDidCompileArchive = function emitSiteDidAnalyzeArchiveEvent(archive) {
        this.emit('DidCompileArchive', archive);
    };
    
    Site.prototype.emitWillDeployArchive = function emitSiteWillAnalyzeArchiveEvent(archive) {
        this.emit('willDeployArchive', archive);
    };
    
    Site.prototype.emitDidDeployArchive = function emitSiteDidAnalyzeArchiveEvent(archive) {
        this.emit('DidDeployArchive', archive);
    };
    
}

module.exports = setupEvents;