<template>
    <div>
        <input type="text" name="" id="">
        <input type="text" name="" id="">
        <input type="button" value="tijiao" @click="onSubmit">
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
console.log(userStore);
const router = useRouter();
const onSubmit = async () => {
    await userStore.login({ account: 'ry', password: 'ry' });
    // MessagePlugin.success('登陆成功');
    // router.push({
    //     path: '/dashboard/base',
    // });
}

</script>