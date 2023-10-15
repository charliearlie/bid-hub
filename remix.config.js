/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: ["ts-invariant", "zen-observable-ts"],
  future: {
    v2_dev: true,
    v2_meta: true,
  },
};
