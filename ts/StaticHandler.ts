import { HttpHandler } from "./HttpHandler";
import * as http from "http";
import * as fs from 'fs';
import * as path from 'path';
import * as url from "url";
import { AppSettings } from "./AppSettings";
import { HttpContext } from "./HttpContext";

export class StaticHandlerParameters {
    StaticRoot: string;
    ImplicitHtml: Boolean;
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
            ImplicitHtml: false,
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

    handle(context: HttpContext) {
        this.context = context;

        const parsedUrl = url.parse(this.context.request.url);
        let pathname = path.normalize(`${this.args.StaticRoot}${parsedUrl.pathname}`);
        let ext = path.parse(pathname).ext;
        let _this = this;
        let relative = path.relative(this.args.StaticRoot, pathname);
        if (relative == null || relative.startsWith('..') || path.isAbsolute(relative)) {
            this.NotFoundResponse();
            return;
        }

        if (!fs.existsSync(pathname)) {
            if (this.args.ImplicitHtml && ext === "") {
                pathname += ".html";
                if (!fs.existsSync(pathname)) {
                    this.context.response.statusCode = 404;
                    this.context.response.end(`Page not found!`);
                    return;
                }
                ext = ".html";
            } else {
                this.context.response.statusCode = 404;
                this.context.response.end(`Page not found!`);
                return;
            }
        }

        // if is a directory search for index file matching the extention
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
            ext = ".html";
            if (!fs.existsSync(pathname)) {
                this.context.response.statusCode = 404;
                this.context.response.end(`Page not found!`);
                return;
            }
        }

        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                this.context.response.statusCode = 500;
                this.context.response.end(`Error getting the file: ${err}.`);
            } else {
                this.context.response.setHeader('Content-type', _this.args.TypeMap[ext] || 'text/plain');
                this.context.response.end(data);
            }
        });
    }
}