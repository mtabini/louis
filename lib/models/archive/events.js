function setupEvents(Archive) {
    
    Archive.prototype.emitWillCompile = function emitArchiveWillCompileEvent(page) {
        this.emit('willCompilePage', page);
    };
    
    Archive.prototype.emitDidCompile = function emitArchiveDidCompileEvent(page) {
        this.emit('didCompilePage', page);
    };
    
    Archive.prototype.emitWillDeploy = function emitArchiveWillDeployEvent(page) {
        this.emit('willDeployPage', page);
    };
    
    Archive.prototype.emitDidDeploy = function emitArchiveDidDeployEvent(page) {
        this.emit('didDeployPage', page);
    };
    
}

module.exports = setupEvents;