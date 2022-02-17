import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import cookie from "cookie-parser";
import bodyParser from "body-parser";
import RUOYU from "./core/ruoyu";
import "./db/sequelize";
import Locals from "./core/locals/app";
import Api from "./api/index";
import Route from "./route/index";
import { redisClient } from "./core/redis";

declare module "express-session" {
    interface Session {
        /**
         * @description 账号信息
         */
        account: {
            accountId: number;
            nickName: string;
            email: string;
            phone: number;
            avatar: string;
            status: number;
        };

        /**
         * @description 用户信息
         */
        blog: {
            userId: number;
            nickName: string;
            avatar: string;
            status: number;
            articlePass: { [key: string]: string };
        };
    }
}

// 初始化 Express 框架
const app = express();
app.set("trust proxy", true);
app.use(cookie());
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
            maxAge: 1000 * 60 * RUOYU.sessionMaxAge,
            // maxAge: 1000 * 3,
            domain: RUOYU.cookieDomain,
        },
        store: new RedisStrore({ client: redisClient, prefix: RUOYU.redisKey }),
        secret: RUOYU.redisSecret,
        name: RUOYU.sessionName,
        rolling: true,
        saveUninitialized: false,
        resave: true,
    })
);

// 设置模板文件
app.set("views", RUOYU.path(__dirname, "../views"));
app.set("view engine", "ejs");
Locals(app);

// 设置静态文件基础根目录
app.use("/", express.static(RUOYU.path(__dirname, "../static/")));

// 路由和api
app.use("/api/", Api);
app.use("/", Route);

// 捕捉其他未匹配到的
app.use("/api/", (req, res) => {
    res.status(404).json({ code: 404, msg: "sorry, this api interface does not exist" });
});
app.use((req, res) => {
    res.status(404).render("error/404");
});

// 启动服务
app.listen(RUOYU.httpPort, "0.0.0.0", () => {
    RUOYU.info(`HTTP 模块: [ http://127.0.0.1:${RUOYU.httpPort} ]`);
});
