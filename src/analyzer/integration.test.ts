import { readFileSync } from "fs";
import { dedup } from "../utils/arrayUtils";
import { analyze, MavenPluginStats } from "./analyzer";
import { parse, TestStatistic } from "./parser"

describe("parser and analyzer", () => {

    it("empty input", () => {
        const result = analyze(parse(""));

        expect(result.mavenPlugins).toHaveLength(0);
        expect(result.modules).toHaveLength(0);
    })

    it("arbitrary input", () => {
        const result = analyze(parse("This is not a maven logfile\nNo, it's not."));

        expect(result.mavenPlugins).toHaveLength(0);
        expect(result.modules).toHaveLength(0);
    })

    it("surefire log", () => {
        const content = readFileSync(__dirname + "/testfiles/mavenSurefire.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(421);
        expect(dedup(result.mavenPlugins.map(r => r.thread))).toEqual(["main"]);

        expect(durationSumForPlugin(result.mavenPlugins, "maven-compiler-plugin")).toEqual(143028);
        expect(durationSumForPlugin(result.mavenPlugins, "maven-surefire-plugin")).toEqual(434);

        expect(result.modules).toHaveLength(24);
        expect(result.modules[0]).toEqual({
            module: "surefire-shared-utils",
            compiledSources: 0,
            compiledTestSources: 0,
            copiedResources: 3,
            copiedTestResources: 3,
        });
        expect(result.modules[2]).toEqual({
            module: "surefire-api",
            compiledSources: 111,
            compiledTestSources: 28,
            copiedResources: 3,
            copiedTestResources: 3,
        });
        expect(result.modules[5]).toEqual({
            module: "surefire-booter",
            compiledSources: 34,
            compiledTestSources: 15,
            copiedResources: 4,
            copiedTestResources: 11,
        });
        expect(result.stats.multiThreaded).toEqual(false);
        expect(result.stats.threads).toEqual(1);
        expect(result.stats.totalBuildTime).toEqual("04:20 min");
        expect(result.stats.status).toEqual("success");
        expect(result.stats.totalDownloadedBytes).toEqual(13773414.4);
        expect(result.tests).toEqual<TestStatistic>({
            errors: 0,
            failures: 0,
            total: 0,
            skipped: 0,
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
        expect(result.modules).toEqual([{ "compiledSources": 478, "compiledTestSources": 450, "copiedResources": 4, "copiedTestResources": 8, "module": "commons-lang3" }]);
    })

    it("mutilthreaded build", () => {
        const content = readFileSync(__dirname + "/testfiles/mavenSurefireParallel.log", "utf8");

        const result = analyze(parse(content));

        const threads = dedup(result.mavenPlugins.flatMap(p => p.thread));
        expect(threads).toEqual(expect.arrayContaining(["mvn-builder-surefire", "mvn-builder-surefire-api", "mvn-builder-surefire-report-parser"]));
        const duration = result.mavenPlugins
            .filter(r => r.plugin === "maven-resources-plugin" && r.thread === "mvn-builder-surefire-grouper")
            .reduce((prev, curr) => prev + curr.duration, 0);
        expect(duration).toEqual(35);
        expect(result.stats.multiThreaded).toEqual(true);
        expect(result.stats.threads).toEqual(4);
        expect(result.stats.totalBuildTime).toEqual("34.008 s (Wall Clock)");
        expect(result.stats.status).toEqual("failed");
        expect(result.stats.totalDownloadedBytes).toEqual(0);
    })

    it("guava log", () => {
        const content = readFileSync(__dirname + "/testfiles/guavaBuildJenkinsTimestamps.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(77);
        expect(dedup(result.mavenPlugins.map(r => r.thread))).toEqual(["main"]);

        expect(durationSumForPlugin(result.mavenPlugins, "maven-compiler-plugin")).toEqual(109646);
        expect(durationSumForPlugin(result.mavenPlugins, "maven-surefire-plugin")).toEqual(1499363);
        expect(durationSumForModule(result.mavenPlugins, "guava-parent")).toEqual(3869);
        expect(durationSumForModule(result.mavenPlugins, "guava-testlib")).toEqual(361975);

        expect(result.modules).toHaveLength(4);
        expect(result.modules[0]).toEqual({
            module: "guava",
            compiledSources: 619,
            compiledTestSources: 0,
            copiedResources: 0,
            copiedTestResources: 0,
        });
        expect(result.modules[1]).toEqual({
            module: "guava-testlib",
            compiledSources: 292,
            compiledTestSources: 37,
            copiedResources: 0,
            copiedTestResources: 0,
        });
        expect(result.modules[2]).toEqual({
            module: "guava-tests",
            compiledSources: 0,
            compiledTestSources: 631,
            copiedResources: 0,
            copiedTestResources: 6,
        });
    })

    it("guava log parallel", () => {
        const content = readFileSync(__dirname + "/testfiles/guavaBuildParallel.log", "utf8");

        const result = analyze(parse(content));

        expect(result.mavenPlugins.length).toEqual(77);
        expect(dedup(result.mavenPlugins.map(r => r.thread))).toEqual([
            "mvn-builder-guava-parent",
            "mvn-builder-guava-bom",
            "mvn-builder-guava",
            "mvn-builder-guava-testlib",
            "mvn-builder-guava-tests",
            "mvn-builder-guava-gwt",
        ]);

        expect(durationSumForModule(result.mavenPlugins, "guava-parent")).toEqual(3572);
        expect(durationSumForModule(result.mavenPlugins, "guava-testlib")).toEqual(296194);

        expect(result.modules).toHaveLength(4);
        expect(result.modules[0]).toEqual({
            module: "guava",
            compiledSources: 619,
            compiledTestSources: 0,
            copiedResources: 0,
            copiedTestResources: 0,
        });
        expect(result.modules[1]).toEqual({
            module: "guava-testlib",
            compiledSources: 292,
            compiledTestSources: 37,
            copiedResources: 0,
            copiedTestResources: 0,
        });
        expect(result.modules[2]).toEqual({
            module: "guava-tests",
            compiledSources: 0,
            compiledTestSources: 631,
            copiedResources: 0,
            copiedTestResources: 6,
        });
        expect(result.tests).toEqual<TestStatistic>({
            errors: 0,
            failures: 0,
            total: 1711868,
            skipped: 515,
        });
    })

    function durationSumForPlugin(result: MavenPluginStats[], plugin: string): number {
        return result.filter(r => r.plugin === plugin).reduce((prev, curr) => prev + curr.duration, 0);
    }

    function durationSumForModule(result: MavenPluginStats[], module: string): number {
        return result.filter(r => r.module === module).reduce((prev, curr) => prev + curr.duration, 0);
    }
})