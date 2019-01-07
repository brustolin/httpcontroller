"use strict";

const { HttpHandler } = require("../lib/index");

class Api extends HttpHandler {
    async ApiMessageGET() {
        this.JsonResponse({ message: "Hello from HTTP Controller!" });
    }
}

exports.Api = Api;
