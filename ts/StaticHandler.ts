import { HttpHandler } from "./HttpHandler";
import * as http from "http";
import * as fs from 'fs';
import * as path from 'path';
import * as url from "url";
import { AppSettings } from "./AppSettings";

export class StaticHandlerParameters {
    StaticRoot: string;
    TypeMap: { [key: string]: string };
}

export class StaticHandler extends HttpHandler {

    args: StaticHandlerParameters;

    constructor(args?: StaticHandlerParameters) {
        super()
        this.args = AppSettings.StaticHandlerConfig || this.DefaultArgs();
    }

    protected DefaultArgs(): StaticHandlerParameters {
        return {
            StaticRoot: "site",
            TypeMap: {
                '.ico': 'image/x-icon',
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.css': 'text/css',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
                '.svg': 'image/svg+xml',
                '.pdf': 'application/pdf',
                '.doc': 'application/msword'
            }
        };
    }

    handle(req: http.IncomingMessage, res: http.ServerResponse) {
        this.context = { request: req, response :res };
        
        const parsedUrl = url.parse(req.url);
        let pathname = path.normalize(`${this.args.StaticRoot}${parsedUrl.pathname}`);
        let ext = path.parse(pathname).ext;
        let _this = this;
        let relative = path.relative(this.args.StaticRoot, pathname);
        if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
            this.NotFoundResponse();
            return;
        }

        fs.exists(pathname, function (exist) {
            if (!exist) {
                res.statusCode = 404;
                res.end(`Page not found!`);
                return;
            }

            // if is a directory search for index file matching the extention
            if (fs.statSync(pathname).isDirectory()) {
                pathname += '/index.html';
                ext = ".html";
                if (!fs.existsSync(pathname)) {
                    res.statusCode = 404;
                    res.end(`Page not found!`);
                    return;
                }
            }

            // read file from file system
            fs.readFile(pathname, function (err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    res.setHeader('Content-type', _this.args.TypeMap[ext] || 'text/plain');
                    res.end(data);
                }
            });
        });
    }
}