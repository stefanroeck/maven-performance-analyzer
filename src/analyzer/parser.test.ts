import dayjs from "dayjs";
import { parseMavenGoalExecutionLine } from "./parser"

describe("parser", () => {

    it("parses single line", () => {
        const line = "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

        expect(parseMavenGoalExecutionLine(line)).toEqual({
            startTime: dayjs("2022-11-08T18:00:12.000Z"),
            goal: "process (process-resource-bundles)",
            plugin: "maven-remote-resources-plugin",
            module: "httpcore5-reactive",
        });
    })
})