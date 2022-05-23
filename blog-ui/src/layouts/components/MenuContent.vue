<template>
    <template v-for="item in formatMenu(menu, path)" :key="item.path">
        <template v-if="item.children.length === 0">
            <t-menu-item v-if="!item.href" :value="item.path" :to="item.path">
                <template #icon>
                    <t-icon :name="item.meta?.icon" />
                </template>
                {{ item.meta?.title }}
            </t-menu-item>
            <t-menu-item v-else :value="item.path" :href="item.path">
                <template #icon>
                    <t-icon :name="item.meta?.icon" />
                </template>
                {{ item.meta?.title }}
            </t-menu-item>
        </template>
        <template v-else>
            <t-submenu :value="item.path" :title="item.meta?.title">
                <template #icon>
                    <t-icon :name="item.meta?.icon" />
                </template>
                <MenuContent :menu="item.children" :path="item.path"></MenuContent>
            </t-submenu>
        </template>
    </template>
</template>
<script setup lang="ts">
import { defineComponent, PropType } from 'vue';
import { RouteRecordRaw } from 'vue-router';

defineComponent({
    name: 'MenuContent',
});
defineProps({
    menu: {
        type: Array as PropType<RouteRecordRaw[]>,
        required: true
    },
    path: {
        type: String,
        default: '/control'
    },
});

const formatMenu = (list: RouteRecordRaw[], basePath: string = "/control") => {
    if (!list) {
        return [];
    }
    const s = list
        .map((item) => {
            let path = basePath ? `${basePath}/${item.path}` : item.path;
            const href = path.match(/(http|https):\/\/([\w.]+\/?)\S*/);
            if (href) {
                path = href?.[0]
            }
            return {
                href,
                path,
                name: item.name,
                title: item.meta?.title,
                icon: item.meta?.icon || "",
                children: item.children || [],
                meta: item.meta,
            };
        })
        .filter((item) => item.meta && item.meta.hidden !== true);
    return s
}




// const menu = props.menu
</script>