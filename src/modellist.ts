/**
 * Created by sheggi on 25.12.15.
 */
"use strict";

import {Model} from "./model";

export class ModelList extends Model {
    list:Model[];

    constructor() {
        super();
        this.list = [];
        this._type = "list";
    }

    add(project:Model) {
        this.list.push(project);
    }

    remove(project:Model) {
        this.list.splice(this.list.indexOf(project));
    }

    getAll() {
        return this.list;
    }

}