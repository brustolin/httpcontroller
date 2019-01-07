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
    handle(req, res) {
        const parsedUrl = url.parse(req.url);
        let pathname = `${this.args.StaticRoot}${parsedUrl.pathname}`;
        let ext = path.parse(pathname).ext;
        let _this = this;
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
                }
                else {
                    res.setHeader('Content-type', _this.args.TypeMap[ext] || 'text/plain');
                    res.end(data);
                }
            });
        });
    }
}
exports.StaticHandler = StaticHandler;
//# sourceMappingURL=StaticHandler.js.map