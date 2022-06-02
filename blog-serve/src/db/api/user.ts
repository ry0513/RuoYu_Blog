import { getCity, getIp } from "../../utils/tools";
import { Request } from "express";
import User from "../modles/User";
import { CreateUser, GetUser } from "../../typescript/db/user";

/**
 * @description 获取用户信息
 */
export const getUser: GetUser = ({ userId }, attributes = []) => {
    return User.findOne({
        attributes: ["userId", ...attributes],
        where: { userId },
    });
};

/**
 * @description 获取路由信息
 */

// export const getRouter: GetUser = (userId, attributes = []) => {
//     // return User.findOne({
//     //     attributes: ["userId", "nickName", "avatar", "status", ...attributes],
//     //     where: { userId },
//     // });
// };

/**
 * @description 创建用户信息
 */
export const createUser: CreateUser = async (data) => {
    return User.create(data);
};
