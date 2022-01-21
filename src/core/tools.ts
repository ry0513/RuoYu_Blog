import { Request } from "express";
import axios from "axios";
import RUOYU from "./ruoyu";

/**
 * @description 获取IP
 */
export const getIp = (req: Request) => {
    return req.ips[0] || req.ip || "127.0.0.1";
};

/**
 * @description 获取地址
 */
export const getCity = (ip: string) => {
    return new Promise<string>((resolve, reject) => {
        axios({
            method: "get",
            url: `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${RUOYU.TXDT.KEY}&sig=${RUOYU.md5(`/ws/location/v1/ip?ip=${ip}&key=${RUOYU.TXDT.KEY}${RUOYU.TXDT.SK}`)}`,
        }).then(({ data: res }) => {
            if (res.status) {
                resolve("未知地区");
            } else {
                const { city, district } = res.result.ad_info;
                resolve(`${city}${district}`);
            }
        });
    });
};

/**
 * @description 获取url
 */
export const getUrl = (req: Request) => {
    return req.protocol + "://" + req.get("host") + req.originalUrl;
};

/**
 * @description 将参数转为字符串
 */
export const toString = (val: any, str?: string): string | false => {
    if (val === undefined) {
        return str || false;
    }

    return val || val === "" ? val.toString() : false;
};

/**
 * @description 验证是否为正整数并转为数字
 */
export const toPInt = (val: any, num?: number): number | false => {
    if (val === undefined) {
        return num || false;
    }

    return val ? /^[1-9]*[1-9][0-9]*$/.test(val.toString()) && parseInt(val.toString()) : false;
};

/**
 * @description 验证是否为数组，返回数组或false
 */
export const toArray = (val: any, arr?: any[]): any[] | false => {
    if (val === undefined) {
        return arr || false;
    }
    return Array.isArray(val) ? val : false;
};

/**
 * @description 验证是否都不为false
 */
export const isTrue = (val: any): boolean => {
    return val !== false;
};
