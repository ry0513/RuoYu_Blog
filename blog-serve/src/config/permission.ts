import { Request, Response, NextFunction } from "express";
import RUOYU from "./ruoyu";

// 权限中间件
export const login = (data = {}) => {
    return ({ session: { account } }: Request, res: Response, next: NextFunction) => {
        if (account) {
            next();
        } else {
            RUOYU.resNeedLogin(res, data);
        }
    };
};

// 权限中间件
export const permission = (val: string[] | string) => {
    return ({ session: { blog } }: Request, res: Response, next: NextFunction) => {
        if (blog) {
            const { permission } = blog;
            if (
                permission === "*" ||
                (typeof val === "string" && permission.includes(val)) ||
                (typeof val === "object" &&
                    val.filter((item) => {
                        return permission.includes(item);
                    }).length > 0)
            ) {
                next();
            } else {
                RUOYU.resPermission(res);
            }
        } else {
            RUOYU.resError(res, {
                title: "获取权限失败",
                text: "请刷新当前页面",
            });
        }
    };
};

// 验证权限
export const permissionVerify = (
    {
        session: {
            blog: { permission },
        },
    }: Request,
    val: string[] | string
) => {
    return (
        permission === "*" ||
        (typeof val === "string" && permission.includes(val)) ||
        (typeof val === "object" &&
            val.filter((item) => {
                return permission.includes(item);
            }).length > 0)
    );
};

export const PERMISSION = {
    lv1: ["a", "b", "c"],
};
const list = [
    // 标签相关
    "tag:add:v1",
    "tag:add:v2",
];
