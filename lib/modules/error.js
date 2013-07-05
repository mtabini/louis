var colors = require('colors');

process.on('uncaughtException', function(err) {
    if (err.describe) {
        err.describe();
    } else {
        console.error();
        console.error(err.stack.red);
        console.error();
    }
});

