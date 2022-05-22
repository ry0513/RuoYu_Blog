import { RouteRecordRaw } from "vue-router";

const a: Array<RouteRecordRaw> = [
    {
        path: "/control",
        name: "control",
        component: () => import("@/layouts/control/index.vue"),
        redirect: "/control/home",
        meta: { title: "首页", icon: "" },
        children: [
            {
                path: "home",
                name: "controlHome",
                component: () => import("@/pages/control/home/index.vue"),
                meta: { title: "首页", icon: "" },
            },
            {
                path: "test1",
                name: "test1",
                component: () => import("@/pages/control/test1/index.vue"),
                meta: { title: "test 1", icon: "" },
            },
            {
                path: "http://www.bilibili.com",
                name: "blbl",
                redirect: "http://www.bilibili.com",
                meta: { title: "BL外联", icon: "" },
            },

            {
                path: "test",
                name: "controlTest",
                component: () => import("@/layouts/blank.vue"),
                // component: () => import("@/pages/control/home/index.vue"),
                meta: { title: "合集", icon: "" },
                children: [
                    {
                        path: "home",
                        name: "controlTestHome",
                        redirect: "http://www.bilibili.com",
                        component: () =>
                            import("@/pages/control/test/index.vue"),
                        meta: { title: "合集A", icon: "" },
                    },
                    {
                        path: "http://www.baidu.com",
                        redirect: "http://www.bilibili.com",
                        name: "baidu",
                        meta: { title: "百度外联", icon: "" },
                    },
                ],
            },
        ],
    },
];
export default a;
