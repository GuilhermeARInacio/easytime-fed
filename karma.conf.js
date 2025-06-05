module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/**/*.spec.ts'
        ],
        browsers: ['Chrome'],
        singleRun: true,
        reporters: ['progress'],
        preprocessors: {
            'src/**/*.spec.ts': ['typescript']
        },
        typescriptPreprocessor: {
            options: {
                sourceMap: false
            }
        }
    });
};