import { MessagePlugin } from "tdesign-vue-next";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { ACCTOUNT_URL } from "@/config/global"; // progress bar style
import { getPath } from "@/utils/route";

import { getUserStore } from "@/store";
import router from "@/router";
import { storeToRefs } from "pinia";

// const permissionStore = getPermissionStore();
const userStore = getUserStore();
// console.log(userStore);
const { getRoute, getAccount } = storeToRefs(userStore);

NProgress.configure({ showSpinner: false });

// const { whiteListRouters } = permissionStore;
// 定义标识，记录路由是否注册
let registerRoute = false;

router.beforeEach(async (to, from, next) => {
    if (!registerRoute) {
        await userStore.getUserInfo();
        getRoute.value.forEach((val) => {
            router.addRoute(val);
        });
        router.addRoute({
            path: "/:w+",
            name: "404",
            component: () => import(`@/pages/error/404.vue`),
        });
        registerRoute = true;
        next({ ...to, replace: true });
    } else if (getPath(to.path, 1) === "/control") {
        // console.log(window.location.href);
        const path = encodeURIComponent(
            `http://127.0.0.1:3000/#${to.fullPath}`
        );

        if (getAccount.value.accountId === 0) {
            window.location.href = `${ACCTOUNT_URL}?path=${path}`;
        } else {
            next();
        }
    } else {
        next();
    }

    // const { token } = userStore;
    // if (token) {
    //     if (to.path === "/login") {
    //         userStore.logout();
    //         permissionStore.restore();
    //         next();
    //         return;
    //     }

    //     const { roles } = userStore;

    //     if (roles && roles.length > 0) {
    //         next();
    //     } else {
    //         try {
    //             await userStore.getUserInfo();

    //             const { roles } = userStore;

    //             await permissionStore.initRoutes(roles);

    //             if (router.hasRoute(to.name)) {
    //                 next();
    //             } else {
    //                 next(`/`);
    //             }
    //         } catch (error) {
    //             MessagePlugin.error(error);
    //             next(`/login?redirect=${to.path}`);
    //             NProgress.done();
    //         }
    //     }
    // } else {
    //     /* white list router */
    //     if (whiteListRouters.indexOf(to.path) !== -1) {
    //         next();
    //     } else {
    //         next(`/login?redirect=${to.path}`);
    //     }
    //     NProgress.done();
    // }
});

router.afterEach(() => {
    NProgress.done();
});
