import { HttpHandler } from "./HttpHandler";
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
    handle(): void;
}
