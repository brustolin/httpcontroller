const httpcontroller = require('../lib/index');
const { Api } = require("./api");

class Home extends httpcontroller.Controller {
    constructor(){
        super();
        this.name = "Home";
    }
    
    async indexGET() {
        this.ViewResponse();
    }
}

const server = new httpcontroller.HttpServer({ "": Home , Api, "default":httpcontroller.StaticHandler });
server.start();
