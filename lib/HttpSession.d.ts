import { HttpHandler } from "./HttpHandler";
export declare class SessionManager extends HttpHandler {
    Sessions: {
        [key: string]: HttpSession;
    };
    private options;
    constructor(options?: any);
    private cleanSessions;
    handle(): void;
    newSession(): HttpSession;
    session(token: string): HttpSession;
}
export declare class HttpSession {
    SessionStart: Date;
    LastRequest: Date;
    Token: string;
    Itens: {
        [key: string]: any;
    };
    constructor();
}
