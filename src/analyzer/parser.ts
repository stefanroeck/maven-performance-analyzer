import dayjs, { Dayjs } from "dayjs";


export interface MavenGoalExecutionLine {
    module: string;
    plugin: string;
    goal: string;
    startTime: Dayjs;
    thread?: string;
    row?: number;
}

type CompileMode = "src" | "testSrc";

export interface SourceStatisticLine {
    module: string;
    compiledSources: number;
    compileMode: CompileMode;
}

export interface RessourceStatisticLine {
    module: string;
    copiedResources: number;
}

export interface ParserResult {
    lines: MavenGoalExecutionLine[];
    compiledSources: SourceStatisticLine[];
    lastTimestamp?: Dayjs;
    totalBuildTime?: number;
}

const mavenGoalExecutionRegexp = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},?\d{0,3}).*--- (.*):(.*):(.*) @ (.*) ---/
const lineWithTimeStampRegexp = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},?\d{0,3}).*/

const mavenCompilerPluginRegexp = /.*--- maven-compiler-plugin:.*:(compile|testCompile).*@ (.*) ---/
const anyPluginRegexp = /.*---.*@.*---/
const mavenCompilerPluginCompilingRegexp = /.*Compiling (\d*) source files to.*/

export const parse = (logContent: string): ParserResult => {
    const lines = logContent.split("\n");
    return {
        lines: lines.filter(line => line.match(mavenGoalExecutionRegexp)).map((line, row) => {
            const result = parseMavenGoalExecutionLine(line);
            return { ...result, row, thread: "main" };
        }),
        compiledSources: collectCompiledResources(lines),
        lastTimestamp: findLastTimeStamp(lines),
    }
}

const findLastTimeStamp = (lines: string[]): Dayjs | undefined => {
    const lastLineWithTimeStamp = lines.reverse().find(line => line.match(lineWithTimeStampRegexp) !== null);
    const timestamp = lastLineWithTimeStamp !== undefined ? lastLineWithTimeStamp.match(lineWithTimeStampRegexp)?.[1] : undefined;
    return timestamp ? dayjs(timestamp) : undefined;
}

// Parses sth like this
// 2022-11-08 19:00:12,555 [INFO] --- maven-remote-resources-plugin:1.7.0:process (process-resource-bundles) @ httpcore5-reactive ---
export const parseMavenGoalExecutionLine = (line: string): MavenGoalExecutionLine => {
    const matches = line.match(mavenGoalExecutionRegexp);
    if (!matches) {
        throw new Error("Line does not match regexp: " + line);
    }
    return {
        startTime: parseTimestamp(matches[1]),
        plugin: matches[2],
        goal: matches[4],
        module: matches[5],
    }
}

export const parseTimestamp = (timestamp: string): Dayjs => {
    return dayjs(timestamp, ["YYYY-MM-DD HH:mm:ss,SSS", "YYYY-MM-DD HH:mm:ss"]);
}

function collectCompiledResources(lines: string[]): SourceStatisticLine[] {
    let moduleInsideOfCompilerPlugin = undefined;
    let mode: "compile" | "testCompile" | undefined = undefined;
    const result: SourceStatisticLine[] = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matchModule = line.match(mavenCompilerPluginRegexp)
        if (matchModule) {
            mode = matchModule[1] as "compile" | "testCompile" | undefined;
            moduleInsideOfCompilerPlugin = matchModule[2];
        } else if (line.match(anyPluginRegexp)) {
            moduleInsideOfCompilerPlugin = undefined;
            mode = undefined;
        }

        if (moduleInsideOfCompilerPlugin) {
            const matchCompiling = line.match(mavenCompilerPluginCompilingRegexp);
            if (matchCompiling) {
                const compiledSources = parseInt(matchCompiling[1]);
                result.push({
                    module: moduleInsideOfCompilerPlugin,
                    compiledSources,
                    compileMode: mode === "compile" ? "src" : "testSrc",
                });
            }
        }
    }

    return result;
}
