declare class SessionManager {
    Sessions: {
        [key: string]: HttpSession;
    };
    constructor();
    newSession(): HttpSession;
    session(token: string): HttpSession;
}
export declare const Sessions: SessionManager;
export declare class HttpSession {
    SessionStart: Date;
    LastRequest: Date;
    Token: string;
    Itens: {
        [key: string]: any;
    };
    constructor();
}
export {};
