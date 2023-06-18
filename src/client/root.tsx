import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "../trpc/client";
import { ReactQueryWrapper, cls } from "./misc";

export function Root() {
  return (
    <ReactQueryWrapper>
      <RootInner />
    </ReactQueryWrapper>
  );
}

function RootInner() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center p-2 px-4 gap-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7] z-1">
        <div>Example</div>
        <div className="flex-1"></div>
        <a
          className="antd-btn antd-btn-ghost i-ri-github-line w-5 h-5"
          href="https://github.com/hi-ogawa/vite-server-build-example"
          target="_blank"
        ></a>
      </header>
      <div>
        <Content />
      </div>
    </div>
  );
}

function Content() {
  const debugMutation = useMutation({
    mutationFn: () => trpcClient.debug.query(),
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full p-6">
        <div className="flex flex-col gap-4">
          <button
            className={cls(
              "antd-btn antd-btn-primary p-1",
              debugMutation.isLoading && "antd-btn-loading"
            )}
            onClick={() => debugMutation.mutate()}
          >
            Request
          </button>
          {debugMutation.isSuccess && (
            <pre className="overflow-auto p-1 border">
              {JSON.stringify(debugMutation.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
