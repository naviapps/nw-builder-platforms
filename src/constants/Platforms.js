const Platforms = {
  win32: {
    platform: "win",
    arch: "ia32",
    downloadUrl: null,
    manifestUrl: null,
  },
  win64: {
    platform: "win",
    arch: "x64",
    downloadUrl: null,
    manifestUrl: null,
  },
  osx32: {
    platform: "osx",
    arch: "ia32",
    downloadUrl: null,
    manifestUrl: null,
  },
  osx64: {
    platform: "osx",
    arch: "x64",
    downloadUrl: null,
    manifestUrl: null,
  },
  osxarm: {
    platform: "osx",
    arch: "arm64",
    downloadUrl: "https://github.com/corwin-of-amber/nw.js/releases/download",
    manifestUrl:
      "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json",
  },
  linux32: {
    platform: "linux",
    arch: "ia32",
    downloadUrl: null,
    manifestUrl: null,
  },
  linux64: {
    platform: "linux",
    arch: "x64",
    downloadUrl: null,
    manifestUrl: null,
  },
};

export default Platforms;
