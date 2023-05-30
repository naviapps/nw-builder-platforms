import _ from "lodash";
import nwbuild from "nw-builder";

import Options from "./constants/Options.js";
import Platforms from "./constants/Platforms.js";
import checkPkgOptions from "./util/checkPkgOptions.js";
import detectCurrentPlatform from "./util/detectCurrentPlatform.js";
import parseOptions from "./util/parseOptions.js";

// eslint-disable-next-line jsdoc/require-jsdoc
class NwBuilder {
  /**
   * @typedef {object} App
   * @property {string}   name                  Name of the application
   *                                            Linux configuration options
   * @property {string}   genericName           Generic name of the application
   * @property {boolean}  noDisplay             If true the application is not displayed
   * @property {string}   comment               Tooltip for the entry, for example "View sites on the Internet".
   * @property {string}   icon                  Icon to display in file manager, menus, etc.
   * @property {boolean}  hidden                TBD
   * @property {string[]} onlyShowIn            A list of strings identifying the desktop environments that should (/not) display a given desktop entry
   * @property {string[]} notShowIn             A list of strings identifying the desktop environments that should (/not) display a given desktop entry
   * @property {boolean}  dBusActivatable       A boolean value specifying if D-Bus activation is supported for this application
   * @property {string}   tryExec               Path to an executable file on disk used to determine if the program is actually installed
   * @property {string}   exec                  Program to execute, possibly with arguments.
   * @property {string}   path                  If entry is of type Application, the working directory to run the program in.
   * @property {boolean}  terminal              Whether the program runs in a terminal window.
   * @property {string[]} actions               Identifiers for application actions.
   * @property {string[]} mimeType              The MIME type(s) supported by this application.
   * @property {string[]} categories            Categories in which the entry should be shown in a menu
   * @property {string[]} implements            A list of interfaces that this application implements.
   * @property {string[]} keywords              A list of strings which may be used in addition to other metadata to describe this entry.
   * @property {boolean}  startupNotify         If true, it is KNOWN that the application will send a "remove" message when started with the DESKTOP_STARTUP_ID environment variable set. If false, it is KNOWN that the application does not work with startup notification at all.
   * @property {string}   startupWMClass        If specified, it is known that the application will map at least one window with the given string as its WM class or WM name hin
   * @property {boolean}  prefersNonDefaultGPU  If true, the application prefers to be run on a more powerful discrete GPU if available.
   * @property {string}   singleMainWindow      If true, the application has a single main window, and does not support having an additional one opened.
   *                                            Windows configuration options
   * @property {string}   comments              Additional information that should be displayed for diagnostic purposes.
   * @property {string}   company               Company that produced the file—for example, Microsoft Corporation or Standard Microsystems Corporation, Inc. This string is required.
   * @property {string}   fileDescription       File description to be presented to users. This string may be displayed in a list box when the user is choosing files to install. For example, Keyboard Driver for AT-Style Keyboards. This string is required.
   * @property {string}   fileVersion           Version number of the file. For example, 3.10 or 5.00.RC2. This string is required.
   * @property {string}   internalName          Internal name of the file, if one exists—for example, a module name if the file is a dynamic-link library. If the file has no internal name, this string should be the original filename, without extension. This string is required.
   * @property {string}   legalCopyright        Copyright notices that apply to the file. This should include the full text of all notices, legal symbols, copyright dates, and so on. This string is optional.
   * @property {string}   legalTrademark        Trademarks and registered trademarks that apply to the file. This should include the full text of all notices, legal symbols, trademark numbers, and so on. This string is optional.
   * @property {string}   originalFilename      Original name of the file, not including a path. This information enables an application to determine whether a file has been renamed by a user. The format of the name depends on the file system for which the file was created. This string is required.
   * @property {string}   privateBuild          Information about a private version of the file—for example, Built by TESTER1 on \\TESTBED. This string should be present only if VS_FF_PRIVATEBUILD is specified in the fileflags parameter of the root block.
   * @property {string}   productName           Name of the product with which the file is distributed. This string is required.
   * @property {string}   productVersion        Version of the product with which the file is distributed—for example, 3.10 or 5.00.RC2. This string is required.
   * @property {string}   specialBuild          Text that specifies how this version of the file differs from the standard version—for example, Private build for TESTER1 solving mouse problems on M250 and M250E computers. This string should be present only if VS_FF_SPECIALBUILD is specified in the fileflags parameter of the root block.
   */

  /**
   * @typedef {object} Options
   * @property {string}                                                                                              [srcDir="./"]                             String of space separated glob patterns which correspond to NW app code
   * @property {"get" | "run" | "build"}                                                                             [mode="build"]                            Run or build application
   * @property {"latest" | "stable" | string}                                                                        [version="latest"]                        NW runtime version
   * @property {"normal" | "sdk"}                                                                                    [flavor="normal"]                         NW runtime build flavor
   * @property {string[]}                                                                                            platforms                                 Supported platforms are linux32, linux64, osx32, osx64, win32, win64
   * @property {string}                                                                                              currentPlatform                           NW supported platforms
   * @property {string}                                                                                              [outDir="./out"]                          Directory to store build artifacts
   * @property {"./cache" | string}                                                                                  [cacheDir="./cache"]                      Directory to store NW binaries
   * @property {"https://dl.nwjs.io" | "https://npmmirror.com/mirrors/nwjs" | "https://npm.taobao.org/mirrors/nwjs"} [downloadUrl="https://dl.nwjs.io"]        URI to download NW binaries from
   * @property {"https://nwjs.io/versions"}                                                                          [manifestUrl="https://nwjs.io/versions"]  URI to download manifest from
   * @property {App}                                                                                                 app                                       Multi platform configuration options
   * @property {boolean}                                                                                             [cache=true]                              If true the existing cache is used. Otherwise it removes and redownloads it.
   * @property {boolean}                                                                                             [zip=false]                               If true the outDir directory is zipped
   * @property {boolean}                                                                                             [cli=false]                               If true the CLI is used to glob srcDir and parse other options
   * @property {boolean}                                                                                             [ffmpeg=false]                            If true the chromium ffmpeg is replaced by community version
   * @property {boolean}                                                                                             [glob=true]                               If true globbing is enabled
   */

  /**
   * Entry point for nw-builder application
   *
   * @param {...Options} options  Options
   */
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

  /**
   * Let's create a NWjs app
   *
   * @return {Promise<void>}
   */
  async build() {
    const self = this;

    this._forEachPlatform(async (name, platform) => {
      const options = _.cloneDeep(self.options);

      options.mode = "build";
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

      await nwbuild(options);
    });
  }

  /**
   * Let's run this NWjs app
   *
   * @return {Promise<void>}
   */
  async run() {
    const options = _.cloneDeep(this.options);
    const platform = this._platforms[options.currentPlatform];

    options.mode = "run";
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

    await nwbuild(options);
  }

  _forEachPlatform(fn) {
    _.forEach(this._platforms, function (platform, name) {
      return fn(name, platform);
    });
  }
}

/**
 * Entry point for nw-builder application
 *
 * @param  {...Options}    options  Options
 * @return {Promise<void>}
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
