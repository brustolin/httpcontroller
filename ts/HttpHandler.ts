import * as fs from 'fs';
import * as path from 'path';
import * as Busboy from 'busboy'
import { HttpContext } from "./HttpContext";
import { GenerateToken } from './Tools';

export interface IHttpHandler {
    process(context: HttpContext);
}

export abstract class HttpHandler implements IHttpHandler {
    context: HttpContext;

    preHandlers: Array<IHttpHandler>

    async process(context: HttpContext) {
        try {
            this.context = context;
            if (this.preHandlers != null) {
                for (let pre of this.preHandlers) {
                    await pre.process(context)
                    if (context.response.finished) return;
                }
            }
            if (this.context.request.method === "POST" && this.context.data == null) {
                this.context.data = await this.parseRequestBody();
            }
            await this.handle();
        } catch (ex) {
            this.ErrorResponse();
        }
    }

    protected abstract async handle();

    JsonResponse(data: any) {
        this.ContentResponse(JSON.stringify(data), "application/json; charset=UTF-8");
    }

    ContentResponse(content: string | Buffer, contentType: string = "text/html; charset=UTF-8") {
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
        } else {
            this.ErrorResponse();
        }
    }

    private requestBody(): Promise<string> {
        return new Promise((resolve, reject) => {
            let body = [];
            this.context.request.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                resolve(Buffer.concat(body).toString());
            }).on("error", (err) => {
                reject(err);
            });
        });
    }

    private parseRequestBody(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let tp = this.context.request.headers["content-type"].toLowerCase();
            try {
                if (tp.startsWith("multipart/form-data")) tp = "multipart/form-data";

                switch (tp) {
                    case "application/json":
                        let j = await this.requestBody();
                        resolve(JSON.parse(j));
                        break;
                    case "multipart/form-data":
                    case "application/x-www-form-urlencoded":
                        let res = await this.parseMultFormAsync(this.context.request);
                        resolve(res);
                        break;
                    default:
                        let body = await this.requestBody();
                        resolve(body);
                        break;
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    protected parseMultFormAsync(req): Promise<any> {
        return new Promise((resolve, reject) => {
            let busboy = new Busboy({ headers: req.headers });
            let fields = {};
            let _this = this;
            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                let saveTo: string = null;
                if (filename === "" || fs.existsSync("temp/") ) {
                    file.resume();
                    return;
                }
                saveTo = path.join("temp/",GenerateToken(8) + "_" + filename);
                file.pipe(fs.createWriteStream(saveTo));

                file.on('end', function () {
                    _this.addValueToObject(fields,fieldname,{ fieldname, type: "file", mimetype, encoding, filename, path: saveTo });
                });
            });
            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                _this.addValueToObject(fields,fieldname,val);
            });
            busboy.on('finish', () =>
                resolve(fields)
            );
            busboy.on("error", reject)
            req.pipe(busboy);
        });
    }

    private addValueToObject(obj,property,value){
        if (obj[property]) {
            if (!(obj[property] instanceof Array)) {
                let temp = obj[property];
                obj[property] = [temp];
            }
            obj[property].push(value);
        } else {
            obj[property] = value;
        }
    }
}