export namespace frontend {
	
	export class MessageDialogOptions {
	    Type: string;
	    Title: string;
	    Message: string;
	    Buttons: string[];
	    DefaultButton: string;
	    CancelButton: string;
	    Icon: number[];
	
	    static createFrom(source: any = {}) {
	        return new MessageDialogOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Type = source["Type"];
	        this.Title = source["Title"];
	        this.Message = source["Message"];
	        this.Buttons = source["Buttons"];
	        this.DefaultButton = source["DefaultButton"];
	        this.CancelButton = source["CancelButton"];
	        this.Icon = source["Icon"];
	    }
	}

}

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
	export class Atomdir {
	    Id: string;
	    Name: string;
	    Files: FileInfo[];
	
	    static createFrom(source: any = {}) {
	        return new Atomdir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.Files = this.convertValues(source["Files"], FileInfo);
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
	
	export class Notdir {
	    Id: string;
	    Name: string;
	    Atomdirs: Atomdir[];
	    Files: FileInfo[];
	    Path: string;
	
	    static createFrom(source: any = {}) {
	        return new Notdir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.Atomdirs = this.convertValues(source["Atomdirs"], Atomdir);
	        this.Files = this.convertValues(source["Files"], FileInfo);
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
	export class NotdirBase {
	    Id: string;
	    Name: string;
	    Path: string;
	    // Go type: time
	    CreatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new NotdirBase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.Path = source["Path"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
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

