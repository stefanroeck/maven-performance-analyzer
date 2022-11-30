import dayjs from "dayjs";
import { parseMavenGoalExecutionLine, parseTimestamp } from "./parser"

describe("parser", () => {

    it("parses single line with millis", () => {
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
        const line = "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

        const result = parseMavenGoalExecutionLine(line);
        expect(result).toMatchObject({
            goal: "process (process-resource-bundles)",
            plugin: "maven-remote-resources-plugin",
            module: "httpcore5-reactive",
        });
        expect(result.startTime.format()).toEqual(dayjs("2022-11-08T18:00:12.000Z").format());
    })

    it("parses line without thread name", () => {
        const line = "2022-11-08 19:00:12 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---";

        const result = parseMavenGoalExecutionLine(line);

        expect(result.thread).toBeUndefined();
    })


    it("parses line with thread name", () => {
        const line = "2022-11-19 19:06:02,813 [mvn-builder-surefire] [INFO] --- maven-enforcer-plugin:3.0.0:enforce (enforce-maven-version) @ surefire ---";

        const result = parseMavenGoalExecutionLine(line);

        expect(result.thread).toEqual("mvn-builder-surefire");
        expect(result.startTime.format()).toEqual(dayjs("2022-11-19T18:06:02.813Z").format());
        expect(result.goal).toEqual("enforce (enforce-maven-version)");
        expect(result.module).toEqual("surefire");
        expect(result.plugin).toEqual("maven-enforcer-plugin");
    })

    it("parses line with another thread name", () => {
        const line = "2022-11-23 08:05:26,619 [BuilderThread 0] [INFO] --- maven-enforcer-plugin:3.0.0:enforce (enforce-maven-version) @ surefire ---";

        const result = parseMavenGoalExecutionLine(line);

        expect(result.thread).toEqual("BuilderThread 0");
        expect(result.startTime.format()).toEqual(dayjs("2022-11-23T07:05:26.619Z").format());
        expect(result.goal).toEqual("enforce (enforce-maven-version)");
        expect(result.module).toEqual("surefire");
        expect(result.plugin).toEqual("maven-enforcer-plugin");
    })

    it("parses jenkins build line", () => {
        const line = "[2022-11-29T20:07:14.966Z] [INFO] --- jacoco-maven-plugin:0.8.7:prepare-agent (default) @ module-one ---";

        const result = parseMavenGoalExecutionLine(line);

        expect(result.thread).toBeUndefined();
        expect(result.startTime.format()).toEqual(dayjs("2022-11-29T19:07:14.966Z").format());
        expect(result.goal).toEqual("prepare-agent (default)");
        expect(result.module).toEqual("module-one");
        expect(result.plugin).toEqual("jacoco-maven-plugin");
    })

    it("parses timestamp", () => {
        expect(parseTimestamp("2022-11-08 11:00:00,500").format()).toEqual(dayjs("2022-11-08T10:00:00.500Z").format());
        expect(parseTimestamp("2022-11-08 11:00:00").format()).toEqual(dayjs("2022-11-08T10:00:00.000Z").format());
    })
})