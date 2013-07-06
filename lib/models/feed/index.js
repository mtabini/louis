var Feed = function Feed(site) {
    this.site = site;
    this.feed = null;
};

require('./compile')(Feed);
require('./deploy')(Feed);

module.exports = Feed;