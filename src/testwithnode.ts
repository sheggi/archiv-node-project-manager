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
var settings_file = path.resolve(__dirname, "../env/settings.json");

// helper function
var endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var saveAll = function (list) {
    list.map(project => {
        Utils.saveProject(project, err => {
            if (err) {
                console.error(err);
            }
            if (settings.status == 'debug') {
                console.log("Projekt " + project._id + " gespeichert");
            }
        });
    })
};

var finishup = function (projects:ModelList) {
    if (settings.debug())
        projects.getList().map(proj => {
            console.log("Projekt: ", proj);
        });
    saveAll(projects.getList());
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
            Utils.createProjectByPath(results, callback);
        }
    };
})();

var getProjectPaths = function (callback) {
    Utils.listProjectPath(settings.rootdir, (err, results) => {
        if (settings.debug()) {
            console.log("###PROJECTS");
            results.forEach(function (file) {
                console.log("*", file);
            });
        }
        mergeResults(results, callback);
    });
    Utils.searchProjects(settings.rootdir, settings.storagefile, (err, results) => {
        if (settings.debug())
            console.log("###PATHS");
        results.forEach(function (file) {
            if (endsWith.call(file, settings.storagefile)) { // remove storagefilename from path
                var index = results.indexOf(file);
                file = file.substr(0, file.indexOf(settings.storagefile) - 1);
                results[index] = file;
            }
            if (settings.debug()) console.log("*", file);
        });
        mergeResults(results, callback);
    });
};

// Start Program
Utils.loadSettings(settings_file, (err, settings) => {
    getProjectPaths(finishup);
});