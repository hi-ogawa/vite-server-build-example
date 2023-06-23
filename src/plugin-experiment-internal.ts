import { RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import { ViteDevServer } from "vite";

type MiddlewareOptions = {
  // allow custom head injection during runtime (e.g. passing config from server to client)
  injectToHead?: () => MaybePromise<string>;
};

type MaybePromise<T> = T | Promise<T>;

export function createIndexHtmlMiddleware({
  server,
}: {
  server?: ViteDevServer;
}) {
  function inner(options?: MiddlewareOptions): RequestHandler {
    return async (_ctx) => {
      let { default: html } = await (import.meta.env.DEV
        ? import("/index.html?raw")
        : import("/dist/client/index.html?raw"));

      // inject hmr client
      if (import.meta.env.DEV) {
        tinyassert(server);
        html = await server.transformIndexHtml("/", html);
      }

      // custom
      if (options?.injectToHead) {
        html = injectToHead(html, await options.injectToHead());
      }

      return new Response(html, {
        headers: [["content-type", "text/html"]],
      });
    };
  }
  return inner;
}

// https://github.com/vitejs/vite/blob/2c38bae9458794d42eebd7f7351f5633e2fe8247/packages/vite/src/node/plugins/html.ts#L1037-L1044
function injectToHead(html: string, content: string): string {
  const RE = /([ \t]*)<\/head>/i;
  tinyassert(html.match(RE));
  return html.replace(RE, (m) => `${content}${m}`);
}
