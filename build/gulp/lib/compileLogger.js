let gutil = require('gulp-util');
let notifyErrors = require('./notifyErrors');

module.exports = function (err, stats) {
    if (err) { 
        throw new gutil.PluginError('webpack', err); 
    }

    let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';

    if (stats.compilation.errors.length > 0) {
        stats.compilation.errors.forEach(function (error) {
            notifyErrors(error);
            statColor = 'red';
        });
    } else {
        gutil.log(stats.toString({
            colors: gutil.colors.supportsColor,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: false,
            version: false,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false,
        }));
    }
};
