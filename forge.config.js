const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");

module.exports = {
  packagerConfig: {
    executableName: "minstrel-app",
    extraResource: ["workspaces/sound-capture-app/.dist"],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
    },
    {
      name: "@electron-forge/maker-deb",
    },
    {
      name: "@electron-forge/maker-zip",
      platformsToMakeOn: ["darwin"],
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig,
        port: 3001,
        loggerPort: 9001,
        renderer: {
          config: rendererConfig,
          entryPoints: [
            {
              html: "./workspaces/electron-app/renderer/index.html",
              js: "./workspaces/electron-app/renderer/index.ts",
              name: "main_window",
              preload: {
                js: "./workspaces/electron-app/renderer/preload.ts",
              },
            },
            {
              html: "./workspaces/sound-capture-app/src/sound-capture.html",
              js: "./workspaces/sound-capture-app/src/sound-capture.ts",
              name: "sound_capture",
              preload: {
                js: "./workspaces/sound-capture-app/src/sound-capture.preload.ts",
              },
            },
          ],
        },
      },
    },
    {
      name: "@timfish/forge-externals-plugin",
      config: {
        externals: ["is-stream"],
      },
    },
  ],
};
