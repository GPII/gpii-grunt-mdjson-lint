/*
 *
 * Copyright (c) 2017 Raising the Floor International.
 *
 * Licensed under the BSD-3-Clause license.
 *
 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
require("../src/js/mdjson-linter");

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask("mdjsonlint", "A plugin to lint JSON and JSON5 blocks within markdown documents.", function () {
        // Merge task-specific and/or target-specific options with these defaults.
        // var options = this.options({
        //     punctuation: '.',
        //     separator: ', '
        // });

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            var validPaths = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn("Source file '" + filepath + "' not found.");
                    return false;
                } else {
                    return true;
                }
            });

            var errorCount       = 0;

            fluid.each(validPaths, function (filepath) {
                var mdContent = grunt.file.read(filepath);
                var fileErrors = gpii.mdjsonLinter(mdContent);
                if (fileErrors.length) {
                    fluid.each(fileErrors, function (error) {
                        errorCount++;
                        // TODO: Shorten this path sensibly
                        var errorMessage = filepath + "(" + error.line + ":" + error.column + "):" + error.message;
                        grunt.log.error(errorMessage);
                    });
                }
            });

            if (errorCount) {
                grunt.log.error("Found " + errorCount + " errors in " + validPaths.length + " files...");
                return false;
            }
            else {
                grunt.log.ok("Scanned " + validPaths.length + " files, there were no JSON(5) errors found...");
            }
        });
    });

};
