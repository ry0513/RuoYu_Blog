import { CustomValidator } from "express-validator";

/**
 * @description 当前页
 */
export const currentPage = (value: number) => {
    return value - 1;
};

/**
 * @description 转成数组
 */
export const toArr = (value: number) => {
    return value < 0 ? [] : [value];
};

/**
 * @description 转成数组数字数组
 */
export const toNumArr = (value: string[]) => {
    return value.map((item) => Number(item));
};

/**
 * @description 模糊查询
 */
export const toLike = (value: string) => {
    return [`%${value}%`];
};

/**
 * @description 参数验证
 */
export const front: (check: "body" | "query", key: string, scope: string | number | (number | string)[]) => CustomValidator = (check, key, scope) => {
    return (value, { req }) => {
        if (typeof scope === "object") {
            return scope.includes(req[check][key]);
        } else {
            return [scope].includes(req[check][key]);
        }
    };
};
