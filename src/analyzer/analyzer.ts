import { dedup } from "../utils/arrayUtils";
import { isValid } from "./dateUtils";
import { ParserResult } from "./parser";

export interface Location {
    startLine: number;
    endLine: number;
}

export interface AnalyzerRow {
    module: string;
    plugin: string;
    startTime: Date;
    duration: number;
    thread: string;
    location?: Location;
}

export interface AnalyzedModule {
    module: string;
    compiledSources: number;
    compiledTestSources: number;
    copiedResources: number;
    copiedTestResources: number;
}

export interface Stats {
    status: "success" | "failed" | "unknown";
    multiThreaded: boolean;
    threads: number;
    totalBuildTime?: string;
    totalDownloadedBytes: number;
}

export interface AnalyzerResult {
    mavenPlugins: AnalyzerRow[];
    modules: AnalyzedModule[];
    stats: Stats;
}

export const analyze = ({ lines, lastTimestamps, compiledSources, statistics, downloads }: ParserResult): AnalyzerResult => {
    const aggregatedCompiledSources: AnalyzedModule[] = compiledSources.reduce((arr, curr) => {
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
            const analyzedModule: AnalyzedModule = {
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
    }, [] as AnalyzedModule[]);


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
    });

    return {
        mavenPlugins,
        modules: aggregatedCompiledSources,
        stats: {
            multiThreaded: statistics.multiThreadedBuild,
            threads: statistics.multiThreadedBuild ? statistics.threads : 1,
            status: statistics.buildStatus === "success" ? "success" : statistics.buildStatus === "failed" ? "failed" : "unknown",
            totalBuildTime: statistics.totalBuildTime,
            totalDownloadedBytes: downloads.map(d => d.sizeInBytes).reduce((prev, curr) => prev + curr, 0),
        }
    };


}