import fs from "node:fs";
import path from "node:path";

const from = path.resolve("SPA", "dist");
const to = path.resolve("public", "spa");

fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });

fs.cpSync(from, to, { recursive: true });
console.log("✅ Copied SPA dist -> public/spa");
