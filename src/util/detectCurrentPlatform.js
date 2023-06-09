import Platform from "../constants/Platform.js";

/* eslint-disable jsdoc/require-description,jsdoc/no-undefined-types,jsdoc/require-param-description */
/**
 * @param  {NodeJS.Process}     process
 * @return {Platform|undefined}
 */
const detectCurrentPlatform = (process) => {
  switch (process.platform) {
    case "darwin":
      switch (process.arch) {
        case "x64":
          return Platform.OSX_64;

        case "x32":
          return Platform.OSX_32;

        case "arm64":
          return Platform.OSX_ARM;
        default:
          return undefined;
      }

    case "win32":
      return process.arch === "x64" || process.env.PROCESSOR_ARCHITEW6432
        ? Platform.WIN_64
        : Platform.WIN_32;

    case "linux":
      return process.arch === "x64" ? Platform.NIX_64 : Platform.NIX_32;
    default:
      return undefined;
  }
};
/* eslint-enable */

export default detectCurrentPlatform;
