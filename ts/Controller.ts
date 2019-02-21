import * as url from "url";
import { HttpSession } from "./HttpSession";
import { HttpHandler } from "./HttpHandler";

export class Controller extends HttpHandler {

    name:string;

    get session() : HttpSession {
        return this.context.session;
    }

    get isAuthenticated() : Boolean {
        return this.session && this.session.Itens["isAuthenticated"] === true;
    }

    async handle() {
        const parsedUrl = url.parse(this.context.request.url);
        const requestPath = parsedUrl.pathname.split('/');
        let action = "index";

        if (requestPath.length >= 3 && requestPath[2].length > 0) {
            action = requestPath[2];
        }

        this.context.action = action;
        if (this.name)  this.context.controller = this.name;
        
        action += this.context.request.method;

        if (this[action] == null || typeof(this[action]) !== 'function') {
            this.NotFoundResponse();
            return;
        }

        await this[action]();
    }

    ViewResponse() {
        this.FileResponse(`views/${this.context.controller}/${this.context.action}.html`,"text/html; charset=UTF-8");
    }
}