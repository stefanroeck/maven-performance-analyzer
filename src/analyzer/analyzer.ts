import { ParserResult } from "./parser";

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

export const analyze = (parserResult: ParserResult[]): AnalyzerRow[] => {

    return [{
        module: "shared",
        plugin: "maven-compiler",
        duration: 120,
    },
    {
        module: "shared",
        plugin: "install",
        duration: 20,
    },
    {
        module: "shared",
        plugin: "maven-jar",
        duration: 32,
    },
    {
        module: "shared",
        plugin: "surefire",
        duration: 190,
    },
    {
        module: "server",
        plugin: "maven-jar",
        duration: 39,
    },
    {
        module: "server",
        plugin: "maven-ear",
        duration: 49,
    },
    {
        module: "server",
        plugin: "maven-compiler",
        duration: 149,
    },
    {
        module: "server",
        plugin: "jasper",
        duration: 29,
    },
    {
        module: "client",
        plugin: "maven-compiler",
        duration: 142,
    },
    {
        module: "client",
        plugin: "jasper",
        duration: 39,
    },
    {
        module: "shared",
        plugin: "rebel",
        duration: 13,
    }];
}