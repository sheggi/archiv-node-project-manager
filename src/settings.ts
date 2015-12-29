/**
 * Created by sheggi on 24.12.15.
 */

// Factory Implementation
export class Settings {
    storagefile:string;
    rootdir:string;
    system:string;
    status:string; // DEBUG(debugging), RELEASE(released)


    private static instance:Settings;

    constructor() {
        this.status = "";
        this.rootdir = "";
        this.system = "";
        this.storagefile = "storagefile.json";

    }

    static get Instace() {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new Settings();
        }
        return this.instance;
    }

    parse(data:any) {
        Object.keys(this).map(key => {
            if (data[key] !== undefined) {
                this[key] = data[key];
            }
        });
    }

    debug() {
        return this.status == "debug";
    }
}
