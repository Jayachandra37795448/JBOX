/*

 */

'use strict';

const path = require('path');

module.exports = function(config) {
    config.set({

        // Base path, that will be used to resolve files and exclude
        basePath: '..',

        // Frameworks to use
        frameworks: ['jasmine','mocha', 'chai'],

        // List of files / patterns to load in the browser
        files: [
                '../app/vendor/jquery/jquery.min.js',
                '../app/components/angular/angular.js',
                '../app/components/angular-mocks/angular-mocks.js',
                '../app/vendor/bootstrap/js/bootstrap.min.js',
                '../app/vendor/bootstrap/js/ui-bootstrap-tpls.min.js',
                '../app/vendor/metisMenu/metisMenu.min.js',
                '../app/components/angular-route/angular-route.js',
                '../app/components/bootstrap/js/tab.js',
                '../app/vendor/flot/excanvas.min.js',
                '../app/vendor/flot/jquery.flot.js',
                '../app/vendor/flot/jquery.flot.pie.js',
                '../app/vendor/flot/jquery.flot.resize.js',
                '../app/vendor/flot/jquery.flot.time.js',
                '../app/vendor/flot-tooltip/jquery.flot.tooltip.min.js',
                '../app/vendor/datatables/js/jquery.dataTables.min.js',
                '../app/vendor/datatables-plugins/dataTables.bootstrap.min.js',
                '../app/vendor/datatables-responsive/dataTables.responsive.js',
                '../app/app.js',
                '../app/js/services/testCaseResultServices.js',
                '../app/js/controllers/testSuiteFlotChartCtrl.js',
                '../app/vendor/angular-ui-utils/angular-ui-utils.min.js'
        ],

        // List of files to exclude
        exclude: [],

        globals: {
            'MY_VAR': 123
        },

        // Web server port
        port: 9876,

        // Level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Which plugins to enable
        plugins: [
            'karma-browserify',
            'karma-global-preprocessor',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-jasmine',
            'karma-mocha',
            'karma-chai',
            'karma-ng-html2js-preprocessor'/*,
            'karma-coverage-istanbul-reporter'*/

        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // coverage reporter generates the coverage
        reporters: ['junit', 'progress', 'coverage'/*, 'coverage-istanbul'*/],

        // junit report
        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputDir: 'dist/reports/junit'
        },

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '../*/*/**/*.js': ['coverage'],
            'tests/templates/*.*': "ng-html2js"
        },
        ngHtml2JsPreprocessor: {
            // Make up a module name to contain your templates.
            // We will use this name in the jasmine test code.
            // For advanced configs, see https://github.com/karma-runner/karma-ng-html2js-preprocessor
            moduleName: 'test-templates'
        },
        // optionally, configure the reporter
        coverageReporter: {
            subdir: '.',
            reporters:[{
                type: 'lcov',
                dir:'dist/reports/coverage/html'
            }, {
                type : 'cobertura',
                dir : 'dist/reports/coverage/cobertura/'
            }, {
                type: 'text-summary',
                dir: 'dist/reports/coverage/text' }]
        }

    });
};
