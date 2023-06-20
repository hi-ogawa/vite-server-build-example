import { tinyassert } from "@hiogawa/utils";
import { type RouteObject, createBrowserRouter } from "react-router-dom";
import { splitEnd } from "../utils/misc";

// glob import to generate router from "routes/*.page"
// cf. src/server/api-routes-handler.ts

// TODO
// - is this HMR friendly?
// - layout component
// - dynamic route (e.g. $id.tsx or [id].tsx)
// - code split by dynamic import (i.e. non eager)?
// - borrow remix convention? https://remix.run/docs/en/main/pages/v2

export function createRouter() {
  const routes = Object.entries(pageModules).map(([k, v]) => {
    // format and strip "index"
    k = normalizeModuleKey(k);
    if (k.endsWith("/index")) {
      k = k.slice(0, -"index".length);
    }

    // check Page export
    tinyassert(v && typeof v === "object");
    tinyassert("Page" in v);

    return {
      path: k,
      Component: v.Page as any,
    } satisfies RouteObject;
  });
  return createBrowserRouter(routes);
}

const pageModules = import.meta.glob("../routes/**/*.page.(js|jsx|ts|tsx)", {
  eager: true,
});

function normalizeModuleKey(key: string): string {
  const key1 = key.slice("../routes".length);
  const key2 = splitEnd(key1, ".page.");
  tinyassert(key2);
  return key2;
}
