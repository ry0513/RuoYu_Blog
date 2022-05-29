<template>
    <router-view />
</template>

<script setup lang="ts">
import { getSettingStore } from "@/store";

// 监听窗口改变
getSettingStore().winChange();
</script>

<style></style>
