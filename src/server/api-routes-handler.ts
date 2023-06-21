import { RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import { normalizeGlobImport } from "../utils/glob-import-utils";

// rakkasjs-like api routes

export function apiRoutesHandler(): RequestHandler {
  return async (ctx) => {
    const apiModule = apiModules[ctx.url.pathname];
    if (apiModule) {
      const handler = (apiModule as any)[ctx.method.toLowerCase()];
      if (handler) {
        tinyassert(typeof handler === "function");
        return handler(ctx);
      }
    }
    return ctx.next();
  };
}

const apiModules = normalizeGlobImport(
  import.meta.glob("../routes/**/*.api.(js|jsx|ts|tsx)", {
    eager: true,
  }),
  "../routes",
  ".api."
);
