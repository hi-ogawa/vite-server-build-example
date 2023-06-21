import { RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";

//
// rakkasjs-like api routes
//

type ApiModule = Partial<
  Record<"get" | "post" | "put" | "delete", RequestHandler>
>;

export function createHattipHandler(
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
// rakkasjs-like page/layout routes by react-router
//

// TODO

//
// utils
//

export function mapKeys<T>(
  record: Record<string, T>,
  f: (k: string) => string
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [f(k), v] as const)
  );
}
