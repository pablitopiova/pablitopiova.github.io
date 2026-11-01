// Convierte la salida cruda del portal MVP en data/portal-dates.json
import fs from "node:fs";
const t = fs.readFileSync(process.argv[2], "utf8");
const i = t.indexOf('"json": ') + 8;
const lit = t.slice(i, t.lastIndexOf("}")).trim();
const arr = JSON.parse(JSON.parse(lit));
fs.writeFileSync("data/portal-dates.json", JSON.stringify(arr, null, 1));
console.log(arr.length);
