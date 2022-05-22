import { defineStore } from "pinia";
import { TOKEN_NAME } from "@/config/global";
import { store } from "@/store";
import formatRoute from "@/utils/route";

import { getappPackage, getUserInfo } from "@/api/user";
import { RouteRecordRaw } from "vue-router";

// import router from "@/router";
interface Account {
    accountId?: number;
    avatar?: string;
    email?: string;
    nickName?: string;
}

const account: Account = {};
const route: RouteRecordRaw[] = [];

export const useUserStore = defineStore("user", {
    state: () => ({
        token: localStorage.getItem(TOKEN_NAME), // 默认token不走权限
        account,
        route,
    }),
    getters: {
        getAccount: (state) => {
            return state.account;
        },
        getRoute: (state) => {
            return state.route;
        },
    },
    actions: {
        async login(userInfo: Record<string, unknown>) {
            return new Promise((resolve, reject) => {
                getappPackage()
                    .then((res) => {
                        console.log(res);
                        resolve(0);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },
        async getUserInfo(): Promise<{
            route: RouteRecordRaw[];
            account: Account;
        }> {
            return new Promise((resolve, reject) => {
                getUserInfo().then(({ data: { account, route } }) => {
                    this.account = account;
                    this.route = formatRoute(route);
                    resolve({ route: formatRoute(route), account });
                });
            });
        },
    },
});

export function getUserStore() {
    return useUserStore(store);
}
