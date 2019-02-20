"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");
class HttpHandler {
    async process(context) {
        try {
            this.context = context;
            if (this.preHandlers != null) {
                for (let pre of this.preHandlers) {
                    await pre.process(context);
                    if (context.response.finished)
                        return;
                }
            }
            await this.handle();
        }
        catch (ex) {
            this.ErrorResponse();
        }
    }
    JsonResponse(data) {
        this.ContentResponse(JSON.stringify(data), "application/json; charset=UTF-8");
    }
    ContentResponse(content, contentType = "text/html; charset=UTF-8") {
        //todo: compression
        this.context.response.setHeader('Content-type', contentType);
        this.context.response.end(content);
    }
    NotFoundResponse() {
        this.context.response.statusCode = 404;
        this.context.response.end();
    }
    RedirectResponse(location) {
        this.context.response.setHeader('location', location);
        this.context.response.statusCode = 302;
        this.context.response.end();
    }
    ErrorResponse() {
        this.context.response.statusCode = 500;
        this.context.response.end();
    }
    FileResponse(file, contentType) {
        let exist = fs.existsSync(file);
        if (!exist || !fs.statSync(file).isFile()) {
            this.NotFoundResponse();
            return;
        }
        let data = fs.readFileSync(file);
        if (data) {
            if (contentType)
                this.context.response.setHeader('Content-type', contentType);
            this.context.response.end(data);
        }
        else {
            this.ErrorResponse();
        }
    }
    parseMultFormAsync(req) {
        return new Promise((resolve, reject) => {
            let busboy = new Busboy({ headers: req.headers });
            let fields = new Array();
            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                let saveTo = null;
                if (filename == "") {
                    file.resume();
                    return;
                }
                saveTo = path.join("temp/", filename);
                file.pipe(fs.createWriteStream(saveTo));
                file.on('end', function () {
                    fields.push({ fieldname, type: "file", mimetype, encoding, filename, path: saveTo });
                });
            });
            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                fields.push({ fieldname, value: val, type: "input" });
            });
            busboy.on('finish', () => resolve(fields));
            busboy.on("error", reject);
            req.pipe(busboy);
        });
    }
}
exports.HttpHandler = HttpHandler;
//# sourceMappingURL=HttpHandler.js.map