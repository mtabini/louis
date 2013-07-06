function setupAnalyze(Site) {
    
    Site.prototype.analyze = function(callback) {
        
        this.loadArchives(callback);
        
    };
    
    Site.prototype.printAnalysis = function printSiteAnalysis() {
        console.log();

        this.pageArchive.printAnalysis();
        this.postArchive.printAnalysis();
        
        console.log();
    };
    
    Object.defineProperty(
        Site.prototype,
        
        'hasErrors',
        
        {
            enumerable: true,
            configurable: true,
            
            get: function getSiteHasErrors() {
                return (this.pageArchive.pages.error.length || this.postArchive.pages.error.length); 
            }
        }
    );
    
}

module.exports = setupAnalyze;