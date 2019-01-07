export function GenerateToken(length = 8) {
    let res = "";
    for (let i = 0; i<length; i++) {
        var h = Math.round(Math.random() * 32);
        var t = String.fromCharCode(h + 65 + (h >= 26 ? 10 : 0));
        res += t;
    }
    return res;
}