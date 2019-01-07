import * as fs from 'fs';
var AppSettings;

if (fs.existsSync("webconfig.json")) {
    AppSettings = JSON.parse(fs.readFileSync("webconfig.json","UTF8"));
}

export { AppSettings }