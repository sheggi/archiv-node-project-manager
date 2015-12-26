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
var settings_path = path.resolve(__dirname, "../env/settings.json");


// helper function
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}



var finishup = function (projects:ModelList) {
    if (settings.debug())
        projects.getAll().map(proj => {
            console.log("Projekt: ", proj);
        });
    saveAll(projects.getAll(), settings);
};


var main = function () {
    getSettings(settings => {

        Utils.listProjectPath(settings.rootdir, (err, results) => {
            if (settings.debug())
                console.log("###PROJECTS");
            if (settings.debug()) {
                results.forEach(function (file) {
                    //console.log("*", file.substring(file.lastIndexOf(path.sep)+1));
                    console.log("*", file);
                });
            }
            mergeResults(results, Utils.createProjectByPath);
        });
        Utils.searchProjects(settings.rootdir, settings.storagefile, (err, results) => {
            if (settings.debug())
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
            mergeResults(results, Utils.createProjectByPath);
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
            mainDir: "office/"
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

        proj_3.link(sub_projects);

        //saveAll(projects.getAll(), settings);
    });
};


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
            callback(settings, results, finishup);
        }
    };
})();


var saveAll = function (list, settings) {
    list.map(project => {
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



main();