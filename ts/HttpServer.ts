import * as http from "http";
import * as https from "https";
import * as url from "url";
import * as fs from "fs";
import { HttpHandler } from "./HttpHandler";
import { SessionManager } from "./HttpSession";
import { HttpContext } from "./HttpContext";
import * as Cookies from "cookies";


export type HttpServerMiddlewareFunction = (context: HttpContext) => void;

/**
* Http server
*/
export class HttpServer {

    private Sessions : SessionManager;
    private middlewares = new Array();
    server: http.Server | https.Server;
    routes: { [key: string]: any };
    options: any;

    defaultHandler?: any;

    constructor(RouteMap?: any, options?) {
        if (typeof(RouteMap) === "string" || RouteMap.prototype instanceof HttpHandler) {
            this.defaultHandler = RouteMap;
        } else {
            this.routes = RouteMap as { [key: string]: typeof HttpHandler };
            this.defaultHandler = RouteMap["default"];
        }

        this.options = options || {};
        this.Sessions = new SessionManager(this.options.Sessions);
        if (this.options.useSession !== false) this.addMiddleware(this.Sessions);
        
        if (this.options.isSSL) {
            let httpsOptions = {
                key: fs.readFileSync(this.options.key),
                cert: fs.readFileSync(this.options.cert)
            };
            this.server = https.createServer(httpsOptions,(req,res) => this.generalHandler(req, res));
        } else {
            this.server = http.createServer((req,res) => this.generalHandler(req,res));
        }
    }

    addMiddleware(middleware : HttpServerMiddlewareFunction | HttpHandler ) {
        this.middlewares.push(middleware);
    }

    removeMiddleware(middleware) {
        let index = this.middlewares.indexOf(middleware);
        if (index>= 0) {
            this.middlewares.splice(index,1);
        }
    }

    allMiddlewares() {
        return this.middlewares.map(p=>p);
    }

    start() {
        this.server.listen(this.options.port || 80, function () { });
    }

    private generalHandler(req: http.IncomingMessage, res: http.ServerResponse) {
        if (this.options && this.options.verbose === true)
            console.log(`${req.method} ${req.url}`);

        let context = new HttpContext();
        context.request = req;
        context.response = res;
        context.cookies = new Cookies(req, res);

        for (let mw of this.middlewares) {
            if (typeof(mw) === "function") mw(context);
            else if (mw && mw.process) mw.process(context);
            if (res.finished) return;
        }

        const parsedUrl = url.parse(req.url);
        const requestPath = parsedUrl.pathname.split('/');
        let route;
        if (requestPath.length > 1 && this.routes) {
            route = this.routes[requestPath[1]] || this.defaultHandler;
        } else {
            route = this.defaultHandler;
        }
        
        if (route) {
            if (route.prototype instanceof HttpHandler) {
                let routeObject = new route();
                routeObject.process(context);
                return;
            } else if(typeof(route) === "function") {
                route = route();
            }
            
            if (typeof route === "string" || route instanceof Buffer) {
                res.end(route);
            } else {
                res.end(JSON.stringify(route));
            }

            return;
        }

        res.statusCode = 404;
        res.end();
    }
}