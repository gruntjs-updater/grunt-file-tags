/*
 * grunt-file-tags
 * https://github.com/macd2point0/grunt-file-tags
 *
 * Copyright (c) 2015 Daniel MacDonald
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            src: ['test/tmp/']
        },

        // copy files for test
        copy: {
            test: {
                expand: true,
                cwd: 'test/template/',
                src: '**',
                dest: 'test/tmp/'
            }
        },

        // Configuration to be run (and then tested).
        file_tags: {
            options: {
                //
            },
            scripts: {
                options: {
                    tagTemplate: '<script src="{{ path }}"></script>',
                    openTag: '<!-- start script tags -->',
                    closeTag: '<!-- end script tags -->'
                },
                src: [
                    'test/build/**/*.js'
                ],
                dest: 'test/tmp/file-tags.html'
            },
            styles: {
                options: {
                    tagTemplate: '<link rel="stylesheet" href="{{ path }}"/>',
                    openTag: '<!-- start style tags -->',
                    closeTag: '<!-- end style tags -->'
                },
                src: [
                    'test/build/**/*.css'
                ],
                dest: 'test/tmp/file-tags.html'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*.test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', [
        'clean',
        'copy:test',
        'file_tags:scripts',
        'file_tags:styles',
        'nodeunit',
        'clean'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
