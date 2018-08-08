let notify = require('gulp-notify');

module.exports = function (errorObject, callback) {
    let formatedError = errorObject.toString().split(': ').join(':\n');
    
    notify.onError(formatedError).apply(this, arguments);

    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
};
