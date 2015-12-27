
/**
 * Created by sheggi on 25.12.15.
 */
"use strict";
import * as fs from "fs";
import * as path from "path";
import {Settings} from "./settings";
import {OfficeProject} from "./project";
import {ModelList} from "./modellist";

// helper function
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
export module Utils {
// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
    export function listProjectPath(dir:string, done:Function):void {
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
                        if (fileName == Settings.Instace.storagefile) {
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
    } // end of function

    export function walk(dir:string, done:Function, condition:Function):void {
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
    }// end of function


    export function searchProjects(root_path, project_file, callback):string {
        Utils.walk(root_path, callback, function (state, file) {
            if (!state.isDirectory() &&
                file.endsWith(project_file)) {
                return true;
            }

            if (state && !state.isDirectory()) {
                return false;
            }
            if (file.toLowerCase().lastIndexOf("projekte") > file.lastIndexOf(path.sep) || file.toLowerCase().lastIndexOf("projects") > file.lastIndexOf(path.sep)) {
                return false;
            }
            return !!(file.toLowerCase().lastIndexOf("projekt") > file.lastIndexOf(path.sep) || file.toLowerCase().lastIndexOf("project") > file.lastIndexOf(path.sep));

        });
    } // end of function


    var project_count = 0;

    export function createProjectByPath(settings:Settings, paths:string[], callback:Function) {
        if (settings.debug())
            console.log("###MERGED");
        var projects = new ModelList();
        paths.forEach(dir => {

            if (settings.debug())
                console.log("*", dir);

            var storagefile = path.resolve(dir, settings.storagefile);
            fs.stat(storagefile, (err, stat) => {
                if (stat && stat.isFile()) {

                    var data = fs.readFileSync(storagefile);
                    var obj = JSON.parse(data);

                    var proj = new OfficeProject(obj);
                    projects.add(proj);

                } else {

                    var proj = new OfficeProject();
                    proj.name = dir.slice(dir.lastIndexOf(path.sep) + 1);
                    proj.description = "generated by path";
                    proj.mainDir = path.relative(settings.rootdir, dir);
                    console.log("* maindir: ", proj.mainDir);


                    projects.add(proj);
                }
                project_count++;
                if (project_count >= paths.length) {
                    callback(projects);
                }
            });


        });
    } // end of function

    export function saveProject(project:OfficeProject) {
        var settings = Settings.Instace;
        var dir = path.resolve(settings.rootdir, project.mainDir, settings.storagefile);
        var data = project.stringify();
        fs.writeFile(dir, data, err => {
            if (err) {
                console.error(err);
            }
            if (settings.status == 'debug') {
                console.log("Projekt " + project._id + " gespeichert");
            }
        });
    } // end of function

    export function loadProject(dir:string, callback:Function) {
        var settings = Settings.Instace;
        var storagefile = path.resolve(dir, settings.storagefile);
        fs.stat(storagefile, (err, stat) => {
            if (stat && stat.isFile()) {

                var proj = new OfficeProject();
                var data = fs.readFileSync(storagefile);
                var obj = JSON.parse(data);

                proj.parse(obj);

                if (callback !== undefined) {
                    callback(null, proj);
                }
            } else {

                if (callback !== undefined) {
                    callback("storage file not found: " + storagefile, null);
                }
            }

        });
    }

}// end of module