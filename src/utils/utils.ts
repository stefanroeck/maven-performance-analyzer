export const ifDefined = <T, R>(value: T | undefined, func: (t: T) => R, def: R | undefined = undefined): R | undefined => {
    if (value !== undefined) {
        return func(value);
    }
    return def;
};

export const ifDefinedOrDefault = <T, R>(value: T | undefined, func: (t: T) => R, def: R): R => {
    if (value !== undefined) {
        return func(value);
    }
    return def;
};