/* eslint-env node */
"use strict";
var fluid = require("infusion");

// Register our content so that it can be referenced in other packages using `fluid.module.resolvePath("%gpii-mdjson-linter/path/to/content")`
fluid.module.register("gpii-grunt-mdjson-lint", __dirname, require);

require("./src/js/mdjson-linter");
