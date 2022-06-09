export const currentPage = (value: number) => {
    return value - 1;
};

export const toArr = (value: number) => {
    return value < 0 ? [] : [value];
};

export const toLike = (value: string) => {
    return [`%${value}%`];
};
