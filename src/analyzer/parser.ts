

export interface ParserResult {
    module: string;
    plugin: string;
    startTime: number;
    thread?: string;
    location?: Location;
}

export const parse = (logContent: string): ParserResult[] => {

    return [];
}