import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { createRoot } from "react-dom/client";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const root = createRoot(el);
  root.render(<Root />);
}

function Root() {
  return <div>hello client</div>;
}

main();
