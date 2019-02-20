# Http Controller
A Node.js module to run http server based on view/controllers.
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

## Static Site
```javascript
const httpcontroller = require('httpcontroller');

const server = new httpcontroller.HttpServer(httpcontroller.StaticHandler); 
//or const server = new httpcontroller.HttpServer( { "default":httpcontroller.StaticHandler }); //the default controller to use for all requests not handled by other controllers
server.start();
```
```sh
Put your site content in a sub-directory called "site". Eg.: "site/index.html" (by default index.html can be accessed without declaring the file in the url).
To test this code open the browser at http://localhost/
```

## Controllers
```javascript
const httpcontroller = require('httpcontroller');

class Api extends httpcontroller.Controller {
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