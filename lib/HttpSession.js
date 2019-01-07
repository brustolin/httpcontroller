"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tools_1 = require("./Tools");
class SessionManager {
    constructor() {
        this.Sessions = {};
    }
    newSession() {
        let res = new HttpSession();
        res.Token = Tools_1.GenerateToken(32);
        exports.Sessions[res.Token] = res;
        return res;
    }
    session(token) {
        let res = exports.Sessions[token] || this.newSession();
        res.LastRequest = new Date();
        return res;
    }
}
exports.Sessions = new SessionManager();
class HttpSession {
    constructor() {
        this.Itens = {};
        this.SessionStart = new Date();
    }
}
exports.HttpSession = HttpSession;
//# sourceMappingURL=HttpSession.js.map