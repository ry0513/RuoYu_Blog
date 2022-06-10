<template>
    <t-form>
        <!-- <t-form-item label="姓名" name="name" initialData="TDesign">
            <t-input placeholder="请输入内容" />
        </t-form-item> -->
        <!-- <t-form-item label="手机号码" name="tel" initialData="123456">
            <t-input placeholder="请输入内容" />
        </t-form-item> -->
        <t-form-item label="卡片样式" name="type" class="column">
            <t-select v-model="article.type" placeholder="请选择卡片样式">
                <t-option value="0" label="无图"></t-option>
                <t-option value="1" label="单图" disabled></t-option>
                <t-option value="2" label="两图" disabled></t-option>
                <t-option value="3" label="三图" disabled></t-option>
            </t-select>
        </t-form-item>
        <t-form-item label="标签" name="tags">
            <t-select
                v-model="article.tags"
                multiple
                filterable
                :max="3"
                placeholder="请输入关键字"
            >
                <t-option
                    v-for="item in tagOptions"
                    :key="item.tagId"
                    :value="item.tagId"
                    :label="item.content"
                >
                    <div>
                        {{ item.content
                        }}{{ item.status === 0 ? "（审核中）" : "" }}
                    </div>
                </t-option>
            </t-select>
        </t-form-item>
        <t-form-item label="分类" name="sort">
            <t-select v-model="article.sort" :max="3" placeholder="请选择标签">
                <t-option
                    v-for="item in sortOptions"
                    :key="item.sortId"
                    :value="item.sortId"
                    :label="item.content"
                />
            </t-select>
        </t-form-item>
    </t-form>
    <div @click="t">console</div>
</template>

<script setup lang="ts">
import { getSortListAll } from "@/api/sort";
import { getTagListAll } from "@/api/tag";
import { reactive } from "vue";

// 文章属性
const article = reactive({
    type: "",
    tags: [],
    html: "",
    sort: "",
});

// 标签选项
let tagOptions: { tagId: number; content: string; status: number }[] = reactive(
    []
);

// 分类选项
let sortOptions: { sortId: number; content: string }[] = reactive([]);

// 获取标签数据
getTagListAll().then(({ data }) => {
    tagOptions.push(...data);
});

// 获取分类数据
getSortListAll().then(({ data }) => {
    sortOptions.push(...data);
});

//*********************************************** */
const t = () => {
    console.log(article);
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
