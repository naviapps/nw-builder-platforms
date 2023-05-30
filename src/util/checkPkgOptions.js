/* eslint-disable jsdoc/require-jsdoc */
import fs from "fs";
import path from "path";

import Glob from "simple-glob";

const checkPkgOptions = (files) => {
  let pkg = {};

  let matches = Glob(files);

  let packageJsonExists = false;

  matches.forEach((file) => {
    if (!packageJsonExists && path.basename(file) === "package.json") {
      pkg = fs.readFileSync(`${file}`, "utf8");
      pkg = JSON.parse(pkg);
      packageJsonExists = true;
    }
  });

  if (pkg.nwbuilds) {
    return pkg.nwbuilds;
  } else {
    return {};
  }
};

export default checkPkgOptions;
