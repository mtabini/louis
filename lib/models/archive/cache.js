var fs = require('fs');

function setupCache(Archive) {

    Archive.prototype.loadCache = function loadArchiveCache() {
        try {
            this.cache = require(this.path('.cache.json'));
            
            Object.keys(this.cache).forEach(function(key) {
                this.cache[key] = new Date(this.cache[key]);
            }, this);
        } catch (e) {
            this.cache = {};
        }
    };
    
    Archive.prototype.saveCache = function saveArchiveCache() {
        var cache = this.pages.all.reduce(function(result, page) {
            result[page.baseDir] = page.lastModifiedDate.getTime();
            return result;
        }, {});
        
        fs.writeFileSync(this.path('.cache.json'), JSON.stringify(cache));
    };
    
}

module.exports = setupCache;