function setupAnalyze(Deployer) {
    
    Deployer.prototype.analyze = function compareSiteData(result, callback) {
        var actions = {
            copy: [],
            del: []
        };
        
        Object.keys(result.fs).forEach(function(localFile) {
            if (result.s3[localFile]) {
                if (result.s3[localFile] < result.fs[localFile]) {
                    actions.copy.push(localFile);
                }
            } else {
                actions.copy.push(localFile);
            }
            
            delete result.s3[localFile];
        });
        
        Object.keys(result.s3).forEach(function(s3File) {
            actions.del.push(s3File);
        });

        callback(null, actions);
    }
    
}

module.exports = setupAnalyze;