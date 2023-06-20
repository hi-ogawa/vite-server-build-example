import { RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import { splitEnd } from "../utils/misc";

// rakkasjs-like api routes

export function apiRoutesHandler(): RequestHandler {
  return async (ctx) => {
    const apiModule = apiModuleMap.get(ctx.url.pathname);
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

// https://vitejs.dev/guide/features.html#glob-import
const apiModules = import.meta.glob("../routes/**/*.api.(js|jsx|ts|tsx)", {
  eager: true,
});

const apiModuleMap = new Map(
  Object.entries(apiModules).map(([k, v]) => [normalizeModuleKey(k), v])
);

function normalizeModuleKey(key: string): string {
  const key1 = key.slice("../routes".length);
  const key2 = splitEnd(key1, ".api.");
  tinyassert(key2);
  return key2;
}
