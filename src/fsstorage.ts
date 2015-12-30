/**
 * Created by Joel on 30.12.2015.
 */

import * as fs from "fs";
import * as path from "path";

export module FSStorage {
    export function save(file:string, data:string, callback:(Error)=>void):void {
        fs.writeFile(file, data, err => {
            if (typeof callback === 'function') {
                callback(err);
            } else {
                throw "no call back defined";
            }
        });
    } // end of function

    export function load(file:string, callback:(Error, Object)=>void):void {
        fs.stat(file, (err, stat) => {
            if (stat && stat.isFile()) {
                fs.readFile(file, (err, data) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, JSON.parse(data));
                    }
                });
            } else {
                if (callback !== undefined) {
                    callback("storagefile not found: " + file, null);
                }
            }
        });
    } // end of function
}