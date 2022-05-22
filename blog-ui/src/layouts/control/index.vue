<template>
    <t-layout v-if="$route.meta.full !== true">
        <Header />
        <t-layout>
            <Aside class="control-height" style="flex:0 0 auto" />
            <t-content class="control-height control-main">
                <Breadcrumb />
                <router-view />
            </t-content>
        </t-layout>
    </t-layout>
    <router-view v-else />
</template>
<script setup lang="ts">
import Header from './header.vue';
import Aside from './aside.vue';
import Breadcrumb from '../components/Breadcrumb.vue';

</script>

<style lang="scss" scoped>
.control-height {
    height: calc(100vh - 64px) !important;
    overflow-y: auto;
}

.control-main {
    padding: 20px;
}
</style>