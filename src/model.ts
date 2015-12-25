/**
 * Created by sheggi on 24.12.15.
 */
var counter = 0;
export class Model {
    _type:String;
    _id:String;
    _link:Model[];

    constructor() {
        this._id = "#" + counter++; //TODO better ID generator
        this._type = "model";
        this._link = [];
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

    getLinked() {
        return this._link;
    }
}