<template>
    <t-form>
        <!-- <t-form-item label="姓名" name="name" initialData="TDesign">
            <t-input placeholder="请输入内容" />
        </t-form-item> -->
        <!-- <t-form-item label="手机号码" name="tel" initialData="123456">
            <t-input placeholder="请输入内容" />
        </t-form-item> -->
        <t-form-item
            label="卡片样式"
            name="course"
            initialData="['1']"
            class="column"
        >
            <t-select v-model="article.type" placeholder="请选择卡片样式">
                <t-option value="1" label="单图"></t-option>
                <t-option value="2" label="两图"></t-option>
                <t-option value="3" label="三图"></t-option>
            </t-select>
            <div>444</div>
        </t-form-item>
        <t-form-item label="标签" name="course" initialData="['1']">
            <t-select
                v-model="article.tags"
                multiple
                filterable
                :max="3"
                placeholder="请选择标签"
                :options="options"
                @focus="handleFocus"
                :loading="loading"
            />
        </t-form-item>
    </t-form>
    <div @click="t">console</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const article = ref({
    type: "",
    tags: [],
    html: "",
});
const options = ref([
    { label: "选项一", value: "1" },
    { label: "选项二", value: "2" },
    { label: "选项三", value: "3" },
]);
const loading = ref(false);

//*********************************************** */
const t = () => {
    console.log(article.value);
};
const filterMethod = (search: string, option: { label: string }) => {
    return option.label.indexOf(search) !== -1;
};
const handleFocus = ({ value, e }: any) => {
    console.log("handleFocus: ", value, e);
};
const remoteMethod = (search: string) => {
    console.log("search", search);
    // if (search) {
    //     loading.value = true;
    //     setTimeout(() => {
    //         loading.value = false;
    //         options.value = [
    //             {
    //                 value: `${search}_test1`,
    //                 label: `${search}_test1`,
    //             },
    //             {
    //                 value: `${search}_test2`,
    //                 label: `${search}_test2`,
    //             },
    //             {
    //                 value: `${search}_test3`,
    //                 label: `${search}_test3`,
    //             },
    //         ];
    //     }, 500);
    // }
};
</script>

<style lang="scss" scoped>
.column {
    & :deep(.t-form__controls-content) {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
