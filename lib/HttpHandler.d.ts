/// <reference types="node" />
import { HttpContext } from "./HttpContext";
export declare abstract class HttpHandler {
    context: HttpContext;
    preHandlers: Array<HttpHandler>;
    process(context: HttpContext): void;
    protected abstract handle(): any;
    JsonResponse(data: any): void;
    ContentResponse(content: string | Buffer, contentType?: string): void;
    NotFoundResponse(): void;
    RedirectResponse(location: any): void;
    ErrorResponse(): void;
    FileResponse(file: string, contentType?: string): void;
    protected parseMultFormAsync(req: any): Promise<Array<any>>;
    protected parseMultForm(req: any, completed: any, errorhandler?: any): void;
}
