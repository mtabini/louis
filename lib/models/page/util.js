var path = require('path');

var Iconv = require('iconv').Iconv;

function setupUtil(Page) {
    
    Page.prototype.path = function pagePath(destination) {
        return path.join(this.baseDir, destination);
    };
    
    Page.slug = function slug(dirName) {
        // Adapted from https://github.com/Aaronontheweb/node-slugs
        // Original © 2011-2012 Aaron Stannard
        
        var result = dirName.toLowerCase()
            .trim()
            .replace(/[.=-]/g, ' ');    //  replace preserved characters with spaces
            
        result = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE').convert(result);
        
        return String(result)
            .replace(/[^\w\ ]/gi, '')   //  replaces all non-alphanumeric with empty string
            .replace(/\s/gi, '-');    //  Convert spaces to dashes
    };
    
};

module.exports = setupUtil;