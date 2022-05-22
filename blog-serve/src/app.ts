import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import cookie from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import RUOYU from "./config/ruoyu";
import { HTTP_PORT, SESSION, REDIS } from "./config/global";
import { redisClient } from "./utils/redis";
import Api from "./api/index";
import "./db/sequelize";

// 初始化 Express 框架
const app = express();
app.set("trust proxy", true);
app.use(cookie());
app.use(
    cors({
        origin: ["http://127.0.0.1:5500", "http://127.0.0.1:5501"],
        credentials: true,
    })
);
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// 初始化 redis, session
const RedisStrore = connectRedis(session);
app.use(
    session({
        cookie: {
            maxAge: 1000 * 60 * SESSION.MAXAGE,
            domain: SESSION.DOMAIN,
        },
        store: new RedisStrore({ client: redisClient, prefix: REDIS.KEY }),
        secret: REDIS.SECRET,
        name: SESSION.NAME,
        rolling: true,
        saveUninitialized: false,
        resave: true,
    })
);

// 路由
app.use("/api/", Api);
app.use("*", (req, res) => {
    res.status(404).json({
        code: 404,
        msg: "sorry, this api interface does not exist",
    });
});

// 启动服务
app.listen(HTTP_PORT, "0.0.0.0", () => {
    RUOYU.logInfo(`HTTP 模块: [ http://127.0.0.1:${HTTP_PORT} ]`);
});
