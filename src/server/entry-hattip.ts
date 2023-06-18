import { RequestHandler, compose } from "@hattip/compose";
import indexHtml from "../../index.html?raw";

const indexHtmlDev = indexHtml.replace(
  "<!-- INJECT_DEV_VITE_CLIENT -->",
  `
<script type="module">
  import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="/@vite/client"></script>
`
);

const handler: RequestHandler = (ctx) => {
  if (import.meta.env.DEV && ctx.url.pathname === "/") {
    return new Response(indexHtmlDev, {
      headers: [["content-type", "text/html"]],
    });
  }
  if (ctx.url.pathname === "/debug") {
    return new Response("hello server");
  }
  return ctx.next();
};

export function createHattipEntry() {
  return compose(handler);
}
