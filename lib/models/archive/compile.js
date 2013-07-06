function setupCompile(Archive) {
    
    Archive.prototype.compile = function compileArchive(callback) {
        this.emit('willCompile');
        
        var sections = this.pages.all.reduce(function(result, page) {
            var year = page.lastModifiedDate.getYear();
            var month = page.lastModifiedDate.getMonth();
        
            if (!result[year]) {
                result[year] = {};
            }
            
            if (!result[year][month]) {
                result[year][month] = [];
            }
        
            result[year][month].push(page);
        }, {});
        
        
        callback();
    }
    
}

module.exports = setupCompile;