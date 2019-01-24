"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tools_1 = require("./Tools");
class SessionManager {
    constructor(options) {
        this.Sessions = {};
        this.options = options || {};
        if (!this.options.cookieDuration || typeof (this.options.cookieDuration) !== "number")
            this.options.cookieDuration = 1200000;
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
    newSession() {
        let res = new HttpSession();
        res.Token = Tools_1.GenerateToken(32);
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