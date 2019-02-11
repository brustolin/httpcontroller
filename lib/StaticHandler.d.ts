/// <reference types="node" />
import { HttpHandler } from "./HttpHandler";
import * as http from "http";
export declare class StaticHandlerParameters {
    StaticRoot: string;
    ImplicitHtml: Boolean;
    TypeMap: {
        [key: string]: string;
    };
}
export declare class StaticHandler extends HttpHandler {
    args: StaticHandlerParameters;
    constructor(args?: StaticHandlerParameters);
    protected DefaultArgs(): StaticHandlerParameters;
    handle(req: http.IncomingMessage, res: http.ServerResponse): void;
}
