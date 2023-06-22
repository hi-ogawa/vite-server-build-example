import type { RequestHandler } from "@hattip/compose";
import { mapRegExp, tinyassert } from "@hiogawa/utils";
import type React from "react";
import type { RouteObject } from "react-router";

//
// rakkasjs-like api routes for hattip
//

type ApiModule = Partial<
  Record<"get" | "post" | "put" | "delete", RequestHandler>
>;

export function createHattipHandler(apiModules: Record<string, ApiModule>) {
  return () => createHattipHandlerInner(apiModules);
}

function createHattipHandlerInner(
  apiModules: Record<string, ApiModule>
): RequestHandler {
  return async (ctx) => {
    const apiModule = apiModules[ctx.url.pathname];
    if (apiModule) {
      const method = ctx.method.toLowerCase();
      const handler = apiModule[method as "get"];
      if (handler) {
        tinyassert(typeof handler === "function");
        return handler(ctx);
      }
    }
    return ctx.next();
  };
}

//
// rakkasjs-like page/layout routes for react-router
//

type PageModule = {
  Page: React.ComponentType;
};

export function createReactRouterRoutes(
  pageModules: Record<string, PageModule>
) {
  return () => createReactRouterRoutesInner(pageModules);
}

function createReactRouterRoutesInner(
  pageModules: Record<string, PageModule>
): RouteObject[] {
  // construct generate tree structure
  const pathEntries = Object.entries(pageModules).map(([k, v]) => ({
    keys: splitPathSegment(k),
    value: v,
  }));
  const tree = createTree(pathEntries);

  // transform to react-router's nested RouteObject array
  function recurse(
    children: Record<string, TreeNode<PageModule>>
  ): RouteObject[] {
    return Object.entries(children).map(([path, node]) => {
      const index = path === "index";
      const Component = node.value?.Page ?? null;
      const children = recurse(node.children ?? {});
      return index
        ? {
            index,
            Component,
          }
        : {
            path: formatPath(path),
            Component,
            children,
          };
    });
  }
  return recurse(tree.children ?? {});
}

//
// utils
//

type TreeNode<T> = {
  value?: T;
  children?: Record<string, TreeNode<T>>;
};

function initNode<T>(): TreeNode<T> {
  return {};
}

function createTree<T>(entries: { value: T; keys: string[] }[]): TreeNode<T> {
  const root = initNode<T>();

  for (const e of entries) {
    let node = root;
    for (const key of e.keys) {
      node = (node.children ??= {})[key] ??= initNode();
    }
    node.value = e.value;
  }

  return root;
}

// "/" => ["/"]
// "/xyz" => ["/", "xyz"]
// "/abc/def" => ["/", "abc/", "def"]
export function splitPathSegment(pathname: string): string[] {
  const result: string[] = [];
  mapRegExp(
    pathname,
    /([^/]*\/)/g,
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

// "[dynamic]" => ":dynamic"
// "[dynamicdir]/" => ":dynamicdir/"
function formatPath(s: string): string {
  const m = s.match(/^\[(.*)\](\/?)$/);
  if (m) {
    return ":" + m[1] + (m[2] ?? "");
  }
  return s;
}

export function mapKeys<T>(
  record: Record<string, T>,
  f: (k: string) => string
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [f(k), v] as const)
  );
}
