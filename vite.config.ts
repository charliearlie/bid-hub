import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  cacheDir: "./node_modules/.cache/vite",
  esbuild: {
    target: "esnext",
  },
  optimizeDeps: {
    include: ["ts-invariant"],
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "cjs",
      routes: async (defineRoutes: any) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: [
            ".*",
            "**/*.css",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__*.*",
          ],
        });
      },
    }),
    tsconfigPaths(),
  ],
});

// serverDependenciesToBundle: ["ts-invariant"],
// serverPlatform: "node",
