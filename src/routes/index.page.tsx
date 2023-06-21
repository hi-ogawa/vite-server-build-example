import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "../trpc/client";
import { cls } from "../utils/misc";

export function Page() {
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
