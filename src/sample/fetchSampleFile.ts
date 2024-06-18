export const fetchSampleFile = (): Promise<string> => {
  return fetchFile("./sampleMaven.log");
};

export const fetchFile = (file: string): Promise<string> => {
  return fetch(file).then((r) => {
    if (r.ok) {
      return r.text();
    } else {
      throw new Error("Http Error Code " + r.status);
    }
  });
};
