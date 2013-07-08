var watch = require('watch');
var rimraf = require('rimraf');
var path = require('path');
var async = require('async');
var mustache = require('mu2');
var colors = require('colors');
var fs = require('fs');
var os = require('os');
var exec = require('child_process').execFile;

function setupWatch(Server) {
        
    Server.prototype.watch = function watchSite() {
        
        var _this = this;
        
        function meter(resource, arguments) {
            if (_this.lockedResources[resource]) {
                _this.watchQueue[resource] = arguments;
                
                console.log('Queuing update request...'.yellow);
                
                return false;
            }
            
            _this.lockedResources[resource] = 1;
            return true;
        }
        
        function unmeter(resource) {
            delete _this.lockedResources[resource];
            
            if (_this.watchQueue[resource]) {
                var arguments = _this.watchQueue[resource];
                
                delete _this.watchQueue[resource];
                
                arguments.callee.apply(_this, arguments);
            }
        }
        
        function recompileDocument(type, pathName) {
            if (!fs.statSync(pathName).isDirectory()) {
                return;
            }
            
            if (!meter(pathName, arguments)) return;
            
            console.log();
            console.log(('    Change detected in ' + pathName).yellow);
            console.log();

            function recompilePage(err, page) {
                if (err) {
                    throw err;
                    unmeter(pathName);
                }
                
                async.series(
                    [
                        page.load.bind(page),
                        page.compile.bind(page),
                        page.deploy.bind(page)
                    ],
                    
                    function(err) {
                        unmeter(pathName);
                        
                        if (err) throw err;
                    }
                );
            }
            
            if (type == 'post') {
                _this.site.getPost(pathName, recompilePage);
            } else {
                _this.site.getPage(pathName, recompilePage);
            }
        }
        
        function recompilePage(pathName) {
            pathName = path.relative(_this.site.pagePath, path.resolve(pathName));
            pathName = pathName.split(path.sep)[0];
            pathName = path.join(_this.site.pagePath, pathName);
            
            recompileDocument('page', pathName);
        }
        
        function recompilePost(pathName) {
            pathName = path.relative(_this.site.postPath, path.resolve(pathName));
            pathName = pathName.split(path.sep)[0];
            pathName = path.join(_this.site.postPath, pathName);
            
            recompileDocument('post', pathName);
        }
        
        function postOSXNotification(title, message) {
            if (os.platform() == 'darwin') {
                exec(
                    __dirname + '/terminal-notifier.app/Contents/MacOS/terminal-notifier',
                    [
                        '-title',
                        'Louis',
                        '-subtitle',
                        title,
                        '-message',
                        message,
                        '-activate',
                        'com.apple.Terminal'
                    ]
                )
            }
        };
        
        function performSiteRecompile(force) {
            if (!meter('___SITE___', arguments)) return;
            
            var site = _this.site;
            
            site.analyze(force, function(err) {            
                if (err) {
                    unmeter('___SITE___');
                    throw err;
                }
            
                if (site.hasErrors) {
                    console.log();
                
                    site.printAnalysis();
                    
                    postOSXNotification('Compilation unsuccessful', 'Errors occurred during the compilation.')
                
                    unmeter('___SITE___');
                    throw new Error('Correct the errors above before compiling again.');
                }
            
                if (site.documentsToUpdate === 0) {
                    console.log('    All documents are up to date.'.green);
                    console.log();
                    unmeter('___SITE___');
                } else {
                    console.log();
                    console.log('    Compiling...'.green);

                    site.compile(true, function(err) {
                        if (err) throw err;
                
                        console.log();
                        console.log('    Compilation complete.'.green);
                        console.log();
                        
                        postOSXNotification('Compilation complete', 'The site was updated successfully.')
                        
                        unmeter('___SITE___');
                    });
                }
            });      
        }
        
        function recompileSite() {
            performSiteRecompile(true);
        }
        
        function updateSite() {
            performSiteRecompile(false);
        }
        
        watch.createMonitor(this.site.path('pages'), function(monitor) {
            monitor.on('created', updateSite);
            monitor.on('changed', updateSite);            
            monitor.on('removed', recompileSite);
        });
        
        watch.createMonitor(this.site.path('posts'), function(monitor) {
            monitor.on('created', updateSite);
            monitor.on('changed', updateSite);            
            monitor.on('removed', recompileSite);
        });
        
        watch.createMonitor(this.site.path('theme'), function(monitor) {
            function forceReload(pathName, stat) {
                console.log();
                console.log(('    Change detected in ' + pathName).yellow);
                console.log();
                
                mustache.clearCache();
                recompileSite();
            }
            
            monitor.on('created', forceReload);
            monitor.on('changed', forceReload);
            monitor.on('removed', forceReload);
        });
        
    }

}

module.exports = setupWatch;