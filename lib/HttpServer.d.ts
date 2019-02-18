/// <reference types="node" />
import * as http from "http";
import * as https from "https";
import { HttpServerMiddleware, HttpServerMiddlewareFunction } from "./HttpMiddleware";
/**
* Http server
*/
export declare class HttpServer {
    private Sessions;
    private middlewares;
    server: http.Server | https.Server;
    routes: {
        [key: string]: any;
    };
    options: any;
    defaultHandler?: any;
    constructor(RouteMap?: any, options?: any);
    addMiddleware(middleware: HttpServerMiddlewareFunction | HttpServerMiddleware): void;
    removeMiddleware(middleware: any): void;
    allMiddlewares(): any[];
    start(): void;
    private generalHandler;
}
