<template>
    <t-breadcrumb class="breadcrumb">
        <template #default>
            <t-breadcrumbItem
                v-for="item in routeList"
                :key="item.name"
                :to="item.path"
            >
                {{ item.meta.title }}
            </t-breadcrumbItem>
        </template>
        <template #separator>
            <span class="separator">/</span>
        </template>
    </t-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const routeList = computed(() => {
    return useRoute().matched;
});
</script>
<style lang="scss" scoped>
.separator {
    padding: 0 5px;
}

.breadcrumb {
    margin-bottom: 20px;
}
</style>
