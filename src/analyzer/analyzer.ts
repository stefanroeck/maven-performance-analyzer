import { MavenGoalExecutionLine, ParserResult } from "./parser";

export interface Location {
    startLine: number;
    endLine: number;
}

export interface AnalyzerRow {
    module: string;
    plugin: string;
    duration: number;
    thread?: string;
    location?: Location;
}

export const analyze = ({ lines, lastTimestamp }: ParserResult): AnalyzerRow[] => {
    const threads = lines.map(r => r.thread).filter((f, idx, arr) => arr.indexOf(f) === idx);

    return lines.map(({ module, plugin, startTime, thread }, idx) => {
        const nextStartTime = idx < lines.length - 1 ? lines[idx + 1].startTime : lastTimestamp;
        return {
            thread,
            module,
            plugin,
            duration: nextStartTime ? nextStartTime.diff(startTime) : 0,
        }
    });


}