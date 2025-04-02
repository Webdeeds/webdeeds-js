import { defineConfig } from "tsup";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig([
  // Node.js build (default)
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  // Browser build
  {
    entry: ["src/index.browser.ts"],
    format: ["esm"],
    outDir: "dist/browser",
    dts: true,
    sourcemap: true,
    platform: "browser",
    noExternal: ["*"],
    esbuildOptions(options) {
      options.mainFields = ["browser", "module", "main"];
      options.conditions = ["browser"];
    },
    env: {
      NODE_ENV: "production",
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      global: "window",
    },
    // Node-specific modules to stub out
    esbuildPlugins: [
      {
        name: "node-modules-polyfill",
        setup(build) {
          // Replace Node.js built-ins with empty objects or browser-compatible alternatives
          build.onResolve(
            {
              filter:
                /^(node:)?(fs|path|crypto|os|buffer|stream|util|events)(\/.*)?$/,
            },
            (args) => {
              return { path: args.path, namespace: "node-stub" };
            }
          );

          build.onLoad({ filter: /.*/, namespace: "node-stub" }, () => {
            // Return empty modules for Node.js built-ins
            return { contents: "export default {};" };
          });
        },
      },
    ],
  },
]);
