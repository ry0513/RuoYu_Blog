import { Router } from "express";
import RUOYU from "../config/ruoyu";
import { body, query, validationResult } from "express-validator";

const router = Router();

// 获取全部
router.get("/list/all", async (req, res) => {
    // const data = await getSortListAll();
    RUOYU.resSuccess(res);
});

// 新增
router.post(
    "/",
    body("status").isIn([0, 1]),
    body("title").isString().isLength({ min: 5, max: 50 }),
    body("html").isString(),
    body("content").isString(),
    // body("sortId").isIn([0, 1]), // 判断状态后继续

    // .if((value: any, { req }: any) => {
    //     console.log(value);

    //     return req.body.b;
    // })
    // .isInt(),
    async (req, res) => {
        // const data = await getSortListAll();

        console.log(req.body);
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }

        RUOYU.resSuccess(res);
    }
);

export default router;
