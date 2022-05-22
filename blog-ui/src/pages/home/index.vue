<script setup lang="ts">
import { ref } from 'vue'
import { getPath } from '@/utils/route';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
const store = useUserStore();
const { route, account } = storeToRefs(store);
const menu: RouteRecordRaw[] = route.value
const a: { nickName?: string } = account.value

defineProps<{ msg: string }>()


const count = ref(0)
</script>

<template>
  <p>{{ msg }}</p>
  <p>{{ route[0]?.children?.[0] }}</p>
  <p>{{ account }}</p>

  <router-link to="/control">control</router-link>
  <router-link to="/control?sss=444">control</router-link>
  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

