import { analyze } from "./analyzer";
import { parse } from "./parser";

onmessage = (event) => {
  console.log("running inside worker");
  const content = event.data;
  const parsed = parse(content);
  //console.log("parsed", parsed);
  const analyzed = analyze(parsed);
  //console.log("analyzed", analyzed);
  postMessage(JSON.stringify(analyzed));
};
