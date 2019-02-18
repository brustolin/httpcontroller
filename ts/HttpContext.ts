import * as http from "http";
import * as Cookies from "cookies";
import { HttpSession } from "./HttpSession";

export class HttpContext {
    request : http.IncomingMessage;
    response: http.ServerResponse;
    cookies: Cookies;
    action?: String;
    controller?: string;
    session?: HttpSession;
}