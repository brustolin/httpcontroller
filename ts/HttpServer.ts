import * as http from "http";
import * as https from "https";
import * as url from "url";
import * as fs from "fs";
import { HttpHandler } from "./HttpHandler";

/**
* Http server
*/
export class HttpServer {

    server: http.Server | https.Server;
    routes: { [key: string]: typeof HttpHandler };
    options: any;

    defaultHandler?: typeof HttpHandler;

    constructor(RouteMap?: { [key: string]: typeof HttpHandler | any }, options?) {
        if (typeof(RouteMap) === "string") {
            this.defaultHandler = RouteMap;
        } else {
            this.routes = RouteMap as { [key: string]: typeof HttpHandler };
            this.defaultHandler = RouteMap["default"];
        }

        this.options = options || {};
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

    start() {
        this.server.listen(this.options.port || 80, function () { });
    }

    private generalHandler(req: http.IncomingMessage, res: http.ServerResponse) {
        console.log(`${req.method} ${req.url}`);

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
                new route().handle(req,res);
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