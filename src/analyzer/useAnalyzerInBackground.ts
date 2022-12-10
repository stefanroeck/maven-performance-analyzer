import { AnalyzerResult } from "./analyzer";

import { useEffect, useState } from "react";

const worker = new Worker(new URL('./analyzerWorker.ts', import.meta.url));

export const useAnalyzerInBackground = (content: string): AnalyzerResult | undefined => {
    const [result, setResult] = useState<AnalyzerResult | undefined>(undefined);

    useEffect(() => {
        (() => {
            if (content.length > 0) {
                console.log("Start processing in worker");
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
                    setResult(result);
                };
            } else {
                setResult(undefined);
            }
        })();
    }, [content])
    return result;
}