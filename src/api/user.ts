import { Router } from "express";
import RUOYU from "../core/ruoyu";
import { createUser } from "../db/api/user";
import { toString } from "../core/tools";

const router = Router();

// 注册
router.post("/resister", async (req, res) => {
    const nickName = toString(req.body.nickName, { maxLength: 20 });
    if (nickName) {
        const { accountId: userId, avatar, status } = req.session.account;
        await createUser(req, userId, nickName, avatar, status);
        req.session.blog = { userId, nickName, avatar, status, articlePass: {} };
        RUOYU.res.success(res);
        return;
    }
    RUOYU.res.parameter(res);
});

export default router;
