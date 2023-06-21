import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import React from "react";
import { createRoot } from "react-dom/client";
import { PageRoutes } from "./page-routes";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const root = createRoot(el);
  root.render(<Root />);
}

function Root() {
  return (
    <React.StrictMode>
      <PageRoutes />
    </React.StrictMode>
  );
}

main();
