import "express-session";
declare module "express-session" {
    interface Session {
        /**
         * @description 账号信息
         */
        account: {
            /**
             * @description 账号ID
             * @type {number}
             */
            accountId: number;

            /**
             * @description 账号登录名
             * @type {string}
             */
            accountName: string;

            /**
             * @description 账号昵称
             * @type {number}
             */
            nickName: number;

            /**
             * @description 账号邮箱
             * @type {string}
             */
            email: string;

            /**
             * @description 账号手机号码
             * @type {string}
             */
            phone: number;

            /**
             * @description 账号头像
             * @type {string}
             */
            avatar: string;

            /**
             * @description 注册ip
             * @type {string}
             */
            registerIp: string;

            /**
             * @description 创建时间
             * @type {string}
             */
            createdAt?: Date;

            /**
             * @description 最后更新时间
             * @type {Date}
             */
            updatedAt?: Date;
        };

        /**
         * @description 用户信息
         */
        userData: {
            /**
             * @description 用户id
             * @type {number}
             */
            userId: number;

            /**
             * @description 用户昵称
             * @type {string}
             */
            nickName: string;

            /**
             * @description 头像地址
             * @type {string}
             */
            avatar: string;

            /**
             * @description 注册ip
             * @type {string}
             */
            registerIp: string;

            /**
             * @description 用户积分
             * @type {number}
             */
            userIntegral: number;

            /**
             * @description 用户状态
             * @type {number}
             */
            userStatus: number;

            /**
             * @description 创建时间
             * @type {string}
             */
            createdAt?: Date;

            /**
             * @description 最后更新时间
             * @type {Date}
             */
            updatedAt?: Date;
        };
    }
}
