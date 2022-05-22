import { Router } from "express";
import RUOYU from "../config/ruoyu";
import { createUser, getUser } from "../db/api/user";
import { body, validationResult } from "express-validator";

const router = Router();

router.get("/userInfo", async ({ session: { account } }, res) => {
    if (account) {
        const user = await getUser({ userId: account.accountId });
        if (!user) {
            await createUser({ userId: account.accountId });
        }

        const route = [
            {
                path: "/control",
                name: "control",
                component: "layouts/control/index",
                redirect: "/control/home",
                meta: {
                    title: "首页",
                    icon: "",
                },
                children: [
                    {
                        path: "home",
                        name: "controlHome",
                        component: "pages/control/home/index",
                        meta: {
                            title: "首页",
                            icon: "",
                        },
                    },
                    {
                        path: "test1",
                        name: "test1",
                        component: "pages/control/test1/index",
                        meta: {
                            title: "test 1",
                            icon: "",
                        },
                    },
                    {
                        path: "article",
                        name: "controlArticle",
                        component: "layouts/blank",
                        redirect: "/control/article/home",
                        meta: {
                            title: "文章管理",
                            icon: "",
                        },
                        children: [
                            {
                                path: "home",
                                name: "controlArticleList",
                                component: "pages/control/article/list/index",
                                meta: {
                                    title: "文字列表",
                                    icon: "",
                                },
                            },
                            {
                                path: "edit",
                                name: "controlArticleEdit",
                                component: "pages/control/article/edit/index",
                                meta: {
                                    title: "新增文章",
                                    icon: "",
                                    // full: true,
                                },
                            },
                        ],
                    },

                    {
                        path: "test",
                        name: "controlTest",
                        component: "layouts/blank",
                        meta: {
                            title: "合集 a  ",
                            icon: "",
                        },
                        children: [
                            {
                                path: "home",
                                name: "controlTestHome",
                                component: "pages/control/test/index",
                                meta: {
                                    title: "合集A-a",
                                    icon: "",
                                },
                            },
                            {
                                path: "http://www.baidu.com",
                                redirect: "http://www.bilibili.com",
                                name: "baidu",
                                meta: { title: "百度外联", icon: "" },
                            },
                        ],
                    },
                    {
                        path: "test2",
                        name: "controlTest2",
                        component: "layouts/blank",
                        // component: () => import("@/pages/control/home/index.vue"),
                        meta: {
                            title: "合集 a 2 ",
                            icon: "",
                            component: "layouts/blank",
                        },
                        children: [
                            {
                                path: "home",
                                name: "controlTest2Home",
                                component: "pages/control/test/index",
                                meta: {
                                    title: "合集A-a 2",
                                    icon: "",
                                    component: "pages/control/test/index",
                                },
                            },
                            {
                                path: "http://www.baidu.com",
                                redirect: "http://www.bilibili.com",
                                name: "baidu2",
                                meta: { title: "百度外联2", icon: "" },
                            },
                        ],
                    },
                ],
            },
        ];

        RUOYU.resSuccess(res, { account, route: route });
    } else {
        RUOYU.resSuccess(res, { account: { accountId: 0 }, route: [] });
    }
});

// // 注册
// router.get(
//     "/resister",
//     // body("nickName").isEmail(),
//     // body("password").isLength({ min: 5 }),
//     async (req, res) => {
//         console.log(req.body);
//         console.log(req.query);

//         // const errors = validationResult(req);
//         // console.log(errors.isEmpty());

//         RUOYU.resSuccess(res);
//         // const nickName = toString(req.body.nickName, { maxLength: 20 });
//         // if (nickName) {
//         //     const { accountId: userId, avatar, status } = req.session.account;
//         //     await createUser(req, userId, nickName, avatar, status);
//         //     req.session.blog = {
//         //         userId,
//         //         nickName,
//         //         avatar,
//         //         status,
//         //         articlePass: {},
//         //     };
//         //     RUOYU.resSuccess(res);
//         //     return;
//         // }
//         // RUOYU.resParameter(res);
//     }
// );

export default router;
