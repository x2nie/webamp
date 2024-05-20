// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: "src/",
  mount: {
    src: "/",
    assets: "/assets",
  },
  exclude: ["*.tmp", "extracted-*"],
  plugins: [
    /* ... */
    [
      "./snowpack-maki-plugin.js",
      {
        /* pluginOptions */
      },
    ],
  ],
  packageOptions: {
    /* ... */
  },
  alias: {
    // "@xml": "./src/lib/xml/index.js",
    "@lib": "./src/lib",
  },
  devOptions: {
    /* ... */
    port: 3001,
  },
  buildOptions: {
    /* ... */
    out: "./build",
  },
};
