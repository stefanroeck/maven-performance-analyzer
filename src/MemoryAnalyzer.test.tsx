import MainPage from "./MainPage";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import {
  AnalyzerContext,
  AnalyzerContextState,
} from "./analyzer/analyzerContext";
import { act } from "react-dom/test-utils";
import { describe, expect, it } from "vitest";

describe("MemoryAnalyzerApp", () => {
  const analyzerContext: AnalyzerContextState = {
    analyzerResult: undefined,
    setAnalyzerInput: () => {},
    isBusy: false,
  };

  const MainPageWithContext = () => {
    return (
      <AnalyzerContext.Provider value={analyzerContext}>
        <MainPage />
      </AnalyzerContext.Provider>
    );
  };

  it("renders without errors", async () => {
    render(<MainPageWithContext />);

    expect(screen.getByText("Maven Performance Analyzer")).toBeInTheDocument();
  });

  it("enables button if input field is not empty", async () => {
    render(<MainPageWithContext />);

    const textbox = screen.getByRole("textbox");
    const analyzeButton = screen.getByRole("button", { name: "Analyze" });
    expect(analyzeButton).toBeDisabled();

    await act(async () => {
      await userEvent.type(textbox, "Some maven input");
    });
    expect(analyzeButton).toBeEnabled();
  });
});
