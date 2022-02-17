import { Request } from "express";
import axios from "axios";
import RUOYU from "./ruoyu";
import UAParser from "ua-parser-js";
import cheerio from "cheerio";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
const Languages = ["javascript", "typescript", "css", "html", "java", "php", "sql", "bash"];
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
        axios({
            method: "get",
            url: `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${
                RUOYU.TXDT.KEY
            }&sig=${RUOYU.md5(
                `/ws/location/v1/ip?ip=${ip}&key=${RUOYU.TXDT.KEY}${RUOYU.TXDT.SK}`
            )}`,
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
export const toString = (val: unknown, str?: string): string | false => {
    if (val === undefined) {
        return str || false;
    }

    return val || val === "" ? (val as string).toString() : false;
};

/**
 * @description 验证是否为整数并转为数字
 */
export const toPInt = (val: unknown, num?: number): number | false => {
    if (val === undefined) {
        return num || false;
    }

    return val
        ? /^[0-9]*$/.test((val as string).toString()) && parseInt((val as string).toString())
        : false;
};

/**
 * @description 验证是否为数组，返回数组或false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toArray = (val: any, arr?: Array<any>): Array<any> | false => {
    if (val === undefined) {
        return arr || false;
    }
    return Array.isArray(val) ? val : false;
};

/**
 * @description 格式化UA数据
 */
export const getUa = (
    ua = ""
): { ua: string; os: string; browser: string; device: string | null } => {
    const uaInfo = UAParser(ua);
    const browser = `${uaInfo.browser.name} ${uaInfo.browser.version || ""}`.trim();
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
    const $ = cheerio.load(html);

    $("code").each((index, ele) => {
        let code = $(ele).children("span").html();
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
                .wrap(`<div  class='${$(ele).attr("class")}' lang=${lang}></div>`);
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
    return $("body").html() || "";
};
