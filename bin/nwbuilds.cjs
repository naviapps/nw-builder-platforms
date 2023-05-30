#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { nwbuilds } = require("../lib/index.cjs");
const { detectCurrentPlatform } = require("../dist/index.cjs");

const cli = yargs(hideBin(process.argv))
  .version(false)
  .command("[srcDir] [options]")
  .option("mode", {
    type: "string",
    description: "`run` or `build` application",
  })
  .option("version", {
    type: "string",
    description: "NW.js version",
  })
  .option("flavor", {
    type: "string",
    description: "NW.js build flavor",
  })
  .option("platforms", {
    type: "array",
    description:
      "Supported platforms are linux32, linux64, osx32, osx64, win32, win64",
    group: "Run API",
    default: detectCurrentPlatform(process),
  })
  .option("outDir", {
    type: "string",
    description: "NW.js build artifacts",
  })
  .parse();

nwbuilds({
  ...cli,
  currentPlatform: detectCurrentPlatform(process),
  srcDir: cli._.join(" "),
  cli: true,
});
