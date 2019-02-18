import { HttpContext } from "./HttpContext";
export declare type HttpServerMiddlewareFunction = (context: HttpContext) => void;
export interface HttpServerMiddleware {
    process(context: HttpContext): any;
}
