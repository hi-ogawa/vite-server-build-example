import { tinyassert } from "@hiogawa/utils";
import { type RouteObject, createBrowserRouter } from "react-router-dom";
import { normalizeGlobImport } from "../utils/glob-import-utils";

// rakkasjs-like page routes

// TODO
// - dynamic route (e.g. $id.tsx or [id].tsx)
// - borrow remix convention? https://remix.run/docs/en/main/pages/v2

export function createRouter() {
  const routes = Object.entries(pageModules).map(([k, v]) => {
    // strip "index"
    if (k.endsWith("/index")) {
      k = k.slice(0, -"index".length);
    }

    // check Page export
    tinyassert(v && typeof v === "object");
    tinyassert("Page" in v);

    const Page = v.Page as any;
    let element = <Page />;

    // simple Layout support
    if ("Layout" in v) {
      const Layout = v.Layout as any;
      element = <Layout>{element}</Layout>;
    }

    return {
      path: k,
      element,
    } satisfies RouteObject;
  });
  return createBrowserRouter(routes);
}

// TODO: non-eager to code split?
const pageModules = normalizeGlobImport(
  import.meta.glob("../routes/**/*.page.(js|jsx|ts|tsx)", {
    eager: true,
  }),
  "../routes",
  ".page."
);
