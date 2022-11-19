import { readFileSync } from "fs";
import { dedup } from "../utils/arrayUtils";
import { analyze, AnalyzerRow } from "./analyzer";
import { parse } from "./parser"

describe("parser and analyzer", () => {

    it("surefire log", () => {
        const content = readFileSync(__dirname + "/testfiles/mavenSurefire.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(421);
        expect(dedup(result.mavenPlugins.map(r => r.thread))).toEqual(["main"]);

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

    it("log without timestamps", () => {
        const content = readFileSync(__dirname + "/testfiles/logWithoutTimestamps.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(0);

        expect(result.modules).toHaveLength(1);
        expect(result.modules).toEqual([{ "compiledSources": 5, "compiledTestSources": 0, "copiedResources": 0, "copiedTestResources": 0, "module": "maven-archiver" }]);

    })

    it("log with simple timestamps", () => {
        const content = readFileSync(__dirname + "/testfiles/logWithSimpleTimestamps.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(65);
        expect(result.mavenPlugins.map(r => r.thread).filter((t, idx, arr) => arr.indexOf(t) === idx)).toEqual(["main"]);
        expect(durationSumForPlugin(result.mavenPlugins, "maven-compiler-plugin")).toEqual(25000);
        expect(durationSumForPlugin(result.mavenPlugins, "maven-javadoc-plugin")).toEqual(71000);

        expect(result.modules).toHaveLength(1);
        expect(result.modules).toEqual([{ "compiledSources": 478, "compiledTestSources": 450, "copiedResources": 0, "copiedTestResources": 0, "module": "commons-lang3" }]);
    })

    it("mutilthreaded build", () => {
        const content = readFileSync(__dirname + "/testfiles/mavenSurefireParallel.log", "utf8");

        const result = analyze(parse(content));

        const threads = dedup(result.mavenPlugins.flatMap(p => p.thread));
        expect(threads).toEqual(expect.arrayContaining(["mvn-builder-surefire", "mvn-builder-surefire-api", "mvn-builder-surefire-report-parser"]));
    })

    function durationSumForPlugin(result: AnalyzerRow[], plugin: string): number {
        return result.filter(r => r.plugin === plugin).reduce((prev, curr) => prev + curr.duration, 0);
    }

})