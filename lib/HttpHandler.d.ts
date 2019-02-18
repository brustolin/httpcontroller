/// <reference types="node" />
import { HttpSession } from "./HttpSession";
import { HttpContext } from "./HttpContext";
export declare class HttpHandler {
    context: HttpContext;
    readonly session: HttpSession;
    readonly isAuthenticated: Boolean;
    handle(context: HttpContext): void;
    JsonResponse(data: any): void;
    ContentResponse(content: string | Buffer, contentType?: string): void;
    NotFoundResponse(): void;
    RedirectResponse(location: any): void;
    ErrorResponse(): void;
    FileResponse(file: string, contentType?: string): void;
    ViewResponse(): void;
    protected parseMultFormAsync(req: any): Promise<Array<any>>;
    protected parseMultForm(req: any, completed: any, errorhandler?: any): void;
}
