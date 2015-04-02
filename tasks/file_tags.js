/*
 * grunt-file-tags
 * https://github.com/macd2point0/grunt-file-tags
 *
 * Copyright (c) 2015 Daniel MacDonald
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var path = require('path');
    var os = require('os');
    var EOL = os.EOL; // end of line for operating system

    /**
     * Normalize the files paths for window (\) and unix (/)
     *
     * @function normalizePaths
     * @return {String}
     */
    function normalizePaths (path) {
        return path.replace(/\\/g, '/');
    }

    /**
     * @constructor create a new instance of tags task
     */
    function Tags (options) {
        this.options = this.processOptions(options);
    }

    /**
     * process options, overriding defaults
     */
    Tags.prototype.processOptions = function (options) {
        var processedOptions = {};

        processedOptions.tagTemplate = options.tagTemplate || '<script type="text/javascript" src="{{ path }}"></script>';

        processedOptions.openTag = options.openTag || '<!-- start file tags -->';
        processedOptions.closeTag = options.closeTag || '<!-- end file tags -->';

        /**
         * @kludge should not have to hack around for templates
         */
        processedOptions.tagTemplate = processedOptions.tagTemplate.replace('{{', '<%=').replace('}}', '%>');

        /**
         * get the openTag line from content
         */
        processedOptions.getIndentWithTag = new RegExp("([\\s\\t]+)?" + processedOptions.openTag);

        /**
         * replace newlines with empty string from @this.getIndentWithTag
         */
        processedOptions.replaceNewLines = new RegExp(EOL, "g");

        /**
         * indent size @this.openTag
         */
        processedOptions.indent = '';

        return processedOptions;
    };

    /**
     * this is the main method that process and modified files, adding tags along the way!
     *
     * @method processFile
     */
    Tags.prototype.processFile = function (destFile, srcFiles) {
        var that = this;
        var tagsText = '';
        var fileContents = grunt.file.read(destFile);
        var filePath = path.dirname(destFile);
        var matches = fileContents.match(this.options.getIndentWithTag);

        /**
         * get the indent along with this.options.openTag
         */
        if (matches && matches[1]) {
            /**
             * get the indent size by replacing this.options.openTag with empty string
             */
            this.options.indent = matches[1].replace(this.options.replaceNewLines, '');
        }

        if (this.validateTemplateTags(destFile, fileContents)) {

            srcFiles.forEach(function (srcFile) {
                // calculate the src files path relative to destination path
                var relativePath = normalizePaths(path.relative(filePath, srcFile));
                tagsText += that.options.indent + that.generateTag(relativePath);
            });

            var res = this.addTags(fileContents, tagsText);

            grunt.file.write(destFile, res);
        }
    };

    /**
     * validate the given file contents contain valid template tags
     */
    Tags.prototype.validateTemplateTags = function (fileName, fileContents) {
        // get locations of template tags
        // used to verify that the destination file contains valid template tags
        var openTagLocation = fileContents.indexOf(this.options.openTag);
        var closeTagLocation = fileContents.indexOf(this.options.closeTag);

        // verify template tags exist and in logic order
        if (closeTagLocation < openTagLocation || openTagLocation === -1 || closeTagLocation === -1) {
            grunt.log.warn('invalid or missing template tags in '['red'] + fileName['red']);

            return false;
        }
        else {
            return true;
        }
    };

    /**
     * generate a template tag for provided file
     */
    Tags.prototype.generateTag = function (relativePath) {
        var data = {
            data: {
                path: relativePath
            }
        };

        return grunt.template.process(this.options.tagTemplate, data) + EOL;
    };

    /**
     * add the tags to the correct part of the destination file
     */
    Tags.prototype.addTags = function (fileContents, tagsText) {
        var beginning = fileContents.split(this.options.openTag)[0];
        var end = fileContents.split(this.options.closeTag)[1];

        return beginning +
            this.options.openTag + EOL +
            tagsText +
            this.options.indent + this.options.closeTag +
            end;
    };

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('file_tags', 'Dynamically inserts script/link/whatever tags for files on disk.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();
        var tags = new Tags(options);

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            tags.processFile(f.dest, f.src);
        });
    });

};
