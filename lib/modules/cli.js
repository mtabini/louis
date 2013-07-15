var program = require('commander');
var pkg = require('../../package.json');
var commands = require('../commands');
var LouisError = require('../models/error');
var colors = require('colors');

process.on('uncaughtException', function(err) {
    if (err.describe) {
        err.describe();
    } else {
        console.error();
        if (err.constructor.name == 'YAMLException') {
            console.log(err.message.red);
        } else if (err.stack) {
            console.error(err.stack.red);
        } else {
            console.log(err);
        }
        
        console.error();
    }
});

program
    .version(pkg.version)
    .usage('<command>');
    
program.on('--help', function(){
    console.log('  Commands:');
    console.log('');
    
    var commandNames = Object.keys(commands).sort();
    var maxLength = commandNames.reduce(function(prev, cur) {
        return Math.max(prev, cur.length);
    }, 0);
    
    commandNames.forEach(function(key) {
        console.log('    ' + key + Array(maxLength + 1 - key.length).join(' ') + ' - ' + commands[key].description);
    })
    
    console.log('');
});

program.parse(process.argv);

if (program.args.length) {
    var commandName = program.args.shift();
    
    if (!commands[commandName]) {
        throw new LouisError('Invalid command `' + commandName + '`. Use --help for a list of commands.');
    }
    
    commands[commandName].execute(program.args);
}