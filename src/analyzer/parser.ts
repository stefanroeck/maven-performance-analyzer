import { isValid } from "./dateUtils";
import { dedup } from "../utils/arrayUtils";
import { parse as parseDate, parseISO } from 'date-fns'


export interface MavenGoalExecutionLine {
    module: string;
    plugin: string;
    goal: string;
    startTime: Date;
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
}

export type StatisticLine = SourceStatisticLine | ResourceStatisticLine;
export interface LastTimestamp {
    thread?: string;
    lastTimestamp: Date;
}

interface AbstractParserStatistics {
    totalBuildTime?: string;
    buildStatus?: "success" | "failed";
    multiThreadedBuild: boolean;
}

interface SingleThreadedParserStatistics extends AbstractParserStatistics {
    multiThreadedBuild: false;
}

interface MulitThreaderParserStatistics extends AbstractParserStatistics {
    multiThreadedBuild: true;
    threads: number;
}

export interface FileDownload {
    timestamp: Date | undefined;
    repository: string;
    resourceUrl: string;
    sizeInBytes: number;
}

export type ParserStatistics = SingleThreadedParserStatistics | MulitThreaderParserStatistics;

export interface TestStatistic {
    total: number;
    failures: number;
    errors: number;
    skipped: number;
}

export interface ParserResult {
    lines: MavenGoalExecutionLine[];
    compiledSources: StatisticLine[];
    lastTimestamps: LastTimestamp[];
    downloads: FileDownload[];
    tests: TestStatistic[];
    statistics: ParserStatistics;
}

// Looks like we need to repeat parts of the RegExp as concatenating as suggested on StackOverflow doesn't work
// https://stackoverflow.com/questions/185510/how-can-i-concatenate-regex-literals-in-javascript
// likely because of https://babeljs.io/docs/en/babel-plugin-transform-named-capturing-groups-regex that 
// breaks the logic of named capturing groups.

const mavenGoalExecutionRegexp =
    /\[?(?<date>\d+-\d+-\d+[ |T]\d+:\d+:\d+[.,]?\d+Z?)\]? (\[(?<thread>[A-Z0-9a-z- _]*)\])? ?\[[A-Z]*\].*--- (?<plugin>.*):(?<version>.*):(?<goal>.*) @ (?<module>.*) ---/;


const mavenCompilerPluginRegexp = /.*--- maven-compiler-plugin:.*:(compile|testCompile).*@ (.*) ---/
const mavenResourcePluginRegexp = /.*--- maven-resources-plugin:.*:(resources|testResources).*@ (.*) ---/
const anyMavenLogWithTimestamp = /\[?(?<date>\d+-\d+-\d+[ |T]\d+:\d+:\d+[.,]?\d+Z?)\]? (\[(?<thread>[A-Z0-9a-z- _]*)\])? ?\[[A-Z]*\].*/;

const anyPluginRegexp = /.*---.*@.*---/
const mavenCompilerPluginCompilingRegexp = /.*Compiling (\d*) source files to.*/
const mavenResourcePluginCopyingRegexp = /.*Copying (\d*) resource.*/

/* Statistics */
const multiThreadedParserLineRegexp = /.*Using the MultiThreadedBuilder implementation with a thread count of (?<threads>\d+)/;
const totalTimeRegexp = /.*Total time: {2}(?<totalTime>.+)/;
const buildSuccessRegexp = /.*BUILD SUCCESS/
const buildFailedRegexp = /.*BUILD FAILURE/

/* Downloads */
// Downloaded from central: https://repo.maven.apache.org/maven2/org/eclipse/jetty/websocket/websocket-api/9.4.44.v20210927/websocket-api-9.4.44.v20210927.jar (52 kB at 32 kB/s)
const downloadedResourceRegexp = /\[?(?<date>\d+-\d+-\d+[ |T]\d+:\d+:\d+[.,]?\d+Z?)?\]?.*Downloaded from (?<repo>[a-zA-Z]+): (?<res>[a-zA-Z0-9-:/.]+) \((?<size>[\d.]+ [a-zA-Z]+).+\)/;

const testRegexp = /.*Tests run: (?<total>\d+), Failures: (?<failures>\d+), Errors: (?<errors>\d+), Skipped: (?<skipped>\d+)$/m;

export const parse = (logContent: string): ParserResult => {
    console.time("parser");
    try {
        const logLines = logContent.split("\n");
        console.log(`Split string with ${logContent.length} chars into ${logLines.length} lines`);
        const mavenGoalExecutionLines: MavenGoalExecutionLine[] = logLines.map(line => matchGroupsAndProcess(line, mavenGoalExecutionRegexp, (groups => {
            //@ts-ignore
            const { date, goal, plugin, thread, module } = groups;
            return {
                startTime: parseTimestamp(date),
                plugin,
                goal,
                module,
                thread,
            };
        }))).filter(l => l) as MavenGoalExecutionLine[];
        const threads = dedup(mavenGoalExecutionLines.map(r => r.thread).filter(l => l) as string[]);
        return {
            lines: mavenGoalExecutionLines.filter(l => l) as MavenGoalExecutionLine[],
            compiledSources: collectCompiledResources(logLines),
            lastTimestamps: findLastTimeStamps(logLines, threads),
            statistics: collectStatistics(logLines),
            tests: collectTests(logLines),
            downloads: collectDownloads(logLines),
        }
    } finally {
        console.timeEnd("parser");
    }
}

