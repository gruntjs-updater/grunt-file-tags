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
    var EOL = os.EOL;

    function normalizePaths(path) {
        return path.replace(/\\/g, '/');
    }

    function Tags(options) {
        this.options = this.processOptions(options);
    }

    Tags.prototype.processOptions = function (options) {
        var processedOptions = {};

        processedOptions.tagTemplate = options.tagTemplate || '<script type="text/javascript" src="{{ path }}"></script>';

        processedOptions.openTag = options.openTag || '<!-- start file tags -->';
        processedOptions.closeTag = options.closeTag || '<!-- end file tags -->';

        processedOptions.tagTemplate = processedOptions.tagTemplate.replace('{{', '<%=').replace('}}', '%>');

        processedOptions.getIndentWithTag = new RegExp("([\\s\\t]+)?" + processedOptions.openTag);

        processedOptions.replaceNewLines = new RegExp(EOL, "g");

        processedOptions.indent = '';

        return processedOptions;
    };

    Tags.prototype.processFile = function (destFile, srcFiles) {
        var that = this;
        var tagsText = '';
        var fileContents = grunt.file.read(destFile);
        var filePath = path.dirname(destFile);
        var matches = fileContents.match(this.options.getIndentWithTag);

        if (matches && matches[1]) {
            this.options.indent = matches[1].replace(this.options.replaceNewLines, '');
        }

        if (this.validateTemplateTags(destFile, fileContents)) {

            srcFiles.forEach(function (srcFile) {
                var relativePath = normalizePaths(path.relative(filePath, srcFile));
                tagsText += that.options.indent + that.generateTag(relativePath);
            });

            var res = this.addTags(fileContents, tagsText);

            grunt.file.write(destFile, res);
        }
    };

    Tags.prototype.validateTemplateTags = function (fileName, fileContents) {
        var openTagLocation = fileContents.indexOf(this.options.openTag);
        var closeTagLocation = fileContents.indexOf(this.options.closeTag);

        if (closeTagLocation < openTagLocation || openTagLocation === -1 || closeTagLocation === -1) {
            grunt.log.warn('invalid or missing template tags in '['red'] + fileName['red']);

            return false;
        }
        else {
            return true;
        }
    };

    Tags.prototype.generateTag = function (relativePath) {
        var data = {
            data: {
                path: relativePath
            }
        };

        return grunt.template.process(this.options.tagTemplate, data) + EOL;
    };

    Tags.prototype.addTags = function (fileContents, tagsText) {
        var beginning = fileContents.split(this.options.openTag)[0];
        var end = fileContents.split(this.options.closeTag)[1];

        return beginning +
            this.options.openTag + EOL +
            tagsText +
            this.options.indent + this.options.closeTag +
            end;
    };

    grunt.registerMultiTask('file_tags', 'Dynamically inserts script/link/whatever tags for files on disk.', function () {
        var options = this.options();
        var tags = new Tags(options);

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            tags.processFile(f.dest, f.src);
        });
    });

};
