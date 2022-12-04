import { Dayjs } from "dayjs";
import { dedup } from "../utils/arrayUtils";
import { ParserResult } from "./parser";

export interface Location {
    startLine: number;
    endLine: number;
}

export interface AnalyzerRow {
    module: string;
    plugin: string;
    startTime: Dayjs;
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

export interface AnalyzerResult {
    mavenPlugins: AnalyzerRow[];
    modules: AnalyzedModule[];
}

export const analyze = ({ lines, lastTimestamps, compiledSources }: ParserResult): AnalyzerResult => {
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
            const nextStartTime: Dayjs | undefined = idx < threadLines.length - 1 ? threadLines[idx + 1].startTime : lastTimestamp;
            return {
                thread: thread || "main",
                module,
                plugin,
                startTime,
                duration: nextStartTime && nextStartTime.isValid() ? nextStartTime.diff(startTime) : 0,
            };
        });
    });

    return {
        mavenPlugins,
        modules: aggregatedCompiledSources,
    };


}