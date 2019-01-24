export declare class SessionManager {
    Sessions: {
        [key: string]: HttpSession;
    };
    private options;
    constructor(options?: any);
    private cleanSessions;
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
