"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const HttpHandler_1 = require("./HttpHandler");
class Controller extends HttpHandler_1.HttpHandler {
    get session() {
        return this.context.session;
    }
    get isAuthenticated() {
        return this.session && this.session.Itens["isAuthenticated"] === true;
    }
    handle() {
        const parsedUrl = url.parse(this.context.request.url);
        const requestPath = parsedUrl.pathname.split('/');
        let method = "index";
        if (requestPath.length >= 3) {
            method = requestPath[2];
        }
        this.context.action = method;
        this.context.controller = this.constructor.name;
        method += this.context.request.method;
        if (this[method] == null || typeof (this[method]) !== 'function') {
            this.NotFoundResponse();
            return;
        }
        this[method]();
    }
    ViewResponse() {
        this.FileResponse(`views/${this.context.controller}/${this.context.action}.html`, "text/html; charset=UTF-8");
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map