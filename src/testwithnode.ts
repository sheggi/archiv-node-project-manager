/// <reference path='../declarations/node.d.ts' />

/**
 * Created by sheggi on 24.12.15.
 * */

"use strict";
import {Project} from "./project";
import {ProjectList} from "./project";

var projects = new ProjectList();
projects.add(new Project("Typescript Project", "A Project Directory"));
projects.add(new Project("E-Office", "Organize Live with a JS-Solution"));
projects.add(new Project("Test", "We want to see what is going to happen"));

console.log("Projects in the list:");
projects.getAll().forEach(project => {
    console.log("# Projekt #",project);
});