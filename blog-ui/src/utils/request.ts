import axios from "axios";
import qs from "qs";
import { DialogPlugin, NotifyPlugin } from "tdesign-vue-next";

import { ACCTOUNT_URL } from "@/config/global";

import proxy from "@/config/proxy";

const env = import.meta.env.MODE || "development";

const host = env === "mock" ? "/" : proxy[env].host; // 如果是mock模式 就不配置host 会走本地Mock拦截

const instance = axios.create({
    baseURL: host,
    timeout: 5000,
    withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
    config.data = config.data && qs.stringify(config.data);

    await (() => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    })();
    return config;
});

instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        if (data.code === 0) {
            return data;
        } else if (data.code === -2 && data.data.hint !== false) {
            const confirmDia = DialogPlugin.confirm({
                header: "提示",
                body: data.msg,
                confirmBtn: "重新登录",
                onConfirm: async () => {
                    window.location.href = `${ACCTOUNT_URL}?path=${encodeURIComponent(
                        window.location.href
                    )}`;
                },
                onClose: () => {
                    confirmDia.hide && confirmDia.hide();
                },
            });
        } else if ([-3, -4].includes(data.code)) {
            NotifyPlugin.error({
                title: data.data.title || "操作失败",
                content: data.data.text || data.msg,
                closeBtn: true,
            });
        }

        return Promise.reject(new Error(data.msg));
    },
    async (err) => {
        const { config } = err;

        if (!config || !config.retry) return Promise.reject(err);

        config.retryCount = config.retryCount || 0;

        if (config.retryCount >= config.retry) {
            return Promise.reject(err);
        }

        config.retryCount += 1;

        const backoff = new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, config.retryDelay || 1);
        });

        await backoff;
        return await instance(config);
    }
);

export default instance;
