import { ENCRYPT } from "./global";
import { resolve } from "path";
import dayjs from "dayjs";
import {
    createHmac,
    createHash,
    createCipheriv,
    createDecipheriv,
} from "crypto";

import { ResponseFun, BaseFun, EncryptFun } from "../typescript/config/ruoyu";
import { logger } from "../utils/log";

const resFun: ResponseFun = {
    resSuccess: (res, data = {}) => {
        res.send({ code: 0, msg: "操作成功", data });
    },

    resParameter: (res, data = {}) => {
        res.send({ code: -1, msg: "请检查参数", data });
    },

    resNeedLogin: (res, data = {}) => {
        res.send({
            code: -2,
            msg: "没有找到登录信息，未登录或登录过期",
            data,
        });
    },
    resPermission: (res, data = {}) => {
        res.send({ code: -3, msg: "权限不足", data });
    },
    resError: (res, data = {}) => {
        res.send({ code: -4, msg: "其他错误", data });
    },
};

const encryptFun: EncryptFun = {
    md5Pass: (value, md5Val = ENCRYPT.MD5) => {
        return createHmac("sha256", md5Val)
            .update(
                createHmac("sha256", md5Val).update(value).digest("hex") + value
            )
            .digest("hex");
    },
    md5: (value) => {
        return createHash("md5").update(value).digest("hex");
    },

    encrypt: (val, key = ENCRYPT.AES.KEY, iv = ENCRYPT.AES.IV) => {
        const cipher = createCipheriv("aes-128-cbc", key, iv);
        return cipher.update(val, "utf8", "hex") + cipher.final("hex");
    },

    decrypt: (val, key = ENCRYPT.AES.KEY, iv = ENCRYPT.AES.IV) => {
        const decipher = createDecipheriv("aes-128-cbc", key, iv);
        try {
            return decipher.update(val, "hex", "utf8") + decipher.final("utf8");
        } catch (error) {
            return undefined;
        }
    },
};
const baseFun: BaseFun = {
    logInfo: (msg) => {
        logger.info(msg);
    },
    logError: (msg, err) => {
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
        res.cookie(encryptFun.encrypt(key), encryptFun.encrypt(val), {
            httpOnly: true,
        });
    },
    getCookie: (req, key) => {
        return encryptFun.decrypt(req.cookies[encryptFun.encrypt(key)]);
    },
};
const RUOYU = {
    ...resFun,
    ...baseFun,
};

export default RUOYU;
