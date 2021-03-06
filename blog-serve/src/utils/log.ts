import log4js from "log4js";
import fs from "fs-extra";
import { resolve } from "path";
import dayjs from "dayjs";

const LOG_FILE_PATH = resolve(__dirname, "../../logs");
if (!fs.existsSync(LOG_FILE_PATH)) fs.mkdirSync(LOG_FILE_PATH);

log4js.configure({
    appenders: {
        out: {
            type: "stdout",
            layout: {
                type: "pattern",
                pattern: "[%d{yyyy/MM/dd hh:mm:ss}] [%[%p%]] %m",
            },
        },
        app: {
            type: "file",
            filename: resolve(
                LOG_FILE_PATH,
                dayjs().format("YYYY-MM-DD-HH-mm-ss.log")
            ),
            layout: {
                type: "pattern",
                pattern: "[%d{yyyy/MM/dd hh:mm:ss}] [%p] %m",
            },
        },
    },
    categories: {
        default: {
            appenders: ["out", "app"],
            level: "trace",
        },
    },
});
export const logger = log4js.getLogger("default");

// logger.info(`
// ___/\\\\\\\\\\\\\\\\\\__________________________________/\\\\\\________/\\\\\\_______________
// __/\\\\\\///////\\\\\\_______________________________\\///\\\\\\____/\\\\\\/________________
//  _\\/\\\\\\_____\\/\\\\\\_________________________________\\///\\\\\\/\\\\\\/__________________
//   _\\/\\\\\\\\\\\\\\\\\\\\\\/_____/\\\\\\____/\\\\\\_____/\\\\\\\\\\________\\///\\\\\\/_______/\\\\\\____/\\\\\\_
//    _\\/\\\\\\//////\\\\\\____\\/\\\\\\___\\/\\\\\\___/\\\\\\///\\\\\\________\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
//     _\\/\\\\\\____\\//\\\\\\___\\/\\\\\\___\\/\\\\\\__/\\\\\\__\\//\\\\\\_______\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
//      _\\/\\\\\\_____\\//\\\\\\__\\/\\\\\\___\\/\\\\\\_\\//\\\\\\__/\\\\\\________\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
//       _\\/\\\\\\______\\//\\\\\\_\\//\\\\\\\\\\\\\\\\\\___\\///\\\\\\\\\\/_________\\/\\\\\\_______\\//\\\\\\\\\\\\\\\\\\__
//        _\\///________\\///___\\/////////______\\/////___________\\///_________\\/////////___
// `);
