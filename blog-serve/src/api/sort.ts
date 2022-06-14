import { Router } from "express";
import RUOYU from "../config/ruoyu";
import { getSortListAll } from "../db/api/sort";

const router = Router();

// 获取全部
router.get("/list/all", async (req, res) => {
    const data = await getSortListAll();
    RUOYU.resSuccess(res, data);
});

export default router;
