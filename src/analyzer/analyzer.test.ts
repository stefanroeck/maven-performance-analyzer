import dayjs from "dayjs";
import { analyze, AnalyzerRow } from "./analyzer"

describe("analyzer", () => {

    it("calculates duration for single thread", () => {

        const lines = [{
            module: "m1",
            plugin: "p1",
            goal: "g1",
            thread: "main",
            startTime: dayjs("2022-01-01 10:00:00"),
        }, {
            module: "m1",
            plugin: "p2",
            goal: "g2",
            thread: "main",
            startTime: dayjs("2022-01-01 10:00:05"),
        }];

        const analysis = analyze({
            lines,
            lastTimestamp: dayjs("2022-01-01 10:00:15"),
            compiledSources: [],
        });

        expect(analysis.mavenPlugins).toEqual<AnalyzerRow[]>([{
            module: lines[0].module,
            plugin: lines[0].plugin,
            thread: lines[0].thread,
            startTime: lines[0].startTime,
            duration: 5000,
        }, {
            module: lines[1].module,
            plugin: lines[1].plugin,
            thread: lines[1].thread,
            startTime: lines[1].startTime,
            duration: 10000,
        }]);
    })

    it("analyzes empty result", () => {
        expect(analyze({ lines: [], compiledSources: [], }).mavenPlugins).toEqual([]);
    })
})