import { useState } from "react";
import { AnalyzerContext } from "./analyzer/analyzerContext";
import { useAnalyzerInBackground } from "./analyzer/useAnalyzerInBackground";
import MainPage from "./MainPage";

export const MemoryAnalyzerApp = () => {
  const [input, setInput] = useState<string>("");
  const { result, isBusy } = useAnalyzerInBackground(input);

  return (
    <AnalyzerContext.Provider
      value={{ analyzerResult: result, setAnalyzerInput: setInput, isBusy }}
    >
      <MainPage />
    </AnalyzerContext.Provider>
  );
};
