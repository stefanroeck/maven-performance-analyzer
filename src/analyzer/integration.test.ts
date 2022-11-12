import { readFileSync } from "fs";
import { analyze, AnalyzerRow } from "./analyzer";
import { parse } from "./parser"

describe("parser and analyzer", () => {

    it("surefire log", () => {
        const content = readFileSync(__dirname + "/testfiles/mavenSurefire.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(421);
        expect(result.mavenPlugins.map(r => r.thread).filter((t, idx, arr) => arr.indexOf(t) === idx)).toEqual(["main"]);

        expect(durationSumForPlugin(result.mavenPlugins, "maven-compiler-plugin")).toEqual(143028);
        expect(durationSumForPlugin(result.mavenPlugins, "maven-surefire-plugin")).toEqual(434);

        expect(result.modules).toHaveLength(19);
        expect(result.modules[0]).toEqual({
            module: "surefire-api",
            compiledSources: 111,
            compiledTestSources: 28,
            copiedResources: 0,
            copiedTestResources: 0,
        });
    })

    function durationSumForPlugin(result: AnalyzerRow[], plugin: string): number {
        return result.filter(r => r.plugin === plugin).reduce((prev, curr) => prev + curr.duration, 0);
    }

})