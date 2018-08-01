/*
 *
 * Copyright (c) 2017 Raising the Floor International.
 *
 * Licensed under the BSD-3-Clause license.
 *
 */
// Inspired by the approach used here: https://github.com/matsu-chara/experimental-markdown-json-lint
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var mdParser = require("@textlint/markdown-to-ast");
var JSON5    = require("json5");

fluid.registerNamespace("gpii.mdjsonLinter");

/**
 *
 * @param {String} markdownString - The markdown content to be parsed.
 * @return {Array} An array containing any errors detected.
 */
gpii.mdjsonLinter = function (markdownString) {
    var errors = [];
    var ast = mdParser.parse(markdownString);
    var jsonBlocks = gpii.mdjsonLinter.findJsonBlocks(ast);

    fluid.each(jsonBlocks, function (jsonBlock) {
        if (jsonBlock.lang === "json") {
            try {
                JSON.parse(jsonBlock.value);
            }
            catch (jsonException) {
                var position = gpii.mdjsonLinter.extractPosition(jsonException.message, jsonBlock.value);
                // We only get `position` data in string output for JSON exceptions, so just report the error at the start of the block.
                errors.push({
                    line:    jsonBlock.position.start.line + position.line,
                    column:  position.column,
                    message: jsonException.message
                });
            }
        }
        // JSON5 is the only other option.
        else {
            try {
                JSON5.parse(jsonBlock.value);
            }
            catch (json5Exception) {
                // the `json5` parser returns more precise data about the line number within a failing block, so for these our numbers are exact.
                errors.push({
                    line:    jsonBlock.position.start.line + json5Exception.lineNumber,
                    column:  json5Exception.columnNumber,
                    message: json5Exception.message
                });
            }
        }
    });
    return errors;
};

gpii.mdjsonLinter.findJsonBlocks = function (node) {
    var jsonBlocks = [];

    if (node.type === "CodeBlock" && ["json", "json5"].indexOf(node.lang) !== -1) {
        jsonBlocks.push(node);
    }

    fluid.each(node.children, function (childNode) {
        jsonBlocks = jsonBlocks.concat(gpii.mdjsonLinter.findJsonBlocks(childNode));
    });

    return jsonBlocks;
};

gpii.mdjsonLinter.extractPosition = function (errorString, originalMaterial) {
    var positionDef = { column: 0, line: 0, position: 0 };

    var matches = errorString.match(/at position ([0-9]+)/);
    if (matches) {
        var position = parseInt(matches[1]);
        positionDef.position = position;

        // Split the substring up to the "position" into lines.
        var lines = originalMaterial.substring(0, position).split(/[\r\n]+/);
        positionDef.line = lines.length;

        // The length of the last line is the column position of the error.
        positionDef.column = lines[lines.length - 1].length + 1;
    }

    return positionDef;
};
