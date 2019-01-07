const httpcontroller = require('../lib/index');
const { Api } = require("./api");

const server = new httpcontroller.HttpServer("<html><body><h1>Hello World!</h1></body></html>", { Api, default:"dae" });
server.start();
