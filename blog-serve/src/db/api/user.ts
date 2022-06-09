import { getCity, getIp } from "../../utils/tools";
import { Request } from "express";
import User from "../modles/User";
/**
 * @description 获取用户信息
 */
export const getUser = (
    { userId }: Pick<User, "userId">,
    attributes: Array<"status" | "permission"> = []
) => {
    return User.findOne({
        attributes: ["userId", ...attributes],
        where: { userId },
    });
};

/**
 * @description 创建用户信息
 */
export const createUser = async (
    data: Pick<User, "userId" | "nickName" | "avatar" | "ip" | "permission">
) => {
    return User.create(data);
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
