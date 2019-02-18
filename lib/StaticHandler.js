"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpHandler_1 = require("./HttpHandler");
const fs = require("fs");
const path = require("path");
const url = require("url");
const AppSettings_1 = require("./AppSettings");
class StaticHandlerParameters {
}
exports.StaticHandlerParameters = StaticHandlerParameters;
class StaticHandler extends HttpHandler_1.HttpHandler {
    constructor(args) {
        super();
        this.args = AppSettings_1.AppSettings.StaticHandlerConfig || this.DefaultArgs();
    }
    DefaultArgs() {
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
    handle(context) {
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
            }
            else {
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
            }
            else {
                this.context.response.setHeader('Content-type', _this.args.TypeMap[ext] || 'text/plain');
                this.context.response.end(data);
            }
        });
    }
}
exports.StaticHandler = StaticHandler;
//# sourceMappingURL=StaticHandler.js.map