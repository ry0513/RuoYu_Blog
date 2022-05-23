import { Response, Request } from "express";
// import dayjs, { Dayjs } from "dayjs";

interface ResponseFun {
    /**
     * @description 返回成功
     */
    resSuccess: (res: Response, obj?: object) => void;
    /**
     * @description 参数错误
     */
    resParameter: (res: Response, obj?: object) => void;
    /**
     * @description 需要登录
     */
    resNeedLogin: (res: Response, obj?: object) => void;
    /**
     * @description 权限不足
     */
    resPermission: (res: Response, obj?: object) => void;
    /**
     * @description 其他错误
     */
    resError: (res: Response, obj?: object) => void;
}

interface EncryptFun {
    /**
     * @description md5加密(密码用)
     */
    md5Pass: (value: string, md5Val?: string) => string;
    /**
     * @description md5加密
     */
    md5: (value: string) => string;
    /**
     * @description 对称加密
     */
    encrypt: (value: string, key?: string, iv?: string) => string;
    /**
     * @description 对称解密
     */
    decrypt: (value: string, key?: string, iv?: string) => string | undefined;
}

interface BaseFun {
    /**
     * @description 打印一般日志
     */
    logInfo: (msg: string) => void;
    /**
     * @description 打印错误日志
     */
    logError: (msg: string, err?: { message: string }) => void;
    /**
     * @description 拼接路径
     */
    path: (...path: Array<string>) => string;
    /**
     * @description dayjs工具
     */
    dayjs: (date?: Date, format?: string) => Dayjs;
    /**
     * @description 设置cookie
     */
    setCookie: (res: Response, key: string, value: string) => void;
    /**
     * @description 读取cookie
     */
    getCookie: (req: Request, key: string) => string | undefined;
}
