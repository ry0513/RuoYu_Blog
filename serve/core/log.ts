import log4js from "log4js";
import fs from "fs-extra";
import dayjs from "dayjs";

export default async () => {
  const LOG_FILE_PATH = common.path("root", "./logs");
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
        filename: common.path(
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

  const logger = log4js.getLogger("default");
  global.logger = {
    info: (msg) => {
      logger.info(msg);
    },
    error: (msg, err) => {
      logger.error(msg);
      err && logger.error(`原因: ${err.message}`);
    },
  };

  logger.info(`
____/\\\\\\\\\\\\\\\\\\__________________________________/\\\\\\________/\\\\\\_______________
 __/\\\\\\///////\\\\\\_______________________________\\///\\\\\\____/\\\\\\/________________
  _\\/\\\\\\_____\\/\\\\\\_________________________________\\///\\\\\\/\\\\\\/__________________
   _\\/\\\\\\\\\\\\\\\\\\\\\\/_____/\\\\\\____/\\\\\\_____/\\\\\\\\\\________\\///\\\\\\/_______/\\\\\\____/\\\\\\_
    _\\/\\\\\\//////\\\\\\____\\/\\\\\\___\\/\\\\\\___/\\\\\\///\\\\\\________\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
     _\\/\\\\\\____\\//\\\\\\___\\/\\\\\\___\\/\\\\\\__/\\\\\\__\\//\\\\\\_______\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
      _\\/\\\\\\_____\\//\\\\\\__\\/\\\\\\___\\/\\\\\\_\\//\\\\\\__/\\\\\\________\\/\\\\\\_______\\/\\\\\\___\\/\\\\\\_
       _\\/\\\\\\______\\//\\\\\\_\\//\\\\\\\\\\\\\\\\\\___\\///\\\\\\\\\\/_________\\/\\\\\\_______\\//\\\\\\\\\\\\\\\\\\__
        _\\///________\\///___\\/////////______\\/////___________\\///_________\\/////////___
`);
};
