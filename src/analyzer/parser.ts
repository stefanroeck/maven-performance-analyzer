import dayjs, { Dayjs } from "dayjs";


export interface MavenGoalExecutionLine {
    module: string;
    plugin: string;
    goal: string;
    startTime: Dayjs;
    thread?: string;
    row?: number;
}

type FileOrigin = "main" | "test";

export interface SourceStatisticLine extends AbstactStatisticLine {
    type: "source";
    compiledSources: number;
}

export interface ResourceStatisticLine extends AbstactStatisticLine {
    type: "resource";
    copiedResources: number;
}

interface AbstactStatisticLine {
    type: "source" | "resource";
    module: string;
    compileMode: FileOrigin;
};

export type StatisticLine = SourceStatisticLine | ResourceStatisticLine;

export interface ParserResult {
    lines: MavenGoalExecutionLine[];
    compiledSources: StatisticLine[];
    lastTimestamp?: Dayjs;
    totalBuildTime?: number;
}

const timestampThreadLevelRegexp = /(?<date>[0-9- :,.TZ\[\]]+) (\[(?<thread>[A-Z0-9a-z- _]*)\])? ?\[[A-Z]*\]/;
const mavenGoalRegexp = /.*--- (?<plugin>.*):(?<version>.*):(?<goal>.*) @ (?<module>.*) ---/;
const mavenGoalExecutionRegexp = new RegExp(timestampThreadLevelRegexp.source + mavenGoalRegexp.source);
const totalTimeRegexp = / Total time:  ([0-9:]+)/;
const lastLineWithTimeStampAndTotalTimeRegexp = new RegExp(timestampThreadLevelRegexp.source + totalTimeRegexp.source);

const mavenCompilerPluginRegexp = /.*--- maven-compiler-plugin:.*:(compile|testCompile).*@ (.*) ---/
const mavenResourcePluginRegexp = /.*--- maven-resources-plugin:.*:(resources|testResources).*@ (.*) ---/

const anyPluginRegexp = /.*---.*@.*---/
const mavenCompilerPluginCompilingRegexp = /.*Compiling (\d*) source files to.*/
const mavenResourcePluginCopyingRegexp = /.*Copying (\d*) resource.*/

export const parse = (logContent: string): ParserResult => {
    const lines = logContent.split("\n");
    return {
        lines: lines.filter(line => line.match(mavenGoalExecutionRegexp)).map((line, row) => {
            const result = parseMavenGoalExecutionLine(line);
            return { ...result, row };
        }),
        compiledSources: collectCompiledResources(lines),
        lastTimestamp: findLastTimeStamp(lines),
    }
}

export const findLastTimeStamp = (lines: string[]): Dayjs | undefined => {
    const lastLineWithTimeStamp = lines.reverse().find(line => line.match(lastLineWithTimeStampAndTotalTimeRegexp) !== null);
    const timestamp = lastLineWithTimeStamp !== undefined ? lastLineWithTimeStamp.match(lastLineWithTimeStampAndTotalTimeRegexp)?.groups?.date : undefined;
    return timestamp ? parseTimestamp(timestamp) : undefined;
}

// Parses sth like this
// 2022-11-08 19:00:12,555 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---
export const parseMavenGoalExecutionLine = (line: string): MavenGoalExecutionLine => {
    const matches = line.match(mavenGoalExecutionRegexp);
    if (!matches) {
        throw new Error("Line does not match regexp: " + line);
    }
    //@ts-ignore
    const { date, goal, plugin, thread, module } = matches.groups;
    return {
        startTime: parseTimestamp(date),
        plugin,
        goal,
        module,
        thread,
    }
}

export const supportedTimestampFormats = ["YYYY-MM-DD HH:mm:ss,SSS", "YYYY-MM-DD HH:mm:ss"];
export const parseTimestamp = (timestamp: string): Dayjs => {
    return dayjs(timestamp, supportedTimestampFormats);
}

function collectCompiledResources(lines: string[]): StatisticLine[] {
    // TODO: Support multithreaded builds
    let module = undefined;
    let fileOrigin: FileOrigin | undefined;
    const result: StatisticLine[] = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matchCompilerPluginModule = line.match(mavenCompilerPluginRegexp);
        const matchResourcesPluginModule = line.match(mavenResourcePluginRegexp);
        if (matchCompilerPluginModule) {
            const mode = matchCompilerPluginModule[1] as "compile" | "testCompile";
            fileOrigin = mode === "compile" ? "main" : "test";
            module = matchCompilerPluginModule[2];
        } else if (matchResourcesPluginModule) {
            const mode = matchResourcesPluginModule[1] as "resources" | "testResources";
            fileOrigin = mode === "resources" ? "main" : "test";
            module = matchResourcesPluginModule[2];
        } else if (line.match(anyPluginRegexp)) {
            module = undefined;
            fileOrigin = undefined;
        }

        if (module && fileOrigin) {
            const matchCompiling = line.match(mavenCompilerPluginCompilingRegexp);
            if (matchCompiling) {
                const compiledSources = parseInt(matchCompiling[1]);
                result.push({
                    type: "source",
                    module: module,
                    compiledSources,
                    compileMode: fileOrigin,
                });
            }
            const matchCopying = line.match(mavenResourcePluginCopyingRegexp);
            if (matchCopying) {
                const copiedResources = parseInt(matchCopying[1]);
                result.push({
                    type: "resource",
                    module: module,
                    copiedResources,
                    compileMode: fileOrigin,
                });
            }
        }
    }

    return result;
}
