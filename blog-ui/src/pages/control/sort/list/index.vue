<template>
    <t-card :bordered="false" class="ry-card">
        <!-- <div class="ry-card-filter">
            <div class="ry-card-filter_options">
                <span class="label">标签状态:</span>
                <t-select
                    v-model="filter.status"
                    :options="TAG_STATUS_OPTIONS"
                    clearable
                    placeholder="请选择标签状态"
                    @change="getTagListData(true)"
                />
            </div>
            <div class="ry-card-filter_options">
                <span class="label">标签名称:</span>
                <t-input
                    v-model="filter.content"
                    clearable
                    placeholder="请选择标签名称"
                    @change="getTagListData(true)"
                />
            </div>
            <div class="ry-card-filter_right">
                <t-button
                    theme="primary"
                    type="submit"
                    @click="createTagShow = true"
                    >新建</t-button
                >
            </div>
        </div> -->

        <t-table :data="tableData.rows" :columns="TABLE_COLUMNS" row-key="sortId" bordered :loading="tableData.loading !== 0">
            <template #count="{ row }">
                {{ row.articles.length }}
            </template>
            <template #user="{ row }">
                {{ row.user.nickName }}
            </template>
            <template #createdAt="{ row }">
                {{ toDate(row.createdAt) }}
            </template>
        </t-table>
    </t-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { TAG_STATUS_OPTIONS, getOptionsLabel } from "@/options/index";
import { toDate } from "@/utils/date";
import { getSortListAll } from "@/api/sort";

// // 筛选条件
// const filter = reactive({
//     status: "",
//     content: "",
// });

// 表格数据
const tableData = reactive({
    loading: 0,
    rows: [],
});

// 表格参数
const TABLE_COLUMNS = [
    { title: "ID", width: "80", align: "center", colKey: "sortId" },
    { title: "分类", width: "150", align: "center", colKey: "content" },
    {
        title: "文章数量",
        width: "110",
        align: "center",
        colKey: "count",
        cell: { col: "count" },
    },
    {
        title: "创建者",
        width: "150",
        align: "center",
        colKey: "user",
        cell: { col: "user" },
    },
    {
        title: "创建时间",
        width: "200",
        align: "center",
        colKey: "createdAt",
        cell: { col: "createdAt" },
    },
];

// 请求表格数据
const getSortListData = (first = false) => {
    tableData.loading++;
    getSortListAll().then(({ data }) => {
        tableData.rows = data.data;
        tableData.loading--;
    });
};

// 加载后调用
onMounted(() => {
    getSortListData();
});
</script>
