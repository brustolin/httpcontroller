"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const HttpHandler_1 = require("./HttpHandler");
const HttpSession_1 = require("./HttpSession");
const Cookies = require("cookies");
/**
* Http server
*/
class HttpServer {
    constructor(RouteMap, options) {
        this.Sessions = new HttpSession_1.SessionManager();
        if (typeof (RouteMap) === "string" || RouteMap.prototype instanceof HttpHandler_1.HttpHandler) {
            this.defaultHandler = RouteMap;
        }
        else {
            this.routes = RouteMap;
            this.defaultHandler = RouteMap["default"];
        }
        this.options = options || {};
        if (!this.options.sessionCookie)
            this.options.sessionCookie = "HCST";
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
    start() {
        this.server.listen(this.options.port || 80, function () { });
    }
    generalHandler(req, res) {
        if (this.options && this.options.verbose === true)
            console.log(`${req.method} ${req.url}`);
        const parsedUrl = url.parse(req.url);
        const requestPath = parsedUrl.pathname.split('/');
        let route;
        if (requestPath.length > 1 && this.routes) {
            route = this.routes[requestPath[1]] || this.defaultHandler;
        }
        else {
            route = this.defaultHandler;
        }
        if (route) {
            if (route.prototype instanceof HttpHandler_1.HttpHandler) {
                let routeObject = new route();
                var cookies = new Cookies(req, res);
                routeObject.session = this.Sessions.session(cookies.get(this.options.sessionCookie));
                cookies.set(this.options.sessionCookie, routeObject.session.Token);
                routeObject.handle(req, res);
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