"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
var AppSettings;
exports.AppSettings = AppSettings;
if (fs.existsSync("webconfig.json")) {
    exports.AppSettings = AppSettings = JSON.parse(fs.readFileSync("webconfig.json", "UTF8"));
}
//# sourceMappingURL=AppSettings.js.map