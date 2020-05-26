/*
 * gpii-grunt-mdjson-lint
 *
 * Copyright (c) 2017 Raising the Floor Internationals
 *
 * Licensed under the BSD-3-Clause license.
 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.require("%gpii-grunt-lint-all/src/load-npm-tasks-properly.js");
module.exports = function (grunt) {
    /*

        This package makes use of the gpii-grunt-lint-all plugin to lint check its source.  That package depends on its
        own version of this package.  This next line adds the loadNpmTasksProperly command so that we can load
        gpii-grunt-lint-all without our dependencies conflicting with those inherited from its copy of this package.

        We also renamed the tasks pulled in with the gpii-grunt-lint-all plugin so that our own lint checks use our code
        for the mdjson lint checks.  End users should use the gpii-grunt-lint-all plugin directly and use the
        configuration syntax outlined in that package's documentation.

     */
    gpii.grunt.lintAll.fixGruntTaskLoading(grunt);

    grunt.initConfig({
        lintAll: {
            sources: {
                md:    ["*.md", "!./node_modules/**", "!./tests/markdown/bad*"],
                js:    ["*.js"],
                json:  ["*.json", "!./tests/markdown/bad*"],
                json5: ["*.json5", "!./tests/markdown/bad*"],
                other: ["./.*"]
            }
        }
    });

    grunt.loadNpmTasksProperly("gpii-grunt-lint-all");

    // WARNING:
    //
    //   This is what we have to do in this specific package to use the most current task code instead of what
    //   we inherit from the gpii-grunt-lint-all plugin.  Under no circumstances should you reuse the next two lines in
    //   your own work.
    grunt.renameTask("mdjsonlint", "lint-all-mdjsonlint");
    grunt.loadTasks("tasks");

    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
