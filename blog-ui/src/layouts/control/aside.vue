<template>
    <t-aside>
        <t-menu :default-value="active" :expanded="expanded">
            <MenuContent :menu="menu"></MenuContent>
        </t-menu>
    </t-aside>

</template>

<script setup  lang="ts">
import MenuContent from '@/layouts/components/MenuContent.vue';
import { RouteRecordRaw, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
import { getPath } from '@/utils/route';
import { computed } from 'vue';

const store = useUserStore();
const { route } = storeToRefs(store);

const active = computed(() => {
    return getPath(useRoute().path, 10)
})

const menu: RouteRecordRaw[] = route.value[0].children || []
const expanded = [getPath(useRoute().path, 2)]


</script>

