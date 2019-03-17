const {copyFileSync} = require("fs-extra");
const {resolve, join} = require("path");

const dist = "dist";

copyFileSync(resolve(process.cwd(), "package.json"), resolve(process.cwd(), join(dist, "package.json")));
copyFileSync(resolve(process.cwd(), "README.md"), resolve(process.cwd(), join(dist, "README.md")));
