#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import detectCurrentPlatform from "./util/detectCurrentPlatform.js";
import nwbuilds from "../index.js";

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
