import { analyze } from "./analyzer";
import { parse } from "./parser";

onmessage = (event) => {
    console.log("running inside worker");
    const content = event.data;;
    const result = analyze(parse(content));
    postMessage(JSON.stringify(result));
}
