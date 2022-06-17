import { CustomValidator } from "express-validator";

export const currentPage = (value: number) => {
    return value - 1;
};

export const toArr = (value: number) => {
    return value < 0 ? [] : [value];
};
export const toNumArr = (value: string[]) => {
    return value.map((item) => Number(item));
};

export const toLike = (value: string) => {
    return [`%${value}%`];
};

export const front: (
    check: "body" | "query",
    key: string,
    scope: string | number | (number | string)[]
) => CustomValidator = (check, key, scope) => {
    return (value, { req }) => {
        if (typeof scope === "object") {
            return scope.includes(req[check][key]);
        } else {
            return [scope].includes(req[check][key]);
        }
    };
};
