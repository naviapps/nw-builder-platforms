import _ from "lodash";
import nwbuild from "nw-builder";

import Options from "./constants/Options.js";
import Platforms from "./constants/Platforms.js";
import checkPkgOptions from "./util/checkPkgOptions.js";
import detectCurrentPlatform from "./util/detectCurrentPlatform.js";
import parseOptions from "./util/parseOptions.js";

/**
 * @typedef {object} Options Configuration options
 * @property {"./" | string}                       [srcDir="./"]                             String of space separated glob patterns which correspond to NW app code
 * @property {"get" | "run" | "build"}             [mode="build"]                            Run or build application
 * @property {"latest" | "stable" | string}        [version="latest"]                        NW runtime version
 * @property {"normal" | "sdk"}                    [flavor="normal"]                         NW runtime build flavor
 * @property {string[]}                            [platforms=[]]                            Supported platforms are linux32, linux64, osx32, osx64, win32, win64
 * @property {string}                              [currentPlatform=null]                    NW supported platforms
 * @property {"./out" | string}                    [outDir="./out"]                          Directory to store build artifacts
 * @property {"./cache" | string}                  [cacheDir="./cache"]                      Directory to store NW binaries
 * @property {"https://dl.nwjs.io" | string}       [downloadUrl="https://dl.nwjs.io"]        URI to download NW binaries from
 * @property {"https://nwjs.io/versions" | string} [manifestUrl="https://nwjs.io/versions"]  URI to download manifest from
 * @property {object}                              app                                       Refer to Linux/Windows Specific Options under Getting Started in the docs
 * @property {boolean}                             [cache=true]                              If true the existing cache is used. Otherwise, it removes and re downloads it.
 * @property {boolean}                             [zip=false]                               If true the outDir directory is zipped
 * @property {boolean}                             [cli=false]                               If true the CLI is used to glob srcDir and parse other options
 * @property {boolean}                             [ffmpeg=false]                            If true the chromium ffmpeg is replaced by community version
 * @property {boolean}                             [glob=true]                               If true globbing is enabled
 */

// eslint-disable-next-line jsdoc/require-jsdoc
class NwBuilder {
  // eslint-disable-next-line jsdoc/require-jsdoc
  constructor(options) {
    const files = options.glob
      ? options.srcDir
      : _.trimEnd(options.srcDir, "/") + "/**/*";
    const pkgOptions = checkPkgOptions(files);
    // Options are defined in package.json take precedence
    if (Object.entries(pkgOptions).length !== 0) {
      this.options = parseOptions(pkgOptions, Options);
    } else {
      this.options = parseOptions(options, Options);
    }

    if (this.options.currentPlatform === null) {
      this.options.currentPlatform = detectCurrentPlatform(process);
    }

    if (this.options.platforms && this.options.platforms.length === 0) {
      this.options.platforms = [detectCurrentPlatform(process)];
    } else if (this.options.platforms && this.options.platforms.length === 1) {
      this.options.platforms = this.options.platforms[0].split(",");
    }

    // Intercept the platforms and check for the legacy platforms of 'osx' and 'win' and
    // replace with 'osx32', 'osx64', and 'win32', 'win64' respectively.
    if (typeof this.options.platforms != "undefined") {
      if (
        this.options.platforms &&
        this.options.platforms.indexOf("osx") >= 0
      ) {
        this.options.platforms.splice(
          this.options.platforms.indexOf("osx"),
          1,
          "osx32",
          "osx64",
        );
      }
      if (
        this.options.platforms &&
        this.options.platforms.indexOf("win") >= 0
      ) {
        this.options.platforms.splice(
          this.options.platforms.indexOf("win"),
          1,
          "win32",
          "win64",
        );
      }
      if (
        this.options.platforms &&
        this.options.platforms.indexOf("linux") >= 0
      ) {
        this.options.platforms.splice(
          this.options.platforms.indexOf("linux"),
          1,
          "linux32",
          "linux64",
        );
      }
    }

    // Some Option checking
    if (this.options.platforms && this.options.platforms.length === 0)
      throw new Error("No platform to build!");

    // verify all the platforms specified by the user are supported
    // this + previous check assures as we have only buildable platforms specified
    this.options.platforms &&
      this.options.platforms.forEach(function (platform) {
        if (!(platform in Platforms))
          throw new Error("Unknown platform " + platform);
      });

    this._platforms = _.cloneDeep(Platforms);

    // clear all unused platforms
    for (const name in this._platforms) {
      if (this.options.platforms && this.options.platforms.indexOf(name) === -1)
        delete this._platforms[name];
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  async build() {
    for (const [name, platform] of Object.entries(this._platforms)) {
      const options = this.migrate(name, platform);
      options.mode = "build";

      await nwbuild(options);
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  async run() {
    const name = this.options.currentPlatform;
    const platform = this._platforms[name];
    const options = this.migrate(name, platform);
    options.mode = "run";

    await nwbuild(options);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  migrate(name, platform) {
    const options = _.cloneDeep(this.options);

    options.outDir = _.trimEnd(options.outDir, "/") + "/" + name;
    options.platform = platform.platform;
    options.arch = platform.arch;
    if (platform.downloadUrl !== null) {
      options.downloadUrl = platform.downloadUrl;
    }
    if (platform.manifestUrl !== null) {
      options.manifestUrl = platform.manifestUrl;
    }
    delete options.platforms;
    delete options.currentPlatform;

    return options;
  }
}

/**
 * Automates building an NW.js application.
 *
 * @param  {Options}            options  Options
 * @return {Promise<undefined>}
 */
const nwbuilds = async (options) => {
  const nw = new NwBuilder(options);

  if (options.mode === "build") {
    await nw.build();
  } else if (options.mode === "run") {
    await nw.run();
  } else {
    console.error("[ WARN ] Invalid mode option.");
  }
};

export default nwbuilds;
