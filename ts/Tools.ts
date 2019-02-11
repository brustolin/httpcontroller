import * as crypto from "crypto";
const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
export function GenerateToken(length = 8) {
    let data = crypto.randomBytes(length);
    let res = "";
    for (let i = 0; i<data.length;i++) {
        res += map[data[i]%64];
    }
    return res;
}