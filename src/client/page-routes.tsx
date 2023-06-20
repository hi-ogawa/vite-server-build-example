import { mapRegExp, tinyassert } from "@hiogawa/utils";
import { type RouteObject, createBrowserRouter } from "react-router-dom";
import { normalizeGlobImport } from "../utils/glob-import-utils";
import { intersection } from "../utils/misc";

// rakkasjs-like page/layout routes

// TODO
// - dynamic route (e.g. $id.tsx or [id].tsx)

export function createRouter() {
  tinyassert(
    intersection(Object.keys(pageModules), Object.keys(layoutModules))
      .length === 0
  );
  return createBrowserRouter(
    createRouteTree({ ...pageModules, ...layoutModules })
  );
}

//
// vite glob import
//

// TODO: non-eager to code split?
const pageModules = normalizeGlobImport(
  import.meta.glob("../routes/**/*.page.(js|jsx|ts|tsx)", {
    eager: true,
  }),
  "../routes",
  ".page."
) as Record<string, PageModule>;

const layoutModules = normalizeGlobImport(
  import.meta.glob("../routes/**/layout.(js|jsx|ts|tsx)", {
    eager: true,
  }),
  "../routes",
  "layout."
) as Record<string, PageModule>;

interface PageModule {
  // TODO: loader, handle, etc...?
  Page: React.ComponentType;
}

//
// react router utils
//

function createRouteTree(record: Record<string, PageModule>) {
  // start with simple tree
  interface TreeNode {
    page?: PageModule;
    children: Record<string, TreeNode>;
  }

  function initNode(): TreeNode {
    return { children: {} };
  }

  const tree = initNode();
  for (const [k, v] of Object.entries(record)) {
    let node = tree;
    for (const segment of splitPath(k)) {
      node = node.children[segment] ??= initNode();
    }
    node.page = v;
  }

  // convert to react-router tree
  function recurse(children: Record<string, TreeNode>): RouteObject[] {
    return Object.entries(children).map(([path, node]) => {
      const index = path === "index";
      const Component = node.page?.Page ?? null;
      const children = recurse(node.children);
      return index
        ? {
            index,
            Component,
          }
        : {
            path,
            Component,
            children,
          };
    });
  }
  return recurse(tree.children);
}

// "/" => ["/"]
// "/xyz" => ["/", "xyz"]
// "/abc/def" => ["/", "abc/", "def"]
function splitPath(pathname: string) {
  const result: string[] = [];
  mapRegExp(
    pathname,
    /(.*\/)/g,
    (match) => {
      tinyassert(1 in match);
      result.push(match[1]);
    },
    (nonMatch) => {
      result.push(nonMatch);
    }
  );
  return result;
}
