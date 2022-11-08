import dayjs from "dayjs";
import { analyze, AnalyzerRow } from "./analyzer"

describe("analyzer", () => {

    it("calculates duration for single thread", () => {

        const analysis = analyze({
            lines: [{
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
            }]
            , lastTimestamp: dayjs("2022-01-01 10:00:15"),
        });

        expect(analysis).toEqual<AnalyzerRow[]>([{
            module: "m1",
            plugin: "p1",
            thread: "main",
            duration: 5000,
        }, {
            module: "m1",
            plugin: "p2",
            thread: "main",
            duration: 10000,
        }]);
    })

    it("analyzes empty result", () => {
        expect(analyze({ lines: [] })).toEqual([]);
    })
})