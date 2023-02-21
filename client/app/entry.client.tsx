import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

function Client() {
  return <RemixBrowser />;
}

hydrateRoot(document, <Client />);
