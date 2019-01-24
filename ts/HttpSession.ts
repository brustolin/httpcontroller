import { GenerateToken } from "./Tools";

export class SessionManager {
    Sessions : { [key:string] : HttpSession }
    private options : any;


    constructor(options?) {
        this.Sessions = {};
        this.options = options || {} ;
        if (!this.options.cookieDuration || typeof(this.options.cookieDuration) !== "number") this.options.cookieDuration = 1200000;
        setInterval(() => this.cleanSessions(), 60000);
    }

    private cleanSessions() {
        let now = new Date();
        for (let a in this.Sessions) {
            if (Number(now) - Number(this.Sessions[a].LastRequest) > this.options.cookieDuration) {
                delete(this.Sessions[a]);
            }
        }
    }

    newSession() : HttpSession {
        let res = new HttpSession();
        res.Token = GenerateToken(32);
        this.Sessions[res.Token] = res;
        return res;
    }

    session(token: string) : HttpSession {
        let res = this.Sessions[token] || this.newSession();
        res.LastRequest = new Date();
        return res;
    }
}

export class HttpSession {
    SessionStart : Date;
    LastRequest  : Date;
    Token        : string;
    Itens : { [key:string] : any };

    constructor() {
        this.Itens = {};
        this.SessionStart = new Date();
    }
}