/*
 * gpii-grunt-mdjson-linter
 *
 * Copyright (c) 2017 Raising the Floor Internationals
 *
 * Licensed under the BSD-3-Clause license.
 */
/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        eslint: {
            src: [ "./tasks/**/*.js", "./src/**/*.js", "./tests/**/*.js","./*.js" ]
        },
        jsonlint: {
            src: ["./src/**/*.json", "tests/**/*.json", "./*.json", "!./tests/markdown/bad*"]
        },
        json5lint: {
            src: ["./src/**/*.json5", "tests/**/*.json5", "./*.json5", "!./tests/markdown/bad*"]
        },
        "mdjsonlint": {
            default_options: {
                src: ["./*.md", "./**/*.md", "!./node_modules/**"]
            },
            // We have intentionally broken material in our tests that must be excluded.
            selflint: {
                src: ["./*.md", "./**/*.md", "!./node_modules/**", "!./tests/markdown/bad*"]
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks("tasks");

    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("fluid-grunt-json5lint");
    grunt.loadNpmTasks("fluid-grunt-eslint");

    grunt.registerTask("lint", "Javascript and JSON validation...", ["eslint", "jsonlint", "json5lint", "mdjsonlint:selflint"]);
};
