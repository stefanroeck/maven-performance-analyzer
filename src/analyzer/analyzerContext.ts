import { createContext } from "react";
import { AnalyzerResult } from "./analyzer";

export interface AnalyzerContextState {
    setAnalyzerInput: (logContent: string) => void;
    analyzerResult: AnalyzerResult | undefined;
}

const doNothing = () => { };

export const AnalyzerContext = createContext<AnalyzerContextState>({
    setAnalyzerInput: doNothing,
    analyzerResult: undefined,
});

