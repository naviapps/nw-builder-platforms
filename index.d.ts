type Options = {
  srcDir: string,
  mode: "get" | "run" | "build",
  version: string | "latest" | "stable",
  flavor: "normal" | "sdk",
  platforms: string[],
  outDir: string,
  cacheDir: string,
  downloadUrl: string,
  manifestUrl: string,
  app: object,
  cache: boolean,
  zip: boolean | "zip",
  cli: boolean,
  ffmpeg: boolean,
  glob: boolean,
};

declare function nwbuilds(options: Options): Promise<unknown>;

export default nwbuilds;
