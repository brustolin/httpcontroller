import * as http from "http";
import * as Cookies from "cookies";
import { HttpSession } from "./HttpSession";

export class HttpContext {
    request : http.IncomingMessage;
    response: http.ServerResponse;
    cookies: Cookies;
    action?: String; //Action Name
    controller?: string; //Controller Name
    session?: HttpSession; //Controller Session
    data?:any; //Request body for POSTs 
}