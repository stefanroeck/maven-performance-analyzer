

export const fetchSampleFile = (): Promise<string> => {
    return fetch("./sampleMaven.log").then(r => r.text());
}