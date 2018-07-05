/*
 * gpii-grunt-mdjson-lint
 *
 * Copyright (c) 2017 Raising the Floor Internationals
 *
 * Licensed under the BSD-3-Clause license.
 */
/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            sources: {
                md: ["./*.md", "./**/*.md", "!./node_modules/**", "!./tests/markdown/bad*"],
                js: [ "./tasks/**/*.js", "./src/**/*.js", "./tests/**/*.js","./*.js" ],
                json: ["./src/**/*.json", "tests/**/*.json", "./*.json", "!./tests/markdown/bad*"],
                json5: ["./src/**/*.json5", "tests/**/*.json5", "./*.json5", "!./tests/markdown/bad*"],
                other: ["./.*"]
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");

    // WARNING:
    //
    //   This is what we have to do in this specific package to use the most current task code instead of what
    //   we inherit from the gpii-grunt-lint-all plugin.  Under no circumstances should you reuse the next two lines in
    //   your own work.
    grunt.renameTask("mdjsonlint", "lint-all-mdjsonlint");
    grunt.loadTasks("tasks");

    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
