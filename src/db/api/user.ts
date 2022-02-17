import { getCity, getIp } from "../../core/tools";
import { Request } from "express";
import User from "../modles/User";

/**
 * @description 获取用户信息
 */
export const getUser = (userId: number, attributes: Array<string> = []) => {
    return User.findOne({
        attributes: ["userId", "nickName", "avatar", "status", ...attributes],
        where: { userId },
    });
};

/**
 * @description 创建用户信息
 */
export const createUser = async (
    req: Request,
    userId: number,
    nickName: string,
    avatar: string,
    status: number
) => {
    const ip = getIp(req);
    const place = await getCity(ip);
    return User.create({
        userId,
        nickName,
        avatar,
        ip,
        place,
        status,
    });
};
