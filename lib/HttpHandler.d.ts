/// <reference types="node" />
import * as http from "http";
import { HttpSession } from "./HttpSession";
export declare class HttpHandler {
    context: {
        request: http.IncomingMessage;
        response: http.ServerResponse;
        action?: string;
        controller?: string;
    };
    session: HttpSession;
    readonly isAuthenticated: Boolean;
    handle(req: http.IncomingMessage, res: http.ServerResponse): void;
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
