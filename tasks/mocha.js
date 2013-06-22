// Generated by CoffeeScript 1.6.2
/*
  grunt-mocha
  https://github.com/jcarnegie/grunt-mocha
 
  Copyright (c) 2013 Jeff Carnegie
  Licensed under the MIT license.
*/


(function() {
  var Base, Mocha, cwd, exists, fs, handler, path, requirejs,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mocha = require("mocha");

  requirejs = require("requirejs");

  path = require("path");

  fs = require("fs");

  Base = Mocha.reporters.Base;

  cwd = process.cwd();

  exists = fs.existsSync || path.existsSync;

  handler = {};

  module.exports = function(grunt) {
    module.paths.push(cwd, path.join(cwd, "node_modules"));
    return grunt.registerMultiTask("mocha", "Run server-side Mocha tests as RequireJS modules", function() {
      var async, mocha, option, options, output, run, _i, _len, _stdout;

      options = this.options({
        asyncOnly: false,
        bail: false,
        coverage: false,
        globals: [],
        grep: false,
        growl: false,
        ignoreLeaks: false,
        invert: false,
        reporter: "list",
        require: [],
        slow: 75,
        timeout: 2000,
        ui: "bdd",
        rjsConfig: {},
        env: "test"
      });
      process.env.NODE_ENV = options.env;
      mocha = new Mocha();
      async = this.async();
      _stdout = process.stdout.write;
      output = null;
      mocha.ui(options.ui);
      mocha.reporter(options.reporter);
      mocha.suite.bail(options.bail);
      if (options.timeout) {
        mocha.suite.timeout(options.timeout);
      }
      if (options.grep) {
        mocha.grep(new RegExp(options.grep));
      }
      if (options.growl) {
        mocha.growl();
      }
      if (options.invert) {
        mocha.invert();
      }
      if (options.ignoreLeaks) {
        mocha.ignoreLeaks();
      }
      if (options.asyncOnly) {
        mocha.asyncOnly();
      }
      if (options.colors === true) {
        Base.useColors = true;
      }
      if (options.colors === false) {
        Base.useColors = false;
      }
      mocha.globals(options.globals);
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        if (options.hasOwnProperty(option)) {
          if (__indexOf.call(handler, option) >= 0) {
            handler[option].call(this, options[option]);
          }
        }
      }
      if (!options.rjsConfig) {
        this.files.forEach(function(f) {
          return f.src.filter(function(file) {
            return mocha.addFile(file);
          });
        });
      }
      if (options.reporter === "js-cov" || options.reporter === "html-cov") {
        if (!options.coverage) {
          return grunt.fail.warn("Coverage option not set.");
        }
        if (options.coverage.output) {
          output = fs.createWriteStream(options.coverage.output, {
            flags: "w"
          });
        } else {
          output = fs.createWriteStream("coverage.html", {
            flags: "w"
          });
        }
        if (options.coverage.env) {
          process.env[options.coverage.env] = 1;
        } else {
          process.env["COV"] = 1;
        }
        process.stdout.write = function(chunk, encoding, cb) {
          return output.write(chunk, encoding, cb);
        };
      }
      run = function() {
        return mocha.run(function(failures) {
          if (output) {
            output.end();
          }
          process.stdout.write = _stdout;
          if (failures) {
            grunt.fail.warn("Mocha tests failed.");
          }
          return async();
        });
      };
      if (options.rjsConfig) {
        mocha.suite.emit("pre-require", global, "", mocha);
        options.rjsConfig.deps = this.filesSrc;
        requirejs.config(options.rjsConfig);
        return requirejs([], function() {
          return run();
        });
      } else {
        return run();
      }
    });
  };

  handler.require = function(f) {
    var files;

    files = [].concat(f);
    return files.forEach(function(file) {
      if (exists(file) || exists(file + ".js")) {
        return require(path.join(cwd, file));
      } else {
        return require(file);
      }
    });
  };

}).call(this);
