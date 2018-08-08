
let path = require('path');
let fs = require('fs');

module.exports = function (files = [], dest) {
    let retFiles = [];

    if (files.length && dest) {
        retFiles = files.filter(function (file) {
            let filename = path.basename(file);
            let destFile = path.resolve(dest, filename);
    
            return !fs.existsSync(destFile);
        });
    }
    
    return retFiles;
};
