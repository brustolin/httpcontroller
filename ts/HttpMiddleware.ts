import { HttpContext } from "./HttpContext";

export type HttpServerMiddlewareFunction = (context: HttpContext) => void;

export interface HttpServerMiddleware {
    process(context: HttpContext);
}