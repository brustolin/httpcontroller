"use strict";

const { Controller } = require("../lib/index");

class Api extends Controller {
    async ApiMessageGET() {
        this.JsonResponse({ message: "Hello from api in HTTP Controller!" });
    }
}

exports.Api = Api;
