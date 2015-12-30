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
    if (settings.debug()) {
        console.log("#SAVE PROJECTS");
    }
    list.map(project => {
        Utils.saveProject(project, err => {
            if (settings.debug()) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Projekt " + project._id + " gespeichert");
                }
            }
        });
    })
};

var showAndSaveAll = function (projects:ModelList) {
    if (settings.debug())
        projects.getList().map(proj => {
            console.log("Projekt: ", proj.toString());
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
            Utils.createProjectByPaths(results, callback);
        }
    };
})();

var getProjectPaths = function (callback) {
    Utils.listProjectPaths(settings.rootdir, (err, results) => {
        if (settings.debug()) {
            console.log("###LIST OF PROJECTS");
            results.forEach(function (file) {
                console.log("*", file);
            });
        }
        mergeResults(results, callback);
    });
    Utils.searchProjectPaths(settings.rootdir, settings.storagefile, (err, results) => {
        if (settings.debug())
            console.log("###POSIBLE PROJECTS");
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
    if(err){
        throw err;
    }
    getProjectPaths(showAndSaveAll);

    Utils.saveSettings(settings_file,(err) => {
        if(settings.debug()) {
            if (err) {
                throw err;
            } else {
                console.log("#SETTINGS SAVED")
            }
        }
    });
});