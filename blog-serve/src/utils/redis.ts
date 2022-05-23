import * as redis from "redis";
import RUOYU from "../config/ruoyu";
import { REDIS } from "../config/global";
export const redisClient = redis.createClient(REDIS.PORT, REDIS.HOST, {
    password: REDIS.PASSWD,
});
const redisSub = redis.createClient(REDIS.PORT, REDIS.HOST, {
    password: REDIS.PASSWD,
});

redisClient.on("error", (err) => {
    RUOYU.logError("REDIS 模块: 服务异常", err);
});
redisClient.on("ready", () => {
    RUOYU.logInfo("REDIS 模块: 连接正常");
});

redisSub.send_command("config", ["set", "notify-keyspace-events", "Ex"], () => {
    redisSub.subscribe("__keyevent@0__:expired", () => {
        redisSub.on("message", (chan, key) => {
            redisDelAccountByRedisId(key);
        });
    });
});

export const redisDelAccountByRedisId = (redisId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        redisClient.keys(`*${redisId}-user-*`, (err, res) => {
            if (res.length > 0) redisClient.del(res);
            resolve(true);
        });
    });
};

export const redisDelAccountByAccountId = (
    accountId: number
): Promise<boolean> => {
    return new Promise((resolve) => {
        redisClient.keys(`*-user-${accountId}`, (err, res) => {
            res.forEach((key) => {
                redisClient.get(key, (err, val) => {
                    if (val) redisClient.del(val);
                    redisClient.del(key);
                });
            });
            resolve(true);
        });
    });
};

export const redisSetAccount = (
    accountId: number,
    redisId: string
): Promise<boolean> => {
    return new Promise((resolve) => {
        redisClient.set(
            `${REDIS.KEY}${redisId}-user-${accountId}`,
            `${REDIS.KEY}${redisId}`,
            () => {
                resolve(true);
            }
        );
    });
};
