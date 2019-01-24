const httpcontroller = require('../lib/index');
const { Api } = require("./api");

const server = new httpcontroller.HttpServer({ Api, "default":httpcontroller.StaticHandler });
server.start();
