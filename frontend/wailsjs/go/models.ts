export namespace main {
	
	export class FileInfo {
	    Id: string;
	    Name: string;
	    Size: number;
	    Mode: number;
	    // Go type: time
	    ModTime: any;
	    IsDir: boolean;
	    Path: string;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.Size = source["Size"];
	        this.Mode = source["Mode"];
	        this.ModTime = this.convertValues(source["ModTime"], null);
	        this.IsDir = source["IsDir"];
	        this.Path = source["Path"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

