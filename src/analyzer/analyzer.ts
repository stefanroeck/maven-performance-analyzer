import { dedup } from "../utils/arrayUtils";
import { ifDefinedOrDefault } from "../utils/utils";
import { isValid } from "./dateUtils";
import { ParserResult } from "./parser";

export interface Location {
    startLine: number;
    endLine: number;
}

export interface MavenPluginStats {
    plugin: string;
    module: string;
    startTime: Date;
    duration: number;
    thread: string;
    location?: Location;
}

export interface ModuleStats {
    module: string;
    compiledSources: number;
    compiledTestSources: number;
    copiedResources: number;
    copiedTestResources: number;
}

export interface GeneralStats {
    status: "success" | "failed" | "unknown";
    multiThreaded: boolean;
    threads: number;
    totalBuildTime?: string;
    totalDownloadedBytes: number;
}

export interface TestStats {
    total: number;
    failures: number;
    errors: number;
    skipped: number;
}

export interface AnalyzerMessages {
    info?: string;
    error?: string;
}

export interface AnalyzerResult {
    mavenPlugins: MavenPluginStats[];
    modules: ModuleStats[];
    stats: GeneralStats;
    tests: TestStats;
    messages: AnalyzerMessages;
}

const MINIMUM_DURATION_IN_MS = 0;

export const analyze = ({ lines, lastTimestamps, compiledSources, statistics, downloads, tests }: ParserResult): AnalyzerResult => {
    const aggregatedCompiledSources: ModuleStats[] = compiledSources.reduce((arr, curr) => {
        const existing = arr.find(c => c.module === curr.module);
        if (existing) {
            if (curr.type === "source") {
                switch (curr.compileMode) {
                    case "main": existing.compiledSources += curr.compiledSources; break;
                    case "test": existing.compiledTestSources += curr.compiledSources; break;
                }
            } else {
                switch (curr.compileMode) {
                    case "main": existing.copiedResources += curr.copiedResources; break;
                    case "test": existing.copiedTestResources += curr.copiedResources; break;
                }
            }

        } else {
            const analyzedModule: ModuleStats = {
                module: curr.module,
                compiledSources: 0,
                compiledTestSources: 0,
                copiedResources: 0,
                copiedTestResources: 0,
            }
            if (curr.type === "source") {
                switch (curr.compileMode) {
                    case "main": analyzedModule.compiledSources = curr.compiledSources; break;
                    case "test": analyzedModule.compiledTestSources = curr.compiledSources; break;
                }
            } else {
                switch (curr.compileMode) {
                    case "main": analyzedModule.copiedResources = curr.copiedResources; break;
                    case "test": analyzedModule.copiedTestResources = curr.copiedResources; break;
                }
            }

            arr.push(analyzedModule);
        }
        return arr;
    }, [] as ModuleStats[]);


    const threads = dedup(lines.map(r => r.thread));
    const mavenPlugins = threads.flatMap(thread => {
        const threadLines = lines.filter(l => l.thread === undefined || l.thread === thread);
        const lastTimestamp = lastTimestamps.find(t => t.thread === thread)?.lastTimestamp;
        return threadLines.map(({ module, plugin, startTime }, idx) => {
            const nextStartTime: Date | undefined = idx < threadLines.length - 1 ? threadLines[idx + 1].startTime : lastTimestamp;
            return {
                thread: thread || "main",
                module,
                plugin,
                startTime,
                duration: nextStartTime && isValid(nextStartTime) ? (nextStartTime.getTime() - startTime.getTime()) : 0,
            };
        });
    }).filter(p => p.duration > MINIMUM_DURATION_IN_MS);

    const stats: GeneralStats = {
        multiThreaded: ifDefinedOrDefault(statistics.multiThreadedThreads, t => t > 0, false),
        threads: ifDefinedOrDefault(statistics.multiThreadedThreads, t => t, 1),
        status: statistics.buildStatus === "success" ? "success" : statistics.buildStatus === "failed" ? "failed" : "unknown",
        totalBuildTime: statistics.totalBuildTime,
        totalDownloadedBytes: downloads.map(d => d.sizeInBytes).reduce((prev, curr) => prev + curr, 0),
    };

    const testStats: TestStats = tests.reduce((prev, curr) => {
        prev.errors += curr.errors;
        prev.total += curr.total;
        prev.failures += curr.failures;
        prev.skipped += curr.skipped;
        return prev;
    }, { errors: 0, failures: 0, skipped: 0, total: 0 } as TestStats);
    return {
        mavenPlugins,
        modules: aggregatedCompiledSources,
        stats,
        tests: testStats,
        messages: determineMessages(mavenPlugins, aggregatedCompiledSources, stats),
    };


}

const determineMessages = (mavenPlugins: MavenPluginStats[], modules: ModuleStats[], stats: GeneralStats): AnalyzerMessages => {
    const noMetricsFound = modules.length === 0 && mavenPlugins.length === 0;
    const multiThreadedNoThreads = stats.multiThreaded && stats.threads > 1 && dedup(mavenPlugins.map(p => p.thread)).length === 1;
    const errorText = noMetricsFound
        ? "No metrics could be found. Please make sure to provide a valid maven log file with timestamp information as described above."
        : multiThreadedNoThreads
            ? `This seems to be a multi-threaded build with ${stats.threads} threads but the thread name cannot be found in the log file. Please make sure to configure maven logger as described above.`
            : undefined;
    const showInfo = modules.length > 0 && mavenPlugins.length === 0;
    const infoText = showInfo ? "Durations cannot be calculated. Please make sure that the log file contains timestamps in the expected format yyyy-MM-dd HH:mm:ss,SSS" : undefined;

    return {
        info: infoText,
        error: errorText,
    }
};
