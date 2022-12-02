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

// Looks like we need to repeat parts of the RegExp as concatenating as suggested on StackOverflow doesn't work
// https://stackoverflow.com/questions/185510/how-can-i-concatenate-regex-literals-in-javascript
// likely because of https://babeljs.io/docs/en/babel-plugin-transform-named-capturing-groups-regex that 
// breaks the logic of named capturing groups.

const mavenGoalExecutionRegexp =
    /(?<date>[0-9- :,.TZ\[\]]+) (\[(?<thread>[A-Z0-9a-z- _]*)\])? ?\[[A-Z]*\].*--- (?<plugin>.*):(?<version>.*):(?<goal>.*) @ (?<module>.*) ---/;
const lastLineWithTimeStampAndTotalTimeRegexp =
    /(?<date>[0-9- :,.TZ\[\]]+) (\[(?<thread>[A-Z0-9a-z- _]*)\])? ?\[[A-Z]*\] Total time: {2}([0-9:]+)/;


const mavenCompilerPluginRegexp = /.*--- maven-compiler-plugin:.*:(compile|testCompile).*@ (.*) ---/
const mavenResourcePluginRegexp = /.*--- maven-resources-plugin:.*:(resources|testResources).*@ (.*) ---/

const anyPluginRegexp = /.*---.*@.*---/
const mavenCompilerPluginCompilingRegexp = /.*Compiling (\d*) source files to.*/
const mavenResourcePluginCopyingRegexp = /.*Copying (\d*) resource.*/


export const parse = (logContent: string): ParserResult => {
    console.time("parser");
    try {
        const lines = logContent.split("\n");
        console.log(`Split string with ${logContent.length} chars into ${lines.length} lines`);
        return {
            lines: lines.map(line => matchGroupsAndProcess(line, mavenGoalExecutionRegexp, (groups => {
                //@ts-ignore
                const { date, goal, plugin, thread, module } = groups;
                return {
                    startTime: parseTimestamp(date),
                    plugin,
                    goal,
                    module,
                    thread,
                }
            }))).filter(l => l) as MavenGoalExecutionLine[],
            compiledSources: collectCompiledResources(lines),
            lastTimestamp: findLastTimeStamp(lines),
        }
    } finally {
        console.timeEnd("parser");
    }
}

const matchGroupsAndProcess = <T>(line: string, regExp: RegExp, process: (groups: any) => T): T | undefined => {
    const match = line.match(regExp);
    if (match && match.groups) {
        return process(match.groups);
    }
    return undefined;
}

export const findLastTimeStamp = (lines: string[]): Dayjs | undefined => {
    const lastLineWithTimeStamp = lines.reverse().find(line => line.match(lastLineWithTimeStampAndTotalTimeRegexp) !== null);
    const timestamp = lastLineWithTimeStamp !== undefined ? lastLineWithTimeStamp.match(lastLineWithTimeStampAndTotalTimeRegexp)?.groups?.date : undefined;
    return timestamp ? parseTimestamp(timestamp) : undefined;
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
