
export const dedup = <T>(arr: Array<T>): Array<T> => {
    return arr.filter((t, idx, arr) => arr.indexOf(t) === idx);
}

export const replace = <T>(arr: Array<T>, toReplace: T, replaceWith: T): Array<T> => {
    const newArray = arr.filter(a => a !== toReplace);
    newArray.push(replaceWith);
    return newArray;
}