# Http Controller
A Node.js module to run http server based on the ASP.NET MVC.
## Installation 
```sh
npm install httpcontroller --save
```
## Simplest Usage
```javascript
const httpcontroller = require('httpcontroller');

const server = new httpcontroller.HttpServer("<html><body><h1>Hello World!</h1></body></html>");
server.start();
```
```sh
To test this code open the browser at http://localhost/
```

## Controllers
```javascript
const httpcontroller = require('httpcontroller');

class Api extends httpcontroller.HttpHandler {
    /* http://localhost/Api/SomeData  */
    SomeDataGET() { 
        this.JsonResponse({ data: "some data"});
    }

    /* http://localhost/Api/AnotherData */
    AnotherDataGET(){
        this.JsonResponse({ data: "some other data"});
    }
}

const server = new httpcontroller.HttpServer({ Api });
server.start();
```