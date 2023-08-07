import { AnalyzerResult } from "./analyzer";

import { useEffect, useState } from "react";

const worker = new Worker(new URL("./analyzerWorker.ts", import.meta.url), {
  type: "module",
});

export const useAnalyzerInBackground = (content: string) => {
  const [result, setResult] = useState<AnalyzerResult | undefined>(undefined);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  useEffect(() => {
    (() => {
      if (content.length > 0) {
        console.log("Start processing in worker");
        setIsBusy(true);
        worker.postMessage(content);
        worker.onmessage = (message) => {
          const result = JSON.parse(message.data, (key: string, value: any) => {
            // convert date-strings to Date objects again
            if (key === "startTime") {
              return new Date(value);
            }
            return value;
          }) as AnalyzerResult;

          console.log("Received result from web worker");
          setIsBusy(false);
          setResult(result);
        };
      } else {
        setResult(undefined);
        setIsBusy(false);
      }
    })();
  }, [content]);
  return { result, isBusy };
};
