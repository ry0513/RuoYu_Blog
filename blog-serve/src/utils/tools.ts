/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import axios from "axios";
import RUOYU from "../config/ruoyu";
import UAParser from "ua-parser-js";
import { load } from "cheerio";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
const Languages = [
    "javascript",
    "typescript",
    "css",
    "html",
    "java",
    "php",
    "sql",
    "bash",
];
loadLanguages(Languages);

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
    return new Promise<string>((resolve) => {
        resolve("未知地区");
        // axios({
        //     method: "get",
        //     url: `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${
        //         RUOYU.TXDT.KEY
        //     }&sig=${RUOYU.md5(
        //         `/ws/location/v1/ip?ip=${ip}&key=${RUOYU.TXDT.KEY}${RUOYU.TXDT.SK}`
        //     )}`,
        // }).then(({ data: res }) => {
        //     if (res.status) {
        //         resolve("未知地区");
        //     } else {
        //         const { city, district } = res.result.ad_info;
        //         resolve(`${city}${district}`);
        //     }
        // });
    });
};

/**
 * @description 获取url
 */
export const getUrl = (req: Request) => {
    return req.protocol + "://" + req.get("host") + req.originalUrl;
};

/**
 * @description 验证是否为字符串并返回字符串
 */
export const toString = (
    val: unknown,
    {
        maxLength,
        minLength,
        def,
        scope,
    }: {
        maxLength?: number;
        minLength?: number;
        def?: string;
        scope?: Array<string>;
    } = {}
): string | false => {
    if (val === undefined) {
        return def || false;
    } else if (typeof val === "string") {
        const str = val.toString();
        if (
            (maxLength && maxLength < str.length) ||
            (minLength && minLength > str.length) ||
            (scope && !scope.includes(str))
        ) {
            return false;
        }
        return str;
    }
    return false;
};

/**
 * @description 验证是否为正整数并转为数字
 */
export const toPInt = (
    val: unknown,
    {
        max,
        min,
        def,
        scope,
    }: { max?: number; min?: number; def?: number; scope?: Array<number> } = {}
): number | false => {
    if (val === undefined) {
        return def || false;
    } else if (/^[0-9]+$/.test(val as string)) {
        const num = parseInt(val as string);
        if (
            (max && max < num) ||
            (min && min > num) ||
            (scope && !scope.includes(num))
        ) {
            return false;
        }
        return num;
    }
    return false;
};

/**
 * @description 验证是否为数组，返回数组或false
 */
export const toArray = (
    val: unknown,
    {
        type,
        max,
        min,
        scope,
        def,
    }: {
        type?: "string" | "number";
        max?: number;
        min?: number;
        scope?: Array<number | string>;
        def?: Array<any>;
    } = {}
): Array<any> | false => {
    if (val === undefined) {
        return def || false;
    } else if (Array.isArray(val)) {
        if (type === "number") {
            return (
                (val.every((item) => {
                    item;
                    if (
                        !/^[0-9]+$/.test(item as string) ||
                        (max && max < item) ||
                        (min && min > item) ||
                        (scope && !scope.includes(item))
                    ) {
                        return false;
                    }
                    return true;
                }) &&
                    val.map((item) => {
                        return parseInt(item);
                    })) ||
                false
            );
        } else if (type === "string") {
            return (
                (val.every((item) => {
                    if (
                        typeof item !== "string" ||
                        (max && max < item.length) ||
                        (min && min > item.length) ||
                        (scope && !scope.includes(item))
                    ) {
                        return false;
                    }
                    return true;
                }) &&
                    val) ||
                false
            );
        } else {
            return val;
        }
    }
    return false;
};

export const toDate = (val: string, date?: string) => {
    if (val === undefined) {
        return date || false;
    }
    const reg =
        /^((\d{2}(([02468][048])|([13579][26]))[-/](((0[13578])|(1[02]))[-/](([012][0-9])|(3[01]))|((0[469])|(11))[-/](([0-2][0-9])|(30))|(02)[-/][012][0-9]))|(\d{4}[-/](((0[13578])|(1[02]))[-/](([012][0-9])|(3[01]))|((0[469])|(11))[-/](([012][0-9])|(30))|(02)[-/](([01][0-9])|(2[0-8])))))\s(([0-1][0-9])|(2[0-4]))(:[0-5][0-9]){2}$/;

    return reg.test(val) ? val : false;
};

/**
 * @description 格式化UA数据
 */
export const getUa = (
    ua = ""
): { ua: string; os: string; browser: string; device: string | null } => {
    const uaInfo = UAParser(ua);
    const browser = `${uaInfo.browser.name} ${
        uaInfo.browser.version || ""
    }`.trim();
    const os = `${uaInfo.os.name} ${uaInfo.os.version || ""}`.trim();
    const device = uaInfo.device.model || null;
    return { ua, os, browser, device };
};

/**
 * @description 格式化数据
 */
export const formatParam = (
    val: string | number | false | Array<string | number>,
    param: { [key: string]: string | number | Array<string | number> },
    key: string
): void => {
    if (val !== false) param[key] = val;
};

/**
 * @description 格式化高亮代码
 */
export const formatCode = (html: string): string => {
    // console.log("**************");
    const $ = load(html);

    $("code").each((index, ele) => {
        let code = $(ele).html();
        console.log(code);
        const lang = $(ele).attr("class")?.replace("language-", "") || "text";

        const getLine = (code: string) => {
            const NEW_LINE_EXP = /\n(?!$)/g;
            const match = code.match(NEW_LINE_EXP);
            const linesNum = match ? match.length : 0;
            const lines = new Array(linesNum + 2).join("<span></span>");
            return `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
        };
        if (code) {
            if (lang === "text") {
                $(ele).addClass(`language-${lang}`);
            } else if (Languages.indexOf(lang) !== -1) {
                code = Prism.highlight(
                    code.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
                    Prism.languages[lang],
                    lang
                );
            }
            $(ele).html(code + getLine(code));
            $(ele)
                .parent()
                .addClass(`line-numbers ${$(ele).attr("class")}`);
            $(ele)
                .parent()
                .wrap(
                    `<div  class='${$(ele).attr("class")}' lang=${lang}></div>`
                );
        }
        // if (code && lang === undefined) {
        //     $(ele).html(code + getLine(code));
        //     $(ele).addClass("language-none");
        //     $(ele).parent().attr("lang", "TEXT");
        // }
        // if (code && lang) {
        //     const html = Prism.highlight(code.replace(/&lt;/g, "<").replace(/&gt;/g, ">"), Prism.languages[lang], lang);
        //     $(ele).html(html + getLine(html));
        //     $(ele).parent().attr("lang", lang.toUpperCase());

        //     console.log($(ele).parent().html());
        // }

        // $(ele).parent().addClass(`line-numbers ${$(ele).attr("class")}).addClass("language-none");
        // $(ele).parent().wrap(`<div  class=''></div>`);
    });
    console.log("/************************** /");

    return $("body").html() || "";
};
