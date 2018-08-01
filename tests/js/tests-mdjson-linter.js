/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");
var fs     = require("fs");

require("../../src/js/mdjson-linter");

fluid.registerNamespace("gpii.tests.mdjsonLinter");

gpii.tests.mdjsonLinter.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.tests.mdjsonLinter.runSingleTest);
};

gpii.tests.mdjsonLinter.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var resolvedPath = fluid.module.resolvePath(testDef.path);
        var mdContent = fs.readFileSync(resolvedPath, "utf8");
        var errors = gpii.mdjsonLinter(mdContent);
        if (testDef.hasErrors) {
            jqUnit.assertTrue("There should be errors...", errors.length > 0);
        }
        else {
            jqUnit.assertTrue("There should be no errors...", errors.length === 0);
        }
    });
};

fluid.defaults("gpii.tests.mdjsonLinter.testRunner", {
    gradeNames: ["fluid.component"],
    testDefs: {
        goodJson: {
            message: "Valid JSON should validate correctly...",
            path:    "%gpii-grunt-mdjson-lint/tests/markdown/goodJson.md"
        },
        goodJson5: {
            message: "Valid JSON5 should validate correctly...",
            path:    "%gpii-grunt-mdjson-lint/tests/markdown/goodJson5.md"
        },
        badJson: {
            message:   "Invalid JSON should result in linting errors...",
            path:      "%gpii-grunt-mdjson-lint/tests/markdown/badJson.md",
            hasErrors: true
        },
        badJson5: {
            message:   "Invalid JSON5 should result in linting errors...",
            path:      "%gpii-grunt-mdjson-lint/tests/markdown/badJson5.md",
            hasErrors: true
        },
        snippet: {
            message: "An invalid non-JSON(5) 'snippet' should not report any errors...",
            path:    "%gpii-grunt-mdjson-lint/tests/markdown/snippet.md"
        }
    },
    listeners: {
        "onCreate.setModule": {
            funcName: "jqUnit.module",
            args:     ["Unit tests for the static linting functions..."]
        },
        "onCreate.runTests": {
            funcName: "gpii.tests.mdjsonLinter.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.tests.mdjsonLinter.testRunner();
