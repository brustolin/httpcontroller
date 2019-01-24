/// <reference types="node" />
import * as http from "http";
import * as https from "https";
/**
* Http server
*/
export declare class HttpServer {
    private Sessions;
    server: http.Server | https.Server;
    routes: {
        [key: string]: any;
    };
    options: any;
    defaultHandler?: any;
    constructor(RouteMap?: any, options?: any);
    start(): void;
    private generalHandler;
}
