import { GenerateToken } from "./Tools";

class SessionManager {
    Sessions : { [key:string] : HttpSession }
    constructor() {
        this.Sessions = {};
    }

    newSession() : HttpSession {
        let res = new HttpSession();
        res.Token = GenerateToken(32);
        Sessions[res.Token] = res;
        return res;
    }

    session(token: string) : HttpSession {
        let res = Sessions[token] || this.newSession();
        res.LastRequest = new Date();
        return res;
    }
}

export const Sessions = new SessionManager();

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