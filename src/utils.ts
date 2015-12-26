/**
 * Created by sheggi on 25.12.15.
 */
"use strict";
import * as fs from "fs";
import * as path from "path";

// helper function
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
export module Utils {
// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
    export function listProjectPath(dir:string, done:Function) {
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function (file) {
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {

                        if (file.indexOf(path.sep + ".") <= 0 && file.indexOf("Projekte") + 8 >= file.lastIndexOf(path.sep) && !file.endsWith("Projekte")) { // check if path starts with '.'
                            results.push(file);
                        }

                        listProjectPath(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        var fileName = path.basename(file);
                        if (fileName == ".office") {
                            var directory = path.dirname(file);
                            if (results.indexOf(directory) <= 0) {
                                results.push(directory);
                            }
                        }
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }

    export function walk(dir, done, condition) {
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function (file) {
                var fileName = file;
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {

                    if (condition(stat, file)) {
                        results.push(file);
                    }

                    if (stat && stat.isDirectory()) {
                        if (fileName[0] != ".") { // ignore .xxxxx folders
                            walk(file, function (err, res) {
                                results = results.concat(res);
                                if (!--pending) done(null, results);
                            }, condition);
                        } else {
                            if (!--pending) done(null, results);
                        }
                    } else {
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }
}