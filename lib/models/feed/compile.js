var path = require('path');

var RSS = require('rss');

function setupCompile(Feed) {
    
    Feed.prototype.compile = function compileFeed(callback) {
        this.feed = new RSS(this.site.config.feed);
        
        for(var index = 0, length = Math.min(this.site.postArchive.pages.all.length, 15); index < length; index++) {
            var page = this.site.postArchive.pages.all[index];
            
            this.feed.item({
                title: page.config.title,
                author: page.config.author,
                categories: page.config.categories,
                date: page.lastModifiedDate,
                description: page.compiled,
                url: path.join(this.site.config.site.url, page.config.slug, '/')
            });
        }

        callback();
    }
    
}

module.exports = setupCompile;