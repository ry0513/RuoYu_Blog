import { Router } from "express";

import RUOYU from "../../core/ruoyu";
import { getIp, getCity } from "../../core/tools";

import { createUserData } from "../../db/api/user";

const router = Router();

// 注册
router.post("/resister", async (req, res) => {
    const { nickName } = req.body;
    const { accountId: userId, avatar } = req.session.account;
    const registerIp = getIp(req);
    const registerPlace = await getCity(registerIp);
    await createUserData({ userId, nickName, avatar, registerIp, registerPlace });
    RUOYU.res.success(res);
});

export default router;
