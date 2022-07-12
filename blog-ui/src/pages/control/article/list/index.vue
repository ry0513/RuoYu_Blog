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
                <t-input v-model="filter.content" clearable placeholder="请输入文章名称" @change="getArticleListData(true)" />
            </div>
            <div class="ry-card-filter_right">
                <t-button theme="primary" type="submit">新增</t-button>
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
                    <t-tag theme="primary" class="tags" variant="light" v-for="(item, index) in row.tags" :key="index">
                        {{ item.content }}
                    </t-tag>
                </template>
                <template #password="{ row }">
                    {{ row.password || "无需密码" }}
                </template>
                <template #releaseAt="{ row }">
                    {{ row.releaseAt || "未发布过" }}
                </template>
                <template #op="slotProps">
                    <t-button variant="text" theme="success" @click="go(`/control/article/edit`)"> 编辑 </t-button>

                    <!-- <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a> -->
                </template>
            </t-table>
            <!-- <t-dialog
        v-model:visible="confirmVisible"
        header="确认删除当前所选合同？"
        :body="confirmBody"
        :on-cancel="onCancel"
        @confirm="onConfirmDelete"
      /> -->
        </div>
    </t-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ARTICLE_STATUS_OPTIONS, getOptionsLabel } from "@/options/index";
import { getSortListAll } from "@/api/sort";
import debounce from "lodash/debounce";
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
    { title: "ID", width: "100", align: "center", colKey: "articleId" },
    { title: "分类", width: "100", colKey: "sort" },
    { title: "标题", Width: "150", colKey: "title" },
    { title: "状态", width: "100", colKey: "status", cell: { col: "status" } },
    { title: "标签", width: "200", colKey: "tags", cell: { col: "tags" } },
    {
        title: "密码",
        width: "150",
        colKey: "password",
        cell: { col: "password" },
    },
    { title: "发布时间", width: "200", colKey: "releaseAt", cell: { col: "releaseAt" } },
    { align: "left", width: "200", colKey: "op", title: "操作" },
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
const getArticleListData = debounce((first = false) => {
    if (first) {
        tableData.pagination.current = 1;
    }
    tableData.loading++;
    const { current, pageSize } = tableData.pagination;
    getArticleList({ ...filter, current, pageSize }).then(({ data }) => {
        console.log(data);
        tableData.rows = data.rows;
        tableData.loading--;
        tableData.pagination.total = data.count;
    });
}, 500);

// 分类选项
let sortOptions: { sortId: number; content: string }[] = reactive([]);

// 请求分类数据
getSortListAll().then(({ data }) => {
    sortOptions.push(...data);
});

// 加载后
onMounted(() => {
    getArticleListData();
});

// 跳转
const go = (path: string) => {
    console.log(path);
    router.replace(path);
};
</script>
<style lang="scss" scoped>
.form-item-content {
    width: 200px;
}

.tags {
    margin-right: 10px;
}
</style>
