import { readFileSync } from "fs";
import { analyze, AnalyzerRow } from "./analyzer";
import { parse } from "./parser"

describe("parser and analyzer", () => {

    it("surefire log", () => {
        const content = readFileSync(__dirname + "/testfiles/mavenSurefire.log", "utf8");

        const result = analyze(parse(content));

        expect(result.length).toEqual(421);
        expect(result.map(r => r.thread).filter((t, idx, arr) => arr.indexOf(t) === idx)).toEqual(["main"]);

        expect(durationSumForPlugin(result, "maven-compiler-plugin")).toEqual(143028);
        expect(durationSumForPlugin(result, "maven-surefire-plugin")).toEqual(434);
    })

    function durationSumForPlugin(result: AnalyzerRow[], plugin: string): number {
        return result.filter(r => r.plugin === plugin).reduce((prev, curr) => prev + curr.duration, 0);
    }

})