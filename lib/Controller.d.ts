import { HttpSession } from "./HttpSession";
import { HttpHandler } from "./HttpHandler";
export declare class Controller extends HttpHandler {
    readonly session: HttpSession;
    readonly isAuthenticated: Boolean;
    handle(): void;
    ViewResponse(): void;
}
