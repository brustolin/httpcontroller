import * as http from "http";
import * as fs from 'fs';
import * as path from 'path';
import * as url from "url";
import * as Busboy from 'busboy'
import { HttpSession } from "./HttpSession";
import { HttpContext } from "./HttpContext";

export class HttpHandler   {
    
    context : HttpContext;
  
    get session() : HttpSession {
        return this.context.session;
    }

    get isAuthenticated() : Boolean {
        return this.session && this.session.Itens["isAuthenticated"] === true;
    }

    handle(context: HttpContext) {
        this.context = context;
        
        const parsedUrl = url.parse(this.context.request.url);
        const requestPath = parsedUrl.pathname.split('/');
        let method = "index";

        if (requestPath.length >= 3) {
            method = requestPath[2];
        }

        this.context.action = method;
        this.context.controller = this.constructor.name;

        method += this.context.request.method;

        if (this[method] == null || typeof(this[method]) !== 'function') {
            this.NotFoundResponse();
            return;
        }

        this[method]();
    }

    JsonResponse(data : any) {
        this.ContentResponse(JSON.stringify(data), "application/json; charset=UTF-8")
    }

    ContentResponse(content: string|Buffer, contentType: string = "text/html; charset=UTF-8") {
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

    FileResponse(file: string, contentType?: string) {
        let _this = this;
        fs.exists(file, function (exist) {
            if (!exist || !fs.statSync(file).isFile() ) {
                _this.NotFoundResponse();
                return;
            }

            fs.readFile(file, function (err, data) {
                if (err) {
                    _this.ErrorResponse();
                } else {
                    if (contentType)
                        _this.context.response.setHeader('Content-type', contentType);
                    _this.context.response.end(data);
                }
            });
        });
    }

    ViewResponse() {
        this.FileResponse(`views/${this.context.controller}/${this.context.action}.html`,"text/html; charset=UTF-8");
    }

    protected parseMultFormAsync(req) : Promise<Array<any>> {
        return new Promise((resolve,reject) => {
            this.parseMultForm(req, resolve, reject);
        });
    }

    protected parseMultForm(req, completed, errorhandler?) {
        let busboy = new Busboy({ headers: req.headers });
        let fields = new Array();
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            let saveTo: string = null;
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
        busboy.on('finish', () =>
            completed(fields)
        );
        if (errorhandler)
            busboy.on("error", errorhandler)
        req.pipe(busboy);
    }
}