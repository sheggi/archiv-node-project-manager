"use strict";
export class Project {
    _type:String;
    name:String;
    description:String;

    constructor(name:String, description:String) {
        this._type = "project";
        this.name = name;
        this.description = description;
    }

    getPresentation() {
        return this.name + "\n" + this.description;
    }

}

export class ProjectList {
    list:Project[];

    constructor() {
        this.list = [];
    }

    add(project:Project) {
        this.list.push(project);
    }

    remove(project:Project) {
        this.list.splice(this.list.indexOf(project));
    }

    getAll() {
        return this.list;
    }
}



