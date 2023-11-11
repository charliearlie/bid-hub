import { RemixBrowser } from "@remix-run/react";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

function Client() {
  return <RemixBrowser />;
}

if (ENV.MODE === "development") {
  console.log("Developing on the client");
}

startTransition(() => {
  hydrateRoot(document, <Client />);
});
