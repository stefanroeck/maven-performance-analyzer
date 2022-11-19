
export const dedup = <T>(arr: Array<T>): Array<T> => {
    return arr.filter((t, idx, arr) => arr.indexOf(t) === idx);
} 