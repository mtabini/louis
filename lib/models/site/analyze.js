function setupAnalyze(Site) {
    
    Site.prototype.analyze = function(callback) {
        
        this.loadArchives(callback);
        
    };
    
    Site.prototype.printAnalysis = function printSiteAnalysis() {
        console.log();

        this.pageArchive.printAnalysis();
        this.postArchive.printAnalysis();
        
        console.log();
    }
    
}

module.exports = setupAnalyze;