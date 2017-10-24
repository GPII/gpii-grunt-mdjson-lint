# gpii-grunt-mdjson-lint

This plugin uses [markdown-to-ast](https://github.com/textlint/textlint/tree/master/packages/markdown-to-ast) to extract
all code blocks within markdown content.  Only fenced code blocks tagged with the `json` or `json5` language will be
linted:

````markdown
The following will be scanned (and report an error):

```json
{
  key: "not quoted"
}
```

The following will be scanned (and will not report an error):

```json5
{
    key: "not quoted"
}
```

The following will not be scanned:

```snippet
someOperation(<garbage in>) => <garbage out>
```
````

Each code block is linted by attempting to parse it using either `JSON.parse`, or the `JSON5.parse` method provided by
[the `json5` library](https://github.com/json5/json5).  Errors are caught and converted to a common format that includes
the information needed to identify which file, line number and column number are associated with the error.  Note that
the first failure in a single fenced code block may prevent you from seeing subsequent errors in the same fenced code
block.

# Using this Package

Install this package in your project using `npm install gpii-grunt-mdjson-lint`.

Then, update your `Gruntfile.js` to load our tasks and add a configuration option for this plugin.

```js
module.exports = function (grunt) {
    grunt.initConfig({
        mdjsonlint: {
            src: ["./docs/*.md"]
        }
    });
    
    grunt.loadNpmTasks("gpii-grunt-mdjson-lint");
};
```

You should then be able to lint your markdown using a command like `grunt mdjsonlint`.  If all scanned files pass the
lint checks, the task will complete successfully.  If there are linting errors, the filename, line and column of each
failure