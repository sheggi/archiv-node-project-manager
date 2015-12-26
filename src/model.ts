/**
 * Created by sheggi on 24.12.15.
 */
"use strict";

var counter = Math.round(Math.random() * 100);
export class Model {
    _type:string;
    _id:string;
    _link:Model[];

    constructor(data:any = {}) {
        this._id = "#" + counter++; //TODO better ID generator
        this._type = "model";
        this._link = [];
        this.parse(data);
    }


    link(related:Model):void {
        if (this._link.indexOf(related) < 0) {
            this._link.push(related);
        }
    }

    unlink(related:Model):void {
        if (this._link.indexOf(related) >= 0) {
            this._link.splice(this._link.indexOf(related));
        }
    }

    getLinked():Model[] {
        return this._link;
    }


    parse(data:any):void {
        Object.keys(this).map(key => {
            if (data[key] !== undefined && typeof this[key] !== 'function') {
                this[key] = data[key];
            }
        });
    }

    stringify():string {
        return JSON.stringify(this, null, ' ');
    }

    toString():string {
        return JSON.stringify(this);
    }
}