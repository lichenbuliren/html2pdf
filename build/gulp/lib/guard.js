let plumber = require('gulp-plumber');
let changed = require('gulp-changed');
let logger = require('gulp-logger');
let lazypipe = require('lazypipe');
let notifyErrors = require('./notifyErrors');


module.exports = function (params = {}) {
    let dest = params.dest || '';

    if (dest) {
        return lazypipe()
            .pipe(plumber, { errorHandler: notifyErrors })
            .pipe(changed, dest)
            .pipe(logger, { showChange: true });
    }

    return lazypipe()
        .pipe(plumber, { errorHandler: notifyErrors })
        .pipe(logger, { showChange: true });
};