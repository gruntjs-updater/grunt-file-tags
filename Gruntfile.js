/*
 * grunt-file-tags
 * https://github.com/macd2point0/grunt-file-tags
 *
 * Copyright (c) 2015 Daniel MacDonald
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

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

        clean: {
            src: ['test/tmp/']
        },

        copy: {
            test: {
                expand: true,
                cwd: 'test/template/',
                src: '**',
                dest: 'test/tmp/'
            }
        },

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

        nodeunit: {
            tests: ['test/*.test.js']
        }

    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', [
        'clean',
        'copy:test',
        'file_tags:scripts',
        'file_tags:styles',
        'nodeunit',
        'clean'
    ]);

    grunt.registerTask('default', ['jshint', 'test']);

};
