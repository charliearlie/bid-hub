// const { flatRoutes } = require("remix-flat-routes");

// /**
//  * @type {import("@remix-run/dev").AppConfig}
//  */
// module.exports = {
//   cacheDirectory: "./node_modules/.cache/remix",
//   ignoredRouteFiles: ["**/.*"],
//   serverDependenciesToBundle: [
//     "ts-invariant",
//     "zen-observable-ts",
//     /^remix-utils.*/,
//     "is-ip",
//     "ip-regex",
//     "super-regex",
//     "clone-regexp",
//     "function-timeout",
//     "time-span",
//     "convert-hrtime",
//     "is-regexp",
//   ],
//   serverModuleFormat: "cjs",
//   serverPlatform: "node",
//   routes: async (defineRoutes) => {
//     return flatRoutes("routes", defineRoutes, {
//       ignoredRouteFiles: [
//         ".*",
//         "**/*.css",
//         "**/*.test.{js,jsx,ts,tsx}",
//         "**/__*.*",
//       ],
//     });
//   },
// };
