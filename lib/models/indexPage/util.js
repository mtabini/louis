function setupUtil(IndexPage) {
    
    IndexPage.prototype.toString = function IndexPageToString() {
        return 'the index page';
    };
    
}

module.exports = setupUtil;