import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import controlRouter from "./modules/control";

export const asyncRouterList: Array<RouteRecordRaw> = [...controlRouter];

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "indexPage",
        component: () => import("@/pages/home/index.vue"),
    },

    {
        path: "/login",
        name: "login",
        component: () => import("@/pages/login/index.vue"),
    },
];

export const allRoutes = [...defaultRouterList];

const router = createRouter({
    history: createWebHashHistory(),
    routes: allRoutes,
    scrollBehavior() {
        return {
            el: "#app",
            top: 0,
            behavior: "smooth",
        };
    },
});

export default router;
