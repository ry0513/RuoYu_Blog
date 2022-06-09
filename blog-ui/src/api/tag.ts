import instance from "@/utils/request";

// 标签相关

// 创建
export function createTag(data: { content: string; reason: string }) {
    return instance({
        url: "/tag",
        method: "post",
        data,
    });
}

// 列表（分页）
export function getTagList(params?: {
    status: Status;
    content: string;
    current: number;
    pageSize: number;
}) {
    return instance({
        url: "/tag/list",
        params,
    });
}
