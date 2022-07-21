<template>
    <t-card :bordered="false" class="ry-card">
        <div class="ry-card-filter">
            <div class="ry-card-filter_options">
                <span class="label">文章状态:</span>
                <t-select v-model="filter.status" :options="ARTICLE_STATUS_OPTIONS" clearable placeholder="请选择文章状态" @change="getArticleListData(true)" />
            </div>
            <div class="ry-card-filter_options">
                <span class="label">文章分类:</span>
                <t-select v-model="filter.sortId" :options="sortOptions" clearable placeholder="请选择文章分类" :keys="{ value: 'sortId', label: 'content' }" @change="getArticleListData(true)" />
            </div>
            <div class="ry-card-filter_options">
                <span class="label">文章名称:</span>
                <t-input v-model="filter.content" clearable placeholder="请输入文章名称" @enter="getArticleListData(true)" />
            </div>
        </div>

        <div class="table-container">
            <t-table :data="tableData.rows" :columns="TABLE_COLUMNS" row-key="articleId" bordered :loading="tableData.loading !== 0" :pagination="tableData.pagination" @page-change="onPageChange">
                <template #sort="{ row }">
                    {{ row.sort?.content || "未分类" }}
                </template>
                <template #status="{ row }">
                    {{ getOptionsLabel(ARTICLE_STATUS_OPTIONS, row.status) }}
                </template>
                <template #tags="{ row }">
                    <t-space break-line size="small">
                        <t-tag theme="primary" class="tags" variant="light" v-for="(item, index) in row.tags" :key="index">
                            {{ item.content }}
                        </t-tag>
                    </t-space>
                </template>
                <template #password="{ row }">
                    {{ row.password || "-" }}
                </template>
                <template #releaseAt="{ row }">
                    {{ row.releaseAt || "-" }}
                </template>
                <template #op="{ row }">
                    <t-space break-line size="small">
                        <t-button @click="go(`/control/article/edit?articleId=${row.articleId}`)" shape="square" variant="text">
                            <template #icon>
                                <t-icon name="edit-1" />
                            </template>
                        </t-button>
                    </t-space>
                </template>
            </t-table>
        </div>
    </t-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ARTICLE_STATUS_OPTIONS, getOptionsLabel } from "@/options/index";
import { getSortListAll } from "@/api/sort";
import pagination from "@/utils/pagination";
import { getArticleList } from "@/api/article";
import router from "@/router";

// 筛选条件
const filter = reactive({
    status: "",
    content: "",
    sortId: null,
});

// 表格参数
const TABLE_COLUMNS = [
    { title: "ID", align: "center", width: "100", colKey: "articleId" },
    { title: "分类", align: "center", width: "100", colKey: "sort" },
    { title: "标题", align: "center", width: "200", colKey: "title" },
    { title: "状态", align: "center", width: "100", colKey: "status", cell: { col: "status" } },
    { title: "标签", align: "center", width: "200", colKey: "tags", cell: { col: "tags" } },
    {
        title: "密码",
        align: "center",
        width: "150",
        colKey: "password",
        cell: { col: "password" },
    },
    { title: "发布时间", align: "center", width: "200", colKey: "releaseAt", cell: { col: "releaseAt" } },
    { align: "center", width: "100", colKey: "op", title: "操作" },
];

// 表格数据
const tableData = reactive({
    loading: 0,
    rows: [],
    pagination,
});
// 表格页数变化
const onPageChange = (pageInfo: pageChangeInfo) => {
    tableData.pagination.current = pageInfo.current;
    getArticleListData();
};
// 请求表格数据
const getArticleListData = (first = false) => {
    if (first) {
        tableData.pagination.current = 1;
    }
    tableData.loading++;
    const { current, pageSize } = tableData.pagination;
    getArticleList({ ...filter, current, pageSize }).then(({ data }) => {
        console.log(data);
        console.log(45445);
        tableData.rows = data.rows;
        tableData.loading--;
        tableData.pagination.total = data.count;
    });
};
getArticleListData();
// 分类选项
let sortOptions: { sortId: number; content: string }[] = reactive([]);

// 请求分类数据
getSortListAll().then(({ data }) => {
    sortOptions.push(...data.data);
});

// 跳转
const go = (path: string) => {
    router.push(path);
};
</script>
<style lang="scss" scoped></style>
