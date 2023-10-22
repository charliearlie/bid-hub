import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";

function Client() {
  return <RemixBrowser />;
}

startTransition(() => {
  hydrateRoot(document, <Client />);
});