const matchGroupsAndProcess = <T>(line: string, regExp: RegExp, process: (groups: any) => T): T | undefined => {
    const match = line.match(regExp);
    return ifDefined(match?.groups, (g) => process(g));
}

const ifDefined = <T, R>(value: T | undefined, func: (t: T) => R, def: R | undefined = undefined): R | undefined => {
    if (value !== undefined) {
        return func(value);
    }
    return def;
};

const findLastTimeStamps = (lines: string[], threads: string[]): LastTimestamp[] => {
    const lastTimestamps: LastTimestamp[] = [];
    if (threads.length > 0) {
        threads.forEach(thread => {
            let lastTimestamp: Date | undefined = undefined;
            for (let i = lines.length - 1; i >= 0; i--) {
                lastTimestamp = matchGroupsAndProcess(lines[i], anyMavenLogWithTimestamp, ({ thread: t, date }) => {
                    return (thread === t) ? parseTimestamp(date) : undefined;
                });
                if (lastTimestamp) { // stop loop after first match
                    break;
                }
            }
            if (lastTimestamp) {
                lastTimestamps.push({
                    thread,
                    lastTimestamp,
                });
            }
        });
    } else {
        let lastTimestamp: Date | undefined = undefined;
        for (let i = lines.length - 1; i >= 0; i--) {
            lastTimestamp = matchGroupsAndProcess(lines[i], anyMavenLogWithTimestamp, ({ date }) => parseTimestamp(date));
            if (lastTimestamp) {
                break;
            }
        }
        if (lastTimestamp) {
            lastTimestamps.push({ lastTimestamp });
        }
    }
    return lastTimestamps;
}

export const supportedTimestampFormats = ["yyyy-MM-dd HH:mm:ss,SSS", "yyyy-MM-dd HH:mm:ss"];

export const parseTimestamp = (timestamp: string): Date => {
    for (const timestampFormat of supportedTimestampFormats) {
        const parsedDate = parseDate(timestamp, timestampFormat, new Date());
        if (isValid(parsedDate)) {
            return parsedDate;
        }
    }
    const parsedDate = parseISO(timestamp);
    if (isValid(parsedDate)) {
        return parsedDate;
    }
    throw new Error("Cannot parse date: " + timestamp);
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

const collectStatistics = (logLines: string[]): ParserStatistics => {

    return logLines.reduce((prev, line) => {
        const threads: number | undefined = matchGroupsAndProcess(line, multiThreadedParserLineRegexp, groups => parseInt(groups.threads));
        if (threads !== undefined) {
            return { ...prev, threads, multiThreadedBuild: true };
        }

        const totalBuildTime: string | undefined = matchGroupsAndProcess(line, totalTimeRegexp, groups => groups.totalTime);
        if (totalBuildTime !== undefined) {
            return { ...prev, totalBuildTime };
        }

        if (line.match(buildSuccessRegexp)) {
            return { ...prev, buildStatus: "success" };
        }

        if (line.match(buildFailedRegexp)) {
            return { ...prev, buildStatus: "failed" };
        }

        return prev;
    }, {
        multiThreadedBuild: false,
    } as ParserStatistics);
};

const collectDownloads = (logLines: string[]): FileDownload[] => {
    return logLines.map(line => matchGroupsAndProcess(line, downloadedResourceRegexp, (groups) => {
        const a: FileDownload = {
            repository: groups.repo,
            resourceUrl: groups.res,
            timestamp: ifDefined(groups.date, d => parseTimestamp(d)),
            sizeInBytes: parseSize(groups.size),
        }
        return a;
    })).filter(l => l) as FileDownload[];
};

const collectTests = (logLines: string[]): TestStatistic[] => {
    return logLines.map(line => matchGroupsAndProcess(line, testRegexp, (groups) => {
        const a: TestStatistic = {
            total: parseInt(groups.total),
            errors: parseInt(groups.errors),
            failures: parseInt(groups.failures),
            skipped: parseInt(groups.skipped),
        }
        return a;
    })).filter(l => l) as TestStatistic[];
};


function parseSize(sizeWithUnit: string): number {
    const sizeArray = sizeWithUnit.split(" ");
    if (sizeArray.length === 2) {
        const unit = sizeArray[1];
        const sizeNumber = parseFloat(sizeArray[0]);
        switch (unit) {
            case "B": return sizeNumber;
            case "kB": return sizeNumber * 1024;
            case "MB": return sizeNumber * 1024 * 1024;
        };
    }
    throw new Error("Cannot parse download size with unit: " + sizeWithUnit);
}

