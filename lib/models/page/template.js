var moment = require('moment');

function setupMeta(Page) {
    
    Object.defineProperty(
        
        Page.prototype,
        
        'formattedDate',
        
        {
            enumerable: true,
            configurable: true,
            
            get: function getPageFormattedDate() {
                return moment(this.lastModifiedDate).format('LL');
            }
        }
    
    );
    
}

module.exports = setupMeta;