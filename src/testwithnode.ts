/// <reference path='../declarations/node.d.ts' />
import {error} from "util";
/**
 * Created by sheggi on 24.12.15.
 * */
"use strict";

import {OfficeProject} from "./project";
import {ModelList} from "./modellist";
import {Settings} from "./settings";

import {Utils} from "./utils";

import * as fs from "fs";
import * as path from "path";

var settings = Settings.Instace;
var settings_path = __dirname + "/../env/settings.json";


var createProjectByPath = function (paths) {
    console.log("###MERGED");
    var projects = new ModelList();
    paths.forEach(item => {

        if (settings.debug()) console.log("*", item);

        var storagefile = path.resolve(item, settings.storagefile);
        fs.stat(storagefile, (err, stat) => {
            if (stat && stat.isFile()) {

                var data = fs.readFileSync(storagefile);
                var obj = JSON.parse(data);

                var proj = new OfficeProject(obj);
                projects.link(proj);

                console.log("* ", proj.getSummary());

            }
        });


    });
};

var main = function () {
    getSettings(settings => {

        Utils.listProjectPath(settings.rootdir, (err, results) => {
            console.log("###PROJECTS");
            if (settings.debug()) {
                results.forEach(function (file) {
                    //console.log("*", file.substring(file.lastIndexOf(path.sep)+1));
                    console.log("*", file);
                });
            }
            mergeResults(results, createProjectByPath);
        });
        searchProjects(settings.rootdir, (err, results) => {
            console.log("###PATHS");
            results.forEach(function (file) {
                //console.log("*", file.substring(file.lastIndexOf(path.sep)+1));
                if (file.endsWith(settings.storagefile)) { // remove storagefilename from path
                    var index = results.indexOf(file);
                    file = file.substr(0, file.indexOf(settings.storagefile) - 1);
                    results[index] = file;
                }
                if (settings.debug()) console.log("*", file);
            });
            mergeResults(results, createProjectByPath);
        });

        var projects = new ModelList();

        var proj_1 = new OfficeProject({
            name: "1Typescript Project",
            description: "A Project Directory",
            mainDir: "type/"
        });
        projects.add(proj_1);
        var proj_2 = new OfficeProject({
            name: "2E-Office",
            description: "Organize Live with a JS-Solution",
            maiDir: "office/"
        });
        projects.add(proj_2);
        var proj_3 = new OfficeProject({
            name: "3Test",
            description: "We want to see what is going to happen",
            mainDir: "test/"
        });
        projects.add(proj_3);


        proj_2.link(proj_1);

        var sub_projects = new ModelList();
        sub_projects.add(proj_1);
        sub_projects.add(proj_2);

        proj_3.addDir("subdir/");
        proj_3.link(sub_projects);

        //saveAll(projects.getAll(), settings);
    });
};

// helper function
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var mergeResults = (function () {
    var internalcounter = 0;
    var results = [];

    return function (result, callback) {
        internalcounter++;
        result.forEach(item => {
            if (results.indexOf(item) < 0) {
                results.push(item);
            }
        });

        if (internalcounter >= 2) {
            callback(results);
        }
    };
})();


var saveAll = function (list, settings) {
    list.map(project => {
        var path = settings.rootdir + project.mainDir + settings.storagefile;
        var data = JSON.stringify(project, null, ' ');
        fs.writeFile(path, data, err => {
            if (err) {
                console.error(err);
            }
            if (settings.status == 'debug') {
                console.log("Projekt " + project._id + " gespeichert");
            }
        });

    })
};

var getSettings = function (callback) {
    fs.readFile(settings_path, function (err, data) {
        if (err) {
            throw err;
        }

        var settings_data = JSON.parse(data.toString());
        settings.loadSettings(settings_data);

        callback(settings);
    });
};

var searchProjects = function (srcPath, callback) {
    Utils.walk(srcPath, callback, function (state, file) {
        if (!state.isDirectory() &&
            file.endsWith(settings.storagefile)) {
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
};
main();