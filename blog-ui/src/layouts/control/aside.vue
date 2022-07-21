<template>
    <t-aside>
        <t-menu :value="active" :default-expanded="expanded">
            <MenuContent :menu="menu"></MenuContent>
        </t-menu>
    </t-aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouteRecordRaw, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store";
import MenuContent from "@/layouts/components/MenuContent.vue";
import { getPath } from "@/utils/route";

const store = useUserStore();
const { route } = storeToRefs(store);

// 定义 菜单列表
const menu: RouteRecordRaw[] = route.value[0].children || [];
// 定义 展开列表
const expanded = [getPath(useRoute().path, 2)];

// 计算属性 当前激活的菜单
const active = computed(() => {
    return getPath(useRoute().path, 10);
});
</script>
