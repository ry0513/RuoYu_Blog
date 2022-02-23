import { Request, Response } from "express";
import { getUser } from "../db/api/user";
import RUOYU from "./ruoyu";
import { getUrl } from "./tools";
export const needLogin = async (minStatus: number, req: Request, res: Response, trueCallBack?: () => void, falseCallBack?: () => void): Promise<boolean> => {
    if (req.session.account) {
        const account = req.session.account;
        if (!req.session.blog) {
            const user = await getUser(account.accountId);
            if (!user) {
                res.locals = {
                    page: "console/register",
                    account,
                    jsList: ["js/console/register"],
                    cssList: ["css/console/register"],
                };
                res.render("layout/default");
                return false;
            }
            const { userId, nickName, avatar, status } = user;
            req.session.blog = { userId, nickName, avatar, status, articlePass: {} };
        }
        if (req.session.blog.status >= minStatus) {
            trueCallBack && trueCallBack();
            return true;
        }
        res.locals = {
            minStatus,
            status: req.session.blog.status,
        };
        res.render("error/403");
        return false;
    } else {
        falseCallBack ? falseCallBack() : res.redirect(`${RUOYU.accountUrl}/login?path=${getUrl(req)}`);
        return false;
    }
};

/**
 * @description 验证权限
 */
export const needVerify = async (permission: number, req: Request, res: Response, trueCallBack?: () => void, falseCallBack?: () => void) => {
    if (!req.session.blog) {
        falseCallBack ? falseCallBack() : RUOYU.res.needLogin(res);
        return false;
    }
    if (req.session.blog.status >= permission) {
        trueCallBack && trueCallBack();
        return true;
    } else {
        falseCallBack ? falseCallBack() : RUOYU.res.permission(res);
        return false;
    }
};
