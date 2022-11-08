import dayjs from "dayjs";
import { parseMavenGoalExecutionLine, parseTimestamp } from "./parser"
import customParseFormat from 'dayjs/plugin/customParseFormat' // import plugin

describe("parser", () => {

    it("parses single line with millis", () => {
        dayjs.extend(customParseFormat) // custom plugin to allow specifying the date format, see https://day.js.org/docs/en/parse/string-format
        const line = "2022-11-08 19:00:12,500 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

        const result = parseMavenGoalExecutionLine(line);
        expect(result).toMatchObject({
            goal: "process (process-resource-bundles)",
            plugin: "maven-remote-resources-plugin",
            module: "httpcore5-reactive",
        });
        expect(result.startTime.format()).toEqual(dayjs("2022-11-08T18:00:12.500Z").format());
    })

    it("parses single line without millis", () => {
        dayjs.extend(customParseFormat) // custom plugin to allow specifying the date format, see https://day.js.org/docs/en/parse/string-format
        const line = "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

        const result = parseMavenGoalExecutionLine(line);
        expect(result).toMatchObject({
            goal: "process (process-resource-bundles)",
            plugin: "maven-remote-resources-plugin",
            module: "httpcore5-reactive",
        });
        expect(result.startTime.format()).toEqual(dayjs("2022-11-08T18:00:12.000Z").format());
    })

    it("parses timestamp", () => {
        expect(parseTimestamp("2022-11-08 11:00:00,500").format()).toEqual(dayjs("2022-11-08T10:00:00.500Z").format());
        expect(parseTimestamp("2022-11-08 11:00:00").format()).toEqual(dayjs("2022-11-08T10:00:00.000Z").format());
    })
})