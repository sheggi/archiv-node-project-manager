/// <reference path='../declarations/node.d.ts' />
/**
 * Created by sheggi on 24.12.15.
 * */

"use strict";
import {OfficeProject} from "./project";
import {ModelList} from "./modellist";
import {Settings} from "./settings";

import * as fs from "fs";

var settings = Settings.Instace;
var settings_path = __dirname + "/../env/settings.json";


var exec = function (settings) {

    var projects = new ModelList();

    var proj_1 = new OfficeProject("1Typescript Project", "A Project Directory", "type/");
    projects.add(proj_1);
    var proj_2 = new OfficeProject("2E-Office", "Organize Live with a JS-Solution", "office/");
    projects.add(proj_2);
    var proj_3 = new OfficeProject("3Test", "We want to see what is going to happen", "test/");
    projects.add(proj_3);


    proj_2.link(proj_1);

    var sub_projects = new ModelList();
    sub_projects.add(proj_1);
    sub_projects.add(proj_2);

    proj_3.addDir("subdir/");
    proj_3.link(sub_projects);

    saveAll(projects.getAll(), settings);

};

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


fs.readFile(settings_path, function (err, data) {
    if (err) {
        throw err;
    }

    var settings_data = JSON.parse(data.toString());
    settings.loadSettings(settings_data);

    exec(settings);
});