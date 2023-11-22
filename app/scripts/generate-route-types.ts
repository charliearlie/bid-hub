import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";

const RouteSchema = z.object({
  id: z.string(),
  file: z.string(),
  path: z.string().optional(),
});

type Route = z.infer<typeof RouteSchema> & {
  children?: Route[];
};

const Schema: z.ZodType<Route> = RouteSchema.extend({
  children: z.lazy(() => Schema.array()).optional(),
});

async function main() {
  let { $ } = await import("execa");

  let { stdout } = await $`npx remix routes --json`;
  let routes = Schema.array().parse(JSON.parse(stdout));
  let ids = routes.flatMap((route) => iteration(route));

  await writeFile(
    resolve("./types/route-id.d.ts"),
    `export type RouteId = ${ids.map((id) => `"${id}"`).join(" | ")}`
  );
}

main();

function iteration(route: Route): string | string[] {
  if (!route.children) return route.id;
  return [route.id, ...route.children.flatMap((child) => iteration(child))];
}
