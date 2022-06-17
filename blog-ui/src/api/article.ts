import instance from "@/utils/request";

// 文章相关

// 创建
export function createArticle(data: {
    status: number;
    title: string;
    html: string;
    content: string;
    sortId?: string;
    tags?: number[];
    passwd?: string;
}) {
    return instance({
        url: "/article",
        method: "post",
        data,
    });
}

// // 列表（分页）
// export function getTagList(params?: {
//     status: Status;
//     content: string;
//     current: number;
//     pageSize: number;
// }) {
//     return instance({
//         url: "/tag/list",
//         params,
//     });
// }

// // 列表（全部，简略属性）
// export function getSortListAll() {
//     return instance({
//         url: "/sort/list/all",
//     });
// }
