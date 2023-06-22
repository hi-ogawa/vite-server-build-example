import globApiRoutes from "virtual:glob-api-routes/hattip";
import { RequestHandler, compose } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPC_ENDPOINT } from "../trpc/common";
import { trpcRouter } from "../trpc/router";

export function createHattipEntry() {
  return compose(trpcHanlder(), globApiRoutes(), indexHtmlHanlder());
}

//
// handle index.html for SPA
//

// TODO: make vite plugin
function indexHtmlHanlder(): RequestHandler {
  return async () => {
    // @ts-ignore
    const documentImport = await import("/src/server/document.tsx");
    const clientEntry = "/src/client/index.tsx";

    let html: string = documentImport.render();

    // inject assets
    // https://github.com/hi-ogawa/vite/blob/2c38bae9458794d42eebd7f7351f5633e2fe8247/packages/vite/src/node/plugins/html.ts#L1037-L1044

    // dev script
    if (import.meta.env.DEV) {
      tinyassert(html.match(HEAD_INJECT_PRE_RE));
      html = html.replace(HEAD_INJECT_PRE_RE, (m) => `${m}${devScript}`);
    }

    // client entry
    let clientScriptPath: string;
    if (import.meta.env.DEV) {
      clientScriptPath = clientEntry;
    } else {
      const manifestRaw = await import("/dist/client/manifest.json?raw");
      const manifest = JSON.parse(manifestRaw.default);
      const found: any = Object.values(manifest).find((v: any) => v.isEntry);
      tinyassert(found);
      clientScriptPath = "/" + found.file;

      // css
      tinyassert(html.match(HEAD_INJECT_POST_RE));
      for (const cssFile of found.css ?? []) {
        const cssLink = `<link rel="stylesheet" href="/${cssFile}">`;
        html = html.replace(HEAD_INJECT_POST_RE, (m) => `${cssLink}${m}`);
      }
    }

    const clientScript = `<script type="module" src="${clientScriptPath}"></script>`;
    tinyassert(html.match(BODY_INJECT_POST_RE));
    html = html.replace(BODY_INJECT_POST_RE, (m) => `${clientScript}${m}`);

    return new Response("<!DOCTYPE html>" + html, {
      headers: [["content-type", "text/html"]],
    });
  };
}

const HEAD_INJECT_PRE_RE = /([ \t]*)<head[^>]*>/i;
const HEAD_INJECT_POST_RE = /([ \t]*)<\/head>/i;
const BODY_INJECT_POST_RE = /([ \t]*)<\/body>/i;

const devScript = `\
<script type="module">
  import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="/@vite/client"></script>
`;

//
// trpc
//

function trpcHanlder(): RequestHandler {
  return (ctx) => {
    if (ctx.url.pathname.startsWith(TRPC_ENDPOINT)) {
      return fetchRequestHandler({
        endpoint: TRPC_ENDPOINT,
        req: ctx.request,
        router: trpcRouter,
        createContext: (ctx) => ctx,
        onError: (e) => {
          console.error(e);
        },
      });
    }
    return ctx.next();
  };
}
