import { logger } from "./log";
import fs from "fs-extra";
import { createHmac, createHash } from "crypto";
import { resolve } from "path";
import { Response } from "express";

interface BaseConfig {
    databaseDialect: string;
    databaseHost: string;
    databaseDatabase: string;
    databaseUsername: string;
    databasePassword: string;
    databaseForce: boolean;
    httpPort: number;
    account: string;
    redisPort: number;
    redisHost: string;
    redisPassword: string;
    redisKey: string;
    redisSecret: string;
    sessionMaxAge: number;
    sessionName: string;
    cookieDomain: string;
    /**
     * @description 全局js列表
     */
    jsList: Array<string>;
    /**
     * @description 全局css列表
     */
    cssList: Array<string>;
    /**
     * @description 腾讯地图
     */
    TXDT: {
        KEY: string;
        SK: string;
    };
}
interface BaseFun {
    info: (msg: string) => void;
    error: (msg: string, err?: { message: string }) => void;
    md5Pass: (value: string) => string;
    md5: (value: string) => string;
    path: (...path: string[]) => string;

    getJsList: (...jsList: string[]) => string[];
    getCssList: (...cssList: string[]) => string[];

    res: ResponseFun;
}

interface ResponseFun {
    /**
     * @description 返回成功
     */
    success: (res: Response, obj?: Object) => void;
    /**
     * @description 参数错误
     */
    parameter: (res: Response, obj?: Object) => void;
    /**
     * @description 需要登录
     */
    needLogin: (res: Response, obj?: Object) => void;
    /**
     * @description 权限不足
     */
    permission: (res: Response, obj?: Object) => void;
    /**
     * @description 其他错误
     */
    error: (res: Response, obj?: Object) => void;
}

const response: ResponseFun = {
    success: (res: Response, obj: Object = {}) => {
        res.send({ code: 0, msg: "操作成功", ...obj });
    },

    parameter: (res: Response, obj: Object = {}) => {
        res.send({ code: -1, msg: "请检查参数", ...obj });
    },

    needLogin: (res: Response, obj: Object = {}) => {
        res.send({ code: -1, msg: "没有找到登录信息", ...obj });
    },
    permission: (res: Response, obj: Object = {}) => {
        res.send({ code: -3, msg: "权限不足", ...obj });
    },
    error: (res: Response, obj: Object = {}) => {
        res.send({ code: -4, msg: "操作失败", ...obj });
    },
};
interface RUOYU extends BaseConfig, BaseFun {}

const configPath = resolve(__dirname, "../../config/config.json");
if (!fs.existsSync(configPath)) {
    logger.error("缺少配置文件：config.json");
}
const config: BaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const BaseFun: BaseFun = {
    info: (msg) => {
        logger.info(msg);
    },
    error: (msg, err) => {
        logger.error(msg);
        err && logger.error(`原因: ${err.message}`);
    },

    md5Pass: (value) => {
        return createHmac("sha256", "ruoyu")
            .update(createHmac("sha256", "ruoyu").update(value).digest("hex") + value)
            .digest("hex");
    },
    md5: (value) => {
        return createHash("md5").update(value).digest("hex");
    },

    path: (dir, ...other) => {
        return resolve(dir, ...other);
    },

    getJsList: (...jsList) => {
        return RUOYU.jsList.concat(jsList);
    },
    getCssList: (...cssList) => {
        return RUOYU.cssList.concat(cssList);
    },

    res: response,
};

const RUOYU: RUOYU = {
    ...BaseFun,
    ...config,
};

if (config.databaseForce) {
    const data: BaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    data.databaseForce = false;
    fs.writeFileSync(configPath, JSON.stringify(data, null, "\t"));
}

export default RUOYU;
