var async = require('async');

function setupAnalyze(Site) {
    
    Site.prototype.analyze = function(force, callback) {
        var _this = this;
        
        async.series(
            [
                function loadArchives(callback) {
                    _this.loadArchives(force, callback);
                },
            
                function compileIndexPage(callback) {
                    _this.indexPage.compile(callback);
                },
                
                function compileArchivePage(callback) {
                    _this.postArchive.compile(callback);
                }
            ],
                
            callback
        );
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
    
    Object.defineProperty(
        Site.prototype,
        
        'documentsToUpdate',
        
        {
            enumerable: true,
            configurable: true,
            
            get: function getSiteDocumentsToUpdateCount() {
                return this.pageArchive.pages.outdated.length + this.postArchive.pages.outdated.length; 
            }
        }
    );
    
}

module.exports = setupAnalyze;