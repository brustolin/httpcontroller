import * as fs from 'fs';
import * as path from 'path';
import * as Busboy from 'busboy'
import { HttpContext } from "./HttpContext";

export abstract class HttpHandler   {
    context : HttpContext;
  
    preHandlers : Array<HttpHandler>

    process(context: HttpContext) {
        this.context = context;
        if (this.preHandlers != null) {
            for (let pre of this.preHandlers) {
                pre.process(context)
                if (context.response.finished) return;
            }
        }
        this.handle();
    }

    protected abstract handle();

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