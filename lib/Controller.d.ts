import { HttpSession } from "./HttpSession";
import { HttpHandler } from "./HttpHandler";
export declare class Controller extends HttpHandler {
    name: string;
    readonly session: HttpSession;
    readonly isAuthenticated: Boolean;
    handle(): Promise<void>;
    ViewResponse(): void;
}
