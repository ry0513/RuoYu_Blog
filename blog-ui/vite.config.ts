import { ConfigEnv, UserConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import createVuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";

export default ({ mode }: ConfigEnv): UserConfig => {
    return {
        // 构建特定配置
        resolve: {
            alias: {
                "@": resolve(__dirname, "./src"),
            },
        },
        plugins: [
            createVuePlugin(),
            vueJsx(),
            viteCompression(),
            AutoImport({
                resolvers: [
                    TDesignResolver({
                        library: "vue-next",
                    }),
                ],
            }),
            Components({
                resolvers: [
                    TDesignResolver({
                        library: "vue-next",
                    }),
                ],
            }),
        ],
        server: {
            port: 3000,
            host: "0.0.0.0",
            proxy: {
                "/api": "http://127.0.0.1:3005/",
            },
        },
    };
};
