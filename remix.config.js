const { flatRoutes } = require("remix-flat-routes");

/**
 * @type {import("@remix-run/dev").AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: ["ts-invariant", "zen-observable-ts"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes, {
      ignoredRouteFiles: [
        ".*",
        "**/*.css",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/__*.*",
      ],
    });
  },
};
