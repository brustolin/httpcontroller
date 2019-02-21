/// <reference types="node" />
import { HttpContext } from "./HttpContext";
export interface IHttpHandler {
    process(context: HttpContext): any;
}
export declare abstract class HttpHandler implements IHttpHandler {
    context: HttpContext;
    preHandlers: Array<IHttpHandler>;
    process(context: HttpContext): Promise<void>;
    protected abstract handle(): any;
    JsonResponse(data: any): void;
    ContentResponse(content: string | Buffer, contentType?: string): void;
    NotFoundResponse(): void;
    RedirectResponse(location: any): void;
    ErrorResponse(): void;
    FileResponse(file: string, contentType?: string): void;
    private requestBody;
    private parseRequestBody;
    protected parseMultFormAsync(req: any): Promise<any>;
    private addValueToObject;
}
