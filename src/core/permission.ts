import { Request, Response } from "express";
import { getUserData } from "../db/api/user";
import RUOYU from "./ruoyu";
import { getUrl } from "./tools";

/**
 * @description 检测登录
 */
export const needLogin = async (permission: number, req: Request, res: Response, trueCallBack?: Function, falseCallBack?: Function) => {
    if (req.session.account) {
        const account = req.session.account;
        const userData = await getUserData({ userId: account.accountId });

        if (userData) {
            req.session.userData = userData;
            if (userData.userStatus >= permission) {
                trueCallBack && trueCallBack();
                return true;
            } else {
                res.locals = {
                    page: "err/403",
                    permission,
                    userStatus: userData.userStatus,
                };
                res.render("layout/default");
                return false;
            }
        }
        res.locals = {
            page: "user/register",
            account,
            jsList: RUOYU.getJsList("user/register"),
        };
        res.render("layout/default");
        return false;
    } else {
        falseCallBack ? falseCallBack() : res.redirect(`${RUOYU.account}/login?path=${getUrl(req)}`);
        return false;
    }
};

/**
 * @description 验证权限
 */
export const needVerify = async (permission: number, req: Request, res: Response, trueCallBack?: Function, falseCallBack?: Function) => {
    if (!req.session.userData) {
        falseCallBack ? falseCallBack() : RUOYU.res.needLogin(res);
        return false;
    }
    if (req.session.userData.userStatus >= permission) {
        trueCallBack && trueCallBack();
        return true;
    } else {
        falseCallBack ? falseCallBack() : RUOYU.res.permission(res);
        return false;
    }
};
