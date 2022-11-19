import { Dayjs } from "dayjs";
import { dedup } from "../utils/arrayUtils";
import { ParserResult, SourceStatisticLine } from "./parser";

export interface Location {
    startLine: number;
    endLine: number;
}

export interface AnalyzerRow {
    module: string;
    plugin: string;
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

export const analyze = ({ lines, lastTimestamp, compiledSources }: ParserResult): AnalyzerResult => {
    const threads = dedup(lines.map(r => r.thread || "main"));

    const aggregatedCompiledSources: AnalyzedModule[] = compiledSources.reduce((arr, curr) => {
        const existing = arr.find(c => c.module === curr.module);
        if (existing) {
            switch (curr.compileMode) {
                case "src": existing.compiledSources = existing.compiledSources + curr.compiledSources; break;
                case "testSrc": existing.compiledTestSources = existing.compiledTestSources + curr.compiledSources; break;
            }

        } else {
            const analyzedModule: AnalyzedModule = {
                module: curr.module,
                compiledSources: 0,
                compiledTestSources: 0,
                copiedResources: 0,
                copiedTestResources: 0,
            }
            switch (curr.compileMode) {
                case "src": analyzedModule.compiledSources = curr.compiledSources; break;
                case "testSrc": analyzedModule.compiledTestSources = curr.compiledSources; break;
            }
            arr.push(analyzedModule);

        }
        return arr;
    }, [] as AnalyzedModule[]);


    const mavenPlugins = threads.flatMap(thread => {
        const threadLines = lines.filter(l => l.thread === undefined || l.thread === thread);
        return threadLines.map(({ module, plugin, startTime }, idx) => {
            const nextStartTime: Dayjs | undefined = idx < threadLines.length - 1 ? threadLines[idx + 1].startTime : lastTimestamp;
            return {
                thread,
                module,
                plugin,
                duration: nextStartTime && nextStartTime.isValid() ? nextStartTime.diff(startTime) : 0,
            };
        });
    });

    return {
        mavenPlugins,
        modules: aggregatedCompiledSources,
    };


}