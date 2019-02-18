import { GenerateToken } from "./Tools";

export class SessionManager {
    Sessions : { [key:string] : HttpSession }
    private options : any;

    constructor(options?) {
        this.Sessions = {};
        this.options = options || {} ;
        if (!this.options.sessionDuration || typeof(this.options.sessionDuration) !== "number") this.options.sessionDuration = 1200000;
        if (!this.options.sessionCookie) this.options.sessionCookie = "__HCST";

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

    process(context) {
        context.session = this.session(context.cookies.get(this.options.sessionCookie));
        context.cookies.set(this.options.sessionCookie, context.session.Token);
    }

    newSession() : HttpSession {
        let res = new HttpSession();
        do {
            res.Token = GenerateToken(32);
        } while(this.Sessions[res.Token] != null);
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