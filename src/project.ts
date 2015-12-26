/**
 * Created by sheggi on 25.12.15.
 */
"use strict";

import {Model} from "./model";

export class Project extends Model {
    name:string;
    description:string;
    status:string;

    constructor(data:any = {}) {
        this._type = "project";
        this.status = "new";
        super(data);
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
    mainDir:string;

    constructor(data:any = {}) {
        this.mainDir = "";
        super(data);
    }

    /*constructor(name:string, description:string, mainDir:string) {
     super(name, description);
     this.mainDir = mainDir;
     }*/

}


