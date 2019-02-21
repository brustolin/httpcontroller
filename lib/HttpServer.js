"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const HttpHandler_1 = require("./HttpHandler");
const HttpSession_1 = require("./HttpSession");
const HttpContext_1 = require("./HttpContext");
const Cookies = require("cookies");
/**
* Http server
*/
class HttpServer {
    constructor(RouteMap, options) {
        this.middlewares = new Array();
        if (typeof (RouteMap) === "string" || RouteMap.prototype instanceof HttpHandler_1.HttpHandler) {
            this.defaultHandler = RouteMap;
        }
        else {
            this.routes = RouteMap;
            this.defaultHandler = RouteMap["default"];
        }
        this.options = options || {};
        this.Sessions = new HttpSession_1.SessionManager(this.options.Sessions);
        if (this.options.useSession !== false)
            this.addMiddleware(this.Sessions);
        if (this.options.isSSL) {
            let httpsOptions = {
                key: fs.readFileSync(this.options.key),
                cert: fs.readFileSync(this.options.cert)
            };
            this.server = https.createServer(httpsOptions, (req, res) => this.generalHandler(req, res));
        }
        else {
            this.server = http.createServer((req, res) => this.generalHandler(req, res));
        }
    }
    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }
    removeMiddleware(middleware) {
        let index = this.middlewares.indexOf(middleware);
        if (index >= 0) {
            this.middlewares.splice(index, 1);
        }
    }
    allMiddlewares() {
        return this.middlewares.map(p => p);
    }
    start() {
        this.server.listen(this.options.port || 80, function () { });
    }
    async generalHandler(req, res) {
        if (this.options && this.options.verbose === true)
            console.log(`${req.method} ${req.url}`);
        let context = new HttpContext_1.HttpContext();
        context.request = req;
        context.response = res;
        context.cookies = new Cookies(req, res);
        for (let mw of this.middlewares) {
            if (typeof (mw) === "function")
                await mw(context);
            else if (mw && mw.process && typeof (mw.process) === "function")
                await mw.process(context);
            if (res.finished)
                return;
        }
        const parsedUrl = url.parse(req.url);
        const requestPath = parsedUrl.pathname.split('/');
        let route;
        if (requestPath.length > 1 && this.routes) {
            context.controller = requestPath[1].length > 0 ? requestPath[1] : "root";
            route = this.routes[requestPath[1]] || this.defaultHandler;
        }
        else {
            context.controller = "default";
            route = this.defaultHandler;
        }
        if (route) {
            if (route.prototype instanceof HttpHandler_1.HttpHandler) {
                let routeObject = new route();
                await routeObject.process(context);
                if (!res.finished)
                    res.end();
                return;
            }
            else if (typeof (route) === "function") {
                route = route();
            }
            if (typeof route === "string" || route instanceof Buffer) {
                res.end(route);
            }
            else {
                res.end(JSON.stringify(route));
            }
            return;
        }
        res.statusCode = 404;
        res.end();
    }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=HttpServer.js.map