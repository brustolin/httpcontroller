/// <reference types="node" />
import * as http from "http";
import * as https from "https";
import { HttpHandler } from "./HttpHandler";
/**
* Http server
*/
export declare class HttpServer {
    server: http.Server | https.Server;
    routes: {
        [key: string]: typeof HttpHandler;
    };
    options: any;
    defaultHandler?: typeof HttpHandler;
    constructor(RouteMap?: {
        [key: string]: typeof HttpHandler | any;
    }, options?: any);
    start(): void;
    private generalHandler;
}
