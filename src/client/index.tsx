import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ReactQueryWrapper } from "./misc";
import { createRouter } from "./page-routes";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const root = createRoot(el);
  root.render(<Root />);
}

function Root() {
  return (
    <React.StrictMode>
      <ReactQueryWrapper>
        <Router />
      </ReactQueryWrapper>
    </React.StrictMode>
  );
}

function Router() {
  const [router] = React.useState(() => createRouter());
  return <RouterProvider router={router} />;
}

main();
