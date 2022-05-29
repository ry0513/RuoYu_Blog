import { defineStore } from "pinia";

import debounce from "lodash/debounce";
import { store } from "@/store";

export const useSettingStore = defineStore("settings", {
    state: () => ({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
    }),
    getters: {
        getWinWidth: (state) => {
            return state.winWidth;
        },
        getWinHeight: (state) => {
            return state.winHeight;
        },
    },
    actions: {
        winChange(): void {
            window.onresize = debounce(() => {
                this.winWidth = window.innerWidth;
                this.winHeight = window.innerHeight;
            }, 200);
        },
    },
});

export function getSettingStore() {
    return useSettingStore(store);
}
