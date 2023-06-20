import { Outlet } from "react-router-dom";
import { ReactQueryWrapper } from "../utils/react-router-utils";

export function Page() {
  return (
    <ReactQueryWrapper>
      <PageInner />
    </ReactQueryWrapper>
  );
}

function PageInner() {
  return (
    <div className="flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center p-2 px-4 gap-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7] z-1">
      <div>Example</div>
      <div className="flex-1"></div>
      <a
        className="antd-btn antd-btn-ghost i-ri-github-line w-5 h-5"
        href="https://github.com/hi-ogawa/vite-server-build-example"
        target="_blank"
      ></a>
    </header>
  );
}
