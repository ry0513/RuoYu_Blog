import { logger } from "./log";
import fs from "fs-extra";
import { createHmac, createHash, createCipheriv, createDecipheriv } from "crypto";
import { resolve } from "path";
import { Response, Request } from "express";
import dayjs, { Dayjs } from "dayjs";

interface BaseConfig {
    /**
     * @description 版本号
     */
    version: string;
    /**
     * @description 数据库类型
     */
    databaseDialect: string;
    /**
     * @description 数据库主机
     */
    databaseHost: string;
    /**
     * @description 数据库库名
     */
    databaseDatabase: string;
    /**
     * @description 数据库用户名
     */
    databaseUsername: string;
    /**
     * @description 数据库密码
     */
    databasePassword: string;
    /**
     * @description 启动服务端口
     */
    httpPort: number;
    /**
     * @description redis端口
     */
    redisPort: number;
    /**
     * @description redis主机
     */
    redisHost: string;
    /**
     * @description redis密码
     */
    redisPassword: string;
    /**
     * @description redis键名
     */
    redisKey: string;
    /**
     * @description redis-盐
     */
    redisSecret: string;
    /**
     * @description session最大时长
     */
    sessionMaxAge: number;
    /**
     * @description session名字
     */
    sessionName: string;
    /**
     * @description cookie域名
     */
    cookieDomain: string;
    /**
     * @description CDN链接
     */
    cdnUrl: string;
    /**
     * @description MD5加密-盐
     */
    md5Val: string;
    /**
     * @description  腾讯地图KEY-SK
     */
    TXDT: {
        KEY: string;
        SK: string;
    };
    /**
     * @description  账户域名
     */
    accountUrl: string;
    /**
     * @description 对称加密-盐
     */
    aes: {
        key: string;
        iv: string;
    };
}

interface ResponseFun {
    /**
     * @description 返回成功
     */
    success: (res: Response, obj?: object) => void;
    /**
     * @description 参数错误
     */
    parameter: (res: Response, obj?: object) => void;
    /**
     * @description 需要登录
     */
    needLogin: (res: Response, obj?: object) => void;
    /**
     * @description 权限不足
     */
    permission: (res: Response, obj?: object) => void;
    /**
     * @description 其他错误
     */
    error: (res: Response, obj?: object) => void;
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
    info: (msg: string) => void;
    /**
     * @description 打印错误日志
     */
    error: (msg: string, err?: { message: string }) => void;
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
    /**
     * @description 响应
     */
    res: ResponseFun;
}
interface RUOYU extends BaseConfig, BaseFun, EncryptFun {}

const configPath = resolve(__dirname, "../../config/config.json");
if (!fs.existsSync(configPath)) {
    logger.error("缺少配置文件：config.json");
}
const config: BaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const response: ResponseFun = {
    success: (res: Response, obj = {}) => {
        res.send({ code: 0, msg: "操作成功", ...obj });
    },

    parameter: (res: Response, obj = {}) => {
        res.send({ code: -1, msg: "请检查参数", ...obj });
    },

    needLogin: (res: Response, obj = {}) => {
        res.send({ code: -2, msg: "没有找到登录信息，未登录或登录过期", ...obj });
    },
    permission: (res: Response, obj = {}) => {
        res.send({ code: -3, msg: "权限不足", ...obj });
    },
    error: (res: Response, obj = {}) => {
        res.send({ code: -4, msg: "操作失败", ...obj });
    },
};

const encryptFun: EncryptFun = {
    // 加密
    md5Pass: (value, md5Val = config.md5Val) => {
        return createHmac("sha256", md5Val)
            .update(createHmac("sha256", md5Val).update(value).digest("hex") + value)
            .digest("hex");
    },
    md5: (value) => {
        return createHash("md5").update(value).digest("hex");
    },

    encrypt: (val, key = config.aes.key, iv = config.aes.iv) => {
        const cipher = createCipheriv("aes-128-cbc", key, iv);
        return cipher.update(val, "utf8", "hex") + cipher.final("hex");
    },

    decrypt: (val, key = config.aes.key, iv = config.aes.iv) => {
        const decipher = createDecipheriv("aes-128-cbc", key, iv);
        try {
            return decipher.update(val, "hex", "utf8") + decipher.final("utf8");
        } catch (error) {
            return undefined;
        }
    },
};
const BaseFun: BaseFun = {
    info: (msg) => {
        logger.info(msg);
    },
    error: (msg, err) => {
        logger.error(msg);
        err && logger.error(`原因: ${err.message}`);
    },
    path: (dir, ...other) => {
        return resolve(dir, ...other);
    },
    dayjs: (date = new Date()) => {
        return dayjs(date);
    },
    setCookie: (res, key, val) => {
        res.cookie(encryptFun.encrypt(key), encryptFun.encrypt(val), { httpOnly: true });
    },
    getCookie: (req, key) => {
        return encryptFun.decrypt(req.cookies[encryptFun.encrypt(key)]);
    },

    res: response,
};

const RUOYU: RUOYU = {
    ...BaseFun,
    ...config,
    ...encryptFun,
};

export default RUOYU;
