import { AnalyzerResult, analyze } from "./analyzer";
import { parse } from "./parser";

onmessage = (event) => {
  console.log("running inside worker");
  const content = event.data;
  let analyzed: AnalyzerResult;
  try {
    const parsed = parse(content);
    analyzed = analyze(parsed);
  } catch (err) {
    analyzed = {
      messages: {
        error: err ? err.toString() : "Unknown error",
      },
      mavenPlugins: [],
      modules: [],
    };
  }
  postMessage(JSON.stringify(analyzed));
};
