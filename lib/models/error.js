var util = require('util')
var colors = require('colors');

var LouisError = function (msg, constr) {
    Error.captureStackTrace(this, constr || this)
    this.message = msg || 'Error'
};

util.inherits(LouisError, Error)

LouisError.prototype.name = 'Louis Error';

LouisError.prototype.describe = function() {
    var message = 'ERROR: ' + this.message;
    
    console.error();
    console.error('  ', message.red);
    console.error();
};

module.exports = LouisError;
