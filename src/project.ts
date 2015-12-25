/**
 * Created by sheggi on 25.12.15.
 */
"use strict";

import {Model} from "./model";

export class Project extends Model {
    name:String;
    description:String;
    status:String;

    constructor(name:String, description:String) {
        super();
        this._type = "project";
        this.status = "new";
        this.name = name;
        this.description = description;
    }

    getSummary() {
        return "Project: " + this.name +
            "\nId: " + this._id +
            "\nDescription: " + this.description +
            "\nStatus: " + this.status +
            "\nLinks: " + this._link.length;
    }
}

export class OfficeProject extends Project {
    mainDir:String;
    relDir:String[];

    constructor(proj:OfficeProject) {
        super(proj.name, proj.description);
        this.relDir = [];
        this.mainDir = proj.mainDir;
        Object.keys(this).map(key => {
            if (proj[key] !== undefined && typeof this[key] !== 'function') {
                this[key] = proj[key];
            }
        });
    }

    /*constructor(name:String, description:String, mainDir:String) {
        super(name, description);
        this.relDir = [];
        this.mainDir = mainDir;
     }*/


    addDir(dir:String) {
        this.relDir.push(dir);
    }
}




