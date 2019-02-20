"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tools_1 = require("./Tools");
const HttpHandler_1 = require("./HttpHandler");
class SessionManager extends HttpHandler_1.HttpHandler {
    constructor(options) {
        super();
        this.Sessions = {};
        this.options = options || {};
        if (!this.options.sessionDuration || typeof (this.options.sessionDuration) !== "number")
            this.options.sessionDuration = 1200000;
        if (!this.options.sessionCookie)
            this.options.sessionCookie = "__HCST";
        setInterval(() => this.cleanSessions(), 60000);
    }
    cleanSessions() {
        let now = new Date();
        for (let a in this.Sessions) {
            if (Number(now) - Number(this.Sessions[a].LastRequest) > this.options.cookieDuration) {
                delete (this.Sessions[a]);
            }
        }
    }
    handle() {
        this.context.session = this.session(this.context.cookies.get(this.options.sessionCookie));
        this.context.cookies.set(this.options.sessionCookie, this.context.session.Token);
    }
    newSession() {
        let res = new HttpSession();
        do {
            res.Token = Tools_1.GenerateToken(32);
        } while (this.Sessions[res.Token] != null);
        this.Sessions[res.Token] = res;
        return res;
    }
    session(token) {
        let res = this.Sessions[token] || this.newSession();
        res.LastRequest = new Date();
        return res;
    }
}
exports.SessionManager = SessionManager;
class HttpSession {
    constructor() {
        this.Itens = {};
        this.SessionStart = new Date();
    }
}
exports.HttpSession = HttpSession;
//# sourceMappingURL=HttpSession.js.map