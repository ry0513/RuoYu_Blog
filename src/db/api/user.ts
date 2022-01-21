import User from "../modles/User";

/**
 * @description 获取用户信息
 */
export const getUserData = ({ userId }: Pick<User, "userId">) => {
    return User.findOne({
        where: { userId },
    });
};

/**
 * @description 创建用户信息
 */
export const createUserData = ({ userId, nickName, avatar, registerIp }: Pick<User, "userId" | "nickName" | "avatar" | "registerIp" | "registerPlace">) => {
    return User.create({
        userId,
        nickName,
        avatar,
        registerIp,
    });
};
